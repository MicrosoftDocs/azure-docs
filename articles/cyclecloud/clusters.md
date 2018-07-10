# Clusters

A *cluster* is a group of connected computers (*nodes*) working together as one unit. Within a cluster, multiple nodes are set to perform the same task. The how, what, when, and where of the task is controlled by software like Azure CycleCloud.

Azure CycleCloud comes with a set of pre-installed templates that can used with the GUI. You can also create clusters by importing a *cluster template* into CycleCloud using the CLI.

## Further Reading

* Create a [Cluster Template](https://docs.microsoft.com/en-us/azure/cyclecloud/cluster-templates)
* [Start a Cluster](https://docs.microsoft.com/en-us/azure/cyclecloud/start-cluster)
* [Auto Scaling](https://docs.microsoft.com/en-us/azure/cyclecloud/autoscale)
* [Terminate a Cluster](https://docs.microsoft.com/en-us/azure/cyclecloud/end-cluster)

# Nodes and Node Arrays

A *node* is a single machine or virtual machine. A *node array* is a collection of nodes with the same configuration, and can be automatically or manually scaled to pre-defined limits using `MaxCount` (limits the number of instances to start) and `MaxCoreCount` (limits the number of cores started).

These maximums are hard limits, meaning no nodes will be started at any time outside the constraints defined.

To get the capacity needed for your job, node arrays can span multiple machine types and availability zones. When an array is scaled up, instances are chosen from the set of listed machine types and zones. CycleCloud will attempt to spin up instances across all possibilities that match your need, and as it gets "out-of-capacity" results from the cloud provider, it automatically shifts to your machine-type/zone combinations that are currently providing instances. If it is unable to get all the instances requested, it will periodically cycle through all combinations (including ones that were previously unavailable) in an attempt to get sufficient capacity.

The machine types and zones (or subnets) specified are considered to all be of equal acceptability,
and CycleCloud will distribute requests across all of them.

## Further Reading

* [Node Configuration Reference](https://docs.microsoft.com/en-us/azure/cyclecloud/node-configuration-reference)
