---
title: Enable a token store in Azure Container Apps
description: Learn to secure authentication tokens independent of your application.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 02/26/2024
ms.author: cshoe
---

# Enable a token store in Azure Container Apps

Azure Container Apps authentication supports a feature called token store. A token store is a repository of tokens that are associated with the users of your web apps and APIs. You enable a token store by configuring your container app with an Azure Storage account.

Your application code sometimes needs to access data from these providers on the user's behalf, such as:

* post to the authenticated user's Facebook timeline
* read the user's corporate data using the Microsoft Graph API

You typically must write code to collect, store, and refresh these tokens in your application. With the token store, you just [retrieve the tokens](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-oauth-tokens#retrieve-tokens-in-app-code) when you need them and [tell Container Apps to refresh them](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-oauth-tokens#refresh-auth-tokens) when they become invalid.

The ID tokens, access tokens, and refresh tokens are cached for the authenticated session, and they're accessible only by the associated user.

## Generate a SAS URL

Before you can create a token store for your container app, you first need an Azure Storage account with a private container.

1. Go to your storage account or [create a new one](/azure/storage/common/storage-account-create?tabs=azure-portal) in the Azure portal.

1. Select **Containers** and create a private container if necessary.

1. Select the three dots (•••) at the end of the row for your container.

1. Enter the values appropriate to your needs in the *Generate SAS* window.

    > [!NOTE]
    > Make sure your keep track of your SAS expiration dates to ensure access to your container doesn't cease.

1. Select the **Generate SAS token URL** button to generate the SAS URL.

1. Copy the SAS URL and paste it into a text editor for use in a following step.

## Save SAS URL as secret

Now that you have generated your SAS URL, you can save it in your container app as a secret.

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

If you would like to create your store using an ARM template, use the following example.

```json
{}
```

## Next steps

> [!div class="nextstepaction"]
> [Customize sign in and sign out](authentication.md#customize-sign-in-and-sign-out.md)