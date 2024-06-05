---
title: Validate FHIR resources against profiles in Azure Health Data Services
description: This article describes how to validate FHIR resources against profiles in the FHIR service.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/06/2022
ms.author: kesheth
---

# Validate FHIR resources against profiles in Azure Health Data Services

In the [store profiles in the FHIR service](store-profiles-in-fhir.md) article, you walked through the basics of FHIR profiles and storing them. The FHIR service in Azure Health Data Services (hereby called the FHIR service) allows validating resources against profiles to see if the resources conform to the profiles. This article will guide you through how to use `$validate` for validating resources against profiles. 

`$validate` is an operation in Fast Healthcare Interoperability Resources (FHIR&#174;) that allows you to ensure that a FHIR resource conforms to the base resource requirements or a specified profile. This operation ensures that the data in FHIR service has the expected attributes and values. For information on validate operation, visit [HL7 FHIR Specification](https://www.hl7.org/fhir/resource-operation-validate.html). 
Per specification, Mode can be specified with `$validate`, such as create and update:
- `create`: Azure API for FHIR checks that the profile content is unique from the existing resources and that it's acceptable to be created as a new resource.
- `update`: Checks that the profile is an update against the nominated existing resource (that is no changes are made to the immutable fields).

There are different ways provided for you to validate resource:
- Option 1: Validate an existing resource with validate operation.
- Option 2: Validate a new resource with validate operation.
- Option 3: Validate on resource CREATE/ UPDATE using header.

On the successful validation of an existing/ new resource with the validate operation, resource is not persisted into the FHIR service. Use Option 3: Validate on resource CREATE/ UPDATE using header, to persist successfully validated resource to the FHIR service.

FHIR Service will always return an `OperationOutcome` as the validation results for $validate operation. FHIR service does two step validation, once a resource is passed into $validate endpoint - the first step is a basic validation to ensure resource can be parsed. During resource parsing, individual errors need to be fixed before proceeding further to next step. Once resource is successfully parsed, full validation is conducted as second step.

> [!NOTE]
> Any valuesets that are to be used for validation must be uploaded to the FHIR server.  This includes any Valuesets which are part of the FHIR specification,  as well as any ValueSets defined in Implementation Guides.  Only fully expanded Valuesets which contain a full list of all codes are supported.  Any     ValueSet definitions which reference external sources are not supported.

## Option 1: Validating an existing resource

To validate an existing resource, use `$validate` in a `GET` request:

`GET http://<your FHIR service base URL>/{resource}/{resource ID}/$validate`

For example:

`GET https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate`

In this example, you're validating the existing Patient resource `a6e11662-def8-4dde-9ebc-4429e68d130e` against the base Patient resource. If it's valid, you'll get an `OperationOutcome` such as the following code example:

```json
{
    "resourceType": "OperationOutcome",
    "issue": [
        {
            "severity": "information",
            "code": "informational",
            "diagnostics": "All OK"
        }
    ]
}
```
If the resource isn't valid, you'll get an error code and an error message with details on why the resource is invalid. An example `OperationOutcome` gets returned with error messages and could look like the following code example:

```json
{
    "resourceType": "OperationOutcome",
    "issue": [
        {
            "severity": "error",
            "code": "invalid",
            "details": {
                "coding": [
                    {
                        "system": "http://hl7.org/fhir/dotnet-api-operation-outcome",
                        "code": "1028"
                    }
                ],
                "text": "Instance count for 'Patient.identifier.value' is 0, which is not within the specified cardinality of 1..1"
            },
            "location": [
                "Patient.identifier[1]"
            ]
        },
        {
            "severity": "error",
            "code": "invalid",
            "details": {
                "coding": [
                    {
                        "system": "http://hl7.org/fhir/dotnet-api-operation-outcome",
                        "code": "1028"
                    }
                ],
                "text": "Instance count for 'Patient.gender' is 0, which is not within the specified cardinality of 1..1"
            },
            "location": [
                "Patient"
            ]
        }
    ]
}
```

In this example, the resource didn't conform to the provided Patient profile, which required a patient identifier value and gender.

If you'd like to specify a profile as a parameter, you can specify the canonical URL for the profile to validate against, such as the following example for the HL7 base profile for `heartrate`:

`GET https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Observation/12345678/$validate?profile=http://hl7.org/fhir/StructureDefinition/heartrate`

## Option 2: Validating a new resource

If you'd like to validate a new resource that you're uploading to the server, you can do a `POST` request:

`POST http://<your FHIR service base URL>/{Resource}/$validate`

For example:

`POST https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/$validate`

This request will first validate the resource. New resource you're specifying in the request will be created after validation.
The server will always return an `OperationOutcome` as the result.

## Option 3: Validate on resource CREATE/UPDATE using header

You can choose when you'd like to validate your resource, such as on resource `CREATE` or `UPDATE`. By default, the FHIR service is configured to opt out of validation on resource `Create/Update`. This capability allows to validate on `Create/Update`, using the `x-ms-profile-validation` header. Set `x-ms-profile-validation' to true for validation.


> [!NOTE]
> In the open-source FHIR service, you can change the server configuration setting, under the CoreFeatures.

```json
{
   "FhirServer": {
      "CoreFeatures": {
            "ProfileValidationOnCreate": true,
            "ProfileValidationOnUpdate": false
        }
}
```
To enable strict validation, use 'Prefer: handling' header with value strict. By setting this header, validation warning will be reported as an error. 

## Next steps

In this article, you learned how to validate resources against profiles using `$validate`. To learn about the other FHIR service supported features, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
