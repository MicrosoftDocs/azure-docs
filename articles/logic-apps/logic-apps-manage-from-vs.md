---
title: Manage logic apps in Visual Studio - Azure Logic Apps | Microsoft Docs
description: Manage logic apps and other Azure assets with Visual Studio Cloud Explorer
author: klam
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 12/19/2016
ms.author: LADocs; klam
---

# Manage your logic apps with Visual Studio Cloud Explorer

Although the [Azure portal](https://portal.azure.com/) 
offers a great way for you to design and manage Azure Logic Apps, 
you can use Visual Studio Cloud Explorer for managing many Azure assets, 
including logic apps. Visual Studio Cloud Explorer lets you browse, 
manage, edit, and download published logic apps. 
Management tasks include enable, disable, and view run history. 

Before you can access and manage your logic apps in Visual Studio, 
install and configure these Visual Studio tools for Azure Logic Apps. 

## Prerequisites

* [Visual Studio 2015 or Visual Studio 2017](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
* [Latest Azure SDK](https://azure.microsoft.com/downloads/) (2.9.1 or greater)
* [Visual Studio Cloud Explorer](https://marketplace.visualstudio.com/items?itemName=MicrosoftCloudExplorer.CloudExplorerforVisualStudio2015)
* Access to the web when using the embedded designer

## Install Visual Studio tools for Logic Apps

After you install the prerequisites, 
download and install the Azure Logic Apps Tools 
for Visual Studio.

1. Open Visual Studio. On the **Tools** menu, 
select **Extensions and Updates**.
2. Expand the **Online** category so you can search online 
in the Visual Studio Gallery.
3. Browse or search for **Logic Apps** until 
you find **Azure Logic Apps Tools for Visual Studio**.
4. To download and install the extension, click **Download**.
5. Restart Visual Studio after installation.

> [!NOTE]
> To download the Azure Logic Apps Tools 
> for Visual Studio directly, go to the 
> [Visual Studio Marketplace](https://visualstudiogallery.msdn.microsoft.com/e25ad307-46cf-412e-8ba5-5b555d53d2d9).

## Browse for logic apps in Cloud Explorer

1.	To open Cloud Explorer, on the **View** menu, choose **Cloud Explorer**.
2.	Browse for your logic app, either by resource group or by resource type. 

	* If you browse by resource type, select your Azure subscription, 
	expand the **Logic Apps** section, and select your logic app. 
	* If you browse by resource group, expand the resource group 
	that has your logic app, and select your logic app.

	To view commands for your logic app, either right-click your logic app, 
	or at the bottom of Cloud Explorer, choose from the **Actions** menu.

	![Browse for your logic app](./media/logic-apps-manage-from-vs/browse.png)

## Edit your logic app with Logic Apps Designer

From Cloud Explorer, you can open a currently deployed logic app 
in the same designer that you use in the Azure portal. 

* To edit your logic app, in Cloud Explorer, 
right-click your logic app, and select **Open with Logic App Editor**. 

* To publish your updates to the cloud, choose **Publish**. 

* To start a new run, choose **Run Trigger**.

![Logic Apps Designer](./media/logic-apps-manage-from-vs/designer.png)

From the designer, you can also **Download** a logic app. 
This action automatically parameterizes the logic app definition, 
and saves the definition as an Azure Resource Manager deployment template. 
You can add this deployment template to your Azure Resource Group project.

## Browse your logic app run history

To view the run history for your logic app, 
right-click your logic app, and select **Open run history**. 
To reorder your run history based on any of the properties shown, 
select the column header.

![Run history](media/logic-apps-manage-from-vs/runs.png)

To show the run history for an instance so you can review the run results, 
including the inputs and outputs from each step, 
double-click one of the run instances.

![Run history results, inputs, and outputs from steps](./media/logic-apps-manage-from-vs/history.png)

## Next steps

* [Create your first logic app](logic-apps-create-a-logic-app.md)
* [Design, build, and deploy logic apps in Visual Studio](logic-apps-deploy-from-vs.md)
* [View common examples and scenarios](logic-apps-examples-and-scenarios.md)
* [Video: Automate business processes with Azure Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694)
* [Video: Integrate your systems with Azure Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)
