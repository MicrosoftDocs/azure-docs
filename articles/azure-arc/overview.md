---
title: Azure Arc overview
description: Learn about what Azure Arc is and how it helps customers enable management and governance of their hybrid resources with other Azure services and features.
ms.date: 08/25/2020
ms.topic: overview
---

# Azure Arc overview

Today, companies are struggling to control and govern an environment that becomes more and more complex. These environments extend across data centers, multiple clouds, and edge. Each environment and cloud have its own set of disjointed management tools that you need to learn and operate.

In parallel, new DevOps and ITOps operational models are hard to implement, as existing tools fail to provide support for new cloud native patterns.

Azure Arc simplifies governance and management by delivering a consistent multi-cloud and on-premises management platform. Azure Arc enables you to manage your entire environment, with a single pane of glass, by projecting your existing resources into Azure Resource Manager. You can now manage virtual machines, Kubernetes clusters, and databases as if they are running in Azure. Regardless of where they live, you can use familiar Azure services and management capabilities. Azure Arc enables you to continue using traditional ITOps, while introducing DevOps practices to support new cloud native patterns in your environment.

:::image type="content" source="./media/overview/azure-arc-control-plane.png" alt-text="Azure Arc management control plane diagram" border="false":::

Today, Azure Arc allows you to manage the following resource types hosted outside of Azure:

* Servers - both physical and virtual machines running Windows or Linux.
* Kubernetes clusters - supporting multiple Kubernetes distributions.
* Azure data services - Azure SQL Database and PostgreSQL Hyperscale services.

## What does Azure Arc deliver?

Key features of Azure Arc include:

* Implement consistent inventory, management, governance, and security for your servers across your environment.

* Configure [Azure VM extensions](./servers/manage-vm-extensions.md) to use Azure management services to monitor, secure, and update your servers.

* Manage and govern Kubernetes clusters at scale. 

* Use GitOps-based configuration as code management to deploy applications and configuration across one or more clusters directly from source control, such as GitHub.

* Zero touch compliance and configuration for your Kubernetes clusters using Azure Policy.

* Run Azure data services on any Kubernetes environment, specifically Azure SQL Managed Instance and Azure Database for PostgreSQL Hyperscale, with benefits such as upgrades/updates, security, and monitoring as if it runs in Azure. Leverage elastic scale, apply updates, without any application downtime, even if it doesn't have a continuous connection to Azure.

* A unified experience viewing your Azure Arc enabled resources whether you are using the Azure portal, the Azure CLI, Azure PowerShell, or Azure REST API.

## How much does Azure Arc cost?

The following are pricing details for the features available today with Azure Arc.

### Arc enabled servers

In the current preview phase, Azure Arc enabled servers is offered at no additional cost.

Any Azure service that is used on Arc enabled servers, for example Azure Security Center or Azure Monitor, will be charged as per the pricing for that service. For more information, see [Azure pricing page](https://azure.microsoft.com/pricing/).

### Azure Arc enabled Kubernetes

In the current preview phase, Azure Arc enabled Kubernetes is offered at no additional cost.

### Azure Arc enabled data services

In the current preview phase, Azure Arc enabled data services are offered at no additional cost.

## Next steps

* To learn more about Arc enabled servers, see the following [overview](./servers/overview.md)

* To learn more about Arc enabled Kubernetes, see the following [overview](./kubernetes/overview.md)

* To learn more about Arc enabled data services, see the following [overview](https://azure.microsoft.com/services/azure-arc/hybrid-data-services/)
