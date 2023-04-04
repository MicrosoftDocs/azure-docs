---
title: API versioning for DICOM service - Azure Health Data Services
description: This guide gives an overview of the API version policies for the DICOM service. 
services: healthcare-apis
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 10/13/2022
ms.author: mmitrik
---

# API versioning for DICOM service

This reference guide provides you with an overview of the API version policies for the DICOM service. 

All versions of the DICOM APIs will always conform to the DICOMweb™ Standard specifications, but versions may expose different APIs based on the [DICOM Conformance Statement](dicom-services-conformance-statement.md).

## Specifying version of REST API in requests

The version of the REST API must be explicitly specified in the request URL as in the following example:

`<service_url>/v<version>/studies`

> [!NOTE]
> Routes without a version are no longer supported.

## Supported versions

Currently the supported versions are:

* v1.0-prerelease
* v1

The OpenAPI Doc for the supported versions can be found at the following url:

`<service_url>/v<version>/api.yaml`

## Prerelease versions

An API version with the label "prerelease" indicates that the version isn't ready for production, and it should only be used in testing environments. These endpoints may experience breaking changes without notice.

## How versions are incremented

We currently only increment the major version whenever there's a breaking change, which is considered to be not backwards compatible. 

Below are some examples of breaking changes (Major version is incremented):

1. Renaming or removing endpoints.
2. Removing parameters or adding mandatory parameters.
3. Changing status code.
4. Deleting a property in a response, or altering a response type at all, but it's okay to add properties to the response.
5. Changing the type of a property.
6. Behavior when an API changes such as changes in business logic used to do foo, but it now does bar.

Non-breaking changes (Version isn't incremented):

1. Addition of properties that are nullable or have a default value.
2. Addition of properties to a response model.
3. Changing the order of properties.

## Header in response

ReportApiVersions is turned on, which means we'll return the headers api-supported-versions and api-deprecated-versions when appropriate.

* api-supported-versions will list which versions are supported for the requested API. It's only returned when calling an endpoint annotated with `ApiVersion("<someVersion>")`.

* api-deprecated-versions will list which versions have been deprecated for the requested API. It's only returned when calling an endpoint annotated with `ApiVersion("<someVersion>", Deprecated = true)`.

Example:

```
[ApiVersion("1")]
[ApiVersion("1.0-prerelease", Deprecated = true)]
```

[ ![Screenshot of the API supported and deprecated versions.](media/api-supported-deprecated-versions.png) ](media/api-supported-deprecated-versions.png#lightbox)

## Next steps

In this article, you learned about the API version policies for the DICOM service. For more information about the DICOM service, see 

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)
