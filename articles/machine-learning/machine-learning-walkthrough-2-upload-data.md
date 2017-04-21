---
title: 'Step 2: Upload data into a Machine Learning experiment | Microsoft Docs'
description: 'Step 2 of the Develop a predictive solution walkthrough: Upload stored public data into Azure Machine Learning Studio.'
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 9f4bc52e-9919-4dea-90ea-5cf7cc506d85
ms.service: machine-learning
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2017
ms.author: garye

---
# Walkthrough Step 2: Upload existing data into an Azure Machine Learning experiment
This is the second step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)

1. [Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2. **Upload existing data**
3. [Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4. [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5. [Deploy the Web service](machine-learning-walkthrough-5-publish-web-service.md)
6. [Access the Web service](machine-learning-walkthrough-6-access-web-service.md)

- - -
To develop a predictive model for credit risk, we need data that we can use to train and then test the model. For this walkthrough, we'll use the "UCI Statlog (German Credit Data) Data Set" from the UC Irvine Machine Learning repository. You can find it here:  
<a href="http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)">http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)</a>

We'll use the file named **german.data**. Download this file to your local hard drive.  

The **german.data** dataset contains rows of 20 variables for 1000 past applicants for credit. These 20 variables represent the dataset's set of features (the *feature vector*), which provides identifying characteristics for each credit applicant. An additional column in each row represents the applicant's calculated credit risk, with 700 applicants identified as a low credit risk and 300 as a high risk.

The UCI website provides a description of the attributes of the feature vector for this data. This includes financial information, credit history, employment status, and personal information. For each applicant, a binary rating has been given indicating whether they are a low or high credit risk. 

We'll use this data to train a predictive analytics model. When we're done, our model should be able to accept a feature vector for a new individual and predict whether he or she is a low or high credit risk.  

Here's an interesting twist. 
The description of the dataset on the UCI website mentions what it costs if we misclassify a person's credit risk.
If the model predicts a high credit risk for someone who is actually a low credit risk, the model has made a misclassification.
But the reverse misclassification is five times more costly to the financial institution: if the model predicts a low credit risk for someone who is actually a high credit risk.

So, we want to train our model so that the cost of this latter type of misclassification is five times higher than misclassifying the other way.
One simple way to do this when training the model in our experiment is by duplicating (five times) those entries that represent someone with a high credit risk. 
Then, if the model misclassifies someone as a low credit risk when they're actually a high risk, the model does that same misclassification five times, once for each duplicate. 
This will increase the cost of this error in the training results.


## Convert the dataset format
The original dataset uses a blank-separated format. Machine Learning Studio works better with a comma-separated value (CSV) file, so we'll convert the dataset by replacing spaces with commas.  

There are many ways to convert this data. One way is by using the following Windows PowerShell command:   

    cat german.data | %{$_ -replace " ",","} | sc german.csv  

Another way is by using the Unix sed command:  

    sed 's/ /,/g' german.data > german.csv  

In either case, we have created a comma-separated version of the data in a file named **german.csv** that we can use in our experiment.

## Upload the dataset to Machine Learning Studio
Once the data has been converted to CSV format, we need to upload it into Machine Learning Studio. 

1. Open the Machine Learning Studio home page ([https://studio.azureml.net](https://studio.azureml.net)). 

2. Click the menu ![Menu][1] in the upper-left corner of the window, click **Azure Machine Learning**, select **Studio**, and sign in.

3. Click **+NEW** at the bottom of the window.

4. Select **DATASET**.

5. Select **FROM LOCAL FILE**.

    ![Add a dataset from a local file][2]

6. In the **Upload a new dataset** dialog, click **Browse** and find the **german.csv** file you created.

7. Enter a name for the dataset. For this walkthrough, call it "UCI German Credit Card Data".

8. For data type, select **Generic CSV File With no header (.nh.csv)**.

9. Add a description if you’d like.

10. Click the **OK** check mark.  

    ![Upload the dataset][3]

This uploads the data into a dataset module that we can use in an experiment.

You can manage datasets that you've uploaded to Studio by clicking the **DATASETS** tab to the left of the Studio window.

![Manage datasets][4]

For more information about importing other types of data into an experiment, see [Import your training data into Azure Machine Learning Studio](machine-learning-data-science-import-data.md).

**Next: [Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)**

[1]: media/machine-learning-walkthrough-2-upload-data/menu.png
[2]: media/machine-learning-walkthrough-2-upload-data/add-dataset.png
[3]: media/machine-learning-walkthrough-2-upload-data/upload-dataset.png
[4]: media/machine-learning-walkthrough-2-upload-data/dataset-list.png
