---
title: Develop apps for Azure Stack | Microsoft Docs
description: Development considerations for prototyping applications on Azure Stack
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: d3ebc6b1-0ffe-4d3e-ba4a-388239d6cdc3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/19/2018
ms.author: sethm
ms.reviewer: 

---
# Develop for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can get started developing applications today, even if you don't have access to an Azure Stack environment. Because Azure Stack delivers Microsoft Azure services that run in your datacenter, you can use similar tools and processes to develop against Azure Stack as you would with Azure. 

## Development considerations

With some preparation, and using the guidance in the following topics, you can use Azure to emulate an Azure Stack environment.

* In Azure, you can create Azure Resource Manager templates that are deployable to Azure Stack. See [template considerations](azure-stack-develop-templates.md) for guidance on developing templates to ensure portability.
* There are differences in service availability and service versioning between Azure and Azure Stack. You can use the [Azure Stack policy module](azure-stack-policy-module.md) to restrict Azure service availability and resource types to what's available in Azure Stack. Constraining services ensures that your applications rely on services available to Azure Stack.
* The [Azure Stack Quickstart Templates](https://github.com/Azure/AzureStack-QuickStart-Templates) are common scenario examples that show how to develop templates that can be deployed to Azure and Azure Stack.

## Next steps

For more information about Azure Stack development, see the following articles:

- [Azure Resource Manager template best practices](azure-stack-develop-templates.md)
- [Azure Stack Quickstart Templates](https://github.com/Azure/AzureStack-QuickStart-Templates)