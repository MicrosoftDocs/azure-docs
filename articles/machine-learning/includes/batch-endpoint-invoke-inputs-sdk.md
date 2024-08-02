---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 07/31/2024
ms.author: mopeakande
---

__What's the difference between the `inputs` and `input` parameter when you invoke an endpoint?__

In general, you can use a dictionary `inputs = {}` parameter with the `invoke` method to provide an arbitrary number of required inputs to a batch endpoint that contains a _model deployment_ or a _pipeline deployment_.

For a _model deployment_, you can use the `input` parameter as a shorter way to specify the input data location for the deployment. This approach works because a model deployment always takes only one [data input](../how-to-access-data-batch-endpoints-jobs.md#explore-data-inputs).