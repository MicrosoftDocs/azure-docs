---
title: Azure Chaos Studio limitations and known issues
description: Understand current limitations and known issues when you use Azure Chaos Studio.
services: chaos-studio
author: prasha-microsoft 
ms.topic: overview
ms.date: 11/02/2021
ms.author: prashabora
ms.service: chaos-studio
---

# Azure Chaos Studio Preview limitations and known issues

During the public preview of Azure Chaos Studio, there are a few limitations and known issues that the team is aware of and working to resolve.

## Limitations

- **Supported regions** - The target resources must be in [one of the regions supported by the Azure Chaos Studio Preview](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio).
- **Resource Move not supported** - Azure Chaos Studio tracked resources (for example, Experiments) currently do NOT support Resource Move. Experiments can be easily copied (by copying Experiment JSON) for use in other subscriptions, resource groups, or regions. Experiments can also already target resources across regions. Extension resources (Targets and Capabilities) do support Resource Move. 
- **VMs require network access to Chaos studio** - For agent-based faults, the virtual machine must have outbound network access to the Chaos Studio agent service:
    - Regional endpoints to allowlist are listed in [Permissions and security in Azure Chaos Studio](chaos-studio-permissions-security.md#network-security).
    - If you're sending telemetry data to Application Insights, the IPs in [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md) are also required.

- **Supported VM operating systems** - If you run an experiment that makes use of the Chaos Studio agent, the virtual machine must run one of the following operating systems:

    - Windows Server 2019, Windows Server 2016, Windows Server 2012, and Windows Server 2012 R2
    - Red Hat Enterprise Linux 8.2, SUSE Enterprise Linux 15 SP2, CentOS 8.2, Debian 10 Buster (with unzip installation required), Oracle Linux 7.8, Ubuntu Server 16.04 LTS, and Ubuntu Server 18.04 LTS
- **Hardened Linux untested** -  The Chaos Studio agent isn't tested against custom Linux distributions or hardened Linux distributions (for example, FIPS or SELinux).
- **Supported browsers** The Chaos Studio portal experience has only been tested on the following browsers:
    * **Windows:** Microsoft Edge, Google Chrome, and Firefox
    * **MacOS:** Safari, Google Chrome, and Firefox

## Known issues
When you pick target resources for an agent-based fault in the experiment designer, it's possible to select virtual machines or virtual machine scale sets with an operating system not supported by the fault selected.

## Next steps
Get started creating and running chaos experiments to improve application resilience with Chaos Studio by using the following links:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Learn more about chaos engineering](chaos-studio-chaos-engineering-overview.md)
