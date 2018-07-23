---
title: Migration from Azure Germany to global Azure
description: Main intro to the rest of the articles.
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Introduction

some fancy introduction here to replace this sentence

## Why these extra migration articles?

These articles will provide you some help to migrate your workloads from Azure Germany to global Azure. Although Azure already provides tools to migrate resources at the [Azure Migration Center](https://azure.microsoft.com/migration/), some of these tools are designed only for migrations inside the same tenant or the same region. 

The two regions in Germany are strictly separated from global Azure, same as Azure Active Directory. As a result, Azure tenants are always different between global Azure and Azure Germany. 

Some of the standard migration tools are based on moving resources only inside the *same* tenant. When migrating between *different* tenants, it's good to know which tools are available.

## Terms

These terms are used in the following migration articles:

*Source* describes where you come from (for example Azure Germany):

- Source tenant name: Name of the Tenant in Azure Germany (everything after the "@" in the account name). Tenant names in Azure Germany are all ending on *microsoftazure.de*.
- Source tenant ID: The ID of the tenant in Azure Germany. The tenant ID shows up in the Azure portal when moving the mouse over the account name at the upper right corner.
- Source subscription ID: You can have more than one subscription under the same tenant. Always make sure that you're using the correct subscription.
- Source region: Either "**Germany Central**" ("**germanycentral**") or "**Germany Northeast**" ("**germanynortheast**"), depending on where the resource you want to migrate is located.

*Target* or *Destination* describes where you migrate to:

- Target tenant name: Like Source tenant name, but in Azure public.
- Target tenant ID: Like Source tenant ID.
- Target subscription ID: Like source subscription ID
- Target region: You can use nearly any region in global Azure, but most likely you want to migrate to "**West Europe**" ("**westeurope**") or "**North Europe**" ("**northeurope**").

> [!NOTE]
> Please verify that the service you are migrating is offered in the target region. All Azure services available in Azure Germany are available in **West Europe**. All Azure services available in Azure Germany are also available in **North Europe**, except for G/GS VM series and Machine Learning Studio.

Don't forget to update your start page (or favorite links) in your browser. While Azure Germany portal is available under [https://portal.microsoftazure.de/](https://portal.microsoftazure.de/), the global Azure portal can be reached under [https://portal.azure.com/](https://portal.azure.com/).

### Links

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Mobile](./germany-migration-mobile.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [AI & Machine Learning](./germany-migration-ai-ml.md)
- [Internet of Things (IoT)](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Managementtools](./germany-migration-managementtools.md)
- [Media](./germany-migration-media.md)
