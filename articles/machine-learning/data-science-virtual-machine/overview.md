---
title: What is the Azure Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine 
description: Overview of Azure Data Science Virtual Machine - An easy to use virtual machine on the Azure cloud platform with preinstalled and configured tools and libraries for doing data science.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-linux
author: jesscioffi
ms.author: jcioffi
ms.reviewer: mattmcinnes
ms.topic: overview
ms.date: 06/23/2022
---

# What is the Azure Data Science Virtual Machine for Linux and Windows?

The Data Science Virtual Machine (DSVM) is a customized VM image on the Azure cloud platform built specifically for doing data science. It has many popular data science tools preinstalled and preconfigured to jump-start building intelligent applications for advanced analytics.

The DSVM is available on:

+ Windows Server 2019
+ Windows Server 2022
+ Ubuntu 20.04 LTS

Additionally, we're excited to offer Azure DSVM for PyTorch, which is an Ubuntu 20.04 image from Azure Marketplace that is optimized for large, distributed deep learning workloads. It comes preinstalled and validated with the latest PyTorch version to reduce setup costs and accelerate time to value. It comes packaged with various optimization functionalities (ONNX Runtime​, DeepSpeed​, MSCCL​, ORTMoE​, Fairscale​, Nvidia Apex​), and an up-to-date stack with the latest compatible versions of Ubuntu, Python, PyTorch, CUDA.

## Comparison with Azure Machine Learning

The DSVM is a customized VM image for Data Science but [Azure Machine Learning](../overview-what-is-azure-machine-learning.md) is an end-to-end platform that encompasses:

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

[Azure Machine Learning Compute Instances](../concept-compute-instance.md) are a fully configured and __managed__ VM image whereas the DSVM is an __unmanaged__ VM.

Key differences between these:

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

## Sample use cases

Here's some common use cases for DSVM customers.

### Short-term experimentation and evaluation

You can use the DSVM to evaluate or learn new data science [tools](./tools-included.md), especially by going through some of our published [samples and walkthroughs](./dsvm-samples-and-walkthroughs.md).

### Deep learning with GPUs

In the DSVM, your training models can use deep learning algorithms on hardware that's based on graphics processing units (GPUs). By taking advantage of the VM scaling capabilities of the Azure platform, the DSVM helps you use GPU-based hardware in the cloud according to your needs. You can switch to a GPU-based VM when you're training large models, or when you need high-speed computations while keeping the same OS disk. You can choose any of the N series GPUs enabled virtual machine SKUs with DSVM. Note GPU enabled virtual machine SKUs aren't supported on Azure free accounts.

The Windows editions of the DSVM come preinstalled with GPU drivers, frameworks, and GPU versions of deep learning frameworks. On the Linux editions, deep learning on GPUs is enabled on the Ubuntu DSVMs. 

You can also deploy the Ubuntu or Windows editions of the DSVM to an Azure virtual machine that isn't based on GPUs. In this case, all the deep learning frameworks falls back to the CPU mode.

[Learn more about available deep learning and AI frameworks](dsvm-tools-deep-learning-frameworks.md).

### Data science training and education

Enterprise trainers and educators who teach data science classes usually provide a virtual machine image. The image ensures students have a consistent setup and that the samples work predictably.

The DSVM creates an on-demand environment with a consistent setup that eases the support and incompatibility challenges. Cases where these environments need to be built frequently, especially for shorter training classes, benefit substantially.


## What's included on the DSVM?

See a full list of tools on both the Windows and Linux DSVMs [here](tools-included.md).

## Next steps

Learn more with these articles:

+ Windows:
  + [Set up a Windows DSVM](provision-vm.md)
  + [Data science on a Windows DSVM](vm-do-ten-things.md)

+ Linux:
  + [Set up a Linux DSVM (Ubuntu)](dsvm-ubuntu-intro.md)
  + [Data science on a Linux DSVM](linux-dsvm-walkthrough.md)
