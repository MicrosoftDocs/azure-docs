---
title: Deploy an application to a Service Fabric managed cluster (preview)
description: In this tutorial, you will connect to a Service Fabric managed cluster and deploy an application.
ms.topic: tutorial
ms.date: 09/21/2020
ms.custom: references_regions
#Customer intent: As a Service Fabric customer, I want to connect to my cluster and deploy an application.
---

# Tutorial: Deploy a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Managed Service Fabric cluster](tutorial-managed-cluster-deploy.md)
> * [How to scale out a Managed Service Fabric cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Managed Service Fabric cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Managed Service Fabric cluster](tutorial-managed-cluster-certificate.md)
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)
> * How to connect and deploy an application on your Service Fabric managed cluster

This part of the series covers how to:

> [!div class="checklist"]
> * Connect your Azure account
> * Create a new resource group
> * Deploy a Managed Service Fabric cluster
> * Deploy an application to a Service Fabric managed cluster

## Prerequisites
Before you begin this tutorial:
* You must already have created a Service Fabric managed cluster.

> [!Note]
> In the Service Fabric managed cluster preview you will not be able to publish applications directly from Visual Studio.

## Connect to your cluster

To connect to your cluster you must first take note of the cluster certificate thumbprint. You can find this value in the cluster properties output of your resource deployment or by querying the cluster properties on an existing resource. 

The following command can be used to query your cluster resource for the cluster certificate thumbprint. 
```powershell
$serverThumbprint = (Get-AzResource -ResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/managedclusters/myCluster).Properties.clusterCertificateThumbprint
``` 

Once you have retrieved the value for the cluster certificate thumbprint you can connect to your cluster. 
```powershell
$connectionEndpoint = "mycluster.eastus2.cloudapp.azure.com:19000"
Connect-ServiceFabricCluster -ConnectionEndpoint $connectionEndpoint -KeepAliveIntervalInSec 10 `
      -X509Credential `
      -ServerCertThumbprint $serverThumbprint  `
      -FindType FindByThumbprint `
      -FindValue $clientThumprint `
      -StoreLocation CurrentUser `
      -StoreName My

```

### Upload Application Package 
In this tutorial, we will be using the [Service Fabric Voting Application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart) sample. For more details on Service Fabric application deployment through PowerShell see [Service Fabric deploy and remove applications](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).

```powershell
$path = "C:\Users\<user>\Documents\service-fabric-dotnet-quickstart\Voting\pkg\Debug"
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $path -ImageStoreConnectionString "fabric:ImageStore"
Register-ServiceFabricApplicationType -ApplicationPathInImageStore Debug
```

### Create an Application
You can instantiate an application from any application type version that has been registered successfully by using the New-ServiceFabricApplication cmdlet. The name of each application must start with the "fabric:" scheme and must be unique for each application instance. Any default services defined in the application manifest of the target application type are also created.

```powershell
New-ServiceFabricApplication fabric:/Voting VotingType 1.0.0
```

Once this operation completes, you can should see your application instances running in the Service Fabric Explorer. 

### Remove an Application
When an application instance is no longer needed, you can permanently remove it by name using the Remove-ServiceFabricApplication cmdlet. Remove-ServiceFabricApplication automatically removes all services that belong to the application as well, permanently removing all service state.

```powershell
Remove-ServiceFabricApplication fabric:/Voting
```

## Next steps

In this step we created and deployed our first Managed Service Fabric cluster. To learn more about how to scale a cluster, see:

> [!div class="nextstepaction"]
> [Scale out a Managed Service Fabric cluster](./tutorial-managed-cluster-scale.md)