<properties
   pageTitle="Running the Chaos test."
   description="This article talks about the Chaos test and its importance."
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

# Chaos Test.

As mentioned the task of testing distributed application is not very easy. Service Fabric gives you the ability to induce fault actions to test your service business logic the face of failures but targeted simulated faults will only get you so far. To take the testing one step further we have the Chaos Test scenario which does the job of simulating continuous failures throughout the cluster over a long period of time. Once configured with the rate and kind of faults it runs as a client side tool either using C# APIs or Powershell to generate faults in the cluster and your service.

The idea here is to test your business logic in a running cluster while the Chaos test is generating failures at a rate higher than you would experience in a real world cluster. We are compressing faults you would generally run into over a period of months or years to a few hours thus hitting those hard to find corner cases much more easily and finding bugs in your service much faster.


## Faults simulated in Chaos test
 - Restart a Node
 - Restart a Deployed Code Package
 - Remove a Replicas
 - Restart a Replica
 - Move a Primary Replica (optional)
 - Move a secondary Replica (optional)

The way the Chaos test works is that it will run multiple iterations of Fault and Cluster Validations actions until the specified timeout for the test is hit. For example if the test is set to run for 1 hour and the maximum number of concurrent faults are set to 3 the test will induce 3 faults and then validate the cluster health before moving on to the next iteration up until the 1 hour time mark is hit. After each iteration of faults if the cluster does not stabilize within the configured maximum timeout then the test will fail with an exception indicating something has gone wrong and needs further investigation. In its current form the test Chaos test fault generation engine induces only safe faults in that the combination of failures generated will not result in quorum or data loss in the absence of any external failures.

## Important Configuration options
 - **TimeToRun**: Total time that the test will run before completing
 - **MaxClusterStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are Cluster Health is OK, Service Health is OK, Target replica set size achieved for all partitions and no InBuild replicas.
 - **MaxConcurrentFaults**: Maximum number of concurrent faults induced in each iteration. The higher the number the more aggressive the test hence resulting in more complex failovers and transition combinations. Even if the test is configured with a high number of concurrent faults it will only generate as many faults which when run in parallel will not cause Quorum or Data loss.
 - **EnableMoveReplicaFaults**: Enables or disables MovePrimary and MoveSecondary faults.
 - **WaitTimeBetweenIterations**: Amount of time to wait between every iteration i.e. after a round of Faults and corresponding validation.

## How to Run Chaos Test
C# Sample
```
// Add "using System.Fabric.Testability;" to be able to see the testability classes and FabricClient operations.
// Add a reference to System.Fabric.Testability.dll.

string clusterConnection = "localhost:19000";

Console.WriteLine("Starting Chaos Test Scenario...");
try
{
   RunChaosTestScenarioAsync(clusterConnection).Wait();
}
catch (AggregateException ae)
{
   Console.WriteLine("Chaos Test Scenario did not complete: ");
   foreach (Exception ex in ae.InnerExceptions)
   {
      if (ex is FabricException)
      {
         Console.WriteLine("HResult: {0} Message: {1}", ex.HResult, ex.Message);
      }
   }
   return false;
}

Console.WriteLine("Chaos Test Scenario completed.");
return true;

static async Task RunChaosTestScenarioAsync(string clusterConnection)
{
   TimeSpan maxClusterStabilizationTimeout = TimeSpan.FromSeconds(180);
   uint maxConcurrentFaults = 3;
   bool enableMoveReplicaFaults = true;

   // Create FabricClient with connection & security information here.
   FabricClient fabricClient = new FabricClient(clusterConnection);

   // The Chaos Test Scenario should run at least 60 minutes or up until it fails.
   TimeSpan timeToRun = TimeSpan.FromMinutes(60);
   ChaosTestScenarioParametersscenarioParameters = new ChaosTestScenarioParameters(
     maxClusterStabilizationTimeout,
     maxConcurrentFaults,
     enableMoveReplicaFaults,
     timeToRun);

   // Other related parameters:
   // Pause between two iterations for a random duration bound by this value.
   // scenarioParameters.WaitTimeBetweenIterations = TimeSpan.FromSeconds(30);
   // Pause between concurrent actions for a random duration bound by this value.
   // scenarioParameters.WaitTimeBetweenFaults = TimeSpan.FromSeconds(10);

   // Create the scenario class and execute it asynchronously.
   ChaosTestScenario chaosScenario = new ChaosTestScenario(fabricClient, scenarioParameters);

   try
   {
      await chaosScenario.ExecuteAsync(CancellationToken.None);
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
$concurrentFaults = 3
$waitTimeBetweenIterationsSec = 60

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricChaosTestScenario -TimeToRunMinute $timeToRun -MaxClusterStabilizationTimeoutSec $maxStabilizationTimeSecs -MaxConcurrentFaults $concurrentFaults -EnableMoveReplicaFaults -WaitTimeBetweenIterationsSec $waitTimeBetweenIterationsSec

```
