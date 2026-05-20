---
title: Create a connection in Azure Connector Namespace  
description: Learn how to create a new connection in an Azure Connector Namespace to integrate external services such as Office 365 Outlook with your applications.  
author: wsilveiranz  
ms.author: wsilveira  
ms.date: 05/21/2026  
ms.topic: how-to  
ms.service: azure-logic-apps  
# Customer intent: As a developer, I want to create a connection in Azure Connector Namespace so that I can integrate external services with my applications.  
ms.custom: ai-assisted  
---

# Create a connection in Azure Connector Namespace (preview)

> [!NOTE]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article shows you how to create a new connection in an Azure Connector Namespace to integrate external services such as Office 365 Outlook with your applications.

## Prerequisites

* An Azure account and subscription with a connector namespace already created. If you don't have one, see [Create and manage connector namespaces in Azure](create-connector-namespace.md).

* Permissions to manage connector namespaces and create connections.

* Access to the [connector namespace portal](https://connectors.azure.com).

## Create and authorize a connection

1. Sign in to the [connector namespace portal](https://connectors.azure.com).

1. Select the connector namespace where you want to create a connection.

1. In the namespace overview, select **Create connection**.

   :::image type="content" source="media/create-connector-namespace-connection/connector-namespace-overview-page.png" alt-text="Connector Namespace overview page with Create connection highlighted.":::

1. On the **Connector** tab, search or browse for the connector you want to use. For example, select **Office 365 Outlook**.

   :::image type="content" source="media/create-connector-namespace-connection/create-connection-select-connector.png" alt-text="Create Connection dialog showing the Connector tab with available connectors.":::

1. Enter a name for your connection in the **Connection name** field.

   > [!TIP]
   > Use a descriptive name that clearly identifies the service or account for easier management.

1. Select **Create Connection**.

   :::image type="content" source="media/create-connector-namespace-connection/create-connection-autheticate-connector.png" alt-text="Create Connection dialog with Office 365 Outlook selected and a connection name entered.":::

1. Sign in with your credentials for the external service to authorize the connection.

1. Complete any extra authorization steps required by the external service.

1. On the overview page, verify the connection status on the namespace overview page under **Connections**. Healthy connections show as enabled and ready.


Your new connection is ready to use by your applications or logic apps to execute actions and subscribe to triggers.

## Next steps

- [Create and manage connector namespaces in Azure](create-connector-namespace.md)  
- [Understand Azure Connector Namespace and its capabilities](azure-connector-namespace-overview.md)  
- Call connector actions from Azure Functions using Connectors SDK
- Subscribe to connector triggers