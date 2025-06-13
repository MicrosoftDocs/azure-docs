---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.topic: include
ms.date: 06/10/2025
ms.author: cephalin
---

[Azure App Service](/azure/app-service/) provides a highly scalable, self-patching web app hosting service. In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application with an embedded Spring Boot, Quarkus, or Tomcat server to App Service by using the [azure-webapp-maven-plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App).

If Maven isn't your preferred development tool, check out similar articles for Java developers:
+ [Gradle](../../configure-language-java-deploy-run.md?pivots=platform-linux#gradle)
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

## Get the sample app

Choose the appropriate tab and follow instructions to get the sample Spring Boot, Quarkus, or Embedded Tomcat web app.

### [Spring Boot](#tab/springboot)

Download and extract the [default Spring Boot web application template](https://github.com/rd-1-2022/rest-service), or clone it by running the following command. Running the [Spring CLI](https://docs.spring.io/spring-cli/reference/getting-started.html) command `spring boot new my-webapp` also clones the web app.

```bash
git clone https://github.com/rd-1-2022/rest-service my-webapp
```

Then change your working directory to the project folder by running `cd my-webapp`.

### [Quarkus](#tab/quarkus)

1. Generate a new Quarkus app named `quarkus-hello-azure` by running the following Maven command:

   ```bash
   mvn io.quarkus.platform:quarkus-maven-plugin:3.21.3:create \
       -DprojectGroupId=org.acme \
       -DprojectArtifactId=quarkus-hello-azure  \
       -Dextensions='resteasy-reactive'
   ```

1. Change your working directory to the project folder by running `cd quarkus-hello-azure`.

### [Embedded Tomcat](#tab/embeddedtomcat)

1. Download and extract the [embeddedTomcatExample](https://github.com/Azure-Samples/java-docs-embedded-tomcat) repository, or clone it locally by running the following `git clone` command.

   ```bash
   git clone https://github.com/Azure-Samples/java-docs-embedded-tomcat
   ```

1. Change your working directory to the project folder by running `cd java-docs-embedded-tomcat`.

1. Run the application by using the standard [Tomcat](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/startup/Tomcat.html) class. See [Main.java](https://github.com/Azure-Samples/java-docs-embedded-tomcat/blob/main/src/main/java/com/microsoft/azure/appservice/examples/embeddedtomcat/Main.java) in the sample. 

-----

## Configure the Maven plugin

The App Service deployment process uses your Azure credentials from Cloud Shell automatically. The Maven plugin authenticates with OAuth or device sign-in. For more information, see [Authentication](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the following Maven command to configure the deployment by setting the App Service operating system and Java version.

```bash
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.14.1:config
```

1. For **Create new run configuration**, type **Y** and then press **Enter**.
1. For **Define value for OS**, type **2** for Linux, and then press **Enter**.
1. For **Define value for javaVersion**, type **1** for Java 21, and then press **Enter**.
1. For **Define value for pricingTier**, type **3** for P1v2, and then press **Enter**.
1. For **Confirm**, type **Y** and then press **Enter**.

The output should look similar to the following code:

```bash
Please confirm webapp properties
AppName : <generated-app-name>
ResourceGroup : <generated-app-name>-rg
Region : centralus
PricingTier : P1v2
OS : Linux
Java Version: Java 21
Web server stack: Java SE
Deploy to slot : false
Confirm (Y/N) [Y]: 
[INFO] Saving configuration to pom.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  47.533 s
[INFO] Finished at: 2025-04-23T12:20:08Z
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
                <resourceGroup>generated-app-name-rg</resourceGroup>
                <appName>generated-app-name</appName>
            ...
            </configuration>
        </plugin>
    </plugins>
</build>
```

The values for `<appName>` and `<resourceGroup>` are used later.

You can modify the configurations for App Service directly in your *pom.xml* file.

- For the complete list of configurations, see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration).
- For configurations specific to App Service, see [Azure Web App: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

## Deploy the app

With all the configuration ready in your [pom.xml](https://github.com/Azure-Samples/java-docs-embedded-tomcat/blob/main/pom.xml) file, you can deploy your Java app to Azure.

### [Spring Boot](#tab/springboot)

1. Build the JAR file using the following command.
   
   ```bash
    mvn clean package
   ```
   
   > [!TIP]
   > Spring Boot produces two JAR files with `mvn package`, but the `azure-webapp-maven-plugin` picks the right JAR file to deploy automatically.
   
1. Deploy the app to Azure by using the following command:
   
   ```bash
   mvn azure-webapp:deploy
   ```
   
   Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When deployment completes, your application is ready, and you see the following output:
   
   ```output
   [INFO] Successfully deployed the artifact to <URL>
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  02:20 min
   [INFO] Finished at: 2023-07-26T12:47:50Z
   [INFO] ------------------------------------------------------------------------
   ```
   
1. Open your app's default domain from the **Overview** page in the Azure portal, and append `/greeting` to the URL. You should see the following app:
   
   :::image type="content" source="../../media/quickstart-java/springboot-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Spring Boot Hello World web app running in Azure App Service.":::

### [Quarkus](#tab/quarkus)
   
1. Build the JAR file using the following command.
   
   ```bash
   echo '%prod.quarkus.http.port=${PORT}' >> src/main/resources/application.properties
   mvn clean package -Dquarkus.package.jar.type=uber-jar
   ```
   
   Set the Quarkus port in the *application.properties* file to the `PORT` environment variable in the Linux Java container. `Dquarkus.package.jar.type=uber-jar` tells Maven to [generate an Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven), which includes all dependencies in the JAR file.
   
   > [!TIP]
   > Quarkus produces two JAR files with `mvn package`, but `azure-webapp-maven-plugin` picks the right JAR file to deploy automatically.
   
1. Deploy the app to Azure by using the following command:
   
   ```bash
   mvn azure-webapp:deploy
   ```
   
   Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When deployment completes, your application is ready, and you see the following output:
   
   ```output
   [INFO] Successfully deployed the artifact to <URL>
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  02:20 min
   [INFO] Finished at: 2023-07-26T12:47:50Z
   [INFO] ------------------------------------------------------------------------
   ```
   
1. Open your app's default domain from the **Overview** in the Azure portal, and append `/hello` to the URL. You should see the following app:
   
   :::image type="content" source="../../media/quickstart-java/quarkus-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Quarkus web app running in Azure App Service.":::

### [Embedded Tomcat](#tab/embeddedtomcat)
   
1. Build the JAR file using the following command.
   
   ```bash
   mvn clean package
   ```
   
   To make the application deploy using the [azure-webapp-maven-plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App) and run on Azure App Service, the sample configures the `package` goal as follows:
   
   - Builds a single uber JAR file, which contains everything the application needs to run.
   - Creates an [executable JAR](https://en.wikipedia.org/wiki/JAR_(file_format)#Executable_JAR_files) by specifying the Tomcat class as the startup class.
   - Replaces the original artifact with the `Uber-Jar` to ensure that the deploy step deploys the right file.
   
1. Deploy the app to Azure by using the following command:
   
   ```bash
   mvn azure-webapp:deploy
   ```
   
   Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When deployment completes, your application is ready, and you see the following output:
   
   ```output
   [INFO] Successfully deployed the artifact to <URL>
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  02:20 min
   [INFO] Finished at: 2023-07-26T12:47:50Z
   [INFO] ------------------------------------------------------------------------
   ```
   
1. Open the URL for your app's default domain from the **Overview** in the Azure portal. You should see the following app:
   
   :::image type="content" source="../../media/quickstart-java/embedded-tomcat-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of embedded Tomcat web app running in Azure App Service.":::

-----

Congratulations! You deployed a Java app to App Service.

## Clean up resources

You created the resources for this tutorial in an Azure resource group. If you no longer need them, you can delete the resource group and all its resources by running the following Azure CLI command in the Cloud Shell.

```azurecli-interactive
az group delete --name <resource group name>  --yes
```

For example, run `az group delete --name quarkus-hello-azure-1690375364238-rg --yes`. This command might take a while to run.

