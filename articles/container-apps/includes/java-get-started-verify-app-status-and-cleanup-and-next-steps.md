---
author: KarlErickson
ms.author: karler
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/18/2025
---

## Verify the app status

Once the deployment is done, you can go to the overview page of your container app and set the **Application Url** field. After doing that, you can see the project running in the cloud.

:::image type="content" source="../media/java-get-started/validation.png" alt-text="Screenshot of the application details in Azure, with the Application URL field highlighted" lightbox="../media/java-get-started/validation.png":::

## Clean up resources

If you plan to continue working with more quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can remove them to avoid Azure charges, by using the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

[!INCLUDE [java-get-started-next-steps](java-get-started-next-steps.md)]