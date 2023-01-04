---
title: Tutorial - $member-match operation
description: Introduces the $member-match operation that's defined as part of the Da Vinci Health Record Exchange (HRex).
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 06/06/2022
---

# $member-match operation in FHIR service

[$member-match](http://hl7.org/fhir/us/davinci-hrex/2020Sep/OperationDefinition-member-match.html) is an operation that is defined as part of the Da Vinci Health Record Exchange (HRex). In this guide, we'll walk through what $member-match is and how to use it.

## Overview of $member-match

The $member-match operation was created to help with the payer-to-payer data exchange, by allowing a new payer to get a unique identifier for a patient from the patient’s previous payer. The $member-match operation requires three pieces of information to be passed in the body of the request:

* Patient demographics
* The old coverage information
* The new coverage information (not required based on our implementation)

After the data is passed in, the FHIR service in Azure Health Data Services (hereby called FHIR service) validates that it can find a patient that exactly matches the demographics passed in with the old coverage information passed in. If a result is found, the response will be a bundle with the original patient data plus a new identifier added in from the old payer, and the old coverage information.

> [!NOTE]
> The specification describes passing in and back the new coverage information. We've decided to omit that data to keep the results smaller.

## Example of $member-match

To use $member-match, use the following call:

`POST {{fhirurl}}/Patient/$member-match`

You'll need to include a parameters resource in the body that includes the patient, the old coverage, and the new coverage. To see a JSON representation, see [$member-match example request](http://hl7.org/fhir/us/davinci-hrex/2020Sep/Parameters-member-match-in.json.html).

If a single match is found, you'll receive a 200 response with another identifier added:

:::image type="content" source="media/centers-medicare-services-tutorials/two-hundred-response.png" alt-text="200 hundred response code.":::

If the $member-match can't find a unique match, you'll receive a 422 response with an error code.

## Next steps

In this guide, you've learned about the $member-match operation. Next, you can learn about testing the Da Vinci Payer Data Exchange IG in Touchstone, which requires the $member-match operation.

>[!div class="nextstepaction"]
>[DaVinci PDex](davinci-pdex-tutorial.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
