---
services: storage, app-service-web
author: rwike77
manager: CelesteDG
ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 03/14/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp azurecli
ms.custom: azureday1
ms.subservice: web-apps
---

## Clean up resources

If you're finished with this tutorial and no longer need the web app or associated resources, clean up the resources you created.

### Delete the resource group

In the [Azure portal](https://portal.azure.com), select **Resource groups** from the portal menu and select the resource group that contains your app service and app service plan.

Select **Delete resource group** to delete the resource group and all the resources.

:::image type="content" alt-text="Screenshot that shows deleting the resource group." source="../media/scenario-secure-app-clean-up-resources/delete-resource-group.png":::

This command might take several minutes to run.
