<properties 
	pageTitle="Step 1: Create a Machine Learning workspace | Azure" 
	description="Solution walkthrough step 1: Create a new Azure Machine Learning Studio workspace" 
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
	ms.date="02/18/2015" 
	ms.author="garye"/>


This is the first step of the walkthrough, [Developing a Predictive Solution with Azure ML][develop]:

[develop]: machine-learning-walkthrough-develop-predictive-solution.md

1.	**Create a Machine Learning workspace**
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	[Publish the web service][publish]
6.	[Access the web service][access-ws]

[create-workspace]: machine-learning-walkthrough-1-create-ml-workspace.md
[upload-data]: machine-learning-walkthrough-2-upload-data.md
[create-new]: machine-learning-walkthrough-3-create-new-experiment.md
[train-models]: machine-learning-walkthrough-4-train-and-evaluate-models.md
[publish]: machine-learning-walkthrough-5-publish-web-service.md
[access-ws]: machine-learning-walkthrough-6-access-web-service.md

----------

# Step 1: Create an Azure Machine Learning workspace

To use Machine Learning Studio, you need to have a Microsoft Azure Machine Learning workspace. This workspace contains the tools you need to create, manage, and publish experiments.  

##To create a workspace  

1.	Sign in to your Microsoft Azure account.
2.	In the Microsoft Azure services panel, click **MACHINE LEARNING**.  
![Create workspace][1]

3.	Click **CREATE AN ML WORKSPACE**.
4.	On the **QUICK CREATE** page, enter your workspace information and then click **CREATE AN ML WORKSPACE**.

	> [AZURE.NOTE] The **WORKSPACE OWNER** is your Microsoft account (e.g., name@outlook.com) or organizational account.

After your Machine Learning workspace is created, you will see it listed on the **machine learning** page.  

> [AZURE.TIP] You can share the experiments you're working on by inviting others to your workspace. You can do this in Machine Learning Studio on the **SETTINGS** page. You just need the Microsoft account or organizational account for each user.

<!-- Uncomment this when this article has more content
For more information, see [Manage an Azure Machine Learning workspace][manageworkspace]

[manageworkspace]: machine-learning-manage-workspace.md
-->
----------

**Next: [Upload existing data][upload-data]**

[1]: ./media/machine-learning-walkthrough-1-create-ml-workspace/create1.png
