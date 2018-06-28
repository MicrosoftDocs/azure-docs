---
title: What is Azure Machine Learning? | Microsoft Docs
description: Explains basic concepts of machine learning in the cloud, describes what you can use it for, and defines machine learning terms. Overview of Azure Machine Learning -- an integrated, end-to-end data science solution for professional data scientists to develop, experiment and deploy advanced analytics applications at cloud scale.
services: machine-learning
author: mwinkle
ms.author: mwinkle
manager: cgronlun
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: overview
ms.date: 09/21/2017
---

# What is Azure Machine Learning?

Azure Machine Learning is a fully managed service for the end to end development and deployment of machine learning models.  Azure Machine Learning lets developers and data scientists track all of their model training and then deploy and manage those models. Azure Machine Learning fully supports open-source technologies so you can use tens of thousands of open-source Python packages, such as the following machine learning frameworks: 
- [PyTorch](https://pytorch.org)
- [Scikit-learn](http://scikit-learn.org/stable/)
- [Tensorflow](https://www.tensorflow.org)
- [CNTK](https://www.microsoft.com/en-us/cognitive-toolkit/)
- [MXNet](http://mxnet.io)

Rich tools, such as [Jupyter notebooks](http://jupyter.org) or the [Visual Studio Code Tools for AI](https://visualstudio.microsoft.com/downloads/ai-tools-vscode/) make it easy to interactively explore data, transform it, and then develop, test, and deploy models.  

Azure Machine Learning lets you start training on your local machine, and then scale out to the cloud.  With native support for [Azure Batch AI](https://azure.microsoft.com/services/batch-ai/) and advanced hyperparameter tuning services (TODO for a link), you can build better models faster, using the power of the cloud.  When you have the right model, you can easily deploy with full Docker support, meaning it is simple to deploy to [Azure Container Instances](how-to-deploy-to-aci.md), [Azure Kubernetes Service](how-to-deploy-to-aks.md), or use that Docker container in your own deployments, on-premises or in the cloud. 

@@ INSERT ARTWORK HERE

In addition to Azure Machine Learning, there are other options to build, deploy, and manage machine learning models. [Learn about them here.](./overview-more-machine-learning.md)

## What is Machine Learning?

Machine learning is a data science technique that allows computers to use existing data to forecast future behaviors, outcomes, and trends. Using machine learning, computers learn without being explicitly programmed.

Forecasts or predictions from machine learning can make apps and devices smarter. When you shop online, machine learning helps recommend other products you might like based on what you've purchased. When your credit card is swiped, machine learning compares the transaction to a database of transactions and helps detect fraud. When your robot vacuum cleaner vacuums a room, machine learning helps it decide whether the job is done.

## Key capabilities

## How can I use Azure Machine Learning Services?

## Free trial
If you aren't a subscriber, you can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F). You get credits for trying out paid Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged. Alternatively, you can [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services. 

## Next steps

1. Create a machine learning workspace using one of our "Get started with Azure Machine Learning Services" quickstarts:
   + [Use Azure Portal to get started](quickstart-get-started.md) 
   + [Use Azure CLI to get started](quickstart-get-started-with-cli.md)

2. Follow the full-length [tutorial](tutorial-build-train-deploy-with-azure-machine-learning.md) to learn how to train and deploy models with Azure Machine Learning Services. 

@PLACEHOLDER: In this 9-minute video, learn how BLAH BLAH BLAH can benefit your app. You'll learn about key features and what a typical workflow looks like. 

>[!VIDEO https://channel9.msdn.com/Events/Connect/2016/138/player]
 
+ 0-3 minutes covers key features and use-cases.
+ 3-4 minutes covers service provisioning. 
+ 4-6 minutes covers Import Data wizard used to create an index using the built-in real estate dataset.
