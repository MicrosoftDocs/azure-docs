---
title: Manage Zoom Phone Cloud Peering customers on Azure Communications Gateway
description: Learn how to configure Azure Communications Gateway and Microsoft 365 for a Zoom Phone Cloud Peering customer.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/25/2024
ms.custom: template-how-to-pattern

#CustomerIntent: As someone provisioning Azure Communications Gateway for Zoom Phone Cloud Peering, I want to add or remove customers and accounts so that I can provide service.
---

# Manage Zoom Phone Cloud Peering customers and numbers with Azure Communications Gateway

Providing Zoom Phone Cloud Peering service with Azure Communications Gateway requires configuration on Azure Communications Gateway. This article provides guidance on how to set up Cloud Peering for a customer, including:

* Setting up a new customer.
* Managing numbers for a customer, including optionally configuring a custom header.

## Prerequisites

[Connect Azure Communications Gateway to Zoom Phone Cloud Peering](connect-zoom.md).

During this procedure, you provision Azure Communications Gateway with the details of the enterprise customer tenant and numbers for the enterprise.

[!INCLUDE [communications-gateway-provisioning-permissions](includes/communications-gateway-provisioning-permissions.md)]

## Go to your Communications Gateway resource

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.

## Manage Zoom Phone Cloud Peering service for the customer

To provide service for an enterprise, you must create an *account* for the enterprise. Accounts contain per-customer settings for service provisioning.

# [Number Management Portal (preview)](#tab/number-management-portal)

1. From the overview page for your Communications Gateway resource, find the **Number Management** section in the sidebar. Select **Accounts**.
1. If you're providing service for the first time:
    1. Select **Create account**.
    1. Enter an **Account name** and select the **Enable Zoom Phone Cloud Peering** checkbox. Select **Create**.
1. If you need to change an existing account, select the checkbox next to the account name and select **Manage account** to make your changes.

# [Provisioning API (preview)](#tab/provisioning-api)

Use the Provisioning API for Azure Communications Gateway to create an account and configure Zoom service for the account.

For example API requests, see [Create an account to represent a customer](/rest/api/voiceservices/#create-an-account-to-represent-a-customer) in the _API Reference_ for the Provisioning API.

---

## Manage numbers for the customer

You need to assign numbers to the customer's account to allow Azure Communications Gateway to route calls correctly.

# [Number Management Portal (preview)](#tab/number-management-portal)

To add new numbers, you can configure the numbers directly in the Number Management Portal or upload a CSV file containing number configuration:

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
        | `serviceDetails_zoomPhoneCloudPeering_enabled`| Whether Zoom Phone Cloud Peering is enabled | `true` or `false`|
        | `configuration_customSipHeader`| Optional: the value for a SIP custom header. | Can only contain letters, numbers, underscores, and dashes. Can be up to 100 characters in length. |

    1. Select **File Upload**.
    1. Select the `.csv` file that you prepared.
    1. Select **Upload**.

To change or remove existing numbers:

1. From the overview page for your Communications Gateway resource, find the **Number Management** section in the sidebar. Select **Accounts**.
1. Select the checkbox next to the customer's **Account name** and select **View numbers**.
1. Select the checkbox next to the number you want to change or remove and select **Edit number** or **Delete numbers**.

# [Provisioning API (preview)](#tab/provisioning-api)

Use the Provisioning API for Azure Communications Gateway to provision the details of the numbers under the account. Enable each number for Zoom service.

For example API requests, see [Add one number to the account](/rest/api/voiceservices/#add-one-number-to-the-account) or [Add or update multiple numbers at once](/rest/api/voiceservices/#add-or-update-multiple-numbers-at-once) in the _API Reference_ for the Provisioning API.

---

## Next step

> [!div class="nextstepaction"]
> [Learn about the metrics you can use to monitor calls.](monitoring-azure-communications-gateway-data-reference.md)
