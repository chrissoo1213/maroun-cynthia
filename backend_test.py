#!/usr/bin/env python3
"""
Backend API tests for Wedding RSVP application
Tests the RSVP endpoints at /app/app/api/[[...path]]/route.js
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://luxe-vows-9.preview.emergentagent.com"

def test_health_endpoint():
    """Test GET /api health check endpoint"""
    print("\n" + "="*80)
    print("TEST 1: GET /api - Health Check")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/api"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check CORS headers
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        print(f"CORS Header (Access-Control-Allow-Origin): {cors_origin}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get('ok') != True or data.get('service') != 'wedding-api':
            print(f"❌ FAILED: Expected {{ok:true, service:'wedding-api'}}, got {data}")
            return False
        
        if cors_origin != '*':
            print(f"⚠️  WARNING: CORS header not set to '*', got '{cors_origin}'")
        
        print("✅ PASSED: Health check endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred - {str(e)}")
        return False


def test_submit_rsvp():
    """Test POST /api/rsvp to submit an RSVP"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/rsvp - Submit RSVP")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/api/rsvp"
        
        # Use realistic wedding guest data
        payload = {
            "invitationId": "maroun-cynthia-2026",
            "guests": [
                {"name": "Maroun Khoury", "status": "accept"},
                {"name": "Cynthia Hayek", "status": "accept"}
            ],
            "message": "So excited to celebrate with you both! Can't wait for July 23th!"
        }
        
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check CORS headers
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        print(f"CORS Header (Access-Control-Allow-Origin): {cors_origin}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Validate response structure
        if not data.get('ok'):
            print(f"❌ FAILED: Expected ok:true in response")
            return False, None
        
        rsvp = data.get('rsvp')
        if not rsvp:
            print(f"❌ FAILED: No 'rsvp' object in response")
            return False, None
        
        # Validate RSVP fields
        required_fields = ['id', 'invitationId', 'guests', 'message', 'createdAt']
        missing_fields = [f for f in required_fields if f not in rsvp]
        
        if missing_fields:
            print(f"❌ FAILED: Missing required fields in RSVP: {missing_fields}")
            return False, None
        
        # Validate UUID format (basic check)
        rsvp_id = rsvp.get('id')
        if not rsvp_id or len(rsvp_id) < 32:
            print(f"❌ FAILED: Invalid UUID format for id: {rsvp_id}")
            return False, None
        
        # Validate data matches
        if rsvp.get('invitationId') != payload['invitationId']:
            print(f"❌ FAILED: invitationId mismatch")
            return False, None
        
        if rsvp.get('message') != payload['message']:
            print(f"❌ FAILED: message mismatch")
            return False, None
        
        if len(rsvp.get('guests', [])) != len(payload['guests']):
            print(f"❌ FAILED: guests count mismatch")
            return False, None
        
        if cors_origin != '*':
            print(f"⚠️  WARNING: CORS header not set to '*', got '{cors_origin}'")
        
        print(f"✅ PASSED: RSVP submitted successfully with ID: {rsvp_id}")
        return True, rsvp_id
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred - {str(e)}")
        return False, None


def test_get_rsvps(expected_rsvp_id=None):
    """Test GET /api/rsvps to retrieve all RSVPs"""
    print("\n" + "="*80)
    print("TEST 3: GET /api/rsvps - Retrieve All RSVPs")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/api/rsvps"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # Truncate if too long
        
        # Check CORS headers
        cors_origin = response.headers.get('Access-Control-Allow-Origin')
        print(f"CORS Header (Access-Control-Allow-Origin): {cors_origin}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if 'rsvps' not in data:
            print(f"❌ FAILED: No 'rsvps' array in response")
            return False
        
        rsvps = data.get('rsvps', [])
        print(f"Total RSVPs retrieved: {len(rsvps)}")
        
        if not isinstance(rsvps, list):
            print(f"❌ FAILED: 'rsvps' is not an array")
            return False
        
        # If we have an expected RSVP ID, verify it's in the list
        if expected_rsvp_id:
            found = False
            for rsvp in rsvps:
                if rsvp.get('id') == expected_rsvp_id:
                    found = True
                    print(f"✅ Found submitted RSVP with ID: {expected_rsvp_id}")
                    print(f"   Guests: {rsvp.get('guests')}")
                    print(f"   Message: {rsvp.get('message')}")
                    break
            
            if not found:
                print(f"❌ FAILED: Previously submitted RSVP (ID: {expected_rsvp_id}) not found in list")
                return False
        
        # Verify sorting by createdAt (descending)
        if len(rsvps) > 1:
            dates = [rsvp.get('createdAt') for rsvp in rsvps if 'createdAt' in rsvp]
            if dates == sorted(dates, reverse=True):
                print("✅ RSVPs are correctly sorted by createdAt (descending)")
            else:
                print("⚠️  WARNING: RSVPs may not be sorted correctly by createdAt")
        
        if cors_origin != '*':
            print(f"⚠️  WARNING: CORS header not set to '*', got '{cors_origin}'")
        
        print("✅ PASSED: RSVPs retrieved successfully")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred - {str(e)}")
        return False


def test_mongodb_persistence():
    """Test MongoDB persistence by submitting and retrieving"""
    print("\n" + "="*80)
    print("TEST 4: MongoDB Persistence Verification")
    print("="*80)
    
    try:
        # Submit a unique RSVP
        url = f"{BASE_URL}/api/rsvp"
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        
        payload = {
            "invitationId": f"persistence-test-{timestamp}",
            "guests": [
                {"name": "Sophie Laurent", "status": "accept"},
                {"name": "Alexandre Dubois", "status": "decline"}
            ],
            "message": f"Testing persistence at {timestamp}"
        }
        
        print(f"Submitting test RSVP with invitationId: {payload['invitationId']}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ FAILED: Could not submit test RSVP")
            return False
        
        data = response.json()
        test_rsvp_id = data.get('rsvp', {}).get('id')
        
        if not test_rsvp_id:
            print(f"❌ FAILED: No ID returned for test RSVP")
            return False
        
        print(f"Test RSVP submitted with ID: {test_rsvp_id}")
        
        # Retrieve and verify
        response = requests.get(f"{BASE_URL}/api/rsvps", timeout=10)
        
        if response.status_code != 200:
            print(f"❌ FAILED: Could not retrieve RSVPs")
            return False
        
        rsvps = response.json().get('rsvps', [])
        
        # Find our test RSVP
        found = False
        for rsvp in rsvps:
            if rsvp.get('id') == test_rsvp_id:
                found = True
                # Verify all fields persisted correctly
                if (rsvp.get('invitationId') == payload['invitationId'] and
                    rsvp.get('message') == payload['message'] and
                    len(rsvp.get('guests', [])) == len(payload['guests'])):
                    print("✅ PASSED: MongoDB persistence verified - all fields match")
                    return True
                else:
                    print("❌ FAILED: RSVP found but fields don't match")
                    return False
        
        if not found:
            print(f"❌ FAILED: Test RSVP not found in database")
            return False
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred - {str(e)}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("WEDDING RSVP BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing endpoints: /api, /api/rsvp, /api/rsvps")
    print("="*80)
    
    results = {
        'health': False,
        'submit_rsvp': False,
        'get_rsvps': False,
        'persistence': False
    }
    
    # Test 1: Health check
    results['health'] = test_health_endpoint()
    
    # Test 2: Submit RSVP
    submit_success, rsvp_id = test_submit_rsvp()
    results['submit_rsvp'] = submit_success
    
    # Test 3: Get RSVPs (with verification of submitted RSVP)
    results['get_rsvps'] = test_get_rsvps(rsvp_id)
    
    # Test 4: MongoDB persistence
    results['persistence'] = test_mongodb_persistence()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if all(results.values()) else 1)


if __name__ == "__main__":
    main()
