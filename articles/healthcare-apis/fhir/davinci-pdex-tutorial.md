---
title: Tutorial - DaVinci PDex 
description: This tutorial walks through setting up the Azure API for FHIR to pass tests for the Da Vinci Payer Data Exchange Implementation Guide.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: matjazl
ms.author: cavoeg
author: caitlinv39
ms.date: 06/02/2021
---

# DaVinci PDex

In this tutorial, we'll walk through setting up the Azure API for FHIR to pass the [Touchstone](https://touchstone.aegis.net/touchstone/) tests for the [Da Vinci Payer Data Exchange Implementation
Guide](http://hl7.org/fhir/us/davinci-pdex/toc.html).

> [!NOTE]
> For all these tests, we'll run them against the JSON tests. The Azure API for FHIR supports both JSON and XML, but it doesn’t have separate endpoints to access JSON or XML. Because of this, all the XML tests will fail. If you want to view the capability statement in XML you simply pass the \_format parameter: \`GET
{fhirurl}/metadata?\_format=xml\`

## Touchstone capability statement

The first set of tests that we'll focus on is testing the Azure API for FHIR against the Payer Data Exchange IG capability statement. These tests have three validation processes:

1. The first test just validates the basic capability statement against the IG requirements and will pass without any updates.

2. The second test validates all the profiles have been added for US Core. This test will pass without updates but will include a bunch of warnings. To have these warnings removed, you need to [load the US Core
profiles](https://docs.microsoft.com/azure/healthcare-apis/fhir/validation-against-profiles#storing-profiles). We have created a sample HTTP file that walks through creating all the profiles. You can also get the [profiles](http://hl7.org/fhir/us/core/STU3.1.1/profiles.html#profiles) from the HL7 site directly, which will have the most current versions.

3. The third test validates that the patient-everything operation is supported. Right now, this test will fail. The operation will be available in mid-June 2021 in the Azure API for FHIR and is available now in the open-source FHIR server on Cosmos DB. However, it is missing from the capability statement, so this test will fail until we release a fix to the bug [here](https://github.com/microsoft/fhir-server/issues/1989). 

 
:::image type="content" source="media/cms-tutorials/devinci-pdex-test-execution-failed.png" alt-text="DaVinci PDex execution failed.":::

## Touchstone $member-match test

The [second test](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/01-Member-Match&activeOnly=false&contentEntry=TEST_SCRIPTS) in the Payer Data Exchange section tests the existence of the [$member-match operation](http://hl7.org/fhir/us/davinci-hrex/2020Sep/OperationDefinition-member-match.html). You can read more about the $member-match operation in our [$member-match operation overview](tutorial-$member-match.md).

In this test, you’ll need to load some sample data for the test to pass. We have a rest file here with the patient and coverage linked that you will need for the test. Once this data is loaded, you'll be able to successfully pass this test. If the data is not loaded, you'll receive a 422 response due to not finding an exact match.

:::image type="content" source="media/cms-tutorials/devinci-pdex-test-execution-passed.png" alt-text="DaVinci PDex execution passed.":::

## Touchstone Patient by Reference

The next tests we'll review is the [patient by reference](https://touchstone.aegis.net/touchstone/testdefinitions?selectedTestGrp=/FHIRSandbox/DaVinci/FHIR4-0-1-Test/PDEX/PayerExchange/02-PatientByReference&activeOnly=false&contentEntry=TEST_SCRIPTS) tests. This test validates that you can find a patient based on various search criteria. The best way to test the patient by reference will be to test against your own data, but we have uploaded a sample resource file that you can load to use as well.

:::image type="content" source="media/cms-tutorials/devinci-pdex-test-script-passed.png" alt-text="DaVinci PDex test script passed.":::

## Touchstone patient/$everything test

The final test we'll walk through is testing patient-everything. For this test, you'll need to load a patient, and then you'll use that patient’s ID to test that you can use the $everything operation to pull all data related to the patient.

## Next Step

In this tutorial, we walked through how to pass the Payer Exchange tests in Touchstone. Next, you can learn how to test the Plan Net tests in the Plan Net tutorial.

