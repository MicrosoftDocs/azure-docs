---
title: Launch your First Java Microservice Application with Managed Java Components in Azure Container Apps
description: Learn how to deploy a Java microservice project in Azure Container Apps with managed Java components.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 11/25/2024
ms.author: yiliu6
---

# Quickstart: Launch your first Java microservice application with managed Java components in Azure Container Apps

In this quickstart, you learn how to deploy an application in Azure Container Apps that uses Java components to handle configuration management, service discovery, and health and metrics. The sample application used in this example is the Java PetClinic, which uses the microservice architecture pattern. The following diagram depicts the architecture of the PetClinic application on Azure Container Apps:

:::image type="complex" source="media/java-microservice-get-started/azure-container-apps-pet-clinic-architecture.png" alt-text="Diagram of the relationship between the Java components and the microservice applications." lightbox="media/java-microservice-get-started/azure-container-apps-pet-clinic-architecture.png":::
   Diagram of an Azure Container Apps environment illustrating the architecture of four microservices-based applications deployed within an Azure resource group. A resource group contains the Azure Container Apps environment. The environment includes three Azure Container Apps managed Java components: a config server, a service registry, and an admin server. The config server fetches configuration data stored as versioned YAML files in a Git repository external to the Azure Container Apps environment. The service registry handles service discovery and registration. The admin server provides a live view of the system. An API gateway routes requests to three microservices: vets service, customers service, and visits service. Each service is linked to its own database for data persistence. The environment supports external interactions through a browser and a mobile app and integrates with monitoring tools via Azure Log Analytics Workspaces for tracking system performance and health.
:::image-end:::

The PetClinic application includes the following features:

* The front end is a standalone Node.js web app hosted on the API gateway app.
* The API gateway routes requests to back-end service apps.
* Back-end apps are built with Spring Boot.
* Each back-end app uses a HyperSQL database as the persistent store.
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

By the end of this article, you deploy one web application and three back-end applications that are configured to work with three different Java components. You can then manage each component via the Azure portal.

## Prerequisites

- Azure account: If you don't have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the **Contributor** or **Owner** permission on the Azure subscription to use this quickstart. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current).
- Azure CLI: Install the [Azure CLI](/cli/azure/install-azure-cli).  
- Azure Container Apps CLI extension. Use version 0.3.47 or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version.  

## Setup

To create environment variables, a resource group, and an Azure Container Apps environment, use the following steps:

1. The environment variables contain your custom values, so replace the placeholder values surrounded by `<>` with your own values before you run the following commands:

    ```bash
    export RESOURCE_GROUP=<RESOURCE_GROUP>
    export LOCATION=<LOCATION>
    export CONTAINER_APP_ENVIRONMENT=<CONTAINER_APPS_ENVIRONMENT>
    ```

1. Now you create more environment variables that contain the settings for your microservices app. These values are used to define the names and configurations of the Java components and the Azure Container Apps that you use to deploy the microservices. Create these environment variables by using the following commands:

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

1. Sign in to the Azure CLI and choose your active subscription by using the following command:

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
        --resource-group $RESOURCE_GROUP \
        --name $CONFIG_SERVER_COMPONENT \
        --environment $CONTAINER_APP_ENVIRONMENT \
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

       | Setting             | Value                                | Remarks                                                                          |
       |---------------------|--------------------------------------|----------------------------------------------------------------------------------|
       | Java component type | Select **Config Server for Spring**. |                                                                                  |
       | Java component name | Enter **configserver**.              | This value matches what you defined for the `$CONFIG_SERVER_COMPONENT` variable. |

    1. In the **Git repositories** section, select **Add**.

    1. For the **URI** field, enter **https://github.com/spring-petclinic/spring-petclinic-microservices-config.git**. (Don't include the final period.)

    1. Select **Add**.

    1. Select **Next**.

    1. Select **Configure** to finish the configuration.

1. To create the Eureka server component, use these steps:

    1. Select **Configure**, and choose **Java component** to create a new Java component.

    1. Use the following table to add the values in the portal window:

       | Setting             | Value                                | Remarks                                                                          |
       |---------------------|--------------------------------------|----------------------------------------------------------------------------------|
       | Java component type | Select **Eureka Server for Spring**. |                                                                                  |
       | Java component name | Enter **eureka**.                    | This value matches what you defined for the `$EUREKA_SERVER_COMPONENT` variable. |

    1. Select **Next**.

    1. Select **Configure** to finish the configuration.

1. To create the admin server component, use the following steps:

    1. Select **Configure** and choose **Java component** to create a new Java component.

    1. Use the following table to add the values in the portal window:

       | Setting             | Value                        | Remarks                                                                         |
       |---------------------|------------------------------|---------------------------------------------------------------------------------|
       | Java component type | Select **Admin for Spring**. |                                                                                 |
       | Java component name | Enter **admin**.             | This value matches what you defined for the `$ADMIN_SERVER_COMPONENT` variable. |

    1. Select **Next**.

    1. Select **Configure** to finish the configuration.

---

## Deploy the microservice apps

To deploy the Java microservice apps to Azure Container Apps using the prebuilt container images, use the following steps:

> [!NOTE]
> In this article, you use a series of [built images](https://github.com/orgs/Azure-Samples/packages?tab=packages&q=spring-petclinic) for the [Spring Petclinic microservice apps](https://github.com/spring-petclinic/spring-petclinic-microservices). You also have the option to customize the sample code and use your own images. For more information, see the [azure-container-apps-java-samples GitHub repository](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-petclinic-microservices/README.md).

1. Create the customer data app by using the following command:

    ```azurecli
    az containerapp create \
        --resource-group $RESOURCE_GROUP \
        --name $CUSTOMERS_SERVICE \
        --environment $CONTAINER_APP_ENVIRONMENT \
        --image $CUSTOMERS_SERVICE_IMAGE
    ```

1. Create the vet app by using the following command:

    ```azurecli
    az containerapp create \
        --resource-group $RESOURCE_GROUP \
        --name $VETS_SERVICE \
        --environment $CONTAINER_APP_ENVIRONMENT \
        --image $VETS_SERVICE_IMAGE
    ```

1. Create the visits app by using the following command:

    ```azurecli
    az containerapp create \
        --resource-group $RESOURCE_GROUP \
        --name $VISITS_SERVICE \
        --environment $CONTAINER_APP_ENVIRONMENT \
        --image $VISITS_SERVICE_IMAGE
    ```

1. Create the API gateway app by using the following command:

    ```azurecli
    az containerapp create \
        --resource-group $RESOURCE_GROUP \
        --name $API_GATEWAY \
        --environment $CONTAINER_APP_ENVIRONMENT \
        --image $API_GATEWAY_IMAGE \
        --ingress external \
        --target-port 8080 \
        --query properties.configuration.ingress.fqdn 
    ```

## Bind container apps to Java components

Next, bind the Java components to your container apps. The bindings that you create in this section provide the following functionality:

* Inject configuration data into each app from the managed config server on startup.
* Register the app with the managed Eureka server for service discovery.
* Enable the admin server to monitor the app.

### [Azure CLI](#tab/azure-cli)

Use the `containerapp update` command to create bindings for each app by using the following steps:

1. Add bindings to the customer data app by using the following command:

    ```azurecli
    az containerapp update \
        --resource-group $RESOURCE_GROUP \
        --name $CUSTOMERS_SERVICE \
        --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the vet service by using the following command:

    ```azurecli
    az containerapp update \
        --resource-group $RESOURCE_GROUP \
        --name $VETS_SERVICE \
        --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the visits service by using the following command:

    ```azurecli
    az containerapp update \
        --resource-group $RESOURCE_GROUP \
        --name $VISITS_SERVICE \
        --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the API gateway. Use the following command to return the URL of the front-end application, and then open this location in your browser:

    ```azurecli
    az containerapp update \
        --resource-group $RESOURCE_GROUP \
        --name $API_GATEWAY \
        --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT \
        --query properties.configuration.ingress.fqdn 
    ```

### [Azure portal](#tab/azure-portal)

Use the following steps to create bindings for each app:

1. Open your Container Apps environment in the Azure portal.

1. Go to **Services** and select **Service**.

1. For each of the three components, select the component by name.

1. In the **Bindings** section, add the four apps created in this quickstart.

   :::image type="content" source="media/java-microservice-get-started/azure-container-apps-bindings-section.png" alt-text="Screenshot of the Bindings section. Four apps are listed: customers-service, vets-service, visits-service, and a p i gateway.":::

---

## Verify app status

Use the following steps to verify the app status:

1. Using the URL returned from the API gateway's `az containerapp update` command, view the front-end application in your browser. The application should resemble the following screenshot:

   :::image type="content" source="media/java-microservice-get-started/azure-container-apps-petclinic-home-page.png" alt-text="Screenshot of the home page of the pet clinic application." lightbox="media/java-microservice-get-started/azure-container-apps-petclinic-home-page.png":::

1. View the Eureka server dashboard by using the following steps:

    > [!IMPORTANT]
    > To view the Eureka Server dashboard and Admin for Spring dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can explicitly assign the `Owner` or `Contributor` role on the resource. You can also follow the steps to create a custom role definition and assign it to your account.

    1. Run the following command to return the dashboard URL:

       ```azurecli
       az containerapp env java-component eureka-server-for-spring show \
           --resource-group $RESOURCE_GROUP \
           --name $EUREKA_SERVER_COMPONENT \
           --environment $CONTAINER_APP_ENVIRONMENT \
           --query properties.ingress.fqdn
       ```

    1. Open the URL in your browser. You should see an application that resembles the following screenshot:

       :::image type="content" source="media/java-microservice-get-started/azure-container-apps-petclinic-eureka-server.png" alt-text="Screenshot of pet clinic application Eureka Server." lightbox="media/java-microservice-get-started/azure-container-apps-petclinic-eureka-server.png":::

1. View the Admin for Spring dashboard by using the following steps:

    1. Use the following command to return the dashboard URL:
  
       ```azurecli
       az containerapp env java-component admin-for-spring show \
           --resource-group $RESOURCE_GROUP \
           --name $ADMIN_SERVER_COMPONENT \
           --environment $CONTAINER_APP_ENVIRONMENT \
           --query properties.ingress.fqdn
       ```
  
    1. Open the URL in your browser. You should see an application that resembles the following screenshot:
  
       :::image type="content" source="media/java-microservice-get-started/azure-container-apps-pet-clinic-administration.png" alt-text="Screenshot of the pet clinic admin dashboard showing five services up, along with version information for four of the services." lightbox="media/java-microservice-get-started/azure-container-apps-pet-clinic-administration.png":::

## Optional: Configure Java components

You can configure the Java components created in this quickstart through the Azure portal by using the **Configurations** section.

:::image type="content" source="media/java-microservice-get-started/azure-portal-java-configurations-sections.png" alt-text="Screenshot of the Configurations section, showing Property Name and Value textboxes, and the ability to delete a property." lightbox="media/java-microservice-get-started/azure-portal-java-configurations-sections.png":::

For more information on configuring the three Java components you created in this quickstart, see the following links:

* [Config server](java-config-server-usage.md#configuration-options)
* [Eureka server](java-eureka-server-usage.md#allowed-configuration-list-for-your-eureka-server-for-spring)
* [Admin server](java-admin-for-spring-usage.md#allowed-configuration-list-for-your-admin-for-spring)

## Clean up resources

The resources created in this quickstart have an effect on your Azure bill. If you aren't going to use these services long-term, use the following command to remove everything created in this quickstart:

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

- [Java components](./java-feature-switch.md#java-components)