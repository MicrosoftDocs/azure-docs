---
title: Troubleshooting a workspace
titleSuffix: Azure Machine Learning Studio
description: This guide provides solutions for some frequently encountered challenges when you are setting up Azure Machine Learning Studio workspaces.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 03/20/2017
---
# Troubleshooting guide: Create and connect to an Azure Machine Learning Studio workspace
This guide provides solutions for some frequently encountered challenges when you are setting up Azure Machine Learning Studio workspaces.



## Workspace owner
To open a workspace in Machine Learning Studio, you must be signed in to the Microsoft Account you used to create the workspace, or you need to receive an invitation from the owner to join the workspace. From the Azure portal you can manage the workspace, which includes the ability to configure access.

For more information on managing a workspace, see [Manage an Azure Machine Learning Studio workspace].

[Manage an Azure Machine Learning Studio workspace]: manage-workspace.md

## Allowed regions
Machine Learning is currently available in a limited number of regions. If your subscription does not include one of these regions, you may see the error message, “You have no subscriptions in the allowed regions.”

To request that a region be added to your subscription, create a new Microsoft support request from the Azure portal, choose **Billing** as the problem type, and follow the prompts to submit your request.

## Storage account
The Machine Learning service needs a storage account to store data. You can use an existing storage account, or you can create a new storage account when you create the new Machine Learning Studio workspace (if you have quota to create a new storage account).

After the new Machine Learning Studio workspace is created, you can sign in to Machine Learning Studio by using the Microsoft account you used to create the workspace. If you encounter the error message, “Workspace Not Found” (similar to the following screenshot), please use the following steps to delete your browser cookies.

![Workspace not found](media/troubleshooting-creating-ml-workspace/screen3.png)

**To delete browser cookies**

1. If you use Internet Explorer, click the **Tools** button in the upper-right corner and select **Internet options**.  

   ![Internet options](media/troubleshooting-creating-ml-workspace/screen4.png)

2. Under the **General** tab, click **Delete…**

   ![General tab](media/troubleshooting-creating-ml-workspace/screen5.png)

3. In the **Delete Browsing History** dialog box, make sure **Cookies and website data** is selected, and click **Delete**.

   ![Delete cookies](media/troubleshooting-creating-ml-workspace/screen6.png)

After the cookies are deleted, restart the browser and then go to the [Microsoft Azure Machine Learning Studio](https://studio.azureml.net) page. When you are prompted for a user name and password, enter the same Microsoft account you used to create the workspace.

## Comments

Our goal is to make the Machine Learning experience as seamless as possible. Please post any comments and issues at the [Azure Machine Learning forum](https://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning) to help us serve you better.
