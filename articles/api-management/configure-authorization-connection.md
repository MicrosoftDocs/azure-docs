---
title: Configure multiple authorization connections - Azure API Management 
description: Learn how to set up multiple authorization connections to a configured authorization provider using the portal. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 03/16/2023
ms.author: danlep
---

# Configure multiple authorization connections

You can configure multiple authorizations (also called *authorization connections*) to an authorization provider in your API Management instance. For example, if you configured Microsoft Entra ID as an authorization provider, you might need to create multiple authorizations for different scenarios and users.

In this article, you learn how to add an authorization connection to an existing provider, using the portal. For an overview of configuration steps, see [How to configure authorizations?](authorizations-overview.md#how-to-configure-authorizations)

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md).
* A configured authorization provider. For example, see the steps to create a provider for [GitHub](authorizations-how-to-github.md) or [Microsoft Entra ID](authorizations-how-to-azure-ad.md).
 
## Create an authorization connection - portal

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Authorizations**.
1. Select the authorization provider that you want to create multiple connections for (for example, *mygithub*).

    :::image type="content" source="media/configure-authorization-connection/select-provider.png" alt-text="Screenshot of selecting an authorization provider in the portal.":::
1. In the provider windows, select **Authorization**, and then select **+ Create**.

    :::image type="content" source="media/configure-authorization-connection/create-authorization.png" alt-text="Screenshot of creating an authorization connection in the portal.":::
1. Complete the steps for your authorization connection.
    1. On the **Authorization** tab, enter an **Authorization name**. Select **Create**, then select **Next**. 
    1. On the **Login** tab (for authorization code grant type), complete the steps to login to the authorization provider to allow access. Select **Next**.
    1. On the **Access policy** tab, assign access to the Microsoft Entra identity or identities that can use the authorization. Select **Complete**.
1. The new connection appears in the list of authorizations, and shows a status of **Connected**.

    :::image type="content" source="media/configure-authorization-connection/list-authorizations.png" alt-text="Screenshot of list of authorization connections in the portal.":::

If you want to create another authorization connection for the provider, complete the preceding steps.

## Manage authorizations - portal

You can manage authorization provider settings and authorization connections in the portal. For example, you might need to update client credentials for the authorization provider.

To update provider settings:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Authorizations**.
1. Select the authorization provider that you want to manage.
1. In the provider windows, select **Settings**.
1. In the provider settings, make updates, and select **Save**.

    :::image type="content" source="media/configure-authorization-connection/update-provider.png" alt-text="Screenshot of updating authorization provider settings in the portal.":::

To update an authorization connection:

1. Sign into [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Authorizations**.
1. Select the authorization provider (for example, *mygithub*).
1. In the provider window, select **Authorization**.
1. In the row for the authorization connection you want to update, select the context (...) menu, and select from the options. For example, to manage access policies, select **Access policies**.

    :::image type="content" source="media/configure-authorization-connection/update-connection.png" alt-text="Screenshot of updating an authorization connection in the portal.":::

## Next steps

* Learn more about [configuring identity providers](authorizations-configure-common-providers.md) for authorizations.
* Review [limits](authorizations-overview.md#limits) for authorization providers and authorizations.
