---
title: Azure CycleCloud Quickstart - Submit and AutoScale | Microsoft Docs
description: In this quickstart, you will walk through logging into the Master node, submitting a job and observing the autoscaling behavior.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: quickstart
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud Quickstart 3: Submit and Auto Scale Jobs

If you've completed Quickstarts 1 and 2, you've installed, set up, and configured Azure CycleCloud, and started a simple HPC cluster via the GUI. This quickstart will walk you through logging into the Master node, submitting a job, and observing the autoscaling behaviour.

## Master Node

To run jobs on the standard Grid Engine cluster, you must log onto the cluster's "Master" node, where the Grid Engine job queue resides. There are two ways to connect to that VM:

1. Connect using the CycleCloud CLI, which is installed on the CycleCloud VM, or
2. SSH using the private key `cyclecloud.pem`, which is specified during the cluster creation

For this QuickStart, you will use the first method to connect to your cluster Master's node.

## Connect to the CycleCloud VM

SSH into the CycleCloud VM with the `cycleadmin` user and the SSH key created in QuickStart 1:

``` CLI
$ ssh -i ${SSH PRIVATE KEY} cycleadmin@${CycleCloudFQDN}
```

### Connect from Windows via Putty

## Connect to the Master Node

Connecting to the Grid Engine master node uses both the GUI and the CLI.

1. From within the GUI, click on **connect** to get the connection information. You will get a connection string similar to the following, but with your cluster name:

``` CLI
[cycleadmin@cycleserver ~]$ cyclecloud connect master -c cc-intro-training
```

2. Execute the command within the CycleCloud CLI.

You're now logged into the Grid Engine master node.

## Submit a Job

Check the status of the job queue with the following commands:

``` CLI
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

``` CLI
$ qsub -t 1:100 -b y -cwd hostname
```

You should receive confirmation that the job request has been submitted:

``` output
Your job-array 1.1-100:1 ("hostname") has been submitted
```

The command you ran, `$ qsub -t 1:100 -b y -cwd hostname`, tells the node the following:

``` output
Submit (qsub) a task (-t) array of 1 to 100 (1:100) jobs with a binary (-b y) to run the (hostname) command in the current working directory (-cwd)
```

Confirm the jobs are in the queue with the `qstat` command.

## Auto Scale

At this point, no execute nodes have been provisioned because the cluster is configured to auto scale. The cluster will detect that the job queue has work in it, and will provision the required compute nodes to execute the jobs. By default, the system will try to provision a core of compute power for every job, but this can be changed.

In our quickstart, you submitted 100 jobs. 100 cores will be requested, but the cluster has a scale limit of 16 in place, meaning no more than 16 cores will be provisioned:

[//]: # (kimli screenshot)

When the jobs are complete and the nodes are idle, the compute VMs will scale down as well.

Quickstart 3 is complete. In this exercise, you've submitted 100 jobs to your Master Node, confirmed the request went through, and observed the auto scaling via the GUI. When the jobs are complete, you will need to clean up the resources used to free them for other activity. Continue on to [Quickstart 4](quickstart-clean-up-resources.md) now!
