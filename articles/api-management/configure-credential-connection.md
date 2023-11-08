---
title: Set up multiple credential connections - Azure API Management 
description: Learn how to set up multiple credential connections to a configured API credential provider using the portal. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/08/2023
ms.author: danlep
---

# Configure multiple credential connections

You can configure multiple credentials (also called *credential connections*) to a credential provider in your API Management instance. For example, if you configured Microsoft Entra ID as a credential provider, you might need to create multiple credentials for different scenarios and users.

In this article, you learn how to add a credential connection to an existing provider, using the portal. For an overview of configuration steps, see [How to configure credentials?](credentials-overview.md#how-to-configure-credentials)

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md).
* A configured credentials provider. For example, see the steps to create a provider for [GitHub](credentials-how-to-github.md) or [Microsoft Entra ID](credentials-how-to-azure-ad.md).
 
## Create a credential connection - portal

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider that you want to create multiple connections for (for example, *mygithub*).

    :::image type="content" source="media/configure-credential-connection/select-provider.png" alt-text="Screenshot of selecting a credential provider in the portal.":::
1. In the provider window, select ** **Overview > + Create connection**.

    :::image type="content" source="media/configure-credential-connection/create-credentials.png" alt-text="Screenshot of creating a connection in the portal.":::
1. On the **Connection** tab, complete the steps for your connection:
    1. Enter a **Connection name**, then select **Save**. 
    1. Under **Step 2: Login to your connection** (for credentials code grant type), complete the steps to login to the credential provider to allow access. 
    1. Under **Step 3: Determine who will have access to this connection (Access policy)**, select **+ Add** and assign access to the Microsoft Entra service principals, users, or identities that can use the credential. Select **Complete**.
1. The new connection appears in the list of connections, and shows a status of **Connected**.

    :::image type="content" source="media/configure-credential-connection/list-credentialss.png" alt-text="Screenshot of list of credential connections in the portal.":::

If you want to create another connection for the credential provider, complete the preceding steps.

## Manage credentials - portal

You can manage credential provider settings and credential connections in the portal. For example, you might need to update client credentials for the credential provider.

To update provider settings:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider that you want to manage.
1. In the provider windows, select **Settings**.
1. In the provider settings, make updates, and select **Save**.

    :::image type="content" source="media/configure-credential-connection/update-provider.png" alt-text="Screenshot of updating credential provider settings in the portal.":::

To update a credential connection:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Credential manager**.
1. Select the credential provider (for example, *mygithub*).
1. In the provider window, select **Connections**.
1. In the row for the connection you want to update, select the context (...) menu, and select from the options. For example, to manage access policies, select **Edit access policies**.

    :::image type="content" source="media/configure-credential-connection/update-connection.png" alt-text="Screenshot of updating a credential connection in the portal.":::

## Related content

* Learn more about [configuring identity providers](credentials-configure-common-providers.md) for credentials.
* Review [limits](credentials-overview.md#limits) for credential providers and credentials.
