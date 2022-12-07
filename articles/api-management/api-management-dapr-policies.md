---
title: Azure API Management Dapr integration policies | Microsoft Docs
description: Azure API Management policies for interacting with Dapr microservices extensions. 
author: dlepow
ms.author: danlep
ms.date: 12/02/2022
ms.topic: reference
ms.service: api-management
---

# API Management Dapr integration policies

The following API Management policies can be used for integrating with Distributed Application Runtime (Dapr) microservices extensions.

-  [Send request to a service](set-backend-service-dapr-policy.md): Uses Dapr runtime to locate and reliably communicate with a Dapr microservice. To learn more about service invocation in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md#service-invocation) file.
-  [Send message to Pub/Sub topic](publish-to-dapr-policy.md): Uses Dapr runtime to publish a message to a Publish/Subscribe topic. To learn more about Publish/Subscribe messaging in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.
-  [Trigger output binding](invoke-dapr-binding-policy.md): Uses Dapr runtime to invoke an external system via output binding. To learn more about bindings in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.

## About Dapr

Dapr is a portable runtime for building stateless and stateful microservices-based applications with any language or framework. It codifies the common microservice patterns, like service discovery and invocation with build-in retry logic, publish-and-subscribe with at-least-once delivery semantics, or pluggable binding resources to ease composition using external services. Go to [dapr.io](https://dapr.io) for detailed information and instruction on how to get started with Dapr.

> [!IMPORTANT]
> Policies referenced in this topic work only in the [self-hosted version of the API Management gateway](self-hosted-gateway-overview.md) with Dapr support enabled.

## Enable Dapr support in the self-hosted gateway

To turn on Dapr support in the self-hosted gateway, add the [Dapr annotations](https://github.com/dapr/docs/blob/master/README.md) below to the [Kubernetes deployment template](how-to-deploy-self-hosted-gateway-kubernetes.md) replacing "app-name" with a desired name. Complete walkthrough of setting up and using API Management with Dapr is available [here](https://aka.ms/apim/dapr/walkthru).
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


[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]

