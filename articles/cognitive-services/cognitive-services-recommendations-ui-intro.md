<properties
	pageTitle="Building a model with the Recommnendations UI"
	description="Azure Machine Learning Recommendations - Building a model with the Recommnendations UI"
	services="cognitive-services"
	documentationCenter=""
	authors="luiscabrer"
	manager="jhubbard"
	pageTitle="Building a model with the Recommnendations UI"
	description="Azure Machine Learning Recommendations - Building a model with the Recommnendations UI"
	services="cognitive-services"
	documentationCenter=""
	authors="luiscabrer"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="cognitive-services"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/11/2016"
	ms.author="luisca"/>

# Building a model with the Recommendations UI

This document is a step-by-step guide. Our objective is to walk you through the steps necessary to 
train a model using the [Recommendations UI](https://recommendations-portal.azurewebsites.net/),
this will allow you to understand the process for building a model before we do it programmatically. 
It will also get you familiar with the UI that will be handy as you start using the service.

This exercise will take about 30 minutes.

<a name="Step1"></a>
## Step 1 - Sign into the Recommendations UI ##

1. If you have not done so already, you'll first need to [sign up](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Recommendations/pricingtier/S1) for a 
new [Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api) subscription. You can sign up for the service on the  **Azure Portal**
at [http://portal.azure.com/](http://portal.azure.com/) and sign in with your Azure account. Detailed instructions on the 
sign up process are provided in *Task 1* of the
[Getting Started Guide](cognitive-services-recommendations-quick-start.md) 

1. Once you have obtained a **Key** for your Recommendations API subscription, go to [Recommendations UI](https://recommendations-portal.azurewebsites.net/). 

1. Log into the portal by entering your key in the **Account Key** field, and then click the **Login** button.

<a name="Step2"></a>
## Step 2 - Let's gather some training data ##

Before you can create a new build, the engine will need two pieces of information, a catalog file and a set of usage files. 

The catalog file contains information about the items you are offering to your customer. A usage file contains information about how those items are used, or the transactions from your business.

Usually you would query your store database for these pieces of information. Today, we have provided some sample data for you so that you can learn how to use the Recommendations API.

You can download the data from [http://aka.ms/RecoSampleData](http://aka.ms/RecoSampleData). Copy and unpack the **Books.Zip** file into a folder on your local machine. 
For instance **c:\data**.

Detailed information on the schema of the catalog and usage files can be found in the [Collecting Data To Train your Model](cognitive-services-recommendations-collecting-data.md) article.
 
For this lab we are going to work with a small file so that you don’t have very to wait too long for training. If you want to try a more realistic file, we have placed **MsStoreData.zip** that is based on sample transactions from the Microsoft Store in the same location.

<a name="Step3"></a>
## Step 3 - Create a project and upload catalog and usage data ##

Upon logging into the [Recommendations UI](https://recommendations-portal.azurewebsites.net/), you will see the Projects Page. 
If you have previously created any projects you should see them here.
A project (also knowns as *a model* in the API reference) is a container for your catalog and usage data. 
You can create several *builds* inside the project. We will walk you through the process in the next steps.

1. To create a new project, type the name on the text box (i.e. Something like “MyFirstModel” would work) and click **Add Project**.

1. Once the project gets created click on the **Browse for File** button on the **Add a Catalog File** section. 
Upload the catalog you got in step 2. If you saved it at c:\data, you will need to navigate to that folder.

1.	After the catalog is uploaded, click on the **Browse for File** button on the **Add Usage Files** section. Add the usage_large.txt file.

> *What if I have a lot of usage data?*
> Note that usage files need to be at most 200MB files. That said, you can upload more than one file if necessary. The system can hold up to 2GB worth of transaction data. You may not need that much data to generate a good model, it’s not just the size of the data that matters, but the quality of 
> the data. It is very common to see usage data where most of the transactions are just on a handful of very popular items, and there is “little signal” for other items.

<a name="Step4"></a>
## Step 4 - Let's do some training! ##

Now that you have uploaded both the catalog and the usage data, we are ready to train the engine so that it can learn patterns from our data.

1.	Click on the **New Build** button.

1.	Select **Recommendations** as the build type. Notice that we support a Ranking Build and an FBT (Frequently Bought Together) build types as well.

 An FBT build allows you to identify patterns for products that are usually purchased/consumed in the same transaction. A ranking build is used to identify features of interest. 
 We won’t go very deep into FBT or ranking builds in this workshop, but if you are interested you should check out the [Build types and model quality documentation page](https://azure.microsoft.com/en-us/documentation/articles/cognitive-services-recommendations-buildtypes/).

1. Click **Build**. The build process will take about 5 minutes if you are using the Books data. It will take longer on larger datasets.

<a name="Step5"></a>
## Step 5 - Let's find out what the machine learned! ##

Once your build is completed, you will notice a new build in the builds list. This build can be queried for item and user recommendations.

1. Once your build is completed, click **Score**. This will allow you to play with the model and see what items are recommended.

1. Select an item to see which items are returned as recommendations for that item. Notice that if there is not enough transactions for a particular item the system 
will not return any recommendations for that item.  If for some reason you have an item that returns no recommendations, try other items.

<a name="Step6"></a>
## Step 6 - Next steps... ##
Congratulations! you have trained a model and then got recommendations from that model.  The Recommendations UI is a very useful tool 
that allows you to see the state of your projects and builds. 

Now that you have a model, you may want to learn how to do all of the steps above programatically. For that we invite you to download the Recommendations Sample, and also check out the API Reference.  


