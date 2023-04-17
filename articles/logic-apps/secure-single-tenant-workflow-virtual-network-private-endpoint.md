---
title: Secure traffic between Standard workflows and virtual networks
description: Secure traffic between Standard logic app workflows and virtual networks in Azure using private endpoints.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.custom: engagement-fy23
ms.date: 02/22/2023

# As a developer, I want to connect to my Standard logic app workflows with virtual networks using private endpoints and virtual network integration.
---

# Secure traffic between Standard logic apps and Azure virtual networks using private endpoints

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To securely and privately communicate between your workflow in a Standard logic app and an Azure virtual network, you can set up *private endpoints* for inbound traffic and use virtual network integration for outbound traffic.

A private endpoint is a network interface that privately and securely connects to a service powered by Azure Private Link. This service can be an Azure service such as Azure Logic Apps, Azure Storage, Azure Cosmos DB, SQL, or your own Private Link Service. The private endpoint uses a private IP address from your virtual network, which effectively brings the service into your virtual network.

This article shows how to set up access through private endpoints for inbound traffic and virtual network integration for outbound traffic.

For more information, review the following documentation:

- [What is Azure Private Endpoint?](../private-link/private-endpoint-overview.md)
- [Private endpoints - Integrate your app with an Azure virtual network](../app-service/overview-vnet-integration.md#private-endpoints)
- [What is Azure Private Link?](../private-link/private-link-overview.md)
- [Regional virtual network integration?](../app-service/networking-features.md#regional-vnet-integration)

## Prerequisites

You need to have a new or existing Azure virtual network that includes a subnet without any delegations. This subnet is used to deploy and allocate private IP addresses from the virtual network.

For more information, review the following documentation:

- [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md)
- [What is subnet delegation?](../virtual-network/subnet-delegation-overview.md)
- [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md)

<a name="set-up-inbound"></a>

## Set up inbound traffic through private endpoints

To secure inbound traffic to your workflow, complete these high-level steps:

1. Start your workflow with a built-in trigger that can receive and handle inbound requests, such as the Request trigger or the HTTP + Webhook trigger. This trigger sets up your workflow with a callable endpoint.

1. Add a private endpoint for your logic app resource to your virtual network.

1. Make test calls to check access to the endpoint. To call your logic app workflow after you set up this endpoint, you must be connected to the virtual network.

### Considerations for inbound traffic through private endpoints

- If accessed from outside your virtual network, monitoring view can't access the inputs and outputs from triggers and actions.

- Managed API webhook triggers (*push* triggers) and actions won't work because they run in the public cloud and can't call into your private network. They require a public endpoint to receive calls. For example, such triggers include the Dataverse trigger and the Event Grid trigger.

- If you use the Office 365 Outlook trigger, the workflow is triggered only hourly.

- Deployment from Visual Studio Code or Azure CLI works only from inside the virtual network. You can use the Deployment Center to link your logic app to a GitHub repo. You can then use Azure infrastructure to build and deploy your code.

  For GitHub integration to work, remove the `WEBSITE_RUN_FROM_PACKAGE` setting from your logic app or set the value to `0`.

- Enabling Private Link doesn't affect outbound traffic, which still flows through the App Service infrastructure.

### Prerequisites for inbound traffic through private endpoints

Along with the [virtual network setup in the top-level prerequisites](#prerequisites), you need to have a new or existing Standard logic app workflow that starts with a built-in trigger that can receive requests.

For example, the Request trigger creates an endpoint on your workflow that can receive and handle inbound requests from other callers, including workflows. This endpoint provides a URL that you can use to call and trigger the workflow. For this example, the steps continue with the Request trigger.

For more information, review [Receive and respond to inbound HTTP requests using Azure Logic Apps](../connectors/connectors-native-reqres.md).

### Create the workflow

1. If you haven't already, create a single-tenant based logic app, and a blank workflow.

1. After the designer opens, add the Request trigger as the first step in your workflow.

1. Based on your scenario requirements, add other actions that you want to run in your workflow.

1. When you're done, save your workflow.

For more information, review [Create single-tenant logic app workflows in Azure Logic Apps](create-single-tenant-workflows-azure-portal.md).

### Copy the endpoint URL

1. On the workflow menu, select **Overview**.

1. On the **Overview** page, copy and save the **Workflow URL** for later use.

   To trigger the workflow, you call or send a request to this URL.

1. Make sure that the URL works by calling or sending a request to the URL. You can use any tool you want to send the request, for example, Postman.

### Set up private endpoint connection

1. On your logic app menu, under **Settings**, select **Networking**.

1. On the **Networking** page, on the **Inbound traffic** card, select **Private endpoints**.

1. On the **Private Endpoint connections**, select **Add**.

1. On the **Add Private Endpoint** pane that opens, provide the requested information about the endpoint.

   For more information, review [Private Endpoint properties](../private-link/private-endpoint-overview.md#private-endpoint-properties).

1. After Azure successfully provisions the private endpoint, try again to call the workflow URL.

   This time, you get an expected `403 Forbidden` error, which is means that the private endpoint is set up and works correctly.

1. To make sure the connection is working correctly, create a virtual machine in the same virtual network that has the private endpoint, and try calling the logic app workflow.

<a name="set-up-outbound"></a>

## Set up outbound traffic using virtual network integration

To secure outbound traffic from your logic app, you can integrate your logic app with a virtual network. First, create and test an example workflow. You can then set up virtual network integration.

### Considerations for outbound traffic through virtual network integration

- Setting up virtual network integration affects only outbound traffic. To secure inbound traffic, which continues to use the App Service shared endpoint, review [Set up inbound traffic through private endpoints](#set-up-inbound).

- You can't change the subnet size after assignment, so use a subnet that's large enough to accommodate the scale that your app might reach. To avoid any issues with subnet capacity, use a `/26` subnet with 64 addresses. If you create the subnet for virtual network integration with the Azure portal, you must use `/27` as the minimum subnet size.

- For the Azure Logic Apps runtime to work, you need to have an uninterrupted connection to the backend storage. If the backend storage is exposed to the virtual network through a private endpoint, make sure that the following ports are open:

  | Source port | Destination port | Source | Destination | Protocol | Purpose |
  |-------------|------------------|--------|-------------|----------|---------|
  | * | 443 | Subnet integrated with Standard logic app | Storage account | TCP | Storage account |
  | * | 445 | Subnet integrated with Standard logic app | Storage account | TCP | Server Message Block (SMB) File Share |

- For Azure-hosted managed connectors to work, you need to have an uninterrupted connection to the managed API service. With virtual network integration, make sure that no firewall or network security policy blocks these connections. If your virtual network uses a network security group (NSG), user-defined route table (UDR), or a firewall, make sure that the virtual network allows outbound connections to [all managed connector IP addresses](/connectors/common/outbound-ip-addresses#azure-logic-apps) in the corresponding region. Otherwise, Azure-managed connectors won't work.

For more information, review the following documentation:

- [Integrate your app with an Azure virtual network](../app-service/overview-vnet-integration.md)
- [Network security groups](../virtual-network/network-security-groups-overview.md)
- [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md)

### Create and test the workflow

1. If you haven't already, in the [Azure portal](https://portal.azure.com), create a single-tenant based logic app, and a blank workflow.

1. After the designer opens, add the Request trigger as the first step in your workflow.

1. Add an HTTP action to call an internal service that's unavailable through the Internet and runs with a private IP address such as `10.0.1.3`.

1. When you're done, save your workflow.

1. From the designer, manually run the workflow.

   The HTTP action fails, which is by design and expected because the workflow runs in the cloud and can't access your internal service.

### Set up virtual network integration

1. In the Azure portal, on the logic app resource menu, under **Settings**, select **Networking**.

1. On the **Networking** pane, on the **Outbound traffic** card, select **VNet integration**.

1. On the **VNet Integration** pane, select **Add Vnet**.

1. On the **Add VNet Integration** pane, select the subscription and the virtual network that connects to your internal service.

   After you add virtual network integration, on the **VNet Integration** pane, the **Route All** setting is enabled by default. This setting routes all outbound traffic through the virtual network. When this setting is enabled, the `WEBSITE_VNET_ROUTE_ALL` app setting is ignored.

1. If you use your own domain name server (DNS) with your virtual network, set your logic app resource's `WEBSITE_DNS_SERVER` app setting to the IP address for your DNS. If you have a secondary DNS, add another app setting named `WEBSITE_DNS_ALT_SERVER`, and set the value also to the IP for your DNS.

1. After Azure successfully provisions the virtual network integration, try to run the workflow again.

   The HTTP action now runs successfully.

## Next steps

- [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)
