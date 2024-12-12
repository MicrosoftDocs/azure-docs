---
title: "Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps"
description: Learn how to use a managed Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 11/19/2024
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

* An Azure account with an active subscription. If you don't already have one, you can [can create one for free](https://azure.microsoft.com/free/).
* [Azure CLI](/cli/azure/install-azure-cli).

## Considerations

When you run Eureka Server for Spring in Container Apps, be aware of the following details:

| Item      | Explanation                                                                                                                                                                                                                                                                                                                      |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Scope     | The Eureka Server for Spring component runs in the same environment as the connected container app.                                                                                                                                                                                                                              |
| Scaling   | The Eureka Server for Spring component can't scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. To achieve high availability, see [Create a highly available Eureka Service in Container Apps](java-eureka-server-highly-available.md).                                                          |
| Resources | The container resource allocation for Eureka Server for Spring is fixed. The number of the CPU cores is 0.5, and the memory size is 1 Gi.                                                                                                                                                                                        |
| Pricing   | The Eureka Server for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing.                                                                                              |
| Binding   | Container apps connect to a Eureka Server for Spring component via a binding. The bindings inject configurations into container app environment variables. After a binding is established, the container app can read the configuration values from environment variables and connect to the Eureka Server for Spring component. |

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

   | Variable                | Description                                                                                                                        |
   |-------------------------|------------------------------------------------------------------------------------------------------------------------------------|
   | `LOCATION`              | The Azure region location where you create your container app and Java component.                                                  |
   | `ENVIRONMENT`           | The container app environment name for your demo application.                                                                      |
   | `RESOURCE_GROUP`        | The Azure resource group name for your demo application.                                                                           |
   | `EUREKA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Eureka Server for Spring Java component. |
   | `IMAGE`                 | The container image used in your container app.                                                                                    |

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

   | Property                  | Value                                                                           |
   |---------------------------|---------------------------------------------------------------------------------|
   | Subscription              | Select your Azure subscription.                                                 |
   | Resource group            | Select **Create new** to create a new resource group named `my-resource-group`. |
   | Container app name        | Enter **my-eureka-client**.                                                     |
   | Deployment source         | Select **Container image**.                                                     |
   | Region                    | Select the region nearest you.                                                  |
   | Container app environment | Select **Create new** to create a new environment.                              |

1. On the **Create Container Apps environment** window, enter the following values:

   | Property         | Value                     |
   |------------------|---------------------------|
   | Environment name | Enter **my-environment**. |
   | Zone redundancy  | Select **Disabled**.      |

1. Select **Create**, and then select the **Container** tab.

1. On the **Container** tab, enter the following values:

   | Property                | Value                                                                 |
   |-------------------------|-----------------------------------------------------------------------|
   | Name                    | Enter **my-eureka-client**.                                           |
   | Image source            | Select **Docker Hub or other registries**.                            |
   | Image type              | Select **Public**.                                                    |
   | Registry sign-in server | Enter **mcr.microsoft.com**.                                          |
   | Image and tag           | Enter **javacomponents/samples/sample-service-eureka-client:latest**. |

1. Select the **Ingress** tab.

1. On the **Ingress** tab, enter the following values and leave the rest of the form filled in with the default values.

   | Property        | Value                                    |
   |-----------------|------------------------------------------|
   | Ingress         | Select **Enabled**.                      |
   | Ingress traffic | Select **Accept traffic from anywhere**. |
   | Ingress type    | Select **HTTP**.                         |
   | Target port     | Enter **8080**.                          |

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

1. Select the **Configure** dropdown, then select **Java component**.

1. On the **Configure Java component** pane, enter the following values:

   | Property            | Value                                |
   |---------------------|--------------------------------------|
   | Java component type | Select **Eureka Server for Spring**. |
   | Java component name | Enter **eureka**.                    |

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

    Make sure to replace the `<SUBSCRIPTION_ID>` placeholder in the `AssignableScopes` value with your subscription ID.

1. Assign the custom role to your account on a managed environment resource.

   Get the resource ID of the managed environment:

   ```azurecli
   export ENVIRONMENT_ID=$(az containerapp env show \
       --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \
       --query id \
       --output tsv)
   ```

1. Assign the role to your account.

   Before you run this command, replace the placeholders - indicated by the `<>` brackets - with your user or service principal ID and your role name.

   ```azurecli
   az role assignment create \
       --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
       --role "<ROLE_NAME>" \
       --scope $ENVIRONMENT_ID
   ```

   > [!NOTE]
   > The `<USER_OR_SERVICE_PRINCIPAL_ID>` value usually should be the identity that you use to access the Azure portal. The `<ROLE_NAME>` value is the name that you assigned in step 1.

1. Get the URL of the Eureka Server for Spring dashboard.

   ```azurecli
   az containerapp env java-component eureka-server-for-spring show \
       --environment $ENVIRONMENT \
       --resource-group $RESOURCE_GROUP \
       --name $EUREKA_COMPONENT_NAME \
       --query properties.ingress.fqdn \
       --output tsv
   ```

   This command returns the URL that you can use to access the Eureka Server for Spring dashboard. With the dashboard, you can also see your container app, as shown in the following screenshot.

   :::image type="content" source="media/java-components/eureka-alone.png" alt-text="Screenshot that shows the Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka-alone.png":::

## Optional: Integrate the Eureka Server for Spring and Admin for Spring Java components

If you want to integrate the Eureka Server for Spring and the Admin for Spring Java components, see [Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md).

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long term, run the following command to remove everything you created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Allowed configuration list for your Eureka Server for Spring

The following sections describe the supported configurations. For more information, see [Spring Cloud Eureka Server](https://cloud.spring.io/spring-cloud-netflix/reference/html/#spring-cloud-eureka-server).

> [!NOTE]
> Please submit support tickets for new feature requests.

### Configuration options

The `az containerapp update` command uses the `--configuration` parameter to control how the Eureka Server for Spring is configured. You can use multiple parameters at once as long as they're separated by a space. For more information, see [Spring Cloud Eureka Server](https://cloud.spring.io/spring-cloud-netflix/reference/html/#spring-cloud-eureka-server).

The following configuration settings are available on the `eureka.server` configuration property:

| Name                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default value |
|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `eureka.server.enable-self-preservation`                  | When enabled, the server keeps track of the number of renewals it should receive from the server. Any time the number of renewals drops below the threshold percentage as defined by `eureka.server.renewal-percent-threshold`. The default value is set to `true` in the original Eureka server, but in the Eureka Server Java component, the default value is set to `false`. See [Limitations of Eureka Server for Spring Java component](#limitations). | `false`       |
| `eureka.server.renewal-percent-threshold`                 | The minimum percentage of renewals that is expected from the clients in the period specified by `eureka.server.renewal-threshold-update-interval-ms`. If the renewals drop below the threshold, the expirations are disabled if `eureka.server.enable-self-preservation` is enabled.                                                                                                                                                                        | `0.85`        |
| `eureka.server.renewal-threshold-update-interval-ms`      | The interval with which the threshold - as specified in `eureka.server.renewal-percent-threshold` - needs to be updated.                                                                                                                                                                                                                                                                                                                                    | `0`           |
| `eureka.server.expected-client-renewal-interval-seconds`  | The interval with which clients are expected to send their heartbeats. Defaults to 30 seconds. If clients send heartbeats with different frequency, say, every 15 seconds, then this parameter should be tuned accordingly, otherwise, self-preservation won't work as expected.                                                                                                                                                                            | `30`          |
| `eureka.server.response-cache-auto-expiration-in-seconds` | Gets the time for which the registry payload should be kept in the cache if it is not invalidated by change events.                                                                                                                                                                                                                                                                                                                                         | `180`         |
| `eureka.server.response-cache-update-interval-ms`         | Gets the time interval with which the payload cache of the client should be updated.                                                                                                                                                                                                                                                                                                                                                                        | `0`           |
| `eureka.server.use-read-only-response-cache`              | The `com.netflix.eureka.registry.ResponseCache` currently uses a two level caching strategy to responses. A `readWrite` cache with an expiration policy, and a `readonly` cache that caches without expiry.                                                                                                                                                                                                                                                 | `true`        |
| `eureka.server.disable-delta`                             | Checks to see if the delta information can be served to client or not.                                                                                                                                                                                                                                                                                                                                                                                      | `false`       |
| `eureka.server.retention-time-in-m-s-in-delta-queue`      | Get the time for which the delta information should be cached for the clients to retrieve the value without missing it.                                                                                                                                                                                                                                                                                                                                     | `0`           |
| `eureka.server.delta-retention-timer-interval-in-ms`      | Get the time interval with which the clean up task should wake up and check for expired delta information.                                                                                                                                                                                                                                                                                                                                                  | `0`           |
| `eureka.server.eviction-interval-timer-in-ms`             | Get the time interval with which the task that expires instances should wake up and run.                                                                                                                                                                                                                                                                                                                                                                    | `60000`       |
| `eureka.server.sync-when-timestamp-differs`               | Checks whether to synchronize instances when timestamp differs.                                                                                                                                                                                                                                                                                                                                                                                             | `true`        |
| `eureka.server.rate-limiter-enabled`                      | Indicates whether the rate limiter should be enabled or disabled.                                                                                                                                                                                                                                                                                                                                                                                           | `false`       |
| `eureka.server.rate-limiter-burst-size`                   | Rate limiter, token bucket algorithm property.                                                                                                                                                                                                                                                                                                                                                                                                              | `10`          |
| `eureka.server.rate-limiter-registry-fetch-average-rate`  | Rate limiter, token bucket algorithm property. Specifies the average enforced request rate.                                                                                                                                                                                                                                                                                                                                                                 | `500`         |
| `eureka.server.rate-limiter-privileged-clients`           | A list of certified clients. This is in addition to standard eureka Java clients.                                                                                                                                                                                                                                                                                                                                                                           | `N/A`         |
| `eureka.server.rate-limiter-throttle-standard-clients`    | Indicate if rate limit standard clients. If set to `false`, only nonstandard clients are rate limited.                                                                                                                                                                                                                                                                                                                                                      | `false`       |
| `eureka.server.rate-limiter-full-fetch-average-rate`      | Rate limiter, token bucket algorithm property. Specifies the average enforced request rate.                                                                                                                                                                                                                                                                                                                                                                 | `100`         |

### Common configurations

- Logging related configurations:
  - [`logging.level.*`](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-levels)
  - [`logging.group.*`](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-logging.html#boot-features-custom-log-groups)
  - Any other configurations under the `logging.*` namespace should be forbidden - for example, writing log files by using `logging.file` should be forbidden.

## Call between applications

This example shows you how to write Java code to call between applications registered with the Eureka Server for Spring component. When container apps are bound with Eureka, they communicate with each other through the Eureka server.

The example creates two applications, a caller and a callee. Both applications communicate among each other using the Eureka Server for Spring component. The callee application exposes an endpoint that is called by the caller application.

1. Create the callee application. Enable the Eureka client in your Spring Boot application by adding the `@EnableDiscoveryClient` annotation to your main class.

   ```java
   @SpringBootApplication
   @EnableDiscoveryClient
   public class CalleeApplication {
     public static void main(String[] args) {
       SpringApplication.run(CalleeApplication.class, args);
     }
   }
   ````

1. Create an endpoint in the callee application that is called by the caller application.

   ```java
   @RestController
   public class CalleeController {

       @GetMapping("/call")
       public String calledByCaller() {
           return "Hello from Application callee!";
       }
   }
   ```

1. Set the callee application's name in the application configuration file - for example, in **application.yml**.

   ```yaml
   spring.application.name=callee
   ```

1. Create the caller application.

   Add the `@EnableDiscoveryClient` annotation to enable Eureka client functionality. Also, create a `WebClient.Builder` bean with the `@LoadBalanced` annotation to perform load-balanced calls to other services.

   ```java
   @SpringBootApplication
   @EnableDiscoveryClient
   public class CallerApplication {
     public static void main(String[] args) {
       SpringApplication.run(CallerApplication.class, args);
     }

     @Bean
     @LoadBalanced
     public WebClient.Builder loadBalancedWebClientBuilder() {
       return WebClient.builder();
     }
   }
   ```

1. Create a controller in the caller application that uses the `WebClient.Builder` to call the callee application using its application name, callee.

   ```java
   @RestController
   public class CallerController {
       @Autowired
       private WebClient.Builder webClientBuilder;

       @GetMapping("/call-callee")
       public Mono<String> callCallee() {
           return webClientBuilder.build()
               .get()
               .uri("http://callee/call")
               .retrieve()
               .bodyToMono(String.class);
       }
   }
   ```

Now you have a caller and callee application that communicate with each other using Eureka Server for Spring Java components. Make sure both applications are running and bind with the Eureka server before testing the `/call-callee` endpoint in the caller application.

## Limitations

The Eureka Server Java component comes with a default configuration, `eureka.server.enable-self-preservation`, set to `false`. This default configuration helps avoid times when instances aren't deleted after self-preservation is enabled. If instances are deleted too early, some requests might be directed to nonexistent instances. If you want to change this setting to `true`, you can overwrite it by setting your own configurations in the Java component.

## Next steps

> [!div class="nextstepaction"]
> [Create a highly available Eureka server component cluster in Azure Container Apps](java-eureka-server-highly-available.md)

## Related content

[Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
