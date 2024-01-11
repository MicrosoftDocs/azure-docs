---
title: Overview of Azure Fluid Relay architecture
description: Overview of Azure Fluid Relay Architecture
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/build/overview/
---

# Overview of Azure Fluid Relay architecture

There are three primary concepts to understand when building an application with Fluid.

- Service
- Container
- Shared objects

## Service

Fluid clients require a centralized service that all connected clients use to send and receive operations. When using Fluid in an application, you must use the correct package that corresponds to the underlying service you're connecting to.

For the Azure Fluid Relay service, this package is **@fluidframework/azure-client**. This package helps create and load Fluid containers hosted on Azure via Azure Fluid Relay.

## Container

The **container** is the primary unit of encapsulation in Fluid. It consists of a collection of shared objects and supporting APIs to manage the lifecycle of the container and the objects within it.

Creating new containers is a client-driven action and container lifetimes are bound to the data stored on the supporting server. When getting existing containers, it's important to consider the previous state of the container.

For more about containers, see [Containers](https://fluidframework.com/docs/build/containers/) on fluidframework.com.

## Shared objects

A **shared object** is an object type that powers collaborative data by exposing a specific API. Many shared objects can exist within the context of a container and they can be created either statically or dynamically. **Distributed Data Structures(DDSes)** and **DataObjects** are both types of shared objects.

For more information, see [Data modeling](https://fluidframework.com/docs/build/data-modeling/) on fluidframework.com.

## Package structure

There are two primary **packages** you'll use when building with Fluid. The **fluid-framework** package and a service-specific client package like **azure-client**.

For more information, see [Packages](https://fluidframework.com/docs/build/packages/) on fluidframework.com.

### The fluid-framework package

The **fluid-framework** package is a collection of core Fluid APIs that make it easy to build and use applications. This package contains all the common type definitions as well as all the primitive shared objects.

### The @fluidframework/azure-client package

The **@fluidframework/azure-client** package provides an API for connecting to Azure Fluid Relay service instances to create and load Fluid containers. See [How to: Connect to an Azure Fluid Relay service](../how-tos/connect-fluid-azure-service.md) for more information about how to use this API.
