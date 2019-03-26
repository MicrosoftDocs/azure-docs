---
title: Access to Azure virtual networks from Azure Logic Apps with integration service environments (ISEs)
description: This overview describes how integration service environments (ISEs) help logic apps access Azure virtual networks (VNETs)
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 03/11/2019
---

# Access to Azure Virtual Network resources from Azure Logic Apps by using integration service environments (ISEs)

> [!NOTE]
> This capability is in 
> [*public preview*](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Sometimes, your logic apps and integration accounts need access to 
secured resources, such as virtual machines (VMs) and other systems 
or services, in an [Azure virtual network](../virtual-network/virtual-networks-overview.md). 
To set up this access, you can 
[create an *integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment.md) 
for running your logic apps and integration accounts. 
When you create an ISE, Azure deploys a private and isolated 
instance of the Logic Apps service into your Azure virtual network. 
This private instance uses dedicated resources such as storage, 
and runs separately from the public "global" Logic Apps service. 
Separating your isolated private instance and the public global 
instance also helps reduce the impact that other Azure tenants 
might have on your apps' performance, which is also known as the 
["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).

After creating your ISE, when you go to create your logic app 
or integration account, you can select your ISE as your logic 
app or integration account's location:

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment-overview/select-logic-app-integration-service-environment.png)

Your logic app can now directly access systems that are inside 
or connected to your virtual network by using any of these items:

* An ISE-versioned connector for that system, for example, SQL Server
* A built-in trigger or action, such as the HTTP trigger or action
* A custom connector

This overview describes more details about how an ISE gives your logic apps 
and integration accounts direct access to your Azure virtual network and 
compares differences between an ISE and the global Logic Apps service.
For on-premises systems that aren't connected to a virtual network or 
don't have ISE-version connectors, you can connect to those systems 
by [setting up and using the on-premises data gateway](../logic-apps/logic-apps-gateway-install.md).

> [!IMPORTANT]
> Logic apps, built-in actions, and connectors that run in your ISE use 
> a different pricing plan, not the consumption-based pricing plan. 
> For more information, see [Logic Apps pricing](../logic-apps/logic-apps-pricing.md).

<a name="difference"></a>

## Isolated versus global

When you create an integrated service environment (ISE) in Azure, 
you can select the Azure virtual network where you want to *inject* your ISE. 
Azure then injects, or deploys, a private instance of the Logic Apps service 
into your virtual network. This action creates an isolated environment where 
you can create and run your logic apps on dedicated resources. When you create 
your logic app, you select your ISE as your app's location, which gives your 
logic app direct access to your virtual network and the resources in that network.

Logic apps in an ISE provide the same user experiences and similar 
capabilities as the global Logic Apps service. Not only can you use 
the same built-in actions and connectors in the global Logic Apps service, 
but you can also use ISE-specific connectors. For example, here's 
some standard connectors that offer versions that run in an ISE:

* Azure Blob Storage, File Storage, and Table Storage
* Azure Queues, Azure Service Bus, Azure Event Hubs, and IBM MQ
* FTP and SFTP-SSH
* SQL Server, SQL Data Warehouse, Azure Cosmos DB
* AS2, X12, and EDIFACT

The difference between ISE and non-ISE connectors is 
in the locations where the triggers and actions run:

* In your ISE, built-in triggers and actions such as 
HTTP always run in the same ISE as your logic app.

* For connectors that offer two versions, one version runs in an ISE, 
while the other version runs in the global Logic Apps service.  

  Connectors that have the **ISE** label always run 
  in the same ISE as your logic app. Connectors without 
  the **ISE** label run in the global Logic Apps service.

  ![Select ISE connectors](./media/connect-virtual-network-vnet-isolated-environment-overview/select-ise-connectors.png)

* Connectors that run in an ISE are also 
available in the global Logic Apps service.

<a name="create-integration-account-environment"></a>

## Integration accounts with ISE

You can use integration accounts with logic apps inside an 
integration service environment (ISE). However, those integration 
accounts must use the *same ISE* as the linked logic apps. 
Logic apps in an ISE can reference only those integration accounts 
that are in the same ISE. When you create an integration account, 
you can select your ISE as the location for your integration account.

## Get support

* For questions, visit the <a href="https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps" target="_blank">Azure Logic Apps forum</a>.
* To submit or vote on feature ideas, visit the <a href="https://aka.ms/logicapps-wish" target="_blank">Logic Apps user feedback site</a>.

## Next steps

* Learn how to [connect to Azure virtual networks from isolated logic apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md)
* Learn more about [Azure Virtual Network](../virtual-network/virtual-networks-overview.md)
* Learn about [virtual network integration for Azure services](../virtual-network/virtual-network-for-azure-services.md)
