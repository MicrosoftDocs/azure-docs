---
title: Azure Policy definitions audit effect
description: Azure Policy definitions audit effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions audit effect

The `audit` effect is used to create a warning event in the activity log when evaluating a non-compliant resource, but it doesn't stop the request.

## Audit evaluation

Audit is the last effect checked by Azure Policy during the creation or update of a resource. For a Resource Manager mode, Azure Policy then sends the resource to the Resource Provider. When evaluating a create or update request for a resource, Azure Policy adds a `Microsoft.Authorization/policies/audit/action` operation to the activity log and marks the resource as non-compliant. During a standard compliance evaluation cycle, only the compliance status on the resource is updated.

## Audit properties

For a Resource Manager mode, the audit effect doesn't have any other properties for use in the `then` condition of the policy definition.

For a Resource Provider mode of `Microsoft.Kubernetes.Data`, the audit effect has the following subproperties of `details`. Use of `templateInfo` is required for new or updated policy definitions as `constraintTemplate` is deprecated.

- `templateInfo` (required)
  - Can't be used with `constraintTemplate`.
  - `sourceType` (required)
    - Defines the type of source for the constraint template. Allowed values: `PublicURL` or `Base64Encoded`.
    - If `PublicURL`, paired with property `url` to provide location of the constraint template. The location must be publicly accessible.

      > [!WARNING]
      > Don't use SAS URIs, URL tokens, or anything else that could expose secrets in plain text.

    - If `Base64Encoded`, paired with property `content` to provide the base 64 encoded constraint template. See [Create policy definition from constraint template](../how-to/extension-for-vscode.md) to create a custom definition from an existing [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) Gatekeeper v3 [constraint template](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates).
- `constraint` (deprecated)
  - Can't be used with `templateInfo`.
  - The CRD implementation of the Constraint template. Uses parameters passed via `values` as `{{ .Values.<valuename> }}`. In example 2 below, these values are    `{{ .Values.excludedNamespaces }}` and `{{ .Values.allowedContainerImagesRegex }}`.
- `constraintTemplate` (deprecated)
  - Can't be used with `templateInfo`.
  - Must be replaced with `templateInfo` when creating or updating a policy definition.
  - The Constraint template CustomResourceDefinition (CRD) that defines new Constraints. The template defines the Rego logic, the Constraint schema, and the Constraint parameters that are passed via `values` from Azure Policy. For more information, go to [Gatekeeper constraints](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraints).
- `constraintInfo` (optional)
  - Can't be used with `constraint`, `constraintTemplate`, `apiGroups`, `kinds`, `scope`, `namespaces`, `excludedNamespaces`, or `labelSelector`.
  - If `constraintInfo` isn't provided, the constraint can be generated from `templateInfo` and policy.
  - `sourceType` (required)
    - Defines the type of source for the constraint. Allowed values: `PublicURL` or `Base64Encoded`.
    - If `PublicURL`, paired with property `url` to provide location of the constraint. The location must be publicly accessible.

      > [!WARNING]
      > Don't use SAS URIs or tokens in `url` or anything else that could expose a secret.

- `namespaces` (optional)
  - An _array_ of
    [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
    to limit policy evaluation to.
  - An empty or missing value causes policy evaluation to include all namespaces not defined in _excludedNamespaces_.
- `excludedNamespaces` (optional)
  - An _array_ of [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) to exclude from policy evaluation.
- `labelSelector` (optional)
  - An _object_ that includes _matchLabels_ (object) and _matchExpression_ (array) properties to allow specifying which Kubernetes resources to include for policy evaluation that matched the provided [labels and selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).
  - An empty or missing value causes policy evaluation to include all labels and selectors, except
    namespaces defined in _excludedNamespaces_.
- `scope` (optional)
  - A _string_ that includes the [scope](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#the-match-field) property to allow specifying if cluster-scoped or namespaced-scoped resources are matched.
- `apiGroups` (required when using _templateInfo_)
  - An _array_ that includes the [API groups](https://kubernetes.io/docs/reference/using-api/#api-groups) to match. An empty array (`[""]`) is the core API group.
  - Defining `["*"]` for _apiGroups_ is disallowed.
- `kinds` (required when using _templateInfo_)
  - An _array_ that includes the [kind](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#required-fields)
    of Kubernetes object to limit evaluation to.
  - Defining `["*"]` for _kinds_ is disallowed.
- `values` (optional)
  - Defines any parameters and values to pass to the Constraint. Each value must exist and match a property in the validation `openAPIV3Schema` section of the Constraint template CRD.

## Audit example

Example 1: Using the audit effect for Resource Manager modes.

```json
"then": {
  "effect": "audit"
}
```

Example 2: Using the audit effect for a Resource Provider mode of `Microsoft.Kubernetes.Data`. The additional information in `details.templateInfo` declares use of `PublicURL` and sets `url` to the location of the Constraint template to use in Kubernetes to limit the allowed container images.

```json
"then": {
  "effect": "audit",
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
