---
title: Authenticate to Azure Deployment Environments REST APIs
description: Learn how to authenticate to Azure Deployment Environments REST APIs.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.topic: conceptual
ms.author: chrismiller
author: chrismiller
ms.date: 09/07/2023
---
# Authenticating to Azure Deployment Environments REST APIs

> [!TIP]
> Before authenticating, ensure that the user or identity has the appropriate permissions to perform the desired action. For more information, see [configuring project admins](./how-to-configure-project-admin.md) and [configuring environment users](./how-to-configure-deployment-environments-user.md).


## Using Azure AD authentication for REST APIs

Use the following procedures to authenticate with Azure AD. You can follow along in [Azure Cloud Shell](../../articles/cloud-shell/quickstart.md), on an Azure virtual machine, or on your local machine.

### Sign in to the user's Azure subscription

Start by authenticating with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli
az login
```

The command opens a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and password.

Next, set the correct subscription context. If you authenticate from an incorrect subscription or tenant you may receive unexpected 403 Forbidden errors.

```azurecli
az account set --subscription <subscription_id>
```


### Retrieve the Azure AD access token

Use the Azure CLI to acquire an access token for the Azure AD authenticated user.
Note that the resource ID is different depending on if you are accessing administrator (control plane) APIs or developer (data plane) APIs.

For administrator APIs, use the following command:
```azurecli-interactive
az account get-access-token
```

For developer APIs, use the following command:
```azurecli-interactive
az account get-access-token --resource https://devcenter.azure.com
```

After authentication is successful, Azure AD returns an access token for current Azure subscription:

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
- Review [Azure Active Directory fundamentals](../../articles/active-directory/fundamentals/whatis.md).
