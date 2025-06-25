---
title:  Enable telemetry for feature flags in a Node.js application (preview)
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in Node.js for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 06/25/2025
---

# Enable telemetry for feature flags in a Node.js application

In this tutorial, you use telemetry in your Python application to track feature flag evaluations and custom events. Telemetry allows you to make informed decisions about your feature management strategy. You utilize the feature flag with telemetry enabled created in [Enable telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature flag named *Greeting* in your Configuration store with telemetry enabled. This tutorial builds on top of [use variant feature flags](./howto-variant-feature-flags-python.md).

## Prerequisites

- The variant feature flag with telemetry enabled from [Enable telemetry for feature flags](./howto-telemetry.md).
- The application from [Use variant feature flags](./howto-variant-feature-flags-python.md).
