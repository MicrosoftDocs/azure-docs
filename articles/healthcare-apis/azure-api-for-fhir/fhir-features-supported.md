---
title: Supported FHIR features in Azure - Azure API for FHIR 
description: This article explains which features of the FHIR specification that are implemented in Azure API for FHIR
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: ignite-2022
ms.topic: reference
ms.date: 06/03/2022
ms.author: kesheth
---

# Features

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document lists the main features of the FHIR Server.

## FHIR version

Latest version supported: `4.0.1`

Previous versions also currently supported include: `3.0.2`

## REST API

Below is a summary of the supported RESTful capabilities. For more information on the implementation of these capabilities, see [FHIR REST API capabilities](fhir-rest-api-capabilities.md).

| API    | Azure API for FHIR | FHIR service in Azure Health Data Services | Comment |
|--------|--------------------|---------------------------------|---------|
| read   | Yes                | Yes                             |         |
| vread  | Yes                | Yes                             |         |
| update | Yes                | Yes                             |         | 
| update with optimistic locking | Yes       | Yes       |
| update (conditional)           | Yes       | Yes       |
| patch                          | Yes       | Yes       | Support for [JSON Patch and FHIRPath Patch](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) only.
| patch (conditional)            | Yes       | Yes       | Support for [JSON Patch and FHIRPath Patch](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) only. |
| history                        | Yes       | Yes       |
| create                         | Yes       | Yes       | Support both POST/PUT |
| create (conditional)           | Yes       | Yes       | Issue [#1382](https://github.com/microsoft/fhir-server/issues/1382) |
| search                         | Partial   | Partial   | See [Overview of FHIR Search](overview-of-search.md). |
| chained search                 | Yes       | Yes       | See Note below. |
| reverse chained search         | Yes       | Yes       | See Note below. |
| batch                          | Yes       | Yes       |
| transaction                    | No        | Yes       |
| paging                         | Partial   | Partial   | `self` and `next` are supported                     |
| intermediaries                 | No        | No        |

> [!Note] 
> In the Azure API for FHIR and the open-source FHIR server backed by Azure Cosmos DB, the chained search and reverse chained search is an MVP implementation. To accomplish chained search on Azure Cosmos DB, the implementation walks down the search expression and issues sub-queries to resolve the matched resources. This is done for each level of the expression. If any query returns more than 1000 results, an error will be thrown.

## Extended Operations

All the operations that are supported that extend the REST API.

| Search parameter type | Azure API for FHIR | FHIR service in Azure Health Data Services| Comment |
|------------------------|-----------|-----------|---------|
| [$export](../../healthcare-apis/data-transformation/export-data.md) | Yes       | Yes       | Supports system, group, and patient.   |
| [$convert-data](convert-data.md)          | Yes       | Yes       |         |
| [$validate](validation-against-profiles.md)              | Yes       | Yes       |         |
| [$member-match](tutorial-member-match.md)          | Yes       | Yes       |         |
| [$patient-everything](patient-everything.md)    | Yes       | Yes       |         |
| [$purge-history](purge-history.md)         | Yes       | Yes       |         |

## Persistence

The Microsoft FHIR Server has a pluggable persistence module (see [`Microsoft.Health.Fhir.Core.Features.Persistence`](https://github.com/Microsoft/fhir-server/tree/master/src/Microsoft.Health.Fhir.Core/Features/Persistence)).

Currently the FHIR Server open-source code includes an implementation for [Azure Cosmos DB](../../cosmos-db/index-overview.md) and [SQL Database](https://azure.microsoft.com/services/sql-database/).

Azure Cosmos DB is a globally distributed multi-model (NoSQL, MongoDB, and others) database. It supports different [consistency levels](../../cosmos-db/consistency-levels.md). The default deployment template configures the FHIR Server with `Strong` consistency, but the consistency policy can be modified (generally relaxed) on a request by request basis using the `x-ms-consistency-level` request header.

## Role-based access control

The FHIR Server uses [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for access control. Specifically, role-based access control (RBAC) is enforced, if the `FhirServer:Security:Enabled` configuration parameter is set to `true`, and all requests (except `/metadata`) to the FHIR Server must have `Authorization` request header set to `Bearer <TOKEN>`. The token must contain one or more roles as defined in the `roles` claim. A request will be allowed if the token contains a role that allows the specified action on the specified resource.

Currently, the allowed actions for a given role are applied *globally* on the API.

## Service limits

* [**Request Units (RUs)**](../../cosmos-db/concepts-limits.md) - You can configure up to 100,000 RUs in the portal for Azure API for FHIR. You'll need a minimum of 400 RUs or 40 RUs/GB, whichever is larger. If you need more than 100,000 RUs, you can put in a support ticket to have the RUs increased. The maximum available is 1,000,000. In addition, we support [autoscaling of RUs](autoscale-azure-api-fhir.md).

* **Bundle size** - Each bundle is limited to 500 items.

* **Data size** - Data/Documents must each be slightly less than 2 MB.

* **Subscription limit** - By default, each subscription is limited to a maximum of 10 FHIR server instances. If you need more instances per subscription, open a support ticket and provide details about your needs.

## Next steps

In this article, you've read about the supported FHIR features in Azure API for FHIR. For information about deploying Azure API for FHIR, see
 
>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-portal-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
