---
# Mandatory fields.
title: Create an app registration with Azure Digital Twins access
titleSuffix: Azure Digital Twins
description: Create a Microsoft Entra app registration that can access Azure Digital Twins resources.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 01/11/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q4

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create an app registration to use with Azure Digital Twins

This article describes how to create an [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) *app registration* that can access Azure Digital Twins. This article includes steps for the [Azure portal](https://portal.azure.com) and the [Azure CLI](/cli/azure/what-is-azure-cli).

When working with Azure Digital Twins, it's common to interact with your instance through client applications. Those applications need to authenticate with Azure Digital Twins, and some of the [authentication mechanisms](how-to-authenticate-client.md) that apps can use involve an app registration.

The app registration isn't required for all authentication scenarios. However, if you're using an authentication strategy or code sample that does require an app registration, this article shows you how to set one up and grant it permissions to the Azure Digital Twins APIs. It also covers how to collect important values that you'll need to use the app registration when authenticating.

>[!TIP]
> You may prefer to set up a new app registration every time you need one, or to do this only once, establishing a single app registration that will be shared among all scenarios that require it.

## Create the registration

Start by selecting the tab below for your preferred interface.

# [Portal](#tab/portal) 

Navigate to [Microsoft Entra ID](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) in the Azure portal (you can use this link or find it with the portal search bar). Select **App registrations** from the service menu, and then **+ New registration**.

:::image type="content" source="media/how-to-create-app-registration/new-registration.png" alt-text="Screenshot of the Microsoft Entra service page in the Azure portal, showing the steps to create a new registration in the 'App registrations' page." lightbox="media/how-to-create-app-registration/new-registration.png":::

In the **Register an application** page that follows, fill in the requested values:
* **Name**: a Microsoft Entra application display name to associate with the registration
* **Supported account types**: Select **Accounts in this organizational directory only (Default Directory only - Single tenant)**
* **Redirect URI**: An **Microsoft Entra application reply URL** for the Microsoft Entra application. Add a **Public client/native (mobile & desktop)** URI for `http://localhost`.

When you're finished, select the **Register** button.

:::image type="content" source="media/how-to-create-app-registration/register-an-application.png" alt-text="Screenshot of the 'Register an application' page in the Azure portal with the described values filled in." lightbox="media/how-to-create-app-registration/register-an-application.png":::

When the registration is finished setting up, the portal will redirect you to its details page.

# [CLI](#tab/cli)

Start by creating a manifest file, which contains service information that your app registration will need to access the Azure Digital Twins APIs. Afterwards, you'll pass this file into a CLI command to create the registration.

### Create manifest

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

If you're using Azure Cloud Shell for this tutorial, you'll need to upload the manifest file you created to the Cloud Shell, so that you can access it in Cloud Shell commands when configuring the app registration. If you're using a local installation of the Azure CLI, you can skip ahead to the next step, [Run the creation command](#run-the-creation-command).

To upload the file, go to the Cloud Shell window in your browser. Select the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell. The Upload icon is highlighted.":::

Navigate to the *manifest.json* file on your machine and select **Open**. Doing so will upload the file to the root of your Cloud Shell storage.

### Run the creation command

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

### Verify success

You can confirm that the Azure Digital Twins permissions were granted by looking for the following fields in the output of the creation command, under `requiredResourceAccess`. Confirm their values match what's listed below.
* `resourceAccess > id` is *4589bd03-58cb-4e6c-b17f-b580e39652f8*
* `resourceAppId` is *0b07f429-9f4b-4714-9392-cc5e8e80c8b0*

:::image type="content" source="media/how-to-create-app-registration/cli-required-resource-access.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command.":::

---

## Collect important values 

Next, collect some important values about the app registration that you'll need to use the app registration to authenticate a client application. These values include:
* resource name — When working with Azure Digital Twins, the **resource name** is `http://digitaltwins.azure.net`.
* client ID
* tenant ID
* client secret

The following sections describe how to find the remaining values.

### Collect client ID and tenant ID

To use the app registration for authentication, you may need to provide its **Application (client) ID** and **Directory (tenant) ID**. Here, you'll collect these values so you can save them and use them whenever they're needed.

# [Portal](#tab/portal) 

The client ID and tenant ID values can be collected from the app registration's details page in the Azure portal:

:::image type="content" source="media/how-to-create-app-registration/client-id-tenant-id.png" alt-text="Screenshot of the Azure portal showing the important values for the app registration."  lightbox="media/how-to-create-app-registration/client-id-tenant-id.png":::

Take note of the **Application (client) ID** and **Directory (tenant) ID** shown on your page.

# [CLI](#tab/cli)

You can find both of these values in the output from the `az ad app create` command that you ran [earlier](#run-the-creation-command). (You can also bring up the app registration's information again using [az ad app show](/cli/azure/ad/app#az-ad-app-show).)

Look for these values in the result:

Application (client) ID:

:::image type="content" source="media/how-to-create-app-registration/cli-app-id.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The appId value is highlighted.":::

Directory (tenant) ID:

:::image type="content" source="media/how-to-create-app-registration/cli-tenant-id.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The GUID value in the odata.metadata is highlighted.":::

---

### Collect client secret

Set up a client secret for your app registration, which other applications can use to authenticate through it.

# [Portal](#tab/portal) 

Start on your app registration page in the Azure portal. 

1. Select **Certificates & secrets** from the registration's menu, and then select **+ New client secret**.

    :::image type="content" source="media/how-to-create-app-registration/client-secret.png" alt-text="Screenshot of the Azure portal showing a Microsoft Entra app registration and a highlight around 'New client secret'.":::

1. Enter whatever values you want for Description and Expires, and select **Add**.

   :::image type="content" source="media/how-to-create-app-registration/add-client-secret.png" alt-text="Screenshot of the Azure portal while adding a client secret." lightbox="media/how-to-create-app-registration/add-client-secret-large.png":::

1. Verify that the client secret is visible on the **Certificates & secrets** page with Expires and Value fields. 

1. Take note of its **Secret ID** and **Value** to use later (you can also copy them to the clipboard with the Copy icons).

    :::image type="content" source="media/how-to-create-app-registration/client-secret-value.png" alt-text="Screenshot of the Azure portal showing how to copy the client secret value." lightbox="media/how-to-create-app-registration/client-secret-value.png":::

>[!IMPORTANT]
>Make sure to copy the values now and store them in a safe place, as they can't be retrieved again. If you can't find them later, you'll have to create a new secret.

# [CLI](#tab/cli)

To create a client secret for your app registration, you'll need your app registration's client ID value that you collected in the [previous step](#collect-client-id-and-tenant-id). Use the value in the following CLI command to create a new secret:

```azurecli-interactive
az ad app credential reset --id <client-ID> --append
```

You can also add optional parameters to this command to specify a credential description, end date, and other details. For more information about the command and its parameters, see [az ad app credential reset documentation](/cli/azure/ad/app/credential#az-ad-app-credential-reset).

The output of this command is information about the client secret that you've created. 

Copy the value for `password` to use when you need the client secret for authentication.

:::image type="content" source="media/how-to-create-app-registration/cli-client-secret.png" alt-text="Screenshot of Cloud Shell output of the app registration creation command. The password value is highlighted.":::

>[!IMPORTANT]
>Make sure to copy the value now and store it in a safe place, as it cannot be retrieved again. If you can't find the value later, you'll have to create a new secret.

---

## Provide Azure Digital Twins permissions

Next, configure the app registration you've created with permissions to access Azure Digital Twins. There are two types of permissions that are required:
* A role assignment for the app registration within the Azure Digital Twins instance
* API permissions for the app to read and write to the Azure Digital Twins APIs

### Create role assignment

In this section, you'll create a role assignment for the app registration on the Azure Digital Twins instance. This role will determine what permissions the app registration holds on the instance, so you should select the role that matches the appropriate level of permission for your situation. One possible role is [Azure Digital Twins Data Owner](../role-based-access-control/built-in-roles.md#azure-digital-twins-data-owner). For a full list of roles and their descriptions, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

# [Portal](#tab/portal) 

Use these steps to create the role assignment for your registration.

1. Open the page for your Azure Digital Twins instance in the Azure portal. 

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

1. Assign the appropriate role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Select as appropriate |
    | Members > Assign access to | User, group, or service principal |
    | Members > Members | **+ Select members**, then search for the name or [client ID](#collect-client-id-and-tenant-id) of the app registration |
    
   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot of the Roles tab in the Add role assignment page." lightbox="../../includes/role-based-access-control/media/add-role-assignment-page.png":::

   :::image type="content" source="media/how-to-create-app-registration/add-role.png" alt-text="Screenshot of the Members tab in the Add role assignment page." lightbox="media/how-to-create-app-registration/add-role.png":::

    Once the role has been selected, **Review + assign** it.

#### Verify role assignment

You can view the role assignment you've set up under **Access control (IAM) > Role assignments**.

:::image type="content" source="media/how-to-create-app-registration/verify-role-assignment.png" alt-text="Screenshot of the Role Assignments page for an Azure Digital Twins instance in the Azure portal." lightbox="media/how-to-create-app-registration/verify-role-assignment.png":::

The app registration should show up in the list along with the role you assigned to it. 

# [CLI](#tab/cli)

Use the [az dt role-assignment create](/cli/azure/dt/role-assignment#az-dt-role-assignment-create) command to assign the role (it must be run by a user with [sufficient permissions](how-to-set-up-instance-cli.md#prerequisites-permission-requirements) in the Azure subscription). The command requires you to pass in the name of the role you want to assign, the name of your Azure Digital Twins instance, and either the name or the object ID of the app registration.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<name-or-ID-of-app-registration>" --role "<appropriate-role-name>"
```

The result of this command is outputted information about the role assignment that's been created for the app registration.

To further verify the role assignment, you can look for it in the Azure portal (switch to the [Portal instruction tab](?tabs=portal#verify-role-assignment)).

---

### Provide API permissions

In this section, you'll grant your app baseline read/write permissions to the Azure Digital Twins APIs.

If you're using the Azure CLI and set up your app registration [earlier](#create-the-registration) with a manifest file, this step is already done. If you're using the Azure portal to create your app registration, continue through the rest of this section to set up API permissions.

# [Portal](#tab/portal) 

From the portal page for your app registration, select **API permissions** from the menu. On the following permissions page, select the **+ Add a permission** button.

:::image type="content" source="media/how-to-create-app-registration/add-permission.png" alt-text="Screenshot of the app registration in the Azure portal, highlighting the 'API permissions' menu option and 'Add a permission' button.":::

In the **Request API permissions** page that follows, switch to the **APIs my organization uses** tab and search for *Azure digital twins*. Select **Azure Digital Twins** from the search results to continue with assigning permissions for the Azure Digital Twins APIs.

:::image type="content" source="media/how-to-create-app-registration/request-api-permissions-1.png" alt-text="Screenshot of the 'Request API Permissions' page search result in the Azure portal showing Azure Digital Twins.":::

>[!NOTE]
> If your subscription still has an existing Azure Digital Twins instance from the previous public preview of the service (before July 2020), you'll need to search for and select **Azure Smart Spaces Service** instead. This is an older name for the same set of APIs (notice that the **Application (client) ID** is the same as in the screenshot above), and your experience won't be changed beyond this step.
> :::image type="content" source="media/how-to-create-app-registration/request-api-permissions-1-smart-spaces.png" alt-text="Screenshot of the 'Request API Permissions' page search result showing Azure Smart Spaces Service in the Azure portal.":::

Next, you'll select which permissions to grant for these APIs. Expand the **Read (1)** permission and check the box that says **Read.Write** to grant this app registration reader and writer permissions.

:::image type="content" source="media/how-to-create-app-registration/request-api-permissions-2.png" alt-text="Screenshot of the 'Request API Permissions' page and selecting 'Read.Write' permissions for the Azure Digital Twins APIs in the Azure portal.":::

Select **Add permissions** when finished.

#### Verify API permissions

On the **API permissions** page, verify that there's now an entry for Azure Digital Twins reflecting **Read.Write** permissions:

:::image type="content" source="media/how-to-create-app-registration/verify-api-permissions.png" alt-text="Screenshot of the API permissions for the Microsoft Entra app registration in the Azure portal, showing 'Read/Write Access' for Azure Digital Twins." lightbox="media/how-to-create-app-registration/verify-api-permissions.png":::

You can also verify the connection to Azure Digital Twins within the app registration's *manifest.json*, which was automatically updated with the Azure Digital Twins information when you added the API permissions.

To do so, select **Manifest** from the menu to view the app registration's manifest code. Scroll to the bottom of the code window and look for the following fields and values under `requiredResourceAccess`: 
* `"resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0"`
* `"resourceAccess"` > `"id": "4589bd03-58cb-4e6c-b17f-b580e39652f8"`

These values are shown in the screenshot below:

:::image type="content" source="media/how-to-create-app-registration/verify-manifest.png" alt-text="Screenshot of the manifest for the Microsoft Entra app registration in the Azure portal." lightbox="media/how-to-create-app-registration/verify-manifest.png":::

If these values are missing, retry the steps in the [section for adding the API permission](#provide-api-permissions).

# [CLI](#tab/cli)

If you're using the CLI, the API permissions were set up earlier as part of the [Create the registration](#create-the-registration) step. 

You can verify them now using the Azure portal (switch to the [Portal instruction tab](?tabs=portal#verify-api-permissions)).

---

## Other possible steps for your organization

It's possible that your organization requires more actions from subscription owners or administrators to finish setting up the app registration. The steps required may vary depending on your organization's specific settings. Choose a tab below to see this information tailored to your preferred interface.

# [Portal](#tab/portal) 

Here are some common potential activities that an owner or administrator on the subscription may need to do. These and other operations can be performed from the [Microsoft Entra App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.
* Grant admin consent for the app registration. Your organization may have **Admin Consent Required** globally turned on in Microsoft Entra ID for all app registrations within your subscription. If so, the owner/administrator will need to select this button for your company on the app registration's **API permissions** page for the app registration to be valid:

   :::image type="content" source="media/how-to-create-app-registration/grant-admin-consent.png" alt-text="Screenshot of the Azure portal showing the 'Grant admin consent' button under API permissions." lightbox="media/how-to-create-app-registration/grant-admin-consent.png":::

   - If consent was granted successfully, the entry for Azure Digital Twins should then show a **Status** value of **Granted for (your company)**
   
   :::image type="content" source="media/how-to-create-app-registration/granted-admin-consent-done.png" alt-text="Screenshot of the Azure portal showing the admin consent granted for the company under API permissions." lightbox="media/how-to-create-app-registration/granted-admin-consent-done.png":::

* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows

# [CLI](#tab/cli)

Here are some common potential activities that an owner or administrator on the subscription may need to do.
* Grant admin consent for the app registration. Your organization may have **Admin Consent Required** globally turned on in Microsoft Entra ID for all app registrations within your subscription. If so, the owner/administrator may need to grant additional delegated or application permissions.
* Activate public client access by appending `--set publicClient=true` to a create or update command for the registration.
* Set specific reply URLs for web and desktop access using the `--reply-urls` parameter. For more information on using this parameter with `az ad` commands, see the [az ad app documentation](/cli/azure/ad/app).
* Allow for implicit OAuth2 authentication flows using the `--oauth2-allow-implicit-flow` parameter. For more information on using this parameter with `az ad` commands, see the [az ad app documentation](/cli/azure/ad/app).

---

For more information about app registration and its different setup options, see [Register an application with the Microsoft identity platform](/graph/auth-register-app-v2).

## Next steps

In this article, you set up a Microsoft Entra app registration that can be used to authenticate client applications with the Azure Digital Twins APIs.

Next, read about authentication mechanisms, including one that uses app registrations and others that don't:
* [Write app authentication code](how-to-authenticate-client.md)
