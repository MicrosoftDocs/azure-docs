---
title: Connect single-tenant workflows and private endpoints on virtual networks
description: Set up private endpoint access between single-tenant logic app workflows and virtual networks, and storage accounts.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/13/2021

# As a developer, I want to connect to my single-tenant workflows from virtual networks using private endpoints.
---

# Secure access between virtual networks and single-tenant workflows in Azure Logic Apps using private endpoints (preview)

To securely and privately communicate between your logic app workflow and a virtual network, you can set up a *private endpoint* that makes this communication possible, inbound or outbound.

A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. This service can be an Azure service such as Azure Logic Apps, Azure Storage, Azure Cosmos DB, SQL, or your own Private Link Service. The private endpoint uses a private IP address from your virtual network, which effectively brings the service into your virtual network.

This article shows how to set up a logic app workflow with a callable endpoint, add a private endpoint to your virtual network, and make test calls to check access to the endpoint. To call your logic app workflow after you set up this endpoint, you must be connected to the virtual network.

For more information, review the following documentation:

- [What is an Azure Private Endpoint?](../private-link/private-endpoint-overview.md)

- [What is single-tenant logic app workflow in Azure Logic Apps?](single-tenant-overview-compare.md)

## Prerequisites

* A new or existing Azure virtual network that includes a subnet without any delegations.

  This subnet is used to deploy and allocate private IP addresses from the virtual network.

  For more information, review the following documentation:

  * [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md)

  * [What is subnet delegation?](../virtual-network/subnet-delegation-overview.md)

  * [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md)

* A new or existing single-tenant based logic app workflow that starts with the Request trigger.

  The Request trigger creates an endpoint on your workflow that can receive and handle inbound requests from other callers, including workflows. This endpoint provides a URL that you can use to call and trigger the workflow.

  For more information, review the following documentation:

  * [Create single-tenant logic app workflows in Azure Logic Apps](create-single-tenant-workflows-azur-portal.md)

  * [Receive and respond to inbound HTTP requests using Azure Logic Apps](../connectors/connectors-native-reqres.md)

## Secure inbound traffic

### Considerations

* You can call Request triggers and webhook triggers only from inside your virtual network.

* Managed API webhook triggers and actions won't work because they require a public endpoint to receive calls. 

* If accessing from outside your virtual network, monitoring view won't have access to the inputs and outputs from triggers and actions.

* Deployment from Visual Studio Code or Azure CLI works only from inside the virtual network. You can use the Deployment Center to link your logic app to a GitHub repo. You can then use Azure infrastructure to build and deploy your code. 

  For GitHub integration to work, remove the `WEBSITE_RUN_FROM_PACKAGE` setting from your logic app or set the value to `0`.

* Enabling Private Link doesn't affect outbound traffic, which still flows through the App Service infrastructure.

### Create the workflow

1. If you haven't already, create a single-tenant based logic app, and a blank workflow.

1. After the designer opens, add the Request trigger as the first step in your workflow.

1. Based on your scenario requirements, add other actions that you want to run in your workflow.

1. When you're done, save your workflow.

For more information, review [Create single-tenant logic app workflows in Azure Logic Apps](create-single-tenant-workflows-azur-portal.md).

#### Copy the endpoint URL

1. On the workflow menu, select **Overview**.

1. On the **Overview** page, copy and save the **Workflow URL** for later use.

   To trigger the workflow, you call or send a request to this URL.

1. Make sure that the URL works by calling or sending a request to the URL. You can use any tool you want to send the request, for example, Postman.

### Set up private endpoint connection

1. On your logic app menu, under **Settings**, select **Networking**.

1. On the **Networking** page, under **Private Endpoint connections**, select **Configure your private endpoint connections**.

1. On the **Private Endpoint connections page**, select **Add**.

1. On the **Add Private Endpoint** pane that opens, provide the requested information about the endpoint.

   For more information, review [Private Endpoint properties](../private-link/private-endpoint-overview.md#private-endpoint-properties).

1. After Azure successfully provisions the private endpoint, try again to call the workflow URL.

   This time, you get an expected `403 Forbidden` error, which is means that the private endpoint is set up and works correctly.

1. To make sure the connection is working correctly, create a virtual machine in the same virtual network that has the private endpoint, and try calling the logic app workflow.

## Secure outbound traffic

## Secure access to storage account

You can restrict storage account access so that only resources inside a virtual network have access. Azure Storage supports adding private endpoints to your storage account. That way, logic app workflows can communicate privately and securely with the storage account through the private endpoint. For more information, review the [Use private endpoints for Azure Storage documentation](../storage/common/storage-private-endpoints.md).

In your logic app settings, point the `AzureWebJobsStorage` setting at the connection string for the storage account that has the private endpoints by choosing one of these options:

* **Azure portal**: On your logic app menu, select **Configuration**. Update the `AzureWebJobsStorage` setting with the connection string for the storage account.

* **Visual Studio Code**: In your project root-level **local.settings.json** file, update the `AzureWebJobsStorage` setting with the connection string for the storage account.

### Checklist

* Create different private endpoints for each of the Table, Queue, and Blob storage services.

* Route all outbound traffic through your virtual network by using this setting:

  `"WEBSITE_VNET_ROUTE_ALL": "1"`

* To make sure that your logic app uses private domain name server (DNS) zones in your virtual network, set the the `WEBSITE_DNS_SERVER` setting to `168.63.129.16`.

* Unless you are also using private endpoints, deploy your workflow from Visual Studio Code and set the `WEBSITE_RUN_FROM_PACKAGE` setting to `1`. If you use private endpoints, deploy using [GitHub Integrations](https://docs.github.com/en/github/customizing-your-github-workflow/about-integrations).

* You need a separate publicly accessible storage account when you deploy your logic ap. Make sure that you set the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` setting to the connection string for that storage account.

## Next steps

* [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)
* []