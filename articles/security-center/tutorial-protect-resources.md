---
title: Access & application controls tutorial - Azure Security Center
description: This tutorial shows you how to configure a just-in-time VM access policy and an application control policy.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/03/2018
ms.author: memildin

---
# Tutorial: Protect your resources with Azure Security Center
Security Center limits your exposure to threats by using access and application controls to block malicious activity. Just-in-time (JIT) virtual machine (VM) access reduces your exposure to attacks by enabling you to deny persistent access to VMs. Instead, you provide controlled and audited access to VMs only when needed. Adaptive application controls help harden VMs against malware by controlling which applications can run on your VMs. Security Center uses machine learning to analyze the processes running in the VM and helps you apply allow listing rules using this intelligence.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Configure a just-in-time VM access policy
> * Configure an application control policy

## Prerequisites
To step through the features covered in this tutorial, you must have Azure Defender enabled. You can try Azure Defender at no cost. For more information, see [Try Azure Defender](security-center-pricing.md).

## Manage VM access
JIT VM access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

Management ports do not need to be open at all times. They only need to be open while you are connected to the VM, for example to perform management or maintenance tasks. When just-in-time is enabled, Security Center uses Network Security Group (NSG) rules, which restrict access to management ports so they cannot be targeted by attackers.

Follow the guidance in [Secure your management ports with just-in-time access](security-center-just-in-time.md).

## Harden VMs against malware
Adaptive application controls help you define a set of applications that are allowed to run on configured resource groups, which among other benefits helps harden your VMs against malware. Security Center uses machine learning to analyze the processes running in the VM and helps you apply allow listing rules using this intelligence.

Follow the guidance in [Use adaptive application controls to reduce your machines' attack surfaces](security-center-adaptive-application.md).

## Next steps
In this tutorial, you learned how to limit your exposure to threats by:

> [!div class="checklist"]
> * Configuring a just-in-time VM access policy to provide controlled and audited access to VMs only when needed
> * Configuring an adaptive application controls policy to control which applications can run on your VMs

Advance to the next tutorial to learn about responding to security incidents.

> [!div class="nextstepaction"]
> [Tutorial: Respond to security incidents](tutorial-security-incident.md)

<!--Image references-->
[1]: ./media/tutorial-protect-resources/just-in-time-vm-access.png
[2]: ./media/tutorial-protect-resources/add-port.png
[3]: ./media/tutorial-protect-resources/adaptive-application-control-options.png
[4]: ./media/tutorial-protect-resources/recommended-resource-groups.png
