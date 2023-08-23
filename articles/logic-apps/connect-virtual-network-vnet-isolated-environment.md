---
title: Connect to Azure virtual networks with an ISE
description: Create an integration service environment (ISE) to access Azure virtual networks (VNETs) from Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/22/2023
---

# Connect to Azure virtual networks from Azure Logic Apps using an integration service environment (ISE)

> [!IMPORTANT]
>
> On August 31, 2024, the ISE resource will retire, due to its dependency on Azure Cloud Services (classic), 
> which retires at the same time. Before the retirement date, export any logic apps from your ISE to Standard 
> logic apps so that you can avoid service disruption. Standard logic app workflows run in single-tenant Azure 
> Logic Apps and provide the same capabilities plus more.

Since November 1, 2022, the capability to create new ISE resources is no longer available. However, ISE resources existing before this date are supported through August 31, 2024.

For more information, see the following resources:

- [ISE Retirement - what you need to know](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/ise-retirement-what-you-need-to-know/ba-p/3645220)
- [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
- [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
- [Export ISE workflows to a Standard logic app](export-from-ise-to-standard-logic-app.md)
- [Integration Services Environment will be retired on 31 August 2024 - transition to Logic Apps Standard](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/)
- [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)

## Next steps

* [Add resources to integration service environments](add-artifacts-integration-service-environment-ise.md)
* [Manage integration service environments](ise-manage-integration-service-environment.md#check-network-health)