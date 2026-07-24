---
title: Enterprise Plan in Azure Marketplace
description: Learn about the Azure Spring Apps Enterprise plan offering available in Azure Marketplace.
author: KarlErickson
ms.author: karler
ms.reviewer: yuwzho
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 08/19/2025
ms.update-cycle: 1095-days
ms.custom: devx-track-java, engagement-fy23, references_regions
---

# Enterprise plan in Azure Marketplace

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes the Azure Marketplace offer and license requirements for the VMware Taznu components in the Enterprise plan in Azure Spring Apps.

## Enterprise plan and VMware Tanzu components

The Azure Spring Apps Enterprise plan is optimized for the needs of enterprise Spring developers and provides advanced configurability, flexibility, and portability. Azure Spring Apps also provides the enterprise-ready VMware Spring Runtime with 24/7 support in a strong partnership with VMware. You can learn more about the plan's value propositions in the [Enterprise plan](../basic-standard/overview.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#enterprise-plan) section of [What is Azure Spring Apps?](../basic-standard/overview.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

Because the Enterprise plan provides feature parity with the Standard plan, it provides a rich set of features that include app lifecycle management, monitoring, and troubleshooting.

The Enterprise plan provides the following managed [VMware Tanzu components](./vmware-tanzu-components.md) that empower enterprises to ship faster:

- Tanzu Build Service
- Application Configuration Service for Tanzu (EOL)
- Tanzu Service Registry
- Spring Cloud Gateway for Tanzu
- API portal for VMware Tanzu
- Application Live View for VMware Tanzu (EOL)
- Application Accelerator for VMware Tanzu (EOL)

The pricing for Azure Spring Apps Enterprise plan is composed of the following two parts:

- Infrastructure pricing, set by Microsoft, based on vCPU and memory usage of apps and managed Tanzu components.
- Tanzu component licensing pricing, set by Broadcom, based on vCPU usage of apps.

Since April 21, 2025, Microsoft has been collecting licensing fees directly from customers and then distributing the payments to Broadcom. The invoice content has been updated accordingly. This update replaces the previous process where customers paid Broadcom directly through the [Azure Marketplace offer](https://aka.ms/ascmpoffer). For more information, see [Azure Spring Apps pricing](https://aka.ms/springcloudpricing).

## Next steps

- [Launch your first app](../basic-standard/quickstart.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)
