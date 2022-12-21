---
title: Overview of R capabilities in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn about the R capabilities in Azure Machine Learning'
ms.service: machine-learning
ms.date: 12/21/2022
ms.topic: conceptual
author: samuel100, wahalulu
ms.author: samkemp, mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Overview of R capabilities in Azure Machine Learning

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

There's no Azure Machine Learning SDK for R.  Instead, you'll use either the CLI or a Python control script to run your R scripts.  

This article outlines the key scenarios for R that are supported in Azure Machine Learning and known limitations.

A typical workflow for R in Azure Machine Learning is:

- [Develop R scripts interactively](how-to-razureml-interactive-development.md) using Jupyter Notebooks on a compute instance
    - Read tabular data from a registered data asset or datastore
    - Install additional R libraries
    - Save artifacts to the workspace file storage
- [Adapt your interactive script](how-to-razureml-modify-script-for-prod.md) to run as a production job in Azure Machine Learning
    - Remove any code that may require user interaction
    - Add command line input parameters to the script as necessary
    - Include and source the `azureml_utils.R` script in the same working directory of the R script to be executed
    - Use `crate` to package the model
    - Include the R/MLflow functions in the script to **log** artifacts, models, parameters, and/or tags to the job on MLflow.
- Build an environment and [submit remote asynchronous R jobs](how-to-razureml-train-model.md) (you submit jobs via the CLI or Python SDK, not R)
    - Log job artifacts, parameters, tags and models
- [Register your model](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-ui) using Azure Machine Learning studio
- [Deploy registered R models](how-to-razureml-deploy-r-model.md) to managed online endpoints
    - Use the deployed endpoints for real-time inferencing/scoring

## Known limitations
 
- There's no R _control-plane_ SDK, instead you use the Azure CLI or Python control script to submit jobs
- RStudio running as a custom application within a container on the compute instance can't access workspace assets or MLflow
- Zero code deployment (that is, automatic deployment) of an R MLflow model is currently not supported.  Instead, you'll need to use a custom container with `plumber` for deployment.
- Scoring using an R model with batch endpoints isn't supported
- Programmatic model registering/recording from a running job with R isn't supported
- Interactive querying of workspace MLflow registry from R isn't supported
- Parallel job step isn't supported.  As a workaround, you can run a script in parallel `n` times using different input parameters.  But you'd have to meta-program to generate `n` YAML or CLI calls to do it.


## Next steps

Learn more about R in Azure Machine Learning:

* [Interactive R development](how-to-razureml-interactive-development.md)
* [Adapt your R script to run in production](how-to-razureml-modify-script-for-prod.md)
* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)
* [How to deploy an R model to an online (real time) endpoint](how-to-razureml-deploy-an-r-model.md)
