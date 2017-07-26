---
title: Publish a Docker container by using the Azure Toolkit for IntelliJ | Microsoft Docs
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

# Publish a web app as a Docker container by using the Azure Toolkit for IntelliJ

Docker containers are a widely used method for deploying web applications. By using Docker containers, developers can consolidate all their project files and dependencies into a single package for deployment to a server. The Azure Toolkit for IntelliJ simplifies this process for Java developers by adding *Publish as Docker Container* features for deployment to Microsoft Azure. This article walks you through the steps required to publish your applications to Azure as Docker containers.

> [!NOTE]
>
> More information about Docker is available on the [Docker website].
>

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

## Publish your web app to Azure by using a Docker container

> [!NOTE]
> * To publish your web app, you must create a deployment-ready artifact. To learn more, see the [Additional information about creating artifacts](#artifacts) section.
>
> * After you have completed the deployment wizard at least once, most of your settings are used as defaults when you run the wizard again.
>

1. Open your web app project in IntelliJ.

2. To start the **Publish as Docker Container** wizard, do either of the following:

   * In the **Project** tool window, right-click your project, click **Azure**, and then click **Publish as Docker Container**:

      ![The Publish as Docker Container command][PUB01]

   * On the IntelliJ toolbar, click the **Publish Group** button, and then click **Publish as Docker Container**:

      ![The Publish as Docker Container command][PUB02]  
    The **Deploy Docker Container on Azure** wizard opens.

   ![The Deploy Docker Container on Azure wizard][PUB03]

3. In the **Type an image name, select the artifact's path and check a Docker host to be used** window, do the following: 

   a. In the **Docker image name** box, enter a unique name for your Docker host. (The wizard automatically creates a name, but you can modify it.) 

   b. The **Hosts** area displays any Docker hosts that you have already created. Do either of the following: 
      * If you have an existing Docker host, you can deploy your web app to it.
      * To create a Docker host, click the green plus sign (**+**).  
       The **Create Docker Host** dialog box opens. 

      ![Deploy Docker Container on Azure Wizard][PUB04a]

4. In the **Configure the new virtual machine** window, provide the following information about your Docker host. (The wizard automatically generates most of the information for you, but you can modify any of them.) 

   a. In the **Name** box, enter a unique name for the Docker host. (It is not the same as the Docker image name that you specified earlier.) 
    
   b. In the **Subscription** box, enter the Azure subscription that you use for your host. 
      
   c. In the **Region** box, enter the geographical region where your host is located.
      
   d. On the **OS and Size** tab, do the following:      
      * **Host OS**: Enter the operating system for the virtual machine that contains your host. 
      * **Size**: Enter the virtual-machine size for your host.   
       
   e. On the **Resource Group** tab, select either of the following:      
      * **New resource group**: Create a resource group for your host.
      * **Existing resource group**: Specify an existing resource group from your Azure account. 
       
   f. On the **Network** tab, select either of the following:      
      * **New virtual network**: Create a virtual network for your host.
      * **Existing virtual network**: Specify an existing virtual network from your Azure account. 
       
   g. On the **Storage** tab, select either of the following:      
      * **New storage account**: Create a storage account for your host.
      * **Existing storage account**: Specify an existing storage account from your Azure account.
       
5. Click **Next**.  
     The **Configure log in credentials and port settings** window opens.

      ![The Configure log in credentials and port settings window][PUB05]

6. Select one of the following options:

      * **Import credentials from Azure Key Vault**: Specify a previously saved set of credentials that are stored in your Azure subscription.

          > [!NOTE]
          > An Azure key vault that's created with a specific account or service principal is not automatically accessible by another account or service principal that shares the subscription. To allow another account or service principal to use the key vault, you must use the Azure portal to add the account or service principal.

      * **New log in credentials**: Create a new set of login credentials. If you select this option, do the following:

        a. On the **VM Credentials** tab, provide the following information for the virtual-machine login credentials of your Docker host:
             * **Username**: Enter the username for your virtual-machine login credentials.
             * **Password** and **Confirm**: Enter the password for your virtual-machine login credentials.
             * **SSH**: Enter the Secure Shell (SSH) settings for your Docker host. You can select one of the following options:
                * **None**: Specifies that your virtual machine does not allow SSH connections.
                * **Auto-generate**: Automatically creates the requisite settings for connecting via SSH.
                * **Import from directory**: Allows you to specify a directory that contains a set of previously saved SSH settings. The directory must contain the following two files:
                
                  * *id_rsa*: Contains the RSA identification for a user.
                  * *id_rsa.pub*: Contains the RSA public key that is used for authentication.
            
        b. On the **Docker Daemon Access** tab, provide the following information:

          ![Create Docker Host][PUB06]
    
             * **Docker Daemon port**: Enter the unique TCP port for your Docker host.
             * **TLS Security**: Enter the Transport Layer Security settings for your Docker host. You can choose from the following options:
                * **None**: Specifies that your virtual machine does not allow TLS connections.
                * **Auto-generate**: Automatically creates the requisite settings for connecting via TLS.
                * **Import from directory**: Specifies a directory that contains a set of previously saved TLS settings. The directory must contain the following six files: 
                   * *ca.pem* and *ca-key.pem*: Contain the certificate and public key for the TLS Certificate Authority.
                   * *cert.pem* and *key.pem*: Contain client certificate and public key which will be used for TLS authentication.
                   * *server.pem* and *server-key.pem*: Contain the client certificate and public key that is used for TLS authentication.

7. After you have entered the required information, click **Finish**.  
    The **Deploy Docker Container on Azure** wizard reappears.

   ![Deploy Docker Container on Azure Wizard][PUB07]

8. Click **Next**.  
    The **Configure the Docker container to be created** window opens.

   ![The Configure the Docker container to be created window][PUB08]

9. In the **Configure the Docker container to be created** window, provide the following information: 

   a. In the **Docker container name** box, enter a unique name for your Docker container.

   b. Choose one of the following Docker images: 

      * **Predefined Docker image**: Specify a pre-existing Docker image from Azure. 

        > [!NOTE]
        > The list of Docker images in this box consists of several images that the Azure Toolkit has been configured to patch so that your artifact is deployed automatically. 

      * **Custom Dockerfile**: Specify a previously saved Dockerfile from your local computer.

        > [!NOTE]
        > This is a more advanced feature for developers who want to deploy their own Dockerfile. However, it is up to developers who use this option to ensure that their Dockerfile is built correctly. Because the Azure Toolkit does not validate the content in a custom Dockerfile, the deployment might fail if the Dockerfile has issues. In addition, because the Azure Toolkit expects the custom Dockerfile to contain a web app artifact, it attempts to open an HTTP connection. If developers publish a different type of artifact, they might receive innocuous errors after deployment.

   c. In the **Port settings** box, enter the unique TCP port binding for your Docker container. 

10. After you have completed the preceding steps, click **Finish**. 

The Azure Toolkit begins deploying your web app to Azure in a Docker container. Unless you have configured IntelliJ to be deployed in the background, a **Deploying to Azure** progress bar appears. 

![The deployment progress bar][PUB09]

<a name="artifacts"></a>
## Additional information about creating artifacts

To create a deployment-ready artifact, do the following:

1. Open your web app project in IntelliJ.

2. Click **File**, and then click **Project Structure**.

   ![The Project Structure command][ART01]

3. To add an artifact, click the green plus sign (**+**), and then click **Web Application: Archive**.

   ![The "Web Application: Archive" command][ART02]

4. In the **Name** box, enter a name for your artifact (do not include the *.war* extension), and then click **OK**.

   ![The artifact Name box][ART03]

For more information about creating artifacts in IntelliJ, see [Configuring artifacts] on the JetBrains website.

## Next steps
For more information about the Azure Toolkits for Java IDEs, see the following resources:

* [Azure Toolkit for Eclipse]
  * [What's new in the Azure Toolkit for Eclipse]
  * [Installing the Azure Toolkit for Eclipse]
  * [Sign-in instructions for the Azure Toolkit for Eclipse]
  * [Create a Hello World web app for Azure in Eclipse]
* [Azure Toolkit for IntelliJ]
  * [What's new in the Azure Toolkit for IntelliJ]
  * [Installing the Azure Toolkit for IntelliJ]
  * [Sign-in instructions for the Azure Toolkit for IntelliJ]
  * [Create a Hello World web app for Azure in IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For additional resources for Docker, see the official [Docker website].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World web app for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World web app for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[Sign-in instructions for the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-sign-in-instructions.md
[Sign-in instructions for the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-sign-in-instructions.md
[What's new in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's new in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/

[Docker website]: https://www.docker.com/
[Configuring artifacts]: https://www.jetbrains.com/help/idea/2016.1/configuring-artifacts.html

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
