<properties
   pageTitle="Report and check health with Azure Service Fabric | Microsoft Azure"
   description="Learn how to send health reports from your service code and check the health of your service using the health monitoring tools that Azure Service Fabric provides."
   services="service-fabric"
   documentationCenter=".net"
   authors="kunaldsingh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/18/2016"
   ms.author="toddabel"/>

# Report and check service health
When your services encounter problems, your ability to respond and fix any resulting incidents and outages depends on being able to detect the issues quickly. By reporting problems and failures to the Service Fabric health manager from your service code, you can use standard health monitoring tools that Service Fabric provides to check the health status.

There are two ways you can report health from the service.

1. Using [Partition](https://msdn.microsoft.com/library/system.fabric.istatefulservicepartition.aspx) or [CodePackageActivationContext](https://msdn.microsoft.com/library/system.fabric.codepackageactivationcontext.aspx) objects.  
Using `Partition` and `CodePackageActivationContext` objects you can report health on elements that are part of the current context. For example, the code running as part of a replica can report health only on that replica, the partition it belongs to and the application it is a part of.

2. Using `FabricClient`.   
You can use `FabricClient` to report health from the service code only if the cluster is not [secure](service-fabric-cluster-security.md) or if the service is running with admin privileges. This won't be true in most real world scenarios. With FabricClient you can report health on any entity that is a part of the cluster. But ideally service code should only send reports related to its own health.

This article walks you through an example of reporting health from the service code, and shows how the health status can be checked using the tools that Service Fabric provides. This article is intended to be a quick introduction to the health monitoring capabilities in Service Fabric. For more detailed information, you can read the series of in-depth articles on health starting with the link at the end of this document.

## Prerequisites
You must have the following installed:

   * Visual Studio 2015
   * Service Fabric SDK

## To create a local secure dev cluster
Start PowerShell with admin privileges and run the following commands.

![Create a secure dev cluster](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/create-secure-dev-cluster.png)

## To deploy an application and check its health
To deploy an application and check its health, follow these steps:

1. Launch Visual Studio as an administrator.

2. Create a project for a stateful service.

    ![Create a Service Fabric application with Stateful Service](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/create-stateful-service-application-dialog.png)

3. Press **F5** to run the application in debug mode. The application will be deployed to the local cluster.

4. Once the application is running, launch Service Fabric Explorer by right-clicking the Local Cluster Manager system tray app, and choose **Manage Local Cluster** from the context menu.

    ![Launch Service Fabric Explorer from system tray](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/LaunchSFX.png)

5. The application health should be displayed as in the image below. At this time, the application should be healthy with no errors.

    ![Healthy application in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/sfx-healthy-app.png)

6. You can also check the health by using PowerShell. You can check an application's health using ```Get-ServiceFabricApplicationHealth``` and you can check service health by using ```Get-ServiceFabricServiceHealth```. The health report for the same application in PowerShell looks like this.

    ![Healthy application in PowerShell](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/ps-healthy-app-report.png)

## To add custom health events to your service code
The Service Fabric Visual Studio project templates contain sample code. The steps below show how you can report custom health events from your service code. Such reports will automatically show up in the standards tools for health monitoring that Service Fabric provides, such as Service Fabric Explorer, Azure portal health view, and PowerShell.

1. Reopen the application you created above in Visual Studio or create a new application by using a stateful service from the Visual Studio templates.

2. Next, open the **Stateful1.cs** file and look up the call `myDictionary.TryGetValueAsync` in the *RunAsync* method. You can see this returns a `result` that holds the current value of the counter, since the key logic in this application is to keep a count running. If this was a real application, and if the lack of result represented a failure, then you would want to flag that through health.

3. To report a health event for the lack of result representing a failure, add the code below after the `myDictionary.TryGetValueAsync` call. We report replica health since it's being reported from a stateful service. The `HealthInformation` parameter stores information about the health issue being reported. Add this namespace to the **Stateful1.cs** file.

    ```csharp
    using System.Fabric.Health;
    ```

    Add this code after the `myDictionary.TryGetValueAsync` call.

    ```csharp
    if (!result.HasValue)
    {
        HealthInformation healthInformation = new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error);
        this.Partition.ReportReplicaHealth(healthInformation);
    }
    ```

    For a stateless service use the following code.

    ```csharp
    if (!result.HasValue)
    {
        HealthInformation healthInformation = new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error);
        this.Partition.ReportInstanceHealth(healthInformation);
    }
    ```

    If your service is running with admin privileges or if the cluster is not [secure](service-fabric-cluster-security.md), you can also use FabricClient to report health as shown below.  

    Create the FabricClient after the `var myDictionary` declaration

    ```csharp
    var fabricClient = new FabricClient(new FabricClientSettings() { HealthReportSendInterval = TimeSpan.FromSeconds(0) });
    ```

    And add this code after the `myDictionary.TryGetValueAsync` call.

    ```csharp
    if (!result.HasValue)
    {
       var replicaHealthReport = new StatefulServiceReplicaHealthReport(
            this.ServiceInitializationParameters.PartitionId,
            this.ServiceInitializationParameters.ReplicaId,
            new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error));
        fabricClient.HealthManager.ReportHealth(replicaHealthReport);
    }
    ```

4. Let's simulate this failure and see it show up in the health monitoring tools. To simulate the failure, comment out the first line in the health reporting code you added above. After you comment out the first line, the code will look as shown below. This will now fire this health report each time RunAsync executes. After making the change run the application using **F5**.

    ```csharp
    //if(!result.HasValue)
    {
        HealthInformation healthInformation = new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error);
        this.Partition.ReportReplicaHealth(healthInformation);
    }
    ```

5. Once the application is running, open Service Fabric Explorer to check health of the application. This time Service Fabric Explorer will show the application to be unhealthy. This is because of the error that was reported from the code that we added above.

    ![Unhealthy application in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/sfx-unhealthy-app.png)

6. If you select the primary replica in the tree view of Service Fabric Explorer, you will see that it shows the health to be in error too. It also displays the health report details that were added to the `HealthInformation` parameter in the code. You can see the same health reports in PowerShell also as well as the Azure portal.

    ![Replica health in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/replica-health-error-report-sfx.png)

This report will remain in the health manager until it is replaced by another report or this replica is deleted. Since we did not set a TimeToLive for this health report in the HealthInformation object, it will never expire.

Its recommended that health should be reported on the most granular level, which in above case is the replica. You can also report health on a `Partition`.

```csharp
HealthInformation healthInformation = new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error);
this.Partition.ReportPartitionHealth(healthInformation);
```

For reporting health on `Application`, `DeployedApplication` and `DeployedServicePackage` use the `CodePackageActivationContext`

```csharp
HealthInformation healthInformation = new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error);
var activationContext = FabricRuntime.GetActivationContext();
activationContext.ReportApplicationHealth(healthInformation);
```

## Next steps
[Deep dive on Service Fabric health](service-fabric-health-introduction.md)
