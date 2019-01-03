---
title: Features
description: Supported Features
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: reference
ms.date: 02/11/2019.
ms.author: mihansen
---

# Roadmap

This document contains a list of Microsoft FHIR Server for Azure features that are in various stages of planning and/or implementation.

## Role Based Access Control (RBAC)

As outlined in the [features list](fhir-features-supported.md#role-based-access-control), the current implementation of the RBAC system only allows *global* assignment of allowed actions to specific roles (as indicated by the `roles` token claim). Future work is aimed at enabling more granular (Resource specific) specification of allowed actions. The RBAC system will use a set of policies, which *may* look something like this:

```json
{
  "name": "patient",
  "resourcePermissions": [
    {
      "criteria": "/Patient/{search('Patient?identifier=http://example.com/aad|{claims('sub')}', 'id', 3600)}/*",
      "actions": {
        "default": [ "Read", "Write", "OperationDefinition/Resource-validate" ],
        "exceptions": [
          {
            "actionsToRevoke": [ "Read", "Write" ],
            "criteria": "/observation?code=https://loinc.com/codes|1235"
          }
        ]
      }
    },
    {
      "criteria": "/?_type=location,questionnaire,observation",
      "actions": {
        "default": [ "Read", "Write" ]
      }
    }
  ],
  "fieldPermissions": {
    "actions": [ "Read", "Write" ],
    "exceptions": [
      {
        "fhirPath": "Patient.name",
        "actionsToRevoke": [ "Write" ],
        "criteria": "/Patient"
      }
    ]
  }
}
```

In this example, a request with a token including the `roles` claim `patient` will be allowed `Read` and `Write` access on a Patient compartment if the claim `sub` corresponds to the `identifier` of the Patient that the request is trying to access, unless the request is to access an Observation in that Patient compartment with a specific code.

## Azure Active Directory B2C

The project plans to support [Azure AD B2C](https://azure.microsoft.com/en-us/services/active-directory-b2c/) (and possibly other identity providers). As indicated above and in the [list of features](fhir-features-supported.md#role-based-access-control), the RBAC system is based on application roles in the presented access token. This concept is not directly supported in Azure AD B2C and may also not be present in other providers. Consequently, the plan is to support the mapping of other token claims to serve as role indicator. Please see issue [#175](https://github.com/Microsoft/fhir-server/issues/175) for details.

## Azure Active Directory Proxy

The Microsoft FHIR Server uses Azure AD for identity. This presents a few challenges for [SMART on FHIR](http://docs.smarthealthit.org/) applications. As an example, Azure AD uses the `resource=` parameter in authentication requests whereas SMART on FHIR expects this parameter to be called `aud=`. The FHIR Server project has plans to implement an Azure AD proxy as part of the FHIR Server itself to provide translation between the SMART on FHIR protocol and the Azure AD naming conventions.

## Search

For a list of the search capabilities see [Features](fhir-features-supported.md). The project aims to have a full implementation of the search specification including chained search parameters.

## Extensions

Extensions are not yet supported. Documents with extensions will get stored and returned but extensions are not currently validated or indexed for search. The roadmap includes full support for extensions.

## Profiling

Profiling is not supported yet, but the project aims to support storing profiles and validating against stored profiles.

## Batch/Transaction

Currently there is no support for [batch/transaction](https://www.hl7.org/fhir/http.html#transaction). This is something we are investigating and expect to support in future releases.

## Conditional operations

Conditional operations (update, delete, create) are currently not supported. This partially ties to supporting transactions. Our roadmap includes support for conditional operations.

## FHIR Versions

The FHIR Server currently supports FHIR 3.0.1 but the intention is to support multiple versions in the future.

## Azure Data Factory Connector

Users of the Microsoft FHIR Server will want to use analytics and machine learning tools in Azure to gain insights from the data stored in the FHIR Server. [Azure Data Factory](https://azure.microsoft.com/en-us/services/data-factory/) is the natural choice for facilitating the export and transformation of data for downstream analytics. See an [example of using Data Factory with the Microsoft FHIR Server](https://github.com/hansenms/FhirDemo). This example was based on accessing the data in the FHIR Server directly through the FHIR API. One of the Microsoft FHIR Server for Azure project's goals is to provide a more direct and efficient integration with Data Factory. Specifically, the goal is to provide a first class connector to allow the FHIR Server to serve as source and sink for Data Factory.  
