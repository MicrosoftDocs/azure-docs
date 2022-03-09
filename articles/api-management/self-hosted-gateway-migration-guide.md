---
title: Self-hosted gateway migration guide | Azure API Management
description: Learn how to migrate to self-hosted gateway v2.
services: api-management
documentationcenter: ''
author: tomkerkhove

ms.service: api-management
ms.topic: article
ms.date: 03/08/2022
ms.author: danlep
---

# Self-hosted gateway migration guide

This article explains how to migrate existing self-hosted gateway deployments to self-hosted gateway v2.

## What's new?

As we strive to make it easier for customers to deploy our self-hosted gateway, we have **introduced a new configuration API** that removes the dependency on Azure Storage, unless you are using [API inspector](api-management-howto-api-inspector.md) or quotas.

This allows customers to more easily adopt, deploy and operate our self-hosted gateway in their existing infrastructure.

We have [introduced new container image tags](how-to-self-hosted-gateway-on-kubernetes-in-production.md#container-image-tag) to let customers choose the best way to try our gateway and deploy it in production.

To help customers run our gateway in production we have extended [our production guidance](how-to-self-hosted-gateway-on-kubernetes-in-production.md) to cover how to autoscale the gateway, and deploy it highly available in your Kubernetes cluster.

Learn more about the connectivity of our gateway, our new infrastructure requirements, and what happens in case of connectivity loss in [this article](self-hosted-gateway-overview.md#connectivity-to-azure).

## Prerequisites

Before you can migrate to self-hosted gateway v2, you need to ensure your infrastructure [meets the requirements](self-hosted-gateway-overview.md#gateway-v2-requirements).

## Migrating to self-hosted gateway v2

Migrating from self-hosted gateway v2 requires a few small steps to be done.

### Container Image

Change the image tag in your deployment scripts to use `2.0.0` or above.

Alternatively, you can choose to use one of our other [container image tags](how-to-self-hosted-gateway-on-kubernetes-in-production.md#container-image-tag).

### Configuration URL

In order to migrate to self-hosted gateway v2, you need to update the configuration URL to use our new configuration API.

The original configuration URL with format `{instance-name}.management.azure-api.net/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ApiManagement/service/{instance-name}?api-version=2021-01-01-preview` should be replaced with `{instance-name}.configuration.azure-api.net`.

### Security

The user running the self-hosted gateway container requires to have 1001 permissions at least.

## Next steps

-   Learn more about [API Management in a Hybrid and Multi-Cloud World](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
