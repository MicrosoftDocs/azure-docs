---
title: Default purview account
description: This article provides the concept of default purview account for a tenant. 
author: nayenama
ms.author: nayenama
ms.service: purview
ms.topic: conceptual
ms.date: 12/01/2021
---

# Default Microsoft Purview Account 

In general, our guidance is to have a single Microsoft Purview account for entire customer's data estate. However, there are cases in which customers would like to have multiple Microsoft Purview accounts in their organization. The top reasons for different Microsoft Purview accounts are listed below:

* Testing new configurations - Customers want to create multiple catalogs for testing out configurations such as scan or classification rules before moving the configuration to a higher environment like pre-production or production.

* Storing test/pre-production/production data separately - Customers want to create different catalogs for different kinds of data stored in different environments. 

* Conglomerates - Conglomerates often have many business units (BUs) that operate separately to the extent that they won't even share billing with each other. Hence, this might require the conglomerates to create different Microsoft Purview accounts for different BUs.

* Compliance - There are some strict compliance regulations, which treat even metadata as sensitive and require it to be in a particular geography. For the same reason customers might end up with multiple Microsoft Purview accounts per region.

Having multiple Microsoft Purview accounts in a tenant now poses the challenge of which Microsoft Purview account should all other services like PBI, Synapse connect to. A PBI admin or Synapse Admin who is given the responsibility of pairing their PBI tenant or Synapse account with right Microsoft Purview account. This is where default Microsoft Purview account will help our customers. Azure global administrator (or tenant admin) can designate a Microsoft Purview account as default Microsoft Purview account at tenant level. At any point in time a tenant can have only 0 or 1 default accounts. Once this is set PBI Admin or Synapse Admin or any user in your organization has clear understanding that this account is the "right" one, discover the same and all other services should connect to this one.

## Manage default account for tenant

* You can set default flag as 'Yes' only after the account is created. 

* Setting up wrong default account can have security implications so only Azure global administrator at tenant level (Tenant Admin) can set the default account flag as 'Yes'. 

* Changing the default account is a two-step process. First you need to change the flag as 'No' to the current default Microsoft Purview account and then set the flag as 'Yes' to the new Microsoft Purview account.

* Setting up default account is a control plane operation and hence the Microsoft Purview governance portal will not have any changes if an account is defined as default. However, in the studio you can see the account name is appended with "(default)" for the default Microsoft Purview account.

## Next steps

- [Create a Microsoft Purview account](create-catalog-portal.md)
- [Microsoft Purview Pricing](https://azure.microsoft.com/pricing/details/azure-purview/)

