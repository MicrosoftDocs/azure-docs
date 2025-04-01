---
title: Migrate Spring Cloud Gateway for Tanzu to Managed Gateway for Spring in Azure Container Apps
description: Describes how to migrate Spring Cloud Gateway for Tanzu to managed Gateway for Spring in Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Spring Cloud Gateway for Tanzu to self-hosted gateway application in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to migrate Spring Cloud Gateway for Tanzu in Azure Spring Apps Enterprise plan to self-hosted Open Source (OSS) Spring Cloud Gateway running as an Azure Container Apps application.

The OSS version of Spring Cloud Gateway mentioned in this page is provided as an example for reference. Users can choose other distributions of Spring Cloud Gateway based on their requirements.

Note that the features offered by Spring Cloud Gateway for Tanzu are more extensive than those in the OSS version, so it is essential to verify the differences and ensure compatibility before moving to production.

## Prerequisites

- An Azure Spring Apps Enterprise plan instance with Spring Cloud Gateway enabled.
- An Azure Container Apps. For more information, see [Quickstart: Deploy your first container app using the Azure portal](/azure/container-apps/quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli).
- An Azure Container Registry with sufficient permissions to build and push Docker images, see [Create A Container Registry](/azure/container-registry/container-registry-get-started-azure-cli#create-a-container-registry)

## Prepare the code of self-hosted Spring Cloud Gateway application

To get the code of the Spring Cloud Gateway:
1. Navigate to https://start.spring.io.
1. Update the project metadata by setting the `Group` to your orgnization's name. Change the `Artifact` and `Name` to `gateway`.
1. Add dependencies `Reactive Gateway` and `Spring Boot Actuator`.
1. Leave the other properties at their default values.
1. Click `Generate` to download the project.

Extract the project when it's downloaded.

## Configure the Spring Cloud Gateway
Once the Spring Cloud Gateway code is ready, navigate to the `gateway/src/main/resources` directory of the project. Rename the `application.properties` file with `application.yml`. You can migrate from Spring Cloud Gateway for Tanzu by configuring the `application.yml`.

The example of `application.yml` is like:

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

To migrate the Cross-Origin Resource Sharing (CORS) configuration of Spring Cloud Gateway for Tanzu, you can refer to [CORS Configuration for Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#cors-configuration) for global CORS configuration and route CORS configuration.

### Scale
When migrating to Spring Cloud Gateway application in Azure Container Apps, the scaling behavior should align with Azure Container Apps' model. The instance count from Spring Cloud Gateway for Tanzu maps to `min-replica` and `max-replica` in Azure Container Apps. You can configure automatic scaling for the gateway application by defining scaling rules. For more details, refer to [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app).

The CPU and memory combinations available in Azure Spring Apps differs from those in Azure Container Apps. When mapping resource allocations, ensure that the selected CPU and memory configurations in Azure Container Apps fit both performance needs and supported options.

### Custom domain & certificates
Azure Container Apps supports custom domains and certificates, you can refer to [Domains & certificates](/azure/container-apps/certificates-overview) to migrate custom domains configured on Spring Cloud Gateway for Tanzu.

### Routes

You can migrate the routes in Spring Cloud Gatewy for Tanzu to Spring Cloud Gateway as the example of `application.yml` shows. The following list describes the mapping relationship between routes of Spring Cloud Gateway for Tanzu and routes of Spring Cloud Gateway:

- The `name` of the route is mapped to `id`.
- The `appName` and `protocol` are mapped to the URI of the route, which should be the accessible URI for the Azure Container Apps instance, make sure that the Azure Container Apps applications enable the ingress.
- Predicates and filters of Spring Cloud Gateway for Tanzu are mapped to that of Spring Cloud Gateway. Commercial predicates and filters are not supported, refer to [the document](https://techdocs.broadcom.com/us/en/vmware-tanzu/spring/spring-cloud-gateway-for-kubernetes/2-2/scg-k8s/developer-filters.html) for more details.

For example, consider the following route config JSON file, `test-api.json`, which defines the `test-api` route in Spring Cloud Gateway for Tanzu for the `test` app:

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

Then, the following yaml shows the corresponding route configuration for Spring Cloud Gateway:

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

Spring Cloud Gateway for Tanzu sets `StripPrefix=1` by default on every route. To migrate to Spring Cloud Gateway, you need to explicitly set `StripPrefix=1` in the filter configuration.

To allow your Spring Cloud Gateway application to access other applications through the app name, you need to enable ingress for your Azure Container App applications. You can also use for the accessible FQDN of Azure Container Apps application as the uri of the route, following the format: `https://<app-name>.<container-app-env-name>.<region>.azurecontainerapps.io`.

There are some [commercial predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-predicates.html) and [commercial filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-filters.html) that aren't supported on Spring Cloud Gateway.

### Response cache

If you enable the response cache globally in Spring Cloud Gateway for Tanzu, use the following configuration in Spring Cloud Gateway and see [local cache response global filter](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#local-cache-response-global-filter) for more details:
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

If you enable the response cache for the route, you can use the [`LocalResponseCache`](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#local-cache-response-filter) filter in the routing rule configuration of managed Gateway for Spring as the following YAML:

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

To enable application performance monitoring (APM) for Spring Cloud Gateway application, refer to [Integrate application performance monitoring into container images](./migrate-to-azure-container-apps-build-application-performance-monitoring.md).

## Deploy to Azure Continer Apps

Once the Spring Cloud Gateway configuration is ready, build the image using Azure Container Registry and deploy it to Azure Container Apps.

### Build and Push the Docker Image

In the Spring Cloud Gateway project directory, create a `Dockerfile` with the following contents:

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

Alternatively, you can refer to the sample [Dockerfile](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/resources/gateway/gateway/Dockerfile) for guidance.

Run the following command to build the image of gateway using your Azure Container Registry:

```azurecli
az acr login --name <azure-container-registry-name>
az acr build --image gateway:acrbuild-spring-cloud-gateway-0.0.1-SNAPSHOT --registry <azure-container-registry-name> --file Dockerfile . --resource-group <resource-group-name>
```

Ensure the gateway image is created and get the image tag, which follows the format: `<azure-container-registry-name>.azurecr.io/gateway:acrbuild-spring-cloud-gateway-0.0.1-SNAPSHOT`.

### Deploy the image in Azure Container Apps

Once your gateway application image is ready, deploy it as an Azure Container Apps application `gateway`. Replace the <container-image-of-gateway> with the image tag retrieved in the previous step:

```azurecli
az containerapp up \
    --name gateway \
    --resource-group <resource-group-name> \
    --environment <azure-container-app-environment-name> \
    --image <container-image-of-gateway> \
    --target-port 8080 \
    --ingress external
```

Access the FQDN of the Spring Cloud Gateway application to verify that it is running.

## Troubleshooting

If you encounter issues when running the Spring Cloud Gateway application, you can view real time and historical logs of the application `gateway` in Azure Container Apps following [Application Logging in Azure Container Apps](/azure/container-apps/logging).

To monitor gateway application's metrics, refer to [Monitor Azure Container Apps metrics](/azure/container-apps/metrics)

## Known limitation
As far as we know, Spring Cloud Gateway does not support the following commercial features:
- Metadata used to generate OpenAPI documentation
- Single sign-on (SSO) functionality

If these features are required, you may need to consider other commercial solutions, such as Spring Cloud Gateway for Tanzu.