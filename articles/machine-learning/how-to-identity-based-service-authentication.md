---
title: Set up authentication
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication for various resources and workflows in Azure Machine Learning.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.date: 07/18/2022
ms.topic: how-to
ms.custom: has-adal-ref, devx-track-js, contperf-fy21q2, subject-rbac-steps, cliv2, sdkv2, event-tier1-build-2022
---

# Set up authentication between Azure ML and other services
	
Azure Machine Learning is composed of multiple Azure services. There are multiple ways that authentication can happen between Azure Machine Learning and the services it relies on.


* The Azure Machine Learning workspace uses a __managed identity__ to communicate with other services. By default, this is a system-assigned managed identity. You can also use a user-assigned managed identity instead.
* The Azure ML compute cluster uses a __managed identity__ to retrieve connection information for datastores from Azure Key Vault. You can also configure identity-based access to datastores, which will instead use the managed identity of the compute cluster.
* Azure Machine Learning uses Azure Container Registry (ACR) to store Docker images used to train and deploy models. If you allow Azure ML to automatically create ACR, it will enable the __admin account__.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create workspace resources](quickstart-create-resources.md).
* The [Azure Machine Learning SDK v2](https://aka.ms/sdk-v2-install).

    > [!IMPORTANT]
    > SDK v2 is currently in public preview.
    > The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
    > For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* Install the [Azure CLI](/cli/azure/install-azure-cli).
* To assign roles, the login for your Azure subscription must have the [Managed Identity Operator](../role-based-access-control/built-in-roles.md#managed-identity-operator) role, or other role that grants the required actions (such as __Owner__).
* You must be familiar with creating and working with [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).




