---
title: Set up an instance and authentication (CLI)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using the CLI
author: baanders
ms.author: baanders
ms.date: 4/21/2025
ms.topic: how-to
ms.service: azure-digital-twins
ms.devlang: azurecli
ms.custom:
  - engagement-fy23
  - devx-track-azurecli
  - sfi-image-nochange

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (CLI)

[!INCLUDE [digital-twins-setup-selector.md](includes/digital-twins-setup-selector.md)]

This article covers the steps to set up a new Azure Digital Twins instance, including creating the instance and setting up authentication. After completing this article, you'll have an Azure Digital Twins instance ready to start programming against.

[!INCLUDE [digital-twins-setup-steps.md](includes/digital-twins-setup-steps.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [CLI setup for Azure Digital Twins](includes/digital-twins-cli.md)]

## Create the Azure Digital Twins instance

In this section, you create a new instance of Azure Digital Twins using the CLI command. You need to provide:
* A resource group where the instance is deployed. If you don't already have an existing resource group in mind, you can create one now with this command:
    ```azurecli-interactive
    az group create --location <region> --name <name-for-your-resource-group>
    ```
* A region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* A name for your instance. If your subscription has another Azure Digital Twins instance in the region that is
  already using the specified name, you're asked to pick a different name.

Use these values in the following [az dt command](/cli/azure/dt) to create the instance:

```azurecli-interactive
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> --resource-group <your-resource-group> --location <region>
```

There are several optional parameters that can be added to the command to specify other things about your resource during creation, including creating a managed identity for the instance or enabling/disabling public network access. For a full list of supported parameters, see the [az dt create](/cli/azure/dt#az-dt-create) reference documentation.

### Create the instance with a managed identity

When you enable a [managed identity](concepts-security.md#managed-identity-for-accessing-other-resources) on your Azure Digital Twins instance, an identity is created for it in [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md). That identity can then be used to authenticate to other services. You can enable a managed identity for an Azure Digital Twins instance while the instance is being created, or [later on an existing instance](#enabledisable-managed-identity-for-the-instance).

Use the following CLI command for your chosen type of managed identity.

#### System-assigned identity command

To create an Azure Digital Twins instance with *system-assigned identity* enabled, you can add an `--mi-system-assigned` parameter to the `az dt create` command that's used to create the instance. (For more information about the creation command, see its [reference documentation](/cli/azure/dt#az-dt-create) or the [general instructions for setting up an Azure Digital Twins instance](how-to-set-up-instance-cli.md#create-the-azure-digital-twins-instance)).

To create an instance with a system-assigned identity, add the  `--mi-system-assigned` parameter like this:

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --mi-system-assigned
```

#### User-assigned identity command

To create an instance with a *user-assigned identity*, provide the ID of an existing user assigned identity using the  `--mi-user-assigned` parameter, like this:

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --mi-user-assigned <user-assigned-identity-resource-ID>
```

### Verify success and collect important values

If the instance was created successfully, the result in the CLI looks something like this, outputting information about the resource you created:

:::image type="content" source="media/how-to-set-up-instance/cloud-shell/create-instance.png" alt-text="Screenshot of the Cloud Shell window with successful creation of a resource group and Azure Digital Twins instance in the Azure portal." lightbox="media/how-to-set-up-instance/cloud-shell/create-instance.png":::

Note the Azure Digital Twins instance's **hostName**, **name**, and **resourceGroup** from the output. These values are all important and you might need to use them as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources. If other users are programming against the instance, you should share these values with them.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

You now have an Azure Digital Twins instance ready to go. Next, you give the appropriate Azure user permissions to manage it.

## Set up user access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](includes/digital-twins-setup-role-assignment.md)]

### Prerequisites: Permission requirements

[!INCLUDE [digital-twins-setup-permissions.md](includes/digital-twins-setup-permissions.md)]

### Assign the role

To give a user permission to manage an Azure Digital Twins instance, you must assign them the **Azure Digital Twins Data Owner** role within the instance.

Use the following command to assign the role. A user with [sufficient permissions](#prerequisites-permission-requirements) in the Azure subscription must run the command. The command requires you to pass in the *user principal name* on the Microsoft Entra account for the user that should be assigned the role. In most cases, this value matches the user's email on the Microsoft Entra account.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<Azure-AD-user-principal-name-of-user-to-assign>" --role "Azure Digital Twins Data Owner"
```

The result of this command is outputted information about the role assignment that was created for the user.

> [!NOTE]
> If this command returns an error saying that the CLI **cannot find user or service principal in graph database**, assign the role using the user's Object ID instead. This may happen for users on personal [Microsoft accounts (MSAs)](https://account.microsoft.com/account). 
>
> Use the [Azure portal page of Microsoft Entra users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) to select the user account and open its details. Copy the user's **Object ID**:
>
> :::image type="content" source="media/includes/user-id.png" alt-text="Screenshot of the user page in Azure portal highlighting the GUID in the 'Object ID' field." lightbox="media/includes/user-id-large.png":::
>
> Then, repeat the role assignment list command using the user's Object ID for the `assignee` parameter in the previous command.

### Verify success

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](includes/digital-twins-setup-verify-role-assignment.md)]

You now have an Azure Digital Twins instance ready to go, and assigned permissions to manage it.

## Enable/disable managed identity for the instance 

This section shows you how to add a managed identity to an Azure Digital Twins instance that already exists. You can also disable managed identity on an instance that has it already.

Use the following CLI commands for your chosen type of managed identity.

### System-assigned identity commands

The command to enable a *system-assigned* identity for an existing instance is the same `az dt create` command that's used to [create a new instance with a system-assigned identity](#system-assigned-identity-command). Instead of providing a new name of an instance to create, you can provide the name of an instance that already exists. Then, make sure to add the `--mi-system-assigned` parameter.

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --mi-system-assigned
```

To disable system-assigned identity on an instance where it's currently enabled, use the following command to set `--mi-system-assigned` to `false`.

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --mi-system-assigned false
```

### User-assigned identity commands

To enable a *user-assigned* identity on an existing instance, provide the ID of an existing user assigned identity in the following command:

```azurecli-interactive
az dt identity assign --dt-name <name-of-existing-instance> --resource-group <resource-group> --user <user-assigned-identity-resource-ID>
```

To disable a user-assigned identity on an instance where it's currently enabled, provide the ID of the identity in the following command:

```azurecli-interactive
az dt identity remove --dt-name <name-of-existing-instance> --resource-group <resource-group> --user <user-assigned-identity-resource-ID>
```

### Considerations for disabling managed identities

It's important to consider the effects that any changes to the identity or its roles can have on the resources that use it. If you're [using managed identities with your Azure Digital Twins endpoints](how-to-create-endpoints.md#endpoint-options-identity-based-authentication) or for [data history](concepts-data-history.md) and the identity is disabled, or a necessary role is removed from it, the endpoint or data history connection can become inaccessible and the flow of events is disrupted.

To continue using an endpoint that was set up with a managed identity that's now been disabled, you need to delete the endpoint and [re-create it](how-to-create-endpoints.md) with a different authentication type. It might take up to an hour for events to resume delivery to the endpoint after this change.

## Next steps

Test out individual REST API calls on your instance using the Azure Digital Twins CLI commands: 
* [az dt reference](/cli/azure/dt)
* [Azure Digital Twins CLI command set](concepts-cli.md)

Or, see how to connect a client application to your instance with authentication code:
* [Write client app authentication code](how-to-authenticate-client.md)
