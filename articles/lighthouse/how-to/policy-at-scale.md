---
title: Deploy Azure Policy to delegated subscriptions at scale
description: Learn how Azure delegated resource management lets you deploy a policy definition and policy assignment across multiple tenants.  
author: JnHs
ms.author: jenhayes
ms.service: lighthouse
ms.date: 11/8/2019
ms.topic: overview
manager: carmonm
---

# Deploy Azure Policy to delegated subscriptions at scale

As a service provider, you may have onboarded multiple customer tenants for Azure delegated resource management. Azure Lighthouse allows service providers to perform operations at scale across several tenants at once, making management tasks more efficient.

This topic shows you how to use Azure Policy to deploy a policy definition and policy assignment across multiple tenants using PowerShell commands. In this example, the policy definition ensures that storage accounts are secured by allowing only HTTPS traffic. 


## Next steps

- Learn about [Azure Policy](https://docs.microsoft.com/azure/governance/policy/).
