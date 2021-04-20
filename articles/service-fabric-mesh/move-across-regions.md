---
title: Move a Service Fabric Mesh application to another region
description: You can move Service Fabric Mesh resources by deploying a copy of your current template to a new Azure region.
author: erikadoyle
ms.author: edoyle
ms.topic: how-to
ms.date: 01/14/2020
ms.custom: subject-moving-resources
#Customer intent: As an Azure service administrator, I want to move my Service Fabric Mesh resources to another Azure region.
---
# Move a Service Fabric Mesh application to another Azure region

> [!IMPORTANT]
> The preview of Azure Service Fabric Mesh has been retired. New deployments will no longer be permitted through the Service Fabric Mesh API. Support for existing deployments will continue through April 28, 2021.
> 
> For details, see [Azure Service Fabric Mesh Preview Retirement](https://azure.microsoft.com/updates/azure-service-fabric-mesh-preview-retirement/).

This article describes how to move your Service Fabric Mesh application and its resources to a different Azure region. You might move your resources to another region for a number of reasons. For example, in response to outages, to gain features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

 [Service Fabric Mesh does not support](../azure-resource-manager/management/move-support-resources.md#microsoftservicefabricmesh) the ability to directly move resources across Azure regions. However, you can move resources indirectly by deploying a copy of your current Azure Resource Manager template to the new target region and then redirecting ingress traffic and dependencies to the newly created Service Fabric Mesh application.

## Prerequisites

* Ingress controller (such as [Application Gateway](../application-gateway/index.yml)) to serve as an intermediary for routing traffic between clients and your Service Fabric Mesh application
* Service Fabric Mesh (Preview) availability in the target Azure region (`westus`, `eastus`, or `westeurope`)

## Prepare

1. Take a "snapshot" of the current state of your Service Fabric Mesh application by exporting the Azure Resource Manager template and parameters from the most recent deployment. To do this, follow the steps in [Export template after deployment](../azure-resource-manager/templates/export-template-portal.md#export-template-after-deployment) using the Azure portal. You can also use [Azure CLI](../azure-resource-manager/management/manage-resource-groups-cli.md#export-resource-groups-to-templates), [Azure PowerShell](../azure-resource-manager/management/manage-resource-groups-powershell.md#export-resource-groups-to-templates), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).

2. If applicable, [export other resources in the same resource group](../azure-resource-manager/templates/export-template-portal.md#export-template-from-a-resource-group) for redeployment in the target region.

3. Review (and edit, if needed) the exported template to ensure the existing property values are the ones you want to use in the target region. The new `location` (Azure region) is a parameter that you will supply during redeployment.

## Move

1. Create a new resource group (or use an existing one) in the target region.

2. With your exported template, follow the steps in [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template) using the Azure portal. You can also use [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md), or [REST API](../azure-resource-manager/templates/deploy-rest.md).

3. For guidance on moving related resources such as [Azure Storage accounts](../storage/common/storage-account-move.md), refer to guidance for individual services listed under the topic [Moving Azure resources across regions](../azure-resource-manager/management/move-resources-overview.md#move-resources-across-regions).

## Verify

1. When the deployment is complete, test the application endpoint(s) to verify the functionality of your application.

2. You can also verify the status of your application by checking the application status ([az mesh app show](/cli/azure/ext/mesh/mesh/app#ext-mesh-az-mesh-app-show)) and reviewing the application logs and ([az mesh code-package-log](/cli/azure/ext/mesh/mesh/code-package-log)) commands using the [Azure Service Fabric Mesh CLI](./service-fabric-mesh-quickstart-deploy-container.md#set-up-service-fabric-mesh-cli).

## Commit

Once you've confirmed equivalent functionality of your Service Fabric Mesh application in the target region, configure your ingress controller (for example, [Application Gateway](../application-gateway/redirect-overview.md)) to redirect traffic to the new application.

## Clean up source resources

To complete the move of the Service Fabric Mesh application, [delete the source application and/or parent resource group](../azure-resource-manager/management/delete-resource-group.md).

## Next steps

* [Move Azure resources across regions](../azure-resource-manager/management/move-resources-overview.md#move-resources-across-regions)
* [Support for moving Azure resources across regions](../azure-resource-manager/management/move-support-resources.md)
* [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
* [Move operation support for resources](../azure-resource-manager/management/move-support-resources.md
)
