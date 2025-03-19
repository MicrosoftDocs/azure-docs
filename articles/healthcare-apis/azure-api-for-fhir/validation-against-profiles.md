---
title: Validate FHIR resources against profiles in Azure API for FHIR
description: This article describes how to validate FHIR resources against profiles in Azure API for FHIR.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---

# Validate Operation Overview

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In the [store profiles in Azure API for FHIR](store-profiles-in-fhir.md) article, you walked through the basics of FHIR profiles and storing them. This article guides you through how to use `$validate` for validating resources against profiles. Validating a resource against a profile means checking if the resource conforms to the profile, including the specifications listed in `Resource.meta.profile` or in an Implementation Guide (IG).

`$validate` is an operation in Fast Healthcare Interoperability Resources (FHIR&reg;) that allows you to ensure that a FHIR resource conforms to the base resource requirements or a specified profile. This operation ensures that the data in Azure API for FHIR  has the expected attributes and values. For information on validate operation, visit the [HL7 FHIR Specification](https://www.hl7.org/fhir/resource-operation-validate.html). Per the specification, `Mode` (such as `create` and `update`) can be specified with `$validate`.

- `create`: Azure API for FHIR checks that the profile content is unique from the existing resources and that it's acceptable to be created as a new resource.
- `update`: Checks that the profile is an update against the nominated existing resource (that is no changes are made to the immutable fields).

There are different ways provided for you to validate resource.

- Validate an existing resource with validate operation.
- Validate a new resource with validate operation.
- Validate on resource CREATE/UPDATE using a header.

Azure API for FHIR always returns an `OperationOutcome` as the validation results for a `$validate` operation. Azure API for FHIR service does two step validation once a resource is passed into a `$validate` endpoint. The first step is a basic validation to ensure the resource can be parsed. During resource parsing, individual errors need to be fixed before proceeding to next step. Once a resource is successfully parsed, full validation is conducted as the second step.

> [!NOTE]
> Any `Valuesets` that are to be used for validation must be uploaded to the FHIR server. This includes any `Valuesets` which are part of the FHIR specification, as well as any `ValueSets` defined in Implementation Guides. Only fully expanded `Valuesets` which contain a full list of all codes are supported. Any `ValueSet` definitions which reference external sources are not supported.

## Validating an existing resource

To validate an existing resource, use `$validate` in a `GET` request.

`GET http://<your Azure API for FHIR base URL>/{resource}/{resource ID}/$validate`

For example

`GET https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate`.

In this example, you're validating the existing Patient resource `a6e11662-def8-4dde-9ebc-4429e68d130e` against the base `Patient` resource. If it's valid, you get an `OperationOutcome` such as the following code example.

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
If the resource isn't valid, you get an error code and an error message with details on why the resource is invalid. An `OperationOutcome` gets returned with error messages, and could look like the following code example.

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

If you'd like to specify a profile as a parameter, you can specify the canonical URL for the profile to validate against, such as the following example for the HL7 base profile for `heartrate`.

`GET https://myAzureAPIforFHIR.azurehealthcareapis.com/Observation/12345678/$validate?profile=http://hl7.org/fhir/StructureDefinition/heartrate`


## Validating a new resource

If you'd like to validate a new resource that you're uploading to Azure API for FHIR, you can do a `POST` request. The server always returns an OperationOutcome as the result.

`POST http://<your Azure API for FHIR base URL>/{Resource}/$validate`

For example,

`POST https://myAzureAPIforFHIR.azurehealthcareapis.com/Patient/$validate`.

This request validates the resource. Resources aren't created in FHIR service on validation. You need to send a POST request without `$validate` to create a resource.

## Validate on a resource CREATE/UPDATE using a header

By default, Azure API for FHIR is configured to opt out of validation on resource `Create/Update`. This capability allows validation on `Create/Update`, using the `x-ms-profile-validation` header. Set `x-ms-profile-validation` to true for validation.

> [!NOTE]
> In the open-source FHIR service, you can change the server configuration setting under CoreFeatures.

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

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]