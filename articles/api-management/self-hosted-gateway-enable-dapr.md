---
title: Enable Dapr support in self-hosted gateway | Azure API Management
description: Learn now to enable Dapr support in the self-hosted gateway of Azure API Management to expose and manage Dapr microservices as APIs. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/01/2023
ms.author: danlep
---

# Enable Dapr support in the self-hosted gateway

Dapr integration in API Management enables operations teams to directly expose Dapr microservices deployed on Kubernetes clusters as APIs, and make those APIs discoverable and easily consumable by developers with proper controls across multiple Dapr deployments—whether in the cloud, on-premises, or on the edge.

## About Dapr

Dapr is a portable runtime for building stateless and stateful microservices-based applications with any language or framework. It codifies the common microservice patterns, like service discovery and invocation with build-in retry logic, publish-and-subscribe with at-least-once delivery semantics, or pluggable binding resources to ease composition using external services. Go to [dapr.io](https://dapr.io) for detailed information and instruction on how to get started with Dapr.

## Enable Dapr support

To turn on Dapr support in the API Management self-hosted gateway, add the following [Dapr annotations](https://docs.dapr.io/reference/arguments-annotations-overview/) to the [Kubernetes deployment template](how-to-deploy-self-hosted-gateway-kubernetes.md), replacing `app-name` with a desired name. A complete walkthrough of setting up and using API Management with Dapr is available [here](https://aka.ms/apim/dapr/walkthru).

```yml
template:
    metadata:
      labels:
        app: app-name
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "app-name"
```
> [!TIP]
> You can also deploy the [self-hosted gateway with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) and use the Dapr configuration options.

## Dapr integration policies

API Management provides specific [policies](api-management-policies.md#dapr-integration-policies) to interact with Dapr APIs exposed through the self-hosted gateway.

## Next steps

* Learn more about [Dapr integration in API Management](https://cloudblogs.microsoft.com/opensource/2020/09/22/announcing-dapr-integration-azure-api-management-service-apim/)