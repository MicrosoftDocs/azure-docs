---
how-to-monitor-LLM-safety-quality---
title: Monitoring models in production (preview)
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production on Azure Machine Learning.
services: machine-learning
author: buchananwp
ms.author: wibuchan
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: mopeakande
reviewer: msakande
ms.topic: conceptual
ms.date: 05/23/2023
ms.custom: devplatv2
---


# TEST

## Metric requirements: configuration
For generation safety and quality, the following data collection is required:

* **prompt (aka question) text** - the original prompt given by user
* **completion (aka answer) text** - the final completion from LLM API call that is returned to user
* **context text** - any context data that is sent to LLM API call together with original prompt (optional)
* **ground truth text** - the user-defined text as the source of truth (optional)