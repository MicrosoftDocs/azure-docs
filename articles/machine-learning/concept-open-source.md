---
title: Open source machine learning libraries
titleSuffix: Azure Machine Learning
description: Learn how you can use open source Python machine learning  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: luisquintanilla
ms.author: luquinta
ms.date: 06/18/2020
---

# Open Source

Azure Machine Learning supports many of the open-source Python machine learning libraries and platforms used throughout the machine learning lifecycle. Using tools like Jupyter notebooks and Visual Studio Code, you're able to bring your existing solutions and leverage Azure Machine Learning to train, deploy, and monitor your machine learning workflows.

## Training

The machine learning training process involves the application of algorithms to your data in order to achieve a task or solve a problem. For more information on the different kinds of machine learning, see the [deep learning vs machine learning article](./concept-deep-learning-vs-machine-learning.md).

For training tasks involving classical machine learning algorithms tasks such classification, clustering, and regression you might use something like Scikit-learn. To learn how to train a flower classification model, see the [how to train with Scikit-learn article](how-to-train-scikit-learn.md).

Some training tasks such as computer vision benefit from using a more specialized kind of machine learning algorithm known as neural networks. Neural networks are the predominant algorithm used for deep learning tasks. Some deep learning frameworks include:

- [PyTorch](https://github.com/pytorch/pytorch). PyTorch is an open-source machine learning framework based on the Torch library that makes it easy to build deep learning models. See the [how to train with PyTorch](how-to-train-pytorch.md) article to learn more.
- [TensorFlow](https://github.com/tensorflow/tensorflow). TensorFlow is an open-source machine learning framework for building deep learning models. See the [how to train with TensorFlow article](how-to-train-tensorflow.md) to learn more.
- [Keras](https://github.com/keras-team/keras). Keras is a high-level API built on top of TensorFlow that simplifies the composition of neural networks. To learn how to train a deep learning model using Keras, see the [Keras how-to training article](how-to-train-keras.md).

Another subset of artificial intelligence is reinforcement learning. Reinforcement learning trains using the concept of actions, states, and rewards. Reinforcement learning agents learn to take a set of predefined actions that maximize the specified rewards based on the current state of their environment. This iterative process is both time and resource intensive as agents try to learn what the optimal way of achieving a task is by using [Ray RLib](https://github.com/ray-project/ray). Ray RLib provides a set of features which . See the [how to train a reinforcement learning model](how-to-use-reinforcement-learning.md) article to learn more.

## Interpretability & Fairness

Machine learning systems are becoming more embedded into society. As such, it's important for these systems to be accountable for the predictions and recommendations they make.

- [InterpretML](https://github.com/interpretml/interpret/). InterpretML is an open-source library that leverages state of the art techniques to explain the behavior of machine learning models. To learn more about interpretability see the following articles:
    - [Model interpretability in Azure Machine Learning](how-to-machine-learning-interpretability.md)
    - [Interpret and explain machine learning models](how-to-machine-learning-interpretability-aml.md)
    - [Explain AutoML models](how-to-machine-learning-interpretability-automl.md)
- [FairLearn](https://github.com/fairlearn/fairlearn). Fairlearn is an open-source toolkit that allows users to assess and improve the fairness of their machine learning models. To learn more about model fairness, see the following articles:
    - [Mitigate fairness in machine leanring models](concept-fairness-ml.md)
    - [Use Azure Machine Lerning to assets model fairness](how-to-machine-learning-fairness-aml.md)

## Data security & privacy

Machine learning uses data to train and make predictions. With that in mind, it's important to makes sure that the data is secure and private. 

## Deployment

Once models are trained and ready for production, you have to choose how to deploy it. Azure Machine Learning provides various deployment targets. For more information, see the [where and how to deploy article](./how-to-deploy-and-where.md).

For web-based deployments, users can leverage technologies like Docker to deploy their models. Docker .



## Machine Learning Operations (MLOps)

Auditability and reproducibility are an important part of running experiments. Azure Machine Learning enables you to compose pipelines in GitHub Actions.

- [GitHub Actions](./how-to-github-actions-machine-learning.md)

## Monitoring

- [TensorBoard]()
- [MLFlow]()