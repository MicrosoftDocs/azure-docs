---
title: A quickstart for creating a Java web app in Azure App Service on Linux 
description: In this quickstart, you deploy your first Java Hello World in Azure App Service on Linux in minutes.
services: app-service\web
documentationcenter: ''
author: msangapu
manager: cfowler
editor: ''

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: quickstart
ms.date: 03/07/2018
ms.author: msangapu
ms.custom: mvc
#Customer intent: As a Java developer, I want deploy a java app so that it is hosted on Azure App Service.
---
# Quickstart: Create a Java web app in App Service on Linux

App Service on Linux currently provides a preview feature to support Java web apps. Please review the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for more information on previews. 

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching, web hosting service using the Linux operating system. This quickstart shows how to deploy a Java app to App Service on Linux using a built-in Linux image. You will use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) to create the web app with the built-in image.

![Sample app running in Azure](media/quickstart-java/java-hello-world-in-browser.png)

[Deploying Java web apps to a Linux container in the cloud using the Azure Toolkit for IntelliJ](https://docs.microsoft.com/java/azure/intellij/azure-toolkit-for-intellij-hello-world-web-app-linux) is an alternative approach to deploy your Java app to your own container.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

To complete this quickstart: 

* [Install Git](https://git-scm.com/).
* [Apache Maven](http://maven.apache.org/).



[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]


## Create a web app

In the Cloud Shell, create a [web app](../app-service-web-overview.md) in the `myAppServicePlan` App Service plan. You can do it by using the [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. In the following example, replace *\<app_name>* with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`). 

```azurecli-interactive
# Bash
az webapp create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan --runtime "TOMCAT|8.5-jre8"
# PowerShell
az --% webapp create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan --runtime "TOMCAT|8.5-jre8"
```

For the **runtime** parameter, use one of the following runtimes:
 * TOMCAT|8.5-jre8
 * TOMCAT|9.0-jre8


When the web app has been created, the Azure CLI shows information similar to the following example:

```json
{
  "additionalProperties": {},
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<your web app name>.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "<your web app name>.azurewebsites.net",
    "<your web app name>.scm.azurewebsites.net"
  ],
  "ftpPublishingUrl": "ftp://<your ftp URL>",  
  < JSON data removed for brevity. >
}
```

Copy the value for **ftpPublishingUrl**. You will use this url later, if you choose FTP deployment.

Browse to the newly created web app.

```
http://<app_name>.azurewebsites.net
```

If the web app is up and running, you should get a default screen similar to the following image:

![Browse to Web App Before Deployment](media/quickstart-java/browse-web-app-not-deployed.png)


## Create a Java app


Execute the following command using Maven to create a new *helloworld* web app:  

    mvn archetype:generate -DgroupId=example.demo -DartifactId=helloworld -DarchetypeArtifactId=maven-archetype-webapp

Change to the new *helloworld* project directory and build all modules using the following command:

    mvn verify

This command will create all modules including the *helloworld.war* file in the *helloworld/target* subdirectory.


## Deploying the Java app to App Service on Linux

To deploy your Java app WAR file, you can use Maven deployment, WarDeploy (currently in [Preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)), or FTP.

Depending on which method of deployment you use, the relative path to browse to your Java web app will be slightly different.


### Deploy with Maven

In this section you will deploy the Java web app to Azure usign the [Maven Plugin for Azure Web Apps](https://github.com/Microsoft/azure-maven-plugins/tree/develop/azure-webapp-maven-plugin).

To deploy from Maven, add the following plugin definition inside the `<build>` element of the *pom.xml* file:

```xml
    <plugins>
      <plugin>
        <groupId>com.microsoft.azure</groupId> 
        <artifactId>azure-webapp-maven-plugin</artifactId> 
        <version>1.1.0</version>
        <configuration> 
          <resourceGroup>YOUR-RESOURCE-GROUP</resourceGroup> 
          <appName>YOUR-WEB-APP</appName> 
          <deploymentType>ftp</deploymentType> 
          <resources> 
              <resource> 
                  <directory>${project.basedir}/target</directory> 
                  <targetPath>webapps</targetPath> 
                  <includes> 
                      <include>*.war</include> 
                  </includes> 
                  <excludes> 
                      <exclude>*.xml</exclude> 
                  </excludes> 
              </resource> 
          </resources> 
        </configuration>
      </plugin>
    </plugins>
```    

Update the following placeholders in the plugin definition:

* Replace `YOUR-RESOURCE-GROUP` with the name of the new resource group you created above,
* Replace `YOUR-WEB-APP` with the name of the new web app you created above.

Deploy your Java app to the web app using the following command:

    mvn clean package azure-webapp:deploy


Once deployment has completed, browse to the deployed application using the following URL in your web browser.

```bash
http://<app_name>.azurewebsites.net/helloworld
```

The Java sample code is running in a web app with built-in image.

![Sample app running in Azure](media/quickstart-java/java-hello-world-in-browser-curl.png)

**Congratulations!** You've deployed your first Java app to App Service on Linux.



### Deploy with WarDeploy 

To deploy your WAR file with WarDeploy, use the following cURL example commandline to send a POST request to *https://<your app name>.scm.azurewebsites.net/api/wardeploy*. The POST request must contain the .war file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication. For more information on WarDeploy, see [Deploy your app to Azure App Service with a ZIP or WAR file](../app-service-deploy-zip.md).

```bash
curl -X POST -u <username> --data-binary @"<war_file_path>" https://<app_name>.scm.azurewebsites.net/api/wardeploy
```

Update the following placeholders:

* `username` - Use the deployment credential username you created earlier.
* `war_file_path` - Use the local WAR file path.
* `app_name` - Use the app name your created earlier.

Execute the command. When prompted by cURL, type in the password for your deployment credentials.

Browse to the deployed application using the following URL in your web browser.

```bash
http://<app_name>.azurewebsites.net
```

The Java sample code is running in a web app with built-in image.

![Sample app running in Azure](media/quickstart-java/java-hello-world-in-browser.png)


**Congratulations!** You've deployed your first Java app to App Service on Linux.



### FTP deployment

Alternatively, you can also use FTP to deploy the WAR file. 

FTP the file to the */home/site/wwwroot/webapps* directory of your web app. The following example commandline uses cURL:

```bash
curl -T war_file_path -u "app_name\username" ftp://webappFTPURL/site/wwwroot/webapps/
```

Update the following placeholders:

* `war_file_path` - Use the local WAR file path.
* `app_name` - Use the app name your created earlier.
* `username` - Use the deployment credential username you created earlier.
* `webappFTPURL` - Use the **FTP hostname** value for your web app, which you copied earlier. The FTP hostname is also listed on **Overview** blade for your web app in the [Azure portal](https://portal.azure.com/).

Execute the command. When prompted by cURL, type in the password for your deployment credentials.


Browse to the deployed application using the following URL in your web browser.

```bash
http://<app_name>.azurewebsites.net/helloworld
```

The Java sample code is running in a web app with built-in image.

![Sample app running in Azure](media/quickstart-java/java-hello-world-in-browser-curl.png)


**Congratulations!** You've deployed your first Java app to App Service on Linux.



[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]


## Next steps

In this quickstart, you used Maven to create a Java web app, then you deployed the Java web app to App Service on Linux. To learn more about using Java with Azure, follow the link below.

> [!div class="nextstepaction"]
> [Azure for Java Developers](https://docs.microsoft.com/java/azure/)

