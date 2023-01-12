---
title: Validate FHIR resources against profiles in Azure API for FHIR
description: This article describes how to validate FHIR resources against profiles in Azure API for FHIR.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/03/2022
ms.author: kesheth
---

# Validate FHIR resources against profiles in Azure API for FHIR

`$validate` is an operation in Fast Healthcare Interoperability Resources (FHIR&#174;) that allows you to ensure that a FHIR resource conforms to the base resource requirements or a specified profile. This is a valuable operation to ensure that the data in Azure API for FHIR  has the expected attributes and values.

In the [store profiles in Azure API for FHIR](store-profiles-in-fhir.md) article, you walked through the basics of FHIR profiles and storing them. This article will guide you through how to use `$validate` for validating resources against profiles. For more information about FHIR profiles outside of this article, visit 
[HL7.org](https://www.hl7.org/fhir/profiling.html).


## Validating resources against the profiles

FHIR resources can express their conformance to specific profiles. This allows Azure API for FHIR to **validate** given resources against profiles. Validating a resource against a profile means checking if the resource conforms to the profile, including the specifications listed in `Resource.meta.profile` or in an Implementation Guide. There are two ways for you to validate your resource:

- You can use `$validate` operation against a resource that is already in Azure API for FHIR. 
- You can include `$validate` when you create or update a resource. 

In both cases, you can decide what to do if the Azure API for FHIR configuration resource doesn't conform to your desired profile.

## Using $validate

The `$validate` operation checks whether the provided profile is valid, and whether the resource conforms to the specified profile. As mentioned in the [HL7 FHIR specifications](https://www.hl7.org/fhir/resource-operation-validate.html), you can also specify the mode for `$validate`, such as create and update:

- `create`: Azure API for FHIR checks that the profile content is unique from the existing resources and that it's acceptable to be created as a new resource.
- `update`: Checks that the profile is an update against the nominated existing resource (that is no changes are made to the immutable fields).

Azure API for FHIR will always return an `OperationOutcome` as the validation results.

## Validating an existing resource

To validate an existing resource, use `$validate` in a `GET` request:

`GET http://<your Azure API for FHIR base URL>/{resource}/{resource ID}/$validate`

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

`GET https://myAzureAPIforFHIR.azurehealthcareapis.com/Observation/12345678/$validate?profile=http://hl7.org/fhir/StructureDefinition/heartrate`

## Validating a new resource

If you'd like to validate a new resource that you're uploading to Azure API for FHIR, you can do a `POST` request:

`POST http://<your Azure API for FHIR base URL>/{Resource}/$validate`

For example:

`POST https://myAzureAPIforFHIR.azurehealthcareapis.com/Patient/$validate`

This request will first validate the resource. New resource you're specifying in the request will be created after validation. The server will always return an OperationOutcome as the result.

## Validate on resource CREATE or resource UPDATE

You can choose when you'd like to validate your resource, such as on resource `CREATE` or `UPDATE`. By default, Azure API for FHIR is configured to opt out of validation on resource `Create/Update`. To validate on `Create/Update`, you can use the `x-ms-profile-validation` header set to true: `x-ms-profile-validation: true`.

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

## Next steps

In this article, you learned how to validate resources against profiles using `$validate`. To learn about the other Azure API for FHIR supported features, see

>[!div class="nextstepaction"]
>[Azure API for FHIR supported features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
