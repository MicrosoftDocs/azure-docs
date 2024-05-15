---
title: What is the Azure Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine
description: Overview of Azure Data Science Virtual Machine - An easy to use virtual machine on the Azure cloud platform with preinstalled and configured tools and libraries for doing data science.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: linux-related-content
author: jesscioffi
ms.author: jcioffi
ms.topic: overview
ms.reviewer: franksolomon
ms.date: 04/26/2024
---

# What is the Azure Data Science Virtual Machine for Linux and Windows?

The Data Science Virtual Machine (DSVM) is a customized VM image available on the Azure cloud platform, and it can handle data science. It has many popular data science tools preinstalled and preconfigured to jump-start building intelligent applications for advanced analytics.

The DSVM is available on:

+ Windows Server 2019
+ Windows Server 2022
+ Ubuntu 20.04 LTS

Additionally, we offer Azure DSVM for PyTorch - an Ubuntu 20.04 image from Azure Marketplace optimized for large, distributed deep learning workloads. This preinstalled DSVM comes validated with the latest PyTorch version, to reduce setup costs and accelerate time to value. It comes packaged with various optimization features:

- ONNX Runtime​
- DeepSpeed​
- MSCCL​
- ORTMoE​
- Fairscale​
- Nvidia Apex​
- An up-to-date stack with the latest compatible versions of Ubuntu, Python, PyTorch, and CUDA

## Comparison with Azure Machine Learning

The DSVM is a customized VM image for Data Science, but [Azure Machine Learning](../overview-what-is-azure-machine-learning.md) is an end-to-end platform that covers:

+ Fully Managed Compute
  + Compute Instances
  + Compute Clusters for distributed ML tasks
  + Inference Clusters for real-time scoring
+ Datastores (for example Blob, ADLS Gen2, SQL DB)
+ Experiment tracking
+ Model management
+ Notebooks
+ Environments (manage conda and R dependencies)
+ Labeling
+ Pipelines (automate End-to-End Data science workflows)

### Comparison with Azure Machine Learning Compute Instances

[Azure Machine Learning Compute Instances](../concept-compute-instance.md) are a fully configured and __managed__ VM image, while the DSVM is an __unmanaged__ VM.

Key differences between a DSVM and an Azure Machine Learning compute instance:

|Feature |Data Science<br>VM |Azure Machine Learning<br>Compute Instance  |
|---------|---------|---------|
| Fully Managed | No        | Yes        |
|Language Support     |  Python, R, Julia, SQL, C#,<br> Java, Node.js, F#       | Python and R        |
|Operating System     | Ubuntu<br>Windows         |    Ubuntu     |
|Pre-Configured GPU Option     |  Yes       |    Yes     |
|Scale up option | Yes | Yes |
|SSH Access    | Yes        |    Yes     |
|RDP Access    | Yes        |     No    |
|Built-in<br>Hosted Notebooks     |   No<br>(requires additional configuration)      |      Yes   |
|Built-in SSO     | No <br>(requires additional configuration)         |    Yes     |
|Built-in Collaboration     | No         | Yes        |
|Preinstalled Tools     |  Jupyter(lab), VS Code,<br> Visual Studio, PyCharm, Juno,<br>Power BI Desktop, SSMS, <br>Microsoft Office 365, Apache Drill       |     Jupyter(lab) |

## Sample DSVM customer use cases

### Short-term experimentation and evaluation

The DSVM can evaluate or learn new data science [tools](./tools-included.md). Try some of our published [samples and walkthroughs](./dsvm-samples-and-walkthroughs.md).

### Deep learning with GPUs

In the DSVM, your training models can use deep learning algorithms on graphics processing unit (GPU)-based hardware. If you take advantage of the VM scaling capabilities of the Azure platform, the DSVM helps you lever GPU-based hardware in the cloud, according to your needs. You can switch to a GPU-based VM when you train large models, or when you need high-speed computations while you keep the same OS disk. You can choose any of the N series GPU-enabled virtual machine SKUs with DSVM. Azure free accounts don't support GPU-enabled virtual machine SKUs.

A Windows-edition DSVM comes preinstalled with GPU drivers, frameworks, and GPU versions of deep learning frameworks. On the Linux editions, deep learning on GPUs is enabled on the Ubuntu DSVMs.

You can also deploy the Ubuntu or Windows DSVM editions to an Azure virtual machine that isn't based on GPUs. In this case, all the deep learning frameworks fall back to the CPU mode.

[Learn more about available deep learning and AI frameworks](dsvm-tools-deep-learning-frameworks.md).

### Data science training and education

Enterprise trainers and educators who teach data science classes usually provide a virtual machine image. The image ensures that students both have a consistent setup and that the samples work predictably.

The DSVM creates an on-demand environment with a consistent setup, to ease the support and incompatibility challenges. Cases where these environments need to be built frequently, especially for shorter training classes, benefit substantially.

## What does the DSVM include?

For more information, see this [full list of tools on both Windows and Linux DSVMs](tools-included.md).

## Next steps

For more information, visit these resources:

+ Windows:
  + [Set up a Windows DSVM](provision-vm.md)
  + [Data science on a Windows DSVM](vm-do-ten-things.md)

+ Linux:
  + [Set up a Linux DSVM (Ubuntu)](dsvm-ubuntu-intro.md)
  + [Data science on a Linux DSVM](linux-dsvm-walkthrough.md)