---
title: Publish a Docker container by using the Azure Toolkit for Eclipse | Microsoft Docs
description: Learn how to publish a web app to Microsoft Azure as a Docker container by using the Azure Toolkit for Eclipse.
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

# Publish a web app as a Docker container by using the Azure Toolkit for Eclipse

Docker containers are a widely used method for deploying web applications. By using Docker containers, developers can consolidate all their project files and dependencies into a single package for deployment to a server. The Azure Toolkit for Eclipse simplifies this process for Java developers by adding *Publish as Docker Container* features for deployment to Microsoft Azure. This article walks you through the steps required to publish your applications to Azure as Docker containers.

> [!NOTE]
> More information about Docker is available on the [Docker website].
>

[!INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

## Publish your web app to Azure by using a Docker container

1. Open your web app project in Eclipse.

2. To start the **Publish as Docker Container** wizard, do either of the following:

   * In the **Navigator** view, right-click your project, click **Azure**, and then click **Publish as Docker Container**.

      ![Navigator view Publish as Docker Container command][PUB01]

   * On the Eclipse toolbar, click the **Publish** button, and then click **Publish as Docker Container**.

      ![Eclipse toolbar Publish as Docker Container command][PUB02]
      
    The **Deploy Docker Container on Azure** wizard opens.

    ![The Deploy Docker Container on Azure wizard][PUB03]

3. In the **Type an image name, select the artifact's path and check a Docker host to be used** window, do the following:

    a. In the **Docker image name** box, enter a unique name for your Docker host. (The wizard automatically creates a name, but you can modify it.)

    b. The **Hosts** area displays any Docker hosts that you have already created. Do either of the following:

    * If you have an existing Docker host, you can deploy your web app to it.
    * To create a new Docker host, click **Add**.  
      
    The **Create Docker Host** dialog box opens.

    ![Deploy Docker Container on Azure Wizard][PUB04a]

4. In the **Configure the new virtual machine** window, specify the following options for your Docker host. (The wizard automatically generates most of the options for you, but you can modify any of them.)

   a. **Name**: Enter a unique name for the Docker host. (It is not the same as the Docker image name that you specified earlier.)

   b. **Subscription**: Enter the Azure subscription that you use for your host.

   c. **Region**: Enter the geographical region where your host is located.

   d. On the **Host OS and Size** tab:
     * **Host OS**: Enter the operating system for the virtual machine that contains your host.
     * **Size**: Enter the virtual-machine size for your host.

   e. On the **Resource Group** tab:
     * **New resource group**: Create a new resource group for your host.
     * **Existing resource group**: Enter an existing resource group from your Azure account.

   f. On the **Network** tab:
     * **New virtual network**: Create a new virtual network for your host.
     * **Existing virtual network**: Enter an existing virtual network from your Azure account.

   g. On the **Storage** tab:
     * **New storage account**: Create a new storage account for your host.
     * **Existing storage account**: Enter an existing storage account from your Azure account.

5. Click **Next**.

6. In the **Configure log in credentials and port settings** window, select one of the following options:

    * **Import credentials from Azure Key Vault**: Specifies a previously saved set of credentials that are stored in your Azure subscription.

      >[!NOTE]
      >An Azure Key Vault that's created with a specific account or service principal is not automatically accessible by another account or service principal that shares the subscription. To allow another account or service principal to use the Key Vault, you must use the Azure portal to add the account or service principal.

    * **New log in credentials**: Creates a new set of login credentials. If you select this option, do the following:
    
      * On the **VM Credentials** tab, choose one of the following options for the virtual-machine login credentials of your Docker host:

          * **Username**: Enter the username for your virtual machine login credentials.
          * **Password** and **Confirm**: Enter the password for your virtual machine login credentials.
          * **SSH**: Enter the Secure Shell (SSH) settings for your Docker host. You can choose from the following options:
            * **None**: Specifies that your virtual machine will not allow SSH connections.
            * **Auto-generate**: Automatically creates the requisite settings for connecting via SSH.
            * **Import from directory**: Specifies a directory that contains a set of previously saved SSH settings. The directory must contain the following two files:
                * *id_rsa*: Contains the RSA identification for a user.
                * *id_rsa.pub*: Contains the RSA public key that is used for authentication.
        
        ![Create Docker Host][PUB05]

      * On the **Docker Daemon Credentials** tab, specify the following options:

          * **Docker Daemon port**: Enter the unique TCP port for your Docker host.
          * **TLS Security**: Enter the Transport Layer Security settings for your Docker host. You can choose from the following options:
            * **None**: Specifies that your virtual machine will not allow TLS connections.
            * **Auto-generate**: Automatically creates the requisite settings for connecting via TLS.
            * **Import from directory**: Specifies a directory that contains a set of previously saved TLS settings. More specifically, the directory must contain the following six files:
                * *ca.pem* and *ca-key.pem*: Contain the certificate and public key for the TLS Certificate Authority.
                * *cert.pem* and *key.pem*: Contain the client certificate and public key that is used for TLS authentication.
                * *server.pem* and *server-key.pem*: Contain the server certificate and public key for the host.

        ![Create Docker Host][PUB06]

7. After you have entered all of the preceding information, click **Finish**.

8. In the **Deploy Docker Container on Azure** wizard, click **Next**.

   ![The Deploy Docker Container on Azure wizard][PUB07]

9. In the **Configure the Docker container to be created** window, do the following:

   a. In the **Docker container name** box, enter a unique name for your Docker container.

   b. Choose one of the following Docker images:
     * **Predefined Docker image**: Specifies a pre-existing Docker image from Azure.

       >[!NOTE]
       >The list of Docker images in this box consists of several images that the Azure Toolkit has been configured to patch so that your artifact is deployed automatically.

     * **Custom Dockerfile**: Specifies a previously saved Dockerfile from your local computer.

       >[!NOTE]
       >This is a more advanced feature for developers who want to deploy their own Dockerfile. However, it is up to developers who use this option to ensure that their Dockerfile is built correctly. The Azure Toolkit does not validate the content in a custom Dockerfile, so the deployment might fail if the Dockerfile has issues. In addition, the Azure Toolkit expects the custom Dockerfile to contain a web app artifact, and it will attempt to open an HTTP connection. If developers publish a different type of artifact, they may receive innocuous errors after deployment.

   c. **Port settings**: Enter the unique TCP port binding for your Docker container.

     ![The Configure the Docker container to be created window][PUB08]

10. After you have completed all of the preceding steps, click **Finish**.

The Azure Toolkit begins deploying your web app to Azure in a Docker container. 

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

For more information about using Azure with Java, see [Azure Java Developer Center] and [Java Tools for Visual Studio Team Services].

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

<!-- IMG List -->

[PUB01]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB01.png
[PUB02]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB02.png
[PUB03]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB03.png
[PUB04a]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB04a.png
[PUB04b]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB04b.png
[PUB04c]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB04c.png
[PUB04d]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB04d.png
[PUB05]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB05.png
[PUB06]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB06.png
[PUB07]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB07.png
[PUB08]: ./media/azure-toolkit-for-eclipse-publish-as-docker-container/PUB08.png