---
title: Relocate Azure Private Link Service to another region
description: Learn how to relocate an Azure Private Link Service to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/31/2024
ms.service: private-link
ms.topic: concept-article
ms.custom:
  - subject-relocation
---

# Relocate Azure Private Link Service to another region

This article shows you how to relocate [Azure Private Link Service](/azure/private-link/private-link-overview) when moving your workload to another region. 

To learn how to to reconfigure [private endpoints](/azure/private-link/private-link-overview) for a particular service, see the [appropriate service relocation guide](overview-relocation.md).



## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).



## Prepare

Identify all resources that are used by Private Link Service, such as Standard load balancer, virtual machines, virtual network, etc.



## Redeploy

1. Redeploy all resources that are used by Private Link Service.

1. Ensure that a standard load balancer with all dependent resources is relocated to the target region.

1. Create a Private Link Service that references the relocated load balancer. To create the Private Link, you can use [Azure Portal](/azure/private-link/create-private-link-service-portal), [PowerShell](/azure/private-link/create-private-link-service-powershell), or [Azure CLI](/azure/private-link/create-private-link-service-cli). 

    In the load balancer selection process:
        - Choose the frontend IP configuration where you want to receive the traffic. 
        - Choose a subnet for NAT IP addresses for the Private Link Service. 
        - Choose Private Link Service settings that are the same as the source Private Link Service. 
    
1. Redeploy the private endpoint into the relocated virtual network.

1. Configure your DNS settings by following guidance in [Private DNS zone values](/azure/private-link/private-endpoint-dns?branch=main).


:::image type="content" source="media/relocation/consumer-provider-endpoint.png" alt-text="Diagram that illustrates relocation process for Private Link service.":::

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
