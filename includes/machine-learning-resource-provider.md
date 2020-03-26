---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/09/2020
ms.author: larryfr
---

When creating an Azure Machine Learning workspace, or a resource used by the workspace, you may receive an error similar to the following messages:

* `No registered resource provider found for location {location}`
* `The subscription is not registered to use namespace {resource-provider-namespace}`

Most resource providers are automatically registered, but not all. If you receive this message, you need to register the provider mentioned.

For information on registering resource providers, see [Resolve errors for resource provider registration](../articles/azure-resource-manager/templates/error-register-resource-provider.md).