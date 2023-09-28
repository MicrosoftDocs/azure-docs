---
title: Da Vinci Drug Formulary Tutorial for Azure API for FHIR
description: This tutorial walks through setting up Azure API for FHIR to pass the Touchstone tests against the DaVinci Drug Formulary implementation guide.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 09/27/2023
---

# Tutorial for Da Vinci Drug Formulary for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this tutorial, we'll walk through setting up Azure API for FHIR to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the [Da Vinci Payer Data Exchange US Drug Formulary Implementation Guide](http://hl7.org/fhir/us/Davinci-drug-formulary/).

## Touchstone capability statement

The first test that we'll focus on is testing Azure API for FHIR against the [Da Vinci Drug Formulary capability
statement](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/Formulary/00-Capability&activeOnly=false&contentEntry=TEST_SCRIPTS). If you run this test without any updates, the test will fail due to missing search parameters and missing profiles.

### Define search parameters

As part of the Da Vinci Drug Formulary IG, you'll need to define three [new search parameters](how-to-do-custom-search.md) for the FormularyDrug resource. All three of these are tested in the
capability statement.

* [DrugTier](http://hl7.org/fhir/us/davinci-drug-formulary/STU1.0.1/SearchParameter-DrugTier.json.html)
* [DrugPlan](http://hl7.org/fhir/us/davinci-drug-formulary/STU1.0.1/SearchParameter-DrugPlan.json.html)
* [DrugName](http://hl7.org/fhir/us/davinci-drug-formulary/STU1.0.1/SearchParameter-DrugName.json.html)

The rest of the search parameters needed for the Da Vinci Drug Formulary IG are defined by the base specification and are already available in Azure API for FHIR without any more updates.

### Store profiles

Outside of defining search parameters, the only other update you need to make to pass this test is to load the [required profiles](validation-against-profiles.md). There are two profiles used as part of the Da Vinci Drug Formulary IG.

* [Formulary Drug](http://hl7.org/fhir/us/davinci-drug-formulary/STU1.0.1/StructureDefinition-usdf-FormularyDrug.html)
* [Formulary Coverage Plan](http://hl7.org/fhir/us/davinci-drug-formulary/STU1.0.1/StructureDefinition-usdf-CoveragePlan.html)

### Sample rest file

To assist with creation of these search parameters and profiles, we have the [Da Vinci Formulary](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciFormulary/DaVinciFormulary.http) sample HTTP file on the open-source site that includes all the steps outlined above in a single file. Once you've uploaded all the necessary profiles and search parameters, you can run the capability statement test in Touchstone. You should get a successful run:

:::image type="content" source="media/cms-tutorials/davinci-test-script-execution.png" alt-text="Da Vinci test script execution.":::

## Touchstone query test

The second test is the [query capabilities](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/Formulary/01-Query&activeOnly=false&contentEntry=TEST_SCRIPTS). This test validates that you can search for specific Coverage Plan and Drug resources using various parameters. The best path would be to test against resources that you already have in your database, but we also have the [Da VinciFormulary_Sample_Resources](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciFormulary/DaVinciFormulary_Sample_Resources.http) HTTP file available with sample resources pulled from the examples in the IG that you can use to create the resources and test against.

:::image type="content" source="media/cms-tutorials/davinci-test-execution-results.png" alt-text="Da Vinci test execution results.":::

## Next steps

In this tutorial, we walked through how to pass the Da Vinci Payer Data Exchange US Drug Formulary in Touchstone. Next, you can learn how to test the Da Vinci PDex Implementation Guide in Touchstone.

>[!div class="nextstepaction"]
>[Da Vinci PDex](davinci-pdex-tutorial.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.