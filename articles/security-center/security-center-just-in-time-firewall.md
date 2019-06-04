---
title: Just-in-time (JIT) access for Azure Firewall in Azure Security Center (Preview) | Microsoft Docs
description: This document demonstrates to configure Just-in-time (JIT) access for Azure Firewall in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: de1c7680-e6c6-43d0-99a5-969358115e6d
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/04/2019
ms.author: v-mohabe

---
# Just-In-Time (JIT) access for Azure Firewall in Azure Security Center (Preview)
Learn how to configure Just-In-Time (JIT) access for Azure Firewall in Azure Security Center using this walkthrough.

## What is Just-In-Time (JIT) access in Security Center?
To learn more about JIT in Azure Security Center, click here.

## What is Just-In-Time (JIT) access for Azure Firewall?
Just like JIT on Network Security Groups (NSG), when using Just-In-Time on Azure Firewall, Security Center allows inbound traffic to your Azure VMs only per confirmed request, by creating an Azure Firewall rule (if needed – in addition to NSG rules).

When a user requests access to a VM, Security Center checks that the user has Role-Based Access Control (RBAC) permissions that permit them to successfully request access to a VM. If the request is approved, Security Center automatically configures the Azure Firewall (and NSGs) to allow inbound traffic to the selected ports and requested source IP addresses or ranges, for the amount of time that was specified. After the time has expired, Security Center restores the firewalls and NSGs to their previous states. Those connections that are already established are not being interrupted, however. In addition, when requesting access, Azure Security Center provides you with the right connection details to your machine.

## Using Just-In-Time (JIT) access for Azure Firewall

### Configure JIT policy

Follow Azure Security Center’s Just-in-time access documentation. When configuring JIT Policy, Azure Security Center won’t change your firewall rules.
Request JIT Access to a VM

To request access to a VM:

1. Under Just in time VM access, select Configured.
1. Under VMs, check the VMs that you want to enable just-in-time access for.
1. Select Request access.
    * the icon in the ‘Connection Details’ column indicates whether JIT is enabled on the NSG or FW. If it’s enabled on both, only the Firewall icon appears.
    * The ‘Connection Details’ column provides the correct information required to connect the VM, as well as indicates the opened ports.
1. Under Request access, for each VM, configure the ports that you want to open and the source IP addresses that the port is opened on and the time window for which the port will be open. It will only be possible to request access to the ports that are configured in the just-in-time policy. Each port has a maximum allowed time derived from the just-in-time policy.
1. Select Open ports.

When requested access is approved, Azure Security Center creates high priority rules in your Azure Firewall, allowing inbound traffic through the opened ports to the requested source IPs.


