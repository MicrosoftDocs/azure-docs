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

Many open-source Python machine learning libraries and platforms work with Azure Machine Learning in various stages of the project lifecycle. With development tools like Jupyter notebooks and Visual Studio Code, you can leverage existing models and scripts in Azure Machine Learning to train, deploy, and manage the end-to-end machine learning solution.

## Train open-source machine learning models

The machine learning training process involves the application of algorithms to your data in order to achieve a task or solve a problem. Depending on the problem, you may choose different algorithms that best fit the task and your data. For more information on the different branches of machine learning, see the [deep learning vs machine learning article](./concept-deep-learning-vs-machine-learning.md) and the [machine learning algorithm cheat sheet](algorithm-cheat-sheet.md).

For training tasks involving classical machine learning algorithms tasks such classification, clustering, and regression you might use something like Scikit-learn. To learn how to train a flower classification model, see the [how to train with Scikit-learn article](how-to-train-scikit-learn.md).

Some training tasks such as computer vision benefit from using a more specialized kind of machine learning algorithm known as neural networks. Neural networks are the predominant algorithm used for deep learning tasks. Some open source deep learning frameworks include [PyTorch](https://github.com/pytorch/pytorch), [TensorFlow](https://github.com/tensorflow/tensorflow), and [Keras](https://github.com/keras-team/keras). 

- [Train a deep learning image classification model using transfer learning in PyTorch](how-to-train-pytorch.md)
- [Recognize handwritten digits using TensorFlow](how-to-train-tensorflow.md)
- [Build a neural network to analyze images using Keras](how-to-train-keras.md)

Reinforcement learning is a subset of the overall artificial intelligence umbrella. Reinforcement learning trains using the concept of actions, states, and rewards. Reinforcement learning agents learn to take a set of predefined actions that maximize the specified rewards based on the current state of their environment. This iterative process is both time and resource intensive as agents try to learn what the optimal way of achieving a task is by using [Ray RLLib](https://github.com/ray-project/ray). Ray RLLib provides a set of features which allow for high scalability throughout the training process. It also natively supports deep learning frameworks like TensorFlow and PyTorch.  To learn how to use Ray RLLib with Azure Machine Learning, see the [how to train a reinforcement learning model](how-to-use-reinforcement-learning.md) article to learn more.

Training a single or multiple models requires the visualization and inspection of desired metrics to make sure the model performs as expected. You can [use TensorBoard in Azure Machine Learning to track and visualize experiment metrics](./how-to-monitor-tensorboard.md)

## Interpretability & Fairness

Machine learning systems are embedded in different areas of society such as education, reinforcement learning. As such, it's important for these systems to be accountable for the predictions and recommendations they make to prevent and mitigate their decisions from having unintended consequences. Azure Machine Learning builds upon the foundation of open-source frameworks like [InterpretML](https://github.com/interpretml/interpret/) and Fairlearn (https://github.com/fairlearn/fairlearn) to help build more transparent and equitable machine learning models. For more information on how to build fair and interpretable models, see the following articles:

- [Model interpretability in Azure Machine Learning](how-to-machine-learning-interpretability.md)
- [Interpret and explain machine learning models](how-to-machine-learning-interpretability-aml.md)
- [Explain AutoML models](how-to-machine-learning-interpretability-automl.md)
- [Mitigate fairness in machine learning models](concept-fairness-ml.md)
- [Use Azure Machine Learning to assets model fairness](how-to-machine-learning-fairness-aml.md)

## Data security & privacy

Machine learning uses data to train and make predictions. It's important to makes sure that the data is secure and private. There are several techniques you can leverage to this end. One technique is known as differential privacy. To learn more about differential privacy, see the article on [preserving data privacy](concept-differential-privacy.md). Using open-source differential privacy toolkits like [SmartNoise](https://github.com/opendifferentialprivacy/smartnoise-core-python), you can [preserve the privacy of the data you're working with](how-to-differential-privacy.md) in your Azure Machine Learning workflows.

## Deployment

Once models are trained and ready for production, you have to choose how to deploy it. Azure Machine Learning provides various deployment targets. For more information, see the [where and how to deploy article](./how-to-deploy-and-where.md).

Container technologies such as Docker are one way to deploy models as web services. Containers provide a platform and resource agnostic way to build and orchestrate reproducible software environments. With these core technologies, you can use [preconfigured environments](./how-to-use-environments.md), [preconfigured container images](./how-to-deploy-custom-docker-image.md) or custom ones to deploy your machine learning models to such as [Kubernetes clusters](./how-to-deploy-azure-kubernetes-service.md?tabs=python). For GPU intensive workflows, you can use tools like NVIDIA Triton Inference server to [make predictions using GPUs](how-to-deploy-with-triton.md?tabs=python).

Securing deployments is an important part of the process. To [deploy encrypted inferencing services](how-to-homomorphic-encryption-seal.md), use the `encrypted-inference` open-source Python library. The `encrypted inferencing` package provides bindings based on [Microsoft SEAL](https://github.com/Microsoft/SEAL), a homomorphic encryption library.

## Machine Learning Operations (MLOps)

Machine Learning Operations (MLOps), commonly thought of as DevOps for machine learning allows you to build more transparent, resilient, and reproducible machine learning workflows. See the [what is MLOps article](./concept-model-management-and-deployment.md) to learn more about MLOps. 

Using DevOps practices like continuous integration (CI) and continuous deployment (CD), you can automate the end-to-end machine learning lifecycle and capture governance data around it. You can define your [machine learning CI/CD pipeline in GitHub actions](./how-to-github-actions-machine-learning.md) to run Azure Machine Learning training and deployment tasks. 

Capturing software dependencies, metrics, metadata, data and model versioning are an important part of the MLOps process in order to build transparent, reproducible, and auditable pipelines. For this task, you can [use MLFlow in Azure Machine Learning](how-to-use-mlflow.md) as well as when [training machine learning models in Azure Databricks](./how-to-use-mlflow-azure-databricks.md).
