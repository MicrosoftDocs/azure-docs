---
ms.service: lab-services
ms.date: 01/24/2023
ms.topic: include
---

When no longer needed, you can delete the resource group, lab plan, and all related resources.

1. In the Azure portal, on the **Overview** page for the lab plan, select **Resource group**.

1. At the top of the page for the resource group, select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

To delete resources by using the Azure CLI, enter the following command:

```azurecli
az group delete --name <yourresourcegroup>
```

Remember, deleting the resource group deletes all of the resources within it.
