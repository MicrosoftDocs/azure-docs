---
title: Release notes for ALB Controller
description: This article lists updates made to the Application Gateway for Containers ALB Controller
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: article
ms.date: 07/25/2023
ms.author: greglin
---

# Release notes for ALB Controller

This article provides details about changes to the ALB Controller for Application Gateway for Containers.

The ALB Controller is a Kubernetes deployment that orchestrates configuration and deployment of Application Gateway for Containers. It uses both ARM and configuration APIs to propagate configuration to the Application Gateway for Containers Azure deployment.

Each release of ALB Controller has a documented helm chart version and supported Kubernetes cluster version.

Instructions for new or existing deployments of ALB Controller are found in the following links:
- [New deployment of ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md#for-new-deployments)
- [Upgrade existing ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md#for-existing-deployments)

## Latest Release (Recommended)
July 25, 2023 - 0.4.023971 - Ingress + Gateway co-existence improvements

## Release history
July 24, 2023 - 0.4.023961 - Improved Ingress support

July 24, 2023 - 0.4.023921 - Initial release of ALB Controller
* Minimum supported Kubernetes version: v1.25
