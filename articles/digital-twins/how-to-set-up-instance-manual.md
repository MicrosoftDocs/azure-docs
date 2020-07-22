---
# Mandatory fields.
title: Set up an instance and authentication (manual)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service, including the proper authentication. Manual version.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (manual)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one. To run through an automated setup using a deployment script sample, see the scripted version of this article: [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md).

[!INCLUDE [digital-twins-setup-starter.md](../../includes/digital-twins-setup-starter.md)]

## Set up Cloud Shell session
[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

## Create the Azure Digital Twins instance

In this section, you will **create a new instance of Azure Digital Twins** using the Cloud Shell command. You'll need to provide:
* A resource group to deploy it in. If you don't already have an existing resource group in mind, you can create one now with this command:
    ```azurecli
    az group create --location <region> --name <name-for-your-resource-group>
    ```
* A region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* A name for your instance. The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll be asked to pick a different name).

Use these values in the following command to create the instance:

```azurecli
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l <region>
```

### Verify success

If the instance was created successfully, the result in Cloud Shell looks something like this, outputting information about the resource you've created:

:::image type="content" source="media/how-to-set-up-instance/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all important values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

## Set up your user's access permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before a user can make data plane calls to your Azure Digital Twins instance, that user must first be assigned a role with permissions to do so.

For Azure Digital Twins, this role is _**Azure Digital Twins Owner (Preview)**_. You can read more about roles and security in [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md).

This section will show you how to create a role assignment for a user in the Azure Digital Twins instance, through their email associated with the AAD tenant on your Azure subscription. Depending on your role and your permissions on your Azure subscription, you will either set this up for yourself, or set this up on behalf of someone else who will be managing the Azure Digital Twins instance.

### Assign the role

To give a user permissions to manage an Azure Digital Twins instance, you must assign them the *Azure Digital Twins Owner (Preview)* role within the instance. This is different from the *Owner* role on the entire Azure subscription, as it is scoped to this individual Azure Digital Twins resource.

Use the following command (must be run by an owner of the Azure subscription):

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<AAD-email-of-user-to-assign>" --role "Azure Digital Twins Owner (Preview)"
```

The result of this command is outputted information about the role assignment that's been created.

> [!TIP]
> If you get a *400: BadRequest* error instead, run the following command to get the *ObjectID* for the user:
> ```azurecli
> az ad user show --id <AAD-email-of-user-to-assign> --query objectId
> ```
> Then, repeat the role assignment command using the user's *Object ID* in place of their email.

### Verify success

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it. Next, you'll set up permissions for a client app to access it.

## Set up access permissions for client applications

Once you set up an Azure Digital Twins instance, it is common to interact with that instance through a client application that you create. In order to do this, you'll need to make sure the client app will be able to authenticate against Azure Digital Twins. This is done by setting up an [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) **app registration** for your client app to use.

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Later, the client app will authenticate against the app registration, and as a result be granted the configured access permissions to the APIs.

>[!TIP]
> As a subscription Owner, you may prefer to set up a new app registration for every new Azure Digital Twins instance, *or* to do this only once and establish a single app registration that will be shared among all Azure Digital Twins instances in the subscription. This is how it's done within Microsoft's own tenant.

### Create the registration

To create an app registration, you need to provide the resource IDs for the Azure Digital Twins APIs, and the baseline permissions to the API. In your working directory, open a new file and enter the following JSON snippet to configure these details: 

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

Save this file as *manifest.json*.

> [!NOTE] 
> There are some places where a "friendly," human-readable string `https://digitaltwins.azure.net` can be used for the Azure Digital Twins resource app ID instead of the GUID `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. For instance, many examples throughout this documentation set use authentication with the MSAL library, and the friendly string can be used for that. However, during this step of creating the app registration, the GUID form of the ID is required as it is shown above. 

In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-set-up-instance/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

Here is an excerpt of the output from this command, showing information about the registration you've created:

:::image type="content" source="media/how-to-set-up-instance/new-app-registration.png" alt-text="Cloud Shell output of new AAD app registration":::

### Verify success

[!INCLUDE [digital-twins-setup-verify-app-registration.md](../../includes/digital-twins-setup-verify-app-registration.md)]

### Collect important values

Next, select *Overview* from the menu bar to see the details of the app registration:

:::image type="content" source="media/how-to-set-up-instance/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. These values will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). If you are not the person who will be writing code for such applications, you'll need to share these values with the person who will be.

### Other possible steps for your organization

[!INCLUDE [digital-twins-setup-additional-requirements.md](../../includes/digital-twins-setup-additional-requirements.md)]

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
