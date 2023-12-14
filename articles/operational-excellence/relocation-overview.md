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

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, there's an increasing number options available for you to migrate or redeploy your workloads into new regions.  Region relocation options vary by service and by workload architecture.  To successfully relocate a workload to another region, you need to plan your relocation strategy with an understanding of what each service in your workload requires and supports.

Azure region relocation documentation contains [service-specific relocation guidance for Azure products and services](./relocation-guidance-overview.md). Each relocation guide contains the relocation options for each service that's in your workload. 

Each service specific guide can include service-specific information such as:

- Recommended [relocation methods, such as Cold, Hot or Warm relocation](#relocation-methods)
- Recommended [relocation strategies](#relocation-strategies). There are two possible relocation strategies that you can use to relocate your Azure services: **migration** and **redeployment**. 
- Links to how-tos and relevant product-specific relocation information.


## Additional information

- [Cloud migration in the Cloud Adoption Framework](/azure/cloud-adoption-framework/migrate/).
- [Azure Resources Mover documentation](/azure/resource-mover/)
- [Azure Resource Manager (ARM) documentation](/azure/azure-resource-manager/templates/)


