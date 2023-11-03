---
title: Authenticate to Microsoft Dev Box REST APIs
description: Learn how to authenticate to Microsoft Dev Box REST APIs.
ms.service: dev-box
ms.custom: ignite-2022
ms.topic: conceptual
ms.author: chrismiller
author: chrismiller
ms.date: 09/07/2023
---
# Authenticating to Microsoft Dev Box REST APIs

> [!TIP]
> Before authenticating, ensure that the user or identity has the appropriate permissions to perform the desired action. For more information, see [configuring project admins](./how-to-project-admin.md) and [configuring Dev Box users](./how-to-dev-box-user.md).


<a name='using-azure-ad-authentication-for-rest-apis'></a>

## Using Microsoft Entra authentication for REST APIs

Use the following procedures to authenticate with Microsoft Entra ID. You can follow along in [Azure Cloud Shell](../../articles/cloud-shell/quickstart.md), on an Azure virtual machine, or on your local machine.

### Sign in to the user's Azure subscription

Start by authenticating with Microsoft Entra ID by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli
az login
```

The command opens a browser window to the Microsoft Entra authentication page. It requires you to give your Microsoft Entra user ID and password.

Next, set the correct subscription context. If you authenticate from an incorrect subscription or tenant you may receive unexpected 403 Forbidden errors.

```azurecli
az account set --subscription <subscription_id>
```


<a name='retrieve-the-azure-ad-access-token'></a>

### Retrieve the Microsoft Entra access token

Use the Azure CLI to acquire an access token for the Microsoft Entra authenticated user.
Note that the resource ID is different depending on if you are accessing administrator (control plane) APIs or developer (data plane) APIs.

For administrator APIs, use the following command:
```azurecli-interactive
az account get-access-token
```

For developer APIs, use the following command:
```azurecli-interactive
az account get-access-token --resource https://devcenter.azure.com
```

After authentication is successful, Microsoft Entra ID returns an access token for current Azure subscription:

```json
{
  "accessToken": "[TOKEN]",
  "expiresOn": "[expiration_date_and_time]",
  "subscription": "[subscription_id]",
  "tenant": "[tenant_id]",
  "tokenType": "Bearer"
}
```

The token is a Base64 string. The token is valid for at least 5 minutes with the maximum of 90 minutes. The expiresOn defines the actual token expiration time.

> [!TIP]
> Developer API tokens for the service are encrypted and cannot be decoded using JWT decoding tools. They can only be processed by the service.


### Using a bearer token to access REST APIs
To access REST APIs, you must set the Authorization header on your request. The header value should be the string `Bearer` followed by a space and the token you received in the previous step.

## Next steps
- Review [Microsoft Entra fundamentals](../../articles/active-directory/fundamentals/whatis.md).
