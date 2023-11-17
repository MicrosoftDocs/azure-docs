---
title: Enable managed identity on Azure Event Grid custom topics and domains
description: This article describes how enable managed service identity for an Azure Event Grid custom topic or domain. 
ms.topic: how-to
ms.date: 07/21/2022
---

# Assign a managed identity to an Event Grid custom topic or domain 
This article shows you how to use the Azure portal and CLI to assign a system-assigned or a user-assigned [managed identity](/entra/identity/managed-identities-azure-resources/overview) to an Event Grid custom topic or a domain. 

## Enable identity when creating a topic or domain

# [Azure portal](#tab/portal)
In the **Azure portal**, when creating a topic or a domain, you can assign either a system-assigned identity or two user-assigned identities, but not both types of identities. Once the topic or domain is created, you can assign both types of identities by following steps in the [Enable identity for an existing topic or domain](#enable-identity-for-an-existing-custom-topic-or-domain) section.

### Enable system-assigned identity
On the **Security** page of the topic or domain creation wizard, select **Enable system assigned identity**. 

:::image type="content" source="./media/managed-service-identity/create-topic-identity.png" alt-text="Screenshot showing the Enable system assigned identity option selected.":::

### Enable user-assigned identity
1. On the **Security** page of the topic or domain creation wizard, select **Add user assigned identity**. 
1. In the **Select user assigned identity** window, select the subscription that has the user-assigned identity, select the **user-assigned identity**, and then click **Select**. 

    :::image type="content" source="./media/managed-service-identity/create-page-add-user-assigned-identity-link.png" alt-text="Screenshot showing the Enable user assigned identity option selected." lightbox="./media/managed-service-identity/create-page-add-user-assigned-identity-link.png":::

# [Azure CLI](#tab/cli)
You can also use Azure CLI to create a custom topic or a domain with a system-assigned identity. Currently, Azure CLI doesn't support assigning a user-assigned identity to a topic or a domain.  

Use the `az eventgrid topic create` command with the `--identity` parameter set to `systemassigned`. If you don't specify a value for this parameter, the default value `noidentity` is used. 

```azurecli-interactive
# create a custom topic with a system-assigned identity
az eventgrid topic create -g <RESOURCE GROUP NAME> --name <TOPIC NAME> -l <LOCATION>  --identity systemassigned
```

Similarly, you can use the `az eventgrid domain create` command to create a domain with a system-assigned identity.

---

## Enable identity for an existing custom topic or domain
In this section, you learn how to enable a system-assigned identity or a user-assigned identity for an existing custom topic or domain. 

# [Azure portal](#tab/portal)
When you use Azure portal, you can assign one system assigned identity and up to two user assigned identities to an existing topic or a domain.

The following procedures show you how to enable an identity for a custom topic. The steps for enabling an identity for a domain are similar. 

1. Go to the [Azure portal](https://portal.azure.com).
2. Search for **event grid topics** in the search bar at the top.
3. Select the **custom topic** for which you want to enable the managed identity. 
4. Select **Identity** on the left menu.

### To assign a system-assigned identity to a topic
1. In the **System assigned** tab, turn **on** the switch to enable the identity. 
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-topic.png" alt-text="Identity page for a custom topic"::: 

### To assign a user-assigned identity to a topic
1. Create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) article. 
1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/managed-service-identity/user-assigned-identity-add-button.png" alt-text="Screenshot showing the User Assigned Identity tab":::     
1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity. 
    1. Select the **user-assigned identity**. 
    1. Select **Add**. 
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.

You can use similar steps to enable an identity for an event grid domain.

# [Azure CLI](#tab/cli)
You can also use Azure CLI to assign a system-assigned identity to an existing custom topic or domain. Currently, Azure CLI doesn't support assigning a user-assigned identity to a topic or a domain.

Use the `az eventgrid topic update` command with `--identity` set to `systemassigned` to enable system-assigned identity for an existing custom topic. If you want to disable the identity, specify `noidentity` as the value. 

```azurecli-interactive
# Update the topic to assign a system-assigned identity. 
az eventgrid topic update -g $rg --name $topicname --identity systemassigned --sku basic 
```

The command for updating an existing domain is similar (`az eventgrid domain update`).

---

## Next steps
Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue). For detailed steps, see [Grant managed identity the access to Event Grid destination](add-identity-roles.md). 
