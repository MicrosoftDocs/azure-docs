---
title: Azure Internet of Things (IoT) solution options
description: Guidance on choosing between a platform services or managed app platform approach to building an IoT solution. The platform service approach uses services such as IoT Hub and Digital Twins as building blocks. The managed app platform approach uses IoT Central to quickly get started.
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 02/05/2020
ms.author: dobett
---

# Choose the right IoT solution

To build an IoT solution for your business, you typically choose to use either the *platform services* or the *managed app platform* approach.

Platform services provide the building blocks for customized and flexible IoT applications. You have more options to choose and code when you connect devices, and ingest, store, and analyze your data. Azure IoT platform services include the products Azure IoT Hub and Azure Digital Twins.

A managed app platform lets you get started building apps more quickly than platform services by reducing the number of decisions needed to achieve results. The managed app platform takes care of most elements of your solution, so you can focus on adding industry knowledge, and scaling and connecting devices. Azure IoT Central is a managed app platform.

To choose between these two approaches, you should consider:

- How you want to manage your solution.
- What level of customization and control you want over your solution.
- What pricing structure you want.

## Management

Where do you want to spend your system management time and resources? 

- Choose the platform services approach to have full control over the underlying services in your solution. For example, you want to:

    - Manage scaling and securing services to meet your needs.
    - Make use of in-house or partner expertise to onboard devices and provision services.

- Choose the managed app platform approach to take advantage of a platform that handles scale, security, and management of your IoT applications and devices.

## Control

What elements of your solution do you want to customize?

- Choose the platform services approach for total customization and control over the solution architecture.

- Choose the managed app platform approach to customize branding, dashboards, user roles, devices, and telemetry. However, you don't want to handle the underlying IoT system management overhead.

## Pricing

What pricing structure best fits your needs?

- Choose the platform services approach to fine-tune services and control my overall costs.

- Choose the managed app platform approach for a simple, predictable pricing structure.

## Summary

The platform services approach is appropriate for a business with cloud solution and device expertise that wants to:

- Fine-tune the services in the solution.
- Have a high degree of control over the services in the solution.
- Fully customize the solution.

The managed app platform approach is appropriate for a business that:

- Doesn't want to dedicate extensive resources to system design, development, and management.
- Does want a predictable pricing structure.
- Does want some customization capabilities.

## Next steps

For a more comprehensive explanation of the different services and platforms, and how they're used, see [Azure IoT services and technologies](iot-services-and-technologies.md).

To learn more about the key attributes of successful IoT solutions, see the [8 attributes of successful IoT solutions](https://aka.ms/8attributes) white paper.

For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).
