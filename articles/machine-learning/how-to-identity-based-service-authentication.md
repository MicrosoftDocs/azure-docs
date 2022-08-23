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
	
Learn how to set up inter-service authentication between the services used by Azure Machine Learning. 

## Prerequisites

* The [Azure Machine Learning SDK v2](https://aka.ms/sdk-v2-install).

    > [!IMPORTANT]
    > SDK v2 is currently in public preview.
    > The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
    > For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* Install the [Azure CLI](/cli/azure/install-azure-cli).

## Default configuration

| Service | Defaults |
| ----- | ----- |
| Azure ML workspace | Uses a system-assigned managed identity to access other services. |
| Azure ML compute cluster | Uses a system-assigned managed identity to access data stores configured for identity-based access. |
| Azure Container Registry | When created by Azure ML, the admin user is enabled. |
| Azure Storage Account | Azure ML uses key-based access to the default storage account. Keys are stored in Azure Key Vault. |


