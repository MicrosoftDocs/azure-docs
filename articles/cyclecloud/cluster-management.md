# Clusters

Cluster Definition goes here


Clusters can be defined in a text file and imported into CycleCloud via a command line tool.
When a cluster is imported, it is in the `Off` state. When the cluster is started,
CycleCloud runs through the orchestration sequence for each node defined in the cluster:
it requests an instance from the cloud provider, waits for the instance to be
acquired, configures the instance as defined in the cluster template, and executes
the initialization sequence specified in the cluster-init package. When the orchestration
sequence is complete, the node is in the `Started` state. If an
unhandled or unknown error happens during this process, the node will be in the `Error` state.

There are several intermediate states a node can be in while being started, so the progress is
summarized as one of the following Status groups:

- *Off* (gray): No instance is active or being acquired.
- *Acquiring* (yellow): The instance is being requested from the cloud provider.
- *Preparing* (blue): The instance is being configured.
- *Ready* (green): The instance is up and running.
- *Failed* (red): An orchestration phase has failed during starting or terminating the node.

Most cloud providers will not start billing you for an instance while it is being acquired.
If an instance that meets your requirements is not available, you may wait indefinitely for
one to be provisioned. For example, a request for an instance with a very low bid price for
AWS spot instances may never be fulfilled. Billing for resources typically begins when the instance
enters the “Preparing” phase, while CycleCloud is installing your software and configuring the
instance to run your workloads.

If a node encounters an error during orchestration and has failed, the error will be logged in
the event log on the Clusters page. You can retry the operation, or edit your node settings.

Clusters imported with the command line tool are immediately available as resources in CycleCloud.
The CycleCloud command line tool also supports importing clusters as templates that may be used to
create additional clusters through the web interface.

You may log on to a node that is in the “Preparing” or “Ready” phase. CycleCloud provides two convenient
methods to connect to instances: the “Connect” button on the Nodes tab in the web interface, and via the
command line tool. From the web user interface, the “Connect” button displays instructions on initiating
ssh or RDP connections. The command line command `cyclecloud connect <nodename>` initiates an ssh
connection on Linux, or an RDP session on Windows.

Finally, terminating the cluster will stop and remove the instances and delete any non­-persistent
volumes in the cluster. Nodes that originate from a nodearray are removed, while other nodes
remain in the cluster in the Off state. Terminating is also an orchestration process, with a
status of Terminating, then Off. If there is an error during the process, that node will be marked
as Failed, and can be retried.

# Nodes and Node Arrays

What's a Node

What's a Node Array

How does it relate to Azure

Here's the Node Reference
