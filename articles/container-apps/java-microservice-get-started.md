---
title: Launch your First Java Microservice Application with Managed Java Components in Azure Container Apps
description: Learn how to deploy a Java microservice project in Azure Container Apps with managed Java components.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 11/25/2024
ms.author: cshoe

---

# Quickstart: Launch your first Java microservice application with managed Java components in Azure Container Apps

In this quickstart, you learn how to deploy an application in Azure Container Apps that uses Java components to handle configuration management, service discovery, and manage health and metrics. The sample application used in this example is the Java PetClinic, which uses the microservice architecture pattern. The following diagram depicts the architecture of the PetClinic application on Azure Container Apps:

:::image type="complex" source="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png" alt-text="Diagram of the relationship between the Git repository containing a versioned YAML config file, a browser and mobile app, and an Azure Resource Group that contains an Azure Container Apps environment." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png":::
   Diagram of an Azure Container Apps (A C A) environment illustrating the architecture of a microservices-based application deployed within an Azure Resource Group. An Azure Resource Group contains the Azure Container Apps environment. The environment includes three A C A managed Java components:  a config server, a service registry, and an admin server. The config server fetches configuration data stored as versioned YAML files in a Git repository external to the Azure Resource Group, the service registry handles service discovery and registration, and the admin server provides a live view of the system. An A P I Gateway routes requests to three microservices: vets service, customers service, and visits service. Each service is linked to its own database for data persistence. The application supports external interactions through a browser and a mobile app, and integrates with monitoring tools via Azure Log Analytics Workspaces for tracking system performance and health.
:::image-end:::

The PetClinic application includes the following features:

* The frontend is a standalone Node.js web app hosted on the API Gateway app.
* Requests to the API gateway routes requests to backend service apps.
* Backend apps are built with Spring Boot.
* Each backend app uses a HyperSQL database as the persistent store.
* The apps use managed Java components on Azure Container Apps, including a service registry, config server, and admin server.
* The config server reads data from a Git repository.
* A Log Analytics workspace logs server data.

In this tutorial, you:

> [!div class="checklist"]
> * Create a config server, Eureka server, admin server, and admin components
> * Create a series of microservice apps
> * Bind the server components to your microservices apps
> * Deploy the collection of apps
> * Review the deployed apps

By the end of this article, you deploy one web application and three backend applications that are configured to work with three different Java components. You can then manage each component via the Azure portal.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the **Contributor** or **Owner** permission on the Azure subscription to use this quickstart. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Azure Container Apps CLI extension | Use version 0.3.47 or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version. |

## Setup

1. Create environment variables, a resource group, and an Azure Container Apps environment using the steps that follow. The environment variables contain your custom values, so replace the placeholder values surrounded by `<>` with your own values before you run the following commands:

    ```bash
    export RESOURCE_GROUP=<RESOURCE_GROUP>
    export LOCATION=<LOCATION>
    export CONTAINER_APP_ENVIRONMENT=<CONTAINER_APPS_ENVIRONMENT>
    ```

1. Now you create additional environment variables that contain the settings for your microservices app. These values are used to define the names and configurations of the Java components and the Azure Container Apps that will be used to deploy the microservices. Create these environment variables by using the following commands:

    ```bash
    export CONFIG_SERVER_COMPONENT=configserver
    export ADMIN_SERVER_COMPONENT=admin
    export EUREKA_SERVER_COMPONENT=eureka
    export CONFIG_SERVER_URI=https://github.com/spring-petclinic/spring-petclinic-microservices-config.git
    export CUSTOMERS_SERVICE=customers-service
    export VETS_SERVICE=vets-service
    export VISITS_SERVICE=visits-service
    export API_GATEWAY=api-gateway
    export CUSTOMERS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-customers-service
    export VETS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-vets-service
    export VISITS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-visits-service
    export API_GATEWAY_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-api-gateway
    ```

1. Log in to the Azure CLI and choose your active subscription by using the following command:

    ```azurecli
    az login
    ```

1. Create a resource group to organize your Azure services by using the following command:

    ```azurecli
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION
    ```

1. Create your Azure Container Apps environment, which hosts both the Java components and your container apps, using the following command:

    ```azurecli
    az containerapp env create \
        --resource-group $RESOURCE_GROUP \
        --name $CONTAINER_APP_ENVIRONMENT \
        --location $LOCATION
    ```

## Create Java components

Now you create the following Java components that support your app:

* Config server. Used to manage configuration settings for your microservices apps.
* Eureka server. Used to manage service registry and discovery.
* Admin server. Used to monitor and manage the health and metrics of your microservices apps.

To create these server components, use the following steps:

### [Azure CLI](#tab/azure-cli)

1. Create the config server for your Java components by using the following command:

    ```azurecli
    az containerapp env java-component config-server-for-spring create \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $CONFIG_SERVER_COMPONENT \
      --configuration spring.cloud.config.server.git.uri=$CONFIG_SERVER_URI
    ```

1. Create the Eureka server for your Java components by using the following command:

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
        --resource-group $RESOURCE_GROUP \
        --name $EUREKA_SERVER_COMPONENT
        --environment $CONTAINER_APP_ENVIRONMENT \
    ```

1. Create the admin server for your Java components by using the following command:

    ```azurecli
    az containerapp env java-component admin-for-spring create \
        --resource-group $RESOURCE_GROUP \
        --name $ADMIN_SERVER_COMPONENT
        --environment $CONTAINER_APP_ENVIRONMENT \
    ```

### [Azure portal](#tab/azure-portal)

To create the three Java components, use the following steps:

1. Open your Container Apps environment in the Azure portal.

1. Go to **Services**, select **Service**, and choose your service.

1. To create the config server component, use these steps:

    1. Select **Configure** and choose **Java component** to create a new Java component.

    1. Use the following table to add the values in the portal window:

    | Setting | Value | Remarks |
    |---|---|---|
    | Java component type | Select **Config Server for Spring**. | |
    | Java component name | Enter **configserver**. | This value matches what you defined for the `$CONFIG_SERVER_COMPONENT` variable. |

    1. In the **Git repositories** section, select **Add**.

    1. For the **URI** field, enter **https://github.com/spring-petclinic/spring-petclinic-microservices-config.git**. (Do not include the final period.)

    1. Select **Add**.

    1. Select **Next**.

    1. Select **Configure** to finish the configuration.

1. To create the Eureka server component, use these steps:

    1. Select **Configure**, and choose **Java component** to create a new Java component.

    1. Use the following table to add the values in the portal window:

    | Setting | Value | Remarks |
    |---|---|---|
    | Java component type | Select **Eureka Server for Spring**. | |
    | Java component name | Enter **eureka**. | This value matches what you defined for the `$EUREKA_SERVER_COMPONENT` variable. |

    1. Select **Next**.

    1. Select **Configure** to finish the configuration.

1. To create the admin server component, use the following steps:

    1. Select **Configure** and choose **Java component** to create a new Java component.

    1. Use the following table to add the values in the portal window:

    | Setting | Value | Remarks |
    |---|---|---|
    | Java component type | Select **Admin for Spring**. | |
    | Java component name | Enter **admin**. | This value matches what you defined for the `$ADMIN_SERVER_COMPONENT` variable. |

    Select **Next**.

    Select **Configure** to finish the configuration.

---

## Deploy the microservice apps

Deploy the Java microservice apps to Azure Container Apps using the prebuilt container images.

> [!NOTE]
> In this article, you use a series of [built images](https://github.com/orgs/Azure-Samples/packages?tab=packages&q=spring-petclinic) for the [Spring Petclinic microservice apps](https://github.com/spring-petclinic/spring-petclinic-microservices). You also have the option to customize the sample code and use your own images. For more information, see the [GitHub sample repository](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-petclinic-microservices/README.md).

1. Create the customer data app.

    ```azurecli
    az containerapp create \
      --name $CUSTOMERS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $CUSTOMERS_SERVICE_IMAGE
    ```

1. Create the vet app.

    ```azurecli
    az containerapp create \
      --name $VETS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $VETS_SERVICE_IMAGE
    ```

1. Create the visits app.

    ```azurecli
    az containerapp create \
      --name $VISITS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $VISITS_SERVICE_IMAGE
    ```

1. Create the API gateway app.

    ```azurecli
    az containerapp create \
      --name $API_GATEWAY \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $API_GATEWAY_IMAGE \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn 
    ```

## Bind container apps to Java components

Next, you bind together the Java components to your container apps.

The following commands create bindings which provide the following functionality:

* Injects configuration data into each app from the managed Config Server on startup.

* Registers the app with the managed Eureka Server for service discovery.

* Enables Admin server to monitor the app.

### [Azure CLI](#tab/azure-cli)

The `containerapp update` command creates bindings for each app.

1. Add bindings to the customer data app.

    ```azurecli
    az containerapp update \
      --name $CUSTOMERS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the vet service.

    ```azurecli
    az containerapp update \
      --name $VETS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the visits service.

    ```azurecli
    az containerapp update \
      --name $VISITS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the API gateway.

    This command returns the URL of the front end application. Open this location in your browser.

    ```azurecli
    az containerapp update \
      --name $API_GATEWAY \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT \
      --query properties.configuration.ingress.fqdn 
    ```

### [Azure portal](#tab/azure-portal)

1. Open your Container Apps environment in the Azure portal.

1. From the left menu, expand the *Services* menu and select the **Service**.

1. For each of the three components, select the component by name.

1. In the *Bindings* section, add the four apps created in this tutorial.

:::image type="content" source="media/java-deploy-war-file/bind-apps.png" alt-text="Screenshot of the Bindings section, which allows the user to select apps to bind to the Container App. Four apps are listed: customers-service, vets-service, visits-service, and a p i -gateway.":::

---

## Verify app status

1. View the front end application.

    Using the URL returned from the API gateway's `az containerapp update` command, go to the application in your browser.

    The application should resemble the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of the pet clinic application, showing a welcome page that contains a dog and cat." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png":::

1. View the Eureka Server dashboard.

    > [!IMPORTANT]
    > To view the Eureka Server dashboard and Admin for Spring dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can explicitly assign the `Owner` or `Contributor` role on the resource. You can also follow the steps to create a custom role definition and assign it to your account.

    Run the following command to return the dashboard URL.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_SERVER_COMPONENT \
      --query properties.ingress.fqdn
    ```

    Open the URL in your browser, and you should see an application that resembles the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-eureka.png" alt-text="Screenshot of pet clinic application Eureka Server." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-eureka.png":::

1. View the Admin for Spring dashboard.

    Run the following command to return the dashboard URL.

    ```azurecli
    az containerapp env java-component admin-for-spring show \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $ADMIN_SERVER_COMPONENT \
      --query properties.ingress.fqdn
    ```

    Open the URL in your browser, and you should see an application that resembles the following screenshot.

    :::image type="complex" source="media/java-deploy-war-file/azure-container-apps-petclinic-admin.png" alt-text="Screenshot of the Admin dashboard showing five services up, along with version information for four of the services.":::
       Screenshot of pet clinic Admin dashboard, indicating that all instances are up. The following five instances are each listed as up: CUSTOMERS-SERVICE, SPRING BOOT ADMIN SERVER, VETS-SERVICE, VISITS-SERVICE, and A P I -GATEWAY. The dashboard indicates that there is one instance of each service, and each service except for SPRING BOOT ADMIN SERVER is version 3.2.7.
    :::image-end:::

## Optional: Configure Java components

The Java components created in this tutorial can be configured through the Azure portal. You can go to the **Configurations** section and add or update configurations for your Java components.

:::image type="content" source="media/java-deploy-war-file/java-component-configurations.png" alt-text="Screenshot of the Configurations section, showing Property Name and Value textboxes, and the ability to delete a property.":::

The supported configurations for each Java component are listed in the following links.

* [Config server for Java component](java-config-server-usage.md#configuration-options)

* [Eureka server for Java component](java-eureka-server-usage.md#allowed-configuration-list-for-your-eureka-server-for-spring)

* [Admin for Java component](java-admin-for-spring-usage.md#allowed-configuration-list-for-your-admin-for-spring)

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```
