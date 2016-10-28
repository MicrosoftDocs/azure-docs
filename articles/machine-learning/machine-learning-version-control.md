<properties
      pageTitle="ALM in Azure ML| Microsoft Azure"
      description="Apply Application Lifecycle Management best parctices in Azure Machine Learning Studio"
      keywords="ALM, AML, Azure ML, Application Life Cycle Management, Version Control"
      services="machine-learning"
      documentationCenter=""
      authors="hning86"
      manager="jhubbard"
      editor="cgronlun"/>

<tags
      ms.service="machine-learning"
      ms.workload="data-services"
      ms.tgt_pltfrm="na"
      ms.devlang="na"
      ms.topic="article"
      ms.date="10/27/16"
      ms.author="haining"/>


#Application Lifecycle Management in Azure Machine Learning Studio


Azure Machine Learning Studio is a tool for developing machine learning experiments and operaionalize it in the Azure cloud. It is like Visual Studio IDE and scalable Web Service hosting services merged into a single platform. Hence, it is only logical/natural to incorporate standard ALM (application life-cycle management) practices, from versioning various assets to automated execution and deployment. into the Azure Machine Learning Studio. This article intends to cover some of the options and approaches. 

## Versioning experiment
There are two recommended ways to version your experiments. You can either rely on built-in run history, or export the experiment in JSON format and manage it externally. Each approach comes with its pros and cons.

### Experiment snapshots using Run History

The execution model of Azure Machine Learning experiment is that every time when you hit the Run button in the experiment editor, an immutable snapshot of the experiment is submitted to the job scheduler. You can view this list of snapshots by click on the "RUN HISTORY" button on the command bar in the experiment editor view.

![Run History button](media\machine-learning-version-control\runhistory.png)

You can then open the a snapshot in Locked mode by clicking on the name of the experiment at the time the experiment was submitted for run and snapshot was taken. Notice that only the first item in the list, which represents the current experiment, is in Editable state. Also notice that each snapshot can be in various Status as well, including Finished (Partial run), Failed, Failed (Partial run), or Draft.

![RUN HISTORY list](media\machine-learning-version-control\runhistorylist.png)

Once opened, you can save the snapshot experiment as a new experiment and then modify it. One caveat is that if your experiment snapshot contains assets such as trained model, transform, dataset, etc., that since have updated versions, the snapshot retains the references to the original version when the snapshot was taken. But if you save the locked snapshot as a new experiment, ML Studio detects the existence of newer version of these assets, and it will automatically update them into the latest version. 

Also note that if you delete the experiment, all snapshot of that experiment is also deleted.


### Export/import experiment in JSON format
Even though the run history snapshots keep an immutable version of the experiment in the ML Studio every time it is submitted to run, sometimes you still want to save a local copy of the experiment, and maybe check it into your favorite source control system, such as Team Foundation Server, and later on recreate an experiment from that local file. You can use [Azure ML PowerShell](http://aka.ms/amlps) commandlet [*Export-AmlExperimentGraph*](http://mit.edu) and [*Import-AmlExperimentGraph*](http://www.com) to accomplish that.

Please note though the JSON file is a textual representation of the experiment graph, which may includes reference to assets in the workspace such as dataset or trained models. But it does NOT contain serialized version of such assets. So if you attempt to import the JSON document back into the workspace, those referenced assets must already exist with the same asset IDs referenced in the experiment, otherwise you will not be able to access the imported experiment.


## Versioning trained model
A trained model in Azure ML is serialized into a format known as .iLearner file and stored in the Azure blob storage account associated with the workspace. One way to get hold of a copy of the iLearner file is through retraining API. This [article](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-retrain-models-programmatically/) explains in much more detail on how retraining API works. But the high-level steps are:

1. Set up your training experiment.
2. Add web service output port to the Train Model module, or the module that produces the trained model, such as Tune Model Hyperparameter or Create R Model module.
3. Run your training experiment and then deploy it as model training web service. 
4. Call the BES endpoint of the training web service, and specify the desired .iLearner file name and Azure blob storage account location where it will be stored.
5. Harvest the produced .iLearner file after the BES call finishes.

Once you have the .iLearner file containing the trained model, you can then employ your own versioning strategy, from as simple as applying a pre/postfix as a naming convention and just leaving the .iLearner file in Azure blob storage, to copying/importing it into your version control system.

The saved .iLearner file can then be used for scoring through deployed web services.


## Versioning web service
You can deploy two types of web services from an Azure ML experiment. The classic web service is tightly coupled with the experiment as well as the workspace. The new web service leverages Azure Resource Management framework, and it is no longer coupled with the original experiment nor the workspace. 

### Classic web service
To version a classic web service, you can leverage the web service endpoint construct. Here is a typical flow:

1. From your predictive experiment, you deploy a new classic web service, which contains a default endpoint.
2. You then create a new endpoint named ep2, which exposes the current version of the experiment/trained model.
3. You then go back and update your predictive experiment and trained model.
4. You can then redeploy the predictive experiment, which will then update the default endpoint. But this will not alter ep2.
5. You can now create an additional endpoint ep3, which exposes the new version of the experiment and trained model. 
6. Go back to step 3 if needed.

Over time, you may have many endpoints created in the same web service, each represents a point-in-time copy of the experiment containing the point-in-time version of the trained model. You can then use external logic to determine which endpoint to call, which effectively means selecting a version of the trained model for the scoring run.

You can also create many identical web service endpoints, and then patch different versions of the .iLearner file to the endpoint to achieve similar effect. This [article](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-models-and-endpoints-with-powershell/) explains in more detail on how to accomplish that.


### New web service
If you are create new ARM based web service, endpoint construct is no longer available. Instead, you can generate WSD (web service definition) files, in JSON format, from your predictive experiment using the [Export-AmlWebServiceDefinitionFromExperiment](https://github.com/hning86/azuremlps#export-amlwebservicedefinitionfromexperiment) PowerShell commandlet, or using [*Explort-AzureRmMlWebservice*](https://msdn.microsoft.com/en-us/library/azure/mt767935.aspx) PowerShell commandlet from an arleady deployed ARM based web service. 

Once you have the exported WSD file and version control it. You can also deploy the WSD as a new web service in a different web service plan in a different Azure region. Just make sure you supply the proper storage account configuration as well as the new web service plan ID. To patch in different .iLearner files, you can modify the WSD file and update the location reference of the trained model, and deploy as a new web service.

## Automate experiment execution and deployment
An important aspect of ALM is to be able to automate the execution and deployment process of the application. In Azure ML, you can accomplish this using the [PowerShell module](http://aka.ms/amlps). Here is an example of end to end steps that are relevant to a standard ALM automated execution/deployment process using the [Azure ML Studio PowerShell module](http://aka.ms/amlps). Each step is linked to one or more PowerShell commandlets that you can leverage to accomplish that step.

1. [Upload a dataset](https://github.com/hning86/azuremlps#upload-amldataset). 
2. Copy a training experiment into the workspace from a [workspace](https://github.com/hning86/azuremlps#copy-amlexperiment) or from [Gallery](https://github.com/hning86/azuremlps#copy-amlexperimentfromgallery), or [import](https://github.com/hning86/azuremlps#import-amlexperimentgraph) an [exported](https://github.com/hning86/azuremlps#export-amlexperimentgraph) experiment from local disk.
3. [Update the dataset](https://github.com/hning86/azuremlps#update-amlexperimentuserasset) in the training experiment.
4. [Run the training experiment](https://github.com/hning86/azuremlps#start-amlexperiment)
5. [Promote the trained model](https://github.com/hning86/azuremlps#promote-amltrainedmodel).
6. [Copy a predictive experiment](https://github.com/hning86/azuremlps#copy-amlexperiment) into the workspace.
7. [Update the trained model](https://github.com/hning86/azuremlps#update-amlexperimentuserasset) in the predictive experiment.
8. [Run the predictive experiment](https://github.com/hning86/azuremlps#start-amlexperiment).
9. [Deploy a web service](https://github.com/hning86/azuremlps#new-amlwebservice) from the predictive experiment.
10. Test the web service [RRS](https://github.com/hning86/azuremlps#invoke-amlwebservicerrsendpoint) or [BES](https://github.com/hning86/azuremlps#invoke-amlwebservicebesendpoint) endpoint 
