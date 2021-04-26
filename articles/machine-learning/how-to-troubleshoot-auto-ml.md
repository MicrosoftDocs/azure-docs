---
title: Troubleshoot automated ML experiments
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve issues in your automated machine learning experiments.
author: nibaccam
ms.author: nibaccam
ms.reviewer: nibaccam
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.date: 03/08/2021
ms.topic: troubleshooting
ms.custom: devx-track-python, automl, references_regions
---

# Troubleshoot automated ML experiments in Python

In this guide, learn how to identify and resolve known issues in your automated machine learning experiments with the [Azure Machine Learning SDK](/python/api/overview/azure/ml/intro).

## Version dependencies

**`AutoML` dependencies to newer package versions break compatibility**. After SDK version 1.13.0, models aren't loaded in older SDKs due to incompatibility between the older versions pinned in previous `AutoML` packages, and the newer versions pinned today.

Expect errors such as:

* Module not found errors such as,

  `No module named 'sklearn.decomposition._truncated_svd`

* Import errors such as,

  `ImportError: cannot import name 'RollingOriginValidator'`,
* Attribute errors such as,

  `AttributeError: 'SimpleImputer' object has no attribute 'add_indicator`

Resolutions depend on your `AutoML` SDK training version:

* If your `AutoML` SDK training version is greater than 1.13.0, you need `pandas == 0.25.1` and `scikit-learn==0.22.1`.

    * If there is a version mismatch, upgrade scikit-learn and/or pandas to correct version with the following,

      ```bash
          pip install --upgrade pandas==0.25.1
          pip install --upgrade scikit-learn==0.22.1
      ```

* If your `AutoML` SDK training version is less than or equal to 1.12.0, you need `pandas == 0.23.4` and `sckit-learn==0.20.3`.
  * If there is a version mismatch, downgrade scikit-learn and/or pandas to correct version with the following,
  
    ```bash
      pip install --upgrade pandas==0.23.4
      pip install --upgrade scikit-learn==0.20.3
    ```

## Setup

`AutoML` package changes since version 1.0.76 require the previous version to be uninstalled before updating to the new version.

* **`ImportError: cannot import name AutoMLConfig`**

    If you encounter this error after upgrading from an SDK version before v1.0.76 to v1.0.76 or later, resolve the error by running: `pip uninstall azureml-train automl` and then `pip install azureml-train-automl`. The automl_setup.cmd script does this automatically.

* **automl_setup fails**

  * On Windows, run automl_setup from an Anaconda Prompt. [Install Miniconda](https://docs.conda.io/en/latest/miniconda.html).

  * Ensure that conda 64-bit version  4.4.10 or later is installed. You can check the bit with the `conda info` command. The `platform` should be `win-64` for Windows or `osx-64` for Mac. To check the version use the command `conda -V`. If you have a previous version installed, you can update it by using the command: `conda update conda`. To check  32-bit by running 

  * Ensure that conda  is installed. 

  * Linux - `gcc: error trying to exec 'cc1plus'`

    1. If the `gcc: error trying to exec 'cc1plus': execvp: No such file or directory` error is encountered, install the GCC build tools for your Linux distribution. For example, on Ubuntu, use the command `sudo apt-get install build-essential`.

    1. Pass a new name as the first parameter to automl_setup to create a new conda environment. View existing conda environments using `conda env list` and remove them with `conda env remove -n <environmentname>`.

* **automl_setup_linux.sh fails**: If automl_setup_linus.sh fails on Ubuntu Linux with the error: `unable to execute 'gcc': No such file or directory`

  1. Make sure that outbound ports 53 and 80 are enabled. On an Azure virtual machine, you can do this from the Azure portal by selecting the VM and clicking on **Networking**.
  1. Run the command: `sudo apt-get update`
  1. Run the command: `sudo apt-get install build-essential --fix-missing`
  1. Run `automl_setup_linux.sh` again

* **configuration.ipynb fails**:

  * For local conda, first ensure that `automl_setup` has successfully run.
  * Ensure that the subscription_id is correct. Find the subscription_id in the Azure portal by selecting All Service and then Subscriptions. The characters "<" and ">" should not be included in the subscription_id value. For example, `subscription_id = "12345678-90ab-1234-5678-1234567890abcd"` has the valid format.
  * Ensure Contributor or Owner access to the subscription.
  * Check that the region is one of the supported regions: `eastus2`, `eastus`, `westcentralus`, `southeastasia`, `westeurope`, `australiaeast`, `westus2`, `southcentralus`.
  * Ensure access to the region using the Azure portal.
  
* **workspace.from_config fails**:

  If the call `ws = Workspace.from_config()` fails:

  1. Ensure that the configuration.ipynb notebook has run successfully.
  1. If the notebook is being run from a folder that is not under the folder where the `configuration.ipynb` was run, copy the folder aml_config and the file config.json that it contains to the new folder. Workspace.from_config reads the config.json for the notebook folder or its parent folder.
  1. If a new subscription, resource group, workspace, or region, is being used, make sure that you run the `configuration.ipynb` notebook again. Changing config.json directly will only work if the workspace already exists in the specified resource group under the specified subscription.
  1. If you want to change the region, change the workspace, resource group, or subscription. `Workspace.create` will not create or update a workspace if it already exists, even if the region specified is different.

## TensorFlow

As of version 1.5.0 of the SDK, automated machine learning does not install TensorFlow models by default. To install TensorFlow and use it with your automated ML experiments, install `tensorflow==1.12.0` via `CondaDependencies`.

```python
  from azureml.core.runconfig import RunConfiguration
  from azureml.core.conda_dependencies import CondaDependencies
  run_config = RunConfiguration()
  run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['tensorflow==1.12.0'])
```

## Numpy failures

* **`import numpy` fails in Windows**: Some Windows environments see an error loading numpy with the latest Python version 3.6.8. If you see this issue, try with Python version 3.6.7.

* **`import numpy` fails**: Check the TensorFlow version in the automated ml conda environment. Supported versions are < 1.13. Uninstall TensorFlow from the environment if version is >= 1.13.

You can check the version of TensorFlow and uninstall as follows:

  1. Start a command shell, activate conda environment where automated ml packages are installed.
  1. Enter `pip freeze` and look for `tensorflow`, if found, the version listed should be < 1.13
  1. If the listed version is not a supported version, `pip uninstall tensorflow` in the command shell and enter y for confirmation.

## `jwt.exceptions.DecodeError`

Exact error message: `jwt.exceptions.DecodeError: It is required that you pass in a value for the "algorithms" argument when calling decode()`.

For SDK versions <= 1.17.0, installation might result in an unsupported version of PyJWT. Check that the PyJWT version in the automated ml conda environment is a supported version. That is PyJWT version < 2.0.0.

You may check the version of PyJWT as follows:

1. Start a command shell and activate conda environment where automated ML packages are installed.

1. Enter `pip freeze` and look for `PyJWT`, if found, the version listed should be < 2.0.0

If the listed version is not a supported version:

1. Consider upgrading to the latest version of AutoML SDK: `pip install -U azureml-sdk[automl]`

1. If that is not viable, uninstall PyJWT from the environment and install the right version as follows:

    1. `pip uninstall PyJWT` in the command shell and enter `y` for confirmation.
    1. Install using `pip install 'PyJWT<2.0.0'`.
  
## Databricks
See [How to configure an automated ML experiment with Databricks](how-to-configure-databricks-automl-environment.md#troubleshooting).

## Forecasting R2 score is always zero

 This issue arises if the training data provided has time series that contains the same value for the last `n_cv_splits` + `forecasting_horizon` data points.

If this pattern is expected in your time series, you can switch your primary metric to **normalized root mean squared error**.

## Failed deployment

 For versions <= 1.18.0 of the SDK, the base image created for deployment may fail with the following error: `ImportError: cannot import name cached_property from werkzeug`.

  The following steps can work around the issue:

  1. Download the model package
  1. Unzip the package
  1. Deploy using the unzipped assets

## Azure Functions application
  
  Automated ML does not currently support Azure Functions applications. 

## Sample notebook failures

 If a sample notebook fails with an error that property, method, or library does not exist:

* Ensure that the correct kernel has been selected in the Jupyter Notebook. The kernel is displayed in the top right of the notebook page. The default is *azure_automl*. The kernel is saved as part of the notebook. If you switch to a new conda environment, you need to select the new kernel in the notebook.

  * For Azure Notebooks, it should be Python 3.6.
  * For local conda environments, it should be the conda environment name that you specified in automl_setup.

* To ensure the notebook is for the SDK version that you are using,
  * Check the SDK version by executing `azureml.core.VERSION` in a Jupyter Notebook cell.
  * You can download previous version of the sample notebooks from GitHub with these steps:
    1. Select the `Branch` button
    1. Navigate to the `Tags` tab
    1. Select the version

## Next steps

+ Learn more about [how to train a regression model with Automated machine learning](tutorial-auto-train-models.md) or [how to train using Automated machine learning on a remote resource](how-to-auto-train-remote.md).

+ Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).
