---
title: "Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps"
description: Learn to use a managed Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 07/15/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps (preview)

Eureka Server for Spring is a service registry that allows microservices to register themselves and discover other services. Available as an Azure Container Apps component, you can bind your container app to a Eureka Server for Spring for automatic registration with the Eureka server.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a Eureka Server for Spring Java component
> * Bind your container app to Eureka Server for Spring Java component

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running in Eureka Server for Spring in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Eureka Server for Spring component runs in the same environment as the connected container app. |
| **Scaling** | The Eureka Server for Spring can’t scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| **Resources** | The container resource allocation for Eureka Server for Spring is fixed. The number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Eureka Server for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing. |
| **Binding** | Container apps connect to a Eureka Server for Spring component via a binding. The bindings inject configurations into container app environment variables. Once a binding is established, the container app can read the configuration values from environment variables and connect to the Eureka Server for Spring. |

## Setup

Before you begin to work with the Eureka Server for Spring, you first need to create the required resources.

# [Azure CLI](#tab/azure-cli)

Execute the following commands to create your resource group, container apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export EUREKA_COMPONENT_NAME=eureka
    export APP_NAME=sample-service-eureka-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `EUREKA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Eureka Server for Spring Java component.  |
    | `IMAGE` | The container image used in your container app. |

1. Log in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create your container apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```
# [Azure portal](#tab/azure-portal)

Follow the following steps to create the resource group, client container app and container apps environment.

1. Search for *Container Apps* in the Azure portal and select *Create*
2. Enter the following values to *Basics* tab. You need to select *Create new* in *Resource group* and *Container Apps Environment* to create the new resource. 
| Setting | Value |
|---|---|
| Subscription | *Your own subscription* |
| Resource group | *my-services-resource-group* |
| Container app name | *sample-service-eureka-client* |
| Deployment source | *Container image* |
| Region | *East US* |
| Container Apps Environment | *my-environment* |
---

    :::image type="content" source="media/java-components/create-containerapp-eureka.png" alt-text="Screenshot of create container apps."  lightbox="media/java-components/create-containerapp-eureka.png":::

1. In Container tab, select or enter the following values and leave others be the default.
| Setting | Value |
|---|---|
| Name | *sample-service-eureka-client* |
| Image source | *Docker Hub or other registeries* |
| Image type | *Public* |
| Registry login server | *mcr.microsoft.com* |
| Image and tag | *javacomponents/samples/sample-service-eureka-client:latest* |
---

  :::image type="content" source="media/java-components/select-eureka-image.png" alt-text="Screenshot of select image when create container apps."  lightbox="media/java-components/select-eureka-image.png":::

1. In Ingress tab, select or enter the following values and leave others be the default, then click *Review + create*
| Setting | Value |
|---|---|
| Ingress | *Enabled* |
| Ingress traffic | *Accepting traffic from anywhere* |
| Ingress type | *HTTP* |
| Transport | *Auto* |
| Target port | *8080* |
   
    :::image type="content" source="media/java-components/config-ingress.png" alt-text="Screenshot of config ingress when create container apps."  lightbox="media/java-components/config-ingress.png":::

1. Click *Create* after validation passed

---

## Create the Eureka Server for Spring Java component

# [Azure CLI](#tab/azure-cli)

Now that you have an existing environment, you can create your container app and bind it to a Java component instance of Eureka Server for Spring.

1. Create the Eureka Server for Spring Java component.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME
    ```

1. Optional: Update the Eureka Server for Spring Java component configuration.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring update \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME 
      --configuration eureka.server.renewal-percent-threshold=0.85 eureka.server.eviction-interval-timer-in-ms=10000
    ```

# [Azure portal](#tab/azure-portal)

Now that you have an existing environment and eureka client container app, create a Java component instance of Eureka Server for Spring.

1. Go to your container app environment page, select *Service* on the left panel, and then select *Configure*, *Java component*
   
       :::image type="content" source="media/java-components/select-java-component.png" alt-text="Screenshot of how to select Java component."  lightbox="media/java-components/select-java-component.png":::

1. In new *Configure Java component* panel, select or enter the following values and leave others be the default, and then select *Next*
| Setting | Value |
|---|---|
| Java component type | *Eureka Server for Spring* |
| Java component name | *eureka* |
---
       :::image type="content" source="media/java-components/create-eureka-java-component.png" alt-text="Screenshot of how to select Java component."  lightbox="media/java-components/create-eureka-java-component.png":::
1. Click *Configure* on *Review* page
---

## Bind your container app to the Eureka Server for Spring Java component
# [Azure CLI](#tab/azure-cli)

1. Create the container app and bind to the Eureka Server for Spring.

    ```azurecli
    az containerapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --image $IMAGE \
      --min-replicas 1 \
      --max-replicas 1 \
      --ingress external \
      --target-port 8080 \
      --bind $EUREKA_COMPONENT_NAME \
      --query properties.configuration.ingress.fqdn
    ```
# [Azure portal](#tab/azure-portal)
1.  Go to your container app environment page, select *Service* on the left panel
2.  Select *eureka* in Service list
3.  Under bindings, select app *sample-service-eureka-client*, Click *Next*
4.  Click *Configure*
  
    :::image type="content" source="media/java-components/app-bind-eureka.png" alt-text="Screenshot of container app bind with eureka."  lightbox="media/java-components/app-bind-eureka.png":::

5. Go to your container app *sample-service-eureka-client* page, get the *Application URL* of the container app
---
    After you get the URL of the container app. Copy the URL to a text editor so you can use it in a coming step.

    Navigate to the `/allRegistrationStatus` route to view all applications registered with the Eureka Server for Spring.

    The binding injects several configurations into the application as environment variables, primarily the `eureka.client.service-url.defaultZone` property. This property indicates the internal endpoint of the Eureka Server Java component.

    The binding also injects the following properties:

    ```bash
    "eureka.client.register-with-eureka":    "true"
    "eureka.instance.prefer-ip-address":     "true"
    ```

    The `eureka.client.register-with-eureka` property is set to `true` to enforce registration with the Eureka server. This registration overwrites the local setting in `application.properties`, from the config server and so on. If you want to set it to `false`, you can overwrite it by setting an environment variable in your container app.

    The `eureka.instance.prefer-ip-address` is set to `true` due to the specific DNS resolution rule in the container app environment. Don't modify this value so you don't break the binding.

## Unbind your container app from the Eureka Server for Spring Java component

# [Azure CLI](#tab/azure-cli)
To remove a binding from a container app, use the `--unbind` option.

  ``` azurecli
    az containerapp update \
      --name $APP_NAME \
      --unbind $JAVA_COMPONENT_NAME \
      --resource-group $RESOURCE_GROUP
  ```
# [Azure portal](#tab/azure-portal)
1.  Go to your container app environment page, select *Service* on the left panel
2.  Select *eureka* in Service list
3.  Under bindings, select Delete after app *sample-service-eureka-client*, Click *Next*
4.  Click *Configure*
  
    :::image type="content" source="media/java-components/app-unbind-eureka.png" alt-text="Screenshot of container app unbind with eureka."  lightbox="media/java-components/app-unbind-eureka.png":::

---

## View the application through a dashboard

> [!IMPORTANT]
> To view the dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can either explicitly assign `Owner` or `Contributor` role on the resource or follow the steps to create a custom role definition and assign it to your account.

1. Create the custom role definition.

    ```azurecli
    az role definition create --role-definition '{
        "Name": "<YOUR_ROLE_NAME>",
        "IsCustom": true,
        "Description": "Can access managed Java Component dashboards in managed environments",
        "Actions": [
            "Microsoft.App/managedEnvironments/write"
        ],
        "AssignableScopes": ["/subscriptions/<SUBSCRIPTION_ID>"]
    }'
    ```

    Make sure to replace placeholder in between the `<>` brackets in the `AssignableScopes` value with your subscription ID.

1. Assign the custom role to your account on managed environment resource.

    Get the resource id of the managed environment:

    ```azurecli
        export ENVIRONMENT_ID=$(az containerapp env show \
         --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \ 
         --query id -o tsv)
    ```

1. Assign the role to your account.

    Before running this command, replace the placeholder in between the `<>` brackets with your user or service principal ID.

    ```azurecli
    az role assignment create \
      --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
      --role "<ROLE_NAME>" \
      --scope $ENVIRONMENT_ID
    ```

    > [!NOTE]
    > <USER_OR_SERVICE_PRINCIPAL_ID> usually should be the identity that you use to access Azure Portal. <ROLE_NAME> is the name you assigned in step 1.

1. Get the URL of the Eureka Server for Spring dashboard.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL you can use to access the Eureka Server for Spring dashboard. Through the dashboard, your container app is also to you as shown in the following screenshot.

    :::image type="content" source="media/java-components/eureka-alone.png" alt-text="Screenshot of the Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka-alone.png":::

## Optional: Integrate the Eureka Server for Spring and Admin for Spring Java components

If you want to integrate the Eureka Server for Spring and the Admin for Spring Java components, see [Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md).

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)

## Related content

- [Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
