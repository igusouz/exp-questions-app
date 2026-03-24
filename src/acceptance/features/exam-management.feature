Feature: Exam management and grading APIs
  As an exam manager
  I want exam endpoints to enforce expected behavior
  So that I can trust exam creation, exports, and grading workflows

  Scenario: List seeded exams
    When I request the exams list
    Then the response status should be 200
    And the response status field should be "success"
    And the exams list should include "exam-letter-001"
    And the exams list should include "exam-power-001"

  Scenario: Create exam successfully and deduplicate question ids
    When I create an exam with payload:
      """
      {
        "title": "Acceptance Test Exam",
        "questionIds": ["q-math-001", "q-math-001", "q-science-001"],
        "identificationMode": "letter"
      }
      """
    Then the response status should be 201
    And the response status field should be "success"
    And the created exam title should be "Acceptance Test Exam"
    And the created exam should have 2 unique question ids

  Scenario: Reject exam creation with unknown question id
    When I create an exam with payload:
      """
      {
        "title": "Invalid Exam",
        "questionIds": ["q-not-found"],
        "identificationMode": "letter"
      }
      """
    Then the response status should be 400
    And the response message should be "One or more selected questions were not found"

  Scenario: Export answer key for a seeded letter exam
    When I request the answer key for exam "exam-letter-001"
    Then the response status should be 200
    And the CSV content should include "questionNumber,questionId,questionDescription,expectedLetters,expectedPowerOf2Sum,activeExpectedAnswer"
    And the CSV content should include "q-math-001"

  Scenario: Grade CSV answers in strict mode for seeded letter exam
    When I grade exam "exam-letter-001" with payload:
      """
      {
        "gradingMode": "strict",
        "csvContent": "questionId,answer\nq-math-001,B\nq-math-002,A|B|D\nq-science-001,C"
      }
      """
    Then the response status should be 200
    And the response status field should be "success"
    And the grade result percentage should be 100
