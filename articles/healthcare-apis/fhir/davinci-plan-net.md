---
title: Da Vinci Plan Net for the FHIR service in Azure Health Data Services
description: Learn to set up Da Vinci PDex tests for the FHIR service in Azure Health Data Services with this tutorial on defining search parameters, loading profiles, and running touchstone tests.
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 06/04/2024
---

# Da Vinci Plan Net

In this tutorial, you set up the FHIR&reg; service in Azure Health Data Services to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the Da Vinci PDex Payer Network (Plan-Net) Implementation Guide.

## Touchstone capability statement

First, test the FHIR service against the [Da Vinci Plan-Net capability statement](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/00-Capability&activeOnly=false&contentEntry=TEST_SCRIPTS). If you run this test without any updates, the test fails due to missing search parameters and missing profiles.

## Define search parameters

Next, define six [new search parameters](how-to-do-custom-search.md) for the Healthcare Service, Insurance Plan, Practitioner Role, Organization, and Organization Affiliation resources. All six of these parameters are tested in the capability statement:

- [Healthcare Service Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-healthcareservice-coverage-area.html)
- [Insurance Plan Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-insuranceplan-coverage-area.html)
- [Insurance Plan Plan Type](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-insuranceplan-plan-type.html)
- [Organization Coverage Area](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-organization-coverage-area.html)
- [Organization Affiliation Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-organizationaffiliation-network.html)
- [Practitioner Role Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/SearchParameter-practitionerrole-network.html)

> [!NOTE]
> In the raw JSON for these search parameters, the name is set to `Plannet_sp_<Resource Name>_<SearchParameter Name>`. The Touchstone test expects the name to be only the `SearchParameter Name` (coverage-area, plan-type, or network).

The rest of the search parameters needed for the Da Vinci Plan Net Implementation Guide are defined by the base specification, and are already available in the FHIR service without any other updates.

## Store profiles

After defining search parameters, load the [required profiles and extensions](./store-profiles-in-fhir.md#accessing-profiles-and-storing-profiles) to pass this test. There are nine profiles used in the Da Vinci Plan-Net Implementation Guide:

- [Plan-Net Endpoint](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Endpoint.html)
- [Plan-Net Healthcare Service](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-HealthcareService.html)
- [Plan-Net InsurancePlan](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-InsurancePlan.html) 
- [Plan-Net Location](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Location.html)
- [Plan-Net Network](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Network.html)
- [Plan-Net Organization](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Organization.html)
- [Plan-Net OrganizationAffiliation](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-OrganizationAffiliation.html)
- [Plan-Net Practitioner](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-Practitioner.html)
- [Plan-Net PractitionerRole](http://hl7.org/fhir/us/davinci-pdex-plan-net/STU1/StructureDefinition-plannet-PractitionerRole.html)

## Sample REST file

To assist with creation of the search parameters and profiles, there's a sample HTTP file on the open-source site that includes all the steps described in this article in a single file. After you upload the necessary profiles and search parameters, run the capability statement test in Touchstone.

:::image type="content" source="media/davinci-plan-net/davinci-plan-net-test-script-execution-passed.png" alt-text="Screenshot showing Da Vinci Plan Net sample REST test execution script passed." lightbox="media/davinci-plan-net/davinci-plan-net-test-script-execution-passed.png":::

## Touchstone error handling test

The second test is of [error handling](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/01-Error-Codes&activeOnly=false&contentEntry=TEST_SCRIPTS). The only step you need to do is delete a `HealthcareService` resource from your database and use the ID of the deleted HealthcareService resource in the test. The sample [DaVinci_PlanNet.http](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciPlanNet/DaVinci_PlanNet.http) file on the open-source site provides an example `HealthcareService` to post and delete for this step.

:::image type="content" source="media/davinci-plan-net/davinci-test-script-execution-passed.png" alt-text="Screenshot showing Da Vinci Plan Net touchstone error test execution script passed." lightbox="media/davinci-plan-net/davinci-test-script-execution-passed.png":::

## Touchstone query test

The next test is the [query capabilities test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PlanNet/03-Query&activeOnly=false&contentEntry=TEST_SCRIPTS). This test checks conformance against the profiles you loaded in the first test. You need to load resources that conform to the profiles. The best path is to test against resources already in your database. However, there's also the [DaVinci_PlanNet_Sample_Resources.http](https://github.com/microsoft/fhir-server/blob/main/docs/rest/DaVinciPlanNet/DaVinci_PlanNet_Sample_Resources.http) file with sample resources pulled from the examples in the Implementation Guide, which you can use to create the resources and test against.  


:::image type="content" source="media/davinci-plan-net/touchstone-query-test-execution.png" alt-text="Screenshot showing Da Vinci Plan Net query test result." lightbox="media/davinci-plan-net/touchstone-query-test-execution.png":::

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]