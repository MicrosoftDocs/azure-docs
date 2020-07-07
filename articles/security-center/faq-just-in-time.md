---
title: Azure Security Center FAQ - Just-in-time virtual machine access
description: Frequently asked questions about Azure Security Center, a product that helps you prevent, detect, and respond to threats
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: be2ab6d5-72a8-411f-878e-98dac21bc5cb
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/07/2020
ms.author: memildin

---

# FAQ - Questions about just in time virtual machine access

## What is just in time virtual machine access
If you're on Security Center's standard pricing tier (see [pricing](/azure/security-center/security-center-pricing)), you can lock down inbound traffic to your Azure VMs with just-in-time (JIT) virtual machine (VM) access. This reduces exposure to attacks while providing easy access to connect to VMs when needed.

Security Center just-in-time VM access currently supports only VMs deployed through Azure Resource Manager. To learn more about the classic and Resource Manager deployment models see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/management/deployment-models.md).

## How do I configure and use just in time virtual machine access?
All the details are in [Secure your management ports with just-in-time access](security-center-just-in-time.md).

## Are redundant JIT rules automatically cleaned up?

Whenever you update a JIT policy, a cleanup tool automatically runs to check the validity of your entire ruleset. The tool looks for mismatches between rules in your policy and rules in the NSG. If the cleanup tool finds a mismatch, it determines the cause and, when it's safe to do so, removes built-in rules that aren't needed any more. The cleaner never deletes rules that you've created.

Examples scenarios when the cleaner might remove a built-in rule:

- When two rules with identical definitions exist and one has a higher priority than the other (meaning, the lower priority rule will never be used)
- When a rule description includes the name of a VM which doesn't match the destination IP in the rule


## What permissions are needed to configure and use JIT?

If you want to create custom roles that can work with JIT, you'll need the following details:

| To enable a user to: | Permissions to set|
| --- | --- |
| Configure or edit a JIT policy for a VM | *Assign these actions to the role:*  <ul><li>On the scope of a subscription or resource group that is associated with the VM:<br/> `Microsoft.Security/locations/jitNetworkAccessPolicies/write` </li><li> On the scope of a subscription or resource group of VM: <br/>`Microsoft.Compute/virtualMachines/write`</li></ul> | 
|Request JIT access to a VM | *Assign these actions to the user:*  <ul><li>On the scope of a subscription or resource group that is associated with the VM:<br/>  `Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action` </li><li>On the scope of a subscription or resource group that is associated with the VM:<br/>  `Microsoft.Security/locations/jitNetworkAccessPolicies/*/read` </li><li>  On the scope of a subscription or resource group or VM:<br/> `Microsoft.Compute/virtualMachines/read` </li><li>  On the scope of a subscription or resource group or VM:<br/> `Microsoft.Network/networkInterfaces/*/read` </li></ul>|
|Read JIT policies| *Assign these actions to the user:*  <ul><li>`Microsoft.Security/locations/jitNetworkAccessPolicies/read`</li><li>`Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action`</li><li>`Microsoft.Security/policies/read`</li><li>`Microsoft.Compute/virtualMachines/read`</li><li>`Microsoft.Network/*/read`</li>|