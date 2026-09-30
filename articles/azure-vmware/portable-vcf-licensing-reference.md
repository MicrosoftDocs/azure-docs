---
title: Portable VMware Cloud Foundation licensing reference for Azure VMware Solution
description: Review licensing rules, important dates, core requirements, and security details for portable VMware Cloud Foundation on Azure VMware Solution.
ms.topic: reference
ms.service: azure-vmware
ms.date: 08/14/2026
# Customer intent: As a cloud administrator, I want to understand portable VMware Cloud Foundation licensing requirements for Azure VMware Solution, so that I can maintain compliant licensing across my private clouds.
---

# Portable VMware Cloud Foundation licensing reference for Azure VMware Solution

This article describes the licensing rules and core requirements for using a portable VMware Cloud Foundation (VCF) subscription with Azure VMware Solution. For instructions to register or manage a portable VCF subscription, see [Configure portable VCF for Azure VMware Solution](vmware-cloud-foundations-license-portability.md).

## Licensing model and important dates

Customers must purchase VCF licenses directly from Broadcom to use hyperscaler cloud services. As of November 1, 2025, Microsoft no longer includes a VCF license or subscription with new Azure VMware Solution node purchases.

The following dates apply to existing deployments and reservations:

| Date | Requirement |
| --- | --- |
| October 15, 2025 | The number of eligible VCF-included vDefend Firewall cores was established. Usage above that number requires a Broadcom vDefend Firewall add-on license. |
| November 1, 2025 | New Azure VMware Solution deployments must use portable VCF. |
| October 31, 2026 | License-included pay-as-you-go deployments must transition to portable VCF to remain compliant. |
| August 30, 2027 | Customers with active reserved instances for VCF license-included hosts must exchange their reservations for VCF BYOL reservations or transition those workloads off Azure VMware Solution. |

> [!IMPORTANT]
> If a reservation expires before August 30, 2027, its license-included benefits end when the reservation expires.

## Licensing scope

You can apply portable VCF separately to each Azure VMware Solution private cloud instead of applying it to an entire Azure subscription. You can also use the same VCF key across multiple private clouds by splitting its licensed cores. The total number of registered cores must not exceed the number purchased from Broadcom.

You can have mixed licensing within a private cloud. Existing VCF-included hosts remain covered up to the number of active license-included reserved instances or for pay-as-you-go nodes deployed before October 15, 2025. You must register portable VCF cores for additional hosts or clusters.

You don't associate a license with a specific host or cluster. Register the entitlement on the **Portable VCF (BYOL)** page for the private cloud, and Azure VMware Solution manages billing and compliance for the environment.

## Host quota requirements

Portable VCF doesn't replace the Azure VMware Solution host quota process. Request capacity for the hosts that you plan to deploy, and ensure that your Broadcom-purchased VCF core count covers that capacity.

For instructions, see [Request host quota for Azure VMware Solution](request-host-quota-azure-vmware-solution.md).

## Trial requirements

Azure VMware Solution three-node trials are available to partners and customers for 60 days. You must provide a valid trial VCF key from Broadcom before the trial can be deployed.

After 60 days, trial hosts automatically become billed hosts unless you delete the deployment before the trial ends. Before the trial ends, provide a purchased Broadcom VCF subscription that covers the deployed cores.

## Calculate VCF cores

### Cores for a private cloud

Use the following core counts for each host type:

| Host type | Cores per host |
| --- | --- |
| AV36, AV36P | 36 |
| AV48 | 48 |
| AV52 | 52 |
| AV64 | 64 |

Multiply the number of BYOL hosts by the cores per host. For example, three AV64 BYOL hosts require 192 registered portable VCF cores: 3 hosts * 64 cores per host = 192 cores.

In a mixed-licensing private cloud, register only the cores for BYOL hosts. For example, a private cloud with three license-included AV36P hosts and four BYOL AV36P hosts has 252 deployed cores:

* License-included cores: 3 hosts * 36 cores = 108 cores.
* Portable VCF cores to register: 4 hosts * 36 cores = 144 cores.

> [!NOTE]
> Confirm that your Broadcom subscription covers your planned deployment. When you add BYOL hosts, update the registered core count. If you split a VCF key across private clouds, the sum of registered cores must not exceed your Broadcom entitlement.

### VMware vDefend Firewall add-on cores

VMware vDefend Firewall can be enabled for NSX Distributed Firewall and NSX Gateway Firewall. Calculate add-on cores as follows:

* **NSX Distributed Firewall**: Count all host cores in the private cloud. For example, 10 AV36P hosts require 360 firewall add-on cores: 10 hosts * 36 cores per host = 360 cores.
* **NSX Gateway Firewall**: Multiply the number of NSX edges by the vCPUs per edge, and then multiply by four. For example, two large NSX edges with eight vCPUs each require 64 Gateway Firewall cores: 2 edges * 8 vCPUs * 4 = 64 cores.

If an NSX edge is scaled up to extra large (16 vCPUs) or scaled out, recalculate the Gateway Firewall cores. Azure VMware Solution Generation 2 includes three large NSX edges by default, or four edges when cluster 1 has four or more nodes.

NSX Distributed Firewall is considered enabled when you configure a nondefault Distributed Firewall policy or Distributed Firewall IPFIX profile. NSX Gateway Firewall is considered enabled when you configure a nondefault Gateway Firewall policy.

## VMware vDefend Firewall licensing

VMware vDefend Firewall is an add-on for Azure VMware Solution. If you had an active VCF license-included reservation and enabled vDefend Firewall before October 16, 2025, you can use the same number of eligible firewall cores until the reservation expires or August 30, 2027, whichever occurs first.

Provide a Broadcom vDefend Firewall add-on license when either of the following conditions applies:

* The license-included reservation expires.
* Firewall usage exceeds the eligible VCF-included cores established on October 15, 2025.

Enabling firewall features without purchasing and registering the required Broadcom subscription makes the private cloud noncompliant. Microsoft may suspend a noncompliant private cloud until the issue is resolved.

Not all Broadcom vDefend Firewall features are supported on Azure VMware Solution. Contact your Microsoft account team or Microsoft support to confirm support for a specific feature.

## Security and data handling

Microsoft stores customer-provided VCF BYOL keys and firewall add-on keys in Microsoft-managed key vaults. When you replace or remove a key, Microsoft retains the deconfigured key for 90 days and then removes it from the system.

Only authorized Azure users can view or edit VCF BYOL configurations. Microsoft reports BYOL registrations and associated customer data to Broadcom monthly to meet partner compliance requirements.

You're responsible for managing subscription cores and maintaining compliance with your Broadcom entitlements across all Azure VMware Solution private clouds.

## Legacy email-based registrations

Azure VMware Solution customers who registered VCF BYOL through `registeravsvcfbyol@microsoft.com` before November 2025 were required to re-register each private cloud through the Azure portal by March 31, 2026.

If you haven't completed this migration, register the license details on each private cloud by following [Configure portable VCF on an existing private cloud](vmware-cloud-foundations-license-portability.md#enable-portable-vcf-on-an-existing-azure-vmware-solution-private-cloud). Then contact Microsoft support to confirm the status of the legacy registration.

## Frequently asked questions

### Is portable VCF available in all supported regions and clouds?

Yes. Portable VCF is available in all Azure public and Azure Government regions where Azure VMware Solution is supported.

### What happens if my VCF subscription expires before my reservation ends?

Renew the VCF subscription with Broadcom and update the registration on or before its expiration date. The VCF subscription expiration doesn't affect the Azure VMware Solution reservation, but an expired VCF subscription makes BYOL hosts noncompliant.

### Can I switch from BYOL to Microsoft-managed VCF?

Only private clouds covered by an active VCF license-included reserved instance can switch to Microsoft-managed VCF. New deployments created on or after November 1, 2025 must use BYOL.

### How do I check whether a private cloud is registered?

In the Azure portal, open the private cloud and select **Portable VCF (BYOL)** under **Manage**. The page displays the registration status and license details.

### Do all private clouds in a subscription require BYOL?

You choose licensing for each private cloud. Microsoft-managed VCF can be used only for hosts covered by an active VCF-included reserved instance or pay-as-you-go nodes deployed before October 15, 2025. Register portable VCF for all other hosts.

### What happens if I deploy more cores than Broadcom licensed?

The private cloud becomes noncompliant and is at risk of suspension. Update the registration whenever you add BYOL hosts, and don't register more cores across private clouds than your Broadcom entitlement covers.

## Compliance checklist

* Keep VCF BYOL keys, expiration dates, and core counts current in the Azure portal.
* Keep registered cores across all private clouds within your Broadcom entitlement.
* Register the required vDefend Firewall add-on before enabling firewall features.
* Check the registration status after every configuration change.
* Reconfigure a registration immediately if its status is **Failed**.
* Restrict access to VCF BYOL license keys to authorized users.