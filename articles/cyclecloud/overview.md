---
title: Overview
description: In this overview, learn about Azure CycleCloud, an enterprise-friendly tool to orchestrate and manage High Performance Computing (HPC) environments on Azure.
author: jermth
ms.date: 06/13/2025
ms.author: jechia
---

# What is Azure CycleCloud?

Azure CycleCloud is an enterprise-friendly tool for orchestrating and managing High Performance Computing (HPC) environments on Azure. With CycleCloud, users can provision infrastructure for HPC systems, deploy familiar HPC schedulers, and automatically scale the infrastructure to run jobs efficiently at any scale. Through CycleCloud, users can create different types of file systems and mount them to the compute cluster nodes to support HPC workloads.

Azure CycleCloud is for HPC admins and users who want to set up an HPC environment with a specific scheduler. It supports popular schedulers like Slurm, PBSPro, LSF, Grid Engine, and HT-Condor. CycleCloud is the sister product to [Azure Batch](/azure/batch/batch-technical-overview), which provides a Scheduler as a Service on Azure.

See [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/) for information about how CycleCloud compares against other Azure HPC solutions.

> [!VIDEO https://www.youtube.com/embed/qkiGJWGM6Ew]

## Why Should I Use Azure CycleCloud?

Organizations with long-standing HPC environments often build deep expertise and custom tools around a specific scheduler. Moving or redesigning these setups on Azure can feel overwhelming. CycleCloud abstracts away the basic Azure building blocks such as virtual machines (VMs), scalesets, network interfaces, and disks thereby, allowing an HPC administrator to focus on the familiar: an HPC cluster comprising nodes and a configurable scheduler of choice.

CycleCloud adds autoscaling plugins to supported schedulers. This means users don’t need to build complex autoscaling routines—they just work with the scheduler settings they already know.

With a rich, declarative, templating format, CycleCloud provides powerful tooling to construct complete HPC environments on Azure. Users can deploy environments that include NFS servers, parallel file systems, login hosts, license servers, and directory services--essentially all the components needed in an HPC system--through a single management plane.

CycleCloud integrates with Azure services such as [Azure Monitor](/azure/azure-monitor/overview) and [Azure Cost Management tools](/azure/cost-management/overview-cost-mgt).

![Overview Intro](~/articles/cyclecloud/images/overview-gui.png)

### CycleCloud Capabilities

::: moniker range="=cyclecloud-7"

|Capability|Image|
|---|---|
| [**Scheduler Agnostic**](./concepts/scheduling.md)<br>Use standard HPC schedulers such as Slurm, PBS Pro, LSF, Grid Engine, and HTCondor, or extend CycleCloud autoscaling plugins to work with your own scheduler  | ![Schedulers sample](./images/version-7/overview-schedulers-tn.png)  |
| [**Manage Compute Resources**](./how-to/start-cluster.md)<br>Manage virtual machines and scale sets to provide a flexible set of compute resources that can meet your dynamic workload requirements | ![Compute resources sample](./images/overview-nodes-tn.png) |
| [**Autoscale Resources**](./concepts/scheduling.md)<br>Automatically adjust cluster size and components based upon job load, availability, and time requirements | ![Autoscale sample](./images/overview-scaling-tn.png) |
| [**Monitor and Analyze**](./concepts/monitoring.md)<br>Collect and analyze performance data using visualization tools | ![Monitor sample](./images/overview-monitor-tn.png) |
| [**Template Clusters**](./download-cluster-templates.md)<br>Use CycleCloud templates to share cluster topologies with the community | ![Template sample](./images/overview-github-tn.png) |
| [**Customize and Extend Functionality**](./api.md)<br>Use the comprehensive RESTful API to customize and extend functionality, deploy your own scheduler, and support into existing workload managers | ![REST sample](./images/overview-rest-tn.png) |
| [**Integrate into Existing Workflows**](./how-to/install-cyclecloud-cli.md)<br>Integrate into existing workflows and tools using the built-in CLI | ![CLI sample](./images/overview-cli-tn.png) |

::: moniker-end

::: moniker range=">=cyclecloud-8"

|Capability|Image|
|---|---|
| [**Scheduler Agnostic**](./concepts/scheduling.md)<br>Use standard HPC schedulers such as Slurm, PBS Pro, LSF, Grid Engine, and HTCondor, or extend CycleCloud autoscaling plugins to work with your own scheduler  | ![Schedulers sample](./images/version-8/overview-schedulers-tn.png)  |
| [**Manage Compute Resources**](./how-to/start-cluster.md)<br>Manage virtual machines and scale sets to provide a flexible set of compute resources that can meet your dynamic workload requirements | ![Compute resources sample](./images/overview-nodes-tn.png) |
| [**Autoscale Resources**](./concepts/scheduling.md)<br>Automatically adjust cluster size and components based upon job load, availability, and time requirements | ![Autoscale sample](./images/overview-scaling-tn.png) |
| [**Monitor and Analyze**](./concepts/monitoring.md)<br>Collect and analyze performance data using visualization tools | ![Monitor sample](./images/overview-monitor-tn.png) |
| [**Template Clusters**](./download-cluster-templates.md)<br>Use CycleCloud templates to share cluster topologies with the community | ![Template sample](./images/overview-github-tn.png) |
| [**Customize and Extend Functionality**](./api.md)<br>Use the comprehensive RESTful API to customize and extend functionality, deploy your own scheduler, and support into existing workload managers | ![REST sample](./images/overview-rest-tn.png) |
| [**Integrate into Existing Workflows**](./how-to/install-cyclecloud-cli.md)<br>Integrate into existing workflows and tools using the built-in CLI | ![CLI sample](./images/overview-cli-tn.png) |

::: moniker-end

## How Do I Use Azure CycleCloud?

Azure CycleCloud is an installable web application that you can run on premise or in an Azure VM. Once installed, CycleCloud can be configured to use compute and data resources in your prepared Azure subscription. CycleCloud provides a number of official cluster templates for schedulers (PBSPro, LSF, Grid Engine, Slurm, HTCondor), and filesystems (NFS, BeeGFS). Cluster templates provided by the CycleCloud community are also available. You can use these cluster templates unmodified or you can customize them for your specific needs.

Once a cluster is created, it's automatically configured to autoscale by default to handle the computational jobs that are submitted to the scheduler. CycleCloud administrative features govern access to the CycleCloud cluster for other users in your organization.

Tooling with templates and configuration scripts lets you quickly build complex HPC environments and replicate these setups for different teams across your organization.

[//]: # (## What cluster types are available?)

## What CycleCloud is Not?

There's no job scheduling functionality in CycleCloud. In other words, CycleCloud isn't a scheduler, but rather a platform that enables users to deploy their own scheduler into Azure. CycleCloud comes with built-in support for a number of commonly used schedulers (PBSPro, Slurm, IBM LSF, Grid Engine, and HTCondor), but CycleCloud users frequently implement their own scheduler on top of the provided autoscaling API.

CycleCloud doesn’t lock you into a specific cluster topology. It includes templates to help you launch HPC systems on Azure quickly, and you can customize these templates to fit your needs. The Azure HPC community provides opinionated templates that are optimized for different types of workloads and industries.

## What a CycleCloud Deployed Environment Looks Like

![CycleCloud Deployment](./images/architecture-deployment.png)

An entire CycleCloud HPC system can be deployed on Azure infrastructure. CycleCloud itself is installed as an application server on a VM in Azure that requires outbound access to Azure Resource Provider APIs. CycleCloud starts and manages the VMs that make up your HPC system. These usually include scheduler head nodes and compute nodes. You can also add other components like NFS servers, BeeGFS clusters, login nodes, or bastion hosts, depending on your needs. The full setup is defined in CycleCloud templates. You can also connect to Azure services like NetApp Files, HPC Cache, and Microsoft Entra ID Services.

## Next Steps

* [Try Azure CycleCloud using a Marketplace VM](qs-install-marketplace.md)
* [Install Azure CycleCloud using an ARM template](~/articles/cyclecloud/how-to/install-arm.md)
* [Install CycleCloud manually](~/articles/cyclecloud/how-to/install-manual.md)
* [Explore CycleCloud features with the tutorial](./tutorials/tutorial.md)
* [Plan your Production Deployment](/azure/cyclecloud/how-to/plan-prod-deployment)
