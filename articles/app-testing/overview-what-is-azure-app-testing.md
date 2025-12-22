---
title: What is Azure App Testing?
description: 'Improve your app performance at scale. Run end-to-end Playwright tests, or run automated load tests on the cloud using JMeter or Locust scripts with Azure App Testing.'
ms.service: azure-app-testing
ms.topic: overview
ms.author: ninallam
author: ninallam
ms.date: 08/07/2025
adobe-target: true
---

# What is Azure App Testing?

Azure App Testing lets developers and QA teams run large-scale functional and performance tests to identify issues in their applications. Azure App Testing allows you to run functional tests with [Playwright Workspaces](playwright-workspaces\overview-what-is-microsoft-playwright-workspaces.md) and performance tests using [Azure Load Testing](load-testing\overview-what-is-azure-load-testing.md). Spend less time managing infrastructure and less effort harnessing AI-driven test automation to boost quality and innovation.

Azure Load Testing enables you to generate high-scale load and simulate traffic for your applications, regardless of where they're hosted. It supports running Apache JMeter-based tests or Locust-based tests. It also enables generating load from multiple regions and enables you to test private application endpoints. It provides detailed metrics and insights into the performance of your application under load, helping you identify bottlenecks and optimize performance.

Playwright Workspaces enables you to run end-to-end tests with high parallelization. It supports running tests in parallel across multiple browsers and devices, enabling you to validate the functionality and performance of your applications at scale. It also provides detailed test results and insights, helping you identify issues and optimize your tests.

The following diagram shows an overview of how Azure App Testing integrates these capabilities:

:::image type="content" source="media/overview-what-is-azure-app-testing/azure-app-testing-overview.png" lightbox="media/overview-what-is-azure-app-testing/azure-app-testing-overview.png" alt-text="Diagram that shows an overview of Azure App Testing.":::

## Usage scenarios

Azure App Testing is designed to help you with the following scenarios:

- **Load testing**: Generate high-scale loads to simulate real-world traffic and identify performance bottlenecks in your applications. You can run tests using JMeter or Locust scripts, or create URL-based tests.

- **End-to-end UI testing**: Run end-to-end tests with high parallelization using Playwright Workspaces. Validate the functionality and performance of your applications across multiple browsers and devices.

## Key features

Here are some of the key features of Azure App Testing:

### Azure Load Testing

- **High-scale load generation**: Generate load from multiple regions to simulate real-world traffic patterns and identify performance bottlenecks.

- **AI-powered test authoring and insights**: Easily create load tests using VS Code with GitHub Copilot Agent mode and get AI-driven insights in test results that detect issues and recommend fixes.

- **Support for JMeter and Locust**: Run tests using Apache JMeter or Locust scripts, enabling you to leverage existing test scripts and tools.

- **Private endpoint testing**: Test private application endpoints by securely connecting to your applications hosted in virtual networks or on-premises environments.

- **Detailed metrics and insights**: Get detailed metrics and insights into the performance of your application under load, helping you identify bottlenecks and optimize performance.

### Playwright Workspaces

- **High parallelization**: Run end-to-end tests in parallel across multiple browsers and devices, enabling you to speed up end-to-end validation of your applications.


- **Cross-browser and cross-device testing**: Validate your applications across different browsers and devices, ensuring consistent functionality and performance.

- **Seamless integration with CI/CD**: Integrate Playwright Workspaces with your existing CI/CD pipelines to automate end-to-end testing and ensure quality at every stage of development.

- **Security and access control**: Support for managed identities, private link access, and RBAC (role-based access control) ensures secure and controlled access to workspace resources.

## In-region data residency & data at rest

### Azure Load Testing

Azure Load Testing doesn't store or process customer data outside the region you deploy the service instance in.

### Playwright Workspaces

Playwright Workspaces doesn't store or process customer data outside the region you deploy the workspace in. When you use the regional affinity feature, the metadata is transferred from the cloud hosted browser region to the workspace region in a secure and compliant manner.

Playwright Workspaces automatically encrypts all data stored in your workspace with keys managed by Microsoft (service-managed keys). For example, this data includes workspace details, Playwright test run metadata like test start and end time, test minutes, who ran the test, and test results which are published to the service.

## Getting started

- [Run end-to-end tests with Playwright Workspaces](playwright-workspaces\quickstart-run-end-to-end-tests.md)
- [Create and run a load test](load-testing\quickstart-create-and-run-load-test.md)
