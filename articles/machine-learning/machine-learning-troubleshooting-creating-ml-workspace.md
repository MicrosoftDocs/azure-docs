<properties
	pageTitle="Troubleshoot: Create and connect to a Machine Learning workspace | Microsoft Azure"
	description="Solutions for common issues in creating and connecting to an Azure Machine Learning workspace"
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
	ms.date="06/10/2016"
	ms.author="garye"/>


# Troubleshooting guide: Create and connect to an Machine Learning workspace

This guide provides solutions for some frequently encountered challenges when you are setting up Azure Machine Learning workspaces.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Workspace owner

When you create a new Machine Learning workspace, the ID you enter in the WORKSPACE OWNER field must be a valid Microsoft account (formerly Windows Live ID), for example, john-contoso@live.com or john-contoso@hotmail.com. It cannot be a non-Microsoft account, such as your corporate email account. To create a free Microsoft account, go to [www.live.com](http://www.live.com).

Note that the account you used to sign in to the Azure classic portal to create the workspace does not automatically have permission to *open* that workspace, unless you specify that account as the owner. To open a workspace in Machine Learning Studio, you must be signed in to the Microsoft Account that was defined as the owner of the workspace, or you need to receive an invitation from the owner to join the workspace. From the Azure classic portal you can, however, *manage* the workspace, which includes the ability to change the owner and configure access.

For more information on managing a workspace, see [Manage an Azure Machine Learning workspace].

[Manage an Azure Machine Learning workspace]: machine-learning-manage-workspace.md

## Allowed regions

Machine Learning is currently available in a limited number of regions. If your subscription does not include one of these regions, you may see the error message, “You have no subscriptions in the allowed regions.”

To request that a region be added to your subscription, select **Contact Microsoft Support** from the Azure Classic Portal, choose **Billing** as the problem type, and follow the prompts to submit your request.

![Contact Microsoft support][screen1]

## Storage account

The Machine Learning service needs a storage account to store data. You can use an existing storage account, or you can create a new storage account when you create the new Machine Learning workspace (if you have quota to create a new storage account).

<!-- These instructions no longer work, but I'm not sure what to replace them with
To see if you can create a new storage account, in the Classic Portal, go to **Settings** and then click **Usage**.
-->

![Create workspace][screen2]

After the new Machine Learning workspace is created, you can sign in to Machine Learning Studio by using the Microsoft account you specified as the owner of the workspace. If you encounter the error message, “Workspace Not Found” (similar to the following screenshot), please use the following steps to delete your browser cookies.

![Workspace not found][screen3]

**To delete browser cookies**

If you use Internet Explorer, click the **Tools** button in the upper-right corner and select **Internet options**.  

![Internet options][screen4]

Under the **General** tab, click **Delete…**

![General tab][screen5]

In the **Delete Browsing History** dialog box, make sure **Cookies and website data** is selected, and click **Delete**.

![Delete cookies][screen6]

After the cookies are deleted, restart the browser and then go to the [Microsoft Azure Machine Learning](https://studio.azureml.net) page. When you are prompted for a user name and password, enter the same Microsoft account you specified as the owner of the workspace.

Our goal is to make the Machine Learning experience as seamless as possible. Please post any comments and issues at the [Azure Machine Learning forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning) to help us serve you better.

[screen1]:media/machine-learning-troubleshooting-creating-ml-workspace/screen1.png
[screen2]:media/machine-learning-troubleshooting-creating-ml-workspace/screen2.png
[screen3]:media/machine-learning-troubleshooting-creating-ml-workspace/screen3.png
[screen4]:media/machine-learning-troubleshooting-creating-ml-workspace/screen4.png
[screen5]:media/machine-learning-troubleshooting-creating-ml-workspace/screen5.png
[screen6]:media/machine-learning-troubleshooting-creating-ml-workspace/screen6.png
