---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart/clean-up-resources.md)]

-->

## 6 Clean up resources

::: zone pivot="sc-consumption-plan,sc-enterprise"

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

::: zone-end

::: zone pivot="sc-standard"

You can delete the Azure resource group, which includes all the resources in the resource group. To delete the entire resource group, including the newly created service:

1. Locate your resource group in the portal. On the menu on the left, select **Resource groups**. Then select the name of your resource group, such as the example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group, such as the example, **myresourcegroup**, in the text box to confirm deletion. Select Delete.

::: zone-end
