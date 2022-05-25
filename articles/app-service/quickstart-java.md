---
title: 'Quickstart: Create a Java app on Azure App Service'
description: Deploy your first Java Hello World to Azure App Service in minutes. The Azure Web App Plugin for Maven makes it convenient to deploy Java apps.
keywords: azure, app service, web app, windows, linux, java, maven, quickstart
author: jasonfreeberg
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.devlang: java
ms.topic: quickstart
ms.date: 03/03/2022
ms.author: jafreebe
ms.custom: mvc, seo-java-july2019, seo-java-august2019, seo-java-september2019, mode-other, devdivchpfy22
zone_pivot_groups: app-service-platform-windows-linux
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-java-uiex
---

# Quickstart: Create a Java app on Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This quickstart shows how to use the [Azure CLI](/cli/azure/get-started-with-azure-cli) with the [Azure Web App Plugin for Maven](https://github.com/Microsoft/azure-maven-plugins/tree/develop/azure-webapp-maven-plugin) to deploy a .jar file, or .war file. Use the tabs to switch between Java SE and Tomcat instructions.

# [Java SE](#tab/javase)

![Spring app greetings in Azure App Service](./media/quickstart-java/java-se-greetings-in-browser.png)

# [Tomcat](#tab/tomcat)

![Maven Hello World web app running in Azure App Service](./media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

# [JBoss EAP](#tab/jbosseap)

::: zone pivot="platform-windows"

JBoss EAP is only available on the Linux version of App Service. Select the **Linux** button at the top of this article to view the quickstart instructions for JBoss EAP.

::: zone-end

::: zone pivot="platform-linux"
![Maven Hello World web app running in Azure App Service](./media/quickstart-java/jboss-sample-in-app-service.png)

::: zone-end

-----

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [Azure Portal](./quickstart-java-azure-portal.md)
+ [Gradle](./configure-language-java.md?pivots=platform-linux#gradle)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a Java app

# [Java SE](#tab/javase)

Clone the [Spring Boot Getting Started](https://github.com/spring-guides/gs-spring-boot) sample project.

```azurecli-interactive
git clone https://github.com/spring-guides/gs-spring-boot
```

Change directory to the completed project.

```azurecli-interactive
cd gs-spring-boot/complete
```

# [Tomcat](#tab/tomcat)

Execute the following Maven command in the Cloud Shell prompt to create a new app named `helloworld`:

```azurecli-interactive
mvn archetype:generate "-DgroupId=example.demo" "-DartifactId=helloworld" "-DarchetypeArtifactId=maven-archetype-webapp" "-Dversion=1.0-SNAPSHOT"
```

Then change your working directory to the project folder:

```azurecli-interactive
cd helloworld
```

# [JBoss EAP](#tab/jbosseap)

::: zone pivot="platform-windows"

JBoss EAP is only available on the Linux version of App Service. Select the **Linux** button at the top of this article to view the quickstart instructions for JBoss EAP.

::: zone-end
::: zone pivot="platform-linux"

Clone the Pet Store demo application.

```azurecli-interactive
git clone https://github.com/agoncal/agoncal-application-petstore-ee7.git
```

Change directory to the cloned project.

```azurecli-interactive
cd agoncal-application-petstore-ee7
```

::: zone-end

---

## Configure the Maven plugin

> [!TIP]
> The Maven plugin supports **Java 17** and **Tomcat 10.0**. For more information about latest support, see [Java 17 and Tomcat 10.0 are available on Azure App Service](https://devblogs.microsoft.com/java/java-17-and-tomcat-10-0-available-on-azure-app-service/).


The deployment process to Azure App Service will use your Azure credentials from the Azure CLI automatically. If the Azure CLI is not installed locally, then the Maven plugin will authenticate with Oauth or device login. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command below to configure the deployment. This command will help you to set up the App Service operating system, Java version, and Tomcat version.

```azurecli-interactive
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.5.0:config
```

::: zone pivot="platform-windows"

# [Java SE](#tab/javase)

1. If prompted with **Subscription** option, select the proper `Subscription` by entering the number printed at the line start.
2. When prompted with **Web App** option, select the default option, `<create>`, by pressing enter.
3. When prompted with **OS** option, select **Windows** by entering `1`.
4. When prompted with **javaVersion** option, select **Java 11** by entering `2`.
5. When prompted with **Pricing Tier** option, select **P1v2** by entering `10`.
6. Finally, press enter on the last prompt to confirm your selections.

    Your summary output will look similar to the snippet shown below.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : spring-boot-1599007390755
    ResourceGroup : spring-boot-1599007390755-rg
    Region : centralus
    PricingTier : P1v2
    OS : Windows
    Java : Java 11
    Web server stack : Java SE
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

1. If prompted with **Subscription** option, select the proper `Subscription` by entering the number printed at the line start.
2. When prompted with **Web App** option, select the default option, `<create>`, by pressing enter.
3. When prompted with **OS** option, select **Windows** by entering `1`.
4. When prompted with **javaVersion** option, select **Java 11** by entering `2`.
5. When prompted with **webContainer** option, select **Tomcat 8.5** by entering `1`.
6. When prompted with **Pricing Tier** option, select **P1v2** by entering `10`.
7. Finally, press enter on the last prompt to confirm your selections.

    Your summary output will look similar to the snippet shown below.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : helloworld-1599003152123
    ResourceGroup : helloworld-1599003152123-rg
    Region : centralus
    PricingTier : P1v2
    OS : Windows
    Java : Java 11
    Web server stack : Tomcat 8.5
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

# [JBoss EAP](#tab/jbosseap)

JBoss EAP is only available on the Linux version of App Service. Select the **Linux** button at the top of this article to view the quickstart instructions for JBoss EAP.

---

::: zone-end
::: zone pivot="platform-linux"

# [Java SE](#tab/javase)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number printed at the line start.
1. When prompted with **Web App** option, select the default option, `<create>`, by pressing enter.
1. When prompted with **OS** option, select **Linux** by pressing enter.
2. When prompted with **javaVersion** option, select **Java 11** by entering `2`.
3. When prompted with **Pricing Tier** option, select **P1v2** by entering `9`.
4. Finally, press enter on the last prompt to confirm your selections.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : spring-boot-1599007116351
    ResourceGroup : spring-boot-1599007116351-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Web server stack : Java SE
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

# [Tomcat](#tab/tomcat)

1. When prompted with **Subscription** option, select the proper `Subscription` by entering the number printed at the line start.
1. When prompted with **Web App** option, select the default option, `<create>`, by pressing enter.
1. When prompted with **OS** option, select **Linux** by pressing enter.
1. When prompted with **javaVersion** option, select **Java 11** by entering `2`.
1. When prompted with **webcontainer** option, select **Tomcat 8.5** by entering `2`.
1. When prompted with **Pricing Tier** option, select **P1v2** by entering `9`.
1. Finally, press enter on the last prompt to confirm your selections.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : helloworld-1599003744223
    ResourceGroup : helloworld-1599003744223-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Web server stack : Tomcat 8.5
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

# [JBoss EAP](#tab/jbosseap)

1. If prompted with **Subscription** option, select the proper `Subscription` by entering the number printed at the line start.
1. When prompted with **Web App** option, accept the default option `<create>` by pressing enter.
1. When prompted with **OS** option, select **Linux** by pressing enter.
1. When prompted with **javaVersion** option, select **Java 11** by entering `2`.
1. When prompted with **webContainer** option, select **Jbosseap 7** by entering `1`
1. When prompted with **pricingTier** option, select **P1v3** by entering `1`
1. Finally, press enter on the last prompt to confirm your selections.

    ```
    Please confirm webapp properties
    Subscription Id : ********-****-****-****-************
    AppName : petstoreee7-1623451825408
    ResourceGroup : petstoreee7-1623451825408-rg
    Region : centralus
    PricingTier : P1v3
    OS : Linux
    Java : Java 11
    Web server stack: Jbosseap 7
    Deploy to slot : false
    Confirm (Y/N) [Y]: y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 01:01 min
    [INFO] Finished at: 2021-06-11T15:52:25-07:00
    [INFO] ------------------------------------------------------------------------
    ```

---

::: zone-end

You can modify the configurations for App Service directly in your `pom.xml`. Some common configurations are listed below:

Property | Required | Description | Version
---|---|---|---
`<schemaVersion>` | false | Specify the version of the configuration schema. Supported values are: `v1`, `v2`. | 1.5.2
`<subscriptionId>` | false | Specify the subscription ID. | 0.1.0+
`<resourceGroup>` | true | Azure Resource Group for your Web App. | 0.1.0+
`<appName>` | true | The name of your Web App. | 0.1.0+
`<region>` | false | Specifies the region where your Web App will be hosted; the default value is **centralus**. All valid regions at [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service) section. | 0.1.0+
`<pricingTier>` | false | The pricing tier for your Web App. The default value is **P1v2** for production workload, while **B2** is the recommended minimum for Java dev/test. For more information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/)| 0.1.0+
`<runtime>` | false | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+
`<deployment>` | false | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+

Be careful about the values of `<appName>` and `<resourceGroup>` (`helloworld-1590394316693` and `helloworld-1590394316693-rg` accordingly in the demo), they'll be used later.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=quickstart-java&step=config)

## Deploy the app

With all the configuration ready in your pom file, you can deploy your Java app to Azure with one single command.

# [Java SE](#tab/javase)
```azurecli-interactive
mvn package azure-webapp:deploy
```
# [Tomcat](#tab/tomcat)
```azurecli-interactive
mvn package azure-webapp:deploy
```
# [JBoss EAP](#tab/jbosseap)

::: zone pivot="platform-windows"

JBoss EAP is only available on the Linux version of App Service. Select the **Linux** button at the top of this article to view the quickstart instructions for JBoss EAP.

::: zone-end

::: zone pivot="platform-linux"

```azurecli-interactive
# Disable testing, as it requires Wildfly to be installed locally.
mvn package azure-webapp:deploy -DskipTests
```
::: zone-end

-----

Once deployment is completed, your application will be ready at `http://<appName>.azurewebsites.net/` (`http://helloworld-1590394316693.azurewebsites.net` in the demo). Open the url with your local web browser, you should see

# [Java SE](#tab/javase)

![Spring app greetings in Azure App Service](./media/quickstart-java/java-se-greetings-in-browser.png)

# [Tomcat](#tab/tomcat)

![Maven Hello World web app running in Azure App Service](./media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

# [JBoss EAP](#tab/jbosseap)

::: zone pivot="platform-windows"

JBoss EAP is only available on the Linux version of App Service. Select the **Linux** button at the top of this article to view the quickstart instructions for JBoss EAP.

::: zone-end

::: zone pivot="platform-linux"

![Maven Hello World web app running in Azure App Service](./media/quickstart-java/jboss-sample-in-app-service.png)

::: zone-end

-----

**Congratulations!** You've deployed your first Java app to App Service.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=app-service-linux-quickstart&step=deploy)

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't need the resources in the future, delete the resource group from portal, or by running the following command in the Cloud Shell:

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
