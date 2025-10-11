#!/usr/bin/env python3
"""
UrbanEos AI Backend CRUD Testing Suite
Tests all Plant and Task CRUD operations with JWT authentication
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class UrbanEosBackendTester:
    def __init__(self):
        # Use the local backend URL since external URL returns 502
        self.base_url = "http://localhost:5000/api"
        self.token = None
        self.user_id = None
        self.test_plants = []
        self.test_tasks = []
        self.session = requests.Session()
        
        # Test data
        self.test_user = {
            "fullName": "Garden Tester",
            "email": f"tester_{int(time.time())}@urbaneos.com",
            "password": "testpass123",
            "location": {
                "city": "Dhaka",
                "division": "Dhaka",
                "district": "Dhaka",
                "area": "Gulshan"
            },
            "gardenType": "rooftop",
            "spaceSize": "medium",
            "experience": "intermediate",
            "plants": ["Tomato", "Mint"]
        }
        
        print(f"🧪 UrbanEos Backend Tester Initialized")
        print(f"🌐 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print("=" * 60)

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    headers: Optional[Dict] = None) -> requests.Response:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Add auth token if available
        if self.token:
            default_headers["Authorization"] = f"Bearer {self.token}"
            
        # Merge with custom headers
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            raise

    def test_health_check(self) -> bool:
        """Test if backend is running"""
        print("\n🏥 Testing Backend Health Check...")
        try:
            response = self.make_request("GET", "/health")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Backend is healthy: {data.get('message', 'OK')}")
                print(f"   Environment: {data.get('environment', 'unknown')}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    def test_user_registration(self) -> bool:
        """Test user registration"""
        print("\n👤 Testing User Registration...")
        try:
            response = self.make_request("POST", "/auth/register", self.test_user)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('data', {}).get('token'):
                    self.token = data['data']['token']
                    self.user_id = data['data']['user']['_id']
                    print(f"✅ User registered successfully")
                    print(f"   User ID: {self.user_id}")
                    print(f"   Token: {self.token[:20]}...")
                    return True
                else:
                    print(f"❌ Registration response missing token: {data}")
                    return False
            else:
                print(f"❌ Registration failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('message', 'Unknown error')}")
                except:
                    print(f"   Raw response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Registration error: {e}")
            return False

    def test_user_login(self) -> bool:
        """Test user login"""
        print("\n🔐 Testing User Login...")
        try:
            login_data = {
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
            
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('data', {}).get('token'):
                    self.token = data['data']['token']
                    print(f"✅ Login successful")
                    print(f"   New Token: {self.token[:20]}...")
                    return True
                else:
                    print(f"❌ Login response missing token: {data}")
                    return False
            else:
                print(f"❌ Login failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('message', 'Unknown error')}")
                except:
                    print(f"   Raw response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False

    def test_auth_protection(self) -> bool:
        """Test that protected routes require authentication"""
        print("\n🛡️ Testing Authentication Protection...")
        
        # Save current token
        original_token = self.token
        self.token = None
        
        try:
            # Try to access protected plant endpoint without token
            response = self.make_request("GET", "/plants")
            
            if response.status_code == 401:
                print("✅ Protected route correctly rejects unauthenticated requests")
                result = True
            else:
                print(f"❌ Protected route should return 401, got {response.status_code}")
                result = False
                
        except Exception as e:
            print(f"❌ Auth protection test error: {e}")
            result = False
        finally:
            # Restore token
            self.token = original_token
            
        return result

    def test_plant_crud_operations(self) -> bool:
        """Test all Plant CRUD operations"""
        print("\n🌱 Testing Plant CRUD Operations...")
        
        if not self.token:
            print("❌ No authentication token available")
            return False
            
        success_count = 0
        total_tests = 8
        
        # Test 1: Create plants
        print("\n  📝 Creating test plants...")
        plant_data_list = [
            {
                "name": "Cherry Tomato",
                "type": "Vegetable",
                "variety": "Cherry",
                "health": 95,
                "status": "healthy",
                "location": "Rooftop Garden",
                "expectedHarvestDate": (datetime.now() + timedelta(days=60)).isoformat()
            },
            {
                "name": "Basil Plant",
                "type": "Herb",
                "variety": "Sweet Basil",
                "health": 88,
                "status": "healthy",
                "location": "Kitchen Window"
            },
            {
                "name": "Rose Bush",
                "type": "Flower",
                "variety": "Red Rose",
                "health": 92,
                "status": "attention",
                "location": "Front Garden"
            }
        ]
        
        for i, plant_data in enumerate(plant_data_list):
            try:
                response = self.make_request("POST", "/plants", plant_data)
                if response.status_code == 201:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        plant_id = data['plant']['_id']
                        self.test_plants.append(plant_id)
                        print(f"    ✅ Plant {i+1} created: {plant_data['name']} (ID: {plant_id})")
                    else:
                        print(f"    ❌ Plant {i+1} creation response invalid: {data}")
                else:
                    print(f"    ❌ Plant {i+1} creation failed: {response.status_code}")
                    try:
                        error_data = response.json()
                        print(f"       Error: {error_data.get('message', 'Unknown')}")
                    except:
                        pass
            except Exception as e:
                print(f"    ❌ Plant {i+1} creation error: {e}")
        
        if len(self.test_plants) >= 2:
            success_count += 1
            print(f"  ✅ Plant creation test passed ({len(self.test_plants)} plants created)")
        else:
            print(f"  ❌ Plant creation test failed (only {len(self.test_plants)} plants created)")
        
        # Test 2: Get all plants
        print("\n  📋 Getting all plants...")
        try:
            response = self.make_request("GET", "/plants")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'plants' in data:
                    plant_count = len(data['plants'])
                    print(f"    ✅ Retrieved {plant_count} plants")
                    if plant_count >= len(self.test_plants):
                        success_count += 1
                    else:
                        print(f"    ❌ Expected at least {len(self.test_plants)} plants, got {plant_count}")
                else:
                    print(f"    ❌ Invalid response format: {data}")
            else:
                print(f"    ❌ Get plants failed: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Get plants error: {e}")
        
        # Test 3: Get single plant
        if self.test_plants:
            print("\n  🔍 Getting single plant...")
            try:
                plant_id = self.test_plants[0]
                response = self.make_request("GET", f"/plants/{plant_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        print(f"    ✅ Retrieved plant: {data['plant']['name']}")
                        success_count += 1
                    else:
                        print(f"    ❌ Invalid single plant response: {data}")
                else:
                    print(f"    ❌ Get single plant failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Get single plant error: {e}")
        
        # Test 4: Update plant
        if self.test_plants:
            print("\n  ✏️ Updating plant...")
            try:
                plant_id = self.test_plants[0]
                update_data = {
                    "health": 85,
                    "status": "attention",
                    "location": "Updated Location"
                }
                response = self.make_request("PUT", f"/plants/{plant_id}", update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        updated_plant = data['plant']
                        if (updated_plant['health'] == 85 and 
                            updated_plant['status'] == 'attention' and
                            updated_plant['location'] == 'Updated Location'):
                            print(f"    ✅ Plant updated successfully")
                            success_count += 1
                        else:
                            print(f"    ❌ Plant update values not reflected correctly")
                    else:
                        print(f"    ❌ Invalid update response: {data}")
                else:
                    print(f"    ❌ Plant update failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Plant update error: {e}")
        
        # Test 5: Add plant note
        if self.test_plants:
            print("\n  📝 Adding plant note...")
            try:
                plant_id = self.test_plants[0]
                note_data = {
                    "content": "Plant is showing good growth, watered today",
                    "type": "observation"
                }
                response = self.make_request("POST", f"/plants/{plant_id}/notes", note_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        notes = data['plant'].get('notes', [])
                        if notes and len(notes) > 0:
                            print(f"    ✅ Note added successfully ({len(notes)} total notes)")
                            success_count += 1
                        else:
                            print(f"    ❌ Note not found in plant data")
                    else:
                        print(f"    ❌ Invalid add note response: {data}")
                else:
                    print(f"    ❌ Add note failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Add note error: {e}")
        
        # Test 6: Update care schedule
        if self.test_plants:
            print("\n  🚿 Updating care schedule...")
            try:
                plant_id = self.test_plants[0]
                care_data = {
                    "watering": {
                        "frequency": "Every 2 days",
                        "lastWatered": datetime.now().isoformat(),
                        "nextWatering": (datetime.now() + timedelta(days=2)).isoformat()
                    },
                    "fertilizing": {
                        "frequency": "Weekly",
                        "lastFertilized": datetime.now().isoformat(),
                        "nextFertilizing": (datetime.now() + timedelta(days=7)).isoformat()
                    }
                }
                response = self.make_request("PUT", f"/plants/{plant_id}/care", care_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        care_schedule = data['plant'].get('careSchedule', {})
                        if (care_schedule.get('watering', {}).get('frequency') == "Every 2 days" and
                            care_schedule.get('fertilizing', {}).get('frequency') == "Weekly"):
                            print(f"    ✅ Care schedule updated successfully")
                            success_count += 1
                        else:
                            print(f"    ❌ Care schedule values not reflected correctly")
                    else:
                        print(f"    ❌ Invalid care schedule response: {data}")
                else:
                    print(f"    ❌ Care schedule update failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Care schedule update error: {e}")
        
        # Test 7: Add harvest log
        if self.test_plants:
            print("\n  🍅 Adding harvest log...")
            try:
                plant_id = self.test_plants[0]
                harvest_data = {
                    "date": datetime.now().isoformat(),
                    "quantity": 5,
                    "unit": "pieces",
                    "quality": "excellent",
                    "notes": "First harvest of the season"
                }
                response = self.make_request("POST", f"/plants/{plant_id}/harvest", harvest_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('plant'):
                        harvest_log = data['plant'].get('harvestLog', [])
                        if harvest_log and len(harvest_log) > 0:
                            print(f"    ✅ Harvest log added successfully ({len(harvest_log)} entries)")
                            success_count += 1
                        else:
                            print(f"    ❌ Harvest log not found in plant data")
                    else:
                        print(f"    ❌ Invalid harvest log response: {data}")
                else:
                    print(f"    ❌ Add harvest log failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Add harvest log error: {e}")
        
        # Test 8: Soft delete plant
        if len(self.test_plants) > 1:
            print("\n  🗑️ Soft deleting plant...")
            try:
                plant_id = self.test_plants[-1]  # Delete last plant
                response = self.make_request("DELETE", f"/plants/{plant_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        # Verify plant is not in active list
                        get_response = self.make_request("GET", "/plants")
                        if get_response.status_code == 200:
                            get_data = get_response.json()
                            active_plant_ids = [p['_id'] for p in get_data.get('plants', [])]
                            if plant_id not in active_plant_ids:
                                print(f"    ✅ Plant soft deleted successfully (not in active list)")
                                success_count += 1
                            else:
                                print(f"    ❌ Plant still appears in active list after deletion")
                        else:
                            print(f"    ❌ Could not verify deletion")
                    else:
                        print(f"    ❌ Invalid delete response: {data}")
                else:
                    print(f"    ❌ Plant deletion failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Plant deletion error: {e}")
        
        print(f"\n🌱 Plant CRUD Tests: {success_count}/{total_tests} passed")
        return success_count >= (total_tests * 0.75)  # 75% pass rate

    def test_task_crud_operations(self) -> bool:
        """Test all Task CRUD operations"""
        print("\n📋 Testing Task CRUD Operations...")
        
        if not self.token:
            print("❌ No authentication token available")
            return False
            
        success_count = 0
        total_tests = 7
        
        # Test 1: Create tasks
        print("\n  📝 Creating test tasks...")
        task_data_list = [
            {
                "plant": self.test_plants[0] if self.test_plants else None,
                "plantName": "Cherry Tomato",
                "task": "Water the tomato plant",
                "taskType": "watering",
                "priority": "high",
                "status": "pending",
                "dueDate": datetime.now().isoformat(),
                "time": "Morning",
                "notes": "Check soil moisture first"
            },
            {
                "plant": self.test_plants[1] if len(self.test_plants) > 1 else None,
                "plantName": "Basil Plant",
                "task": "Fertilize basil with organic fertilizer",
                "taskType": "fertilizing",
                "priority": "medium",
                "status": "pending",
                "dueDate": (datetime.now() + timedelta(days=1)).isoformat(),
                "time": "Afternoon"
            },
            {
                "plantName": "Rose Bush",
                "task": "Prune dead flowers",
                "taskType": "pruning",
                "priority": "low",
                "status": "pending",
                "dueDate": (datetime.now() + timedelta(days=2)).isoformat(),
                "time": "Evening"
            },
            {
                "plantName": "General Garden",
                "task": "Check for pests",
                "taskType": "pest-control",
                "priority": "high",
                "status": "completed",
                "dueDate": (datetime.now() - timedelta(days=1)).isoformat(),
                "time": "Anytime",
                "completedAt": datetime.now().isoformat()
            }
        ]
        
        for i, task_data in enumerate(task_data_list):
            try:
                response = self.make_request("POST", "/tasks", task_data)
                if response.status_code == 201:
                    data = response.json()
                    if data.get('success') and data.get('task'):
                        task_id = data['task']['_id']
                        self.test_tasks.append(task_id)
                        print(f"    ✅ Task {i+1} created: {task_data['task']} (ID: {task_id})")
                    else:
                        print(f"    ❌ Task {i+1} creation response invalid: {data}")
                else:
                    print(f"    ❌ Task {i+1} creation failed: {response.status_code}")
                    try:
                        error_data = response.json()
                        print(f"       Error: {error_data.get('message', 'Unknown')}")
                    except:
                        pass
            except Exception as e:
                print(f"    ❌ Task {i+1} creation error: {e}")
        
        if len(self.test_tasks) >= 3:
            success_count += 1
            print(f"  ✅ Task creation test passed ({len(self.test_tasks)} tasks created)")
        else:
            print(f"  ❌ Task creation test failed (only {len(self.test_tasks)} tasks created)")
        
        # Test 2: Get all tasks
        print("\n  📋 Getting all tasks...")
        try:
            response = self.make_request("GET", "/tasks")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'tasks' in data:
                    task_count = len(data['tasks'])
                    print(f"    ✅ Retrieved {task_count} tasks")
                    if task_count >= len(self.test_tasks):
                        success_count += 1
                    else:
                        print(f"    ❌ Expected at least {len(self.test_tasks)} tasks, got {task_count}")
                else:
                    print(f"    ❌ Invalid response format: {data}")
            else:
                print(f"    ❌ Get tasks failed: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Get tasks error: {e}")
        
        # Test 3: Filter tasks by status
        print("\n  🔍 Filtering tasks by status=pending...")
        try:
            response = self.make_request("GET", "/tasks?status=pending")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'tasks' in data:
                    pending_tasks = data['tasks']
                    all_pending = all(task['status'] == 'pending' for task in pending_tasks)
                    if all_pending:
                        print(f"    ✅ Status filter working ({len(pending_tasks)} pending tasks)")
                        success_count += 1
                    else:
                        print(f"    ❌ Status filter returned non-pending tasks")
                else:
                    print(f"    ❌ Invalid filter response: {data}")
            else:
                print(f"    ❌ Status filter failed: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Status filter error: {e}")
        
        # Test 4: Filter tasks by priority
        print("\n  🔍 Filtering tasks by priority=high...")
        try:
            response = self.make_request("GET", "/tasks?priority=high")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'tasks' in data:
                    high_priority_tasks = data['tasks']
                    all_high = all(task['priority'] == 'high' for task in high_priority_tasks)
                    if all_high:
                        print(f"    ✅ Priority filter working ({len(high_priority_tasks)} high priority tasks)")
                        success_count += 1
                    else:
                        print(f"    ❌ Priority filter returned non-high priority tasks")
                else:
                    print(f"    ❌ Invalid priority filter response: {data}")
            else:
                print(f"    ❌ Priority filter failed: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Priority filter error: {e}")
        
        # Test 5: Update task status to completed
        if self.test_tasks:
            print("\n  ✏️ Updating task status to completed...")
            try:
                task_id = self.test_tasks[0]
                update_data = {
                    "status": "completed"
                }
                response = self.make_request("PUT", f"/tasks/{task_id}", update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('task'):
                        updated_task = data['task']
                        if (updated_task['status'] == 'completed' and 
                            updated_task.get('completedAt')):
                            print(f"    ✅ Task status updated and completedAt set")
                            success_count += 1
                        else:
                            print(f"    ❌ Task status update incomplete (status: {updated_task['status']}, completedAt: {updated_task.get('completedAt')})")
                    else:
                        print(f"    ❌ Invalid task update response: {data}")
                else:
                    print(f"    ❌ Task update failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Task update error: {e}")
        
        # Test 6: Get tasks by date range
        print("\n  📅 Getting tasks by date range...")
        try:
            start_date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            end_date = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
            response = self.make_request("GET", f"/tasks/range?startDate={start_date}&endDate={end_date}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'tasks' in data:
                    range_tasks = data['tasks']
                    print(f"    ✅ Date range query returned {len(range_tasks)} tasks")
                    success_count += 1
                else:
                    print(f"    ❌ Invalid date range response: {data}")
            else:
                print(f"    ❌ Date range query failed: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Date range query error: {e}")
        
        # Test 7: Delete task
        if len(self.test_tasks) > 1:
            print("\n  🗑️ Deleting task...")
            try:
                task_id = self.test_tasks[-1]  # Delete last task
                response = self.make_request("DELETE", f"/tasks/{task_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        # Verify task is deleted
                        get_response = self.make_request("GET", f"/tasks/{task_id}")
                        if get_response.status_code == 404:
                            print(f"    ✅ Task deleted successfully (404 on get)")
                            success_count += 1
                        else:
                            print(f"    ❌ Task still accessible after deletion")
                    else:
                        print(f"    ❌ Invalid delete response: {data}")
                else:
                    print(f"    ❌ Task deletion failed: {response.status_code}")
            except Exception as e:
                print(f"    ❌ Task deletion error: {e}")
        
        print(f"\n📋 Task CRUD Tests: {success_count}/{total_tests} passed")
        return success_count >= (total_tests * 0.75)  # 75% pass rate

    def test_edge_cases(self) -> bool:
        """Test edge cases and validation"""
        print("\n⚠️ Testing Edge Cases & Validation...")
        
        success_count = 0
        total_tests = 4
        
        # Test 1: Access without auth token
        print("\n  🚫 Testing unauthorized access...")
        original_token = self.token
        self.token = None
        
        try:
            response = self.make_request("GET", "/plants")
            if response.status_code == 401:
                print("    ✅ Unauthorized access correctly rejected")
                success_count += 1
            else:
                print(f"    ❌ Expected 401, got {response.status_code}")
        except Exception as e:
            print(f"    ❌ Unauthorized access test error: {e}")
        finally:
            self.token = original_token
        
        # Test 2: Create plant with missing required fields
        print("\n  📝 Testing plant creation with missing fields...")
        try:
            invalid_plant = {"name": ""}  # Missing required fields
            response = self.make_request("POST", "/plants", invalid_plant)
            if response.status_code == 400:
                print("    ✅ Invalid plant data correctly rejected")
                success_count += 1
            else:
                print(f"    ❌ Expected 400 for invalid data, got {response.status_code}")
        except Exception as e:
            print(f"    ❌ Invalid plant test error: {e}")
        
        # Test 3: Access non-existent plant
        print("\n  🔍 Testing access to non-existent plant...")
        try:
            fake_id = "507f1f77bcf86cd799439011"  # Valid ObjectId format but doesn't exist
            response = self.make_request("GET", f"/plants/{fake_id}")
            if response.status_code == 404:
                print("    ✅ Non-existent plant correctly returns 404")
                success_count += 1
            else:
                print(f"    ❌ Expected 404 for non-existent plant, got {response.status_code}")
        except Exception as e:
            print(f"    ❌ Non-existent plant test error: {e}")
        
        # Test 4: Create task with invalid plant ID
        print("\n  📋 Testing task creation with invalid plant ID...")
        try:
            invalid_task = {
                "plant": "507f1f77bcf86cd799439011",  # Non-existent plant ID
                "plantName": "Non-existent Plant",
                "task": "Water non-existent plant",
                "dueDate": datetime.now().isoformat()
            }
            response = self.make_request("POST", "/tasks", invalid_task)
            if response.status_code == 404:
                print("    ✅ Task with invalid plant ID correctly rejected")
                success_count += 1
            else:
                print(f"    ❌ Expected 404 for invalid plant ID, got {response.status_code}")
        except Exception as e:
            print(f"    ❌ Invalid plant ID test error: {e}")
        
        print(f"\n⚠️ Edge Case Tests: {success_count}/{total_tests} passed")
        return success_count >= (total_tests * 0.75)  # 75% pass rate

    def run_all_tests(self) -> Dict[str, bool]:
        """Run all backend tests"""
        print("🚀 Starting UrbanEos Backend CRUD Testing Suite")
        print("=" * 60)
        
        results = {}
        
        # Health check
        results['health_check'] = self.test_health_check()
        
        # Authentication tests
        results['user_registration'] = self.test_user_registration()
        results['user_login'] = self.test_user_login()
        results['auth_protection'] = self.test_auth_protection()
        
        # CRUD tests (only if auth works)
        if results['user_registration'] or results['user_login']:
            results['plant_crud'] = self.test_plant_crud_operations()
            results['task_crud'] = self.test_task_crud_operations()
            results['edge_cases'] = self.test_edge_cases()
        else:
            print("\n❌ Skipping CRUD tests due to authentication failures")
            results['plant_crud'] = False
            results['task_crud'] = False
            results['edge_cases'] = False
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(results.values())
        total = len(results)
        
        for test_name, passed_test in results.items():
            status = "✅ PASS" if passed_test else "❌ FAIL"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\nOverall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        
        if passed >= total * 0.8:  # 80% pass rate
            print("🎉 Backend testing SUCCESSFUL!")
        else:
            print("⚠️ Backend testing needs attention - multiple failures detected")
        
        return results

if __name__ == "__main__":
    tester = UrbanEosBackendTester()
    results = tester.run_all_tests()