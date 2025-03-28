---
title: What is the Service Catalog?
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is the Service Catalog?

## Overview

The Service Catalog enables customers to quickly deploy tailored ARM templates of Azure services into Azure Virtual Enclaves (AVE) while being compliant with Policy Guardrails and enclave isolation requirements. The Service Catalog helps customers springboard their setups within the secure boundary of AVE without getting blocked by the security they want.

![image.png](/assets/image-e66cdab2-61e2-4bc0-91cf-6f65fc34963f.png)

Diagram Description: The user/admin accesses the Service Catalog through the portal. Once they select the Service Catalog template they want to deploy, the Service Catalog will read the correct template and deploy the resources specified in the template according to the parameter inputs the user provides.

## What is in the Service Catalog?

The Service Catalog contains two template categories:
1. Azure Services - custom templates to allow common Azure Services to be deployed with the secure AVE boundaries without being blocked by policy or hardened network settings.
1. Customer Workload Templates - Collections of Azure resources to meet specific customer needs

See the [Service Catalog List](/docs/overview/List%20of%20Service%20Catalog%20Templates) to view the available templates in the Service Catalog. While we strive to include as much setup in the ARM templates there may exist pre-requisites, please carefully review the documentation for each Service Catalog template you wish to deploy.

## Editing Service Catalog templates before deployment
You can edit the Service Catalog template itself but please be aware that edits may change the formatting of the parameter input flow. 

## Ready? Deploy from the Service Catalog!

- [Service Catalog List](/docs/overview/List%20of%20Service%20Catalog%20Templates)
- [Service Catalog deployment Quickstart](/docs/Quickstarts/Deploy-a-Storage-Account-from-the-Service-Catalog-into-a-Workload)
- [Service Catalog How-To Guides and tips for each template](/docs/How%20to%20Guides/Service%20Catalog)
- [What is Azure Virtual Enclaves?](/docs/overview/what%20is%20azure%20virtual%20enclaves)
- [What is a Community?](/docs/overview/what%20is%20a%20community)
- [Tutorial: Create resouces from the Service Catalog](/docs/Tutorials/4.-Use-service-catalog-to-create-Azure-resources-in-workloads/)
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
