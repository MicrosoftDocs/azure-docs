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

![Diagram of resource topology](./media/private-link-security/private-link-topology-1.png)

## Planning based on your network

Before setting up your Automation account resource, consider your network isolation requirements. Evaluate your virtual networks' access to public internet, and the access restrictions to your Automation account (including setting up a Private Link Group Scope to Azure Monitor if integrated with your Automation account).

### Evaluate which virtual networks should connect to a Private Link

Start by evaluating which of your virtual networks (VNets) have restricted access to the internet. VNets that have free internet may not require a Private Link to access your Azure Automation account, or Azure Monitor (if integrated with your Automation account). The Automation account resource and Azure Monitor resources your VNets connect to may restrict incoming traffic and require a Private Link connection. In such cases, even a VNet that has access to the public internet needs to connect to these resources over a Private Link.

### Evaluate which Azure Monitor resources should have a Private Link

Review each of your Azure Monitor resources:

- Should the resource allow ingestion of logs from resources located on specific VNets only?
- Should the resource be queried only by clients located on specific VNETs?

If the answer to any of these questions is yes, set the restrictions as explained in [Configuring Log Analytics](#configure-log-analytics) workspaces and [Configuring Application Insights components](#configure-application-insights) and associate these resources to a single or several AMPLS(s). Virtual networks that should access these monitoring resources need to have a Private Endpoint that connects to the relevant AMPLS.
Remember – you can connect the same workspaces or application to multiple AMPLS, to allow them to be reached by different networks.

### Group together monitoring resources by network accessibility

Since each VNet can connect to only one AMPLS resource, you must group together monitoring resources that should be accessible to the same networks. The simplest way to manage this grouping is to create one AMPLS per VNet, and select the resources to connect to that network. However, to reduce resources and improve manageability, you may want to reuse an AMPLS across networks.

For example, if your internal virtual networks VNet1 and VNet2 should connect to workspaces Workspace1 and Workspace2 and Application Insights component Application Insights 3, associate all three resources to the same AMPLS. If VNet3 should only access Workspace1, create another AMPLS resource, associate Workspace1 to it, and connect VNet3 as shown in the following diagrams:

![Diagram of AMPLS A topology](./media/private-link-security/ampls-topology-a-1.png)

![Diagram of AMPLS B topology](./media/private-link-security/ampls-topology-b-1.png)

## Example connection

Start by creating an Azure Monitor Private Link Scope resource.

1. Go to **Create a resource** in the Azure portal and search for **Azure Monitor Private Link Scope**.

   ![Find Azure Monitor Private Link Scope](./media/private-link-security/ampls-find-1c.png)

2. Click **create**.
3. Pick a Subscription and Resource Group.
4. Give the AMPLS a name. It is best to use a name that is clear what purpose and security boundary the Scope will be used for so that someone won't accidentally break network security boundaries. For example, "AppServerProdTelem".
5. Click **Review + Create**. 

   ![Create Azure Monitor Private Link Scope](./media/private-link-security/ampls-create-1d.png)

6. Let the validation pass, and then click **Create**.

## Connect Azure Monitor resources

You can connect your AMPLS first to private endpoints and then to Azure Monitor resources or vice versa, but the connection process goes faster if you start with your Azure Monitor resources. Here's how we connect Azure Monitor Log Analytics workspaces and Application Insights components to an AMPLS

1. In your Azure Monitor Private Link scope, click on **Azure Monitor Resources** in the left-hand menu. Click the **Add** button.
2. Add the workspace or component. Clicking the **Add** button brings up a dialog where you can select Azure Monitor resources. You can browse through your subscriptions and resource groups, or you can type in their name to filter down to them. Select the workspace or component and click **Apply** to add them to your scope.

    ![Screenshot of select a scope UX](./media/private-link-security/ampls-select-2.png)

### Connect to a private endpoint

Now that you have resources connected to your AMPLS, create a private endpoint to connect our network. You can do this task in the [Azure portal Private Link center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/privateendpoints), or inside your Azure Monitor Private Link Scope, as done in this example.

1. In your scope resource, click on **Private Endpoint connections** in the left-hand resource menu. Click on **Private Endpoint** to start the endpoint create process. You can also approve connections that were started in the Private Link center here by selecting them and clicking **Approve**.

    ![Screenshot of Private Endpoint Connections UX](./media/private-link-security/ampls-select-private-endpoint-connect-3.png)

2. Pick the subscription, resource group, and name of the endpoint, and the region it should live in. The region needs to be the same region as the virtual network you will connect it to.

3. Click **Next: Resource**. 

4. In the Resource screen,

   a. Pick the **Subscription** that contains your Azure Monitor Private Scope resource. 

   b. For **resource type**, choose **Microsoft.insights/privateLinkScopes**. 

   c. From the **resource** drop-down, choose your Private Link scope you created earlier. 

   d. Click **Next: Configuration >**.
      ![Screenshot of select Create Private Endpoint](./media/private-link-security/ampls-select-private-endpoint-create-4.png)

5. On the configuration pane,

   a.    Choose the **virtual network** and **subnet** that you want to connect to your Azure Monitor resources. 
 
   b.    Choose **Yes** for **Integrate with private DNS zone**, and let it automatically create a new Private DNS Zone. 
 
   c.    Click **Review + create**.
 
   d.    Let validation pass. 
 
   e.    Click **Create**. 

    ![Screenshot of select Create Private Endpoint2](./media/private-link-security/ampls-select-private-endpoint-create-5.png)

You have now created a new private endpoint that is connected to this Azure Monitor Private Link scope.

## Restrictions and limitations

### Agents

The latest versions of the Log Analytics Windows and Linux agents must be used on private networks to enable secure telemetry ingestion to Log Analytics workspaces. Older versions cannot upload monitoring data in a private network.

**Log Analytics Windows agent**

Use the Log Analytics agent version 10.20.18038.0 or later.

**Log Analytics Linux agent**

Use agent version 1.12.25 or later. If you cannot, run the following commands on your VM.

```cmd
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -X
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <workspace key>
```

### Azure portal

To use Azure Automation portal experiences, you need to allow the Azure portal extension to be accessible on the private networks. Add **AzureActiveDirectory**, **AzureResourceManager**, **AzureFrontDoor.FirstParty**, and **AzureFrontdoor.Frontend** [service tags](../../firewall/service-tags.md) to your firewall.

### Programmatic access

To use the REST API, [CLI](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest) or PowerShell with Azure Automation on private networks, add the [service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)  **AzureActiveDirectory** and **AzureResourceManager** to your firewall.

Adding these tags allows you to perform actions such as view job data, create, and manage other features in your Automation account.

## Next steps

- Learn about [private storage](private-storage.md)
