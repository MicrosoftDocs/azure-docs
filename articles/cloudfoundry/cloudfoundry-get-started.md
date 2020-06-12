---
title: Getting Started with Cloud Foundry on Microsoft Azure 
description: Run OSS or Pivotal Cloud Foundry on Microsoft Azure
author: seanmck
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.date: 01/19/2017
ms.author: seanmck
---

# Cloud Foundry on Azure

Cloud Foundry is an open-source platform-as-a-service (PaaS) for building, deploying, and operating 12-factor applications developed in various languages and frameworks. This document describes the options you have for running Cloud Foundry on Azure and how you can get started.

## Cloud Foundry offerings

There are two forms of Cloud Foundry available to run on Azure: open-source Cloud Foundry (OSS CF) and Pivotal Cloud Foundry (PCF). OSS CF is an entirely [open-source](https://github.com/cloudfoundry) version of Cloud Foundry managed by the Cloud Foundry Foundation. Pivotal Cloud Foundry is an enterprise distribution of Cloud Foundry from Pivotal Software Inc. We look at some of the differences between the two offerings.

### Open-source Cloud Foundry

You can deploy OSS Cloud Foundry on Azure by first deploying a BOSH director and then deploying Cloud Foundry, using the [instructions provided on GitHub](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/blob/master/docs/guidance.md). To learn more about using OSS CF, see the [documentation](https://docs.cloudfoundry.org/) provided by the Cloud Foundry Foundation.

Microsoft provides best-effort support for OSS CF through the following community channels:

- #bosh-azure-cpi channel on [Cloud Foundry Slack](https://slack.cloudfoundry.org/)
- [cf-bosh mailing list](https://lists.cloudfoundry.org/pipermail/cf-bosh)
- GitHub issues for the [CPI](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/issues) and [service broker](https://github.com/Azure/meta-azure-service-broker/issues)

>[!NOTE]
> The level of support for your Azure resources, such as the virtual machines where you run Cloud Foundry, is based on your Azure support agreement. Best-effort community support only applies to the Cloud Foundry-specific components.

### Pivotal Cloud Foundry

Pivotal Cloud Foundry includes the same core platform as the OSS distribution, along with a set of proprietary management tools and enterprise support. To run PCF on Azure, you must acquire a license from Pivotal. The PCF offer from the Azure marketplace includes a 90-day trial license.

The tools include [Pivotal Operations Manager](https://docs.pivotal.io/pivotalcf/customizing/), a web application that simplifies deployment and management of a Cloud Foundry foundation, and [Pivotal Apps Manager](https://docs.pivotal.io/pivotalcf/console/), a web application for managing users and applications.

In addition to the support channels listed for OSS CF above, a PCF license entitles you to contact Pivotal for support. Microsoft and Pivotal have also enabled support workflows that allow you to contact either party for assistance and have your inquiry routed appropriately depending on where the issue lies.

## Azure Service Broker

Cloud Foundry encourages the ["twelve-factor app"](https://12factor.net/) methodology, which promotes a clean separation of stateless application processes and stateful backing services. [Service brokers](https://docs.cloudfoundry.org/services/api.html) offer a consistent way to provision and bind backing services to applications. The [Azure service broker](https://github.com/Azure/meta-azure-service-broker) provides some of the key Azure services through this channel, including Azure storage and Azure SQL.

If you are using Pivotal Cloud Foundry, the service broker is also [available as a tile](https://docs.pivotal.io/azure-sb/installing.html) from the Pivotal Network.

## Related resources

### Azure DevOps Services plugin

Cloud Foundry is well suited to agile software development, including the use of continuous integration (CI) and continuous delivery (CD). If you use Azure DevOps Services to manage your projects and would like to set up a CI/CD pipeline targeting Cloud Foundry, you can use the [Azure DevOps Services Cloud Foundry build extension](https://marketplace.visualstudio.com/items?itemName=ms-vsts.cloud-foundry-build-extension). The plugin makes it simple to configure and automate deployments to Cloud Foundry, whether running in Azure or another environment.

## Next steps

- [Deploy Pivotal Cloud Foundry from the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/pivotal.pivotal-cloud-foundry)
- [Deploy an app to Cloud Foundry in Azure](./cloudfoundry-deploy-your-first-app.md)
