---
title: Connect to Azure virtual networks from Azure Logic Apps through an integration service environment (ISE)
description: Create an integration service environment (ISE) so logic apps and integration accounts can access Azure virtual networks (VNETs), while staying private and isolated from public or "global" Azure
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 02/26/2019
---

# Connect to Azure virtual networks from Azure Logic Apps by using an integration service environment (ISE)

> [!NOTE]
> This capability is in 
> [*public preview*](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For scenarios where your logic apps and integration accounts need access to an 
[Azure virtual network](../virtual-network/virtual-networks-overview.md), create an 
[*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). 
An ISE is a private and isolated environment that uses dedicated storage and other 
resources kept separate from the public or "global" Logic Apps service. This separation 
also reduces any impact that other Azure tenants might have on your apps' performance. 
Your ISE is *injected* into to your Azure virtual network, which then deploys the Logic Apps 
service into your virtual network. When you create a logic app or integration account, 
select this ISE as their location. Your logic app or integration account can then directly 
access resources, such as virtual machines (VMs), servers, systems, and services, in your virtual network.

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment/select-logic-app-integration-service-environment.png)

This article shows how to complete these tasks:

* Set up ports on your Azure virtual network so traffic 
can travel through your integration service environment 
(ISE) across subnets in your virtual network.

* Set up permissions on your Azure virtual network so the 
private Logic Apps instance can access your virtual network.

* Create your integration service environment (ISE).

* Create a logic app that can run in your ISE.

* Create an integration account for your logic apps in your ISE.

For more information about integration service environments, see 
[Access to Azure Virtual Network resources from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

  > [!IMPORTANT]
  > Logic apps, built-in actions, and connectors that run in your ISE use 
  > a different pricing plan, not the consumption-based pricing plan. 
  > For more information, see [Logic Apps pricing](../logic-apps/logic-apps-pricing.md).

* An [Azure virtual network](../virtual-network/virtual-networks-overview.md). 
If you don't have a virtual network, learn how to 
[create an Azure virtual network](../virtual-network/quick-create-portal.md). 
You also need subnets in your virtual network for deploying your ISE. You can 
create these subnets in advance, or wait until you create your ISE where you 
can create subnets at the same time. Also, [make sure your virtual network makes these ports available](#ports) so your ISE works correctly and stays accessible.

* To give your logic apps direct access to your Azure virtual network, 
[set up your network's Role-Based Access Control (RBAC) permissions](#vnet-access) 
so the Logic Apps service has the permissions for accessing your virtual network.

* To use one or more custom DNS servers for deploying your Azure virtual network, 
[set up those servers following this guidance](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) 
before deploying your ISE to your virtual network. 
Otherwise, each time you change your DNS server, 
you also have to restart your ISE, which is a 
capability that's available with ISE public preview.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

<a name="ports"></a>

## Set up network ports

To work correctly and stay accessible, your integration 
service environment (ISE) needs to have specific ports 
available on your virtual network. Otherwise, if any of 
these ports are unavailable, you might lose access to your 
ISE, which might stop working. When you use an ISE in a 
virtual network, a common setup problem is having one 
or more blocked ports. For connections between your ISE 
and the destination system, the connector you use might 
also have its own port requirements. For example, if you 
communicate with an FTP system by using the FTP connector, 
make sure the port you use on that FTP system, 
such as port 21 for sending commands, is available.

To control the inbound and outbound traffic across the 
virtual network's subnets where you deploy your ISE, 
you can set up [network security groups](../virtual-network/security-overview.md) 
for those subnets by learning [how to filter network traffic across subnets](../virtual-network/tutorial-filter-network-traffic.md). 
These tables describe the ports in your virtual network 
that your ISE uses and where those ports get used. 
The asterisk (\*) represents any and all possible traffic sources. 
The [service tag](../virtual-network/security-overview.md#service-tags) 
represents a group of IP address prefixes that help 
minimize complexity when creating security rules.

| Purpose | Direction | Ports | Source service tag | Destination service tag | Notes |
|---------|-----------|-------|--------------------|-------------------------|-------|
| Communication from Azure Logic Apps | Outbound | 80 & 443 | VIRTUAL_NETWORK | INTERNET | The port depends on the external service with which the Logic Apps service communicates |
| Azure Active Directory | Outbound | 80 & 443 | VIRTUAL_NETWORK | AzureActiveDirectory | |
| Azure Storage dependency | Outbound | 80 & 443 | VIRTUAL_NETWORK | Storage | |
| Communication to Azure Logic Apps | Inbound | 443 | INTERNET  | VIRTUAL_NETWORK | The IP address for the computer or service that calls any request trigger or webhook that exists in your logic app. Closing or blocking this port prevents HTTP calls to logic apps with request triggers.  |
| Logic app run history | Inbound | 443 | INTERNET  | VIRTUAL_NETWORK | The IP address for the computer from which you view the logic app's run history. Although closing or blocking this port doesn't prevent you from viewing the run history, you can't view the inputs and outputs for each step in that run history. |
| Connection management | Outbound | 443 | VIRTUAL_NETWORK  | INTERNET | |
| Publish Diagnostic Logs & Metrics | Outbound | 443 | VIRTUAL_NETWORK  | AzureMonitor | |
| Logic Apps Designer - dynamic properties | Inbound | 454 | INTERNET  | VIRTUAL_NETWORK | Requests come from the Logic Apps [access endpoint inbound IP addresses in that region](../logic-apps/logic-apps-limits-and-config.md#inbound). |
| App Service Management dependency | Inbound | 454 & 455 | AppServiceManagement | VIRTUAL_NETWORK | |
| Connector deployment | Inbound | 454 & 3443 | INTERNET  | VIRTUAL_NETWORK | Necessary for deploying and updating connectors. Closing or blocking this port causes ISE deployments to fail and prevents connector updates or fixes. |
| API Management - management endpoint | Inbound | 3443 | APIManagement  | VIRTUAL_NETWORK | |
| Dependency from Log to Event Hub policy and monitoring agent | Outbound | 5672 | VIRTUAL_NETWORK  | EventHub | |
| Access Azure Cache for Redis Instances between Role Instances | Inbound <br>Outbound | 6379-6383 | VIRTUAL_NETWORK  | VIRTUAL_NETWORK | |
| Azure Load Balancer | Inbound | 8500 | AzureLoadBalancer  | VIRTUAL_NETWORK | |
||||||

<a name="vnet-access"></a>

## Set virtual network permissions

When you create an integration service environment (ISE), 
you select an Azure virtual network into where you *inject* 
your environment. However, before you can select a virtual 
network for injecting your environment, you must set up 
Role-Based Access Control (RBAC) permissions in your 
virtual network. To set up permissions, assign these 
specific roles to the Azure Logic Apps service:

1. In the [Azure portal](https://portal.azure.com), 
find and select your virtual network.

1. On your virtual network's menu, select **Access control (IAM)**.

1. Under **Access control (IAM)**, choose **Add role assignment**.

   ![Add roles](./media/connect-virtual-network-vnet-isolated-environment/set-up-role-based-access-control-vnet.png)

1. On the **Add role assignment** pane, add the necessary role 
to the Azure Logic Apps service as described.

   1. Under **Role**, select **Network Contributor**.

   1. Under **Assign access to**, select 
   **Azure AD user, group, or service principal**.

   1. Under **Select**, enter **Azure Logic Apps**.

   1. After the member list appears, select **Azure Logic Apps**.

      > [!TIP]
      > If you can't find this service, enter the 
      > Logic Apps service's app ID: `7cd684f4-8a78-49b0-91ec-6a35d38739ba`

   1. When you're done, choose **Save**.

   For example:

   ![Add role assignment](./media/connect-virtual-network-vnet-isolated-environment/add-contributor-roles.png)

For more information, see 
[Permissions for virtual network access](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md).

<a name="create-environment"></a>

## Create your ISE

To create your integration service environment (ISE), 
follow these steps:

1. In the [Azure portal](https://portal.azure.com), 
on the main Azure menu, select **Create a resource**.

   ![Create new resource](./media/connect-virtual-network-vnet-isolated-environment/find-integration-service-environment.png)

1. In the search box, enter "integration service environment" as your filter.
From the results list, select **Integration Service Environment (preview)**, 
and then choose **Create**.

   ![Select "Integration Service Environment"](./media/connect-virtual-network-vnet-isolated-environment/select-integration-service-environment.png)

   ![Choose "Create"](./media/connect-virtual-network-vnet-isolated-environment/create-integration-service-environment.png)

1. Provide these details for your environment, 
and then choose **Review + create**, for example:

   ![Provide environment details](./media/connect-virtual-network-vnet-isolated-environment/integration-service-environment-details.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for your environment |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The Azure resource group where you want to create your environment |
   | **Integration Service Environment Name** | Yes | <*environment-name*> | The name to give your environment |
   | **Location** | Yes | <*Azure-datacenter-region*> | The Azure datacenter region where to deploy your environment |
   | **Additional capacity** | Yes | 0, 1, 2, 3 | The number of processing units to use for this ISE resource. To add capacity after creation, see [Add capacity](#add-capacity). |
   | **Virtual network** | Yes | <*Azure-virtual-network-name*> | The Azure virtual network where you want to inject your environment so logic apps in that environment can access your virtual network. If you don't have a network, you can create one here. <p>**Important**: You can *only* perform this injection when you create your ISE. However, before you can create this relationship, make sure you already [set up role-based access control in your virtual network for Azure Logic Apps](#vnet-access). |
   | **Subnets** | Yes | <*subnet-resource-list*> | An ISE requires four *empty* subnets for creating resources in your environment. So, make sure these subnets *aren't delegated* to any service. You *can't change* these subnet addresses after you create your environment. <p><p>To create each subnet, [follow the steps under this table](#create-subnet). Each subnet must meet these criteria: <p>- Must be empty. <br>- Uses a name that doesn't start with a number or a hyphen. <br>- Uses the [Classless Inter-Domain Routing (CIDR) format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) and a Class B address space. <br>- Includes at least a `/27` in the address space so the subnet gets at least 32 addresses. To learn about calculating the number of addresses, see [IPv4 CIDR blocks](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#IPv4_CIDR_blocks). For example: <p>- `10.0.0.0/24` has 256 addresses because 2<sup>(32-24)</sup> is 2<sup>8</sup> or 256. <br>- `10.0.0.0/27` has 32 addresses because 2<sup>(32-27)</sup> is 2<sup>5</sup> or 32. <br>- `10.0.0.0/28` has only 16 addresses because 2<sup>(32-28)</sup> is 2<sup>4</sup> or 16. |
   |||||

   <a name="create-subnet"></a>

   **Create subnet**

   1. Under the **Subnets** list, choose **Manage subnet configuration**.

      ![Manage subnet configuration](./media/connect-virtual-network-vnet-isolated-environment/manage-subnet.png)

   1. On the **Subnets** pane, choose **Subnet**.

      ![Add subnet](./media/connect-virtual-network-vnet-isolated-environment/add-subnet.png)

   1. On the **Add subnet** pane, provide this information.

      * **Name**: The name for your subnet
      * **Address range (CIDR block)**: Your subnet's 
      range in your virtual network and in CIDR format

      ![Add subnet details](./media/connect-virtual-network-vnet-isolated-environment/subnet-details.png)

   1. When you're done, choose **OK**.

   1. Repeat these steps for three more subnets.

1. After Azure successfully validates your ISE information, 
choose **Create**, for example:

   ![After successful validation, choose "Create"](./media/connect-virtual-network-vnet-isolated-environment/ise-validation-success.png)

   Azure starts deploying your environment, but this 
   process *might* take up to two hours before finishing. 
   To check deployment status, on your Azure toolbar, 
   choose the notifications icon, which opens the notifications pane.

   ![Check deployment status](./media/connect-virtual-network-vnet-isolated-environment/environment-deployment-status.png)

   If deployment finishes successfully, 
   Azure shows this notification:

   ![Deployment succeeded](./media/connect-virtual-network-vnet-isolated-environment/deployment-success.png)

   > [!NOTE]
   > If deployment fails or you delete your ISE, 
   > Azure *might* take up to an hour before 
   > releasing your subnets. So, you might 
   > have to wait before reusing those 
   > subnets in another ISE.

1. To view your environment, choose **Go to resource** if Azure 
doesn't automatically go to your environment after deployment finishes.  

<a name="add-capacity"></a>

### Add capacity

Your ISE base unit has fixed capacity, so if you 
need more throughput, you can add more scale units. 
You can choose either to autoscale based on performance 
metrics or based on a specific number of processing units. 
If you choose autoscaling based on metrics, you can 
choose from various criteria and specify the threshold 
conditions for meeting that criteria.

1. In the Azure portal, find your ISE.

1. To view performance metrics for your ISE, 
on your ISE's main menu, choose **Overview**.

1. To set up autoscaling, under **Settings**, 
select **Scale out**. On the **Configure** tab, 
choose **Enable autoscale**.

1. In the **Default** section, choose either 
**Scale based on a metric** or 
**Scale to a specific instance count**.

1. If you choose instance-based, enter the number of 
processing units between 0 and 3 inclusively. 
Otherwise, for metric-based, follow these steps:

   1. In the **Default** section, choose **Add a rule**.

   1. On the **Scale rule** pane, set up your criteria 
   and action to take when the rule triggers.
   
   1. When you're done, choose **Add**.

1. When you're finished, remember to save your changes.

<a name="create-logic-apps-environment"></a>

## Create logic app - ISE

To create logic apps that use your integration 
service environment (ISE), follow the steps in 
[how to create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md) 
but with these differences: 

* When you create your logic app, under the **Location** property, 
select your ISE from the **Integration service environments** section, 
for example:

  ![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment/create-logic-app-with-integration-service-environment.png)

* You can use the same built-in triggers and actions, such as HTTP, 
which run in the same ISE as your logic app. Connectors with 
the **ISE** label also run in the same ISE as your logic app. 
Connectors without the **ISE** label run in the global Logic Apps service.

  ![Select ISE connectors](./media/connect-virtual-network-vnet-isolated-environment/select-ise-connectors.png)

* After you inject your ISE into an Azure virtual network, 
the logic apps in your ISE can directly access resources in that virtual network. 
For on-premises systems that are connected to a virtual network, 
inject an ISE into that network so your logic apps can directly 
access those systems by using any of these items: 

  * ISE connector for that system, for example, SQL Server
  
  * HTTP action 
  
  * Custom connector

  For on-premises systems that aren't in a virtual 
  network or don't have ISE connectors, first 
  [set up the on-premises data gateway](../logic-apps/logic-apps-gateway-install.md).

<a name="create-integration-account-environment"></a>

## Create integration account - ISE

To use an integration account with logic apps in an 
integration service environment (ISE), that integration 
account must use the *same environment* as the logic apps. 
Logic apps in an ISE can reference only integration 
accounts in the same ISE. 

To create an integration account that uses an ISE, follow the steps in 
[how to create integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
except for the **Location** property where the 
**Integration service environments** section now appears. 
Instead, select your ISE, rather than a region, for example:

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment/create-integration-account-with-integration-service-environment.png)

## Get support

* For questions, visit the <a href="https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps" target="_blank">Azure Logic Apps forum</a>.
* To submit or vote on feature ideas, visit the <a href="https://aka.ms/logicapps-wish" target="_blank">Logic Apps user feedback site</a>.

## Next steps

* Learn more about [Azure Virtual Network](../virtual-network/virtual-networks-overview.md)
* Learn about [virtual network integration for Azure services](../virtual-network/virtual-network-for-azure-services.md)
