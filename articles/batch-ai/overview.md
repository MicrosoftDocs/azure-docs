---
title: Azure Batch AI service - AI training | Microsoft Docs
description: Learn about using the managed Azure Batch AI service to train artificial intelligence (AI) and other machine learning models on clusters of GPUs and CPUs. 
services: batch-ai
documentationcenter: ''
author: alexsuttonms
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch-ai
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 08/01/2018
ms.author: danlep
#Customer intent: As a data scientist or AI researcher, I want to learn about Batch AI so that I can decide whether to try using it to train my machine learning or AI models in Azure.

---
# What is Azure Batch AI?

Azure Batch AI is a managed service to help data scientists and AI researchers train and test machine learning and AI models at scale in Azure - without having to manage complex infrastructure. Describe the compute resources, the jobs you want to run, where to store the model inputs and the outputs, and Batch AI takes care of the rest.

You can use Batch AI either standalone or to perform model training as part of a larger development workflow:

* Use Batch AI by itself to train, test, and batch score machine learning and AI models on clusters of [GPUs](../virtual-machines/linux/sizes-gpu.md) or CPUs. 

* Target a Batch AI cluster in a workflow with [Azure Machine Learning](../machine-learning/service/overview-what-is-azure-ml.md) or other [Azure AI Platform tools](https://azure.microsoft.com/overview/ai-platform/). Azure ML provides a rich experience for data preparation, experimentation, and job history. Azure ML can also package a trained model into a container, and deploy a model for inference or to IoT devices.  

## Train machine learning and AI models

Use Batch AI to train machine learning models as well as deep neural networks (deep learning) and other AI approaches. Batch AI has built-in support for popular open-source AI libraries and frameworks including [TensorFlow](https://github.com/tensorflow/tensorflow), [PyTorch](https://github.com/pytorch/pytorch), [Chainer](https://github.com/chainer/chainer), and [Microsoft Cognitive Toolkit (CNTK)](https://github.com/Microsoft/CNTK).

After you've identified your problem area and prepared your data, work interactively with Batch AI to test model ideas. Then when you’re ready to experiment at scale, start jobs across multiple GPUs with MPI or other communication libraries, and run more experiments in parallel.

Batch AI helps you train models at scale in several ways. For example: 

|  |  |
|---------|---------|
| **Distribute training**<br/>![Distributed training](./media/overview/distributed-training.png)  | Scale up training for a single job across many network-connected GPUs, to train larger networks with high volumes of data.|
| **Experiment**<br/>![Experimentation](./media/overview/experimentation.png) | Scale out training with multiple jobs. Run parameter sweeps to test out new ideas, or tune hyperparameters to optimize accuracy and performance. |
| **Execute in parallel**![Parallel execution](./media/overview/parallel-execution.png) | Train or score many models at a time, running in parallel across a fleet of servers to get the jobs done faster.|

When you've trained a model, use Batch AI to test the model if this wasn’t part of your training script, or perform batch scoring.

## How it works

Use Batch AI SDKs, command-line scripts, or the Azure portal to manage compute resources and schedule jobs for AI training and testing: 

* **Provision and scale clusters of VMs** - Choose the number of nodes (VMs), and select a GPU-enabled or other VM size that meets your training needs. Scale the number of nodes up or down automatically or manually so that you only use resources when needed. 

* **Manage dependencies and containers** - By default, Batch AI clusters run Linux VM images that have dependencies pre-installed to run container-based training frameworks either on GPUs or CPUs. For additional configuration, bring custom images or run start-up scripts.

* **Distribute data** - Choose one or several storage options to manage input data and scripts and job output: Azure Files, Azure Blob storage, or a managed NFS server. Batch AI also supports custom storage solutions including high-performance parallel file systems. Mount storage file systems to the cluster nodes and job containers using simple configuration files.

* **Schedule jobs** - Submit jobs to a priority-based job queue to share cluster resources and take advantage of low-priority VMs and reserved instances.

* **Handle failures** - Monitor job status and restart jobs in case of VM failures during potentially long-running jobs.

* **Gather results** - Easily access output logs, Stdout, Stderr, and trained models. Configure your Batch AI jobs to push output directly to mounted storage.

As an Azure service, Batch AI supports common tools such as role-based access control (RBAC) and Azure virtual networks for security.  

## Next steps

* Learn more about the [Batch AI resources](resource-concepts.md) for training a machine learning or AI model.

* Get started [training a sample deep learning model](quickstart-tensorflow-training-cli.md) with Batch AI.

* Check out sample [training recipes](https://github.com/Azure/BatchAI/blob/master/recipes) for popular AI frameworks.
