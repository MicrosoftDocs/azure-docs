---
title: "Azure Virtual Desktop Remote App Streaming "
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

Now that you're ready, let's take a look at the tutorials to set up your Azure Virtual Desktop deployment:

1. [Create a host pool with the Azure portal](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)

2. [Manage app groups](https://docs.microsoft.com/en-us/azure/virtual-desktop/manage-app-groups)

3. [Create a host pool to validate service updates](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-validation-host-pool)

4. [Set up service alerts](https://docs.microsoft.com/en-us/azure/virtual-desktop/set-up-service-alerts)

Alternatively, you can use the Getting Started wizard. This wizard will deploy Azure Virtual Desktop with customization specific for your scenarios. For more information, check out the resources below:

- Serve your app to external organizations with the Getting Started wizard

- Troubleshooting with the Getting Started wizard

Keep going
==========

Customize and manage your existing deployment
---------------------------------------------

We think the following features will help you make the most of your deployments:

- How to serve your custom app with Azure Virtual Desktop

- Enroll in metered licensing

- How to use Azure AD only

- [Using Windows 10 virtual machines with Intune](https://docs.microsoft.com/en-us/mem/intune/fundamentals/windows-10-virtual-machines)

- How to deploy an app using MSIX app attach

- [Use Azure Monitor for Azure Virtual Desktop to monitor your deployment](https://docs.microsoft.com/en-us/azure/virtual-desktop/azure-monitor)

- [Set up a business continuity and disaster recovery plan](https://docs.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery)

- [Scale session hosts using Azure Automation](https://docs.microsoft.com/en-us/azure/virtual-desktop/set-up-scaling-script)

- [Set up Universal Print](https://docs.microsoft.com/en-us/universal-print/fundamentals/universal-print-getting-started)

- How to estimate IP meter costs

## Get to know your deployment

Read the following articles to understand concepts essential to creating and managing deployments:

- Understanding licensing for app hosting

- [Windows Virtual Desktop security best practices - Azure \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/virtual-desktop/security-guide)

- [Azure Monitor for Azure Virtual Desktop glossary](https://docs.microsoft.com/en-us/azure/virtual-desktop/azure-monitor-glossary)

- [Windows Virtual Desktop for the enterprise - Azure Example Scenarios \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/wvd/windows-virtual-desktop)

- Understanding total Azure Virtual Desktop costs

- Architecture recommendations

- Security implications of multi-tenancy
