---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load testing service built for Microsoft Azure that enables developers to generate high-scale loads to optimize app performance.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 10/05/2021
adobe-target: true
---

# What is Azure Load Testing?

Azure Load Testing is a fully managed load testing service built for Microsoft Azure that enables developers to generate high-scale loads to optimize app performance. You can use it to load test your application web endpoints, whatever language or framework you implement them with.

Azure Load Testing integrates with Azure Monitor to give you detailed performance metrics for your Azure application components. This integration allows you to identify which part of your application is a performance bottleneck. For example, is your shopping basket api slowed down by the database or should add more compute resources to the web server?

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How does Azure Load Testing work?

You can create a load test directly from the Azure portal or enable continuous regression testing in your Continuous Integration/Continuous Deployment (CI/CD) pipeline. Azure Load Testing has built-in support for creating a load test using an Apache JMeter script.

Auto-abort sensors to identify throttling 

Incorporates Azure networking best practices to avoid tests being mistaken for security risk (DOS attack)


<!-- schematic overview of Load Testing service components comes here -->

## Use high-scale loads to identify performance bottlenecks

Performance bottlenecks often remain undetected until the application is under high load. Using a load test you can simulate a large number of *virtual users* simultaneously accessing the application. Azure Load Testing's test engines abstract the required infrastructure for running a high-scale, geo-distributed load test.

To specify the test scenario, you define a *test plan*, which lists the web requests to be called. For a JMeter test, you can use an Apache JMeter script to create the test plan in Azure Load Testing.

Applications usually consist of multiple application components. For example, an application service, relational database, storage, and so on. You can select the Azure services that will be monitored during the load test execution. Azure Load Testing integrates with Azure Monitor to track the performance metrics of each service.

## Enable continuous regression testing early in the development lifecycle

You can integrate Azure Load Testing in your Continuous Integration/Continuous Deployment (CI/CD) pipeline. With each application build you can run a load test, compare the results against a baseline, and identify performance regressions early.

You can run an Azure Load Testing load test from Azure Pipelines or GitHub Actions workflows.

(set pass/fail criteria for load tests)

## Analyze test results for insights

During and after the execution of a load test, Azure Load Testing provides you test and application metrics in a single dashboard. You can also download the results to create your own reports. 

The test results consist of *client-side* and *server-side* metrics:

- Client-side metrics give you details about the load test engine. For example, the number of virtual users, the request response time, or the number of requests per second. The client-side metrics can help you determine the scale limits of your application.

- Server-side metrics provide you information about your application. Azure Load Testing integrates with Azure Monitor to capture details from your Azure application services. Depending on the type of service, you can view different metrics. For example, for a database you have the number of reads or writes and for a web site you view statistics of each type of HTTP request. The server-side metrics can give you insights about how load affects the different parts of your application.

## Next steps

Start using Azure Load Testing:
- [Tutorial: Run a load test in the Azure portal to identify performance bottlenecks](./tutorial-identify-bottlenecks-in-azure-portal.md)
- [Run a load test in Visual Studio Code to identify performance bottlenecks](./how-to-identify-bottlenecks-in-vs-code.md)
