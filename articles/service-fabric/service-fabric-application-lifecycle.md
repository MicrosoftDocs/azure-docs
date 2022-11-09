---
title: Application lifecycle in Service Fabric
description: Describes developing, deploying, testing, upgrading, maintaining, and removing Service Fabric applications.
service: service-fabric
ms.service: service-fabric
author: tomvcassidy
ms.author: tomcassidy
ms.topic: conceptual
ms.date: 05/25/2022
---

# Service Fabric application lifecycle
As with other platforms, an application on Azure Service Fabric usually goes through the following phases: design, development, testing, deployment, upgrading, maintenance, and removal. Service Fabric provides first-class support for the full application lifecycle of cloud applications, from development through deployment, daily management, and maintenance to eventual decommissioning. The service model enables several different roles to participate independently in the application lifecycle. This article provides an overview of the APIs and how they are used by the different roles throughout the phases of the Service Fabric application lifecycle.

[Check this page for a training video that describes how to manage your application lifecycle:](/shows/building-microservices-applications-on-azure-service-fabric/application-lifetime-management-in-action)


[!INCLUDE [links to azure cli and service fabric cli](../../includes/service-fabric-sfctl.md)]

## Service model roles
The service model roles are:

* **Service developer**: Develops modular and generic services that can be repurposed and used in multiple applications of the same type or different types. For example, a queue service can be used for creating a ticketing application (helpdesk) or an e-commerce application (shopping cart).
* **Application developer**: Creates applications by integrating a collection of services to satisfy certain specific requirements or scenarios. For example, an e-commerce website might integrate “JSON Stateless Front-End Service,” “Auction Stateful Service,” and “Queue Stateful Service” to build an auctioning solution.
* **Application administrator**: Makes decisions on the application configuration (filling in the configuration template parameters), deployment (mapping to available resources), and quality of service. For example, an application administrator decides the language locale (English for the United States or Japanese for Japan, for example) of the application. A different deployed application can have different settings.
* **Operator**: Deploys applications based on the application configuration and requirements specified by the application administrator. For example, an operator provisions and deploys the application and ensures that it is running in Azure. Operators monitor application health and performance information and maintain the physical infrastructure as needed.

## Develop
1. A *service developer* develops different types of services using the [Reliable Actors](service-fabric-reliable-actors-introduction.md) or [Reliable Services](service-fabric-reliable-services-introduction.md) programming model.
2. A *service developer* declaratively describes the developed service types in a service manifest file consisting of one or more code, configuration, and data packages.
3. An *application developer* then builds an application using different service types.
4. An *application developer* declaratively describes the application type in an application manifest by referencing the service manifests of the constituent services and appropriately overriding and parameterizing different configuration and deployment settings of the constituent services.

See [Get started with Reliable Actors](service-fabric-reliable-actors-get-started.md) and [Get started with Reliable Services](service-fabric-reliable-services-quick-start.md) for examples.

## Deploy
1. An *application administrator* tailors the application type to a specific application to be deployed to a Service Fabric cluster by specifying the appropriate parameters of the **ApplicationType** element in the application manifest.
2. An *operator* uploads the application package to the cluster image store by using the [**CopyApplicationPackage** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient) or the [**Copy-ServiceFabricApplicationPackage** cmdlet](/powershell/module/servicefabric/copy-servicefabricapplicationpackage). The application package contains the application manifest and the collection of service packages. Service Fabric deploys applications from the application package stored in the image store, which can be an Azure blob store or the Service Fabric system service.
3. The *operator* then provisions the application type in the target cluster from the uploaded application package using the [**ProvisionApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the  [**Register-ServiceFabricApplicationType** cmdlet](/powershell/module/servicefabric/register-servicefabricapplicationtype), or the [**Provision an Application** REST operation](/rest/api/servicefabric/provision-an-application).
4. After provisioning the application, an *operator* starts the application with the parameters supplied by the *application administrator* using the [**CreateApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**New-ServiceFabricApplication** cmdlet](/powershell/module/servicefabric/new-servicefabricapplication), or the [**Create Application** REST operation](/rest/api/servicefabric/create-an-application).
5. After the application has been deployed, an *operator* uses the [**CreateServiceAsync** method](/dotnet/api/system.fabric.fabricclient.servicemanagementclient), the [**New-ServiceFabricService** cmdlet](/powershell/module/servicefabric/new-servicefabricservice), or the [**Create Service** REST operation](/rest/api/servicefabric/create-a-service) to create new service instances for the application based on available service types.
6. The application is now running in the Service Fabric cluster.

See [Deploy an application](service-fabric-deploy-remove-applications.md) for examples.

## Test
1. After deploying to the local development cluster or a test cluster, a *service developer* runs the built-in failover test scenario by using the [**FailoverTestScenarioParameters**](/dotnet/api/system.fabric.testability.scenario.failovertestscenarioparameters) and [**FailoverTestScenario**](/dotnet/api/system.fabric.testability.scenario.failovertestscenario) classes, or the [**Invoke-ServiceFabricFailoverTestScenario** cmdlet](/powershell/module/servicefabric/invoke-servicefabricfailovertestscenario). The failover test scenario runs a specified service through important transitions and failovers to ensure that it's still available and working.
2. The *service developer* then runs the built-in chaos test scenario using the [**ChaosTestScenarioParameters**](/dotnet/api/system.fabric.testability.scenario.chaostestscenarioparameters) and [**ChaosTestScenario**](/dotnet/api/system.fabric.testability.scenario.chaostestscenario) classes, or the [**Invoke-ServiceFabricChaosTestScenario** cmdlet](/powershell/module/servicefabric/invoke-servicefabricchaostestscenario). The chaos test scenario randomly induces multiple node, code package, and replica faults into the cluster.
3. The *service developer* [tests service-to-service communication](service-fabric-testability-scenarios-service-communication.md) by authoring test scenarios that move primary replicas around the cluster.

See [Introduction to the Fault Analysis Service](service-fabric-testability-overview.md) for more information.

## Upgrade
1. A *service developer* updates the constituent services of the instantiated application and/or fixes bugs and provides a new version of the service manifest.
2. An *application developer* overrides and parameterizes the configuration and deployment settings of the consistent services and provides a new version of the application manifest. The application developer then incorporates the new versions of the service manifests into the application and provides a new version of the application type in an updated application package.
3. An *application administrator* incorporates the new version of the application type into the target application by updating the appropriate parameters.
4. An *operator* uploads the updated application package to the cluster image store using the [**CopyApplicationPackage** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient) or the [**Copy-ServiceFabricApplicationPackage** cmdlet](/powershell/module/servicefabric/copy-servicefabricapplicationpackage). The application package contains the application manifest and the collection of service packages.
5. An *operator* provisions the new version of the application in the target cluster by using the [**ProvisionApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Register-ServiceFabricApplicationType** cmdlet](/powershell/module/servicefabric/register-servicefabricapplicationtype), or the [**Provision an Application** REST operation](/rest/api/servicefabric/provision-an-application).
6. An *operator* upgrades the target application to the new version using the [**UpgradeApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Start-ServiceFabricApplicationUpgrade** cmdlet](/powershell/module/servicefabric/start-servicefabricapplicationupgrade), or the [**Upgrade an Application** REST operation](/rest/api/servicefabric/upgrade-an-application).
7. An *operator* checks the progress of upgrade using the [**GetApplicationUpgradeProgressAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Get-ServiceFabricApplicationUpgrade** cmdlet](/powershell/module/servicefabric/get-servicefabricapplicationupgrade), or the [**Get Application Upgrade Progress** REST operation](/rest/api/servicefabric/get-the-progress-of-an-application-upgrade1).
8. If necessary, the *operator* modifies and reapplies the parameters of the current application upgrade using the [**UpdateApplicationUpgradeAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Update-ServiceFabricApplicationUpgrade** cmdlet](/powershell/module/servicefabric/update-servicefabricapplicationupgrade), or the [**Update Application Upgrade** REST operation](/rest/api/servicefabric/update-an-application-upgrade).
9. If necessary, the *operator* rolls back the current application upgrade using the [**RollbackApplicationUpgradeAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Start-ServiceFabricApplicationRollback** cmdlet](/powershell/module/servicefabric/start-servicefabricapplicationrollback), or the [**Rollback Application Upgrade** REST operation](/rest/api/servicefabric/rollback-an-application-upgrade).
10. Service Fabric upgrades the target application running in the cluster without losing the availability of any of its constituent services.

See the [Application upgrade tutorial](service-fabric-application-upgrade-tutorial.md) for examples.

## Maintain
1. For operating system upgrades and patches, Service Fabric interfaces with the Azure infrastructure to guarantee availability of all the applications running in the cluster.
2. For upgrades and patches to the Service Fabric platform, Service Fabric upgrades itself without losing availability of any of the applications running on the cluster.
3. An *application administrator* approves the addition or removal of nodes from a cluster after analyzing historical capacity utilization data and projected future demand.
4. An *operator* adds and removes nodes specified by the *application administrator*.
5. When new nodes are added to or existing nodes are removed from the cluster, Service Fabric automatically load-balances the running applications across all nodes in the cluster to achieve optimal performance.

## Remove
1. An *operator* can delete a specific instance of a running service in the cluster without removing the entire application using the [**DeleteServiceAsync** method](/dotnet/api/system.fabric.fabricclient.servicemanagementclient), the [**Remove-ServiceFabricService** cmdlet](/powershell/module/servicefabric/remove-servicefabricservice), or the [**Delete Service** REST operation](/rest/api/servicefabric/delete-a-service).  
2. An *operator* can also delete an application instance and all of its services using the [**DeleteApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the [**Remove-ServiceFabricApplication** cmdlet](/powershell/module/servicefabric/remove-servicefabricapplication), or the [**Delete Application** REST operation](/rest/api/servicefabric/delete-an-application).
3. Once the application and services have stopped, the *operator* can unprovision the application type using the [**UnprovisionApplicationAsync** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient), the  [**Unregister-ServiceFabricApplicationType** cmdlet](/powershell/module/servicefabric/unregister-servicefabricapplicationtype), or the [**Unprovision an Application** REST operation](/rest/api/servicefabric/unprovision-an-application). Unprovisioning the application type does not remove the application package from the ImageStore. 
4. An *operator* removes the application package from the ImageStore using the [**RemoveApplicationPackage** method](/dotnet/api/system.fabric.fabricclient.applicationmanagementclient) or the [**Remove-ServiceFabricApplicationPackage** cmdlet](/powershell/module/servicefabric/remove-servicefabricapplicationpackage).

See [Deploy an application](service-fabric-deploy-remove-applications.md) for examples.

## Preserving disk space in cluster image store

The ImageStoreService keeps copied and provisioned packages, which can lead to accumulation of files. File accumulation can cause the ImageStoreService (fabric:/System/ImageStoreService) to fill up the disk and can increase the build time for ImageStoreService replicas.

To avoid file accumulation, use the following provisioning sequence:

1. Copy package to ImageStore, and use the compress option

1. Provision the package

1. Remove the package in the image store

1. Upgrade the application/cluster

1. Unprovision the old version

Steps 3 and 5 in the procedure above prevent the accumulation of files in the image store.

### Configuration for automatic cleanup

You can automate step 3 above using PowerShell or XML. This will cause the application package to be automatically deleted after the successful registration of the application type.

[PowerShell](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps&preserve-view=true):

```powershell
Register-ServiceFabricApplicationTye -ApplicationPackageCleanupPolicy Automatic
```

XML:

```xml
<Section Name="Management">
  <Parameter Name="CleanupApplicationPackageOnProvisionSuccess" Value="True" />
</Section>
```

You can automate step 5 above using XML. This will cause unused application types to be automatically unregistered.

```xml
<Section Name="Management">
  <Parameter Name="CleanupUnusedApplicationTypes" Value="true" />
  <Parameter Name="PeriodicCleanupUnusedApplicationTypes" Value="true" />     
  <Parameter Name="TriggerAppTypeCleanupOnProvisionSuccess" Value="true" />
  <Parameter Name="MaxUnusedAppTypeVersionsToKeep" Value="3" />
</Section>
```

## Cleaning up files and data on nodes

The replication of application files will distribute eventually the files to all nodes depending on balancing actions. This can create disk pressure depending on the number of applications and their file size.
Even when no active instance is running on a node, the files from a former instance will be kept. The same is true for data from reliable collections used by stateful services. This serves the purpose of higher availability. In case of a new application instance on the same node no files must be copied. For reliable collections, only the delta must be replicated.

To remove the application binaries completely you have to unregister the application type.

Recommendations to reduce disk pressure:

1. [Remove-ServiceFabricApplicationPackage](service-fabric-deploy-remove-applications.md#remove-an-application-package-from-the-image-store) this removes the package from temporary upload location.
1. [Unregister-ServiceFabricApplicationType](service-fabric-deploy-remove-applications.md#unregister-an-application-type) releases storage space by removing the application type files from image store service and all nodes. The deletion manager runs every hour per default.
1. [CleanupUnusedApplicationTypes](service-fabric-cluster-fabric-settings.md)
    cleans up old unused application versions automatically.
    ```ARM template
    {
      "name": "Management",
      "parameters": [
        {
          "name": "CleanupUnusedApplicationTypes",
          "value": true
        },
        {
          "name": "MaxUnusedAppTypeVersionsToKeep",
          "value": "3"
        }
      ]
    }
    ```
1.  [Remove-ServiceFabricClusterPackage](/powershell/module/servicefabric/remove-servicefabricclusterpackage) removes old unused runtime installation binaries.

>[!Note]
> A feature is under development to allow Service Fabric to delete application folders once the application is evacuated from the node.


## Next steps
For more information on developing, testing, and managing Service Fabric applications and services, see:

* [Reliable Actors](service-fabric-reliable-actors-introduction.md)
* [Reliable Services](service-fabric-reliable-services-introduction.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)
* [Application upgrade](service-fabric-application-upgrade.md)
* [Testability overview](service-fabric-testability-overview.md)
