<properties 
	pageTitle="Step 1: Create a Machine Learning workspace | Azure" 
	description="Step 1: Create a new Azure Machine Learning Studio workspace" 
	services="machine-learning" 
	documentationCenter="" 
	authors="aryericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/29/2015" 
	ms.author="garye"/>


This is the first step of the walkthrough, [Developing a Predictive Solution with Azure ML][develop]:

[develop]: ../machine-learning-walkthrough-develop-predictive-solution/

1.	**Create an ML workspace**
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	[Publish the web service][publish]
6.	[Access the web service][access-ws]

[create-workspace]: ../machine-learning-walkthrough-1-create-ml-workspace/
[upload-data]: ../machine-learning-walkthrough-2-upload-data/
[create-new]: ../machine-learning-walkthrough-3-create-new-experiment/
[train-models]: ../machine-learning-walkthrough-4-train-and-evaluate-models/
[publish]: ../machine-learning-walkthrough-5-publish-web-service/
[access-ws]: ../machine-learning-walkthrough-6-access-web-service/

----------

# Step 1: Create an Azure Machine Learning workspace

To use ML Studio, you need to have an ML workspace. This workspace contains the tools you need to create, manage, and publish experiments.  

##To create a workspace  

1.	Sign in to your Microsoft Azure account.
2.	In the Microsoft Azure services panel, click **MACHINE LEARNING**.  
![Create workspace][1]

3.	Click **CREATE AN ML WORKSPACE**.
4.	In the **QUICK CREATE** page enter your workspace information and then click **CREATE AN ML WORKSPACE**.

	> [AZURE.NOTE] The **WORKSPACE OWNER** is your Microsoft account (e.g., name@outlook.com) or organization account.

After your ML workspace is created, you will see it listed on the **machine learning** page.  

> [AZURE.TIP] You can share the experiments you're working on by inviting others to your workspace. You can do this in ML Studio on the **SETTINGS** page. You just need the Microsoft account or organization account for each user.

----------

**Next: [Upload existing data][upload-data]**

[1]: ./media/machine-learning-walkthrough-1-create-ml-workspace/create1.png