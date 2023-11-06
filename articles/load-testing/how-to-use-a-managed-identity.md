---
title: Use managed identities for Azure Load Testing
titleSuffix: Azure Load Testing
description: Learn how to enable a managed identity for Azure Load Testing. You can use managed identities for reading secrets or certificates from Azure Key Vault in your JMeter test script.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 10/19/2023
ms.topic: how-to
---

# Use managed identities for Azure Load Testing

This article shows how to create a managed identity for Azure Load Testing. You can use a managed identity to securely access other Azure resources. For example, you use a managed identity to read secrets or certificates from Azure Key Vault in your load test.

A managed identity from Microsoft Entra ID allows your load testing resource to easily access other Microsoft Entra protected resources, such as Azure Key Vault. The identity is managed by the Azure platform and doesn't require you to manage or rotate any secrets. For more information about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview).

Azure Load Testing supports two types of identities:

- A **system-assigned identity** is associated with your load testing resource and is deleted when your resource is deleted. A resource can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that you can assign to your load testing resource. When you delete the load testing resource, the managed identity remains available. You can assign multiple user-assigned identities to the load testing resource.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource. If you need to create an Azure load testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).
- To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.

## Assign a system-assigned identity to a load testing resource

To assign a system-assigned identity for your Azure load testing resource, enable a property on the resource. You can set this property by using the Azure portal or by using an Azure Resource Manager (ARM) template.

# [Portal](#tab/azure-portal)

To set up a managed identity in the portal, you first create an Azure load testing resource and then enable the feature.

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.

1. On the left pane, select **Identity**.

1. In the **System assigned** tab, switch **Status** to **On**, and then select **Save**.

    :::image type="content" source="media/how-to-use-a-managed-identity/system-assigned-managed-identity.png" alt-text="Screenshot that shows how to assign a system-assigned managed identity for Azure Load Testing in the Azure portal.":::

1. On the confirmation window, select **Yes** to confirm the assignment of the managed identity.

1. After this operation completes, the page shows the **Object ID** of the managed identity, and lets you assign permissions to it.

    :::image type="content" source="media/how-to-use-a-managed-identity/system-assigned-managed-identity-completed.png" alt-text="Screenshot that shows the system-assigned managed identity information for a load testing resource in the Azure portal.":::

# [Azure CLI](#tab/cli)

Run the `az load update` command with `--identity-type SystemAssigned` to add a system-assigned identity to your load testing resource:

```azurecli-interactive
az load update --name <load-testing-resource-name> --resource-group <group-name> --identity-type SystemAssigned
```

# [ARM template](#tab/arm)

You can use an ARM template to automate the deployment of your Azure resources. For more information about using ARM templates with Azure Load Testing, see the [Azure Load Testing ARM reference documentation](/azure/templates/microsoft.loadtestservice/allversions).

You can assign a system-assigned managed identity when you create a resource of type `Microsoft.LoadTestService/loadtests`. Configure the `identity` property with the `SystemAssigned` value in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

By adding the system-assigned identity type, you're telling Azure to create and manage the identity for your resource. For example, an Azure load testing resource might look like the following:

```json
{
    "type": "Microsoft.LoadTestService/loadtests",
    "apiVersion": "2021-09-01-preview",
    "name": "[parameters('name')]",
    "location": "[parameters('location')]",
    "tags": "[parameters('tags')]",
    "identity": {
        "type": "SystemAssigned"
    }
}
```

After the resource creation finishes, the following properties are configured for the resource:

```output
"identity": {
    "type": "SystemAssigned",
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "principalId": "00000000-0000-0000-0000-000000000000"
}
```

The `tenantId` property identifies which Microsoft Entra tenant the managed identity belongs to. The `principalId` is a unique identifier for the resource's new identity. Within Microsoft Entra ID, the service principal has the same name as the Azure load testing resource.

---

## Assign a user-assigned identity to a load testing resource

Before you can add a user-assigned managed identity to an Azure load testing resource, you must first create this identity in Microsoft Entra ID. Then, you can assign the identity by using its resource identifier.

You can add multiple user-assigned managed identities to your resource. For example, if you need to access multiple Azure resources, you can grant different permissions to each of these identities.

# [Portal](#tab/azure-portal)

1. Create a user-assigned managed identity by following the instructions mentioned in [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

    :::image type="content" source="media/how-to-use-a-managed-identity/create-user-assigned-managed-identity.png" alt-text="Screenshot that shows how to create a user-assigned managed identity in the Azure portal.":::

1. In the [Azure portal](https://portal.azure.com/), go to your Azure load testing resource.

1. On the left pane, select **Identity**.

1. Select the **User assigned** tab, and select **Add**.

1. Search and select the managed identity you created previously. Then, select **Add** to add it to the Azure load testing resource.

    :::image type="content" source="media/how-to-use-a-managed-identity/user-assigned-managed-identity.png" alt-text="Screenshot that shows how to turn on user-assigned managed identity for Azure Load Testing.":::

# [Azure CLI](#tab/cli)

1. Create a user-assigned identity.

    ```azurecli-interactive
    az identity create --resource-group <group-name> --name <identity-name>
    ```

1. Run the `az load update` command with `--identity-type UserAssigned` to add a user-assigned identity to your load testing resource:

    ```azurecli-interactive
    az load update --name <load-testing-resource-name> --resource-group <group-name> --identity-type UserAssigned --user-assigned <identity-id>
    ```

# [ARM template](#tab/arm)

You can create an Azure load testing resource by using an ARM template and the resource type `Microsoft.LoadTestService/loadtests`. For more information about using ARM templates with Azure Load Testing, see the [Azure Load Testing ARM reference documentation](/azure/templates/microsoft.loadtestservice/allversions).

1. Create a user-assigned managed identity by following the instructions mentioned in [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-arm#create-a-user-assigned-managed-identity-3).

    
1. Specify the user-assigned managed identity in the `identity` section of the resource definition. 

    Replace the `<RESOURCEID>` text placeholder with the resource ID of your user-assigned identity:

    ```json
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "<RESOURCEID>": {}
        }
    }
    ```

    The following code snippet shows an example of an Azure Load Testing ARM resource definition with a user-assigned identity:

    ```json
    {
        "type": "Microsoft.LoadTestService/loadtests",
        "apiVersion": "2021-09-01-preview",
        "name": "[parameters('name')]",
        "location": "[parameters('location')]",
        "tags": "[parameters('tags')]",
        "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
                "<RESOURCEID>": {}
            }
    }
    ```

    After the Load Testing resource is created, Azure provides the `principalId` and `clientId` properties in the output:

    ```output
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "<RESOURCEID>": {
                "principalId": "00000000-0000-0000-0000-000000000000",
                "clientId": "00000000-0000-0000-0000-000000000000"
            }
        }
    }
    ```

    The `principalId` is a unique identifier for the identity that's used for Microsoft Entra administration. The `clientId` is a unique identifier for the resource's new identity that's used for specifying which identity to use during runtime calls.

---

## Configure target resource

You might need to configure the target resource to allow access from your load testing resource. For example, if you [read a secret or certificate from Azure Key Vault](./how-to-parameterize-load-tests.md), or if you [use customer-managed keys for encryption](./how-to-configure-customer-managed-keys.md), you must also add an access policy that includes the managed identity of your resource. Otherwise, your calls to Azure Key Vault are rejected, even if you use a valid token.

## Related content

* [Use secrets or certificates in your load test](./how-to-parameterize-load-tests.md)
* [Configure customer-managed keys for encryption](how-to-configure-customer-managed-keys.md)
* [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)
