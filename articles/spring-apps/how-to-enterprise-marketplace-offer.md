---
title: View Azure Spring Apps Enterprise tier offering from Azure Marketplace
description: Learn how to view the Azure Spring Apps Enterprise tier offering from Azure Marketplace.
author: karlerickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23, references_regions
---

# View Azure Spring Apps Enterprise tier offering in Azure Marketplace

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to view the Azure Spring Apps Enterprise tier with VMware Tanzu offering through Azure Marketplace. You can redirect to the Azure Spring Apps Enterprise tier creation page from Azure Marketplace.

Azure Spring Apps Enterprise tier is optimized for the needs of enterprise Spring developers through advanced configurability, flexibility, portability, and enterprise-ready VMware Spring Runtime 24x7 support. Developers also benefit from access to Spring experts and from commercial Tanzu components, such as VMware Tanzu® Build Service™, Application Configuration Service for VMware Tanzu®, and VMware Tanzu® Service Registry.

You can obtain and pay for a license to Tanzu components through an [Azure Marketplace offering](https://aka.ms/ascmpoffer). Azure Spring Apps manages the license acquisition so you don't have to do it yourself.

## Prerequisites

To purchase in Azure Marketplace, you must meet the following prerequisites:

- Your Azure subscription must be registered to the `Microsoft.SaaS` resource provider. For more information, see the [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) section of [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).
- Your Azure subscription must have an associated payment method. Azure credits or free MSDN subscriptions aren't supported. For more information, see the [Purchasing requirements](/marketplace/azure-marketplace-overview.md#purchasing-requirements) section of [What is Azure Marketplace?](/marketplace/azure-marketplace-overview.md)
- Your Azure subscription must belong to a billing account in a supported geographic location. For more information, see the [Supported geographic locations](#supported-geographic-locations) section of this article.
- Your organization must allow Azure Marketplace purchases. For more information, see the [Enabling Azure Marketplace purchases](../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases) section of [Azure Marketplace](../cost-management-billing/manage/ea-azure-marketplace.md).
- Your organization must allow acquisition of any Azure Marketplace software application described in the [Purchase policy management](/marketplace/azure-purchasing-invoicing.md#purchase-policy-management) section of [Azure Marketplace purchasing](/marketplace/azure-purchasing-invoicing.md).
- You must accept the legal terms and privacy statements during enterprise tier provisioning on Azure portal, or use the following CLI command to do so in advance.

   ```azurecli
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan tanzu-asc-ent-mtr
   ```

## View Azure Spring Apps Enterprise tier offering from Azure Marketplace

To view the Azure Spring Apps Enterprise tier offering and read a detailed description, see [Azure Spring Apps Enterprise tier](https://aka.ms/ascmpoffer).

To view the supported plans in your market, select **Plans + Pricing**.

:::image type="content" source="media/how-to-enterprise-marketplace-offer/enterprise-plan.png" alt-text="Azure Marketplace screenshot showing Azure Spring Apps Enterprise tier VMware Tanzu offering.":::

> [!NOTE]
> If Azure displays the message *No plans are available for market '\<Location>'*, none of your Azure subscriptions can purchase the SaaS offering. For more information, see the [No plans are available for market '\<Location>'](./troubleshoot.md#no-plans-are-available-for-market-location) section in [Troubleshoot common Azure Spring Apps issues](./troubleshoot.md).

To see the Enterprise tier creation page, select **Subscribe**

:::image type="content" source="media/how-to-enterprise-marketplace-offer/marketplace-view.png" alt-text="Azure Marketplace screenshot showing Azure Spring Apps Enterprise tier offering with 'Subscribe' highlighted.":::

## Supported geographic locations

You can purchase the Azure Spring Apps Enterprise tier offering in the following geographic locations based on your billing address. For more information, see the [Azure Spring Apps Enterprise](https://aka.ms/ascmpoffer) page.

The following table lists each supported geographic location and its [ISO 3166 two-digit alpha code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).

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

- [Azure Spring Apps](index.yml)
