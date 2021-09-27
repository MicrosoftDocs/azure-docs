---
title:  "Quickstart - Introduction to the sample app - Azure Spring Cloud"
description: Describes the sample app used in this series of quickstarts for deployment to Azure Spring Cloud.
author: karlerickson
ms.author: karler
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
In this quickstart, we use the microservices version of the well-known sample app [PetClinic](https://github.com/spring-petclinic/spring-petclinic-microservices) that will show you how to deploy apps to the Azure Spring Cloud service. The **Pet Clinic** sample demonstrates the microservice architecture pattern and highlights the services breakdown. You will see how services are deployed to Azure with Azure Spring Cloud capabilities, including service discovery, config server, logs, metrics, distributed tracing, and developer-friendly tooling support.

To follow the Azure Spring Cloud deployment examples, you only need the location of the source code, which is provided as needed.

![Architecture of PetClinic](media/build-and-deploy/microservices-architecture-diagram.jpg)

## Functional services to be deployed

PetClinic is decomposed into 4 core microservices. All of them are independently deployable applications organized by business domains.

* **Customers service**: Contains general user input logic and validation including pets and owners information (Name, Address, City, Telephone).
* **Visits service**: Stores and shows visits information for each pets' comments.
* **Vets service**: Stores and shows Veterinarians' information, including names and specialties.
* **API Gateway**: The API Gateway is a single entry point into the system, used to handle requests and route them to an appropriate service or to invoke multiple services, and aggregate the results.  The three core services expose an external API to client. In real-world systems, the number of functions can grow very quickly with system complexity. Hundreds of services might be involved in rendering of one complex webpage.

## Infrastructure services hosted by Azure Spring Cloud

There are several common patterns in distributed systems that support core services. Azure Spring cloud provides tools that enhance Spring Boot applications to implement the following patterns:

* **Config service**: Azure Spring Cloud Config is a horizontally scalable centralized configuration service for distributed systems. It uses a pluggable repository that currently supports local storage, Git, and Subversion.
* **Service discovery**: It allows automatic detection of network locations for service instances, which could have dynamically assigned addresses because of autoscaling, failures, and upgrades.

## Database configuration

In its default configuration, **Pet Clinic** uses an in-memory database (HSQLDB) which is populated at startup with data. A similar setup is provided for MySql if a persistent database configuration is needed. Dependency for Connector/J, the MySQL JDBC driver, is already included in the pom.xml files.

## Sample usage of PetClinic

For full implementation details, see our fork of [PetClinic](https://github.com/Azure-Samples/spring-petclinic-microservices). The samples reference the source code as needed.

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Provision Azure Spring Cloud instance](./quickstart-provision-service-instance.md)
