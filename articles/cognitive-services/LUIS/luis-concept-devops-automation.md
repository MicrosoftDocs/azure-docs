---
title: Testing for DevOps - LUIS
description: How to test your Language Understanding Intelligent Services (LUIS) app in a DevOps environment.
ms.topic: conceptual
ms.date: 06/3/2020
---

# Continuous Integration and Continuous Delivery workflows for LUIS DevOps

Software engineers want to follow best practices around [source control](luis-concept-devops-sourcecontrol.md), [automated builds](luis-concept-devops-automation.md), [testing](luis-concept-devops-testing.md) and [release management](#release-management) when developing a Language Understanding Intelligent Services (LUIS) app.

Continuous Integration is the engineering practice of frequently committing code in a shared repository, and performing an automated build on it. Paired with an automated [testing](luis-concept-devops-testing.md) approach, continuous integration allows us to also test the build such that we can verify that not only does the code asset still build correctly (which in the case of a LUIS app means that it can be imported from the LUDown source and trained and published), but also is still functionally correct. This is also a best practice for building robust and flexible software systems.

Continuous Delivery takes the Continuous Integration concept further to also test deployments of the integrated code base on a replica of the environment it will be ultimately deployed on. This enables us to learn early about any unforeseen operational issues that arise from our changes as quickly as possible and also learn about gaps in our test coverage.

The goal of all of this is to ensure that "master is always shippable," meaning that we could, if we needed to, take a build from the master branch of our code base and ship it on production.

If these concepts are unfamiliar to you, see [Continuous Integration](https://www.martinfowler.com/articles/continuousIntegration.html) and [Continuous Delivery](https://martinfowler.com/bliki/ContinuousDelivery.html) for more information.

## Build automation workflows for LUIS

![Continuous integration workflows](./media/luis-concept-devops-automation/luis-automation.png)

In your source code management (SCM) system, you should configure automated build pipelines to run at the following events:

1. **PR workflow** triggered when a [pull request](https://help.github.com/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) is raised. This validate the contents of the PR *before* the updates get merged into the master branch.
1. **CI/CD workflow** triggered when updates are pushed to the master branch, for example upon merging the changes from a PR. This ensures the quality of all updates to the master branch.

The **CI/CD workflow** combines two complementary development processes:

* *Continuous integration (CI)* means that whenever a developer checks in code to the source repository, a build is automatically triggered.
* *Continuous delivery (CD)* takes this one step further: after a build and automated unit tests are successful, you automatically deploy the application to an environment where you can do more in-depth testing.

### Tools for building automation workflows for LUIS

There are different build automation technologies available to create build automation workflows. All of them require that you can perform all necessary functions by scripting steps using a command line interface (CLI) to execute on a build server. Use the following tools for building automation workflows for LUIS:

* [Bot Framework Tools LUIS CLI](https://github.com/microsoft/botbuilder-tools/tree/master/packages/LUIS) to work with LUIS apps and versions, train, test, and publish them within the LUIS service.

* [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to query Azure subscriptions, fetch LUIS authoring and prediction keys, and to create an Azure [service principal](https://docs.microsoft.com/cli/azure/ad/sp?view=azure-cli-latest) used for automation authentication.

* [NLU.DevOps](https://github.com/microsoft/NLU.DevOps) tool for [testing a LUIS app](luis-concept-devops-testing.md) and to analyze test results.

### The PR workflow

As mentioned, you configure this workflow to run when a developer raises a PR to propose changes to be merged from a feature branch into the master branch. Its purpose is to verify the quality of the changes in the PR before they are merged to the master branch.

This workflow should:

* Build a temporary LUIS app by importing the `.lu` source in the PR.
* Train and publish the LUIS app version.
* Run all the [unit tests](luis-concept-devops-testing.md) against it.
* Pass the workflow if all the tests pass, otherwise fail it.
* Deletes the temporary app again.

Ideally, configure branch protection features in your SCM that require that this workflow completes successfully before the PR can be completed.

### The master branch CI/CD workflow

Configure this workflow to run after the updates in the PR have been merged into the master branch. Its purpose is to keep the quality bar high for your master branch, to test the updates, and if they meet the quality bar, to deploy the updated LUIS app to an environment where you can do more in-depth testing.

This workflow should:

* Build a new version in your primary LUIS app (the app you maintain for the master branch) using the updated source code.

* Train and publish the LUIS app version.
  > **Note:** As explained in [Running tests in an automated build workflow](luis-concept-devps-testing.md#Running-tests-in-an-automated-build-workflow) you must publish the LUIS app version under test so that tools such as NLU.DevOps can access it. LUIS only supports two named publication slots, *staging* and *production* for a LUIS app, but you can also [publish a version directly](https://github.com/microsoft/botframework-cli/blob/master/packages/luis/README.md#bf-luisapplicationpublish) and [query by version](https://docs.microsoft.com/azure/cognitive-services/luis/luis-migration-api-v3#changes-by-slot-name-and-version-name). Use direct version publishing in your automation workflows to avoid being limited to using the named publishing slots.

* Run all the [unit tests](luis-concept-devops-testing.md).

* Optionally run [batch tests](luis-concept-devops-testing.md#how-to-do-unit-testing-and-batch-testing) to measure the quality and accuracy of the LUIS app version and compare it to some baseline.

* If the tests complete successfully:
  * Tag the source in the repo.
  * Run the Continuous Delivery (CD) job to deploy the LUIS app version to environments for further testing.

### Continuous delivery (CD)

The CD job in a CI/CD workflow runs conditionally on success of the build and automated unit tests. Its job is to automatically deploy the LUIS application to an environment where you can do more testing. In a straightforward DevOps setup

## Release Management

Generally we recommend that you do continuous delivery to your development and staging environments. Most teams, even at Microsoft, require a manual review and approval process for production deployment. For a production deployment you might want to make sure it happens when key people on the development team are available for support, or during low-traffic periods. But there's nothing to prevent you from completely automating your development and test environments so that all a developer has to do is check in a change and an environment is set up for acceptance testing.

## Next steps

* Learn about [source control for LUIS](luis-concept-devops-sourcecontrol.md)
* Learn about [testing for LUIS DevOps](luis-concept-devops-testing.md)
* Learn how to [implement DevOps for LUIS with GitHub](luis-how-to-implement-devops-using-github.md)
