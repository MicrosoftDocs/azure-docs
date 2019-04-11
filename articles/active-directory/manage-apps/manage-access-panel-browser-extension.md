---
title: Troubleshooting the Azure Access Panel Extension for IE | Microsoft Docs
description: How to use group policy to deploy the Internet Explorer add-on for the My Apps portal.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
ms.service: active-directory
ms.subservice: app-mgmt
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/11/2019
ms.author: celested
ms.reviewer: asteen
ms.custom: H1Hack27Feb2017

ms.collection: M365-identity-device-management
---
# Troubleshooting the Access Panel Extension for Internet Explorer
This article helps you troubleshoot the following problems:

* You're unable to access your apps through the My Apps portal while using Internet Explorer.
* You see the "Install Software" message even though you've already installed the software.

If you are an admin, see also: [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](deploy-access-panel-browser-extension.md)

## Run the diagnostic tool
You can diagnose installation problems with the Access Panel Extension by downloading and running the Access Panel diagnostic tool:

1. [Click here to download the diagnostic tool.](https://account.activedirectory.windowsazure.com/applications/AccessPanelExtensionDiagnosticTool/AccessPanelExtensionDiagnosticTool.zip)

2. Open the file, and then extract the contents to your computer.
   
3. To run the tool, right-click the file named *AccessPanelExtensionDiagnosticTool.js*, then select **Open with > Microsoft Windows Based Script Host**.
   
    ![Open with > Microsoft Windows Based Script Host](./media/manage-access-panel-browser-extension/open_tool.png)

  The diagnostic results appear, which describes what might be wrong with your installation.

4. Select **Yes** fix the issues. To save these changes, close every Internet Explorer window, and then open Internet Explorer again. If you still can't access your apps, try the steps below.

## Check that the Access Panel Extension is enabled

To verify that the Access Panel Extension is enabled in Internet Explorer:

1. In Internet Explorer, select the **Gear icon** on the upper-right corner of the window, and then select **Internet options**. In older versions of Internet Explorer you can find this under **Tools** > **Internet options**.
   
2. Go to the **Programs** tab and select **Manage add-ons**.
   
3. In this dialog, select **Access Panel Extension** and then select **Enable**.
   
4. Close the Internet Explorer windows you have open to save these changes. The change takes effect the next time you open an Internet Explorer browser.

## Enable extensions for InPrivate Browsing

To enable extensions for InPrivate Browsing:

1. In Internet Explorer, select the **Gear icon** on the upper-right corner of the window, and then select **Internet options**. In older versions of Internet Explorer you can find this under **Tools** > **Internet options**.
   
2. Go to the **Privacy** tab and verify that the **Disable toolbars and extensions when InPrivate Browsing starts** check box is clear.
   
3.  Close the Internet Explorer windows you have open to save these changes. The change takes effect the next time you open an Internet Explorer browser.

## Uninstall the Access Panel Extension

To uninstall the Access Panel Extension from your computer:

1. In Control Panel, search for **uninstall**. Select **Uninstall a program**.
   
    ![Search for uninstall program.](./media/manage-access-panel-browser-extension/uninstall-program-control-panel.png)

2. From the list, select **Access Panel Extension**, and then select **Uninstall**.
   
3. You can then try to install the extension again to see if the problem has been resolved.

If you encounter issues uninstalling the extension, you can also remove it using the [Microsoft Fix It](https://go.microsoft.com/?linkid=9779673) tool.

## Related Articles
* [Application access and single sign-on with Azure Active Directory](what-is-single-sign-on.md)
* [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](deploy-access-panel-browser-extension.md)

