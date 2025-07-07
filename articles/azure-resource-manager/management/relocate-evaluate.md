---
title: How to evaluate a cloud workload for relocation
description: How to evaluate a workload for relocation so you can select the best relocation strategy.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/18/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Evaluate a cloud workload for relocation

Evaluate is the first step in the Move phase of relocation. The goal of Evaluate is to understand the workload you want to relocate so you can move it successfully. Every workload you relocate must go through the four steps of the Move phase, starting with the Evaluate step.

:::image type="content" source="./media/relocate/relocate-evaluate.svg" alt-text="Diagram showing the relocation process and highlights Evaluate in the Move phase. In the relocation process, there are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate-evaluate.svg" border="false":::

## Pick workload(s)

You should have a prioritized list of workloads, and the list should identify the order you want to relocate your workloads. Each time you visit the Evaluate step, pick the workload(s) at the top of the list. For smaller teams, you should relocate one workload at a time. It's a chance to learn and improve with each workload relocation. Larger teams should consider relocating multiple workloads. Bulk relocations can help achieve economies of scale.

## Conduct discovery

Workload discovery is the foundation of relocation. The goal of discovery is to understand the workload enough to ensure a smooth relocation. Discovery must comprehensively uncover the organizational and technical dimensions of the workload.

### Conduct organizational discovery

Workload organizational discovery involves finding out who is in charge of a workload, understanding the risks of moving it, and planning how to communicate about the move. This step helps identify who needs to be involved, manage risks, and ensure everyone is informed properly. This careful planning helps make the transition smoother and less disruptive for the business and its customers.

- *Workload ownership*: Determine who is responsible for the workload.

- *Stakeholder identification*: Identify all parties with an interest in the workload.

- *Risk assessment*: Assess the potential business risks associated with moving the workload.

- *Change management*: Gain a clear understanding of the processes for managing changes to the workload.

- *Outage windows*: Find out the acceptable times when the system can be offline for relocation.

- *Impact analysis*: Recognize which internal users or external customers the relocation might affect.

- *Communication needs*: Understand the current and needed communication plan to communicate any downtime or changes.

- *Policy compliance*: Ensure the relocation adheres to organizational policies and industry regulations.

### Conduct technical discovery

Technical workload discovery involves comprehensively understanding the technical aspects of a workload, including its dependencies, resources, network configuration, and any other technical requirements or constraints. Technical discovery helps you anticipate and mitigate risks associated with the relocation. Here are strategies for conducting technical discovery.

#### Evaluate dependencies

Dependencies are resources or services that the workload needs to run. Identifying all dependencies is essential for a successful workload relocation. Dependencies encompass various resources and services essential for the workload's operation. The following list provides a few examples of dependencies:

- *Azure services*: Any Azure services that the workload relies on. Global resources don't deploy to a specific region, so you don't need to move them in a relocation. However, you might still reconfigure them to work in a different region. For example, you might need to update IP addresses in Azure Front Door profile to point to the new IP address of a relocated workload.
- *Non-Microsoft applications*: Applications from other vendors that are integrated with or necessary for the workload. Understand the features and any limitations of the products involved in the workload.
- *Licenses*: Ensure that all required software licenses are accounted for and remain valid in the new location.
- *Networking*: Understing the network setup, including firewalls, to ensure seamless connectivity post-relocation.
- *Testing*: Determine the testing procedures needed to ensure the workload functions correctly in the new environment.
- *Tagging*: Properly tag and identify resources for effective management and tracking.
- *Automation*: Your organization might use scripts and infrastructure as code. You must update any references to Azure regions, service names, or service URLs within the scripts or code. The references need to correspond to the new Azure region you're moving to.

    You should avoid hardcoding any values in your code that are subject to change during the workload lifecycle. Instead, retrieve these values dynamically or use configurable parameters within the code. This approach makes changes less burdensome and ensures a smoother relocation process.

- *DNS*: Azure assigns public IP addresses to endpoints depending on the region. When you move an endpoint to a different Azure region, it gets a different IP address. Make sure to update your DNS records with these new IP addresses. Also, you need to provide the new IP address to any system that has the former IP address on its 'allowed' list.

    You might need to deploy new resources in the new Azure region before you turned off the old ones. If so, you could run into issues where two resources can't have the same DNS name at once. Think about using unique names for each service to avoid this problem. In some cases, you might be able to use CNAME records to provide a layer of abstraction. It makes resource name changes easier to manage.
- *Load balancers.* Update load balancers to point to any new backend IP addresses or hosts. For DNS-based load balancers, the change might take some time to propagate based on DNS caches and time-to-live (TTL) record expiry. For more information, see [Azure load balancing services](/azure/architecture/guide/technology-choices/load-balancing-overview#https-vs-non-https). Consider temporarily decreasing the Time to Live (TTL) settings for your DNS records. It helps the DNS records switch to new IP address faster. Also, consider setting your load balancer to check the health of your backend systems more frequently for a short period. Remember to change these settings back to normal after the migration to avoid extra costs and reduced performance later on.
- *Azure Backup registration.* When you move virtual machines to a new Azure region, make sure to unregister them from the Azure Backup service in the current region and register them with the Azure Backup service in the new region. You can't access the existing backup recovery points because they can't be transferred to the new backup vault. You need to start creating new recovery points in the new region.

#### Evaluate endpoints

Endpoint discovery refers to the process of identifying all the endpoints or IP addresses associated with a workload. Discovering all workload endpoints ensures you account for all network connections and access points and prepare to properly configure them in the new environment. Here are recommendations for dealing with public IP addresses and private endpoints:

- *Public IP addresses*: Public IP addresses are region specific. You can't move them between regions. You need to export the configuration of a public IP and deploy it to the new target region. For more information, see [Move Azure Public IP configuration to another Azure region](/azure/virtual-network/move-across-regions-publicip-powershell).
- *Private endpoints*: When you redeploy a private endpoint, it's likely gets a new IP address from the subnet you link it to. If you connect to your resources through a private endpoint, these endpoints link to private DNS zones that resolve the resource's network address within your virtual network. In a relocation, you need to update the DNS records within the private DNS zones to maintain connectivity.

#### Use automated tools

Where possible, use automated tools to collect information about applications and Azure services that make up your workload. You can use these tools to perform low-level discovery and architecture design discovery for the relocation of a specific workload. You should use the following Azure tools and services.

**Try Azure Resource Mover.** You should try Azure Resource Mover first. It's currently the easiest discovery tool to use, and you can also relocate services and data with the service. However, Azure Resource Mover only supports a limited number of services, so make sure your services are supported before continuing. For more information, see [Supported resources for Azure Resource Mover](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

**Use visualization tools.** If Azure Resource Mover doesn't meet all your needs, you can use visualization tools to aid your discovery. Azure has several visualization tools that you can use to map dependencies. Pick the tool that best supports your needs.

- *Resource group visualizer*: You can you visualize the connections between the resources in a resource group. In the Azure portal, navigate to the resource group and select *Resource visualizer* from the left navigation.

- *Azure Monitor topology*: You can view network dependencies with the topology feature in Azure Monitor. For more information, see [Network insights topology](/azure/network-watcher/network-insights-topology).

- *Application Insights*: Application Insights has an application mapping feature where you can view the logical structure of a distributed application. For more information, see [Application map in Azure Application Insights](/azure/azure-monitor/app/app-map?tabs=net).

- *Azure Resource Explorer*: Azure Resource Explorer lists every resource in your Microsoft Entra tenant. It gives you visibility but doesn't indicate dependencies. You must map workload components and dependencies manually. For more information, see [Azure Resource Explorer](https://resources.azure.com/).

- *Azure Resource Graph*: Azure Resource Graph allows you to run queries against the resources in a Microsoft Entra tenant. Resource Graph is accessible in the portal and from the command line. You must map workload components and dependencies manually. For more information, see [Azure Resource Graph documentation](/azure/governance/resource-graph/shared-query-azure-cli).

- *Inventory dashboard*: In the Azure portal, you can use the built-in inventory template to create a dashboard to track your existing resources. It's a quick way of determining the resources you have and the number of instances.

#### Manually create documentation

If automated discovery approaches aren't enough, you can conduct a manual assessment of the workloads. Most manual assessments rely on interviews with technical experts and technical documentation to get the information needed. Identify product or application owners and interview them. These interviews are optional, but necessary when the team needs to cover gaps in the information the tools provide. And the app owner can pull the tags and manually identify dependencies.

## Find region supportability

Not every region in Azure offers the same services, so you must make sure the services your workload needs to run are available in the target region. It might seem late in the process to make this determination, but you need the discovery details to ensure supportability. To determine region supportability for your workload, see the [products and services available in each Azure region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region).

Know if the target region is a paired region or not and if it supports availability zones. Region pairing and availability zones don't affect the relocation effort, but they do affect your business continuity and disaster recovery (BCDR) strategy in the target region. For more information, see [Azure geographies](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies) and [Availability zones](/azure/reliability/availability-zones-overview).

## Categorize workload services

Relocation happens at the service and component level. Most workloads use multiple services. There are two primary types of services, stateful and stateless. You need to categorize each service as stateful or stateless. This knowledge helps you determine dependencies, understand service integrations, and narrows your relocation automation options.

- *Stateless services:* Stateless services have configuration information only. These services don't need continuous replication of data to move. Examples include virtual networks, network adapters, load balancers, and network security groups.

- *Stateful services:* Stateful services have configuration information and data that need to move. Examples include virtual machines and SQL databases.

## Next steps

Evaluating your workload provides enough information to select a relocation method and the tools to execute the method you choose. The Select step walks you through the decisions to pick a relocation method and the correct tools for the relocation method.

> [!div class="nextstepaction"]
> [Select](./relocate-select.md)