---
title: ALB Controller Helm Chart
description: This article documents the latest helm chart for Application Gateway for Containers' ALB Controller.
services: application-gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: release-notes
ms.date: 5/2/2025
ms.author: mbender
---
<!-- Custom Resource Definitions (CRDs) -->

# ALB Controller Helm Chart

![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square)

A Helm chart to install the ALB Controller on Kubernetes.

The following parameters are supported for configuration during installation:

- tolerations
- name
- installGatewayApiCRDs
- logLevel
- namespace
- seucrityPolicyFeatureFlag

## Values

| Key | Type | Default | Description |
| ----- | ------ | --------- | ------------- |
| albController.controller | object | `{"replicaCount":2,"resource":{"limits":{"cpu":"400m","memory":"400Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"tolerations":[]}` | ALB Controller parameters |
| albController.controller.replicaCount | int | `2` | ALB Controller's replica count. |
| albController.controller.resource | object | `{"limits":{"cpu":"400m","memory":"400Mi"},"requests":{"cpu":"100m","memory":"200Mi"}}` | ALB Controller's container resource parameters. |
| albController.controller.tolerations | list | `[]` | Tolerations for ALB Controller |
| albController.env | list | `[{"name":"","value":""}]` | Environment variables for ALB Controller. |
| albController.image | object | `{"name":{"CRDs":"application-lb/images/alb-controller-crds","bootstrap":"application-lb/images/alb-controller-bootstrap","controller":"application-lb/images/alb-controller"},"pullPolicy":"IfNotPresent","registry":"mcr.microsoft.com"}` | ALB Controller image parameters. |
| albController.image.name | object | `{"CRDs":"application-lb/images/alb-controller-crds","bootstrap":"application-lb/images/alb-controller-bootstrap","controller":"application-lb/images/alb-controller"}` | Image name defaults. |
| albController.image.name.CRDs | string | `"application-lb/images/alb-controller-crds"` | ALB Controller CRDs' image name |
| albController.image.name.bootstrap | string | `"application-lb/images/alb-controller-bootstrap"` | alb-controller bootstrap's init container image name. |
| albController.image.name.controller | string | `"application-lb/images/alb-controller"` | ALB Controller's image name. |
| albController.image.pullPolicy | string | `"IfNotPresent"` | Container image pull policy for ALB Controller containers. |
| albController.image.registry | string | `"mcr.microsoft.com"` | Container image registry for ALB Controller. |
| albController.imagePullSecrets | list | `[]` |  |
| albController.installGatewayApiCRDs | bool | `true` | A flag to enable/disable installation of Gateway API CRDs. |
| albController.logLevel | string | `"info"` | Log level of ALB Controller. |
| albController.namespace | string | `"azure-alb-system"` | Namespace to deploy ALB Controller components in. |
| albController.securityPolicyFeatureFlag | bool | `false` | Enable Application Load Balancer Security Policy Resource (WAF Preview). |

## Tolerations

Tolerations follow Kubernetes' implementation as defined [here](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).

Tolerations are added to each of the ALB Controller pods, supporting the following format:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

If desired, you can specify the toleration inline via the helm install command using the following example:

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
