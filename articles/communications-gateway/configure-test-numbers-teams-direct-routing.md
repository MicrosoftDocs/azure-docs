---
title: Set up test numbers for Microsoft Teams Direct Routing with Azure Communications Gateway
description: Learn how to configure Azure Communications Gateway and Microsoft 365 with Microsoft Teams Direct Routing numbers for testing.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 03/31/2024

#CustomerIntent: As someone deploying Azure Communications Gateway, I want to test my deployment so that I can be sure that calls work.
---

# Configure test numbers for Microsoft Teams Direct Routing with Azure Communications Gateway

To test Microsoft Teams Direct Routing with Azure Communications Gateway, you need a test customer tenant with test users and numbers. By following this article, you can set up the required user and number configuration in the customer Microsoft 365 tenant, on Azure Communications Gateway and in your network. You can then start testing.

> [!TIP]
> When you allocate numbers to a real customer, you'll typically need to ask them to change their tenant's configuration, because your organization won't have permission. You'll still need to make configuration changes on Azure Communications Gateway and to your network.

## Prerequisites

You must have at least one number that you can allocate to your test tenant.

You must be able to configure the tenant with at least one user account licensed for Microsoft Teams. You can reuse one of the accounts that you use to activate the customer subdomains in [Configure a test customer for Microsoft Teams Direct Routing](configure-test-customer-teams-direct-routing.md), or you can use an account with one of the other domain names for this tenant.

You must complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)
- [Configure a test customer for Microsoft Teams Direct Routing](configure-test-customer-teams-direct-routing.md)

You must provision Azure Communications Gateway with numbers for integration testing during this procedure.

[!INCLUDE [communications-gateway-provisioning-permissions](includes/communications-gateway-provisioning-permissions.md)]

You must be able to sign in to the Microsoft 365 admin center for your test customer tenant as a Global Administrator.

## Configure the test numbers on Azure Communications Gateway

In [Configure a test customer for Microsoft Teams Direct Routing with Azure Communications Gateway](configure-test-customer-teams-direct-routing.md), you configured Azure Communications Gateway with an account for the test customer.

We recommend using the Number Management Portal (preview) to provision the test numbers. Alternatively, you can use Azure Communications Gateway's Provisioning API (preview).

# [Number Management Portal (preview)](#tab/number-management-portal)

You can configure numbers directly in the Number Management Portal, or by uploading a CSV file containing number configuration.

1. From the overview page for your Communications Gateway resource, find the **Number Management** section in the sidebar. Select **Accounts**.
1. Select the checkbox next to the enterprise's **Account name** and select **View numbers**.
1. Select **Create numbers**.
1. To configure the numbers directly in the Number Management Portal:
    1. Select **Manual input**.
    1. Select **Enable Teams Direct Routing**.
    1. Optionally, enter a value for **Custom SIP header**.
    1. Add the numbers in **Telephone Numbers**.
    1. Select **Create**.
1. To upload a CSV containing multiple numbers:
    1. Prepare a `.csv` file. It must use the headings shown in the following table, and contain one number per line (up to 10,000 numbers).

        | Heading | Description  | Valid values |
        |---------|--------------|--------------|
        | `telephoneNumber`|The number to upload | E.164 numbers, including `+` and the country code |
        | `accountName` | The account to upload the number to | The name of an existing account |
        | `serviceDetails_teamsDirectRouting_enabled`| Whether Microsoft Teams Direct Routing is enabled | `true` or `false`|
        | `configuration_customSipHeader`| Optional: the value for a SIP custom header. | Can only contain letters, numbers, underscores, and dashes. Can be up to 100 characters in length. |

    1. Select **File Upload**.
    1. Select the `.csv` file that you prepared.
    1. Select **Upload**.

# [Provisioning API (preview)](#tab/api)

Use Azure Communications Gateway's Provisioning API to provision the details of the numbers you chose under the account. Enable each number for Teams Direct Routing. For example API requests, see [Add one number to the account](/rest/api/voiceservices/#add-one-number-to-the-account) or [Add or update multiple numbers at once](/rest/api/voiceservices/#add-or-update-multiple-numbers-at-once) in the _API Reference_ for the Provisioning API.

---

## Update your network's routing configuration

Update your network configuration to route calls involving the test numbers to Azure Communications Gateway. For more information about how to route calls to Azure Communications Gateway, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

## Configure users in the test customer tenant

### Create a user and assign a Teams Phone license

Follow [Create a user and assign the license](/microsoftteams/direct-routing-enable-users#create-a-user-and-assign-the-license).

If you're migrating users from Skype for Business Server Enterprise Voice, you must also [ensure that the user is homed online](/microsoftteams/direct-routing-enable-users#ensure-that-the-user-is-homed-online).

### Configure phone numbers for the user and enable enterprise voice

Follow [Configure the phone number and enable enterprise voice](/microsoftteams/direct-routing-enable-users#create-a-user-and-assign-the-license) to assign phone numbers and enable calling.

### Assign Teams Only mode to users

Follow [Assign Teams Only mode to users to ensure calls land in Microsoft Teams](/microsoftteams/direct-routing-enable-users#assign-teams-only-mode-to-users-to-ensure-calls-land-in-microsoft-teams). This step ensures that incoming calls ring in the Microsoft Teams client.

### Assign the voice routing policy with Azure Communications Gateway to users

In [Configure a test customer for Microsoft Teams Direct Routing with Azure Communications Gateway](configure-test-customer-teams-direct-routing.md), you set up a voice route that route calls to Azure Communications Gateway. Assign the voice route to the test users by following the steps for assigning voice routing policies in [Configure call routing for Direct Routing](/microsoftteams/direct-routing-voice-routing).

## Next step

> [!div class="nextstepaction"]
> [Prepare for live traffic](prepare-for-live-traffic-teams-direct-routing.md)

