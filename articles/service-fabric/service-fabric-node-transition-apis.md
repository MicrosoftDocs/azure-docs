---
title: Start and stop cluster nodes
description: Learn how to use fault injection to test a Service Fabric application by starting and stopping cluster nodes.
author: LMWF

ms.topic: conceptual
ms.date: 6/12/2017
ms.author: lemai
---

# Replacing the Start Node and Stop node APIs with the Node Transition API

## What do the Stop Node and Start Node APIs do?

The Stop Node API (managed: [StopNodeAsync()][stopnode], PowerShell: [Stop-ServiceFabricNode][stopnodeps]) stops a Service Fabric node.  A Service Fabric node is process, not a VM or machine – the VM or machine will still be running.  For the rest of the document "node" will mean Service Fabric node.  Stopping a node puts it into a *stopped* state where it is not a member of the cluster and cannot host services, thus simulating a *down* node.  This is useful for injecting faults into the system to test your application.  The Start Node API (managed: [StartNodeAsync()][startnode], PowerShell: [Start-ServiceFabricNode][startnodeps]]) reverses the Stop Node API,  which brings the node back to a normal state.

## Why are we replacing these?

As described earlier, a *stopped* Service Fabric node is a node intentionally targeted using the Stop Node API.  A *down* node is a node that is down for any other reason (for example, the VM or machine is off).  With the Stop Node API, the system does not expose information to differentiate between *stopped* nodes and *down* nodes.

In addition, some errors returned by these APIs are not as descriptive as they could be.  For example, invoking the Stop Node API on an already *stopped* node will return the error *InvalidAddress*.  This experience could be improved.

Also, the duration a node is stopped for is “infinite” until the Start Node API is invoked.  We’ve found this can cause problems and may be error-prone.  For example, we’ve seen problems where a user invoked the Stop Node API on a node and then forgot about it.  Later, it was unclear if the node was *down* or *stopped*.


## Introducing the Node Transition APIs

We’ve addressed these issues above in a new set of APIs.  The new Node Transition API (managed: [StartNodeTransitionAsync()][snt]) may be used to transition a Service Fabric node to a *stopped* state, or to transition it from a *stopped* state to a normal up state.  Please note that the “Start” in the name of the API does not refer to starting a node.  It refers to beginning an asynchronous operation that the system will execute to transition the node to either *stopped* or started state.

**Usage**

If the Node Transition API does not throw an exception when invoked, then the system has accepted the asynchronous operation, and will execute it.  A successful call does not imply the operation is finished yet.  To get information about the current state of the operation, call the Node Transition Progress API (managed: [GetNodeTransitionProgressAsync()][gntp]) with the guid used when invoking Node Transition API for this operation.  The Node Transition Progress API returns an NodeTransitionProgress object.  This object’s State property specifies the current state of the operation.  If the state is “Running”, then the operation is executing.  If it is Completed, the operation finished without error.  If it is Faulted, there was a problem executing the operation.  The Result property’s Exception property will indicate what the issue was.  See https://docs.microsoft.com/dotnet/api/system.fabric.testcommandprogressstate for more information about the State property, and the “Sample Usage” section below for code examples.


**Differentiating between a stopped node and a down node**
If a node is *stopped* using the Node Transition API, the output of a node query (managed: [GetNodeListAsync()][nodequery], PowerShell: [Get-ServiceFabricNode][nodequeryps]) will show that this node has an *IsStopped* property value of true.  Note this is different from the value of the *NodeStatus* property, which will say *Down*.  If the *NodeStatus* property has a value of *Down*, but *IsStopped* is false, then the node was not stopped using the Node Transition API, and is *Down* due to some other reason.  If the *IsStopped* property is true, and the *NodeStatus* property is *Down*, then it was stopped using the Node Transition API.

Starting a *stopped* node using the Node Transition API will return it to function as a normal member of the cluster again.  The output of the node query API will show *IsStopped* as false, and *NodeStatus* as something that is not Down (for example, Up).


**Limited Duration**
When using the Node Transition API to stop a node, one of the required parameters, *stopNodeDurationInSeconds*, represents the amount of time in seconds to keep the node *stopped*.  This value must be in the allowed range, which has a minimum of 600, and a maximum of 14400.  After this time expires, the node will restart itself into Up state automatically.  Refer to Sample 1 below for an example of usage.

> [!WARNING]
> Avoid mixing Node Transition APIs and the Stop Node and Start Node APIs.  The recommendation is to  use the Node Transition API only.  > If a node has been already been stopped using the Stop Node API, it should be started using the Start Node API first before using the > Node Transition APIs.

> [!WARNING]
> Multiple Node Transition APIs calls cannot be made on the same node in parallel.  In such a situation, the Node Transition API will    > throw a FabricException with an ErrorCode property value of NodeTransitionInProgress.  Once a node transition on a specific node has  > been started, you should wait until the operation reaches a terminal state (Completed, Faulted, or ForceCancelled) before starting a  > new transition on the same node.  Parallel node transition calls on different nodes are allowed.


#### Sample Usage


**Sample 1** - The following sample uses the Node Transition API to stop a node.

```csharp
        // Helper function to get information about a node
        static Node GetNodeInfo(FabricClient fc, string node)
        {
            NodeList n = null;
            while (n == null)
            {
                n = fc.QueryManager.GetNodeListAsync(node).GetAwaiter().GetResult();
                Task.Delay(TimeSpan.FromSeconds(1)).GetAwaiter();
            };

            return n.FirstOrDefault();
        }

        static async Task WaitForStateAsync(FabricClient fc, Guid operationId, TestCommandProgressState targetState)
        {
            NodeTransitionProgress progress = null;

            do
            {
                bool exceptionObserved = false;
                try
                {
                    progress = await fc.TestManager.GetNodeTransitionProgressAsync(operationId, TimeSpan.FromMinutes(1), CancellationToken.None).ConfigureAwait(false);
                }
                catch (OperationCanceledException oce)
                {
                    Console.WriteLine("Caught exception '{0}'", oce);
                    exceptionObserved = true;
                }
                catch (FabricTransientException fte)
                {
                    Console.WriteLine("Caught exception '{0}'", fte);
                    exceptionObserved = true;
                }

                if (!exceptionObserved)
                {
                    Console.WriteLine("Current state of operation '{0}': {1}", operationId, progress.State);

                    if (progress.State == TestCommandProgressState.Faulted)
                    {
                        // Inspect the progress object's Result.Exception.HResult to get the error code.
                        Console.WriteLine("'{0}' failed with: {1}, HResult: {2}", operationId, progress.Result.Exception, progress.Result.Exception.HResult);

                        // ...additional logic as required
                    }

                    if (progress.State == targetState)
                    {
                        Console.WriteLine("Target state '{0}' has been reached", targetState);
                        break;
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(5)).ConfigureAwait(false);
            }
            while (true);
        }

        static async Task StopNodeAsync(FabricClient fc, string nodeName, int durationInSeconds)
        {
            // Uses the GetNodeListAsync() API to get information about the target node
            Node n = GetNodeInfo(fc, nodeName);

            // Create a Guid
            Guid guid = Guid.NewGuid();

            // Create a NodeStopDescription object, which will be used as a parameter into StartNodeTransition
            NodeStopDescription description = new NodeStopDescription(guid, n.NodeName, n.NodeInstanceId, durationInSeconds);

            bool wasSuccessful = false;

            do
            {
                try
                {
                    // Invoke StartNodeTransitionAsync with the NodeStopDescription from above, which will stop the target node.  Retry transient errors.
                    await fc.TestManager.StartNodeTransitionAsync(description, TimeSpan.FromMinutes(1), CancellationToken.None).ConfigureAwait(false);
                    wasSuccessful = true;
                }
                catch (OperationCanceledException oce)
                {
                    // This is retryable
                }
                catch (FabricTransientException fte)
                {
                    // This is retryable
                }

                // Backoff
                await Task.Delay(TimeSpan.FromSeconds(5)).ConfigureAwait(false);
            }
            while (!wasSuccessful);

            // Now call StartNodeTransitionProgressAsync() until the desired state is reached.
            await WaitForStateAsync(fc, guid, TestCommandProgressState.Completed).ConfigureAwait(false);
        }
```

**Sample 2** - The following sample starts a *stopped* node.  It uses some helper methods from the first sample.

```csharp
        static async Task StartNodeAsync(FabricClient fc, string nodeName)
        {
            // Uses the GetNodeListAsync() API to get information about the target node
            Node n = GetNodeInfo(fc, nodeName);

            Guid guid = Guid.NewGuid();
            BigInteger nodeInstanceId = n.NodeInstanceId;

            // Create a NodeStartDescription object, which will be used as a parameter into StartNodeTransition
            NodeStartDescription description = new NodeStartDescription(guid, n.NodeName, nodeInstanceId);

            bool wasSuccessful = false;

            do
            {
                try
                {
                    // Invoke StartNodeTransitionAsync with the NodeStartDescription from above, which will start the target stopped node.  Retry transient errors.
                    await fc.TestManager.StartNodeTransitionAsync(description, TimeSpan.FromMinutes(1), CancellationToken.None).ConfigureAwait(false);
                    wasSuccessful = true;
                }
                catch (OperationCanceledException oce)
                {
                    Console.WriteLine("Caught exception '{0}'", oce);
                }
                catch (FabricTransientException fte)
                {
                    Console.WriteLine("Caught exception '{0}'", fte);
                }

                await Task.Delay(TimeSpan.FromSeconds(5)).ConfigureAwait(false);

            }
            while (!wasSuccessful);

            // Now call StartNodeTransitionProgressAsync() until the desired state is reached.
            await WaitForStateAsync(fc, guid, TestCommandProgressState.Completed).ConfigureAwait(false);
        }
```

**Sample 3** - The following sample shows incorrect usage.  This usage is incorrect because the *stopDurationInSeconds* it provides is greater than the allowed range.  Since StartNodeTransitionAsync() will fail with a fatal error, the operation was not accepted, and the progress API should not be called.  This sample uses some helper methods from the first sample.

```csharp
        static async Task StopNodeWithOutOfRangeDurationAsync(FabricClient fc, string nodeName)
        {
            Node n = GetNodeInfo(fc, nodeName);

            Guid guid = Guid.NewGuid();

            // Use an out of range value for stopDurationInSeconds to demonstrate error
            NodeStopDescription description = new NodeStopDescription(guid, n.NodeName, n.NodeInstanceId, 99999);

            try
            {
                await fc.TestManager.StartNodeTransitionAsync(description, TimeSpan.FromMinutes(1), CancellationToken.None).ConfigureAwait(false);
            }

            catch (FabricException e)
            {
                Console.WriteLine("Caught {0}", e);
                Console.WriteLine("ErrorCode {0}", e.ErrorCode);
                // Output:
                // Caught System.Fabric.FabricException: System.Runtime.InteropServices.COMException (-2147017629)
                // StopDurationInSeconds is out of range ---> System.Runtime.InteropServices.COMException: Exception from HRESULT: 0x80071C63
                // << Parts of exception omitted>>
                //
                // ErrorCode InvalidDuration
            }
        }
```

**Sample 4** - The following sample shows the error information that will be returned from the Node Transition Progress API when the operation initiated by the Node Transition API is accepted, but fails later while executing.  In the case, it fails because the Node Transition API attempts to start a node that does not exist.  This sample uses some helper methods from the first sample.

```csharp
        static async Task StartNodeWithNonexistentNodeAsync(FabricClient fc)
        {
            Guid guid = Guid.NewGuid();
            BigInteger nodeInstanceId = 12345;

            // Intentionally use a nonexistent node
            NodeStartDescription description = new NodeStartDescription(guid, "NonexistentNode", nodeInstanceId);

            bool wasSuccessful = false;

            do
            {
                try
                {
                    // Invoke StartNodeTransitionAsync with the NodeStartDescription from above, which will start the target stopped node.  Retry transient errors.
                    await fc.TestManager.StartNodeTransitionAsync(description, TimeSpan.FromMinutes(1), CancellationToken.None).ConfigureAwait(false);
                    wasSuccessful = true;
                }
                catch (OperationCanceledException oce)
                {
                    Console.WriteLine("Caught exception '{0}'", oce);
                }
                catch (FabricTransientException fte)
                {
                    Console.WriteLine("Caught exception '{0}'", fte);
                }

                await Task.Delay(TimeSpan.FromSeconds(5)).ConfigureAwait(false);

            }
            while (!wasSuccessful);

            // Now call StartNodeTransitionProgressAsync() until the desired state is reached.  In this case, it will end up in the Faulted state since the node does not exist.
            // When StartNodeTransitionProgressAsync()'s returned progress object has a State if Faulted, inspect the progress object's Result.Exception.HResult to get the error code.
            // In this case, it will be NodeNotFound.
            await WaitForStateAsync(fc, guid, TestCommandProgressState.Faulted).ConfigureAwait(false);
        }
```

[stopnode]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.faultmanagementclient?redirectedfrom=MSDN
[stopnodeps]: https://msdn.microsoft.com/library/mt125982.aspx
[startnode]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.faultmanagementclient?redirectedfrom=MSDN
[startnodeps]: https://msdn.microsoft.com/library/mt163520.aspx
[nodequery]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.queryclient
[nodequeryps]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricnode
[snt]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.testmanagementclient
[gntp]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.testmanagementclient
