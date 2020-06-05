---
title: Testing for DevOps - LUIS
description: How to test your Language Understanding Intelligent Services (LUIS) app in a DevOps environment.
ms.topic: conceptual
ms.date: 06/3/2020
---

# Testing for LUIS DevOps

Software engineers want to follow best practices around [source control](luis-concept-devops-sourcecontrol.md), [automated builds](luis-concept-devops-automation.md), [testing](luis-concept-devops-testing.md) and [release management](luis-concept-devops-automation.md#release-management) when developing a Language Understanding Intelligent Services (LUIS) app.

In agile software development methodologies, testing plays an integral role in building quality software. Every significant change to a LUIS app should be accompanied by tests designed to test the new functionality the developer is building into the app. These tests are checked into your source code repository along with the `'lu` source of your LUIS app. The implementation of the change is finished when the app satisfies the tests.

Tests are a critical part of [CI/CD workflows](luis-concept-devops-automation.md). When updates to a LUIS app are proposed in a pull request (PR) or after changes are merged into master after a PR is approved and merged, then automation workflows should execute to run all the tests to verify that the updates have not introduced any problems or caused the performance of the LUIS app to degrade.

## How to do Unit testing and Batch testing

There are two different kinds of testing for a LUIS app that you should aim to incorporate in your DevOps practices for LUIS, which must be capable of being automated for use in CI/CD workflows:

- **Unit tests** - These are tests that verify the key functionality of your LUIS app. These are relatively simple tests that for a given set of test utterances, the expected intent and expected entities are returned. Unit tests must pass for the test run to complete successfully.  
This kind of testing is similar to [Interactive testing](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-test) that you can perform in the [LUIS portal](https://www.luis.ai/).

- **Batch tests** - Batch testing is a comprehensive test on your current trained model to measure its performance in LUIS. Unlike unit tests, batch testing is not pass|fail testing. The expectation with batch testing is not that every test will pass perfectly. Instead, a batch test helps you view the accuracy of each intent and entity in your active version and helps you to compare over time as you make improvements to your app.  
This kind of testing is the same as the [Batch testing](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-batch-test) that you can perform interactively in the LUIS portal.

You can employ unit testing from the beginning of your project, whereas batch testing is only really of value once you have developed the schema of your LUIS app and you are working on improving its accuracy.

For both these kinds of test, make sure that your test utterances are kept separate from your training utterances. There is no value in testing with an utterance that the LUIS app has been trained on.

### Writing Tests

When you write a test case, you need to define:

* the test utterance
* the expected intent
* the expected entities.

Use the LUIS [batch file syntax](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-batch-test#batch-syntax-template-for-intents-with-entities) to define a group of tests in a JSON-formatted file. For example:

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

#### Designing Unit Tests

Unit tests should be relatively few in number and designed to test the core functionality of your LUIS app. Define tests that will:

* Test that the correct intent is returned
* Test that the entities that are most important to your solution are being returned.

#### Designing Batch tests

Batch test sets should contain a large number of test cases, designed to test across all intents and all entities in your LUIS app. See [Batch testing with 1000 utterances in LUIS portal](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-batch-test) for information on defining a batch test set.

### Running tests

The LUIS portal offers features to help with interactive testing:

* [**Interactive testing**](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-test) which allows you to submit a sample utterance and get a response of LUIS-recognized intents and entities. You verify the success of the test by visual inspection.

* [**Batch testing**](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-batch-test) which uses a batch test file as input to validate your active trained version to measure its prediction accuracy. A batch test helps you view the accuracy of each intent and entity in your active version, displaying results with a chart.

#### Running tests in an automated build workflow

These interactive testing features just mentioned are useful, but for DevOps, a key requirement is that testing can be automated in a CI/CD workflow.

LUIS does not offer a command line tool or a high-level API to submit test utterances and compare the prediction response against some expected results. We recommend that you use the [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) package to run tests at the command line and to perform automated testing within a CI/CD workflow.

The testing capabilities that are available in the LUIS portal do not require a published endpoint and are a part of the LUIS authoring capabilities. When implementing testing in an automated build workflow, you will have to publish the LUIS app version to be tested to an endpoint so that test tools such as NLU.DevOps can send prediction requests as part of testing.

> [!TIP]
> * If you are implementing your own testing solution and writing code to send test utterances to an endpoint, remember that if you are using the LUIS authoring key, the allowed transaction rate is limited to 5TPS. Either throttle the sending rate or use a prediction key instead.
> * When sending test queries to an endpoint, remember to use `log=false` in the query string of your prediction request. This ensures that your test utterances do not get logged by LUIS and end up in the endpoint utterances review list presented by the LUIS [active learning](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-review-endpoint-utterances) feature and, as a result, accidentally get added to the training utterances of your app.

#### Running Unit tests at the command line and in CI/CD workflows

You can use the [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) package to run tests at the command line:

* Use the NLU.DevOps [test command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Test.md) to submit tests from a test file to an endpoint and to capture the actual prediction results in a file.
* Use the NLU.DevOps [compare command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md) to compare the actual results with the expected results defined in the input test file. The `compare` command generates NUnit test output, and when used in [unit test mode](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md#unit-test-mode) by use of the `--unit-test` flag, will assert that all tests pass.

### Running Batch tests at the command line and in CI/CD workflows

You can also use the NLU.DevOps package to run batch tests at the command line.

* Use the NLU.DevOps [test command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Test.md) to submit tests from a test file to an endpoint and to capture the actual prediction results in a file, same as with unit tests.
* Use the NLU.DevOps [compare command](https://github.com/microsoft/NLU.DevOps/blob/master/docs/Analyze.md) to compare the actual results with the expected results defined in the input test file, but without the `--unit-test` flag. When not in unit test mode, the `compare` command generates NUnit test output and confusion matrix results in JSON format. It can also be used to measure performance against a baseline test run.

## LUIS non-deterministic training and the effect on testing

When LUIS is training a model, such as an intent, it needs both positive data - the labeled training utterances that you have supplied to train the app for the model - and negative data - data that are *not* valid examples of the usage of that model. During training, the negative data of one model is built from all the positive data you have supplied for the other models but in some cases that produces data imbalance. By default, LUIS samples a a subset of the negative data in a non-deterministic fashion to optimize for a better balanced training set, improved model performance and faster training time.

The result of this non-deterministic training is that for a particular utterance, you may get a [different prediction response between different training sessions](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-prediction-score), usually for intents and/or entities where the [prediction score](https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-prediction-score) is not high.

The ideal solution for this is to review your training utterances and perhaps add more training to your app to improve the prediction score for that model. However, you may also consider disabling non-deterministic training for those LUIS app versions that you are building for the purpose of testing. You do this by using the [Version settings API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) with the `UseAllTrainingData` setting set to true.

## Next steps

* Learn about [implementing CI/CD workflows](luis-concept-devops-automation.md)
* Learn how to [implement DevOps for LUIS with GitHub](luis-how-to-devops-with-github.md)