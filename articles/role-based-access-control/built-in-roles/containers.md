---
title: Azure built-in roles for Containers - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Containers category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 05/07/2024
ms.custom: generated
---

# Azure built-in roles for Containers

This article lists the Azure built-in roles in the Containers category.


## AcrDelete

Delete repositories, tags, or manifests from a container registry.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/artifacts/delete | Delete artifact in a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr delete",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c2f4ef07-c644-48eb-af81-4b1b4947fb11",
  "name": "c2f4ef07-c644-48eb-af81-4b1b4947fb11",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/artifacts/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrDelete",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AcrImageSigner

Push trusted images to or pull trusted images from a container registry enabled for content trust.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/sign/write | Push/Pull content trust metadata for a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/trustedCollections/write | Allows push or publish of trusted collections of container registry content. This is similar to Microsoft.ContainerRegistry/registries/sign/write action except that this is a data action |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr image signer",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6cef56e8-d556-48e5-a04f-b8e64114680f",
  "name": "6cef56e8-d556-48e5-a04f-b8e64114680f",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/sign/write"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerRegistry/registries/trustedCollections/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "AcrImageSigner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AcrPull

Pull artifacts from a container registry.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/pull/read | Pull or Get images from a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr pull",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4680-a7ca-43fe172d538d",
  "name": "7f951dda-4ed3-4680-a7ca-43fe172d538d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/pull/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrPull",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AcrPush

Push artifacts to or pull artifacts from a container registry.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/pull/read | Pull or Get images from a container registry. |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/push/write | Push or Write images to a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr push",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8311e382-0749-4cb8-b61a-304f252e45ec",
  "name": "8311e382-0749-4cb8-b61a-304f252e45ec",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/pull/read",
        "Microsoft.ContainerRegistry/registries/push/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrPush",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AcrQuarantineReader

Pull quarantined images from a container registry.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantinedArtifacts/read | Allows pull or get of the quarantined artifacts from container registry. This is similar to Microsoft.ContainerRegistry/registries/quarantine/read except that it is a data action |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr quarantine data reader",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cdda3590-29a3-44f6-95f2-9f980659eb04",
  "name": "cdda3590-29a3-44f6-95f2-9f980659eb04",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/quarantine/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerRegistry/registries/quarantinedArtifacts/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "AcrQuarantineReader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AcrQuarantineWriter

Push quarantined images to or pull quarantined images from a container registry.

[Learn more](/azure/container-registry/container-registry-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantine/write | Write/Modify quarantine state of quarantined images |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantinedArtifacts/read | Allows pull or get of the quarantined artifacts from container registry. This is similar to Microsoft.ContainerRegistry/registries/quarantine/read except that it is a data action |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/quarantinedArtifacts/write | Allows write or update of the quarantine state of quarantined artifacts. This is similar to Microsoft.ContainerRegistry/registries/quarantine/write action except that it is a data action |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr quarantine data writer",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c8d4ff99-41c3-41a8-9f60-21dfdad59608",
  "name": "c8d4ff99-41c3-41a8-9f60-21dfdad59608",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/quarantine/read",
        "Microsoft.ContainerRegistry/registries/quarantine/write"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerRegistry/registries/quarantinedArtifacts/read",
        "Microsoft.ContainerRegistry/registries/quarantinedArtifacts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "AcrQuarantineWriter",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Arc Enabled Kubernetes Cluster User Role

List cluster user credentials action.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/listClusterUserCredentials/action | List clusterUser credential(preview) |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/listClusterUserCredential/action | List clusterUser credential |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster user credentials action.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/00493d72-78f6-4148-b6c5-d3ce8e4799dd",
  "name": "00493d72-78f6-4148-b6c5-d3ce8e4799dd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*",
        "Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Arc Enabled Kubernetes Cluster User Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Arc Kubernetes Admin

Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.

[Learn more](/azure/azure-arc/kubernetes/azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/daemonsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/deployments/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/replicasets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/statefulsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/authorization.k8s.io/localsubjectaccessreviews/write | Writes localsubjectaccessreviews |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/autoscaling/horizontalpodautoscalers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/cronjobs/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/jobs/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/configmaps/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/endpoints/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events.k8s.io/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/daemonsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/deployments/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/ingresses/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/networkpolicies/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/replicasets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/limitranges/read | Reads limitranges |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/namespaces/read | Reads namespaces |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/ingresses/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/networkpolicies/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/persistentvolumeclaims/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/pods/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/policy/poddisruptionbudgets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/rbac.authorization.k8s.io/rolebindings/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/rbac.authorization.k8s.io/roles/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/secrets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/serviceaccounts/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/services/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/dffb1e0c-446f-4dde-a09f-99eb5cc68b96",
  "name": "dffb1e0c-446f-4dde-a09f-99eb5cc68b96",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/read",
        "Microsoft.Kubernetes/connectedClusters/apps/daemonsets/*",
        "Microsoft.Kubernetes/connectedClusters/apps/deployments/*",
        "Microsoft.Kubernetes/connectedClusters/apps/replicasets/*",
        "Microsoft.Kubernetes/connectedClusters/apps/statefulsets/*",
        "Microsoft.Kubernetes/connectedClusters/authorization.k8s.io/localsubjectaccessreviews/write",
        "Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/*",
        "Microsoft.Kubernetes/connectedClusters/batch/cronjobs/*",
        "Microsoft.Kubernetes/connectedClusters/batch/jobs/*",
        "Microsoft.Kubernetes/connectedClusters/configmaps/*",
        "Microsoft.Kubernetes/connectedClusters/endpoints/*",
        "Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/read",
        "Microsoft.Kubernetes/connectedClusters/events/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/deployments/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/ingresses/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/replicasets/*",
        "Microsoft.Kubernetes/connectedClusters/limitranges/read",
        "Microsoft.Kubernetes/connectedClusters/namespaces/read",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/*",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/*",
        "Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/*",
        "Microsoft.Kubernetes/connectedClusters/pods/*",
        "Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/*",
        "Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/rolebindings/*",
        "Microsoft.Kubernetes/connectedClusters/rbac.authorization.k8s.io/roles/*",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/*",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/*",
        "Microsoft.Kubernetes/connectedClusters/resourcequotas/read",
        "Microsoft.Kubernetes/connectedClusters/secrets/*",
        "Microsoft.Kubernetes/connectedClusters/serviceaccounts/*",
        "Microsoft.Kubernetes/connectedClusters/services/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Arc Kubernetes Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Arc Kubernetes Cluster Admin

Lets you manage all resources in the cluster.

[Learn more](/azure/azure-arc/kubernetes/azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage all resources in the cluster.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8393591c-06b9-48a2-a542-1bd6b377f6a2",
  "name": "8393591c-06b9-48a2-a542-1bd6b377f6a2",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Kubernetes/connectedClusters/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Arc Kubernetes Cluster Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Arc Kubernetes Viewer

Lets you view all resources in cluster/namespace, except secrets.

[Learn more](/azure/azure-arc/kubernetes/azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/daemonsets/read | Reads daemonsets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/deployments/read | Reads deployments |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/replicasets/read | Reads replicasets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/statefulsets/read | Reads statefulsets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/cronjobs/read | Reads cronjobs |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/jobs/read | Reads jobs |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/configmaps/read | Reads configmaps |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/endpoints/read | Reads endpoints |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events.k8s.io/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/daemonsets/read | Reads daemonsets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/deployments/read | Reads deployments |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/ingresses/read | Reads ingresses |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/replicasets/read | Reads replicasets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/limitranges/read | Reads limitranges |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/namespaces/read | Reads namespaces |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/ingresses/read | Reads ingresses |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/pods/read | Reads pods |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/read | Reads replicationcontrollers |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/read | Reads replicationcontrollers |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/serviceaccounts/read | Reads serviceaccounts |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/services/read | Reads services |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you view all resources in cluster/namespace, except secrets.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/63f0a09d-1495-4db4-a681-037d84835eb4",
  "name": "63f0a09d-1495-4db4-a681-037d84835eb4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/read",
        "Microsoft.Kubernetes/connectedClusters/apps/daemonsets/read",
        "Microsoft.Kubernetes/connectedClusters/apps/deployments/read",
        "Microsoft.Kubernetes/connectedClusters/apps/replicasets/read",
        "Microsoft.Kubernetes/connectedClusters/apps/statefulsets/read",
        "Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/read",
        "Microsoft.Kubernetes/connectedClusters/batch/cronjobs/read",
        "Microsoft.Kubernetes/connectedClusters/batch/jobs/read",
        "Microsoft.Kubernetes/connectedClusters/configmaps/read",
        "Microsoft.Kubernetes/connectedClusters/endpoints/read",
        "Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/read",
        "Microsoft.Kubernetes/connectedClusters/events/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/deployments/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/ingresses/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/replicasets/read",
        "Microsoft.Kubernetes/connectedClusters/limitranges/read",
        "Microsoft.Kubernetes/connectedClusters/namespaces/read",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/read",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/read",
        "Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/read",
        "Microsoft.Kubernetes/connectedClusters/pods/read",
        "Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/read",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/read",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/read",
        "Microsoft.Kubernetes/connectedClusters/resourcequotas/read",
        "Microsoft.Kubernetes/connectedClusters/serviceaccounts/read",
        "Microsoft.Kubernetes/connectedClusters/services/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Arc Kubernetes Viewer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Arc Kubernetes Writer

Lets you update everything in cluster/namespace, except (cluster)roles and (cluster)role bindings.

[Learn more](/azure/azure-arc/kubernetes/azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/daemonsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/deployments/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/replicasets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/apps/statefulsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/autoscaling/horizontalpodautoscalers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/cronjobs/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/batch/jobs/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/configmaps/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/endpoints/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events.k8s.io/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/events/read | Reads events |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/daemonsets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/deployments/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/ingresses/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/networkpolicies/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/extensions/replicasets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/limitranges/read | Reads limitranges |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/namespaces/read | Reads namespaces |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/ingresses/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/networking.k8s.io/networkpolicies/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/persistentvolumeclaims/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/pods/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/policy/poddisruptionbudgets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/replicationcontrollers/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/secrets/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/serviceaccounts/* |  |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/services/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you update everything in cluster/namespace, except (cluster)roles and (cluster)role bindings.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5b999177-9696-4545-85c7-50de3797e5a1",
  "name": "5b999177-9696-4545-85c7-50de3797e5a1",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Kubernetes/connectedClusters/apps/controllerrevisions/read",
        "Microsoft.Kubernetes/connectedClusters/apps/daemonsets/*",
        "Microsoft.Kubernetes/connectedClusters/apps/deployments/*",
        "Microsoft.Kubernetes/connectedClusters/apps/replicasets/*",
        "Microsoft.Kubernetes/connectedClusters/apps/statefulsets/*",
        "Microsoft.Kubernetes/connectedClusters/autoscaling/horizontalpodautoscalers/*",
        "Microsoft.Kubernetes/connectedClusters/batch/cronjobs/*",
        "Microsoft.Kubernetes/connectedClusters/batch/jobs/*",
        "Microsoft.Kubernetes/connectedClusters/configmaps/*",
        "Microsoft.Kubernetes/connectedClusters/endpoints/*",
        "Microsoft.Kubernetes/connectedClusters/events.k8s.io/events/read",
        "Microsoft.Kubernetes/connectedClusters/events/read",
        "Microsoft.Kubernetes/connectedClusters/extensions/daemonsets/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/deployments/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/ingresses/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/networkpolicies/*",
        "Microsoft.Kubernetes/connectedClusters/extensions/replicasets/*",
        "Microsoft.Kubernetes/connectedClusters/limitranges/read",
        "Microsoft.Kubernetes/connectedClusters/namespaces/read",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/ingresses/*",
        "Microsoft.Kubernetes/connectedClusters/networking.k8s.io/networkpolicies/*",
        "Microsoft.Kubernetes/connectedClusters/persistentvolumeclaims/*",
        "Microsoft.Kubernetes/connectedClusters/pods/*",
        "Microsoft.Kubernetes/connectedClusters/policy/poddisruptionbudgets/*",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/*",
        "Microsoft.Kubernetes/connectedClusters/replicationcontrollers/*",
        "Microsoft.Kubernetes/connectedClusters/resourcequotas/read",
        "Microsoft.Kubernetes/connectedClusters/secrets/*",
        "Microsoft.Kubernetes/connectedClusters/serviceaccounts/*",
        "Microsoft.Kubernetes/connectedClusters/services/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Arc Kubernetes Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Container Storage Contributor

Install Azure Container Storage and manage its storage resources. Includes an ABAC condition to constrain role assignments.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/write | Creates or updates extension resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/delete | Deletes extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/operations/read | Gets Async Operation status. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Actions** |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) | Add or remove role assignments for the following roles:<br/>Azure Container Storage Operator |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you install Azure Container Storage and manage its storage resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/95dd08a6-00bd-4661-84bf-f6726f83a4d0",
  "name": "95dd08a6-00bd-4661-84bf-f6726f83a4d0",
  "permissions": [
    {
      "actions": [
        "Microsoft.KubernetesConfiguration/extensions/write",
        "Microsoft.KubernetesConfiguration/extensions/read",
        "Microsoft.KubernetesConfiguration/extensions/delete",
        "Microsoft.KubernetesConfiguration/extensions/operations/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    },
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619}))"
    }
  ],
  "roleName": "Azure Container Storage Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Container Storage Operator

Enable a managed identity to perform Azure Container Storage operations, such as manage virtual machines and manage virtual networks.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/elasticSans/* |  |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/locations/asyncoperations/read | Polls the status of an asynchronous operation. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/join/action | Joins a route table. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/write | Creates a virtual network or updates an existing virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/delete | Deletes a virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachineScaleSets/read | Get the properties of a Virtual Machine Scale Set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachineScaleSets/write | Creates a new Virtual Machine Scale Set or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachineScaleSets/virtualMachines/write | Updates the properties of a Virtual Machine in a VM Scale Set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachineScaleSets/virtualMachines/read | Retrieves the properties of a Virtual Machine in a VM Scale Set |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/providers/read | Gets or lists resource providers. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role required by a Managed Identity for Azure Container Storage operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/08d4c71a-cc63-4ce4-a9c8-5dd251b4d619",
  "name": "08d4c71a-cc63-4ce4-a9c8-5dd251b4d619",
  "permissions": [
    {
      "actions": [
        "Microsoft.ElasticSan/elasticSans/*",
        "Microsoft.ElasticSan/locations/asyncoperations/read",
        "Microsoft.Network/routeTables/join/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/virtualNetworks/write",
        "Microsoft.Network/virtualNetworks/delete",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Compute/virtualMachineScaleSets/read",
        "Microsoft.Compute/virtualMachineScaleSets/write",
        "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/write",
        "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read",
        "Microsoft.Resources/subscriptions/providers/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Network/virtualNetworks/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Container Storage Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Container Storage Owner

Install Azure Container Storage, grant access to its storage resources, and configure Azure Elastic storage area network (SAN). Includes an ABAC condition to constrain role assignments.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/elasticSans/* |  |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/locations/* |  |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/elasticSans/volumeGroups/* |  |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/elasticSans/volumeGroups/volumes/* |  |
> | [Microsoft.ElasticSan](../permissions/storage.md#microsoftelasticsan)/locations/asyncoperations/read | Polls the status of an asynchronous operation. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/write | Creates or updates extension resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/delete | Deletes extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/operations/read | Gets Async Operation status. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Actions** |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) | Add or remove role assignments for the following roles:<br/>Azure Container Storage Operator |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you install Azure Container Storage and grants access to its storage resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/95de85bd-744d-4664-9dde-11430bc34793",
  "name": "95de85bd-744d-4664-9dde-11430bc34793",
  "permissions": [
    {
      "actions": [
        "Microsoft.ElasticSan/elasticSans/*",
        "Microsoft.ElasticSan/locations/*",
        "Microsoft.ElasticSan/elasticSans/volumeGroups/*",
        "Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/*",
        "Microsoft.ElasticSan/locations/asyncoperations/read",
        "Microsoft.KubernetesConfiguration/extensions/write",
        "Microsoft.KubernetesConfiguration/extensions/read",
        "Microsoft.KubernetesConfiguration/extensions/delete",
        "Microsoft.KubernetesConfiguration/extensions/operations/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    },
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{08d4c71acc634ce4a9c85dd251b4d619}))"
    }
  ],
  "roleName": "Azure Container Storage Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Fleet Manager Contributor Role

Grants read/write access to Azure resources provided by Azure Kubernetes Fleet Manager, including fleets, fleet members, fleet update strategies, fleet update runs, etc.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read/write access to Azure resources provided by Azure Kubernetes Fleet Manager, including fleets, fleet members, fleet update strategies, fleet update runs, etc.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/63bb64ad-9799-4770-b5c3-24ed299a07bf",
  "name": "63bb64ad-9799-4770-b5c3-24ed299a07bf",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/fleets/*",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Fleet Manager Contributor Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Fleet Manager RBAC Admin

Grants read/write access to Kubernetes resources within a namespace in the fleet-managed hub cluster - provides write permissions on most objects within a namespace, with the exception of ResourceQuota object and the namespace object itself. Applying this role at cluster scope will give access across all namespaces.

[Learn more](/azure/kubernetes-fleet/access-fleet-kubernetes-api)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/read | Get fleet |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/listCredentials/action | List fleet credentials |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/statefulsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/authorization.k8s.io/localsubjectaccessreviews/write | Writes localsubjectaccessreviews |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/autoscaling/horizontalpodautoscalers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/cronjobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/jobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/configmaps/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/endpoints/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events.k8s.io/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/limitranges/read | Reads limitranges |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/namespaces/read | Reads namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/persistentvolumeclaims/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/policy/poddisruptionbudgets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/rbac.authorization.k8s.io/rolebindings/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/rbac.authorization.k8s.io/roles/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/secrets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/serviceaccounts/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/services/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read/write access to Kubernetes resources within a namespace in the fleet-managed hub cluster - provides write permissions on most objects within a a namespace, with the exception of ResourceQuota object and the namespace object itself. Applying this role at cluster scope will give access across all namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/434fb43a-c01c-447e-9f67-c3ad923cfaba",
  "name": "434fb43a-c01c-447e-9f67-c3ad923cfaba",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/fleets/read",
        "Microsoft.ContainerService/fleets/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/fleets/apps/controllerrevisions/read",
        "Microsoft.ContainerService/fleets/apps/daemonsets/*",
        "Microsoft.ContainerService/fleets/apps/deployments/*",
        "Microsoft.ContainerService/fleets/apps/statefulsets/*",
        "Microsoft.ContainerService/fleets/authorization.k8s.io/localsubjectaccessreviews/write",
        "Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/*",
        "Microsoft.ContainerService/fleets/batch/cronjobs/*",
        "Microsoft.ContainerService/fleets/batch/jobs/*",
        "Microsoft.ContainerService/fleets/configmaps/*",
        "Microsoft.ContainerService/fleets/endpoints/*",
        "Microsoft.ContainerService/fleets/events.k8s.io/events/read",
        "Microsoft.ContainerService/fleets/events/read",
        "Microsoft.ContainerService/fleets/extensions/daemonsets/*",
        "Microsoft.ContainerService/fleets/extensions/deployments/*",
        "Microsoft.ContainerService/fleets/extensions/ingresses/*",
        "Microsoft.ContainerService/fleets/extensions/networkpolicies/*",
        "Microsoft.ContainerService/fleets/limitranges/read",
        "Microsoft.ContainerService/fleets/namespaces/read",
        "Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/*",
        "Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/*",
        "Microsoft.ContainerService/fleets/persistentvolumeclaims/*",
        "Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/*",
        "Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/rolebindings/*",
        "Microsoft.ContainerService/fleets/rbac.authorization.k8s.io/roles/*",
        "Microsoft.ContainerService/fleets/replicationcontrollers/*",
        "Microsoft.ContainerService/fleets/replicationcontrollers/*",
        "Microsoft.ContainerService/fleets/resourcequotas/read",
        "Microsoft.ContainerService/fleets/secrets/*",
        "Microsoft.ContainerService/fleets/serviceaccounts/*",
        "Microsoft.ContainerService/fleets/services/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Fleet Manager RBAC Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Fleet Manager RBAC Cluster Admin

Grants read/write access to all Kubernetes resources in the fleet-managed hub cluster.

[Learn more](/azure/kubernetes-fleet/access-fleet-kubernetes-api)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/read | Get fleet |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/listCredentials/action | List fleet credentials |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read/write access to all Kubernetes resources in the fleet-managed hub cluster.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
  "name": "18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/fleets/read",
        "Microsoft.ContainerService/fleets/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/fleets/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Fleet Manager RBAC Cluster Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Fleet Manager RBAC Reader

Grants read-only access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  Applying this role at cluster scope will give access across all namespaces.

[Learn more](/azure/kubernetes-fleet/access-fleet-kubernetes-api)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/read | Get fleet |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/listCredentials/action | List fleet credentials |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/daemonsets/read | Reads daemonsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/deployments/read | Reads deployments |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/statefulsets/read | Reads statefulsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/cronjobs/read | Reads cronjobs |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/jobs/read | Reads jobs |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/configmaps/read | Reads configmaps |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/endpoints/read | Reads endpoints |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events.k8s.io/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/daemonsets/read | Reads daemonsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/deployments/read | Reads deployments |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/ingresses/read | Reads ingresses |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/limitranges/read | Reads limitranges |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/namespaces/read | Reads namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/ingresses/read | Reads ingresses |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/read | Reads replicationcontrollers |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/read | Reads replicationcontrollers |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/serviceaccounts/read | Reads serviceaccounts |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/services/read | Reads services |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read-only access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  Applying this role at cluster scope will give access across all namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/30b27cfc-9c84-438e-b0ce-70e35255df80",
  "name": "30b27cfc-9c84-438e-b0ce-70e35255df80",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/fleets/read",
        "Microsoft.ContainerService/fleets/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/fleets/apps/controllerrevisions/read",
        "Microsoft.ContainerService/fleets/apps/daemonsets/read",
        "Microsoft.ContainerService/fleets/apps/deployments/read",
        "Microsoft.ContainerService/fleets/apps/statefulsets/read",
        "Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/read",
        "Microsoft.ContainerService/fleets/batch/cronjobs/read",
        "Microsoft.ContainerService/fleets/batch/jobs/read",
        "Microsoft.ContainerService/fleets/configmaps/read",
        "Microsoft.ContainerService/fleets/endpoints/read",
        "Microsoft.ContainerService/fleets/events.k8s.io/events/read",
        "Microsoft.ContainerService/fleets/events/read",
        "Microsoft.ContainerService/fleets/extensions/daemonsets/read",
        "Microsoft.ContainerService/fleets/extensions/deployments/read",
        "Microsoft.ContainerService/fleets/extensions/ingresses/read",
        "Microsoft.ContainerService/fleets/extensions/networkpolicies/read",
        "Microsoft.ContainerService/fleets/limitranges/read",
        "Microsoft.ContainerService/fleets/namespaces/read",
        "Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/read",
        "Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/read",
        "Microsoft.ContainerService/fleets/persistentvolumeclaims/read",
        "Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/read",
        "Microsoft.ContainerService/fleets/replicationcontrollers/read",
        "Microsoft.ContainerService/fleets/replicationcontrollers/read",
        "Microsoft.ContainerService/fleets/resourcequotas/read",
        "Microsoft.ContainerService/fleets/serviceaccounts/read",
        "Microsoft.ContainerService/fleets/services/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Fleet Manager RBAC Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Fleet Manager RBAC Writer

Grants read/write access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace.  Applying this role at cluster scope will give access across all namespaces.

[Learn more](/azure/kubernetes-fleet/access-fleet-kubernetes-api)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/read | Get fleet |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/listCredentials/action | List fleet credentials |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/apps/statefulsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/autoscaling/horizontalpodautoscalers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/cronjobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/batch/jobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/configmaps/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/endpoints/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events.k8s.io/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/extensions/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/limitranges/read | Reads limitranges |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/namespaces/read | Reads namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/networking.k8s.io/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/persistentvolumeclaims/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/policy/poddisruptionbudgets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/replicationcontrollers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/secrets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/serviceaccounts/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/fleets/services/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read/write access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace.  Applying this role at cluster scope will give access across all namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5af6afb3-c06c-4fa4-8848-71a8aee05683",
  "name": "5af6afb3-c06c-4fa4-8848-71a8aee05683",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/fleets/read",
        "Microsoft.ContainerService/fleets/listCredentials/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/fleets/apps/controllerrevisions/read",
        "Microsoft.ContainerService/fleets/apps/daemonsets/*",
        "Microsoft.ContainerService/fleets/apps/deployments/*",
        "Microsoft.ContainerService/fleets/apps/statefulsets/*",
        "Microsoft.ContainerService/fleets/autoscaling/horizontalpodautoscalers/*",
        "Microsoft.ContainerService/fleets/batch/cronjobs/*",
        "Microsoft.ContainerService/fleets/batch/jobs/*",
        "Microsoft.ContainerService/fleets/configmaps/*",
        "Microsoft.ContainerService/fleets/endpoints/*",
        "Microsoft.ContainerService/fleets/events.k8s.io/events/read",
        "Microsoft.ContainerService/fleets/events/read",
        "Microsoft.ContainerService/fleets/extensions/daemonsets/*",
        "Microsoft.ContainerService/fleets/extensions/deployments/*",
        "Microsoft.ContainerService/fleets/extensions/ingresses/*",
        "Microsoft.ContainerService/fleets/extensions/networkpolicies/*",
        "Microsoft.ContainerService/fleets/limitranges/read",
        "Microsoft.ContainerService/fleets/namespaces/read",
        "Microsoft.ContainerService/fleets/networking.k8s.io/ingresses/*",
        "Microsoft.ContainerService/fleets/networking.k8s.io/networkpolicies/*",
        "Microsoft.ContainerService/fleets/persistentvolumeclaims/*",
        "Microsoft.ContainerService/fleets/policy/poddisruptionbudgets/*",
        "Microsoft.ContainerService/fleets/replicationcontrollers/*",
        "Microsoft.ContainerService/fleets/replicationcontrollers/*",
        "Microsoft.ContainerService/fleets/resourcequotas/read",
        "Microsoft.ContainerService/fleets/secrets/*",
        "Microsoft.ContainerService/fleets/serviceaccounts/*",
        "Microsoft.ContainerService/fleets/services/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Fleet Manager RBAC Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Cluster Admin Role

List cluster admin credential action.

[Learn more](/azure/aks/control-kubeconfig-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/listClusterAdminCredential/action | List the clusterAdmin credential of a managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/accessProfiles/listCredential/action | Get a managed cluster access profile by role name using list credential |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/read | Get a managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/runcommand/action | Run user issued command against managed kubernetes server. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster admin credential action.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
  "name": "0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action",
        "Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action",
        "Microsoft.ContainerService/managedClusters/read",
        "Microsoft.ContainerService/managedClusters/runcommand/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Cluster Admin Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Cluster Monitoring User

List cluster monitoring user credential action.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/listClusterMonitoringUserCredential/action | List the clusterMonitoringUser credential of a managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/read | Get a managed cluster |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster monitoring user credential action.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1afdec4b-e479-420e-99e7-f82237c7c5e6",
  "name": "1afdec4b-e479-420e-99e7-f82237c7c5e6",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action",
        "Microsoft.ContainerService/managedClusters/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Cluster Monitoring User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Cluster User Role

List cluster user credential action.

[Learn more](/azure/aks/control-kubeconfig-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/read | Get a managed cluster |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster user credential action.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
  "name": "4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action",
        "Microsoft.ContainerService/managedClusters/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Cluster User Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Contributor Role

Grants access to read and write Azure Kubernetes Service clusters

[Learn more](/azure/aks/concepts-identity)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/read | Get a managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/write | Creates a new managed cluster or updates an existing one |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants access to read and write Azure Kubernetes Service clusters",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ed7f3fbd-7b88-4dd4-9017-9adb7ce333f8",
  "name": "ed7f3fbd-7b88-4dd4-9017-9adb7ce333f8",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/read",
        "Microsoft.ContainerService/managedClusters/write",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Contributor Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service RBAC Admin

Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.

[Learn more](/azure/aks/manage-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/* |  |
> | **NotDataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/resourcequotas/write | Writes resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/resourcequotas/delete | Deletes resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/namespaces/write | Writes namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/namespaces/delete | Deletes namespaces |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3498e952-d568-435e-9b2c-8d77e338d7f7",
  "name": "3498e952-d568-435e-9b2c-8d77e338d7f7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/managedClusters/*"
      ],
      "notDataActions": [
        "Microsoft.ContainerService/managedClusters/resourcequotas/write",
        "Microsoft.ContainerService/managedClusters/resourcequotas/delete",
        "Microsoft.ContainerService/managedClusters/namespaces/write",
        "Microsoft.ContainerService/managedClusters/namespaces/delete"
      ]
    }
  ],
  "roleName": "Azure Kubernetes Service RBAC Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service RBAC Cluster Admin

Lets you manage all resources in the cluster.

[Learn more](/azure/aks/manage-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage all resources in the cluster.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b",
  "name": "b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/managedClusters/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service RBAC Cluster Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service RBAC Reader

Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation). Applying this role at cluster scope will give access across all namespaces.

[Learn more](/azure/aks/manage-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/daemonsets/read | Reads daemonsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/deployments/read | Reads deployments |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/replicasets/read | Reads replicasets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/statefulsets/read | Reads statefulsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/autoscaling/horizontalpodautoscalers/read | Reads horizontalpodautoscalers |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/batch/cronjobs/read | Reads cronjobs |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/batch/jobs/read | Reads jobs |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/configmaps/read | Reads configmaps |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/discovery.k8s.io/endpointslices/read | Reads endpointslices |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/endpoints/read | Reads endpoints |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/events.k8s.io/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/daemonsets/read | Reads daemonsets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/deployments/read | Reads deployments |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/ingresses/read | Reads ingresses |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/replicasets/read | Reads replicasets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/limitranges/read | Reads limitranges |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/metrics.k8s.io/pods/read | Reads pods |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/metrics.k8s.io/nodes/read | Reads nodes |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/namespaces/read | Reads namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/networking.k8s.io/ingresses/read | Reads ingresses |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/networking.k8s.io/networkpolicies/read | Reads networkpolicies |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/persistentvolumeclaims/read | Reads persistentvolumeclaims |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/pods/read | Reads pods |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/policy/poddisruptionbudgets/read | Reads poddisruptionbudgets |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/replicationcontrollers/read | Reads replicationcontrollers |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/serviceaccounts/read | Reads serviceaccounts |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/services/read | Reads services |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation). Applying this role at cluster scope will give access across all namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7f6c6a51-bcf8-42ba-9220-52d62157d7db",
  "name": "7f6c6a51-bcf8-42ba-9220-52d62157d7db",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/read",
        "Microsoft.ContainerService/managedClusters/apps/daemonsets/read",
        "Microsoft.ContainerService/managedClusters/apps/deployments/read",
        "Microsoft.ContainerService/managedClusters/apps/replicasets/read",
        "Microsoft.ContainerService/managedClusters/apps/statefulsets/read",
        "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/read",
        "Microsoft.ContainerService/managedClusters/batch/cronjobs/read",
        "Microsoft.ContainerService/managedClusters/batch/jobs/read",
        "Microsoft.ContainerService/managedClusters/configmaps/read",
        "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/read",
        "Microsoft.ContainerService/managedClusters/endpoints/read",
        "Microsoft.ContainerService/managedClusters/events.k8s.io/events/read",
        "Microsoft.ContainerService/managedClusters/events/read",
        "Microsoft.ContainerService/managedClusters/extensions/daemonsets/read",
        "Microsoft.ContainerService/managedClusters/extensions/deployments/read",
        "Microsoft.ContainerService/managedClusters/extensions/ingresses/read",
        "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/read",
        "Microsoft.ContainerService/managedClusters/extensions/replicasets/read",
        "Microsoft.ContainerService/managedClusters/limitranges/read",
        "Microsoft.ContainerService/managedClusters/metrics.k8s.io/pods/read",
        "Microsoft.ContainerService/managedClusters/metrics.k8s.io/nodes/read",
        "Microsoft.ContainerService/managedClusters/namespaces/read",
        "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/read",
        "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/read",
        "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/read",
        "Microsoft.ContainerService/managedClusters/pods/read",
        "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/read",
        "Microsoft.ContainerService/managedClusters/replicationcontrollers/read",
        "Microsoft.ContainerService/managedClusters/resourcequotas/read",
        "Microsoft.ContainerService/managedClusters/serviceaccounts/read",
        "Microsoft.ContainerService/managedClusters/services/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service RBAC Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service RBAC Writer

Allows read/write access to most objects in a namespace. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. Applying this role at cluster scope will give access across all namespaces.

[Learn more](/azure/aks/manage-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/controllerrevisions/read | Reads controllerrevisions |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/replicasets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/apps/statefulsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/autoscaling/horizontalpodautoscalers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/batch/cronjobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/coordination.k8s.io/leases/read | Reads leases |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/coordination.k8s.io/leases/write | Writes leases |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/coordination.k8s.io/leases/delete | Deletes leases |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/discovery.k8s.io/endpointslices/read | Reads endpointslices |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/batch/jobs/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/configmaps/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/endpoints/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/events.k8s.io/events/read | Reads events |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/events/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/daemonsets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/deployments/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/extensions/replicasets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/limitranges/read | Reads limitranges |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/metrics.k8s.io/pods/read | Reads pods |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/metrics.k8s.io/nodes/read | Reads nodes |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/namespaces/read | Reads namespaces |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/networking.k8s.io/ingresses/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/networking.k8s.io/networkpolicies/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/persistentvolumeclaims/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/pods/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/policy/poddisruptionbudgets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/replicationcontrollers/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/resourcequotas/read | Reads resourcequotas |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/secrets/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/serviceaccounts/* |  |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/services/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read/write access to most objects in a namespace.This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. Applying this role at cluster scope will give access across all namespaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb",
  "name": "a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/read",
        "Microsoft.ContainerService/managedClusters/apps/daemonsets/*",
        "Microsoft.ContainerService/managedClusters/apps/deployments/*",
        "Microsoft.ContainerService/managedClusters/apps/replicasets/*",
        "Microsoft.ContainerService/managedClusters/apps/statefulsets/*",
        "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/*",
        "Microsoft.ContainerService/managedClusters/batch/cronjobs/*",
        "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/read",
        "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/write",
        "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/delete",
        "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/read",
        "Microsoft.ContainerService/managedClusters/batch/jobs/*",
        "Microsoft.ContainerService/managedClusters/configmaps/*",
        "Microsoft.ContainerService/managedClusters/endpoints/*",
        "Microsoft.ContainerService/managedClusters/events.k8s.io/events/read",
        "Microsoft.ContainerService/managedClusters/events/*",
        "Microsoft.ContainerService/managedClusters/extensions/daemonsets/*",
        "Microsoft.ContainerService/managedClusters/extensions/deployments/*",
        "Microsoft.ContainerService/managedClusters/extensions/ingresses/*",
        "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/*",
        "Microsoft.ContainerService/managedClusters/extensions/replicasets/*",
        "Microsoft.ContainerService/managedClusters/limitranges/read",
        "Microsoft.ContainerService/managedClusters/metrics.k8s.io/pods/read",
        "Microsoft.ContainerService/managedClusters/metrics.k8s.io/nodes/read",
        "Microsoft.ContainerService/managedClusters/namespaces/read",
        "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/*",
        "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/*",
        "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/*",
        "Microsoft.ContainerService/managedClusters/pods/*",
        "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/*",
        "Microsoft.ContainerService/managedClusters/replicationcontrollers/*",
        "Microsoft.ContainerService/managedClusters/resourcequotas/read",
        "Microsoft.ContainerService/managedClusters/secrets/*",
        "Microsoft.ContainerService/managedClusters/serviceaccounts/*",
        "Microsoft.ContainerService/managedClusters/services/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service RBAC Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Arc Cluster Admin Role

Lists cluster admin credential actions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.HybridContainerService/provisionedClusterInstances/read | Gets the Hybrid AKS provisioned cluster instance and instances associated with the connected cluster |
> | Microsoft.HybridContainerService/provisionedClusterInstances/listAdminKubeconfig/action | Lists the admin credentials of a provisioned cluster instance used only in direct mode. |
> | Microsoft.Kubernetes/connectedClusters/Read | Read connectedClusters |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
      "/"
    ],
    "description": "List cluster admin credential action.",
    "id": "/subscriptions/586c20df-c465-4f10-8673-65aa4859e7ca/providers/Microsoft.Authorization/roleDefinitions/b29efa5f-7782-4dc3-9537-4d5bc70a5e9f",
    "name": "b29efa5f-7782-4dc3-9537-4d5bc70a5e9f",
    "permissions": [
      {
        "actions": [
          "Microsoft.HybridContainerService/provisionedClusterInstances/read",
          "Microsoft.HybridContainerService/provisionedClusterInstances/listAdminKubeconfig/action",
          "Microsoft.Kubernetes/connectedClusters/Read"
        ],
        "condition": null,
        "conditionVersion": null,
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "roleName": "Azure Kubernetes Service Arc Cluster Admin Role",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Arc Cluster User Role

Lists cluster user credential actions.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.HybridContainerService/provisionedClusterInstances/read | Gets the Hybrid AKS provisioned cluster instance and instances associated with the connected cluster |
> | Microsoft.HybridContainerService/provisionedClusterInstances/listUserKubeconfig/action | Lists the AAD user credentials of a provisioned cluster instance used only in direct mode. |
> | Microsoft.Kubernetes/connectedClusters/Read | Read connectedClusters |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
      "/"
    ],
    "description": "List cluster user credential action.",
    "id": "/subscriptions/586c20df-c465-4f10-8673-65aa4859e7ca/providers/Microsoft.Authorization/roleDefinitions/233ca253-b031-42ff-9fba-87ef12d6b55f",
    "name": "233ca253-b031-42ff-9fba-87ef12d6b55f",
    "permissions": [
      {
        "actions": [
          "Microsoft.HybridContainerService/provisionedClusterInstances/read",
          "Microsoft.HybridContainerService/provisionedClusterInstances/listUserKubeconfig/action",
          "Microsoft.Kubernetes/connectedClusters/Read"
        ],
        "condition": null,
        "conditionVersion": null,
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "roleName": "Azure Kubernetes Service Arc Cluster User Role",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Kubernetes Service Arc Contributor Role

Grants access to read and write Azure Kubernetes Services Arc clusters.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.HybridContainerService/Locations/operationStatuses/read | Read operationStatuses |
> | Microsoft.HybridContainerService/Operations/read | Read Operations |
> | Microsoft.HybridContainerService/kubernetesVersions/read | Get the supported kubernetes versions from the underlying custom location |
> | Microsoft.HybridContainerService/kubernetesVersions/write | Put the kubernetes version resource type |
> | Microsoft.HybridContainerService/kubernetesVersions/delete | Delete the kubernetes versions resource type |
> | Microsoft.HybridContainerService/provisionedClusterInstances/read | Get the Hybrid AKS provisioned cluster instance and instances associated with the connected cluster |
> | Microsoft.HybridContainerService/provisionedClusterInstances/write | Create the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/delete | Delete the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/read | Get the agent pools in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/write | Create and update the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/delete | Delete the agent pool in the Hybrid AKS provisioned cluster instance |
> | Microsoft.HybridContainerService/provisionedClusterInstances/upgradeProfiles/read | read operationStatuses |
> | Microsoft.HybridContainerService/skus/read | Get the supported VM skus from the underlying custom location |
> | Microsoft.HybridContainerService/skus/write | Puts the VM SKUs resource type |
> | Microsoft.HybridContainerService/skus/delete | Deletes the Vm Sku resource type |
> | Microsoft.HybridContainerService/virtualNetworks/read | List the Hybrid AKS virtual networks by resource group and subscription |
> | Microsoft.HybridContainerService/virtualNetworks/write | Put and patch the Hybrid AKS virtual network |
> | Microsoft.HybridContainerService/virtualNetworks/delete | Deletes the Hybrid AKS virtual network |
> | Microsoft.ExtendedLocation/customLocations/deploy/action | Deploy permissions to a Custom Location resource |
> | Microsoft.ExtendedLocation/customLocations/read | Gets an Custom Location resource |
> | Microsoft.Kubernetes/connectedClusters/Read | Read connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/Write | Writes connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/Delete | Deletes connectedClusters |
> | Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action | List clusterUser credential |
> | Microsoft.AzureStackHCI/clusters/read | Gets clusters |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
      "/"
    ],
    "description": "Grants access to read and write Azure Kubernetes Services Arc clusters",
    "id": "/subscriptions/586c20df-c465-4f10-8673-65aa4859e7ca/providers/Microsoft.Authorization/roleDefinitions/5d3f1697-4507-4d08-bb4a-477695db5f82",
    "name": "5d3f1697-4507-4d08-bb4a-477695db5f82",
    "permissions": [
      {
        "actions": [
          "Microsoft.HybridContainerService/Locations/operationStatuses/read",
          "Microsoft.HybridContainerService/Operations/read",
          "Microsoft.HybridContainerService/kubernetesVersions/read",
          "Microsoft.HybridContainerService/kubernetesVersions/write",
          "Microsoft.HybridContainerService/kubernetesVersions/delete",
          "Microsoft.HybridContainerService/provisionedClusterInstances/read",
          "Microsoft.HybridContainerService/provisionedClusterInstances/write",
          "Microsoft.HybridContainerService/provisionedClusterInstances/delete",
          "Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/read",
          "Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/write",
          "Microsoft.HybridContainerService/provisionedClusterInstances/agentPools/delete",
          "Microsoft.HybridContainerService/provisionedClusterInstances/upgradeProfiles/read",
          "Microsoft.HybridContainerService/skus/read",
          "Microsoft.HybridContainerService/skus/write",
          "Microsoft.HybridContainerService/skus/delete",
          "Microsoft.HybridContainerService/virtualNetworks/read",
          "Microsoft.HybridContainerService/virtualNetworks/write",
          "Microsoft.HybridContainerService/virtualNetworks/delete",
          "Microsoft.ExtendedLocation/customLocations/deploy/action",
          "Microsoft.ExtendedLocation/customLocations/read",
          "Microsoft.Kubernetes/connectedClusters/Read",
          "Microsoft.Kubernetes/connectedClusters/Write",
          "Microsoft.Kubernetes/connectedClusters/Delete",
          "Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action",
          "Microsoft.AzureStackHCI/clusters/read"
        ],
        "condition": null,
        "conditionVersion": null,
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "roleName": "Azure Kubernetes Service Arc Contributor Role",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions",
}
```

## Kubernetes Agentless Operator

Grants Microsoft Defender for Cloud access to Azure Kubernetes Services

[Learn more](/azure/defender-for-cloud/defender-for-containers-architecture)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/trustedAccessRoleBindings/write | Create or update trusted access role bindings for managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/trustedAccessRoleBindings/read | Get trusted access role bindings for managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/trustedAccessRoleBindings/delete | Delete trusted access role bindings for managed cluster |
> | [Microsoft.ContainerService](../permissions/containers.md#microsoftcontainerservice)/managedClusters/read | Get a managed cluster |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/features/read | Gets the features of a subscription. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/pricings/securityoperators/read | Gets the security operators for the scope |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants Microsoft Defender for Cloud access to Azure Kubernetes Services",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d5a2ae44-610b-4500-93be-660a0c5f5ca6",
  "name": "d5a2ae44-610b-4500-93be-660a0c5f5ca6",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write",
        "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read",
        "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete",
        "Microsoft.ContainerService/managedClusters/read",
        "Microsoft.Features/features/read",
        "Microsoft.Features/providers/features/read",
        "Microsoft.Features/providers/features/register/action",
        "Microsoft.Security/pricings/securityoperators/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Kubernetes Agentless Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Kubernetes Cluster - Azure Arc Onboarding

Role definition to authorize any user/service to create connectedClusters resource

[Learn more](/azure/azure-arc/kubernetes/connect-cluster)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/Write | Writes connectedClusters |
> | [Microsoft.Kubernetes](../permissions/hybrid-multicloud.md#microsoftkubernetes)/connectedClusters/read | Read connectedClusters |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role definition to authorize any user/service to create connectedClusters resource",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/34e09817-6cbe-4d01-b1a2-e0eac5743d41",
  "name": "34e09817-6cbe-4d01-b1a2-e0eac5743d41",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Kubernetes/connectedClusters/Write",
        "Microsoft.Kubernetes/connectedClusters/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Kubernetes Cluster - Azure Arc Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Kubernetes Extension Contributor

Can create, update, get, list and delete Kubernetes Extensions, and get extension async operations

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/write | Creates or updates extension resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/read | Gets extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/delete | Deletes extension instance resource. |
> | [Microsoft.KubernetesConfiguration](../permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration)/extensions/operations/read | Gets Async Operation status. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can create, update, get, list and delete Kubernetes Extensions, and get extension async operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/85cb6faf-e071-4c9b-8136-154b5a04f717",
  "name": "85cb6faf-e071-4c9b-8136-154b5a04f717",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.KubernetesConfiguration/extensions/write",
        "Microsoft.KubernetesConfiguration/extensions/read",
        "Microsoft.KubernetesConfiguration/extensions/delete",
        "Microsoft.KubernetesConfiguration/extensions/operations/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Kubernetes Extension Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
