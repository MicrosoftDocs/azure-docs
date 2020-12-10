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
ms.date: 12/10/2020
---

# Open Source

Azure Machine Learning supports many of the open-source Python machine learning libraries and platforms used throughout the machine learning lifecycle. Using tools like Jupyter notebooks and Visual Studio Code, you're able to bring your existing tools and leverage Azure Machine Learning to train, deploy, and monitor your machine learning workflows.

## Training

The machine learning training process involves the application of algorithms to your data in order to achieve a task or solve a problem. Depending on the problem, you may choose different algorithms that best fit the task and your data. For more information on the different disciplines of machine learning, see the [deep learning vs machine learning article](./concept-deep-learning-vs-machine-learning.md) and the [machine learning algorithm cheat sheet](algorithm-cheat-sheet.md).

For training tasks involving classical machine learning algorithms tasks such classification, clustering, and regression you might use something like Scikit-learn. To learn how to train a flower classification model, see the [how to train with Scikit-learn article](how-to-train-scikit-learn.md).

Some training tasks such as computer vision benefit from using a more specialized kind of machine learning algorithm known as neural networks. Neural networks are the predominant algorithm used for deep learning tasks. Some deep learning frameworks include [PyTorch](https://github.com/pytorch/pytorch), [TensorFlow](https://github.com/tensorflow/tensorflow) and [Keras](https://github.com/keras-team/keras). You can use those frameworks 

- [Train a deep learning image classification model using transfer learning in PyTorch](how-to-train-pytorch.md)
- [Recognize handwritten digits using TensorFlow](how-to-train-tensorflow.md)
- [Build a neural network to analyze images using Keras](how-to-train-keras.md)

Another subset of artificial intelligence is reinforcement learning. Reinforcement learning trains using the concept of actions, states, and rewards. Reinforcement learning agents learn to take a set of predefined actions that maximize the specified rewards based on the current state of their environment. This iterative process is both time and resource intensive as agents try to learn what the optimal way of achieving a task is by using [Ray RLib](https://github.com/ray-project/ray). Ray RLib provides a set of features which . See the [how to train a reinforcement learning model](how-to-use-reinforcement-learning.md) article to learn more.

## Interpretability & Fairness

Machine learning systems are embedded in different areas of society. As such, it's important for these systems to be accountable for the predictions and recommendations they make. Interpreting and understanding  Azure Machine Learning builds upon the foundation of open-source frameworks like [InterpretML](https://github.com/interpretml/interpret/) and Fairlearn (https://github.com/fairlearn/fairlearn) to For more information on how to build fair and interpretable models, see the following articles:

- [Model interpretability in Azure Machine Learning](how-to-machine-learning-interpretability.md)
- [Interpret and explain machine learning models](how-to-machine-learning-interpretability-aml.md)
- [Explain AutoML models](how-to-machine-learning-interpretability-automl.md)
- [Mitigate fairness in machine learning models](concept-fairness-ml.md)
- [Use Azure Machine Learning to assets model fairness](how-to-machine-learning-fairness-aml.md)

## Data security & privacy

Machine learning uses data to train and make predictions. It's important to makes sure that the data is secure and private. There are several techniques you can leverage to this end. One technique is known as differential privacy. Using open-source frameworks like Smartnoise, you can [preserve the privacy of the data you're working with](how-to-differential-privacy.md).  

## Deployment

Once models are trained and ready for production, you have to choose how to deploy it. Azure Machine Learning provides various deployment targets. For more information, see the [where and how to deploy article](./how-to-deploy-and-where.md).

Container technologies such as Docker are one way to deploy models as web services. Containers provide a platform and resource agnostic way to build and orchestrate reproducible software environments. With these core technologies, you can use [preconfigured environments](./how-to-use-environments.md), [preconfigured container images](./how-to-deploy-custom-docker-image.md) or custom ones to deploy your machine learning models to such as [Kubernetes clusters](./how-to-deploy-azure-kubernetes-service.md?tabs=python).

## Machine Learning Operations (MLOps)

Auditability and reproducibility are an important part of running experiments. Azure Machine Learning enables you to compose pipelines in GitHub Actions.

- [GitHub Actions](./how-to-github-actions-machine-learning.md)

## Monitoring

Comparable and measurable experiments provide the basis 


- [TensorBoard]()
- [MLFlow]()