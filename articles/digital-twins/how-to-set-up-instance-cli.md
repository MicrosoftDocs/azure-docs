---
# Mandatory fields.
title: Set up an instance and authentication (CLI)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using the CLI
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/23/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (CLI)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one, using the CLI.
* To go through these steps manually using the Azure portal, see the portal version of this article: [*How-to: Set up an instance and authentication (portal)*](how-to-set-up-instance-portal.md).
* To run through an automated setup using a deployment script sample, see the scripted version of this article: [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md).

[!INCLUDE [digital-twins-setup-steps-prereq.md](../../includes/digital-twins-setup-steps-prereq.md)]
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Set up Cloud Shell session
[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

## Create the Azure Digital Twins instance

In this section, you will **create a new instance of Azure Digital Twins** using the Cloud Shell command. You'll need to provide:
* A resource group to deploy it in. If you don't already have an existing resource group in mind, you can create one now with this command:
    ```azurecli
    az group create --location <region> --name <name-for-your-resource-group>
    ```
* A region for the deployment. To see what regions support Azure Digital Twins, visit [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* A name for your instance. The name of the new instance must be unique within the region for your subscription (meaning that if your subscription has another Azure Digital Twins instance in the region that's already using the name you choose, you'll be asked to pick a different name).

Use these values in the following command to create the instance:

```azurecli
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l <region>
```

### Verify success and collect important values

If the instance was created successfully, the result in Cloud Shell looks something like this, outputting information about the resource you've created:

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all important values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources. If other users will be programming against the instance, you should share these values with them.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

## Set up user access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](../../includes/digital-twins-setup-role-assignment.md)]

Use the following command to assign the role (must be run by a user with [sufficient permissions](#prerequisites-permission-requirements) in the Azure subscription). The command requires you to pass in the *user principal name* on the Azure AD account for the user that should be assigned the role. In most cases, this will match the user's email on the Azure AD account.

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<Azure-AD-user-principal-name-of-user-to-assign>" --role "Azure Digital Twins Owner (Preview)"
```

The result of this command is outputted information about the role assignment that's been created.

> [!NOTE]
> If this command returns an error saying that the CLI **cannot find user or service principal in graph database**:
>
> Assign the role using the user's *Object ID* instead. This may happen for users on personal [Microsoft accounts (MSAs)](https://account.microsoft.com/account). 
>
> Use the [Azure portal page of Azure Active Directory users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) to select the user account and open its details. Copy the user's *ObjectID*:
>
> :::image type="content" source="media/includes/user-id.png" alt-text="View of user page in Azure portal highlighting the GUID in the 'Object ID' field" lightbox="media/includes/user-id.png":::
>
> Then, repeat the role assignment list command using the user's *Object ID* for the `assignee` parameter above.

### Verify success

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it. Next, you'll set up permissions for a client app to access it.

## Set up access permissions for client applications

[!INCLUDE [digital-twins-setup-app-registration.md](../../includes/digital-twins-setup-app-registration.md)]

To create an app registration, you need to provide the resource IDs for the Azure Digital Twins APIs, and the baseline permissions to the API.

In your working directory, create a new file and enter the following JSON snippet to configure these details: 

```json
[{
    "resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
    "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
    ]
}]
``` 

Save this file as _**manifest.json**_.

> [!NOTE] 
> There are some places where a "friendly," human-readable string `https://digitaltwins.azure.net` can be used for the Azure Digital Twins resource app ID instead of the GUID `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. For instance, many examples throughout this documentation set use authentication with the MSAL library, and the friendly string can be used for that. However, during this step of creating the app registration, the GUID form of the ID is required as it is shown above. 

Next, you'll upload this file to Cloud Shell. In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration, with a *Public client/native (mobile & desktop)* reply URL of `http://localhost`. Replace placeholders as needed:

```azurecli
az ad app create --display-name <name-for-your-app-registration> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

Here is an excerpt of the output from this command, showing information about the registration you've created:

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/new-app-registration.png" alt-text="Cloud Shell output of new Azure AD app registration":::

### Verify success

[!INCLUDE [digital-twins-setup-verify-app-registration-1.md](../../includes/digital-twins-setup-verify-app-registration-1.md)]

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

[!INCLUDE [digital-twins-setup-verify-app-registration-2.md](../../includes/digital-twins-setup-verify-app-registration-2.md)]

### Collect important values

Next, select *Overview* from the menu bar to see the details of the app registration:

:::image type="content" source="media/how-to-set-up-instance/portal/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. These values will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). If you are not the person who will be writing code for such applications, you'll need to share these values with the person who will be.

### Other possible steps for your organization

[!INCLUDE [digital-twins-setup-additional-requirements.md](../../includes/digital-twins-setup-additional-requirements.md)]

## Next steps

Test out individual REST API calls on your instance using the Azure Digital Twins CLI commands: 
* [az dt reference](https://docs.microsoft.com/cli/azure/ext/azure-iot/dt?view=azure-cli-latest)
* [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md)

Or, see how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)