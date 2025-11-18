---
title: ALB Service Mesh Helm Chart
description: This article documents the latest Helm chart for Application Gateway for Containers' ALB Service Mesh Extension.
services: application-gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: release-notes
ms.date: 8/25/2025
ms.author: mbender
# Customer intent: As a Kubernetes operator, I want to install the Service Mesh integration for Application Gateway for Containers using a Helm chart, so that I can manage Application Load Balancer resources effectively within my container environment.
---
<!-- Custom Resource Definitions (CRDs) -->

# ALB Service Mesh Extension Helm Chart

![Version: v0.0.1](https://img.shields.io/badge/Version-v0.0.1-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square)

A Helm chart to install ALB Controller Service Mesh Extension on Kubernetes.  This chart should only be installed after installation of [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md).

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| albServiceMeshExtension.image | object | `{"name":{"istioExtension":"application-lb/images/alb-controller-istio-extension","istioExtensionJob":"application-lb/images/alb-controller-base-image"},"pullPolicy":"IfNotPresent","registry":"mcr.microsoft.com","tag":"latest"}` | alb-controller-servicemesh-extension image parameters. |
| albServiceMeshExtension.image.name | object | `{"istioExtension":"application-lb/images/alb-controller-istio-extension","istioExtensionJob":"application-lb/images/alb-controller-base-image"}` | Image name defaults. |
| albServiceMeshExtension.image.pullPolicy | string | `"IfNotPresent"` | Image pull policy for alb-controller-servicemesh-extension containers. |
| albServiceMeshExtension.image.registry | string | `"mcr.microsoft.com"` | Image registry for alb-controller-servicemesh-extension containers. |
| albServiceMeshExtension.image.tag | string | `"latest"` | Container image tag for alb-controller-servicemesh-extension containers. |
| albServiceMeshExtension.imagePullSecrets | list | `[]` |  |
| albServiceMeshExtension.istioExtension | object | `{"replicaCount":2,"resource":{"limits":{"cpu":"50m","memory":"64Mi"},"requests":{"cpu":"25m","memory":"32Mi"}},"revision":""}` | alb-controller-istio-extension's parameters. |
| albServiceMeshExtension.istioExtension.replicaCount | int | `2` | alb-controller-istio-extension pods' replica count. Increase of the replica count is not supported. |
| albServiceMeshExtension.istioExtension.resource | object | `{"limits":{"cpu":"50m","memory":"64Mi"},"requests":{"cpu":"25m","memory":"32Mi"}}` | alb-controller-istio-extension container resource parameters. |
| albServiceMeshExtension.istioExtension.revision | string | `""` | istio's revision the alb-controller-istio-extension needs to connect to. |
| albServiceMeshExtension.logLevel | string | `"info"` | Log level of alb-controller-servicemesh-extension containers. |
| albServiceMeshExtension.provider | string | `"istio"` | Provider is the name of the service mesh provider. `Istio` is the only supported value.   |
