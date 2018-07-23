---
title: Migration from Azure Germany to public Azure
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

These articles are intend to provide you some help to migrate your workloads from Azure Germany to public Azure. Although Azure already provides tools to migrate resources at the [Azure Migration Center](https://azure.microsoft.com/migration/), some of these tools are limited in a way that is not suitable for the special architecture the Azure Germany was built upon. The two regions in Germany are strictly separated from public Azure, and that includes also the Azure Active Directory. As a result, Azure tenants are always different between public Azure and Azure Germany. Since some of the standard migration tools are based on moving resources only inside the same tenant, you need to know which tools for which type of resources you can use when migrating between different tenants.

## Terms

For a better understanding, we are using these terms in the following migration articles:

To describe where you come from (i.e. Azure Germany) we use the word *source*:

- Source tenant name: Name of the Tenant in Azure Germany (everything after the "@" in the login name). Tenant names in Azure Germany are all ending on *microsoftazure.de*.
- Source tenant ID: The ID of the tenant in Azure Germany. You can see the tenant ID when you are logged into the Azure portal by moving the mouse over the upper right corner where your login name appears.
- Source subscription ID: You might have more than one subscription under the same (source) tenant, this is the ID of a subscription where you move a resource out of.
- Source region: This is either "**Germany Central**" ("**germanycentral**") or "**Germany Northeast**" ("**germanynortheast**"), depending on where the resource you want to migrate is located.

To describe where you migrate to we use the word *target* or *destination*:

- Target tenant name: Like Source tenant name, but in Azure public.
- Target tenant ID: Like Source tenant ID.
- Target subscription ID: Like source subscription ID
- Target region: You can use nearly any region in public Azure, but most likely you want to migrate to "**West Europe**" ("**westeurope**") or "**North Europe**" ("**northeurope**").

> [!NOTE]
> Please verify that the service you are migrating is offered in the target region. All Azure services available in Azure Germany are available in **West Europe**. All Azure services available in Azure Germany are also available in **North Europe**, except for G/GS VM series and Machine Learning Studio.

Please also update your startpage (or favorite links) in your browser. While Azure Germany portal is available under [https://portal.microsoftazure.de/](https://portal.microsoftazure.de/), the public Azure portal can be reached under [https://portal.azure.com/](https://portal.azure.com/).

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
