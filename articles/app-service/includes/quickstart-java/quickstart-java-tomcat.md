---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.topic: include
ms.date: 06/10/2025
ms.author: cephalin
---

[Azure App Service](/azure/app-service/) provides a highly scalable, self-patching web app hosting service. In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application to a Linux Tomcat server in Azure App Service.

If Maven isn't your preferred development tool, check out similar articles for Java developers:
+ [Gradle](../../configure-language-java-deploy-run.md#gradle)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- Run the commands in this quickstart by using Azure Cloud Shell, an interactive shell that you can use through your browser to work with Azure services. To use Cloud Shell:

  1. Select the following **Launch Cloud Shell** button or go to https://shell.azure.com to open Cloud Shell in your browser.

     :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  1. Sign in to Azure if necessary, and make sure you're in the **Bash** environment of Cloud Shell.
  1. Select **Copy** in a code block, paste the code into Cloud Shell, and run it.

## Create a Java app

Run the following Maven command in Cloud Shell to create a new app named `helloworld`:

```bash
mvn archetype:generate "-DgroupId=example.demo" "-DartifactId=helloworld" "-DarchetypeArtifactId=maven-archetype-webapp" "-DarchetypeVersion=1.4" "-Dversion=1.0-SNAPSHOT"
```

Then change your working directory to the project folder by running `cd helloworld`.

## Configure the Maven plugin

The App Service deployment process uses your Azure credentials from Cloud Shell automatically. The Maven plugin authenticates with OAuth or device sign-in. For more information, see [Authentication](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the following Maven command to configure the deployment by setting the App Service operating system, Java version, and Tomcat version.

```bash
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.14.1:config
```

1. For **Create new run configuration**, type **Y** and then press **Enter**.
1. For **Define value for OS**, type **2** for Linux, and then press **Enter**.
1. For **Define value for javaVersion**, type **1** for Java 21, and then press **Enter**.
1. For **Define value for webContainer**, type **1** for Tomcat 10.1, and then press **Enter**.
1. For **Define value for pricingTier**, type **3** for P1V2, and then press **Enter**.
1. For **Confirm**, type **Y** and then press **Enter**.

The output should look similar to the following code:

```bash
Please confirm webapp properties
AppName : helloworld-1745408005556
ResourceGroup : helloworld-1745408005556-rg
Region : centralus
PricingTier : P1V2
OS : Linux
Java Version: Java 21
Web server stack: Tomcat 10.1
Deploy to slot : false
Confirm (Y/N) [Y]: 
[INFO] Saving configuration to pom.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:36 min
[INFO] Finished at: 2025-04-23T11:34:44Z
[INFO] ------------------------------------------------------------------------
```

After you confirm your choices, the plugin adds the plugin element and required settings to your project's *pom.xml* file, which configures your web app to run in App Service.

The relevant portion of the *pom.xml* file should look similar to the following example.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>>azure-webapp-maven-plugin</artifactId>
            <version>x.xx.x</version>
            <configuration>
                <schemaVersion>v2</schemaVersion>
                <resourceGroup>helloworld-1745408005556-rg</resourceGroup>
                <appName>helloworld-1745408005556</appName>
            ...
            </configuration>
        </plugin>
    </plugins>
</build>
```

The values for `<appName>` and `<resourceGroup>`, `helloworld-1745408005556` and `helloworld-1745408005556-rg` for the demo app, are used later.

You can modify the configurations for App Service directly in your *pom.xml* file.

- For the complete list of configurations, see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration).
- For configurations specific to App Service, see [Azure Web App: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

## Deploy the app

With all the configuration ready in the *pom.xml* file, you can deploy your Java app to Azure with the following single command.

```bash
mvn package azure-webapp:deploy
```

Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When deployment completes, your application is ready.

For this demo, the URL is `http://helloworld-1745408005556.azurewebsites.net`. When you open the URL with your local web browser, you should see the following app:

![Screenshot of Maven Hello World web app running in Azure App Service.](../../media/quickstart-java/java-hello-world-in-browser-azure-app-service.png)

Congratulations! You deployed a Java app to App Service.

## Clean up resources

You created the resources for this tutorial in an Azure resource group. If you no longer need them, you can delete the resource group and all its resources by running the following Azure CLI command in Cloud Shell.

```azurecli-interactive
az group delete --name helloworld-1745408005556-rg --yes
```
The command might take a while to run.

