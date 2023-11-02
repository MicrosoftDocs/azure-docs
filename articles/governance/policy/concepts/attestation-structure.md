---
title: Details of the Azure Policy attestation structure
description: Describes the components of the Azure Policy attestation JSON object.
ms.date: 09/23/2022
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
---
# Azure Policy attestation structure

Attestations are used by Azure Policy to set compliance states of resources or scopes targeted by [manual policies](effects.md#manual). They also allow users to provide additional metadata or link to evidence which accompanies the attested compliance state.  

> [!NOTE]
> Attestations can be created and managed only through Azure Policy [Azure Resource Manager (ARM) API](/rest/api/policy/attestations), [PowerShell](/powershell/module/az.policyinsights) or [Azure CLI](/cli/azure/policy/attestation). 

## Best practices

Attestations can be used to set the compliance state of an individual resource for a given manual policy. This means that each applicable resource requires one attestation per manual policy assignment. For ease of management, manual policies should be designed to target the scope which defines the boundary of resources whose compliance state needs to be attested. 

For example, suppose an organization divides teams by resource group, and each team is required to attest to development of procedures for handling resources within that resource group. In this scenario, the conditions of the policy rule should specify that type equals `Microsoft.Resources/resourceGroups`. This way, one attestation is required for the resource group, rather than for each individual resource within. Similarly, if the organization divides teams by subscriptions, the policy rule should target `Microsoft.Resources/subscriptions`.  

Typically, the provided evidence should correspond with relevant scopes of the organizational structure. This pattern prevents the need to duplicate evidence across many attestations. Such duplications would make manual policies difficult to manage, and indicate that the policy definition targets the wrong resource(s).

## Example attestation

Below is an example of creating a new attestation resource which sets the compliance state for a resource group targeted by a manual policy assignment:

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
    "assessmentDate": "2022-11-14T00:00:00Z",
    "metadata": {
         "departmentId": "{departmentID}"
     }
}
```

|Property  |Description  |
|---------|---------|
|`policyAssignmentId`     |Required assignment ID for which the state is being set. |
|`policyDefinitionReferenceId`     |Optional definition reference ID, if within a policy initiative. |
|`complianceState`     |Desired state of the resources. Allowed values are `Compliant`, `NonCompliant`, and `Unknown`. |
|`expiresOn`     |Optional date on which the compliance state should revert from the attested compliance state to the default state |
|`owner`     |Optional Azure AD object ID of responsible party. |
|`comments`     |Optional description of why state is being set. |
|`evidence`     |Optional array of links to attestation evidence. |
|`assessmentDate`     |Date at which the evidence was assessed. |
|`metadata`     |Optional additional information about the attestation. |

Because attestations are a separate resource from policy assignments, they have their own lifecycle. You can PUT, GET and DELETE attestations using the ARM API.  Attestations are removed if the related manual policy assignment or policyDefinitionReferenceId are deleted, or if a resource unique to the attestation is deleted.  See the [Policy REST API Reference](/rest/api/policy) for more details.

## Next steps

- Review [Understanding policy effects](effects.md).
- Study the [initiative definition structure](./initiative-definition-structure.md)
- Review examples at [Azure Policy samples](../samples/index.md).
