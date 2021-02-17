---
title: Datadog overview - Azure partner solutions
description: Learn about using Datadog in the Azure Marketplace.
author: tfitzmac
ms.topic: conceptual
ms.service: partner-services
ms.date: 02/17/2021
ms.author: tomfitz
---

# What is Azure Datadog integration?

## Overview

Azure Datadog integration is a Marketplace offering that enables Datadog to run as a service on Azure. Datadog is a monitoring and analytics platform for large-scale applications. It aggregates data across your entire stack with 400+ integrations for troubleshooting, alerting, and graphing.

Datadog is available in the Azure console as an integrated service running on Azure. This availability means you can implement Datadog as a monitoring solution for your cloud workloads through a streamlined workflow. The workflow covers everything from procurement to configuration. The onboarding experience simplifies how you start monitoring the health and performance of your applications, whether they're based entirely in Azure or spread across hybrid or multi-cloud environments.

You provision the Datadog resources through a resource provider named `Microsoft.Datadog`. You can create, provision, and manage Datadog organization resources through the [Azure portal](https://portal.azure.com/). Datadog owns and runs the software as a service (SaaS) application including the organization and API keys.

## Capabilities

Integrating Datadog with Azure provides the following capabilities:

- **Seamless onboarding** - The Datadog SaaS software is an integrated service on Azure. You can provision and manage the Datadog resource through the Azure portal.
- **Unified billing** - Datadog costs are reported through Azure monthly bill.
- **Single sign-on to Datadog** - You don't need a separate authentication for the Datadog portal.
- **Log forwarder** - Enables forwarding of subscription activity and resource logs to Datadog.
- **Metrics collection** - Automatically configure and set up Datadog crawler to send Azure resource metrics to Datadog.
- **Datadog agent single pane of glass** - Provides a single pane of glass to install and uninstall Datadog agents on virtual machines and app services as extensions.

## Datadog links

For more help with using Datadog, see the following links to the [Datadog site](https://www.datadoghq.com/).

## Next steps

To create an instance of Datadog, see [QuickStart: Get started with Datadog](create.md).
