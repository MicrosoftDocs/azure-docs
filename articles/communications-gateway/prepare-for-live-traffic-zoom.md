---
title: Prepare for Zoom Phone Cloud Peering live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you must carry out further integration work before you can launch your Zoom Phone Cloud Peering service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/25/2024
---

# Prepare for live traffic with Zoom Phone Cloud Peering and Azure Communications Gateway

Before you can launch your Zoom Phone Cloud Peering service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your Azure Communications Gateway onboarding team must take.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

Complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Connect Azure Communications Gateway to Zoom Phone Cloud Peering](connect-zoom.md)

[Choose test numbers](connect-zoom.md#prerequisites). You need two types of test number:
- Integration testing by your staff.
- Service verification (continuous call testing) by your chosen communication services.

You must provision Azure Communications Gateway with the numbers for integration testing during this procedure.

[!INCLUDE [communications-gateway-provisioning-permissions](includes/communications-gateway-provisioning-permissions.md)]

You must be an owner or admin of a Zoom account that you want to use for testing.

You must be able to contact your Zoom representative.

## Configure the test numbers for integration testing on Azure Communications Gateway

You must provision Azure Communications Gateway with the details of the test numbers for integration testing. This provisioning allows Azure Communications Gateway to identify that the calls should have Zoom service.

> [!IMPORTANT]
> Do not provision the service verification numbers for Zoom. Azure Communications Gateway routes calls involving those numbers automatically. Any provisioning you do for those numbers has no effect.

We recommend using the Number Management Portal (preview) to provision the test numbers. Alternatively, you can use Azure Communications Gateway's Provisioning API (preview).

# [Number Management Portal (preview)](#tab/number-management-portal)

1. From the overview page for your Communications Gateway resource, find the **Number Management** section in the sidebar. Select **Accounts**.
1. Select **Create account**. Enter an **Account name** and select the **Enable Zoom Phone Cloud Peering** checkbox. Select **Create**.
1. Select the checkbox next to the new **Account name** and select **View numbers**.
1. Select **Create numbers**.
1. Fill in the fields as required under **Manual Input**, and then select **Create**.

# [Provisioning API (preview)](#tab/provisioning-api)

The API allows you to indicate to Azure Communications Gateway which service you're supporting for each number, using _account_ and _number_ resources.

- Account resources are descriptions of your customers (typically, an enterprise), and per-customer settings for service provisioning.
- Number resources belong to an account. They describe numbers, the services (for example, Zoom) that the numbers make use of, and any extra per-number configuration.

Use the Provisioning API for Azure Communications Gateway to:

- Provision an account to group the test numbers. Enable Zoom service for the account.
- Provision the details of the numbers you chose under the account. Enable each number for Zoom service.

For example API requests, see [Create an account to represent a customer](/rest/api/voiceservices/#create-an-account-to-represent-a-customer) and [Add one number to the account](/rest/api/voiceservices/#add-one-number-to-the-account) or [Add or update multiple numbers at once](/rest/api/voiceservices/#add-or-update-multiple-numbers-at-once) in the _API Reference_ for the Provisioning API.

---

## Configure users in Zoom with the test numbers for integration testing

Upload the numbers for integration testing to Zoom. When you upload numbers, you can optionally configure Zoom to add a header containing custom contents to SIP INVITEs. You can use this header to identify the Zoom account for the number or indicate that these numbers are test numbers. For more information on this header, see Zoom's _Zoom Phone Provider Exchange Solution Reference Guide_.

Use [https://support.zoom.us/hc/en-us/articles/360020808292-Managing-phone-numbers](https://support.zoom.us/hc/en-us/articles/360020808292-Managing-phone-numbers) to assign the numbers for integration testing to the user accounts that you need to use for integration testing. Integration testing is part of preparing for live traffic.

> [!IMPORTANT]
> Do not assign the service verification numbers to Zoom user accounts. In the next step, you will ask your Zoom representative to configure the service verification numbers for you.

## Provide Zoom with the details of the service verification numbers

Ask your Zoom representative to set up the resiliency and failover verification tests using the service verification numbers. Zoom must map the service verification numbers to datacenters in ascending numerical order. For example, if you allocated +19075550101 and +19075550102, Zoom must map +19075550101 to the datacenters for DID 1 and +19075550102 to the datacenters for DID 2.

This ordering matches how Azure Communications Gateway routes calls for these tests, so allows Azure Communications Gateway to pass the tests.

## Update your network's routing configuration for the test numbers

Update your network configuration to route calls involving all the test numbers to Azure Communications Gateway. For more information about how to route calls to Azure Communications Gateway, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling and media flows used for call hold and session refresh.

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.
- If you need changes to Zoom configuration, you must arrange those changes with Zoom.

## Run connectivity tests and provide proof to Zoom

Before you can launch, Zoom requires proof that your network is properly connected to their servers. The testing you need to carry out is described in Zoom's _Zoom Phone Provider Exchange Solution Reference Guide_ or other documentation provided by your Zoom representative.

You must capture the signaling in your network and provide the proof to your Zoom representative.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

> [!NOTE]
> If we think a problem is caused by traffic from Zoom servers, we might ask you to raise a separate support request with Zoom. Ensure you also know how to raise a support request with Zoom.

## Learn about monitoring and maintenance

[!INCLUDE [monitoring and service health notifications](includes/communications-gateway-monitoring-maintenance.md)]

## Schedule launch

Your launch date is the date that you'll be able to start selling Zoom Phone Cloud Peering service. You must arrange this date with your Zoom representative.

## Related content

- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [maintenance notifications](maintenance-notifications.md).
