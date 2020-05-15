---
title: Tutorial- Cleanup Azure Service Fabric Mesh resources 
description: Learn how to remove Azure Service Fabric Mesh resources so that you do not get charged for resources you are no longer using.
author: dkkapur
ms.topic: tutorial
ms.date: 09/18/2018
ms.author: dekapur
ms.custom: mvc, devcenter 
#Customer intent: As a developer, I want to avoid being charged for Azure resources I am no longer using.
---

# Tutorial: Remove Azure resources

This tutorial is part five of a series and shows you how to delete the app and its resources so that you don't get charged for them.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Clean up the resources used by the app so that you are not incurring a charge for them.

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create a Service Fabric Mesh app in Visual Studio](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * [Debug a Service Fabric Mesh app running in your local development cluster](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)
> * [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)
> * [Upgrade a Service Fabric Mesh app](service-fabric-mesh-tutorial-upgrade.md)
> * Clean up Service Fabric Mesh resources

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you haven't deployed the to-do app, follow the instructions in [Publish a Service Fabric Mesh web application](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md).

## Clean up resources

This is the end of the tutorial. When you are done with the resources you have created, delete them so that you are not charged for resources you are no longer using. This is particularly important because Mesh is a serverless service that bills per second. To learn more about Mesh pricing, check out https://aka.ms/sfmeshpricing.

One of the conveniences that Azure provides is that when you create resources that are associated to a particular resource group, deleting the resource group deletes all of the associated resources. That way you don't have to delete them one by one.

Since you created a new resource group to create the to-do app, you can safely delete this resource group, which will delete all of the associated resources.

```azurecli
az group delete --resource-group sfmeshTutorial1RG
```

```powershell
Remove-AzureRmResourceGroup -Name sfmeshTutorial1RG
```

Alternatively, you can delete the **sfmeshTutorial1RG** resource group [from the portal](../azure-resource-manager/management/manage-resource-groups-portal.md#delete-resource-groups). 

## Next steps

Now that you have completed publishing a Service Fabric Mesh application to Azure, try the following:

* To see another example of service-to-service communication, explore the [Voting app sample](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/votingapp)
* To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
* To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).
* Read about the [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview)