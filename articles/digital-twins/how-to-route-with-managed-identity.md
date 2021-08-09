---
# Mandatory fields.
title: Route events with a managed identity (preview)
titleSuffix: Azure Digital Twins
description: See how to enable a system-assigned identity for Azure Digital Twins and use it to forward events, using the Azure portal or CLI.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 6/15/2021
ms.topic: how-to
ms.service: digital-twins
ms.custom: subject-rbac-steps, contperf-fy21q4

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable a managed identity for routing Azure Digital Twins events (preview)

This article describes how to enable a [system-assigned identity for an Azure Digital Twins instance](concepts-security.md#managed-identity-for-accessing-other-resources-preview) (currently in preview), and use the identity when forwarding events to supported routing destinations. Setting up a managed identity isn't required for routing, but it can help the instance to easily access other Azure AD-protected resources, such as [Event Hub](../event-hubs/event-hubs-about.md), [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, and [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md).

Here are the steps that are covered in this article: 

1. Create an Azure Digital Twins instance with a system-assigned identity or enable system-assigned identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hub, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.
1. Create an endpoint in Azure Digital Twins that can use system-assigned identities for authentication.

## Enable system-managed identity for the instance 

When you enable a system-assigned identity on your Azure Digital Twins instance, Azure automatically creates an identity for it in [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md). That identity can then be used to authenticate to Azure Digital Twins endpoints for event forwarding.

You can enable system-managed identities for an Azure Digital Twins instance **as part of the instance's initial setup**, or **enable it later on an instance that already exists**.

Either of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do both.

### Add a system-managed identity during instance creation

In this section, you'll learn how to enable a system-managed identity for an Azure Digital Twins instance while the instance is being created. You can enable the identity whether you're creating the instance with the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/what-is-azure-cli). Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

To add a managed identity during instance creation in the portal, begin [creating an instance as you normally would](how-to-set-up-instance-portal.md).

The system-managed identity option is located in the **Advanced** tab of instance setup.

In this tab, select the **On** option for **System managed identity** to turn on this feature.

:::image type="content" source="media/how-to-enable-managed-identities/create-instance-advanced.png" alt-text="Screenshot of the Azure portal showing the Advanced tab of the Create Resource dialog for Azure Digital Twins. System managed identity is turned on.":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.
   
# [CLI](#tab/cli)

In the CLI, you can add an `--assign-identity` parameter to the `az dt create` command that's used to create the instance. (For more information about this command, see its [reference documentation](/cli/azure/dt#az_dt_create) or the [general instructions for setting up an Azure Digital Twins instance](how-to-set-up-instance-cli.md#create-the-azure-digital-twins-instance)).

To create an instance with a system managed identity, add the  `--assign-identity` parameter like this:

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --assign-identity
```

---

### Add a system-managed identity to an existing instance

In this section, you'll add a system-managed identity to an Azure Digital Twins instance that already exists. Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

Start by opening the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Identity (preview)** in the left-hand menu.

1. On this page, select the **On** option to turn on this feature.

1. Select the **Save** button, and **Yes** to confirm.

    :::image type="content" source="media/how-to-enable-managed-identities/identity-digital-twins.png" alt-text="Screenshot of the Azure portal showing the Identity (preview) page for an Azure Digital Twins instance.":::

After the change is saved, more fields will appear on this page for the new identity's **Object ID** and **Permissions**.

You can copy the **Object ID** from here if needed, and use the **Permissions** button to view the Azure roles that are assigned to the identity. To set up some roles, continue to the next section.

# [CLI](#tab/cli)

Again, you can add the identity to your instance by using the `az dt create` command and `--assign-identity` parameter. Instead of providing a new name of an instance to create, you can provide the name of an instance that already exists to update the value of `--assign-identity` for that instance.

The command to **enable** managed identity is the same as the command to create an instance with a system managed identity. All that changes is the value of the instance name parameter:

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --assign-identity
```

To **disable** managed identity on an instance where it's currently enabled, use the following similar command to set `--assign-identity` to `false`.

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --assign-identity false
```

---

## Assign Azure roles to the identity 

Once a system-assigned identity is created for your Azure Digital Twins instance, you'll need to assign it appropriate roles to authenticate with different types of [endpoints](concepts-route-events.md) for forwarding events to supported destinations. This section describes the role options and how to assign them to the system-assigned identity.

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
    | Assign access to | Under **System assigned managed identity**, select **Digital Twins**. |
    | Members | Select the managed identity of your Azure Digital Twins instance that's being assigned the role. The name of the managed identity matches the name of the instance, so choose the name of your Azure Digital Twins instance. |
    
    ![Add role assignment page](../../includes/role-based-access-control/media/add-role-assignment-page.png)

# [CLI](#tab/cli)

You can add the `--scopes` parameter onto the `az dt create` command to assign the identity to one or more scopes with a specified role. The command with this parameter can be used when first creating the instance, or later by passing in the name of an instance that already exists.

Here's an example that creates an instance with a system managed identity, and assigns that identity a custom role called `MyCustomRole` in an event hub.

```azurecli-interactive
az dt create --dt-name <instance-name> --resource-group <resource-group> --assign-identity --scopes "/subscriptions/<subscription ID>/resourceGroups/<resource-group>/providers/Microsoft.EventHub/namespaces/<Event-Hubs-namespace>/eventhubs/<event-hub-name>" --role MyCustomRole
```

For more examples of role assignments with this command, see the [az dt create reference documentation](/cli/azure/dt#az_dt_create).

You can also use the [az role assignment](/cli/azure/role/assignment?view=azure-cli-latest&preserve-view=true) command group to create and manage roles. This command can be used to support other scenarios where you don't want to group role assignment with the create command.

---

## Create an endpoint with identity-based authentication

After setting up a system-managed identity for your Azure Digital Twins instance and assigning it the appropriate role(s), you can create Azure Digital Twins [endpoints](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins) that can use the identity for authentication. This option is only available for Event Hub and Service Bus-type endpoints (it's not supported for Event Grid).

>[!NOTE]
> You cannot edit an endpoint that has already been created with key-based identity to change to identity-based authentication. You must choose the authentication type when the endpoint is first created.

Use the tabs below to select instructions for your preferred experience.

# [Portal](#tab/portal) 

Start following the [instructions to create an Azure Digital Twins endpoint](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins).

When you get to the step of completing the details required for your endpoint type, make sure to select **Identity-based** for the Authentication type.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-manage-routes/create-endpoint-event-hub-authentication.png" alt-text="Screenshot of creating an endpoint of type Event Hub." lightbox="media/how-to-manage-routes/create-endpoint-event-hub-authentication.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Finish setting up your endpoint and select **Save**.

# [CLI](#tab/cli)

Creating the endpoint with the CLI is done by adding a `--auth-type` parameter to the `az dt endpoint create` command that's used to create the endpoint. (For more information about this command, see its [reference documentation](/cli/azure/dt/endpoint/create?view=azure-cli-latest&preserve-view=true) or the [general instructions for setting up an Azure Digital Twins endpoint](how-to-manage-routes.md#create-the-endpoint)).

To create an endpoint that uses identity-based authentication, specify the `IdentityBased` authentication type with the  `--auth-type` parameter. The example below illustrates this functionality for an Event Hubs endpoint.

```azurecli-interactive
az dt endpoint create eventhub --endpoint-name <endpoint-name> --eventhub-resource-group <eventhub-resource-group> --eventhub-namespace <eventhub-namespace> --eventhub <eventhub-name> --auth-type IdentityBased --dt-name <instance-name>
```

---

## Considerations for disabling system-managed identities

Because an identity is managed separately from the endpoints that use it, it's important to consider the effects that any changes to the identity or its roles can have on the endpoints in your Azure Digital Twins instance. If the identity is disabled, or a necessary role for an endpoint is removed from it, the endpoint can become inaccessible and the flow of events will be disrupted.

To continue using an endpoint that was set up with a managed identity that's now been disabled, you'll need to delete the endpoint and [re-create it](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins) with a different authentication type. It may take up to an hour for events to resume delivery to the endpoint after this change.

## Next steps

Learn more about managed identities in Azure AD: 
* [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)