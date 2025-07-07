---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 01/08/2025
ms.author: danlep
ms.custom: Include file
---
You can add or update metadata properties and documentation to the synchronized APIs in your API center to help stakeholders discover, understand, and consume the APIs. Learn more about Azure API Center's [built-in and custom metadata properties](../add-metadata-properties.md).

The following table shows entity properties that can be modified in Azure API Center and properties that are set based on their values in the API source. 

| Entity       | Properties configurable in API Center                     | Properties determined in integrated API source                                           |
|--------------|-----------------------------------------|-----------------|
| API          | summary<br/>lifecycleStage<br/>termsOfService<br/>license<br/>externalDocumentation<br/>customProperties    | title<br/>description<br/>kind                   |
| API version  | lifecycleStage      | title<br/>definitions (if synchronized)                            |
| Environment  | title<br/>description<br/>kind</br>server.managementPortalUri<br/>onboarding<br/>customProperties      | server.type
| Deployment   |  title<br/>description<br/>server<br/>state<br/>customProperties    |      server.runtimeUri |

> [!NOTE]
> Resource and system IDs for entities synchronized to Azure API Center are automatically generated and can't be changed.