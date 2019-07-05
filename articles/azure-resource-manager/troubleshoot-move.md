---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: tomfitz
---

# Troubleshoot moving Azure resources to new resource group or subscription

## When to call Azure support

You can move most resources through the self-service operations shown in this article. Use the self-service operations to:

* Move Resource Manager resources.
* Move classic resources according to the [classic deployment limitations](./move-limitations/classic-deployment-move-limitations.md).

Contact [support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) when you need to:

* Move your resources to a new Azure account (and Azure Active Directory tenant) and you need help with the instructions in the preceding section.
* Move classic resources but are having trouble with the limitations.

## move

1. When possible, break large moves into separate move operations. Resource Manager immediately returns an error when there are more than 800 resources in a single operation. However, moving less than 800 resources may also fail by timing out.

* Azure DevOps - follow steps to [change the Azure subscription used for billing](/azure/devops/organizations/billing/change-azure-subscription?view=azure-devops).