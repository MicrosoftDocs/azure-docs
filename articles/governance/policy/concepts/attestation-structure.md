---
title: Details of the Azure Policy attestation structure
description: Describes the components of the Azure Policy attestation JSON object.
ms.date: 09/23/2022
ms.topic: conceptual
ms.author: timwarner
author: timwarner-msft
---
# Azure Policy attestation structure

`Microsoft.PolicyInsights/attestations`, called an Attestation resource, is a new proxy resource type
 that sets the compliance states for targeted resources in a manual policy. You can only have one
 attestation on one resource for an individual policy. In preview, Attestations are available
only through the Azure Resource Manager (ARM) API.

Below is an example of creating a new attestation resource:

```http
PUT http://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.PolicyInsights/attestations/{name}?api-version=2019-10-01
```

## Request body

Below is a sample attestation resource JSON object:

```json
"properties": {
    "policyAssignmentId": "/subscriptions/{subscriptionID}/providers/microsoft.authorization/policyassignments/{assignmentID}",
    "policyDefinitionReferenceId": "{definitionReferenceID}",
    "complianceState": "Compliant",
    "expiresOn": "2023-07-14T00:00:00Z",
    "owner": "{AADObjectID}",
    "comments": "This subscription has passed a security audit. See attached details for evidence",
    "evidence": [
        {
          "description": "The results of the security audit.",
          "sourceUri": "https://gist.github.com/contoso/9573e238762c60166c090ae16b814011"
        },
        {
          "description": "Description of the attached evidence document.",
          "sourceUri": "https://storagesamples.blob.core.windows.net/sample-container/contingency_evidence_adendum.docx"
        },
    ],
}
```

|Property  |Description  |
|---------|---------|
|policyAssignmentId     |Required assignment ID for which the state is being set. |
|policyDefinitionReferenceId     |Optional definition reference ID, if within a policy initiative. |
|complianceState     |Desired state of the resources. Allowed values are `Compliant`, `NonCompliant`, and `Unknown`. |
|owner     |Optional Azure AD object ID of responsible party. |
|comments     |Optional description of why state is being set. |
|evidence     |Optional link array for attestation evidence. |

Because attestations are a separate resource from policy assignments, they have their own lifecycle. You can PUT, GET and DELETE attestations by using the ARM API. See the [Policy REST API Reference](/rest/api/policy) for more details.

## Next steps

- Review [Understanding policy effects](effects.md).
- Study the [initiative definition structure](./initiative-definition-structure.md)
- Review examples at [Azure Policy samples](../samples/index.md).
