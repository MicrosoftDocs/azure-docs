---
title: CARIN Blue Button Implementation Guide for Blue Button
description: This tutorial walks through the steps of setting up FHIR service to pass the Touchstone tests for the CARIN Implementation Guide for Blue Button (C4BB IG). 
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 08/12/2025
ms.custom: sfi-image-nochange
---

# CARIN Implementation Guide for Blue Button®

In this tutorial, you set up the FHIR® service in Azure Health Data Services to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the [CARIN Implementation Guide for Blue Button](https://build.fhir.org/ig/HL7/carin-bb/index.html) (C4BB IG).

## Touchstone capability statement

First, test the FHIR service against the [C4BB IG capability statement](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/00-Capability&activeOnly=false&contentEntry=TEST_SCRIPTS). If you run this test against the FHIR service without any updates, the test fails due to missing search parameters and missing profiles. 

### Define search parameters

As part of the C4BB IG, you need to define three [new search parameters](how-to-do-custom-search.md) for the `ExplanationOfBenefit` resource. Two of these search parameters (type and service-date) are tested in the capability statement, and one search parameter (insurer) is needed for `_include` searches.  

* [type](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-type.json)
* [service-date](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-service-date.json)
* [insurer](https://build.fhir.org/ig/HL7/carin-bb/SearchParameter-explanationofbenefit-insurer.json)

> [!NOTE]
> In the raw JSON for these search parameters, the name is set to `ExplanationOfBenefit_<SearchParameter Name>`. The Touchstone test expects that the name for these search parameters is **type**, **service-date**, and **insurer**.  
 
The rest of the search parameters needed for the C4BB IG are defined by the base specification and are already available in the FHIR service without any additional updates.
 
### Store profiles

To pass this test, you need to load the [required profiles](validation-against-profiles.md) in addition to defining search parameters. The C4BB IG defines eight profiles: 

* [C4BB Coverage](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Coverage.html) 
* [C4BB ExplanationOfBenefit Inpatient Institutional](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Inpatient-Institutional.html) 
* [C4BB ExplanationOfBenefit Outpatient Institutional](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Outpatient-Institutional.html) 
* [C4BB ExplanationOfBenefit Pharmacy](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Pharmacy.html) 
* [C4BB ExplanationOfBenefit Professional NonClinician](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit-Professional-NonClinician.html) 
* [C4BB Organization](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Organization.html) 
* [C4BB Patient](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Patient.html) 
* [C4BB Practitioner](https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-Practitioner.html) 

### Sample REST file

To help you create these search parameters and profiles, a [sample http file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/C4BB/C4BB.http) is available that includes all the steps previously outlined in a single file. After you upload all the necessary profiles and search parameters, you can run the capability statement test in Touchstone.

:::image type="content" source="media/centers-medicare-services-tutorials/capability-test-script-execution-results.png" alt-text="Capability test script execution results." lightbox="media/centers-medicare-services-tutorials/capability-test-script-execution-results.png":::

## Touchstone read test

After testing the capabilities statement, test the [read capabilities](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/01-Read&activeOnly=false&contentEntry=TEST_SCRIPTS) of the FHIR service against the C4BB IG. This test checks conformance against the eight profiles you loaded in the first test. You need to load resources that conform to the profiles. The best path is to test against resources that you already have in your database. An [http file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/C4BB/C4BB_Sample_Resources.http) is also available with sample resources pulled from the examples in the IG that you can use to create the resources to test against.

:::image type="content" source="media/centers-medicare-services-tutorials/test-execution-results-touchstone.png" alt-text="Touchstone read test execution results." lightbox="media/centers-medicare-services-tutorials/test-execution-results-touchstone.png":::

## Touchstone EOB query test

The next test is the [EOB query test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/02-EOBQuery&activeOnly=false&contentEntry=TEST_SCRIPTS). If you already completed the read test, you already have all the data you need. This test validates that you can search for specific `Patient` and `ExplanationOfBenefit` resources by using various parameters.

:::image type="content" source="media/centers-medicare-services-tutorials/test-execution-touchstone-eob-query-test.png" alt-text="Touchstone EOB query execution results." lightbox="media/centers-medicare-services-tutorials/test-execution-touchstone-eob-query-test.png":::

## Touchstone error handling test

The final test is testing [error handling](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/CARIN/CARIN-4-BlueButton/99-ErrorHandling&activeOnly=false&contentEntry=TEST_SCRIPTS). The only step is to delete an `ExplanationOfBenefit` resource from your database by using the ID of the deleted `ExplanationOfBenefit` resource in the test.

:::image type="content" source="media/centers-medicare-services-tutorials/test-execution-touchstone-error-handling.png" alt-text="Touchstone EOB error handling results." lightbox="media/centers-medicare-services-tutorials/test-execution-touchstone-error-handling.png":::


## Next steps

In this tutorial, you learned how to pass the CARIN IG for Blue Button tests in Touchstone. Next, you can review how to test the Da Vinci formulary tests.

>[!div class="nextstepaction"]
>[DaVinci Drug Formulary](davinci-drug-formulary-tutorial.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
 
