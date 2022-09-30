---
title: Compute instance image release notes
titleSuffix: Azure Machine Learning
description: Release notes for the Azure Machine Learning compute instance images
author: deeikele
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
ms.date: 9/30/2022
ms.topic: reference
---

# Azure Machine Learning compute instance image release notes

In this article, learn about Azure Machine Learning compute instance image releases. Azure Machine Learning maintains host operating system images for [Azure ML compute instance](/azure/machine-learning/concept-compute-instance) and [Data Science Virtual Machines](/azure/machine-learning/data-science-virtual-machine/release-notes). Due to the rapidly evolving needs and package updates, we target to release new images every month. Azure Machine Learning checks and validates any machine learning packages that may require an upgrade. 

Updates incorporate the latest OS-related patches from Canonical as the original Linux OS publisher. In addition to patches applied by the original publisher, Azure Machine Learning updates system packages when updates are available. For details on the patching process, see [Vulnerability Management](https://learn.microsoft.com/en-us/azure/machine-learning/concept-vulnerability-management).

Main updates provided with each image version are described in the below sections.

## September 19, 2022 
Version `22.09.19`

Main changes:

- `.Net Framework` to version `3.1.423`
- `Azure Cli` to version `2.40.0`
- `Intelijidea` to version `2022.2.2`
- Microsoft Edge Browser to version `107.0.1379.1`
- `Nodejs` to version `v16.17.0`
- `Pycharm` to version `2022.2.1`

Environment Specific Updates:

`azureml_py38`:
- `azureml-core` to version `1.45.0`

`py38_default`:
- `Jupyter Lab` to version `3.4.7`
- `azure-core` to version `1.25.1`
- `keras` to version `2.10.0`
- `tensorflow-gpu` to version `2.10.0`

## September 12, 2022 
Version `22.09.06`

Main changes:

- Base OS level image updates.


## August 16, 2022
Version `22.08.11`

Main changes:

- Jupyterlab upgraded to version `3.4.5`
- `matplotlib`, `azureml-mlflow` added to `sdkv2` environment.
- Jupyterhub spawner reconfigured to root environment.
