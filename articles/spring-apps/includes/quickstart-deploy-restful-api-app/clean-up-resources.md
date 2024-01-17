---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 10/02/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-restful-api-app/clean-up-resources.md)]

-->

## 6. Clean up resources

You can delete the Azure resource group, which includes all the resources in the resource group. Use the following steps to delete the entire resource group, including the newly created service:

::: zone pivot="sc-enterprise"

1. Locate your resource group in the Azure portal.

1. On the navigation menu, select **Resource groups**. Then, select the name of your resource group - for example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion - for example, *myresourcegroup*. Then, select **Delete**.

::: zone-end

::: zone pivot="sc-consumption-plan"

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

1. Locate your resource group in the Azure portal.

1. On the navigation menu, select **Resource groups**. Then, select the name of your resource group - for example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion - for example, **myresourcegroup**. Then, select **Delete**.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interaction:

- **Total resources to delete: [your-resources-total], are you sure you want to continue?**: Press <kbd>y</kbd>.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---

::: zone-end
