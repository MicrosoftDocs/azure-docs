---
title: Open-source machine learning integration
titleSuffix: Azure Machine Learning
description: Learn how to use open-source Python machine learning frameworks to train, deploy, and manage end-to-end machine learning solutions in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: luisquintanilla
ms.author: luquinta
ms.date: 01/14/2020
---

# Open-source integration with Azure Machine Learning projects

You can train, deploy, and manage the end-to-end machine learning process in Azure Machine Learning by using open-source Python machine learning libraries and platforms.  Use development tools, like Jupyter Notebooks and Visual Studio Code, to leverage your existing models and scripts in Azure Machine Learning.  

In this article, learn more about these open-source libraries and platforms.

## Train open-source machine learning models

The machine learning training process involves the application of algorithms to your data in order to achieve a task or solve a problem. Depending on the problem, you may choose different algorithms that best fit the task and your data. For more information on the different branches of machine learning, see the [deep learning vs machine learning article](./concept-deep-learning-vs-machine-learning.md) and the [machine learning algorithm cheat sheet](algorithm-cheat-sheet.md).

### Preserve data privacy using differential privacy

To train a machine learning model, you need data. Sometimes that data is sensitive, and it's important to make sure that the data is secure and private. Differential privacy is a technique of preserving the confidentiality of information in a dataset. To learn more, see the article on [preserving data privacy](concept-differential-privacy.md). 

Open-source differential privacy toolkits like [SmartNoise](https://github.com/opendifferentialprivacy/smartnoise-core-python) help you [preserve the privacy of data](how-to-differential-privacy.md) in Azure Machine Learning solutions.

### Classical machine learning: scikit-learn

For training tasks involving classical machine learning algorithms tasks such classification, clustering, and regression you might use something like Scikit-learn. To learn how to train a flower classification model, see the [how to train with Scikit-learn article](how-to-train-scikit-learn.md).

### Neural networks: PyTorch, TensorFlow, Keras

Open-source machine learning algorithms known as neural networks, a subset of machine learning, are useful for training deep learning models in Azure Machine Learning.

Open-source deep learning frameworks and how-to guides include:

 *  [PyTorch](https://github.com/pytorch/pytorch): [Train a deep learning image classification model using transfer learning](how-to-train-pytorch.md) 
 *  [TensorFlow](https://github.com/tensorflow/tensorflow): [Recognize handwritten digits using TensorFlow](how-to-train-tensorflow.md)
 *  [Keras](https://github.com/keras-team/keras): [Build a neural network to analyze images using Keras](how-to-train-keras.md)

Training a deep learning model from scratch often requires large amounts of time, data, and compute resources. You can shortcut the training process by using transfer learning. Transfer learning is a technique that applies knowledge gained from solving one problem to a different but related problem. This means you can take an existing model repurpose it. See the [deep learning vs machine learning article](concept-deep-learning-vs-machine-learning.md#what-is-transfer-learning) to learn more about transfer learning.

### Reinforcement learning: Ray RLLib

Reinforcement learning is an artificial intelligence technique that trains models using actions, states, and rewards: Reinforcement learning agents learn to take a set of predefined actions that maximize the specified rewards based on the current state of their environment. 

The [Ray RLLib](https://github.com/ray-project/ray) project has a set of features that allow for high scalability throughout the training process. The iterative process is both time- and resource-intensive as reinforcement learning agents try to learn the optimal way of achieving a task.  Ray RLLib also natively supports deep learning frameworks like TensorFlow and PyTorch.  

To learn how to use Ray RLLib with Azure Machine Learning, see the [how to train a reinforcement learning model](how-to-use-reinforcement-learning.md).

### Monitor model performance: TensorBoard

Training a single or multiple models requires the visualization and inspection of desired metrics to make sure the model performs as expected. You can [use TensorBoard in Azure Machine Learning to track and visualize experiment metrics](./how-to-monitor-tensorboard.md)

### Frameworks for interpretable and fair models

Machine learning systems are used in different areas of society such as banking, education, and healthcare. As such, it's important for these systems to be accountable for the predictions and recommendations they make to prevent unintended consequences.

Open-source frameworks like [InterpretML](https://github.com/interpretml/interpret/) and Fairlearn (https://github.com/fairlearn/fairlearn) work with Azure Machine Learning to create more transparent and equitable machine learning models.

For more information on how to build fair and interpretable models, see the following articles:

- [Model interpretability in Azure Machine Learning](how-to-machine-learning-interpretability.md)
- [Interpret and explain machine learning models](how-to-machine-learning-interpretability-aml.md)
- [Explain AutoML models](how-to-machine-learning-interpretability-automl.md)
- [Mitigate fairness in machine learning models](concept-fairness-ml.md)
- [Use Azure Machine Learning to assets model fairness](how-to-machine-learning-fairness-aml.md)

## Model deployment

Once models are trained and ready for production, you have to choose how to deploy it. Azure Machine Learning provides various deployment targets. For more information, see the [where and how to deploy article](./how-to-deploy-and-where.md).

### Standardize model formats with ONNX

After training, the contents of the model such as learned parameters are serialized and saved to a file. Each framework has its own serialization format. When working with different frameworks and tools, it means you have to deploy models according to the framework's requirements. To standardize this process, you can use the Open Neural Network Exchange (ONNX) format. ONNX is an open-source format for artificial intelligence models. ONNX supports interoperability between frameworks. This means you can train a model in one of the many popular machine learning frameworks like PyTorch, convert it into ONNX format, and consume the ONNX model in a different framework like ML.NET.

For more information on ONNX and how to consume ONNX models, see the following articles:

- [Create and accelerate ML models with ONNX](concept-onnx.md)
- [Use ONNX models in .NET applications](how-to-use-automl-onnx-model-dotnet.md)

### Package and deploy models as containers

Container technologies such as Docker are one way to deploy models as web services. Containers provide a platform and resource agnostic way to build and orchestrate reproducible software environments. With these core technologies, you can use [preconfigured environments](./how-to-use-environments.md), [preconfigured container images](./how-to-deploy-custom-docker-image.md) or custom ones to deploy your machine learning models to such as [Kubernetes clusters](./how-to-deploy-azure-kubernetes-service.md?tabs=python). For GPU intensive workflows, you can use tools like NVIDIA Triton Inference server to [make predictions using GPUs](how-to-deploy-with-triton.md?tabs=python).

### Secure deployments with homomorphic encryption

Securing deployments is an important part of the deployment process. To [deploy encrypted inferencing services](how-to-homomorphic-encryption-seal.md), use the `encrypted-inference` open-source Python library. The `encrypted inferencing` package provides bindings based on [Microsoft SEAL](https://github.com/Microsoft/SEAL), a homomorphic encryption library.

## Machine Learning Operations (MLOps)

Machine Learning Operations (MLOps), commonly thought of as DevOps for machine learning allows you to build more transparent, resilient, and reproducible machine learning workflows. See the [what is MLOps article](./concept-model-management-and-deployment.md) to learn more about MLOps. 

Using DevOps practices like continuous integration (CI) and continuous deployment (CD), you can automate the end-to-end machine learning lifecycle and capture governance data around it. You can define your [machine learning CI/CD pipeline in GitHub actions](./how-to-github-actions-machine-learning.md) to run Azure Machine Learning training and deployment tasks. 

Capturing software dependencies, metrics, metadata, data and model versioning are an important part of the MLOps process in order to build transparent, reproducible, and auditable pipelines. For this task, you can [use MLFlow in Azure Machine Learning](how-to-use-mlflow.md) as well as when [training machine learning models in Azure Databricks](./how-to-use-mlflow-azure-databricks.md). You can also [deploy MLflow models as an Azure web service](how-to-deploy-mlflow-models.md). 
