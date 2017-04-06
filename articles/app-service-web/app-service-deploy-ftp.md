---
title: Deploy your app to Azure App Service using FTP/S | Microsoft Docs 
description: Learn how to deploy your app to Azure App Service using FTP or FTPS.
services: app-service
documentationcenter: ''
author: cephalin
manager: erikre
editor: ''

ms.assetid: ae78b410-1bc0-4d72-8fc4-ac69801247ae
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2016
ms.author: cephalin;dariac

---
# Deploy your app to Azure App Service using FTP/S
This article shows you how to use FTP or FTPS to deploy your web app, mobile app backend, 
or API app to [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714).

The FTP/S endpoint for your app is already active. No configuration is necessary to enable FTP/S deployment. 

<a name="step1"></a>
## Step 1: Set deployment credentials

To access the FTP server for your app, you first need deployment credentials. 

To set or reset your deployment credentials, see [Azure App Service Deployment Credentials](app-service-deployment-credentials.md). This tutorial demonstrates the use of user-level credentials.

## Step 2: Get FTP connection information

1. In the [Azure portal](https://portal.azure.com), open your app's [resource blade](../azure-resource-manager/resource-group-portal.md#manage-resources).
2. Select **Overview** in the left menu, then note the values for **FTP/Deployment User**, **FTP Host Name**, and **FTPS Host Name**. 

    ![FTP Connection Information](./media/web-sites-deploy/FTP-Connection-Info.PNG)

    > [!NOTE]
    > The **FTP/Deployment User** user value as displayed by the Azure Portal including the app name in order to provide proper context for the FTP server.
    > You can find the same information when you select **Properties** in the left menu. 
    >
    > Also, the deployment password is never shown. If you forget your deployment password, go back to [step 1](#step1) and reset your deployment password.
    >
    >

## Step 3: Deploy files to Azure

1. From your FTP client ([Visual Studio](https://www.visualstudio.com/vs/community/), [FileZilla](https://filezilla-project.org/download.php?type=client), etc), 
use the connection information you gathered to connect to your app.
3. Copy your files and their respective directory structure to the [**/site/wwwroot** directory](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) in Azure (or the **/site/wwwroot/App_Data/Jobs/** directory for WebJobs).
4. Browse to your app's URL to verify the app is running properly. 

> [!NOTE] 
> Unlike [Git-based deployments](app-service-deploy-local-git.md), FTP deployment doesn't support the following deployment automations: 
>
> - dependency restore (such as NuGet, NPM, PIP, and Composer automations)
> - compilation of .NET binaries
> - generation of web.config (here is a [Node.js example](https://github.com/projectkudu/kudu/wiki/Using-a-custom-web.config-for-Node-apps))
> 
> You must restore, build, and generate these necessary files manually on your local machine and deploy them together with your app.
>
>

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](app-service-deploy-local-git.md). Git-based deployment to Azure
enables version control, package restore, MSBuild, and more.

## More Resources

* [Create a PHP-MySQL web app and deploy using FTP](web-sites-php-mysql-deploy-use-ftp.md).
* [Azure App Service Deployment Credentials](app-service-deploy-ftp.md)
