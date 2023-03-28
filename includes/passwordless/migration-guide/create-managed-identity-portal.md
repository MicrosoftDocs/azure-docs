# [Azure Portal](#tab/azure-portal-create)

You can create a user assigend managed identity using the Azure Portal. The identity will later be used by your application to authenticate to other services.

1. At the top of the Azure portal, search for *Managed identities*. Select the **Managed Identities** result.
1. Select **+ Create** at the top of the **Managed Identities** overview page.
1. On the **Basics** tab, enter the following values:
    * **Subscription**: Select your desired subscription.
    * **Resource Group**: Select your desired resource group.
    * **Region**: Select a region near your location.
    * **Name**: Enter a recognizable name for your identity, such as *MigrationIdentity*.
1. Select **Review & Create** at the bottom of the page.
1. When the validation checks finish, select **Create**. Azure will provision a new user-assigned identity.

:::image type="content" source="../../../articles/storage/common/media/create-managed-identity-portal-small.png" alt-text="A screenshot showing how to create a user assigned managed identity." lightbox="../../../articles/storage/common/media/create-managed-identity-portal.png" :::

# [Azure CLI](#tab/azure-cli-create)

You can create a user assigned managed identity using the Azure CLI.The identity will later be used by your application to authenticate to other services.

Use the `az identity create` command to create a managed identity:

```azurecli
az identity create --name MigrationIdentity --resource-group <your-resource-group>
```

---