---
title: Configure FHIR Service Versioning Policy and History
description: Learn how to configure FHIR service versioning policy and manage resource history in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/18/2026
ms.author: kesheth
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# Versioning policy and history management

The versioning policy in the Azure Health Data Services FHIR&reg; service determines how history is stored for every resource type, with the option for resource specific configuration. This policy is directly related to managing history for FHIR resources.

## History in FHIR

History in FHIR gives you the ability to see all previous versions of a resource. You can query history in FHIR at the resource level, type level, or system level. The HL7 FHIR documentation has more information about the [history interaction](https://www.hl7.org/fhir/http.html#history). History is useful when you want to see the evolution of a resource in FHIR, or if you want to see a resource's information at a specific point in time.

All past versions of a resource are considered obsolete, and the current version of a resource should be used for normal business workflow operations. However, it can be useful to see the state of a resource as a point in time when a past decision was made.

## Versioning policy

Versioning policy in the FHIR service lets you decide how history is stored, either at a FHIR service level or at a specific resource level. 

There are three different levels for versioning policy:

- `versioned`: History is stored for operation on resources. Resource version is incremented. This option is the default.
- `version-update`: History is stored for operation on resources. Resource version is incremented. Updates require a valid `If-Match` header. For more information, see [VersionedUpdateExample.http](https://github.com/microsoft/fhir-server/blob/main/docs/rest/VersionedUpdateExample.http).
- `no-version`: History isn't created for resources. Resource version is incremented.

You can configure versioning policy as a system-wide setting, and also override it at a resource level. The system-wide setting applies to all resources in your FHIR service, unless you add a specific resource level versioning policy.

### Versioning policy comparison

| Policy Value     | History Behavior      | `meta.versionId` Update Behavior  | Default |
| ---------------- | --------------------- | -------------------------- | ------- |
| `versioned`      | History is stored     | If-Match not required      | Yes     |
| `version-update` | History is stored     | If-Match required          | No      |
| `no-version`     | History isn't stored  | If-Match not required      | No      |

> [!NOTE]
> Changing the versioning policy to `no-version` doesn't affect existing resource history. To remove history for resources, use the [$purge-history](purge-history.md) operation.

## Configure versioning policy

To configure the versioning policy, select **Versioning Policy Configuration** in your FHIR service.

:::image type="content" source="media/versioning-policy/fhir-service-versioning-policy-configuration.png" alt-text="Screenshot of the Azure portal Versioning Policy Configuration." lightbox="media/versioning-policy/fhir-service-versioning-policy-configuration.png":::

After you browse to **Versioning Policy Configuration**, you can configure the setting at both the system level and the resource level (as an override of the system level). The system level configuration (annotated as 1) applies to every resource in your FHIR service unless you configure a resource specific override (annotated as 2).

:::image type="content" source="media/versioning-policy/system-level-versus-resource-level.png" alt-text="Screenshot of Azure portal versioning policy configuration showing system level vs resource level configuration." lightbox="media/versioning-policy/system-level-versus-resource-level.png":::

When you configure resource level configuration, you select the FHIR resource type (annotated as 1) and the specific versioning policy for this specific resource (annotated as 2). Select the **Add** button (annotated as 3) to queue up this setting for saving.

:::image type="content" source="media/versioning-policy/resource-versioning.png" alt-text="Screenshot of Azure portal versioning policy configuration showing resource level configuration." lightbox="media/versioning-policy/resource-versioning.png":::

**Make sure** to select **Save** after you complete your versioning policy configuration.

:::image type="content" source="media/versioning-policy/save-button.png" alt-text="Screenshot of Azure portal versioning policy configuration showing save button." lightbox="media/versioning-policy/save-button.png":::

## History management

FHIR history helps end users see how a resource changes over time. It's also useful when you use audit logs to see the state of a resource before and after a user modifies it. In general, keep history for a resource unless you know that the history isn't needed. Frequent resource updates can result in a large amount of data storage, which can be undesirable in FHIR services with a large amount of data.

When you change the versioning policy, either at a system level or resource level, it doesn't remove the existing history for any resources in your FHIR service. To reduce the history data size in your FHIR service, use the [$purge-history](purge-history.md) operation.

> [!NOTE] 
> Add the query parameters `_summary=count` and `_count=0` to the `_history` endpoint to get a count of all versioned resources. This count includes soft deleted resources.

## Metadata-only updates and versioning

If you set the versioning policy to either `versioned` or `version-update`, metadata-only updates (changes to FHIR resources that only affect the metadata) increment the resource version, create a new version, and save the old version as a historical record. If you're making metadata-only changes by using PUT, PATCH, or `$bulk-update`, use the query parameter `_meta-history` to configure whether the old version is saved as a historical record.

- `_meta-history=true` is set by default. By default, the resource version is incremented, a new version is created, and the old version is saved as a historical record. The `lastUpdated` timestamp is updated to reflect the change.
- `_meta-history=false` can be set to `false`. This setting increments the resource version and creates a new version, but doesn't save the old version as a historical record. The `lastUpdated` timestamp is also updated to reflect the change. This configuration can help reduce data storage when making metadata-only updates.  

To run the following examples, you need:

- a FHIR service with versioning policy set to either `versioned` or `version-update`
- FHIR Data Read and FHIR Data Write permissions

### Example of `_meta-history=false` with PUT

To demonstrate the use of the `_meta-history` query parameter with PUT, follow this example:

1. Create a resource:  

    ```http
    PUT <fhir server>/Patient/test-patient
    Authorization: Bearer <token>
    Content-type: application/fhir+json

    {
        "id": "test-patient",
        "resourceType": "Patient",
        "name": [
            {
                "family": "Doe",
                "given": [ "John" ]
            }
        ]
    }
    ```

1. Create a new version of the resource. This version is 2.

    ```http
    PUT <fhir server>/Patient/test-patient
    Authorization: Bearer <token>
    Content-type: application/fhir+json

    {
        "id": "test-patient",
        "resourceType": "Patient",
        "name": [
            {
                "family": "Doe",
                "given": [ "Jane" ]
            }
        ]
    }
    ```

1. Run: `GET <fhir server>/Patient/test-patient/_history`. Two versions are returned, versions 1 and 2.
1. Use PUT to make a metadata-only update with `_meta-history=false` query parameter. 

    ```http 
    PUT <fhir server>/Patient/test-patient?_meta-history=false
    Authorization: Bearer <token>
    Content-type: application/fhir+json

    {
        "id": "test-patient",
        "resourceType": "Patient",
        "meta": {
            "tag": [
                {
                    "system": "test",
                    "code": "test"
                }
            ]
        },
        "name": [
            {
                "family": "Doe",
                "given": [ "Jane" ]
            }
        ]
    }
    ```

    This operation increments the resource version and creates version 3, but it doesn't save the old version 2 as a historical record. To see the result, run:

    `GET <fhir server>/Patient/test-patient/_history`

    The response includes two versions, versions 1 and 3. The `_meta-history=false` query parameter only affects metadata-only changes made by using PUT or PATCH. Using the query parameter to make metadata updates along with other non-metadata field value changes increments the resource version and saves the old version as a historical record.

### Example of `_meta-history=false` with PATCH or `$bulk-update`

To demonstrate the use of the `_meta-history` query parameter with PATCH or `$bulk-update`, follow this example:

1. Create a resource:  

    ```http
    PUT <fhir server>/Patient/test-patient
    Authorization: Bearer <token>
    Content-type: application/fhir+json

    {
        "id": "test-patient",
        "resourceType": "Patient",
        "name": [
            {
                "family": "Doe",
                "given": [ "John" ]
            }
        ]
    }
    ```

1. Create a new version of the resource. This version is 2.

    ```http
    PUT <fhir server>/Patient/test-patient
    Authorization: Bearer <token>
    Content-type: application/fhir+json

    {
        "id": "test-patient",
        "resourceType": "Patient",
        "meta": {
            "tag": [
                {
                    "system": "test",
                    "code": "test"
                }
            ]
        },
        "name": [
            {
                "family": "Doe",
                "given": [ "Jane" ]
            }
        ]
    }
    ```

1. Run: `GET <fhir server>/Patient/test-patient/_history`. Two versions are returned, versions 1 and 2.
1. Use PATCH or `$bulk-update` to make a metadata-only update with `_meta-history=false` query parameter. The example demonstrates using PATCH or `$bulk-update` to update only the Patient.meta.tag.system value. For more information about PATCH, see [PATCH and Conditional PATCH](rest-api-capabilities.md#patch-and-conditional-patch). For more information about `$bulk-update`, see [FHIR Bulk Update](fhir-bulk-update.md).

    Using PATCH with FHIRPath patch:  

    ```http
    PATCH <fhir server>/Patient/test-patient?_meta-history=false
    Authorization: Bearer <token>
    Content-type: application/fhir+json
    
    {
      "resourceType": "Parameters",
      "parameter": [
        {
          "name": "operation",
          "part": [
            { "name": "type",  "valueCode": "replace" },
            { "name": "path",  "valueString": "Patient.meta.tag[0].system" },
            { "name": "value", "valueUri": "test2" }
          ]
        }
      ]
    }
    ```

    If you want to bulk update multiple resources, use `$bulk-update`. The following example shows how to use `$bulk-update` to update the same metadata field for all Patient resources with `_meta-history=false`:

    ```http
    PATCH <fhir server>/Patient/$bulk-update?_meta-history=false
    Authorization: Bearer <token>
    Accept: application/fhir+json  
    Content-type: application/fhir+json
    Prefer: respond-async
    
    {
      "resourceType": "Parameters",
      "parameter": [
        {
          "name": "operation",
          "part": [
            { "name": "type",  "valueCode": "upsert" },
            { "name": "path",  "valueString": "Patient.meta.tag[0].system" },
            { "name": "value", "valueUri": "test2" }
          ]
        }
      ]
    }
    ```

    Using PATCH with JSON Patch:

    ```http
    PATCH <fhir server>/Patient/test-patient?_meta-history=false
    Authorization: Bearer <token>
    Content-type: application/json-patch+json

    [
      {
        "op": "replace",
        "path": "/meta/tag/0/system",
        "value": "test2"
      }
    ]
    ```

    This operation increments the resource version and creates version 3, but the old version 2 isn't saved as a historical record. To see the result, run: 

    `GET <fhir server>/Patient/test-patient/_history`

    The response includes two versions, versions 1 and 3. The `_meta-history=false` query parameter only affects metadata-only changes made using PUT or PATCH. Using the query parameter to make metadata updates along with other non-metadata field value changes increments the resource version and saves the old version as a historical record.

## Next steps

>[!div class="nextstepaction"]
>[Purge history operation](purge-history.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
