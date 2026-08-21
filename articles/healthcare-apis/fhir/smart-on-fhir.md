---
title: SMART on FHIR in Azure Health Data Services
description: Learn how to enable SMART on FHIR applications with Azure Health Data Services FHIR service for secure clinical data access.
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 08/20/2026
ms.custom: sfi-image-nochange
---

# SMART on FHIR

Azure Health Data Services (AHDS) FHIR service supports Substitutable Medical Applications and Reusable Technologies ([SMART on FHIR](https://docs.smarthealthit.org/)) by implementing the key server-side behaviors required for SMART clients to securely access FHIR data by using OAuth 2.0 and OpenID Connect. SMART on FHIR is an implementation guide through which applications can access clinical information through a data store. It adds a security layer based on open standards including OAuth2 and OpenID Connect, to FHIR&reg; interfaces to enable integration with EHR systems. Using SMART on FHIR provides at least three important benefits:
- Applications have a known method for obtaining authentication and authorization to a FHIR repository.
- Users accessing a FHIR repository with SMART on FHIR are restricted to resources associated with the user, rather than having access to all data in the repository.
- Users have the ability to grant applications access to a limited set of their data by using SMART clinical scopes.

## Prerequisites

Before you begin, make sure you have:

1. An AHDS FHIR service instance.
1. Permissions to configure FHIR authentication settings.
1. An identity provider strategy:
     Microsoft Entra ID plus an orchestration layer, or
     A SMART-aware third-party identity provider.
1. A test patient in your FHIR store.
1. A SMART client application (or the SmartLauncher sample for validation).

## End-to-end flow

A SMART client typically performs these steps:

1. Discover: Call `/.well-known/smart-configuration` on the FHIR server to find endpoints and capabilities.
1. Authorize: Redirect the user to the authorization endpoint with requested SMART scopes. 
1. Token: Exchange authorization code for an access token, then call FHIR APIs with the bearer token.
1. Call FHIR APIs: Send the bearer token to the FHIR endpoint. Access is constrained by scopes and context.

## Configure access for end users

Assign users to the FHIR SMART user role by using Azure role assignment guidance: [Assign Users to Role](/azure/role-based-access-control/role-assignments-portal). Users in this role can access the FHIR service when requests satisfy SMART requirements.

> [!NOTE]
> The SMART user role by itself doesn't grant access to data. Each request is further limited by the `fhirUser` context and the SMART clinical scopes in the access token. See [SMART user role capabilities](#smart-user-role-capabilities).

## SMART user role capabilities

The SMART user role supports read and search interactions. The scopes in the access token determine which resource types a request can reach, and the `fhirUser` claim determines whose data is in reach.

### Supported FHIR interactions

| SMART v2 verb | SMART v1 equivalent | Permitted interaction |
| --- | --- | --- |
| `r` (read) | `read` | Read a resource by ID (`GET [type]/[id]`). |
| `s` (search) | `read` | Search (`GET [type]?[params]`), and `$export` where a system scope applies. |

> [!NOTE]
> In SMART v2, `r` grants read-by-ID only. A client that needs to search must also request `s`. For example, `patient/Observation.r` can't run a search. Use `patient/Observation.rs` instead.

### Interactions not available to the SMART user role

The following interactions and operations aren't available to a user with only this role. Some rows apply even when the scopes in the token grant the underlying interaction.

| Interaction or operation | Reason |
| --- | --- |
| `$bulk-update` and `$bulk-delete` (start, check status, cancel) | Administrative operation. |
| `$convert-data` | Administrative operation. |
| `$export` with `patient/` or `user/` scopes, or with scopes that carry search-parameter constraints | `$export` requires `system/` scopes without search-parameter constraints. |
| `$import` (start, check status, cancel) | Administrative operation. |
| `$member-match` | Not available to SMART users when the SMART member-match restriction is enabled. The system rejects the request as unauthorized. |
| `$reindex` (start, check status, cancel) | Administrative operation. |
| `$validate` | Requires an administrative role. |
| `_include`, `_revinclude`, chained searches (for example, `subject.name`), and reverse-chained searches (`_has`) that reach an uncovered resource type | The system rejects the search when it would return a resource type that the scopes in the token don't cover. |
| Create, update, patch, or delete a resource (`POST`, `PUT`, `PATCH`, `DELETE`) | Write interactions aren't supported. |
| Update custom search parameter status (`$status`) | Administrative operation. |

## Identity provider support

FHIR service provides integration with Microsoft Entra ID or third-party identity providers (IDP) that understand SMART launch context and SMART scope semantics.

The SMART on FHIR specification defines launch context as a set of parameters that are conveyed during the authorization flow and returned as part of the token response. These parameters typically include identifiers such as the patient ID, encounter ID, and the FHIR user (for example, a practitioner or patient), along with optional fields. Technically, this context is passed into the SMART workflow through a parameter called `launch`, which is intentionally opaque to the application. The application simply receives and forwards this value during the authorization process. This `launch` parameter maps to a stored context record, which contains the actual patient and encounter identifiers. During the token exchange step, this context is resolved and returned alongside the access token so that the application can make correctly scoped API calls. This mechanism ensures that when an app accesses FHIR data, it operates within a clearly defined clinical boundary.

Identity providers are responsible for authenticating users and issuing tokens, but they don't have visibility into clinical workflows. The application must determine an appropriate patient context, either by prompting the user, selecting a patient from a list, or retrieving it from another system. Regardless of how this context is established, the application must include it in the token that it uses to call the FHIR service.

This architecture provides an orchestration layer that acts as the bridge between the identity provider, the clinical system (such as an EHR), and the FHIR service. 

### Sample integration

Use the [Azure Health Data and AI Samples open source repo](https://github.com/Azure-Samples/azure-health-data-and-ai-samples) to set up the SMART on FHIR experience. The repository provides the sample [SMART on FHIR v2 — Native IdP-Agnostic Sample](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/smartonfhir-smartnative-v2). 

This sample demonstrates the creation of an orchestration layer that acts as the bridge between the identity provider, the clinical system (such as an EHR), and the FHIR service. It supports both Microsoft Entra ID or an external identity provider (for example, Okta). See the sample repository for detailed instructions on how to configure and run the sample.

> [!NOTE]
> Samples are open-source code, and you should review the information and licensing terms on GitHub before using them. They're not part of the Azure Health Data Service and Microsoft Support doesn't support them. These samples demonstrate how Azure Health Data Services (AHDS) and other open-source tools can be used together to demonstrate [§170.315(g)(10) Standardized API for patient and population services criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg) compliance, using Microsoft Entra ID as the identity provider workflow.  

#### Microsoft Entra ID integration

Microsoft Entra ID is a full-featured OAuth 2.0 and OpenID Connect identity provider. To integrate Microsoft Entra ID as the identity provider, you need extra components to complete the end-to-end SMART on FHIR experience. This requirement exists because SMART on FHIR introduces behaviors that enterprise identity providers like Entra ID don't natively support. To bridge this gap, Microsoft provides reference solutions (samples). The sample provides an orchestration layer between SMART clients and Entra ID.

The sample supports the following scenarios for Microsoft Entra ID:

1. A scope value such as `patient/Patient.rs` isn't a registered Entra ID permission, so Entra ID rejects the authorize request.
1. It doesn't offer a per-request scope picker for the SMART resource verbs. Entra's consent screen reflects pre-registered application permissions, not the dynamic `patient/<Resource>.<verbs>` the SMART app sends on each launch.
1. It doesn't advertise a SMART discovery document — smart-configuration is FHIR-server territory, not IdP territory.


## SMART on FHIR v1/v2 support

AHDS FHIR service supports SMART v1.0.0 and SMART v2.0.0. You can't mix and match SMART v1.0.0 and SMART v2.0.0 scopes in the same client app registration. You must choose one or the other. 


## Migrate from SMART on FHIR Proxy to SMART on FHIR

<details>
<summary>Click to expand</summary>

1. **Configure native SMART on FHIR** — Set up your identity provider (Microsoft Entra ID) to support SMART on FHIR capabilities natively, including registering SMART client applications and configuring the appropriate FHIR SMART user roles.
1. **Update client applications** — Modify any client applications currently using the proxy endpoint to point to the native FHIR service endpoint and use the native SMART authorization flow.
1. **Disable the SMART on FHIR proxy** — Uncheck the SMART on FHIR proxy setting under the Authentication blade for the FHIR service and save the changes.

</details>

## Next steps

Now that you understand how to enable SMART on FHIR functionality, see the search samples page for details about how to search by using search parameters, modifiers, and other FHIR search methods.

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]