---
title: What's new on the Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine 
description: Release notes for the Azure Data Science Virtual Machine
author: timoklimmer
ms.service: data-science-vm

ms.author: tklimmer
ms.date: 05/12/2021
ms.topic: reference
---

# Azure Data Science Virtual Machine release notes

In this article, learn about Azure Data Science Virtual Machine releases. For a full list of tools included, along with version numbers, check out [this page](./tools-included.md).

See the [list of known issues](reference-known-issues.md) to learn about known bugs and workarounds.

## 2021-05-12

New image for [Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview). 

**Ubuntu 18.04**

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
