---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 08/24/2020
---

 Azure Machine Learning compute clusters also support [managed identities](/azure/active-directory/managed-identities-azure-resources/overview) to authenticate access to Azure resources without including credentials in your code. There are two types of managed identities:

* A **system-assigned managed identity** is enabled directly on the Azure Machine Learning compute cluster and compute instance. The life cycle of a system-assigned identity is directly tied to the compute cluster or instance. If the compute cluster or instance is deleted, Azure automatically cleans up the credentials and the identity in Microsoft Entra ID.
* A **user-assigned managed identity** is a standalone Azure resource provided through Azure Managed Identity service. You can assign a user-assigned managed identity to multiple resources, and it persists for as long as you want. This managed identity needs to be created beforehand and then passed as the identity_id as a required parameter.
