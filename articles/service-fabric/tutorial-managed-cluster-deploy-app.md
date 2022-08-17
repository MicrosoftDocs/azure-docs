---
title: Deploy an application to a Service Fabric managed cluster via PowerShell
description: In this tutorial, you will connect to a Service Fabric managed cluster and deploy an application via PowerShell.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Deploy an app to a Service Fabric managed cluster

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Service Fabric managed cluster](tutorial-managed-cluster-deploy.md)
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Service Fabric managed cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * How to deploy an application to a Service Fabric managed cluster

This part of the series covers how to:

> [!div class="checklist"]
> * Connect to your Service Fabric managed cluster
> * Upload an application to a cluster
> * Instantiate an application in a cluster
> * Remove an application from a cluster

## Prerequisites

* A Service Fabric managed cluster (see [*Deploy a managed cluster*](tutorial-managed-cluster-deploy.md)).

## Connect to your cluster

To connect to your cluster, you'll need the cluster certificate thumbprint. You can find this value in the cluster properties output of your resource deployment or by querying the cluster properties on an existing resource.

The following command can be used to query your cluster resource for the cluster certificate thumbprint.

```powershell
$serverThumbprint = (Get-AzResource -ResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/managedclusters/mysfcluster).Properties.clusterCertificateThumbprints
```

With the cluster certificate thumbprint, you're ready to connect to your cluster.

```powershell
$connectionEndpoint = "mysfcluster.eastus2.cloudapp.azure.com:19000"
Connect-ServiceFabricCluster -ConnectionEndpoint $connectionEndpoint -KeepAliveIntervalInSec 10 `
      -X509Credential `
      -ServerCertThumbprint $serverThumbprint  `
      -FindType FindByThumbprint `
      -FindValue $clientThumbprint `
      -StoreLocation CurrentUser `
      -StoreName My

```

### Upload an application package

In this tutorial, we will be using the [Service Fabric Voting Application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/tree/voting-sample-no-reverse-proxy) sample. For more details on Service Fabric application deployment through PowerShell see [Service Fabric deploy and remove applications](service-fabric-deploy-remove-applications.md).

> [!NOTE]
> In the Service Fabric managed cluster preview you will not be able to publish applications directly from Visual Studio.

You will first need to [package the application for deployment](service-fabric-package-apps.md). For this tutorial, please follow the steps for packaging an application from within Visual Studio. It is important to take note of the path where the application has been packaged as it will be used for the path below.

Once the application package has been created you can upload the application package to your cluster. Update the `$path` value to represent the path where your application package exists, and run the following:

```powershell
$path = "C:\Users\<user>\Documents\service-fabric-dotnet-quickstart\Voting\pkg\Debug"
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $path -CompressPackage
Register-ServiceFabricApplicationType -ApplicationPathInImageStore Debug
```

### Create an application

You can instantiate an application from any application type version that has been registered successfully by using the New-ServiceFabricApplication cmdlet. The name of each application must start with the "fabric:" scheme and must be unique for each application instance. Any default services defined in the application manifest of the target application type are also created.

```powershell
New-ServiceFabricApplication fabric:/Voting VotingType 1.0.0
```

Once this operation completes, you should see your application instances running in the Service Fabric Explorer.

### Remove an application

When an application instance is no longer needed, you can permanently remove it by name using the `Remove-ServiceFabricApplication` cmdlet, which also automatically removes all services that belong to the application, permanently removing all service state.

```powershell
Remove-ServiceFabricApplication fabric:/Voting
```

## Next steps

In this step, we deployed an application to a Service Fabric managed cluster. To learn more about application deployment options, see:

* [Deploy application secrets to a managed cluster](how-to-managed-cluster-application-secrets.md)
* [Deploy an application to a managed cluster using Azure Resource Manager](how-to-managed-cluster-app-deployment-template.md)
* [Deploy an application with managed identity to a managed cluster](how-to-managed-cluster-application-managed-identity.md)


To learn more about managed cluster configuration options, see:

* [Configure your manage cluster](how-to-managed-cluster-configuration.md)
