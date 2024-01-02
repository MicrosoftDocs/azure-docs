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

# Azure Chaos Studio limitations and known issues

The following are known limitations in Chaos Studio. 

## Limitations

- **Supported regions** - The target resources must be in [one of the regions supported by the Azure Chaos Studio](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio).
- **Resource Move not supported** - Azure Chaos Studio tracked resources (for example, Experiments) currently do NOT support Resource Move. Experiments can be easily copied (by copying Experiment JSON) for use in other subscriptions, resource groups, or regions. Experiments can also already target resources across regions. Extension resources (Targets and Capabilities) do support Resource Move. 
- **VMs require network access to Chaos studio** - For agent-based faults, the virtual machine must have outbound network access to the Chaos Studio agent service:
    - Regional endpoints to allowlist are listed in [Permissions and security in Azure Chaos Studio](chaos-studio-permissions-security.md#network-security).
    - If you're sending telemetry data to Application Insights, the IPs in [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md) are also required.

- **Supported VM operating systems** - If you run an experiment that makes use of the Chaos Studio agent, the virtual machine must run one of the following operating systems:

    - Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2
    - Red Hat Enterprise Linux 8, Red Hat Enterprise Linux 8.2, openSUSE Leap 15.2, CentOS 8, Debian 10 Buster (with unzip installation required), Oracle Linux 8.3, and Ubuntu Server 18.04 LTS
- **Hardened Linux untested** -  The Chaos Studio agent isn't currently tested against custom Linux distributions or hardened Linux distributions (for example, FIPS or SELinux).
- **Supported browsers** - The Chaos Studio portal experience has only been tested on the following browsers:
    * **Windows:** Microsoft Edge, Google Chrome, and Firefox
    * **MacOS:** Safari, Google Chrome, and Firefox
- **Terraform** - Chaos Studio doesn't support Terraform at this time.
- **PowerShell modules** - Chaos Studio doesn't have dedicated PowerShell modules at this time. For PowerShell, use our REST API
- **Azure CLI** - Chaos Studio doesn't have dedicated AzCLI modules at this time. Use our REST API from AzCLI
- **Azure Policy** - Chaos Studio doesn't support the applicable built-in policies for our service (audit policy for customer-managed keys and Private Link) at this time. 
- **Private Link** To use Private Link for Agent Service, you need to have your subscription allowlisted and use our preview API version. We don't support Azure portal UI experiments for Agent-based experiments using Private Link. These restrictions do NOT apply to our Service-direct faults
- **Customer-Managed Keys** You need to use our 2023-10-27-preview REST API via a CLI to create CMK-enabled experiments. We don't support portal UI experiments using CMK at this time.
- **Lockbox** At present, we don't have integration with Customer Lockbox.
- **Java SDK** At present, we don't have a dedicated Java SDK. If this is something you would use, reach out to us with your feature request. 
- **Built-in roles** - Chaos Studio doesn't currently have its own built-in roles. Permissions can be attained to run a chaos experiment by either assigning an [Azure built-in role](chaos-studio-fault-providers.md) or a created custom role to the experiment's identity.
- **Agent Service Tags** Currently we don't have service tags available for our Agent-based faults. 

## Known issues
- When selecting target resources for an agent-based fault in the experiment designer, it's possible to select virtual machines or virtual machine scale sets with an operating system not supported by the fault selected.
- When running in a Linux environment, the agent-based network latency fault (NetworkLatency-1.1) can only affect **outbound** traffic, not inbound traffic. The fault can affect **both inbound and outbound** traffic on Windows environments (via the `inboundDestinationFilters` and `destinationFilters` parameters).

## Next steps
Get started creating and running chaos experiments to improve application resilience with Chaos Studio by using the following links:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Learn more about chaos engineering](chaos-studio-chaos-engineering-overview.md)
