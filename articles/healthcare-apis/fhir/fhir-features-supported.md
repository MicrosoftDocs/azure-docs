---
title: Supported FHIR features in FHIR service 
description: This article explains which features of the FHIR specification that are implemented in Azure Health Data Services
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/06/2022
ms.author: kesheth
---

# Supported FHIR Features

FHIR&reg; service in Azure Health Data Services (hereby called FHIR service) provides a fully managed deployment of the [open-source FHIR Server](https://github.com/microsoft/fhir-server) and is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document lists the main features of the FHIR service.

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
| patch                          | Yes       | Yes       | Support for [JSON Patch and FHIRPath Patch](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) only. |
| patch (conditional)            | Yes       | Yes       | Support for [JSON Patch and FHIRPath Patch](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) only. |
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

| Search parameter type | Azure API for FHIR | FHIR service in Azure Health Data Services| Comment |
|------------------------|-----------|-----------|---------|
| [$export](../../healthcare-apis/data-transformation/export-data.md) (whole system) | Yes       | Yes       | Supports system, group, and patient. |
| [$convert-data](../../healthcare-apis/data-transformation/convert-data.md)          | Yes       | Yes       |         |
| [$validate](validation-against-profiles.md)              | Yes       | Yes       |         |
| [$member-match](tutorial-member-match.md)          | Yes       | Yes       |         |
| [$patient-everything](patient-everything.md)    | Yes       | Yes       |         |
| [$purge-history](purge-history.md)         | Yes       | Yes       |         |

## Role-based access control

FHIR service uses [Microsoft Entra ID](https://azure.microsoft.com/services/active-directory/) for access control. 

## Service limits

* **Bundle size** - Each bundle is limited to 500 items.

* **Subscription Limit** - By default, each subscription is limited to a maximum of 10 FHIR services. The limit can be used in one or many workspaces. 

## Next steps

In this article, you've read about the supported FHIR features in the FHIR service. For information about deploying FHIR service, see
 
>[!div class="nextstepaction"]
>[Deploy FHIR service](fhir-portal-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
