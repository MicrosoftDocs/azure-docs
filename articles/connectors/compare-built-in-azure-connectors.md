---
title: Built-in operations versus Azure connectors in Standard
description: Learn the differences between built-in operations and Azure connectors for Standard logic apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 01/04/2024
# Customer intent: As a developer, I want to understand the differences between built-in and Azure connectors in Azure Logic Apps (Standard).
---

# Differences between built-in operations and Azure connectors in Azure Logic Apps (Standard)

For Standard logic app resources, the workflow designer shows the available connectors and operations using the labels named **In-App** and **Shared**. The **In-App** label applies to [*built-in* operations](built-in.md), which natively run in the same cluster and runtime as your Standard logic app in single-tenant Azure Logic Apps. This label also applies to connectors known as *service providers*, which are actually custom extensions that are implemented based on Azure Functions. Anyone can create their own service provider connector.

The **Shared** label applies to [Azure-hosted connectors *managed* by Microsoft](managed.md), which run in shared connector clusters in the multitenant Azure cloud. These shared managed connector clusters exist separately from single-tenant Azure Logic Apps, which runs in a different cluster. If your workflow has to invoke a managed connector operation, Azure Logic Apps makes a call to the connector in the managed connector clusters. In turn, the connector might then call the backend target service, which can be Office 365, Salesforce, and so on.

<a name="considerations-authentication"></a>

## Considerations for authentication

Authentication considerations for built-in and Azure connectors differ based on whether you develop the workflow in the Azure portal or locally in Visual Studio Code.

| Environment | Connector type | Authentication |
|-------------|----------------|----------------|
| Azure portal | Built-in | Connection strings, credentials, or connection parameters are stored in your logic app's configuration or app settings. |
| Azure portal | Azure | Connections are authenticated using either a managed identity or [Microsoft Entra app registration with access policies enabled on the Azure API connections](../logic-apps/azure-arc-enabled-logic-apps-create-deploy-workflows.md#set-up-connection-authentication). |
| Visual Studio Code | Built-in | Connection strings or credentials are stored in the logic app project's **local.settings.json** file. |
| Visual Studio Code | Azure | During workflow design, API connections are created and stored in the Azure cloud backend. To run these connections in your local environment, a bearer token is issued for seven days and is stored in your logic app project's **local.settings.json** file. |

<a name="considerations-backend-communication"></a>

## Considerations for backend communication

For an Azure connector to work, your backend service, such as Office 365 or SQL Server, has to allow traffic through the [outbound IP addresses for managed connectors](/connectors/common/outbound-ip-addresses) in the region where you created your logic app.

For a built-in connector to work, your backend service has to allow traffic from the Azure Logic Apps engine instead. You can find the outbound IP addresses for the Azure Logic Apps enine by using the following steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app resource menu, under **Settings**, select **Properties**.

1. Under **Outgoing IP addresses** and **Additional Outgoing IP addresses**, copy all the IP addresses, and set your backend service to allow traffic through these IP addresses.

<a name="considerations-vnet"></a>

## Considerations for virtual network integration

Built-in connectors run in the same cluster as the Azure Logic Apps host runtime and can use virtual network (VNet) integration capabilities to access resources over a private network. However, Azure connectors run in shared managed connector environment and can't benefit from these VNET integration capabilities.

Instead, for Azure connectors to work when VNet integration is enabled on a Standard logic app, you have to allow traffic through the [outbound IP addresses for managed connectors](/connectors/common/outbound-ip-addresses) in the region where you created your logic app. For example, if the subnet that's used in the VNet integration has a network security group (NSG) policy or firewall, that subnet has to allow outbound traffic to the outbound IP addresses for managed connectors.

## Next steps

- [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

- [Azure Logic Apps Running Anywhere: Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272)
