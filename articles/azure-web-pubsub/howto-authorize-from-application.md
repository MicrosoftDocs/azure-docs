---
title: Authorize an application request by using Microsoft Entra ID
description: Learn how to authorize an application request to Web PubSub resources by using Microsoft Entra ID.
author: terencefan
ms.author: tefa
ms.date: 10/12/2024
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Authorize an application request by using Microsoft Entra ID

Azure Web PubSub supports Microsoft Entra ID for authorizing requests from [applications](../active-directory/develop/app-objects-and-service-principals.md).

This article shows you how to configure your Web PubSub resource and code to authorize a request to a Web PubSub resource from an Azure application.

## Register an application

The first step is to register an Azure application.

1. In the [Azure portal](https://portal.azure.com/), search for and then select **Microsoft Entra ID**.
1. On the left menu under **Manage**, select **App registrations**.
1. Select **New registration**.
1. For **Name**, enter a name to use for your application.
1. Select **Register** to confirm the application registration.

:::image type="content" source="media/howto-authorize-from-application/register-an-application.png" alt-text="Screenshot that shows registering an application.":::

When your application is registered, go to the application overview to view the values for **Application (client) ID** and **Directory (tenant) ID**. You use these values in the following sections.

:::image type="content" source="media/howto-authorize-from-application/application-overview.png" alt-text="Screenshot that shows an application.":::

For more information about registering an application, see the quickstart [Register an application by using the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).

## Add credentials

You can add both certificates and client secrets (a string) as credentials to your confidential client app registration.

For more information about adding credentials, see [Add credentials](../active-directory/develop/quickstart-register-app.md#add-credentials).

### Add a client secret

The application requires a client secret for a client to prove its identity when it requests a token.

To create a client secret:

1. On the left menu under **Manage**, select **Certificates & secrets**.
1. On the **Client secrets** tab, select **New client secret**.

   :::image type="content" source="media/howto-authorize-from-application/new-client-secret.png" alt-text="Screenshot that shows creating a client secret.":::

1. Enter a description for the client secret, and then choose an **Expires** time for the secret.
1. Copy the value of the client secret and paste it in a secure location for later use.

   > [!NOTE]
   > The secret is visible only when you create the secret. You can't view the client secret in the portal later.

### Add a certificate

You can upload a certificate instead of creating a client secret.

:::image type="content" source="media/howto-authorize-from-application/upload-certificate.png" alt-text="Screenshot that shows uploading a certificate.":::

## Add a role assignment in the Azure portal

This section demonstrates how to assign a Web PubSub Service Owner role to a service principal (application) for a Web PubSub resource.

> [!NOTE]
> You can assign a role to any scope, including management group, subscription, resource group, and single resource. For more information about scope, see [Understand scope for Azure role-based access control](../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Web PubSub resource.

1. On the left menu, select **Access control (IAM)** to display access control settings for the resource.

1. Select the **Role assignments** tab and view the role assignments at this scope.

   The following figure shows an example of the **Access control (IAM)** pane for a Web PubSub resource:

   :::image type="content" source="media/howto-authorize-from-application/access-control.png" alt-text="Screenshot that shows an example of the Access control (IAM) pane.":::

1. Select **Add** > **Add role assignment**.

1. Select the **Roles** tab, and then select **Web PubSub Service Owner**.

1. Select **Next**.

   :::image type="content" source="media/howto-authorize-from-application/add-role-assignment.png" alt-text="Screenshot that shows adding a role assignment.":::

1. Select the **Members** tab. Under **Assign access to**, select **User, group, or service principal**.

1. Choose **Select members**.

1. Search for and select the application to assign the role to.

1. Choose **Select** to confirm the selection.

1. Select **Next**.

   :::image type="content" source="media/howto-authorize-from-application/assign-role-to-service-principals.png" alt-text="Screenshot that shows assigning a role to service principals.":::

1. Select **Review + assign** to confirm the change.

> [!IMPORTANT]
> Azure role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure role assignments, see these articles:

- [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml)
- [Assign Azure roles by using REST API](../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles by using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles by using the Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles by using an Azure Resource Manager template](../role-based-access-control/role-assignments-template.md)

## Code samples that use Microsoft Entra authorization

Get samples that use Microsoft Entra authorization in our four officially supported programming languages:

- [C#](./howto-create-serviceclient-with-net-and-azure-identity.md)
- [Python](./howto-create-serviceclient-with-python-and-azure-identity.md)
- [Java](./howto-create-serviceclient-with-java-and-azure-identity.md)
- [JavaScript](./howto-create-serviceclient-with-javascript-and-azure-identity.md)

## Related content

- [Overview of Microsoft Entra ID for Web PubSub](concept-azure-ad-authorization.md)
- [Use Microsoft Entra ID to authorize a request from a managed identity to Web PubSub resources](howto-authorize-from-managed-identity.md)
- [Disable local authentication](./howto-disable-local-auth.md)
