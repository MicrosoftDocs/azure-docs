---
title: Deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on by using Azure CLI
description: Use Azure CLI to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS).
author: Ramya Oruganti
ms.author: raorugan
ms.service: container-service
ms.topic: how-to article
ms.date: 06/08/2022
ms.custom: template-how-to 
---


# Install the Kubernetes Event-driven Autoscaling (KEDA) add-on by using Azure CLI

This article shows you how to install the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS) by using Azure CLI. The article includes steps to verify that it's installed and running

[!INCLUDE [Current version callout](./includes/keda/current-version-callout.md)]

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]


## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).

### Register the `AKS-KedaPreview` feature flag

To use the KEDA, you must enable the `AKS-KedaPreview` feature flag on your subscription. 

```azurecli
az feature register --name AKS-KedaPreview --namespace Microsoft.ContainerService
```

You can check on the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-KedaPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Install the KEDA add-on with Azure CLI
To install the KEDA add-on, use `--enable-keda` when creating or updating a cluster.

The following example creates a *myResourceGroup* resource group. Then it creates a *myAKSCluster* cluster with the KEDA add-on.

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-keda 
```

For existing clusters, use `az aks update` with `--enable-keda` option. The following code shows an example.

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-keda 
```

## Get the credentials for your cluster

Get the credentials for your AKS cluster by using the `az aks get-credentials` command. The following example command gets the credentials for *myAKSCluster* in the *myResourceGroup* resource group:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Verify that the KEDA add-on is installed on your cluster

To see if the KEDA add-on is installed on your cluster, verify that the `enabled` value is `true` for `keda` under `workloadAutoScalerProfile`. The following example shows the status of the KEDA add-on for *myAKSCluster* in *myResourceGroup*:

```azurecli-interactive
az aks show -g "myResourceGroup" --name myAKSCluster --query "workloadAutoScalerProfile.keda.enabled" 
```
## Verify that KEDA is running on your cluster

You can verify KEDA that's running on your cluster. Use `kubectl` to display the operator and metrics server installed in the AKS cluster under kube-system namespace. For example:

```azurecli-interactive
kubectl get pods -n kube-system 
```

The following example output shows the keda operator and keda metrics apiserver installed in the AKS cluster along with the status

```output
kubectl get pods -n kube-system

keda-operator-********-k5rfv                     1/1     Running   0          43m
keda-operator-metrics-apiserver-*******-sj857   1/1     Running   0          43m
```
To verify the version of your KEDA, use `kubectl get crd/scaledobjects.keda.sh -o yaml `. For example:

```azurecli-interactive
kubectl get crd/scaledobjects.keda.sh -o yaml 
```
The following example output shows the configuration of KEDA:

```yaml
kind: CustomResourceDefinition
metadata:
  annotations:
    controller-gen.kubebuilder.io/version: v0.8.0
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apiextensions.k8s.io/v1","kind":"CustomResourceDefinition","metadata":{"annotations":{"controller-gen.kubebuilder.io/version":"v0.8.0"},"labels":{"addonmanager.kubernetes.io/mode":"Reconcile","app.kubernetes.io/component":"operator","app.kubernetes.io/name":"keda-operator","app.kubernetes.io/part-of":"keda-operator","app.kubernetes.io/version":"2.7.0"},"name":"scaledobjects.keda.sh"},"spec":{"group":"keda.sh","names":{"kind":"ScaledObject","listKind":"ScaledObjectList","plural":"scaledobjects","shortNames":["so"],"singular":"scaledobject"},"scope":"Namespaced","versions":[{"additionalPrinterColumns":[{"jsonPath":".status.scaleTargetKind","name":"ScaleTargetKind","type":"string"},{"jsonPath":".spec.scaleTargetRef.name","name":"ScaleTargetName","type":"string"},{"jsonPath":".spec.minReplicaCount","name":"Min","type":"integer"},{"jsonPath":".spec.maxReplicaCount","name":"Max","type":"integer"},{"jsonPath":".spec.triggers[*].type","name":"Triggers","type":"string"},{"jsonPath":".spec.triggers[*].authenticationRef.name","name":"Authentication","type":"string"},{"jsonPath":".status.conditions[?(@.type==\"Ready\")].status","name":"Ready","type":"string"},{"jsonPath":".status.conditions[?(@.type==\"Active\")].status","name":"Active","type":"string"},{"jsonPath":".status.conditions[?(@.type==\"Fallback\")].status","name":"Fallback","type":"string"},{"jsonPath":".metadata.creationTimestamp","name":"Age","type":"date"}],"name":"v1alpha1","schema":{"openAPIV3Schema":{"description":"ScaledObject is a specification for a ScaledObject resource","properties":{"apiVersion":{"description":"APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources","type":"string"},"kind":{"description":"Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds","type":"string"},"metadata":{"type":"object"},"spec":{"description":"ScaledObjectSpec is the spec for a ScaledObject resource","properties":{"advanced":{"description":"AdvancedConfig specifies advance scaling options","properties":{"horizontalPodAutoscalerConfig":{"description":"HorizontalPodAutoscalerConfig specifies horizontal scale config","properties":{"behavior":{"description":"HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively).","properties":{"scaleDown":{"description":"scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used).","properties":{"policies":{"description":"policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid","items":{"description":"HPAScalingPolicy is a single policy which must hold true for a specified past interval.","properties":{"periodSeconds":{"description":"PeriodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).","format":"int32","type":"integer"},"type":{"description":"Type is used to specify the scaling policy.","type":"string"},"value":{"description":"Value contains the amount of change which is permitted by the policy. It must be greater than zero","format":"int32","type":"integer"}},"required":["periodSeconds","type","value"],"type":"object"},"type":"array"},"selectPolicy":{"description":"selectPolicy is used to specify which policy should be used. If not set, the default value MaxPolicySelect is used.","type":"string"},"stabilizationWindowSeconds":{"description":"StabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).","format":"int32","type":"integer"}},"type":"object"},"scaleUp":{"description":"scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of: * increase no more than 4 pods per 60 seconds * double the number of pods per 60 seconds No stabilization is used.","properties":{"policies":{"description":"policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid","items":{"description":"HPAScalingPolicy is a single policy which must hold true for a specified past interval.","properties":{"periodSeconds":{"description":"PeriodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).","format":"int32","type":"integer"},"type":{"description":"Type is used to specify the scaling policy.","type":"string"},"value":{"description":"Value contains the amount of change which is permitted by the policy. It must be greater than zero","format":"int32","type":"integer"}},"required":["periodSeconds","type","value"],"type":"object"},"type":"array"},"selectPolicy":{"description":"selectPolicy is used to specify which policy should be used. If not set, the default value MaxPolicySelect is used.","type":"string"},"stabilizationWindowSeconds":{"description":"StabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).","format":"int32","type":"integer"}},"type":"object"}},"type":"object"}},"type":"object"},"restoreToOriginalReplicaCount":{"type":"boolean"}},"type":"object"},"cooldownPeriod":{"format":"int32","type":"integer"},"fallback":{"description":"Fallback is the spec for fallback options","properties":{"failureThreshold":{"format":"int32","type":"integer"},"replicas":{"format":"int32","type":"integer"}},"required":["failureThreshold","replicas"],"type":"object"},"idleReplicaCount":{"format":"int32","type":"integer"},"maxReplicaCount":{"format":"int32","type":"integer"},"minReplicaCount":{"format":"int32","type":"integer"},"pollingInterval":{"format":"int32","type":"integer"},"scaleTargetRef":{"description":"ScaleTarget holds the a reference to the scale target Object","properties":{"apiVersion":{"type":"string"},"envSourceContainerName":{"type":"string"},"kind":{"type":"string"},"name":{"type":"string"}},"required":["name"],"type":"object"},"triggers":{"items":{"description":"ScaleTriggers reference the scaler that will be used","properties":{"authenticationRef":{"description":"ScaledObjectAuthRef points to the TriggerAuthentication or ClusterTriggerAuthentication object that is used to authenticate the scaler with the environment","properties":{"kind":{"description":"Kind of the resource being referred to. Defaults to TriggerAuthentication.","type":"string"},"name":{"type":"string"}},"required":["name"],"type":"object"},"metadata":{"additionalProperties":{"type":"string"},"type":"object"},"metricType":{"description":"MetricTargetType specifies the type of metric being targeted, and should be either \"Value\", \"AverageValue\", or \"Utilization\"","type":"string"},"name":{"type":"string"},"type":{"type":"string"}},"required":["metadata","type"],"type":"object"},"type":"array"}},"required":["scaleTargetRef","triggers"],"type":"object"},"status":{"description":"ScaledObjectStatus is the status for a ScaledObject resource","properties":{"conditions":{"description":"Conditions an array representation to store multiple Conditions","items":{"description":"Condition to store the condition state","properties":{"message":{"description":"A human readable message indicating details about the transition.","type":"string"},"reason":{"description":"The reason for the condition's last transition.","type":"string"},"status":{"description":"Status of the condition, one of True, False, Unknown.","type":"string"},"type":{"description":"Type of condition","type":"string"}},"required":["status","type"],"type":"object"},"type":"array"},"externalMetricNames":{"items":{"type":"string"},"type":"array"},"health":{"additionalProperties":{"description":"HealthStatus is the status for a ScaledObject's health","properties":{"numberOfFailures":{"format":"int32","type":"integer"},"status":{"description":"HealthStatusType is an indication of whether the health status is happy or failing","type":"string"}},"type":"object"},"type":"object"},"lastActiveTime":{"format":"date-time","type":"string"},"originalReplicaCount":{"format":"int32","type":"integer"},"pausedReplicaCount":{"format":"int32","type":"integer"},"resourceMetricNames":{"items":{"type":"string"},"type":"array"},"scaleTargetGVKR":{"description":"GroupVersionKindResource provides unified structure for schema.GroupVersionKind and Resource","properties":{"group":{"type":"string"},"kind":{"type":"string"},"resource":{"type":"string"},"version":{"type":"string"}},"required":["group","kind","resource","version"],"type":"object"},"scaleTargetKind":{"type":"string"}},"type":"object"}},"required":["spec"],"type":"object"}},"served":true,"storage":true,"subresources":{"status":{}}}]},"status":{"acceptedNames":{"kind":"","plural":""},"conditions":[],"storedVersions":[]}}
  creationTimestamp: "2022-06-08T10:31:06Z"
  generation: 1
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
    app.kubernetes.io/component: operator
    app.kubernetes.io/name: keda-operator
    app.kubernetes.io/part-of: keda-operator
    app.kubernetes.io/version: 2.7.0
  name: scaledobjects.keda.sh
  resourceVersion: "2899"
  uid: 85b8dec7-c3da-4059-8031-5954dc888a0b
spec:
  conversion:
    strategy: None
  group: keda.sh
  names:
    kind: ScaledObject
    listKind: ScaledObjectList
    plural: scaledobjects
    shortNames:
    - so
    singular: scaledobject
  scope: Namespaced
  versions:
  - additionalPrinterColumns:
    - jsonPath: .status.scaleTargetKind
      name: ScaleTargetKind
      type: string
    - jsonPath: .spec.scaleTargetRef.name
      name: ScaleTargetName
      type: string
    - jsonPath: .spec.minReplicaCount
      name: Min
      type: integer
    - jsonPath: .spec.maxReplicaCount
      name: Max
      type: integer
    - jsonPath: .spec.triggers[*].type
      name: Triggers
      type: string
    - jsonPath: .spec.triggers[*].authenticationRef.name
      name: Authentication
      type: string
    - jsonPath: .status.conditions[?(@.type=="Ready")].status
      name: Ready
      type: string
    - jsonPath: .status.conditions[?(@.type=="Active")].status
      name: Active
      type: string
    - jsonPath: .status.conditions[?(@.type=="Fallback")].status
      name: Fallback
      type: string
    - jsonPath: .metadata.creationTimestamp
      name: Age
      type: date
    name: v1alpha1
    schema:
      openAPIV3Schema:
        description: ScaledObject is a specification for a ScaledObject resource
        properties:
          apiVersion:
            description: 'APIVersion defines the versioned schema of this representation        
              of an object. Servers should convert recognized schemas to the latest
              internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources'
            type: string
          kind:
            description: 'Kind is a string value representing the REST resource this
              object represents. Servers may infer this from the endpoint the client
              submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds'
            type: string
          metadata:
            type: object
          spec:
            description: ScaledObjectSpec is the spec for a ScaledObject resource
            properties:
              advanced:
                description: AdvancedConfig specifies advance scaling options
                properties:
                  horizontalPodAutoscalerConfig:
                    description: HorizontalPodAutoscalerConfig specifies horizontal
                      scale config
                    properties:
                      behavior:
                        description: HorizontalPodAutoscalerBehavior configures the
                          scaling behavior of the target in both Up and Down directions
                          (scaleUp and scaleDown fields respectively).
                        properties:
                          scaleDown:
                            description: scaleDown is scaling policy for scaling Down.
                              If not set, the default value is to allow to scale down
                              to minReplicas pods, with a 300 second stabilization
                              window (i.e., the highest recommendation for the last
                              300sec is used).
                            properties:
                              policies:
                                description: policies is a list of potential scaling
                                  polices which can be used during scaling. At least
                                  one policy must be specified, otherwise the HPAScalingRules   
                                  will be discarded as invalid
                                items:
                                  description: HPAScalingPolicy is a single policy
                                    which must hold true for a specified past interval.
                                  properties:
                                    periodSeconds:
                                      description: PeriodSeconds specifies the window
                                        of time for which the policy should hold true.
                                        PeriodSeconds must be greater than zero and
                                        less than or equal to 1800 (30 min).
                                      format: int32
                                      type: integer
                                    type:
                                      description: Type is used to specify the scaling
                                        policy.
                                      type: string
                                    value:
                                      description: Value contains the amount of change
                                        which is permitted by the policy. It must
                                        be greater than zero
                                      format: int32
                                      type: integer
                                  required:
                                  - periodSeconds
                                  - type
                                  - value
                                  type: object
                                type: array
                              selectPolicy:
                                description: selectPolicy is used to specify which
                                  policy should be used. If not set, the default value
                                  MaxPolicySelect is used.
                                type: string
                              stabilizationWindowSeconds:
                                description: 'StabilizationWindowSeconds is the number
                                  of seconds for which past recommendations should
                                  be considered while scaling up or scaling down.
                                  StabilizationWindowSeconds must be greater than
                                  or equal to zero and less than or equal to 3600
                                  (one hour). If not set, use the default values:
                                  - For scale up: 0 (i.e. no stabilization is done).
                                  - For scale down: 300 (i.e. the stabilization window
                                  is 300 seconds long).'
                                format: int32
                                type: integer
                            type: object
                          scaleUp:
                            description: 'scaleUp is scaling policy for scaling Up.
                              If not set, the default value is the higher of: * increase        
                              no more than 4 pods per 60 seconds * double the number
                              of pods per 60 seconds No stabilization is used.'
                            properties:
                              policies:
                                description: policies is a list of potential scaling
                                  polices which can be used during scaling. At least
                                  one policy must be specified, otherwise the HPAScalingRules   
                                  will be discarded as invalid
                                items:
                                  description: HPAScalingPolicy is a single policy
                                    which must hold true for a specified past interval.
                                  properties:
                                    periodSeconds:
                                      description: PeriodSeconds specifies the window
                                        of time for which the policy should hold true.
                                        PeriodSeconds must be greater than zero and
                                        less than or equal to 1800 (30 min).
                                      format: int32
                                      type: integer
                                    type:
                                      description: Type is used to specify the scaling
                                        policy.
                                      type: string
                                    value:
                                      description: Value contains the amount of change
                                        which is permitted by the policy. It must
                                        be greater than zero
                                      format: int32
                                      type: integer
                                  required:
                                  - periodSeconds
                                  - type
                                  - value
                                  type: object
                                type: array
                              selectPolicy:
                                description: selectPolicy is used to specify which
                                  policy should be used. If not set, the default value
                                  MaxPolicySelect is used.
                                type: string
                              stabilizationWindowSeconds:
                                description: 'StabilizationWindowSeconds is the number
                                  of seconds for which past recommendations should
                                  be considered while scaling up or scaling down.
                                  StabilizationWindowSeconds must be greater than
                                  or equal to zero and less than or equal to 3600
                                  (one hour). If not set, use the default values:
                                  - For scale up: 0 (i.e. no stabilization is done).
                                  - For scale down: 300 (i.e. the stabilization window
                                  is 300 seconds long).'
                                format: int32
                                type: integer
                            type: object
                        type: object
                    type: object
                  restoreToOriginalReplicaCount:
                    type: boolean
                type: object
              cooldownPeriod:
                format: int32
                type: integer
              fallback:
                description: Fallback is the spec for fallback options
                properties:
                  failureThreshold:
                    format: int32
                    type: integer
                  replicas:
                    format: int32
                    type: integer
                required:
                - failureThreshold
                - replicas
                type: object
              idleReplicaCount:
                format: int32
                type: integer
              maxReplicaCount:
                format: int32
                type: integer
              minReplicaCount:
                format: int32
                type: integer
              pollingInterval:
                format: int32
                type: integer
              scaleTargetRef:
                description: ScaleTarget holds the a reference to the scale target
                  Object
                properties:
                  apiVersion:
                    type: string
                  envSourceContainerName:
                    type: string
                  kind:
                    type: string
                  name:
                    type: string
                required:
                - name
                type: object
              triggers:
                items:
                  description: ScaleTriggers reference the scaler that will be used
                  properties:
                    authenticationRef:
                      description: ScaledObjectAuthRef points to the TriggerAuthentication      
                        or ClusterTriggerAuthentication object that is used to authenticate     
                        the scaler with the environment
                      properties:
                        kind:
                          description: Kind of the resource being referred to. Defaults
                            to TriggerAuthentication.
                          type: string
                        name:
                          type: string
                      required:
                      - name
                      type: object
                    metadata:
                      additionalProperties:
                        type: string
                      type: object
                    metricType:
                      description: MetricTargetType specifies the type of metric being
                        targeted, and should be either "Value", "AverageValue", or
                        "Utilization"
                      type: string
                    name:
                      type: string
                    type:
                      type: string
                  required:
                  - metadata
                  - type
                  type: object
                type: array
            required:
            - scaleTargetRef
            - triggers
            type: object
          status:
            description: ScaledObjectStatus is the status for a ScaledObject resource
            properties:
              conditions:
                description: Conditions an array representation to store multiple
                  Conditions
                items:
                  description: Condition to store the condition state
                  properties:
                    message:
                      description: A human readable message indicating details about
                        the transition.
                      type: string
                    reason:
                      description: The reason for the condition's last transition.
                      type: string
                    status:
                      description: Status of the condition, one of True, False, Unknown.        
                      type: string
                    type:
                      description: Type of condition
                      type: string
                  required:
                  - status
                  - type
                  type: object
                type: array
              externalMetricNames:
                items:
                  type: string
                type: array
              health:
                additionalProperties:
                  description: HealthStatus is the status for a ScaledObject's health
                  properties:
                    numberOfFailures:
                      format: int32
                      type: integer
                    status:
                      description: HealthStatusType is an indication of whether the
                        health status is happy or failing
                      type: string
                  type: object
                type: object
              lastActiveTime:
                format: date-time
                type: string
              originalReplicaCount:
                format: int32
                type: integer
              pausedReplicaCount:
                format: int32
                type: integer
              resourceMetricNames:
                items:
                  type: string
                type: array
              scaleTargetGVKR:
                description: GroupVersionKindResource provides unified structure for
                  schema.GroupVersionKind and Resource
                properties:
                  group:
                    type: string
                  kind:
                    type: string
                  resource:
                    type: string
                  version:
                    type: string
                required:
                - group
                - kind
                - resource
                - version
                type: object
              scaleTargetKind:
                type: string
            type: object
        required:
        - spec
        type: object
    served: true
    storage: true
    subresources:
      status: {}
    status: "True"
    type: NamesAccepted
  - lastTransitionTime: "2022-06-08T10:31:07Z"
    message: the initial names have been accepted
    reason: InitialNamesAccepted
    status: "True"
    type: Established
  storedVersions:
  - v1alpha1
  ```

KEDA provides multiple customization options. The KEDA add-on enables the basic common configuration. If you have requirement to run with some  custom configurations for example:  number of KEDA pods running, namespaces that should be watched, logging level, etc. then you may edit the KEDA yaml manually and deploy it. Remember the customizations would be managed by you. 

## Disable KEDA add-on from your AKS cluster

When you no longer need KEDA add-on in the cluster, use the `az aks update` command with--disable-keda option. This will disable KEDA workload auto-scaler

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --disable-keda 
```

## Troubleshooting guide

If managed KEDA is installed in an AKS cluster with user installed KEDA, then Managed KEDA overrides user's KEDA. If user's KEDA has some customizations added, they'll get lost once managed KEDA replaces it. The installation will complete without error. User's auto-scaling should most probably work fine as before. There will be two copies of KEDA resources present in the AKS cluster and only one of them will be doing the job of scaling.

Following error will be thrown in the operator logs. The installation will complete without error.

Error logged in now-suppressed non-participating KEDA operator pod:
the error logged inside the already installed KEDA operator logs.
E0520 11:51:24.868081 1 leaderelection.go:330] error retrieving resource lock default/operator.keda.sh: config maps "operator.keda.sh" is forbidden: User "system:serviceaccount:default:keda-operator" cannot get resource "config maps" in API group "" in the namespace "default"

## Next steps
This article showed you how to install the KEDA add-on on an AKS cluster using Azure CLI. The steps to verify that KEDA add-on is installed and running are included. With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps


[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks update]: /cli/azure/aks#az-aks-update
[az-group-delete]: /cli/azure/group#az-group-delete


[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda]: https://keda.sh/
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue

