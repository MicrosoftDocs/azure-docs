---
title: What are managed endpoints
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's managed endpoints simplify provisioning and hosting your ML model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sethur
author: rsethur
ms.reviewer: laobri
ms.date: 05/25/2021
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# What are managed endpoints in Azure Machine Learning?

With managed endpoints, along with the model, users specify the VM sku and scale settings and the system takes care of provisioning the compute and hosting the model:

- Users will be able to monitor their model availability, performance and SLA using out of the box integration with Azure Monitor
- Users would be able to debug using the logs &amp; analyze performance with our integration with Azure Log Analytics and Appinsights
- To ensure users would be able to do a safe rollout, we natively support blue/green rollout.
- Users do not deal with creation and administration of infrastructure:
  - the system handles update/patch of the underlying host OS images
  - the system handles node recovery incase of system failure.
- Users would be able to build their CI/CD MLOps pipelines using our new CLI interface &amp; REST/ARM interfaces.

We are introducing the concept of endpoint and deployments. Using this, users will be able to create multiple versions of models under a single endpoint and perform safe rollout to newer versions.

:::image type="content" source="media/concept-managed-endpoints/managed-endpoints-concept.png" alt-text="{alt-text}":::

## Endpoint

An HTTPS endpoint that clients can invoke to get the inference output of models. It provides:

- Stable URI: my-endpoint.region.inference.ml.azure.com
- Authentication: Key &amp; Token based auth
- SSL Termination
- Traffic split between deployments

## Deployment

Is a set of compute resources hosting the model and performing inference. Users can configure:

- Model details (code, model, environment)
- Resource and scale settings
- Advanced settings like request and probe settings

The above picture shows an endpoint with a traffic split of 90% and 10% between blue and green deployments, respectively (these names are for illustratory purpose – you can have any name). The blue deployment is running model version 1 in three CPU nodes (F2s vm sku) and green deployment is running on model version 2 in three GPU nodes (NC6v2 vm sku).

With multiple deployment support and traffic split capability, users can perform safe rollout of new models by gradually migrating traffic [in this case] from blue to green and monitoring metrics at every stage to ensure the rollout has been successful.

Though this blog talks primarily about managed online endpoints, you can learn more about batch endpoints here [link]

:::image type="content" source="media/concept-managed-endpoints/screenshot_consolidated.png" alt-text="{alt-text}" :::

## Next steps

tk