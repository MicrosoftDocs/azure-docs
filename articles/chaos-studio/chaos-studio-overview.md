---
title: What is Azure Chaos Studio?
description: Understand Azure Chaos Studio, an Azure service that helps you to measure, understand, and build application and service resilience to real world incidents using chaos engineering to inject faults against your service then monitor how the service responds to disruptions.
services: chaos-studio
author: johnkemnetz
ms.topic: overview
ms.date: 11/11/2021
ms.author: johnkem
ms.service: chaos-studio
ms.custom: template-overview,ignite-fall-2021
---

# What is Azure Chaos Studio Preview?

Azure Chaos Studio is a managed service for improving resilience by injecting faults into your Azure applications. Running controlled fault injection experiments against your applications, a practice known as chaos engineering, helps you to measure, understand, and improve resilience against real-world incidents, such as a region outages or application failures causing high CPU utilization on a VM.

> [!VIDEO https://aka.ms/docs/player?id=29017ee4-bdfa-491e-acfe-8876e93c505b]

## Why should I use Chaos Studio?

Whether you are developing a new application that will be hosted on Azure, migrating an existing application to Azure, or operating an application that already runs on Azure, it is important to validate and improve your application's resilience. Resilience is the capability of a system to handle and recover from disruptions. Disruptions in your application's availability can result in errors and failures for users, which in turn can have negative consequences on your business or mission.

When running an application in the cloud, avoiding these negative consequences requires you to validate that your application responds effectively to disruptions that could be caused by a service you depend on, disruptions caused by a failure in the service itself, or even disruptions to incident response tooling and processes. Chaos experimentation enables you to test that your cloud-hosted application is resilient to failures.

## When would I use Chaos Studio?

Chaos engineering can be used for a wide variety of resilience validation scenarios. These scenarios span the entire service development and operation lifecycle and can be categorized as either *shift right,* wherein the scenario is best validated in a production or pre-production environment, or *shift left,* wherein the scenario could be validated in a development environment or shared test environment. Typically shift right scenarios should be done with real customer traffic or simulated load whereas shift left scenarios can be done without any real customer traffic. Some common scenarios where chaos engineering can be applied are:
* Reproducing an incident that impacted your application to better understand the failure mode or ensure that post-incident repair items will prevent the incident from recurring.
* Running "game days" - load, scale, performance, and resilience validation of a service in preparation for a major user event or season.
* Performing business continuity / disaster recovery (BCDR) drills to ensure that if your application were impacted by a major disaster it could recover quickly and critical data is preserved.
* Running high availability drills to test application resilience against specific failures such as region outages, network configuration errors, high stress events, or noisy neighbor issues.
* Developing application performance benchmarks.
* Planning capacity needs for production environments.
* Running stress tests or load tests.
* Ensuring services migrated from an on-premises or other cloud environment remain resilient to known failures.
* Building confidence in services built on cloud-native architectures.
* Validating that live site tooling, observability data, and on-call processes work as expected under unexpected conditions.

For many of these scenarios, you first build resilience using ad-hoc chaos experiments then continuously validate that new deployments won't regress resilience using chaos experiments as a deployment gate in your CI/CD pipeline.

## How does Chaos Studio work?

Chaos Studio enables you to orchestrate fault injection on your Azure resources in a safe and controlled way. At the core of Chaos Studio is chaos experiment. A chaos experiment is an Azure resource that describes the faults that should be run and the resources those faults should be run against. Faults can be organized to run in parallel or sequentially, depending on your needs. Chaos Studio supports two types of faults - *service-direct* faults, which run directly against an Azure resource without any installation or instrumentation (for example, rebooting an Azure Cache for Redis cluster or adding network latency to AKS pods), and *agent-based* faults, which run in virtual machines or virtual machine scale sets to perform in-guest failures (for example, applying virtual memory pressure or killing a process). Each fault has specific parameters you can control, like which process to kill or how much memory pressure to generate.

When you build a chaos experiment, you define one or more *steps* that execute sequentially, each step containing one or more *branches* that run in parallel within the step, and each branch containing one or more *actions* such as injecting a fault or waiting for a certain duration. Finally, you organize the resources (*targets*) that each fault will be run against into groups called selectors so that you can easily reference a group of resources in each action.

![Diagram showing the layout of a chaos experiment.](images/chaos-experiment.png)

A chaos experiment is an Azure resource that lives in a subscription and resource group. You can use the Azure portal or the Chaos Studio REST API to create, update, start, cancel, and view the status of an experiment.

## Next steps
Get started creating and running chaos experiments to improve application resilience with Chaos Studio using the links below.
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Learn more about chaos engineering](chaos-studio-chaos-engineering-overview.md)
