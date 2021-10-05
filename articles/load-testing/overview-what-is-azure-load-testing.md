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

<!-- 2-3 minute video comes here -->

## How does Azure Load Testing work?

You can create a load test directly from the Azure portal or enable continuous regression testing in your Continuous Integration/Continuous Deployment (CI/CD) pipeline. Azure Load Testing has built-in support for creating a load test using an Apache JMeter script.

<!-- schematic overview of Load Testing service components comes here -->

## Use high-scale loads to identify performance bottlenecks

Performance bottlenecks often remain undetected until the application is under high load. Using a load test you can simulate a large number of *virtual users* simultaneously accessing the application. Azure Load Testing's test engines abstract the required infrastructure for running a high-scale, geo-distributed load test.

To specify the test scenario, you define a *test plan*, which lists the web requests to be called. For a JMeter test, you can use an Apache JMeter script to create the test plan in Azure Load Testing.

Applications usually consist of multiple application components. For example, an application service, relational database, storage, and so on. You can select the Azure services that will be monitored during the load test execution. Azure Load Testing integrates with Azure Monitor to track the performance metrics of each service.

## Enable continuous regression testing early in the development lifecycle

You can integrate Azure Load Testing in your Continuous Integration/Continuous Deployment (CI/CD) pipeline. This allows you to run a load test with each application build, compare the results against a baseline and identify performance regressions early.

You can run an Azure Load Testing load test from Azure Pipelines or GitHub Actions workflows.

## Analyze test results for insights


## Next steps

Start using Azure Load Testing:
- [Tutorial: Run a load test in the Azure portal to identify performance bottlenecks](./tutorial-identify-bottlenecks-in-azure-portal.md)
- [Run a load test in Visual Studio Code to identify performance bottlenecks](./how-to-identify-bottlenecks-in-vs-code.md)
