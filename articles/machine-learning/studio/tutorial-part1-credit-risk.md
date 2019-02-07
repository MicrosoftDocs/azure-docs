---
title: 'Credit risk tutorial: Introduction - Azure Machine Learning Studio | Microsoft Docs'
description: A detailed tutorial showing how to create a predictive analytics solution for credit risk assessment in Azure Machine Learning Studio. This tutorial is part one of a three-part tutorial series.  It shows how to create a workspace and upload data.
keywords: credit risk, predictive analytics solution,risk assessment
author: sdgilley
ms.custom: seodec18
ms.author: sgilley
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: tutorial
ms.date: 02/11/2019
---
# Tutorial: Develop predictive solution for credit risk assessment in Azure Machine Learning Studio

In this tutorial, you take an extended look at the process of developing a predictive analytics solution. You develop a simple model in Machine Learning Studio.  You then deploy the model as an Azure Machine Learning web service.  This deployed model can make predictions using new data. This tutorial is **part one of a three-part tutorial series**.

Suppose you need to predict an individual's credit risk based on the information they gave on a credit application.  

Credit risk assessment is a complex problem, but this tutorial will simplify it a bit. You'll use it as an example of how you can create a predictive analytics solution using Microsoft Azure Machine Learning. You'll use Azure Machine Learning Studio and a Machine Learning web service for this solution.  

In this three-part tutorial, you start with publicly available credit risk data.  You then develop and train a predictive model.  Finally you deploy the model as a web service.

In this tutorial you will: 
 
> [!div class="checklist"]
> * Create a Machine Learning Studio workspace
> * Upload existing data

In [part two of the tutorial](tutorial-part2-credit-risk-train.md), you'll  train and evaluate the models.

In [part three of the tutorial](tutorial-part3-credit-risk-deploy.md), you'll deploy the model as a web service.

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]


## Prerequisites

This tutorial assumes that you've used Machine Learning Studio at least once before, and that you have some understanding of machine learning concepts. But it doesn't assume you're an expert in either.

If you've never used **Azure Machine Learning Studio** before, you might want to start with the quickstart, [Create your first data science experiment in Azure Machine Learning Studio](create-experiment.md). The quickstart takes you through Machine Learning Studio for the first time. It shows you the basics of how to drag-and-drop modules onto your experiment, connect them together, run the experiment, and look at the results. 

Another tool that may be helpful for getting started is a diagram that gives an overview of the capabilities of Machine Learning Studio. You can download and print it from here: [Overview diagram of Azure Machine Learning Studio capabilities](studio-overview-diagram.md).
 
If you're new to the field of machine learning in general, there's a video series that might be helpful to you. It's called [Data Science for Beginners](data-science-for-beginners-the-5-questions-data-science-answers.md) and it can give you a great introduction to machine learning using everyday language and concepts.

> [!TIP] 
> You can find a working copy of the experiment that you develop in this tutorial in the [Azure AI Gallery](https://gallery.cortanaintelligence.com). Go to **[tutorial - Credit risk prediction](https://gallery.cortanaintelligence.com/Experiment/tutorial-Credit-risk-prediction-1)** and click **Open in Studio** to download a copy of the experiment into your Machine Learning Studio workspace.
> 
> This tutorial is based on a simplified version of the sample experiment,
[Binary Classification: Credit risk prediction](https://go.microsoft.com/fwlink/?LinkID=525270), also available in the [Gallery](http://gallery.cortanaintelligence.com/).

## Create a Machine Learning Studio workspace

To use Machine Learning Studio, you need to have a Microsoft Azure Machine Learning Studio workspace. This workspace contains the tools you need to create, manage, and publish experiments.  

The administrator for your Azure subscription needs to create the workspace and then add you as an owner or contributor. For details, see [Create and share an Azure Machine Learning workspace](create-workspace.md).

After your workspace is created, open Machine Learning Studio ([https://studio.azureml.net/Home](https://studio.azureml.net/Home)). If you have more than one workspace, you can select the workspace in the toolbar in the upper-right corner of the window.

![Select workspace in Studio](./media/tutorial-part1-credit-risk/open-workspace.png)

> [!TIP]
> If you were made an owner of the workspace, you can share the experiments you're working on by inviting others to the workspace. You can do this in Machine Learning Studio on the **SETTINGS** page. You just need the Microsoft account or organizational account for each user.
> 
> On the **SETTINGS** page, click **USERS**, then click **INVITE MORE USERS** at the bottom of the window.
> 

## <a name="upload"></a>Upload existing data

To develop a predictive model for credit risk, you need data that you can use to train and then test the model. For this tutorial, You'll use the "UCI Statlog (German Credit Data) Data Set" from the UC Irvine Machine Learning repository. You can find it here:  
<a href="http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)">http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)</a>

You'll use the file named **german.data**. Download this file to your local hard drive.  

The **german.data** dataset contains rows of 20 variables for 1000 past applicants for credit. These 20 variables represent the dataset's set of features (the *feature vector*), which provides identifying characteristics for each credit applicant. An additional column in each row represents the applicant's calculated credit risk, with 700 applicants identified as a low credit risk and 300 as a high risk.

The UCI website provides a description of the attributes of the feature vector for this data. This data includes financial information, credit history, employment status, and personal information. For each applicant, a binary rating has been given indicating whether they are a low or high credit risk. 

You'll use this data to train a predictive analytics model. When you're done, your model should be able to accept a feature vector for a new individual and predict whether he or she is a low or high credit risk.  

Here's an interesting twist.

The description of the dataset on the UCI website mentions what it costs if you misclassify a person's credit risk.
If the model predicts a high credit risk for someone who is actually a low credit risk, the model has made a misclassification.

But the reverse misclassification is five times more costly to the financial institution: if the model predicts a low credit risk for someone who is actually a high credit risk.

So, you want to train your model so that the cost of this latter type of misclassification is five times higher than misclassifying the other way.

One simple way to do this when training the model in your experiment is by duplicating (five times) those entries that represent someone with a high credit risk. 

Then, if the model misclassifies someone as a low credit risk when they're actually a high risk, the model does that same misclassification five times, once for each duplicate. 
This will increase the cost of this error in the training results.


### Convert the dataset format

The original dataset uses a blank-separated format. Machine Learning Studio works better with a comma-separated value (CSV) file, so you'll convert the dataset by replacing spaces with commas.  

There are many ways to convert this data. One way is by using the following Windows PowerShell command:   

    cat german.data | %{$_ -replace " ",","} | sc german.csv  

Another way is by using the Unix sed command:  

    sed 's/ /,/g' german.data > german.csv  

In either case, you have created a comma-separated version of the data in a file named **german.csv** that you can use in your experiment.

### Upload the dataset to Machine Learning Studio

Once the data has been converted to CSV format, you need to upload it into Machine Learning Studio. 

1. Open the Machine Learning Studio home page ([https://studio.azureml.net](https://studio.azureml.net)). 

2. Click the menu ![Menu](./media/tutorial-part1-credit-risk/menu.png) in the upper-left corner of the window, click **Azure Machine Learning**, select **Studio**, and sign in.

3. Click **+NEW** at the bottom of the window.

4. Select **DATASET**.

5. Select **FROM LOCAL FILE**.

    ![Add a dataset from a local file](./media/tutorial-part1-credit-risk/add-dataset.png)

6. In the **Upload a new dataset** dialog, click Browse, and find the **german.csv** file you created.

7. Enter a name for the dataset. For this tutorial, call it "UCI German Credit Card Data".

8. For data type, select **Generic CSV File With no header (.nh.csv)**.

9. Add a description if you’d like.

10. Click the **OK** check mark.  

    ![Upload the dataset](./media/tutorial-part1-credit-risk/upload-dataset.png)

This uploads the data into a dataset module that you can use in an experiment.

You can manage datasets that you've uploaded to Studio by clicking the **DATASETS** tab to the left of the Studio window.

![Manage datasets](./media/tutorial-part1-credit-risk/dataset-list.png)

For more information about importing other types of data into an experiment, see [Import your training data into Azure Machine Learning Studio](import-data.md).

## Clean up resources

[!INCLUDE [machine-learning-studio-clean-up](../../../includes/machine-learning-studio-clean-up.md)]

## Next steps

In this tutorial you completed these steps: 
 
> [!div class="checklist"]
> * Create a Machine Learning Studio workspace
> * Upload existing data into the workspace

You are now ready to train and evaluate models for this data.

> [!div class="nextstepaction"]
> [Tutorial 2 - Train and evaluate models](tutorial-part2-credit-risk-train.md)