---
title: Container support
titleSuffix: Azure Cognitive Services
description: Learn how to create an azure kubernetes (AKS) resource.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 7/3/2019
ms.author: dapine
---

## Create an Azure Kubernetes Service (AKS) cluster resource

1. Go to the [Create](https://ms.portal.azure.com/#create/microsoft.aks) for Kubernetes Services.

1. On the **Basics** tab, enter the following details:

    |Setting|Value|
    |--|--|
    |Subscription|Select appropriate subscription|
    |Resource group|Select an available resource group|
    |Kubernetes cluster name|Desired name (lowercase)|
    |Region|Select a nearby location|
    |Kubernetes version|1.12.8 (default)|
    |DNS name prefix|Created automatically, but can optionally override|
    |Node size|Standard DS2 v2:<br>`2 vCPUs`, `7 GB`|
    |Node count|Leave the slider at the default value|

1. On the **Scale** tab, leave the *virtual nodes* and *virtual machine scale sets* default values.
1. On the **Authentication** tab, leave *Service principal* and *Enable RBAC* default values.
1. On the **Networking** tab, enter the following selections:

    |Setting|Value|
    |--|--|
    |HTTP application routing|No|
    |Networking configuration|Basic|

1. On the **Monitoring** tab, ensure that *Enable container monitoring* is set to **Yes** and leave the *Log Analytics workspace* as its default value
1. On the **Tags** tab, leave the name/value pairs blank for now.
1. Click **Review and Create**.
1. After validation passes, click **Create**.

> [!NOTE]
> If validation fails, it may be due a *Service principal* error. Navigate back to the *Authentication* tab, then back to *Review + create* where validation should execute and then pass.
