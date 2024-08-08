---
title: Compute instance image release notes
titleSuffix: Azure Machine Learning
description: Release notes for the Azure Machine Learning compute instance images
author: deeikele
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: core
ms.author: deeikele
ms.reviewer: fsolomon
ms.date: 07/03/2024
ms.topic: reference
---

# Azure Machine Learning compute instance image release notes

In this article, learn about Azure Machine Learning compute instance image releases. Azure Machine Learning maintains host operating system images for [Azure Machine Learning compute instance](./concept-compute-instance.md) and [Data Science Virtual Machines](./data-science-virtual-machine/release-notes.md). Due to the rapidly evolving needs and package updates, we target to release new images every month.

Azure Machine Learning checks and validates any machine learning packages that might require an upgrade. Updates incorporate the latest OS-related patches from Canonical as the original Linux OS publisher. In addition to patches applied by the original publisher, Azure Machine Learning updates system packages when updates are available. For details on the patching process, see [Vulnerability Management](./concept-vulnerability-management.md).

Main updates provided with each image version are described in the below sections.

## August 2, 2024

Image version: 24.07.01
 
Release Notes:
 
Ray: `2.31.0`

Nvidia-docker2

Tensorflow: `2.15.0`

Pandas: `1.3.5`

Libcurl: `8.4.0`

Libzmq5: `4.3.2-2ubuntu1`

Less: `551-1ubuntu0.3` 

Libgit2: `0.28.4+dfsg.1-2ubuntu0.1`

Klibc-utils: `2.0.7-1ubuntu5.2` 

Libklibc: `2.0.7-1ubuntu5.2`

Libc6: `2.31-0ubuntu9.16`

Linux-image-azure: `5.15.0.1045.52`

Bind9: `1:9.16.48-0ubuntu0`

Binutils: `2.34-6ubuntu1.9`

Binutils-multiarch: `2.34-6ubuntu1.9`

Libxml2: `2.9.10+dfsg-5ubuntu0`

Libuv1: `1.34.2-1ubuntu1.5`

Curl: `7.68.0-1ubuntu2.22`

Libcurl3-gnutls: `7.68.0-1ubuntu2.22`

Libcurl3-nss: `7.68.0-1ubuntu2.22`

Libcurl4: `7.68.0-1ubuntu2.22`

Util-linux: `2.34-0.1ubuntu9.6`

Libglib2.0-0: `2.64.6-1~ubuntu20.04.7`

Libglib2.0-bin: `2.64.6-1~ubuntu20.04.7`

Gstreamer1.0-plugins-base: `1.16.3-0ubuntu1.3`

Xserver-xorg-core: `2:1.20.13-1ubuntu1`

Xwayland: `2:1.20.13-1ubuntu1`

Libnss3: `2:3.98-0ubuntu0.20.04.2`

Accountsservice: `0.6.55-0ubuntu12`

Libaccountsservice0: `0.6.55-0ubuntu12`

Libssl1.1: `1.1.1f-1ubuntu2.22`

Libnode64: `10.19.0~dfsg-3ubuntu1.6`

Nodejs: `10.19.0~dfsg-3ubuntu1.6`

Libnss3: `2:3.98-0ubuntu0.20.04.2`

Libgnutls30: `3.6.13-2ubuntu1.11`

Cpio: `2.13+dfsg-2ubuntu0.4`

Libtss2-esys0: `2.3.2-1ubuntu0`

## July 3, 2024

Image Version: `24.06.10`
SDK Version: `1.56.0`

Issue fixed: Compute Instance 20.04 image build with SDK 1.56.0

Major: Image Version: `24.06.10`

SDK （azureml-core): `1.56.0`

Python: `3.9`

CUDA: `12.2`

CUDnn==`9.1.1`

Nvidia Driver: `535.171.04`

PyTorch: `1.13.1`

TensorFlow: `2.15.0`

autokeras==`1.0.16`

keras=`2.15.0`

ray==`2.2.0`

docker version==`24.0.9-1`

## February 16, 2024
Version: `24.01.30`

Main changes:

- Enable Tensorflow in GPU compute to detect GPU device.

Main environment specific updates:

- N/A

## June 30, 2023
Version: `23.06.30`

Main changes:

- `Azure Machine Learning SDK` to version `1.51.0`
- Purged vulnerable packages
- Fixed `libtinfo` error
- Fixed 'conda command not found' error

Main environment specific updates:

- `tensorflow` updated to `2.11.1` in `azureml_py38_PT_TF`
- `azure-keyvault-keys` updated to `4.8.0` in `azureml_py38`

## April 7, 2023
Version: `23.04.07`

Main changes:

- `Azure Machine Learning SDK` to version `1.49.0`
- `Certifi` updated to `2022.9.24`
- `.NET` updated from `3.1` (end-of-life) to `6.0`
- `Pyspark` update to `3.3.1` (mitigating log4j 1.2.17 and common-text-1.6 vulnerabilities)
- Default `intellisense` to Python `3.10` on the CI
- Bug fixes and stability improvements

Main environment specific updates:

- `Azureml_py38` environment is now the default.

## January 19, 2023
Version: `23.01.19`

Main changes:

- Added new conda environment `jupyter-env`
- Moved Jupyter service to new `jupyter-env` conda environment
- `Azure Machine Learning SDK` to version `1.48.0`

Main environment specific updates:

- Added `azureml-fsspec` package to `Azureml_py310_sdkv2`
- `CUDA` support resolved for `azureml_py38CUDA`
- `CUDA` support resolved for `azureml_py38_PT_TF`

## September 22, 2022
Version `22.09.22`

Main changes:

- `.NET Framework` to version `3.1.423`
- `Azure Cli` to version `2.40.0`
- `Conda` to version `4.14.0`
- `Azure Machine Learning SDK` to version `1.45.0`

Main environment specific updates:

`azureml_py38`:
- `azureml-core` to version `1.45.0`
- `tensorflow-gpu` to version `2.2.1`

## August 19, 2022
Version `22.08.19`

Main changes:
- Base OS level image updates.

## July 22, 2022
Version `22.07.22`

Main changes:
* `Azcopy` to version `10.16.0`
* `Blob Fuse` to version `1.4.4`
