---
title: Set up test numbers for Microsoft Teams Direct Routing with Azure Communications Gateway
description: Learn how to configure Azure Communications Gateway and Microsoft 365 with Microsoft Teams Direct Routing numbers for testing.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As someone deploying Azure Communications Gateway, I want to test my deployment so that I can be sure that calls work.
---

# Configure test numbers for Microsoft Teams Direct Routing with Azure Communications Gateway

To test Microsoft Teams Direct Routing with Azure Communications Gateway, you need a test customer tenant with test users and numbers. By following this article, you can set up the required user and number configuration in the customer Microsoft 365 tenant, on Azure Communications Gateway and in your network. You can then start testing.

> [!TIP]
> When you allocate numbers to a real customer, you'll typically need to ask them to change their tenant's configuration, because your organization won't have permission. You'll still need to make configuration changes on Azure Communications Gateway and to your network.

## Prerequisites

You must have at least one number that you can allocate to your test tenant.

You must complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)
- [Configure a test customer for Microsoft Teams Direct Routing](configure-test-customer-teams-direct-routing.md)

Your organization must [integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md). Someone in your organization must be able to make requests using the Provisioning API during this procedure.
You must be able to sign in to the Microsoft 365 admin center for your test customer tenant as a Global Administrator.

## Configure the test numbers on Azure Communications Gateway with the Provisioning API

In [Configure a test customer for Microsoft Teams Direct Routing with Azure Communications Gateway](configure-test-customer-teams-direct-routing.md), you configured Azure Communications Gateway with an account for the test customer.

Use Azure Communications Gateway's Provisioning API to provision the details of the numbers you chose under the account. Enable each number for Teams Direct Routing.

## Update your network's routing configuration

Update your network configuration to route calls involving the test numbers to Azure Communications Gateway. For more information about how to route calls to Azure Communications Gateway, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

## Configure users in the test customer tenant

### Create a user and assign a Teams Phone license

Follow [Create a user and assign the license](/microsoftteams/direct-routing-enable-users#create-a-user-and-assign-the-license).

If you are migrating users from Skype for Business Server Enterprise Voice, you must also [ensure that the user is homed online](/microsoftteams/direct-routing-enable-users#ensure-that-the-user-is-homed-online).

### Configure phone numbers for the user and enable enterprise voice

Follow [Configure the phone number and enable enterprise voice](/microsoftteams/direct-routing-enable-users#create-a-user-and-assign-the-license) to assign phone numbers and enable calling.

### Assign Teams Only mode to users

Follow [Assign Teams Only mode to users to ensure calls land in Microsoft Teams](/microsoftteams/direct-routing-enable-users#assign-teams-only-mode-to-users-to-ensure-calls-land-in-microsoft-teams). This step ensures that incoming calls ring in the Microsoft Teams client.

### Assign the voice routing policy with Azure Communications Gateway to users

In [Configure a test customer for Microsoft Teams Direct Routing with Azure Communications Gateway](configure-test-customer-teams-direct-routing.md), you set up a voice route that route calls to Azure Communications Gateway. Assign the voice route to the test users by following the steps for assigning voice routing policies in [Configure call routing for Direct Routing](/microsoftteams/direct-routing-voice-routing).

## Next step

> [!div class="nextstepaction"]
> [Prepare for live traffic](prepare-for-live-traffic-teams-direct-routing.md)

