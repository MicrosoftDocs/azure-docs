---
title: Azure Security Center FAQ - questions about virtual machines
description: Frequently asked questions about virtual machines in Azure Security Center, a product that helps you prevent, detect, and respond to threats
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
ms.date: 02/25/2020
ms.author: memildin

---


# FAQ - Questions about virtual machines


## What types of virtual machines are supported?

Monitoring and recommendations are available for virtual machines (VMs) created using both the [classic and Resource Manager deployment models](../azure-classic-rm.md).

See [Supported platforms in Azure Security Center](security-center-os-coverage.md) for a list of supported platforms.


## Why doesn't Azure Security Center recognize the antimalware solution running on my Azure VM?

Azure Security Center has visibility into antimalware installed through Azure extensions. For example, Security Center is not able to detect antimalware that was pre-installed on an image you provided or if you installed antimalware on your virtual machines using your own processes (such as configuration management systems).


## Why do I get the message "Missing Scan Data" for my VM?

This message appears when there is no scan data for a VM. It can take some time (less than an hour) for scan data to populate after Data Collection is enabled in Azure Security Center. After the initial population of scan data, you may receive this message because there is no scan data at all or there is no recent scan data. Scans do not populate for a VM in a stopped state. This message could also appear if scan data has not populated recently (in accordance with the retention policy for the Windows agent, which has a default value of 30 days).


## How often does Security Center scan for operating system vulnerabilities, system updates, and endpoint protection issues?

Below are the latency times for Security Center scans of vulnerabilities, updates, and issues:

- Operating system security configurations – data is updated within 48 hours
- System updates – data is updated within 24 hours
- Endpoint Protection issues – data is updated within 8 hours

Security Center typically scans for new data every hour, and refreshes the recommendations accordingly. 

> [!NOTE]
> Security Center uses the Log Analytics agent to collect and store data. To learn more, see [Azure Security Center Platform Migration](security-center-platform-migration.md).


## Why do I get the message "VM Agent is Missing?"

The VM Agent must be installed on VMs to enable Data Collection. The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. For information on how to install the VM Agent on other VMs, see the blog post [VM Agent and Extensions](https://azure.microsoft.com/blog/vm-agent-and-extensions-part-2/).