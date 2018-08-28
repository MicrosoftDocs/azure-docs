---
title: What happened to Workbench in Azure Machine Learning? | Microsoft Docs
description: Learn about what happened the Workbench application, what changed in Azure Machine Learning, and what the support timeline is.
services: machine-learning
author: j-martens
ms.author: jmartens
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: get-started-article
ms.date: 09/24/2018
---
# What happened to Workbench in Azure Machine Learning?
 
The Workbench application and some other early features were deprecated in the September 2018 release to make way for an improved [architecture](concept-azure-machine-learning-architecture.md). The release contains many significant updates prompted by customer feedback to better your experience. The core functionality from experiment execution to model deployment have not changed, but now you can use the robust SDK and CLI to accomplish your machine learning tasks and pipelines.  

In this article, you'll learn about what changed and how it affects your pre-existing work with Azure Machine Learning service.

## What changed?

The latest release of Azure Machine Learning includes:
+ A [simplified Azure resources model](concept-azure-machine-learning-architecture.md)
+ New portal UI for managing and sharing experiments and compute targets
+ A new, more comprehensive [Python SDK](reference-azure-machine-learning-sdk.md)
+ An updated and expanded [Azure CLI extension](reference-azure-machine-learning-sdk.md)

The [architecture](concept-azure-machine-learning-architecture.md) was redesigned with ease-of-use in mind. Instead of multiple Azure resources and accounts, you only need an [Azure Machine Learning Workspace](concept-azure-machine-learning-architecture.md).  You can quickly create workspaces in the [Azure portal](quickstart-get-started.md) or with [the CLI](quickstart-get-started-with-cli.md).  A workspace can be used by multiple users to store training and deployment compute targets, model experiments, Docker images, deployed models, and so on. 

While there are improved CLI and SDK clients, the desktop Workbench application was deprecated. You can still monitor your experiments, but now you'll do so in the Azure portal online. In the online workspace dashboard, you can run history reports, manage the compute targets attached to your workspace, manage your models and Docker images, and even deploy web services.


[!INCLUDE [aml-preview-note](../../../includes/aml-preview-note.md)]

## How do I migrate?

Most of the artifacts created in the earlier version of Azure Machine Learning service are stored in your own local or cloud storage. These artifacts won't ever disappear. To migrate, you need to register the artifacts again with the updated Azure Machine Learning offering. Learn what you can migrate and how in this [migration article](how-to-migrate.md).

<a name="timeline"></a>

## What's the support timeline?
You can continue to use your experimentation and model management accounts as well as the Workbench application for a while longer after September 2018. 

Support for these resources will be incrementally deprecated over the next 6 - 8 months. 

|Phase|Support details for earlier features|
|:---:|----------------|
|1|The ability to create _Azure Machine Learning Experimentation_ and _Model Management_ accounts in the Azure portal ends. Existing accounts, the CLI, and the desktop Workbench continue to work in this phase.|
|2|The underlying APIs for creating the old workspaces and projects in the desktop Workbench and with the CLI ends. You can still run existing models and deploy web services to ACS in this phase.|
|3|Support for everything else, including the remaining APIs and the desktop Workbench end in this phase.|

[Start migrating](how-to-migrate.md) today. All features and capabilities (except data preparation) are available in the latest version through this [SDK](reference-azure-machine-learning-sdk.md), [CLI](reference-azure-machine-learning-cli.md), and [portal](quickstart-get-started.md). 

While you can still use the older features, you'll be able to find that documentation at the bottom of this [table of contents](../desktop-workbench/tutorial-classifying-iris-part-1.md).

## What about run histories?

The older run histories will remain accessible for a while. When you are ready to move to the updated version of Azure Machine Learning service, you can export these run histories if you want to keep a copy. 

In the latest version of Azure Machine Learning service, run histories are now called *experiments*. You can collect your model's experiments and explore them using the SDK and CLI as well as in the web portal.

## Can I still prepare data?
Data preparation files are not portable to the latest release since we don't have Workbench anymore. However, you can still prepare your data for modeling.  With smaller data sets, you can use the Azure ML Data Prep SDK to quickly prepare your data prior to modeling. You can use this same SDK for larger data sets or use Azure Databricks to prepare big data sets.

### Azure ML Data Prep SDK download and installation Links

- [Azure ML Data Prep SDK](https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/)

```    
pip install --upgrade --extra-index-url https://dataprepdownloads.azureedge.net/pypi/privPreview/latest/ azureml-dataprep
```

## Will projects persist?

You won't lose any code or work. In the older version, projects are cloud entities with a local directory. In the latest version, projects are local directories that are attached to the Azure Machine Learning Workspace workspace. [See a diagram of the latest architecture](concept-azure-machine-learning-architecture.md). 

Since much of the project contents was already on your local machine, you just need to attach this local project directory to your workspace. [Learn how migrate your existing projects.](how-to-migrate.md#projects)

Learn how to create a project [in Python with the SDK](quickstart-get-started.md) or with [the updated CLI](quickstart-get-started-with-cli.md).

## What about deployed web services?

The models you deployed as web services using your Model Management account will continue to work for as long as Azure Container Service (ACS) is supported. Those web services will even work after support has ended for Model Management accounts. However, when CLI support ends, so does your ability to manage those web services.

In the newer version, models are deployed as web services to [Azure Container Instances](how-to-deploy-to-aci.md) (ACI) or [Azure Kubernetes Service](how-to-deploy-to-aks.md) (AKS) clusters. Without having to change any of your scoring files and dependencies, you can redeploy your models using the new SDK or CLI to either target: ACI or AKS. You do not need to change anything in your original scoring file, model file dependencies files, environment file, and schema files. 

## Will the SDK and CLI still work?
Yes, they will continue to work for a while (see the [timeline](#timeline) above). But, you can start creating your new experiments and models with the latest SDK and/or CLI.

In the latest release, the new Python SDK allows you to interact with the Azure Machine Learning service in any Python environment. Learn how to [install the SDK](reference-azure-machine-learning-sdk.md).  You can also use the [updated Azure CLI machine learning extension](reference-azure-machine-learning-cli.md),with the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.

## What about Visual Studio Code Tools for AI?

With this latest release, the Visual Studio Code Tools for AI extension has been expanded and improved to work with the above new features.


## Next steps

Learn about [the latest architecture for Azure Machine Learning service](concept-azure-machine-learning-architecture.md) and try one of the quickstarts:

* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Quickstart: Create a workspace with Azure CLI](quickstart-get-started-with-cli.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
