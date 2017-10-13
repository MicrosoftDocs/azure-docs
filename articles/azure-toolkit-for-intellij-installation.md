---
title: Installing the Azure Toolkit for IntelliJ | Microsoft Docs
description: Learn how to install the Azure Toolkit for the IntelliJ IDEA.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: c6817c7b-f28c-4c06-8216-41c7a8117de3
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 04/14/2017
ms.author: robmcm

---
# Installing the Azure Toolkit for IntelliJ
The Azure Toolkit for IntelliJ provides templates and functionality that allow you to easily create, develop, test, and deploy Azure applications using the IntelliJ IDEA development environment. The Azure Toolkit for IntelliJ is an Open Source project, whose source code is available under the MIT License from the project's site on GitHub at the following URL:

<https://github.com/microsoft/azure-tools-for-java>

There are two methods of installing the Azure Toolkit for IntelliJ, from the Settings dialog box and from the Configure menu on the start screen; both installation methods will be demonstrated in the following steps.

[!INCLUDE [azure-toolkit-for-IntelliJ-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

## To install the Azure Toolkit for IntelliJ from the settings dialog box
1. Start IntelliJ IDEA.
2. When the IntelliJ IDEA opens, click **File**, then click **Settings**.
   
    ![Open the IntelliJ IDEA Settings Dialog Box][01a]
3. In the Settings dialog box, click **Plugins**, and then click **Browse repositories**.
   
    ![IntelliJ IDEA Settings Dialog Box][02a]
4. In the **Browse Repositories** dialog box, type "Azure" in the search box. Highlight **Azure Toolkit for IntelliJ**, and then click **Install**.
   
    ![Search for the Azure Toolkit for IntelliJ][03]
   
    IntelliJ IDEA will display the installation progress in a dialog box.
   
    ![Installation progress][04]
5. When the installation has completed, click **Restart IntelliJ IDEA**.
   
    ![Restart IntelliJ IDEA][05]
6. Click **OK** to close the Settings dialog box.
   
    ![Close IntelliJ IDEA Settings Dialog Box][06]
7. When prompted to restart IntelliJ IDEA or postpone, click **Restart**.
   
    ![Restart IntelliJ IDEA][07]

## To install the Azure Toolkit for IntelliJ from the start screen
1. Start IntelliJ IDEA.
2. When the IntelliJ IDEA start screen appears, click **Configure**, then click **Plugins**.
   
    ![Install IntelliJ IDEA Plugins][01b]
3. In the **Plugins** dialog box, click **Browse repositories**.
   
    ![Browse IntelliJ IDEA Plugin Repositories][02b]
4. In the **Browse Repositories** dialog box, type "Azure" in the search box. Highlight **Azure Toolkit for IntelliJ**, and then click **Install**.
   
    ![Search for the Azure Toolkit for IntelliJ][03]
   
    IntelliJ IDEA will display the installation progress in a dialog box.
   
    ![Installation progress][04]
5. When the installation has completed, click **Restart IntelliJ IDEA**.
   
    ![Restart IntelliJ IDEA][05]
6. When prompted to restart IntelliJ IDEA or postpone, click **Restart**.
   
    ![Restart IntelliJ IDEA][07]

## See Also
For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse]
  * [What's New in the Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Sign In Instructions for the Azure Toolkit for Eclipse]
  * [Create a Hello World Web App for Azure in Eclipse]
* [Azure Toolkit for IntelliJ]
  * [What's New in the Azure Toolkit for IntelliJ]
  * *Installing the Azure Toolkit for IntelliJ (This Article)*
  * [Sign In Instructions for the Azure Toolkit for IntelliJ]
  * [Create a Hello World Web App for Azure in IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[Sign In Instructions for the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-sign-in-instructions.md
[Sign In Instructions for the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-sign-in-instructions.md
[What's New in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/

<!-- IMG List -->

[01a]: ./media/azure-toolkit-for-intellij-installation/01-intellij-file-settings.png
[01b]: ./media/azure-toolkit-for-intellij-installation/01-intellij-configure-dropdown.png
[02a]: ./media/azure-toolkit-for-intellij-installation/02-intellij-settings-dialog.png
[02b]: ./media/azure-toolkit-for-intellij-installation/02-intellij-plugins-dialog.png
[03]: ./media/azure-toolkit-for-intellij-installation/03-intellij-browse-repositories.png
[04]: ./media/azure-toolkit-for-intellij-installation/04-install-progress.png
[05]: ./media/azure-toolkit-for-intellij-installation/05-restart-intellij.png
[06]: ./media/azure-toolkit-for-intellij-installation/06-intellij-settings-dialog.png
[07]: ./media/azure-toolkit-for-intellij-installation/07-restart-intellij.png
