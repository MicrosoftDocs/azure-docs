---
title: Supported FHIR features in Azure - Azure API for FHIR 
description: This article explains which features of the FHIR specification that are implemented in Azure API for FHIR
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 4/15/2021
ms.author: cavoeg
---

# Features

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document lists the main features of the FHIR Server.

## FHIR version

Latest version supported: `4.0.1`

Previous versions also currently supported include: `3.0.2`

## REST API

| API                            | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment                                             |
|--------------------------------|-----------|-----------|-----------|-----------------------------------------------------|
| read                           | Yes       | Yes       | Yes       |                                                     |
| vread                          | Yes       | Yes       | Yes       |                                                     |
| update                         | Yes       | Yes       | Yes       |                                                     |
| update with optimistic locking | Yes       | Yes       | Yes       |                                                     |
| update (conditional)           | Yes       | Yes       | Yes       |                                                     |
| patch                          | No        | No        | No        |                                                     |
| delete                         | Yes       | Yes       | Yes       |  See Note  below.                                   |
| delete (conditional)           | No        | No        | No        |                                                     |
| history                        | Yes       | Yes       | Yes       |                                                     |
| create                         | Yes       | Yes       | Yes       | Support both POST/PUT                               |
| create (conditional)           | Yes       | Yes       | Yes       | Issue [#1382](https://github.com/microsoft/fhir-server/issues/1382) |
| search                         | Partial   | Partial   | Partial   | See Search section below.                           |
| chained search                 | Partial       | Yes       | Partial   | See Note 2 below.                                   |
| reverse chained search         | Partial       | Yes       | Partial   | See Note 2 below.                                   |
| capabilities                   | Yes       | Yes       | Yes       |                                                     |
| batch                          | Yes       | Yes       | Yes       |                                                     |
| transaction                    | No        | Yes       | No        |                                                     |
| paging                         | Partial   | Partial   | Partial   | `self` and `next` are supported                     |
| intermediaries                 | No        | No        | No        |                                                     |

> [!Note]
> Delete defined by the FHIR spec requires that after deleting, subsequent non-version specific reads of a resource returns a 410 HTTP status code and the resource is no longer found through searching. The Azure API for FHIR also enables you to fully delete (including all history) the resource. To fully delete the resource, you can pass a parameter settings `hardDelete` to true (`DELETE {server}/{resource}/{id}?hardDelete=true`). If you do not pass this parameter or set `hardDelete` to false, the historic versions of the resource will still be available.


 **Note 2**
* Adds MVP support for Chained and Reverse Chained FHIR Search in CosmosDB. 

  In the Azure API for FHIR and the open-source FHIR server backed by Cosmos, the chained search and reverse chained search is an MVP implementation. To accomplish chained search on Cosmos DB, the implementation walks down the search expression and issues sub-queries to resolve the matched resources. This is done for each level of the expression. If any query returns more than 100 results, an error will be thrown. By default, chained search is behind a feature flag. To use the chained searching on Cosmos DB, use the header `x-ms-enable-chained-search: true`. For more details, see [PR 1695](https://github.com/microsoft/fhir-server/pull/1695).

## Search

All search parameter types are supported. 

| Search parameter type | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-----------------------|-----------|-----------|-----------|---------|
| Number                | Yes       | Yes       | Yes       |         |
| Date/DateTime         | Yes       | Yes       | Yes       |         |
| String                | Yes       | Yes       | Yes       |         |
| Token                 | Yes       | Yes       | Yes       |         |
| Reference             | Yes       | Yes       | Yes       |         |
| Composite             | Yes       | Yes       | Yes       |         |
| Quantity              | Yes       | Yes       | Yes       |         |
| URI                   | Yes       | Yes       | Yes       |         |
| Special               | No        | No        | No        |         |


| Modifiers             | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-----------------------|-----------|-----------|-----------|---------|
|`:missing`             | Yes       | Yes       | Yes       |         |
|`:exact`               | Yes       | Yes       | Yes       |         |
|`:contains`            | Yes       | Yes       | Yes       |         |
|`:text`                | Yes       | Yes       | Yes       |         |
|`:[type]` (reference)  | Yes       | Yes       | Yes       |         |
|`:not`                 | Yes       | Yes       | Yes       |         |
|`:below` (uri)         | Yes       | Yes       | Yes       |         |
|`:above` (uri)         | No        | No        | No        | Issue [#158](https://github.com/Microsoft/fhir-server/issues/158) |
|`:in` (token)          | No        | No        | No        |         |
|`:below` (token)       | No        | No        | No        |         |
|`:above` (token)       | No        | No        | No        |         |
|`:not-in` (token)      | No        | No        | No        |         |

| Common search parameter | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-------------------------| ----------| ----------| ----------|---------|
| `_id`                   | Yes       | Yes       | Yes       |         |
| `_lastUpdated`          | Yes       | Yes       | Yes       |         |
| `_tag`                  | Yes       | Yes       | Yes       |         |
| `_list`                 | Yes       | Yes       | Yes       |         |
| `_type`                 | Yes       | Yes       | Yes       | Issue [#1562](https://github.com/microsoft/fhir-server/issues/1562)        |
| `_security`             | Yes       | Yes       | Yes       |         |
| `_profile`              | Partial   | Partial   | Partial   | Supported in STU3. If you created your database **after** February 20th, 2021, you will have support in R4 as well. We are working to enable _profile on databases created prior to February 20th, 2021. |
| `_text`                 | No        | No        | No        |         |
| `_content`              | No        | No        | No        |         |
| `_has`                  | No        | No        | No        |         |
| `_query`                | No        | No        | No        |         |
| `_filter`               | No        | No        | No        |         |

| Search result parameters | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|-------------------------|-----------|-----------|-----------|---------|
| `_elements`             | Yes       | Yes       | Yes       | Issue [#1256](https://github.com/microsoft/fhir-server/issues/1256)        |
| `_count`                | Yes       | Yes       | Yes       | `_count` is limited to 1000 characters. If set to higher than 1000, only 1000 will be returned and a warning will be returned in the bundle. |
| `_include`              | Yes       | Yes       | Yes       |Included items are limited to 100. Include on PaaS and OSS on Cosmos DB does not include :iterate support.|
| `_revinclude`           | Yes       | Yes       | Yes       | Included items are limited to 100. Include on PaaS and OSS on Cosmos DB does [not include :iterate support](https://github.com/microsoft/fhir-server/issues/1313). Issue [#1319](https://github.com/microsoft/fhir-server/issues/1319)|
| `_summary`              | Partial   | Partial   | Partial   | `_summary=count` is supported |
| `_total`                | Partial   | Partial   | Partial   | `_total=none` and `_total=accurate`      |
| `_sort`                 | Partial   | Partial   | Partial   |   `_sort=_lastUpdated` is supported       |
| `_contained`            | No        | No        | No        |         |
| `containedType`         | No        | No        | No        |         |
| `_score`                | No        | No        | No        |         |

## Extended Operations

All the operations that are supported that extend the RESTful API.

| Search parameter type | Supported - PaaS | Supported - OSS (SQL) | Supported - OSS (Cosmos DB) | Comment |
|------------------------|-----------|-----------|-----------|---------|
| $export (whole system) | Yes       | Yes       | Yes       |         |
| Patient/$export        | Yes       | Yes       | Yes       |         |
| Group/$export          | Yes       | Yes       | Yes       |         |
| $convert-data          | Yes       | Yes       | Yes       |         |


## Persistence

The Microsoft FHIR Server has a pluggable persistence module (see [`Microsoft.Health.Fhir.Core.Features.Persistence`](https://github.com/Microsoft/fhir-server/tree/master/src/Microsoft.Health.Fhir.Core/Features/Persistence)).

Currently the FHIR Server open-source code includes an implementation for [Azure Cosmos DB](../../cosmos-db/index-overview.md) and [SQL Database](https://azure.microsoft.com/services/sql-database/).

Cosmos DB is a globally distributed multi-model (SQL API, MongoDB API, etc.) database. It supports different [consistency levels](../../cosmos-db/consistency-levels.md). The default deployment template configures the FHIR Server with `Strong` consistency, but the consistency policy can be modified (generally relaxed) on a request by request basis using the `x-ms-consistency-level` request header.

## Role-based access control

The FHIR Server uses [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for access control. Specifically, role-based access control (RBAC) is enforced, if the `FhirServer:Security:Enabled` configuration parameter is set to `true`, and all requests (except `/metadata`) to the FHIR Server must have `Authorization` request header set to `Bearer <TOKEN>`. The token must contain one or more roles as defined in the `roles` claim. A request will be allowed if the token contains a role that allows the specified action on the specified resource.

Currently, the allowed actions for a given role are applied *globally* on the API.

## Service limits

* [**Request Units (RUs)**](../../cosmos-db/concepts-limits.md) - You can configure up to 10,000 RUs in the portal for Azure API for FHIR. You will need a minimum of 400 RUs or 40 RUs/GB, whichever is larger. If you need more than 10,000 RUs, you can put in a support ticket to have this increased. The maximum available is 1,000,000.

* **Concurrent connections** and **Instances** - By default, you have five concurrent connections on two instances in the cluster (for a total of 10 concurrent requests). If you believe you need more concurrent requests, open a support ticket with details on your needs.

* **Bundle size** - Each bundle is limited to 500 items.

* **Data size** - Data/Documents must each be slightly less than 2 MB.

## Performance expectations

The performance of the system is dependent on the number of RUs, concurrent connections, and the type of operations you are performing (Put, Post, etc.). Below are some general ranges of what you can expect based on configured RUs. In general, performance scales linearly with an increase in RUs:

| # of RUs | Resources/sec |    Max Storage (GB)*    |
|----------|---------------|--------|                 
| 400      | 5-10          |     10   |
| 1,000    | 100-150       |      25  |
| 10,000   | 225-400       |      250  |
| 100,000  | 2,500-4,000   |      2,500  |

Note: Per Cosmos DB requirement, there is a requirement of a minimum throughput of 40 RU/s per GB of storage. 

## Next steps

In this article, you've read about the supported FHIR features in Azure API for FHIR. Next deploy the Azure API for FHIR.
 
>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md)
