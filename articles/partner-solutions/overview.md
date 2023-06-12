---
title: Overview of Azure Native ISV Services
description: Introduction to the Azure Native ISV Services.
author: flang-msft

ms.topic: conceptual
ms.custom: event-tier1-build-2022
ms.date: 04/19/2023
ms.author: franlanglois
---

# Azure Native ISV Services overview

Azure Native ISV Services enable you to easily provision, manage, and tightly integrate *independent software vendor* (ISV) software and services on Azure. Azure Native ISV Services are developed and managed by Microsoft and the ISV. Currently, several services are publicly available across these areas: observability, data, networking, and storage. For a list of all our current ISV partner services, see [Extend Azure with Azure Native ISV Services](partners.md).

## Features of Azure Native ISV Services

A list of features of any Azure Native ISV Service is listed below.

### Unified operations

- Integrated onboarding: Use ARM template, SDK, CLI and the Azure portal to create and manage services.
- Unified management: Manage entire lifecycle of these ISV services through the Azure portal.
- Unified access: Use Single Sign-on (SSO) through Azure Active Directory--no need for separate ISV authentications for subscribing to the service.

### Integrations

- Logs and metrics: Seamlessly direct logs and metrics from Azure Monitor to the Azure Native ISV Service using just a few gestures. You can configure auto-discovery of resources to monitor, and set up automatic log forwarding and metrics shipping.  You can easily do the setup in Azure, without needing to create additional infrastructure or write custom code.
- VNet injection: Provides private data plane access to Azure Native ISV services from customers’ virtual networks.
- Unified billing: Engage with a single entity, Microsoft Azure Marketplace, for billing. No separate license purchase is required to use Azure Native ISV Services.


