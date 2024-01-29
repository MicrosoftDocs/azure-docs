---
title: Create Azure Private Link for workload relocation to another region
titleSufffix: Azure Private Link
description: Find out how to create Azure Private Link for workload relocation to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/26/2024
ms.service: private-link
ms.topic: conceptual
ms.custom:
  - subject-relocation
---

# Create Azure Private Link for workload relocation to another region

This article shows you how to create [Azure Private Link](/azure/private-link/private-link-overview) when moving a Platform as a Service (PaaS) service, such as Azure Storage or SQL Database, to another region. 

The actual steps to relocate [Azure Private Link](/azure/private-link/private-link-overview) is covered in the section of the related service such as Storage Account, Static WebApp, App Service, etc. 




## Create Azure Private Link Service for relocated workload

1. Redeploy all dependent resources that are used by Private Link, such as Application Insights, log storage, [Log Analytics](./relocation-log-analytics.md), etc.

1. Ensure that the standard load balancer with all dependent resources is relocated to the target region.

1. Create a Private Link that references the relocated load balancer. To create the Private Link, you can use [Azure Portal](/azure/private-link/create-private-link-service-portalp), [PowerShell](/azure/private-link/create-private-link-service-powershell), or [Azure CLI](/azure/private-link/create-private-link-service-cli). In the load balancer selection process:
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
