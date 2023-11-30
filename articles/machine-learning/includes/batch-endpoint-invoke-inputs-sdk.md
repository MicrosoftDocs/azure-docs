---
author: masakande
ms.service: machine-learning
ms.topic: include
ms.date: 11/30/2023
ms.author: mopeakande
---

Run the endpoint with the `invoke` method by specifying the required inputs for your deployment as a dictionary `inputs = {}`. Using a dictionary provides a more general way to specify the inputs required for your deployment type. Alternatively, for a model deployment, which always requires only one data input, you can simplify the `invoke` call by specifying the input as a value to the `input` parameter.