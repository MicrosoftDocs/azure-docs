---
title: Application lifecycle management
titleSuffix: Azure Machine Learning Studio
description: Apply Application Lifecycle Management best practices in Azure Machine Learning Studio
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.date: 10/27/2016
---
# Application Lifecycle Management in Azure Machine Learning Studio
Azure Machine Learning Studio is a tool for developing machine learning experiments that are operationalized in the Azure cloud platform. It is like the Visual Studio IDE and scalable cloud service merged into a single platform. You can incorporate standard Application Lifecycle Management (ALM) practices from versioning various assets to automated execution and deployment, into Azure Machine Learning Studio. This article discusses some of the options and approaches.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Versioning experiment
There are two recommended ways to version your experiments. You can either rely on the built-in run history or export the experiment in a JSON format so as to manage it externally. Each approach comes with its pros and cons.

### Experiment snapshots using Run History
In the execution model of the Azure Machine Learning Studio learning experiment, an immutable snapshot of the experiment is submitted to the job scheduler whenever you click **Run** in the experiment editor. To view this list of snapshots, click **Run History** on the command bar in the experiment editor view.

![Run History button](./media/version-control/runhistory.png)

You can then open the snapshot in Locked mode by clicking the name of the experiment at the time the experiment was submitted to run and the snapshot was taken. Notice that only the first item in the list, which represents the current experiment, is in an Editable state. Also notice that each snapshot can be in various Status states as well, including Finished (Partial run), Failed, Failed (Partial run), or Draft.

![Run History list](./media/version-control/runhistorylist.png)

After it's opened, you can save the snapshot experiment as a new experiment and then modify it. If your experiment snapshot contains assets such as trained models, transforms, or datasets that have updated versions, the snapshot retains the references to the original version when the snapshot was taken. If you save the locked snapshot as a new experiment, Azure Machine Learning Studio detects the existence of a newer version of these assets, and automatically updates them in the new experiment.

If you delete the experiment, all snapshots of that experiment are deleted.

### Export/import experiment in JSON format
The run history snapshots keep an immutable version of the experiment in Azure Machine Learning Studio every time it is submitted to run. You can also save a local copy of the experiment and check it in to your favorite source control system, such as Team Foundation Server, and later on re-create an experiment from that local file. You can use the [Azure Machine Learning PowerShell](https://aka.ms/amlps) commandlets [*Export-AmlExperimentGraph*](https://github.com/hning86/azuremlps#export-amlexperimentgraph) and [*Import-AmlExperimentGraph*](https://github.com/hning86/azuremlps#import-amlexperimentgraph) to accomplish that.

The JSON file is a textual representation of the experiment graph, which might include a reference to assets in the workspace such as a dataset or a trained model. It doesn't contain a serialized version of the asset. If you attempt to import the JSON document back into the workspace, the referenced assets must already exist with the same asset IDs that are referenced in the experiment. Otherwise you cannot access the imported experiment.

## Versioning trained model
A trained model in Azure Machine Learning Studio is serialized into a format known as an iLearner file (`.iLearner`), and is stored in the Azure Blob storage account associated with the workspace. One way to get a copy of the iLearner file is through the retraining API. [This article](/azure/machine-learning/studio/retrain-machine-learning-model) explains how the retraining API works. The high-level steps:

1. Set up your training experiment.
2. Add a web service output port to the Train Model module, or the module that produces the trained model, such as Tune Model Hyperparameter or Create R Model.
3. Run your training experiment and then deploy it as a model training web service.
4. Call the BES endpoint of the training web service, and specify the desired iLearner file name and Blob storage account location where it will be stored.
5. Harvest the produced iLearner file after the BES call finishes.

Another way to retrieve the iLearner file is through the PowerShell commandlet [*Download-AmlExperimentNodeOutput*](https://github.com/hning86/azuremlps#download-amlexperimentnodeoutput). This might be easier if you just want to get a copy of the iLearner file without the need to retrain the model programmatically.

After you have the iLearner file containing the trained model, you can then employ your own versioning strategy. The strategy can be as simple as applying a pre/postfix as a naming convention and just leaving the iLearner file in Blob storage, or copying/importing it into your version control system.

The saved iLearner file can then be used for scoring through deployed web services.

## Versioning web service
You can deploy two types of web services from an Azure Machine Learning Studio experiment. The classic web service is tightly coupled with the experiment as well as the workspace. The new web service uses the Azure Resource Manager framework, and it is no longer coupled with the original experiment or the workspace.

### Classic web service
To version a classic web service, you can take advantage of the web service endpoint construct. Here is a typical flow:

1. From your predictive experiment, you deploy a new classic web service, which contains a default endpoint.
2. You create a new endpoint named ep2, which exposes the current version of the experiment/trained model.
3. You go back and update your predictive experiment and trained model.
4. You redeploy the predictive experiment, which will then update the default endpoint. But this will not alter ep2.
5. You create an additional endpoint named ep3, which exposes the new version of the experiment and trained model.
6. Go back to step 3 if needed.

Over time, you might have many endpoints created in the same web service. Each endpoint represents a point-in-time copy of the experiment containing the point-in-time version of the trained model. You can then use external logic to determine which endpoint to call, which effectively means selecting a version of the trained model for the scoring run.

You can also create many identical web service endpoints, and then patch different versions of the iLearner file to the endpoint to achieve similar effect. [This article](create-models-and-endpoints-with-powershell.md) explains in more detail how to accomplish that.

### New web service
If you create a new Azure Resource Manager-based web service, the endpoint construct is no longer available. Instead, you can generate web service definition (WSD) files, in JSON format, from your predictive experiment by using the [Export-AmlWebServiceDefinitionFromExperiment](https://github.com/hning86/azuremlps#export-amlwebservicedefinitionfromexperiment) PowerShell commandlet, or by using the [*Export-AzMlWebservice*](https://docs.microsoft.com/powershell/module/az.machinelearning/export-azmlwebservice) PowerShell commandlet from a deployed Resource Manager-based web service.

After you have the exported WSD file and version control it, you can also deploy the WSD as a new web service in a different web service plan in a different Azure region. Just make sure you supply the proper storage account configuration as well as the new web service plan ID. To patch in different iLearner files, you can modify the WSD file and update the location reference of the trained model, and deploy it as a new web service.

## Automate experiment execution and deployment
An important aspect of ALM is to be able to automate the execution and deployment process of the application. In Azure Machine Learning Studio, you can accomplish this by using the [PowerShell module](https://aka.ms/amlps). Here is an example of end-to-end steps that are relevant to a standard ALM automated execution/deployment process by using the [Azure Machine Learning Studio PowerShell module](https://aka.ms/amlps). Each step is linked to one or more PowerShell commandlets that you can use to accomplish that step.

1. [Upload a dataset](https://github.com/hning86/azuremlps#upload-amldataset).
2. Copy a training experiment into the workspace from a [workspace](https://github.com/hning86/azuremlps#copy-amlexperiment) or from [Gallery](https://github.com/hning86/azuremlps#copy-amlexperimentfromgallery), or [import](https://github.com/hning86/azuremlps#import-amlexperimentgraph) an [exported](https://github.com/hning86/azuremlps#export-amlexperimentgraph) experiment from local disk.
3. [Update the dataset](https://github.com/hning86/azuremlps#update-amlexperimentuserasset) in the training experiment.
4. [Run the training experiment](https://github.com/hning86/azuremlps#start-amlexperiment).
5. [Promote the trained model](https://github.com/hning86/azuremlps#promote-amltrainedmodel).
6. [Copy a predictive experiment](https://github.com/hning86/azuremlps#copy-amlexperiment) into the workspace.
7. [Update the trained model](https://github.com/hning86/azuremlps#update-amlexperimentuserasset) in the predictive experiment.
8. [Run the predictive experiment](https://github.com/hning86/azuremlps#start-amlexperiment).
9. [Deploy a web service](https://github.com/hning86/azuremlps#new-amlwebservice) from the predictive experiment.
10. Test the web service [RRS](https://github.com/hning86/azuremlps#invoke-amlwebservicerrsendpoint) or [BES](https://github.com/hning86/azuremlps#invoke-amlwebservicebesendpoint) endpoint.

## Next steps
* Download the [Azure Machine Learning Studio PowerShell](https://aka.ms/amlps) module and start to automate your ALM tasks.
* Learn how to [create and manage large number of ML models by using just a single experiment](create-models-and-endpoints-with-powershell.md) through PowerShell and retraining API.
* Learn more about [deploying Azure Machine Learning web services](publish-a-machine-learning-web-service.md).
