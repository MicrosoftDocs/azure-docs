---
title: Azure region relocation documentation
description:  Learn how to plan, execute, scale, and deliver the relocation of your Azure services into a new region. 
author: anaharris-ms
ms.topic: overview
ms.date: 11/28/2023
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

# Azure region relocation documentation

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, there's an increasing number of region relocation options for business-critical data and apps.  Region relocation options vary by service and by workload architecture.  To successfully migrate a workload to another region, you need to plan your relocation strategy with an understanding of what each service in your workload requires and supports.

The Azure region relocation documentation contains service-specific guides so that you can learn about the relocation options for each service that's in your workload. 

  

## Relocation methods

There are three main methods for relocating workloads. The relocation method you choose depends on the services in the workload and how critical the workload is to essential business functions.

- **Cold relocation**  is for workloads that can withstand downtime. Cold relocation is the most cost-effective approach to relocation because you don't duplicate any environments during relocation.

- **Hot relocation** is for workloads that need minimal to zero downtime. Hot relocation helps minimize the data delta after cutover. Hot relocation is only possible if the service supports synchronous data replication. Some services don't have this feature, and you'll need to use a warm relocation approach instead. 

- **Warm relocation** is for critical workloads that don't support hot relocation. Warm relocation uses asynchronous data replication and environment replication. For critical workloads, you should see if the service supports hot relocation before trying a warm approach.  |

For more information on all three methods and guidance for how to choose a method, see [Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).


## Relocation architectural patterns

There are three relocation architectural patterns that you can implement either in combination or all together. Knowing which relocation pattern to plan is key to creating the best relocation plan.

- **Azure Availability Zones** Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. To learn more about availability zones, see [Availability zones](../reliability/availability-zones-overview.md). For information on how to plan for a region move to availability zones, see [Azure availability zone migration baseline](../reliability/availability-zones-baseline.md).

- **Azure Landing Zone**
Azure landing zones are the output of a multi-subscription Azure environment that accounts for scale, security, governance, networking, and identity. Azure landing zones enable application migrations and greenfield development at enterprise-scale in Azure. These zones consider all platform resources that are required to support the customer’s application portfolio and don’t differentiate between infrastructure as a service or platform as a service.

    For information on how to plan for an Azure Landing Zone relocation, see [CONTENT]()

- **N-Tier Application Solutions**
Patterns and Practices to relocate n-Tier Application in new regions. For information on relocation patterns for n-tier applications, see [CONTENT]()


## Relocation strategies

There are two possible relocation strategies that you can use to relocate your Azure services: **migration** and **redeployment**. The strategy you choose depends on what the services in your workload support.

### Relocate with Migration

There are two general methods you can use to migrate your resources to a new region: **automatic** and **manual**. To learn whether a specific service supports automatic or manual migration, and if so, which method is recommended, as well as how-tos, and detailed product-specific information, see [Relocation guidance overview for Azure products and services](./relocation-guidance-overview.md).

- **Automatic**.  To initiate an automated resource migration, use [Azure Resource Mover](/azure/resource-mover/overview#move-across-regions). With Azure Resource Mover you can: 

    - Use a single hub for moving resources across regions.
    - Reduce move time and complexity. Everything you need is in a single location.
    - Depend on a simple and consistent process for moving different types of Azure resources.
    - Easily identify dependencies across resources you want to move. You can then move related resources together, so that everything works as expected in the target region, after the move.
    - Rely on automatic cleanup of resources in the source region, if you want to delete them after the move.
    - Test a move, and then discard it if you don't want to do a full move.

- **Manual**. To manually move your resources, you can use [ARM templates](/azure/azure-resource-manager/templates/). How you move resources across regions depends on the type of resources moved. However, the following process for moving a resource with ARM is typical:

    1. Verify prerequisites: Prerequisites include ensuring that the resources needed are available in the target region, checking that there is enough quota, and verifying that the subscription can access the target region.
    
    1. Analyze dependencies: The resources to be moved might depend on other resources. Before proceeding, determine the dependencies so that the resources continue to function as expected after the move.
    
    1. Prepare: The preparation steps depend on the type of resource you are moving:
    
        -  Stateless resources have configuration information only. These resources don’t need continuous replication of data to move. Examples include Azure virtual networks (VNets), network adapters, load balancers, and network security groups. The preparation process generates an Azure Resource Manager template for this resource type.
    
        - Stateful resources have configuration information and data that need to move. Examples include Azure VMs and Azure SQL databases. The preparation process differs for each resource. It might involve replicating the source resource to the target region.
    
    1. Move the resources: The movement approach would depend on the resource moved. You might need to deploy a template in the target region, or resources should be failing over to the target.
    
    1. Commit or discard target resources: After verifying resources in the target region, some resources might require a final commit action. For example, you need to set up disaster recovery in a target region that’s now the primary region. If the relocation results are unsatisfactory, you can discard the changes.
    
    1. Clean up the source: After everything’s up and running in the new region, decommission the resources you created for the move and the resources in the primary region.
    
   
    Learn how to export templates with [Azure CLI](../azure-resource-manager/templates/export-template-cli.md), [Azure PowerShell](../azure-resource-manager/templates/export-template-powershell.md), or [REST API](/rest/api/resources/resourcegroups/exporttemplate). To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). To learn how to develop templates, see the [step-by-step tutorials](../azure-resource-manager/index.yml). 


### Relocate with Redeployment

There are two types of redeployment: Stateless redeployment and stateful redeployment. Both use [ARM templates](/azure/azure-resource-manager/templates/) to deploy the Azure service in the target region.

#### Stateless redeployment. 

A stateless redeployment generally requires the following procedure:

1. Export the Azure service into an Azure resource mover (ARM) template and curate the ARM template to enable the deployment into the new target region. This includes changing the region and updating the additional required parameters based on the requirements of the Azure service.
1. Some Azure services store additional configuration information which is not covered by the ARM templates. In that case, you need to export the configuration information, so it can be applied later in the source region.
1. Deploy the Azure service in the target region using the curated deployment template.
1. Import additional configuration information as needed by the Azure service.
1. Deploy applications on top of the Azure service if required. For example, an application to be deployed on an Static Web App or a container deployed on a container solution.

#### Stateful redeployment (Data migration)

A stateful redeployment generally requires the following procedure:


1. Export the Azure service into an Azure resource mover (ARM) template and curate the ARM template to enable the deployment into the new target region. This includes changing the region and updating the additional required parameters based on the requirements of the Azure service.
1. Some Azure services store additional configuration information which is not covered by the ARM templates. In that case, you need to export the configuration information, so it can be applied later in the source region.
1. Export the data, so you can imported the data into the redeployed service in the next step. Some services provide replication capabilities which can used to transfer the data. If that is the case, skip this step.
1. Deploy the Azure service in the target region using the curated deployment template.
1. Import additional configuration information as needed by the Azure service.
1. Import the data from step three into the deployed Azure service in the target region or establish a replication between the source and the target region to transfer the data.
    
To learn about which type of redeployment is supported for the services in your workload, find the [relocation guidance page for your services](./relocation-guidance-overview.md).

>[!IMPORTANT]
>- It's recommended that you automate manual processes to limit data migration error and coherency issues. One of the workload redeployment challenges is synchronizing data across environments in geographies. These challenges are bound to the upper layer of the workload (for storage and databases). Ideally, the storage should have an asynchronous replication mechanism. If it doesn't have an asynchronous replication mechanism, it's still possible to
achieve the target, but requires multiple operations to fill in the data gap between source and target. 
>-**Redeployed security services leave behind the restrictions and supportability of
features across regions.** However, the complexity isn't in the infrastructure services but the data layers. For Azure Key Vault, complexity occurs because it't not aware of its usage, like a website bookmark. Compare redeployment mechanisms of these data layers to reduce the impact of lost artifacts, and that replication from one region to the other is only at the storage and database level.

## Additional information

- [Cloud migration in the Cloud Adoption Framework](/azure/cloud-adoption-framework/migrate/).
- [Azure Resources Mover documentation](/azure/resource-mover/)
- [Azure Resource Manager (ARM) documentation](/azure/azure-resource-manager/templates/)


