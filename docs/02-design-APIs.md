## API Design

EXERCISE: PLEASE DESIGN ALL API endpoints (remaining ones)

GET/POST/PATCH/PUT/DELETE /endpoint
    - Query params (?param1=value&... if any)
    - Path params ( /path/:something/... etc.)
    - Request body - What data is to be sent and what form (shape of JSON with fields)
    - HTTP headers

- Calendar
    - GET /api/calendar // (or) /api/meetings?..
        - Query params: ?date=2020-09-14 (default to current date)
        - Path params: -
        - Temporary query param: user id / email. We set the urlencoded form of ?date=2020-09-14&email=jane.doe@example.com
        - Request body: -

- Search for meeting
    - GET /api/meetings
        - Query params:
            - date: ALL / PRESENT / PAST / FUTURE
            - search_terms
        - Temporary query param: user id / email. We set the urlencoded form of ?email=jane.doe@example.com
        - Path params: -
        - Request body: -
    - [DB Query]:
        - Construct date object from string
        - Construct dateFilter based on PAST / PRESENT / etc.
        - find( { attendees: "jane@example.com",  date: dateFilter, description: { $regex: ... } } ).sort( 'fields' )
        - find( { "attendees.userId": "jane@example.com",  date: dateFilter, description: { $regex: ... } } ).sort( 'fields' )
    - Response: An array of JSON objects - Meetings that match the criteria

- Getting list of users
    - GET /api/users

- Adding a new user as attendee for a meeting
    - PATCH /api/meetings/:meetingid?action=add_attendee

- Excusing yourself from the meeting
    - PATCH /api/meetings/:meetingid?action=remove_yourself
    - Temporary query param: user id / email. We set the urlencoded form of ?email=jane.doe@example.com

- Adding meeting
    - POST /api/meetings
    - Temporary query param: user id / email. We set the urlencoded form of ?email=jane.doe@example.com