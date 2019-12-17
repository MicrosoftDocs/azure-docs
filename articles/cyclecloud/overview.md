---
title: Overview
description: Azure CycleCloud overview and introduction.
author: KimliW
ms.date: 12/16/2019
ms.author: jechia
---

# What is Azure CycleCloud?

Azure CycleCloud is an enterprise-friendly tool for orchestrating and managing High Performance Computing (HPC) environments on Azure. With Azure CycleCloud, users can provision infrastructure for HPC systems, deploy and use familiar HPC schedulers, and automatically scale up the infrastructure to run jobs efficiently at any scale. Through CycleCloud, users are also able to create different types of file systems to support an HPC workload, and mount these file systems on to the compute cluster nodes.

Azure CycleCloud is targeted at HPC administrators and users who want to deploy an HPC environment with a specific scheduler in mind -- commonly used schedulers such as Slurm, PBSPro, LSF, Grid Engine, and HT-Condor are supported out of the box. CycleCloud is the sister product to [Azure Batch](https://docs.microsoft.com/en-us/azure/batch/batch-technical-overview), which provides a Scheduler as a Service on Azure.

See [High Performance Computing (HPC) on Azure](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) for information about how CycleCloud compares against other HPC solutions available on Azure.

![Overview Intro](~/images/overview-gui.png)

[//]: # (Rob will provide a video that should work?)

## Why Should I Use Azure CycleCloud?

Organizations who have operated HPC environments for a while typically accumulate years of expertise and in-house tooling around a specific scheduler, and re-architecting or deploying these environments on Azure can be daunting. CycleCloud abstracts away the basic Azure building blocks such as VMs, scalesets, network interfaces, and disks. This allows an HPC administrator to focus on the familiar: an HPC cluster comprising of nodes and a configurable scheduler of choice.

CycleCloud deploys autoscaling plugins on top of the supported schedulers, so users do not need to implement complex autoscaling functions and routines themselves, but rather interface only with scheduler-level configurations that they are familiar with.

With a rich, declarative, templating format, CycleCloud provides powerful tooling to construct complete HPC environments on Azure. This allows users to deploy environments that include NFS servers, parallel file systems, login hosts, license servers, and directory services -- essentially all the components needed in an HPC system -- through a single management plane.

CycleCloud integrates with Azure services such as [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) and [Azure Cost Management tools](https://docs.microsoft.com/azure/cost-management/overview-cost-mgt), that provides control and monitoring tools.

### CycleCloud Capabilities

[//]: # (might want to convert this to a table with mini screenshots similar to App Insights overview)

* **Scheduler agnostic**: use standard HPC schedulers such as Slurm, PBS Pro, LSF, Grid Engine, and HTCondor, or extend CycleCloud autoscaling plugins to work with your own scheduler
* **Manage compute resources**: manage virtual machines and scale sets to provide a flexible set of compute resources that can meet your dynamic workload requirements
* **Orchestrate compute workloads**: monitor job load, manage job submissions and job requirements.
* **Auto scale resources**: automatically adjust cluster size and components based upon job load, availability, and time requirements
* **Monitor and analyze**: collect and analyze performance data using visualization tools
* **Template clusters**: use CycleCloud templates to share parameterized clusters with the community
* **Customize and extend functionality**: use the comprehensive RESTful API to customize and extend functionality, deploy your own scheduler, and support into existing workload managers
* **Integrate into existing workflows**: integrate into existing workflows and tools using the built-in CLI

## How Do I Use Azure CycleCloud?

Azure CycleCloud is an installable web application that you can run on premise or in an VM in your Azure subscription. Once installed, CycleCloud can be configured to use compute and data resources in your prepared Azure subscription. CycleCloud provides a number of official cluster templates for schedulers (PBSPro, LSF, Grid Engine, Slurm, HTCondor), and filesystems (NFS, BeeGFS). Cluster templates provided by the CycleCloud community are also available. You can use these cluster templates unmodified or you can customize them for your specific needs.

Once a cluster is created, it is automatically configured to autoscale by default to handle the computational jobs that are submitted to the scheduler. CycleCloud administrative features provide and govern access to the CycleCloud cluster for other users in your organization.

Tooling using templates and configuration scripts enable you to build complex HPC environments quickly, and replicate these for separate teams across your organization.

[//]: # (## What cluster types are available?)

[//]: # (Provide a list of existing official templates?)

## Next Steps

* [Try Azure CycleCloud using a Marketplace VM](qs-install-marketplace.md)
* [Install Azure CycleCloud using an ARM template](qs-install-arm.md)
* [Install CycleCloud manually](qs-install-manual.md)
* [Explore CycleCloud features with the tutorial](./tutorials/create-cluster.md)
