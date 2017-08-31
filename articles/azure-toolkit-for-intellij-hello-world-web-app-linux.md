---
title: Run a Hello World web app in a Linux container by using the Azure Toolkit for IntelliJ
description: Learn how to create a basic Hello World web app in a Linux container and publish it to Azure by using the Azure Toolkit for IntelliJ.
services: app-service\web
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

# Run a Hello World web app in a Linux container by using the Azure Toolkit for IntelliJ

[Docker] containers are a widely used method for deploying web applications. By using Docker containers, developers can consolidate all their project files and dependencies into a single package for deployment to a server. The Azure Toolkit for IntelliJ simplifies this process for Java developers by adding features for to deploy containers to Microsoft Azure.

This article demonstrates the steps that are required to create a basic Hello World web app and publish your web app in a Linux container to Azure by using the Azure Toolkit for IntelliJ.

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]
* A [Docker] client.

> [!NOTE]
>
> To complete the steps in this tutorial, you need to configure [Docker] to expose the daemon on port 2375 without TLS. You can configure this setting when installing Docker, or through the Docker settings menu.
>
> ![Docker settings menu][docker-settings-menu]
>

## Create a new web app project

1. Start IntelliJ and sign in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for IntelliJ] article.

1. Click the **File** menu, then click **New**, and then click **Project**.
   
    ![Create New Project][file-new-project]

1. In the **New Project** dialog box, select **Maven**, then **maven-archetype-webapp**, and then click **Next**.
   
    ![Choose Maven archetype webapp][maven-archetype-webapp]
   
1. Specify the **GroupId** and **ArtifactId** for your web app, and then click **Next**.
   
    ![Specify GroupId and ArtifactId][groupid-and-artifactid]

1. Customize any Maven settings or accept the defaults, and then click **Next**.
   
    ![Specify Maven settings][maven-options]

1. Specify your project name and location, and then click **Finish**.
   
    ![Specify project name][project-name]

## Create an Azure Container Registry to use as a private Docker registry

The following steps walk you through using the Azure portal to create an Azure Container Registry.

> [!NOTE]
>
> If you want to use the Azure CLI instead of the Azure portal, follow the steps in [Create a private Docker container registry using the Azure CLI 2.0][Create Docker Registry using Azure CLI].
>

1. Browse to the [Azure portal] and sign in.

   Once you have signed in to your account on the Azure portal, you can follow the steps in the [Create a private Docker container registry using the Azure portal] article, which are paraphrased in the following steps for the sake of expediency.

1. Click the menu icon for **+ New**, then click **Containers**, and then click **Azure Container Registry**.
   
   ![Create a new Azure Container Registry][AR01]

1. When the information page for the Azure Container Registry template is displayed, click **Create**. 

   ![Create a new Azure Container Registry][AR02]

1. When the **Create container registry** page is displayed, enter your **Registry name** and **Resource group**, choose **Enable** for the **Admin user**, and then click **Create**.

   ![Configure Azure Container Registry settings][AR03]

1. Once your container registry has been created, navigate to your container registry in the Azure portal, and then click **Access Keys**. Take note of the username and password for the next steps.

   ![Azure Container Registry access keys][AR04]

## Deploy your web app in a Docker container

1. Right-click your project in the project explorer, choose **Azure**, and then click **Add Docker Support**.

   This will automatically create a Docker file with a default configuration.

    ![Add Docker support][add-docker-support]

1. After you have added Docker support, right-click your project in the project explorer, choose **Azure**, and then click **Run on Web App (Linux)**.

    ![Run on Web App (Linux)][run-on-web-app-linux]

1. When the **Run on Web App (Linux)** dialog box is displayed, fill in the requisite information:

   * **Name**: This specifies the friendly name which is displayed in the Azure Toolkit.

   * **Server URL**: This specifies the URL for your container registry from the previous section of this article; typically this will use the following syntax: "*registry*.azurecr.io".

   * **Username** and **Password**: Specifies the access keys for your container registry from the previous section of this article.

   * **Image and tag**: Specifies the container image name; typically this will use the following syntax: "*registry*.azurecr.io/*appname*:latest", where:
      * *registry* is your container registry from the previous section of this article
      * *appname* is the name of your web app

   * **Use Existing Web App** or **Create New Web App**: Specifies whether you will deploy your container to an existing web app or create a new web app.

   * **Resource Group**: Specifies whether you will use an existing or create a new resource group.

   * **App Service Plan**: Specifies whether you willuse an existing or create a new app service plan.

1. When you have finished configuring the settings listed above, click **Run**.

    ![Create Web App][create-web-app]

1. After you have published your web app, your settings will be saved as the default, and you can run your application on Azure by clicking the green arrow icon on the toolbar. You can modify these settings by clicking the drop-down menu for your web app and click **Edit Configurations**.

    ![Edit configuration menu][edit-configuration-menu]

1. When the **Run/Debug Configurations** dialog box is displayed, you can modify any of the default settings, and then click **OK**.

    ![Edit configuration dialog box][edit-configuration-dialog]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

For additional resources for Docker, see the official [Docker website][Docker].

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

[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Create Docker Registry using Azure CLI]: container-registry/container-registry-get-started-azure-cli.md

[Docker]: https://www.docker.com/
[Configuring artifacts]: https://www.jetbrains.com/help/idea/2016.1/configuring-artifacts.html

<!-- IMG List -->

[AR01]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/AR01.png
[AR02]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/AR02.png
[AR03]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/AR03.png
[AR04]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/AR04.png

[docker-settings-menu]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/docker-settings-menu.png
[file-new-project]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/file-new-project.png
[maven-archetype-webapp]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/maven-archetype-webapp.png
[groupid-and-artifactid]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/groupid-and-artifactid.png
[maven-options]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/maven-options.png
[project-name]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/project-name.png
[add-docker-support]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/add-docker-support.png
[run-on-web-app-linux]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/run-on-web-app-linux.png
[create-web-app]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/create-web-app.png
[edit-configuration-menu]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/edit-configuration-menu.png
[edit-configuration-dialog]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/edit-configuration-dialog.png
[successfully-deployed]: ./media/azure-toolkit-for-intellij-hello-world-web-app-linux/successfully-deployed.png
