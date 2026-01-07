---
title: Azure API for FHIR monthly releases 2026
description: This article provides details about the Azure API for FHIR monthly features and enhancements in 2026.
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 1/1/2026
ms.custom:
  - references_regions
  - build-2026
ms.author: evach
---

# Release notes 2026: Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR&reg; provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

## January 2026
### FHIR service

**Updates to responses for update and deletion of FHIR spec-defined search parameters**: There are a few updates to the behaviors and responses for update and deletion of FHIR spec-defined search parameters:
  - Deletion of out-of-box FHIR spec-defined search parameters previously returned a "204 No Content" and the parameter was not deleted. The response is updated to correctly return "405 Method Not Allowed."
  - Update of out-of-box FHIR spec-defined search parameters previously returned "201 Created", which can cause unintended behavior. The response is updated to return "405 Method Not Allowed." If you wish to update an out-of-box FHIR spec-defined search parameter, please create a new custom search parameter with a different URL.

**Enhanced response logging for deletion of non-existent search parameters**:  Deletion of nonexistent search parameters previously returned a "204 No Content." The response is improved to be more informative and now returns "404 Not Found."

#### Bug fixes:

**Bug fix for profile version in capability statement**: The [capability statement](store-profiles-in-fhir.md#profiles-in-the-capability-statement) lists details of the stored profiles on the FHIR server. There was a bug where the capability statement wasn't showing the profile version that is currently loaded into the FHIR server. The issue is fixed, and the capability statement now correctly states the profile version that is loaded on the FHIR server. 

## Related content
[Release notes 2025](release-notes-2025.md)


[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
