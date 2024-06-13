---
title: Azure Policy definitions deny effect
description: Azure Policy definitions deny effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions deny effect

The `deny` effect is used to prevent a resource request that doesn't match defined standards through a policy definition and fails the request.

## Deny evaluation

When creating or updating a matched resource in a Resource Manager mode, deny prevents the request before being sent to the Resource Provider. The request is returned as a `403 (Forbidden)`. In the portal, the `Forbidden` can be viewed as a deployment status that was prevented by the policy assignment. For a Resource Provider mode, the resource provider manages the evaluation of the resource.

During evaluation of existing resources, resources that match a `deny` policy definition are marked as non-compliant.

## Deny properties

For a Resource Manager mode, the `deny` effect doesn't have any more properties for use in the `then` condition of the policy definition.

For a Resource Provider mode of `Microsoft.Kubernetes.Data`, the `deny` effect has the following subproperties of `details`. Use of `templateInfo` is required for new or updated policy definitions as `constraintTemplate` is deprecated.

- `templateInfo` (required)
  - Can't be used with `constraintTemplate`.
  - `sourceType` (required)
    - Defines the type of source for the constraint template. Allowed values: `PublicURL` or `Base64Encoded`.
    - If `PublicURL`, paired with property `url` to provide location of the constraint template. The location must be publicly accessible.

      > [!WARNING]
      > Don't use SAS URIs or tokens in `url` or anything else that could expose a secret.

    - If `Base64Encoded`, paired with property `content` to provide the base 64 encoded constraint template. See [Create policy definition from constraint template](../how-to/extension-for-vscode.md) to create a custom definition from an existing [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) Gatekeeper v3 [constraint template](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates).
- `constraint` (optional)
  - Can't be used with `templateInfo`.
  - The CRD implementation of the Constraint template. Uses parameters passed via `values` as `{{ .Values.<valuename> }}`. In example 2 below, these values are `{{ .Values.excludedNamespaces }}` and `{{ .Values.allowedContainerImagesRegex }}`.
- `constraintTemplate` (deprecated)
  - Can't be used with `templateInfo`.
  - Must be replaced with `templateInfo` when creating or updating a policy definition.
  - The Constraint template CustomResourceDefinition (CRD) that defines new Constraints. The template defines the Rego logic, the Constraint schema, and the Constraint parameters that are passed via `values` from Azure Policy. For more information, go to [Gatekeeper constraints](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraints).
- `constraintInfo` (optional)
  - Can't be used with `constraint`, `constraintTemplate`, `apiGroups`, or `kinds`.
  - If `constraintInfo` isn't provided, the constraint can be generated from `templateInfo` and policy.
  - `sourceType` (required)
    - Defines the type of source for the constraint. Allowed values: `PublicURL` or `Base64Encoded`.
    - If `PublicURL`, paired with property `url` to provide location of the constraint. The location must be publicly accessible.

      > [!WARNING]
      > Don't use SAS URIs or tokens in `url` or anything else that could expose a secret.
- `namespaces` (optional)
  - An _array_ of [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) to limit policy evaluation to.
  - An empty or missing value causes policy evaluation to include all namespaces, except the ones defined in `excludedNamespaces`.
- `excludedNamespaces` (required)
  - An _array_ of [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) to exclude from policy evaluation.
- `labelSelector` (required)
  - An _object_ that includes `matchLabels` (object) and `matchExpression` (array) properties to allow specifying which Kubernetes resources to include for policy evaluation that matched the provided [labels and selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).
  - An empty or missing value causes policy evaluation to include all labels and selectors, except namespaces defined in `excludedNamespaces`.
- `apiGroups` (required when using _templateInfo_)
  - An _array_ that includes the [API groups](https://kubernetes.io/docs/reference/using-api/#api-groups) to match. An empty array (`[""]`) is the core API group.
  - Defining `["*"]` for _apiGroups_ is disallowed.
- `kinds` (required when using _templateInfo_)
  - An _array_ that includes the [kind](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#required-fields) of Kubernetes object to limit evaluation to.
  - Defining `["*"]` for _kinds_ is disallowed.
- `values` (optional)
  - Defines any parameters and values to pass to the Constraint. Each value must exist in the Constraint template CRD.

## Deny example

Example 1: Using the `deny` effect for Resource Manager modes.

```json
"then": {
  "effect": "deny"
}
```

Example 2: Using the `deny` effect for a Resource Provider mode of `Microsoft.Kubernetes.Data`. The additional information in `details.templateInfo` declares use of `PublicURL` and sets `url` to the location of the Constraint template to use in Kubernetes to limit the allowed container images.

```json
"then": {
  "effect": "deny",
  "details": {
    "templateInfo": {
      "sourceType": "PublicURL",
      "url": "https://store.policy.core.windows.net/kubernetes/container-allowed-images/v1/template.yaml",
    },
    "values": {
      "imageRegex": "[parameters('allowedContainerImagesRegex')]"
    },
    "apiGroups": [
      ""
    ],
    "kinds": [
      "Pod"
    ]
  }
}
```


## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
