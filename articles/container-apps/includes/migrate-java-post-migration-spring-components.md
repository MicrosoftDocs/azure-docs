---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

#### Service discovery and load balancing

Enable your application to work with the Spring Cloud Registry component so other deployed Spring applications and clients can dynamically discover it. For more information, see [Configure settings for the Eureka Server for Spring component in Azure Container Apps](../java-eureka-server.md).

Then, modify any application clients to use the Spring Client Load Balancer. When you use the Spring Client Load Balancer, the client gets addresses for all running instances of the application and finds one that works if another becomes corrupted or unresponsive. For more information, see [Spring Tips: Spring Cloud Load Balancer](https://spring.io/blog/2020/03/25/spring-tips-spring-cloud-loadbalancer) in the Spring Blog.

#### API gateway

Consider adding a [Spring Cloud Gateway](https://cloud.spring.io/spring-cloud-gateway/reference/html/) instance. Spring Cloud Gateway provides a single endpoint for all applications deployed in your Azure Container Apps environment. If you already deployed a Spring Cloud Gateway, ensure that you configured a routing rule to route traffic to your newly deployed application.

#### Centralized configuration

Consider adding a Spring Cloud Config Server to centrally manage and version-control configuration for all your Spring Cloud applications. First, create a Git repository to house the configuration and configure the app instance to use it. For more information, see [Configure settings for the Config Server for Spring component in Azure Container Apps](../java-config-server.md).

Migrate your configuration by using the following steps:

1. Inside the application's *src/main/resources* directory, create a *bootstrap.yml* file with the following contents:

    ```yml
    spring:
      application:
        name: <your-application-name>
    ```

1. In the configuration Git repository, create a *\<your-application-name\>.yml* file, where `your-application-name` is the same as in the preceding step. Move the settings from the *application.yml* file in *src/main/resources* to the new file you created. If the settings were previously in a *.properties* file, convert them to YAML first. You can find online tools or IntelliJ plugins to accomplish this conversion.

1. Create an *application.yml* file in the directory you created. Use this file to define settings and resources shared among all applications in the Azure Container Apps environment, such as data sources, logging settings, and Spring Boot Actuator configuration.

1. Commit and push these changes to the Git repository.

1. Remove the *application.properties* or *application.yml* file from the application.

#### Administration

Consider adding the Admin for Spring managed component to enable an administrative interface for Spring Boot web applications that expose actuator endpoints. For more information, see [Configure the Spring Boot Admin component in Azure Container Apps](../java-admin.md).
