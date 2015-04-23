<properties
   pageTitle="Azure Service Fabric Application Life-cycle"
   description="Azure Service Fabric Application Life-cycle"
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
   ms.date="04/06/2015"
   ms.author="ryanwi; mani-ramaswamy"/>


# Service Fabric application life-cycle
Similar to other platforms, an application on Service Fabric usually goes through the following phases: design, development, test, deployment, upgrade, maintenance, and removal. Service Fabric provides first class support for the full application life-cycle of cloud applications: from development to deployment, to daily management, to maintenance, and to eventual decommissioning. The service model enables several different roles to participate independently in the application life-cycle. This article provides an overview of the APIs used by the different roles throughout the phases of the Service Fabric application lifecycle.

## Service model roles
The service model roles are:

- **Service Developer**- Develops modular and generic services that can be re-purposed and used in multiple applications of the same type or different types. For example, a queue service can be used for creating a ticketing application (helpdesk) or an e-commerce application (shopping cart).

- **Application Developer**- Creates applications by integrating a collection of services to satisfy certain specific requirements or scenarios. For example, an e-commerce website might integrate “JSON Stateless Front-end Service,” “Auction Stateful Service,” and “Queue Stateful Service” to build an auctioning solution.

- **Application Administrator**- Makes decisions on the application configuration (filling in the configuration template parameters), deployment (mapping to available resources), and quality of service. For example, an application administrator decides the language locale (English for US or Japanese for Japan, for example) of the application. Another deployed application can have different settings.

- **Operator**- Deploys applications based on the application configuration and requirements specified by the application administrator. For example, an operator provisions and deploys the application and ensures that it is running in Azure. Operators monitor application health and performance information and maintain the physical infrastructure as needed.


## Develop
1. A *service developer* develops different types of services using the [Actor](../service-fabric-fabact-introduction) or [Fabric Service](../service-fabric-fabsrv-service-overview) programming model.
2. A *service developer* declaratively describes the developed service types in a service manifest file consisting of one or more code, configuration, and data packages.
3. An *application developer* then builds an application using different service types.
4. An *application developer* declaratively describes the application type in an application manifest by referencing the service manifests of the constituent services and appropriately overriding and parameterizing different configuration and deployment settings of the constituent services.

## Deploy
1. An *application administrator* tailors the application type into a specific application to be deployed to a Service Fabric cluster by specifying the appropriate parameters of the **ApplicationType** element in the application manifest.

2. An *operator* uploads the application package to the cluster ImageStore using the ApplicationManagementClient.CopyApplicationPackage method or Copy-ServiceFabricApplicationPackage cmdlet. The application package contains the application manifest and the collection of service packages.  Service Fabric deploys applications from the application package stored in the ImageStore, which can be an Azure Blob store or the Service Fabric system service.

3. The *operator* then provisions the application type in the target cluster from the uploaded application package using the ApplicationManagementClient.ProvisionApplicationAsync method,  Register-ServiceFabricApplicationType cmdlet, or Create Application REST operation.

3. After provisioning the application, an *operator* starts the application with the parameters supplied by the *application administrator* using the ApplicationManagementClient.CreateApplicationAsync method, New-ServiceFabricApplication cmdlet, or Create Application REST operation.

4. After the application has been deployed, an *operator* uses the ServiceManagementClient.CreateServiceAsync method, New-ServiceFabricService cmdlet, or Create Application REST operation to create new service instances for the application based on available service types.

5. The application is now running in the Service Fabric cluster.

## Test
1. After deploying to the local development cluster or a test cluster, a *service developer* runs the built-in failover test scenario using the FailoverTestScenarioParameters and FailoverTestScenario classes or the Invoke-ServiceFabricFailoverTestScenario cmdlet. The failover test scenario runs a specified service through important transitions and failovers to ensure it's still available and working.

2. The *service developer* then runs the built-in chaos test scenario using the ChaosTestScenarioParametersscenarioParameters and ChaosTestScenario classes or the Invoke-ServiceFabricChaosTestScenario cmdlet. The chaos test scenario randomly induces multiple node, code package, and replica faults into the cluster.

## Upgrade
1. A *service developer* updates the constituent services of the instantiated application and/or fixes bugs and provides a new version of service manifest.

2. An *application developer* overrides and parameterizes the configuration and deployment settings of the consistent services and provides a new version of the application manifest. The application developer then incorporates the new versions of the service manifests into the application and provides a new version of the application type in an updated application package.

3. An *application administrator* incorporates the new version of the application type into the target application by updating the appropriate parameters.

4. An *operator* uploads the updated application package to the cluster ImageStore using the ApplicationManagementClient.CopyApplicationPackage method or Copy-ServiceFabricApplicationPackage cmdlet. The application package contains the application manifest and the collection of service packages.

5. An *operator* provisions the new version of the application in the target cluster using the ApplicationManagementClient.ProvisionApplicationAsync method, the Register-ServiceFabricApplicationType cmdlet, or Provision an Application REST operation.

6. An *operator* upgrades the target application to the new version using the ApplicationManagementClient.UpgradeApplicationAsync method, the Start-ServiceFabricApplicationUpgrade cmdlet, or the Upgrade Application by Application Type REST operation.

7. An *operator* checks the progress of upgrade using the ApplicationManagementClient.GetApplicationUpgradeProgressAsync method, the Get-ServiceFabricApplicationUpgrade cmdlet, or the Get Application Upgrade Progress REST operation.

8. If necessary, the *operator* modifies and re-applies the parameters of the current application upgrade using the ApplicationManagementClient.UpdateApplicationUpgradeAsync method, the Update-ServiceFabricApplicationUpgrade cmdlet, or the Update Application Upgrade REST operation.

9. If necessary, the *operator* rolls back the current application upgrade using the ApplicationManagementClient.RollbackApplicationUpgradeAsync method, the Start-ServiceFabricApplicationRollback cmdlet, or the Rollback Application Upgrade REST operation.

10. Service Fabric upgrades the target application running in the cluster without losing the availability of any of its constituent services.

## Maintain
1. For operating system upgrades and patches, Service Fabric interfaces with the Azure infrastructure to guarantee availability of all the applications running in the cluster.

2. For upgrades and patches to the Service Fabric platform, Service Fabric self-upgrades itself without losing availability of any of the applications running on the cluster.

3. An *application administrator* approves the addition or removal of nodes from a cluster after analyzing historical capacity utilization data and projected future demand.

4. An *operator* adds and removes nodes specified by the *application administrator*.

5. When new nodes are added to or existing nodes are removed from the cluster, Service Fabric automatically load balances running applications across all nodes in the cluster to achieve optimal performance.

## Remove
1. An *operator* can delete a specific instance of a running service in the cluster without removing the entire application using the ServiceManagementClient.DeleteServiceAsync method, Remove-ServiceFabricService cmdlet, or Delete Service REST operation.  

2. An *operator* can also delete an application instance and all of it’s services using the ApplicationManagementClient.DeleteApplicationAsync method, Remove-ServiceFabricApplication cmdlet, or Delete Application REST operation.

3. Once the application and services have stopped, the *operator* can un-provision the application type using the ApplicationManagementClient.UnprovisionApplicationAsync method,  Remove-ServiceFabricApplication cmdlet, or Unprovision an Application  REST operation. Un-provisioning the application type does not remove the application package from the ImageStore, you must remove the application package manually.

4. An *operator* removes the application package from the ImageStore using the ApplicationManagementClient.RemoveApplicationPackage method or Remove-ServiceFabricApplicationPackage cmdlet.
