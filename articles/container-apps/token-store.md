---
title: Enable an authentication token store in Azure Container Apps
description: Learn to secure authentication tokens independent of your application.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 04/04/2024
ms.author: cshoe
---

# Enable an authentication token store in Azure Container Apps

Azure Container Apps authentication supports a feature called token store. A token store is a repository of tokens that are associated with the users of your web apps and APIs. You enable a token store by configuring your container app with an Azure Blob Storage container.

Your application code sometimes needs to access data from these providers on the user's behalf, such as:

* Post to an authenticated user's Facebook timeline
* Read a user's corporate data using the Microsoft Graph API

You typically need to write code to collect, store, and refresh tokens in your application. With a token store, you can [retrieve tokens](../app-service/configure-authentication-oauth-tokens.md#retrieve-tokens-in-app-code) when you need them, and [tell Container Apps to refresh them](../app-service/configure-authentication-oauth-tokens.md#refresh-auth-tokens) as they become invalid.

When token store is enabled, the Container Apps authentication system caches ID tokens, access tokens, and refresh tokens the authenticated session, and they're accessible only by the associated user.

> [!NOTE]
> The token store feature is in preview.

## Generate a SAS URL

Before you can create a token store for your container app, you first need an Azure Storage account with a private blob container.

1. Go to your storage account or [create a new one](/azure/storage/common/storage-account-create?tabs=azure-portal) in the Azure portal.

1. Select **Containers** and create a private blob container if necessary.

1. Select the three dots (•••) at the end of the row for the storage container where you want to create your token store.

1. Enter the values appropriate for your needs in the *Generate SAS* window.

    Make sure you include the *read*, *write* and *delete* permissions in your definition.

    > [!NOTE]
    > Make sure you keep track of your SAS expiration dates to ensure access to your container doesn't cease.

1. Select the **Generate SAS token URL** button to generate the SAS URL.

1. Copy the SAS URL and paste it into a text editor for use in a following step.

## Save SAS URL as secret

With SAS URL generated, you can save it in your container app as a secret. Make sure the permissions associated with your store include valid permissions to your blob storage container.

1. Go to your container app in the Azure portal.

1. Select **Secrets**.

1. Select **Add** and enter the following values in the *Add secret* window.

    | Property | Value |
    |---|---|
    | Key | Enter a name for your SAS secret. |
    | Type | Select **Container Apps secret**. |
    | Value | Enter the SAS URL value you generated from your storage container. |

## Create a token store

Use the `containerapp auth update` command to associate your Azure Storage account to your container app and create the token store.

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

```azurecli
az containerapp auth update \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME> \
  --sas-url-secret-name <SAS_SECRET_NAME> \
  --token-store true
```

Additionally, you can create your token store with the `sasUrlSettingName` property using an [ARM template](/azure/templates/microsoft.app/2023-11-02-preview/containerapps/authconfigs?pivots=deployment-language-arm-template#blobstoragetokenstore-1).

## Next steps

> [!div class="nextstepaction"]
> [Customize sign in and sign out](authentication.md#customize-sign-in-and-sign-out)
