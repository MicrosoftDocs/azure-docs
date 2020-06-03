---
title: Testing for DevOps - LUIS
description: How to test your Language Understanding Intelligent Services (LUIS) app in a DevOps environment.
ms.topic: conceptual
ms.date: 06/3/2020
---

# DevOps practices for LUIS

Software engineers want to follow DevOps practices around source control, automated builds and testing and release management when developing a Language Understanding Intelligent Services (LUIS) app. It is not always obvious how to achieve these goals when working with a web portal development tool such as the [LUIS Portal](https://www.luis.ai). 

In these documents, you can learn how to follow DevOps practices when developing a LUIS app:

- [Source control and branch strategies for LUIS](#source-control-and-branch-strategies-for-luis) (this document)
- [Testing for LUIS DevOps](luis-concept-devops-testing.md)
- [Automation workflows for LUIS DevOps](luis-concept-devops-automation.md)
- [Release management](link tbd)

## Testing for DevOps for LUIS



BE CAREFUL testing utterances should not be logged and so contribute to active learning

# Unit Testing

## Goals

Unit tests play an integral role in building quality software and enabling agile methodologies. The implementation of the unit is finished when the unit satisfies the tests.

### Unit tests have several goals:

- Ensure code fulfills functional and non-functional requirements
- Ensure focus on functionality to deliver
- Support fast code evolution and refactoring while reducing the risk of regressions
- Provide confidence to potential contributors
- Developer Documentation of API usage
Keep the code quality bar high.

## Evidence and Measures

The [CICD already requires badges in place](../../continuous-integration/CICD.md) for every repo to quickly assess code coverage and test pass/fail.

The team should also keep in an eye on tests that may not be running as part of every merge, i.e. integration and e2e test.

## General Guidance

The scope of a unit test is small. Engineers should use good judgement to provide a reasonable amount of unit test based on complexity of the unit to be tested, aligning with the overall goal of 70-80% code coverage. Unit tests should exercise more than the "happy path" paying specific attention to returned error values or exceptions thrown.

Bug fixes should start with a test that reliably reproduces the bug to ensure that a particular commit will fix the bug as intended. Existing tests will reduce risk of regressions introduced by the fix.

Unit testing works in conjunction with integration tests and end-to-end tests for larger pieces of functionality.

In order to keep execution of unit tests fast and executable as part of a CI/CD pipeline, tests can provide mock implementations of other parts of the application or 3rd party services.

For integration or end-to-end testing, mocks should be replaced with API calls to the system they are simulating.

### Writing Tests

Good unit tests follow a few general principles:

- Pass / Fail tests ensure intended succeeds and fails as designed.
- Transactional tests ensure transactions commit or roll back as designed
- CRUD operations work as designed
- All data created for or during a test is localized to the test to allow for parallel test execution
- All data created during or for a test gets cleaned up after tests completed

## Next steps

> [!div class="nextstepaction"]
> [Automation workflows](luis-concept-devops-automation.md)
