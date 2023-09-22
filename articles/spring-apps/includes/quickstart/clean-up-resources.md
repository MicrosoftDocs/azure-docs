---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/09/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart/clean-up-resources.md)]

-->

## 6. Clean up resources

::: zone pivot="sc-enterprise"

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following command:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

::: zone-end

::: zone pivot="sc-consumption-plan,sc-standard"

You can delete the Azure resource group, which includes all the resources in the resource group.

### [Azure portal](#tab/Azure-portal)

Use the following steps to delete the entire resource group, including the newly created service:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**. Then, select the name of your resource group - for example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion - for example, **myresourcegroup** - then, select **Delete**.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interactions:

- **Total resources to delete: \<your-resources-total>, are you sure you want to continue?**: Press <kbd>y</kbd>.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---

::: zone-end
