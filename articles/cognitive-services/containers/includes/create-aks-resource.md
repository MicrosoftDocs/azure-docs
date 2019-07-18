---
title: Create an Azure Kubernetes Service cluster resource
titleSuffix: Azure Cognitive Services
description: Learn how to create an Azure Kubernetes Service (AKS) resource.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 7/3/2019
ms.author: dapine
---

## Create an Azure Kubernetes Service cluster resource

1. Go to [Azure Kubernetes Service](https://ms.portal.azure.com/#create/microsoft.aks) and select **Create**.

1. On the **Basics** tab, enter the following information:

    |Setting|Value|
    |--|--|
    |Subscription|Select an appropriate subscription|
    |Resource group|Select an available resource group|
    |Kubernetes cluster name|Enter a name (lowercase)|
    |Region|Select a nearby location|
    |Kubernetes version|1.12.8 (default)|
    |DNS name prefix|Created automatically, but you can override|
    |Node size|Standard DS2 v2:<br>`2 vCPUs`, `7 GB`|
    |Node count|Leave the slider at the default value|

1. On the **Scale** tab, leave **Virtual nodes** and **Virtual machine scale sets (preview)** set to the default values.
1. On the **Authentication** tab, leave **Service principal** and **Enable RBAC** set to the default values.
1. On the **Networking** tab, enter the following selections:

    |Setting|Value|
    |--|--|
    |HTTP application routing|No|
    |Networking configuration|Basic|

1. On the **Monitoring** tab, make sure that **Enable container monitoring** is set to **Yes**, and leave **Log Analytics workspace** as the default value.
1. On the **Tags** tab, leave the name/value pairs blank for now.
1. Select **Review and Create**.
1. After validation passes, select **Create**.

> [!NOTE]
> If validation fails, it may be due a "Service principal" error. Go back to the **Authentication** tab and then back to **Review + create**, where validation should run and then pass.
