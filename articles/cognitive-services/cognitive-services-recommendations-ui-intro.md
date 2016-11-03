---
title: Building a model with the Recommnendations UI | Microsoft Docs
description: Azure Machine Learning Recommendations - Building a model with the Recommendations UI
services: cognitive-services
documentationcenter: ''
author: luiscabrer
manager: jhubbard
editor: cgronlun

ms.assetid: b264fe44-f94e-40ae-9754-60ad7d6cfeb9
ms.service: cognitive-services
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/11/2016
ms.author: luisca

---
# Building a model with the Recommendations UI
This document is a step-by-step guide. Our objective is to walk you through the steps necessary to 
train a model using the [Recommendations UI](https://recommendations-portal.azurewebsites.net/).
Going through the exercise allows you to understand the process for building a model before you do it programmatically. 
It also familiarizes you with the UI, which is handy as you start using the service.

This exercise takes about 30 minutes.

<a name="Step1"></a>

## Step 1 - Sign in to the Recommendations UI
1. If you have not done so already, you need to [sign-up](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Recommendations/pricingtier/S1) for a 
   new [Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api) subscription. You can sign up for the service on **Azure** at
   [http://portal.azure.com/](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Recommendations/pricingtier/S1) and sign in with your Azure account. Detailed instructions on the 
   sign up process are provided in *Task 1* of the [Getting Started Guide](cognitive-services-recommendations-quick-start.md) 
2. Once you have obtained a **Key** for your Recommendations API subscription, go to [Recommendations UI](https://recommendations-portal.azurewebsites.net/). 
3. Log in to the portal by entering your key in the **Account Key** field, and then click the **Login** button.
   
    ![Recommendations UI: Sign-in dialog.][reco_signin]

<a name="Step2"></a>

## Step 2 - Let's gather some training data
Before you can create a build, the engine needs two pieces of information: a catalog file and a set of usage files. 

The catalog file contains information about the items you are offering to your customer. A usage file contains information about how those items are used, or the transactions from your business.

Usually you would query your store database for these pieces of information. Today, we have provided some sample data for you so that you can learn how to use the Recommendations API.

You can download the data from [http://aka.ms/RecoSampleData](http://aka.ms/RecoSampleData). Copy and unpack the **Books.Zip** file into a folder on your local machine. 
For instance, **c:\data**.

Detailed information on the schema of the catalog and usage files can be found in the [Collecting Data To Train your Model](cognitive-services-recommendations-collecting-data.md) article.

For this exercise, we are going to work with a small file so that you don’t have very to wait too long for training. If you want to try a more realistic file, 
we have also placed **MsStoreData.zip** that contains sample transactions from the Microsoft Store in the [same location](http://aka.ms/RecoSampleData).

<a name="Step3"></a>

## Step 3 - Create a project and upload catalog and usage data
Upon logging in to the [Recommendations UI](https://recommendations-portal.azurewebsites.net/), you see the Projects Page. 
If you have previously created any projects, you should see them here.
A project (also known as *a model* in the API reference) is a container for your catalog and usage data. 
You can create several *builds* inside the project. We will walk you through the process in the next steps.

1. To create a new project, type the name on the text box (Something like “MyFirstModel” would work) and click **Add Project**.
   
    ![Recommendations UI: Projects Page.][reco_projects]
2. Once the project gets created, click the **Browse for File** button on the **Add a Catalog File** section. 
   Upload the catalog you got in step 2. If you saved it at *c:\data*, you need to navigate to that folder.
   
     ![Recommendations UI: Adding Data to a Project.][reco_firstmodel]
3. After the catalog is uploaded, click the **Browse for File** button on the **Add Usage Files** section. Add the usage_large.txt file.

> **What if I have a large file of usage data?**
> 
> Only usage files smaller than 200-MB  can be uploaded. That said, the system can hold up to 2-GB worth of transaction data, so you can upload more than one file if necessary.
> You may not need that much data to generate a good model, it’s not just the size of the data that matters, but the quality of 
> the data. It is common to see usage data where most of the transactions are just on a handful of popular items, 
> and there is “little signal” for other items.
> 
> 

<a name="Step4"></a>

## Step 4 - Let's do some training!
Now that you have uploaded both the catalog and the usage data, we are ready to train the engine so that it can learn patterns from our data.

1. Click the **New Build** button.
2. Select **Recommendations** as the build type. Notice that we support a Ranking Build and an FBT
     (Frequently Bought Together) build types as well.
   
   ![Recommendations UI: Build Dialog.][reco_build_dialog.png]

    An FBT build allows you to identify patterns for products that are usually purchased/consumed in the same transaction.
    A ranking build is used to identify features of interest. 
    We won’t go very deep into FBT or ranking builds in this workshop, but if you are interested you should check out 
    the [Build types and model quality documentation page](cognitive-services-recommendations-buildtypes.md).

1. Click the **Build** button. The build process takes about five minutes if you are using the Books data. It takes longer on larger datasets.

<a name="Step5"></a>

## Step 5 - Let's find out what the machine learned!
Once your build is completed, you will notice a new build in the builds list. This build can be queried for item and user recommendations.

1. Once your build is completed, click **Score**. This allows you to play with the model and see what items are recommended.
   
    ![Recommendations UI: Score button][reco_score_button]
2. Select an item to see which items are returned as recommendations for that item. Notice that if there are not enough transactions to predict a recommendation for a particular item, the system 
   will not return any recommendations for that item.  If for some reason you have an item that returns no recommendations, try scoring other items.

<a name="Step6"></a>

## Step 6 - Next steps
Congratulations! you have trained a model and then got recommendations from that model.  The Recommendations UI is a useful tool 
that allows you to see the state of your projects and builds. 

Now that you have a model, you may want to learn how to do all the steps above programmatically. In order to do learn to call the API programmatically,
we invite you to check the [Recommendations API Reference](http://go.microsoft.com/fwlink/?LinkId=759348) and 
download the [Recommendations Sample Application](http://go.microsoft.com/fwlink/?LinkID=759344).

[reco_signin]:../media/cognitive-services/reco_signin.PNG
[reco_projects]:../media/cognitive-services/reco_projects.PNG
[reco_firstmodel]:../media/cognitive-services/reco_firstmodel.png
[reco_build_dialog.png]:../media/cognitive-services/reco_build_dialog.png
[reco_score_button]:../media/cognitive-services/reco_score_button.png
