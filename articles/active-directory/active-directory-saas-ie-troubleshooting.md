<properties
    pageTitle="Troubleshooting the Access Panel Extension for Internet Explorer | Microsoft Azure"
    description="How to use group policy to deploy the Internet Explorer add-on for the My Apps portal."
    services="active-directory"
    documentationCenter=""
    authors="MarkusVi"
    manager="stevenpo"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="05/19/2016"
    ms.author="markvi;liviodlc"/>

#Troubleshooting the Access Panel Extension for Internet Explorer

This article will help you troubleshoot the following problems:

- You're unable to access your apps through the My Apps portal while using Internet Explorer.
- You see the "Install Software" message even though you've already installed the software.

If you are an admin, see also: [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md)

##Run the Diagnostic Tool

You can diagnose installation problems with the Access Panel Extension by downloading and running the Access Panel diagnostic tool:

1. [Click here to download the diagnostic tool.](https://account.activedirectory.windowsazure.com/applications/AccessPanelExtensionDiagnosticTool/AccessPanelExtensionDiagnosticTool.zip)

2. Open the file, and press **Extract all** button.

	![Press Extract All](./media/active-directory-saas-ie-troubleshooting/extract1.png)

3. Then press the **Extract** button to continue.

	![Press Extract](./media/active-directory-saas-ie-troubleshooting/extract2.png)

4. To run the tool, right-click the file named **AccessPanelExtensionDiagnosticTool**, then select **Open with > Microsoft Windows Based Script Host**.

	![Open with > Microsoft Windows Based Script Host](./media/active-directory-saas-ie-troubleshooting/open_tool.png)

5. You will then see the following diagnostic window, which describes what might be wrong with your installation.

	![A sample of the diagnostic window](./media/active-directory-saas-ie-troubleshooting/tool_preview.png)

6. Click "**YES**" to let the program fix the issues that have been found.

7. To save these changes, close every Internet Explorer window, and then open Internet Explorer again.<br />If you still can't access your apps, try the steps below.

##Check that the Access Panel Extension is enabled

To verify that the Access Panel Extension is enabled in Internet Explorer:

1. In Internet Explorer, click on the **Gear icon** on the top right corner of the window. Then select **Internet options**.<br />(In older versions of Internet Explorer you can find this under **Tools > Internet options**.

	![Go to Tools > Internet Options](./media/active-directory-saas-ie-troubleshooting/internetoptions.png)

2. Click on the **Programs** tab, then click on the **Manage add-ons** button.

	![Click Manage Add-Ons](./media/active-directory-saas-ie-troubleshooting/internetoptions_programs.png)

3. In this dialog, select **Access Panel Extension** and then click the **Enable** button.

	![Click Enable](./media/active-directory-saas-ie-troubleshooting/enableaddon.png)

4. To save these changes, close every Internet Explorer window and then open Internet Explorer again.

##Enable Extensions for InPrivate Browsing

If you are using the InPrivate Browsing mode:

1. In Internet Explorer, click on the **Gear icon** on the top right corner of the window. Then select **Internet options**.<br />(In older versions of Internet Explorer you can find this under **Tools > Internet options**.

	![A sample of the diagnostic window](./media/active-directory-saas-ie-troubleshooting/inprivateoptions.png)

2. Go to the **Privacy** tab, then **uncheck** the checkbox labeled **Disable toolbars and extensions when InPrivate Browsing starts**</p>

	![Uncheck Disable toolbars and extensions when InPrivate Browsing starts](./media/active-directory-saas-ie-troubleshooting/enabletoolbars.png)

3. To save these changes, close every Internet Explorer window and then open Internet Explorer again.

##Uninstall the Access Panel Extension

To uninstall the Access Panel extension from your computer:

1. On your keyboard, press the **Windows key** to open the Start menu. When the menu is open, you can type anything to do a search. Type "Control Panel" and then open the **Control Panel** when it appears in the search results.

	![Search for Control Panel](./media/active-directory-saas-ie-troubleshooting/search_sm.png)

2. In the top right corner of the Control Panel, change the **View by** option to **Large icons**. Then find and click on the **Programs and Features** button.

	![Chang the view to show Large Icons](./media/active-directory-saas-ie-troubleshooting/control_panel.png)

3. From the list, select **Access Panel Extension**, and the click on the **Uninstall** button.

	![Click Uninstall](./media/active-directory-saas-ie-troubleshooting/uninstall.png)

4. You can then try to install the extension again to see if the problem has been resolved.

If you encounter issues uninstalling the extension, you can also remove it using the [Microsoft Fix It](https://go.microsoft.com/?linkid=9779673) tool.

## Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md)
- [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md)
