---
title: Create reusable connections for connector namespaces
titleSuffix: Azure Connector Namespace
description: Create and organize reusable connections in connector namespaces so your solutions can access other services, systems, apps, and data without needing custom API client code or tool wrappers by using Azure Connector Namespace.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
# Customer intent: As a backend developer who works with Azure, I want to create resuable connections in my connector namespace so my solutions can access other services, systems, apps, and data without having to manage authentication or credentails.
---

# Create reusable connections in connector namespaces to integrate your solutions with other services through Azure Connector Namespace (preview)

> [!IMPORTANT]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is only available in Azure public regions.

When your apps need to connect and integrate with other services, systems, apps, or data, you first need a secure way to store and manage authentication information. However, setting up and managing authentication yourself for each integration adds overhead and complexity. Azure Connector Namespace reduces these hurdles because you can create reusable connections to supported services and other sources so your integrations can subscribe to triggers and call actions without having each app separately handle and manage connections and authentication.

This guide shows how to create, authenticate, authorize, and use a connection in your connector namespace with your apps.

## Prerequisites

- An Azure account and subscription with an existing connector namespace resource. If you don't have one, see [Create and manage connector namespaces](create-connector-namespace.md).
- Permissions to manage connector namespaces and create connections.
- Access to the [Connector Namespaces portal](https://connectors.azure.com).
- Account or user credentials for the service or system where you want to create a connection from the connector namespace.

## 1: Create a reusable connection

1. In the [Connector Namespaces portal](https://connectors.azure.com/), sign in, and then select your connector namespace, if you didn't already complete this step.

   For more information, see [Sign in to the Connector Namespaces portal](create-connector-namespace.md#sign-in).

1. On the namespace sidebar, select **Connections**, and then select **Create connection**.

   -or-

   On the namespace sidebar, under **General**, select **Overview**. In the **Connections** section, select **Create connection**, for example:

   :::image type="content" source="media/create-connector-namespace-connection/connector-namespace-overview-page.png" alt-text="Screenshot shows the Connector Namespaces portal with Overview subsection, and Create connection selected." lightbox="media/create-connector-namespace-connection/connector-namespace-overview-page.png":::

1. In the **Create connection** window, find and select the connector you want to use.

   :::image type="content" source="media/create-connector-namespace-connection/create-connection-select-connector.png" alt-text="Screenshot shows the Create Connection window and available connectors." lightbox="media/create-connector-namespace-connection/create-connection-select-connector.png":::

   This example selects the **Office 365 Outlook** connector.

1. In the connection name box, enter a name that clearly identifies the connection to create for the service, system, or other component.

   Clear and specific names make it easier to differentiate, select, and manage connections in your connection namespace.

1. When you finish, select **Create connection**.

   :::image type="content" source="media/create-connector-namespace-connection/create-connection-authenticate-connector.png" alt-text="Screenshot shows Create Connection window with a connection name entered." lightbox="media/create-connector-namespace-connection/create-connection-authenticate-connector.png":::

1. If a prompt appears, sign in with your credentials to authorize the connection.

1. Complete any extra authorization steps required by the service, system, or component.

1. On the namespace **Overview** page, in the **Connections** subsection, confirm the connection status.

   Healthy connections appear enabled and ready for your solutions to use for triggering workflow automation and running actions.

## Next steps

- [Create and manage connector namespaces for integration](create-connector-namespace.md)  
- [What is Azure Connector Namespace?](connector-namespace-overview.md)

<!--
- Subscribe to connector triggers
- Call connector actions from Azure Functions using Connectors SDK
-->
