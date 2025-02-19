---
title: Relocate Azure Virtual Machine Scale Sets to another region
description: Learn how to relocate Azure Virtual Machine Scale Sets to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 08/20/2024
ms.service: azure-virtual-machine-scale-sets
ms.topic: how-to
ms.custom:
  - subject-relocation
# Customer intent: As an administrator, I want to move Azure Virtual Machine Scale Sets to another region.
---


# Relocate Azure Virtual Machine Scale Sets to another region

This article covers the recommended approach, guidelines, and practices for relocating Virtual Machine Scale Sets to another region.

## Prerequisites

Before you begin, ensure that you have the following prerequisites:

- If the source VM supports availability zones, then the target region must also support availability zones. To see which regions support availability zones, see [Azure regions with availability zone support](../reliability/availability-zones-region-support.md).

- The subscription in the destination region needs enough quota to create the resources. If you exceeded the quota, request an increase. For more information, see [Azure subscription and service limits, quotas, and constraints](..//azure-resource-manager/management/azure-subscription-service-limits.md).

- Consolidate all the associated extensions from source Virtual Machine Scale Set, as some need to be reconfigured after relocation.

- Confirm if the VM image is a part of VM image gallery. Gallery resources need to be replicated to the target region.

- Capture the list of resources that are being configured, such as capturing diagnostic logs. This is important with respect to prioritization and sequencing.

- Ensure that the following services are available and deployed in the target region:

    - [Log Analytics Workspace](./relocation-log-analytics.md)
    - Diagnostic Virtual Machine Scale Set
    - [Key Vault](./relocation-key-vault.md)
    - [Proximity Placement Group](/azure/virtual-machine-scale-sets/proximity-placement-groups)
    - Public IP address
    - [Load Balancer](../load-balancer/move-across-regions-external-load-balancer-portal.md)
    - [Virtual Network](./relocation-virtual-network.md)

- Ensure that you have a Network Contributor role or higher in order to configure and deploy a Load Balancer template in another region.

- Identify the networking layout of the solution in the source region, such as NSGs, Public IPs, VNet address spaces, and more.



## Prepare

In this section, follow the instructions to prepare for relocating a Virtual Machine Scale Set to another region.


1. Locate the image reference used by the source Virtual Machine Scale Set and replicate it to the Image Gallery in the target region.

    :::image type="content" source="media\relocation\virtual-machine-scale-sets\image-replication.png" alt-text="Screenshot showing how to locate image of virtual machine.":::

1. Relocate the Load Balancer, along with the public IP by doing one of the following methods:

    - *Resource Mover*. Associate Load Balancer with public IP in the source region to the target region. For more information, see [Move resources across regions (from resource group) with Azure Resource Mover](../resource-mover/move-region-within-resource-group.md).
    - *Export Template*. Relocate the Load Balancer along with public IP to the target region using the export template option. For information on how to do this, see [Move an external load balancer to another region using the Azure portal](../load-balancer/move-across-regions-external-load-balancer-portal.md).

    >[!IMPORTANT]
    > Because public IPs are a regional resource, Azure Resource Mover re-creates Load Balancer at the target region with a new public IP address. 

1. Manually set the source Virtual Machine Scale Set instance count to 0.

    :::image type="content" source="media\relocation\virtual-machine-scale-sets\set-instance-count.png" alt-text="Screenshot showing how to set Virtual Machine Scale Set instance count to 0.":::

1. Export the source Virtual Machine Scale Set template from Azure portal:
    
    1. In the [Azure portal](https://portal.azure.com), navigate to your source Virtual Machine Scale Set.
    1. In the menu, under **Automation**, select **Export template** > **Download**.
    1. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains the .json files that include the template and scripts to deploy the template.
    

1. Edit the template:
    
    1. Remove associated resources if they’re present in the template, such as Log Analytics Workspace in the **Monitoring** section.

    1. Make any necessary changes to the template, such as updating all occurrences of the name and the location for the relocated source Virtual Machine Scale Set.

    1. Update the parameter file with these inputs:
        - Source Virtual Machine Scale set `name`.
        - Image Gallery `Resource id`.
        - Virtual network `subnet Id`. Also, make the necessary ARM code changes to the subnet section so that it can call the Virtual Network `subnet Id`.
        - Load Balancers` resource id`, `Address id`, and `virtual network id`. Change the `value` property under `parameters`.

## Relocate

In this section, follow the steps below to relocate a Virtual Machine Scale Set across geographies.

1. In the target region, recreate the Virtual Machine Scale Set with the exported template by using IAC (Infrastructure as Code) tools such as Azure Resource Manager templates, Azure CLI, or PowerShell.

1. Associate the dependent resources to the target Virtual Machine Scale Set, such as Log Analytics Workspace in **Monitoring** section. Also, configure all the extensions that were consolidated in the [Prerequisites section](#prerequisites).


## Validate

When the relocation is complete, validate the Virtual Machine Scale Set in the target region by performing the following steps:

 - Virtual Machine Scale Set doesn't keep the same IP after relocation to new target location. However, make sure to validate the private IP configuration.

 - Run a scripted or manual smoke test and integration test to validate that all configurations and dependent resources have been properly linked and all configured data are accessible.

- Validate Virtual Machine Scale Set components and integration.

## Related content

- To move registry resources to a new resource group either in the same subscription or a new subscription, see [Move Azure resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).