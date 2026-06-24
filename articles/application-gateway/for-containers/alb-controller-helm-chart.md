---
title: ALB Controller Helm Chart
description: This article documents the latest helm chart for Application Gateway for Containers' ALB Controller.
services: application-gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: release-notes
ms.date: 6/23/2026
ms.author: mbender
# Customer intent: As a Kubernetes operator, I want to install the ALB Controller using a Helm chart, so that I can manage Application Load Balancer resources effectively within my container environment.
---
<!-- Custom Resource Definitions (CRDs) -->

# ALB Controller Helm Chart

![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square)

A Helm chart to install the ALB Controller on Kubernetes.

You can configure the following parameters during installation:

- aiGateway
- nodeSelector
- tolerations
- name
- installGatewayApiCRDs
- installInferenceExtensionCRDs
- logLevel
- namespace
- securityPolicyFeatureFlag

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| albController.aiGateway | bool | `false` | Enable AI workload support. |
| albController.cloudEnvironment | string | `"AzureCloud"` | Azure cloud environment (`AzureCloud`, `AzureChinaCloud`, `AzureUSGovernment`). |
| albController.controller | object | `{"nodeSelector":{},"replicaCount":2,"resource":{"limits":{"cpu":"400m","memory":"400Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"tolerations":[]}` | Controller parameters. |
| albController.controller.nodeSelector | object | `{}` | Node selector for `alb-controller`. |
| albController.controller.replicaCount | int | `2` | Controller's replica count. |
| albController.controller.resource | object | `{"limits":{"cpu":"400m","memory":"400Mi"},"requests":{"cpu":"100m","memory":"200Mi"}}` | Controller's container resource parameters. |
| albController.controller.tolerations | list | `[]` | Tolerations for `alb-controller`. |
| albController.env | list | `[{"name":"","value":""}]` | Environment variables for `alb-controller`. |
| albController.image | object | `{"name":{"CRDs":"application-lb/images/alb-controller-crds","bootstrap":"application-lb/images/alb-controller-bootstrap","controller":"application-lb/images/alb-controller"},"pullPolicy":"IfNotPresent","registry":"mcr.microsoft.com"}` | `alb-controller` image parameters. |
| albController.image.name | object | `{"CRDs":"application-lb/images/alb-controller-crds","bootstrap":"application-lb/images/alb-controller-bootstrap","controller":"application-lb/images/alb-controller"}` | Image name defaults. |
| albController.image.name.CRDs | string | `"application-lb/images/alb-controller-crds"` | `alb-controller`'s CRDs' image name. |
| albController.image.name.bootstrap | string | `"application-lb/images/alb-controller-bootstrap"` | `alb-controller` bootstrap's image name. |
| albController.image.name.controller | string | `"application-lb/images/alb-controller"` | `alb-controller`'s image name. |
| albController.image.pullPolicy | string | `"IfNotPresent"` | Container image pull policy for controller containers. |
| albController.image.registry | string | `"mcr.microsoft.com"` | Container image registry for `alb-controller`. |
| albController.imagePullSecrets | list | `[]` |  |
| albController.init | object | `{"resource":{"limits":{"cpu":"200m","memory":"128Mi"},"requests":{"cpu":"100m","memory":"128Mi"}}}` | Init parameters. |
| albController.init.resource | object | `{"limits":{"cpu":"200m","memory":"128Mi"},"requests":{"cpu":"100m","memory":"128Mi"}}` | Init container's resource parameters. |
| albController.installGatewayApiCRDs | bool | `true` | A flag to enable or disable installation of Gateway API CRDs. |
| albController.installInferenceExtensionCRDs | bool | `true` | A flag to enable or disable installation of Inference Extension CRDs (only applies when `aiGateway` is enabled). |
| albController.logLevel | string | `"info"` | Log level of `alb-controller`. |
| albController.namespace | string | `"azure-alb-system"` | Namespace to deploy `alb-controller` components in. |
| albController.podIdentity | object | `{"clientID":""}` | Pod identity parameters for `alb-controller`. |
| albController.securityPolicyFeatureFlag | bool | `true` | Feature flag to enable Application Load Balancer Security Policy Resource. |

## nodeSelector

The `nodeSelector` parameter follows Kubernetes' implementation as defined [here](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector).  

The `nodeSelector` parameter only provisions ALB Controller pods to nodes with a defined label.  

In this example, you label a set of nodes with a node label called `albController`.

1. Label each node where you want to run the ALB controller pods.

   `kubectl label nodes <node-name> albController=true`

1. Specify the `nodeSelector` through the `helm install` command by using the following example:

   ```bash
   HELM_NAMESPACE='<namespace for deployment>'
   CONTROLLER_NAMESPACE='azure-alb-system'
   VERSION='<latest_version>'
   az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
   helm install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
        --namespace $HELM_NAMESPACE \
        --version $VERSION \
        --set albController.namespace=$CONTROLLER_NAMESPACE \
        --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
        --set nodeSelector.albController=true
   ```

## Tolerations

Tolerations follow Kubernetes' implementation as defined [here](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).

Add tolerations to each of the ALB Controller pods, supporting the following format:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

If desired, you can specify the toleration inline through the `helm install` command by using the following example:

```bash
HELM_NAMESPACE='<namespace for deployment>'
CONTROLLER_NAMESPACE='azure-alb-system'
VERSION='<latest_version>'
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
helm install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
     --namespace $HELM_NAMESPACE \
     --version $VERSION \
     --set albController.namespace=$CONTROLLER_NAMESPACE \
     --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
     --set tolerations.key=key1 --set tolerations.operator=Equal --set tolerations.value=value1 --set tolerations.effect=NoExecute --set tolerations.tolerationSeconds=3600
     --set tolerations.key=key2 --set tolerations.operator=Exists --set tolerations.effect=NoSchedule
```

