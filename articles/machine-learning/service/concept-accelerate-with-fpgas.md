---
title: Azure Machine Learning and FPGAs
description: Learn how to accelerate models and deep neural networks with FPGAs. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/23/2018

# What is an FPGA and what is it used for in Azure Machine learning?
---

# Real-time AI with FPGAs and Azure Machine Learning

Field programmable gate arrays (FPGA) are integrated circuits that can be reconfigured as needed. Project Brainwave is a hardware architecture that is deployed on FPGA. Brainwave is designed to make real-time AI calculations at competitive cost and with low latency. 

A preview of Project Brainwave integrated with Azure Machine Learning is currently available. And a limited preview is also available to bring Project Brainwave to the edge, so that you can take advantage of that computing speed in your own businesses and facilities.

## What is FPGA?

FPGAs provide ultra-low latency, and they are effective for scoring data at batch size one (there is no requirement for a large batch size).  They are cost-effective and available in Azure. It is easier to understand FPGA by comparing it with CPU, GPU, and ASIC:

![Azure Machine Learning FPGA comparison](./media/concept-accelerate-with-fpgas/azure-machine-learning-fpga-comparison.png)

- **Central processing unit (CPU)** is a general-purpose processor. CPU is designed to perform a number of operations. However the performance achieved is not ideal for graphics and video processing.

- **Graphics processing Unit (GPU)** is able to render images more quickly than a CPU because of its parallel processing architecture, which allows it to perform multiple calculations at the same time. GPU has become a popular choice for AI computation.

- **Application-Specific Integrated Circuit (ASIC)** is an integrated circuit customized for a particular use, rather than intended for general-purpose use. The logic is burned into silicon. Even though this chip provides the maximum efficiency, but it is not flexible. ASIC is used by Google.

- **FPGAs** contain an array of programmable logic blocks, and a hierarchy of reconfigurable interconnects that allow the blocks to be "wired together" in different configurations. FPGA is designed to be configured after manufacturing. The FPGA configuration is specified using a hardware description language (HDL). A typical FPGA may also have dedicated memory blocks, digital clock manager, IO banks and several other features, which vary across different vendors and models. FPGA provides a combination of programmability and performance. The power consumption is also much lower comparing to CPU/GPU.

FPGAs are now in every new Azure server. Microsoft is already using FPGAs for Bing search ranking, deep neural network (DNN) evaluation, and software defined networking (SDN) acceleration. Azure’s FPGA-based accelerated networking reduces inter-virtual machine latency by up to 10x while freeing CPUs for other tasks. 

## What is Project Brainwave?

Project Brainwave is a hardware architecture designed to accelerate real-time AI calculations. It is designed to take a trained neural network and run it as quickly as possible and with minimal latency. Project Brainwave can parallelize pre-trained DNNs across FPGAs to scale out your service. The FPGA-enabled architecture is economical and power-efficient, with a high throughput.

- Performance

    The use of FPGAs makes it possible to achieve low latency for inferencing requests. Batching means breaking up a request into smaller pieces and feeding them to a processor to improve hardware utilization. However, batching is not effective for real-time AI and can cause latency. Brainwave doesn't require batching. The latency in Brainwave is 10 times less comparing to CPU and GPU.

- Flexibility

    FPGAs can be reconfigured for different types of machine learning models – LSTMs, CNNs, GRUs, and so on. This flexibility makes it easier to accelerate the application based on the most optimal numerical precision and memory model being used. The reconfigurability is also a form of future-proofing, given that new machine learning techniques are being developed on a regular basis.

- Scale 

    Microsoft Azure is the world's largest cloud investment in FPGAs. You can run Brainwave on Azure's scale infrastructure.

- Low cost

    Currently it takes less than $0.20 for processing a million images using Brainwave.

## Where do I start? 

Azure Machine Learning Hardware Accelerated Models allow you to deploy trained Deep Neural Networks (DNN) models to FPGAs in the Azure cloud. To get started, see: 

- [Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)
- [Microsoft Azure Machine Learning Hardware Accelerated Models Powered by Project Brainwave](https://github.com/azure/aml-real-time-ai). 

## Next steps

[Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)

[Learn how to install the FPGA SDK](reference-fpga-package-overview.md)

[Hyperscale hardware: ML at scale on top of Azure + FPGA : Build 2018 (video)](https://www.youtube.com/watch?v=BMgQAHIx2eY)

[Inside the Microsoft FPGA-based configurable cloud (video)](https://channel9.msdn.com/Events/Build/2017/B8063)

[Microsoft unveils Project Brainwave for real-time AI](https://www.microsoft.com/research/blog/microsoft-unveils-project-brainwave/)