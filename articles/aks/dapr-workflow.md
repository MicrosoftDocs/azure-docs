---
title: Manage workflows with the Dapr extension for Azure Kubernetes Service (AKS)
description: Learn how to run and manage Dapr Workflow on your Azure Kubernetes Service (AKS) clusters via the Dapr extension.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nuversky
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 03/02/2023
ms.custom: devx-track-azurecli
---

# Manage workflows with the Dapr extension for Azure Kubernetes Service (AKS)

With the Dapr Workflow API, you can easily orchestrate messaging, state management, and failure-handling logic across various microservices. Dapr Workflow can help you create long-running, fault-tolerant, and stateful applications. 

In this guide, you'll use the [provided order processing workflow example][dapr-workflow-sample] to:

> [!div class="checklist"]
> - Install the Dapr extension on your AKS cluster.
> - Deploy the sample application to AKS. 
> - Start and query workflow instances using API calls.

The workflow example is an ASP.NET Core project with:
- A [`Program.cs` file][dapr-program] that contains the setup of the app, including the registration of the workflow and workflow activities.
- Workflow definitions found in the [`Workflows` directory][dapr-workflow-dir].
- Workflow activity definitions found in the [`Activities` directory][dapr-activities-dir].

> [!NOTE]
> Dapr Workflow is currently an [alpha][dapr-workflow-alpha] feature and is on a self-service, opt-in basis. Alpha Dapr APIs and components are provided "as is" and "as available," and are continually evolving as they move toward stable status. Alpha APIs and components are not covered by customer support.

## Pre-requisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Install the latest version of the [Azure CLI][install-cli].
- If you don't have one already, create an [AKS cluster][deploy-cluster].
- Make sure you have [an Azure Kubernetes Service RBAC Admin role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-rbac-admin) 
- Install .NET 6+
- Install Docker

## Set up the environment

Clone the example workflow application.

```sh
git clone https://github.com/shubham1172/dapr-workflows-aks-sample.git
```

Navigate to the root directory.

```sh
cd dapr-workflows-aks-sample
```

## Prepare the Docker image

When getting ready to build and push the Docker image, make sure you're logged into ghcr.io

## Deploy to AKS

## Run the workflow

## Clean up resources

## Next steps

<!-- Links Internal -->


<!-- Links External -->
[dapr-workflow-sample]: https://github.com/shubham1172/dapr-workflows-aks-sample
[dapr-program]: https://github.com/shubham1172/dapr-workflows-aks-sample/blob/main/Program.cs
[dapr-workflow-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Workflows
[dapr-activities-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Activities
[dapr-workflow-alpha]: https://docs.dapr.io/operations/support/support-preview-features/#current-preview-features
