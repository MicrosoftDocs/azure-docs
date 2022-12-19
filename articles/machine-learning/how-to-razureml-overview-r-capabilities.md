---
title: Overview of R capabilities in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn about the R capabilities in Azure Machine Learning'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to, reference, guide
author: samuel100, wahalulu
ms.author: samkemp, mavaisma
ms.reviewer: sgilley
---

# Overview of R capabilities in Azure Machine Learning

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This article outlines the key scenarios for R that are supported in Azure Machine Learning and known limitations.

## Key scenarios supported

- Develop R scripts interactively using Jupyter Notebooks or RStudio on larger hardware.
- Read and write artifacts to Azure Storage from the interactive R session
- Submit remote asynchronous R jobs (this happens via the CLI or Python SDK, not R)
- Build R workflows (pipelines)
- Deploy R models to real-time endpoints
- Score R models as a batch process
- Deploy R functions as a Web API
- Create and managed model assets
- Track experiments and model metrics using MLFlow


## Known limitations

- There is no R *control-plane* SDK, instead you use the Azure CLI v2 via a terminal.
- Zero code deployment of an R MLFlow model is currently not supported.
- Batch endpoints are currently not supported.
- Parallel job step not supported with R

## Next steps

Learn more about R in Azure Machine Learning:

* [Interactive R development](how-to-razureml-interactive-development.md)
* [Adapt your R script to run in production](how-to-razureml-modify-script-for-prod.md)
* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)
* [How to deploy an R model to an online (real time) endpoint](how-to-razureml-deploy-an-r-model.md)
