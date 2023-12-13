---
title: What is Azure Virtual Desktop RemoteApp streaming? - Azure
description: An overview of Azure Virtual Desktop RemoteApp streaming.
author: Heidilohr
ms.topic: overview
ms.date: 11/12/2021
ms.author: helohr
manager: femila
---

# What is Azure Virtual Desktop RemoteApp streaming?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud and lets you access your remote desktop anytime, anywhere. However, did you know you can also use Azure Virtual Desktop as a Platform as a Service (PaaS) to provide your organization's apps as Software as a Service (SaaS) to your customers? With Azure Virtual Desktop RemoteApp streaming, you can now use Azure Virtual Desktop to deliver apps to your customers over a secure network through virtual machines.

If you're unfamiliar with Azure Virtual Desktop (or are new to app virtualization in general), we've gathered some resources here that can help you get your deployment up and running.

## Requirements

Before you get started, we recommend you take a look at the [overview for Azure Virtual Desktop](../overview.md) for a more in-depth list of system requirements for running Azure Virtual Desktop. While you're there, you can browse the rest of the Azure Virtual Desktop documentation if you want a more IT-focused look into the service, as most of the articles also apply to RemoteApp streaming for Azure Virtual Desktop. Once you understand the basics, you can use the RemoteApp streaming documentation more effectively.

In order to set up an Azure Virtual Desktop deployment for your custom apps that's available to customers outside your organization, you'll need the following things:

- Your custom app. See [How to host custom apps with Azure Virtual Desktop](custom-apps.md) to learn about the types of apps Azure Virtual Desktop supports and how you can serve them to your customers.

- Your domain join credentials. If you don't already have an identity management system compatible with Azure Virtual Desktop, you'll need to set up identity management for your host pool. To learn more, see [Set up managed identities](identities.md).

- An Azure subscription. If you don't already have a subscription, make sure to [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Get started

Now that you're ready, let's take a look at how you can set up your Azure Virtual Desktop deployment. You have two options to set yourself up for success. You can either set up your deployment manually or automatically. The next two sections will describe the differences between these two methods.

### Set up Azure Virtual Desktop manually

You can set up your deployment manually by following these tutorials:

1. [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

2. [Manage application groups](../manage-app-groups.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

3. [Create a host pool to validate service updates](../create-validation-host-pool.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

4. [Set up service alerts](../set-up-service-alerts.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

### Set up Azure Virtual Desktop automatically

If you'd prefer an automatic process, you can use the getting started feature to set up your deployment for you. For more information, check out these articles:

- [Deploy Azure Virtual Desktop with the getting started feature](../getting-started-feature.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) (When following these instructions, make sure to follow the instructions for existing Microsoft Entra Domain Services or AD DS. This method gives you better identity management and app compatibility while also giving you the power to fine-tune identity-related infrastructure costs. The method for subscriptions that don't already have Microsoft Entra Domain Services or AD DS doesn't give you these benefits.)
- [Troubleshoot the getting started feature](../troubleshoot-getting-started.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

## Customize and manage Azure Virtual Desktop

Once you've set up Azure Virtual Desktop, you have lots of options to customize your deployment to meet your organization or customers' needs. These articles can help you get started:

- [How to host custom apps with Azure Virtual Desktop](custom-apps.md)
- [Enroll your subscription in per-user access pricing](per-user-access-pricing.md)
- [How to use Microsoft Entra ID](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)
- [Using Windows 10 virtual machines with Intune](/mem/intune/fundamentals/windows-10-virtual-machines)
- [How to deploy an app using MSIX app attach](msix-app-attach.md)
- [Use Azure Virtual Desktop Insights to monitor your deployment](../insights.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Set up a business continuity and disaster recovery plan](../disaster-recovery.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Scale session hosts using Azure Automation](../set-up-scaling-script.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Set up Universal Print](/universal-print/fundamentals/universal-print-getting-started)
- [Set up the Start VM on Connect feature](../start-virtual-machine-connect.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Tag Azure Virtual Desktop resources to manage costs](../tag-virtual-desktop-resources.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

## Get to know your Azure Virtual Desktop deployment

Read the following articles to understand concepts essential to creating and managing Azure Virtual Desktop deployments:

- [Understanding licensing and per-user access pricing](licensing.md)
- [Security guidelines for cross-organizational apps](security.md)
- [Azure Virtual Desktop security best practices](../security-guide.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Azure Virtual Desktop Insights glossary](../azure-monitor-glossary.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
- [Azure Virtual Desktop for the enterprise](/azure/architecture/example-scenario/wvd/windows-virtual-desktop)
- [Estimate total deployment costs](total-costs.md)
- [Estimate per-user app streaming costs](streaming-costs.md)
- [Architecture recommendations](architecture-recs.md)
- [Start VM on Connect FAQ](../start-virtual-machine-connect-faq.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)

## Next steps

If you're ready to start setting up your deployment manually, head to the following tutorial.

> [!div class="nextstepaction"]
> [Create a host pool with the Azure portal](../create-host-pools-azure-marketplace.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)
