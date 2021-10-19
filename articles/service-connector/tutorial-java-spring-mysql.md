---
title: 'Tutorial: Deploy Spring Cloud Application Connected to Azure Database for MySQL with Service Connector'
description: Create a Spring Boot application connected to Azure Database for MySQL with Service Connector.
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: tutorial
ms.date: 10/28/2021
---

# Tutorial: Deploy Spring Cloud Application Connected to Azure Database for MySQL with Service Connector

In this tutorial, you complete the following tasks using the Azure portal or the Azure CLI. Both methods are explained in the following procedures.

> [!div class="checklist"]
> * Provision an instance of Azure Spring Cloud
> * Build and deploy apps to Azure Spring Cloud
> * Integrate Azure Spring Cloud with Azure Database for MySQL with Service Connector

## 1. Prerequisites

* [Install JDK 8 or JDK 11](/azure/developer/java/fundamentals/java-jdk-install)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli) and install the Azure Spring Cloud extension with the command: `az extension add --name spring-cloud`
* (Optional) [Install the Azure Toolkit for IntelliJ IDEA](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)

## 2. Provision an instance of Azure Spring Cloud

#### [Portal](#tab/Azure-portal)

The following procedure creates an instance of Azure Spring Cloud using the Azure portal.

1. In a new tab, open the [Azure portal](https://ms.portal.azure.com/).

2. From the top search box, search for **Azure Spring Cloud**.

3. Select **Azure Spring Cloud** from the results.

    ![ASC icon start](../spring-cloud/media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png)

4. On the Azure Spring Cloud page, select **Create**.

    ![ASC icon add](../spring-cloud/media/spring-cloud-quickstart-launch-app-portal/spring-cloud-create.png)

5. Fill out the form on the Azure Spring Cloud **Create** page.  Consider the following guidelines:

    - **Subscription**: Select the subscription you want to be billed for this resource.
    - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this value in later steps as **\<resource group name\>**.
    - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - **Location**: Select the location for your service instance.
    - Select **Standard** for the **Pricing tier** option.

    ![ASC portal start](../spring-cloud/media/spring-cloud-quickstart-launch-app-portal/portal-start.png)

6. Select **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

#### [CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI extension to provision an instance of Azure Spring Cloud.

1. Update Azure CLI with Azure Spring Cloud extension.

    ```azurecli
    az extension update --name spring-cloud
    ```

1. Sign in to the Azure CLI and choose your active subscription.

    ```azurecli
    az login
    az account list -o table
    az account set --subscription <Name or ID of subscription, skip if you only have 1 subscription>
    ```

1. Prepare a name for your Azure Spring Cloud service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create a resource group to contain your Azure Spring Cloud service.  Create in instance of the Azure Spring Cloud service.

    ```azurecli
    az group create --name <resource group name>
    az spring-cloud create -n <service instance name> -g <resource group name>
    ```

    Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

1. Set your default resource group name and Spring Cloud service name using the following command:

    ```azurecli
    az config set defaults.group=<resource group name> defaults.spring-cloud=<service name>
    ```

## 3. Build and deploy apps to Azure Spring Cloud

This section explains how to build and deploy microservice applications to Azure Spring Cloud using:
* Azure CLI
* Maven Plugin
* Intellij


#### [CLI](#tab/Azure-CLI)

### Build the microservices applications locally

1. Clone the sample app repository to your Azure Cloud account.  Change the directory, and build the project.

    ```azurecli
    git clone https://github.com/azure-samples/spring-petclinic-microservices
    cd spring-petclinic-microservices
    mvn clean package -DskipTests -Denv=cloud
    ```

Compiling the project takes 5 -10 minutes. Once completed, you should have individual JAR files for each service in their respective folders.

### Create and deploy apps on Azure Spring Cloud

1. If you didn't run the following commands in the previous quickstarts, set the CLI defaults.

    ```azurecli
    az configure --defaults group=<resource group name> spring-cloud=<service name>
    ```

1. Create the 2 core microservices for PetClinic: API gateway and customers-service.

    ```azurecli
    az spring-cloud app create --name api-gateway --instance-count 1 --memory 2 --assign-endpoint
    az spring-cloud app create --name customers-service --instance-count 1 --memory 2
    ```

1. Deploy the JAR files built in the previous step.

    ```azurecli
    az spring-cloud app deploy --name api-gateway --jar-path spring-petclinic-api-gateway/target/spring-petclinic-api-gateway-2.3.6.jar --jvm-options="-Xms2048m -Xmx2048m"
    az spring-cloud app deploy --name customers-service --jar-path spring-petclinic-customers-service/target/spring-petclinic-customers-service-2.3.6.jar --jvm-options="-Xms2048m -Xmx2048m"
    ```

1. Query app status after deployments with the following command.

    ```azurecli
    az spring-cloud app list -o table
    ```

    ```azurecli
        Name               Location    ResourceGroup    Production Deployment    Public Url                                           Provisioning Status    CPU    Memory    Running Instance    Registered Instance    Persistent Storage
    -----------------  ----------  ---------------  -----------------------  ---------------------------------------------------  ---------------------  -----  --------  ------------------  ---------------------  --------------------
    api-gateway        eastus      xxxxxx-sp         default                  https://<service name>-api-gateway.azuremicroservices.io   Succeeded              1      2         1/1                 1/1                    -
    customers-service  eastus      <service name>         default                                                                       Succeeded              1      2         1/1                 1/1                    -
    ```

### Verify the services

Access the app gateway and customers service from browser with the **Public Url** shown above, in the format of `https://<service name>-api-gateway.azuremicroservices.io`.

![Access petclinic customers service](../spring-cloud/media/build-and-deploy/access-customers-service.png)

> [!TIP]
> To troubleshot deployments, you can use the following command to get logs streaming in real time whenever the app is running `az spring-cloud app logs --name <app name> -f`.

### Deploy extra apps

To get the PetClinic app functioning with all features like Admin Server, Visits and Veterinarians, you can deploy the other apps with following commands:

```azurecli
az spring-cloud app create --name admin-server --instance-count 1 --memory 2 --assign-endpoint
az spring-cloud app create --name vets-service --instance-count 1 --memory 2
az spring-cloud app create --name visits-service --instance-count 1 --memory 2
az spring-cloud app deploy --name admin-server --jar-path spring-petclinic-admin-server/target/spring-petclinic-admin-server-2.3.6.jar --jvm-options="-Xms2048m -Xmx2048m"
az spring-cloud app deploy --name vets-service --jar-path spring-petclinic-vets-service/target/spring-petclinic-vets-service-2.3.6.jar --jvm-options="-Xms2048m -Xmx2048m"
az spring-cloud app deploy --name visits-service --jar-path spring-petclinic-visits-service/target/spring-petclinic-visits-service-2.3.6.jar --jvm-options="-Xms2048m -Xmx2048m"
```

#### [Maven](#tab/Maven)

### Build the microservices applications locally

1. Clone the sample app repository to your Azure Cloud account.  Change the directory, and build the project.

    ```azurecli
    git clone https://github.com/azure-samples/spring-petclinic-microservices
    cd spring-petclinic-microservices
    mvn clean package -DskipTests -Denv=cloud
    ```

Compiling the project takes 5 -10 minutes. Once completed, you should have individual JAR files for each service in their respective folders.

### Generate configurations and deploy to the Azure Spring Cloud

1. Generate configurations by running the following command in the root folder of Pet Clinic containing the parent POM. If you have already signed-in with Azure CLI, the command will automatically pick up the credentials. Otherwise, it will sign you in with prompt instructions. For more information, see our [wiki page](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

    ```azurecli
    mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:1.7.0:config
    ```

    You will be asked to select:

    * **Modules:** Select `api-gateway` and `customers-service`.
    * **Subscription:** This is your subscription used to create an Azure Spring Cloud instance.
    * **Service Instance:** This is the name of your Azure Spring Cloud instance.
    * **Public endpoint:** In the list of provided projects, enter the number that corresponds with `api-gateway`.  This gives it public access.

1. Verify the `appName` elements in the POM files are correct:

    ```xml
    <build>
        <plugins>
            <plugin>
                <groupId>com.microsoft.azure</groupId>
                <artifactId>azure-spring-cloud-maven-plugin</artifactId>
                <version>1.7.0</version>
                <configuration>
                    <subscriptionId>xxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx</subscriptionId>
                    <clusterName>v-spr-cld</clusterName>
                    <appName>customers-service</appName>

    ```

    Please make sure `appName` texts match the following, remove any prefix if needed and save the file:
    * api-gateway
    * customers-service

1. The POM now contains the plugin dependencies and configurations. Deploy the apps using the following command.

    ```azurecli
    mvn azure-spring-cloud:deploy
    ```

### Verify the services

A successful deployment command will return a the URL of the form: `https://<service name>-spring-petclinic-api-gateway.azuremicroservices.io`. Use it to navigate to the running service.

![Access Pet Clinic](../spring-cloud/media/build-and-deploy/access-customers-service.png)

You can also navigate the Azure portal to find the URL.

1. Navigate to the service.
2. Select **Apps**.
3. Select **api-gateway**.
4. Find the URL on the **api-gateway | Overview** page.

### Deploy extra apps

To get the PetClinic app functioning with all features like Admin Server, Visits and Veterinarians, you can deploy the other microservices. Rerun the configuration command and select the following microservices.

* admin-server
* vets-service
* visits-service

Correct app names in each `pom.xml` for above modules and then run the `deploy` command again.

#### [IntelliJ](#tab/IntelliJ)

### Import sample project in IntelliJ

1. Download and unzip the source repository for this tutorial, or clone it using Git: `git clone https://github.com/azure-samples/spring-petclinic-microservices`

1. Open IntelliJ **Welcome** dialog, select **Import Project** to open the import wizard.

1. Select `spring-petclinic-microservices` folder.

    ![Import Project](../spring-cloud/media/spring-cloud-intellij-howto/import-project-1-pet-clinic.png)

### Deploy api-gateway app to Azure Spring Cloud

In order to deploy to Azure you must sign in with your Azure account with Azure Toolkit for IntelliJ, and choose your subscription. For sign-in details, see [Installation and sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in).

1. Right-click your project in IntelliJ project explorer, and select **Azure** -> **Deploy to Azure Spring Cloud**.

    ![Deploy to Azure 1](../spring-cloud/media/spring-cloud-intellij-howto/deploy-to-azure-1-pet-clinic.png)

1. In the **Name** field, append *:api-gateway* to the existing **Name**.
1. In the **Artifact** textbox, select *spring-petclinic-api-gateway-2.3.6*.
1. In the **Subscription** textbox, verify your subscription.
1. In the **Spring Cloud** textbox, select the instance of Azure Spring Cloud that you created in [Provision Azure Spring Cloud instance](./quickstart-provision-service-instance.md).
1. Set **Public Endpoint** to *Enable*.
1. In the **App:** textbox, select **Create app...**.
1. Enter *api-gateway*, then select **OK**.
1. Specify the memory to 2 GB and JVM options: `-Xms2048m -Xmx2048m`.

    ![Memory JVM options](../spring-cloud/media/spring-cloud-intellij-howto/memory-jvm-options.png)

1. In the **Before launch** section of the dialog, double-click *Run Maven Goal*.
1. In the **Working directory** textbox, navigate to the *spring-petclinic-microservices/gateway* folder.
1. In the **Command line** textbox, enter *package -DskipTests*. Select **OK**.

    ![Deploy to Azure OK](../spring-cloud/media/spring-cloud-intellij-howto/deploy-to-azure-spring-cloud-2-pet-clinic.png)

1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Cloud app** dialog. The plug-in will run the command `mvn package` on the `api-gateway` app and deploy the jar generated by the `package` command.

### Deploy customers-service and other apps to Azure Spring Cloud

Repeat the steps above to deploy `customers-service` and other Pet Clinic apps to Azure Spring Cloud:

1. Modify the **Name** and **Artifact** to identify the `customers-service` app.
1. In the **App:** textbox, select **Create app...** to create `customers-service` app.
1. Verify that the **Public Endpoint** option is set to *Disabled*.
1. In the **Before launch** section of the dialog, switch the **Working directory** to the *petclinic/customers-service* folder.
1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Cloud app** dialog.

### Verify the services

Navigate to the URL of the form: `https://<service name>-spring-petclinic-api-gateway.azuremicroservices.io`

![Access Pet Clinic](../spring-cloud/media/build-and-deploy/access-customers-service.png)

You can also navigate the Azure portal to find the URL.

1. Navigate to the service
2. Select **Apps**
3. Select **api-gateway**
4. Find the URL on the **api-gateway | Overview** page

### Deploy extra apps

Other microservices included in this sample can be deployed similarly.

* admin-server
* vets-service
* visits-service

