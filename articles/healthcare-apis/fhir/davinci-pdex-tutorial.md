---
title: "Set up FHIR service to pass Touchstone tests for Da Vinci PDex"
description: "Set up FHIR service for Da Vinci PDex to pass Touchstone tests and learn how to configure capability statements, US Core profiles, and implement required operations."
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 06/19/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# Set up FHIR service to pass Touchstone tests for Da Vinci PDex

In this tutorial, you set up FHIR service in Azure Health Data Services to pass Touchstone tests for the Da Vinci Payer Data Exchange Implementation Guide (PDex IG). You'll learn how to configure capability statements, load US Core profiles, and implement required FHIR operations.

> [!NOTE]
> FHIR service only supports JSON. The Microsoft open-source FHIR service supports both JSON and XML. In open source, you can use the _format parameter to view the XML capability statement: `GET {fhirurl}/metadata?_format=xml`

## Test the capability statement

The first set of tests focuses on testing the FHIR service against the PDex IG capability statement. This set includes three tests:

* The first test validates the basic capability statement against the IG requirements and passes without any updates.

* The second test validates that all the profiles for US Core are added. This test passes without updates but includes warnings. To remove these warnings, [load the US Core profiles](validation-against-profiles.md). You can also use a [sample HTTP file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/USCore.http) that walks through creating all the profiles. You can also get the [profiles](http://hl7.org/fhir/us/core/STU3.1.1/profiles.html#profiles) from the HL7 site directly, which has the most current versions.

* The third test validates that the [$patient-everything operation](patient-everything.md) is supported.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-script-failed.png" alt-text="Screenshot of Da Vinci PDex Touchstone test execution showing failed results for capability statement validation." lightbox="media/centers-medicare-services-tutorials/davinci-pdex-test-script-failed.png":::

## Test the $member-match operation

The [second test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/01-Member-Match&activeOnly=false&contentEntry=TEST_SCRIPTS) in the Payer Data Exchange section tests the existence of the [$member-match operation](http://hl7.org/fhir/us/davinci-hrex/2020Sep/OperationDefinition-member-match.html). You can read more about the $member-match operation in the [$member-match operation overview](tutorial-member-match.md).

In this test, you need to load some sample data for the test to pass. A rest file is available [here](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/membermatch.http) with the patient and coverage linked that you need for the test. Once you load this data, you can successfully pass this test. If you don't load the data, you receive a `422` response due to not finding an exact match.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-script-passed.png" alt-text="Screenshot of Da Vinci PDex Touchstone test showing passed status for the $member-match operation." lightbox="media/centers-medicare-services-tutorials/davinci-pdex-test-script-passed.png":::

## Search for patients by reference tests

The next tests to review are the [patient by reference](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/02-PatientByReference&activeOnly=false&contentEntry=TEST_SCRIPTS) tests. This set of tests validates that you can find a patient based on various search criteria. The best way to test the patient by reference is to test against your own data, but you can also use a [sample resource file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/PDex_Sample_Data.http) that you can load.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-execution-passed.png" alt-text="Screenshot of Da Vinci PDex Touchstone test showing passed status for patient by reference search." lightbox="media/centers-medicare-services-tutorials/davinci-pdex-test-execution-passed.png":::

## Test the patient/$everything operation

The final test is testing patient-everything. For this test, you need to load a patient, and then use that patient’s ID to test that you can use the $everything operation to pull all data related to the patient.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-patient-everything.png" alt-text="Screenshot of Touchstone patient/$everything test showing passed status." lightbox="media/centers-medicare-services-tutorials/davinci-pdex-test-patient-everything.png":::

## Next steps

In this tutorial, you learned how to pass the Payer Exchange tests in Touchstone. Next, you can learn how to test the Da Vinci PDEX Payer Network (Plan-Net) Implementation Guide.

>[!div class="nextstepaction"]
>[Da Vinci Plan Net](davinci-plan-net.md) 

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
