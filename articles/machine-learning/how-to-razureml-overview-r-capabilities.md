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

There is not an Azure Machine Learning SDK for R.  In order to use R, you'll use a combination of R scripts and the Azure Machine Learning CLI v2.  

A typical workflow will be:

- Develop R scripts interactively using Jupyter Notebooks on a compute instance
    - Read tabular data from a registered data asset or datastore
    - Install additional R libraries
    - Save artifacts to the workspace file storage
- Adapt your interactive script to run as a production job in Azure Machine Learning
    - Remove any action that may require user interaction
    - Add command line input parameters to the script as necessary
    - Include and source the `azureml_utils.R` script in the same working directory of the R script to be executed.
    - Use `crate` to package the model.
    - Include the R/MLFlow functions in the script to **log** artifacts, models, parameters, and/or tags to the job on MLFlow.
- Build an environment and submit remote asynchronous R jobs (this happens via the CLI or Python SDK, not R)
- Log job artifacts, parameters, tags and models
- Register your model in the studio UI
- Deploy registered R models to managed online endpoints
- Use the deployed endpoints for real-time inferencing/scoring


## Known limitations
 
- There is no R _control-plane_ SDK, instead you use the Azure CLI or Python control script to submit jobs
- RStudio running as a custom application within a container on the compute instance cannot access workspace assets or MLFlow
- Zero code deployment (i.e. automatic deployment) of an R MLFlow model is currently not supported.  Instead, you'll need to use a custom container with `plumber` for deployment.
- Scoring using an R model with batch endpoints is not supported
- Programmatic model registering/recording from a running job with R is not supported
- Interactive querying of workspace MLFlow registry from R is not supported
- Parallel job step is not supported.  As a workaround, you can run a script in parallel `n` times using different input parameters.  But you'd have to meta-program to generate `n` YAML or CLI calls to do it.


## Next steps

Learn more about R in Azure Machine Learning:

* [Interactive R development](how-to-razureml-interactive-development.md)
* [Adapt your R script to run in production](how-to-razureml-modify-script-for-prod.md)
* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)
* [How to deploy an R model to an online (real time) endpoint](how-to-razureml-deploy-an-r-model.md)
