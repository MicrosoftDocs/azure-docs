---
title: 'Troubleshoot: Create and connect to a Machine Learning workspace | Microsoft Docs'
description: Solutions for common issues in creating and connecting to an Azure Machine Learning workspace
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 1a8aec4b-35f9-44e8-9570-2575b8979ab1
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: garye

---
# Troubleshooting guide: Create and connect to an Machine Learning workspace
This guide provides solutions for some frequently encountered challenges when you are setting up Azure Machine Learning workspaces.

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Workspace owner
To open a workspace in Machine Learning Studio, you must be signed in to the Microsoft Account you used to create the workspace, or you need to receive an invitation from the owner to join the workspace. From the Azure portal you can manage the workspace, which includes the ability to configure access.

For more information on managing a workspace, see [Manage an Azure Machine Learning workspace].

[Manage an Azure Machine Learning workspace]: machine-learning-manage-workspace.md

## Allowed regions
Machine Learning is currently available in a limited number of regions. If your subscription does not include one of these regions, you may see the error message, “You have no subscriptions in the allowed regions.”

To request that a region be added to your subscription, create a new Microsoft support request from the Azure portal, choose **Billing** as the problem type, and follow the prompts to submit your request.

## Storage account
The Machine Learning service needs a storage account to store data. You can use an existing storage account, or you can create a new storage account when you create the new Machine Learning workspace (if you have quota to create a new storage account).

After the new Machine Learning workspace is created, you can sign in to Machine Learning Studio by using the Microsoft account you used to create the workspace. If you encounter the error message, “Workspace Not Found” (similar to the following screenshot), please use the following steps to delete your browser cookies.

![Workspace not found][screen3]

**To delete browser cookies**

1. If you use Internet Explorer, click the **Tools** button in the upper-right corner and select **Internet options**.  

![Internet options][screen4]

2. Under the **General** tab, click **Delete…**

![General tab][screen5]

3. In the **Delete Browsing History** dialog box, make sure **Cookies and website data** is selected, and click **Delete**.

![Delete cookies][screen6]

After the cookies are deleted, restart the browser and then go to the [Microsoft Azure Machine Learning](https://studio.azureml.net) page. When you are prompted for a user name and password, enter the same Microsoft account you used to create the workspace.

## Comments

Our goal is to make the Machine Learning experience as seamless as possible. Please post any comments and issues at the [Azure Machine Learning forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning) to help us serve you better.

[screen1]:media/machine-learning-troubleshooting-creating-ml-workspace/screen1.png
[screen2]:media/machine-learning-troubleshooting-creating-ml-workspace/screen2.png
[screen3]:media/machine-learning-troubleshooting-creating-ml-workspace/screen3.png
[screen4]:media/machine-learning-troubleshooting-creating-ml-workspace/screen4.png
[screen5]:media/machine-learning-troubleshooting-creating-ml-workspace/screen5.png
[screen6]:media/machine-learning-troubleshooting-creating-ml-workspace/screen6.png
