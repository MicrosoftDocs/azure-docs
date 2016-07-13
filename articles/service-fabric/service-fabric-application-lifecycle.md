<properties
   pageTitle="Application lifecycle in Service Fabric | Microsoft Azure"
   description="Describes developing, deploying, testing, upgrading, maintaining, and removing Service Fabric applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>


<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/11/2016"
   ms.author="ryanwi"/>


# Service Fabric application lifecycle
As with other platforms, an application on Azure Service Fabric usually goes through the following phases: design, development, testing, deployment, upgrading, maintenance, and removal. Service Fabric provides first-class support for the full application lifecycle of cloud applications, from development through deployment, daily management, and maintenance to eventual decommissioning. The service model enables several different roles to participate independently in the application lifecycle. This article provides an overview of the APIs and how they are used by the different roles throughout the phases of the Service Fabric application lifecycle.

## Service model roles
The service model roles are:

- **Service developer**: Develops modular and generic services that can be re-purposed and used in multiple applications of the same type or different types. For example, a queue service can be used for creating a ticketing application (helpdesk) or an e-commerce application (shopping cart).

- **Application developer**: Creates applications by integrating a collection of services to satisfy certain specific requirements or scenarios. For example, an e-commerce website might integrate “JSON Stateless Front-End Service,” “Auction Stateful Service,” and “Queue Stateful Service” to build an auctioning solution.

- **Application administrator**: Makes decisions on the application configuration (filling in the configuration template parameters), deployment (mapping to available resources), and quality of service. For example, an application administrator decides the language locale (English for the United States or Japanese for Japan, for example) of the application. A different deployed application can have different settings.

- **Operator**: Deploys applications based on the application configuration and requirements specified by the application administrator. For example, an operator provisions and deploys the application and ensures that it is running in Azure. Operators monitor application health and performance information and maintain the physical infrastructure as needed.


## Develop
1. A *service developer* develops different types of services using the [Reliable Actors](service-fabric-reliable-actors-introduction.md) or [Reliable Services](service-fabric-reliable-services-introduction.md) programming model.
2. A *service developer* declaratively describes the developed service types in a service manifest file consisting of one or more code, configuration, and data packages.
3. An *application developer* then builds an application using different service types.
4. An *application developer* declaratively describes the application type in an application manifest by referencing the service manifests of the constituent services and appropriately overriding and parameterizing different configuration and deployment settings of the constituent services.

See [Get started with Reliable Actors](service-fabric-reliable-actors-get-started.md) and [Get started with Reliable Services](service-fabric-reliable-services-quick-start.md) for examples.

## Deploy
1. An *application administrator* tailors the application type to a specific application to be deployed to a Service Fabric cluster by specifying the appropriate parameters of the **ApplicationType** element in the application manifest.

2. An *operator* uploads the application package to the cluster image store by using the [**CopyApplicationPackage** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.copyapplicationpackage.aspx) or the [**Copy-ServiceFabricApplicationPackage** cmdlet](https://msdn.microsoft.com/library/azure/mt125905.aspx). The application package contains the application manifest and the collection of service packages. Service Fabric deploys applications from the application package stored in the image store, which can be an Azure blob store or the Service Fabric system service.

3. The *operator* then provisions the application type in the target cluster from the uploaded application package using the [**ProvisionApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.provisionapplicationasync.aspx), the  [**Register-ServiceFabricApplicationType** cmdlet](https://msdn.microsoft.com/library/azure/mt125958.aspx), or the [**Provision an Application** REST operation](https://msdn.microsoft.com/library/azure/dn707672.aspx).

4. After provisioning the application, an *operator* starts the application with the parameters supplied by the *application administrator* using the [**CreateApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.createapplicationasync.aspx), the [**New-ServiceFabricApplication** cmdlet](https://msdn.microsoft.com/library/azure/mt125913.aspx), or the [**Create Application** REST operation](https://msdn.microsoft.com/library/azure/dn707676.aspx).

5. After the application has been deployed, an *operator* uses the [**CreateServiceAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.servicemanagementclient.createserviceasync.aspx), the [**New-ServiceFabricService** cmdlet](https://msdn.microsoft.com/library/azure/mt125874.aspx), or the [**Create Service** REST operation](https://msdn.microsoft.com/library/azure/dn707657.aspx) to create new service instances for the application based on available service types.

6. The application is now running in the Service Fabric cluster.

See [Deploy an application](service-fabric-deploy-remove-applications.md) for examples.

## Test
1. After deploying to the local development cluster or a test cluster, a *service developer* runs the built-in failover test scenario by using the [**FailoverTestScenarioParameters**](https://msdn.microsoft.com/library/azure/system.fabric.testability.scenario.failovertestscenarioparameters.aspx) and [**FailoverTestScenario**](https://msdn.microsoft.com/library/azure/system.fabric.testability.scenario.failovertestscenario.aspx) classes, or the [**Invoke-ServiceFabricFailoverTestScenario** cmdlet](https://msdn.microsoft.com/library/azure/mt644783.aspx). The failover test scenario runs a specified service through important transitions and failovers to ensure that it's still available and working.

2. The *service developer* then runs the built-in chaos test scenario using the [**ChaosTestScenarioParameters**](https://msdn.microsoft.com/library/azure/system.fabric.testability.scenario.chaostestscenarioparameters.aspx) and [**ChaosTestScenario**](https://msdn.microsoft.com/library/azure/system.fabric.testability.scenario.chaostestscenario.aspx) classes, or the [**Invoke-ServiceFabricChaosTestScenario** cmdlet](https://msdn.microsoft.com/library/azure/mt644774.aspx). The chaos test scenario randomly induces multiple node, code package, and replica faults into the cluster.

3. The *service developer* [tests service-to-service communication](service-fabric-testability-scenarios-service-communication.md) by authoring test scenarios that move primary replicas around the cluster.

See [Introduction to the Fault Analysis Service](service-fabric-testability-overview.md) for more information.

## Upgrade
1. A *service developer* updates the constituent services of the instantiated application and/or fixes bugs and provides a new version of the service manifest.

2. An *application developer* overrides and parameterizes the configuration and deployment settings of the consistent services and provides a new version of the application manifest. The application developer then incorporates the new versions of the service manifests into the application and provides a new version of the application type in an updated application package.

3. An *application administrator* incorporates the new version of the application type into the target application by updating the appropriate parameters.

5. An *operator* uploads the updated application package to the cluster image store using the [**CopyApplicationPackage** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.copyapplicationpackage.aspx) or the [**Copy-ServiceFabricApplicationPackage** cmdlet](https://msdn.microsoft.com/library/azure/mt125905.aspx). The application package contains the application manifest and the collection of service packages.

6. An *operator* provisions the new version of the application in the target cluster by using the [**ProvisionApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.provisionapplicationasync.aspx), the [**Register-ServiceFabricApplicationType** cmdlet](https://msdn.microsoft.com/library/azure/mt125958.aspx), or the [**Provision an Application** REST operation](https://msdn.microsoft.com/library/azure/dn707672.aspx).

7. An *operator* upgrades the target application to the new version using the [**UpgradeApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.upgradeapplicationasync.aspx), the [**Start-ServiceFabricApplicationUpgrade** cmdlet](https://msdn.microsoft.com/library/azure/mt125975.aspx), or the [**Upgrade an Application** REST operation](https://msdn.microsoft.com/library/azure/dn707633.aspx).

8. An *operator* checks the progress of upgrade using the [**GetApplicationUpgradeProgressAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.getapplicationupgradeprogressasync.aspx), the [**Get-ServiceFabricApplicationUpgrade** cmdlet](https://msdn.microsoft.com/library/azure/mt125988.aspx), or the [**Get Application Upgrade Progress** REST operation](https://msdn.microsoft.com/library/azure/dn707631.aspx).

9. If necessary, the *operator* modifies and reapplies the parameters of the current application upgrade using the [**UpdateApplicationUpgradeAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.updateapplicationupgradeasync.aspx), the [**Update-ServiceFabricApplicationUpgrade** cmdlet](https://msdn.microsoft.com/library/azure/mt126030.aspx), or the [**Update Application Upgrade** REST operation](https://msdn.microsoft.com/library/azure/mt628489.aspx).

10. If necessary, the *operator* rolls back the current application upgrade using the [**RollbackApplicationUpgradeAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.rollbackapplicationupgradeasync.aspx), the [**Start-ServiceFabricApplicationRollback** cmdlet](https://msdn.microsoft.com/library/azure/mt125833.aspx), or the [**Rollback Application Upgrade** REST operation](https://msdn.microsoft.com/library/azure/mt628494.aspx).

11. Service Fabric upgrades the target application running in the cluster without losing the availability of any of its constituent services.

See the [Application upgrade tutorial](service-fabric-application-upgrade-tutorial.md) for examples.

## Maintain
1. For operating system upgrades and patches, Service Fabric interfaces with the Azure infrastructure to guarantee availability of all the applications running in the cluster.

2. For upgrades and patches to the Service Fabric platform, Service Fabric upgrades itself without losing availability of any of the applications running on the cluster.

3. An *application administrator* approves the addition or removal of nodes from a cluster after analyzing historical capacity utilization data and projected future demand.

4. An *operator* adds and removes nodes specified by the *application administrator*.

5. When new nodes are added to or existing nodes are removed from the cluster, Service Fabric automatically load-balances the running applications across all nodes in the cluster to achieve optimal performance.

## Remove
1. An *operator* can delete a specific instance of a running service in the cluster without removing the entire application using the [**DeleteServiceAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.servicemanagementclient.deleteserviceasync.aspx), the [**Remove-ServiceFabricService** cmdlet](https://msdn.microsoft.com/library/azure/mt126033.aspx), or the [**Delete Service** REST operation](https://msdn.microsoft.com/library/azure/dn707687.aspx).  

2. An *operator* can also delete an application instance and all of its services using the [**DeleteApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.deleteapplicationasync.aspx), the [**Remove-ServiceFabricApplication** cmdlet](https://msdn.microsoft.com/library/azure/mt125914.aspx), or the [**Delete Application** REST operation](https://msdn.microsoft.com/library/azure/dn707651.aspx).

3. Once the application and services have stopped, the *operator* can unprovision the application type using the [**UnprovisionApplicationAsync** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.unprovisionapplicationasync.aspx), the  [**Unregister-ServiceFabricApplicationType** cmdlet](https://msdn.microsoft.com/library/azure/mt125885.aspx), or the [**Unprovision an Application** REST operation](https://msdn.microsoft.com/library/azure/dn707671.aspx). Unprovisioning the application type does not remove the application package from the ImageStore. You must remove the application package manually.

4. An *operator* removes the application package from the ImageStore using the [**RemoveApplicationPackage** method](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.applicationmanagementclient.removeapplicationpackage.aspx) or the [**Remove-ServiceFabricApplicationPackage** cmdlet](https://msdn.microsoft.com/library/azure/mt163532.aspx).

See [Deploy an application](service-fabric-deploy-remove-applications.md) for examples.

## Next steps

For more information on developing, testing, and managing Service Fabric applications and services, see:

- [Reliable Actors](service-fabric-reliable-actors-introduction.md)
- [Reliable Services](service-fabric-reliable-services-introduction.md)
- [Deploy an application](service-fabric-deploy-remove-applications.md)
- [Application upgrade](service-fabric-application-upgrade.md)
- [Testability overview](service-fabric-testability-overview.md)
- [REST-based application lifecycle sample](service-fabric-rest-based-application-lifecycle-sample.md)
