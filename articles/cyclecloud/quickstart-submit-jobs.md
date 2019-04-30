---
title: Azure CycleCloud Quickstart - Submit and AutoScale | Microsoft Docs
description: In this quickstart, you will walk through logging into the Master node, submitting a job and observing the autoscaling behavior.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Azure CycleCloud Quickstart 3: Submit and Auto Scale Jobs

If you've completed Quickstarts 1 and 2, you've installed, set up, and configured Azure CycleCloud, and started a simple HPC cluster via the GUI. This quickstart will walk you through logging into the Master node, submitting a job, and observing the autoscaling behaviour.

## Master Node

To run jobs on the LAMMPS cluster, you must log onto the cluster's **Master** node, where the LAMMPS job queue resides. The SSH public key you provided earlier is stored in the Azure CycleCloud application server and pushed into each cluster that you create. This allows you to use your SSH private key to log into the master node. To get the public IP address of the cluster head node, select the master node in the cluster management pane and click the **Connect** button:

![CycleCloud Master Node Connect Button](~/images/cluster-connect-button.png)

The pop-up window shows the connection string you would use to connect to the cluster:

![CycleCloud Master Node Connection Screen](~/images/connect-to-master-node.png)

Copy the appropriate string and use your SSH client or Cloud Shell to connect to the master node. After the connection is complete, you will be logged into the master node.

## Submit a Job

Check the status of the job queue with the `qstat -Q` command and the provisioned execute nodes with `pbsnodes -Sa`. The output should confirm that no jobs are running and no execute nodes are provisioned:

``` output
[name@ip-00000000 ~]$ qstat -Q
Queue              Max   Tot Ena Str   Que   Run   Hld   Wat   Trn   Ext Type
---------------- ----- ----- --- --- ----- ----- ----- ----- ----- ----- ----
workq                0     0 yes yes     0     0     0     0     0     0 Exec
[name@ip-00000000 ~]$ pbsnodes -Sa
pbsnodes: Server has no node list
```

You can submit a demo LAMMPS job by running `qsub run_lammps.sh` which submits a single job that runs a dipole example. 

``` output
[name@ip-00000000 ~]$ qsub run_lammps.sh
1.ip-00000000
```

Verify that the job is now in the queue with `qstat -Q` and that execute nodes are provisioned with `pbsnodes -Sa`:

``` output
[name@ip-00000000 ~]$ qsub run_lammps.sh
1.ip-00000000
[name@ip-00000000 ~]$ qstat -Q
Queue              Max   Tot Ena Str   Que   Run   Hld   Wat   Trn   Ext Type
---------------- ----- ----- --- --- ----- ----- ----- ----- ----- ----- ----
workq                0     1 yes yes     1     0     0     0     0     0 Exec
[name@ip-00000000 ~]$ pbsnodes -Sa
vnode           state           OS       hardware host            queue        mem     ncpus   nmics   ngpus  comment
--------------- --------------- -------- -------- --------------- ---------- -------- ------- ------- ------- ---------
ip-0000000A     job-busy        --       --       ip-0000000a     --              4gb       2       0       0 --
ip-0000000B     job-busy        --       --       ip-0000000b     --              4gb       2       0       0 --
```

## Auto Scale

Until this point, no execute nodes have been provisioned because the cluster is configured to auto scale. The cluster will detect that the job queue has work in it, and will provision the required compute nodes to execute the jobs. CycleCloud will not provision more cores than the limit set on the cluster's autoscaling settings. In this case, the sample job contains 1000 tasks, but CycleCloud will only provision up to 100 cores worth of virtual machines.

Return to the web interface to see the execute nodes being provisioned. After provisioning, the status bars will turn green and the job's tasks will start running. For non-tightly coupled jobs, where the individual tasks can independently execute, jobs will start running as soon as any VM is ready. For tightly coupled jobs (i.e. MPI jobs), jobs will not start executing until every VM associated with the jobs is ready.

Verify that the job is complete by running `qstat -Q` in your shell periodically. The Queued column (Que) should be 0, indicating that no more jobs are awaiting execution. In this quickstart, jobs typically finish in a minute or two.

Once the job queue has been empty for five minutes, the execute nodes will begin to auto-stop and your cluster will return to just having the master node.

Quickstart 3 is complete. In this exercise, you've submitted a job containing 1000 tasks to your Master Node, confirmed the request went through, and observed the auto scaling via the GUI. When the jobs are complete, you will need to clean up the resources used to free them for other activity.

> [!NOTE]
> If you want to continue with this Azure CycleCloud installation for the [CycleCloud Tutorials](/tutorials/modify-cluster-template.md), you do not need to follow quickstart 4. Be aware that you are charged for usage while the nodes are running, even if no jobs are scheduled.

> [!div class="nextstepaction"]
> [Continue to Quickstart 4](quickstart-clean-up-resources.md)
