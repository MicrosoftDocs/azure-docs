---
title:  "App and deployment in Azure Spring Apps"
description: This topic explains the distinction between application and deployment in Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 07/23/2020
ms.custom: devx-track-java, event-tier1-build-2022
---

# App and deployment in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

*App* and *Deployment* are the two key concepts in the resource model of Azure Spring Apps. In Azure Spring Apps, an *App* is an abstraction of one business app. One version of code or binary deployed as the *App* runs in a *Deployment*. Apps run in an *Azure Spring Apps service instance*, or simply *service instance*, as shown next.

:::image type="content" source="./media/spring-cloud-app-and-deployment/app-deployment-rev.png" alt-text="Diagram showing the relationship between the apps and deployments." border="false":::

You can have multiple service instances within a single Azure subscription, but the Azure Spring Apps Service is easiest to use when all of the Apps that make up a business app reside within a single service instance. One reason is that the Apps are likely to communicate with each other. They can easily do that by using Eureka service registry in the service instance.

The Azure Spring Apps Standard plan allows one App to have one production deployment and one staging deployment, so that you can do blue/green deployment on it easily.

## App

The following features/properties are defined on App level.

| Features               | Description                                                                                                                            |
|:-----------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| Public</br>Endpoint    | The URL to access the app                                                                                                              |
| Custom</br>Domain      | CNAME record that secures the custom domain                                                                                            |
| Service</br>Binding    | Out of box connection with other Azure services                                                                                        |
| Managed</br>Identity   | Managed identity by Azure Active Directory allows your app to easily access other Azure AD-protected resources such as Azure Key Vault |
| Persistent</br>Storage | Setting that enables data to persist beyond app restart                                                                                |

## Deployment

The following features/properties are defined on Deployment level, and will be exchanged when swapping production/staging deployment.

| Features                  | Description                                                                |
|:--------------------------|:---------------------------------------------------------------------------|
| CPU                       | Number of vcores per App instance                                          |
| Memory                    | Gb of memory per App instance                                              |
| Instance</br>Count        | The number of app instances, set manually or automatically                 |
| Auto-Scale                | Scale instance count automatically based on predefined rules and schedules |
| JVM</br>Options           | Setting JVM options                                                        |
| Environment</br>Variables | Setting environment variables                                              |
| Runtime</br>Version       | Java 8/Java 11                                                             |

## Environment

Azure Spring Apps mounts some read-only YAML files to your deployed apps. These files contain the Azure context of a deployment. The following list shows the paths and contents of these YAML files:

- */etc/azure-spring-cloud/context/azure-spring-apps.yml*

  ```yaml
  AZURE_SPRING_APPS:
      SUBSCRIPTION_ID:  <your-azure-subscription-id>
      RESOURCE_GROUP: <your-resource-group-name>
      NAME: <your-azure-spring-apps-name>
  ```

- */etc/azure-spring-cloud/context/azure-spring-apps-deployment.yml*

   ```yaml
   AZURE_SPRING_APPS:
       APP:
          NAME: <your-app-name>
       DEPLOYMENT:
          NAME: <your-deployment-name>
          ACTIVE: true # true if the deployment is in production, false if in staging
   ```

If your app is a Spring Boot app, these two file paths are added to the `SPRING_CONFIG_ADDITIONAL_LOCATION` environment variable. This way, your app can load these properties as configurations and use them in your code. For example, you can use the `@ConfigurationProperties` annotation to bind the YAML properties to a Java class. The following code snippet shows how to create a `@Configuration` class that represents the Azure context:

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "azure-spring-apps")
@Data
public class AzureSpringAppsContext {

    private String subscriptionId;
    private String resourceGroup;
    private String name;

    private AppContext app;
    private DeploymentContext deployment;

    @Data
    public static class AppContext {
        private String name;
    }

    @Data
    public static class DeploymentContext {
        private String name;
        private boolean active;
    }
}
```

For any other polyglot apps, you may need to read and access corresponding properties by leveraging the corresponding file read/write libraries in your apps.

## Restrictions

- An app must have one production deployment. Deleting a production deployment is blocked by the API. You should swap a deployment to staging before deleting it.
- An app can have at most two deployments. Creating more than two deployments is blocked by the API. Deploy your new binary to either the existing production or staging deployment.
- Deployment management is not available in the Basic plan. Use the Standard or Enterprise plan for blue-green deployment capability.

## Next steps

- [Set up a staging environment in Azure Spring Apps](./how-to-staging-environment.md)
