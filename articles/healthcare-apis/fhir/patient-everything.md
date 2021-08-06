---
title: Patient-everything
description: This article explains how to use the patient-everything operation
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/03/2021
ms.author: cavoeg
---

# Using $patient-everything in FHIR service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The [$patient-everything](https://www.hl7.org/fhir/patient-operation-everything.html) operation is used to provide a patient with access to their entire record or for a provider or other user to perform a bulk data download. This operation is used to return all the information related to one or more patients described in the resource or context on which this operation is invoked.  

## Use patient-everything
To call patient-everything, use the following command:

```json
GET {FHIRURL}/Patient/{ID}/$everything
```
The FHIR service in the Azure Healthcare APIs (hear by called the FHIR service) validates that it can find the patient matching the provided patient ID. If a result is found, the response will be a bundle of type “searchset” with the following information: 
* [Patient resource](https://www.hl7.org/fhir/patient.html) 
* Resources that are directly referenced by the Patient resource (except link) 
* Resources in the [Patient Compartment](https://www.hl7.org/fhir/compartmentdefinition-patient.html)
* [Device resources](https://www.hl7.org/fhir/device.html) that reference the Patient resource. This is limited to 100 devices. If the patient has more than 100 devices linked to them, only 100 will be returned. 


## Patient-everything parameters
The FHIR service supports the following query parameters. All of these parameters are optional:

|Query parameter        |  Description|
|-----------------------|------------|
| \_type | Allows you to specify which types of resources will be included in the response. For example, \_type=Encounter would return only `Encounter` resources associated with the patient. |
| \_since | Will return only resources that have been modified since the time provided. |
| start | Specifying the start date will pull in resources where their clinical date is after the specified start date. If no start date is provided, all records before the end date are in scope. |
| end | Specifying the end date will pull in resources where their clinical date is before the specified end date. If no end date is provided, all records after the start date are in scope. |

> [!Note]
> You must specify an ID for a specific patient. If you need all data for all patients, see [$export](../data-transformation/export-data.md). 


## Examples of $patient-everything 

Below are some examples of using the $patient-everything operation. 

To use $patient-everything to query a patient’s “everything” between 2010 and 2020, use the following call: 

```json
GET {FHIRURL}/Patient/{ID}/$everything?start=2010&end=2020
``` 

To use $patient-everything to query a patient’s Observation and Encounter, use the following call: 
```json
GET {FHIRURL}/Patient/{ID}/$everything_type=Observation,Encounter 
```

To use $patient-everything to query a patient’s “everything” since 2021-05-27T05:00:00Z, use the following call: 

```json
GET {FHIRURL}/Patient/{ID}/$everything?_since=2021-05-27T05:00:00Z 
```

If a patient is found for each of these calls, you'll get back a 200 response with a `Bundle` of the corresponding resources.

## Next step
Now that you know how to use the patient-everything operation, you can learn about more search options on the overview of search guide.

>[!div class="nextstepaction"]
>[Overview of FHIR search](overview-of-search.md)
