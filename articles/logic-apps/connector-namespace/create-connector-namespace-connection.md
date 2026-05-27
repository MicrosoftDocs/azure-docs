---
title: Create connections in a connector namespace
titleSuffix: Azure Connector Namespace
description: Learn to create connections in a connector namespace so you can integrate your apps with other services, systems, apps, and data.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
# Customer intent: As a backend developer who works with Azure, I want to create connections to other services, systems, apps, and data in my connector namespace so I can integrate these sources with my apps.
---

# Create connections in a connector namespace for Azure Connector Namespace (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is only available in Azure public regions.

When your apps need to connect and integrate with other services, systems, apps, or data, you first need a secure way to store and manage authentication information. However, setting up and managing authentication yourself for each integration adds overhead and complexity. Azure Connector Namespace reduces these hurdles because you can create reusable connections to supported services and other sources so your integrations can subcribe to triggers and call actions without having each app separately handle and manage connections and authentication.

This guide shows how to create, authenticate, authorize, and use a connection in your connector namespace with your apps.

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

   :::image type="content" source="media/create-connector-namespace-connection/create-connection-authenticate-connector.png" alt-text="Create Connection dialog with a connection name entered.":::

1. Sign in with your credentials for the external service to authorize the connection.

1. Complete any extra authorization steps required by the external service.

1. On the overview page, verify the connection status on the namespace overview page under **Connections**. Healthy connections show as enabled and ready.


Your new connection is ready to use by your applications or logic apps to execute actions and subscribe to triggers.

## Next steps

- [Create and manage connector namespaces in Azure](create-connector-namespace.md)  
- [Understand Azure Connector Namespace and its capabilities](connector-namespace-overview.md)  
- Call connector actions from Azure Functions using Connectors SDK
- Subscribe to connector triggers
