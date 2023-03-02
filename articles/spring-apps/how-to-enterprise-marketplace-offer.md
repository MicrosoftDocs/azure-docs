---
title: Enterprise Tier in Azure Marketplace
description: Learn what is the Azure Spring Apps Enterprise tier offering from Azure Marketplace.
author: karlerickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23, references_regions
---

# Enterprise Tier in Azure Marketplace

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

Azure Spring Apps Enterprise tier is optimized for the needs of enterprise Spring developers through advanced configurability, flexibility, portability, and enterprise-ready VMware Spring Runtime 24x7 support, on top of strong partnership with VMware. You can learn more about its value propositions in [Azure Spring Apps Enterprise Overview](./overview.md#enterprise-tier-overview). Besides the feature parity with Standard tier to offer a powerful managed infrastructure with rich set of features on app lifecycle management, monitoring and troubleshooting, etc., it provides kinds of managed VMware Tanzu components including Build Service, Application Configuration Service, Service Registry, Spring Cloud Gateway, API Portal, Developer Tools (App Live View and App Accelerator) to empower enterprises to ship faster.

As the most advanced tier in Azure Spring Apps which is a MSFT provided 1st party Azure service, its pricing is composed of two parts:

- Infrastructure pricing on top of app vCPU and memory usage, and managed Tanzu component vCPU and memory usage to MSFT.
- Tanzu component license pricing on top of app vCPU usage to VMware.

To learn about the pricing in detail, please take a look at: [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

To provide best customer experience to manage the Tanzu component license purchasing and metering, VMware creates a [Azure Marketplace Offer](https://aka.ms/ascmpoffer) which represents Tanzu component license and during provisioning Azure Spring Apps Enterprise Tier this offer will be automatically purchased on behalf of customers and later be metered against. More explanations as below:
- Under this implicit Azure marketplace 3rd party (VMware) offering purchasing:
  - your PII data and app vCPU usage data will be shared to VMware. That’s why we have marketplace terms in place for you to agree on firstly when creating the service.
  - To purchase it successfully, your billing account of your subscription must be in one of the [Supported geographic locations of billing account](#supported-geographic-locations-of-billing-account). Today due to tax management restriction from VMware in some countries, not all countries are supported.
- As a comparison to Azure Spring Apps standard tier, since the managed Spring components there are OSS config server and Eureka server, so no need additional license fee and accordingly no need this kind of implicit 3rd party license purchasing in behind.
- If you open the [Azure Marketplace Offer](https://aka.ms/ascmpoffer), you can find out the Tanzu component license pricing there as below snapshot shows:

  :::image type="content" source="media/how-to-enterprise-marketplace-offer/enterprise-plan.png" alt-text="Azure Marketplace screenshot showing Azure Spring Apps Enterprise tier VMware Tanzu offering.":::

- To provision an Azure Spring Apps Enterprise Tier service instance, Azure Portal and CLI are the common ways to choose. Meanwhile, you can also click “subscribe” button on the VMware marketplace offer (see above snapshot) to achieve the same goal, as Azure marketplace will help redirect you to Azure Spring Apps portal creation page.

## Prerequisites

To be able to provision an enterprise tier service instance, there are some prerequisites to be satisfied:

- Your Azure subscription must be registered to the Microsoft.SaaS resource provider. For more information, see the [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) section of [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).
- Your Azure subscription must have an associated payment method. Azure credits or free MSDN subscriptions aren't supported. For more information, see the [Purchasing requirements](/marketplace/azure-marketplace-overview.md#purchasing-requirements) section of [What is Azure Marketplace?](/marketplace/azure-marketplace-overview.md)
- Your Azure subscription must belong to a billing account in a supported geographic location defined in [Azure Marketplace Offer](https://aka.ms/ascmpoffer). For more information, see the [Supported geographic locations of billing account](#supported-geographic-locations-of-billing-account).
- Choose an Azure region where it’s available today. For more information, see [Available Regions for Enterprise Tier](./faq.md#in-which-regions-is-azure-spring-apps-enterprise-tier-available). 
- Your organization must allow Azure Marketplace purchases. For more information, see the [Enabling Azure Marketplace purchases](../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases) section of [Azure Marketplace](../cost-management-billing/manage/ea-azure-marketplace.md).
- Your organization must allow acquisition of any Azure Marketplace software application described in the [Purchase policy management](/marketplace/azure-purchasing-invoicing.md#purchase-policy-management) section of [Azure Marketplace purchasing](/marketplace/azure-purchasing-invoicing.md).
- You must accept the marketplace legal terms and privacy statements during enterprise tier provisioning on Azure portal, or use the following CLI command to do so in advance.
   ```azurecli
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

## Supported geographic locations of billing account

To successfully purchase the [Azure Marketplace Offer](https://aka.ms/ascmpoffer), you Azure subscription must belong to a billing account in a supported geographic location defined in that offer.

The following table lists each supported geographic location and its [ISO 3166 two-digit alpha code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).

| Country/Region Name  |ISO-2|
|----------------------|-----|
| Armenia              | AM  |
| Austria              | AT  |
| Belarus              | BY  |
| Belgium              | BE  |
| Bulgaria             | BG  |
| Canada               | CA  |
| Chile                | CL  |
| Colombia             | CO  |
| Croatia              | HR  |
| Cyprus               | CY  |
| Czechia              | CZ  |
| Denmark              | DK  |
| Estonia              | EE  |
| Finland              | FI  |
| France               | FR  |
| Germany              | DE  |
| Greece               | GR  |
| Hungary              | HU  |
| Iceland              | IS  |
| India                | IN  |
| Indonesia            | ID  |
| Ireland              | IE  |
| Italy                | IT  |
| Korea                | KE  |
| Latvia               | LV  |
| Liechtenstein        | LI  |
| Lithuania            | LT  |
| Luxembourg           | LU  |
| Malaysia             | MY  |
| Malta                | MT  |
| Monaco               | MC  |
| Netherlands          | NL  |
| New Zealand          | NZ  |
| Nigeria              | NG  |
| Norway               | NO  |
| Poland               | PL  |
| Portugal             | PT  |
| Puerto Rico          | PR  |
| Romania              | RO  |
| Russia               | RU  |
| Saudi Arabia         | SA  |
| Serbia               | RS  |
| Singapore            | SG  |
| Slovakia             | SK  |
| Slovenia             | SI  |
| South Africa         | ZA  |
| Spain                | ES  |
| Sweden               | SE  |
| Switzerland          | CH  |
| Taiwan               | TW  |
| Thailand             | TH  |
| Turkey               | TR  |
| United Arab Emirates | AE  |
| United Kingdom       | GB  |
| United States        | US  |

## Next steps

- [Launch your first app](./quickstart.md)
