---

title: Include file
description: Include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 03/01/2022
ms.author: danlep
ms.custom: Include file
---

> [!NOTE]
> WSDL import to API Management is subject to certain [limitations](../articles/api-management/api-management-api-import-restrictions.md#-wsdl). WSDL files with dependencies such as `wsdl:import` directives aren't supported. For an open-source tool to resolve and merge `wsdl:import`, `xsd:import`, and `xsd:include` dependencies in a WSDL file, see this [GitHub repo](https://github.com/Azure-Samples/api-management-schema-import).