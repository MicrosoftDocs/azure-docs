---
title: Distributed training methods
titleSuffix: Azure Machine Learning
description:
services: machine-learning
ms.service: machine-learning
author: nibaccam
ms.author: nibaccam
ms.subservice: core
ms.topic: conceptual
ms.date: 03/24/2020
---

# Distributed training with Azure Machine Learning

## What is distributed training?

Distributed training refers to the ability to share data loads and training tasks across multiple GPUs to accelerate model training. The typical use case for distributed training is for training [deep learning](concept-deep-learning-vs-machine-learning.md) models. 

Deep neural networks are often compute intensive as they require large learning workloads in order to processing millions of examples and parameters across its multiple layers. This deep learning lends itself well to distributed training, since running tasks in parallel instead of serially saves time and compute resources.

## Distributed training in Azure Machine Learning

Azure Machine Learning supports distributed training via integrations with popular deep learning frameworks, PyTorch and TensorFlow.  Both PyTorch and TensorFlow employ [data parallelism](#data-parallelism) for distributed training, and leverage [Horovod](https://horovod.readthedocs.io/en/latest/summary_include.html) for optimizing compute speeds. 

* [Distributed training with PyTorch](how-to-train-tensorflow.md#distributed-training)

* [Distributed training with TensorFlow](how-to-train-pytorch.md#distributed-training)


For training traditional ML models, see [Azure Machine Learning SDK for Python](#python-sdk) for the different ways to train models using the Python SDK.

## Types of distributed training

There are two main types of distributed training: **data parallelism** and **model parallelism**.

### Data parallelism

In data parallelism, the data is divided into partitions, where the number of partitions is equal to the total number of available nodes,  in the compute cluster. The model is copied in each of these worker nodes, and each worker operates on its own subset of the data. Keep in mind that the model has to entirely fit on each node, that is each node has to have the capacity to support the model that's being trained.

Each node independently computes the errors between its predictions for its training samples and the labeled outputs. This means that the worker nodes need to synchronize the model parameters, or gradients, at the end of the batch computation to ensure they are training a consistent model. In turn, each node must communicate all of its changes to the other nodes to update all of the models.

### Model parallelism

In model parallelism, also known as network parallelism, the model is segmented into different parts that can run concurrently, and each one will run on the same data in different nodes. The scalability of this method depends on the degree of task parallelization of the algorithm, and it is more complex to implement than data parallelism. 

In model parallelism, worker nodes only need to synchronize the shared parameters, usually once for each forward or backward-propagation step. Also, larger models aren't a concern since each node operates on a subsection of the model on the same training data.

## Next steps

* Learn how to [Set up training environments](how-to-set-up-training-targets.md).

* Train ML models with TensorFlow(how-to-train-tensorflow.md)

* Train ML models with PyTorch(how-to-train-pytorch.md) 


