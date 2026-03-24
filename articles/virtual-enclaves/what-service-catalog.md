---
title: What is the service catalog?
description: What is the service catalog?
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.date: 9/30/2025
---

# What is the service catalog?

The service catalog enables you to quickly deploy tailored Azure Resource Manager (ARM) templates of Azure services into Azure Virtual Enclaves (AVE) while being compliant with Policy Guardrails and enclave isolation requirements. The service catalog helps customers accelerate the creation of their workloads within the secure boundary of AVE without getting blocked by the security they want.

![Diagram showing how service catalog templates deploy resources into customer workloads.](./media/service-catalog-process-overview.png)

Diagram Description: The user/admin accesses the service catalog through the portal. Once the user selects the service catalog template they want to deploy, they can customize the resource creation, and then create those resources.

## What is in the service catalog?

Browse the [Service Catalog List](./list-service-catalog-templates.md) to view the available templates in the service catalog. Review the documentation for each service catalog template you wish to deploy to determine if there are any prerequisite steps.

> [!NOTE]
> Editing service catalog templates before deployment
> You can edit the service catalog template itself but edits might change the parameter inputs view. 

## Ready? Deploy from the service catalog!

- [Service Catalog List: How-To Guides and tips for each template](./list-service-catalog-templates.md)
- [Service Catalog Storage Account deployment Quickstart](./deploy-storage-account-service-catalog.md)
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [Tutorial: Create resources from the service catalog](./1-4-use-service-catalog-create-azure-resources-workloads.md)
