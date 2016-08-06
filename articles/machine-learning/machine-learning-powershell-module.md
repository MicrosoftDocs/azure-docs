<properties
	pageTitle="PowerShell module for Machine Learning | Microsoft Azure"
	description="The PowerShell module for Azure Machine Learning is available in public preview mode. Use PowerShell to create and manage workspaces, experiments, web serivces, and more."
	keywords="experiment,linear regression,machine learning algorithms,machine learning tutorial,predictive modeling techniques,data science experiment"
	services="machine-learning"
	documentationCenter=""
	authors="hning86"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="08/05/2016"
	ms.author="garye;haining"/>

# PowerShell module for Microsoft Azure Machine Learning

The PowerShell module for Azure Machine Learning is a powerful tool that allows you to use Windows PowerShell to manage workspaces, experiments, datasets, web serivces, and more.

You can view the documentation and download the module, along with the full source code, at [https://aka.ms/amlps](https://aka.ms/amlps). 

## What is the Machine Learning PowerShell module?

The Machine Learning PowerShell module is a .NET-based DLL module that allows you to fully manage Azure Machine Learning workspaces, experiments, datasets, web services, and web service endpoints from Windows PowerShell. 
Along with the module, you can download the full source code which includes a cleanly-separated [C# API layer](https://github.com/hning86/azuremlps/blob/master/code/AzureMLSDK.cs). This means you can reference this DLL from your own .NET project and manage Azure Machine Learning through .NET code. In addition, the DLL depends on underlying REST APIs that you can leverage directly from your favorite client.

## What can I do with the PowerShell module?

Here are some of the tasks you can perform with this PowerShell module. Check out the [full documentation](https://aka.ms/amlps) for these and many more functions.

- Provision a new workspace using a management certificate ([New-AmlWorkspace](https://github.com/hning86/azuremlps#new-amlworkspace))
- Export and import a JSON file representing an experiment graph ([Export-AmlExperimentGraph](https://github.com/hning86/azuremlps#export-amlexperimentgraph) and [Import-AmlExperimentGraph](https://github.com/hning86/azuremlps#import-amlexperimentgraph))
- Run an experiment ([Start-AmlExperiment](https://github.com/hning86/azuremlps#start-amlexperiment))
- Create a web service out of a predictive experiment ([New-AmlWebService](https://github.com/hning86/azuremlps#new-amlwebservice))
- Create a new endpoint on a published web service ([Add-AmlWebServiceEndpoint](https://github.com/hning86/azuremlps#add-amlwebserviceendpoint))
- Invoke an RRS and/or BES web service endpoint ([Invoke-AmlWebServiceRRSEndpoint](https://github.com/hning86/azuremlps#invoke-amlwebservicerrsendpoint) and [Invoke-AmlWebServicBESEndpoint](https://github.com/hning86/azuremlps#invoke-amlwebservicebesendpoint))

Here's a quick example of using PowerShell to run an existing experiment:

		#Find the first Experiment named “xyz”
		$exp = (Get-AmlExperiment | where Description -eq ‘xyz’)[0]
		#Run the Experiment
		Start-AmlExperiment -ExperimentId $exp.ExperimentId 

For a more in-depth use case, see this article on using the PowerShell module to automate a very commonly-requested task: [Create many Machine Learning models and web service endpoints from one experiment using PowerShell](machine-learning-create-models-and-endpoints-with-powershell.md).

## How do I get started?

To get started with Machine Learning PowerShell, download the [release package](https://github.com/hning86/azuremlps/releases) from GitHub and follow the [instructions for installation](https://github.com/hning86/azuremlps/blob/master/README.md). You'll need to unblock the downloaded/unzipped DLL and then import it into your PowerShell environment. Most of the cmdlets require that you supply the workspace ID, the workspace authorization token, and the Azure region that the workspace is in. The simplest way to provide these is through a default config.json file, which is covered in detail in the installation instructions. Of course, you can also clone the git tree and modify/compile the code locally using Visual Studio.

## What's next?

The PowerShell module will continue to be improved and expanded during this preview period. Keep an eye on the [Cortana Intelligence and Machine Learning Blog](https://blogs.technet.microsoft.com/machinelearning/) for more news and information.