---
title: Release notes for ALB Controller
description: This article lists updates made to the Application Gateway for Containers ALB Controller.
services: application-gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: release-notes
ms.date: 5/2/2025
ms.author: mbender
---

# Release notes for ALB Controller

This article provides details about changes to the ALB Controller for Application Gateway for Containers.

The ALB Controller is a Kubernetes deployment that orchestrates configuration and deployment of Application Gateway for Containers. It uses both ARM and configuration APIs to propagate configuration to the Application Gateway for Containers Azure deployment.

Each release of ALB Controller has a documented helm chart version and supported Kubernetes cluster version.

Instructions for new or existing deployments of ALB Controller are found in the following links:

- [New deployment of ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md#for-new-deployments)
- [Upgrade existing ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md#for-existing-deployments)

## Latest Release (Recommended)

| ALB Controller Version | Gateway API Version | Minimum Kubernetes Version | Release Notes |
| ---------------------- | ------------------- | ------------------ | ------------- |
| 1.6.7 | v1.1.1 | v1.27 | [Fix for SSE timeout value of 0](https://aka.ms/qa2153620), [Overlay CNI fix](https://github.com/Azure/AKS/issues/4950), [support readinessProbe port by name](https://github.com/Azure/AKS/issues/4861), leverage init container during bootstrap, misc. bug fixes and improvements |

## Release history

| ALB Controller Version | Gateway API Version | Minimum Kubernetes Version | Release Notes |
| ---------------------- | ------------------- | ------------------ | ------------- |
| 1.5.2 | v1.1.1 | v1.26 | Support for Azure CNI Overlay |
| 1.4.12 | v1.1.1 | v1.26 | Updated to Gateway API version 1.1.1, Regex match support for path and header match in HTTP and GRPC routes, [Wildcard hostname fix](https://github.com/Azure/AKS/issues/4713), Misc. bug fixes and improvements |
| 1.3.7| v1.1 | v1.26 | Minor fixes and improvements |
| 1.2.3| v1.1 | v1.26 | Gateway API v1.1, gRPC support, frontend mutual authentication, readiness probe fixes, custom health probe port and TLS mode  |
| 1.0.2| v1 | v1.26 | ECDSA + RSA certificate support for both Ingress and Gateway API, Ingress fixes, Server-sent events support |
| 1.0.0| v1 | v1.26 | General Availability! URL redirect for both Gateway and Ingress API, v1beta1 -> v1 of Gateway API, quality improvements<br/>Breaking Changes: TLS Policy for Gateway API [PolicyTargetReference](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1alpha2.PolicyTargetReferenceWithSectionName)<br/>Listener is now referred to as [SectionName](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.SectionName)<br/>Fixes: Request timeout of 3 seconds, [HealthCheckPolicy interval](https://github.com/Azure/AKS/issues/4086), [pod crash for missing API fields](https://github.com/Azure/AKS/issues/4087) |
| 0.6.3 | v1beta1 | v1.25 | Hotfix to address handling of Application Gateway for Containers frontends during controller restart in managed scenario |
| 0.6.2 | - | - | Skipped release |
| November 6, 2023 - 0.6.1 | v1beta1 | v1.25 | Gateway / Ingress API - Header rewrite support, Ingress API - URL rewrite support, Ingress multiple-TLS listener bug fix, two certificates maximum per host, adopting [semantic versioning (semver)](https://semver.org/), quality improvements |
| September 25, 2023 - 0.5.024542 | v1beta1 | v1.25 | Custom Health Probes, Controller HA, Multi-site support for Ingress, [helm_release via Terraform fix](https://github.com/Azure/AKS/issues/3857), Path rewrite for Gateway API, status for Ingress resources, quality improvements |
| July 25, 2023 - 0.4.023971 | v1beta1 | v1.25 | Ingress + Gateway coexistence improvements |
| July 24, 2023 - 0.4.023961 | v1beta1 | v1.25 | Improved Ingress support |
| July 24, 2023 - 0.4.023921 | v1beta1 | v1.25 | Initial release of ALB Controller |
