---
title: Tutorial - Da Vinci Plan Net - Azure API for FHIR
description: This tutorial walks through setting up the Azure API for FHIR to pass Touchstone tests for the Da Vinci Payer Data Exchange Implementation Guide.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: matjazl
ms.author: cavoeg
author: modillon
ms.date: 08/03/2021
---

# Da Vinci Plan Net

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this tutorial, we'll walk through setting up the the FHIR service in the Azure Healthcare APIs (hear by called the FHIR service) to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the Da Vinci PDEX Payer Network (Plan-Net) Implementation Guide.

## Touchstone capability statement

The first test that we'll focus on is testing the FHIR service against the [Da Vinci Plan-Net capability statement](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/00-Capability&activeOnly=false&contentEntry=TEST_SCRIPTS). If you run this test without any updates, the test will fail due to missing search parameters and missing profiles.

## Define search parameters

As part of the Da Vinci Plan-Net IG, you'll need to define six [new search parameters](how-to-do-custom-search.md) for the Healthcare Service, Insurance Plan, Practitioner Role, Organization, and Organization Affiliation resources. All six of these are tested in the capability statement:

* [Healthcare Service Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-healthcareservice-coverage-area.html)
* [Insurance Plan Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-insuranceplan-coverage-area.html)
* [Insurance Plan Plan Type](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-insuranceplan-plan-type.html)
* [Organization Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-organization-coverage-area.html)
* [Organization Affiliation Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-organizationaffiliation-network.html)
* [Practitioner Role Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-practitionerrole-network.html)

> [!NOTE]
> In the raw JSON for these search parameters, the name is set to `Plannet_sp_<Resource Name>_<SearchParameter Name>`. The Touchstone test is expecting that the name for these will be only the `SearchParameter Name` (coverage-area, plan-type, or network).

The rest of the search parameters needed for the Da Vinci Plan-Net IG are defined by the base specification and are already available in the FHIR service without any additional updates.

## Store profiles

Outside of defining search parameters, you need to load the [required profiles and extensions](./validation-against-profiles.md#storing-profiles) to pass this test. There are nine profiles used as part of the Da Vinci Plan-Net IG:

* [Plan-Net Endpoint](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Endpoint.html)
* [Plan-Net Healthcare Service](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-HealthcareService.html)
* [Plan-Net InsurancePlan](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-InsurancePlan.html) 
* [Plan-Net Location](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Location.html)
* [Plan-Net Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Network.html)
* [Plan-Net Organization](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Organization.html)
* [Plan-Net OrganizationAffiliation](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-OrganizationAffiliation.html)
* [Plan-Net Practitioner](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Practitioner.html)
* [Plan-Net PractitionerRole](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-PractitionerRole.html)

## Sample rest file

To assist with creation of these search parameters and profiles, we have a sample http file on the open-source site that includes all the steps outlined above in a single file. Once you've uploaded all the necessary profiles and search parameters, you can run the capability statement test in Touchstone.

:::image type="content" source="media/davinci-plan-net/davinci-plan-net-test-script-execution-passed.png" alt-text="Da Vinci plan net sample rest test execution script passed":::

## Touchstone error handling test

The second test we'll walk through is testing [error handling](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/01-Error-Codes&activeOnly=false&contentEntry=TEST_SCRIPTS). The only step you must do is delete a HealthcareService resource from your database and use the ID of the deleted HealthcareService resource in the test. The sample [DaVinci_PlanNet.http](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciPlanNet/DaVinci_PlanNet.http) file in the open-source site provides an example HealthcareService to post and delete for this step.

:::image type="content" source="media/davinci-plan-net/davinci-test-script-execution-passed.png" alt-text="Da Vinci plan net touchstone error test execution script passed":::

## Touchstone query test

The next test we'll walk through is the [query capabilities test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/03-Query&activeOnly=false&contentEntry=TEST_SCRIPTS). This test is testing conformance against the profiles you loaded in the first test. You'll need to have resources loaded that conform to the profiles. The best path would be to test against resources that you already have in your database, but we also have the [DaVinci_PlanNet_Sample_Resources.http](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciPlanNet/DaVinci_PlanNet_Sample_Resources.http) file with sample resources pulled from the examples in the IG that you can use to create the resources and test against.  

:::image type="content" source="media/davinci-plan-net/touchstone-query-test-execution-failed.png" alt-text="Da Vinci plan net query test failed":::

> [!NOTE]
> With the sample resources provided, you should expect a 98% success rate of the query tests:

> * There is an open GitHub issue against the FHIR Server that is causing one of these tests to fail: [Resource returned multiple times if it meets both base criteria and _include criteria · Issue #2037 · microsoft/fhir-server (github.com)](https://github.com/microsoft/fhir-server/issues/2037)

## Next steps

In this tutorial, we walked through setting up the Azure API for FHIR to pass the Touchstone tests for the Da Vinci PDEX Payer Network (Plan-Net) Implementation Guide. Next, you can learn about all the FHIR service features.

>[!div class="nextstepaction"]
>[Supported features](fhir-features-supported.md)
