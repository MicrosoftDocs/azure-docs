---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-microservice-apps/clean-up-resources.md)]

-->

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can clean up unnecessary resources to avoid Azure charges.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Use the following steps to delete the entire resource group, including the newly created service instance:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**, and then select the name of your resource group.

1. On the **Resource group** page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion, then select **Delete**.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interaction:

- **Total resources to delete: \<resources-total>, are you sure you want to continue?**: Press <kbd>y</kbd>.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---