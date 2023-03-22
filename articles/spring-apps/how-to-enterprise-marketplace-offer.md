---
title: Enterprise Tier in Azure Marketplace
description: Learn what is the Azure Spring Apps Enterprise tier offering from Azure Marketplace.
author: karlerickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/20/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23, references_regions
---

# Enterprise tier in Azure Marketplace

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article describes the pricing and license requirements for the VMWare Taznu components as offered in the Enterprise tier in Azure Spring Apps.

## Enterprise tier and VMware Tanzu components

The Azure Spring Apps Enterprise tier is optimized for the needs of enterprise Spring developers and provides advanced configurability, flexibility, and portability. Azure Spring Apps also provides the enterprise-ready VMware Spring Runtime with 24/7 support in a strong partnership with VMware. You can learn more about the tier's value propositions in [Azure Spring Apps Enterprise Overview](./overview.md#enterprise-tier-overview).

Because the Enterprise tier provides feature parity with the Standard tier, it provides a rich set of features that include app lifecycle management, monitoring, and troubleshooting.

The Enterprise tier provides the following managed VMware Tanzu components that empower enterprises to ship faster:

- Build Service
- Application Configuration Service
- Service Registry
- Spring Cloud Gateway
- API Portal
- App Live View
- App Accelerator

As the most advanced tier in Azure Spring Apps, a Microsoft provided first party Azure service, the Enterprise tier pricing is composed of two parts:

- Infrastructure pricing to Microsoft, based on vCPU and memory usage of apps and managed Tanzu components.
- Tanzu component licensing pricing to VMware, based on vCPU usage of apps.

For more information about pricing, see [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

To provide the best customer experience to manage the Tanzu component license purchasing and metering, VMware creates a [Azure Marketplace Offer](https://aka.ms/ascmpoffer). This offer represents a Tanzu component license and during the creation of an Azure Spring Apps Enterprise, this offer is automatically purchased on behalf of customers.

Under this implicit Azure Marketplace third party offer purchasing with VMware, your personal data and application vCPU usage data is shared to VMware, according to be agreed upon marketplace terms prior to creating the service.

To purchase the Tanzu component license successfully, your billing account of your subscription must be included in the [Supported geographic locations of billing account](#supported-geographic-locations-of-billing-account). Because of tax management restrictions from VMware in some countries, not all countries are supported.

In comparison to Azure Spring Apps standard tier, there are no extra license fees in that tier because the managed Spring components use the OSS config server and Eureka server. No other third party license fees are required.

On the [Azure Marketplace Offer](https://aka.ms/ascmpoffer) page, you can review the Tanzu component license pricing as shown in the following image.

:::image type="content" source="media/how-to-enterprise-marketplace-offer/enterprise-plan.png" alt-text="Azure Marketplace screenshot showing Azure Spring Apps Enterprise tier VMware Tanzu offering.":::

You can use the Azure portal and Azure CLI to provision an Azure Spring Apps Enterprise tier service instance. You can also select **Subscribe** on the VMware marketplace offer to create the service instance, as Azure Marketplace redirects you to Azure Spring Apps creation page.

## Requirements

The following items must be understood and fulfilled for a successful implementation of your plan and licensing agreements.

- Your Azure subscription must be registered to the `Microsoft.SaaS` resource provider. For more information, see the [Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) section of [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types).

- Your Azure subscription must have an associated payment method. Azure credits or free MSDN subscriptions aren't supported. For more information, see the [Purchasing requirements](/marketplace/azure-marketplace-overview#purchasing-requirements) section of [What is Azure Marketplace?](/marketplace/azure-marketplace-overview)

- Your Azure subscription must belong to a billing account in a supported geographic location defined in [Azure Marketplace Offer](https://aka.ms/ascmpoffer). For more information, see the [Supported geographic locations of billing account](#supported-geographic-locations-of-billing-account).

- Your region must be available. Choose an Azure region currently available. For more information, see [Available Regions for Enterprise Tier](./faq.md#in-which-regions-is-azure-spring-apps-enterprise-tier-available).

- Your organization must allow Azure Marketplace purchases. For more information, see the [Enabling Azure Marketplace purchases](../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases) section of [Azure Marketplace](../cost-management-billing/manage/ea-azure-marketplace.md).

- Your organization must allow acquisition of any Azure Marketplace software application as described in the [Purchase policy management](/marketplace/azure-purchasing-invoicing#purchase-policy-management) section of [Azure Marketplace purchasing](/marketplace/azure-purchasing-invoicing).

- You must accept the marketplace legal terms and privacy statements while provisioning the tier on the Azure portal, or you can use the following commands to do so in advance.

  ```azurecli
  az term accept \
      --publisher vmware-inc \
      --product azure-spring-cloud-vmware-tanzu-2 \
      --plan asa-ent-hr-mtr
  ```

## Supported geographic locations of billing account

To successfully purchase the [Azure Marketplace Offer](https://aka.ms/ascmpoffer), your Azure subscription must belong to a billing account in a supported geographic location defined in the offer.

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
