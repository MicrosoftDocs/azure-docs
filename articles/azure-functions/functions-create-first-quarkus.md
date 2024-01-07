---
title: Deploy Serverless Java Apps with Quarkus on Azure Functions
description: Deploy Serverless Java Apps with Quarkus on Azure Functions
ms.author: edburns
ms.service: azure-functions
ms.topic: how-to
ms.date: 01/10/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus-functions, devx-track-javaee-quarkus-functions
---

# Deploy Serverless Java Apps with Quarkus on Azure Functions

In this article, you'll develop, build, and deploy a serverless Java app with Quarkus on Azure Functions. This article uses Quarkus Funqy and its built-in support for Azure Functions HTTP trigger for Java. Using Quarkus with Azure Functions gives you the power of the Quarkus programming model with the scale and flexibility of Azure Functions. When you're finished, you'll run serverless [Quarkus](https://quarkus.io) applications on Azure Functions and continuing to monitor the application on Azure.

## Prerequisites

* [Azure CLI](/cli/azure/overview), installed on your own computer. 
* [An Azure Account](https://azure.microsoft.com/)
* [Java JDK 17](/azure/developer/java/fundamentals/java-support-on-azure) with JAVA_HOME configured appropriately. This article was written with Java 17 in mind, but Azure functions and Quarkus support older versions of Java as well.
* [Apache Maven 3.8.1+](https://maven.apache.org)
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## A first look at the sample application

Clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/quarkus-azure).

```bash
git clone https://github.com/Azure-Samples/quarkus-azure
```

Explore the sample function. Open the file *functions-quarkus/src/main/java/io/quarkus/GreetingFunction.java*. The `@Funq` annotation makes your method (e.g. `funqyHello`) a serverless function. Azure Functions Java has its own set of Azure-specific annotations, but these annotations are not necessary when using Quarkus on Azure Functions in a simple capacity as we're doing here. For more information on the Azure Functions Java annotations, see [Azure Functions Java developer guide](/azure/azure-functions/functions-reference-java).

```java
@Funq
public String funqyHello() {
    return "hello funqy";
}
```

Unless you specify otherwise, the function's name is taken to be same as the method name. You can also define the function name with a parameter to the annotation, as shown here.

```java
@Funq("alternateName")
public String funqyHello() {
    return "hello funqy";
}
```

The name is important: the name becomes a part of the REST URI to invoke the function, as shown later in the article.

## Test the Serverless Function locally

Use `mvn` to run `Quarkus Dev mode` on your local terminal. Running Quarkus in this way enables live reload with background compilation. When you modify your Java files and/or your resource files and refresh your browser, these changes will automatically take effect.

A browser refresh triggers a scan of the workspace. If any changes are detected, the Java files are recompiled and the application is redeployed. Your redeployed application services the request. If there are any issues with compilation or deployment an error page will let you know.

Replace `yourResourceGroupName` with a resource group name. Function app names must be globally unique across all of Azure. Resource group names must be globally unique within a subscription. This article achieves the necessary uniqueness by prepending the resource group name to the function name. For this reason, consider prepending some unique identifier to any names you create that must be unique. A useful technique is to use your initials followed by today's date in `mmdd` format. The resourceGroup is not necessary for this part of the instructions, but it's required later. For simplicity, the maven project requires the property be defined.

1. Invoke Quarkus dev mode.

    ```bash
    cd functions-azure
    mvn -DskipTests -DresourceGroup=<yourResourceGroupName> quarkus:dev
    ```

    The output should look like this.

    ```output
    ...
    --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
    -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
    --\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
    INFO  [io.quarkus] (Quarkus Main Thread) quarkus-azure-function 1.0-SNAPSHOT on JVM (powered by Quarkus xx.xx.xx.) started in 1.290s. Listening on: http://localhost:8080
    
    INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
    INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [cdi, funqy-http, smallrye-context-propagation, vertx]
    
    --
    Tests paused
    Press [r] to resume testing, [o] Toggle test output, [:] for the terminal, [h] for more options>
    ```

1. Access the function using the `CURL` command on your local terminal.

    ```bash
    curl localhost:8080/api/funqyHello
    ```

    The output should look like this.

    ```output
    "hello funqy"
    ```

### Add Dependency injection to function

Dependency injection in Quarkus is provided by the open standard technology Jakarta EE Contexts and Dependency Injection (CDI). For a high level overview on injection in general, and CDI in specific, see the [Jakarta EE tutorial](https://eclipse-ee4j.github.io/jakartaee-tutorial/#injection).

1. Add a new function that uses dependency injection

    Create a *GreetingService.java* file in the *functions-quarkus/src/main/java/io/quarkus* directory. Make the source code of the file be the following.

    ```java
    package io.quarkus;

    import javax.enterprise.context.ApplicationScoped;

    @ApplicationScoped
    public class GreetingService {

        public String greeting(String name) {
            return "Welcome to build Serverless Java with Quarkus on Azure Functions, " + name;
        }
        
    }
    ```

    Save the file.

    `GreetingService` is an injectable bean that implements a `greeting()` method returning a string `Welcome...` message with a parameter `name`.

1. Open the existing the *functions-quarkus/src/main/java/io/quarkus/GreetingFunction.java* file. Replace the class with the below code to add a new field `gService` and method `greeting`.

    ```java
    package io.quarkus;

    import javax.inject.Inject;
    import io.quarkus.funqy.Funq;

    public class GreetingFunction {

        @Inject
        GreetingService gService;

        @Funq
        public String greeting(String name) {
            return gService.greeting(name);
        }

        @Funq
        public String funqyHello() {
            return "hello funqy";
        }

    }
    ```

    Save the file.

1. Access the new function `greeting` using the `CURL` command on your local terminal.

    ```bash
    curl -d '"Dan"' -X POST localhost:8080/api/greeting
    ```

    The output should look like this.

    ```output
    "Welcome to build Serverless Java with Quarkus on Azure Functions, Dan"
    ```

    > [!IMPORTANT]
    > `Live Coding` (also referred to as dev mode) allows you to run the app and make changes on the fly. Quarkus will automatically re-compile and reload the app when changes are made. This is a powerful and efficient style of developing that you'll use throughout the tutorial.

    Before moving forward to the next step, stop Quarkus Dev Mode by pressing `CTRL-C`.

## Deploy the Serverless App to Azure Functions

1. If you haven't already, sign in to your Azure subscription by using the [az login](/cli/azure/reference-index) command and follow the on-screen directions.

    ```azurecli
    az login
    ```

    > [!NOTE]
    > If you've multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this with the `--tenant` option. For example, `az login --tenant contoso.onmicrosoft.com`.
    > Continue the process in the web browser. If no web browser is available or if the web browser fails to open, use device code flow with `az login --use-device-code`.

    Once you've signed in successfully, the output on your local terminal should look similar to the following.

    ```output
    xxxxxxx-xxxxx-xxxx-xxxxx-xxxxxxxxx 'Microsoft'
    [
        {
            "cloudName": "AzureCloud",
            "homeTenantId": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxx",
            "id": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxx",
            "isDefault": true,
            "managedByTenants": [],
            "name": "Contoso account services",
            "state": "Enabled",
            "tenantId": "xxxxxxx-xxxx-xxxx-xxxxx-xxxxxxxxxx",
            "user": {
            "name": "user@contoso.com",
            "type": "user"
            }
        }
    ]
    ```

1. Build and deploy the functions to Azure

    The *pom.xml* you generated in the previous step uses the `azure-functions-maven-plugin`. Running `mvn install` generates config files and a staging directory required by the `azure-functions-maven-plugin`. For `yourResourceGroupName`, use the value you used previously.

    ```bash
    mvn clean install -DskipTests -DtenantId=<your tenantId from shown previously> -DresourceGroup=<yourResourceGroupName> azure-functions:deploy
    ```

1. During deployment, sign in to Azure.  The `azure-functions-maven-plugin` is configured to prompt for Azure sign in each time the project is deployed. Examine the build output. During the build, you'll see output similar to the following.

    ```output
    [INFO] Auth type: DEVICE_CODE
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AXCWTLGMP to authenticate.
    ```

    Do as the output says and authenticate to Azure using the browser and provided device code. Many other authentication and configuration options are available. The complete reference documentation for `azure-functions-maven-plugin` is available at [Azure Functions: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Functions:-Configuration-Details).

1. After authenticating, the build should continue and complete. The output should include `BUILD SUCCESS` near the end.

    ```output
    Successfully deployed the artifact to https://quarkus-demo-123451234.azurewebsites.net
    ```

    You can also find the `URL` to trigger your function on Azure in the output log.

    ```output
    [INFO] HTTP Trigger Urls:
    [INFO] 	 quarkus : https://quarkus-azure-functions-http-archetype-20220629204040017.azurewebsites.net/api/{*path}
    ```

   It will take a while for the deployment to complete. In the meantime, let's explore Azure Functions in the portal.

## Access and Monitor the Serverless Function on Azure

Sign in to the Portal and ensure you've selected the same tenant and subscription used in the Azure CLI. You can visit the portal at [https://aka.ms/publicportal](https://aka.ms/publicportal).

1. Type `Function App` in the search bar at the top of the Azure portal and press Enter. Your function should be deployed and show up with the name `<yourResourceGroupName>-function-quarkus`.

    :::image type="content" source="media/functions-create-first-quarkus/azure-function-app.png" alt-text="The function app in the portal":::

    Select the `function name`. you'll see the function app's detail information such as **Location**, **Subscription**, **URL**, **Metrics**, and **App Service Plan**.

1. In the detail page, select the `URL`.

    :::image type="content" source="media/functions-create-first-quarkus/azure-function-app-detail.png" alt-text="The function app detail page in the portal":::

    Then, you'll see if your function is "up and running" now.

    :::image type="content" source="media/functions-create-first-quarkus/azure-function-app-ready.png" alt-text="The function welcome page":::

1. Invoke the `greeting` function using `CURL` command on your local terminal.

    > [!IMPORTANT]
    > Replace `YOUR_HTTP_TRIGGER_URL` with your own function URL that you find in Azure portal or output.

    ```bash
    curl -d '"Dan on Azure"' -X POST https://YOUR_HTTP_TRIGGER_URL/api/greeting
    ```

    The output should look similar to the following.

    ```output
    "Welcome to build Serverless Java with Quarkus on Azure Functions, Dan on Azure"
    ```

    You can also access the other function (`funqyHello`).

    ```bash
    curl https://YOUR_HTTP_TRIGGER_URL/api/funqyHello
    ```

    The output should be the same as you observed above.

    ```output
    "hello funqy"
    ```

    If you want to exercise the basic metrics capability in the Azure portal, try invoking the function within a shell for loop, as shown here.

    ```bash
    for i in {1..100}; do curl -d '"Dan on Azure"' -X POST https://YOUR_HTTP_TRIGGER_URL/api/greeting; done
    ```

    After a while, you'll see some metrics data in the portal, as shown next.

    :::image type="content" source="media/functions-create-first-quarkus/portal-metrics.png" alt-text="Function metrics in the portal":::

    Now that you've opened your Azure function in the portal, here are some more features accessible from the portal.

    * Monitor the performance of your Azure function. For more information, see [Monitoring Azure Functions](/azure/azure-functions/monitor-functions).
    * Explore telemetry. For more information, see [Analyze Azure Functions telemetry in Application Insights](/azure/azure-functions/analyze-telemetry-data).
    * Set up logging. For more information, see [Enable streaming execution logs in Azure Functions](/azure/azure-functions/streaming-logs).

## Clean up resources

If you don't need these resources, you can delete them by running the following command in the Cloud Shell or on your local terminal:

```azurecli
az group delete --name <yourResourceGroupName> --yes
```

## Next steps

In this guide, you learned how to:
> [!div class="checklist"]
>
> * Run Quarkus dev mode
> * Deploy a Funqy app to Azure functions using the `azure-functions-maven-plugin`
> * Examine the performance of the function in the portal

To learn more about Azure Functions and Quarkus, see the following articles and references.

* [Azure Functions Java developer guide](/azure/azure-functions/functions-reference-java)
* [Quickstart: Create a Java function in Azure using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-java)
* [Azure Functions documentation](/azure/azure-functions/)
* [Quarkus guide to deploying on Azure](https://quarkus.io/guides/deploying-to-azure-cloud)
