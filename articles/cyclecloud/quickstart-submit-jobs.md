---
title: Azure CycleCloud QuickStart - Submit and AutoScale | Microsoft Docs
description: In this quickstart, you will walk through logging into the Master node, submitting a job and observing the autoscaling behavior.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: quickstart
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud QuickStart 3: Submit and Auto Scale Jobs

If you've completed QuickStarts 1 and 2, you've installed, set up, and configured Azure CycleCloud, and started a simple HPC cluster via the GUI. This quickstart will walk you through logging into the Master node, submitting a job, and observing the autoscaling behaviour.

## Master Node

To run jobs on the standard Grid Engine cluster, you must log onto the cluster's **Master** node, where the Grid Engine job queue resides. The SSH public key you provided earlier is stored in the Azure CycleCloud application server and pushed into each cluster that you create. This allows you to use your SSH private key to log into the master node. To get the public IP address of the cluster head node, select the master node in the cluster management pane and click the **Connect** button:

![CycleCloud Master Node Connect Button](~/images/cluster-connect-button.png)

The pop-up window shows the connection string you would use to connect to the cluster:

![CycleCloud Master Node Connection Screen](~/images/connect-to-master-node.png)

Copy the appropriate string and use your SSH client or Cloud Shell to connect to the master node. After the connection is complete, you will be logged into the Grid Engine master node.

## Submit a Job

Check the status of the job queue with the following commands:

```azurecli-interactive
$ qstat
$ qstat -f
```
The output should confirm that no jobs are running and no execute nodes are provisioned:

``` output
queuename                      qtype resv/used/tot. load_avg arch          states
---------------------------------------------------------------------------------
all.q@ip-0A000404              BIP   0/0/8          0.46     linux-x64
```

Submit 100 test "hostname" jobs with:

```azurecli-interactive
qsub -t 1:100 -b y -cwd hostname
```

You should receive confirmation that the job request has been submitted:

``` output
Your job-array 1.1-100:1 ("hostname") has been submitted
```

The command you ran tells the node the following:

``` output
Submit (qsub) a task (-t) array of 1 to 100 (1:100) jobs with a binary (-b y) to run the (hostname) command in the current working directory (-cwd)
```

Confirm the jobs are in the queue with the `qstat` command.

## Auto Scale

At this point, no execute nodes have been provisioned because the cluster is configured to auto scale. The cluster will detect that the job queue has work in it, and will provision the required compute nodes to execute the jobs. By default, the system will try to provision a core of compute power for every job, but this can be customized.

In this quickstart you submitted 100 jobs, so 100 cores will be requested. Since the cluster has a scale limit of 16 in place, a maximum of 16 cores will be provisioned:

![Max Cores Setting](~/images/max-cores.png)

When the jobs are complete and the nodes are idle, the compute VMs will scale down as well.

QuickStart 3 is complete. In this exercise, you've submitted 100 jobs to your Master Node, confirmed the request went through, and observed the auto scaling via the GUI. When the jobs are complete, you will need to clean up the resources used to free them for other activity.

> [!NOTE]
> If you want to continue with this Azure CycleCloud installation for the [CycleCloud Tutorials](/tutorials/modify-cluster-template.md), you do not need to follow quickstart 4. Be aware that you are charged for usage while the nodes are running, even if no jobs are scheduled.

> [!div class="nextstepaction"]
> [Continue to Quickstart 4](quickstart-clean-up-resources.md)
