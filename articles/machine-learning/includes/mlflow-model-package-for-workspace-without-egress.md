---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 10/04/2023
ms.author: mopeakande
---

> [!TIP]
> __Workspaces without public network access:__ Before you can deploy MLflow models to online endpoints without egress connectivity, you have to [package the models (preview)](../how-to-package-models.md). By using model packaging, you can avoid the need for an internet connection, which Azure Machine Learning would otherwise require to dynamically install necessary Python packages for the MLflow models.