---
title: Continuous integration and continuous deployment with Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Apply DevOps with Speech and CI/CD workflows running on GitHub Actions.
services: cognitive-services
author: kaprochi
manager: cmayo
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/09/2020
ms.author: kaprochi
---

# Continuous integration and deployment with Custom Speech

Follow best practices for automated training, testing, and release management to steadily improve Custom Speech models as you update the training and testing data. Using these best practices, it will always be possible to access and use the best performing endpoint
 the best-performing Custom Speech model.

[Continuous integration](https://docs.microsoft.com/azure/devops/learn/what-is-continuous-integration) (CI) is the engineering practice of frequently committing updates in a shared repository, and automatically training new models for each of those updates. Paired with automated testing, CI workflows test the new model, verify the model trains as expected from its data sources, ensures each model performs better than the previous model, and creates a Custom Speech endpoint for each improved model.

[Continuous delivery](https://docs.microsoft.com/azure/devops/learn/what-is-continuous-delivery) (CD) takes models from the CI process and creates an endpoint for each improved Custom Speech model. CD makes endpoints easily available to be manually integrated into solutions.

Custom CI/CD solutions are possible, but for a robust, pre-built solution, use the [Speech DevOps template repository](https://github.com/Azure-Samples/Speech-Service-DevOps-Template), which executes CI/CD workflows using GitHub Actions.

## CI/CD workflow for Custom Speech

The purpose of this workflow is to ensure that each Custom Speech model has better recognition accuracy than the accuracy benchmark. If the updates to the testing and/or training data improve the accuracy, these workflows create a new Custom Speech endpoint.

Git servers such as GitHub and Azure DevOps can run automated workflows when specific Git events happen, such as merges or pull requests. For example, a CI/CD workflow can be triggered when updates to testing and training data are pushed to the master branch. Different Git Servers will have different tooling, but will allow scripting command-line interface (CLI) commands so that they can execute on a build server.

### Tools for Custom Speech automation

Use the following tools for CI/CD automation workflows for Custom Speech:

- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to create an Azure service principal authentication, query Azure subscriptions, and store test results in Azure Blob.
- [Azure Speech CLI](https://github.com/msimecek/Azure-Speech-CLI) to interact with the Speech Service from the command line or an automated workflow.

### CI workflow for testing data updates

The workflow for updates to test data should retest the benchmark model to calculate the new benchmark [Word Error Rate](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-speech-evaluate-data) (WER) based on the updated test data. This ensures that when the WER of a new model is compared to the WER of the benchmark, both models have been tested against the same test data.

Using the tools above, this workflow should trigger on updates to testing data and:

- Test the benchmark model against the updated testing data.
- Store the test output, which contains the WER which is an industry-standard metric to measure recognition accuracy.
- Regardless of the WER, the WER from these tests will become the benchmark WER that future models must beat.
- The CD workflow does not execute for updates to testing data.

Along the way, the workflow should name and store test output such that you can always trace the back to the commit or version they came from. It is also helpful to name assets in such a way that delineates assets created from testing data updates versus updates to training data.

### CI workflow for training data updates

Updates to training data signify updates to the custom model.

Using the tools above, this workflow should trigger on updates to training data and:

- Train a new model with the updated training data.
- Test the new model against the testing data.
- Store the test output, which contains the WER.
- Compare the WER from the new model to the WER from the benchmark model.
- If the WER does not improve, stop the workflow.
- If the WER improves, execute the CD workflow to create a Custom Speech endpoint.

This workflow should name and store test output and models with traceability in mind. Again, name the assets to delineates assets created from testing data updates versus updates to training data.

### CD workflow

After an update to the training data improves a model's recognition, the CD workflow should automatically execute to create a new endpoint for that model, and make that endpoint available such that it can be used in a solution.

#### Release management

Most teams require a manual review and approval process for deployment to a production environment. For a production deployment, you might want to make sure it happens when key people on the development team are available for support, or during low-traffic periods.

## Next steps

- Learn how to implement [DevOps for Custom Speech with GitHub Actions](how-to-devops-with-github.md)
