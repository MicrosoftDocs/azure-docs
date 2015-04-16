<properties
   pageTitle="Running the Chaos test."
   description="This article talks about the Chaos test and its importance."
   services="service-fabric"
   documentationCenter=".net"
   authors="anmolah"
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

As mentioned before, the task of testing distributed applications is inherently complex. Service Fabric provides the ability to induce faults to test your service business logic the face of faults. However, targeted simulated faults only get you so far. To take the testing one step further we ship the Chaos Test scenario. This scenario simulates continuous interleaved faults throughout the cluster over extended periods of time. Once configured with the rate and kind of faults it runs as a client side tool either using C# APIs or Powershell to generate faults in the cluster hosting your service.

The chaos scenario compresses faults generally seen in months or years to a few hours. The combination of interleaved faults with the high fault rate generates hard to find corner cases. This leads to a significant improvement in the code quality of the service.

## Faults simulated in Chaos test
 - Restart of a Node
 - Restart of a Deployed Code Package
 - Remove of a Replicas
 - Restart of a Replica
 - Move of a Primary Replica (optional)
 - Move of a secondary Replica (optional)

Chaos test runs multiple iterations of faults and cluster validations for the specified period of time. The time spent for the cluster to stabilize and validation to succeed is also configurable. The scenario fails when we hit a single failure in cluster validation. For example, consider a test set to run for 1 hour and with maximum 3 concurrent faults. The test will induce 3 faults, then validate the cluster health. The test will iterate through the previous step till cluster becomes unhealthy or 1 hour passes. If in any iteration the cluster becomes unhealthy, i.e. not stabilize within a configured time, the test will fail with an exception. This exception indicates something has gone wrong and needs further investigation. In its current form the test Chaos test fault generation engine induces only safe faults. This means that in absence of external faults a quorum or data loss will never occur.

## Important Configuration options
 - **TimeToRun**: Total time that the test will run before completing with success. The test can complete earlier in lieu of a validation failure.
 - **MaxClusterStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether Cluster Health is OK, whether Service Health is OK, Target replica set size achieved for service partition and no InBuild replicas.
 - **MaxConcurrentFaults**: Maximum number of concurrent faults induced in each iteration. The higher the number the more aggressive the test hence resulting in more complex failovers and transition combinations. The test guarantees that in absence of external faults there will not be a quorum or data loss, irrespective of how high this configuration is.
 - **EnableMoveReplicaFaults**: Enables or disables the faults causing the move of the primary or secondary replicas. These faults are disabled by default.
 - **WaitTimeBetweenIterations**: Amount of time to wait between iterations i.e. after a round of Faults and corresponding validation.

## How to Run Chaos Test
C# Sample
```C#
// Add a reference to System.Fabric.Testability.dll and System.Fabric.dll.

using System;
using System.Fabric;
using System.Fabric.Testability;
using System.Fabric.Testability.Scenario;
using System.Threading;
using System.Threading.Tasks;

class Test
{
    public static int Main(string[] args)
    {
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
            return -1;
        }

        Console.WriteLine("Chaos Test Scenario completed.");
        return 0;
    }

    static async Task RunChaosTestScenarioAsync(string clusterConnection)
    {
        TimeSpan maxClusterStabilizationTimeout = TimeSpan.FromSeconds(180);
        uint maxConcurrentFaults = 3;
        bool enableMoveReplicaFaults = true;

        // Create FabricClient with connection & security information here.
        FabricClient fabricClient = new FabricClient(clusterConnection);

        // The Chaos Test Scenario should run at least 60 minutes or up until it fails.
        TimeSpan timeToRun = TimeSpan.FromMinutes(60);
        ChaosTestScenarioParameters scenarioParameters = new ChaosTestScenarioParameters(
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
}
```

Powershell
```Powershell
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$concurrentFaults = 3
$waitTimeBetweenIterationsSec = 60

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricChaosTestScenario -TimeToRunMinute $timeToRun -MaxClusterStabilizationTimeoutSec $maxStabilizationTimeSecs -MaxConcurrentFaults $concurrentFaults -EnableMoveReplicaFaults -WaitTimeBetweenIterationsSec $waitTimeBetweenIterationsSec

```
