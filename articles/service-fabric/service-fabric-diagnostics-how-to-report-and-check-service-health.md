<properties
   pageTitle="Microsoft Azure Service Fabric How to report and check service health"
   description="This article describes how you can send health reports from your service code and check your service's health using the Health Monitoring tools that Azure Service Fabric provides"
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
   ms.date="10/27/2015"
   ms.author="kunalds"/>


# Reporting and checking service health
When your services encounter problems your ability to respond and fix any resulting incidents and outages depends on being able to detect the issues quickly. By reporting problems and failures to the Service Fabric Health Manager from your service code you can use standard Health Monitoring tools that Service Fabric provides to check the health status. This document will walk you through an example of adding a health report to a service and show how the health status can be checked using the tools that Service Fabric provides.

## Prerequisites
You must have the following installed:
   * Visual Studio 2015
   * Service Fabric SDK

## Deploy an application and check its health
To deploy an application and check its health follow these steps:

1. Launch Visual Studio as an administrator.

2. Create a project for a stateful service.

  ![Create a Service Fabric Application with Stateful Service](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/CreateStatefulServiceApplication.png)

3. Press F5 to run the application in debug mode. The application will be deployed to the local cluster.

4. Once the application is running, open Service Fabric Explorer and the application health should be displayed as in the image below. At this time the application should be health with no errors.

  ![Healthy Application in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/SFEHealthyApp.png)

5. You can also check the health using Powershell. You can check an application's health using ```Get-ServiceFabricApplicationHealth``` and service health can be queried by ```Get-ServiceFabricServiceHealth```. The health report for the same application in Powershell looks like this.
![Healthy Application in Powershell](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/PSHealthyApp.png)

## Add custom health events to your service code
The Service Fabric Visual Studio project templates contain sample code. The steps below show how you can report custom health events from your service code. Such reports will automatically show up in the standards tools for Health Monitoring that Service Fabric provides such as Service Fabric Explorer, Azure Portal health view and Powershell.

1. Re-open the application you created above in Visual Studio or create a new application with a stateful service from the VS templates.
2. Open the **Stateful1.cs** file. Look up this call `myDictionary.TryGetValueAsync` in the *RunAsync* method. You can see this returns a `result` that holds the current value of the counter, as the key logic in this application is to keep a count running. If this was a real application and if the lack of result represented a failure then you would want to report that as a Health Event.
3. To report a health event for the lack of result representing a failure add the code below after the `myDictionary.TryGetValueAsync` call. We report the event as a `StatefulServiceReplicaHealthReport` since this is being reported from a stateful service. The PartitionId and ReplicaId that are passed in to the report event will help identify the source of this report when you see it in one of the Health Monitoring tools since when a stateful service is deployed it can have multiple partitions and each partition can have multiple replicas. The `HealthInformation` parameter provides information about the issue being reported.

Add these namespaces to the **Stateful1.cs** file.
```
using System.Fabric;
using System.Fabric.Health;
```

Add this code after the `myDictionary.TryGetValueAsync` call.
```
if(!result.HasValue)
{
    var replicaHealthReport = new StatefulServiceReplicaHealthReport(
        this.ServiceInitializationParameters.PartitionId,
        this.ServiceInitializationParameters.ReplicaId,
        new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error));

    var fabricClient = new FabricClient(new FabricClientSettings() { HealthReportSendInterval = TimeSpan.FromSeconds(0) });
    fabricClient.HealthManager.ReportHealth(replicaHealthReport);
}
```

4. Let's simulate this failure and see it show up in Health Monitoring tools. To simulate comment out the first line in the health reporting code you added above as shown below. This will now fire this health report each time RunAsync executes. After making the change run the application using F5.
```
//if(!result.HasValue)
{
    var replicaHealthReport = new StatefulServiceReplicaHealthReport(
        this.ServiceInitializationParameters.PartitionId,
        this.ServiceInitializationParameters.ReplicaId,
        new HealthInformation("ServiceCode", "StateDictionary", HealthState.Error));

    var fabricClient = new FabricClient(new FabricClientSettings() { HealthReportSendInterval = TimeSpan.FromSeconds(0) });
    fabricClient.HealthManager.ReportHealth(replicaHealthReport);
}
```
5. Once the application is running, open Service Fabric Explorer to check health of the application. This time Service Fabric Explorer will show the application to be unhealthy. This is because of the error that was reported from the code that we added above.
![Unhealthy Application in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/SFEUnhealthyApp.png)

6. If you select the primary replica in the tree view of Service Fabric Explorer, you will see it shows the health to be in error too and also displays the health report details that were added to the 'HealthInformation` parameter in the code. You can see the same health reports in Powershell as well as the Azure Portal.
![Replica Health in Service Fabric Explorer](./media/service-fabric-diagnostics-how-to-report-and-check-service-health/ReplicaHealthErrorReport.png)