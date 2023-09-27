---
author: KarlErickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 08/31/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-web-app/clean-up-resources.md)]

-->

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can clean up unnecessary resources to avoid Azure charges.

### [Azure portal](#tab/Azure-portal)

You can delete the Azure resource group, which includes all the resources in the resource group. Use the following steps to delete the entire resource group, including the newly created service:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**, then select the name of your resource group.

1. On your resource group page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion, then select **Delete**.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Use the following command to delete all the Azure resources used in this sample application:

```bash
azd down
```

The following list describes the command interactions:

- **Total resources to delete: \<resources-total>, are you sure you want to continue?**: Press <kbd>y</kbd>.

The console outputs messages similar to the following example:

```output
SUCCESS: Your application was removed from Azure in xx minutes xx seconds.
```

---
