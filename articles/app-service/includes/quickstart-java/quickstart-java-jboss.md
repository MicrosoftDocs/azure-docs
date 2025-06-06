---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.topic: include
ms.date: 04/23/2025
ms.author: cephalin
---

In this quickstart, you'll use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application to a Linux JBoss EAP server in [Azure App Service](/azure/app-service/). App Service provides a highly scalable, self-patching web app hosting service. Use the tabs to switch between Tomcat, JBoss, or embedded server (Java SE) instructions.

![Screenshot of Maven Hello World web app running in Azure App Service.](../../media/quickstart-java/jboss-sample-in-app-service.png)

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [Gradle](../../configure-language-java-deploy-run.md?pivots=platform-linux#gradle)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## 1 - Use Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it-no-header.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it-no-header.md)]

## 2 - Create a Java app

Clone the Pet Store demo application.

```azurecli-interactive
git clone https://github.com/Azure-Samples/app-service-java-quickstart
```

Change directory to the completed pet store project and build it.

> [!TIP]
> The `petstore-ee7` sample requires **Java 11 or newer**. The `booty-duke-app-service` sample project requires **Java 17**. If your installed version of Java is less than 17, run the build from within the `petstore-ee7` directory, rather than at the top level.

```azurecli-interactive
cd app-service-java-quickstart
git checkout 20230308
cd petstore-ee7
mvn clean install
```

If you see a message about being in **detached HEAD** state, this message is safe to ignore. Because you won't make any Git commit in this quickstart, detached HEAD state is appropriate.

## 3 - Configure the Maven plugin

The deployment process to Azure App Service uses your Azure credentials from the Azure CLI automatically. If the Azure CLI isn't installed locally, then the Maven plugin authenticates with OAuth or device sign-in. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command shown next to configure the deployment. This command helps you to set up the App Service operating system, Java version, and Tomcat version.

```azurecli-interactive
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.14.1:config
```

1. For **Create new run configuration**, type **Y**, then **Enter**.
1. For **Define value for OS**, type **2** for Linux, then **Enter**.
1. For **Define value for javaVersion**, type **2** for Java 17, then **Enter**. If you select Java 21, you won't see Jbosseap as an option later.
1. For **Define value for webContainer**, type **4** for Jbosseap 7, then **Enter**.
1. For **Define value for pricingTier**, type **1** for P1v3, then **Enter**.
1. For **Confirm**, type **Y**, then **Enter**.

    ```
    Please confirm webapp properties
    AppName : petstoreee7-1745409173307
    ResourceGroup : petstoreee7-1745409173307-rg
    Region : centralus
    PricingTier : P1v3
    OS : Linux
    Java Version: Java 17
    Web server stack: Jbosseap 4
    Deploy to slot : false
    Confirm (Y/N) [Y]: 
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  01:36 min
    [INFO] Finished at: 2025-04-23T11:54:22Z
    [INFO] ------------------------------------------------------------------------
    ```

After you've confirmed your choices, the plugin adds the above plugin element and requisite settings to your project's `pom.xml` file that configure your web app to run in Azure App Service.

The relevant portion of the `pom.xml` file should look similar to the following example.

```xml-interactive
<build>
    <plugins>
        <plugin>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>>azure-webapp-maven-plugin</artifactId>
            <version>x.xx.x</version>
            <configuration>
                <schemaVersion>v2</schemaVersion>
                <resourceGroup>your-resourcegroup-name</resourceGroup>
                <appName>your-app-name</appName>
            ...
            </configuration>
        </plugin>
    </plugins>
</build>           
```

You can modify the configurations for App Service directly in your `pom.xml`.

- For the complete list of configurations, see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration).
- For configurations specific to App Service, see [Azure Web App: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

Be careful about the values of `<appName>` and `<resourceGroup>` (`petstoreee7-1745409173307` and `petstoreee7-1745409173307-rg` accordingly in the demo). They're used later.

## 4 - Deploy the app

With all the configuration ready in your *pom.xml* file, you can deploy your Java app to Azure with one single command.

```azurecli-interactive
# Disable testing, as it requires Wildfly to be installed locally.
mvn package azure-webapp:deploy -DskipTests
```

Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When deployment completes, your application is ready. In this demo, the URL is `http://petstoreee7-1745409173307.azurewebsites.net`. Open the URL with your local web browser, you should see

![Screenshot of Maven Hello World web app running in Azure App Service.](../../media/quickstart-java/jboss-sample-in-app-service.png)

**Congratulations!** You've deployed your first Java app to App Service.

## 5 - Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't need the resources in the future, delete the resource group from portal, or by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name <your resource group name; for example: petstoreee7-1745409173307-rg> --yes
```

This command may take a minute to run.
