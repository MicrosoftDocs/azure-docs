---
title: "Customize cluster scoped resources in Azure Kubernetes Fleet Manager with cluster resource overrides"
description: This article provides an overview of how to use the Fleet ClusterResourceOverride API to override cluster scoped resources in Azure Kubernetes Fleet Manager.
ms.topic: how-to
ms.date: 05/10/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
---

# Customize cluster scoped resources in Azure Kubernetes Fleet Manager with cluster resource overrides (preview)

This article provides an overview of how to use the Fleet `ClusterResourceOverride` API to customize cluster scoped resources in Azure Kubernetes Fleet Manager.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Cluster resource override overview

The cluster resource override feature allows you to modify or override specific attributes across cluster-wide resources. With `ClusterResourceOverride`, you can define rules based on cluster labels, specifying changes to be applied to various cluster-wide resources such as namespaces, cluster roles, cluster role bindings, or custom resource definitions (CRDs). These modifications might include updates to permissions, configurations, or other parameters, ensuring consistent management and enforcement of configurations across your Fleet-managed Kubernetes clusters.

## API components

The `ClusterResourceOverride` API consists of the following components:

* **`clusterResourceSelectors`**: Specifies the set of cluster resources selected for overriding.
* **`policy`**: Specifies the set of rules to apply to the selected cluster resources.

### Cluster resource selectors

A `ClusterResourceOverride` object can include one or more cluster resource selectors to specify which resources to override. The `ClusterResourceSelector` object supports the following fields:

> [!NOTE]
> If you select a namespace in the `ClusterResourceSelector`, the override will apply to all resources in the namespace.

* `group`: The API group of the resource.
* `version`: The API version of the resource.
* `kind`: The kind of the resource.
* `name`: The name of the resource.

To add a cluster resource selector to a `ClusterResourceOverride` object, use the `clusterResourceSelectors` field with the following YAML format:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ClusterResourceOverride
metadata:
  name: example-cro
spec:
  clusterResourceSelectors:
    - group: rbac.authorization.k8s.io
      kind: ClusterRole
      version: v1
      name: secret-reader
```

This example selects a `ClusterRole` named `secret-reader` from the `rbac.authorization.k8s.io/v1` API group, as shown below, for overriding.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

## Policy

A `Policy` object consists of a set of rules, `overrideRules`, that specify the changes to apply to the selected cluster resources. Each `overrideRule` object supports the following fields:

* `clusterSelector`: Specifies the set of clusters to which the override rule applies.
* `jsonPatchOverrides`: Specifies the changes to apply to the selected resources.

To add an override rule to a `ClusterResourceOverride` object, use the `policy` field with the following YAML format:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ClusterResourceOverride
metadata:
  name: example-cro
spec:
  clusterResourceSelectors:
    - group: rbac.authorization.k8s.io
      kind: ClusterRole
      version: v1
      name: secret-reader
  policy:
    overrideRules:
      - clusterSelector:
          clusterSelectorTerms:
            - labelSelector:
                matchLabels:
                  env: prod
        jsonPatchOverrides:
          - op: remove
            path: /rules/0/verbs/2
```

This example removes the verb "list" in the `ClusterRole` named `secret-reader` on clusters with the label `env: prod`.

### Cluster selector

You can use the `clusterSelector` field in the `overrideRule` object to specify the clusters to which the override rule applies. The `ClusterSelector` object supports the following field:

* `clusterSelectorTerms`: A list of terms that specify the criteria for selecting clusters. Each term includes a `labelSelector` field that defines a set of labels to match.

> [!IMPORTANT]
> Only `labelSelector` is supported in the `clusterSelectorTerms` field.

### JSON patch overrides

You can use `jsonPatchOverrides` in the `overrideRule` object to specify the changes to apply to the selected resources. The `JsonPatch` object supports the following fields:

* `op`: The operation to perform.
  * Supported operations include `add`, `remove`, and `replace`.
    * `add`: Adds a new value to the specified path.
    * `remove`: Removes the value at the specified path.
    * `replace`: Replaces the value at the specified path.
* `path`: The path to the field to modify.
  * Guidance on specifying paths includes:
    * Must start with a `/` character.
    * Can't be empty or contain an empty string.
    * Can't be a `TypeMeta` field ("/kind" or "/apiVersion").
    * Can't be a `Metadata` field ("/metadata/name" or "/metadata/namespace") except the fields "/metadata/labels" and "/metadata/annotations".
    * Can't be any field in the status of the resource.
    * Examples of valid paths include:
      * `/metadata/labels/new-label`
      * `/metadata/annotations/new-annotation`
      * `/spec/template/spec/containers/0/resources/limits/cpu`
      * `/spec/template/spec/containers/0/resources/requests/memory`
* `value`: The value to add, remove, or replace.
  * If the `op` is `remove`, you can't specify a `value`.

### Use multiple override patches

You can add multiple `jsonPatchOverrides` to an `overrideRule` to apply multiple changes to the select cluster resources, as shown in the following example:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ClusterResourceOverride
metadata:
  name: cro-1
spec:
  clusterResourceSelectors:
    - group: rbac.authorization.k8s.io
      kind: ClusterRole
      version: v1
      name: secret-reader
  policy:
    overrideRules:
      - clusterSelector:
          clusterSelectorTerms:
            - labelSelector:
                matchLabels:
                  env: prod
        jsonPatchOverrides:
          - op: remove
            path: /rules/0/verbs/2
          - op: remove
            path: /rules/0/verbs/1
```

This example removes the verbs "list" and "watch" in the `ClusterRole` named `secret-reader` on clusters with the label `env: prod`, as shown below.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

`jsonPatchOverrides` apply a JSON patch on the selected resources following [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902).

## Apply the cluster resource override

1. Create a `ClusterResourcePlacement` resource to specify the placement rules for distributing the cluster resource overrides across the cluster infrastructure, as shown in the following example. Make sure you select the appropriate resource.

    ```yaml
    apiVersion: placement.kubernetes-fleet.io/v1beta1
    kind: ClusterResourcePlacement
    metadata:
      name: crp
    spec:
      resourceSelectors:
        - group: rbac.authorization.k8s.io
          kind: ClusterRole
          version: v1
          name: secret-reader
      policy:
        placementType: PickAll
        affinity:
          clusterAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              clusterSelectorTerms:
                - labelSelector:
                    matchLabels:
                      env: prod
    ```

    This example distributes resources across all clusters labeled with `env: prod`. As the changes are implemented, the corresponding `ClusterResourceOverride` configurations will be applied to the designated clusters, triggered by the selection of matching cluster role resource, `secret-reader`.

2. Apply the `ClusterResourcePlacement` using the `kubectl apply` command.

    ```bash
    kubectl apply -f cluster-resource-placement.yaml
    ```

3. Verify the `ClusterResourceOverride` object applied to the selected resources by checking the status of the `ClusterResourcePlacement` resource using the `kubectl describe` command.

    ```bash
    kubectl describe clusterresourceplacement crp
    ```

    Your output should resemble the following example output:

    ```output
    Status:
      Conditions:
        ...
        Last Transition Time:   2024-04-27T04:18:00Z
        Message:                The selected resources are successfully overridden in the 10 clusters
        Observed Generation:    1
        Reason:                 OverriddenSucceeded
        Status:                 True
        Type:                   ClusterResourcePlacementOverridden
        ...
      Observed Resource Index:  0
      Placement Statuses:
        Applicable Cluster Resource Overrides:
          example-cro-0
        Cluster Name:  member-50
        Conditions:
          ...
          Message:               Successfully applied the override rules on the resources
          Observed Generation:   1
          Reason:                OverriddenSucceeded
          Status:                True
          Type:                  Overridden
         ...
    ```

    The `ClusterResourcePlacementOverridden` condition indicates whether the resource override was successfully applied to the selected resources in the clusters. Each cluster maintains its own `Applicable Cluster Resource Overrides` list, which contains the cluster resource override snapshot if relevant. Individual status messages for each cluster indicate whether the override rules were successfully applied.

## Next steps

To learn more about Fleet, see the following resources:

* [Upstream Fleet documentation](https://github.com/Azure/fleet/tree/main/docs)
* [Azure Kubernetes Fleet Manager overview](./overview.md)
