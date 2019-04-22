---
title: Connect to a Master Node in Azure CycleCloud | Microsoft Docs
description: Use the CycleCloud web interface and a cloud shell to log into the Master Node to submit jobs.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Master Node

To run jobs on your cluster, you must log onto the cluster's **Master** node, where the job queue resides. The SSH public key provided during setup is stored in the Azure CycleCloud application server and pushed into each cluster that you create, which allows you to use your SSH private key to log into the master node. To get the public IP address of the cluster head node, select the master node in the cluster management pane and click the **Connect** button:

![CycleCloud Master Node Connect Button](~/images/cluster-connect-button.png)

The pop-up window shows the connection string you would use to connect to the cluster:

![CycleCloud Master Node Connection Screen](~/images/connect-to-master-node.png)

Copy the appropriate string and use your SSH client or Cloud Shell to connect to the master node. After the connection is complete, you will be logged into the master node.

## Submit a Job

Check the status of the job queue with the following commands:

```azurecli-interactive
$ qstat
$ qstat -f
```
The output will list all running or queued jobs and any provisioned execute nodes:

``` output
[name@ip-0A000404 ~]$ qstat -Q
Queue              Max   Tot Ena Str   Que   Run   Hld   Wat   Trn   Ext Type
---------------- ----- ----- --- --- ----- ----- ----- ----- ----- ----- ----
workq                0     0 yes yes     0     0     0     0     0     0 Exec
[name@ip-0A000404 ~]$
```

Run any appropriate scripts to submit your job, then run the `qstat` command again to confirm the jobs were submitted.
