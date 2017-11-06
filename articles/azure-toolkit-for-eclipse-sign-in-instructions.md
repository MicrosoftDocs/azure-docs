---
title: Sign In Instructions for the Azure Toolkit for Eclipse
description: Learn how to sign in to Microsoft Azure by using the Azure Toolkit for Eclipse.
services: ''
documentationcenter: java
author: rmcmurray
manager: routlaw
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 08/20/2017
ms.author: robmcm

---

# Sign-in instructions for the Azure Toolkit for Eclipse

The Azure Toolkit for Eclipse provides two methods for signing in to your Azure account:

  * **Automated** - when you are using this method, you will create a credentials file, which contains your service principal data, after which you can use the credentials file to automatically sign in to your Azure account.
  * **Interactive** - when you are using this method, you will enter your Azure credentials each time you sign in to your Azure account.

The steps in the following sections will describe how to use each method.

[!INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

## Signing in to your Azure account automatically and creating a credentials file to use in the future

The following steps walk you through creating a credentials file that contains your service principal data. Once you have completed these steps, Eclipse will automatically use the credentials file to automatically sign you into Azure each time you open your project.

1. Open your project with Eclipse.

1. Click **Tools**, then click **Azure**, and then click **Sign In**.

   ![Eclipse Menu for Azure Sign In][A01]

1. When the **Azure Sign In** dialog box appears, select **Automated**, and then click **New**.

   ![Sign In Dialog Box][A02]

1. When the **Azure Log In** dialog box appears, enter your Azure credentials, and then click **Sign In**.

   ![Azure Log In Dialog Box][A03]

1. When the **Create authentication files** dialog box appears, select the subscriptions that you want to use, choose your destination directory, and then click **Start**.

   ![Azure Log In Dialog Box][A04]

1. The **Service Principal Creation Status** dialog box will be displayed, and after your files have been created successfully, click **OK**.

   ![Service Principal Creation Status Dialog Box][A05]

1. When the **Azure Sign In** dialog box appears, click **Sign In**.

   ![Azure Log In Dialog Box][A06]

1. When the **Select Subscriptions** dialog box appears, select the subscriptions that you want to use, and then click **OK**.

   ![Select Subscriptions Dialog Box][A07]

## Signing out of your Azure account when you signed in automatically

After you have configured the steps in the previous section, the Azure Toolkit will automatically sign you into your Azure account each time you restart Eclipse. However, to sign out of your Azure account and prevent the Azure Toolkit from signing you in automatically, use the following steps.

1. In Eclipse, click **Tools**, then click **Azure**, and then click **Sign Out**.

   ![Eclipse Menu for Azure Sign Out][L01]

1. When the **Azure Sign Out** dialog box appears, click **Yes**.

   ![Sign Out Dialog Box][L03]

## Signing in to your Azure account automatically using a credentials file that you have already created

If you sign out of Azure when you are using Eclipse, you will need to reconfigure the Azure Toolkit for Eclipse to use a credentials file that have created before you can automatically sign in to your Azure account. The following steps walk you through configuring the Azure Toolkit to use an existing credentials file.

1. Open your project with Eclipse.

1. Click **Tools**, then click **Azure**, and then click **Sign In**.

   ![Eclipse Menu for Azure Sign In][A01]

1. When the **Azure Sign In** dialog box appears, select **Automated**, and then click **Browse**.

   ![Sign In Dialog Box][A02]

1. When the **Select Authenticated File** dialog box appears, select a credentials file that you created earlier, and then click **Select**.

   ![Sign In Dialog Box][A08]

1. When the **Azure Sign In** dialog box appears, click **Sign In**.

   ![Azure Log In Dialog Box][A06]

1. When the **Select Subscriptions** dialog box appears, select the subscriptions that you want to use, and then click **OK**.

   ![Select Subscriptions Dialog Box][A07]

## Signing in to your Azure account interactively

The following steps illustrate how to sign in to Azure by manually entering your Azure credentials.

1. Open your project with Eclipse.

1. Click **Tools**, then click **Azure**, and then click **Sign In**.

   ![Eclipse Menu for Azure Sign In][I01]

1. When the **Azure Sign In** dialog box appears, select **Interactive**, and then click **Sign In**.

   ![Sign In Dialog Box][I02]

1. When the **Azure Log In** dialog box appears, enter your Azure credentials, and then click **Sign In**.

   ![Azure Log In Dialog Box][I03]

1. When the **Select Subscriptions** dialog box appears, select the subscriptions that you want to use, and then click **OK**.

   ![Select Subscriptions Dialog Box][I04]

## Signing out of your Azure account when you signed in interactively

After you have configured the steps in the previous section, you will be automatically signed out of your Azure account each time you restart Eclipse. However, if you want to sign out of your Azure account without restarting Eclipse, use the following steps.

1. In Eclipse, click **Tools**, then click **Azure**, and then click **Sign Out**.

   ![Eclipse Menu for Azure Sign Out][L01]

1. When the **Azure Sign Out** dialog box appears, click **Yes**.

   ![Sign Out Dialog Box][L02]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

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
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/

<!-- IMG List -->

[I01]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/I01.png
[I02]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/I02.png
[I03]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/I03.png
[I04]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/I04.png

[A01]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A01.png
[A02]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A02.png
[A03]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A03.png
[A04]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A04.png
[A05]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A05.png
[A06]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A06.png
[A07]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A07.png
[A08]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/A08.png

[L01]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/L01.png
[L02]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/L02.png
[L03]: ./media/azure-toolkit-for-eclipse-sign-in-instructions/L03.png
