---
title: Set up Azure Operator Call Protection Preview
description: Start using Azure Operator Call Protection to protect your customers against fraud.
author: rcdun
ms.author: rdunstan
ms.service: azure
ms.topic: how-to
ms.date: 01/31/2024
ms.custom:
    - update-for-call-protection-service-slug

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---
# Set up Azure Operator Call Protection Preview

Before you can launch your Azure Operator Call Protection  Preview service, you and your onboarding team must:

- Provision your subscribers.
- Test your service.
- Prepare for launch.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

If you don't already have Azure Communications Gateway, complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json).
- [Deploy Azure Communications Gateway](../communications-gateway/deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json).

## Enable Azure Operator Call Protection Preview

> [!NOTE]
> If you selected Azure Operator Call Protection Preview when you [deployed Azure Communications Gateway](../communications-gateway/deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json), skip this step and go to [Provision subscribers](#provision-subscribers).

Navigate to your Azure Communications Gateway resource and find the **Call Protection** option on the **Overview**.
If Call Protection is **Disabled**, update it to **Enabled** and notify your Microsoft onboarding team.

:::image type="content" source="media/enable-azure-operator-call-protection-on-existing.png" alt-text="Screenshot of Azure Operator Call Protection on the Overview pane of Azure Communications Gateway." lightbox="media/enable-azure-operator-call-protection-on-existing.png":::

## Provision subscribers

Provisioning subscribers requires creating an account for each group of subscribers and then adding the details of each number to the account.

[!INCLUDE [communications-gateway-provisioning-permissions](../communications-gateway/includes/communications-gateway-provisioning-permissions.md)]

The following steps describe provisioning subscribers using the Number Management Portal.

### Create an account

You must create an *account* for each group of subscribers that you manage with the Number Management Portal.

1. From the overview page for your Communications Gateway resource, find the **Number Management (Preview)** section in the sidebar.
1. Select **Accounts**.
1. Select **Create account**.
1. Fill in an **Account name**.
1. Select **Enable Azure Operator Call Protection**.
1. Select **Create**.

### Manage numbers

1. In the sidebar, locate the **Number Management (Preview)** section and select **Accounts**. Select the **Account name**.
1. Select **View numbers** to go to the number management page.
1. To add new numbers:
    - To configure the numbers directly in the Number Management Portal:
        1. Select **Manual input**.
        1. Select **Enable Azure Operator Call Protection**.
        1. The **Custom SIP header value** is not used by Azure Operator Call Protection - leave it blank.
        1. Add the numbers in **Telephone Numbers**.
        1. Select **Create**.
    - To upload a CSV containing multiple numbers:
        1. Prepare a `.csv` file. It must use the headings shown in the following table, and contain one number per line (up to 10,000 numbers).

            | Heading | Description  | Valid values |
            |---------|--------------|--------------|
            | `telephoneNumber`|The number to upload | E.164 numbers, including the country code |
            | `accountName` | The account to upload the number to | The name of an account you've already created |
            | `serviceDetails_azureOperatorCallProtection_enabled`| Whether Azure Operator Call Protection is enabled | `true` or `false`|

        1. Select **File Upload**.
        1. Select the `.csv` file that you prepared.
        1. Select **Upload**.
1. To remove numbers:
    1. Select the numbers.
    1. Select **Delete numbers**.
    1. Wait 30 seconds, then select **Refresh** to confirm that the numbers have been removed.

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements.
For example, this process often includes interworking header formats and/or the signaling and media flows used for call hold and session refresh.

The connection to Azure Operator Call Protection Preview is over SIPREC.
The Operator Call Protection service takes the role of the SIPREC Session Recording Server (SRS).
An element in your network, typically a session border controller (SBC), is set up as a SIPREC Session Recording Client (SRC).

Work with your onboarding team to produce a network architecture plan where an element in your network can act as an SRC for calls being routed to your Azure Operator Call Protection enabled subscribers.

- If you decide that you need changes to Azure Communications Gateway or Azure Operator Call Protection, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

> [!NOTE]
> Remove Azure Operator Call Protection support from a subscriber by updating your network routing, then removing the subscribers using the [manage number](#manage-numbers) section.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems. See [Get support or request changes for Azure Communications Gateway](../communications-gateway/request-changes.md).

## Learn about monitoring Azure Operator Call Protection Preview

Your operations team can use a selection of key metrics to monitor Azure Operator Call Protection Preview through your Azure Communications Gateway.
These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway.
See [Monitoring Azure Communications Gateway](../communications-gateway/monitor-azure-communications-gateway.md).

## Next steps

- Learn about [monitoring Azure Operator Call Protection Preview with Azure Communications Gateway](../communications-gateway/monitor-azure-communications-gateway.md).
