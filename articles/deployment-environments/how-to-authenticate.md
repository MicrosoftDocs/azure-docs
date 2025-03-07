---
title: Authenticate to Azure Deployment Environments REST APIs
description: Learn how to authenticate to Azure Deployment Environments REST APIs as administrator or developer, by using the Azure CLI.
ms.service: azure-deployment-environments
ms.custom: build-2023
ms.topic: concept-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 01/31/2025

#customer intent: As a developer, I want to learn how to authenticate to Microsoft Dev Box REST APIs, so that I can securely interact with Microsoft Dev Box services.
---

# Authenticate to Azure Deployment Environments REST APIs

In this article, you'll learn how to authenticate to Microsoft Dev Box REST APIs using the Azure CLI. Authentication is a crucial step for accessing both administrator (control plane) and developer (data plane) APIs. This guide walks you through retrieving an access token from Microsoft Entra ID, understanding the token's structure and validity, and using the bearer token to access REST APIs. By following these steps, you can securely interact with Microsoft Dev Box services.

> [!TIP]
> Before authenticating, ensure that the user or identity has the appropriate permissions to perform the desired action. For more information, see [Provide access for dev team leads](./how-to-configure-project-admin.md) and [Provide access for developers](./how-to-configure-deployment-environments-user.md).

<a name='using-azure-ad-authentication-for-rest-apis'></a>

## Use Microsoft Entra ID authentication for REST APIs

Use the following procedures to access Azure Deployment Environments REST APIs by using Microsoft Entra ID. You can follow along in [Azure Cloud Shell](../../articles/cloud-shell/quickstart.md), on an Azure virtual machine, or on your local machine.

### Sign in to your Azure subscription

Start by authenticating with Microsoft Entra ID by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli
az login
```

The command opens a browser window to the Microsoft Azure authentication page, where you can choose an account. The page requires you to give your Microsoft Entra ID username and password.

Next, set the correct subscription context. If you authenticate from an incorrect subscription or tenant, you might receive unexpected *403 Forbidden* errors.

```azurecli
az account set --subscription <subscription_id>
```

<a name='retrieve-the-azure-ad-access-token'></a>

### Retrieve the Microsoft Entra ID access token

Use the Azure CLI to acquire an access token for the Microsoft Entra ID authenticated user. The resource ID is different depending on if you access administrator (control plane) APIs or developer (data plane) APIs.

For administrator APIs, use the following command:
```azurecli-interactive
az account get-access-token
```

For developer APIs, use the following command:
```azurecli-interactive
az account get-access-token --resource https://devcenter.azure.com
```

After authentication is successful, Microsoft Entra ID returns an access token for the current Azure subscription:

```json
{
  "accessToken": "[TOKEN]",
  "expiresOn": "[expiration_date_and_time]",
  "subscription": "[subscription_id]",
  "tenant": "[tenant_id]",
  "tokenType": "Bearer"
}
```

The token is a Base64 string. The token is valid for at least five minutes. The maximum duration is 90 minutes. The `expiresOn` defines the actual token expiration time.

> [!TIP]
> Developer API tokens for the service are encrypted and can't be decoded using JWT decoding tools. They can only be processed by the service.


### Use a bearer token to access REST APIs

To access REST APIs, you must set the authorization header on your request. The header value should be the string `Bearer` followed by a space and the token you received in the previous step.

## Related content

- Review [Microsoft Entra ID fundamentals](../../articles/active-directory/fundamentals/whatis.md)
