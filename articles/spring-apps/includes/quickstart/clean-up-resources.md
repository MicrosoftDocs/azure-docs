---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/09/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources](includes/quickstart/clean-up-resources.md)]

-->

## 6. Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can clean up unnecessary resources to avoid Azure charges.

::: zone pivot="sc-enterprise"

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the resource group by using the Azure CLI:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

### [IntelliJ](#tab/IntelliJ)

Use the following steps to delete the resource group by using IntelliJ:

1. Go to your Intellij IDEA and find the name of your resource group.

1. Right-click the resource group and select **Delete** to delete all related Azure resources.

### [Visual Studio Code](#tab/visual-studio-code)

Use the following steps to delete the resource group by using Visual Studio Code:

1. Go to Visual Studio Code, select **Group By** to enable **Group by Resource Group**, and then find the name of your resource group.

1. Right-click the resource group and select **Delete Resource Group...** to delete all related Azure resources.

---

::: zone-end

::: zone pivot="sc-consumption-plan,sc-standard"

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

[!INCLUDE [clean-up-resources-via-resource-group](clean-up-resources-via-resource-group.md)]

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interaction:

- **Total resources to delete: \<your-resources-total>, are you sure you want to continue?**: Press <kbd>y</kbd>.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---

::: zone-end
