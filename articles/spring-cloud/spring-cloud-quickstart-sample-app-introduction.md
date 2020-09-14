---
title:  "Quickstart - Introduction to Piggy Metrics sample app - Azure Spring Cloud"
description: Describes the Piggy Metrics sample app used in deployment Azure Spring Cloud.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Introduction to Piggy Metrics sample app

In this quickstart, we use a personal finances sample called Piggy Metrics to show you how to deploy an app to the Azure Spring Cloud service. Piggy Metrics demonstrates the microservice architecture pattern and highlights the services breakdown. You will see how it is deployed to Azure with powerful Azure Spring Cloud capabilities including service discovery, config server, logs, metrics, and distributed tracing.

To follow the Azure Spring Cloud deployment examples, you only need the location of the source code, which is provided as needed.

## Functional services
Piggy Metrics is decomposed into three core microservices. All of them are independently deployable applications organized by business domains.

* **Account service (To be deployed)**: Contains general user input logic and validation: incomes/expenses items, savings, and account settings.
* **Statistics service (Not used in this quickstart)**: Performs calculations on major statistics parameters and captures time series for each account. Datapoint contains values, normalized to base currency and time period. This data is used to track cash flow dynamics in account lifetime.
* **Notification service (Not used in this quickstart)**: Stores users contact information and notification settings, such as remind and backup frequency. Scheduled worker collects required information from other services and sends e-mail messages to subscribed customers.

## Infrastructure services
There are several common patterns in distributed systems that help make core services work. Azure Spring cloud provides powerful tools that enhance Spring Boot applications behavior to implement those patterns: 

* **Config service (Hosted by Azure Spring Cloud)**: Azure Spring Cloud Config is a horizontally scalable centralized configuration service for distributed systems. It uses a pluggable repository that currently supports local storage, Git, and Subversion.
* **Service discovery (Hosted by Azure Spring Cloud)**: It allows automatic detection of network locations for service instances, which could have dynamically assigned addresses because of autoscaling, failures and upgrades.
* **Auth service (To be deployed)** Authorization responsibilities are completely extracted to a separate server, which grants OAuth2 tokens for the backend resource services. Auth Server does user authorization and secure machine-to-machine communication inside a perimeter.
* **API Gateway (To be deployed)**: The three core services expose an external API to client. In real-world systems, the number of functions can grow very quickly with system complexity. Hundreds of services might be involved in rendering of one complex webpage. The API Gateway is a single entry point into the system, used to handle requests and route them to the appropriate backend service or to invoke multiple backend services, aggregating the results. 

## Sample usage of Piggy Metrics
For full implementation details, see [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics). The samples reference the source code as needed.

## Next steps
> [!div class="nextstepaction"]
> [Provision Azure Spring Cloud instance](spring-cloud-quickstart-provision-service-instance.md)
