---
title: $validate FHIR resources against profiles on Azure API for FHIR
description: $validate FHIR resources against profiles
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/06/2021
ms.author: ginle
---
# How to validate FHIR resources against profiles

HL7 FHIR defines a standard and interoperable way to store and exchange healthcare data. Even within the base FHIR specification, it can be helpful to define additional rules or extensions based on the context that FHIR is being used. For such context-specific uses of FHIR, **FHIR profiles** are used for the extra layer of specifications.

[FHIR profile](https://www.hl7.org/fhir/profiling.html) describes additional context, such as constraints or extensions, on a resource represented as a `StructureDefinition`. The HL7 FHIR standard defines a set of base resources, and these standard base resources have generic definitions. FHIR profile allows you to narrow down and customize resource definitions using constraints and extensions.

Azure API for FHIR allows validating resources against profiles to see if the resources conform to the profiles. This article walks through the basics of FHIR profile, and how to use `$validate` for validating resources against the profiles when creating and updating resources.

## FHIR profile: the basics

A profile sets additional context on the resource, usually represented as a `StructureDefinition` resource. `StructureDefinition` defines a set of rules on the content of a resource or a data type, such as what fields a resource has and what values these fields can take. For example, profiles can restrict cardinality (e.g. setting the maximum cardinality to 0 to rule out the element), restrict the contents of an element to a single fixed value, or define required extensions for the resource. It can also specify additional constraints on an existing profile. A `StructureDefinition` is identified by its canonical URL:

```rest
http://hl7.org/fhir/StructureDefinition/{resource}
```
Where in the `{resource}` field, you specify the name of the profile.

For example:
-  `http://hl7.org/fhir/StructureDefinition/patient-birthPlace` 
is a base profile that requires information on the registered address of birth of the patient.
- `http://hl7.org/fhir/StructureDefinition/bmi` is another base profile that defines how to represent Body Mass Index (BMI) observations.
- `http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance` is a US Core profile that sets minimum expectations for `AllergyIntolerance` resource associated with a patient, and identifies mandatory fields such as extensions and value sets.

### Base profile and custom profile

There are two types of profiles: base profile and custom profile. A base profile is a base `StructureDefinition` to which a resource needs to conform to, and has been defined by base resources such as `Patient` or `Observation`. For example, a Body Mass Index (BMI) `Observation` profile would start like this:

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "bmi",
...
}
```
A custom profile is a set of additional constraints on top of a base profile, restricting or adding resource parameters that are not part of the base specification. Custom profile is useful because you can customize your own resource definitions by specifying the constraints and extensions on the existing base resource. For example, you might want to build a profile that shows `AllergyIntolerance` resource instances based on `Patient` genders, in which case you would create a custom profile on top of an existing `Patient` profile with `AllergyIntolerance` profile.

> !NOTE
> Custom profiles must build on top of the base resource and cannot conflict with the base resource. For example, if an element has a cardinality of 1..1, the custom profile cannot make it optional.

Custom profiles also specified by various Implementation Guides. Some common Implementation Guides are:

|Name |URL
|---- |----
Us Core |https://www.hl7.org/fhir/us/core/ 
CARIN Blue Button |http://hl7.org/fhir/us/carin-bb/ 
Da Vinci Payer Data Exchange |http://hl7.org/fhir/us/davinci-pdex/
Argonaut |http://www.fhir.org/guides/argonaut/pd/ 

## Accessing profiles and storing profiles

### Viewing profiles

You can access your existing profiles in the server using a `GET` request. All valid profiles, such as the profiles with valid canonical URLs in Implementation Guides, should be accessible by querying:

```rest
GET http://<your FHIR service base URL>/StructureDefinition?url={canonicalUrl} 
```

Where the field `{canonicalUrl}` would be replaced with the canonical URL of your profile.

For example, if you want to view US Core `Goal` resource profile:

```rest
GET http://my-fhir-server.azurewebsites.net/StructureDefinition?url=http://hl7.org/fhir/us/core/StructureDefinition/us-core-goal
```

### Storing profiles

For storing profiles to the server, you can do a `POST` request: 

```rest
POST http://<your FHIR service base URL>/{Resource}
```

In which the field `{Resource}` will be replaced by `StructureDefinition`, and you would have your `StructureDefinition` resource `POST`ed to the server in `JSON` or `XML` format.

Most profiles have the resource type `StructureDefinition`, but they can also be of other resource types such as sPatients, `Observation`, or `Encounter`. For example, if you `POST` a `Patient` profile in a JSON form, the server will return the stored profile with the assigned `id` for the profile, just as it would with `StructureDefinition`:

```json
{
    "resourceType": "Patient",
    "id": "a473ad44-386b-46e7-b8fa-a2b5babf3270",
    "meta": {
        "versionId": "1",
        "lastUpdated": "2021-04-03T20:54:06.909+00:00"
    },
    "identifier": [
        {
            "use": "usual",
            "system": "urn:oid:2.16.840.1.113883.2.4.6.3",
            "value": "738472983"
        },
        {
            "use": "usual",
            "system": "urn:oid:2.16.840.1.113883.2.4.6.3"
        }
    ],
    "active": true,
    "name": [
        {
            "use": "usual",
            "family": "van de Heuvel",
            "given": [
                "Pieter"
            ],
            "suffix": [
                "MSc"
            ]
        }
    ],
...
```
### Profiles in the capability statement
The `Capability Statement` lists all possible behaviors of your FHIR server to be used as a statement of the server functionality, such as `StructureDefinition`s and `ValueSet`s. Azure API for FHIR updates the capability statement with information on the uploaded and stored profiles in the forms of:
- `CapabilityStatement.rest.resource.profile` 
- `CapabilityStatement.rest.resource.supportedProfile` 

These will show all of the specification for the profile that describes the overall support for the resource, including any constraints on cardinality, bindings, extensions, or other restrictions. Therefore, when you `POST` a profile in the form of a `StructureDefinition`, and `GET` the resource metadata to see the full capability statement, you will see next to the `supportedProfiles` parameter all the details on the profile you uploaded. 

## Validating resources against the profiles

FHIR resources, such as `Patient` or `Observation`, can express their conformance to specific profiles. This allows our FHIR server to **validate** given resources against the associated profiles or the specified profiles. Validating a resource against profiles means checking if your resource conforms to the profiles, including the specifications listed in `Resource.meta.profile` or in an Implementation Guide.

There are two ways for you to validate your resource. First, you can use `$validate` operation against a resource that is already in the FHIR server. Second, you can `POST` it to the server as part of a resource `Update` or `Create` operation. In both cases, you can decide via your FHIR server configuration what to do when the resource does not conform to your desired profile.

### Using $validate 

The `$validate` operation checks whether the provided profile is valid, and whether the resource conforms to the specified profile. As mentioned in the [HL7 FHIR specifications](https://www.hl7.org/fhir/resource-operation-validate.html), you can also specify the `mode` for `$validate`, such as `create` and `update`:

- `create`: The server checks that the profile content is unique from the existing resources and that it is acceptable to be created as a new resource
- `update`: checks that the profile is an update against the nominated existing resource (e.g. that no changes are made to the immutable fields)

The server will always return an `OperationOutcome` as the validation results.

#### Validating an existing resource

To validate an existing resource, use `$validate` in a `GET` request:

```rest
GET http://<your FHIR service base URL>/{resource}/{resource ID}/$validate
```

For example:

```rest
GET http://my-fhir-server.azurewebsites.net/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate
```

In the example above, you would be validating the existng `Patient` resource `a6e11662-def8-4dde-9ebc-4429e68d130e`. If it is valid, you will get an `OperationOutcome` such as the following:

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

If you would like to specify a profile as a parameter, you have an option to specify the canonical URL for the profile to validate against, such as the following example with US Core `Patient` profile and a base profile for `heartrate`:

```rest
GET http://<your FHIR service base URL>/{Resource}/{Resource ID}/$validate?profile={canonicalUrl}
```

For example:

```rest
GET http://my-fhir-server.azurewebsites.net/Patient/a6e11662-def8-4dde-9ebc-4429e68d130e/$validate?profile=http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient
GET http://my-fhir-server.azurewebsites.net/Observation/12345678/$validate?profile=http://hl7.org/fhir/StructureDefinition/heartrate
```

#### Validating a new resource

If you would like to validate a new resource that you are uploading to the server, you can do a `POST` request:

```rest
POST http://<your FHIR service base URL>/{Resource}/$validate
```

For example:

```rest 
POST http://my-fhir-server.azurewebsites.net/Patient/$validate 
```

This request will create the new resource you are specifying in the request payload, whether it is in a JSON or XML format, and validate the uploaded resource. Then, it will return an `OperationOutcome` as a result of the validation on the new resource.

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


## Next steps

In this article, you have learned about FHIR profiles, and how to validate resources against profiles using $validate. To learn about Azure API for FHIR's other supported features, check out this page:

>[!div class="nextstepaction"]
>[FHIR supported features](fhir-features-supported.md)