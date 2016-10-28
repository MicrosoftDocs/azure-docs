<properties
   pageTitle="Induce Chaos in Service Fabric clusters | Microsoft Azure"
   description="Using Fault Injection and Cluster Analysis Service APIs to manage Chaos in the cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="motanv"
   manager="rsinha"
   editor="toddabel"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/19/2016"
   ms.author="motanv"/>

# Induce controlled Chaos in Service Fabric clusters
Large-scale distributed systems like cloud infrastructures are inherently unreliable. Azure Service Fabric enables developers to write reliable services on top of an unreliable infrastructure. To write robust services, developers need to be able to induce faults against such unreliable infrastructure to test the stability of their services.

The Fault Injection and Cluster Analysis Service (also known as the Fault Analysis Service) gives developers the ability to induce fault actions to test services. However, targeted simulated faults get you only so far. To take the testing further, you can use Chaos.

Chaos simulates continuous, interleaved faults (both graceful and ungraceful) throughout the cluster over extended periods of time. After you configure Chaos with the rate and the kind of faults, you can start or stop it through either C# APIs or PowerShell to generate faults in the cluster and your service.

While Chaos is running, it produces different events that capture the state of the run at the moment. For example, an ExecutingFaultsEvent contains all the faults that are being executed in that iteration. A ValidationFailedEvent contains the details of a failure that was found during cluster validation. You can invoke the GetChaosReportAsync API to get the report of Chaos runs.

## Faults induced in Chaos
Chaos generates faults across the entire Service Fabric cluster and compresses faults that are seen in months or years into a few hours. The combination of interleaved faults with the high fault rate finds corner cases that are otherwise missed. This Chaos exercise leads to a significant improvement in the code quality of the service.

Chaos induces faults from the following categories:

 - Restart a node
 - Restart a deployed code package
 - Remove a replica
 - Restart a replica
 - Move a primary replica (configurable)
 - Move a secondary replica (configurable)

Chaos runs in multiple iterations. Each iteration consists of faults and cluster validation for the specified period. You can configure the time spent for the cluster to stabilize and for validation to succeed. If a failure is found in cluster validation, Chaos generates and persists a ValidationFailedEvent with the UTC timestamp and the failure details.

For example, consider an instance of Chaos that is set to run for an hour with a maximum of three concurrent faults. Chaos induces three faults, and then validates the cluster health. It iterates through the previous step until it is explicitly stopped through the StopChaosAsync API or one-hour passes. If the cluster becomes unhealthy in any iteration (that is, it does not stabilize within a configured time), Chaos generates a ValidationFailedEvent. This event indicates that something has gone wrong and might need further investigation.

In its current form, Chaos induces only safe faults. This implies that, in the absence of external faults, a quorum loss or data loss never occurs.

## Important configuration options
 - **TimeToRun**: Total time that Chaos runs before it finishes with success. You can stop Chaos before it has run for the TimeToRun period through the StopChaos API.
 - **MaxClusterStabilizationTimeout**: The maximum amount of time to wait for the cluster to become healthy before checking on it again. This wait is to reduce the load on the cluster while it is recovering. The checks performed are:
    - If the cluster health is OK
    - If the service health is OK
    - If the target replica set size is achieved for the service partition
    - That no InBuild replicas exist
 - **MaxConcurrentFaults**: The maximum number of concurrent faults that are induced in each iteration. The higher the number, the more aggressive Chaos is. This results in more complex failovers and transition combinations. Chaos guarantees that, in the absence of external faults, there is no quorum loss or data loss, regardless of how high a value this configuration has.
 - **EnableMoveReplicaFaults**: Enables or disables the faults that cause the primary or secondary replicas to move. These faults are disabled by default.
 - **WaitTimeBetweenIterations**: The amount of time to wait between iterations, that is, after a round of faults and corresponding validation.
 - **WaitTimeBetweenFaults**: The amount of time to wait between two consecutive faults in an iteration.

## How to run Chaos
**C#:**

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Fabric;

using System.Diagnostics;
using System.Fabric.Chaos.DataStructures;

class Program
{
    private class ChaosEventComparer : IEqualityComparer<ChaosEvent>
    {
        public bool Equals(ChaosEvent x, ChaosEvent y)
        {
            return x.TimeStampUtc.Equals(y.TimeStampUtc);
        }

        public int GetHashCode(ChaosEvent obj)
        {
            return obj.TimeStampUtc.GetHashCode();
        }
    }

    static void Main(string[] args)
    {
        var clusterConnectionString = "localhost:19000";
        using (var client = new FabricClient(clusterConnectionString))
        {
            var startTimeUtc = DateTime.UtcNow;
            var stabilizationTimeout = TimeSpan.FromSeconds(30.0);
            var timeToRun = TimeSpan.FromMinutes(60.0);
            var maxConcurrentFaults = 3;

            var parameters = new ChaosParameters(
                stabilizationTimeout,
                maxConcurrentFaults,
                true, /* EnableMoveReplicaFault */
                timeToRun);

            try
            {
                client.TestManager.StartChaosAsync(parameters).GetAwaiter().GetResult();
            }
            catch (FabricChaosAlreadyRunningException)
            {
                Console.WriteLine("An instance of Chaos is already running in the cluster.");
            }

            var filter = new ChaosReportFilter(startTimeUtc, DateTime.MaxValue);

            var eventSet = new HashSet<ChaosEvent>(new ChaosEventComparer());

            while (true)
            {
                var report = client.TestManager.GetChaosReportAsync(filter).GetAwaiter().GetResult();

                foreach (var chaosEvent in report.History)
                {
                    if (eventSet.add(chaosEvent))
                    {
                        Console.WriteLine(chaosEvent);
                    }
                }

                // When Chaos stops, a StoppedEvent is created.
                // If a StoppedEvent is found, exit the loop.
                var lastEvent = report.History.LastOrDefault();

                if (lastEvent is StoppedEvent)
                {
                    break;
                }

                Task.Delay(TimeSpan.FromSeconds(1.0)).GetAwaiter().GetResult();
            }
        }
    }
}
```
**PowerShell:**

```powershell
$connection = "localhost:19000"
$timeToRun = 60
$maxStabilizationTimeSecs = 180
$concurrentFaults = 3
$waitTimeBetweenIterationsSec = 60

Connect-ServiceFabricCluster $connection

$events = @{}
$now = [System.DateTime]::UtcNow

Start-ServiceFabricChaos -TimeToRunMinute $timeToRun -MaxConcurrentFaults $concurrentFaults -MaxClusterStabilizationTimeoutSec $maxStabilizationTimeSecs -EnableMoveReplicaFaults -WaitTimeBetweenIterationsSec $waitTimeBetweenIterationsSec

while($true)
{
    $stopped = $false
    $report = Get-ServiceFabricChaosReport -StartTimeUtc $now -EndTimeUtc ([System.DateTime]::MaxValue)

    foreach ($e in $report.History) {

        if(-Not ($events.Contains($e.TimeStampUtc.Ticks)))
        {
            $events.Add($e.TimeStampUtc.Ticks, $e)
            if($e -is [System.Fabric.Chaos.DataStructures.ValidationFailedEvent])
            {
                Write-Host -BackgroundColor White -ForegroundColor Red $e
            }
            else
            {
                if($e -is [System.Fabric.Chaos.DataStructures.StoppedEvent])
                {
                    $stopped = $true
                }

                Write-Host $e
            }
        }
    }

    if($stopped -eq $true)
    {
        break
    }

    Start-Sleep -Seconds 1
}

Stop-ServiceFabricChaos
```
