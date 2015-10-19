<properties
   pageTitle="Running the Chaos test."
   description="This article talks about the pre-canned service fabric scenarios shipped by Microsoft."
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
   ms.date="08/26/2015"
   ms.author="anmola"/>

# Testability Scenarios
Large distributed systems like cloud infrastructures are inherently unreliable. Service Fabric provides developers the ability to write services to run on top of unreliable infrastructures. In order to write high quality services, developers need to be able to induce such unreliable infrastructure to test the stability of their services. Service Fabric gives developers the ability to induce fault actions to test services in presence of failures. However, targeted simulated faults will only get you so far. To take the testing further Service Fabric ships pre-canned test scenarios. The scenarios simulate continuous interleaved faults, both graceful and ungraceful, throughout the cluster over extended periods of time. Once configured with the rate and kind of faults, it runs as a client side tool, through either C# APIs or PowerShell to generate faults in the cluster and your service. As part of the testability feature we ship the following scenarios.

1.	Chaos Test
2.	Failover Test

## Chaos Test
The chaos scenario generates faults across the entire service fabric cluster. The scenario compresses faults generally seen in months or years to a few hours. The combination of interleaved faults with the high fault rate finds corner cases which are otherwise missed. This leads to a significant improvement in the code quality of the service.

### Faults simulated in Chaos test
 - Restart of a Node
 - Restart of a Deployed Code Package
 - Remove of a Replicas
 - Restart of a Replica
 - Move of a Primary Replica (optional)
 - Move of a secondary Replica (optional)

Chaos test runs multiple iterations of faults and cluster validations for the specified period of time. The time spent for the cluster to stabilize and validation to succeed is also configurable. The scenario fails when we hit a single failure in cluster validation. For example, consider a test set to run for 1 hour and with maximum 3 concurrent faults. The test will induce 3 faults, then validate the cluster health. The test will iterate through the previous step till cluster becomes unhealthy or 1 hour passes. If in any iteration the cluster becomes unhealthy, i.e. not stabilize within a configured time, the test will fail with an exception. This exception indicates something has gone wrong and needs further investigation. In its current form the test Chaos test fault generation engine induces only safe faults. This means that in absence of external faults a quorum or data loss will never occur.

### Important configuration options
 - **TimeToRun**: Total time that the test will run before completing with success. The test can complete earlier in lieu of a validation failure.
 - **MaxClusterStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether Cluster Health is OK, whether Service Health is OK, Target replica set size achieved for service partition and no InBuild replicas.
 - **MaxConcurrentFaults**: Maximum number of concurrent faults induced in each iteration. The higher the number the more aggressive the test hence resulting in more complex failovers and transition combinations. The test guarantees that in absence of external faults there will not be a quorum or data loss, irrespective of how high this configuration is.
 - **EnableMoveReplicaFaults**: Enables or disables the faults causing the move of the primary or secondary replicas. These faults are disabled by default.
 - **WaitTimeBetweenIterations**: Amount of time to wait between iterations i.e. after a round of Faults and corresponding validation.

### How to run Chaos Test
C# Sample

```csharp
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

```powershell
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$concurrentFaults = 3
$waitTimeBetweenIterationsSec = 60

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricChaosTestScenario -TimeToRunMinute $timeToRun -MaxClusterStabilizationTimeoutSec $maxStabilizationTimeSecs -MaxConcurrentFaults $concurrentFaults -EnableMoveReplicaFaults -WaitTimeBetweenIterationsSec $waitTimeBetweenIterationsSec
```


## Failover test

The Failover test scenario is a version of the Chaos test scenario targeting a specific service partition. It tests the effect of failover on a specific service partition while leaving the other services unaffected. Once configured with the target partition information and other parameters it runs as a client side tool either using C# APIs or Powershell to generate faults for a service partition. The scenario iterates through a sequence of simulated faults and service validation while your business logic run on the side to provide a workload. A failure in service validation indicates an issue that needs further investigation.

### Faults simulated in Failover test
- Restart a Deployed Code Package where partition is hosted
- Remove a Primary/Secondary replica or Stateless instance
- Restart a Primary Secondary Replica (If persisted service)
- Move a Primary Replica
- Move a secondary Replica
- Restart the partition.

Failover test works induces a chosen fault  and then runs validation on the service to ensure its stability. The Failover test only induces one fault at a time as opposed to possible multiple faults in Chaos test. If after each fault the service partition does not stabilize within the configured timeout the test fails The test induces only safe faults. This means that in absence of external failures a quorum or data loss will not occur.

### Important configuration options
 - **PartitionSelector**: Selector object specifying the partition that needs to be targeted.
 - **TimeToRun**: Total time that the test will run before completing
 - **MaxServiceStabilizationTimeout**: Max amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether Service Health is OK, Target replica set size achieved for all partitions and no InBuild replicas.
 - **WaitTimeBetweenFaults**: Amount of time to wait between every fault and validation cycle

### How to run Failover test
C# Sample

```csharp
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

```powershell
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$waitTimeBetweenFaultsSec = 10
$serviceName = "fabric:/SampleApp/SampleService"

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricFailoverTestScenario -TimeToRunMinute $timeToRun -MaxServiceStabilizationTimeoutSec $maxStabilizationTimeSecs -WaitTimeBetweenFaultsSec $waitTimeBetweenFaultsSec -ServiceName $serviceName -PartitionKindSingleton
```

 
