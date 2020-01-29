---
title: Supported FHIR features in Azure - Azure API for FHIR 
description: This article explains which features of the FHIR specification that are implemented in Azure API for FHIR
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/07/2019
ms.author: mihansen
---

# Features

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document lists the main features of the FHIR Server.

## FHIR version

Latest version supported: `4.0.0`

Previous versions also currently supported include: `3.0.1`

## REST API

| API                            | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment                                             |
|--------------------------------|-----------|-----------|-----------|-----------------------------------------------------|
| read                           | Yes       | Yes       | Yes       |                                                     |
| vread                          | Yes       | Yes       | Yes       |                                                     |
| update                         | Yes       | Yes       | Yes       |                                                     |
| update with optimistic locking | Yes       | Yes       | Yes       |                                                     |
| update (conditional)           | Yes       | Yes       | Yes       |                                                     |
| patch                          | No        | No        | No        |                                                     |
| delete                         | Yes       | Yes       | Yes       |                                                     |
| delete (conditional)           | No        | No        | No        |                                                     |
| create                         | Yes       | Yes       | Yes       | Support both POST/PUT                               |
| create (conditional)           | Yes       | Yes       | Yes       |                                                     |
| search                         | Partial   | Partial   | Partial   | See below                                           |
| capabilities                   | Yes       | Yes       | Yes       |                                                     |
| batch                          | No        | No        | No        |                                                     |
| transaction                    | No        | No        | No        |                                                     |
| history                        | Yes       | Yes       | Yes       |                                                     |
| paging                         | Partial   | Partial   | Partial   | `self` and `next` are supported                     |
| intermediaries                 | No        | No        | No        |                                                     |

## Search

All search parameter types are supported. Chained parameters and reverse chaining are *not* supported.

| Search parameter type | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-----------------------|-----------|-----------|-----------|---------|
| Number                | Yes       | Yes       | Yes       |         |
| Date/DateTime         | Yes       | Yes       | Yes       |         |
| String                | Yes       | Yes       | Yes       |         |
| Token                 | Yes       | Yes       | Yes       |         |
| Reference             | Yes       | Yes       | Yes       |         |
| Composite             | Yes       | Yes       | Yes       |        |
| Quantity              | Yes       | Yes       | Yes       |Issue [#103](https://github.com/Microsoft/fhir-server/issues/103) |
| URI                   | Yes       | Yes       | Yes       |         |
| Special               | No        | No        | No        |        


| Modifiers             | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-----------------------|-----------|-----------|-----------|---------|
|`:missing`             | Yes       | Yes       | Yes       |         |
|`:exact`               | Yes       | Yes       | Yes       |         |
|`:contains`            | Yes       | Yes       | Yes       |         |
|`:text`                | Yes       | Yes       | Yes       |         |
|`:in` (token)          | No        | No        | No        |         |
|`:below` (token)       | No        | No        | No        |         |
|`:above` (token)       | No        | No        | No        |         |
|`:not-in` (token)      | No        | No        | No        |         |
|`:[type]` (reference)  | No        | No        | No        |         |
|`:below` (uri)         | Yes       | Yes       | Yes       |         |
|`:above` (uri)         | No        | No        | No        | Issue [#158](https://github.com/Microsoft/fhir-server/issues/158) |

| Common search parameter | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-------------------------| ----------| ----------| ----------|---------|
| `_id`                   | Yes       | Yes       | Yes       |         |
| `_lastUpdated`          | Yes       | Yes       | Yes       |         |
| `_tag`                  | Yes       | Yes       | Yes       |         |
| `_profile`              | Yes       | Yes       | Yes       |         |
| `_security`             | Yes       | Yes       | Yes       |         |
| `_text`                 | No        | No        | No        |         |
| `_content`              | No        | No        | No        |         |
| `_list`                 | No        | No        | No        |         |
| `_has`                  | No        | No        | No        |         |
| `_type`                 | Yes       | Yes       | Yes       |         |
| `_query`                | No        | No        | No        |         |

| Search operations       | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-------------------------|-----------|-----------|-----------|---------|
| `_filter`               | No        | No        | No        |         |
| `_sort`                 | No        | No        | No        |         |
| `_score`                | No        | No        | No        |         |
| `_count`                | Yes       | Yes       | Yes       |         |
| `_summary`              | Partial   | Partial   | Partial   | `_summary=count` is supported |
| `_include`              | No        | Yes       | No        |         |
| `_revinclude`           | No        | No        | No        |         |
| `_contained`            | No        | No        | No        |         |
| `_elements`             | No        | No        | No        |         |

## Persistence

The Microsoft FHIR Server has a pluggable persistence module (see [`Microsoft.Health.Fhir.Core.Features.Persistence`](https://github.com/Microsoft/fhir-server/tree/master/src/Microsoft.Health.Fhir.Core/Features/Persistence)).

Currently the FHIR Server open-source code includes an implementation for [Azure Cosmos DB](../cosmos-db/index-overview.md) and [SQL Database](https://azure.microsoft.com/services/sql-database/).

Cosmos DB is a globally distributed multi-model (SQL API, MongoDB API, etc.) database. It supports different [consistency levels](../cosmos-db/consistency-levels.md). The default deployment template configures the FHIR Server with `Strong` consistency, but the consistency policy can be modified (generally relaxed) on a request by request basis using the `x-ms-consistency-level` request header.

## Role-based access control

The FHIR Server uses [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for access control. Specifically, Role-Based Access Control (RBAC) is enforced, if the `FhirServer:Security:Enabled` configuration parameter is set to `true`, and all requests (except `/metadata`) to the FHIR Server must have `Authorization` request header set to `Bearer <TOKEN>`. The token must contain one or more roles as defined in the `roles` claim. A request will be allowed if the token contains a role that allows the specified action on the specified resource.

Currently, the allowed actions for a given role are applied *globally* on the API.

## Next steps

In this article, you've read about the supported FHIR features in Azure API for FHIR. Next deploy the Azure API for FHIR.
 
>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md)