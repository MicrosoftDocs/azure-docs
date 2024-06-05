---
title: Choosing the right Azure Arc service for machines
description: Learn about the different services offered by Azure Arc and how to choose the right one for your machines.
ms.date: 05/07/2024
ms.topic: conceptual
---

# Choosing the right Azure Arc service for machines

Azure Arc offers different services based on your existing IT infrastructure and management needs. Before onboarding your resources to Azure Arc-enabled servers, you should investigate the different Azure Arc offerings to determine which best suits your requirements. Choosing the right Azure Arc service provides the best possible inventorying and management of your resources.

There are several different ways you can connect your existing Windows and Linux machines to Azure Arc:

- Azure Arc-enabled servers
- Azure Arc-enabled VMware vSphere
- Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)
- Azure Stack HCI

Each of these services extends the Azure control plane to your existing infrastructure and enables the use of [Azure security, governance, and management capabilities using the Connected Machine agent](/azure/azure-arc/servers/overview). Other services besides Azure Arc-enabled servers also use an [Azure Arc resource bridge](/azure/azure-arc/resource-bridge/overview), a part of the core Azure Arc platform that provides self-servicing and additional management capabilities.

General recommendations about the right service to use are as follows:

|If your machine is a... |...connect to Azure with... |
|---------|---------|
|VMware VM (not running on AVS) |[Azure Arc-enabled VMware vSphere](vmware-vsphere/overview.md) |
|Azure VMware Solution (AVS) VM |[Azure Arc-enabled VMware vSphere for Azure VMware Solution](/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows) |
|VM managed by System Center Virtual Machine Manager |[Azure Arc-enabled SCVMM](vmware-vsphere/overview.md) |
|Azure Stack HCI VM |[Azure Stack HCI](/azure-stack/hci/overview) |
|Physical server |[Azure Arc-enabled servers](servers/overview.md) |
|VM on another hypervisor |[Azure Arc-enabled servers](servers/overview.md) |
|VM on another cloud provider |[Azure Arc-enabled servers](servers/overview.md) |

If you're unsure about which of these services to use, you can start with Azure Arc-enabled servers and add a resource bridge for additional management capabilities later. Azure Arc-enabled servers allows you to connect servers containing all of the types of VMs supported by the other services and provides a wide range of capabilities such as Azure Policy and monitoring, while adding resource bridge can extend additional capabilities.

Region availability also varies between Azure Arc services, so you may need to use Azure Arc-enabled servers if a more specialized version of Azure Arc is unavailable in your preferred region. See [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all&rar=true) to learn more about region availability for Azure Arc services.

Where your machine runs determines the best Azure Arc service to use. Organizations with diverse infrastructure may end up using more than one Azure Arc service; this is alright. The core set of features remains the same no matter which Azure Arc service you use.

## Azure Arc-enabled servers

[Azure Arc-enabled servers](servers/overview.md) lets you manage Windows and Linux physical servers and virtual machines hosted outside of Azure, on your corporate network, or other cloud provider. When connecting your machine to Azure Arc-enabled servers, you can perform various operational functions similar to native Azure virtual machines.

### Capabilities

- Govern: Assign Azure Automanage machine configurations to audit settings within the machine. Utilize Azure Policy pricing guide for cost understanding.

- Protect: Safeguard non-Azure servers with Microsoft Defender for Endpoint, integrated through Microsoft Defender for Cloud. This includes threat detection, vulnerability management, and proactive security monitoring. Utilize Microsoft Sentinel for collecting security events and correlating them with other data sources.

- Configure: Employ Azure Automation for managing tasks using PowerShell and Python runbooks. Use Change Tracking and Inventory for assessing configuration changes. Utilize Update Management for handling OS updates. Perform post-deployment configuration and automation tasks using supported Azure Arc-enabled servers VM extensions.

- Monitor: Utilize VM insights for monitoring OS performance and discovering application components. Collect log data, such as performance data and events, through the Log Analytics agent, storing it in a Log Analytics workspace.

- Procure Extended Security Updates (ESUs) at scale for your Windows Server 2012 and 2012R2 machines running on vCenter managed estate.

> [!IMPORTANT]
> Azure Arc-enabled VMware vSphere and Azure Arc-enabled SCVMM have all the capabilities of Azure Arc-enabled servers, but also provide specific, additional capabilities.
> 
## Azure Arc-enabled VMware vSphere

[Azure Arc-enabled VMware vSphere](vmware-vsphere/overview.md) simplifies the management of hybrid IT resources distributed across VMware vSphere and Azure.

Running software in Azure VMware Solution, as a private cloud in Azure, offers some benefits not realized by operating your environment outside of Azure. For software running in a VM, such as SQL Server and Windows Server, running in Azure VMware Solution provides additional value such as free Extended Security Updates (ESUs). 

To take advantage of these benefits if you're running in an Azure VMware Solution, it's important to follow respective [onboarding](/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows) processes to fully integrate the experience with the AVS private cloud. 

Additionally, when a VM in Azure VMware Solution private cloud is Azure Arc-enabled using a method distinct from the one outlined in the AVS public document, the steps are provided in the [document](/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows) to refresh the integration between the Azure Arc-enabled VMs and Azure VMware Solution.

### Capabilities

- Discover your VMware vSphere estate (VMs, templates, networks, datastores, clusters/hosts/resource pools) and register resources with Azure Arc at scale.

- Perform various virtual machine (VM) operations directly from Azure, such as create, resize, delete, and power cycle operations such as start/stop/restart on VMware VMs consistently with Azure.

- Empower developers and application teams to self-serve VM operations on-demand using Azure role-based access control (RBAC).

- Install the Azure Arc-connected machine agent at scale on VMware VMs to govern, protect, configure, and monitor them.

- Browse your VMware vSphere resources (VMs, templates, networks, and storage) in Azure, providing you with a single pane view for your infrastructure across both environments.

## Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)

[Azure Arc-enabled System Center Virtual Machine Manager](system-center-virtual-machine-manager/overview.md) (SCVMM) empowers System Center customers to connect their VMM environment to Azure and perform VM self-service operations from Azure portal. 

Azure Arc-enabled System Center Virtual Machine Manager also allows you to manage your hybrid environment consistently and perform self-service VM operations through Azure portal. For Microsoft Azure Pack customers, this solution is intended as an alternative to perform VM self-service operations. 

### Capabilities

- Discover and onboard existing SCVMM managed VMs to Azure.

- Perform various VM lifecycle operations such as start, stop, pause, and delete VMs on SCVMM managed VMs directly from Azure.

- Empower developers and application teams to self-serve VM operations on demand using Azure role-based access control (RBAC).

- Browse your VMM resources (VMs, templates, VM networks, and storage) in Azure, providing you with a single pane view for your infrastructure across both environments.

- Install the Azure Arc-connected machine agents at scale on SCVMM VMs to govern, protect, configure, and monitor them.

## Azure Stack HCI

[Azure Stack HCI](/azure-stack/hci/overview) is a hyperconverged infrastructure operating system delivered as an Azure service. This is a hybrid solution that is designed to host virtualized Windows and Linux VM or containerized workloads and their storage. Azure Stack HCI is a hybrid product that is offered on validated hardware and connects on-premises estates to Azure, enabling cloud-based services, monitoring and management. This helps customers manage their infrastructure from Azure and run virtualized workloads on-premises, making it easy for them to consolidate aging infrastructure and connect to Azure.

> [!NOTE]
> Azure Stack HCI comes with Azure resource bridge installed and uses the Azure Arc control plane for infrastructure and workload management, allowing you to monitor, update, and secure your HCI infrastructure from the Azure portal.
> 

### Capabilities

- Deploy and manage workloads, including VMs and Kubernetes clusters from Azure through the Azure Arc resource bridge.

- Manage VM lifecycle operations such as start, stop, delete from Azure control plane.

- Manage Kubernetes lifecycle operations such as scale, update, upgrade, and delete clusters from Azure control plane.

- Install Azure connected machine agent and Azure Arc-enabled Kubernetes agent on your VM and Kubernetes clusters to use Azure services (i.e., Azure Monitor, Azure Defender for cloud, etc.).

- Leverage Azure Virtual Desktop for Azure Stack HCI to deploy session hosts on to your on-premises infrastructure to better meet your performance or data locality requirements.

- Empower developers and application teams to self-serve VM and Kubernetes cluster operations on demand using Azure role-based access control (RBAC).

- Monitor, update, and secure your Azure Stack HCI infrastructure and workloads across fleets of locations directly from the Azure portal.

- Deploy and manage static and DHCP-based logical networks on-premises to host your workloads.

- VM image management with Azure Marketplace integration and ability to bring your own images from Azure storage account and cluster shared volumes.

- Create and manage storage paths to store your VM disks and config files.

## Capabilities at a glance

The following table provides a quick way to see the major capabilities of the three Azure Arc services that connect your existing Windows and Linux machines to Azure Arc.

| _ |Arc-enabled servers  |Arc-enabled VMware vSphere  |Arc-enabled SCVMM  |Azure Stack HCI  |
|---------|---------|---------|---------|---------|---------|
|Microsoft Defender for Cloud     |✓         |✓         |✓         |✓         |
|Microsoft Sentinel     | ✓        |✓         |✓         |✓         |
|Azure Automation     |✓         |✓         |✓         |✓         |
|Azure Update Manager     |✓         |✓         |✓         |✓         |
|VM extensions     |✓         |✓         |✓         |✓         |
|Azure Monitor     |✓         |✓         |✓         |✓         |
|Extended Security Updates for Windows Server 2012/2012R2 and SQL Server 2012 (11.x)     |✓         |✓         |✓         |✓         |
|Discover & onboard VMs to Azure     |         |✓         |✓         |✗         |
|Lifecycle operations (start/stop VMs, etc.)     |         |✓         |✓         |✓         |
|Self-serve VM provisioning     |         |✓         |✓         |✓         |
|SQL Server enabled by Azure Arc     |✓         |✓         |✓         |✓         |

## Switching from Arc-enabled servers to another service

If you currently use Azure Arc-enabled servers, you can get the additional capabilities that come with Arc-enabled VMware vSphere or Arc-enabled SCVMM:

- [Enable virtual hardware and VM CRUD capabilities in a machine with Azure Arc agent installed](/azure/azure-arc/vmware-vsphere/enable-virtual-hardware)

- [Enable virtual hardware and VM CRUD capabilities in an SCVMM machine with Azure Arc agent installed](/azure/azure-arc/system-center-virtual-machine-manager/enable-virtual-hardware-scvmm)

