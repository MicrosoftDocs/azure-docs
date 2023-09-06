---
title: include file
description: include file
services: azure-communication-services
author: ddematheu2
manager: chpalm
ms.service: azure-communication-services
ms.subservice: identity
ms.date: 07/20/2022
ms.topic: include
ms.custom: mode-other, devx-track-azurecli
ms.author: dademath
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../create-communication-resource.md?#access-your-connection-strings-and-service-endpoints-using-azure-cli).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Setting up

### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.


### (Optional) Use Azure CLI identity operations without passing in a connection string

You can configure the `AZURE_COMMUNICATION_CONNECTION_STRING` environment variable to use Azure CLI identity operations without having to use `--connection_string` to pass in the connection string. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourConnectionString>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

### Store your access token in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourAccessToken>` with your actual access token.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_ACCESS_TOKEN "<yourAccessToken>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Operations

### Create an identity

To create access tokens, you need an identity. Azure Communication Services maintains a lightweight identity directory for this purpose. Use the `user create` command to create a new entry in the directory with a unique `Id`. The identity is required later for issuing access tokens.

```azurecli-interactive
az communication identity user create --connection-string "<yourConnectionString>"
```

- Replace `<yourConnectionString>` with your connection string.

### Create an identity and issue an access token in the same request

Run the following command to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../../concepts/authentication.md).

```azurecli-interactive
az communication identity token issue --scope chat --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.

### Issue access token

Run the following command to issue an access token for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../../concepts/authentication.md).

```azurecli-interactive
az communication identity token issue --scope chat --user "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

### Issue access token with multiple scopes

Run the following command to issue an access token with multiple scopes for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Identity model](../../../../concepts/identity-model.md#access-tokens).

```azurecli-interactive
az communication identity token issue --scope chat voip --user "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

### Exchange an Azure AD access token of the Teams User for a Communication Identity access token

Use the `token get-for-teams-user` command to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```azurecli-interactive
az communication identity token get-for-teams-user --aad-token "<yourAadToken>" --client "<yourAadApplication>" --aad-user "<yourAadUser>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<yourAadUser>` with your Azure Active Directory userId.
- Replace `<yourAadApplication>` with your Azure Active Directory application Id.
- Replace `<yourAadToken>` with your Azure Active Directory access token.

### Revoke access tokens

You might occasionally need to explicitly revoke an access token. For example, you would do so when application users change the password they use to authenticate to your service. The `token revoke` command invalidates all active access tokens that were issued to the identity.

```azurecli-interactive
az communication identity token revoke --user "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.

### Delete an identity

When you delete an identity, you revoke all active access tokens and prevent the further issuance of access tokens for the identity. Doing so also removes all persisted content that's associated with the identity.

```azurecli-interactive
az communication identity user delete --user "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.
