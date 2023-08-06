---
title: Testing for DevOps for LUIS apps
description: How to test your Language Understanding (LUIS) app in a DevOps environment.
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
manager: nitinme
ms.topic: conceptual
ms.date: 06/3/2020
---

# Testing for LUIS DevOps

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Software engineers who are developing a Language Understanding (LUIS) app can apply DevOps practices around [source control](luis-concept-devops-sourcecontrol.md), [automated builds](luis-concept-devops-automation.md), [testing](luis-concept-devops-testing.md), and [release management](luis-concept-devops-automation.md#release-management) by following these guidelines.

In agile software development methodologies, testing plays an integral role in building quality software. Every significant change to a LUIS app should be accompanied by tests designed to test the new functionality the developer is building into the app. These tests are checked into your source code repository along with the `.lu` source of your LUIS app. The implementation of the change is finished when the app satisfies the tests.

Tests are a critical part of [CI/CD workflows](luis-concept-devops-automation.md). When changes to a LUIS app are proposed in a pull request (PR) or after changes are merged into your main branch, then CI workflows should run the tests to verify that the updates haven't caused any regressions.

## How to do Unit testing and Batch testing

There are two different kinds of testing for a LUIS app that you need to perform in continuous integration workflows:

- **Unit tests** - Relatively simple tests that verify the key functionality of your LUIS app. A unit test passes when the expected intent and the expected entities are returned for a given test utterance. All unit tests must pass for the test run to complete successfully.  
This kind of testing is similar to [Interactive testing](./how-to/train-test.md) that you can do in the [LUIS portal](https://www.luis.ai/).

- **Batch tests** - Batch testing is a comprehensive test on your current trained model to measure its performance. Unlike unit tests, batch testing isn't pass|fail testing. The expectation with batch testing is not that every test will return the expected intent and expected entities. Instead, a batch test helps you view the accuracy of each intent and entity in your app and helps you to compare over time as you make improvements.  
This kind of testing is the same as the [Batch testing](./luis-how-to-batch-test.md) that you can perform interactively in the LUIS portal.

You can employ unit testing from the beginning of your project. Batch testing is only really of value once you've developed the schema of your LUIS app and you're working on improving its accuracy.

For both unit tests and batch tests, make sure that your test utterances are kept separate from your training utterances. If you test on the same data you train on, you'll get the false impression your app is performing well when it's just overfitting to the testing data. Tests must be unseen by the model to test how well it is generalizing.

### Writing tests

When you write a set of tests, for each test you need to define:

* Test utterance
* Expected intent
* Expected entities.

Use the LUIS [batch file syntax](./luis-how-to-batch-test.md#batch-syntax-template-for-intents-with-entities) to define a group of tests in a JSON-formatted file. For example:

```JSON
[
  {
    "text": "example utterance goes here",
    "intent": "intent name goes here",
    "entities":
    [
        {
            "entity": "entity name 1 goes here",
            "startPos": 14,
            "endPos": 23
        },
        {
            "entity": "entity name 2 goes here",
            "startPos": 14,
            "endPos": 23
        }
    ]
  }
]
```

Some test tools, such as [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) also support LUDown-formatted test files.

#### Designing unit tests

Unit tests should be designed to test the core functionality of your LUIS app. In each iteration, or sprint, of your app development, you should write a sufficient number of tests to verify that the key functionality you are implementing in that iteration is working correctly.

In each unit test, for a given test utterance, you can:

* Test that the correct intent is returned
* Test that the 'key' entities - those that are critical to your solution - are being returned.
* Test that the [prediction score](./luis-concept-prediction-score.md) for intent and entities exceeds a threshold that you define. For example, you could decide that you will only consider that a test has passed if the prediction score for the intent and for your key entities exceeds 0.75.

In unit tests, it's a good idea to test that your key entities have been returned in the prediction response, but to ignore any false positives. *False positives* are entities that are found in the prediction response but which are not defined in the expected results for your test. By ignoring false positives, it makes it less onerous to author unit tests while still allowing you to focus on testing that the data that is key to your solution is being returned in a prediction response.

> [!TIP]
> The [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) tool supports all your LUIS testing needs. The `compare` command when used in [unit test mode](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md#unit-test-mode) will assert that all tests pass, and will ignore false positive results for entities that are not labeled in the expected results.

#### Designing Batch tests

Batch test sets should contain a large number of test cases, designed to test across all intents and all entities in your LUIS app. See [Batch testing in the LUIS portal](./luis-how-to-batch-test.md) for information on defining a batch test set.

### Running tests

The LUIS portal offers features to help with interactive testing:

* [**Interactive testing**](./how-to/train-test.md) allows you to submit a sample utterance and get a response of LUIS-recognized intents and entities. You verify the success of the test by visual inspection.

* [**Batch testing**](./luis-how-to-batch-test.md) uses a batch test file as input to validate your active trained version to measure its prediction accuracy. A batch test helps you view the accuracy of each intent and entity in your active version, displaying results with a chart.

#### Running tests in an automated build workflow

The interactive testing features in the LUIS portal are useful, but for DevOps, automated testing performed in a CI/CD workflow brings certain requirements:

* Test tools must run in a workflow step on a build server. This means the tools must be able to run on the command line.
* The test tools must be able to execute a group of tests against an endpoint and automatically verify the expected results against the actual results.
* If the tests fail, the test tools must return a status code to halt the workflow and "fail the build".

LUIS does not offer a command-line tool or a high-level API that offers these features. We recommend that you use the [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) tool to run tests and verify results, both at the command line and during automated testing within a CI/CD workflow.

The testing capabilities that are available in the LUIS portal don't require a published endpoint and are a part of the LUIS authoring capabilities. When you're implementing testing in an automated build workflow, you must publish the LUIS app version to be tested to an endpoint so that test tools such as NLU.DevOps can send prediction requests as part of testing.

> [!TIP]
> * If you're implementing your own testing solution and writing code to send test utterances to an endpoint, remember that if you are using the LUIS authoring key, the allowed transaction rate is limited to 5TPS. Either throttle the sending rate or use a prediction key instead.
> * When sending test queries to an endpoint, remember to use `log=false` in the query string of your prediction request. This ensures that your test utterances do not get logged by LUIS and end up in the endpoint utterances review list presented by the LUIS [active learning](./how-to/improve-application.md) feature and, as a result, accidentally get added to the training utterances of your app.

#### Running Unit tests at the command line and in CI/CD workflows

You can use the [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) package to run tests at the command line:

* Use the NLU.DevOps [test command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Test.md) to submit tests from a test file to an endpoint and to capture the actual prediction results in a file.
* Use the NLU.DevOps [compare command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md) to compare the actual results with the expected results defined in the input test file. The `compare` command generates NUnit test output, and when used in [unit test mode](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md#unit-test-mode) by use of the `--unit-test` flag, will assert that all tests pass.

### Running Batch tests at the command line and in CI/CD workflows

You can also use the NLU.DevOps package to run batch tests at the command line.

* Use the NLU.DevOps [test command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Test.md) to submit tests from a test file to an endpoint and to capture the actual prediction results in a file, same as with unit tests.
* Use the NLU.DevOps [compare command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md) in [Performance test mode](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md#performance-test-mode) to measure the performance of your app You can also compare the performance of your app against a baseline performance benchmark, for example, the results from the latest commit to main or the current release. In Performance test mode, the `compare` command generates NUnit test output and [batch test results](./luis-glossary.md#batch-test) in JSON format.

## LUIS non-deterministic training and the effect on testing

When LUIS is training a model, such as an intent, it needs both positive data - the labeled training utterances that you've supplied to train the app for the model - and negative data - data that is *not* valid examples of the usage of that model. During training, LUIS builds the negative data of one model from all the positive data you've supplied for the other models, but in some cases that can produce a data imbalance. To avoid this imbalance, LUIS samples a subset of the negative data in a non-deterministic fashion to optimize for a better balanced training set, improved model performance, and faster training time.

The result of this non-deterministic training is that you may get a slightly [different prediction response between different training sessions](./luis-concept-prediction-score.md), usually for intents and/or entities where the [prediction score](./luis-concept-prediction-score.md) is not high.

If you want to disable non-deterministic training for those LUIS app versions that you're building for the purpose of testing, use the [Version settings API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) with the `UseAllTrainingData` setting set to `true`.

## Next steps

* Learn about [implementing CI/CD workflows](luis-concept-devops-automation.md)
* Learn how to [implement DevOps for LUIS with GitHub](./luis-concept-devops-automation.md)
