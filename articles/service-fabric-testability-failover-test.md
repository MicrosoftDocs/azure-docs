<properties
   pageTitle="Running the Failover test."
   description="This article talks about the Failover test and how to run it."
   services="service-fabric"
   documentationCenter=".net"
   authors="anmola"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/14/2014"
   ms.author="anmola"/>

# Failover Test.

The Failover test scenario is a more targeted version of the the Chaos test scenario where you can induce faults in a specific service partition rather than the entire cluster. It allows you test the effect of failover on a specific service partition in a cluster while leaving the other services unaffected. Once configured with the target partition information and other parameters it runs as a client side tool either using C# APIs or Powershell to generate faults for a service partition. The test will run to simulate faults while your business logic and validation tests run on the side to ensure the service is unaffected in the presence of these failures.

## Faults simulated in Failover test
- Restart Deployed Code Package where partition is hosted
- Remove Primary/Secondary replica or Stateless instance
- Restart Primary Secondary Replica (If persisted service)
- Move a Primary Replica
- Move a secondary Replica
- Restart the partition.

The way the Failover test works is that it will induce one chosen fault at a time and then run validation on the service to ensure it is still in a stable state. The Failover test is simplified in the sense that it will only induce one fault at a time as opposed to multiple faults (configurable) in the case of Chaos test. If after each fault the service partition does not stabilize within the configured timeout the test will fail with an exception to indicate investigation is needed. The test induces only safe faults in that the combination of failures generated will not result in quorum or data loss in the absence of any external failures.


## Important Configuration options
 - **PartitionSelector**: Selector object specifying the partition that needs to be targeted.
 - **TimeToRun**: Total time that the test will run before completing
 - **MaxServiceStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether Service Health is OK, Target replica set size achieved for all partitions and no InBuild replicas.
 - **WaitTimeBetweenFaults**: Amount of time to wait between every fault and validation cycle

## How to Run Failover Test
C# Sample
```
// Add "using System.Fabric.Testability;" to be able to see the testability classes and FabricClient operations.
// Add a reference to System.Fabric.Testability.dll.

string clusterConnection = "localhost:19000";
Uri serviceName = new Uri("fabric:/samples/PersistentToDoListApp/PersistentToDoListService");

Console.WriteLine("Starting Failover Test Scenario...");
try
{
   RunFailoverTestScenarioAsync(clusterConnection, serviceName).Wait();
}
catch (AggregateException ae)
{
   Console.WriteLine("Failover Test Scenario did not complete: ");
   foreach (Exception ex in ae.InnerExceptions)
   {
      if (ex is FabricException)
      {
         Console.WriteLine("HResult: {0} Message: {1}", ex.HResult, ex.Message);
      }
   }
   return false;
}

Console.WriteLine("Failover Test Scenario completed.");
return true;

static async Task RunFailoverTestScenarioAsync(string clusterConnection, Uri serviceName)
{
   TimeSpan maxServiceStabilizationTimeout = TimeSpan.FromSeconds(180);

   // Create FabricClient with connection & security information here.
   FabricClient fabricClient = new FabricClient(clusterConnection);

   // Select a random partition.
  PartitionSelector randomPartitionSelector = PartitionSelector.RandomOf(serviceName);

   // The Failover Test Scenario should run at least 60 minutes or up until it fails.
   TimeSpan timeToRun = TimeSpan.FromMinutes(60);
   FailoverTestScenarioParameters scenarioParameters = new FailoverTestScenarioParameters(
     randomPartitionSelector,
     maxServiceStabilizationTimeout,
     timeToRun);

   // Other related parameters:
   // Pause between concurrent actions for a random duration bound by this value.
   // scenarioParameters.WaitTimeBetweenFaults = TimeSpan.FromSeconds(10);

   // Create the scenario class and execute it asynchronously.
   FailoverTestScenario failoverScenario = new FailoverTestScenario(fabricClient, scenarioParameters);

   try
   {
      await failoverScenario.ExecuteAsync(CancellationToken.None);
   }
   catch (AggregateException ae)
   {
      throw ae.InnerException;
   }
}
```

Powershell
```
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$waitTimeBetweenFaultsSec = 10

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricFailoverTestScenario -TimeToRunMinute $timeToRun -MaxServiceStabilizationTimeoutSec $maxStabilizationTimeSecs -WaitTimeBetweenFaultsSec $waitTimeBetweenFaultsSec

```
