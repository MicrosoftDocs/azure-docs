---
title: CARIN Blue Button Implementation Guide for Blue Button - Azure API for FHIR
description: This tutorial walks through the steps of setting up Azure API for FHIR to pass the Touchstone tests for the CARIN Implementation Guide for Blue Button (C4BB IG). 
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 09/27/2023
---

# CARIN Implementation Guide for Blue Button&#174; for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this tutorial, we'll walk through setting up Azure API for FHIR to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the [CARIN Implementation Guide for Blue Button](https://build.fhir.org/ig/HL7/carin-bb/index.html) (C4BB IG).

## Touchstone capability statement

The first test that we'll focus on is testing Azure API for FHIR against the [C4BB IG capability statement](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/00-Capability&activeOnly=false&contentEntry=TEST_SCRIPTS). If you run this test against Azure API for FHIR without any updates, the test will fail due to missing search parameters and missing profiles. 

### Define search parameters

As part of the C4BB IG, you'll need to define three [new search parameters](how-to-do-custom-search.md) for the `ExplanationOfBenefit` resource. Two of these are tested in the capability statement (type and service-date), and one is needed for `_include` searches (insurer).  

* [type](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-type.json)
* [service-date](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-service-date.json)
* [insurer](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-insurer.json)

> [!NOTE]
> In the raw JSON for these search parameters, the name is set to `ExplanationOfBenefit_<SearchParameter Name>`. The Touchstone test is expecting that the name for these will be **type**, **service-date**, and **insurer**.  
 
The rest of the search parameters needed for the C4BB IG are defined by the base specification and are already available in Azure API for FHIR without any additional updates.
 
### Store profiles

Outside of defining search parameters, the other update you need to make to pass this test is to load the [required profiles](validation-against-profiles.md). There are eight profiles defined within the C4BB IG. 

* [C4BB Coverage](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Coverage.html) 
* [C4BB ExplanationOfBenefit Inpatient Institutional](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Inpatient-Institutional.html) 
* [C4BB ExplanationOfBenefit Outpatient Institutional](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Outpatient-Institutional.html) 
* [C4BB ExplanationOfBenefit Pharmacy](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Pharmacy.html) 
* [C4BB ExplanationOfBenefit Professional NonClinician](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Professional-NonClinician.html) 
* [C4BB Organization](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Organization.html) 
* [C4BB Patient](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Patient.html) 
* [C4BB Practitioner](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Practitioner.html) 

### Sample rest file

To assist with creation of these search parameters and profiles, we have a [sample http file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/C4BB/C4BB.http) that includes all the steps outlined in this tutorial in a single file. Once you've uploaded all the necessary profiles and search parameters, you can run the capability statement test in Touchstone.

:::image type="content" source="media/cms-tutorials/capability-test-script-execution-results.png" alt-text="Capability test script execution results.":::

## Touchstone read test

After testing the capabilities statement, we'll test the [read capabilities](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/01-Read&activeOnly=false&contentEntry=TEST_SCRIPTS) in Azure API for FHIR against the C4BB IG. This test is testing conformance against the eight profiles you loaded in the first test. You'll need to have resources loaded that conform to the profiles. The best path would be to test against resources that you already have in your database, but we also have an [http file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/C4BB/C4BB_Sample_Resources.http) available with sample resources pulled from the examples in the IG that you can use to create the resources and test against.

:::image type="content" source="media/cms-tutorials/test-execution-results-touchstone.png" alt-text="Touchstone read test execution results.":::

## Touchstone EOB query test

The next test we'll review is the [EOB query test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/02-EOBQuery&activeOnly=false&contentEntry=TEST_SCRIPTS). If you've already completed the read test, you have all the data loaded that you'll need. This test validates that you can search for specific `Patient` and `ExplanationOfBenefit` resources using various parameters.

:::image type="content" source="media/cms-tutorials/test-execution-touchstone-eob-query-test.png" alt-text="Touchstone EOB query execution results.":::

## Touchstone error handling test

The final test we'll walk through is testing [error handling](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/99-ErrorHandling&activeOnly=false&contentEntry=TEST_SCRIPTS). The only step you need to do is delete an ExplanationOfBenefit resource from your database and use the ID of the deleted `ExplanationOfBenefit` resource in the test.

:::image type="content" source="media/cms-tutorials/test-execution-touchstone-error-handling.png" alt-text="Touchstone EOB error handling results.":::


## Next steps

In this tutorial, we walked through how to pass the CARIN IG for Blue Button tests in Touchstone. Next, you can review how to test the Da Vinci formulary tests.

>[!div class="nextstepaction"]
>[DaVinci Drug Formulary](davinci-drug-formulary-tutorial.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.       
 
