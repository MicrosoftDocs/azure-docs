---
# Mandatory fields.
title: Route events with a managed identity
titleSuffix: Azure Digital Twins
description: See how to use a managed identity to forward events in Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/17/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: subject-rbac-steps, contperf-fy21q4, devx-track-azurecli, engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable a managed identity for routing Azure Digital Twins events

This article describes how to use a [managed identity for an Azure Digital Twins instance](concepts-security.md#managed-identity-for-accessing-other-resources) when forwarding events to supported routing destinations. Setting up a managed identity isn't required for routing, but it can help the instance to easily access other Azure AD-protected resources, such as [Event Hubs](../event-hubs/event-hubs-about.md), [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) destinations, and [Azure Storage Container](../storage/blobs/storage-blobs-introduction.md). Managed identities can be *system-assigned* or *user-assigned*.

Here are the steps that are covered in this article: 

1. Create an Azure Digital Twins instance with a managed identity, or enable managed identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role or roles to the identity. For example, assign the **Azure Event Hub Data Sender** role to the identity if the endpoint is Event Hubs, or **Azure Service Bus Data Sender role** if the endpoint is Service Bus.
1. Create an endpoint in Azure Digital Twins that can use managed identities for authentication.

## Create an Azure Digital Twins instance with a managed identity

If you already have an Azure Digital Twins instance, ensure that you've enabled a [managed identity](how-to-set-up-instance-cli.md#enabledisable-managed-identity-for-the-instance) for it.

If you don't have an Azure Digital Twins instance, follow the instructions in [Create the instance with a managed identity](how-to-set-up-instance-cli.md#create-the-instance-with-a-managed-identity) to create an Azure Digital Twins instance with a managed identity for the first time.

Then, make sure you have *Azure Digital Twins Data Owner* role on the instance. You can find instructions in [Set up user access permissions](how-to-set-up-instance-cli.md#set-up-user-access-permissions).

## Assign Azure roles to the identity 

Once a managed identity is created for your Azure Digital Twins instance, you'll need to assign it appropriate roles to authenticate with different types of [endpoints](concepts-route-events.md) for routing events to supported destinations. This section describes the role options and how to assign them to the managed identity.

>[!NOTE]
> This is an important step—without it, the identity won't be able to access your endpoints and events won't be delivered.

### Supported destinations and Azure roles 

Here are the minimum roles that your Azure Digital Twins identity needs to access an endpoint, depending on the type of destination. Roles with higher permissions (like Data Owner roles) will also work.

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
    | Role | Select the desired role from the options. |
    | Assign access to | **Managed identity** |
    | Members | Select the user-assigned or system-assigned managed identity of your Azure Digital Twins instance that's being assigned the role. A user-assigned identity will have the name you chose when you created the identity, and a system-assigned identity will have a name that matches the name of your Azure Digital Twins instance. |
    
   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot of the 'Add role assignment' page for an Azure Digital Twins instance." lightbox="../../includes/role-based-access-control/media/add-role-assignment-page.png":::

# [CLI](#tab/cli)

You can add the `--scopes` parameter onto the `az dt create` command to assign the identity to one or more scopes with a specified role. The command with this parameter can be used when first creating the instance, or later by passing in the name of an instance that already exists.

Here's an example that creates an instance with a system-assigned managed identity, and assigns that identity a custom role called `MyCustomRole` in an event hub.

```azurecli-interactive
az dt create --dt-name <new-instance-name> --resource-group <resource-group> --mi-system-assigned --scopes "/subscriptions/<subscription ID>/resourceGroups/<resource-group>/providers/Microsoft.EventHub/namespaces/<Event-Hubs-namespace>/eventhubs/<event-hub-name>" --role MyCustomRole
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

#### System-assigned identity command

To create an endpoint that uses system-assigned authentication, specify the `IdentityBased` authentication type with the  `--auth-type` parameter. The example below illustrates this functionality for an Event Hubs endpoint.

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