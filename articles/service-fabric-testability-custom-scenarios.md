<properties
   pageTitle="Custom Test Scenarios"
   description="How to harden your services against Graceful/Ungraceful failures"
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
   ms.date="03/17/2015"
   ms.author="anmola"/>

# Writing Custom Scenarios

Testability is a suite of tools to help you test your services. The idea is to enable developers to make their business logic resilient to failures. Service Fabric makes it easy for application authors to easily write and deploy scalable and reliable services. Even with Service Fabric your distributed application can fail due to software error or infrastructure failures. You will still need to ensure your service is functioning the right way after it is restored after a machine failure. Sometimes the Service process might fail in the middle of some operation which was not handling some corner case and on recovery your might end up in some corrupted state. Using Testability faults can help you test those scenarios. This can be done by inducing faults at different states in your application hence finding bugs and improving quality.

## Graceful and Ungraceful failures
To better understand how to test these services we need to understand the two main buckets of failures.
  + Ungraceful failures like machine restarts and process crashes.
  + Graceful failures like replica moves and drops triggered by load balancing.

To test run your service and walk through your business workload while inducing graceful and ungraceful failures. This faults should be induced while in the middle of service operations or compute for best results. 

Lets walk through an example of a serice that exposes four workloads A, B, C and D. Each corresponds to a set of workflows and could be compute, storage or a mix. For the sake of simplicity we will abstract out the workloads in our example. The different faults executed in this example are. 
  + RestartNode: Ungraceful fault to simulate a machine restart
  + RestartDeployedCodePackage: Ungraceful fault to simulate service host process crashes
  + RemoveReplica: Graceful fault to simulate replica removal
  + MovePrimary: Graceful fault to simulate replica moves triggered by Service Fabric Load Balancer
 
  ```
    public enum ServiceWorkloads
    {
        A,
        B,
        C,
        D
    }

    public enum ServiceFabricFaults
    {
        RestartNode,
        RestartCodePackage,
        RemoveReplica,
        MovePrimary,
    }
    
    public static int TestWorkloads(string clusterConnection, Uri applicationName, Uri serviceName)
        {
            Console.WriteLine("Starting Workload Test...");
            try
            {
                RunTestAsync(clusterConnection, applicationName, serviceName).Wait();
            }
            catch (AggregateException ae)
            {
                Console.WriteLine("Workload Test failed: ");
                foreach (Exception ex in ae.InnerExceptions)
                {
                    if (ex is FabricException)
                    {
                        Console.WriteLine("HResult: {0} Message: {1}", ex.HResult, ex.Message);
                    }
                }
                return -1;
            }

            Console.WriteLine("Workload Test completed successfully.");
            return 0;
        }

        public static async Task RunTestAsync(string clusterConnection, Uri applicationName, Uri serviceName)
        {
            // Create FabricClient with connection & security information here.
            FabricClient fabricClient = new FabricClient(clusterConnection);

            // Maximum time to wait for a service to stabilize
            TimeSpan maxServiceStabilizationTime = TimeSpan.FromSeconds(120);

            // How many loops of faults you want to execute
            uint testLoopCount = 20;
            Random random = new Random();

            for(var i = 0; i < testLoopCount; ++i)
            {
                var workload = SelectRandomValue<ServiceWorkloads>(random);

                // Start workload and while it is running go and induce some fault
                var workloadTask = RunWorkloadAsync(workload);

                // While task is executing induce faults into the service. It can be ungraceful faults like 
                // RestartNode and RestartDeployedCodePackage or graceful faults like RemoveReplica or MovePrimary
                var fault = SelectRandomValue<ServiceFabricFaults>(random);

                // Create a replica selector which will select a Primary replica from the given service to test
                var replicaSelector = ReplicaSelector.PrimaryOf(PartitionSelector.RandomOf(serviceName));

                // Run the selected random fault
                await RunFaultAsync(applicationName, fault, replicaSelector, fabricClient);

                // Validate the health and stability of the service.
                await fabricClient.ServiceManager.ValidateServiceAsync(serviceName, maxServiceStabilizationTime);

                // Wait for the workload to complete successfully
                await workloadTask;
            }
        }

        private static async Task RunFaultAsync(Uri applicationName, ServiceFabricFaults fault, ReplicaSelector selector, FabricClient client)
        {
            switch (fault)
            {
                case ServiceFabricFaults.RestartNode:
                    await client.ClusterManager.RestartNodeAsync(selector, CompletionMode.Verify);
                    break;
                case ServiceFabricFaults.RestartCodePackage:
                    await client.ApplicationManager.RestartDeployedCodePackageAsync(applicationName, selector, CompletionMode.Verify);
                    break;
                case ServiceFabricFaults.RemoveReplica:
                    await client.ServiceManager.RemoveReplicaAsync(selector, CompletionMode.Verify, false);
                    break;
                case ServiceFabricFaults.MovePrimary:
                    await client.ServiceManager.MovePrimaryAsync(selector.PartitionSelector);
                    break;
            }
        }

        private static Task RunWorkloadAsync(ServiceWorkloads workload)
        {
            // This is where you trigger and complete your service workload
            // Please note the faults induced while your service workload is running will
            // fault the Primary service hence you will need to reconnect to complete or check
            // the status of the workload
        }

        private static T SelectRandomValue<T>(Random random)
        {
            Array values = Enum.GetValues(typeof(T));
            T workload = (T)values.GetValue(random.Next(values.Length));
        }
```
