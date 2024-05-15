---
title: "Customize namespace scoped resources in Azure Kubernetes Fleet Manager with resource overrides"
description: This article provides an overview of how to use the Fleet ResourceOverride API to override namespace scoped resources in Azure Kubernetes Fleet Manager.
ms.topic: how-to
ms.date: 05/10/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
---

# Customize namespace scoped resources in Azure Kubernetes Fleet Manager with resource overrides (preview)

This article provides an overview of how to use the Fleet `ResourceOverride` API to override namespace scoped resources in Azure Kubernetes Fleet Manager.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Resource override overview

The resource override feature allows you to modify or override specific attributes of existing resources within a namespace. With `ResourceOverride`, you can define rules based on cluster labels, specifying changes to be applied to resources such as Deployments, StatefulSets, ConfigMaps, or Secrets. These changes can include updates to container images, environment variables, resource limits, or any other configurable parameters, ensuring consistent management and enforcement of configurations across your Fleet-managed Kubernetes clusters.

## API components

The `ResourceOverride` API consists of the following components:

* `resourceSelectors`: Specifies the set of resources selected for overriding.
* `policy`: Specifies the set of rules to apply to the selected resources.

### Resource selectors

A `ResourceOverride` object can include one or more resource selectors to specify which resources to override. The `ResourceSelector` object includes the following fields:

> [!NOTE]
> If you select a namespace in the `ResourceSelector`, the override will apply to all resources in the namespace.

* `group`: The API group of the resource.
* `version`: The API version of the resource.
* `kind`: The kind of the resource.
* `namespace`: The namespace of the resource.

To add a resource selector to a `ResourceOverride` object, use the `resourceSelectors` field with the following YAML format:

> [!IMPORTANT]
> The `ResourceOverride` needs to be in the same namespace as the resource you want to override.

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ResourceOverride
metadata:
  name: example-resource-override
  namespace: test-namespace
spec:
  resourceSelectors:
    -  group: apps
       kind: Deployment
       version: v1
       name: test-nginx
```

This example selects a `Deployment` named `test-nginx` from the `test-namespace` namespace for overriding.

## Policy

A `Policy` object consists of a set of rules, `overrideRules`, that specify the changes to apply to the selected resources. Each `overrideRule` object supports the following fields:

* `clusterSelector`: Specifies the set of clusters to which the override rule applies.
* `jsonPatchOverrides`: Specifies the changes to apply to the selected resources.

To add an override rule to a `ResourceOverride` object, use the `policy` field with the following YAML format:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ResourceOverride
metadata:
  name: example-resource-override
  namespace: test-namespace
spec:
  resourceSelectors:
    -  group: apps
       kind: Deployment
       version: v1
       name: test-nginx
  policy:
    overrideRules:
      - clusterSelector:
          clusterSelectorTerms:
            - labelSelector:
                matchLabels:
                  env: prod
        jsonPatchOverrides:
          - op: replace
            path: /spec/template/spec/containers/0/image
            value: "nginx:1.20.0"
```

This example replaces the container image in the `Deployment` with the `nginx:1.20.0` image for clusters with the `env: prod` label.

### Cluster selector

You can use the `clusterSelector` field in the `overrideRule` object to specify the resources to which the override rule applies. The `ClusterSelector` object supports the following field:

* `clusterSelectorTerms`: A list of terms that specify the criteria for selecting clusters. Each term includes a `labelSelector` field that defines a set of labels to match.

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

`jsonPatchOverrides` apply a JSON patch on the selected resources following [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902).

### Use multiple override rules

You can add multiple `overrideRules` to a `policy` to apply multiple changes to the selected resources, as shown in the following example:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1alpha1
kind: ResourceOverride
metadata:
  name: ro-1
  namespace: test
spec:
  resourceSelectors:
    -  group: apps
       kind: Deployment
       version: v1
       name: test-nginx
  policy:
    overrideRules:
      - clusterSelector:
          clusterSelectorTerms:
            - labelSelector:
                matchLabels:
                  env: prod
        jsonPatchOverrides:
          - op: replace
            path: /spec/template/spec/containers/0/image
            value: "nginx:1.20.0"
      - clusterSelector:
          clusterSelectorTerms:
            - labelSelector:
                matchLabels:
                  env: test
        jsonPatchOverrides:
          - op: replace
            path: /spec/template/spec/containers/0/image
            value: "nginx:latest"
```

This example replaces the container image in the `Deployment` with the `nginx:1.20.0` image for clusters with the `env: prod` label and the `nginx:latest` image for clusters with the `env: test` label.

## Apply the resource override

1. Create a `ClusterResourcePlacement` resource to specify the placement rules for distributing the resource overrides across the cluster infrastructure, as shown in the following example. Make sure you select the appropriate namespaces.

    ```yaml
    apiVersion: placement.kubernetes-fleet.io/v1beta1
    kind: ClusterResourcePlacement
    metadata:
      name: crp-example
    spec:
      resourceSelectors:
        - group: ""
          kind: Namespace
          name: test-namespace
          version: v1
      policy:
        placementType: PickAll
        affinity:
          clusterAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              clusterSelectorTerms:
                - labelSelector:
                    matchLabels:
                      env: prod
                - labelSelector:
                    matchLabels:
                      env: test
    ```

    This example distributes resources within the `test-namespace` across all clusters labeled with `env:prod` and `env:test`. As the changes are implemented, the corresponding `ResourceOverride` configurations will be applied to the designated resources, triggered by the selection of matching deployment resource, `my-deployment`.

2. Apply the `ClusterResourcePlacement` using the `kubectl apply` command.

    ```bash
    kubectl apply -f cluster-resource-placement.yaml
    ```

3. Verify the `ResourceOverride` object applied to the selected resources by checking the status of the `ClusterResourcePlacement` resource using the `kubectl describe` command.

    ```bash
    kubectl describe clusterresourceplacement crp-example
    ```

    Your output should resemble the following example output:

    ```output
    Status:
      Conditions:
        ...
        Message:                The selected resources are successfully overridden in the 10 clusters
        Observed Generation:    1
        Reason:                 OverriddenSucceeded
        Status:                 True
        Type:                   ClusterResourcePlacementOverridden
        ...
      Observed Resource Index:  0
      Placement Statuses:
        Applicable Resource Overrides:
          Name:        ro-1-0
          Namespace:   test-namespace
        Cluster Name:  member-50
        Conditions:
          ...
          Last Transition Time:  2024-04-26T22:57:14Z
          Message:               Successfully applied the override rules on the resources
          Observed Generation:   1
          Reason:                OverriddenSucceeded
          Status:                True
          Type:                  Overridden
         ...
    ```

    The `ClusterResourcePlacementOverridden` condition indicates whether the resource override was successfully applied to the selected resources. Each cluster maintains its own `Applicable Resource Overrides` list, which contains the resource override snapshot if relevant. Individual status messages for each cluster indicate whether the override rules were successfully applied.

## Next steps

To learn more about Fleet, see the following resources:

* [Upstream Fleet documentation](https://github.com/Azure/fleet/tree/main/docs)
* [Azure Kubernetes Fleet Manager overview](./overview.md)
