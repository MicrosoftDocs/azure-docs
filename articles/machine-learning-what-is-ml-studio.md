<properties 
	pageTitle="What Is Azure Machine Learning Studio? | Azure" 
	description="Overview of Azure Machine Learning Studio and its basic components" 
	services="machine-learning" 
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/22/2015" 
	ms.author="garye"/>

# What is Azure Machine Learning Studio?

Microsoft Azure Machine Learning Studio is a collaborative visual development environment that enables you to build, test, and deploy predictive analytics solutions that operate on your data. The Machine Learning service and development environment is cloud-based, provides compute resource and memory flexibility, and eliminates setup and installation concerns because you work through your web browser. 

Machine Learning Studio is where data science, predictive analytics, cloud resources, and your data meet.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

## The Machine Learning Studio interactive workspace

To develop a predictive analysis model, you typically use data from one or more sources, transform and analyze that data through various data manipulation and statistical functions, and generate a set of results. Developing a model like this is an iterative process. As you modify the various functions and their parameters, your results converge until you are satisfied that you have a trained, effective model.

**Machine Learning Studio** gives you an interactive, visual workspace to easily build, test, and iterate on a predictive analysis model. You drag-and-drop ***datasets*** and analysis ***modules*** onto an interactive ***canvas***, connecting them together to form an ***experiment***, which you ***run*** in Machine Learning Studio. To iterate on your model design, you ***edit*** the experiment, ***save*** a copy if desired, and run it again. When you're ready, you can ***publish*** your experiment as a ***web service*** so that your model can be accessed by others. 

There is no programming required, just visually connecting datasets and modules to construct your predictive analysis model.

![ML Studio Overview][ml-studio-overview]

## Getting started with Machine Learning Studio

When you first enter Machine Learning Studio, you see the following tabs on the left:

- **Studio Home** - A set of links to documentation and other resources.
- **EXPERIMENTS** - Experiments that have been created, run, and saved as drafts. 
- **WEB SERVICES** - A list of experiments that you have published. 
- **SETTINGS** - A collection of settings that you can use to configure your account and resources. 

>[AZURE.NOTE] When you are constructing an experiment, a working list of available datasets and modules	is displayed to the left of the canvas. That is the list of components you use to build your model.

## Components of an experiment

An experiment consists of datasets that provide data to analytical modules, which you connect together to construct a predictive analysis model. Specifically, a valid experiment has these characteristics:

- The experiment has at least one dataset and one module. 
- Datasets may be connected only to modules. 
- Modules may be connected to either datasets or other modules. 
- All input ports for modules must have some connection to the data flow. 
- All required parameters for a module must be set. 

For an example of creating a simple experiment, see [Create a simple experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md). 
For a more complete walkthrough of creating a predictive analytics solution, see [Develop a predictive solution with Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md).

### Datasets

A dataset is data that has been uploaded to Machine Learning Studio so that it can be used in the modeling process. A number of sample datasets are included with Machine Learning Studio for you to experiment with, and you can upload more datasets as you need them. Here are some examples of included datasets:

- **MPG data for various automobiles** - Miles per gallon (MPG) values for automobiles identified by number of cylinders, horsepower, etc. 
- **Breast cancer data** - Breast cancer diagnosis data. 
- **Forest fires data** - Forest fire sizes in northeast Portugal. 

As you build an experiment, the working list of datasets is available to the left of the canvas. 

### Modules

A module is an algorithm that you can perform on your data. Machine Learning Studio has a number of modules ranging from data ingress functions to training, scoring, and validation processes. Here are some examples of included modules:

- [Convert to ARFF][convert-to-arff] - Converts a .NET serialized dataset to Attribute-Relation File Format (ARFF). 
- [Elementary Statistics][elementary-statistics] - Calculates elementary statistics such as mean, standard deviation, etc. 
- [Linear Regression][linear-regression] - Creates an online gradient descent-based linear regression model. 
- [Score Model][score-model] - Scores a trained classification or regression model. 

As you build an experiment, the working list of modules is available to the left of the canvas. 

A module may have a set of parameters that you can use to configure the module's internal algorithms. When you select a module on the canvas, the module's parameters are displayed in the pane to the right of the canvas. You can modify the parameters in that pane to tune your model.


[ml-studio-overview]:./media/machine-learning-what-is-ml-studio/context.jpg


<!-- Module References -->
[convert-to-arff]: https://msdn.microsoft.com/library/azure/62d2cece-d832-4a7a-a0bd-f01f03af0960/
[elementary-statistics]: https://msdn.microsoft.com/library/azure/3086b8d4-c895-45ba-8aa9-34f0c944d4d3/
[linear-regression]: https://msdn.microsoft.com/library/azure/31960a6f-789b-4cf7-88d6-2e1152c0bd1a/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
