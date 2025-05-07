---

title: Include file
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 03/26/2024
ms.author: danlep
ms.custom: Include file
---

> [!NOTE]
> WSDL import to API Management is subject to certain [limitations](../articles/api-management/api-management-api-import-restrictions.md#-wsdl). WSDL files with `wsdl:import`, `xsd:import`, and `xsd:include` directives aren't supported. For an open-source tool to resolve and merge these dependencies in a WSDL file, see this [GitHub repo](https://github.com/Azure-Samples/api-management-schema-import).