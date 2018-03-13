---
title: Manage logic apps with Visual Studio - Azure Logic Apps | Microsoft Docs
description: Manage logic apps and other Azure assets with Visual Studio Cloud Explorer
author: ecfan
manager: SyntaxC4
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/16/2018
ms.author: estfan; LADocs
---

# Manage logic apps with Visual Studio

Although you can build, edit, manage, and deploy logic apps 
in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, 
you can also use Visual Studio when you want to add logic apps to source control, 
publish different versions, and create Azure Resource Manager templates for 
different deployment environments. With Visual Studio Cloud Explorer, 
you can find and manage your logic apps along with other Azure resources. 
For example, you can open, download, edit, run, view run history, 
disable, and enable logic apps that are already deployed in the Azure portal. 

> [!IMPORTANT]
> Deploying or publishing a logic app from Visual Studio 
> overwrites the version of that app in the Azure portal. 
> So if you make changes in the Azure portal that you want to keep, 
> make sure that you [refresh the logic app in Visual Studio](#refresh) 
> from the Azure portal before the next time you deploy or publish from Visual Studio.

<a name="requirements"></a>

## Prerequisites

* If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* Download and install these tools, if you don't have them already: 

  * <a href="https://www.visualstudio.com/downloads" target="_blank">Visual Studio 2017 or Visual Studio 2015 - Community edition or greater</a>. 
  This quickstart uses Visual Studio Community 2017, which is free.

  * <a href="https://azure.microsoft.com/downloads/" target="_blank">Azure SDK (2.9.1 or later)</a> 
  and <a href="https://github.com/Azure/azure-powershell#installation" target="_blank">Azure PowerShell</a>

  * <a href="https://marketplace.visualstudio.com/items?itemName=VinaySinghMSFT.AzureLogicAppsToolsforVisualStudio-18551" target="_blank">Azure Logic Apps Tools for Visual Studio 2017</a> 
  or the <a href="https://marketplace.visualstudio.com/items?itemName=VinaySinghMSFT.AzureLogicAppsToolsforVisualStudio" target="_blank">Visual Studio 2015 version</a> 
  
    You can either download and install Azure Logic Apps Tools 
    directly from the Visual Studio Marketplace, or learn 
    <a href="https://docs.microsoft.com/visualstudio/ide/finding-and-using-visual-studio-extensions" target="_blank">how to install this extension from inside Visual Studio</a>. 
    Make sure that you restart Visual Studio after you finish installing.

* Access to the web while using the embedded Logic App Designer

  The designer requires an internet connection to create resources in Azure 
  and to read the properties and data from connectors in your logic app. 
  For example, if you use the Dynamics CRM Online connector, 
  the designer checks your CRM instance for available 
  default and custom properties.

## Find your logic apps

In Visual Studio, you can find all the deployed logic 
apps that are associated with your Azure subscription 
by using Cloud Explorer.

1. Open Visual Studio. On the **View** menu, select **Cloud Explorer**.

2. In Cloud Explorer, choose **Account Management**. 
Select the Azure subscription associated with your logic apps, 
then choose **Apply**. For example:

   ![Choose "Account Management"](./media/manage-logic-apps-with-visual-studio/account-management-select-Azure-subscription.png)

2. Based on whether you're searching by **Resource Groups** 
or **Resource Types**, follow these steps:

   * **Resource Groups**: Under your Azure subscription, 
   Cloud Explorer shows all the resource groups that are 
   associated with that subscription. 
   Expand the resource group that contains your logic app, 
   then select your logic app.

   * **Resource Types**: Under your Azure subscription, 
   expand **Logic Apps**. After Cloud Explorer shows all 
   the deployed logic apps that are associated with your subscription, 
   select your logic app.

<a name="open-designer"></a>

## Open in Logic App Designer

* To open a logic app that's deployed in Azure with Visual Studio, 
in Cloud Explorer, find the logic app. Open the app's shortcut menu, 
and select **Open With Logic App Editor**.

  This example shows logic apps by resource type, 
  so your logic apps appear under the **Logic Apps** section.

  ![Open deployed logic app from Azure portal](./media/manage-logic-apps-with-visual-studio/open-logic-app-in-editor.png)

   The .json file that opens contains only the logic app's 
   underlying definition and is not an 
   [Azure Resource Manager deployment template](../azure-resource-manager/resource-manager-create-first-template.md). 
   To get the deployment template, 
   [download the logic app from the Azure portal](#download-logic-app).
   Learn more about [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

* To open a logic app created in a Visual Studio solution, 
in Solution Explorer, open the shortcut menu for your 
logic app definition and deployment template, 
which is usually **LogicApp.json**. Select **Open With Logic App Designer**.

  ![Open logic app in a Visual Studio solution](./media/manage-logic-apps-with-visual-studio/open-logic-app-designer.png)

  The "LogicApp.json" file for a logic app created in Visual Studio 
  contains that logic app's underlying definition and is also a 
  [Azure Resource Manager deployment template](../azure-resource-manager/resource-manager-create-first-template.md). 
  Both are combined into a single JavaScript Object Notation (JSON) file 
  where your logic app definition appears in the `resources` subsection.  
  Learn more about [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

<a name="download-logic-app"></a>

## Download from Azure

You can download logic apps from the 
<a href="https://portal.azure.com" target="_blank">Azure portal</a> 
so that you can work on them locally with Visual Studio. 
This step automatically *parameterizes* logic app definitions, 
representing them as parameters, and saves them as 
[Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) 
deployment templates in JavaScript Object Notation (JSON) format (.json file).

1. In Cloud Explorer, find and select the logic app that you want to download from Azure.

2. On that app's shortcut menu, select **Open With Logic App Editor**.

   The .json file that opens contains only the logic app's underlying definition 
   and is not an [Azure Resource Manager deployment template](../azure-resource-manager/resource-manager-create-first-template.md). 
   Learn more about [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

3. After the logic app appears, on the designer's toolbar, choose **Download**.

   ![Choose "Download"](./media/manage-logic-apps-with-visual-studio/download-logic-app.png)

4. When you're prompted for a location, browse to that location and save 
the logic app definition as a .json file. 

   The downloaded .json file contains the logic app's underlying definition 
   and is also a [Azure Resource Manager deployment template](../azure-resource-manager/resource-manager-create-first-template.md). 
   Both are combined into a single JavaScript Object Notation (JSON) file 
   where your logic app definition appears in the `resources` subsection. 
   Learn more about [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

You can now edit the logic app with Visual Studio. 

<a name="refresh"></a>

## Refresh from Azure

If you edit your logic app in the Azure portal and want to keep those changes, 
make sure that you refresh that app's version in Visual Studio with those changes. 

* In Visual Studio, on the Logic App Designer toolbar, choose **Refresh**.

  -or-

* In Visual Studio Cloud Explorer, open your logic app's shortcut menu, 
and select **Refresh**. 

![Refresh logic app with updates](./media/manage-logic-apps-with-visual-studio/refresh-logic-app.png)

## Publish logic app updates

When you're ready to deploy your logic app updates from Visual Studio to Azure, 
on the Logic App Designer toolbar, choose **Publish**.

![Publish updated logic app](./media/manage-logic-apps-with-visual-studio/publish-logic-app.png)

## Manually run your logic app

You can manually trigger a logic app deployed in Azure from Visual Studio. 
On the Logic App Designer toolbar, choose **Run Trigger**.

![Manually run logic app](./media/manage-logic-apps-with-visual-studio/manually-run-logic-app.png)

## Review run history

To check the status and diagnose problems with logic app runs, 
you can review the details, such as inputs and outputs, from those runs in Visual Studio.

1. In Cloud Explorer, open your logic app's shortcut menu, 
and select **Open run history**.

   ![Open run history](./media/manage-logic-apps-with-visual-studio/view-run-history.png)

2. To view the details for a specific run, double-click a run. 
For example:

   ![Detailed run history](./media/manage-logic-apps-with-visual-studio/view-run-history-details.png)
  
   > [!TIP]
   > To sort the table by property, 
   > choose the column header for that property. 

3. Expand the steps whose inputs and outputs you want to review. 
For example:

   ![View inputs and outputs for each step](./media/manage-logic-apps-with-visual-studio/run-inputs-outputs.png)

## Stop or restart your logic app

To stop running your logic app without deleting, in Cloud Explorer, 
open your logic app's shortcut menu, and select **Disable**.

![Stop running your logic app](./media/manage-logic-apps-with-visual-studio/disable-logic-app.png)

To restart your logic app, in Cloud Explorer, 
open your logic app's shortcut menu, and select **Enable**.

![Restart running your logic app](./media/manage-logic-apps-with-visual-studio/enable-logic-app.png)

## Delete your logic app

To delete your logic app from the Azure portal, 
in Cloud Explorer, open your logic app's shortcut menu, 
and select **Delete**.

![Delete your logic app](./media/manage-logic-apps-with-visual-studio/delete-logic-app.png)

## Next steps

In this article, you learned how to edit and manage deployed logic apps with Visual Studio. 
Next, learn about advanced deployment for logic apps with Visual Studio:

> [!div class="nextstepaction"]
> [Perform advanced deployment with Visual Studio](../logic-apps/logic-apps-deploy-from-vs.md)
