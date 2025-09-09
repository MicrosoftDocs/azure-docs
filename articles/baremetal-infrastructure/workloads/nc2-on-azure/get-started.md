---
title: Get started
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to sign up, set up, and use Nutanix Cloud Clusters on Azure.
ms.topic: get-started
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 7/30/2025
ms.service: azure-baremetal-infrastructure
# Customer intent: As an IT administrator, I want to sign up for and configure Nutanix Cloud Clusters on Azure, so that I can efficiently manage my cloud infrastructure while ensuring connectivity and compliance with my organization’s requirements.
---

# Get started with Nutanix Cloud Clusters on Azure

Learn how to get started with Nutanix Cloud Clusters (NC2) on Azure. You can also sign up for a free trial of NC2 on Azure.

## NC2 on Azure deployment requirements

To deploy NC2 on Azure you must have the following:

* An **active subscription** which will need to be allowlisted.
* An **Azure account** associated with an active subscription and a **Microsoft Entra ID** with permissions to create an app registration in Microsoft Entra ID with access to the subscription.
* A **My Nutanix** account.
* In addition, there are **networking and Azure quota** requirements to consider.

For further details review [Cloud Clusters (NC2) Hosted - Nutanix Cloud Clusters on Azure Deployment and User Guide](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure), including sections:

[NC2 Deployment Prerequisites](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-azure-getting-ready-for-deployment-c.html), [Setting Up Azure Tenant](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-azure-portal-setup-c.html) and [Creating a Cluster](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-azure-creating-a-cluster-t.html).

## Start with a free trial of NC2 on Azure

To help you evaluate NC2 on Azure a 30-day free trial is offered. Microsoft provides and manages the Azure BareMetal infrastructure, while Nutanix provides the software licenses. You can sign up for the trial directly through Nutanix.

The following details are important considerations for Nutanix on Azure BareMetal nodes:

**Trial duration**: The trial begins with the initial hardware node deployment and lasts for 30 consecutive days. It can't be paused, and the start date is fixed regardless of cluster activity. Even if the cluster is dropped, the trial time continues.

**Cost coverage**: The BareMetal cluster nodes have no cost through the trial. Other components like VMs for Flow Gateway networking and other Azure services are billed and not included in the trial.

**One-time opportunity**: The trial is a one-time offer. If you deploy a cluster after the initial 30-day trial period, regardless of the timeframe, the trial doesn't reset, and you'll be billed. Creating a cluster in a different subscription does not reset your trial timing.

**Track the trial period**: There's no visible trial information for the BareMetal. You should track your BareMetal deployment date manually.

For more information, see *[Starting a Free Trial for NC2](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-starting-a-nc2-free-trial-t.html)*

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [FAQ](faq.md)
