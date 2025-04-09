---
title: What is the Service Catalog?
description: What is the Service Catalog?
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# What is the Service Catalog?

The Service Catalog enables customers to quickly deploy tailored Azure Resource Manager (ARM) templates of Azure services into Azure Virtual Enclaves (AVE) while being compliant with Policy Guardrails and enclave isolation requirements. The Service Catalog helps customers springboard their setups within the secure boundary of AVE without getting blocked by the security they want.

![Graphic showing how service catalog templates deploy resources into customer workloads.](./media/service-catalog-process-overview.png)

Diagram Description: The user/admin accesses the Service Catalog through the portal. Once they select the Service Catalog template they want to deploy, the Service Catalog will read the correct template and deploy the resources specified in the template according to the parameter inputs the user provides.

## What is in the Service Catalog?

The Service Catalog contains two template categories:
1. Azure Services - custom templates to allow common Azure Services to be deployed with the secure AVE boundaries without being blocked by policy or hardened network settings.
1. Customer Workload Templates - Collections of Azure resources to meet specific customer needs

See the [Service Catalog List](./list-service-catalog-templates.md) to view the available templates in the Service Catalog. Review the documentation for each Service Catalog template you wish to deploy to determine if there are any prerequisite steps.

## Editing Service Catalog templates before deployment
You can edit the Service Catalog template itself but edits may change the formatting of the parameter input flow. 

## Ready? Deploy from the Service Catalog!

- [Service Catalog How-To Guides and tips for each template](./list-service-catalog-templates.md)
- [Service Catalog deployment Quickstart](./deploy-storage-account-service-catalog-workload.md)
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [What is a Community?](./what-community.md)
- [Tutorial: Create resources from the Service Catalog](/./4-use-service-catalog-create-azure-resources-workloads.md)
- [What is an Enclave?](./what-enclave.md)
