---
title: Tutorial - Da Vinci PDex - Azure Health Data Services
description: This tutorial walks through setting up FHIR service to pass tests for the Da Vinci Payer Data Exchange Implementation Guide.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 06/06/2022
---

# Da Vinci PDex

In this tutorial, we'll walk through setting up the FHIR service in Azure Health Data Services (hereby called FHIR service) to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the [Da Vinci Payer Data Exchange Implementation Guide](http://hl7.org/fhir/us/davinci-pdex/toc.html) (PDex IG).

> [!NOTE]
> FHIR service only supports JSON. The Microsoft open-source FHIR service supports both JSON and XML, and in open-source you can use the _format parameter to view the XML capability statement: `GET {fhirurl}/metadata?_format=xml`

## Touchstone capability statement

The first set of tests that we'll focus on is testing the FHIR service against the PDex IG capability statement. This includes three tests:

* The first test validates the basic capability statement against the IG requirements and will pass without any updates.

* The second test validates all the profiles have been added for US Core. This test will pass without updates but will include a bunch of warnings. To have these warnings removed, you need to [load the US Core profiles](validation-against-profiles.md). We've created a [sample HTTP file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/USCore.http) that walks through creating all the profiles. You can also get the [profiles](http://hl7.org/fhir/us/core/STU3.1.1/profiles.html#profiles) from the HL7 site directly, which will have the most current versions.

* The third test validates that the [$patient-everything operation](patient-everything.md) is supported.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-script-failed.png" alt-text="Da Vinci PDex execution failed.":::

## Touchstone $member-match test

The [second test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/01-Member-Match&activeOnly=false&contentEntry=TEST_SCRIPTS) in the Payer Data Exchange section tests the existence of the [$member-match operation](http://hl7.org/fhir/us/davinci-hrex/2020Sep/OperationDefinition-member-match.html). You can read more about the $member-match operation in our [$member-match operation overview](tutorial-member-match.md).

In this test, you’ll need to load some sample data for the test to pass. We have a rest file [here](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/membermatch.http) with the patient and coverage linked that you'll need for the test. Once this data is loaded, you'll be able to successfully pass this test. If the data isn't loaded, you'll receive a 422 response due to not finding an exact match.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-script-passed.png" alt-text="Da Vinci PDex test script passed.":::

## Touchstone patient by reference

The next tests we'll review is the [patient by reference](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/02-PatientByReference&activeOnly=false&contentEntry=TEST_SCRIPTS) tests. This set of tests validates that you can find a patient based on various search criteria. The best way to test the patient by reference will be to test against your own data, but we've uploaded a [sample resource file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PayerDataExchange/PDex_Sample_Data.http) that you can load to use as well.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-execution-passed.png" alt-text="Da Vinci PDex execution passed.":::

## Touchstone patient/$everything test

The final test we'll walk through is testing patient-everything. For this test, you'll need to load a patient, and then you'll use that patient’s ID to test that you can use the $everything operation to pull all data related to the patient.

:::image type="content" source="media/centers-medicare-services-tutorials/davinci-pdex-test-patient-everything.png" alt-text="touchstone patient/$everything test passed.":::

## Next steps

In this tutorial, we walked through how to pass the Payer Exchange tests in Touchstone. Next, you can learn how to test the Da Vinci PDEX Payer Network (Plan-Net) Implementation Guide.

>[!div class="nextstepaction"]
>[Da Vinci Plan Net](davinci-plan-net.md) 

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7. 
