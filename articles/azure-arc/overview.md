---
title: Azure Arc overview
description: Learn about what Azure Arc is and how it helps customers enable management and governance of their hybrid resources with other Azure services and features.
ms.date: 03/01/2022
ms.topic: overview
---

# Azure Arc overview

Today, companies struggle to control and govern increasingly complex environments that extend across data centers, multiple clouds, and edge. Each environment and cloud possesses its own set of management tools, and new DevOps and ITOps operational models can be hard to implement across resources.

Azure Arc simplifies governance and management by delivering a consistent multicloud and on-premises management platform.

Azure Arc provides a centralized, unified way to:

* Manage your entire environment together by projecting your existing non-Azure and/or on-premises resources into Azure Resource Manager.
* Manage virtual machines, Kubernetes clusters, and databases as if they are running in Azure.
* Use familiar Azure services and management capabilities, regardless of where they live.
* Continue using traditional ITOps while introducing DevOps practices to support new cloud native patterns in your environment.
* Configure custom locations as an abstraction layer on top of Azure Arc-enabled Kubernetes clusters and cluster extensions.  

:::image type="content" source="./media/overview/azure-arc-control-plane.png" alt-text="Azure Arc management control plane diagram" border="false":::

Currently, Azure Arc allows you to manage the following resource types hosted outside of Azure:

* [Servers](servers/overview.md): Manage Windows and Linux physical servers and virtual machines hosted outside of Azure.
* [Kubernetes clusters](kubernetes/overview.md): Attach and configure Kubernetes clusters running anywhere, with multiple supported distributions.
* [Azure data services](data/overview.md): Run Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice. SQL Managed Instance
and PostgreSQL (preview) services are currently available.
* [SQL Server](/sql/sql-server/azure-arc/overview): Extend Azure services to SQL Server instances hosted outside of Azure.
* Virtual machines (preview): Provision, resize, delete and manage virtual machines based on [VMware vSphere](./vmware-vsphere/overview.md) or [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines) and enable VM self-service through role-based access.

## Key features and benefits

Some of the key scenarios that Azure Arc supports are:

* Implement consistent inventory, management, governance, and security for servers across your environment.

* Configure [Azure VM extensions](./servers/manage-vm-extensions.md) to use Azure management services to monitor, secure, and update your servers.

* Manage and govern Kubernetes clusters at scale.

* Use GitOps to deploy configuration across one or more clusters from Git repositories.

* Zero-touch compliance and configuration for Kubernetes clusters using Azure Policy.

* Run [Azure data services](../azure-arc/kubernetes/custom-locations.md) on any Kubernetes environment as if it runs in Azure (specifically Azure SQL Managed Instance and Azure Database for PostgreSQL server, with benefits such as upgrades, updates, security, and monitoring). Use elastic scale and apply updates without any application downtime, even without continuous connection to Azure.

* Create [custom locations](./kubernetes/custom-locations.md) on top of your [Azure Arc-enabled Kubernetes](./kubernetes/overview.md) clusters, using them as target locations for deploying Azure services instances. Deploy your Azure service cluster extensions for [Azure Arc-enabled data services](./data/create-data-controller-direct-azure-portal.md), [App services on Azure Arc](../app-service/overview-arc-integration.md) (including web, function, and logic apps) and [Event Grid on Kubernetes](../event-grid/kubernetes/overview.md).

* Perform virtual machine lifecycle and management operations for [VMware vSphere](./vmware-vsphere/overview.md) and [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines) environments.

* A unified experience viewing your Azure Arc-enabled resources, whether you are using the Azure portal, the Azure CLI, Azure PowerShell, or Azure REST API.

## Pricing

Below is pricing information for the features available today with Azure Arc.

### Azure Arc-enabled servers

The following Azure Arc control plane functionality is offered at no extra cost:

* Resource organization through Azure management groups and tags
* Searching and indexing through Azure Resource Graph
* Access and security through Azure Role-based access control (RBAC)
* Environments and automation through templates and extensions
* Update management

Any Azure service that is used on Azure Arc-enabled servers, such as Microsoft Defender for Cloud or Azure Monitor, will be charged as per the pricing for that service. For more information, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

### Azure Arc-enabled Kubernetes

Any Azure service that is used on Azure Arc-enabled Kubernetes, such as Microsoft Defender for Cloud or Azure Monitor, will be charged as per the pricing for that service.

For more information on pricing for configurations on top of Azure Arc-enabled Kubernetes, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

### Azure Arc-enabled data services

For information, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

## Next steps

* Learn about [Azure Arc-enabled servers](./servers/overview.md).
* Learn about [Azure Arc-enabled Kubernetes](./kubernetes/overview.md).
* Learn about [Azure Arc-enabled data services](https://azure.microsoft.com/services/azure-arc/hybrid-data-services/).
* Learn about [Azure Arc-enabled SQL Server](/sql/sql-server/azure-arc/overview).
* Learn about [Azure Arc-enabled VMware vSphere](vmware-vsphere/overview.md) and [Azure Arc-enabled Azure Stack HCI](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).
* Learn about [Azure Arc-enabled System Center Virtual Machine Manager](system-center-virtual-machine-manager/overview.md).
* Experience Azure Arc by exploring the [Azure Arc Jumpstart](https://aka.ms/AzureArcJumpstart).
* Learn about best practices and design patterns trough the various [Azure Arc Landing Zone Accelerators](https://aka.ms/ArcLZAcceleratorReady).
* Understand [network requirements for Azure Arc](network-requirements-consolidated.md).
