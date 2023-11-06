---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/31/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-event-driven-app/clean-up-resources.md)]

-->

## 6. Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. You can delete the Azure resource group, which includes all the resources in the resource group.

::: zone pivot="sc-enterprise"

### [Azure portal](#tab/Azure-portal-ent)

Use the following steps to delete the entire resource group, including the newly created service:

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the entire resource group, including the newly created service:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---

::: zone-end

::: zone pivot="sc-consumption-plan,sc-standard"

### [Azure portal](#tab/Azure-portal)

Use the following steps to delete the entire resource group, including the newly created service:

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to delete the entire resource group, including the newly created service:

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interactions:

- **Total resources to delete: \<your-resources-total>, are you sure you want to continue?**: Press <kbd>y</kbd>.
- **Would you like to permanently delete these resources instead, allowing their names to be reused?**: Press <kbd>y</kbd>. Press <kbd>n</kbd> if you want to reuse the Key Vault.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---

::: zone-end
