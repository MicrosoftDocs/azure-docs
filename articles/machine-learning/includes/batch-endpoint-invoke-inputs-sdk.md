---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 12/18/2023
ms.author: mopeakande
---

__What's the different between `inputs` and `input` when you invoke an endpoint?__

In general, you can use a dictionary `inputs = {}` with the `invoke` method to provide an arbitrary number of required inputs to a batch endpoint that contains a _model deployment_ or a _pipeline deployment_.

For a _model deployment_, you can use `input` as a shorter way to specify the input data location for the deployment, since a model deployment always takes only one [data input](../how-to-access-data-batch-endpoints-jobs.md#data-inputs).