---
title: Vertical Pod Autoscaler API reference in Azure Kubernetes Service (AKS)
description: Learn about the Vertical Pod Autoscaler API reference for Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 09/26/2023
---

# Vertical Pod Autoscaler API reference

This article provides the API reference for the Vertical Pod Autoscaler feature of Azure Kubernetes Service.

This reference is based on version 0.13.0 of the AKS implementation of VPA.

## VerticalPodAutoscaler

|Name |Ojbect |Description |
|-------|-------||-------|
|metadata |ObjectMeta | Standard [object metadata][object-metadata-ref].|
|spec |VerticalPodAutoscalerSpec |The desired behavior of the Vertical Pod Autoscaler.|
|status |VerticalPodAutoscalerStatus |The most recently observed status of the Vertical Pod Autoscaler. |

## VerticalPodAutoscalerSpec

|Name |Ojbect |Description |
|-------|-------||-------|
|targetRef |CrossVersionObjectReference | Reference to the controller managing the set of pods for the autoscaler to control. For example, a Deployment or a StatefulSet. You can point a Vertical Pod Autoscaler at any controller that has a [Scale][scale-ref] subresource. Typically, the Vertical Pod Autoscaler retrieves the pod set from the controller's ScaleStatus. |
|updatePolicy |PodUpdatePolicy |Specifies whether recommended updates are applied when a pod is started and whether recommended updates are applied during the life of a pod. |
|resourcePolicy |PodResourcePolicy |Specifies policies for how CPU and memory requests are adjusted for individual containers. The resource policy can be used to set constraints on the recommendations for individual containers. If not specified, the autoscaler computes recommended resources for all containers in the pod, without additional constraints.|
|recommenders |VerticalPodAutoscalerRecommenderSelector |Recommender is responsible for generating recommendation for the VPA object. Leave empty to use the default recommender. Otherwise the list can contain exactly one entry for a user-provided alternative recommender. |

## VerticalPodAutoscalerList

|Name |Ojbect |Description |
|-------|-------||-------|
|metadata |ObjectMeta |Standard [object metadata][object-metadata-ref]. |
|items |VerticalPodAutoscaler (array) |A list of Vertical Pod Autoscaler objects. |

## PodUpdatePolicy

|Name |Ojbect |Description |
|-------|-------||-------|
|updateMode |string |A string that specifies whether recommended updates are applied when a pod is started and whether recommended updates are applied during the life of a pod. Possible values are `Off`, `Initial`, `Recreate`, and `Auto`. The default is `Auto` if you don't specify a value. |
|minReplicas |int32 |A value representing the minimal number of replicas which need to be alive for Updater to attempt pod eviction (pending other checks like Pod Disruption Budget). Only positive values are allowed. Defaults to global `--min-replicas` flag, which is set to `2`. |

## PodResourcePolicy

|Name |Ojbect |Description |
|-------|-------||-------|
|conainerPolicies |ContainerResourcePolicy |An array of resource policies for individual containers. There can be at most one entry for every named container, and optionally a single wildcard entry with `containerName = '*'`, which handles all containers that do not have individual policies. |

## ContainerResourcePolicy

|Name |Ojbect |Description |
|-------|-------||-------|
|containerName |string |A string that specifies the name of the container that the policy applies to. If not specified, the policy serves as the default policy. |
|mode |ContainerScalingMode |Specifies whether recommended updates are applied to the container when it is started and whether recommended updates are applied during the life of the container. Possible values are `Off` and `Auto`. The default is `Auto` if you don't specify a value. |
|minAllowed |ResourceList |Specifies the minimum CPU request and memory request allowed for the container. By default, there is no minimum applied. |
|maxAllowed |ResourceList |Specifies the maximum CPU request and memory request allowed for the container. By default, there is no maximum applied. |
|ControlledResources |[]ResourceName |Specifies the type of recommendations that are computed (and possibly applied) by the Vertical Pod Autoscaler. If empty, the default of [ResourceCPU, ResourceMemory] is used. |

## VerticalPodAutoscalerRecommenderSelector

|Name |Ojbect |Description |
|-------|-------||-------|
|name |string |A string that specifies the name of the recommender responsible for generating recommendation for this object. |

## VerticalPodAutoscalerStatus

|Name |Ojbect |Description |
|-------|-------||-------|
|recommendation |RecommendedPodResources |The most recently recommended CPU and memory requests. |
|conditions |VerticalPodAutoscalerCondition | An array that describes the current state of the Vertical Pod Autoscaler. |

## RecommendedPodResources

|Name |Ojbect |Description |
|-------|-------||-------|
|containerRecommendation |RecommendedContainerResources |An array of resources recommendations for individual containers. |

## RecommendedContainerResources

|Name |Ojbect |Description |
|-------|-------||-------|
|containerName |string| A string that specifies the name of the container that the recommendation applies to. |
|target |ResourceList |The recommended CPU request and memory request for the container. |
|lowerBound |ResourceList |The minimum recommended CPU request and memory request for the container. This amount is not guaranteed to be sufficient for the application to be stable. Running with smaller CPU and memory requests is likely to have a significant impact on performance or availability. |
|upperBound |ResourceList |The maximum recommended CPU request and memory request for the container. CPU and memory requests higher than these values are likely to be wasted. |
|uncappedTarget |ResourceList |The most recent resource recommendation computed by the autoscaler, based on actual resource usage, not taking into account the **Container Resource Policy**. If actual resource usage causes the target to violate the **Container Resource Policy**, this might be different from the bounded recommendation. This field does not affect actual resource assignment. It is used only as a status indication. |

## VerticalPodAutoscalerCondition

|Name |Ojbect |Description |
|-------|-------||-------|
|type |VerticalPodAutoscalerConditionType |The type of condition being described. Possible values are `RecommendationProvided`, `LowConfidence`, `NoPodsMatched`, and `FetchingHistory`. |
|status |ConditionStatus |The status of the condition. Possible values are `True`, `False`, and `Unknown`. |
|lastTransitionTime |Time |The last time the condition made a transition from one status to another. |
|reason |string |The reason for the last transition from one status to another. |
|message |string |A human-readable string that gives details about the last transition from one status to another. |

## Next steps

See [Vertical Pod Autoscaler][vertical-pod-autoscaler] to understand how to improve cluster resource utilization and free up CPU and memory for other pods.

<!-- EXTERNAL LINKS -->
[object-metadata-ref]: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata
[scale-ref]: https://v1-25.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.25/#scalespec-v1-autoscaling

<!-- INTERNAL LINKS -->
[vertical-pod-autoscaler]: vertical-pod-autoscaler.md
