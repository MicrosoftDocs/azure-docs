---
author: cephalin
ms.service: app-service
ms.devlang: java
ms.topic: include
ms.date: 08/30/2023
ms.author: cephalin
---

In this quickstart, you'll use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application with an embedded server to [Azure App Service](/azure/app-service/). App Service provides a highly scalable, self-patching web app hosting service. Use the tabs to switch between Tomcat, JBoss, or embedded server (Java SE) instructions.

The quickstart uses a [Quarkus](https://quarkus.io) sample, which comes with a bundled web server. You can deploy your own application and server bundle in a single JAR file to App Service instead of the using the Tomcat or JBoss hosting options. If you want, you can also embed a Tomcat server in the JAR file and run that in App Service.

> [!NOTE]
> For Spring apps that requires all the Spring services, try [Azure Spring Apps](../../../spring-apps/quickstart.md) instead. However, you can deploy Spring Boot apps to App Service.

:::image type="content" source="../../media/quickstart-java/quarkus-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Maven Hellow World web app running in Azure App Service in introduction.":::

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [Gradle](../../configure-language-java.md?pivots=platform-linux#gradle)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## 1 - Use Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it-no-header.md](../../../../includes/cloud-shell-try-it-no-header.md)]

## 2 - Create a Java app

Execute the following Maven command in the Cloud Shell prompt to create a new app named `quarkus-hello-azure`:

```azurecli-interactive
   mvn io.quarkus.platform:quarkus-maven-plugin:3.2.2.Final:create \
     -DprojectGroupId=org.acme \
     -DprojectArtifactId=quarkus-hello-azure  \
     -Dextensions='resteasy-reactive'
```

Then change your working directory to the project folder:

```azurecli-interactive
cd quarkus-hello-azure
```

## 3 - Configure the Maven plugin

The deployment process to Azure App Service uses your Azure credentials from the Azure CLI automatically. If the Azure CLI isn't installed locally, then the Maven plugin authenticates with OAuth or device sign-in. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command shown next to configure the deployment. This command helps you to set up the App Service operating system, Java version, and Tomcat version.

```azurecli-interactive
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.12.0:config
```

1. For **Create new run configuration**, type **Y**, then **Enter**.
1. For **Define value for OS**, type **2** for Linux, then **Enter**.
1. For **Define value for javaVersion**, type **1** for Java 17, then **Enter**.
1. For **Define value for pricingTier**, type **9** for P1v2, then **Enter**.
1. For **Confirm**, type **Y**, then **Enter**.

    ```
    Please confirm webapp properties
    AppName : quarkus-hello-azure-1690375364238
    ResourceGroup : quarkus-hello-azure-1690375364238-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Java Version: Java 17
    Web server stack: Java SE
    Deploy to slot : false
    Confirm (Y/N) [Y]: y
    [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  8.139 s
    [INFO] Finished at: 2023-07-26T12:42:48Z
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

You can modify the configurations for App Service directly in your `pom.xml`. Some common configurations are listed in the following table:

Property | Required | Description | Version
---|---|---|---
`<schemaVersion>` | false | Specify the version of the configuration schema. Supported values are: `v1`, `v2`. | 1.5.2
`<subscriptionId>` | false | Specify the subscription ID. | 0.1.0+
`<resourceGroup>` | true | Azure Resource Group for your Web App. | 0.1.0+
`<appName>` | true | The name of your Web App. | 0.1.0+
`<region>` | false | Specifies the region to host your Web App; the default value is **centralus**. All valid regions at [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service) section. | 0.1.0+
`<pricingTier>` | false | The pricing tier for your Web App. The default value is **P1v2** for production workload, while **B2** is the recommended minimum for Java dev/test. For more information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/)| 0.1.0+
`<runtime>` | false | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+
`<deployment>` | false | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+

For the complete list of configurations, see the plugin reference documentation. All the Azure Maven Plugins share a common set of configurations. For these configurations see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration). For configurations specific to App Service, see [Azure Web App: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

Be careful about the values of `<appName>` and `<resourceGroup>` (`quarkus-hello-azure-1690375364238` and `quarkus-hello-azure-1690375364238-rg` accordingly in the demo). They're used later.

## 4 - Deploy the app

With all the configuration ready in your *pom.xml* file, you can deploy your Java app to Azure with one single command.

1. Rebuild the JAR file using the following command:

    ```bash
    mvn clean package -Dquarkus.package.type=uber-jar -D%prod.quarkus.http.port=80 
    ```

    This command adds two Quarkus properties:

    - `quarkus.package.type=uber-jar` tells Maven to [generate an Uber-Jar](https://quarkus.io/guides/maven-tooling#uber-jar-maven), which includes all dependencies in the JAR file.
    - `%prod.quarkus.http.port=80` tells Quarkus to use port 80 for the prod environment at runtime, which is the default port that the Linux Java container uses. If you want, you can change the port number of the Java container with the `WEBSITES_PORT` app setting.

    You can configure these properties by using other means, but they're added to `mvn package` command here for simplicity.

2. Deploy to Azure by using the following command:

   ```bash
   mvn azure-webapp:deploy
   ```

    If the deployment succeeds, you see the following output:

    ```output
    [INFO] Successfully deployed the artifact to https://quarkus-hello-azure-1690375364238.azurewebsites.net
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  02:20 min
    [INFO] Finished at: 2023-07-26T12:47:50Z
    [INFO] ------------------------------------------------------------------------
    ```

Once deployment is completed, your application is ready at `http://<appName>.azurewebsites.net/` (`http://quarkus-hello-azure-1690375364238.azurewebsites.net` in the demo). Open the url with your local web browser, you should see

:::image type="content" source="../../media/quickstart-java/quarkus-hello-world-in-browser-azure-app-service.png" alt-text="Screenshot of Maven Hellow World web app running in Azure App Service.":::

**Congratulations!** You've deployed your first Java app to App Service.

## 5 - Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't need the resources in the future, delete the resource group from portal, or by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name <your resource group name; for example: quarkus-hello-azure-1690375364238-rg> --yes
```

This command may take a minute to run.
