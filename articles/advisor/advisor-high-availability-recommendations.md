---
title: Improve availability of your application with Azure Advisor | Microsoft Docs
description: Use Azure Advisor to improve high availability of your Azure deployments.
services: advisor
documentationcenter: NA
author: kasparks
ms.author: kasparks
ms.service: advisor
ms.topic: article
ms.date: 01/29/2019

---

# Improve availability of your application with Azure Advisor

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. You can get high availability recommendations by Advisor from the **High Availability** tab of the Advisor dashboard.

## Ensure virtual machine fault tolerance

To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. Advisor identifies virtual machines that are not part of an availability set and recommends moving them into an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to create an availability set for the virtual machine or to add the virtual machine to an existing availability set.

> [!NOTE]
> If you choose to create an availability set, you must add at least one more virtual machine into it. We recommend that you group two or more virtual machines in an availability set to ensure that at least one machine is available during an outage.

## Ensure availability set fault tolerance

To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. Advisor identifies availability sets that contain a single virtual machine and recommends adding one or more virtual machines to it. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to create a virtual machine or to add an existing virtual machine to the availability set.  

## Use Managed Disks to improve data reliability

Virtual machines that are in an availability set with disks that share either storage accounts or storage scale units are not resilient to single storage scale unit failures during outages. Advisor will identify these availability sets and recommend migrating to Azure Managed Disks. This will ensure that the disks of the different virtual machines in the availability set are sufficiently isolated to avoid a single point of failure. 

## Ensure application gateway fault tolerance

This recommendation ensures the business continuity of mission-critical applications that are powered by application gateways. Advisor identifies application gateway instances that are not configured for fault tolerance, and it suggests remediation actions that you can take. Advisor identifies medium or large single-instance application gateways, and it recommends adding at least one more instance. It also identifies single- or multi-instance small application gateways and recommends migrating to medium or large SKUs. Advisor recommends these actions to ensure that your application gateway instances are configured to satisfy the current SLA requirements for these resources.

## Protect your virtual machine data from accidental deletion

Setting up virtual machine backup ensures the availability of your business-critical data and offers protection against accidental deletion or corruption. Advisor identifies virtual machines where backup is not enabled, and it recommends enabling backup. 

## Ensure you have access to Azure cloud experts when you need it

When running a business-critical workload, it's important to have access to technical support when needed. Advisor identifies potential business-critical subscriptions that do not have technical support included in their support plan and recommends upgrading to an option that includes technical support.

## Create Azure Service Health alerts to be notified when Azure issues affect you

We recommend setting up Azure Service Health alerts to be notified when Azure service issues affect you. [Azure Service Health](https://azure.microsoft.com/features/service-health/) is a free service that provides personalized guidance and support when you are impacted by an Azure service issue. Advisor identifies subscriptions that do not have alerts configured and recommends creating one.

## Configure Traffic Manager endpoints for resiliency

Traffic Manager profiles with more than one endpoint experience higher availability if any given endpoint fails. Placing endpoints in different regions further improves service reliability. Advisor identifies Traffic Manger profiles where there is only one endpoint and recommends adding at least one more endpoint in another region.

If all endpoints in a Traffic Manager profile that is configured for proximity routing are in the same region, users from other regions may experience connection delays. Adding or moving an endpoint to another region will improve overall performance and provide better availability if all endpoints in one region fail. Advisor identifies Traffic Manager profiles configured for proximity routing where all the endpoints are in the same region. It recommends adding or moving an endpoint to another Azure region.

If a Traffic Manager profile is configured for geographic routing, then traffic is routed to endpoints based on defined regions. If a region fails, there is no pre-defined failover. Having an endpoint where the Regional Grouping is configured to "All (World)" will avoid traffic being dropped and improve service availability. Advisor identifies Traffic Manager profiles configured for geographic routing where there is no endpoint configured to have the Regional Grouping as "All (World)". It recommends changing the configuration to make an endpoint "All (World).

## Use soft delete on your Azure Storage Account to save and recover data after accidental overwrite or deletion

Enable [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) on your storage account so that deleted blobs transition to a soft deleted state instead of being permanently deleted. When data is overwritten, a soft deleted snapshot is generated to save the state of the overwritten data. Using soft delete allows you to recover if there are accidental deletions or overwrites. Advisor identifies Azure Storage accounts that don't have soft delete enabled and suggests you enable it.

## Configure your VPN gateway to active-active for connection resiliency

In active-active configuration, both instances of a VPN gateway will establish S2S VPN tunnels to your on-premises VPN device. When a planned maintenance event or unplanned event happens to one gateway instance, traffic will be switched over to the other active IPsec tunnel automatically. Azure Advisor will identify VPN gateways that are not configured as active-active and suggest that you configure them for high availability.

## Use production VPN gateways to run your production workloads

Azure Advisor will check for any VPN gateways that are a Basic SKU and recommend that you use a production SKU instead. The Basic SKU is designed for development and testing purposes. Production SKUs offer a higher number of tunnels, BGP support, active-active configuration options, custom Ipsec/IKE policy, and higher stability and availability.

## How to access High Availability recommendations in Advisor

1. Sign in to the [Azure portal](https://portal.azure.com), and then open [Advisor](https://aka.ms/azureadvisordashboard).

2.	On the Advisor dashboard, click the **High Availability** tab.

## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Azure Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)

