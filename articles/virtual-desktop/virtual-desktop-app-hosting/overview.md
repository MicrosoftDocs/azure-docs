---
title: What is Azure Virtual Desktop remote app streaming? - Azure
description: An overview of Azure Virtual Desktop remote app streaming.
author: Heidilohr
ms.topic: overview
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# What is Azure Virtual Desktop remote app streaming?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud and lets you access your remote desktop anytime, anywhere. However, did you know you can also use Azure Virtual Desktop as as a Platform as a Service (PaaS) to provide your organization's apps as Software as a Service (SaaS) to your customers? With Azure Virtual Desktop remote app streaming, you can now use Azure Virtual Desktop to deliver apps to your customers over a secure network through virtual machines.

If you're unfamiliar with Azure Virtual Desktop (or are new to app virtualization in general), we've gathered some resources here that can help you get your deployment up and running.

## Requirements

Before you get started, we recommend you take a look at the [overview for Azure Virtual Desktop](../overview.md) for a more in-depth list of system requirements for running Azure Virtual Desktop. While you're there, you can browse the rest of the Azure Virtual Desktop documentation if you want a more IT-focused look into the service, as most of the articles also apply to remote app streaming for Azure Virtual Desktop. Once you understand the basics, you can use the remote app streaming documentation more effectively.

In order to set up an Azure Virtual Desktop deployment for your custom apps that's available to customers outside your organization, you'll need the following things:

- Your custom app. See [How to serve your custom app with Azure Virtual Desktop]() to learn about the types of apps Azure Virtual Desktop supports and how you can serve them to your customers.

- Your domain join credentials. If you don't already have an identity management system compatible with Azure Virtual Desktop, you'll need to set up identity management for your host pool.

- An Azure subscription. If you don't already have a subscription, make sure to [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Get started

Now that you're ready, let's take a look at how you can set up your Azure Virtual Desktop deployment.

You have two options to set yourself up for success. You can either set up your deployment manually or automatically. The next two sections will describe the differences between these two methods.

You can set up your deployment manually by following these tutorials:

1. [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md)

2. [Manage app groups](../manage-app-groups.md)

3. [Create a host pool to validate service updates](../create-validation-host-pool.md)

4. [Set up service alerts](../set-up-service-alerts.md)

## Customize and manage Azure Virtual Desktop

Once you've set up Azure Virtual Desktop, you have lots of options to customize your deployment to meet your organization or customers' needs. These articles can help you get started:

- [How to serve your custom app with Azure Virtual Desktop]()
- [Enroll in per-user access pricing]()
- [How to use Azure Active Directory]()
- [Using Windows 10 virtual machines with Intune](/mem/intune/fundamentals/windows-10-virtual-machines)
- [How to deploy an app using MSIX app attach]()
- [Use Azure Monitor for Azure Virtual Desktop to monitor your deployment](../azure-monitor.md)
- [Set up a business continuity and disaster recovery plan](../disaster-recovery.md)
- [Scale session hosts using Azure Automation](../set-up-scaling-script.md)
- [Set up Universal Print](/universal-print/fundamentals/universal-print-getting-started)

## Get to know your Azure Virtual Desktop deployment

Read the following articles to understand concepts essential to creating and managing Azure Virtual Desktop deployments:

- [App hosting licenses]()
- [Security guidelines for remote app streaming]()
- [Azure Virtual Desktop security best practices](../security-guide.md)
- [Azure Monitor for Azure Virtual Desktop glossary](../azure-monitor-glossary.md)
- [Azure Virtual Desktop for the enterprise](/azure/architecture/example-scenario/wvd/windows-virtual-desktop)
- [Estimate total deployment costs]()
- [Architecture recommendations]()

## Next steps

If you're ready to start setting up your deployment manually, head to the following tutorial.

> [!div class="nextstepaction"]
> [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md)
