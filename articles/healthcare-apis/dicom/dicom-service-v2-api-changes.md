---
title: DICOM Service API v2 Changes - Azure Health Data Services
description: This guide gives an overview of the changes in the v2 API for the DICOM service. 
services: healthcare-apis
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 7/21/2023
ms.author: mmitrik
---

# DICOM Service API v2 Changes

This reference guide provides you with a summary of the changes in the V2 API of the DICOM service. To see the full set of capabilities in v2, see the [DICOM Conformance Statement v2](dicom-services-conformance-statement-v2.md).

## Summary of changes in v2

### Store

#### Lenient validation of optional attributes
In previous versions, a Store request would fail if any of the [required](dicom-services-conformance-statement-v2.md#store-required-attributes) or [searchable attributes](dicom-services-conformance-statement-v2.md#searchable-attributes) failed validation. Beginning with v2, the request fails only if **required attributes** fail validation.

Failed validation of attributes not required by the API results in the file being stored with a warning in the response. Warnings result in an HTTP return code of `202 Accepted` and the response payload will contain the `WarningReason` tag (`0008, 1196`).  

A warning is given about each failing attribute per instance. When a sequence contains an attribute that fails validation, or when there are multiple issues with a single attribute, only the first failing attribute reason is noted.

There are some notable behaviors for optional attributes that fail validation:
 * Searches for the attribute that failed validation will not return the study/series/instance.
 * The attributes are not returned when retrieving metadata via WADO `/metadata` endpoints.
 
Retrieving a study/series/instance will always return the original binary files with the original attributes, even if those attributes failed validation.  

If an attribute is padded with nulls, the attribute is indexed when searchable and is stored as is in dicom+json metadata. No validation warning is provided.

### Retrieve 

#### Single frame retrieval support
Single frame retrieval is supported by adding the following `Accept` header:
* `application/octet-stream; transfer-syntax=*` 

### Search 

#### Search results may be incomplete for extended query tags with validation warnings
In the v1 API and continued for v2, if an [extended query tag](dicom-extended-query-tags-overview.md) has any errors, because one or more of the existing instances had a tag value that couldn't be indexed, then subsequent search queries containing the extended query tag return `erroneous-dicom-attributes` as detailed in the [documentation](dicom-extended-query-tags-overview.md#tag-query-status). However, tags (also known as attributes) with validation warnings from STOW-RS are **not** included in this header. If a store request results in validation warnings on [searchable tags](dicom-services-conformance-statement-v2.md#searchable-attributes), subsequent searches containing these tags won't consider any DICOM SOP instance that produced a warning. This behavior may result in incomplete search results. To correct an attribute, delete the stored instance and upload the corrected data.

#### Fewer Study, Series, and Instance attributes are returned by default
The set of attributes returned by default has been reduced to improve performance. See the detailed list in the [search response](./dicom-services-conformance-statement-v2.md#search-response) documentation.

#### Null padded attributes can be searched for with or without padding
When an attribute was stored using null padding, it can be searched for with or without the null padding in uri encoding. Results retrieved will be for attributes stored both with and without null padding.

### Operations

#### The `completed` status has been renamed to `succeeded`
To align with [Microsoft's REST API guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md), the `completed` status has been renamed to `succeeded`.

### Change Feed

#### Change feed now accepts a time range
The Change Feed API now accepts optional `startTime` and `endTime` parameters to help scope the results. Changes within a time range can still be paginated using the existing `offset` and `limit` parameters. The offset is relative to the time window defined by `startTime` and `endTime`. For example, the fifth change feed entry starting from 7/24/2023 at 09:00 AM UTC would use the query string `?startTime=2023-07-24T09:00:00Z&offset=5`.

For v2, it's recommended to always include a time range to improve performance.