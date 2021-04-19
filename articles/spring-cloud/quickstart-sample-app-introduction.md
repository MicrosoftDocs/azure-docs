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
In this quickstart, we use a business management sample called Pet Clinic to show you how to deploy an app to the Azure Spring Cloud service. Pet Clinic demonstrates the microservice architecture pattern and highlights the services breakdown. You will see how it is deployed to Azure with powerful Azure Spring Cloud capabilities including service discovery, config server, logs, metrics, and distributed tracing.

To follow the Azure Spring Cloud deployment examples, you only need the location of the source code, which is provided as needed.

## Functional services

Pet Clinic is decomposed into microservices. All of them are independently deployable applications organized by business domains.  For full implementation details, see [Deploy Spring Microservices using Azure Spring Cloud and MySQL](https://github.com/Azure-Samples/spring-petclinic-microservices#deploy-spring-microservices-using-azure-spring-cloud-and-mysql)). The following documentation references the source code as needed.
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Provision Azure Spring Cloud instance](spring-cloud-quickstart-provision-service-instance.md)
