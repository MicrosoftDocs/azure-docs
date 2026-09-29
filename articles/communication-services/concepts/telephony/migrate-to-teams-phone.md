---
title: Migrate your Azure Communication Services phone numbers to Teams Phone Calling Plans
description: Learn how to migrate your existing Direct Offer numbers into Teams Phone Calling Plans.
author: henikaraa
manager: dariac
services: azure-communication-services

ms.author: henikaraa
ms.date: 06/22/2026
ms.topic: concept-article
ms.service: azure-communication-services
ms.subservice: pstn
---

# Migrate Azure Communication Services phone numbers to Teams Phone Calling Plans

This guide explains how to migrate Azure Communication Services (ACS) phone numbers to Microsoft Teams Phone Calling Plans. It helps you understand the requirements, checks, and manual steps that a successful migration involves. The guidance reflects current restrictions and licensing requirements.

## Migration prerequisites

Whether you can migrate numbers from ACS to Teams Phone Calling Plans depends on the country or region and the supplier of the numbers. Ensure that you meet the following prerequisites:

1. You have a sufficient Calling Plan license.
1. Your ACS numbers have the capabilities that Teams numbers require.
1. Microsoft confirms that the supplier of your ACS numbers matches the Teams Calling Plan supplier.

## Required roles

To start the migration request in the Teams admin center, you need one of the following roles:

- Teams Telephony Administrator
- Teams Communications Administrator
- Teams Administrator

For more information, see [Use Microsoft Teams administrator roles to manage Teams](/microsoftteams/using-admin-roles).

## Pre-migration checks

### Supported regions

- Confirm that your phone number's region supports migration. For example, you currently can't migrate numbers in the Asia-Pacific (APAC) region from ACS to Teams Calling Plans.
- Review the supported regions in [Country and region availability for Audio Conferencing and Calling Plans](/microsoftteams/calling-plan-overview).

> [!NOTE]
> Even if Teams supports a country or region, ACS numbers might not be eligible for migration because of supplier or capability differences. The Microsoft support team can provide more guidance.

### Licensing requirements

Ensure that the destination tenant has the necessary Calling Plan licenses. Teams Calling Plan licensing has specific terms for the number of phone numbers that a customer can hold. Verify that the customer has enough licenses for the ACS numbers that you migrate. To review your licenses:

1. Sign in to the **Microsoft 365 admin center**.
1. Go to **Billing** > **Purchase services** > **Add-on subscriptions**.
1. Check your **Teams Phone add-on licenses** to confirm that you assign them correctly.

The number of phone numbers that you can acquire depends on the type and number of licenses that you have. This migration path currently supports only service numbers. For toll service numbers, the allowance is based on the total number of Teams Phone and Audio Conferencing licenses, as the following examples show:

- 1-25 licenses: 5 phone numbers
- 26-49 licenses: 10 phone numbers
- 50-99 licenses: 20 phone numbers
- 100-149 licenses: 30 phone numbers

The allowance keeps increasing with more licenses, up to 1,500 phone numbers for 50,000 or more licenses. For more information, see the following articles:

- [Microsoft Teams Calling Plans](/microsoftteams/calling-plans-for-office-365)
- [How many phone numbers can you get?](/microsoftteams/how-many-phone-numbers-can-you-get)

### Phone number origin

When you migrate phone numbers from ACS to Microsoft Teams, be aware of how Teams consumes licenses. If you move a number without explicitly porting it, Teams treats it as a newly acquired number and immediately counts it against your license quota, even if you don't assign it to a user. To avoid unexpected license usage, process your migration as a porting operation, and clearly indicate the origin of each number when you submit your request. Ported numbers consume a license only after you activate them, which gives you more flexibility to manage your number inventory.

## Migration process

### Manual migration

Currently, no automated process moves numbers between ACS and Teams. The migration involves manual operations, including uploading numbers and updating configurations.

To start, create a ticket in the telephony portal, and describe your request: [Create a ticket in the Phone Number Service Center](https://pstnsd.powerappsportals.com/create-ticket/). If you can't create a ticket, use the chat option.

Provide the following information when you create the ticket:

- **Title**.
- **Description**: Provide all the relevant details for your request, and specify that the request is part of the Teams Phone extensibility migration:
  - The ACS numbers to migrate to Teams. If you have a large list of numbers, attach a CSV file.
  - The Teams (Microsoft 365) tenant ID that you want to move the numbers to.
  - The Teams number capability: Voice apps or Conference.
  - The number origin, which specifies whether the number was ported to Microsoft Azure or obtained through ACS.
- **Customer profile**: Choose Azure Communication Services.
- **Telephone number country/region**: The originating country or region of the number.
- **Case type**: Choose **Move a number from Office 365 to Azure Communication Services**.
- **Type of number**: Choose the type of ACS number that you move (toll-free or geographic).
- **Azure Immutable Resource ID**: The unique identifier of your ACS resource.
- **Azure Subscription ID**: The unique identifier of your Azure subscription.
- **Requested porting date and time**: The date and time when you want the migration or porting to run.

> [!NOTE]
> Migration requests run during Eastern Time (ET) operational hours (9:00 AM to 5:30 PM, Monday through Friday). The support team contacts you within the next business day.

### Number assignment

In Teams, you assign phone numbers to an entity, such as a user or an application, to route calls. Ensure that the destination tenant has the entities you need for the migrated numbers. To define the usage:

1. Sign in to the **Teams admin center**.
1. Go to **Voice** > **Phone numbers**.
1. Select an unassigned number in the list, and then select **Change usage**.

For more information, see [Manage the usage of a phone number](/microsoftteams/manage-the-usage-of-a-phone-number).

> [!NOTE]
> You can assign a number in the Teams admin center only after the number migrates successfully from ACS to Calling Plan.

### Emergency address update

Update the emergency address information for the migrated numbers. Teams requires an available address for emergency calling, which differs from ACS. Ensure that you also update the address with the carrier. For instructions, see [Manage emergency locations](/microsoftteams/add-change-remove-emergency-location-organization).

### Service disruptions

Service disruptions might occur during the migration. To minimize the impact, plan the migration during off-hours or when the contact center is closed.

## Post-migration checks

### Billing adjustments

Update billing to reflect the migration. Stop billing on the ACS side, and start billing on the Teams side. For more information, see [Release an ACS phone number](/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp-new#release-phone-number).

### Functionality verification

Verify that the migrated numbers work correctly in Teams. Confirm that Teams routes calls correctly and that emergency calling works.

## Related content

- [Migrate your Azure Communication Services Direct Routing to Teams Phone Direct Routing or Operator Connect](migrate-to-teams-direct-routing.md)
- [Microsoft Teams Calling Plans](/microsoftteams/calling-plans-for-office-365)
