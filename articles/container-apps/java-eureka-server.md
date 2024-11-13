---
title: "Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps"
description: Learn how to use a managed Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 08/14/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps

Eureka Server for Spring is a service registry that allows microservices to register themselves and discover other services. Eureka Server for Spring is available as an Azure Container Apps component. You can bind your container app to Eureka Server for Spring for automatic registration with the Eureka server.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Eureka Server for Spring Java component.
> * Bind your container app to the Eureka Server for Spring Java component.

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along, make sure that you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To finish this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When you run Eureka Server for Spring in Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| Scope | The Eureka Server for Spring component runs in the same environment as the connected container app. |
| Scaling | The Eureka Server for Spring conponent can't scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. To achieve high availability, see [Create a highly available Eureka Service in Container Apps](java-eureka-server-highly-available.md).|
| Resources | The container resource allocation for Eureka Server for Spring is fixed. The number of the CPU cores is 0.5, and the memory size is 1 Gi. |
| Pricing | The Eureka Server for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing. |
| Binding | Container apps connect to a Eureka Server for Spring component via a binding. The bindings inject configurations into container app environment variables. After a binding is established, the container app can read the configuration values from environment variables and connect to the Eureka Server for Spring component. |

## Setup

Before you begin to work with the Eureka Server for Spring component, you first need to create the required resources.

### [Azure CLI](#tab/azure-cli)

Run the following commands to create your resource group in a container app environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export EUREKA_COMPONENT_NAME=eureka
    export APP_NAME=my-eureka-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The container app environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `EUREKA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Eureka Server for Spring Java component.  |
    | `IMAGE` | The container image used in your container app. |

1. Sign in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create your container app environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

### [Azure portal](#tab/azure-portal)

To create each of the resources that are necessary to create a container app, follow these steps:

1. Search for **Container Apps** in the Azure portal, and then select **Create**.

1. On the **Basics** tab, enter the following values:

      | Property | Value |
      |---|---|
      | Subscription | Select your Azure subscription. |
      | Resource group | Select **Create new** to create a new resource group named **my-resource-group**. |
      | Container app name | Enter **my-eureka-client**.  |
      | Deployment source | Select **Container image**. |
      | Region | Select the region nearest you. |
      | Container app environment | Select **Create new** to create a new environment. |

1. On the **Create Container Apps environment** window, enter the following values:

      | Property | Value |
      |---|---|
      | Environment name | Enter **my-environment**. |
      | Zone redundancy | Select **Disabled**.  |

1. Select **Create**, and then select the **Container** tab.

1. On the **Container** tab, enter the following values:

      | Property | Value |
      |---|---|
      | Name | Enter **my-eureka-client**. |
      | Image source | Select **Docker Hub or other registries**. |
      | Image type | Select **Public**. |
      | Registry sign-in server | Enter **mcr.microsoft.com**. |
      | Image and tag | Enter **javacomponents/samples/sample-service-eureka-client:latest**. |

1. Select the **Ingress** tab.

1. On the **Ingress** tab, enter the following values and leave the rest of the form filled in with the default values.

      | Property | Value |
      |---|---|
      | Ingress | Select **Enabled**. |
      | Ingress traffic | Select **Accept traffic from anywhere**. |
      | Ingress type | Select **HTTP**. |
      | Target port | Enter **8080**. |

1. Select **Review + create**.

1. After the validation checks pass, select **Create** to create your container app.

---

## Create the Eureka Server for Spring Java component

### [Azure CLI](#tab/azure-cli)

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

### [Azure portal](#tab/azure-portal)

Now that you have an existing environment and Eureka client container app, you can create a Java component instance of Eureka Server for Spring.

1. Go to your container app environment in the portal.

1. On the service menu, under **Services**, select **Services**.

1. Select the **+ Configure** dropdown, and select **Java component**.

1. On the **Configure Java component** pane, enter the following values:

      | Property | Value |
      |---|---|
      | Java component type | Select **Eureka Server for Spring**. |
      | Java component name | Enter **eureka**. |

1. Select **Next**.

1. On the **Review** tab, select **Configure**.

---

## Bind your container app to the Eureka Server for Spring Java component

### [Azure CLI](#tab/azure-cli)

1. Create the container app and bind it to the Eureka Server for Spring component.

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

1. Copy the URL of your app to a text editor so that you can use it in an upcoming step.

### [Azure portal](#tab/azure-portal)

1. Go to your container app environment in the portal.

1. On the service menu, under **Services**, select **Services**.

1. From the list, select **eureka**.

1. Under **bindings**, select the **App name** dropdown, and then select  **my-eureka-client**.

1. Select the **Review** tab.

1. Select **Configure**.

1. Return to your container app in the portal. Copy the URL of your app to a text editor so that you can use it in an upcoming step.

---

Return to the container app in the portal. Copy the URL of your app to a text editor so that you can use it in an upcoming step.

Go to the `/allRegistrationStatus` route to view all applications that are registered with the Eureka Server for Spring component.

The binding injects several configurations into the application as environment variables, primarily the `eureka.client.service-url.defaultZone` property. This property indicates the internal endpoint of the Eureka Server Java component.

The binding also injects the following properties:

```bash
"eureka.client.register-with-eureka":    "true"
"eureka.client.fetch-registry":          "true"
"eureka.instance.prefer-ip-address":     "true"
```

The `eureka.client.register-with-eureka` property is set to `true` to enforce registration with the Eureka server. This registration overwrites the local setting in `application.properties`, from the configuration server and so on. If you want to set it to `false`, you can overwrite it by setting an environment variable in your container app.

The `eureka.instance.prefer-ip-address` property is set to `true` because of the specific domain name system resolution rule in the container app environment. Don't modify this value so that you don't break the binding.

## Optional: Unbind your container app from the Eureka Server for Spring Java component

### [Azure CLI](#tab/azure-cli)

To remove a binding from a container app, use the `--unbind` option.

  ``` azurecli
    az containerapp update \
      --name $APP_NAME \
      --unbind $JAVA_COMPONENT_NAME \
      --resource-group $RESOURCE_GROUP
  ```

### [Azure portal](#tab/azure-portal)

1. Go to your container app environment in the portal.

1. On the service menu, under **Services**, select **Services**.

1. From the list, select **eureka**.

1. Under **Bindings**, find the line for **my-eureka-client** and select it. Then select **Delete**.

1. Select **Next**.

1. Select the **Review** tab.

1. Select **Configure**.

---

## View the application through a dashboard

> [!IMPORTANT]
> To view the dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can explicitly assign the `Owner` or `Contributor` role on the resource. You can also follow the steps to create a custom role definition and assign it to your account.

1. Create a custom role definition.

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

    Make sure to replace the placeholder in between the `<>` brackets in the `AssignableScopes` value with your subscription ID.

1. Assign the custom role to your account on a managed environment resource.

    Get the resource ID of the managed environment:

    ```azurecli
        export ENVIRONMENT_ID=$(az containerapp env show \
         --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \ 
         --query id -o tsv)
    ```

1. Assign the role to your account.

    Before you run this command, replace the placeholder in between the `<>` brackets with your user or service principal ID.

    ```azurecli
    az role assignment create \
      --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
      --role "<ROLE_NAME>" \
      --scope $ENVIRONMENT_ID
    ```

    > [!NOTE]
    > The <USER_OR_SERVICE_PRINCIPAL_ID> property usually should be the identity that you use to access the Azure portal. The <ROLE_NAME> property is the name that you assigned in step 1.

1. Get the URL of the Eureka Server for Spring dashboard.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL that you can use to access the Eureka Server for Spring dashboard. With the dashboard, you can also see your container app, as shown in the following screenshot.

    :::image type="content" source="media/java-components/eureka-alone.png" alt-text="Screenshot that shows the Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka-alone.png":::

## Optional: Integrate the Eureka Server for Spring and Admin for Spring Java components

If you want to integrate the Eureka Server for Spring and the Admin for Spring Java components, see [Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md).

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long term, run the following command to remove everything you created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next step

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)

## Related content

[Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
