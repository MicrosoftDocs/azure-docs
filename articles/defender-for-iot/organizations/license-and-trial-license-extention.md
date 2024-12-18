---
title: Microsoft Defender for IoT license information and trial license extension
description: Learn about the Defender for IoT trial license.
ms.topic: concept-article
ms.date: 11/17/2024
ms.custom: enterprise-iot
---

# Defender for IoT licenses

This article provides an overview about the Microsoft Defender for IoT license and trial license. It also explains how to extend the trial period, if needed, and continue the Proof of Concept (POC) to further explore the value of Defender for IoT.

## The Defender for IoT license

The Defender for IoT license is site-based according to the number of devices that your network has and needs to monitor. This ranges from a site that is an extra-small license for 100 devices to an extra large site license for over 5,000 devices.

Each physical site can only have one license associated with it, so you must purchase the license that covers the number of devices at the site. For example, for a site with 2,000 devices a customer needs to purchase one Extra Large (XL) license (covering up to 5,000 devices) instead of two Large licenses (covering  up to 1,000 devices each). If you need a license for a site with more than 5,000 devices, ask your seller to help you access the 2XL or 3XL licenses in the Azure portal.

Each Microsoft 365 license lasts for one year. A customer could also utilize the volume licensing option to purchase longer term licenses, for more information contact the sales team by [completing this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4hp0oiujZ9PvzH6GeTqtclUMDJCWDBNUVpNTjc1SVdXMDNPWlhUWDEyMi4u).<!-- check this is ok? belle -->

>[!NOTE]
>The OT site license isn't included in the ME5 or E5 security packages.
>

### Preconfigured hardware

Microsoft is partnered with Arrow Electronics to provide preconfigured hardware component appliances for deploying the sensors. To purchase a preconfigured appliance, contact Arrow at: hardware.sales@arrow.com.

For more information, see [OT preconfigured appliances help guide](ot-pre-configured-appliances.md) or the [OT monitoring appliance catalog](appliance-catalog/index.yml).

### Cancelling or renewing a license

Customers can cancel a paid license within seven days of the start of the license and receive a prorated refund. After seven days, turn off the [recurring billing](/microsoft-365/commerce/subscriptions/renew-your-subscription) setting to prevent automatic renewal.​  

The license can be canceled in **Plans and pricing**. To learn more, see [cancel a Defender for IoT plan for OT networks](how-to-manage-subscriptions.md#cancel-a-defender-for-iot-plan-for-ot-networks).​

A license can also be deactivated, for more information, see [cancel your subscription in the Microsoft 365 admin center](/microsoft-365/commerce/subscriptions/cancel-your-subscription).​

Tenants without an active site license have a 30-day grace period from the last expired license to renew the expired licenses. Afterward the 30 days the Defender for IoT service stops, and data retention stops after 90 days.​

### Migrate an Azure Consumption Revenue (ACR) license to the new Microsoft 365 license

To migrate the legacy Azure Consumption Revenue (ACR) license to the new Microsoft 365 license, see [migrate from a legacy OT plan](how-to-manage-subscriptions.md#migrate-from-a-legacy-ot-plan).

## The trial license

A trial license covers a site with up to 1,000 devices for a minimum of 30 days.

During the period of the trial license Defender for IoT gives full security value to all of the devices connected to the site, even if there are more than 1000 devices.

To purchase a full Defender for IoT license at the end of the trial period, see [purchase a Defender for IoT license](how-to-manage-subscriptions.md#purchase-a-defender-for-iot-license).

## Extend a trial license in the Admin Center

If you need more time to evaluate the features and advantages of Defender for IoT the trial license can be extended up until 15 days before the end of the trial. Within the last 15 days the trial can’t be extended.

The trial extension request must be made by a user with Global or Billing Admin permissions on the customer tenant. For more information, see admin roles in [Microsoft 365 Admin Center](https://admin.microsoft.com/Adminportal/Home?#/homepage).

To extend the trial, use:

1. the [Microsoft 365 Admin Center](https://admin.microsoft.com/Adminportal/Home?#/homepage), go to **Marketplace** or **Billing > Purchase Services**, search for **Microsoft Defender for IoT – OT Site license – Trial** and follow the subscription wizard.
1. these instructions to [request an extension for their trial license](/microsoft-365/commerce/try-or-buy-microsoft-365#extend-your-trial).
1. the sale's team [license extension request form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4hp0oiujZ9PvzH6GeTqtclUMDJCWDBNUVpNTjc1SVdXMDNPWlhUWDEyMi4u).

<!-- Belle wanted this added as a blue note to the article. Where is the best place to add this? -->
>[!NOTE]
>
>A trial license can be extended by the customer up until 15 days before the end of the trial using the [Microsoft 365 Admin Center](https://admin.microsoft.com/Adminportal/Home?#/homepage).
>

### Government license customers

GCC customers using the Azure Commercial portal should [contact the sales team](#contact-the-sales-team) to activate the Defender for IoT trial license.  

GCC-H and DoD customers using the Azure Government portal have the Defender for IoT trial license available as part of their plan.

## Contact the sales team

If you still need extra support, reach out to the sales team [to request a trial extension](https://trials.transform.microsoft.com/customer-admin-trials).

## Next steps

For more information, see:

- [Manage Defender for IoT plans for OT monitoring](how-to-manage-subscriptions.md)
- [Manage Defender for IoT plans for Enterprise IoT monitoring](manage-subscriptions-enterprise.md)
- [Operational Technology (OT) networks frequently asked questions](faqs-ot.md)
- [Microsoft Defender for IoT Plans and Pricing](https://www.microsoft.com/security/business/endpoint-security/microsoft-defender-iot-pricing)
