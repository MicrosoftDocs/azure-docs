---
title: Azure Arc overview
description: Learn about what Azure Arc is and how it helps customers enable management and governance of their hybrid resources with other Azure services and features.
ms.date: 05/25/2021
ms.topic: overview
---

# Azure Arc overview

Today, companies struggle to control and govern increasingly complex environments. These environments extend across data centers, multiple clouds, and edge. Each environment and cloud possesses its own set of disjointed management tools that you need to learn and operate.

In parallel, new DevOps and ITOps operational models are hard to implement, as existing tools fail to provide support for new cloud native patterns.

Azure Arc simplifies governance and management by delivering a consistent multi-cloud and on-premises management platform. Azure Arc enables you to:
* Manage your entire environment, with a single pane of glass, by projecting your existing non-Azure, on-premises, or other-cloud resources into Azure Resource Manager. 
* Manage virtual machines, Kubernetes clusters, and databases as if they are running in Azure. 
* Use familiar Azure services and management capabilities, regardless of where they live. 
* Continue using traditional ITOps, while introducing DevOps practices to support new cloud native patterns in your environment.
* Configure Custom Locations as an abstraction layer on top of Azure Arc–enabled Kubernetes cluster, cluster connect, and cluster extensions.  

:::image type="content" source="./media/overview/azure-arc-control-plane.png" alt-text="Azure Arc management control plane diagram" border="false":::

Today, Azure Arc allows you to manage the following resource types hosted outside of Azure:

* Servers - both physical and virtual machines running Windows or Linux.
* Kubernetes clusters - supporting multiple Kubernetes distributions.
* Azure data services - Azure SQL Managed Instance and PostgreSQL Hyperscale services.
* SQL Server - enroll instances from any location.

## What does Azure Arc deliver?

Key features of Azure Arc include:

* Implement consistent inventory, management, governance, and security for your servers across your environment.

* Configure [Azure VM extensions](./servers/manage-vm-extensions.md) to use Azure management services to monitor, secure, and update your servers.

* Manage and govern Kubernetes clusters at scale.

* Use GitOps to deploy configuration across one or more clusters from Git repositories.

*  Zero-touch compliance and configuration for your Kubernetes clusters using Azure Policy.

* Run [Azure data services](../azure-arc/kubernetes/custom-locations.md) on any Kubernetes environment as if it runs in Azure (specifically Azure SQL Managed Instance and Azure Database for PostgreSQL Hyperscale, with benefits such as upgrades, updates, security, and monitoring). Use elastic scale and apply updates without any application downtime, even without continuous connection to Azure.

* Create [custom locations](./kubernetes/custom-locations.md) on top of your [Azure Arc–enabled Kubernetes](./kubernetes/overview.md) clusters, using them as target locations for deploying Azure services instances. Deploy your Azure service cluster extensions for [Azure Arc–enabled Data Services](./data/create-data-controller-direct-azure-portal.md), [App Services on Azure Arc](../app-service/overview-arc-integration.md) (including web, function, and logic apps) and [Event Grid on Kubernetes](../event-grid/kubernetes/overview.md).

* A unified experience viewing your Azure Arc–enabled resources whether you are using the Azure portal, the Azure CLI, Azure PowerShell, or Azure REST API.

## How much does Azure Arc cost?

The following are pricing details for the features available today with Azure Arc.

### Azure Arc–enabled servers

The following Azure Arc control plane functionality is offered at no extra cost:

* Resource organization through Azure management groups and tags.

* Searching and indexing through Azure Resource Graph.

* Access and security through Azure RBAC and subscriptions.

* Environments and automation through templates and extensions.

* Update management.

Any Azure service that is used on Azure Arc–enabled servers, for example Azure Security Center or Azure Monitor, will be charged as per the pricing for that service. For more information, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

### Azure Arc–enabled Kubernetes

Any Azure service that is used on Azure Arc–enabled Kubernetes, for example Azure Security Center or Azure Monitor, will be charged as per the pricing for that service. For more information on pricing for configurations on top of Azure Arc–enabled Kubernetes, see [Azure pricing page](https://azure.microsoft.com/pricing/).

### Azure Arc–enabled data services

In the current preview phase, Azure Arc–enabled data services are offered at no extra cost.

## Next steps

* To learn more about Azure Arc–enabled servers, see the following [overview](./servers/overview.md)

* To learn more about Azure Arc–enabled Kubernetes, see the following [overview](./kubernetes/overview.md)

* To learn more about Azure Arc–enabled data services, see the following [overview](https://azure.microsoft.com/services/azure-arc/hybrid-data-services/)

* Experience Azure Arc–enabled services from the [Jumpstart proof of concept](https://azurearcjumpstart.io/azure_arc_jumpstart/)
