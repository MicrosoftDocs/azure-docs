---
title:  "Quickstart - Introduction to Piggymetrics sample app"
description: Describes the sample app used in deployment Azure Spring Cloud.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Quickstart - Introduction to Piggymetrics sample app

Piggymetrics is a sample application that is used in examples that illustrate deployment to Azure Spring Cloud.  This proof-of-concept application is simple way to deal with personal finances.  It demonstrates Microservice Architecture Pattern using Spring Boot, Spring Cloud and Docker. It includes a nice user interface.  To follow the Azure Spring Cloud deployment examples, you only need the location of the source code, which is provided as needed.

## Functional services
PiggyMetrics was decomposed into three core microservices. All of them are independently deployable applications, organized around certain business domains.

* **Account service**: Contains general user input logic and validation: incomes/expenses items, savings and account settings.
* **Statistics service**: Performs calculations on major statistics parameters and captures time series for each account. Datapoint contains values, normalized to base currency and time period. This data is used to track cash flow dynamics in account lifetime.
* **Notification service**: Stores users contact information and notification settings (like remind and backup frequency). Scheduled worker collects required information from other services and sends e-mail messages to subscribed customers.

## Infrastructure services
There are several common patterns in distributed systems that help make core services work. Spring cloud provides powerful tools that enhance Spring Boot applications behavior to implement those patterns. 

* **Config service**: Spring Cloud Config is horizontally scalable centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion.
* **Auth service** Authorization responsibilities are completely extracted to separate server, which grants OAuth2 tokens for the backend resource services. Auth Server is used for user authorization as well as for secure machine-to-machine communication inside a perimeter.
* **API Gateway**: The three core services expose external API to client. In real-world systems, this number can grow very quickly as well as whole system complexity. Hundreds of services might be involved in rendering of one complex webpage. The API Gateway is a single entry point into the system, used to handle requests by routing them to the appropriate backend service or by invoking multiple backend services and aggregating the results. 

## Sample usage of Piggymetrics
For the full implementation details, see [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics).  The samples reference the source code as needed.

## Next steps
* [Spring Cloud quickstart](spring-cloud-quickstart-launch-app-portal.md)


