---
title: Use Azure Private Link to securely connect networks to Azure Automation
description: Use Azure Private Link to securely connect networks to Azure Automation
author: mgoedtel
ms.author: magoedte
ms.topic: conceptual
ms.date: 06/08/2020
ms.subservice: 
---

# Use Azure Private Link to securely connect networks to Azure Automation

> [!IMPORTANT]
> At this time, you must **request access** to use this capability. You may apply for access using the [signup form](https://aka.ms/AzMonPrivateLinkSignup).

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure PaaS services to your virtual network using private endpoints. For many services, you just set up an endpoint per resource. This article covers when to use and how to set up a private endpoint with your Automation account.

## Advantages

With Private Link you can:

- Connect privately to Azure Automation without opening up any public network access
- Connect privately to Azure Monitor without opening any public network access

    >[!NOTE]
    >This is required if your Automation account is linked to a Log Analytics workspace to forward job data, and when you have enabled features such as Update Management, Change Tracking and Inventory, State Configuration, or Start/Stop VMs during off-hours. For additional information about Private Link for Azure Monitor, see [Use Azure Private Link to securely connect networks to Azure Monitor](../azure-monitor/platform/private-link-security.md).

- Ensure your Automation data is only accessed through authorized private networks
- Prevent data exfiltration from your private networks by defining your Azure Automation resource that connect through your private endpoint
- Securely connect your private on-premises network to Azure Automation using ExpressRoute and Private Link
- Keep all traffic inside the Microsoft Azure backbone network

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

Azure Automation Private Link connects one or more private endpoints (and therefore the virtual networks they are contained in) to your Automation Account resource. These endpoints are machines using webhooks to start a runbook, machines hosting the Hybrid Runbook Worker role, and DSC nodes.

## Planning based on your network

Before setting up your Automation account resource, consider your network isolation requirements. Evaluate your virtual networks' access to public internet, and the access restrictions to your Automation account (including setting up a Private Link Group Scope to Azure Monitor if integrated with your Automation account).

### Evaluate which virtual networks should connect to a Private Link

Start by evaluating which of your virtual networks (VNets) have restricted access to the internet. VNets that have free internet may not require a Private Link to access your Azure Automation account, or Azure Monitor (if integrated with your Automation account). The Automation account resource and Azure Monitor resources your VNets connect to may restrict incoming traffic and require a Private Link connection. In such cases, even a VNet that has access to the public internet needs to connect to these resources over a Private Link.

### Connect to a private endpoint

Create a private endpoint to connect our network. You can do this task in the [Azure portal Private Link center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/privateendpoints). Once your changes to publicNetworkAccess and private link are applied, it can take up to 35 minutes for them to take effect. 

## Restrictions and limitations

### Agents

The latest versions of the Log Analytics Windows and Linux agents must be used on private networks to enable secure telemetry ingestion to Log Analytics workspaces. Older versions cannot upload monitoring data in a private network. For further information, see [Log Analytics agent restrictions](../azure-monitor/platform/private-link-security.md#agents). 

### Azure portal

To use Azure Automation portal experiences, you need to allow the Azure portal extension to be accessible on the private networks. Add **AzureActiveDirectory**, **AzureResourceManager**, **AzureFrontDoor.FirstParty**, and **AzureFrontdoor.Frontend** [service tags](../../firewall/service-tags.md) to your firewall.

### Programmatic access

To use the REST API, [CLI](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest) or PowerShell with Azure Automation on private networks, add the [service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)  **AzureActiveDirectory** and **AzureResourceManager** to your firewall.

Adding these tags allows you to perform actions such as view job data, create, and manage other features in your Automation account.

## Next steps

- Learn about [private storage](private-storage.md)
