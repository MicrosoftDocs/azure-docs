---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.topic: include
ms.date: 04/23/2025
ms.author: cephalin
---

In this quickstart, you use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application with an embedded server to [Azure App Service](/azure/app-service/). App Service provides a highly scalable, self-patching web app hosting service. Use the tabs to switch between Tomcat, JBoss, or embedded server (Java SE) instructions.

The quickstart deploys either a Spring Boot app, Quarkus app, or embedded Tomcat using the [azure-webapp-maven-plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App) plugin.

### [Spring Boot](#tab/springboot)

:::image type="content" source="../../media/quickstart-java/springboot-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Spring Boot Hello World web app running in Azure App Service in introduction.":::

### [Quarkus](#tab/quarkus)

:::image type="content" source="../../media/quickstart-java/quarkus-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Quarkus Hello World web app running in Azure App Service in introduction.":::

### [Embedded Tomcat](#tab/embeddedtomcat)

:::image type="content" source="../../media/quickstart-java/embedded-tomcat-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of embedded Tomcat Hello World web app running in Azure App Service in introduction.":::

-----

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [Gradle](../../configure-language-java-deploy-run.md?pivots=platform-linux#gradle)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## 1 - Use Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it-no-header.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it-no-header.md)]

## 2 - Get the sample app

### [Spring Boot](#tab/springboot)

1. Download and extract the [default Spring Boot web application template](https://github.com/rd-1-2022/rest-service). This repository is cloned for you when you run the [Spring CLI](https://docs.spring.io/spring-cli/reference/getting-started.html) command `spring boot new my-webapp`.

    ```bash
    git clone https://github.com/rd-1-2022/rest-service my-webapp
    ```

1. Change your working directory to the project folder:

    ```azurecli-interactive
    cd my-webapp
    ```

### [Quarkus](#tab/quarkus)

1. Generate a new Quarkus app named `quarkus-hello-azure` with the following Maven command:

    ```azurecli-interactive
    mvn io.quarkus.platform:quarkus-maven-plugin:3.21.3:create \
        -DprojectGroupId=org.acme \
        -DprojectArtifactId=quarkus-hello-azure  \
        -Dextensions='resteasy-reactive'
    ```

1. Change your working directory to the project folder:

    ```azurecli-interactive
    cd quarkus-hello-azure
    ```

### [Embedded Tomcat](#tab/embeddedtomcat)

1. Download and extract the [embeddedTomcatExample](https://github.com/Azure-Samples/java-docs-embedded-tomcat) repository, or clone it locally by running `git clone`:

    ```bash
    git clone https://github.com/Azure-Samples/java-docs-embedded-tomcat
    ```

1. Change your working directory to the project folder:

    ```azurecli-interactive
    cd java-docs-embedded-tomcat
    ```

    The application is run using the standard [Tomcat](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/startup/Tomcat.html) class (see [Main.java](https://github.com/Azure-Samples/java-docs-embedded-tomcat/blob/main/src/main/java/com/microsoft/azure/appservice/examples/embeddedtomcat/Main.java) in the sample). 

-----

## 3 - Configure the Maven plugin

The deployment process to Azure App Service uses your Azure credentials from the Azure CLI automatically. If the Azure CLI isn't installed locally, then the Maven plugin authenticates with OAuth or device sign-in. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command shown next to configure the deployment. This command helps you to set up the App Service operating system, Java version, and Tomcat version.

```azurecli-interactive
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.14.1:config
```

1. For **Create new run configuration**, type **Y**, then **Enter**.
1. For **Define value for OS**, type **2** for Linux, then **Enter**.
1. For **Define value for javaVersion**, type **1** for Java 21, then **Enter**.
1. For **Define value for pricingTier**, type **3** for P1v2, then **Enter**.
1. For **Confirm**, type **Y**, then **Enter**.

    ```
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

After you confirm your choices, the plugin adds the above plugin element and requisite settings to your project's `pom.xml` file that configure your web app to run in Azure App Service.

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

Be careful about the values of `<appName>` and `<resourceGroup>`. They're used later.

## 4 - Deploy the app

With all the configuration ready in your [pom.xml](https://github.com/Azure-Samples/java-docs-embedded-tomcat/blob/main/pom.xml) file, you can deploy your Java app to Azure with one single command.

1. Build the JAR file using the following command(s):

    ### [Spring Boot](#tab/springboot)
    
    ```bash
    mvn clean package
    ```

    > [!TIP]
    > Spring Boot produces two JAR files with `mvn package`, but `azure-webapp-maven-plugin` picks the right JAR file to deploy automatically.
    
    ### [Quarkus](#tab/quarkus)

    ```bash
    echo '%prod.quarkus.http.port=${PORT}' >> src/main/resources/application.properties
    mvn clean package -Dquarkus.package.jar.type=uber-jar
    ```

    In these commands:
    - You set the Quarkus port in the *application.properties* file to the PORT environment variable in the Linux Java container.
    - `quarkus.package.jar.type=uber-jar` tells Maven to [generate an Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven), which includes all dependencies in the JAR file.

    > [!TIP]
    > Quarkus produces two JAR files with `mvn package`, but `azure-webapp-maven-plugin` picks the right JAR file to deploy automatically.
    
    ### [Embedded Tomcat](#tab/embeddedtomcat)
    
    ```bash
    mvn clean package
    ```

    To make the application it deployable using [azure-webapp-maven-plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App), and running on Azure App Service, the sample configures the `package` goal as follows:
    
    - Build a single uber JAR file, which contains everything the application needs to run.
    - Create an [executable JAR](https://en.wikipedia.org/wiki/JAR_(file_format)#Executable_JAR_files) by specifying the Tomcat class as the start-up class.
    - Replace the original artifact with the uber JAR to ensure that the deploy step deploys the right file.

    -----

2. Deploy to Azure by using the following command:

   ```bash
   mvn azure-webapp:deploy
   ```

    Once you select from a list of available subscriptions, Maven deploys to Azure App Service. When the deployment completes, you see the following output:

    ```output
    [INFO] Successfully deployed the artifact to <URL>
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  02:20 min
    [INFO] Finished at: 2023-07-26T12:47:50Z
    [INFO] ------------------------------------------------------------------------
    ```

    Your application is ready.

### [Spring Boot](#tab/springboot)

Get the default domain for your app in the Azure portal by selecting **Overview** for your app. Append `/greeting`. You should see:

:::image type="content" source="../../media/quickstart-java/springboot-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Spring Boot Hello World web app running in Azure App Service.":::

### [Quarkus](#tab/quarkus)

Get the default domain for your app in the Azure portal by selecting **Overview** for your app. Append `/hello`. You should see:

:::image type="content" source="../../media/quickstart-java/quarkus-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Quarkus web app running in Azure App Service.":::

### [Embedded Tomcat](#tab/embeddedtomcat)

Open the URL with your local web browser, and you should see:

:::image type="content" source="../../media/quickstart-java/embedded-tomcat-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of embedded Tomcat web app running in Azure App Service.":::

-----

**Congratulations!** You deployed your first Java app to App Service.

## 5 - Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't need the resources in the future, delete the resource group from portal, or by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name <your resource group name; for example: quarkus-hello-azure-1690375364238-rg> --yes
```

This command might take a minute to run.
