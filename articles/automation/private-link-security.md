---
title: Use Azure Private Link to securely connect networks to Azure Automation
description: Use Azure Private Link to securely connect networks to Azure Automation
author: mgoedtel
ms.author: magoedte
ms.topic: conceptual
ms.date: 06/22/2020
ms.subservice: 
---

# Use Azure Private Link to securely connect networks to Azure Automation

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, effectively bringing the Automation service into your VNet. Network traffic between the machines on the VNet and the Automation account traverses over the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

For example, you have a VNet where you have disabled outbound internet access. However, you want to access your Automation account privately and use Automation features like Webhooks, DSC and runbook jobs on Hybrid Runbook Workers. Moreover, you want users to have access to the Automation account only through the VNET. This can be achieved by deploying private endpoints.

This article covers when to use and how to set up a private endpoint with your Automation account.

![Conceptual overview of Private Link for Azure Automation](./media/private-link-security/private-endpoints-automation.png)

## Advantages

With Private Link you can:

- Connect privately to Azure Automation without opening up any public network access
- Connect privately to Azure Monitor Log Analytics workspace without opening any public network access

    >[!NOTE]
    >This is required if your Automation account is linked to a Log Analytics workspace to forward job data, and when you have enabled features such as Update Management, Change Tracking and Inventory, State Configuration, or Start/Stop VMs during off-hours. For additional information about Private Link for Azure Monitor, see [Use Azure Private Link to securely connect networks to Azure Monitor](../azure-monitor/platform/private-link-security.md).

- Ensure your Automation data is only accessed through authorized private networks
- Prevent data exfiltration from your private networks by defining your Azure Automation resource that connect through your private endpoint
- Securely connect your private on-premises network to Azure Automation using ExpressRoute and Private Link
- Keep all traffic inside the Microsoft Azure backbone network

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

Azure Automation Private Link connects one or more private endpoints (and therefore the virtual networks they are contained in) to your Automation Account resource. These endpoints are machines using webhooks to start a runbook, machines hosting the Hybrid Runbook Worker role, and DSC nodes.

After you create private endpoints for Automation, each of the public facing Automation URLs, which you or a machine can directly contact, is mapped to one private endpoint in your VNet.

### Webhook scenario

You can start runbooks by doing a POST on the webhook URL. For example, the URL looks like this: `https:// <automationaccountID>.webhooks. <region>. azure-automation.net/webhooks?token= gzGMz4SMpqNo8gidqPxAJ3E%3d`

### State Configuration (agentsvc) scenario

State Configuration provides you with Azure configuration management service that allows you to write, manage, and compile PowerShell Desired State Configuration (DSC) configurations for nodes in any cloud or on-premises datacenter.

The agent on the machine registers with DSC service and then uses the service endpoint to pull DSC configuration. The agent service endpoint looks like this: `https://<automation account ID>.agentsvc. <region>. azure-automation.net`. 

The URL for public & private endpoint would be the same, however, it would be mapped to a private IP address when Private link is enabled.

## Planning based on your network

Before setting up your Automation account resource, consider your network isolation requirements. Evaluate your virtual networks' access to public internet, and the access restrictions to your Automation account (including setting up a Private Link Group Scope to Azure Monitor Logs if integrated with your Automation account).

### Connect to a private endpoint

Create a private endpoint to connect our network. You can do this task in the [Azure portal Private Link center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/privateendpoints). Once your changes to publicNetworkAccess and private link are applied, it can take up to 35 minutes for them to take effect. 

In this section, you'll create a private endpoint for your Automation account.

1. On the upper-left side of the screen, select **Create a resource > Networking > Private Link Center (Preview)**.

2. In **Private Link Center - Overview**, on the option to **Build a private connection to a service**, select **Start**.

3. In **Create a virtual machine - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.  |
    | **INSTANCE DETAILS** |  |
    | Name | Enter your *PrivateEndpoint*. |
    | Region | Select **YourRegion**. |
    |||

4. Select **Next: Resource**.

5. In **Create a private endpoint - Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |Connection method  | Select connect to an Azure resource in my directory.|
    | Subscription| Select your subscription. |
    | Resource type | Select **Microsoft.Automation/automationAccounts**. |
    | Resource |Select *myAutomationAccount*|
    |Target sub-resource |Select *Webhook* or *DSCAndHybridWorker* depending on your scenario.|
    |||

6. Select **Next: Configuration**.

7. In **Create a private endpoint - Configuration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |**NETWORKING**| |
    | Virtual network| Select *MyVirtualNetwork*. |
    | Subnet | Select *mySubnet*. |
    |**PRIVATE DNS INTEGRATION**||
    |Integrate with private DNS zone |Select **Yes**. |
    |Private DNS Zone |Select *(New)privatelink.azure-automation.net* |
    |||

8. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

9. When you see the **Validation passed** message, select **Create**.



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
