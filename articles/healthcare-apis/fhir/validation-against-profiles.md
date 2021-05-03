---
title: $validate FHIR resources against profiles on Azure API for FHIR
description: $validate FHIR resources against profiles
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 04/08/2021
ms.author: ginle
---
# How to validate FHIR resources against profiles

FHIR profile is a set of constraints on a resource represented as a `StructureDefinition` per the [FHIR specification](http://hl7.org/fhir/R4/profiling.html). The HL7 FHIR standard defines a set of base resources, and these standard base resources have generic definitions. FHIR profile allows you to narrow down and customize resource definitions using constraints and extensions. Azure API for FHIR allows validating such profiles, and validating resources against the specified profiles to see if the resources conform to the requirements set by the profiles. This article walks through the basics of FHIR profile, and how to use `$validate` for validating resources against the profiles at resource creation and update.

## FHIR profile: the basics

A profile sets restrictions on the resource, usually represented as a `StructureDefinition` resource. `StructureDefinition` defines a set of restrictions on the content of a resource or a data type, such as what fields a resource has and what values these fields can take. For example, profiles can restrict cardinality (e.g. setting the maximum cardinality to 0 to rule out the element), or restrict the contents of an element to a single fixed value. It can also specify additional constraints on an existing profile. A `StructureDefinition` is identified by its canonical URL, such as: 

```rest
http://hl7.org/fhir/StructureDefinition/{resource}
http://hl7.org/fhir/StructureDefinition/patient-birthPlace
http://hl7.org/fhir/StructureDefinition/bmi
http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance
```

### Base profile and custom profile

There are two "types" of profiles: base profile and custom profile. A base profile is a base `StructureDefinition` to which a resource needs to conform to, and have been defined by base resources such as `Patient` or `Observation`. For example, there is a profile under `Observation` that defines how to represent Body Mass Index (BMI) observations, and its JSON form would start like this:

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "bmi",
...
}
```
A custom profile is a set of additional constraints on top of a base profile, restricting or adding resource parameters that are not part of the base specification. Custom profile is useful because you can customize your own resource definitions by specifying the constraints and extensions on the existing base resource. For example, you might want to build a profile that shows `AllergyIntolerance` resource instances based on `Patient` genders, in which case you would create a custom profile on top of an existing `Patient` profile with `AllergyIntolerance` profile.

A custom profile is also specified by various `Implementation Guide`s. Some common Implementation Guides are:

|Name |URL
|---- |----
Us Core |https://www.hl7.org/fhir/us/core/ 
CARIN Blue Button |http://hl7.org/fhir/us/carin-bb/ 
Da Vinci Payer Data Exchange |http://hl7.org/fhir/us/davinci-pdex/
Argonaut |http://www.fhir.org/guides/argonaut/pd/ 

## Validating resources against the profiles

FHIR resources like `Patient` or `Observation` can express their conformance to specific profiles. This allows our FHIR server to **validate** given resources against the associated profiles or the specified profiles. Validating a resource against profiles means checking if your resources conform to the profiles, including the specifications listed in `Resource.meta.profile` or in an `Implementation Guide`.

There are two ways for you to validate your resource. First, you can use `$validate`. Second, you can `POST` it to the server as part of a resource `Update` or `Create` operation. In both cases, you can decide via your FHIR server configuration what to do when the resource does not conform to your desired profile.

Currently, Azure API for FHIR supports the following capabilities:
- Accessing profiles and storing profiles.
- Validate that a resource conforms to a base profile or a custom profile using $validate.
- Validate resources as they are created or updated.
- Add profiles in the capability statement.

### Accessing profiles and storing profiles

All valid profiles should be accessible by querying:

```rest
GET http://<your FHIR service base URL>/StructureDefinition?url={canonicalUrl} 
GET http://my-fhir-server.azurewebsites.net/StructureDefinition?url=http://hl7.org/fhir/us/core/StructureDefinition/us-core-goal
```

For storing profiles to the server, you can do a `POST` request: 

```rest
POST 
```

### Using $validate 

`$validate` operation checks whether the provided profile is valid, and whether the resource conforms to the specified profile. As mentioned in the [HL7 FHIR specifications](https://www.hl7.org/fhir/resource-operation-validate.html), you can also specify the `mode` for `$validate`, such as `create`, `update`, and `delete`. The server will always return an `OperationOutcome` as the validation results.

#### Validating an existing resource

To validate an existing resource, use `$validate` in a `GET` request:

```rest
GET http://<your FHIR service base URL>/{resource}/{resource ID}/$validate
GET http://my-fhir-server.azurewebsites.net/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate
```

In the example above, you would be validating a `Patient` resource `blah`. If it is valid, you will get an `OperationOutcome` such as the following:

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

If the resource is not valid, you will get an error code and an error message with details on why the resource is invalid. A `4xx` or `5xx` error means that the validation itself could not be performed, and it is unknown whether the resource is valid or not. An example `OperationOutcome` returned with error messages could look like the following:

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

In this example above, the resource did not conform to the provided `Patient` profile which required a patient identifier value and gender.

If you would like to specify a profile as a parameter, you have an option to specify the canonical URL for the profile to validate against, such as the following example with US Core Patient profile and a base profile for `heartrate`:

```rest
GET http://<your FHIR service base URL>/{Resource}/{Resource ID}/$validate?profile={canonicalUrl}
GET http://my-fhir-server.azurewebsites.net/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate?profile=http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient
GET http://my-fhir-server.azurewebsites.net/Observation/12345678/$validate?profile=http://hl7.org/fhir/StructureDefinition/heartrate
```

#### Validating a new resource

If you would like to validate a new resource that you are uploading to the server, you can do a `POST` request:

```rest
POST http://<your FHIR service base URL>/{Resource}/$validate 
POST http://my-fhir-server.azurewebsites.net/Patient/$validate 
```

This request will create the new resource you are specifying in the request payload, whether it is in a JSON or XML format, and validate the uploaded resource. 

### Validate on resource CREATE or resource UPDATE

You can choose when you would like to validate your resource, such as on resource CREATE or UPDATE. You can specify this in the server configuration setting, under the `CoreFeatures`:

```json
{
   "FhirServer": {
      "CoreFeatures": {
            "ProfileValidationOnCreate": true,
            "ProfileValidationOnUpdate": false
        }
}
```

If the resource conforms to the provided `Resource.meta.profile` and the profile is present in the system, the server will act accordingly to the configuration setting above. If the provided profile is not present in the server, the validation request will be ignored and left in `Resource.meta.profile`.

Validation can be quite expensive, so it is usually run only on test servers or on a small subset of resources - which is why it is important to have these ways to turn the validation operation on or off validation on the server side. If the server configuration specifies to opt out of validation on resource Create/Update, user can override the behavior by specifying it in the `header` of the Create/Update request:

```rest
x-ms-profile-validation: true
```

### Profiles in the capability statement

`Capability Statement` lists all of the possible behaviors of a FHIR Server to be used as a statement of the server functionality, such as `StructureDefinition`s and `ValueSet`s. Azure API for FHIR updates the capability statement with information on the uploaded and stored profiles in the forms of:

- `CapabilityStatement.rest.resource.profile` 
- `CapabilityStatement.rest.resource.supportedProfile` 

These will show all of the specification for the profile that describes the overall support for the resource, including any constraints on cardinality, bindings, extensions, or other restrictions. Therefore, when you `POST` a profile in the form of a `StructureDefinition`, and `GET` the resource metadata to see the full capability statement, you will see next to the `supportedProfiles` parameter all the details on the profile you uploaded. 