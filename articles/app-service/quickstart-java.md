---
title: 'Quickstart: Create a Java app on Azure App Service'
description: Deploy your first Java Hello World to Azure App Service in minutes. The Azure Web App Plugin for Maven makes it convenient to deploy Java apps.
keywords: azure, app service, web app, windows, linux, java, maven, quickstart
author: jasonfreeberg

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.devlang: Java
ms.topic: quickstart
ms.date: 08/01/2020
ms.author: jafreebe
ms.custom: mvc, seo-java-july2019, seo-java-august2019, seo-java-september2019
zone_pivot_groups: app-service-platform-windows-linux
---

# Quickstart: Create a Java app on Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service.  This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) with the [Azure Web App Plugin for Maven](https://github.com/Microsoft/azure-maven-plugins/tree/develop/azure-webapp-maven-plugin) to deploy a .jar file, or .war file. Use the tabs to switch between Java SE and Tomcat instructions.


> [!NOTE]
> The same can also be done using popular IDEs like IntelliJ and Eclipse. Check out our similar documents at [Azure Toolkit for IntelliJ Quickstart](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app) or [Azure Toolkit for Eclipse Quickstart](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app).


![Sample app running in Azure App Service](./media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a Java app

# [Java SE](#tab/javase)

Clone the [Spring Boot Getting Started](https://github.com/spring-guides/gs-spring-boot) sample project.

```bash
git clone https://github.com/spring-guides/gs-spring-boot
```

Change directory to the completed project.

```bash
cd gs-spring-boot/complete
```

# [Tomcat](#tab/tomcat)

Execute the following Maven command in the Cloud Shell prompt to create a new app named `helloworld`:

```bash
mvn archetype:generate "-DgroupId=example.demo" "-DartifactId=helloworld" "-DarchetypeArtifactId=maven-archetype-webapp" "-Dversion=1.0-SNAPSHOT"
```

Then change your working directory to the project folder:

```bash
cd helloworld
```

---

## Configure the Maven plugin

The deployment process to Azure App Service will use your Azure credentials from the Azure CLI automatically. If the Azure CLI is not installed locally, then the Maven plugin will authenticate with Oauth or device login. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command below to configure the deployment. This command will help you to set up the App Service operating system, Java version, and Tomcat version.

```bash
mvn com.microsoft.azure:azure-webapp-maven-plugin:1.11.0:config
```

::: zone pivot="platform-windows"

# [Java SE](#tab/javase)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number print in the line start.
1. When prompted with **Web App** option, accept the defaut option `<create>` by pressing enter.
1. When prompted with **OS** option, select **windows** by entering `2`.
1. Use the default Java version, 1.8, by pressing enter.
1. Finally, press enter on the last prompt to confirm your selections.

    Your summary output will look similar to the snippet shown below.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : spring-boot-1599007390755
    ResourceGroup : spring-boot-1599007390755-rg
    Region : westeurope
    PricingTier : PremiumV2_P1v2
    OS : Windows
    Java : 1.8
    WebContainer : java 8
    Deploy to slot : false
    Confirm (Y/N)? : Y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 41.118 s
    [INFO] Finished at: 2020-09-01T17:43:45-07:00
    [INFO] ------------------------------------------------------------------------
    ```

# [Tomcat](#tab/tomcat)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number print in the line start.
1. When prompted with **Web App** option, accept the defaut option `<create>` by pressing enter.
1. When prompted with **OS** option, select **windows** by entering `2`.
1. Use the default Java version, 1.8, by pressing enter.
1. Use the default web container, Tomcat 8.5, by pressing enter.
1. Finally, press enter on the last prompt to confirm your selections.

    Your summary output will look similar to the snippet shown below.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : helloworld-1599003152123
    ResourceGroup : helloworld-1599003152123-rg
    Region : westeurope
    PricingTier : PremiumV2_P1v2
    OS : Windows
    Java : 1.8
    WebContainer : tomcat 8.5
    Deploy to slot : false
    Confirm (Y/N)? : Y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 03:03 min
    [INFO] Finished at: 2020-09-01T16:35:30-07:00
    [INFO] ------------------------------------------------------------------------
    ```

---

::: zone-end
::: zone pivot="platform-linux"

### [Java SE](#tab/javase)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number print in the line start.
1. When prompted with **Web App** option, accept the defaut option `<create>` by pressing enter.
1. When prompted with **OS** option, select **linux** by pressing enter.
1. Use the default Java version, 1.8, by pressing enter.
1. Finally, press enter on the last prompt to confirm your selections.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : spring-boot-1599007116351
    ResourceGroup : spring-boot-1599007116351-rg
    Region : westeurope
    PricingTier : PremiumV2_P1v2
    OS : Linux
    RuntimeStack : JAVA 8-jre8
    Deploy to slot : false
    Confirm (Y/N)? : Y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 20.925 s
    [INFO] Finished at: 2020-09-01T17:38:51-07:00
    [INFO] ------------------------------------------------------------------------
    ```

### [Tomcat](#tab/tomcat)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number print in the line start.
1. When prompted with **Web App** option, accept the defaut option `<create>` by pressing enter.
1. When prompted with **OS** option, select **linux** by pressing enter.
1. Use the default Java version, 1.8, by pressing enter.
1. Use the default web container, Tomcat 8.5, by pressing enter.
1. Finally, press enter on the last prompt to confirm your selections.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : helloworld-1599003744223
    ResourceGroup : helloworld-1599003744223-rg
    Region : westeurope
    PricingTier : PremiumV2_P1v2
    OS : Linux
    RuntimeStack : TOMCAT 8.5-jre8
    Deploy to slot : false
    Confirm (Y/N)? : Y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 50.785 s
    [INFO] Finished at: 2020-09-01T16:43:09-07:00
    [INFO] ------------------------------------------------------------------------
    ```

---

::: zone-end

You can modify the configurations for App Service directly in your `pom.xml` if needed. Some common ones are listed below:

Property | Required | Description | Version
---|---|---|---
`<schemaVersion>` | false | Specify the version of the configuration schema. Supported values are: `v1`, `v2`. | 1.5.2
`<subscriptionId>` | false | Specify the subscription id. | 0.1.0+
`<resourceGroup>` | true | Azure Resource Group for your Web App. | 0.1.0+
`<appName>` | true | The name of your Web App. | 0.1.0+
`<region>` | true | Specifies the region where your Web App will be hosted; the default value is **westeurope**. All valid regions at [Supported Regions](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme) section. | 0.1.0+
`<pricingTier>` | false | The pricing tier for your Web App. The default value is **P1V2**.| 0.1.0+
`<runtime>` | true | The runtime environment configuration, you could see the detail [here](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme). | 0.1.0+
`<deployment>` | true | The deployment configuration, you could see the details [here](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme). | 0.1.0+

Be careful about the values of `<appName>` and `<resourceGroup>`(`helloworld-1590394316693` and `helloworld-1590394316693-rg` accordingly in the demo), they will be used later.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=quickstart-java&step=config)

## Deploy the app

The Maven plugin uses account credentials from the Azure CLI to deploy to App Services. [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest) before continuing.

```azurecli
az login
```

Then you can deploy your Java app to Azure using the following command.

```bash
mvn package azure-webapp:deploy
```

Once deployment has completed, your application will be ready at `http://<appName>.azurewebsites.net/`(`http://helloworld-1590394316693.azurewebsites.net` in the demo). Open the url with your local web browser, you should see

![Sample app running in Azure App Service](./media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

**Congratulations!** You've deployed your first Java app to App Service.

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
> [Connect to Azure DB for PostgreSQL with Java](../postgresql/connect-java.md)

> [!div class="nextstepaction"]
> [Set up CI/CD](deploy-continuous-deployment.md)

> [!div class="nextstepaction"]
> [Pricing Information](https://azure.microsoft.com/pricing/details/app-service/linux/)

> [!div class="nextstepaction"]
> [Aggregate Logs and Metrics](troubleshoot-diagnostic-logs.md)

> [!div class="nextstepaction"]
> [Scale up](manage-scale-up.md)

> [!div class="nextstepaction"]
> [Azure for Java Developers Resources](/java/azure/)

> [!div class="nextstepaction"]
> [Configure your Java app](configure-language-java.md)
