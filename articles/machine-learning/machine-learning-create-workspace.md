<properties
	pageTitle="Create a Machine Learning workspace | Microsoft Azure"
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
	ms.date="05/23/2016"
	ms.author="garye;bradsev;ahgyger"/>


# Create and share an Azure Machine Learning workspace

This menu links to topics that describe how to set up the various data science environments used by the Cortana Analytics Process (CAPS).

[AZURE.INCLUDE [data-science-environment-setup](../../includes/cap-setup-environments.md)]

To use Azure Machine Learning Studio, you need to have a Machine Learning workspace. This workspace contains the tools you need to create, manage, and publish experiments.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## To create a workspace

1. Sign-in to the [Microsoft Azure classic portal].

> [AZURE.NOTE] To sign-in, you need to be an Azure subscription administrator. Being the owner of a Machine Learning workspace will not give you access to the [Microsoft Azure classic portal]. See [Privileges of Azure subscription administrator and workspace owner](#subscriptionvsworkspace) for more details.

2. In the Microsoft Azure services panel, click **MACHINE LEARNING**.

    ![Machine Learning service][1]

3. Click **+NEW** at the bottom of the window.
4. Click **DATA SERVICES**, then **MACHINE LEARNING**, then **QUICK CREATE**.

	![Quick Create of new workspace][3]

5. Enter a **WORKSPACE NAME** for your workspace.
6. Specify the Azure **LOCATION**, then enter an existing Azure **STORAGE ACCOUNT** or select **Create a new storage account** to create a new one.
7. Click **CREATE AN ML WORKSPACE**.

After your Machine Learning workspace is created, you will see it listed on the **machine learning** page.

## Sharing an Azure Machine Learning workspace

Once a Machine Learning workspace is created, you can invite users to your workspace and share access to your workspace and all of its experiments. We support two roles of users:

- **User** - A workspace user can create, open, modify and delete datasets, experiments and web services in the workspace.
- **Owner** - An owner can invite, remove, and list users with access to the workspace, in addition to what a user can do. He/she also have access to Notebooks.

### To share a workspace
1. Sign-in to [Machine Learning Studio]
2. In the Machine Learning Studio panel, click **SETTINGS**
3. Click **USERS**
4. Click **INVITE MORE USERS**

    ![Invite more users][4]

5. Enter one or more email address. The user just need a valid Microsoft account (e.g., name@outlook.com) or an organizational account (from Azure Active Directory).
6. Click the check button.

Each user you added will receive an email with instruction to log-in to the shared workspace.

For information about managing your workspace, see [Manage an Azure Machine Learning workspace].
If you encounter a problem creating your workspace, see [Troubleshooting guide: Create and connect to an Machine Learning workspace].

## <a name="subscriptionvsworkspace"></a>Privileges of Azure subscription administrator and of workspace owner

Below is a table clarifying the difference between an Azure subscription administrator and a workspace owner.

| Actions        			| Azure subscription administrator | Workspace owner  |
| --------------			|:------------------------:| :----------------:|
| Access [Microsoft Azure classic portal]| Yes 	       | No				   |
| Create a new workspace                 | Yes         | No				   |
| Delete a workspace                     | Yes	       | No				   |
| Add endpoint to a web service          | Yes		   | No				   |
| Delete endpoint from a web service     | Yes 		   | No				   |
| Change concurrency for a web service   | Yes 		   | No				   |
| Access [Machine Learning Studio]       | No *	       | Yes			   |


> [AZURE.NOTE] * An Azure subscription administrator is automatically added to the the workspace he/she creates as workspace Owner. However, simply being an Azure subscription administrator doesn't grant him/her access to any workspace under that subscription.

<!-- ![List of Machine Learning workspaces][2] -->

<!--Anchors-->
[To create a workspace]: #createworkspace

<!--Image references-->
[1]: media/machine-learning-create-workspace/cw1.png
[2]: media/machine-learning-create-workspace/cw2.png
[3]: media/machine-learning-create-workspace/cw4.png
[4]: media/machine-learning-create-workspace/cw5.png


<!--Link references-->
[Manage an Azure Machine Learning workspace]: machine-learning-manage-workspace.md
[Troubleshooting guide: Create and connect to an Machine Learning workspace]: machine-learning-troubleshooting-creating-ml-workspace.md
[Machine Learning Studio]: https://studio.azureml.net/  
[Microsoft Azure classic portal]: https://manage.windowsazure.com/
