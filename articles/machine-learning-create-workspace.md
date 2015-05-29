<properties 
	pageTitle="Create a Machine Learning workspace | Azure" 
	description="How to create a workspace for Azure Machine Learning Studio" 
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
	ms.date="04/07/2015" 
	ms.author="garye"/>


# Create an Azure Machine Learning workspace 

To use Azure Machine Learning Studio, you need to have a Machine Learning workspace. This workspace contains the tools you need to create, manage, and publish experiments. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

## To create a workspace

1. Sign-in to your Microsoft Azure account.
2. In the Microsoft Azure services panel, click **MACHINE LEARNING**.

    ![Machine Learning service][1]

3. Click **+NEW** at the bottom of the window.
4. Click **DATA SERVICES**, then **MACHINE LEARNING**, then **QUICK CREATE**.

	![Quick Create of new workspace][3]

5. Enter a **WORKSPACE NAME** for your workspace and specify the **WORKSPACE OWNER**. The workspace owner must be a valid Microsoft account (e.g., name@outlook.com).

    > [AZURE.NOTE] Later, you can share the experiments you're working on by inviting others to your workspace. You can do this in Machine Learning Studio on the **SETTINGS** page. You just need the Microsoft account or organizational account for each user.

6. Specify the Azure **LOCATION**, then enter an existing Azure **STORAGE ACCOUNT** or select **Create a new storage account** to create a new one.
7. Click **CREATE AN ML WORKSPACE**.

After your Machine Learning workspace is created, you will see it listed on the **machine learning** page.

For information about managing your workspace, see [Manage an Azure Machine Learning workspace].
If you encounter a problem creating your workspace, see [Troubleshooting guide: Create and connect to an Machine Learning workspace].

[Manage an Azure Machine Learning workspace]: machine-learning-manage-workspace.md
[Troubleshooting guide: Create and connect to an Machine Learning workspace]: machine-learning-troubleshooting-creating-ml-workspace.md
 
<!-- ![List of Machine Learning workspaces][2] -->

<!--Anchors-->
[To create a workspace]: #createworkspace

<!--Image references-->
[1]: media/machine-learning-create-workspace/cw1.png
[2]: media/machine-learning-create-workspace/cw2.png
[3]: media/machine-learning-create-workspace/cw3.png



<!--Link references-->
