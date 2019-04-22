---
title: What is 
titleSuffix: Azure Machine Learning service
description: Overview of Azure Machine Learning service - An integrated, end-to-end data science solution for professional data scientists to develop, experiment, and deploy advanced analytics applications at cloud scale.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 05/02/2019
ms.custom: seodec18
---

# What is Azure Machine Learning service?

Azure Machine Learning service is a cloud service that you use to train, deploy, automate, and manage machine learning models, all at the broad scale that the cloud provides.

## What is machine learning?

Machine learning is a data science technique that allows computers to use existing data to forecast future behaviors, outcomes, and trends. By using machine learning, computers learn without being explicitly programmed.

Forecasts or predictions from machine learning can make apps and devices smarter. For example, when you shop online, machine learning helps recommend other products you might want based on what you've bought. Or when your credit card is swiped, machine learning compares the transaction to a database of transactions and helps detect fraud. And when your robot vacuum cleaner vacuums a room, machine learning helps it decide whether the job is done.

## What is Azure Machine Learning service?

Azure Machine Learning service provides a cloud-based environment you can use to prep data, train, test, deploy, manage, and track machine learning models.

[![Azure Machine Learning service workflow](./media/overview-what-is-azure-ml/aml.png)](./media/overview-what-is-azure-ml/aml.png#lightbox)

The service fully supports open-source technologies such as PyTorch, TensorFlow, and scikit-learn.

Support for a visual interface (preview) and rich tools makes it easy to interactively explore and prepare data and then develop and test models. Examples are the visual interface in which you can drag-n-drop modules to build your experiments, and  [Jupyter notebooks](https://jupyter.org) or the [Azure Machine Learning for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai#overview) extension.

You can also [automate model generation and tuning](tutorial-auto-train-models.md) with ease, efficiency, and accuracy with Azure Machine Learning service.

Start training on your local machine and then scale out to the cloud. With many available [compute targets](how-to-set-up-training-targets.md), like Azure Machine Learning Compute and [Azure Databricks](/azure/azure-databricks/what-is-azure-databricks), and with [advanced hyperparameter tuning services](how-to-tune-hyperparameters.md), you can build better models faster by using the power of the cloud.

When you have the right model, you can easily deploy it in a container such as Docker. So it's simple to deploy to Azure Container Instances or Azure Kubernetes Service. Or you can use the container in your own deployments, either on-premises or in the cloud. For more information, see the article on [how to deploy and where](how-to-deploy-and-where.md).

Whether you write code or use the visual interface, you can manage the deployed models and track multiple runs as you experiment to find the best solution.

After it's deployed, your model can return predictions in [real time](how-to-consume-web-service.md) or [asynchronously](how-to-run-batch-predictions.md) on large quantities of data.

And with advanced [machine learning pipelines](concept-ml-pipelines.md), you can collaborate on all the steps of data preparation, model training and evaluation, and deployment.

## What can I do with Azure Machine Learning service?

Using the <a href="https://aka.ms/aml-sdk" target="_blank">main Python SDK</a> and the <a href="https://aka.ms/data-prep-sdk" target="_blank">Data Prep SDK</a> for Azure Machine Learning as well as open-source Python packages, you can build and train highly accurate machine learning and deep-learning models yourself in an Azure Machine Learning service Workspace.
You can choose from many machine learning components available in open-source Python packages, such as the following examples:

- <a href="https://scikit-learn.org/stable/" target="_blank">Scikit-learn</a>
- <a href="https://www.tensorflow.org" target="_blank">Tensorflow</a>
- <a href="https://pytorch.org" target="_blank">PyTorch</a>
- <a href="https://mxnet.io" target="_blank">MXNet</a>

Azure Machine Learning service can also autotrain a model and autotune it for you.
For an example, see [Train a regression model with automated machine learning](tutorial-auto-train-models.md).

After you have a model, you use it to create a container, such as Docker, that can be deployed locally for testing. After testing is done, you can deploy the model as a production web service in either Azure Container Instances or Azure Kubernetes Service. For more information, see the article on [how to deploy and where](how-to-deploy-and-where.md).

Or train and deploy your machine learning model without writing code by using the drag-and-drop visual interface. 

Then you can manage your deployed models by using the [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) or the [Azure portal](https://portal.azure.com/).

You can evaluate model metrics, retrain, and redeploy new versions of the model, all while tracking the model's experiments.

To get started using Azure Machine Learning service, see [Next steps](#next-steps).

## How does Azure Machine Learning service differ from Studio?

[Azure Machine Learning Studio](../studio/what-is-ml-studio.md) is a collaborative, drag-and-drop visual workspace where you can build, test, and deploy machine learning solutions without needing to write code. It uses prebuilt and preconfigured machine learning algorithms and data-handling modules.

Use Machine Learning Studio when you want to experiment with machine learning models quickly and easily, and the built-in machine learning algorithms are sufficient for your solutions.

Use Machine Learning service if you work in a Python environment, you want more control over your machine learning algorithms, or you want to use open-source machine learning libraries.

> [!NOTE]
> Models created in Azure Machine Learning Studio can't be deployed or managed by Azure Machine Learning service.

## Free trial

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

You get credits to spend on Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged. Or [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F), which give you credits every month that you can use for paid Azure services.

## Next steps

- [Create a Machine Learning service workspace](setup-create-workspace.md) to get started.

- Follow the full-length tutorials: 
  + [Train an image classification model with Azure Machine Learning service](tutorial-train-models-with-aml.md) 
  + [Prepare data and use automated machine learning to auto-train a regression model](tutorial-data-prep.md)

- Use the [Azure Machine Learning Data Prep SDK](https://aka.ms/data-prep-sdk) to prepare your data.

- Learn about [machine learning pipelines](/azure/machine-learning/service/concept-ml-pipelines) to build, optimize, and manage your machine learning scenarios.

- Read the in-depth [Azure Machine Learning service architecture and concepts](concept-azure-machine-learning-architecture.md) article.

- For more information, see [other machine learning products from Microsoft](/azure/architecture/data-guide/technology-choices/data-science-and-machine-learning).
