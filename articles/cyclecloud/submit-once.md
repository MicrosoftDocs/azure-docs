---
title: Azure CycleCloud Submit Once Overview | Microsoft Docs
description: Overview and prerequisites for the Submit Once tool in Azure CycleCloud.
author: KimliW
ms.technology: submitonce
ms.date: 08/01/2018
ms.author: adjohnso
---

# SubmitOnce

High performance computing clusters are incredibly powerful tools which enable revolutionary software.
Because of this, many organizations are looking to increase the utilization of their existing clusters
and/or expand their clusters into the cloud. SubmitOnce assists with both of these things. If you have more than one physical cluster, SubmitOnce can route jobs to where the free resources are. Whether you have one small cluster, or a dozen spread out all over the globe, SubmitOnce can augment the capabilities of your physical hardware by sending jobs to [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/).

The SubmitOnce architecture helps you by stitching together multiple disparate computing environments.
At job submission time, a job routing decision is made by the system. If needed, data is transferred to the remote cluster. Jobs are submitted across clusters transparently to the end-user or submitting process. Resulting output data is brought back to the local environment. The end result is a workload which has been completed in the optimal amount of time when considering all available resources.

## Prerequisites

Before installing and configuring SubmitOnce, please verify that your HPC environment has the following characteristics:

1.  At least one server dedicated to running CycleServer. Server should have a minimum of:

      - 2 dedicated CPUs
      - 8 GB dedicated RAM
      - 20 GB of hard-drive space

2. A functional user account (generally with username = "cycle_server") which exists on all
   clusters.

3. A shared filesystem per cluster, mounted by all submitters and all execute hosts in that cluster.

   - This filesystem will be used to share all job data with each execute host.

4. User home directories available on all submitters and preferably all execute hosts.

5. Key-based SSH access (passwordless) for the cycle_server user to a submit host in each cluster.

6. Grid Engine Submitters should have read access to the Grid Engine accounting file.

7. *Either:*

   - A common directory on the shared filesystem of all clusters owned by the functional user
     account (cycle_server by default) and world readable (see: $SO_HOME in Installation and Configuration), **OR**
   - At least one execute slot on the Submitter host and the "slot_type=master" complex
     applied to that host.
