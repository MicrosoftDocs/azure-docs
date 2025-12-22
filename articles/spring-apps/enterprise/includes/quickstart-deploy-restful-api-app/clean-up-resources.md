---
author: KarlErickson
ms.author: v-shilichen
ms.service: azure-spring-apps
ms.topic: include
ms.date: 08/19/2025
ms.update-cycle: 1095-days
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal, AZD, or Azure CLI.

[!INCLUDE [clean-up-resources](includes/quickstart-deploy-restful-api-app/clean-up-resources.md)]

-->

## 6. Clean up resources

You can delete the Azure resource group, which includes all the resources in the resource group.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

Use the following steps to delete the entire resource group, including the newly created service:

1. Locate your resource group in the Azure portal.

1. On the navigation menu, select **Resource groups**. Then, select the name of your resource group - for example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion - for example, **myresourcegroup**. Then, select **Delete**.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the entire resource group, including the newly created service:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---
