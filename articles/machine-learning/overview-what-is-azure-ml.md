---
title: What is Azure Machine Learning
description: Azure Machine Learning is an integrated data science solution for data scientists and MLops to model and deploy ML applications at cloud scale.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
ms.author: larryfr
author: BlackMist
ms.date: 04/08/2021
ms.custom: devx-track-python
adobe-target: true
---

# What is Azure Machine Learning?

In this article, you learn about Azure Machine Learning, a cloud-based environment you can use to train, deploy, automate, manage, and track ML models. 

Azure Machine Learning can be used for any kind of machine learning, from classical ml to deep learning, supervised, and unsupervised learning. Whether you prefer to write Python or R code with the SDK or work with no-code/low-code options in [the studio](#build-ml-models-in-the-studio), you can build, train, and track machine learning and deep-learning models in an Azure Machine Learning Workspace. 

Start training on your local machine and then scale out to the cloud. 

The service also interoperates with popular deep learning and reinforcement open-source tools such as PyTorch, TensorFlow, scikit-learn, and Ray RLlib. 

> [!Tip]
> **Free trial!**  If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today. You get credits to spend on Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged.


## What is machine learning?

Machine learning is a data science technique that allows computers to use existing data to forecast future behaviors, outcomes, and trends. By using machine learning, computers learn without being explicitly programmed.

Forecasts or predictions from machine learning can make apps and devices smarter. For example, when you shop online, machine learning helps recommend other products you might want based on what you've bought. Or when your credit card is swiped, machine learning compares the transaction to a database of transactions and helps detect fraud. And when your robot vacuum cleaner vacuums a room, machine learning helps it decide whether the job is done.

## Machine learning tools to fit each task 

Azure Machine Learning provides all the tools developers and data scientists need for their machine learning workflows, including:
+ The [Azure Machine Learning designer](tutorial-designer-automobile-price-train-score.md): drag-n-drop modules to build your experiments and then deploy pipelines in a low-code environment.

+ Jupyter notebooks: use our [example notebooks](https://github.com/Azure/MachineLearningNotebooks) or create your own notebooks to leverage our <a href="/python/api/overview/azure/ml/intro" target="_blank">SDK for Python</a> samples for your machine learning. 

+ R scripts or notebooks in which you use the <a href="https://azure.github.io/azureml-sdk-for-r/reference/index.html" target="_blank">SDK for R</a> to write your own code, or use the R modules in the designer.

+ The [Many Models Solution Accelerator](https://aka.ms/many-models) (preview) builds on Azure Machine Learning and enables you to train, operate, and manage hundreds or even thousands of machine learning models.

+ [Machine learning extension for Visual Studio Code (preview)](how-to-set-up-vs-code-remote.md) provides you with a full-featured development environment for building and managing your machine learning projects.

+ [Machine learning CLI](reference-azure-machine-learning-cli.md) is an Azure CLI extension that provides commands for managing with Azure Machine Learning resources from the command line.

+ [Integration with open-source frameworks](concept-open-source.md) such as PyTorch, TensorFlow, and scikit-learn and many more for training, deploying, and managing the end-to-end machine learning process.

+ [Reinforcement learning](how-to-use-reinforcement-learning.md) with Ray RLlib

You can even use [MLflow to track metrics and deploy models](how-to-use-mlflow.md) or Kubeflow to [build end-to-end workflow pipelines](https://www.kubeflow.org/docs/azure/).

## Build ML models in Python or R

Start training on your local machine using the Azure Machine Learning <a href="/python/api/overview/azure/ml/intro" target="_blank">Python SDK</a> or <a href="https://azure.github.io/azureml-sdk-for-r/reference/index.html" target="_blank">R SDK</a>. Then, you can scale out to the cloud. 

With many available [compute targets](how-to-create-attach-compute-studio.md), like Azure Machine Learning Compute and [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks), and with [advanced hyperparameter tuning services](how-to-tune-hyperparameters.md), you can build better models faster by using the power of the cloud.

You can also [automate model training and tuning](tutorial-auto-train-models.md) using the SDK.

## Build ML models in the studio

[Azure Machine Learning studio](https://studio.azureml.net) is a web portal in Azure Machine Learning for low-code and no-code options for model training, deployment, and asset management. The studio integrates with the Azure Machine Learning SDK for a seamless experience. For more information, see [What is Azure Machine Learning studio](overview-what-is-machine-learning-studio.md).

+ **Azure Machine Learning designer**

  Use [the designer](concept-designer.md) to train and deploy machine learning models without writing any code. Try the [designer tutorial](tutorial-designer-automobile-price-train-score.md) to get started. 

  ![Animated gif of the drag-and-drop interface of Azure Machine Learning designer](media/concept-designer/designer-drag-and-drop.gif)

+ **Track experiments**

  Learn how to [track and visualize data science experiments](how-to-track-monitor-analyze-runs.md) in the studio. 

    :::image type="content" source="media/how-to-track-monitor-analyze-runs/run-history.png" alt-text="Run details in Azure Machine Learning studio":::


+ **And much more...**

  Visit Azure Machine Learning studio at [ml.azure.com](https://studio.azureml.net).


## MLOps: Deploy & lifecycle management
When you have the right model, you can easily use it in a web service, on an IoT device, or from Power BI. For more information, see the article on [how to deploy and where](how-to-deploy-and-where.md).

Then you can manage your deployed models by using the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/), [Azure Machine Learning studio](https://ml.azure.com), or the [machine learning CLI](reference-azure-machine-learning-cli.md).

These models can be consumed and return predictions in [real time](how-to-consume-web-service.md) or [asynchronously](./tutorial-pipeline-batch-scoring-classification.md) on large quantities of data.

And with advanced [machine learning pipelines](concept-ml-pipelines.md), you can collaborate on each step from data preparation, model training and evaluation, through deployment. Pipelines allow you to:

* Automate the end-to-end machine learning process in the cloud
* Reuse components and only rerun steps when needed
* Use different compute resources in each step
* Run batch scoring tasks

If you want to use scripts to automate your machine learning workflow, the [machine learning CLI](reference-azure-machine-learning-cli.md) provides command-line tools that perform common tasks, such as submitting a training run or deploying a model.

To get started using Azure Machine Learning, see [Next steps](#next-steps).

## Integration with other services

Azure Machine Learning works with other services on the Azure platform, and also integrates with open source tools such as Git and MLFlow.

+ Compute targets such as __Azure Kubernetes Service__, __Azure Container Instances__, __Azure Databricks__, __Azure Data Lake Analytics__, and __Azure HDInsight__. For more information on compute targets, see [What are compute targets?](concept-compute-target.md).
+ __Azure Event Grid__. For more information, see [Consume Azure Machine Learning events](./how-to-use-event-grid.md).
+ __Azure Monitor__. For more information, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).
+ Data stores such as __Azure Storage accounts__, __Azure Data Lake Storage__, __Azure SQL Database__, __Azure Database for PostgreSQL__, and __Azure Open Datasets__. For more information, see [Access data in Azure storage services](how-to-access-data.md) and [Create datasets with Azure Open Datasets](how-to-create-register-datasets.md).
+ __Azure Virtual Networks__. For more information, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md).
+ __Azure Pipelines__. For more information, see [Train and deploy machine learning models](/azure/devops/pipelines/targets/azure-machine-learning).
+ __Git repository logs__. For more information, see [Git integration](concept-train-model-git-integration.md).
+ __MLFlow__. For more information, see [MLflow to track metrics](how-to-use-mlflow.md)  and [Deploy Mlflow models as a web service](how-to-deploy-mlflow-models.md) 
+ __Kubeflow__. For more information, see [build end-to-end workflow pipelines](https://www.kubeflow.org/docs/azure/).

### Secure communications

Your Azure Storage account, compute targets, and other resources can be used securely inside a virtual network to train models and perform inference. For more information, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md).

## Next steps

- Create your first experiment with your preferred method:
- + [Get started in your own development environment](tutorial-1st-experiment-sdk-setup-local.md)
  + [Use Jupyter notebooks on a compute instance to train & deploy ML models](tutorial-1st-experiment-sdk-setup.md)
  + [Use automated machine learning to train & deploy ML models](tutorial-first-experiment-automated-ml.md) 
  + [Manage resources in Visual Studio Code](how-to-manage-resources-vscode.md)
  + [Use Visual Studio Code to train and deploy an image classification model](tutorial-train-deploy-image-classification-model-vscode.md)
  + [Use the designer's drag & drop capabilities to train & deploy](tutorial-designer-automobile-price-train-score.md) 
  + [Use the machine learning CLI to train and deploy a model](tutorial-train-deploy-model-cli.md)

- Learn about [machine learning pipelines](concept-ml-pipelines.md) to build, optimize, and manage your machine learning scenarios.

- Read the in-depth [Azure Machine Learning architecture and concepts](concept-azure-machine-learning-architecture.md) article.
