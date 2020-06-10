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

# Continuous integration and continuous deployment with Custom Speech

Follow best practices around automated training, testing, and release management to steadily improve Custom Speech models as you update the training and testing data. Not only will *master* always be shippable, but the latest commit in *master* will always represent the best-performing Custom Speech model at the time.

[Continuous integration](https://docs.microsoft.com/en-us/azure/devops/learn/what-is-continuous-integration) (CI) is the engineering practice of frequently committing updates in a shared repository, and automatically training new models for each of those updates. Paired with an automated testing approach, CI allows us also to test the new model and, not only can we verify that the model still trains correctly from its data source, but we can also ensure that each Custom Speech models is better than the last.

[Continuous delivery](https://docs.microsoft.com/en-us/azure/devops/learn/what-is-continuous-delivery) (CD) takes models created in the CI process and creates an endpoint for each improved Custom Speech model. CD makes endpoints easily available to be manually put into production.

Infinite CI/CD solutions are possible, but for a robust, pre-built solution, use the [Speech DevOps template repository](https://github.com/Azure-Samples/Speech-Service-DevOps-Template), which executes CI/CD workflows using GitHub Actions.

## CI/CD workflow for Custom Speech

The purpose of this workflow is to ensure that each Custom Speech model has better recognition accuracy than all the previous models. If the updates to the testing and/or training data meet the quality bar, this workflow creates a new Custom Speech endpoint.

Certain Git servers such as GitHub and Azure DevOps can run automated and customized workflows any time certain Git events happen, such as merges or pull requests. Using a Git server that supports it, configure a CI/CD workflow to trigger when updates to your Custom Speech model's testing and training data are pushed to the *master* branch.

Different automation technologies will have different tooling, but all of them require that you can script steps using a command-line interface (CLI) so that they can execute on a build server.

### Tools for Speech automation

Use the following tools for CI/CD automation workflows for Speech:

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) to create an Azure service principal authentication, query Azure subscriptions, and store test results in Azure Blob.
- [Azure Speech CLI](https://github.com/msimecek/Azure-Speech-CLI) to interact with the Speech Service from the command line.

### CI workflow for testing data updates

The workflow for updates to test data retests the benchmark model to calculate the new benchmark Word Error Rate (WER) based on the updated test data. This ensures that when the WER of any new models is compared with the WER of the benchmark, both models have been tested against the same test data.

Using the tools above, this workflow should trigger on updates to testing data and:

- Test the benchmark model against the updated testing data.
- Store the JSON test output.
    - This output contains `resultsUrl`, whose value is a valid URL for 72 hours after it is last accessed. The text file at this URL contains valuable information about individual transcriptions and should also be stored.
- The output also contains `wordErrorRate`, which is an industry-standard metric to measure recognition accuracy.
- Regardless of the WER, the WER from these tests will become the benchmark WER that future models must beat.
- The CD workflow does not execute for updates to testing data.

Along the way, the workflow should name and store test output such that you can always trace the back to the commit or version they came from. It is also helpful to name assets in such a way that delineates assets created from testing data updates versus updates to training data.

### CI workflow for training data updates

Updates to training data signify updates to the custom model and should .

Using the tools above, this workflow should trigger on updates to training data and:

- Train a new model with the updated training data.
- Test the new model against the updated testing data.
- Store the JSON test output.
    - This output contains `resultsUrl`. The text file at this URL should also be stored.
- The output also contains `wordErrorRate`.
- Compare the WER from the new model to the WER from the benchmark model.
- If the WER does not improve, stop the workflow.
- If the WER improves, execute the CD workflow to create a Custom Speech endpoint.

This workflow should name and store test output and models with traceability in mind. Again, name the assets to delineates assets created from testing data updates versus updates to training data.

### CD workflow

After an update to the training data improves a model's recognition, the CD workflow should automatically execute to create a new endpoint from the benchmark model trained in the CI workflow, and make this endpoint available such that it can manually be used in a client application at any given point.

#### Release management

Most teams require a manual review and approval process for deployment to a production environment. For a production deployment, you might want to make sure it happens when key people on the development team are available for support, or during low-traffic periods.

## Next steps

- Learn how to implement [DevOps for Custom Speech with GitHub Actions](how-to-devops-with-github.md)
