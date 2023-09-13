---
title: Protect your Virtual Machines (VMs) with Microsoft Defender for Servers
description: This tutorial shows you how to configure a just-in-time VM access policy and an application control policy.
ms.topic: tutorial
ms.custom: mvc
ms.date: 06/29/2023

---
# Protect your Virtual Machines (VMs) with Microsoft Defender for Servers

Defender for Servers in Microsoft Defender for Cloud, limits your exposure to threats by using access and application controls to block malicious activity. Just-in-time (JIT) virtual machine (VM) access reduces your exposure to attacks by enabling you to deny persistent access to VMs. Instead, you provide controlled and audited access to VMs only when needed. Adaptive application controls help harden VMs against malware by controlling which applications can run on your VMs. Defender for Cloud uses machine learning to analyze the processes running in the VM and helps you apply allowlist rules using this intelligence.

In this tutorial you'll learn how to:

> [!div class="checklist"]
>
> * Configure a just-in-time VM access policy
> * Configure an application control policy

## Prerequisites

To step through the features covered in this tutorial, you must have Defender for Cloud's enhanced security features enabled. A free trial is available. To upgrade, see [Enable enhanced protections](enable-enhanced-security.md).

## Manage VM access

JIT VM access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

Management ports don't need to be open always. They only need to be open while you're connected to the VM, for example to perform management or maintenance tasks. When just-in-time is enabled, Defender for Cloud uses Network Security Group (NSG) rules, which restrict access to management ports so they can't be targeted by attackers.

Follow the guidance in [Secure your management ports with just-in-time access](just-in-time-access-usage.md).

## Harden VMs against malware

Adaptive application controls help you define a set of applications that are allowed to run on configured resource groups, which among other benefits helps harden your VMs against malware. Defender for Cloud uses machine learning to analyze the processes running in the VM and helps you apply allowlist rules using this intelligence.

Follow the guidance in [Use adaptive application controls to reduce your machines' attack surfaces](adaptive-application-controls.md).

## Next steps

In this tutorial, you learned how to limit your exposure to threats by:

> [!div class="checklist"]
>
> * Configuring a just-in-time VM access policy to provide controlled and audited access to VMs only when needed
> * Configuring an adaptive application controls policy to control which applications can run on your VMs

Advance to the next tutorial to learn about responding to security incidents.

> [!div class="nextstepaction"]
> [Tutorial: Respond to security incidents](tutorial-security-incident.md)
