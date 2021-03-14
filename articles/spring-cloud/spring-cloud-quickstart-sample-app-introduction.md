---
title:  "Quickstart - Introduction to the sample app - Azure Spring Cloud"
description: Describes the sample app used in this series of quickstarts for deployment to Azure Spring Cloud.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 09/08/2020
ms.custom: devx-track-java
zone_pivot_groups: programming-languages-spring-cloud
---

# Introduction to the sample app

::: zone pivot="programming-language-csharp"
This series of quickstarts uses a sample app composed of two microservices to show how to deploy a .NET Core Steeltoe app to the Azure Spring Cloud service. You'll use Azure Spring Cloud capabilities such as service discovery, config server, logs, metrics, and distributed tracing.

## Functional services

The sample app is composed of two microservices:

* The `planet-weather-provider` service returns weather text in response to an HTTP request that specifies the planet name. For example, it may return "very warm" for planet Mercury. It gets the weather data from the Config server. The Config server gets the weather data from a YAML file in a Git repository, for example:

  ```yaml
  MercuryWeather: very warm
  VenusWeather: quite unpleasant
  MarsWeather: very cool
  SaturnWeather: a little bit sandy
  ```

* The `solar-system-weather` service returns data for four planets in response to an HTTP request. It gets the data by making four HTTP requests to `planet-weather-provider`. It uses the Eureka server discovery service to call `planet-weather-provider`. It returns JSON, for example:

  ```json
  [{
      "Key": "Mercury",
      "Value": "very warm"
  }, {
      "Key": "Venus",
      "Value": "quite unpleasant"
  }, {
      "Key": "Mars",
      "Value": "very cool"
  }, {
      "Key": "Saturn",
      "Value": "a little bit sandy"
  }]
  ```

The following diagram illustrates the sample app architecture:

:::image type="content" source="media/spring-cloud-quickstart-sample-app-introduction/sample-app-diagram.png" alt-text="Sample app diagram":::

## Code repository

The sample app is located in the [steeltoe-sample](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/steeltoe-sample) folder of the Azure-Samples/Azure-Spring-Cloud-Samples repository on GitHub.

The instructions in the following quickstarts refer to the source code as needed.

::: zone-end

::: zone pivot="programming-language-java"
In this quickstart, we use a personal finances sample called PiggyMetrics to show you how to deploy an app to the Azure Spring Cloud service. PiggyMetrics demonstrates the microservice architecture pattern and highlights the services breakdown. You will see how it is deployed to Azure with powerful Azure Spring Cloud capabilities including service discovery, config server, logs, metrics, and distributed tracing.

To follow the Azure Spring Cloud deployment examples, you only need the location of the source code, which is provided as needed.

## Functional services

PiggyMetrics is decomposed into three core microservices. All of them are independently deployable applications organized by business domains.

* **Account service (To be deployed)**: Contains general user input logic and validation: incomes/expenses items, savings, and account settings.
* **Statistics service (Not used in this quickstart)**: Performs calculations on major statistics parameters and captures time series for each account. Datapoint contains values, normalized to base currency and time period. This data is used to track cash flow dynamics in account lifetime.
* **Notification service (Not used in this quickstart)**: Stores users contact information and notification settings, such as remind and backup frequency. Scheduled worker collects required information from other services and sends e-mail messages to subscribed customers.

## Infrastructure services

There are several common patterns in distributed systems that help make core services work. Azure Spring cloud provides powerful tools that enhance Spring Boot applications behavior to implement those patterns: 

* **Config service (Hosted by Azure Spring Cloud)**: Azure Spring Cloud Config is a horizontally scalable centralized configuration service for distributed systems. It uses a pluggable repository that currently supports local storage, Git, and Subversion.
* **Service discovery (Hosted by Azure Spring Cloud)**: It allows automatic detection of network locations for service instances, which could have dynamically assigned addresses because of autoscaling, failures and upgrades.
* **Auth service (To be deployed)** Authorization responsibilities are completely extracted to a separate server, which grants OAuth2 tokens for the backend resource services. Auth Server does user authorization and secure machine-to-machine communication inside a perimeter.
* **API Gateway (To be deployed)**: The three core services expose an external API to client. In real-world systems, the number of functions can grow very quickly with system complexity. Hundreds of services might be involved in rendering of one complex webpage. The API Gateway is a single entry point into the system, used to handle requests and route them to the appropriate backend service or to invoke multiple backend services, aggregating the results. 

## Sample usage of PiggyMetrics

For full implementation details, see [PiggyMetrics](https://github.com/Azure-Samples/piggymetrics). The samples reference the source code as needed.
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Provision Azure Spring Cloud instance](spring-cloud-quickstart-provision-service-instance.md)
