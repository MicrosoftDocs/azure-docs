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
ms.date: 12/06/2018
---

# Connect to Azure virtual networks from Azure Logic Apps through an integration service environment (ISE)

> [!NOTE]
> This capability is in *private preview*. 
> To request access, [create your request to join here](https://aka.ms/iseprivatepreview).

For scenarios where your logic apps and integration accounts need access to an 
[Azure virtual network](../virtual-network/virtual-networks-overview.md), create an 
[*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). 
An ISE is a private and isolated environment that uses dedicated storage and other 
resources kept separate from the public or *global* Logic Apps service. This separation 
also reduces any impact that other Azure tenants might have on your apps' performance. 
Your ISE is *injected* into to your Azure virtual network, which then deploys the Logic Apps 
service into your virtual network. When you create a logic app or integration account, 
select this ISE as their location. Your logic app or integration account can then directly 
access resources, such as virtual machines (VMs), servers, systems, and services, in your virtual network. 

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment/select-logic-app-integration-service-environment.png)

This article shows how to complete these tasks:

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

* An [Azure virtual network](../virtual-network/virtual-networks-overview.md). 
If you don't have a virtual network, learn how to 
[create an Azure virtual network](../virtual-network/quick-create-portal.md). 

* To give your logic apps direct access to your Azure virtual network, 
[set up Role-Based Access Control (RBAC) permissions](#vnet-access) 
so the Logic Apps service has the permissions for accessing your virtual network. 

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

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
   | **Capacity** | Yes | 0, 1, 2, 3 | The number of processing units to use for this ISE resource | 
   | **Virtual network** | Yes | <*Azure-virtual-network-name*> | The Azure virtual network where you want to inject your environment so logic apps in that environment can access your virtual network. If you don't have a network, you can create one here. <p>**Important**: You can *only* perform this injection when you create your ISE. However, before you can create this relationship, make sure you already [set up role-based access control in your virtual network for Azure Logic Apps](#vnet-access). | 
   | **Subnets** | Yes | <*IP-address-range*> | An ISE requires four *empty* subnets. These subnets are undelegated to any service and are used for creating resources in your environment. You *can't change* these IP ranges after you create your environment. <p><p>To create each subnet, [follow the steps under this table](#create-subnet). Each subnet must meet these criteria: <p>- Must not exist in the same address range for your selected virtual network nor any other private IP addresses where the virtual network is connected. <br>- Uses a name that doesn't start with a number or a hyphen. <br>- Uses the [Classless Inter-Domain Routing (CIDR) format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). <br>- Requires a Class B address space. <br>- Includes a `/27`. For example, each subnet here specifies a 32-bit address range: `10.0.0.0/27`, `10.0.0.32/27`, `10.0.0.64/27`, and `10.0.0.96/27`. <br>- Must be empty. |
   |||||

   <a name="create-subnet"></a>

   **Create subnet**

   1. Under the **Subnets** list, choose **Manage subnet configuration**.

      ![Manage subnet configuration](./media/connect-virtual-network-vnet-isolated-environment/manage-subnet.png)

   1. On the **Subnets** pane, choose **Subnet**.

      ![Add subnet](./media/connect-virtual-network-vnet-isolated-environment/add-subnet.png)

   1. On the **Add subnet** pane, provide this information.

      * **Name**: The name for your subnet
      * **Address range (CIDR block)**: Your subnet's range 
      in your virtual network and in CIDR format

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
