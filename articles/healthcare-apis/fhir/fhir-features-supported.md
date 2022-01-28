---
title: Supported FHIR features in the FHIR service 
description: This article explains which features of the FHIR specification that are implemented in Healthcare APIs
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/11/2021
ms.author: cavoeg
---

# Supported FHIR Features

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The FHIR&reg; service in Azure Healthcare APIs (hereby called the FHIR service) provides a fully managed deployment of the [open-source FHIR Server](https://github.com/microsoft/fhir-server) and is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document lists the main features of the FHIR service.

## FHIR version

Latest version supported: `4.0.1`

Previous versions also currently supported include: `3.0.2`

## REST API

Below is a summary of the supported RESTful capabilities. For more information on the implementation of these capabilities, see [FHIR REST API capabilities](fhir-rest-api-capabilities.md). 

| API    | Azure API for FHIR | FHIR service in Healthcare APIs | Comment |
|--------|--------------------|---------------------------------|---------|
| read   | Yes                | Yes                             |         |
| vread  | Yes                | Yes                             |         |
| update | Yes                | Yes                             |         | 
| update with optimistic locking | Yes       | Yes       |
| update (conditional)           | Yes       | Yes       |
| patch                          | Yes       | Yes       | Support for [JSON Patch](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) only. |
| patch (conditional)            | Yes       | Yes       |
| history                        | Yes       | Yes       |
| create                         | Yes       | Yes       | Support both POST/PUT |
| create (conditional)           | Yes       | Yes       | Issue [#1382](https://github.com/microsoft/fhir-server/issues/1382) |
| search                         | Partial   | Partial   | See [Overview of FHIR Search](overview-of-search.md). |
| chained search                 | Yes       | Yes       | |
| reverse chained search         | Yes       | Yes       | |
| batch                          | Yes       | Yes       |
| transaction                    | No        | Yes       |
| paging                         | Partial   | Partial   | `self` and `next` are supported                     |
| intermediaries                 | No        | No        |

## Extended Operations

All the operations that are supported that extend the REST API.

| Search parameter type | Azure API for FHIR | FHIR service in Healthcare APIs| Comment |
|------------------------|-----------|-----------|---------|
| [$export](../../healthcare-apis/data-transformation/export-data.md) (whole system) | Yes       | Yes       | Supports system, group, and patient. |
| [$convert-data](../../healthcare-apis/data-transformation/convert-data.md)          | Yes       | Yes       |         |
| [$validate](validation-against-profiles.md)              | Yes       | Yes       |         |
| [$member-match](tutorial-member-match.md)          | Yes       | Yes       |         |
| [$patient-everything](patient-everything.md)    | Yes       | Yes       |         |
| $purge-history         | Yes       | Yes       |         |

## Role-based access control

The FHIR service uses [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for access control. 

## Service limits

* **Bundle size** - Each bundle is limited to 500 items.

* **Subscription Limit** - By default, each subscription is limited to a maximum of 10 FHIR services. The limit can be used in one or many workspaces. 

## Next steps

In this article, you've read about the supported FHIR features in the FHIR service. For information about deploying the FHIR service, see
 
>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)
