---
title: Azure Virtual Desktop (classic) retirement - Azure
description: Information about the retirement of Azure Virtual Desktop (classic).
ms.topic: conceptual
author: msft-jasonparker
ms.author: japarker
ms.date: 09/27/2023
---

# Azure Virtual Desktop (classic) retirement

> [!IMPORTANT]
> This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects.

Azure Virtual Desktop (classic) will retire on **September 30, 2026**. You should transition to Azure Virtual Desktop before that date.

[Azure Virtual Desktop](../overview.md) replaces Azure Virtual Desktop (classic). Here are some of the benefits of using Azure Virtual Desktop instead of Azure Virtual Desktop (classic):

- Deployments via Azure Resource Manager (ARM)
- Unified resource management
- Improved networking and security
- Scaling and automation features
- Feature availability and updates

## Retirement timeline

Beginning **September 30, 2023**, you'll no longer be able to create new Azure Virtual Desktop (classic) tenants. Existing Azure Virtual Desktop (classic) resources can still be managed, migrated, and are supported through **September 30, 2026**.

> [!IMPORTANT]
> If you have more than 500 application groups or manage multi-tenant environments, you can [request an exemption](#exemption-process).

## Required action

To avoid service disruptions, migrate to Azure Virtual Desktop before September 30, 2026. Here are some articles to help you migrate:

- [Migrate manually from Azure Virtual Desktop (classic)](../manual-migration.md)
- [Migrate automatically from Azure Virtual Desktop (classic)](../automatic-migration.md)

## Exemption process

To be able to continue creating tenants in Azure Virtual Desktop (classic), you need to create an exemption. An exemption is available if you have more than 500 application groups or manage multitenant environments. To create an exemption:

1. Browse to [New support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.

1. On the **Problem description** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Issue type | Select **Technical** from the drop-down list |
   | Subscription | Select a subscription containing Azure Virtual Desktop (classic) resources from the drop-down list. |
   | Service | Select **My services**. |
   | Service type | Select **Azure Virtual Desktop** from the drop-down list |
   | Resource | Select an Azure Virtual Desktop (classic) resource from the drop-down list. |
   | Summary | Enter a description of your issue. |
   | Problem type | Select **Issues configuring Azure Virtual Desktop (classic)** from the drop-down list. |
   | Problem subtype | Select **Tenant creation exemption request** from the drop-down list. |

1. Complete the remaining tabs and select **Create**.

## Help and support

If you have a support plan and you need technical help, see [Azure Virtual Desktop (classic) troubleshooting overview, feedback, and support](troubleshoot-set-up-overview-2019.md#create-a-support-request) for information on how to create a support request. You can also ask community experts questions at [Azure Virtual Desktop - Microsoft Q&A](/answers/tags/221/azure-virtual-desktop).
