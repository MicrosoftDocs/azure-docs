---
title: SMART on FHIR - Azure API for FHIR
description: This tutorial describes how to enable SMART on FHIR applications with the Azure API for FHIR.
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 10/04/2026
ms.custom: sfi-image-nochange
---

# SMART on FHIR overview

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Substitutable Medical Applications and Reusable Technologies ([SMART on FHIR&reg;](https://docs.smarthealthit.org/)) is a healthcare standard through which applications can access clinical information through a data store. It adds a security layer based on open standards including OAuth2 and OpenID Connect, to FHIR interfaces to enable integration with EHR systems. Using SMART on FHIR provides important benefits, including:
- Applications have a known method for obtaining authentication/authorization to a FHIR repository.
- Users accessing a FHIR repository with SMART on FHIR are restricted to resources associated with the user, rather than having access to all data in the repository.
- Users have the ability to grant applications access to a further limited set of their data by using SMART clinical scopes.

The following tutorials describe steps to enable SMART on FHIR applications with FHIR Service.

## Prerequisites

- An instance of the FHIR service
- .NET SDK 6.0
- [Enable cross-origin resource sharing (CORS)](configure-cross-origin-resource-sharing.md)
- [Register a public client application in Microsoft Entra ID](/azure/healthcare-apis/azure-api-for-fhir/register-public-azure-ad-client-app)
     - After registering the application, make note of the `applicationId` for the client application.
- Ensure you have access to an Azure Subscription of FHIR service to create resources and add role assignments.

## SMART on FHIR using Samples OSS (SMART on FHIR(Enhanced))

### Step 1: Set up FHIR SMART user role 
Follow the steps listed under [Manage Users: Assign Users to Role](/azure/role-based-access-control/role-assignments-portal). Any user added to role - "FHIR SMART User" is able to access the FHIR Service if their requests comply with the SMART on FHIR implementation Guide, such as request having access token, which includes a `fhirUser` claim and a clinical scopes claim.  The access granted to the users in this role will be limited by the resources associated to their `fhirUser` compartment and the restrictions in the clinical scopes.

### Step 2: FHIR server integration with samples 
[Follow the steps](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/blob/main/samples/patientandpopulationservices-smartonfhir-oncg10-smart-v1/docs/deployment.md) found in Azure Health Data and AI Samples OSS. This enables integration of FHIR server with other Azure Services (such as APIM, Azure functions and more).

> [!NOTE]
> Samples are open-source code, and you should review the information and licensing terms on GitHub before using it. They are not part of Azure Health Data Service and are not supported by Microsoft Support. These samples can be used to demonstrate how Azure Health Data Services and other open-source tools can be used together to demonstrate ONC (g)(10) compliance using Microsoft Entra ID as the identity provider workflow. 

## Next steps

Now that you've learned about enabling SMART on FHIR functionality, see the search samples page for details about how to search using search parameters, modifiers, and other FHIR search methods.

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
