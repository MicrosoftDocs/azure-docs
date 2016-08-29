<properties
   pageTitle="Chaos and failover tests | Microsoft Azure"
   description="Using the Service Fabric chaos test and failover test scenarios to induce faults and verify the reliability of your services."
   services="service-fabric"
   documentationCenter=".net"
   authors="motanv"
   manager="timlt"
   editor="toddabel"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/08/2016"
   ms.author="motanv"/>

# Testability scenarios
Large distributed systems like cloud infrastructures are inherently unreliable. Azure Service Fabric gives developers the ability to write services to run on top of unreliable infrastructures. In order to write high-quality services, developers need to be able to induce such unreliable infrastructure to test the stability of their services.

The Fault Analysis Service gives developers the ability to induce fault actions to test services in the presence of failures. However, targeted simulated faults will get you only so far. To take the testing further, you can use the test scenarios in Service Fabric: a chaos test and a failover test. These scenarios simulate continuous interleaved faults, both graceful and ungraceful, throughout the cluster over extended periods of time. Once a test is configured with the rate and kind of faults, it can be started through either C# APIs or PowerShell, to generate faults in the cluster and your service.

## Chaos test
The chaos scenario generates faults across the entire Service Fabric cluster. The scenario compresses faults generally seen in months or years to a few hours. The combination of interleaved faults with the high fault rate finds corner cases that are otherwise missed. This leads to a significant improvement in the code quality of the service.

### Faults simulated in the chaos test
 - Restart a node
 - Restart a deployed code package
 - Remove a replica
 - Restart a replica
 - Move a primary replica (optional)
 - Move a secondary replica (optional)

The chaos test runs multiple iterations of faults and cluster validations for the specified period of time. The time spent for the cluster to stabilize and for validation to succeed is also configurable. The scenario fails when you hit a single failure in cluster validation.

For example, consider a test set to run for one hour with a maximum of three concurrent faults. The test will induce three faults, and then validate the cluster health. The test will iterate through the previous step till the cluster becomes unhealthy or one hour passes. If the cluster becomes unhealthy in any iteration, i.e. it does not stabilize within a configured time, the test will fail with an exception. This exception indicates that something has gone wrong and needs further investigation.

In its current form, the fault generation engine in the chaos test induces only safe faults. This means that in the absence of external faults, a quorum or data loss will never occur.

### Important configuration options
 - **TimeToRun**: Total time that the test will run before finishing with success. The test can finish earlier in lieu of a validation failure.
 - **MaxClusterStabilizationTimeout**: Maximum amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether cluster health is OK, service health is OK, the target replica set size is achieved for the service partition, and no InBuild replicas exist.
 - **MaxConcurrentFaults**: Maximum number of concurrent faults induced in each iteration. The higher the number, the more aggressive the test, hence resulting in more complex failovers and transition combinations. The test guarantees that in absence of external faults there will not be a quorum or data loss, irrespective of how high this configuration is.
 - **EnableMoveReplicaFaults**: Enables or disables the faults that are causing the move of the primary or secondary replicas. These faults are disabled by default.
 - **WaitTimeBetweenIterations**: Amount of time to wait between iterations, i.e. after a round of faults and corresponding validation.

### How to run the chaos test
C# sample

```csharp
using System;
using System.Fabric;
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

        // Create FabricClient with connection and security information here.
        FabricClient fabricClient = new FabricClient(clusterConnection);

        // The chaos test scenario should run at least 60 minutes or until it fails.
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

PowerShell

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

The failover test scenario is a version of the chaos test scenario that targets a specific service partition. It tests the effect of failover on a specific service partition while leaving the other services unaffected. Once it's configured with the target partition information and other parameters, it runs as a client-side tool that uses either C# APIs or PowerShell to generate faults for a service partition. The scenario iterates through a sequence of simulated faults and service validation while your business logic runs on the side to provide a workload. A failure in service validation indicates an issue that needs further investigation.

### Faults simulated in the failover test
- Restart a deployed code package where the partition is hosted
- Remove a primary/secondary replica or stateless instance
- Restart a primary secondary replica (if a persisted service)
- Move a primary replica
- Move a secondary replica
- Restart the partition

The failover test induces a chosen fault and then runs validation on the service to ensure its stability. The failover test induces only one fault at a time, as opposed to possible multiple faults in the chaos test. If the service partition does not stabilize within the configured timeout after each fault, the test fails. The test induces only safe faults. This means that in absence of external failures, a quorum or data loss will not occur.

### Important configuration options
 - **PartitionSelector**: Selector object that specifies the partition that needs to be targeted.
 - **TimeToRun**: Total time that the test will run before finishing.
 - **MaxServiceStabilizationTimeout**: Maximum amount of time to wait for the cluster to become healthy before failing the test. The checks performed are whether service health is OK, the target replica set size is achieved for all partitions, and no InBuild replicas exist.
 - **WaitTimeBetweenFaults**: Amount of time to wait between every fault and validation cycle.

### How to run the failover test

**C#**

```csharp
using System;
using System.Fabric;
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

        // Create FabricClient with connection and security information here.
        FabricClient fabricClient = new FabricClient(clusterConnection);

        // The chaos test scenario should run at least 60 minutes or until it fails.
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
}
```


**PowerShell**

```powershell
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$waitTimeBetweenFaultsSec = 10
$serviceName = "fabric:/SampleApp/SampleService"

Connect-ServiceFabricCluster $connection

Invoke-ServiceFabricFailoverTestScenario -TimeToRunMinute $timeToRun -MaxServiceStabilizationTimeoutSec $maxStabilizationTimeSecs -WaitTimeBetweenFaultsSec $waitTimeBetweenFaultsSec -ServiceName $serviceName -PartitionKindSingleton
```
