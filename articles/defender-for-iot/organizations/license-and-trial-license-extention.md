---
title: Microsoft Defender for IoT license information and trial license extension
description: Learn about the Defender for IoT trial license.
ms.topic: concept-article
ms.date: 11/17/2024
ms.custom: enterprise-iot
---

# Defender for IoT licenses

This article contains general information about the Microsoft Defender for IoT license, trial license and, if needed, how to extend the length of the trial and continue the Proof Of Concept (POC) to experience the value of Defender for IoT.

## The Defender for IoT license

The Defender for IoT license is site-based according to the number of devices that your network has and needs to monitor. This ranges from a site that is an extra-small license for 100 devices to an extra large site license for over 5,000 devices.

Each site can only have one license associated with it, so you must purchase the license that covers the number of devices at the site. For example, a site with more than 1000 devices customers need to purchase one XL license (covering 5000 devices) instead of two Large licenses (covering 1000 devices each). The only exception is the XL license, which can have multiple licenses applied to one site if there are more than 5000 OT devices there.

If your network has even more than 5,000 devices a customer should contact their representative to find out how to access the 2XL or 3XL licenses in the Azure portal.

Each Microsoft 365 license lasts for one year. <!-- is this the correct license name? -->The OT site license isnt't included in the ME5 or E5 security packages.

### Preconfigured hardware

Microsoft has partnered with Arrow Electronics to provide pre-configured hardware component appliances for deploying the sensors<!-- is this correct? are these the sensors? What is the hardware for? -->. To purchase a pre-configured appliance, contact Arrow at: hardware.sales@arrow.com.

For more details, see [OT pre-configured appliances help guide](ot-pre-configured-appliances.md) or the [OT monitoring appliance catalog](appliance-catalog/index.yml).

### Cancelling or renewing a license

Customers can cancel a paid license within seven days of the start of the license and recieve a prorated refund. After seven days, they should [turn off recurring billing](/microsoft-365/commerce/subscriptions/renew-your-subscription) to prevent automatic renewal.​

A customer can also deactivate a license. For more information, see [cancel your subscription in the Microsoft 365 admin center](/microsoft-365/commerce/subscriptions/cancel-your-subscription).​

A customer can cancel the license from **Plans and pricing**. To learn more, see [cancel a Defender for IoT plan for OT networks](how-to-manage-subscriptions.md#cancel-a-defender-for-iot-plan-for-ot-networks).​

Tenants without an active site license have a 30-day grace period from the last expired license to renew the expired licenses. Afterward the 30 days the Defender for IoT service stops, and data retention stops after 90 days.​

### Migrate an Azure Consumption Revenue (ACR) license to the new M365 license

To migrate from the legacy Azure Consumption Revenue (ACR) license to the new Microsoft 365 license, see [migrate from a legacy OT plan](how-to-manage-subscriptions.md#migrate-from-a-legacy-ot-plan).

If you still need extra support, reach out to the sales team by [completing this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4hp0oiujZ9PvzH6GeTqtclUMDJCWDBNUVpNTjc1SVdXMDNPWlhUWDEyMi4u).

## The trial license

A trial license covers a site with up to 1000 devices for a minimum of 30 days, if this isn't enough time to decide if the product meets your needs you can [extend the trial license](#extend-a-trial-license-in-the-admin-center).

During the period of the trial license Defender for IoT doesn't enforce the maximum number of devices for a site allowing you to connect to more that 1000 devices, if nessecary. Even with more that 1000 devices the customer continues to receive the full security benefits of Defender for IoT. However, at the end of the trial license period the customer needs to purchase a new license that is updated to the appropriate size for their network.​

To purchase a full Defender for IoT license at the end of the trial period, see [purchase a Defender for IoT license](how-to-manage-subscriptions.md#purchase-a-defender-for-iot-license).

## Extend a trial license in the Admin Center

A trial license can be extended by the customer up until 15 days before the end of the trial using the [Microsoft 365 Admin Center](https://admin.microsoft.com/Adminportal/Home?#/homepage).

Customers with either MCA or MOSA billing accounts can use these instructions to [request an extension for their trial license](/microsoft-365/commerce/try-or-buy-microsoft-365#extend-your-trial). This request must be made by a user with Global or Billing Admin permissions on the customer tenant. For more information, see [admin roles in Microsoft 365 admin center](/microsoft-365/admin/add-users/about-admin-roles).

## Contact the sales team

If you still need extra support, reach out to the sales team [to request a trial extension](https://trials.transform.microsoft.com/customer-admin-trials).

Any GCC or Azure Commercial Governmental customers should reach out to the sales team to activate the Defender for IoT license. Any GCC-H, DoD or Azure Government customers should have Defender for IoT activated as part of their plan.

## Next steps

For more information, see:

- [Manage Defender for IoT plans for OT monitoring](how-to-manage-subscriptions.md)
- [Manage Defender for IoT plans for Enterprise IoT monitoring](manage-subscriptions-enterprise.md)
- [Operational Technology (OT) networks frequently asked questions](faqs-ot.md)
- [Microsoft Defender for IoT Plans and Pricing](https://www.microsoft.com/security/business/endpoint-security/microsoft-defender-iot-pricing)
