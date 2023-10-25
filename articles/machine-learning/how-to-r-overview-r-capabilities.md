---
title: Bring R workloads into Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to bring your R workloads into Azure Machine Learning'
ms.service: machine-learning
ms.subservice: core
ms.date: 01/12/2023
ms.topic: conceptual
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Bring your R workloads

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

There's no Azure Machine Learning SDK for R.  Instead, you'll use either the CLI or a Python control script to run your R scripts.  

This article outlines the key scenarios for R that are supported in Azure Machine Learning and known limitations.

## Typical R workflow

A typical workflow for using R with Azure Machine Learning:

- [Develop R scripts interactively](how-to-r-interactive-development.md) using Jupyter Notebooks on a compute instance.  (While you can also add Posit or RStudio to a compute instance, you can't currently access data assets in the workspace from these applications on the compute instance. So for now, interactive work is best done in a Jupyter notebook.)

    - Read tabular data from a registered data asset or datastore
    - Install additional R libraries
    - Save artifacts to the workspace file storage

- [Adapt your script](how-to-r-modify-script-for-production.md) to run as a production job in Azure Machine Learning

    - Remove any code that may require user interaction
    - Add command line input parameters to the script as necessary
    - Include and source the `azureml_utils.R` script in the same working directory of the R script to be executed
    - Use `crate` to package the model
    - Include the R/MLflow functions in the script to **log** artifacts, models, parameters, and/or tags to the job on MLflow

- [Submit remote asynchronous R jobs](how-to-r-train-model.md) (you submit jobs via the CLI or Python SDK, not R)

    - Build an environment
    - Log job artifacts, parameters, tags and models

- [Register your model](how-to-r-train-model.md#register-model) using Azure Machine Learning studio
- [Deploy registered R models](how-to-r-deploy-r-model.md) to managed online endpoints
    - Use the deployed endpoints for real-time inferencing/scoring

## Known limitations
 

| Limitation | Do this instead |
|---|---|
| There's no R _control-plane_ SDK. | Use the Azure CLI or Python control script to submit jobs. |
| RStudio running as a custom application (such as Posit or RStudio) within a container on the compute instance can't access workspace assets or MLflow. | Use Jupyter Notebooks with the R kernel on the compute instance. |
| Interactive querying of workspace MLflow registry from R isn't supported. |  |
| Nested MLflow runs in R are not supported. |  |
| Parallel job step isn't supported. | Run a script in parallel `n` times using different input parameters.  But you'll have to meta-program to generate `n` YAML or CLI calls to do it. |
| Programmatic model registering/recording from a running job with R isn't supported. |  |
| Zero code deployment (that is, automatic deployment) of an R MLflow model is currently not supported. | Create a custom container with `plumber` for deployment. |
| Scoring an R model with batch endpoints isn't supported. |  |
| Azure Machine Learning online deployment yml can only use image URIs directly from the registry for the environment specification; not pre-built environments from the same Dockerfile. | Follow the steps in [How to deploy a registered R model to an online (real time) endpoint](how-to-r-deploy-r-model.md) for the correct way to deploy. |



## Next steps

Learn more about R in Azure Machine Learning:

* [Interactive R development](how-to-r-interactive-development.md)
* [Adapt your R script to run in production](how-to-r-modify-script-for-production.md)
* [How to train R models in Azure Machine Learning](how-to-r-train-model.md)
* [How to deploy an R model to an online (real time) endpoint](how-to-r-deploy-r-model.md)
