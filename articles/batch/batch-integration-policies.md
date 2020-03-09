---
title: Integration with Azure Policies - Azure Batch | Microsoft Docs
description: 
services: batch
documentationcenter: ''
author: LauraBrenner
manager: evansma
editor: ''

ms.assetid: 28998df4-8693-431d-b6ad-974c2f8db5fb
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/24/2020
ms.author: labrenne
ms.custom: seodec18

---

# Integration with Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce rules over your resources to ensure those resources remain compliant with your corporate standards and service level agreements. Azure Policy evaluates your resources for non-compliance with the policies you assign. 

Azure Batch has two built-in extensions to help you manage policy compliance. 

|**Name**...|	**Description**|**Effect(s)**|	**Version**|	**Source**
|----------------|----------|----------|----------------|---------------|
|Diagnostic logs in Batch accounts should be enabled|	Audit enabling of diagnostic logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised|AuditIfNotExists, Disabled|	2.0.0|	GitHub|
|Metric alert rules should be configured on Batch accounts|	Audit configuration of metric alert rules on Batch account to enable the required metric|	AuditIfNotExists, Disabled|	1.0.0|	GitHub|

Policy definitions describe the conditions that need to be met. A condition compares the resource property to a required value. Resource property fields are accessed using pre-defined aliases.You use property aliases to access specific properties for a resource type. Aliases enable you to restrict what values or conditions are allowed for a property on a resource. Each alias maps to paths in different API versions for a given resource type. During policy evaluation, the policy engine gets the property path for that API version.

The resources required by Batch include: account, compute node, pool, job, and task. So, you would use property aliases to access specific properties for these resources. Learn more about [Aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

To make sure you know the current aliases and review your resources and policies, use the Azure policy extension for Visual Studio Code. It can be installed on all platforms that are supported by Visual Studio Code. This support includes Windows, Linux, and macOS. See [installation guidelines](https://docs.microsoft.com/azure/governance/policy/how-to/extension-for-vscode).



