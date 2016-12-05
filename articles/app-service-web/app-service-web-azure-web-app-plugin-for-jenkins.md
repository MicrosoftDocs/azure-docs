---
title: How to use the Azure Web App Plugin with Jenkins Continuous Integration | Microsoft Docs
description: Describes how to use the Azure Web App Plugin with Jenkins Continuous Integration.
services: app-service\web
documentationcenter: ''
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: be6c4e62-da76-44f6-bb00-464902734805
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 10/19/2016
ms.author: robmcm

---
# How to use the Azure Web App Plugin with Jenkins Continuous Integration
The Azure Web App plugin for Jenkins makes it easy to create web apps on Azure when running distributed builds, and deploy a WAR file to your web app.

### Prerequisites
Before working through the steps in this article, you will need to register and authorize your client application, and then retrieve your Client ID and Client Secret which will be sent to Azure Active Directory during authentication. For more information on these prerequisites, see the following articles:

* [Integrating applications with Azure Active Directory][integrate-apps-with-AAD]
* [Register a Client App][register-client-app]

In addition, you will need to download the **azure-webapp-plugin.hpi** file from the following URL:

* [https://github.com/Microsoft/azure-webapp-plugin/tree/master/install](https://github.com/Microsoft/azure-webapp-plugin/tree/master/install)

## How to Install the Azure Web App Plugin for Jenkins
1. [Download the **azure-webapp-plugin.hpi** file from GitHub][azure-webapp-plugin-install]
2. Log into your Jenkins dashboard.
3. In the dashboard, click **Manage Jenkins**.
   
    ![Manage Jenkins][jenkins-dashboard]
4. In the **Manage Jenkins** page, click **Manage Plugins**.
   
    ![Manage Plugins][manage-jenkins]
5. Click the **Advanced** tab, and click **Browse** in the **Upload Plugin** section. Navigate to the location where you downloaded the **azure-webapp-plugin.hpi** file in the **Prerequisites**, and click the **Upload** once you have selected the file.
   
    ![Upload Plugin][upload-plugin]
6. Restart Jenkins if necessary.

## Configure the Azure Web App Plugin
1. In your Jenkins dashboard, click one of your projects.
   
    ![Select Project][select-project]
2. When your project's page appears, click **Configure** in the left-side menu.
   
    ![Configure Project][configure-project]
3. In the **Post-build Actions** section, click the **Add post-build action** drop down menu and select **Azure Webapp Configuration**. 
   
    ![Advanced Options][advanced-options]
4. When the **Azure Webapp Configuration** section appears, enter your **Subscription ID**, **Client ID**, **Client Secret** and **OAuth 2.0 Token Endpoint** information in the **Azure Profile Configuration**.
   
    ![Azure Profile Configuration][azure-profile-configuration]
5. In the **Webapp Configuration** section, enter your **Resource Group Name**, **Location**, **Hosting Plan Name**, **Web App Name**, **Sku Name**, **Sku Capacity** and **War File Path** information.
   
    ![Webapp Configuration][webapp-configuration]
6. Click **Save** to save the settings for your project.
   
    ![Save Project][save-project]
7. Click **Build Now** in the left-side menu.
   
    ![Build Project][build-project]

> [!NOTE]
> A Web App container will be created only when a Web App container does not already exist.
> 
> 

<a name="see-also"></a>

## See Also
For more information about using Azure with Java, see the [Azure Java Developer Center].

For additional information about the Azure Web App Plugin for Jenkins, see the [Azure Web App Plugin] project on GitHub.

<!-- URL List -->

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[integrate-apps-with-AAD]: http://msdn.microsoft.com/library/azure/dn132599.aspx
[register-client-app]: http://msdn.microsoft.com/dn877542.aspx
[Azure Web App Plugin]: https://github.com/Microsoft/azure-webapp-plugin
[azure-webapp-plugin-install]: https://github.com/Microsoft/azure-webapp-plugin/tree/master/install

<!-- IMG List -->

[jenkins-dashboard]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/jenkins-dashboard.png
[manage-jenkins]:    ./media/app-service-web-azure-web-app-plugin-for-jenkins/manage-jenkins.png
[upload-plugin]:     ./media/app-service-web-azure-web-app-plugin-for-jenkins/upload-plugin.png
[select-project]:    ./media/app-service-web-azure-web-app-plugin-for-jenkins/select-project.png
[configure-project]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/configure-project.png
[advanced-options]:  ./media/app-service-web-azure-web-app-plugin-for-jenkins/advanced-options.png
[azure-profile-configuration]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/azure-profile-configuration.png
[build-project]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/build-project.png
[save-project]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/save-project.png
[webapp-configuration]: ./media/app-service-web-azure-web-app-plugin-for-jenkins/webapp-configuration.png
