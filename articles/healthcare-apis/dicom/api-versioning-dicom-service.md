---
title: API Versioning for DICOM service - Azure Healthcare APIs
description: This guide gives an overview of the API version policies for the DICOM service. 
services: healthcare-apis
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/04/2021
ms.author: aersoy
---

# API versioning for DICOM service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This reference guide provides you with an overview of the API version policies for the DICOM service. 

All versions of the DICOM APIs will always conform to the DICOMweb™ Standard specifications, but versions may expose different APIs based on the [DICOM Conformance Statement](dicom-services-conformance-statement.md).

## Specifying version of REST API in requests

The version of the REST API should be explicitly specified in the request URL as in the following example:

`<service_url>/v<version>/studies`

Currently routes without a version are still supported. For example, `<service_url>/studies` has the same behavior as specifying the version as v1.0-prerelease. However, we strongly recommended that you specify the version in all requests via the URL.

## Supported versions

Currently the supported versions are:

* v1.0-prerelease

The OpenApi Doc for the supported versions can be found at the following url:
 
`<service_url>/{version}/api.yaml`

## Prerelease versions

An API version with the label "prerelease" indicates that the version is not ready for production, and it should only be used in testing environments. These endpoints may experience breaking changes without notice.

## How versions are incremented

We currently only increment the major version whenever there is a breaking change, which is considered to be not backwards compatible. All minor versions are implied to be 0. All versions are in the format `Major.0`.

Below are some examples of breaking changes (Major version is incremented):

1. Renaming or removing endpoints.
2. Removing parameters or adding mandatory parameters.
3. Changing status code.
4. Deleting a property in a response, or altering a response type at all, but it's okay to add properties to the response.
5. Changing the type of a property.
6. Behavior when an API changes such as changes in business logic used to do foo, but it now does bar.

Non-breaking changes (Version is not incremented):

1. Addition of properties that are nullable or have a default value.
2. Addition of properties to a response model.
3. Changing the order of properties.

## Header in response

ReportApiVersions is turned on, which means we will return the headers api-supported-versions and api-deprecated-versions when appropriate.

* api-supported-versions will list which versions are supported for the requested API. It's only returned when calling an endpoint annotated with `ApiVersion("<someVersion>")`.

* api-deprecated-versions will list which versions have been deprecated for the requested API. It's only returned when calling an endpoint annotated with `ApiVersion("<someVersion>", Deprecated = true)`.

Example:

ApiVersion("1.0")

ApiVersion("1.0-prerelease", Deprecated = true)

[ ![API supported and deprecated versions.](media/api-supported-deprecated-versions.png) ](media/api-supported-deprecated-versions.png#lightbox)

