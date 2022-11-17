---
# Mandatory fields.
title: Route events with a managed identity
titleSuffix: Azure Digital Twins
description: See how to enable a managed identity for Azure Digital Twins and use it to forward events, using the Azure portal or CLI.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/15/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: subject-rbac-steps, contperf-fy21q4, devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable a managed identity for routing Azure Digital Twins events

This article describes how to enable a [managed identity for an Azure Digital Twins instance](concepts-security.md#managed-identity-for-accessing-other-resources), and use the identity when forwarding events to supported routing destinations. Setting up a managed identity isn't required for routing, but it can help the instance to easily access other Azure AD-protected resources, such as [Event Hubs](../event-hubs/event-hubs-about.md), [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, and [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md). Managed identities can be *system-assigned* or *user-assigned*.

Here are the steps that are covered in this article: 

1. Create an Azure Digital Twins instance with a managed identity, or enable managed identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hubs, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.
1. Create an endpoint in Azure Digital Twins that can use managed identities for authentication.

## Enable managed identity for the instance 

When you enable a managed identity on your Azure Digital Twins instance, Azure automatically creates an identity for it in [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md). That identity can then be used to authenticate to Azure Digital Twins endpoints for event forwarding.

You can enable managed identities for an Azure Digital Twins instance in two different ways:

- Enable it as part of the instance's initial setup.
- Enable it later on an instance that already exists.

Either of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do both.

### Add a managed identity during instance creation

In this section, you'll learn how to enable a managed identity for an Azure Digital Twins instance while the instance is being created. You can enable the identity whether you're creating the instance with the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/what-is-azure-cli). Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

To add a managed identity during instance creation in the portal, begin [creating an instance as you normally would](how-to-set-up-instance-portal.md).

The managed identity option is located in the **Advanced** tab of instance setup.

In this tab, select the **On** option for **System managed identity** to turn on this feature.

:::image type="content" source="media/how-to-route-with-managed-identity/create-instance-advanced.png" alt-text="Screenshot of the Azure portal showing the Advanced tab of the Create Resource dialog for Azure Digital Twins. System managed identity is turned on.":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.
   
# [CLI](#tab/cli)

Use the CLI command below for your chosen type of managed identity.

#### System-managed identity command

In the CLI, you can add an `--assign-identity` parameter to the `az dt create` command that's used to create the instance. (For more information about this command, see its [reference documentation](/cli/azure/dt#az-dt-create) or the [general instructions for setting up an Azure Digital Twins instance](how-to-set-up-instance-cli.md#create-the-azure-digital-twins-instance)).

To create an instance with a *system-managed* identity, add the  `--assign-identity` parameter like this:

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --assign-identity
```

#### User-assigned identity command

To create an instance with a *user-assigned identity*, provide the ID of an existing user assigned identity using the  `--mi-user-assigned` parameter, like this:

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --mi-user-assigned <user-assigned-identity-resource-ID>
```

---

### Add a managed identity to an existing instance

In this section, you'll add a managed identity to an Azure Digital Twins instance that already exists. Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

Start by opening the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Identity** in the left-hand menu.

1. Use the tabs to select which type of managed identity you want to add.
    1. **System-assigned**: After selecting this tab, select the **On** option to turn on this feature.

       :::image type="content" source="media/how-to-route-with-managed-identity/identity-system-assigned.png" alt-text="Screenshot of the Azure portal showing the Identity page and system-assigned options for an Azure Digital Twins instance." lightbox="media/how-to-route-with-managed-identity/identity-system-assigned.png":::

    1. **User-assigned (preview)**: After selecting this tab, select **Associate a user-assigned managed identity** and follow the prompts to choose an identity to associate with the instance.

       :::image type="content" source="media/how-to-route-with-managed-identity/identity-user-assigned.png" alt-text="Screenshot of the Azure portal showing the Identity page and user-assigned options for an Azure Digital Twins instance." lightbox="media/how-to-route-with-managed-identity/identity-user-assigned.png":::

1. Select the **Save** button, and **Yes** to confirm.



After the change is saved, more fields will appear on this page for the new identity's **Object ID** and **Permissions**.

You can copy the **Object ID** from here if needed, and use the **Permissions** button to view the Azure roles that are assigned to the identity. To set up some roles, continue to the next section.

# [CLI](#tab/cli)

Use the CLI commands below for your chosen type of managed identity.

#### System-managed identity commands

To enable a *system-managed* identity on an existing instance, you can still use the `az dt create` command and `--assign-identity` parameter. Instead of providing a new name of an instance to create, you can provide the name of an instance that already exists to update the value of `--assign-identity` for that instance.

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --assign-identity
```

To disable *system-managed* identity on an instance where it's currently enabled, use the following command to set `--assign-identity` to `false`.

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --assign-identity false
```

#### User-assigned identity commands

To enable a *user-assigned* identity on an existing instance, provide the ID of an existing user assigned identity in the following command:

```azurecli-interactive
az dt identity assign --dt-name <name-of-existing-instance> --resource-group <resource-group> --user <user-assigned-identity-resource-ID>
```

To disable a *user-assigned* identity on an instance where it's currently enabled, provide the ID of the identity in the following command:

```azurecli-interactive
az dt identity remove --dt-name <name-of-existing-instance> --resource-group <resource-group> --user <user-assigned-identity-resource-ID>
```

---

## Assign Azure roles to the identity 

Once a managed identity is created for your Azure Digital Twins instance, you'll need to assign it appropriate roles to authenticate with different types of [endpoints](concepts-route-events.md) for routing events to supported destinations. This section describes the role options and how to assign them to the managed identity.

>[!NOTE]
> This is an important step—without it, the identity won't be able to access your endpoints and events won't be delivered.

### Supported destinations and Azure roles 

Here are the minimum roles that an identity needs to access an endpoint, depending on the type of destination. Roles with higher permissions (like Data Owner roles) will also work.

| Destination | Azure role |
| --- | --- |
| Azure Event Hubs | Azure Event Hubs Data Sender |
| Azure Service Bus | Azure Service Bus Data Sender |
| Azure storage container | Storage Blob Data Contributor |

For more about endpoints, routes, and the types of destinations supported for routing in Azure Digital Twins, see [Event routes](concepts-route-events.md).

### Assign the role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

To assign a role to the identity, start by opening the [Azure portal](https://portal.azure.com) in a browser.

1. Navigate to your endpoint resource (your event hub, Service Bus topic, or storage container) by searching for its name in the portal search bar. 

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

1. Assign the desired role to the managed identity of your Azure Digital Twins instance, using the information below. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Select the desired role from the dropdown menu. |
    | Assign access to | Under **Managed identity**, select **Digital Twins**. |
    | Members | Select the managed identity of your Azure Digital Twins instance that's being assigned the role. The name of the managed identity matches the name of the instance, so choose the name of your Azure Digital Twins instance. |
    
   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot of the 'Add role assignment' page for an Azure Digital Twins instance." lightbox="../../includes/role-based-access-control/media/add-role-assignment-page.png":::

# [CLI](#tab/cli)

You can add the `--scopes` parameter onto the `az dt create` command to assign the identity to one or more scopes with a specified role. The command with this parameter can be used when first creating the instance, or later by passing in the name of an instance that already exists.

Here's an example that creates an instance with a system-managed identity, and assigns that identity a custom role called `MyCustomRole` in an event hub.

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --assign-identity --scopes "/subscriptions/<subscription ID>/resourceGroups/<resource-group>/providers/Microsoft.EventHub/namespaces/<Event-Hubs-namespace>/eventhubs/<event-hub-name>" --role MyCustomRole
```

For more examples of role assignments with this command, see the [az dt create reference documentation](/cli/azure/dt#az-dt-create).

You can also use the [az role assignment](/cli/azure/role/assignment) command group to create and manage roles. This command can be used to support other scenarios where you don't want to group role assignment with the create command.

---

## Create an endpoint with identity-based authentication

After setting up a managed identity for your Azure Digital Twins instance and assigning it the appropriate role(s), you can create Azure Digital Twins [endpoints](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins) that can use the identity for authentication. This option is only available for Event Hubs and Service Bus-type endpoints (it's not supported for Event Grid).

>[!NOTE]
> You cannot edit an endpoint that has already been created with key-based identity to change to identity-based authentication. You must choose the authentication type when the endpoint is first created.

Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

Start following the [instructions to create an Azure Digital Twins endpoint](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins).

When you get to the step of completing the details required for your endpoint type, select either **System-assigned** or **User-assigned (preview)** for the Authentication type.

:::image type="content" source="media/how-to-manage-routes/create-endpoint-event-hub-authentication.png" alt-text="Screenshot of creating an endpoint of type Event Hubs." lightbox="media/how-to-manage-routes/create-endpoint-event-hub-authentication.png":::

Finish setting up your endpoint and select **Save**.

# [CLI](#tab/cli)

Managed identities are added to an endpoint by adding a `--auth-type` parameter to the `az dt endpoint create` command that's used to create the endpoint. (For more information about this command, see its [reference documentation](/cli/azure/dt/endpoint/create) or the [general instructions for setting up an Azure Digital Twins endpoint](how-to-manage-routes.md#create-the-endpoint)).

Use the CLI command below for your chosen type of managed identity.

#### System-managed identity command

To create an endpoint that uses system-managed authentication, specify the `IdentityBased` authentication type with the  `--auth-type` parameter. The example below illustrates this functionality for an Event Hubs endpoint.

```azurecli-interactive
az dt endpoint create eventhub --endpoint-name <endpoint-name> --eventhub-resource-group <eventhub-resource-group> --eventhub-namespace <eventhub-namespace> --eventhub <eventhub-name> --dt-name <instance-name> --auth-type IdentityBased
```

#### User-assigned identity command

To create an endpoint that uses user-assigned identity authentication, specify the user assigned identity resource ID with the  `--user` parameter. The example below illustrates this functionality for an Event Hubs endpoint.

```azurecli-interactive
az dt endpoint create eventhub --endpoint-name <endpoint-name> --eventhub-resource-group <eventhub-resource-group> --eventhub-namespace <eventhub-namespace> --eventhub <eventhub-name> --dt-name <instance-name> --user <user-assigned-identity-resource-ID>
```
---

## Considerations for disabling managed identities

Because an identity is managed separately from the endpoints that use it, it's important to consider the effects that any changes to the identity or its roles can have on the endpoints in your Azure Digital Twins instance. If the identity is disabled, or a necessary role for an endpoint is removed from it, the endpoint can become inaccessible and the flow of events will be disrupted.

To continue using an endpoint that was set up with a managed identity that's now been disabled, you'll need to delete the endpoint and [re-create it](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins) with a different authentication type. It may take up to an hour for events to resume delivery to the endpoint after this change.

## Next steps

Learn more about managed identities in Azure AD: 
* [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)