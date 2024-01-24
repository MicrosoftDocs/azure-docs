---
title: Set up multiple connections - Azure API Management 
description: Learn how to set up multiple connections to a configured API credential provider using the portal. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/08/2023
ms.author: danlep
---

# Configure multiple connections

You can configure multiple connections to a credential provider in your API Management instance. For example, if you configured Microsoft Entra ID as a credential provider, you might need to create multiple connections for different scenarios and users.

In this article, you learn how to add a connection to an existing provider, using credential manager in the portal. For an overview of credential manager, see [About API credentials and credential manager](credentials-overview.md).

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md).
* A configured credential provider. For example, see the steps to create a provider for [GitHub](credentials-how-to-github.md) or [Microsoft Entra ID](credentials-how-to-azure-ad.md).
 
## Create a connection - portal

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider that you want to create multiple connections for (for example, *mygithub*).
1. In the provider window, select **Overview** > **+ Create connection**.

    :::image type="content" source="media/configure-credential-connection/create-credential.png" alt-text="Screenshot of creating a connection in the portal.":::

1. On the **Connection** tab, complete the steps for your connection. 

    [!INCLUDE [api-management-credential-create-connection](../../includes/api-management-credential-create-connection.md)]

## Manage credentials - portal

You can manage credential provider settings and connections in the portal. For example, you might need to update a client secret for a credential provider.

To update provider settings:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider that you want to manage.
1. In the provider window, select **Settings**.
1. In the provider settings, make updates, and select **Save**.

    :::image type="content" source="media/configure-credential-connection/update-provider.png" alt-text="Screenshot of updating credential provider settings in the portal.":::

To update a connection:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider whose connection you want to update.
1. In the provider window, select **Connections**.
1. In the row for the connection you want to update, select the context (...) menu, and select from the options. For example, to manage access policies, select **Edit access policies**.

    :::image type="content" source="media/configure-credential-connection/update-connection.png" alt-text="Screenshot of updating a connection in the portal.":::
1. In the window that appears, make updates, and select **Save**.

## Related content

* Learn more about [configuring credential providers](credentials-configure-common-providers.md) in credential manager.
* Review [limits](credentials-overview.md#limits) for credential providers and connections.
