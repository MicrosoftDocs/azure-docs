---
title: Choosing the right Azure Arc service for machines
description: Learn about the different services offered by Azure Arc and how to choose the right one for your machines.
ms.date: 02/12/2024
ms.topic: conceptual
---

# Choosing the right Azure Arc service for machines

Azure Arc offers different services based on your existing IT infrastructure and management needs. Before onboarding your resources to Azure Arc-enabled servers, you should investigate the different Azure Arc offerings to determine which best suits your requirements. Choosing the right Azure Arc service provides the best possible inventorying and management of your resources.

There are four different ways you can connect your Windows and Linux machines to Azure Arc:

- Azure Arc-enabled servers
- Azure Arc-enabled VM Sphere
- Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)
- Azure Arc-enabled Stack HCI

Each of these services extends the Azure control plane to your existing infrastructure and enables the use of Azure security, governance, and management capabilities.

One important differences between these four services is that three of them--Azure Arc-enabled VMware Sphere, Azure Arc-enabled SCVMM, and Azure Arc-enabled Stack HCI--use Azure Arc Resource Bridge. Azure Arc resource bride is part of the core Azure Arc platform and provides self-servicing and additional management capabilities for VMs hosted on these services.

Where your machine runs determines the best Azure Arc service to use. Organizations with diverse infrastructure may end up using more than one Azure Arc service; this is alright. The core set of features remains the same no matter which Azure Arc service you use.

General recommendations about the right service to use are as follows:

|If your machine is a... |...connect to Azure with... |
|---------|---------|
|VMware VM (not running on AVS) |Azure Arc-enabled VMware vSphere |
|Azure VMware Solution (AVS) VM |Arc-enabled Azure VMware Solution |
|VM managed by System Center Virtual Machine Manager |Azure Arc-enabled SCVMM |
|Azure Stack HCI VM |Azure Arc-enabled Azure Stack HCI |
|Physical server |Azure Arc-enabled servers |
|VM on another hypervisor |Azure Arc-enabled servers |
|VM on another cloud provider |Azure Arc-enabled servers |

If you're unsure about the right service to use, you can start with Azure Arc-enabled servers and add a resource bridge for additional management capabilities later. Azure Arc-enabled servers allows you to connect servers containing all of the types of VMs supported by the other services and provides a wide range of capabilities such as Azure Policy and monitoring, while adding resource bridge can extend additional capabilities.

Region availability also varies between Azure Arc services, so you may need to use Azure Arc-enabled servers if a more specialized version of Azure Arc is unavailable in your preferred region. See [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all&rar=true) to learn more about region availability for Azure Arc services.   

## Azure Arc-enabled servers

Azure Arc-enabled servers lets you manage Windows and Linux physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud provider. When connecting your machine to Azure Arc-enabled servers, you can perform various operational functions similar to native Azure virtual machines. Here are some key actions:

- Govern: Assign Azure Automanage machine configurations to audit settings within the machine. Utilize Azure Policy pricing guide for cost understanding.

- Protect: Safeguard non-Azure servers with Microsoft Defender for Endpoint, integrated through Microsoft Defender for Cloud. This includes threat detection, vulnerability management, and proactive security monitoring. Utilize Microsoft Sentinel for collecting security events and correlating them with other data sources.

- Configure: Employ Azure Automation for managing tasks using PowerShell and Python runbooks. Use Change Tracking and Inventory for assessing configuration changes. Utilize Update Management for handling OS updates and Azure Automanage (preview) for automating service onboarding and configuration. Perform post-deployment configuration and automation tasks using supported Arc-enabled servers VM extensions.

- Monitor: Utilize VM insights for monitoring OS performance and discovering application components. Collect log data, such as performance data and events, through the Log Analytics agent, storing it in a Log Analytics workspace.

- Procure Extended Security Updates (ESUs) at scale for your Windows Server 2012 and 2012R2 machines running on vCenter managed estate.

Note that all of the other Azure Arc services described below have all the capabilities of Azure Arc-enabled servers. The differences lie in the additional capabilities they provide.


## Azure Arc-enabled VMware vSphere

Azure Arc-enabled VMware vSphere simplifies the management of hybrid IT resources distributed across VMware vSphere and Azure.

Running software in Azure VMware Solution, as a private cloud in Azure, offers some benefits not realized by operating your environment outside of Azure. For software running in a VM, such as SQL Server and Windows Server, running in Azure VMware Solution provides additional value such as free Extended Security Updates (ESUs). 

To take advantage of these benefits if you are running in an Azure VMware Solution it is important to follow respective onboarding process to fully integrate the experience with the AVS private cloud. 

Additionally, when a VM in Azure VMware Solution private cloud is Arc-enabled using a method distinct from the one outlined in the AVS public document, the steps are provided in the document to refresh the integration between the Arc-enabled VMs and Azure VMware Solution  

### Capabilities

- Discover your VMware vSphere estate (VMs, templates, networks, datastores, clusters/hosts/resource pools) and register resources with Arc at scale.

- Perform various virtual machine (VM) operations directly from Azure, such as create, resize, delete, and power cycle operations such as start/stop/restart on VMware VMs consistently with Azure.

- Empower developers and application teams to self-serve VM operations on-demand using Azure role-based access control (RBAC).

- Install the Arc-connected machine agent at scale on VMware VMs to govern, protect, configure, and monitor them.

- Browse your VMware vSphere resources (VMs, templates, networks, and storage) in Azure, providing you with a single pane view for your infrastructure across both environments.

## Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)

Azure Arc-enabled System Center Virtual Machine Manager (SCVMM) empowers System Center customers to connect their VMM environment to Azure and perform VM self-service operations from Azure portal. 

Azure Arc-enabled System Center Virtual Machine Manager also allows you to manage your hybrid environment consistently and perform self-service VM operations through Azure portal. For Microsoft Azure Pack customers, this solution is intended as an alternative to perform VM self-service operations. 

### Capabilities

- Perform various VM lifecycle operations such as start, stop, pause, and delete VMs on SCVMM managed VMs directly from Azure.

- Empower developers and application teams to self-serve VM operations on demand using Azure role-based access control (RBAC).

- Browse your VMM resources (VMs, templates, VM networks, and storage) in Azure, providing you with a single pane view for your infrastructure across both environments.

- Discover and onboard existing SCVMM managed VMs to Azure.

- Install the Arc-connected machine agents at scale on SCVMM VMs to govern, protect, configure, and monitor them.

## Azure Arc-enabled Stack HCI

Azure Stack HCI is a hybrid cloud solution that merges the power of the Azure control plane with hyperconverged infrastructure (HCI) and enables organizations to modernize with cost-effective technology. 

Azure Arc-enabled Stack HCI consolidates containers and virtualized workloads when data needs to remain on premises. 

### Capabilities

- Deploy and manage workloads, including VMs and Kubernetes clusters from Azure through the Azure Arc resource bridge.

- Monitor, update, and secure your Azure Stack HCI infrastructure, including fleets of locations, directly from the Azure portal.

