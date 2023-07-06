---
title: "Quickstart - Build and deploy apps to Azure Spring Apps"
description: Describes app deployment to Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 11/15/2021
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022
zone_pivot_groups: programming-languages-spring-apps
---

# Quickstart: Build and deploy apps to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ❌ Enterprise

::: zone pivot="programming-language-csharp"

This quickstart explains how to build and deploy Spring applications to Azure Spring Apps using the Azure CLI.

## Prerequisites

- Completion of the previous quickstarts in this series:
  - [Provision an Azure Spring Apps service instance](./quickstart-provision-service-instance.md).
  - [Set up Azure Spring Apps Config Server](./quickstart-setup-config-server.md).

## Download the sample app

Use the following steps to download the sample app. If you've been using the Azure Cloud Shell, switch to a local command prompt.

1. Create a new folder and clone the sample app repository.

   ```console
   mkdir source-code
   ```

   ```console
   cd source-code
   ```

   ```console
   git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples
   ```

1. Navigate to the repository directory.

   ```console
   cd Azure-Spring-Cloud-Samples
   ```

## Deploy PlanetWeatherProvider

Use the following steps to deploy the PlanetWeatherProvider project.

1. Create an app for the `PlanetWeatherProvider` project in your Azure Spring Apps instance.

   ```azurecli
   az spring app create --name planet-weather-provider --runtime-version NetCore_31
   ```

   To enable automatic service registration, you've given the app the same name as the value of `spring.application.name` in the project's *appsettings.json* file:

   ```json
   "spring": {
     "application": {
       "name": "planet-weather-provider"
     }
   }
   ```

   This command may take several minutes to run.

1. Change directory to the `PlanetWeatherProvider` project folder.

   ```console
   cd steeltoe-sample/src/planet-weather-provider
   ```

1. Create the binaries and the *.zip* file to be deployed.

   ```console
   dotnet publish -c release -o ./publish
   ```

   > [!TIP]
   > The project file contains the following XML to package the binaries in a *.zip* file after writing them to the *./publish* folder:
   >
   > ```xml
   > <Target Name="Publish-Zip" AfterTargets="Publish">
   >   <ZipDirectory SourceDirectory="$(PublishDir)" DestinationFile="$(MSBuildProjectDirectory)/publish-deploy-planet.zip" Overwrite="true" />
   > </Target>
   > ```

1. Deploy the project to Azure.

   Make sure that the command prompt is in the project folder before running the following command.

   ```azurecli
   az spring app deploy \
       --name planet-weather-provider \
       --runtime-version NetCore_31 \
       --main-entry Microsoft.Azure.SpringCloud.Sample.PlanetWeatherProvider.dll \
       --artifact-path ./publish-deploy-planet.zip
   ```

   The `--main-entry` option specifies the relative path from the *.zip* file's root folder to the *.dll* file that contains the application's entry point. After the service uploads the *.zip* file, it extracts all the files and folders, and then tries to execute the entry point in the specified *.dll* file.

   This command may take several minutes to run.

## Deploy SolarSystemWeather

Use the following steps to deploy the SolarSystemWeather project.

1. Create another app in your Azure Spring Apps instance for the project.

   ```azurecli
   az spring app create --name solar-system-weather --runtime-version NetCore_31
   ```

   `solar-system-weather` is the name that is specified in the `SolarSystemWeather` project's *appsettings.json* file.

   This command may take several minutes to run.

1. Change directory to the `SolarSystemWeather` project.

   ```console
   cd ../solar-system-weather
   ```

1. Create the binaries and *.zip* file to be deployed.

   ```console
   dotnet publish -c release -o ./publish
   ```

1. Deploy the project to Azure.

   ```azurecli
   az spring app deploy \
       --name solar-system-weather \
       --runtime-version NetCore_31 \
       --main-entry Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.dll \
       --artifact-path ./publish-deploy-solar.zip
   ```

   This command may take several minutes to run.

## Assign public endpoint

Before testing the application, get a public endpoint for an HTTP GET request to the `solar-system-weather` application.

1. Run the following command to assign the endpoint.

   ```azurecli
   az spring app update --name solar-system-weather --assign-endpoint true
   ```

1. Run the following command to get the URL of the endpoint.

   Windows:

   ```azurecli
   az spring app show --name solar-system-weather --output table
   ```

   Linux:

   ```azurecli
   az spring app show --name solar-system-weather | grep url
   ```

## Test the application

To test the application, send a GET request to the `solar-system-weather` app. In a browser, navigate to the public URL with `/weatherforecast` appended to it. For example: `https://servicename-solar-system-weather.azuremicroservices.io/weatherforecast`

The output is JSON:

```json
[{"Key":"Mercury","Value":"very warm"},{"Key":"Venus","Value":"quite unpleasant"},{"Key":"Mars","Value":"very cool"},{"Key":"Saturn","Value":"a little bit sandy"}]
```

This response shows that both Spring apps are working. The `SolarSystemWeather` app returns data that it retrieved from the `PlanetWeatherProvider` app.

::: zone-end

::: zone pivot="programming-language-java"

This article explains how to build and deploy Spring applications to Azure Spring Apps. You can use Azure CLI, the Maven plugin, or Intellij. This article describes each alternative.

## Prerequisites

- Completion of the previous quickstarts in this series:
  - [Provision an Azure Spring Apps service instance](./quickstart-provision-service-instance.md).
  - [Set up Azure Spring Apps Config Server](./quickstart-setup-config-server.md).
- [JDK 17](/azure/developer/java/fundamentals/java-jdk-install)
- [Maven 3.0 or above](https://maven.apache.org/download.cgi)
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Optionally, [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`
- Optionally, [the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/).

#### [CLI](#tab/Azure-CLI)

## Build the Spring applications locally

Use the following commands to clone the sample repository, navigate to the sample folder, and then build the project.

```bash
git clone https://github.com/azure-samples/spring-petclinic-microservices
cd spring-petclinic-microservices
mvn clean package -DskipTests -Denv=cloud
```

Compiling the project takes 5-10 minutes. When the project is compiled, you should have individual JAR files for each service in their respective folders.

## Create and deploy apps on Azure Spring Apps

Use the following steps to create and deploys apps on Azure Spring Apps using the CLI.

1. If you didn't run the following commands in the previous quickstarts, run them now to set the CLI defaults.

   ```azurecli
   az configure --defaults group=<resource-group-name> spring=<service-name>
   ```

1. Create the two core Spring applications for PetClinic: `api-gateway` and `customers-service`.

   ```azurecli
   az spring app create \
       --name api-gateway \
       --runtime-version Java_17 \
       --instance-count 1 \
       --memory 2Gi \
       --assign-endpoint
   az spring app create \
       --name customers-service \
       --runtime-version Java_17 \
       --instance-count 1 \
       --memory 2Gi
   ```

1. Deploy the JAR files built in the previous step.

   ```azurecli
   az spring app deploy \
       --name api-gateway \
       --artifact-path spring-petclinic-api-gateway/target/api-gateway-3.0.1.jar \
       --jvm-options="-Xms2048m -Xmx2048m"
   az spring app deploy \
       --name customers-service \
       --artifact-path spring-petclinic-customers-service/target/customers-service-3.0.1.jar \
       --jvm-options="-Xms2048m -Xmx2048m"
   ```

1. Query the app status after deployments with the following command.

   ```azurecli
   az spring app list --output table
   ```

   This command produces output similar to the following example:

   ```output
   Name               Location    ResourceGroup    Production Deployment    Public Url                                           Provisioning Status    CPU    Memory    Running Instance    Registered Instance    Persistent Storage
   -----------------  ----------  ---------------  -----------------------  ---------------------------------------------------  ---------------------  -----  --------  ------------------  ---------------------  --------------------
   api-gateway        eastus      xxxxxx-sp         default                  https://<service name>-api-gateway.azuremicroservices.io   Succeeded              1      2         1/1                 1/1                    -
   customers-service  eastus      <service name>         default                                                                       Succeeded              1      2         1/1                 1/1                    -
   ```

## Verify the services

Access `api-gateway` and `customers-service` from a browser with the **Public Url** shown previously, in the format of `https://<service name>-api-gateway.azuremicroservices.io`.

:::image type="content" source="media/quickstart-deploy-apps/access-customers-service.png" alt-text="Screenshot of the PetClinic customers service." lightbox="media/quickstart-deploy-apps/access-customers-service.png":::

> [!TIP]
> To troubleshot deployments, you can use the following command to get logs streaming in real time whenever the app is running `az spring app logs --name <app name> --follow`.

## Deploy extra apps

To get the PetClinic app functioning with all features like Admin Server, Visits, and Veterinarians, deploy the other apps with following commands:

```azurecli
az spring app create \
    --name admin-server \
    --runtime-version Java_17 \
    --instance-count 1 \
    --memory 2Gi \
    --assign-endpoint
az spring app create \
    --name vets-service \
    --runtime-version Java_17 \
    --instance-count 1 \
    --memory 2Gi
az spring app create \
    --name visits-service \
    --runtime-version Java_17 \
    --instance-count 1 \
    --memory 2Gi
az spring app deploy \
    --name admin-server \
    --runtime-version Java_17 \
    --artifact-path spring-petclinic-admin-server/target/admin-server-3.0.1.jar \
    --jvm-options="-Xms1536m -Xmx1536m"
az spring app deploy \
    --name vets-service \
    --runtime-version Java_17 \
    --artifact-path spring-petclinic-vets-service/target/vets-service-3.0.1.jar \
    --jvm-options="-Xms1536m -Xmx1536m"
az spring app deploy \
    --name visits-service \
    --runtime-version Java_17 \
    --artifact-path spring-petclinic-visits-service/target/visits-service-3.0.1.jar \
    --jvm-options="-Xms1536m -Xmx1536m"
```

#### [Maven](#tab/Maven)

## Build the Spring applications locally

Use the following commands to clone the sample repository, navigate to the sample folder, and then build the project.

```bash
git clone https://github.com/azure-samples/spring-petclinic-microservices
cd spring-petclinic-microservices
mvn clean package -DskipTests -Denv=cloud
```

Compiling the project takes 5-10 minutes. When the project is compiled, you should have individual JAR files for each service in their respective folders.

## Generate configurations and deploy to Azure Spring Apps

The following steps show you how to generate configurations and deploy to Azure Spring Apps:

1. Go to the *spring-petclinic-customers-service* folder. Generate configurations by running the following command. If you've already signed-in with Azure CLI, the command automatically picks up the credentials. Otherwise, it signs you in using a prompt with instructions. For more information, see [Authentication](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication) on the [azure-maven-plugins](https://github.com/microsoft/azure-maven-plugins) wiki.

   ```bash
   mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config -DappName=customers-service
   ```

   You're asked to provide the following values:

   - **Subscription:** The subscription you used to create an Azure Spring Apps instance.
   - **Service Instance:** The name of your Azure Spring Apps instance.
   - **Public endpoint:** Whether to assign a public endpoint to the app. Select **No**.

1. Verify that the `appName` elements in the POM files are correct:

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>com.microsoft.azure</groupId>
               <artifactId>azure-spring-apps-maven-plugin</artifactId>
               <version>1.17.0</version>
               <configuration>
                   <subscriptionId>xxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx</subscriptionId>
                   <clusterName>v-spr-cld</clusterName>
                   <appName>customers-service</appName>
   ```

   The POM now contains the plugin dependencies and configurations.

1. Deploy the apps by using the following command:

   ```bash
   mvn azure-spring-apps:deploy
   ```

1. Go to the *spring-petclinic-api-gateway* folder. Run the following commands to generate the configuration and deploy `api-gateway`. Select **yes** for **Public endpoint**.

   ```bash
   mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.17.0:config -DappName=api-gateway
   mvn azure-spring-apps:deploy
   ```

## Verify the services

A successful deployment command returns a URL in the form: `https://<service name>-spring-petclinic-api-gateway.azuremicroservices.io`. Use it to navigate to the running service.

 :::image type="content" source="media/quickstart-deploy-apps/access-customers-service.png" alt-text="Screenshot of the PetClinic customers service." lightbox="media/quickstart-deploy-apps/access-customers-service.png":::

You can also navigate the Azure portal to find the URL.

1. Navigate to the service.
1. Select **Apps**.
1. Select **api-gateway**.
1. Find the URL on the **api-gateway | Overview** page.

## Deploy extra apps

To get the PetClinic app functioning with all sections like Admin Server, Visits, and Veterinarians, you can deploy the other Spring applications. Rerun the configuration command and select the following applications.

- admin-server
- vets-service
- visits-service

Correct the app names in each *pom.xml* file for these modules, and then run the `deploy` command again.

#### [IntelliJ](#tab/IntelliJ)

## Import sample project in IntelliJ

Use the following steps to import the sample project in IntelliJ.

1. Download and unzip the source repository for this tutorial, or clone it using Git: `git clone https://github.com/azure-samples/spring-petclinic-microservices`

1. Open the IntelliJ **Welcome** dialog and select **Import Project** to open the import wizard.

1. Select the *spring-petclinic-microservices* folder.

   :::image type="content" source="media/quickstart-deploy-apps/import-project-1-pet-clinic.png" alt-text="Screenshot of the IntelliJ import wizard showing the PetClinic sample project." lightbox="media/quickstart-deploy-apps/import-project-1-pet-clinic.png":::

### Deploy the api-gateway app to Azure Spring Apps

To deploy to Azure, you must sign in with your Azure account with Azure Toolkit for IntelliJ and choose your subscription. For sign-in details, see [Create a Hello World web app for Azure App Service using IntelliJ](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in).

1. Right-click your project in IntelliJ project explorer, and select **Azure** -> **Deploy to Azure Spring Apps**.

   :::image type="content" source="media/quickstart-deploy-apps/deploy-to-azure-1-pet-clinic.png" alt-text="Screenshot of the IntelliJ project explorer showing how to deploy the PetClinic sample project." lightbox="media/quickstart-deploy-apps/deploy-to-azure-1-pet-clinic.png":::

1. In the **Name** field, append *:api-gateway* to the existing **Name**.
1. In the **Artifact** textbox, select *spring-petclinic-api-gateway-3.0.1*.
1. In the **Subscription** textbox, verify your subscription.
1. In the **Spring Cloud** textbox, select the instance of Azure Spring Apps that you created in [Provision Azure Spring Apps instance](./quickstart-provision-service-instance.md).
1. Set **Public Endpoint** to *Enable*.
1. In the **App:** textbox, select **Create app...**.
1. Enter *api-gateway*, then select **OK**.
1. Specify the memory to 2 GB and JVM options: `-Xms2048m -Xmx2048m`.

   :::image type="content" source="media/quickstart-deploy-apps/memory-jvm-options.png" alt-text="Screenshot of memory and JVM options." lightbox="media/quickstart-deploy-apps/memory-jvm-options.png":::

1. In the **Before launch** section of the dialog, double-click **Run Maven Goal**.
1. In the **Working directory** textbox, navigate to the *spring-petclinic-microservices/spring-petclinic-api-gateway* folder.
1. In the **Command line** textbox, enter *package -DskipTests*. Select **OK**.

   :::image type="content" source="media/quickstart-deploy-apps/deploy-to-azure-spring-apps-2-pet-clinic.png" alt-text="Screenshot of the spring-petclinic-microservices/gateway page and command line textbox." lightbox="media/quickstart-deploy-apps/deploy-to-azure-spring-apps-2-pet-clinic.png":::

1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Apps app** dialog. The plug-in runs the command `mvn package` on the `api-gateway` app and deploys the JAR file generated by the `package` command.

### Deploy customers-service and other apps to Azure Spring Apps

Repeat the previous steps to deploy `customers-service` and other Pet Clinic apps to Azure Spring Apps:

1. Modify the **Name** and **Artifact** to identify the `customers-service` app.
1. In the **App:** textbox, select **Create app...** to create `customers-service` app.
1. Verify that the **Public Endpoint** option is set to *Disabled*.
1. In the **Before launch** section of the dialog, switch the **Working directory** to the *petclinic/customers-service* folder.
1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Apps app** dialog.

## Verify the services

Navigate to the URL of the form: `https://<service name>-spring-petclinic-api-gateway.azuremicroservices.io`

 :::image type="content" source="media/quickstart-deploy-apps/access-customers-service.png" alt-text="Screenshot of the PetClinic customers service." lightbox="media/quickstart-deploy-apps/access-customers-service.png":::

You can also navigate the Azure portal to find the URL.

1. Navigate to the service
1. Select **Apps**
1. Select **api-gateway**
1. Find the URL on the **api-gateway | Overview** page

## Deploy extra apps

Other Spring applications included in this sample can be deployed similarly.

- admin-server
- vets-service
- visits-service

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

> [!div class="nextstepaction"]
> [Quickstart: Set up a Log Analytics workspace](quickstart-setup-log-analytics.md)
