---
title: How to apply DevOps with GitHub - LUIS
titleSuffix: Azure Cognitive Services
description: Apply DevOps with Language Understanding (LUIS) and GitHub.
services: cognitive-services
author: andycw
manager: cmayo
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 06/5/2020
ms.author: andycw
---

# Apply DevOps using GitHub Actions

Go to the [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template]) for a complete solution template for the application of professional software engineering fundamentals and DevOps practices with LUIS. You can use this template repo to implement DevOps practices with LUIS with your own project.

The [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template]) walks through how to:

* **Clone the template repo** - Copy the template to your own GitHub repository.
* **Configure LUIS authoring and prediction resources** - Create the [LUIS authoring and prediction resources in Azure](\<link-to-relevant-conceptual-topic\>) that will be used by the continuous integration workflows .
* **Get an authorization token for the CI/CD workflows to sign into Azure** - Configure a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object)** and get the [token that is used by the continuous integration (CI) and continuous delivery (CD) workflows](\<link-to-relevant-conceptual-topic\>) to sign into Azure .
* **Configure the CI/CD workflows** - Configure [parameters for the CI/CD workflows](\<link-to-relevant-conceptual-topic\>) and store them in [GitHub Secrets](https://help.github.com/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).
* **Walks through the ["dev inner loop"](https://mitchdenny.com/the-inner-loop/)** - The developer makes [updates to a LUIS app while working in a development branch](\<link-to-relevant-conceptual-topic\>), [tests the updates](\<link-to-relevant-conceptual-topic\>) and then [raises a pull request to propose changes](\<link-to-relevant-conceptual-topic\>) and to seek review approval.
* **Execute CI/CD workflows** - Execute GitHub Actions [workflows to build and test a LUIS app](\<link-to-relevant-conceptual-topic\>).
* **Perform batch testing** - Execute [automated batch testing for a LUIS app](\<link-to-relevant-conceptual-topic\>) to evaluate the quality of the app.
* **Deploy the LUIS app** - Execute a [continuous delivery (CD) job](\<link-to-relevant-conceptual-topic\>) in a GitHub Action workflow to [publish the LUIS app](\<link-to-relevant-conceptual-topic\>).

## Next steps

* Use the [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template]) to apply DevOps with your own project.
* [Source control and branch strategies for LUIS](#source-control-and-branch-strategies-for-luis)
* [Testing for LUIS DevOps](luis-concept-devops-testing.md)
* [Automation workflows for LUIS DevOps](luis-concept-devops-automation.md)
* [Release management](luis-concept-devops-release-management.md)