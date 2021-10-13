---
title: Purview accounts architecture and best practices
description: This article provides examples of Azure Purview accounts  architectures and describes best practices.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 10/12/2021
---

# Azure Purview accounts architectures and best practices  

Azure Purview is a unified data governance solution. You can use Azure Purview to centrally manage data governance across your organization's data estate, spanning multi-cloud and on-premises environments. We recommend organizations keeping the number of Azure Purview Instances as minimum as possible, however, there might additional requirements where additional Purview instances are needed to fulfil business security and compliance requirements.

## Intended audience

- Data architecture team  
- Data governance and management teams  
- Data security team  

## Single Purview account

Consider deploying minimum number of Purview accounts for the entire organization. This approach takes maximum advantage of the "network effects" where the value of the platform increases exponentially as a function of the data that resides inside the platform. 

Use [Azure Purview collections hierarchy](./concept-best-practices-collections.md) to layout your organization's data management structure inside a single Purview account. In this scenario, one Purview account is deployed in an Azure subscription. Data sources from one or more Azure subscriptions can be registered and scanned inside the Azure Purview. You can also register and scan data sources from your on-premises or multi-cloud environments.

:::image type="content" source="media/concept-best-practices/accounts-single-account.png" alt-text="Screenshot that shows the single Azure Purview account."lightbox="media/concept-best-practices/accounts-single-account.png":::

## Multiple Purview accounts

Some organizations may require setting up multiple Azure Purview accounts. Review the following scenarios as few examples when defining your Azure Purview accounts architecture:  

### Testing new features 

It is recommended to create a new instance of Purview account when testing scan configurations or classifications in isolated environments. For some scenarios, there is a "versioning" feature in some areas of the platform such as glossary, however, it would be easier to have a "disposable" instance of Purview to freely test expected functionality and then plan to rollout the feature into the production instance.  

Additionally, consider using a test Purview account when you cannot perform a rollback. For example, currently you cannot remove a glossary term attribute from a Purview instance once it is added to your Purview account. In this case, it is recommended using a test Purview account first.
 
### Isolating Production and non-production environments 

Consider deploying separate instances of Purview accounts for development, testing and production environments, specially when you have separate instances of data for each environment.  

In this scenario, production and non-production data sources can be registered and scanned inside their corresponding Purview instances.

Optionally, you can register a data source in more than one Purview instance, if needed.

:::image type="content" source="media/concept-best-practices/accounts-multiple-accounts.png" alt-text="Screenshot that shows multiple Azure Purview accounts based on environments."lightbox="media/concept-best-practices/accounts-multiple-accounts.png":::

### Fulfilling compliance requirements  

When you scan data sources in Azure Purview, information related to your metadata is ingested and stored inside your Azure Purview Data Map in the Azure region where your Purview account is deployed. Consider deploying separate instances of Azure Purview if you find strict regulatory and compliance requirements, which requires treating even metadata as sensitive and require it to be in a specific geography.  

If your organization has data in multiple geographies and you must keep metadata in the same region as the actual data, you have to deploy multiple Purview instances, one for each geography. In this case, data sources from each regions should be registered and scanned in the Purview account that corresponds to the data source region.

:::image type="content" source="media/concept-best-practices/accounts-multiple-regions.png" alt-text="Screenshot that shows multiple Azure Purview accounts based on compliance requirements."lightbox="media/concept-best-practices/accounts-multiple-regions.png":::

### having Data sources distributed across multiple tenants  

Currently, Purview doesn't support multi-tenancy. If you have Azure data sources distributed in multiple Azure subscriptions that are associated to different Azure Active Directory tenants, we recommend deploying separate Azure Purview accounts per each tenant. 

An exception applies to VM-based data sources and Power BI tenants. For more information about how to scan and register a cross tenant Power BI in a single Purview account see, [Register and scan a cross-tenant Power BI](/register-scan-power-bi-tenant#register-and-scan-a-cross-tenant-power-bi). 

:::image type="content" source="media/concept-best-practices/accounts-multiple-tenants.png" alt-text="Screenshot that shows multiple Azure Purview accounts based on multi-tenancy requirements."lightbox="media/concept-best-practices/accounts-multiple-tenants.png"::: 

### Require separate billing model for each department or business unit  

Review [Azure Purview Pricing model](https://azure.microsoft.com/pricing/details/azure-purview) when defining budgeting model and designing Azure Purview architecture for your organization. Consider that you will receive one billing for a single Purview account for the subscription where Purview account is deployed. This model also applies to additional costs related to scanning and classifying metadata inside your Purview Data Map.  

Some organization often have many business units (BUs) that operate separately, and, in some cases, they won't even share billing with each other. In those cases, the organization will end up creating a Purview instance for each BU. This model is not ideal, but may be necessary, especially because BUs are often not willing to share billing. 

For more information about cloud computing cost model in chargeback and showback models see, [What is cloud accounting?](https://docs.microsoft.com/azure/cloud-adoption-framework/strategy/cloud-accounting).  

## Additional considerations and recommendations 

- Consider that deploying multiple Purview instances to build your organization data governance may increase administrative overhead, because you may require creating and managing additional scans, access control, credentials and runtimes across your Purview accounts. Additionally, you may need to manage classifications and glossary terms for each account.

- Review your financial requirements. If possible, use chargeback or showback model for Azure services to divide the cost of Azure Purview across the organization to keep the number of Purview accounts minimum, when possible. 

- Use [Azure Purview collections](concept-best-practices-collections.md) to define and segregate access control inside the Azure Purview for your business users, data management and governance teams in the organization. For more information, see [Access control in Azure Purview](./catalog-permissions.md).

- Review [Azure Purview limits](./how-to-manage-quotas.md#azure-purview-limits) before deploying any new Purview accounts. Currently the default limit of Purview accounts per region, per tenant (all subscriptions combined) is 3. You may need to contact Microsoft support to increase this limit in your subscription or tenant before deploying additional instances of Azure Purview.  

- Review [Azure Purview prerequisites](./create-catalog-portal.md#prerequisites) before deploying any new Purview accounts in your environment.
  
## Next steps
-  [Create a Purview account](./create-catalog-portal.md)