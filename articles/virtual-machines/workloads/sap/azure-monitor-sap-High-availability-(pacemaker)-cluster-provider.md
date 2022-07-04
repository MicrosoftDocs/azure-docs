# **High-availability (pacemaker) cluster Provider**

## Prerequisites

Before adding providers for high-availability (pacemaker) clusters, please install appropriate agent for your environment **in each cluster node**.

For **SUSE** based clusters, ensure **ha_cluster_provider** is installed in each node. See how to install [HA cluster exporter](https://github.com/ClusterLabs/ha_cluster_exporter#installation). Supported SUSE versions: SLES for SAP 12 SP3 and above.

For **RHEL** based clusters, ensure **performance co-pilot (PCP)** and **pcp-pmda-hacluster** sub package is installed in each node. See how to install [PCP HACLUSTER agent](https://access.redhat.com/articles/6139852). Supported RHEL versions: 8.2, 8.4 and above.

> Note
 > For RHEL based pacemaker clusters, please ensure [PMProxy](https://access.redhat.com/articles/6139852) is installed in each node of cluster. 

After completing above pre-requisite installation, create a provider for each cluster node.

## Provider installation

Select Add provider from Azure Monitor for SAP solutions resource, and then:


<img width="491" alt="image" src="https://user-images.githubusercontent.com/33844181/167706257-2fa23564-cc41-4fc7-a0a2-4d6d0110f563.png">


For Type, select High-availability cluster (Pacemaker).

Configure providers for each node of cluster by entering endpoint URL in HA Cluster Exporter Endpoint. For SUSE based clusters enter http://<IP address>:9664/metrics. For RHEL based cluster, enter http://<IP address>:44322/metrics?names=ha_cluster

Enter the system ID, host name, and cluster name in the respective boxes.

> Important
  > Host name refers to actual host name in the VM. Please use "hostname -s" command for both SUSE and RHEL based clusters.

> Note
 > Ensure unique SID for each cluster

When you're finished, select Add provider. Continue to add providers as needed, or select Review + create to complete the deployment.

For SUSE based cluster


<img width="563" alt="image" src="https://user-images.githubusercontent.com/33844181/167705933-68b0b8c7-5fda-4335-90eb-3354e21c9e1d.png">


For RHEL based cluster


<img width="563" alt="image" src="https://user-images.githubusercontent.com/33844181/167706004-9e52da62-a2eb-45df-a36a-346520ea142a.png">

