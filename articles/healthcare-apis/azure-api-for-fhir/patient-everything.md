---
title: Use patient-everything in Azure API for FHIR
description: This article explains how to use the Patient-everything operation in the Azure API for FHIR.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/23/2023
ms.author: kesheth
---

# Patient-everything in FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

The [Patient-everything](https://www.hl7.org/fhir/patient-operation-everything.html) operation is used to provide a view of all resources related to a patient. This operation can be useful to give patients' access to their entire record or for a provider or other user to perform a bulk data download related to a patient. According to the FHIR specification, Patient-everything returns all the information related to one or more patients described in the resource or context on which this operation is invoked. In the Azure API for FHIR, Patient-everything is available to pull data related to a specific patient.

## Use Patient-everything
To call Patient-everything, use the following command:

```json
GET {FHIRURL}/Patient/{ID}/$everything
```

> [!Note]
> You must specify an ID for a specific patient. If you need all data for all patients, see [$export](../data-transformation/export-data.md). 

The Azure API for FHIR validates that it can find the patient matching the provided patient ID. If a result is found, the response will be a bundle of type `searchset` with the following information:
 
* [Patient resource](https://www.hl7.org/fhir/patient.html) 
* Resources that are directly referenced by the patient resource, except [link](https://www.hl7.org/fhir/patient-definitions.html#Patient.link) references that aren't of [seealso](https://www.hl7.org/fhir/codesystem-link-type.html#content) or if the `seealso` link references a `RelatedPerson`.
* If there are `seealso` link reference(s) to other patient(s), the results will include Patient-everything operation against the `seealso` patient(s) listed.
* Resources in the [Patient Compartment](https://www.hl7.org/fhir/compartmentdefinition-patient.html)
* [Device resources](https://www.hl7.org/fhir/device.html) that reference the patient resource. 

> [!Note]
> If the patient has more than 100 devices linked to them, only 100 will be returned. 

## Patient-everything parameters
The Azure API for FHIR supports the following query parameters. All of these parameters are optional:

|Query parameter        |  Description|
|-----------------------|------------|
| \_type | Allows you to specify which types of resources will be included in the response. For example, \_type=Encounter would return only `Encounter` resources associated with the patient. |
| \_since | Will return only resources that have been modified since the time provided. |
| start | Specifying the start date will pull in resources where their clinical date is after the specified start date. If no start date is provided, all records before the end date are in scope. |
| end | Specifying the end date will pull in resources where their clinical date is before the specified end date. If no end date is provided, all records after the start date are in scope. |

> [!Note]
> This implementation of Patient-everything does not support the _count parameter.


## Processing patient links

On a patient resource, there's an element called link, which links a patient to other patients or related persons. These linked patients help give a holistic view of the original patient. The link reference can be used when a patient is replacing another patient or when two patient resources have complementary information. One use case for links is when an ADT 38 or 39 HL7v2 message comes. The ADT38/39 describe an update to a patient. This update can be stored as a reference between two patients in the link element.

The FHIR specification has a detailed overview of the different types of [patient links](https://www.hl7.org/fhir/valueset-link-type.html#expansion), but here's a high-level summary:

* [replaces](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-replaces) - The Patient resource replaces a different Patient.
* [refer](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-refer) - Patient is valid, but it's not considered the main source of information. Points to another patient to retrieve additional information.
* [seealso](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-seealso) - Patient contains a link to another patient that's equally valid. 
* [replaced-by](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-replaced-by) - The Patient resource replaces a different Patient.

### Patient-everything patient links details

The Patient-everything operation in Azure API for FHIR processes patient links in different ways to give you the most holistic view of the patient.

> [!Note]
> A link can also reference a `RelatedPerson`. Right now, `RelatedPerson` resources are not processed in Patient-everything and are not returned in the bundle.

Right now, [replaces](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-replaces) and [refer](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-refer) links are ignored by the Patient-everything operation, and the linked patient isn't returned in the bundle. 

As described, [seealso](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-seealso) links reference another patient that's considered equally valid to the original. After the Patient-everything operation is run, if the patient has `seealso` links to other patients, the operation runs Patient-everything on each `seealso` link. This means if a patient links to five other patients with a type `seealso` link, we'll run Patient-everything on each of those five patients.

> [!Note]
> This is set up to only follow `seealso` links one layer deep. It doesn't process a `seealso` link's `seealso` links.

[![See also flow diagram.](media/patient-everything/see-also-flow.png)](media/patient-everything/see-also-flow.png#lightbox) 

The final link type is [replaced-by](https://www.hl7.org/fhir/codesystem-link-type.html#link-type-replaced-by). In this case, the original patient resource is no longer being used and the `replaced-by` link points to the patient that should be used. This implementation of `Patient-everything` will include by default an operation outcome at the start of the bundle with a warning that the patient is no longer valid. This will also be the behavior when the `Prefer` header is set to `handling=lenient`.

In addition, you can set the `Prefer` header to `handling=strict` to throw an error instead. In this case, a return of error code 301 `MovedPermanently` indicates that the current patient is out of date and returns the ID for the correct patient that's included in the link. The `ContentLocation` header of the returned error will point to the correct and up-to-date request.

> [!Note]
> If a `replaced-by` link is present, `Prefer: handling=lenient` and results are returned asynchronously in multiple bundles, only an operation outcome is returned in one bundle.

## Patient-everything response order

The Patient-everything operation returns results in phases:

1. Phase 1 returns the `Patient` resource itself in addition to any `generalPractitioner` and `managingOrganization` resources ir references.
1. Phase 2 and 3 both return resources in the patient compartment. If the start or end query parameters are specified, Phase 2 returns resources from the compartment that can be filtered by their clinical date, and Phase 3 returns resources from the compartment that can't be filtered by their clinical date. If neither of these parameters are specified, Phase 2 is skipped and Phase 3 returns all patient-compartment resources.
1. Phase 4 will return any devices that reference the patient.

Each phase will return results in a bundle. If the results span multiple pages, the next link in the bundle will point to the next page of results for that phase. After all results from a phase are returned, the next link in the bundle will point to the call to initiate the next phase.

If the original patient has any `seealso` links, phases 1 through 4 will be repeated for each of those patients. 

## Examples of Patient-everything 

Here are some examples of using the Patient-everything operation. In addition to the examples, we have a [sample REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PatientEverythingLinks.http) that illustrates how the `seealso` and `replaced-by` behavior works.

To use Patient-everything to query between 2010 and 2020, use the following call: 

```json
GET {FHIRURL}/Patient/{ID}/$everything?start=2010&end=2020
``` 

To use $patient-everything to query a patient’s Observation and Encounter, use the following call: 
```json
GET {FHIRURL}/Patient/{ID}/$everything?_type=Observation,Encounter 
```

To use $patient-everything to query a patient’s “everything” since 2021-05-27T05:00:00Z, use the following call: 

```json
GET {FHIRURL}/Patient/{ID}/$everything?_since=2021-05-27T05:00:00Z 
```

If a patient is found for each of these calls, you'll get back a 200 response with a `Bundle` of the corresponding resources.

## Next steps

Now that you know how to use the Patient-everything operation, you can learn about the search options.

>[!div class="nextstepaction"]
>[Overview of search in Azure API for FHIR](overview-of-search.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
