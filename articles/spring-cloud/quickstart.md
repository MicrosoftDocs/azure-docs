---
title: "Quickstart - Deploy your first application to Azure Spring Apps"
description: In this quickstart, we deploy an application to Azure Spring Apps.
author: karlerickson
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/18/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022
zone_pivot_groups: programming-languages-spring-cloud
---

# Quickstart: Deploy your first application to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

::: zone pivot="programming-language-csharp"
This quickstart explains how to deploy a small application to run on Azure Spring Apps.

>[!NOTE]
> Steeltoe support for Azure Spring Apps is currently offered as a public preview. Public preview offerings allow customers to experiment with new features prior to their official release.  Public preview features and services aren't meant for production use.  For more information about support during previews, see the [FAQ](https://azure.microsoft.com/support/faq/) or file a [Support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

By following this quickstart, you'll learn how to:
> [!div class="checklist"]
> * Generate a basic Steeltoe .NET Core project
> * Provision an Azure Spring Apps service instance
> * Build and deploy the app with a public endpoint
> * Stream logs in real time

The application code used in this quickstart is a simple app built with a .NET Core Web API project template. When you've completed this example, the application will be accessible online and can be managed via the Azure portal and the Azure CLI.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1). The Azure Spring Apps service supports .NET Core 3.1 and later versions.
* [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).
* [Git](https://git-scm.com/).

## Install Azure CLI extension

Verify that your Azure CLI version is 2.0.67 or later:

```azurecli
az --version
```

Install the Azure Spring Apps extension for the Azure CLI using the following command:

```azurecli
az extension add --name spring
```

## Sign in to Azure

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. If you have more than one subscription, choose the one you want to use for this quickstart.

   ```azurecli
   az account list -o table
   ```

   ```azurecli
   az account set --subscription <Name or ID of a subscription from the last step>
   ```

## Generate a Steeltoe .NET Core project

In Visual Studio, create an ASP.NET Core Web application named as "hello-world" with API project template. Please notice there will be an auto-generated WeatherForecastController that will be our test endpoint later on.

1. Create a folder for the project source code and generate the project.

   ```console
   mkdir source-code
   ```

   ```console
   cd source-code
   ```

   ```dotnetcli
   dotnet new webapi -n hello-world --framework netcoreapp3.1
   ```

1. Navigate into the project directory.

   ```console
   cd hello-world
   ```

1. Edit the *appSettings.json* file to add the following settings:

   ```json
   "spring": {
     "application": {
       "name": "hello-world"
     }
   },
   "eureka": {
     "client": {
       "shouldFetchRegistry": true,
       "shouldRegisterWithEureka": true
     }
   }
   ```

1. Also in *appsettings.json*, change the log level for the `Microsoft` category from `Warning` to `Information`. This change ensures that logs will be produced when you view streaming logs in a later step.

   The *appsettings.json* file now looks similar to the following example:

   ```json
   {
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft": "Information",
         "Microsoft.Hosting.Lifetime": "Information"
       }
     },
     "AllowedHosts": "*",
     "spring": {
       "application": {
         "name": "hello-world"
       }
     },
     "eureka": {
       "client": {
         "shouldFetchRegistry": true,
         "shouldRegisterWithEureka": true
       }
     }
   }
   ```

1. Add dependencies and a `Zip` task to the *.csproj* file:

   ```xml
   <ItemGroup>
     <PackageReference Include="Steeltoe.Discovery.ClientCore" Version="3.1.0" />
     <PackageReference Include="Microsoft.Azure.SpringCloud.Client" Version="2.0.0-preview.1" />
   </ItemGroup>
   <Target Name="Publish-Zip" AfterTargets="Publish">
     <ZipDirectory SourceDirectory="$(PublishDir)" DestinationFile="$(MSBuildProjectDirectory)/deploy.zip" Overwrite="true" />
   </Target>
   ```

   The packages are for Steeltoe Service Discovery and the Azure Spring Apps client library. The `Zip` task is for deployment to Azure. When you run the `dotnet publish` command, it generates the binaries in the *publish* folder, and this task zips the *publish* folder into a *.zip* file that you upload to Azure.

1. In the *Program.cs* file, add a `using` directive and code that uses the Azure Spring Apps client library:

   ```csharp
   using Microsoft.Azure.SpringCloud.Client;
   ```

   ```csharp
   public static IHostBuilder CreateHostBuilder(string[] args) =>
               Host.CreateDefaultBuilder(args)
                   .UseAzureSpringCloudService()
                   .ConfigureWebHostDefaults(webBuilder =>
                   {
                       webBuilder.UseStartup<Startup>();
                   });
   ```

1. In the *Startup.cs* file, add a `using` directive and code that uses the Steeltoe Service Discovery at the end of the `ConfigureServices` method:

   ```csharp
   using Steeltoe.Discovery.Client;
   ```

   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       // Template code not shown.

       services.AddDiscoveryClient(Configuration);
   }
   ```

1. Build the project to make sure there are no compile errors.

   ```dotnetcli
   dotnet build
   ```

## Provision a service instance

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for *Azure Spring Apps*.

1. Select *Azure Spring Apps* from the results.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results.":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/spring-cloud-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   * **Subscription**: Select the subscription you want to be billed for this resource.
   * **Resource group**: Create a new resource group. The name you enter here will be used in later steps as **\<resource group name\>**.
   * **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
   * **Region**: Select the region for your service instance.

   :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page.":::

1. Select **Review and create**.

1. Select **Create**.

## Build and deploy the app

The following procedure builds and deploys the project that you created earlier.

1. Make sure the command prompt is still in the project folder.

1. Run the following command to build the project, publish the binaries, and store the binaries in a *.zip* file in the project folder.

   ```dotnetcorecli
   dotnet publish -c release -o ./publish
   ```

1. Create an app in your Azure Spring Apps instance with a public endpoint assigned. Use the same application name "hello-world" that you specified in *appsettings.json*.

   ```azurecli
   az spring app create -n hello-world -s <service instance name> -g <resource group name> --assign-endpoint --runtime-version NetCore_31
   ```

1. Deploy the *.zip* file to the app.

   ```azurecli
   az spring app deploy -n hello-world -s <service instance name> -g <resource group name> --runtime-version NetCore_31 --main-entry hello-world.dll --artifact-path ./deploy.zip
   ```

   The `--main-entry` option identifies the *.dll* file that contains the application's entry point. After the service uploads the *.zip* file, it extracts all the files and folders and tries to execute the entry point in the *.dll* file specified by `--main-entry`.

   It takes a few minutes to finish deploying the application. To confirm that it has deployed, go to the **Apps** section in the Azure portal.

## Test the app

Once deployment has completed, access the app at the following URL:

```url
https://<service instance name>-hello-world.azuremicroservices.io/weatherforecast
```

The app returns JSON data similar to the following example:

```json
[{"date":"2020-09-08T21:01:50.0198835+00:00","temperatureC":14,"temperatureF":57,"summary":"Bracing"},{"date":"2020-09-09T21:01:50.0200697+00:00","temperatureC":-14,"temperatureF":7,"summary":"Bracing"},{"date":"2020-09-10T21:01:50.0200715+00:00","temperatureC":27,"temperatureF":80,"summary":"Freezing"},{"date":"2020-09-11T21:01:50.0200717+00:00","temperatureC":18,"temperatureF":64,"summary":"Chilly"},{"date":"2020-09-12T21:01:50.0200719+00:00","temperatureC":16,"temperatureF":60,"summary":"Chilly"}]
```

## Stream logs in real time

Use the following command to get real-time logs from the App.

```azurecli
az spring app logs -n hello-world -s <service instance name> -g <resource group name> --lines 100 -f
```

Logs appear in the output:

```output
[Azure Spring Apps] The following environment variables are loaded:
2020-09-08 20:58:42,432 INFO supervisord started with pid 1
2020-09-08 20:58:43,435 INFO spawned: 'event-gather_00' with pid 9
2020-09-08 20:58:43,436 INFO spawned: 'dotnet-app_00' with pid 10
2020-09-08 20:58:43 [Warning] No managed processes are running. Wait for 30 seconds...
2020-09-08 20:58:44,843 INFO success: event-gather_00 entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
2020-09-08 20:58:44,843 INFO success: dotnet-app_00 entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
←[40m←[32minfo←[39m←[22m←[49m: Steeltoe.Discovery.Eureka.DiscoveryClient[0]
      Starting HeartBeat
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://[::]:1025
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /netcorepublish/6e4db42a-b160-4b83-a771-c91adec18c60
2020-09-08 21:00:13 [Information] [10] Start listening...
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/1.1 GET http://asa-svc-hello-world.azuremicroservices.io/weatherforecast
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'hello_world.Controllers.WeatherForecastController.Get (hello-world)'
info: Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker[3]
      Route matched with {action = "Get", controller = "WeatherForecast"}. Executing controller action with signature System.Collections.Generic.IEnumerable`1[hello_world.WeatherForecast] Get() on controller hello_world.Controllers.WeatherForecastController (hello-world).
info: Microsoft.AspNetCore.Mvc.Infrastructure.ObjectResultExecutor[1]
      Executing ObjectResult, writing value of type 'hello_world.WeatherForecast[]'.
info: Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker[2]
      Executed action hello_world.Controllers.WeatherForecastController.Get (hello-world) in 1.8902ms
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'hello_world.Controllers.WeatherForecastController.Get (hello-world)'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 4.2591ms 200 application/json; charset=utf-8
```

> [!TIP]
> Use `az spring app logs -h` to explore more parameters and log stream functionalities.

For advanced log analytics features, visit **Logs** tab in the menu on the [Azure portal](https://portal.azure.com/). Logs here have a latency of a few minutes.

:::image type="content" source="media/spring-cloud-quickstart-java/logs-analytics.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Logs query." lightbox="media/spring-cloud-quickstart-java/logs-analytics.png":::

::: zone-end

::: zone pivot="programming-language-java"

This quickstart explains how to deploy a small application to Azure Spring Apps.

The application code used in this tutorial is a simple app built with Spring Initializr. When you've completed this example, the application will be accessible online and can be managed via the Azure portal.

This quickstart explains how to:

> [!div class="checklist"]
> * Generate a basic Spring project
> * Provision a service instance
> * Build and deploy the app with a public endpoint
> * Stream logs in real time

## Prerequisites

To complete this quickstart:

* [Install JDK 8 or JDK 11](/java/azure/jdk/)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli) and the Azure Spring Apps extension with the command: `az extension add --name spring`
* (Optional) [Install IntelliJ IDEA](https://www.jetbrains.com/idea/)
* (Optional) [Install the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)
* (Optional) [Install Maven](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html). If you use the Azure Cloud Shell, this installation isn't needed.

## Generate a Spring project

Start with [Spring Initializr](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client) to generate a sample project with recommended dependencies for Azure Spring Apps. This link uses the following URL to provide default settings for you. 

```url
https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client
```
The following image shows the recommended Initializr set up for this sample project. 

This example uses Java version 8.  If you want to use Java version 11, change the option under **Project Metadata**.

:::image type="content" source="media/spring-cloud-quickstart-java/initializr-page.png" alt-text="Screenshot of Spring Initializr page.":::

1. Select **Generate** when all the dependencies are set. 
1. Download and unpack the package, then create a web controller for a simple web application by adding the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

    ```java
    package com.example.hellospring;

    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.bind.annotation.RequestMapping;

    @RestController
    public class HelloController {

        @RequestMapping("/")
        public String index() {
            return "Greetings from Azure Spring Apps!";
        }

    }
    ```

## Provision an instance of Azure Spring Apps

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

2. From the top search box, search for **Azure Spring Apps**.

3. Select **Azure Spring Apps** from the results.

    :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results.":::

4. On the Azure Spring Apps page, select **Create**.

    :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/spring-cloud-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted.":::

5. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

    - **Subscription**: Select the subscription you want to be billed for this resource.
    - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this resource group in later steps as **\<resource group name\>**.
    - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - **Location**: Select the region for your service instance.

    :::image type="content" source="media/spring-cloud-quickstart-launch-app-portal/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page.":::

6. Select **Review and create**.

## Build and deploy the app

#### [CLI](#tab/Azure-CLI)
The following procedure builds and deploys the application using the Azure CLI. Execute the following command at the root of the project.

1. Sign in to Azure and choose your subscription.

    ```azurecli
    az login
    ```

   If you have more than one subscription, use the following command to list the subscriptions you have access to, then choose the one you want to use for this quickstart.

   ```azurecli
   az account list -o table
   ```

   Use the following command to set the default subscription to use with the Azure CLI commands in this quickstart.

   ```azurecli
   az account set --subscription <Name or ID of a subscription from the last step>
   ```

1. Build the project using Maven:

    ```console
    mvn clean package -DskipTests
    ```

1. Create the app with a public endpoint assigned. If you selected Java version 11 when generating the Spring project, include the `--runtime-version=Java_11` switch.

    ```azurecli
    az spring app create -n hellospring -s <service instance name> -g <resource group name> --assign-endpoint true
    ```

1. Deploy the Jar file for the app (`target\hellospring-0.0.1-SNAPSHOT.jar` on Windows):

    ```azurecli
    az spring app deploy -n hellospring -s <service instance name> -g <resource group name> --artifact-path <jar file path>/hellospring-0.0.1-SNAPSHOT.jar
    ```

1. It takes a few minutes to finish deploying the application. To confirm that it has deployed, go to the **Apps** section in the Azure portal. You should see the status of the application.

#### [IntelliJ](#tab/IntelliJ)

The following procedure uses the IntelliJ plug-in for Azure Spring Apps to deploy the sample app in IntelliJ IDEA.

### Import project

1. Open the IntelliJ **Welcome** dialog, then select **Open** to open the import wizard.
1. Select the **hellospring** folder.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-new-project.png" alt-text="Screenshot of IntelliJ IDEA showing Open File or Project dialog box.":::

### Deploy the app

In order to deploy to Azure, you must sign in with your Azure account, then choose your subscription.  For sign-in details, see [Installation and sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in).

1. Right-click your project in IntelliJ project explorer, then select **Azure** -> **Deploy to Azure Spring Apps**.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-deploy-azure-1.png" alt-text="Screenshot of IntelliJ IDEA menu showing Deploy to Azure Spring Apps option." lightbox="media/spring-cloud-quickstart-java/intellij-deploy-azure-1.png":::

1. Accept the name for the app in the **Name** field. **Name** refers to the configuration, not the app name. Users don't usually need to change it.
1. In the **Artifact** textbox, select **Maven:com.example:hellospring-0.0.1-SNAPSHOT**.
1. In the **Subscription** textbox, verify your subscription is correct.
1. In the **Service** textbox, select the instance of Azure Spring Apps that you created in [Provision an instance of Azure Spring Apps](./quickstart-provision-service-instance.md).
1. In the **App** textbox, select **+** to create a new app.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-create-new-app.png" alt-text="Screenshot of IntelliJ IDEA showing Deploy Azure Spring Apps dialog box.":::

1. In the **App name:** textbox, enter *hellospring*, then check the **More settings** check box.
1. Select the **Enable** button next to **Public endpoint**. The button will change to *Disable \<to be enabled\>*.
1. If you used Java 11, select **Java 11** in **Runtime**.
1. Select **OK**.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-create-new-app-2.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with public endpoint Disable button highlighted.":::

1. Under **Before launch**, select the **Run Maven Goal 'hellospring:package'** line, then select the pencil to edit the command line.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-edit-maven-goal.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with Maven Goal edit button highlighted.":::

1. In the **Command line** textbox, enter *-DskipTests* after *package*, then select **OK**.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-maven-goal-command-line.png" alt-text="Screenshot of IntelliJ IDEA Select Maven Goal dialog box with Command Line value highlighted.":::

1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Apps app** dialog. The plug-in will run the command `mvn package -DskipTests` on the `hellospring` app and deploy the jar generated by the `package` command.

#### [Visual Studio Code](#tab/VS-Code)

To deploy a simple Spring Boot web app to Azure Spring Apps, follow the steps in [Build and Deploy Java Spring Boot Apps to Azure Spring Apps with Visual Studio Code](https://code.visualstudio.com/docs/java/java-spring-cloud#_download-and-test-the-spring-boot-app).

---

Once deployment has completed, you can access the app at `https://<service instance name>-hellospring.azuremicroservices.io/`.

:::image type="content" source="media/spring-cloud-quickstart-java/access-app-browser.png" alt-text="Screenshot of app in browser window." lightbox="media/spring-cloud-quickstart-java/access-app-browser.png":::

## Streaming logs in real time

#### [CLI](#tab/Azure-CLI)

Use the following command to get real-time logs from the App.

```azurecli
az spring app logs -n hellospring -s <service instance name> -g <resource group name> --lines 100 -f
```

Logs appear in the results:

:::image type="content" source="media/spring-cloud-quickstart-java/streaming-logs.png" alt-text="Screenshot of streaming logs in a console window." lightbox="media/spring-cloud-quickstart-java/streaming-logs.png":::

>[!TIP]
> Use `az spring app logs -h` to explore more parameters and log stream functionalities.

#### [IntelliJ](#tab/IntelliJ)

1. Select **Azure Explorer**, then **Spring Cloud**.
1. Right-click the running app.
1. Select **Streaming Logs** from the drop-down list.
1. Select instance.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-get-streaming-logs.png" alt-text="Screenshot of IntelliJ IDEA showing Select instance dialog box." lightbox="media/spring-cloud-quickstart-java/intellij-get-streaming-logs.png":::

1. The streaming log will be visible in the output window.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-streaming-logs-output.png" alt-text="Screenshot of IntelliJ IDEA showing streaming log output." lightbox="media/spring-cloud-quickstart-java/intellij-streaming-logs-output.png":::

#### [Visual Studio Code](#tab/VS-Code)

To get real-time application logs with Visual Studio Code, follow the steps in [Stream your application logs](https://code.visualstudio.com/docs/java/java-spring-cloud#_stream-your-application-logs).

---

For advanced logs analytics features, visit the **Logs** tab in the menu on the [Azure portal](https://portal.azure.com/). Logs here have a latency of a few minutes.

:::image type="content" source="media/spring-cloud-quickstart-java/logs-analytics.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Logs query." lightbox="media/spring-cloud-quickstart-java/logs-analytics.png":::

::: zone-end

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Generate a basic Spring project
> * Provision a service instance
> * Build and deploy the app with a public endpoint
> * Stream logs in real time

To learn how to use more Azure Spring capabilities, advance to the quickstart series that deploys a sample application to Azure Spring Apps:

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

More samples are available on GitHub: [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
