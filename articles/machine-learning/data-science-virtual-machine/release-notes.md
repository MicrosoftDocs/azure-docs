---
title: What's new on the Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine 
description: Release notes for the Azure Data Science Virtual Machine
author: michalmar
ms.service: data-science-vm

ms.author: mimarusa
ms.date: 07/16/2021
ms.topic: reference
---

# Azure Data Science Virtual Machine release notes

In this article, learn about Azure Data Science Virtual Machine releases. For a full list of tools included, along with version numbers, check out [this page](./tools-included.md).

See the [list of known issues](reference-known-issues.md) to learn about known bugs and workarounds.

## 2021-07-12

New image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview).

Main changes:

- Updated to PyTorch 1.9.0
- Updated Azure CLI to 2.26.1
- Updated Azure CLI Azure Machine Learnign extension to 1.29.0
- Update VS Code version 1.58.1
- Improvement of stability and minor bug fixes 


## 2021-06-22

New image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview).

Version: 21.06.22

Main changes:

- Updated to PyTorch 1.9.0
- Fixed a bug where git was not available


## 2021-06-01

New image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview).

Version: 21.06.01

Main changes are:

- Docker is enabled by default
- JupyterHub is using JupyterLab by default
- Updated Python versions to fix [CVE-2020-15523](https://nvd.nist.gov/vuln/detail/CVE-2020-15523)
- Updated IntelliJ IDEA to version 2021.1 to fix [CVE-2021-25758](https://nvd.nist.gov/vuln/detail/CVE-2021-25758)
- Updated PyCharm Community to 2021.1
- Updated TensorFlow to version 2.5.0

<br/>
Removed several icons from desktop.

## 2021-05-22

New image for [Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview).

Version: 21.05.22

Selected version updates are:
- CUDA 11.1
- Python 3.8
- PyTorch 1.8.1
- TensorFlow 2.5.0
- Spark 3.1.1
- Java 11
- R 4.1.0
- Julia 1.0.5
- NodeJS 16.2.0
- Visual Studio Code 1.56.2 incl. Azure ML extension
- PyCharm Community Edition 2021.1.1
- Jupyter Lab 2.2.6
- RStudio 1.4.1106
- Visual Studio Community Edition 2019 (version 16.9.6)
- Azure CLI 2.23.0
- Storage Explorer 1.19.1
- AzCopy 10.10.0
- Power BI Desktop 2.93.641.0 64-bit (May 2021)
- Azure Data Studio 1.28.0
- Microsoft Edge browser

<br/>
Removed Firefox, Apache Drill and Microsoft Integration Runtime.

<br/>
Dark mode, changed icons on desktop, wallpaper background change.

## 2021-05-12

New image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview).

Selected version updates are:
- CUDA 11.3, cuDNN 8, NCCL2
- Python 3.8
- R 4.0.5
- Spark 3.1 incl. mmlspark, connectors to Blob Storage, Data Lake, CosmosDB
- Java 11 (OpenJDK)
- Jupyter Lab 3.0.14
- PyTorch 1.8.1 incl. torchaudio torchtext torchvision, torch-tb-profiler
- TensorFlow 2.4.1 incl. TensorBoard
- dask 2021.01.0
- VS.Code 1.56
- Azure Data Studio 1.22.1
- Azure CLI 2.23.0
- Azure Storage Explorer 1.19.1
- azcopy 10.10
- Microsoft Edge browser (beta)

<br/>
Added docker. To save resources, the docker service is not started by default. To start the docker service, run the
following command-line commands:

```
sudo systemctl start docker
```

> [!NOTE]
> If your machine has GPU(s), you can make use of the GPU(s) inside the containers by adding a `--gpus`
> parameter to your docker command.
>
> For example, running
>
> `sudo docker run --gpus all -it --rm -v local_dir:container_dir nvcr.io/nvidia/pytorch:18.04-py3`
>
> will run an Ubuntu 18.04 container with PyTorch pre-installed and all GPUs enabled. It will also make a local folder
> *local_dir* available in the container under *container_dir*.
>


## 2020-02-24

Data Science Virtual Machine images for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview) and [Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview) images are now available.

## 2019-10-08

### Updates to software on the Windows DSVM

- Azure Storage Explorer 1.10.1
- Power BI Desktop 2.73.55xx
- Firefox 69.0.2
- PyCharm 19.2.3
- RStudio 1.2.50xx

### Default Browser for Windows updated

Earlier, the default browser was set to Internet Explorer. Users are now prompted to choose a default browser when they first log in.
