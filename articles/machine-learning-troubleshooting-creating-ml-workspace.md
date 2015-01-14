<properties title="" pageTitle="Troubleshooting Guide: Creating and connecting to an Azure Machine Learning workspace | Azure" description="Solutions for common issues in creating and connecting to an Azure Machine Learning workspace" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="Garyericson" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/25/2014" ms.author="garye" />


#Troubleshooting Guide: Creating and connecting to an Azure Machine Learning workspace

This guide provides solutions for some frequently encountered challenges setting up Azure ML Workspaces.

##Workspace owner

When you create a new Azure ML Workspace, the ID you enter in the field WORKSPACE OWNER must be a valid Microsoft account (formerly Windows Live ID), such as john-contoso@live.com or john-contoso@hotmail.com. It cannot be a non-Microsoft account, such as your corporate email account. To create a free Microsoft account, go to [www.live.com](http://www.live.com). 

##Allowed regions

Azure ML is currently in public preview in the South Central US region. If your subscription does not include South Central US, you may see the error “You have no subscriptions in the allowed regions. Allowed regions: South Central US.” 

To resolve this, select “Contact Microsoft Support” (shown below) from your Azure Portal and choose **Billing** as the **SUPPORT TYPE** to request that this region be added to your subscription. Azure ML will add multiple regions over time.

![Contact Microsoft support][screen1]

##Storage account
 
The Azure ML service needs a storage account to store data. You can use an existing storage account in the South Central US or you can create a new storage account when you create the new ML workspace (if you have quota to create a new storage account). To see if you can create a new storage account, in the Azure Portal go to **Settings** then **Usage**.

![Create workspace][screen2]

After the new ML Workspace is created, you can sign in to ML Studio using the Microsoft account you specified as the owner of the workspace. If you encounter the error, “Workspace Not Found” similar to the screenshot below, please take the following steps to correct the problem.

![Workspace not found][screen3]

1. Flush the browser cookies.

	If you use Internet Explorer, click the **Tools** button in the upper-right corner and select **Internet options**.  

	![Internet options][screen4]

	Under the **General** tab, click **Delete…**

	![General tab][screen5]

	In the **Delete Browsing History** dialog, make sure **Cookies and website data** is selected, and click **Delete**.

	![Delete cookies][screen6]

2. After the cookies are flushed, restart the browser and then go to [https://studio.azureml.net](https://studio.azureml.net). When you are prompted for a user name and password, enter the same Microsoft account you specified as the owner of the workspace.

Our goal is to make the Azure ML experience as smooth and seamless as possible. Please post any comments and issues below or in the [Azure ML forum](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=MachineLearning) to help us serve you better. 

[screen1]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen1.png
[screen2]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen2.png
[screen3]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen3.png
[screen4]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen4.png
[screen5]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen5.png
[screen6]:./media/machine-learning-troubleshooting-creating-ml-workspace/screen6.png
