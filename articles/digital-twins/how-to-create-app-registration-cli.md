---
# Mandatory fields.
title: Create an app registration with Azure Digital Twins access (CLI)
titleSuffix: Azure Digital Twins
description: Use the CLI to create an Azure AD app registration that can access Azure Digital Twins resources.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/24/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q3

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create an app registration to use with Azure Digital Twins (CLI)

[!INCLUDE [digital-twins-create-app-registration-selector.md](../../includes/digital-twins-create-app-registration-selector.md)]

This article describes how to use the Azure CLI to create an [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) *app registration* that can access Azure Digital Twins.

When working with Azure Digital Twins, it's common to interact with your instance through client applications. Those applications need to authenticate with Azure Digital Twins, and some of the [authentication mechanisms](how-to-authenticate-client.md) that apps can use involve an app registration.

The app registration isn't required for all authentication scenarios. However, if you're using an authentication strategy or code sample that does require an app registration, this article shows you how to set one up and grant it permissions to the Azure Digital Twins APIs. It also covers how to collect important values that you'll need to use the app registration when authenticating.

>[!TIP]
> You may prefer to set up a new app registration every time you need one, or to do this only once, establishing a single app registration that will be shared among all scenarios that require it.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create manifest

First, create a file containing certain service information that your app registration will need to access the Azure Digital Twins APIs. Later, you'll pass in this file when creating the app registration, to set up the Azure Digital Twins permissions.

Create a new .json file on your computer called *manifest.json*. Copy this text into the file:

```json
[
	{
		"resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
		"resourceAccess": [
			{
				"id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
				"type": "Scope"
			}
		]
	}
]
```

The static value `0b07f429-9f4b-4714-9392-cc5e8e80c8b0` is the resource ID for the Azure Digital Twins service endpoint, which your app registration will need to access the Azure Digital Twins APIs.
 
Save the finished file.

### Cloud Shell users: Upload manifest

If you're using Cloud Shell for this tutorial, you'll need to upload the manifest file you created to the Cloud Shell, so that you can access it in Cloud Shell commands when configuring the app registration. If you're using a local installation of the Azure CLI, you can skip this step.

To upload the file, go to the Cloud Shell window in your browser. Select the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell. The Upload icon is highlighted.":::

Navigate to the *manifest.json* file on your machine and select **Open**. Doing so will upload the file to the root of your Cloud Shell storage.

## Create the registration

In this section, you'll run a CLI command to create an app registration with the following settings:
* Name of your choice
* Available only to accounts in the default directory (single tenant)
* A web reply URL of `http://localhost`
* Read/write permissions to the Azure Digital Twins APIs

Run the following command to create the registration. If you're using Cloud Shell, the path to the manifest.json file is `@manifest.json`.

```azurecli-interactive
az ad app create --display-name <app-registration-name> --available-to-other-tenants false --reply-urls http://localhost --native-app --required-resource-accesses "<path-to-manifest.json>"
```

The output of the command is information about the app registration you've created. 

## Verify success

You can confirm that the Azure Digital Twins permissions were granted by looking for the following fields in the output of the `az ad app create` command, and confirming their values match what's shown in the screenshot below:

:::image type="content" source="media/how-to-create-app-registration/cli-required-resource-access.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The items under 'requiredResourceAccess' are highlighted: there's a 'resourceAppId' value of 0b07f429-9f4b-4714-9392-cc5e8e80c8b0, and a 'resourceAccess > id' value of 4589bd03-58cb-4e6c-b17f-b580e39652f8.":::

You can also verify the app registration was successfully created with the necessary API permissions by using the Azure portal. For portal instructions, see [Verify API permissions (portal)](how-to-create-app-registration-portal.md#verify-api-permissions).

## Collect important values

Next, collect some important values about the app registration that you'll need to use the app registration to authenticate a client application. These values include:
* resource name
* client ID
* tenant ID
* client secret

To work with Azure Digital Twins, the resource name is `http://digitaltwins.azure.net`.

The following sections describe how to find the other values.

### Collect client ID and tenant ID

To use the app registration for authentication, you may need to provide its **Application (client) ID** and **Directory (tenant) ID**. In this section, you'll collect these values so you can save them and use them whenever they're needed.

You can find both of these values in the output from the `az ad app create` command.

Application (client) ID:

:::image type="content" source="media/how-to-create-app-registration/cli-app-id.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The appId value is highlighted.":::

Directory (tenant) ID:

:::image type="content" source="media/how-to-create-app-registration/cli-tenant-id.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The GUID value in the odata.metadata is highlighted.":::

### Collect client secret

To create a client secret for your app registration, you'll need your app registration's client ID value from the previous section. Use the value in the following CLI command to create a new secret:

```azurecli-interactive
az ad app credential reset --id <client-ID> --append
```

You can also add optional parameters to this command to specify a credential description, end date, and other details. For more information about the command and its parameters, see [az ad app credential reset documentation](/cli/azure/ad/app/credential#az-ad-app-credential-reset).

The output of this command is information about the client secret that you've created. Copy the value for `password` to use when you need the client secret for authentication.

:::image type="content" source="media/how-to-create-app-registration/cli-client-secret.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The password value is highlighted.":::

>[!IMPORTANT]
>Make sure to copy the value now and store it in a safe place, as it cannot be retrieved again. If you can't find the value later, you'll have to create a new secret.

## Create Azure Digital Twins role assignment

In this section, you'll create a role assignment for the app registration to set its permissions on the Azure Digital Twins instance. This role will determine what permissions the app registration holds on the instance, so you should select the role that matches the appropriate level of permission for your situation. One possible role is [Azure Digital Twins Data Owner](../role-based-access-control/built-in-roles.md#azure-digital-twins-data-owner). For a full list of roles and their descriptions, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

Use the following command to assign the role (must be run by a user with [sufficient permissions](how-to-set-up-instance-cli.md#prerequisites-permission-requirements) in the Azure subscription). The command requires you to pass in the name of the app registration.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<name-of-app-registration>" --role "<appropriate-role-name>"
```

The result of this command is outputted information about the role assignment that's been created for the app registration.

### Verify role assignment

To further verify the role assignment, you can look for it in the Azure portal. Follow the instructions in [Verify role assignment (portal)](how-to-create-app-registration-portal.md#verify-role-assignment).

## Other possible steps for your organization

It's possible that your organization requires more actions from subscription Owners/administrators to successfully set up an app registration. The steps required may vary depending on your organization's specific settings.

Here are some common potential activities that an Owner or administrator on the subscription may need to do.
* Grant admin consent for the app registration. Your organization may have **Admin Consent Required** globally turned on in Azure AD for all app registrations within your subscription. If so, the Owner/administrator may need to grant additional delegated or application permissions.
* Activate public client access by appending `--set publicClient=true` to a create or update command for the registration.
* Set specific reply URLs for web and desktop access using the `--reply-urls` parameter. For more information on using this parameter with `az ad` commands, see the [az ad app documentation](/cli/azure/ad/app).
* Allow for implicit OAuth2 authentication flows using the `--oauth2-allow-implicit-flow` parameter. For more information on using this parameter with `az ad` commands, see the [az ad app documentation](/cli/azure/ad/app).

For more information about app registration and its different setup options, see [Register an application with the Microsoft identity platform](/graph/auth-register-app-v2).

## Next steps

In this article, you set up an Azure AD app registration that can be used to authenticate client applications with the Azure Digital Twins APIs.

Next, read about authentication mechanisms, including one that uses app registrations and others that don't:
* [Write app authentication code](how-to-authenticate-client.md)