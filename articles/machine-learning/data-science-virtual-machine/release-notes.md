---
title: What's new on the Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine
description: Release notes for the Azure Data Science Virtual Machine
author: jesscioffi
ms.service: data-science-vm
ms.custom: linux-related-content

ms.author: jcioffi
ms.reviewer: franksolomon
ms.date: 05/21/2024
ms.topic: reference
---

# Azure Data Science Virtual Machine release notes

This article describes Azure Data Science Virtual Machine releases. For a full list of included tools, along with version numbers, visit [this resource](./tools-included.md).

Because of rapidly evolving needs and packages updates, we target new releases of **Azure Data Science Virtual Machine for Windows** and **Ubuntu** images every month.

Azure portal users can find the latest image available for provisioning the Data Science Virtual Machine. For CLI or Azure Resource Manager (ARM) users, we keep images of individual versions available for 12 months. After that period, specific image versions are no longer available for provisioning.

Visit the [list of known issues](reference-known-issues.md) to learn about known bugs and workarounds.

## December 20, 2023
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `23.12.18`

Primary changes:

- `numpy` version `1.22.3`
- `pytz` version `2022.6`
- `torch` version `1.12.0`
- `certifi` version `2023.7.2`
- `azure-mgmt-network` to version `25.1.0`
- `scikit-learn` version `1.0.2`
- `scipy` version `1.9.2`
- `accuracy`
- `pickle5`
- `pillow` version `10.1.0`
- `experimental`
- `ipykernel` version `6.14.0`
- `en_core_web_sm`

## December 18, 2023

[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version `23.12.11`

Primary changes:

- SDK `1.54.0`
- numba
- Scipy
- `azure-core` to version `1.29.4`
- `azure-identity` to version `1.14.0`
- `azure-storage-queue` to version `12.7.2`

## December 5, 2023

The Data Science Virtual Machine (DSVM) offering for [Data Science VM – Windows 2022](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2022?tab=Overview) is now generally available in the marketplace.

Version `23.11.23`

Primary changes:

- SDK `1.54.0`
- numba
- Scipy
- `azure-core` to version `1.29.4`
- `azure-identity` to version `1.14.0`
- `azure-storage-queue` to version `12.7.2`

## July 26, 2023

A new Data Science Virtual Machine (DSVM) offering for [Data Science VM – Windows 2022 (Preview)](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/microsoft-dsvm.dsvm-win-2022?tab=Overview) is now live in the marketplace.

Version `23.06.25`

Primary changes:

- SDK `1.51.0`

## April 26, 2023
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `23.04.24`

Primary changes:

- SDK `1.50.0`
- Dotnet upgraded to `6.0` SDK
- PyTorch GPU functionality fixed in `azureml_py38_PT_and_TF environment.
- Blobfuse upgraded to blobfuse2

## April 4, 2023
[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `23.03.31`

Primary changes:

- SDK `1.49`
- Cuda drivers upgraded to `11.4`
- PyTorch GPU functionality fixed on `azureml_py38` and `azureml_py28_PT_and_TF` environments
- `Dotnet` upgraded to `6.0`

## January 10, 2023
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version: `23.01.06`

Primary changes:

- Added R package "ranger"
- Pinned `pandas==1.1.5` and `numpy==1.23.0` in `azureml_py38` environment

## November 30, 2022
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version: `22.11.25`

Primary changes:

- `Azure Machine Learning SDK V2` samples included
- `Ray` to version `2.0.0`
- Added `clock`, `recipes` `R` packages
- `azureml-core` to version `1.47.0`
- `azure-ai-ml` to version `1.1.1`

[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `22.11.27`

Primary changes:

- `Azure Machine Learning SDK V2` samples included
- `RScirpt` environment path alignment
- `Ray` version `2.0.0` package added to `azureml_py38` and `azureml_py38_PT_TF` environments.
- `azureml-core` to version `1.47.0`
- `azure-ai-ml` to version `1.1.1`

## September 20, 2022
**Announcement:**
Beginning October 1, 2022, the Ubuntu 18 Data Science Virtual Machine (DSVM) will **not be** available on the marketplace. We recommend that users switch to the Ubuntu 20 DSVM as we continue to ship updates/patches on our latest [Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Users who use the Azure Resource Manager (ARM) template/virtual machine scale, set to deploy the Ubuntu DSVM machines, should set the configuration to

| Offer | SKU |
| --------- | ------------|
| ubuntu-2004  | 2004 for Gen1 or 2004-gen2 for Gen2 VM sizes  |

instead of:

| Offer | SKU |
| --------- | ------------|
| ubuntu-1804  | 1804 for Gen1 or 1804-gen2 for Gen2 VM sizes  |

>[!Note]
There's no problem for existing customers who still use the Ubuntu-18 DSVM, as of our October 2022 update. However, the deprecation plan is scheduled for December 2022. We recommend that you switch to Ubuntu-20 DSVM at your earliest convenience.

## September 19, 2022
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.09.19`

Primary changes:

- `.NET Framework` to version `3.1.423`
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
[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version `22.09.06`

Primary changes:

- Base OS level image updates.

## August 16, 2022
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.08.11`

Primary changes:

- Jupyterlab upgraded to version `3.4.5`
- `matplotlib`, `azureml-mlflow` added to `sdkv2` environment.
- Jupyterhub spawner reconfigured to root environment.

## July 28, 2022
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.07.19`

Primary changes:

- Updated `Azure Cli` to version `2.38.0`
- Updated `Nodejs` to version `v16.16.0`
- Updated `Scala` to version `2.12.15`
- Updated `Spark` to version `3.2.2`
- `MMLSpark` notebook features `v0.10.0`
- 4 other R libraries:

    - [doParallel](https://cran.r-project.org/web/packages/doParallel/index.html)
    - [janitor](https://cran.r-project.org/web/packages/janitor/index.html)
    - [palmerpenguins](https://cran.r-project.org/web/packages/palmerpenguins/index.html)
    - [skimr](https://cran.r-project.org/web/packages/skimr/index.html#:~:text=CRAN%20-%20Package%20skimr%20skimr:%20Compact%20and%20Flexible%2cby%20the%20user%20as%20can%20the%20default%20formatting.)

- Added new Azure Machine Learning Environment `azureml_310_sdkv2`

[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version `22.07.18`

Primary changes:

- General OS level updates.

## July 11, 2022
[Data Science VM – Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview) [Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.07.08`

Primary changes:

- Minor bug fixes.

## June 28, 2022
[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.06.10`

[Data Science VM – Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Version `22.06.13`

Primary changes:

- Remove `Rstudio` software tool from Data Science Virtual Machine (DSVM) images.

## May 17, 2022
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.05.11`

Primary changes:

- Upgraded `log4j(v2)` to version `2.17.2`

## April 29, 2022
[Data Science VM – Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)
[Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview)

Version `22.04.27`

Primary changes:

- `Plotly` and `summarytools` R studio extensions runtime import fix.
- `Cudatoolkit` and `CUDNN` upgraded to `13.1` and `2.8.1` respectively.
- Fix `Python 3.8` - Azure Machine Learning notebook run, pinned `matplotlib` to `3.2.1` and `cycler` to `0.11.0` packages in `Azureml_py38` environment.

## April 26, 2022
[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `22.04.21`

Primary changes:

- `Plotly` R studio extension patch.
- Update `Rscript` env path to support latest R studio version `4.1.3`.

## April 14, 2022
A new Data Science Virtual Machine (DSVM) offering for [Data Science VM – Ubuntu 20.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-2004?tab=Overview) is currently live in the marketplace.

Version: `22.04.05`

## April 04, 2022
A new image for [Data Science VM – Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Version: `22.04.01`

Primary changes:

- Updated R environment - added these libraries:

  - `Cluster`
  - `Devtools Factoextra`
  - `GlueHere`
  - `Ottr`
  - `Paletteer`
  - `Patchwork`
  - `Plotly`
  - `Rmd2jupyter`
  - `Scales`
  - `Statip`
  - `Summarytools`
  - `Tidyverse`
  - `Tidymodels`
  - `Testthat`
- Further `Log4j` vulnerability mitigation - although not used, we moved all `log4j` to version `v2`, we removed old `log4j jars1.0`, and we moved `log4j` version 2.0 jars
- `Azure CLI` to version `2.33.1`
- Fixed `jupyterhub` access issue using public ip address
- Redesign of Conda environments - as we proceed with alignment and refinement of the Conda environments, we created:
  - `azureml_py38`: environment based on Python 3.8 with preinstalled [Azure Machine Learning SDK](/python/api/overview/azure/ml/?view=azure-ml-py&preserve-view=true) that also contains the [AutoML](../concept-automated-ml.md) environment
  - `azureml_py38_PT_TF`: an additional `azureml_py38` environment, preinstalled with latest `TensorFlow` and `PyTorch`
  - `py38_default`: default system environment based on `Python 3.8`
  - We removed the
    - `azureml_py36_tensorflow`
    - `azureml_py36_pytorch`
    - `py38_tensorflow`
    - `py38_pytorch`
    environments

## March 18, 2022
[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `22.03.09`

Primary changes:

- Updated R environment - added these libraries:

  - `Cluster`
  - `Devtools Factoextra`
  - `GlueHere`
  - `Ottr`
  - `Paletteer`
  - `Patchwork`
  - `Plotly`
  - `Rmd2jupyter`
  - `Scales`
  - `Statip`
  - `Summarytools`
  - `Tidyverse`
  - `Tidymodels`
  - `Testthat`
- Further `Log4j` vulnerability mitigation - although not used, we moved all `log4j` to version v2, we removed old log4j jars1.0, and we moved `log4j` version 2.0 jars.
- Azure CLI to version 2.33.1
- Redesign of Conda environments - as proceed with alignment and refinement of the Conda environments, we created:
  - `azureml_py38`: environment based on Python 3.8 with preinstalled [Azure Machine Learning SDK](/python/api/overview/azure/ml/?view=azure-ml-py&preserve-view=true) containing also [AutoML](../concept-automated-ml.md) environment
  - `azureml_py38_PT_TF`: complementary environment `azureml_py38` with preinstalled with latest TensorFlow and PyTorch
  - `py38_default`: default system environment based on Python 3.8
  - we removed `azureml_py36_tensorflow`, `azureml_py36_pytorch`, `py38_tensorflow` and `py38_pytorch` environments.

## March 9, 2022

[Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `21.12.03`

The Windows 2019 Data Science Virtual Machine (DSVM) is supported under publisher: microsoft-dsvm, offer ID: dsvm-win-2019, plan ID/SKU ID: winserver-2019

Users who use the Azure Resource Manager (ARM) template / virtual machine scale, set to deploy the Windows DSVM machines, should configure the SKU with `winserver-2019` instead of `server-2019`, since we continue to ship updates to Windows DSVM images on the new SKU from March  2022.

## December 3, 2021

A new image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `21.12.03`

Primary changes:

- Updated pytorch to version 1.10.0
- Updated tensorflow to version 2.7.0
- Fix for Azure Machine Learning SDK & AutoML environment
- Windows Security update
- Improvement of stability and minor bug fixes

## November 4, 2021

A new image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Version: `21.11.04`

Primary changes:
- Changed .NET Framework to version 3.1.414
- Changed Azcopy to version 10.13.0
- Changed Azure CLI to version 2.30.0
- Changed CUDA to version 11.5
- Changed Docker to version 20.10.10
- Changed Intellijidea to version 2021.2.3
- Changed NVIDIA Drivers to version 470.103.01
- Changed NVIDIA SMI to version 470.103.01
- Changed Nodejs to version v16.13.0
- Changed Pycharm to version 2021.2.3
- Changed VS Code to version 1.61.2
- Conda
  - *azureml_py36_automl*
    - Changed azureml-core to version 1.35.0
  - *py38_default*
    - Changed Jupyter Lab / jupyterlab to version 3.2.1
    - Changed Jupyter Notebook / notebook to version 6.4.5
    - Changed Jupyter Server / jupyter_server to version 1.11.2
    - Changed PyTorch Profiler TensorBoard Plugin / torch-tb-profiler to version 0.3.1
    - Changed azure-core to version 1.19.1
    - Changed matplotlib to version 3.4.3
    - Changed mkl to version 2021.4.0
    - Changed onnx to version 1.10.2
    - Changed opencv-python to version 4.5.4.58
    - Changed pandas to version 1.3.4
    - Changed pytorch to version 1.10.0
    - Changed scikit-learn to version 1.0.1
    - Changed tensorflow-gpu to version 2.6.2

## October 7, 2021

A new image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Version: `21.10.07`

Primary changes:
- Changed pytorch to version 1.9.1
- Changed Docker to version 20.10.9
- Changed Intellijidea to version 2021.2.2
- Changed Nodejs to version v14.18.0
- Changed Pycharm to version 2021.2.2
- Changed VS Code to version 1.60.2
- Fixed AutoML environment (azureml_py36_automl)
- Fixed Azure Storage Explorer stability
- Improvement of stability and minor bug fixes

## August 11, 2021

A new image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `21.08.11`

Primary changes:

- Windows Security update
- Update of Nvidia CuDNN to 8.1.0
- Update of Jupyter Lab -to 3.0.16
- Added MLFLow for experiment tracking
- Improvement of stability and minor bug fixes

## July 12, 2021

A new image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Primary changes:

- Updated to PyTorch 1.9.0
- Updated Azure CLI to 2.26.1
- Updated Azure CLI Azure Machine Learning extension to 1.29.0
- Update VS Code version 1.58.1
- Improvement of stability and minor bug fixes

## June 22, 2021

A new image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `21.06.22`

Primary changes:

- Updated to PyTorch 1.9.0
- Fixed a bug where git wasn't available

## June 1, 2021

A new image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Version: `21.06.01`

Primary changes:

- Docker is enabled by default
- JupyterHub uses JupyterLab by default
- Updated Python versions to fix [CVE-2020-15523](https://nvd.nist.gov/vuln/detail/CVE-2020-15523)
- Updated IntelliJ IDEA to version 2021.1 to fix [CVE-2021-25758](https://nvd.nist.gov/vuln/detail/CVE-2021-25758)
- Updated PyCharm Community to 2021.1
- Updated TensorFlow to version 2.5.0

Removed several icons from desktop.

## May 22, 2021

A new image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview)

Version: `21.05.22`

Selected version updates include:
- AzCopy 10.10.0
- Azure CLI 2.23.0
- Azure Data Studio 1.28.0
- CUDA 11.1
- Java 11
- Julia 1.0.5
- Jupyter Lab 2.2.6
- Microsoft Edge browser
- NodeJS 16.2.0
- Power BI Desktop 2.93.641.0 64-bit (May 2021)
- PyCharm Community Edition 2021.1.1
- Python 3.8
- PyTorch 1.8.1
- R 4.1.0
- RStudio 1.4.1106
- Spark 3.1.1
- Storage Explorer 1.19.1
- TensorFlow 2.5.0
- Visual Studio Code 1.56.2 incl. Azure Machine Learning extension
- Visual Studio Community Edition 2019 (version 16.9.6)

Removed Firefox, Apache Drill and Microsoft Integration Runtime.

Dark mode; changed icons on desktop; wallpaper background change.

## May 12, 2021

A new image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview)

Selected version updates include:
- azcopy 10.10
- Azure CLI 2.23.0
- Azure Data Studio 1.22.1
- Azure Storage Explorer 1.19.1
- CUDA 11.3, cuDNN 8, NCCL2
- dask 2021.01.0
- Java 11 (OpenJDK)
- Jupyter Lab 3.0.14
- Microsoft Edge browser (beta)
- Python 3.8
- PyTorch 1.8.1 incl. torchaudio torchtext torchvision, torch-tb-profiler
- R 4.0.5
- Spark 3.1 incl. mmlspark, connectors to Blob Storage, Data Lake, Azure Cosmos DB
- TensorFlow 2.4.1 incl. TensorBoard
- VS.Code 1.56

Added docker. To save resources, the docker service isn't started by default. To start the docker service, run this command at the command line:

```
sudo systemctl start docker
```

> [!NOTE]
> If your machine has GPU(s), you can make use of the GPU(s) inside the containers by adding a `--gpus`
> parameter to your docker command.
>
> For example, this command
>
> `sudo docker run --gpus all -it --rm -v local_dir:container_dir nvcr.io/nvidia/pytorch:18.04-py3`
>
> runs an Ubuntu 18.04 container with PyTorch pre-installed and all GPUs enabled. It also builds a local
> *local_dir* folder available in the container under *container_dir*.

## February 24, 2020

The Data Science Virtual Machine (DSVM) images for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/tidalmediainc.ubuntu-18-04?tab=Overview) and [Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview) images are now available.

## October 8, 2019

### Updates to software on the Windows DSVM

- Azure Storage Explorer 1.10.1
- Firefox 69.0.2
- Power BI Desktop 2.73.55xx
- PyCharm 19.2.3
- RStudio 1.2.50xx

### Default Browser for Windows updated

Earlier, the default browser was set to Internet Explorer. Users are now prompted to choose a default browser when they first sign in.
