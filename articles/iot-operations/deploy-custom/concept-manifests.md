---
title: Manifests - Azure IoT Orchestrator
description: Understand how Azure IoT Orchestrator uses manifests to define resources and deployments for Azure IoT Operations
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/25/2023

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Orchestrator manifests

The Azure IoT Orchestrator service extends the resource management capabilities of Azure beyond the cloud. Through the orchestration service, customers are able to define and manage their edge infrastructure using the same Arm manifest files they use to manage cloud resources today. There are two main types of resources use for orchestration: targets and solutions. Together these resources define the desired state of an edge environment.

## Target

A *target* is a specific deployment environment, such as a Kubernetes cluster or an edge device. It describes infrastructural components, which are components installed once on a device, like PowerShell or Azure IoT Data Processor (preview). Each target has its own configuration settings, which can be customized to meet the specific needs of the deployment environment. It also specifies provider bindings that define what types of resources are to be managed on the target (for example, Helm, PowerShell scripts, K8s, CRs, or Bash scripts).

To create a target resource for an Arc-enabled K8s cluster, add the resource definition JSON to an Azure Resource Manager template. The following example creates a target resource that defines multiple components and bindings.

```json
{
  "type": "Microsoft.IoTOperationsOrchestrator/Targets",
  "name": "myTarget",
  "location": "eastus",
  "apiVersion": "2023-10-04-preview",
  "extendedLocation": { ... },
  "tags": {},
  "properties": {
    "version": "1.0.0",
    "scope": "myNamespace",
    "components": [
      {
        "name": "myHelmChart",
        "type": "helm.v3",
        "properties": {
          "chart": {
            "repo": "oci://azureiotoperations.azurecr.io/simple-chart",
            "version": "0.1.0"
          },
          "values": {}
        },
        "dependencies": []
      },
      {
        "name": "myCustomResource",
        "type": "yaml.k8s",
        "properties": {
          "resource": {
            "apiVersion": "v1",
            "kind": "ConfigMap",
            "data": {
                "key": "value"
            }
          }
        },
        "dependencies": ["myHelmChart"]
      }
    ],
    "topologies": [
      {
        "bindings": [
          {
            "role": "instance",
            "provider": "providers.target.k8s",
            "config": {
              "inCluster": "true"
            }
          },
          {
            "role": "helm.v3",
            "provider": "providers.target.helm",
            "config": {
              "inCluster": "true"
            }
          },
          {
            "role": "yaml.k8s",
            "provider": "providers.target.kubectl",
            "config": {
              "inCluster": "true"
            }
          }
        ]
      }
    ],
    "reconciliationPolicy": {
      "type": "periodic",
      "interval": "20m"
    }
  }
}
```

### Target parameters

| Parameter | Description |
| ---------------- | ----------- |
| type             | Resource type: *Microsoft.IoTOperationsOrchestrator/Targets*. |
| name             | Name for the target resource. |
| location         | Name of the region where the target resource will be created. |
| apiVersion       | Resource API version: *2023-10-04-preview*. |
| extendedLocation | An abstraction of a namespace that resides on the ARC-enabled cluster. To create any resources on the ARC-enabled cluster, one must create a custom location first. |
| tags             | Optional [resource tags](../../azure-resource-manager/management/tag-resources.md). |
| properties       | List of properties for the target resource. For more information, see the following [properties parameters table](#target-properties-parameters). |

### Target properties parameters

| Properties parameter | Description |
| ---------- | ----------- |
| version    | Optional metadata field for keeping track of target versions. |
| scope      | Namespace of the cluster. |
| components | List of components used during deployment and their details. For more information, see [Providers and components](./concept-providers.md). |
| topologies | List of bindings, which connect a group of devices or targets to a role. For more information, see the following [topologies.bindings parameters table](#target-topologiesbindings-parameters). |
| reconciliationPolicy | An interval period for how frequently the the Orchestrator resource manager checks for an updated desired state. The minimum period is one minute. |

### Target topologies.bindings parameters

The *topologies* parameter of a target contains a *bindings* object, which provides details on how to connect to different targets. The following table describes bindings object parameters:

| Properties.topologies.bindings parameter | Description |
| ------------------ | ----------- |
| role     | Role of the target being connected.<br><br>The same entity as a target or a device can assume different roles in different contexts, which means that multiple bindings can be defined for different purposes. For example, a target could use **Helm chart** for payload deployments and **ADU** for device updates. In such cases, two bindings are created: one for the **deployment** role and one for the **update** role, with corresponding provider configurations. |
| provider | Name of the provider that handles the specific connection. |
| config   | Configuration details used to make a connection to a specific target. The configuration differs based on the type of the provider. For more information, see [Providers and components](./concept-providers.md). |

## Solution

A *solution* is a template that defines the application workload that can be deployed on one or many *targets*. So, a solution describes application components (for example, things that use the infrastructural components defined in the target like PowerShell scripts or Azure IoT Data Processor pipelines).

To create a solution resource, add the resource definition JSON to an Azure Resource Manager template. The following example creates a solution resource that defines two components, one of which is dependent on the other.

```json
{
  "type": "Microsoft.IoTOperationsOrchestrator/Solutions",
  "name": "mySolution",
  "location": "eastus",
  "apiVersion": "2023-10-04-preview",
  "extendedLocation": { ... },
  "tags": {},
  "properties": {
    "version": "1.0.0",
    "components": [
      {
        "name": "myHelmChart",
        "type": "helm.v3",
        "properties": {
          "chart": {
            "repo": "oci://azureiotoperations.azurecr.io/simple-chart",
            "version": "0.1.0"
          },
          "values": {}
        },
        "dependencies": []
      },
      {
        "name": "myCustomResource",
        "type": "yaml.k8s",
        "properties": {
          "resource": {
            "apiVersion": "v1",
            "kind": "ConfigMap",
            "data": {
                "key": "value"
            }
          }
        },
        "dependencies": ["myHelmChart"]
      }
    ]
  }
}
```

### Solution parameters

| Parameter | Description |
| ---------------- | ----------- |
| type             | Resource type: *Microsoft.IoTOperationsOrchestrator/Solutions*. |
| name             | Name for the solution resource. |
| location         | Name of the region where the solution resource will be created. |
| apiVersion       | Resource API version: *2023-10-04-preview*. |
| extendedLocation | An abstraction of a namespace that resides on the ARC-enabled cluster. To create any resources on the ARC-enabled cluster, one must create a custom location first. |
| tags             | Optional [resource tags](../../azure-resource-manager/management/tag-resources.md). |
| properties       | List of properties for the solution resource. For more information, see the following [properties parameters table](#solution-properties-parameters). |

### Solution properties parameters

| Properties parameter | Description |
| ---------- | ----------- |
| version    | Optional metadata field for keeping track of solution versions. |
| components | List of components created in the deployment and their details. For more information, see [Providers and components](./concept-providers.md). |

## Instance

An *instance* is a specific deployment of a solution to a target. It can be thought of as an instance of a solution.

To create an instance resource, add the resource definition JSON to an Azure Resource Manager template. The following example shows an instance that deploys a solution named **mySolution* on the target cluster named **myTarget**:

```json
{
  "type": "Microsoft.IoTOperationsOrchestrator/Instances",
  "name": "myInstance",
  "location": "eastus",
  "apiVersion": "2023-10-04-preview",
  "extendedLocation": { ... },
  "tags": {},
  "properties": {
    "version": "1.0.0",
    "scope": "myNamespace",
    "solution": "mySolution",
    "target": {
      "name": "myInstance"
    },
    "reconciliationPolicy": {
      "type": "periodic",
      "interval": "1h"
    }
  }
}
```

### Instance parameters

| Parameter | Description |
| --------- | ----------- |
| type             | Resource type: *Microsoft.IoTOperationsOrchestrator/Instances*. |
| name             | Name for the instance resource. |
| location         | Name of the region where the instance resource will be created. |
| apiVersion       | Resource API version: *2023-10-04-preview*. |
| extendedLocation | An abstraction of a namespace that resides on the ARC-enabled cluster. To create any resources on the ARC-enabled cluster, one must create a custom location first. |
| tags             | Optional [resource tags](../../azure-resource-manager/management/tag-resources.md). |
| properties       | List of properties for the instance resource. For more information, see the following [properties parameters table](#instance-properties-parameters). |

### Instance properties parameters

| Properties parameter | Description |
| --------- | ----------- |
| version   | Optional metadata field for keeping track of instance versions. |
| scope     | Namespace of the cluster. |
| solution  | Name of the solution used for deployment. |
| target    | Name of the target or targets on which the solution will be deployed. |
| reconciliationPolicy | An interval period for how frequently the the Orchestrator resource manager checks for an updated desired state. The minimum period is one minute. |

## Components

*Components* are any resource that can be managed by the orchestrator. Components are referenced in both *solution* and *target* manifests. If a component is being reused in a solution, like as part of a pipeline, then you should include it in the solution manifest. If a component is being deployed once as part of the setup of an environment, then you should include it in the target manifest.

| Parameter | Description |
| --------- | ----------- |
| name      | Name of the component. |
| type      | Type of the component. For example, **helm.v3** or **yaml.k8s**. |
| properties | Details of the component being managed. |
| dependencies | List of any components on which this current component is dependent. |

The *properties* of a given component depend on the component type being managed. To learn more about the various component types, see [Providers and components](./concept-providers.md).
