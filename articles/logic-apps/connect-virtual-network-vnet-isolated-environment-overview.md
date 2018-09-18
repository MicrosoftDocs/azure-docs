---
title: Access to Azure virtual Network (VNET) from Azure Logic Apps
description: This overview shows how isolated logic apps can connect to Azure Virtual Networks (VNETs) from integration service environments (ISEs) that use private and dedicated resources
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 09/24/2018
---

# Access to Azure Virtual Network (VNET) resources from isolated Azure Logic Apps

> [!NOTE]
> This capability is currently in *private preview*, 
> but more details will be available about how you can sign up for access. 

Sometimes, your logic apps and integration accounts need access to secured 
resources such as virtual machines (VMs) and other systems or services inside an 
[Azure Virtual Network (VNET)](../virtual-network/virtual-networks-overview.md). 
To provide this access, you can [create an *integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environments.md) 
as the location for creating your logic apps and integration accounts. 

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment-overview/select-logic-app-integration-service-environment.png)

Creating an ISE deploys a private and isolated Logic Apps instance into your VNET. 
The private instance uses dedicated resources such as storage, and runs separately 
from the public "global" Logic Apps service. This separation also helps reduce the 
impact that other Azure tenants might have on your apps' performance, or the 
["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors). 

This overview describes how creating an ISE helps logic apps and integration 
accounts directly access resources inside your Azure VNET, and compares 
the differences between an ISE and the global Logic Apps service.

<a name="difference"></a>

## Isolated versus global

When you create an integrated service environment (ISE) in Azure, 
you can select an Azure VNET as a *peer* for your environment. 
Azure deploys a private instance of the Logic Apps service into 
your VNET, resulting in an isolated environment where you can 
create and run your logic apps on dedicated resources. When you 
create a logic app, you can select this environment as your 
app's location, which also gives your logic app direct access 
to the resources in your VNET.  

Logic apps in an ISE provide the same user experiences and similar 
capabilities as the global Logic Apps service. Not only can you use the 
same built-ins and connectors provided by the global Logic Apps service, 
but you can choose from connectors that provide ISE versions. For example, 
here's some standard connectors that offer versions that run in an ISE:
 
* Azure Blob Storage, File Storage, and Table Storage
* Azure Queues
* Azure Service Bus
* FTP
* SSH FTP (SFTP)
* SQL Server
* AS2, X12, and EDIFACT

The difference between ISE and non-ISE connectors is 
in the locations where the triggers and actions run:

* If you use built-in triggers and actions such as HTTP in 
your ISE, these triggers and actions always run in the same 
ISE as your logic app. 

* For connectors that offer two versions: one version runs in an ISE, 
while the other version runs in the global Logic Apps service.  

  Connectors that have the **ISE** label always run 
  in the same ISE as your logic app. Connectors without 
  the **ISE** label run in the global Logic Apps service. 

  ![Select ISE connectors](./media/connect-virtual-network-vnet-isolated-environment-overview/select-ise-connectors.png)

* Connectors that you configure in your ISE are also 
available for use in the global Logic Apps service. 

> [!IMPORTANT]
> Logic apps, built-in actions, and connectors that run in your ISE use 
> a different pricing plan, not the consumption-based pricing plan. 
> For more information, see [Logic Apps pricing](../logic-apps/logic-apps-pricing.md).

<a name="vnet-access"></a>

## Permissions to access your VNET

When you create an integration service environment (ISE), 
you can select an Azure virtual network (VNET) as a *peer* 
for your environment. However, you can *only* create this 
relationship, or *peering*, when you create your ISE. 
This relationship gives your ISE access to resources in 
your VNET, which then lets logic apps in that ISE connect 
directly to resources in your VNET. 

> [!NOTE]
> To access on-premises systems, you still have to 
> [set up an on-premises data gateway](../logic-apps/logic-apps-gateway-install.md).

Before you can select an Azure VNET as a peer for your environment, 
you must set up Role-Based Access Control (RBAC) permissions in 
your Azure VNET for the Azure Logic Apps service. This task requires 
that you assign the **Network Contributor** and **Classic Contributor** 
roles to the Azure Logic Apps service. For more information about the 
role permissions required for peering, see the 
[Permissions section in Create, change, or delete a virtual network peering](../virtual-network/virtual-network-manage-peering.md#permissions).

<a name="create-integration-account-environment"></a>

## Integration accounts with ISE

You can use integration accounts with logic apps that run in 
an integration service environment (ISE), but those integration 
accounts must also use the *same ISE* as the linked logic apps. 
Logic apps in an ISE can reference only those integration accounts 
that are in the same ISE. When you create an integration account, 
you can select your ISE as the location for your integration account.

## Get support

* For questions, visit the <a href="https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps" target="_blank">Azure Logic Apps forum</a>.
* To submit or vote on feature ideas, visit the <a href="http://aka.ms/logicapps-wish" target="_blank">Logic Apps user feedback site</a>.

## Next steps

* Learn how to [connect to virtual networks (VNETs) from isolated logic apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md)
* Learn more about [Azure Virtual Network](../virtual-network/virtual-networks-overview.md)
* Learn about [virtual network integration for Azure services](../virtual-network/virtual-network-for-azure-services.md)
