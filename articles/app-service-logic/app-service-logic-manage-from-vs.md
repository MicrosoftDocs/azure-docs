---
title: Manage Logic Apps from Visual Studio Cloud Explorer | Microsoft Docs
description: Manage Logic Apps from Visual Studio Cloud Explorer.
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
ms.date: 12/19/2016
ms.author: klam

---
# Build and Deploy Logic Apps in Visual Studio
Although the [Azure Portal](https://portal.azure.com/) gives you a great way to design and manage your Logic apps, you may also want to design and deploy your logic app from Visual Studio instead.  Logic Apps comes with a rich Visual Studio toolset which allows you to build a logic app using the designer, configure any deployment and automation templates, and deploy into any environment.  

## Installation steps
Below are the steps to install and configure the Visual Studio tools for Logic Apps.

### Prerequisites
* [Visual Studio 2015](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
* [Latest Azure SDK](https://azure.microsoft.com/downloads/) (2.9.1 or greater)
* [Visual Studio Cloud Explorer](https://marketplace.visualstudio.com/items?itemName=MicrosoftCloudExplorer.CloudExplorerforVisualStudio2015)
* Access to the web when using the embedded designer

### Install Visual Studio tools for Logic Apps
Once you have the prerequisites installed, 

1. Open Visual Studio 2015 to the **Tools** menu and select **Extensions and Updates**
2. Select the **Online** category to search online
3. Search for **Logic Apps** to display the **Azure Logic Apps Tools for Visual Studio**
4. Click the **Download** button to download and install the extension
5. Restart Visual Studio after installation

> [!NOTE]
> You can also download the extension directly from [this link](https://visualstudiogallery.msdn.microsoft.com/e25ad307-46cf-412e-8ba5-5b555d53d2d9)
> 
> 

## Browsing Logic Apps
To browse Logic Apps in Cloud Explorer open the cloud explorer under View > Cloud Explorer and you can either browse by resource group or by resource type.  If browsing by resource type, select a subscription and then expand the Logic Apps section then select a Logic App.  You can either right-click one of your Logic Apps or use the Actions menu at the bottom of the cloud explorer to perform the desired action.
![Browse](./media/app-service-logic-manage-from-vs/browse.png)

## Edit Logic App with the designer
Right-click on the Logic App and select "Open with Logic App Editor".  This will open the currently deployed Logic App in the same designer that is in the Azure management portal.  With the designer you can edit the Logic App and save it back to the cloud as well as start a new run with "Run Trigger" button.

![Designer](./media/app-service-logic-manage-from-vs/designer.png)

## Browse Logic App run history
Right-click on the Logic App and select "Open run history".  This will list the run history for the Logic App.  In this view you can order by any of the shown properties by selecting the column header.  

![Runs](./media/app-service-logic-manage-from-vs/runs.png)

Double-clicking on one of the run instances will show the run history for that instance where you can see the results of the run including the inputs and outputs of each step.

![History](./media/app-service-logic-manage-from-vs/history.png)

## Next Steps
* To get started with Logic Apps, follow the [create a Logic App](app-service-logic-create-a-logic-app.md) tutorial.  
* [View common examples and scenarios](app-service-logic-examples-and-scenarios.md)
* [You can automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
* [Learn How to Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)

