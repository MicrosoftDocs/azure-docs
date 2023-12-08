---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 11/30/2023
ms.author: mopeakande
---

In general, for model and pipeline deployments, you can run the batch endpoint with the `invoke` method by using a dictionary `inputs = {}` to specify the required inputs for your deployment. Using a dictionary provides a more general way to specify the inputs required for your deployment type.

For model deployments, which always require one [data input](../how-to-access-data-batch-endpoints-jobs.md#data-inputs) that points to the location of the data that the batch endpoint should consume, you can further simplify the `invoke` call by specifying the input data location as a value to the `input` parameter.