#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Premium cinematic wedding invitation with RSVP for Maroun & Cynthia (July 27, 2026).
  10-slide horizontally swipeable luxury experience. Backend stores RSVPs in MongoDB.

backend:
  - task: "RSVP API endpoints (GET health, POST /api/rsvp, GET /api/rsvps)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Implemented dynamic catch-all route. GET /api -> health; POST /api/rsvp stores {invitationId, guests:[{name,status}], message, id (uuid), createdAt} in 'rsvps' Mongo collection. GET /api/rsvps lists all RSVPs sorted by createdAt desc. Uses cached MongoClient. DB_NAME from env (fallback 'wedding')."
      - working: true
        agent: "testing"
        comment: "All backend API tests passed (4/4). ✅ GET /api returns {ok:true, service:'wedding-api'} with status 200. ✅ POST /api/rsvp successfully creates RSVPs with UUID, stores in MongoDB with all fields (invitationId, guests, message, createdAt). ✅ GET /api/rsvps retrieves all RSVPs correctly. ✅ MongoDB persistence verified - data stored and retrieved accurately. ✅ CORS headers (Access-Control-Allow-Origin: *) present on all endpoints. Backend is fully functional."

frontend:
  - task: "Cinematic intro + 10 swipeable slides + RSVP submit"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Built cinematic black-screen intro with M&C initials reveal, then 10 slides via Swiper (Hero, Countdown, Story timeline, Polaroid gallery, Ceremony glass card, Reception, Travel expandable cards, Gift envelope, Personal message, RSVP). URL param ?names=A,B loads guest names. Champagne/white palette, glassmorphism, Framer Motion animations, background slideshow crossfades, music toggle."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "RSVP API endpoints (GET health, POST /api/rsvp, GET /api/rsvps)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Please test the RSVP backend. Endpoints:
      - GET /api -> should return {ok:true, service:'wedding-api'}
      - POST /api/rsvp with body {invitationId, guests:[{name,status}], message} -> persists and returns {ok:true, rsvp:{...}}
      - GET /api/rsvps -> returns {rsvps:[...]} sorted by createdAt desc
      Verify Mongo persistence by submitting an RSVP then listing it. DB name comes from env DB_NAME (fallback 'wedding').
  - agent: "testing"
    message: |
      Backend testing completed successfully. All 4 API tests passed:
      ✅ Health check endpoint (GET /api) working
      ✅ RSVP submission (POST /api/rsvp) working with UUID generation
      ✅ RSVP retrieval (GET /api/rsvps) working
      ✅ MongoDB persistence verified
      ✅ CORS headers configured correctly on all endpoints
      
      The backend is fully functional and ready. No issues found.
