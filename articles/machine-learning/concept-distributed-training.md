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
ms.date: 03/23/2020
---

# Distributed training with Azure Machine Learning

What is distributed training


Distributed training for machine learning models refers to the ability to scale trainign and share the load across multiple GPU or CPU nodes in parallel in order to facilitate and accelerate the training of machine learning models. 
Azure Machine learning is integrated with two common open source frameworks that support distributed training, PyTorch and Tensorflow. 

multiple GPUs on one machine

The different types of distributed

If you are looking to simply train your model without leveraging distributed training, see [Azure Machine Learning SDK for Python](#python-sdk) for the different ways to train models. 

When to use distributed training

Use distributed training when your data strains your single machine compute power. 
If your data is too large to store in your local RAM 
If your data loading becomes time consuming and cumbersome


What does Azure Machine Learning support
Azure Machine Learning offers estimators with PyTorch and Tensorflow which support distributed training

how-to-train-tensorflow.md#distributed-training
how-to-train-pytorch.md#distributed-training

## Next steps

Learn how to [Set up training environments](how-to-set-up-training-targets.md).
