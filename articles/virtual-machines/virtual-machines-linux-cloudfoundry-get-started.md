---
title: Getting Started with Cloud Foundry on Microsoft Azure | Microsoft Docs
description: Run OSS or Pivotal Cloud Foundry on Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid: 2a15ffbf-9f86-41e4-b75b-eb44c1a2a7ab
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 11/16/2016
ms.author: seanmck

---

# Cloud Foundry on Azure

Cloud Foundry is an open-source platform-as-a-service (PaaS) for building, deploying, and operating 12-factor applications developed in a variety of languages and frameworks. This document describes the options you have for running Cloud Foundry on Azure and how you can get started.

## Cloud Foundry overview



## Cloud Foundry offerings

There are two forms of Cloud Foundry available to run on Azure: open-source Cloud Foundry (OSS CF) and Pivotal Cloud Foundry (PCF). As the name suggests, OSS CF is an entirely [open-source](https://github.com/cloudfoundry) version of Cloud Foundry managed by the Cloud Foundry Foundation. Pivotal Cloud Foundry is an enterprise distribution of Cloud Foundry from Pivotal Inc. We look at some of the differences between the two offerings.

### Open-source Cloud Foundry

You can deploy OSS Cloud Foundry on Azure by first deploying a BOSH director and then deploying Cloud Foundry, using the [instructions provided on GitHub](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/blob/master/docs/guidance.md). To learn more about using OSS CF, see the [documentation](https://docs.cloudfoundry.org/) provided by the Cloud Foundry Foundation.

Microsoft provides best-effort support for OSS CF through the following community channels:

- #bosh-azure-cpi channel on [Cloud Foundry Slack](https://slack.cloudfoundry.org/)
- [cf-bosh mailing list](https://lists.cloudfoundry.org/pipermail/cf-bosh)
- GitHub issues for the [CPI](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/issues) and [service broker](https://github.com/Azure/meta-azure-service-broker/issues)

>[!NOTE] The level of support for your Azure resources, such as the virtual machines where you run Cloud Foundry, is based on your Azure support agreement. Best-effort community support only applies to the Cloud Foundry-specific components.

### Pivotal Cloud Foundry

Pivotal Cloud Foundry includes the same core platform as the OSS distribution, along with a set of proprietary management tools and enterprise support. In order to run PCF on Azure, you must to acquire a license from Pivotal.

The tools include [Pivotal Operations Manager](http://docs.pivotal.io/pivotalcf/customizing/), a web application that simplifies deployment and management of a Cloud Foundry foundation, and [Pivotal Apps Manager](https://docs.pivotal.io/pivotalcf/console/), a web application for managing users and applications.

In addition to the support channels listed for OSS CF above, a PCF license entitles you to contact Pivotal for support. Microsoft and Pivotal have also enabled support workflows that allow you to contact either party for assistance and have your inquiry routed appropriately depending on where the issue lies.

## Next steps
