---
title: Azure CycleCloud Overview | Microsoft Docs
description: Azure CycleCloud overview and introduction.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# What is Azure CycleCloud?

Azure CycleCloud is a tool for creating, managing, operating, and optimizing HPC & Big Compute clusters in Azure. With Azure CycleCloud, users can dynamically provision HPC Azure clusters and orchestrate data and jobs for hybrid and cloud workflows. Azure CycleCloud provides alerting, monitoring, and automatically scales HPC infrastructure to ensure your jobs run efficiently at any scale. Azure CycleCloud offers advanced policy and governance features such as: cost reporting and controls, usage reporting, AD/LDAP integration, monitoring and alerting, and audit/event logging to give users full control over who runs what, where, and at what cost within Azure.

![Overview Intro](~/images/overview-gui.png)

[//]: # (do we have a video that would work?)

## Why Should I Use Azure CycleCloud?

Azure CycleCloud makes it easy to create High Performance Computing (HPC) clusters in the cloud, orchestrating workloads from the user to overcome the challenges typically associated with cloud HPC. Azure CycleCloud gives you the ability to:

[//]: # (might want to convert this to a table with mini screenshots similar to App Insights overview)
* **Manage compute resources**: manage virtual machines and scale sets to provide a flexible set of compute resources that can meet your dynamic workload requirements
* **Manage data**: synchronize data files between cloud and on-premise storage, schedule data transfers, monitor transfers and manage data usage.
* **Orchestrate compute workloads**: monitor job load, manage job submissions and job requirements.
* **Auto scale resources**: automatically adjust cluster size and components based upon job load, availability, and time requirements
* **Create reports**: create reports on a number of metrics including cost, usage, and performance.
* **Monitor and analyze**: collect and analyze performance data using visualization tools
* **Create alerts**: create custom alerts that can warn of overruns, job outliers, and workload problems
* **Audit usage**: use audit and event logs to track usage across the organization
* **Customize images**: use Azure Marketplace or custom images with pre-installed applications
* **Template clusters**: use CycleCloud templates to share parameterized clusters with the community
* **Customize and extend functionality**: use the comprehensive RESTful API to customize and extend functionality, and integrate into existing workloads
* **Integrate into existing workflows**: integrate into existing workflows and tools using the built-in CLI and data management CLI

## How Do I Use Azure CycleCloud?

Azure CycleCloud is an installable web application that you can run on premise or in your Azure subscription. Once installed, CycleCloud can be configured to use compute and data resources in your prepared Azure subscription. CycleCloud provides a number of official cluster templates including schedulers (Grid Engine, Slurm, HTCondor), filesystems (Redis, Avere), containers (Docker, Singularity) and many scientific applications. Cluster templates provided by the CycleCloud community are also available. You can use these cluster templates unmodified or you can customize them for your specific needs.

Once a cluster is created, you can manually add compute nodes and node arrays to handle the computational jobs that are submitted to the cluster. Alternatively, you can configure the cluster to dynamically adjust the compute resources to meet the job load. This allows you to limit cluster cost for reduced workloads and scale up the cluster to meet spikes in demand.

CycleCloud administrative features provide and govern access to the CyleCloud cluster for other users in your organization. You can monitor, audit and alert on a number of metrics including usage, cost and quotas.

[//]: # (## What cluster types are available?)

[//]: # (Provide a list of existing official templates?)

## Next Steps

[//]: # (* Try Azure CycleCloud using a Marketplace VM)
* [Install Azure CycleCloud using an ARM template](quickstart-install-cyclecloud.md)
* [Install CycleCloud manually](installation.md)
* [Prepare your Azure subscription for CycleCloud](configuration.md)
