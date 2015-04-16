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

The Failover test scenario is a version of the Chaos test scenario targeting a specific service partition. It tests the effect of failover on a specific service partition while leaving the other services unaffected. Once configured with the target partition information and other parameters it runs as a client side tool either using C# APIs or Powershell to generate faults for a service partition. The scenario iterates through a sequence of simulated faults and service validation while your business logic run on the side to provide a workload. A failure in service validation indicates an issue that needs further investigation.

## Faults simulated in Failover test
- Restart a Deployed Code Package where partition is hosted
- Remove a Primary/Secondary replica or Stateless instance
- Restart a Primary Secondary Replica (If persisted service)
- Move a Primary Replica
- Move a secondary Replica
- Restart the partition.

Failover test works induces a chosen fault  and then runs validation on the service to ensure its stability. The Failover test only induces one fault at a time as opposed to possible multiple faults in Chaos test. If after each fault the service partition does not stabilize within the configured timeout the test fails The test induces only safe faults. This means that in absence of external failures a quorum or data loss will not occur.

## Important Configuration options
 - **PartitionSelector**: Selector object specifying the partition that needs to be targeted.
 - **TimeToRun**: Total time that the test will run before completing
 - **MaxServiceStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether Service Health is OK, Target replica set size achieved for all partitions and no InBuild replicas.
 - **WaitTimeBetweenFaults**: Amount of time to wait between every fault and validation cycle

## How to Run Failover Test
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
        Uri serviceName = new Uri("fabric:/samples/PersistentToDoListApp/PersistentToDoListService");

        Console.WriteLine("Starting Chaos Test Scenario...");
        try
        {
            RunFailoverTestScenarioAsync(clusterConnection, serviceName).Wait();
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

    static async Task RunFailoverTestScenarioAsync(string clusterConnection, Uri serviceName)
    {
        TimeSpan maxServiceStabilizationTimeout = TimeSpan.FromSeconds(180);
        PartitionSelector randomPartitionSelector = PartitionSelector.RandomOf(serviceName);

        // Create FabricClient with connection & security information here.
        FabricClient fabricClient = new FabricClient(clusterConnection);

        // The Chaos Test Scenario should run at least 60 minutes or up until it fails.
        TimeSpan timeToRun = TimeSpan.FromMinutes(60);
        FailoverTestScenarioParameters scenarioParameters = new FailoverTestScenarioParameters(
          randomPartitionSelector,
          timeToRun,
          maxServiceStabilizationTimeout);

        // Other related parameters:
        // Pause between two iterations for a random duration bound by this value.
        // scenarioParameters.WaitTimeBetweenIterations = TimeSpan.FromSeconds(30);
        // Pause between concurrent actions for a random duration bound by this value.
        // scenarioParameters.WaitTimeBetweenFaults = TimeSpan.FromSeconds(10);

        // Create the scenario class and execute it asynchronously.
        FailoverTestScenario chaosScenario = new FailoverTestScenario(fabricClient, scenarioParameters);

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
$waitTimeBetweenFaultsSec = 10
$serviceName = "fabric:/SampleApp/SampleService"

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricFailoverTestScenario -TimeToRunMinute $timeToRun -MaxServiceStabilizationTimeoutSec $maxStabilizationTimeSecs -WaitTimeBetweenFaultsSec $waitTimeBetweenFaultsSec -ServiceName $serviceName -PartitionKindSingleton

```
