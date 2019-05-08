---
title: What is
titleSuffix: Azure Machine Learning Studio
description: Azure Machine Learning Studio is a drag-and-drop tool for quickly building models from a ready-to-use library of algorithms and modules.

services: machine-learning
documentationcenter: ''
author: garyericson
ms.custom: seodec18
ms.author: garye
ms.assetid: e65c8fe1-7991-4a2a-86ef-fd80a7a06269
ms.service: machine-learning
ms.subservice: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 04/20/2019
---
# What is Azure Machine Learning Studio?
Microsoft Azure Machine Learning Studio is a collaborative, drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions on your data. Machine Learning Studio publishes models as web services that can easily be consumed by custom apps or BI tools such as Excel.

Machine Learning Studio is where data science, predictive analytics, cloud resources, and your data meet.


## The Machine Learning Studio interactive workspace
To develop a predictive analysis model, you typically use data from one or more sources, transform, and analyze that data through various data manipulation and statistical functions, and generate a set of results. Developing a model like this is an iterative process. As you modify the various functions and their parameters, your results converge until you are satisfied that you have a trained, effective model.

**Azure Machine Learning Studio** gives you an interactive, visual workspace to easily build, test, and iterate on a predictive analysis model. You drag-and-drop ***datasets*** and analysis ***modules*** onto an interactive canvas, connecting them together to form an ***experiment***, which you run in Machine Learning Studio. To iterate on your model design, you edit the experiment, save a copy if desired, and run it again. When you're ready, you can convert your ***training experiment*** to a ***predictive experiment***, and then publish it as a ***web service*** so that your model can be accessed by others.

There is no programming required, just visually connecting datasets and modules to construct your predictive analysis model.

![Azure Machine Learning studio diagram: Create experiments, read data for many sources, write scored data, write models.](./media/what-is-ml-studio/azure-ml-studio-diagram.jpg)

## Download the Machine Learning Studio overview diagram
Download the **Microsoft Azure Machine Learning Studio Capabilities Overview** diagram and get a high-level view of the capabilities of Machine Learning Studio. To keep it nearby, you can print the diagram in tabloid size (11 x 17 in.).

**Download the diagram here: [Microsoft Azure Machine Learning Studio Capabilities Overview](https://download.microsoft.com/download/C/4/6/C4606116-522F-428A-BE04-B6D3213E9E52/ml_studio_overview_v1.1.pdf)**
![Microsoft Azure Machine Learning Studio Capabilities Overview](./media/what-is-ml-studio/ml_studio_overview_v1.1.png)

## Get started with Machine Learning Studio
When you first enter Machine Learning Studio,](https://studio.azureml.net) you see the **Home** page. From here you can view documentation, videos, webinars, and find other valuable resources.

Click the upper-left menu ![Menu](./media/what-is-ml-studio/menu.png) and you'll see several options.
### Azure Machine Learning Studio
There are two options here, **Home**, the page where you started, and **Studio**.

Click **Studio** and you'll be taken to the **Azure Machine Learning Studio**. First you'll be asked to sign in using your Microsoft account, or your work or school account. Once signed in, you'll see the following tabs on the left:

* **PROJECTS** - Collections of experiments, datasets, notebooks, and other resources representing a single project
* **EXPERIMENTS** - Experiments that you have created and run or saved as drafts
* **WEB SERVICES** - Web services that you have deployed from your experiments
* **NOTEBOOKS** - Jupyter notebooks that you have created
* **DATASETS** - Datasets that you have uploaded into Studio
* **TRAINED MODELS** - Models that you have trained in experiments and saved in Studio
* **SETTINGS** - A collection of settings that you can use to configure your account and resources.

### Gallery
Click **Gallery** and you'll be taken to the **[Azure AI Gallery](https://gallery.azure.ai/)**. The Gallery is a place where a community of data scientists and developers share solutions created using components of the Cortana Intelligence Suite.

For more information about the Gallery, see [Share and discover solutions in the Azure AI Gallery](gallery-how-to-use-contribute-publish.md).

## Components of an experiment
An experiment consists of datasets that provide data to analytical modules, which you connect together to construct a predictive analysis model. Specifically, a valid experiment has these characteristics:

* The experiment has at least one dataset and one module
* Datasets may be connected only to modules
* Modules may be connected to either datasets or other modules
* All input ports for modules must have some connection to the data flow
* All required parameters for each module must be set

You can create an experiment from scratch, or you can use an existing sample experiment as a template. For more information, see [Copy example experiments to create new machine learning experiments](sample-experiments.md).

For an example of creating a simple experiment, see [Create a simple experiment in Azure Machine Learning Studio](create-experiment.md).

For a more complete walkthrough of creating a predictive analytics solution, see [Develop a predictive solution with Azure Machine Learning Studio](tutorial-part1-credit-risk.md).

### Datasets
A dataset is data that has been uploaded to Machine Learning Studio so that it can be used in the modeling process. A number of sample datasets are included with Machine Learning Studio for you to experiment with, and you can upload more datasets as you need them. Here are some examples of included datasets:

* **MPG data for various automobiles** - Miles per gallon (MPG) values for automobiles identified by number of cylinders, horsepower, etc.
* **Breast cancer data** - Breast cancer diagnosis data.
* **Forest fires data** - Forest fire sizes in northeast Portugal.

As you build an experiment, you can choose from the list of datasets available to the left of the canvas.

For a list of sample datasets included in Machine Learning Studio, see [Use the sample data sets in Azure Machine Learning Studio](use-sample-datasets.md).

### Modules
A module is an algorithm that you can perform on your data. Machine Learning Studio has a number of modules ranging from data ingress functions to training, scoring, and validation processes. Here are some examples of included modules:

* [Convert to ARFF][convert-to-arff] - Converts a .NET serialized dataset to Attribute-Relation File Format (ARFF).
* [Compute Elementary Statistics][elementary-statistics] - Calculates elementary statistics such as mean, standard deviation, etc.
* [Linear Regression][linear-regression] - Creates an online gradient descent-based linear regression model.
* [Score Model][score-model] - Scores a trained classification or regression model.

As you build an experiment you can choose from the list of modules available to the left of the canvas.

A module may have a set of parameters that you can use to configure the module's internal algorithms. When you select a module on the canvas, the module's parameters are displayed in the **Properties** pane to the right of the canvas. You can modify the parameters in that pane to tune your model.

For some help navigating through the large library of machine learning algorithms available, see [How to choose algorithms for Microsoft Azure Machine Learning Studio](algorithm-choice.md).

## Deploying a predictive analytics web service
Once your predictive analytics model is ready, you can deploy it as a web service right from Machine Learning Studio. For more details on this process, see [Deploy an Azure Machine Learning web service](publish-a-machine-learning-web-service.md).

<a name="compare"></a>
## How is Machine Learning Studio different from Azure Machine Learning service?

[Azure Machine Learning service](../service/overview-what-is-azure-ml.md) provides both SDKs **-and-** a visual interface(preview), to quickly prep data, train and deploy machine learning models. This visual interface (preview) provides a similar drag-and-drop experience to Studio. However, unlike the proprietary compute platform of Studio, the visual interface uses your own compute resources and is fully integrated into Azure Machine Learning service.

Here is a quick comparison.

|| Machine Learning Studio | Azure Machine Learning service:<br/>Visual interface|
|---| --- | --- |
|| Generally available (GA) | In preview|
|Modules for interface| Many | Initial set of popular modules|
|Training compute targets| Proprietary compute target, CPU support only| Supports Azure Machine Learning compute, GPU or CPU.<br/>(Other computes supported in SDK)|
|Deployment compute targets| Proprietary web service format, not customizable | Enterprise security options  & Azure Kubernetes Service. <br/>([Other computes](../service/how-to-deploy-and-where.md) supported in SDK) |
|Automated model training and hyperparameter tuning | No | Not yet in visual interface. <br/> (Supported in the SDK and Azure portal.) | 

Try out the visual interface (preview) with [Quickstart: Prepare and visualize data without writing code](../service/ui-quickstart-run-experiment.md)

> [!NOTE]
> Models created in Studio can't be deployed or managed by Azure Machine Learning service. However, models created and deployed in the service visual interface can be managed through the Azure Machine Learning service workspace.

## Free trial

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]


## Next steps
You can learn the basics of predictive analytics and machine learning using a [step-by-step quickstart](create-experiment.md) and by [building on samples](sample-experiments.md).

<!-- Module References -->
[convert-to-arff]: https://msdn.microsoft.com/library/azure/62d2cece-d832-4a7a-a0bd-f01f03af0960/
[elementary-statistics]: https://msdn.microsoft.com/library/azure/3086b8d4-c895-45ba-8aa9-34f0c944d4d3/
[linear-regression]: https://msdn.microsoft.com/library/azure/31960a6f-789b-4cf7-88d6-2e1152c0bd1a/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
