---
title: 'Quickstart: Create a Linux Java app'
description: Get started with Linux apps on Azure App Service by deploying your first Java app to a Linux container in App Service.
keywords: azure, app service, web app, linux, java, maven, quickstart
author: msangapu-msft

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.devlang: Java
ms.topic: quickstart
ms.date: 03/27/2019
ms.custom: mvc, seo-java-july2019, seo-java-august2019, seo-java-september2019
#Customer intent: As a Java developer, I want deploy a java app so that it is hosted on Azure App Service.
---
# Quickstart: Create a Java app on Azure App Service on Linux

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching, web hosting service using the Linux operating system. This quickstart shows how to use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) with the [Maven Plugin for Azure App Service](https://github.com/Microsoft/azure-maven-plugins/tree/develop/azure-webapp-maven-plugin) to deploy a Java web archive (WAR) file on the Linux operating system.

> [!NOTE]
>
> The same thing can also be done using popular IDEs like IntelliJ, Eclipse and VS Code. Check out our similar documents at [Azure Toolkit for IntelliJ Quickstart](/java/azure/intellij/azure-toolkit-for-intellij-create-hello-world-web-app), [Azure Toolkit for Eclipse Quickstart](/java/azure/eclipse/azure-toolkit-for-eclipse-create-hello-world-web-app) or [VS Code Quickstart](https://code.visualstudio.com/docs/java/java-webapp).
>
![Sample app running in Azure App Service](media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a Java app

Execute the following Maven command in the Cloud Shell prompt to create a new app named `helloworld`:

```bash
mvn archetype:generate "-DgroupId=example.demo" "-DartifactId=helloworld" "-DarchetypeArtifactId=maven-archetype-webapp"
```
Then change your working directory to the project folder:

```bash
cd helloworld
```

## Configure the Maven plugin

The deploy process to Azure App Service uses account credentials from the Azure CLI. [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest) before continuing.

```azurecli
az login
```

Then you can configure the deployment, run the maven command in the Command Prompt and use the default configurations by pressing **ENTER** until you get the **Confirm (Y/N)** prompt, then press **'y'** and the configuration is done. 
```cmd
mvn com.microsoft.azure:azure-webapp-maven-plugin:1.8.0:config
```
A sample process looks like:

```cmd
~@Azure:~/helloworld$ mvn com.microsoft.azure:azure-webapp-maven-plugin:1.8.0:config
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< example.demo:helloworld >-----------------------
[INFO] Building helloworld Maven Webapp 1.0-SNAPSHOT
[INFO] --------------------------------[ war ]---------------------------------
[INFO]
[INFO] --- azure-webapp-maven-plugin:1.8.0:config (default-cli) @ helloworld ---
[WARNING] The plugin may not work if you change the os of an existing webapp.
Define value for OS(Default: Linux):
1. linux [*]
2. windows
3. docker
Enter index to use:
Define value for javaVersion(Default: jre8):
1. Java 11
2. Java 8 [*]
Enter index to use:
Define value for runtimeStack(Default: TOMCAT 8.5):
1. TOMCAT 9.0
2. TOMCAT 8.5 [*]
3. WILDFLY 14
Enter index to use:
Please confirm webapp properties
AppName : helloworld-1558400876966
ResourceGroup : helloworld-1558400876966-rg
Region : westeurope
PricingTier : Premium_P1V2
OS : Linux
RuntimeStack : TOMCAT 8.5-jre8
Deploy to slot : false
Confirm (Y/N)? : Y
```

> [!NOTE]
> In this article we are only working with Java apps packaged in WAR files. The plugin also supports JAR web applications, visit [Deploy a Java SE JAR file to App Service on Linux](https://docs.microsoft.com/java/azure/spring-framework/deploy-spring-boot-java-app-with-maven-plugin?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) to try it out.

Navigate to `pom.xml` again to see the plugin configuration is updated,  You can modify other configurations for App Service directly in your pom file if needed, some common ones are listed below:

 Property | Required | Description | Version
---|---|---|---
`<schemaVersion>` | false | Specify the version of the configuration schema. Supported values are: `v1`, `v2`. | 1.5.2
`<resourceGroup>` | true | Azure Resource Group for your Web App. | 0.1.0+
`<appName>` | true | The name of your Web App. | 0.1.0+
`<region>` | true | Specifies the region where your Web App will be hosted; the default value is **westeurope**. All valid regions at [Supported Regions](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme) section. | 0.1.0+
`<pricingTier>` | false | The pricing tier for your Web App. The default value is **P1V2**.| 0.1.0+
`<runtime>` | true | The runtime environment configuration, you could see the detail [here](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme). | 0.1.0+
`<deployment>` | true | The deployment configuration, you could see the details [here](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme). | 0.1.0+

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=app-service-linux-quickstart&step=config)

## Deploy the app

Deploy your Java app to Azure using the following command:

```bash
mvn package azure-webapp:deploy
```

Once deployment has completed, browse to the deployed application using the following URL in your web browser, for example `http://<webapp>.azurewebsites.net`. 

![Sample app running in Azure App Service](media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

**Congratulations!** You've deployed your first Java app to App Service on Linux.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=app-service-linux-quickstart&step=deploy)

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group from portal, or by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name <your resource group name; for example: helloworld-1558400876966-rg> --yes
```

This command may take a minute to run.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Java Enterprise app with PostgreSQL](tutorial-java-enterprise-postgresql-app.md)

> [!div class="nextstepaction"]
> [Configure Java app](configure-custom-container.md)

> [!div class="nextstepaction"]
> [CI/CD with Jenkins](/azure/jenkins/deploy-jenkins-app-service-plugin)

> [!div class="nextstepaction"]
> [Other Azure for Java Developers Resources](/java/azure/)

> [!div class="nextstepaction"]
> [Learn More about Maven plugins for Azure](https://github.com/microsoft/azure-maven-plugins)
