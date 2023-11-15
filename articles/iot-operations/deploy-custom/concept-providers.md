---
title: Providers - Azure IoT Orchestrator
description: Understand how Azure IoT Orchestrator uses providers and components to define resources to deploy to your edge solution
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 11/02/2023

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Providers and components

Providers are an extensibility model in the Azure IoT Orchestrator service that allows it to support deployments and configuration across a wide range of OS platforms and deployment mechanisms. Providers are responsible for executing the actions required to achieve the desired state of a resource.

A provider encapsulates platform specific knowledge and implements a specific capability. In other words, the provider forms an API layer on top of the individual target resources like helm charts, ARC extensions etc., bundles them into a single entity and performs operations like installations, deletions and updates on them. A separate provider to handle each of these target resources.

## Helm

The Helm provider installs Helm charts on the target locations. The Helm provider uses the Helm chart name, repository, version, and other optional values to install and update the charts. The provider registers the new client with the Helm API, looks up the specified repository, and pulls the registry.

If you need to troubleshoot the Helm provider, see [Helm provider error codes](howto-troubleshoot-deployment.md#helm-provider-error-codes).

### Helm provider configuration

The providers that can be used for a target are defined in the target resource's 'topologies' object. When you define the providers for a target, you can pass configuration details for the provider.

The provider configuration goes in the *topologies* section of a [target manifest](./concept-manifests.md#target).

| Config parameters | Description |
| ----------------- | ----------- |
| name       | (Optional) Name for the config. |
| configType | (Optional) Type of the configuration. For example, `bytes` |
| configData | (Optional) Any other configuration details. |
| inCluster  | Flag that is set to `true` if the resource is being created in the cluster where the extension has been installed. |

For example:

```json
{ 
  "role": "helm.v3", 
  "provider": "providers.target.helm",  
  "config": { 
    "inCluster": "true"
  } 
}
```

### Helm component parameters

When you use the Helm provider to manage a component resource, the resource takes the following parameters in the **components** section of a [solution or target manifest](./concept-manifests.md):

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| name | string | Name of the Helm chart. |
| type | string | Type of the component, for example, `helm.v3`. |
| properties.chart | object | Helm chart details, including the Helm repository name, chart name, and chart version. |
| properties.values | object | (Optional) Custom values for the Helm chart. |
| properties.wait | boolean | (Optional) If set to true, the provider waits until all Pods, PVCs, Services, Deployments, StatefulSets, or ReplicaSets are in a ready state before considering the component creation successful. |

The following solution snippet demonstrates installing a Helm chart using the Helm provider:

```json
{
  "components": [
    {
      "name": "simple-chart",
      "type": "helm.v3",
      "properties": {
        "chart": {
          "repo": "oci://azureiotoperations.azurecr.io/simple-chart",
          "name": "simple-chart",
          "version": "0.1.0"
        },
        "values": {
          "e4iNamespace": "default",
          "mqttBroker": {
            "name": "aio-mq-dmqtt-frontend",
            "namespace": "default",
            "authenticationMethod": "serviceAccountToken"
          },
          "opcUaConnector": {
            "settings": {
              "discoveryUrl": "opc.tcp://opcplc-000000.alice-springs:50000",
              "authenticationMode": "Anonymous",
              "autoAcceptUnrustedCertificates": "true"
            }
          }
        }
      },
      "dependencies": []
    }
  ]
}
```

## Kubectl

The Kubectl provider applies the custom resources on the edge clusters through YAML data or a URL. The provider uses the Kubernetes API to get the resource definitions from an external YAML URL or directly from the solution component properties. The Kubernetes API then applies these custom resource definitions on the Arc-enabled clusters.

If you need to troubleshoot the Kubectl provider, see [Kubectl provider error codes](howto-troubleshoot-deployment.md#kubectl-provider-error-codes).

### Kubectl provider configuration

The providers that can be used for a target are defined in the target resource's 'topologies' object. When you define the providers for a target, you can pass configuration details for the provider.

The provider configuration goes in the *topologies* section of a [target manifest](./concept-manifests.md#target).

| Config parameters | Description |
|--|--|
| name | (Optional) Name for the config. |
| configType | (Optional) Type of the configuration. Set to `path` if the resource definition or details are coming from an external URL. Set to `inline` if the resource definition or details are specified in the components section. |
| configData | (Optional) Any other configuration details. |
| inCluster | Flag that is set to `true` if the resource is being created in the cluster where the extension has been installed. |

For example:

```json
{ 
  "role": "yaml.k8s", 
  "provider": "providers.target.kubectl",  
  "config": { 
    "inCluster": "true"
  } 
}
```

### Kubectl component parameters

When you use the Kubectl provider to manage a component resource, the resource takes the following parameters in the **components** section of a [solution or target manifest](./concept-manifests.md):

| Parameter | Type | Description |
|--|--|--|
| name | string | Name of the resource. |
| type | string | Type of the component, for example, `yaml.k8s`. |
| properties |  | Definition of the resource, provided as either a `yaml` or `resource` parameter. |
| properties.yaml | string | External URL to the YAML definition of the resource. Only supported if the `resource` parameter is *not* in use. |
| properties.resource | object | Inline definition of the resource. Only supported if the `yaml` parameter is *not* in use. |
| properties.statusProbe | object | (Optional) Inline definition of [resource status probe](#resource-status-probe) functionality. Only supported if the `resource` parameter *is* in use. |

The following solution snippet demonstrates applying a custom resource using an external URL. For this method, set the provider's config type to **path**.

```json
{
  "components": [
    {
      "name": "gatekeeper",
      "type": "kubectl",
      "properties": {
        "yaml": "https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml"
      }
    }
  ]
}
```

The following solution snippet demonstrates applying a custom resource with properties that are provided inline. For this method, set the provider's config type to **inline**.

```json
{
  "components": [ 
    {
      "name": "my-asset",
      "type": "kubectl",
      "properties": {
        "resource": {
          "apiVersion": "apiextensions.k8s.io/v1",
          "kind": "CustomResourceDefinition",
          "metadata": {
            "annotations": "controller-gen.kubebuilder.io/version: v0.10.0",
            "labels": {
              "gatekeeper.sh/system": "yes"
            },
            "Name": "assign.mutations.gatekeeper.sh"
          },
          "spec": {...}
        }
      },
      "dependencies": []
    }
  ]
}
```

#### Resource status probe

The Kubectl provider also has the functionality to check the status of a component. This resource status probe allows you to define what the successful creation and deployment of custom resources looks like. It can also validate the status of the resource using the status probe property.

This functionality is available when the Kubectl provider's config type is **inline**. The status probe property is defined as part of the component property, alongside `properties.resource`.

| Properties.statusProbe parameter | Type | Description |
| -------------------------------- | ---- | ----------- |
| succeededValues  | List[string] | List of statuses that define a successfully applied resource. |
| failedValues     | List[string] | List of statuses that define an unsuccessfully applied resource. |
| statusPath       | string   | Path to check for the status of the resource. |
| errorMessagePath | string   | Path to check for the resource error message. |
| timeout          | string   | Time in seconds or minutes after which the status probing of the resource will end. |
| interval         | string   | Time interval in seconds or minutes between two consecutive status probes. |
| initialWait      | string   | Time in seconds or minutes before initializing the first status probe. |

The following solution snipped demonstrates applying a custom resource with a status probe.

```json
{
  "solution": {
    "components": {
      "name": "gatekeeper-cr",
      "type": "yaml.k8s",
      "properties": {
        "resource": {
          "apiVersion": "apiextensions.k8s.io/v1",
          "kind": "CustomResourceDefinition",
          "metadata": {
            "annotations": "controller-gen.kubebuilder.io/version: v0.10.0",
            "labels": {
              "gatekeeper.sh/system": "yes"
            },
            "name": "assign.mutations.gatekeeper.sh"
          },
          "spec": {...}
        },
        "statusProbe": {
          "succeededValues": [
            "true",
            "active"
          ],
          "failedValues": [
            "false",
            "fail"
          ],
          "statusPath": "$.status.conditions.status",
          "errorMessagePath": "$.status.conditions.message",
          "timeout": "5m",
          "interval": "2s",
          "initialWait": "10s"
        }
      }
    }
  }
}
```
