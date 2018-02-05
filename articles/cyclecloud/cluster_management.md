# Cluster Management

Cluster Management
==================

Clusters can be defined in a text file and imported into CycleCloud via a command line tool.
When a cluster is imported, it is in the ''Off'' state. When the cluster is started,
CycleCloud runs through the orchestration sequence for each node defined in the cluster:
it requests an instance from the cloud provider, waits for the instance to be
acquired, configures the instance as defined in the cluster template, and executes
the initialization sequence specified in the cluster-init package. When the orchestration
sequence is complete, the node is in the ''Started'' state. If an
unhandled or unknown error happens during this process, the node will be in the ''Error'' state.

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
ssh or RDP connections. The command line command ''cyclecloud connect <nodename>'' initiates an ssh
connection on Linux, or an RDP session on Windows.

Finally, terminating the cluster will stop and remove the instances and delete any non­-persistent
volumes in the cluster. Nodes that originate from a nodearray are removed, while other nodes
remain in the cluster in the Off state. Terminating is also an orchestration process, with a
status of Terminating, then Off. If there is an error during the process, that node will be marked
as Failed, and can be retried.

Creating Clusters
------------------
As stated above, clusters can be defined in a template file and created using the command line interface. Another option is to create a new cluster using the web interface. To create a new cluster, click the large **+** in the bottom left corner of the page. You will be prompted to select your cluster type from the list of Cycle-supported clusters. Once selected, you will need to enter or select a number of variables for your cluster, starting with your Cloud Provider, credentials, and region. Click **Next** to continue, or save/cancel your cluster.

On the Cluster Software screen, you will select the OS of the manager and execute region for your cluster. Use the file picker to select the Cluster-Init specification file(s) to be used. You can have more than one spec file. Enter the path of the local keypair to allow CycleCloud the access required to run your job(s).

The Compute Backend parameters allow you to select the instance types needed for your application. Use the dropdown menu to select a CM Type and Execute Type. Your cluster can also be autoscaled to add hosts as needed. Check the box to autoscale, and enter an initial and maximum core count for the cluster.

Check the box for Return Proxy on the Networking screen to have the node act as a proxy for communication from the cluster to CycleCloud. Lastly, for Azure users, select a Subnet ID for your Virtual Network Configuration. Click Save to finish the cluster creation.

Starting Clusters
------------------

Clusters are started through the web interface by clicking the “Start” button, or from the
command line with ``cyclecloud start_cluster <clustername>``. By default, all nodes defined in the
cluster template will be started, but nodearrays will only start instances if the InitialCoreCount
setting is non­-zero.

Adding and Removing Nodes
--------------------------

Using autoscale will cause the cluster to add or remove nodes from a nodearray based on the
current workload. You can also add or remove nodes manually when desired. To add
nodes to a cluster from the web interface, select the desired cluster and click the “Add” button.
Enter the desired number of nodes and the template (nodearray) and click “Add”. From the
command line, use ``cyclecloud add_nodes <clustername> -c <count> ­-t <template>`` .

To remove nodes from the web interface, select the node(s) to terminate in the Nodes tab and
click the “remove” button. To remove nodes from the command line, use ``cyclecloud
remove_node <clustername nodename>``. To remove multiple nodes, filter expressions can be
provided.

Terminating Clusters
--------------------

Terminating a cluster will terminate all instances running in that cluster. Terminated
clusters through the web interface by clicking the “Terminate" link or from the
command line with ``cyclecloud terminate_cluster <clustername>``.

Reimporting Clusters
--------------------

An existing cluster can be reimported by appending the ``--force`` argument to the command
used to import the cluster. Any configuration changes will be applied to new instances, but not
to running instances. Attributes that were previously specified in the file and are now missing will
be removed from the node definitions. Attributes that were added to nodes after the cluster was
imported will be unaffected.
