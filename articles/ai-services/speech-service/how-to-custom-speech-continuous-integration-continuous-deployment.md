---
title: CI/CD for Custom Speech - Speech service
titleSuffix: Azure AI services
description: Apply DevOps with Custom Speech and CI/CD workflows. Implement an existing DevOps solution for your own project.
author: nitinme
manager: cmayomsft
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 05/08/2022
ms.author: nitinme
---

# CI/CD for Custom Speech

Implement automated training, testing, and release management to enable continuous improvement of Custom Speech models as you apply updates to training and testing data. Through effective implementation of CI/CD workflows, you can ensure that the endpoint for the best-performing Custom Speech model is always available.

[Continuous integration](/devops/develop/what-is-continuous-integration) (CI) is the engineering practice of frequently committing updates in a shared repository, and performing an automated build on it. CI workflows for Custom Speech train a new model from its data sources and perform automated testing on the new model to ensure that it performs better than the previous model.

[Continuous delivery](/devops/deliver/what-is-continuous-delivery) (CD) takes models from the CI process and creates an endpoint for each improved Custom Speech model. CD makes endpoints easily available to be integrated into solutions.

Custom CI/CD solutions are possible, but for a robust, pre-built solution, use the [Speech DevOps template repository](https://github.com/Azure-Samples/Speech-Service-DevOps-Template), which executes CI/CD workflows using GitHub Actions.

## CI/CD workflows for Custom Speech

The purpose of these workflows is to ensure that each Custom Speech model has better recognition accuracy than the previous build. If the updates to the testing and/or training data improve the accuracy, these workflows create a new Custom Speech endpoint.

Git servers such as GitHub and Azure DevOps can run automated workflows when specific Git events happen, such as merges or pull requests. For example, a CI workflow can be triggered when updates to testing data are pushed to the *main* branch. Different Git Servers will have different tooling, but will allow scripting command-line interface (CLI) commands so that they can execute on a build server.

Along the way, the workflows should name and store data, tests, test files, models, and endpoints such that they can be traced back to the commit or version they came from. It is also helpful to name these assets so that it is easy to see which were created after updating testing data versus training data.

### CI workflow for testing data updates

The principal purpose of the CI/CD workflows is to build a new model using the training data, and to test that model using the testing data to establish whether the [Word Error Rate](how-to-custom-speech-evaluate-data.md#evaluate-word-error-rate) (WER) has improved compared to the previous best-performing model (the "benchmark model"). If the new model performs better, it becomes the new benchmark model against which future models are compared.

The CI workflow for testing data updates should retest the current benchmark model with the updated test data to calculate the revised WER. This ensures that when the WER of a new model is compared to the WER of the benchmark, both models have been tested against the same test data and you're comparing like with like.

This workflow should trigger on updates to testing data and:

- Test the benchmark model against the updated testing data.
- Store the test output, which contains the WER of the benchmark model, using the updated data.
- The WER from these tests will become the new benchmark WER that future models must beat.
- The CD workflow does not execute for updates to testing data.

### CI workflow for training data updates

Updates to training data signify updates to the custom model.

This workflow should trigger on updates to training data and:

- Train a new model with the updated training data.
- Test the new model against the testing data.
- Store the test output, which contains the WER.
- Compare the WER from the new model to the WER from the benchmark model.
- If the WER does not improve, stop the workflow.
- If the WER improves, execute the CD workflow to create a Custom Speech endpoint.

### CD workflow

After an update to the training data improves a model's recognition, the CD workflow should automatically execute to create a new endpoint for that model, and make that endpoint available such that it can be used in a solution.

#### Release management

Most teams require a manual review and approval process for deployment to a production environment. For a production deployment, you might want to make sure it happens when key people on the development team are available for support, or during low-traffic periods.

### Tools for Custom Speech workflows

Use the following tools for CI/CD automation workflows for Custom Speech:

- [Azure CLI](/cli/azure/) to create an Azure service principal authentication, query Azure subscriptions, and store test results in Azure Blob.
- [Azure AI Speech CLI](spx-overview.md) to interact with the Speech service from the command line or an automated workflow.

## DevOps solution for Custom Speech using GitHub Actions

For an already-implemented DevOps solution for Custom Speech, go to the [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template). Create a copy of the template and begin development of custom models with a robust DevOps system that includes testing, training, and versioning using GitHub Actions. The repository provides sample testing and training data to aid in setup and explain the workflow. After initial setup, replace the sample data with your project data.

The [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) provides the infrastructure and detailed guidance to:

- Copy the template repository to your GitHub account, then create Azure resources and a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) for the GitHub Actions CI/CD workflows.
- Walk through the "[dev inner loop](/dotnet/architecture/containerized-lifecycle/design-develop-containerized-apps/docker-apps-inner-loop-workflow)." Update training and testing data from a feature branch, test the changes with a temporary development model, and raise a pull request to propose and review the changes.
- When training data is updated in a pull request to *main*, train models with the GitHub Actions CI workflow.
- Perform automated accuracy testing to establish a model's [Word Error Rate](how-to-custom-speech-evaluate-data.md#evaluate-word-error-rate) (WER). Store the test results in Azure Blob.
- Execute the CD workflow to create an endpoint when the WER improves.

## Next steps

- Use the [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) to implement DevOps for Custom Speech with GitHub Actions.
