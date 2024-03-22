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

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [clean-up-resources-via-resource-group](../../includes/quickstart-deploy-web-app/clean-up-resources-via-resource-group.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

[!INCLUDE [clean-up-resources-via-resource-group](../../includes/quickstart-deploy-web-app/clean-up-resources-via-resource-group.md)]

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
