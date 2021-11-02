---
title: Azure Healthcare APIs monthly releases
description: This article provides details about the Azure Healthcare APIs monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/01/2021
ms.author: cavoeg
---

# Release notes: Azure Healthcare APIs

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Azure Healthcare APIs is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Healthcare APIs including the different service types (FHIR service, DICOM service, and IoT connector) that seamlessly work with one another.

## September 2021

### **FHIR service**

#### **Feature enhancements**

:::row:::
   :::column span="":::
      **Enhancements**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      **Added support for**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [Conditional patch](https://docs.microsoft.com/azure/healthcare-apis/fhir/fhir-rest-api-capabilities#patch-and-conditional-patch.md)
   :::column-end:::

   :::column span="":::
      Conditional patch 
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
     [#2163](https://github.com/microsoft/fhir-server/pull/2163)
   :::column-end:::

   :::column span="":::
      Add conditional patch audit event
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2213](https://github.com/microsoft/fhir-server/pull/2213)
   :::column-end:::

   :::column span="":::
      **Allow JSON patch in bundles**
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [JSON patch in bundles](https://docs.microsoft.com/azure/healthcare-apis/fhir/fhir-rest-api-capabilities#patch-in-bundles)
   :::column-end:::

   :::column span="":::
      Allow search history bundles with patch requests
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [#2156](https://github.com/microsoft/fhir-server/pull/2156)
   :::column-end:::

   :::column span="":::
      Enable JSON patch in bundles using Binary resources
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [#2143](https://github.com/microsoft/fhir-server/pull/2143)
   :::column-end:::

   :::column span="":::
      Added new audit [OperationName subtypes](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/enable-diagnostic-logging#audit-log-links)
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [#2170](https://github.com/microsoft/fhir-server/pull/2170)
   :::column-end:::

   :::column span="":::
       **Running a reindex a job** 
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [Reindex improvements](https://docs.microsoft.com/azure/healthcare-apis/fhir/how-to-run-a-reindex)
   :::column-end:::

   :::column span="":::
      Added [boundaries for reindex](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/how-to-run-a-reindex#performance-considerations) parameters
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [#2103](https://github.com/microsoft/fhir-server/pull/2103)
   :::column-end:::

   :::column span="":::
      Update error message for reindex parameter boundaries  
   :::column-end:::

    :::column span="":::
    :::column-end:::

   :::column span="":::
      [#2109](https://github.com/microsoft/fhir-server/pull/2109) 
   :::column-end:::

   :::column span="":::
      Adds final reindex count check 
   :::column-end:::

    :::column span="":::
    :::column-end:::

  :::column span="":::
     [#2099](https://github.com/microsoft/fhir-server/pull/2099) 
   :::column-end:::

:::row-end:::

#### **Bug fixes**

:::row:::
   :::column span="":::
      **Resolved patch bugs**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      Wider catch for exceptions during applying patch
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2192](https://github.com/microsoft/fhir-server/pull/2192)
   :::column-end:::

   :::column span="":::
      Fix history with PATCH in STU3
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2177](https://github.com/microsoft/fhir-server/pull/2177)
   :::column-end:::

   :::column span="":::
      **Custom search bugs**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      Addresses the delete failure with Custom Search parameters
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2133](https://github.com/microsoft/fhir-server/pull/2133)
   :::column-end:::

   :::column span="":::
      Added retry logic while Deleting Search Parameter
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2121](https://github.com/microsoft/fhir-server/pull/2121)
   :::column-end:::

   :::column span="":::
      Set max item count in search options in SearchParameterDefinitionManager
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2141](https://github.com/microsoft/fhir-server/pull/2141)
   :::column-end:::

   :::column span="":::
      Better exception if there's a bad expression in a search parameter
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2157](https://github.com/microsoft/fhir-server/pull/2157)
   :::column-end:::

   :::column span="":::
      **Resolved SQL batch reindex if one resource fails**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      Updates SQL batch reindex retry logic
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2118](https://github.com/microsoft/fhir-server/pull/2118)
   :::column-end:::

   :::column span="":::
      **GitHub issues closed**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      Unclear error message for conditional create with no ID
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      [#2168](https://github.com/microsoft/fhir-server/issues/2168)
   :::column-end:::

:::row-end:::

### **DICOM service**

#### Bugs fixes

:::row:::
   :::column span="":::
      **Resolved patch bugs**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      Implemented fix to resolve QIDO paging ordering issues
   :::column-end:::

   :::column span="":::    
   :::column-end:::
   
   :::column span="1":::
      [#989](https://github.com/microsoft/dicom-server/pull/989)
   :::column-end:::

:::row-end:::

### **IoT connector**

#### Bugs fixes

:::row:::
   :::column span="":::
      **Resolved patch bugs**
   :::column-end:::

   :::column span="":::
   :::column-end:::

   :::column span="":::
      **Description**
   :::column-end:::

   :::column span="":::
      IoT connector normalized improvements with calculations to support and enhance health data standardization.
   :::column-end:::

   :::column span="":::    
   :::column-end:::

   :::column span="1":::
      See: [Use device mappings](https://docs.microsoft.com/azure/healthcare-apis/iot/how-to-use-device-mapping-iot) and [Calculated functions](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md) 
   :::column-end:::

:::row-end:::


## Next steps

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)


