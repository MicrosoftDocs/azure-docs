---
title: Publish a Docker Container using the Azure Toolkit for IntelliJ | Microsoft Docs
description: Learn how to publish a web app to Microsoft Azure as a Docker container by using the Azure Toolkit for IntelliJ.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 04/14/2017
ms.author: robmcm

---

# How to publish a Web App as a Docker Container using the Azure Toolkit for IntelliJ

Docker containers are a widely-used method for deploying web applications in which developers can consolidate all of their project files and dependencies into a single package for deployment to a server. The Azure Toolkit for IntelliJ simplifies this process for Java developers by adding *Publish as Docker Container* features for deploying to Microsoft Azure, and the steps in this article will walk you through the steps required to publish your applications to Azure as Docker containers.

> [!NOTE]
>
> More information about Docker is available on the [Docker Website].
>

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

## Publishing your web app to Azure using a Docker Container

> [!NOTE]
>
> In order to publish your web app, you will need to create a deployment-ready artifact. For additional information, see [Additional information about creating artifacts](#artifacts) later in this article.
>
> In addition, after you have completed the deployment wizard at least once, most of the settings which you specify in this walkthrough will be used as defaults for when you run the wizard again.
>

1. Open your web app project in IntelliJ.

1. Use one of the following methods to launch the Publish as Docker Container wizard:

   * Right-click your project in the **Project** tool window, then click **Azure**, and then click **Publish as Docker Container**:
      ![Publish as Docker Container][PUB01]

   * Click the **Publish Group** menu in the IntelliJ toolbar, and then click **Publish as Docker Container**:
      ![Publish as Docker Container][PUB02]

1. When the **Deploy Docker Container on Azure** wizard appears, you will see a dialog box similar to the following illustration:
   ![Deploy Docker Container on Azure Wizard][PUB03]

   a. Enter a unique name in the text box for your Docker host in the **Docker image name** text box. (The wizard will automatically create a name for you, but you can modify that if you choose.)

   b. The **Hosts** window will display any Docker hosts that you have created.
      * If you have not created any Docker hosts, this section of the dialog box will be empty.
      * If you have already created a Docker hosts, you can choose to deploy your web app to an existing host; otherwise, follow the steps listed below to create a new Docker host.

1. To create a new Docker host, click the green plus ("**+**") symbol; this will launch the **Create Docker Host** dialog box.
      ![Deploy Docker Container on Azure Wizard][PUB04a]

   a. Specify the following options for your Docker host. (The wizard will automatically generate most of the options for you, but you can modify any options which you want to customize.)

      * **Name**: This is a unique name for the Docker host. (This is not the same as the Docker image name which you specified earlier.)

      * **Subscription**: Specify which Azure subscription you will use for your host.
      
      * **Region**: Specify the geographical region where your host will be located.
      
      * On the **OS and Size** tab:
         * **Host OS**: Specify the operating system for the virtual machine which will contain your host.
         * **Size**: Specify the virtual machine size for your host.

      * On the **Resource Group** tab:
         * **New resource group**: Allows you to create a new resource group for your host.
         * **Existing resource group**: Allows you to specify an existing resource group from your Azure account.

      * On the **Network** tab:
         * **New virtual network**: Allows you to create a new virtual network for your host.
         * **Existing virtual network**: Allows you to specify an existing virtual network from your Azure account.

      * On the **Storage** tab:
         * **New storage account**: Allows you to create a new storage account for your host.
         * **Existing storage account**: Allows you to specify an existing storage account from your Azure account.

   b. Once you have specified the above options, click **Next**.

   c. Choose one of the following options for the virtual machine login of your Docker host:
      ![Create Docker Host][PUB05]

      * **Import credentials from Azure Key Vault**: Allows you to specify a previously-saved set of credentials which are stored in your Azure subscription.

      > [!NOTE]
      > An Azure Key Vault which is created with a specific account or service principal will not be automatically accessible by another account or service principal which shares the same subscription. In order to allow another account or service principal to use the Key Vault, you will need to use the Azure Portal to add the account or service principal.

      * **New log in credentials**: Allows you to create a new set of login credentials, which will require you to specify the following options on the **VM Credentials** tab:
         * **Username**: Specifies the username for your virtual machine login.
         * **Password** and **Confirm**: Specifies the password for your virtual machine login.
         * **SSH**: Specifies the Secure Shell (SSH) settings for your Docker host; you can choose from the following options:
            * **None**: Specifies that your virtual machine will not allow SSH connections.
            * **Auto-generate**: This option will automatically create the requisite settings for connecting via SSH.
            * **Import from directory**: Allows you to specify a directory which contains a set of previously-saved SSH settings. More specifically, the directory must contain the following two files:
               * *id_rsa*: This file contains the RSA identification for a user.
               * *id_rsa.pub*: This file contains the RSA public key which will be used for authentication.
        
      * On the **Docker Daemon Access** tab, specify the following options:
      ![Create Docker Host][PUB06]

         * **Docker Daemon port**: Specifies the unique TCP port for your Docker host.
         * **TLS Security**: Specifies the Transport Layer Security settings for your Docker host; you can choose from the following options:
            * **None**: Specifies that your virtual machine will not allow TLS connections.
            * **Auto-generate**: This option will automatically create the requisite settings for connecting via TLS.
            * **Import from directory**: Allows you to specify a directory which contains a set of previously-saved TLS settings. More specifically, the directory must contain the following six files:
               * *ca.pem* and *ca-key.pem*: These files contain the certificate and public key for the TLS Certificate Authority.
               * *cert.pem* and *key.pem*: These files contain client certificate and public key which will be used for TLS authentication.
               * *server.pem* and *server-key.pem*: These files contain server certificate and public key for the host.

   d. Once you have entered all of the above options, click **Finish**.

1. When the **Deploy Docker Container on Azure** wizard reappears, click **Next**.
   ![Deploy Docker Container on Azure Wizard][PUB07]

1. On the last page of the wizard, specify the following options:

   * **Docker container name**: This is the unique name for your Docker container.

   * Choose one of the following Docker images:

      * **Predefined Docker image**: Allows you to specify a pre-existing Docker image from Azure.

      > [!NOTE]
      > The list of Docker images in this drop-down menu consists of several images which the Azure Toolkit has been configured to patch so that your artifact will be deployed automatically.

      * **Custom Dockerfile**: Allows you to specify a previously-saved Dockerfile from your local computer.

      > [!NOTE]
      > This is a more-advanced feature for developers who want to deploy their own Dockerfile. However, it is up to developers who use this option to ensure that their Dockerfile is built correctly. The Azure Toolkit does not validate the content in a custom Dockerfile, so the deployment may fail if the Dockerfile has issues. In addition, the Azure Toolkit expects the custom Dockerfile to contain a web app artifact and will attempt to open an HTTP connection; if developers publish a different type of artifact, they may receive innocuous errors after deploying.

   * **Port settings**: Specifies the unique TCP port binding for your Docker container.
   ![Deploy Docker Container on Azure Wizard][PUB08]

1. Once you have completed all of the above steps, click **Finish**.

The Azure Toolkit will begin deploying your web app to Azure in a Docker container, and unless you have configured IntelliJ to deploy in the background, a dialog box will appear which displays the deployment progress. 
![Deployment Progress][PUB09]

<a name="artifacts"></a>
## Additional information about creating artifacts

To create a deployment-ready artifact, use the following steps:

1. Open your web app project in IntelliJ.

1. Click **File**, and then click **Project Structure**.
   ![Project Structure Menu][ART01]

1. Click the green plus ("**+**") symbol to add an artifact, and then click **Web Application: Artifact**.
   ![Add Artifact][ART02]

1. Name your artifact while making sure not to add the ".war" extension, and then click **OK**.
   ![Artifact Properties][ART03]

For more information about creating artifacts in IntelliJ, see [Configuring Artifacts] on the JetBrains website.

## See Also
For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse]
  * [What's New in the Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Sign In Instructions for the Azure Toolkit for Eclipse]
  * [Create a Hello World Web App for Azure in Eclipse]
* [Azure Toolkit for IntelliJ]
  * [What's New in the Azure Toolkit for IntelliJ]
  * [Installing the Azure Toolkit for IntelliJ]
  * [Sign In Instructions for the Azure Toolkit for IntelliJ]
  * [Create a Hello World Web App for Azure in IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For additional resources for Docker, see the official [Docker Website].

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

[Docker Website]: https://www.docker.com/
[Configuring Artifacts]: https://www.jetbrains.com/help/idea/2016.1/configuring-artifacts.html

<!-- IMG List -->

[PUB01]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB01.png
[PUB02]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB02.png
[PUB03]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB03.png
[PUB04a]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB04a.png
[PUB04b]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB04b.png
[PUB04c]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB04c.png
[PUB04d]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB04d.png
[PUB05]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB05.png
[PUB06]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB06.png
[PUB07]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB07.png
[PUB08]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB08.png
[PUB09]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/PUB09.png

[ART01]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/ART01.png
[ART02]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/ART02.png
[ART03]: ./media/azure-toolkit-for-intellij-publish-as-docker-container/ART03.png
