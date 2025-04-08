---
author: KarlErickson
ms.author: karler
ms.reviewer: hangwan
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/05/2025
---

## Verify the app status

After the deployment finishes, go to the Azure portal **Overview** page of your container app and select **Application Url** to see the application running in the cloud.

## Clean up resources

If you plan to continue working with more quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can remove them to avoid Azure charges, by using the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

[!INCLUDE [java-get-started-next-steps](java-get-started-next-steps.md)]
