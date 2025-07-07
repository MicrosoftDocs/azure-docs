---
title: Migrate Spring Cloud Gateway for VMWare Tanzu to the Managed Gateway for Spring in Azure Container Apps
description: Describes how to migrate Spring Cloud Gateway for VMWare Tanzu to the managed Gateway for Spring in Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 04/14/2025
ms.custom: devx-track-java
---

# Migrate Spring Cloud Gateway for VMWare Tanzu to a self-hosted gateway application in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to migrate a Spring Cloud Gateway for VMWare Tanzu project running on the Azure Spring Apps Enterprise plan to a self-hosted, open source software (OSS) Spring Cloud Gateway project running as an Azure Container Apps application.

The OSS version of Spring Cloud Gateway mentioned in this page is provided as an example for reference. You can choose other distributions of Spring Cloud Gateway based on your requirements.

> [!NOTE]
> The features offered by Spring Cloud Gateway for VMWare Tanzu are more extensive than the features in the OSS version. Be sure to examine the differences and ensure compatibility before moving to production.

## Prerequisites

- An Azure Spring Apps Enterprise plan instance with Spring Cloud Gateway enabled.
- An Azure Container Apps instance. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli)
- An Azure Container Registry instance with sufficient permissions to build and push Docker images. For more information, see [Quickstart: Create a private container registry using the Azure CLI](/azure/container-registry/container-registry-get-started-azure-cli).

## Prepare the code of the self-hosted Spring Cloud Gateway application

To get the code of the Spring Cloud Gateway application, use the following steps:

1. Navigate to https://start.spring.io.
1. Update the project metadata by setting the **Group** field to your organization's name. Change the **Artifact** and **Name** fields to **gateway**.
1. Add the **Reactive Gateway** and **Spring Boot Actuator** dependencies.
1. Leave the other properties at their default values.
1. Select **Generate** to download the project.
1. After the project downloads, extract it.

## Configure the Spring Cloud Gateway application

Now that you downloaded the Spring Cloud Gateway application, you configure it in the next sections.

### Configure the application properties file

To configure the application properties file, use the following steps:

1. Navigate to the **gateway/src/main/resources** directory of the project.
1. Rename the **application.properties** file to **application.yml**.
1. Edit the **application.yml** file. The following **application.yml** file is typical:

    ```yaml
    spring:
      application:
        name: gateway
      cloud:
        gateway:
          globalcors:
            corsConfigurations:
              '[/**]':
                allowedOriginPatterns: "*"
                allowedMethods:
                - GET
                - POST
                - PUT
                - DELETE
                allowedHeaders:
                - "*"
                allowCredentials: true
                maxAge: 3600
          routes:
          - id: front
            uri: http://front-app
            predicates:
            - Path=/**
            - Method=GET
            order: 1000
            filters:
            - StripPrefix=0
            tags:
            - front
    ```

### CORS configuration

To migrate the Cross-Origin Resource Sharing (CORS) configuration of your Spring Cloud Gateway for VMWare Tanzu project, see [CORS Configuration](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#cors-configuration) for global CORS configuration and route CORS configuration.

### Scale

When you migrate to a Spring Cloud Gateway application in Azure Container Apps, the scaling behavior should align with the Azure Container Apps model. The instance count from Spring Cloud Gateway for VMWare Tanzu maps to `min-replica` and `max-replica` in Azure Container Apps. You can configure automatic scaling for the gateway application by defining scaling rules. For more information, see [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app).

The CPU and memory combinations available in Azure Spring Apps differ from the combinations available in Azure Container Apps. When mapping resource allocations, ensure that the selected CPU and memory configurations in Azure Container Apps fit both your performance needs and the supported options.

### Custom domains & certificates

Azure Container Apps supports custom domains and certificates. For more information on migrating custom domains configured on Spring Cloud Gateway for VMWare Tanzu, see [Certificates in Azure Container Apps](/azure/container-apps/certificates-overview).

### Routes

You can migrate the routes in Spring Cloud Gateway for Tanzu to Spring Cloud Gateway, as the **application.yml** example shows. The following list describes the mapping relationship between the routes of Spring Cloud Gateway for VMWare Tanzu and the routes of Spring Cloud Gateway:

- The `name` property of the route is mapped to `id`.
- The `appName` and `protocol` properties are mapped to the URI of the route, which should be the accessible URI for the Azure Container Apps instance. Make sure the Azure Container Apps applications enable the ingress.
- Predicates and filters of Spring Cloud Gateway for VMWare Tanzu are mapped to predicates and filters of Spring Cloud Gateway. Commercial predicates and filters aren't supported. For more information, see [Commercial route filters in Spring Cloud Gateway for K8s](https://techdocs.broadcom.com/us/en/vmware-tanzu/spring/spring-cloud-gateway-for-kubernetes/2-2/scg-k8s/developer-filters.html).

As an example, consider the following route config JSON file, **test-api.json**, which defines the `test-api` route in Spring Cloud Gateway for VMWare Tanzu for the `test` app:

```json
{
  "protocol": "HTTP",
  "routes": [
    {
      "title": "Test API",
      "predicates": [
        "Path=/test/api/healthcheck",
        "Method=GET"
      ],
      "filters": [
        "AddRequestHeader=X-Request-red, blue"
      ]
    }
  ]
}
```

Then, the following YAML file shows the corresponding route configuration for the Spring Cloud Gateway application:

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: test-api
        uri: http://test
        predicates:
        - Path=/test/api/healthcheck
        - Method=GET
        filters:
        - AddRequestHeader=X-Request-red, blue
        - StripPrefix=1
```

Spring Cloud Gateway for VMWare Tanzu sets `StripPrefix=1` by default on every route. To migrate to Spring Cloud Gateway, you need to explicitly set `StripPrefix=1` in the filter configuration.

To enable your Spring Cloud Gateway application to access other applications through the app name, you need to enable ingress for your Azure Container App applications. You can also set the accessible fully qualified domain name (FQDN) of the Azure Container Apps application to be the URI of the route, following the format `https://<app-name>.<container-app-env-name>.<region>.azurecontainerapps.io`.

> [!NOTE]
> There are some [commercial predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-predicates.html) and [commercial filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-filters.html) that aren't supported on Spring Cloud Gateway.

### Response cache

If you enable the response cache globally in Spring Cloud Gateway for VMWare Tanzu, use the following configuration in Spring Cloud Gateway. For more information, see [The Local Response Cache Filter](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#local-cache-response-global-filter).

```yaml
spring:
  cloud:
    gateway:
      filter:
        local-response-cache:
          enabled: true
          time-to-live: <response-cache-ttl>
          size: <response-cache-size>
```

If you enable the response cache for the route, you can use the [`LocalResponseCache`](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#local-cache-response-filter) filter in the routing rule configuration of the managed Gateway for Spring by using the following example:

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: test-api
        uri: http://test
        predicates:
        - Path=/resource
        filters:
        - LocalResponseCache=30m,500MB
```

### Integrate with APM

You can enable application performance monitoring (APM) for your Spring Cloud Gateway application. For more information, see [Integrate application performance monitoring into container images](migrate-to-azure-container-apps-build-application-performance-monitoring.md).

## Deploy to Azure Container Apps

After the Spring Cloud Gateway configuration is ready, build the image using Azure Container Registry and deploy it to Azure Container Apps.

### Build and push the Docker image

To build and push the Docker image, use the following steps:

1. In the Spring Cloud Gateway project directory, create a **Dockerfile** with the following contents:

    > [!NOTE]
    > Alternatively, use the [ACME Fitness Store sample Dockerfile](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/resources/gateway/gateway/Dockerfile).

    ```dockerfile
    FROM mcr.microsoft.com/openjdk/jdk:17-mariner as build
    WORKDIR /staging
    # Install gradle
    RUN tdnf install -y wget unzip

    RUN wget https://services.gradle.org/distributions/gradle-8.8-bin.zip && \
        unzip -d /opt/gradle gradle-8.8-bin.zip && \
        chmod +x /opt/gradle/gradle-8.8/bin/gradle

    ENV GRADLE_HOME=/opt/gradle/gradle-8.8
    ENV PATH=$PATH:$GRADLE_HOME/bin

    COPY . .

    # Compile with gradle
    RUN gradle build -x test

    FROM mcr.microsoft.com/openjdk/jdk:17-mariner as runtime

    WORKDIR /app

    COPY --from=build /staging/build/libs/gateway-0.0.1-SNAPSHOT.jar .

    ENTRYPOINT ["java", "-jar", "gateway-0.0.1-SNAPSHOT.jar"]
    ```

1. Use the following commands to build the image of the gateway:

    ```azurecli
    az acr login --name <azure-container-registry-name>
    az acr build \
        --resource-group <resource-group-name> \
        --image gateway:acrbuild-spring-cloud-gateway-0.0.1-SNAPSHOT \
        --registry <azure-container-registry-name> \
        --file Dockerfile .
    ```

1. Ensure that the gateway image is created, and get the image tag, which uses the following format: `<azure-container-registry-name>.azurecr.io/gateway:acrbuild-spring-cloud-gateway-0.0.1-SNAPSHOT`.

### Deploy the image in Azure Container Apps

After your gateway application image is ready, deploy it as an Azure Container Apps application by using the following command. Replace the `<container-image-of-gateway>` placeholder with the image tag retrieved in the previous step.

```azurecli
az containerapp up \
    --resource-group <resource-group-name> \
    --name gateway \
    --environment <azure-container-app-environment-name> \
    --image <container-image-of-gateway> \
    --target-port 8080 \
    --ingress external
```

Access the FQDN of the Spring Cloud Gateway application to verify that it's running.

## Troubleshooting

If you encounter issues when running the Spring Cloud Gateway application, you can view real-time and historical logs of the `gateway` application in Azure Container Apps. For more information, see [Application Logging in Azure Container Apps](/azure/container-apps/logging).

You can also monitor a gateway application's metrics. For more information, see [Monitor Azure Container Apps metrics](/azure/container-apps/metrics).

## Known limitation

The OSS Spring Cloud Gateway doesn't natively support the following commercial features:

- Metadata used to generate OpenAPI documentation.
- Single sign-on (SSO) functionality.

If you require these features, you might need to consider other commercial solutions, such as Spring Cloud Gateway for VMWare Tanzu.
