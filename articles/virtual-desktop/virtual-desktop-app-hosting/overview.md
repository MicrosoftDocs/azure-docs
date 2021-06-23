---
title: What is Azure Virtual Desktop Remote App Streaming? - Azure
description: An overview of Azure Virtual Desktop Remote App Streaming.
author: Heidilohr
ms.topic: overview
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# What is Azure Virtual Desktop Remote App Streaming?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud and lets you access your remote desktop anytime, anywhere. However, did you know you can also make your Azure Virtual Desktop deployment provide your organization's apps as a Platform as a Service (PaaS) or Software as a Service (SaaS) for your customers? With Azure Virtual Desktop Remote App Streaming, you can now use Azure Virtual Desktop to deliver apps to your customers over a secure network through virtual machines.

If you're unfamiliar with Azure Virtual Desktop (or are new to app virtualization in general), we've gathered some resources here that can help you get your deployment up and running.

## Requirements

Before you get started, we recommend you take a look through the [main Azure Virtual Desktop documentation](./virtual-desktop/overview.md) to understand how this product works. Once you understand the basics, you can use the Remote App Streaming documentation more effectively.

In order to set up an Azure Virtual Desktop deployment for your custom apps that's available to customers outside your organization, you'll need the following things:

- Your custom app. See [How to serve your custom app with Azure Virtual Desktop]() to learn about the types of apps Azure Virtual Desktop supports and how you can serve them to your customers.

- Your domain join credentials. If you don't already have an Active Directory and domain controller for each organization of users you're going to send your apps to, you'll need to set up identity management for your host pool. See [How to set up identities managed by the Azure Virtual Desktop deployment owner]() for more information.

- An Azure subscription. If you don't already have a subscription, make sure to [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Get started

Now that you're ready, let's take a look at how you can set up your Azure Virtual Desktop deployment.

You have two options to set yourself up for success. You can either set up your deployment manually or automatically. The next two sections will describe the differences between these two methods.

### Set up Azure Virtual Desktop manually

If you want to set up your deployment manually, which will give you more control over configuration, you can start by following these tutorials:

1. [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md)

2. [Manage app groups](../manage-app-groups.md)

3. [Create a host pool to validate service updates](../create-validation-host-pool.md)

4. [Set up service alerts](../set-up-service-alerts.md)

### Set up Azure Virtual Desktop automatically

If you'd rather not set things up manually, you can use our Getting Started tool to automatically set up your deployment for you. For more information, check out these articles:

- [Serve your app to external organizations with the Getting Started tool]()
- [Troubleshooting the Getting Started tool]()

### Customize and manage Azure Virtual Desktop

Once you've set up Azure Virtual Desktop, you have lots of options to customize your deployment to meet your organization or customers' needs. These articles can help you get started:

- [How to serve your custom app with Azure Virtual Desktop]()
<!---May need to remove this one because it's the one I'm starting over--->
- [Enroll in metered licensing]()
- [How to use Azure Active Directory]()
- [Using Windows 10 virtual machines with Intune](/mem/intune/fundamentals/windows-10-virtual-machines)
- [How to deploy an app using MSIX app attach]()
- [Use Azure Monitor for Azure Virtual Desktop to monitor your deployment](../azure-monitor.md)
- [Set up a business continuity and disaster recovery plan](../disaster-recovery.md)
- [Scale session hosts using Azure Automation](../set-up-scaling-script.md)
- [Set up Universal Print](/universal-print/fundamentals/universal-print-getting-started)

- How to estimate IP meter costs

### Get to know your deployment

Read the following articles to understand concepts essential to creating and managing deployments:

- [Understanding licensing for app hosting]()
- [Windows Virtual Desktop security best practices - Azure \| Microsoft Docs](../security-guide.md)
- [Azure Monitor for Azure Virtual Desktop glossary](../azure-monitor-glossary.md)
- [Windows Virtual Desktop for the enterprise - Azure Example Scenarios \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/wvd/windows-virtual-desktop)
- [Understanding total Azure Virtual Desktop costs]()
- [Architecture recommendations]()
- [Security implications of multi-tenancy]()

## Next steps

If you're ready to start setting up your deployment manually, head to the following tutorial.

> [!div class="nextstepaction"]
> [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md)