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

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it.

## Next steps

Test out individual REST API calls on your instance using the Azure Digital Twins CLI commands: 
* [az dt reference](/cli/azure/ext/azure-iot/dt?preserve-view=true&view=azure-cli-latest)
* [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md)

Or, see how to connect a client application to your instance with authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)