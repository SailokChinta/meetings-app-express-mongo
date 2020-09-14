# Models

- User
    - _id
    - name
    - email
    - password

- Meeting
    - _id
    - name
    - description
    - date
    - startTime
    - endTime
    - attendees: [ { userId: user._id, email: user.emailids_of_attendee }, ... ]

