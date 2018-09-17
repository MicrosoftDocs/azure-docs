---
title: Troubleshooting the Azure Access Panel Extension for IE | Microsoft Docs
description: How to use group policy to deploy the Internet Explorer add-on for the My Apps portal.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/11/2018
ms.author: barbkess
ms.reviewer: asteen
ms.custom: H1Hack27Feb2017

---
# Troubleshooting the Access Panel Extension for Internet Explorer
This article helps you troubleshoot the following problems:

* You're unable to access your apps through the My Apps portal while using Internet Explorer.
* You see the "Install Software" message even though you've already installed the software.

If you are an admin, see also: [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](deploy-access-panel-browser-extension.md)

## Run the Diagnostic Tool
You can diagnose installation problems with the Access Panel Extension by downloading and running the Access Panel diagnostic tool:

1. [Click here to download the diagnostic tool.](https://account.activedirectory.windowsazure.com/applications/AccessPanelExtensionDiagnosticTool/AccessPanelExtensionDiagnosticTool.zip)
2. Open the file, and press **Extract all** button.
   
    ![Press Extract All](./media/manage-access-panel-browser-extension/extract1.png)
3. Then press the **Extract** button to continue.
   
    ![Press Extract](./media/manage-access-panel-browser-extension/extract2.png)
4. To run the tool, right-click the file named **AccessPanelExtensionDiagnosticTool**, then select **Open with > Microsoft Windows Based Script Host**.
   
    ![Open with > Microsoft Windows Based Script Host](./media/manage-access-panel-browser-extension/open_tool.png)
5. You will then see the following diagnostic window, which describes what might be wrong with your installation.
   
    ![A sample of the diagnostic window](./media/manage-access-panel-browser-extension/tool_preview.png)
6. Click "**YES**" to let the program fix the issues that have been found.
7. To save these changes, close every Internet Explorer window, and then open Internet Explorer again.<br />If you still can't access your apps, try the steps below.

## Check that the Access Panel Extension is enabled
To verify that the Access Panel Extension is enabled in Internet Explorer:

1. In Internet Explorer, click the **Gear icon** on the top right corner of the window. Then select **Internet options**.<br />(In older versions of Internet Explorer you can find this under **Tools > Internet options**.
   
    ![Go to Tools > Internet Options](./media/manage-access-panel-browser-extension/internetoptions.png)
2. Click the **Programs** tab, then click the **Manage add-ons** button.
   
    ![Click Manage Add-Ons](./media/manage-access-panel-browser-extension/internetoptions_programs.png)
3. In this dialog, select **Access Panel Extension** and then click the **Enable** button.
   
    ![Click Enable](./media/manage-access-panel-browser-extension/enableaddon.png)
4. To save these changes, close every Internet Explorer window and then open Internet Explorer again.

## Enable Extensions for InPrivate Browsing
If you are using the InPrivate Browsing mode:

1. In Internet Explorer, click the **Gear icon** on the top right corner of the window. Then select **Internet options**.<br />(In older versions of Internet Explorer you can find this under **Tools > Internet options**.
   
    ![A sample of the diagnostic window](./media/manage-access-panel-browser-extension/inprivateoptions.png)
2. Go to the **Privacy** tab, then **uncheck** the checkbox labeled **Disable toolbars and extensions when InPrivate Browsing starts**</p>
   
    ![Uncheck Disable toolbars and extensions when InPrivate Browsing starts](./media/manage-access-panel-browser-extension/enabletoolbars.png)
3. To save these changes, close every Internet Explorer window and then open Internet Explorer again.

## Uninstall the Access Panel Extension
To uninstall the Access Panel extension from your computer:

1. On your keyboard, press the **Windows key** to open the Start menu. When the menu is open, you can type anything to do a search. Type "Control Panel" and then open the **Control Panel** when it appears in the search results.
   
    ![Search for Control Panel](./media/manage-access-panel-browser-extension/search_sm.png)
2. In the top right corner of the Control Panel, change the **View by** option to **Large icons**. Then find and click the **Programs and Features** button.
   
    ![Chang the view to show Large Icons](./media/manage-access-panel-browser-extension/control_panel.png)
3. From the list, select **Access Panel Extension**, and the click the **Uninstall** button.
   
    ![Click Uninstall](./media/manage-access-panel-browser-extension/uninstall.png)
4. You can then try to install the extension again to see if the problem has been resolved.

If you encounter issues uninstalling the extension, you can also remove it using the [Microsoft Fix It](https://go.microsoft.com/?linkid=9779673) tool.

## Related Articles
* [Application access and single sign-on with Azure Active Directory](what-is-single-sign-on.md)
* [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](deploy-access-panel-browser-extension.md)

