---
title: What is Azure Machine Learning
description: Overview of Azure Machine Learning - An integrated, end-to-end data science solution for professional data scientists to develop, experiment, and deploy advanced analytics applications at cloud scale.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 10/16/2019
ms.custom: seodec18
---

# What is Azure Machine Learning?

Azure Machine Learning is a cloud service that you use to train, deploy, automate, and manage machine learning models, all at the broad scale that the cloud provides.

## What is machine learning?

Machine learning is a data science technique that allows computers to use existing data to forecast future behaviors, outcomes, and trends. By using machine learning, computers learn without being explicitly programmed.

Forecasts or predictions from machine learning can make apps and devices smarter. For example, when you shop online, machine learning helps recommend other products you might want based on what you've bought. Or when your credit card is swiped, machine learning compares the transaction to a database of transactions and helps detect fraud. And when your robot vacuum cleaner vacuums a room, machine learning helps it decide whether the job is done.

## What is Azure Machine Learning?

Azure Machine Learning provides a cloud-based environment you can use to prep data, train, test, deploy, manage, and track machine learning models. Start training on your local machine and then scale out to the cloud. The service fully supports open-source technologies such as PyTorch, TensorFlow, and scikit-learn and can be used for any kind of machine learning, from classical ml to deep learning, supervised and unsupervised learning.

Explore and prepare data, train and test models, and deploy them using rich tools such as:
+ The [designer](ui-tutorial-automobile-price-train-score.md) in which you can drag-n-drop modules to build your experiments and then deploy models
+ [Jupyter notebooks](https://jupyter.org) in which you use the [Python SDK](https://docs.microsoft.com/azure/machine-learning) to write your own code, such as [these sample notebooks](https://aka.ms/aml-notebooks)
+ R scripts or notebooks in which you use the [R SDK](https://github.com/Azure/azureml-sdk-for-r) to write your own code
+ [Visual Studio Code extension](how-to-vscode-tools.md)


> [!VIDEO https://channel9.msdn.com/Events/Connect/Microsoft-Connect--2018/D240/player]

## <a name="sku"></a>Basic vs Enterprise edition

Azure Machine Learning offers two editions tailored for your machine learning needs:
+ Basic edition (generally available)
+ Enterprise edition (preview)

These editions make it easy for developers and data scientists to accelerate their end-to-end machine learning lifecycle. When creating a workspace, you assign it an edition. The edition determines the functionality to which you have access. 

Learn more about what's in each edition on the [pricing page](https://azure.microsoft.com/pricing/details/machine-learning/). 
Customers are responsible for costs incurred on underlying compute during this time. 

You can [upgrade existing workspaces from Basic to Enterprise edition](how-to-manage-workspace.md#upgrade). 

## What can I do with Azure Machine Learning?

Use the <a href="https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py" target="_blank">Azure Machine Learning Python SDK</a> with open-source Python packages, or use the [designer to build and train highly accurate machine learning and deep-learning models yourself in an Azure Machine Learning Workspace.

Azure Machine Learning provides all the tools you need for your machine learning workflow such as Azure Machine Learning <a href="https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py" target="_blank">SDK for Python</a> and <a href="https://github.com/Azure/azureml-sdk-for-r" target="_blank">SDK for R</a>. The service also interoperates with popular opensource tools, such as <a href="https://scikit-learn.org/stable/" target="_blank">Scikit-learn</a>, <a href="https://www.tensorflow.org" target="_blank">Tensorflow</a>, and <a href="https://pytorch.org" target="_blank">PyTorch</a>.  You can even use [MLflow to track metrics and deploy models](how-to-use-mlflow.md) or Kubeflow to [build end-to-end workflow pipelines](https://www.kubeflow.org/docs/azure/).

Whether you write code or use the [designer](ui-tutorial-automobile-price-train-score.md), you can build, train and track highly accurate machine learning and deep-learning models in an Azure Machine Learning Workspace.

### Code-first experience

Start training on your local machine using the <a href="https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py" target="_blank">Azure Machine Learning Python SDK</a> and then scale out to the cloud. With many available [compute targets](how-to-set-up-training-targets.md), like Azure Machine Learning Compute and [Azure Databricks](/azure/azure-databricks/what-is-azure-databricks), and with [advanced hyperparameter tuning services](how-to-tune-hyperparameters.md), you can build better models faster by using the power of the cloud.

You can also [automate model training and tuning](tutorial-auto-train-models.md) using the SDK.

### UI-based, low-code experience

For code-free training, try:

+ Creating [automated ML experiments](tutorial-first-experiment-automated-ml.md) in the easy-to-use interface.
  [![Azure Machine Learning studio navigation pane](media/how-to-create-portal-experiments/nav-pane.png)](media/how-to-create-portal-experiments/nav-pane-expanded.png)
  
+ The [drag-n-drop experimenting in the designer](ui-tutorial-automobile-price-train-score.md).
  ![Azure Machine Learning designer](media/overview-what-is-azure-ml/visual-interface.png)

### Deploy & operationalize (MLOps)

When you have the right model, you can easily use it in a web service, on an IoT device, or from Power BI. For more information, see the article on [how to deploy and where](how-to-deploy-and-where.md).

Then you can manage your deployed models by using the [Azure Machine Learning SDK for Python](https://aka.ms/aml-sdk) or [Azure Machine Learning studio](https://ml.azure.com).

These models can be consumed and return predictions in [real time](how-to-consume-web-service.md) or [asynchronously](how-to-run-batch-predictions.md) on large quantities of data.

And with advanced [machine learning pipelines](concept-ml-pipelines.md), you can collaborate on each step from data preparation, model training and evaluation, through deployment. Pipelines allow you to:

* Automate the end-to-end machine learning process in the cloud
* Reuse components and only re-run steps when needed
* Use different compute resources in each step
* Run batch scoring tasks

To get started using Azure Machine Learning, see [Next steps](#next-steps).

## How does Azure Machine Learning differ from Studio?

[Machine Learning Studio](../studio/what-is-ml-studio.md) is a collaborative, drag-and-drop visual workspace where you can build, test, and deploy machine learning solutions without needing to write code. It uses prebuilt and preconfigured machine learning algorithms and data-handling modules as well as a proprietary compute platform.

Azure Machine Learning provides both SDKs **-and-** the designer, to quickly prep data, train and deploy machine learning models. The designer provides a similar drag-and-drop experience to Studio. However, unlike the proprietary compute platform of Studio, the designer uses your own compute resources and is fully integrated into Azure Machine Learning.

Here is a quick comparison.

|| Machine Learning Studio | Azure Machine Learning:<br/>The designer|
|---| --- | --- |
|| Generally available (GA) | In preview|
|Modules for interface| Many | Initial set of popular modules|
|Training compute targets| Proprietary compute target, CPU support only| Supports Azure Machine Learning compute, GPU or CPU.<br/>(Other computes supported in SDK)|
|Deployment compute targets| Proprietary web service format, not customizable | Enterprise security options  & Azure Kubernetes Service. <br/>([Other computes](how-to-deploy-and-where.md) supported in SDK) |
|Automated model training and hyperparameter tuning | No | Not yet in the designer. <br/> (Supported in the SDK and Azure Machine Learning studio.) |

Try out the designer with [Tutorial: Predict automobile price with the designer](ui-tutorial-automobile-price-train-score.md).

> [!NOTE]
> Models created in Studio can't be deployed or managed by Azure Machine Learning. However, models created and deployed in the designer can be managed through the Azure Machine Learning workspace.

## Free trial

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

You get credits to spend on Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged. Or [activate MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F), which give you credits every month that you can use for paid Azure services.

## Next steps

- Create your first experiment with your preferred method:
  + [Use Python notebooks to train & deploy ML models](tutorial-1st-experiment-sdk-setup.md)
  + [Use Rmarkdown to train & deploy ML models](tutorial-1st-experiment-r-set-up.md) 
  + [Use automated machine learning to train & deploy ML models](ui-tutorial-automobile-price-train-score.md) 
  + [Use the designer's drag & drop capabilities to train & deploy](tutorial-first-experiment-automated-ml.md) 



- Learn about [machine learning pipelines](/azure/machine-learning/service/concept-ml-pipelines) to build, optimize, and manage your machine learning scenarios.

- Read the in-depth [Azure Machine Learning architecture and concepts](concept-azure-machine-learning-architecture.md) article.
