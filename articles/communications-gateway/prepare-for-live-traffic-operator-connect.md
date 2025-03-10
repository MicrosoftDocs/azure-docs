---
title: Prepare for Operator Connect or Teams Phone Mobile live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your Teams Phone Mobile or Operator Connect service.
author: GemmaWakeford
ms.author: gwakeford
ms.service: azure-communications-gateway
ms.topic: how-to
ms.date: 02/16/2024
---

# Prepare for live traffic with Operator Connect, Teams Phone Mobile and Azure Communications Gateway

Before you can launch your Operator Connect or Teams Phone Mobile service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your onboarding team must take.

> [!TIP]
> This article assumes that your Azure Communications Gateway onboarding team from Microsoft is also onboarding you to Operator Connect and/or Teams Phone Mobile. If you've chosen a different onboarding partner for Operator Connect or Teams Phone Mobile, you need to ask them to arrange changes to the Operator Connect and/or Teams Phone Mobile environments.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. For example, you'll need to wait at least seven days for automated testing of your deployment and schedule your launch date at least two weeks in advance. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

- You must [deploy Azure Communications Gateway](deploy.md) using the Microsoft Azure portal and [connect it to Operator Connect or Teams Phone Mobile](connect-operator-connect.md).
- You must know the test numbers to use for integration testing and for service verification (continuous call testing). These numbers can't be the same. You chose them as part of [deploying Azure Communications Gateway](deploy.md#prerequisites) or [connecting it to Operator Connect or Teams Phone Mobile](connect-operator-connect.md#prerequisites).

  - Integration testing allows you to confirm that Azure Communications Gateway and Microsoft Phone System are interoperating correctly with your network.
  - Service verification is set up by the Operator Connect and Teams Phone Mobile programs. It ensures that your deployment is able to handle calls from Microsoft Phone System throughout the lifetime of your deployment.

- You must have a tenant you can use for integration testing (representing an enterprise customer), and some users in that tenant to whom you can assign the numbers for integration testing.

  - If you don't already have a suitable test tenant, you can use the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program), which provides E5 licenses.
  - The test users must be licensed for Teams Phone System and in Teams Only mode.

- You must have access to the following configuration portals.

    |Configuration portal  |Required permissions |
    |---------|---------|
    |[Operator Connect portal](https://operatorconnect.microsoft.com/) | `Admin` role or `PartnerSettings.Read` and `NumberManagement.Write` roles (configured on the Project Synergy enterprise application that you set up when [you connected to Operator Connect or Teams Phone Mobile](connect-operator-connect.md#add-the-project-synergy-application-to-your-azure-tenant))|
    |[Teams Admin Center](https://admin.teams.microsoft.com/) for your test tenant |User management|

- If you plan to use Azure Communications Gateway's Provisioning API (preview) to upload numbers to the Operator Connect environment, you must be able to make requests using [a client integrated with the API](integrate-with-provisioning-api.md). You must also have access to the [API Reference](/rest/api/voiceservices).

- If you plan to use Azure Communications Gateway's Number Management Portal (preview) to configure numbers for integration testing, you must have **Reader** access to the Azure Communications Gateway resource and **ProvisioningAPI.ReadUser** and **ProvisioningAPI.WriteUser** roles for the AzureCommunicationsGateway enterprise application.

[!INCLUDE [communications-gateway-oc-configuration-ownership](includes/communications-gateway-oc-configuration-ownership.md)]

## Methods

In some parts of this article, the steps you must take depend on whether you're using the Provisioning API (preview), the Number Management Portal (preview), or the Operator Connect portal and APIs. This article provides instructions for each option. Choose the appropriate instructions.

## Ask your onboarding team to register your test enterprise tenant

Your onboarding team must register the test enterprise tenant that you chose in [Prerequisites](#prerequisites) with Microsoft Teams.

1. Find your company's "Operator ID" in your [operator configuration in the Operator Connect portal](https://operatorconnect.microsoft.com/operator/configuration).
1. Provide your onboarding contact with:

    - Your company's name.
    - Your company's Operator ID.
    - The ID of the tenant to use for testing.

1. Wait for your onboarding team to confirm that your test tenant has been registered.

## Set up your test tenant

Integration testing requires setting up your test tenant for Operator Connect or Teams Phone Mobile and configuring users in this tenant with the numbers you chose for integration testing.

> [!IMPORTANT]
> Do not assign the service verification numbers to test users. Your onboarding team arranges configuration of your service verification numbers.

1. In your test tenant, request service from your company.
    1. Sign in to the [Teams Admin Center](https://admin.teams.microsoft.com/) for your test tenant.
    1. Select **Voice** > **Operators**.
    1. Select your company in the list of operators, fill in the form and select **Add as my operator**.
1. In your test tenant, create some test users (if you don't already have suitable users). License the users for Teams Phone System and place them in Teams Only mode.
1. Configure emergency locations in your test tenant.
1. Upload numbers for integration testing over the Provisioning API (preview), in the Number Management Portal (preview), or using the Operator Connect Operator Portal.

    # [Provisioning API (preview)](#tab/provisioning-api)

    The following steps summarize the requests you must make to the Provisioning API. For full details of the relevant API resources, see the [API Reference](/rest/api/voiceservices).

    1. Find the _RFI_ (Request for information) resource for your test tenant and update the `status` property of its child _Customer Relationship_ resource to indicate the agreement has been signed.
    1. Create an _Account_ resource that represents the customer. Enable backend service sync for the account.
    1. Create a _Number_ resource as a child of the Account resource for each test number.

    # [Number Management Portal (preview)](#tab/number-management-portal)

    1. From the overview page for your Communications Gateway resource, find the **Number Management (Preview)** section in the sidebar.
    1. Select **Requests for Information**.
    1. Select your test tenant.
    1. Select **Update relationship status**. Use the drop-down to set the status to **Agreement signed**.
    1. Select **Create account**. Fill in the fields as required (including **Sync with backend service**) and select **Create**.
    1. Select **View account**.
    1. Select **View numbers** and select **Create numbers**.
    1. Fill in the fields under **Manual Input** as required, and then select **Create**.
    
    # [Operator Portal](#tab/no-flow-through)

    1. Ask your onboarding team for the name of the Calling Profile that you must use for these test numbers. The name typically has the suffix `CommsGw`. We created this Calling Profile for you during the Azure Communications Gateway deployment process.
    1. Open the Operator Portal.
    1. Select **Customer Consents**.
    1. Select your test tenant.
    1. Select **Update Relationship**. Set the status to **Agreement signed**.
    1. Select the link for your test tenant. The link opens **Number Management** > **Manage by Tenant**.
    1. Select **Upload Numbers**.
    1. Fill in the fields as required, and then select **Submit**.

    ---
1. In your test tenant, assign these numbers to your test users.
    1. Sign in to the Teams Admin Center for your test tenant.
    1. Select **Voice** > **Phone numbers**.
    1. Select a number, then select **Edit**.
    1. Assign the number to a user.
    1. Repeat for all your test users.

## Update your network's routing configuration

Your network must route calls for service verification testing and for integration testing to Azure Communications Gateway.

1. Route all calls from any service verification number to any other service verification number back to Microsoft Phone System through Azure Communications Gateway.
2. Route calls involving the test numbers for integration testing in the same way that you expect to route customer calls.

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling and media flows used for call hold and session refresh.

You must test typical call flows for your network. We recommend that you follow the example test plan from your onboarding team. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team to make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## Run a connectivity test and upload proof

Before you can launch, Microsoft Teams requires proof that your network is properly connected to Microsoft's network.

1. Provide your onboarding team with proof that BFD is enabled. You should have enabled BFD when you [connected Azure Communications Gateway to your networks](deploy.md#connect-azure-communications-gateway-to-your-networks) as part of deploying. For example, if you have a Cisco router, you can provide configuration similar to the following.

    ```text
    interface TenGigabitEthernet2/0/0.150
       description private peering to Azure
       encapsulation dot1Q 15 second-dot1q 150
       ip vrf forwarding 15
       ip address 192.168.15.17 255.255.255.252
       bfd interval 150 min_rx 150 multiplier 3

    router bgp 65020
       address-family ipv4 vrf 15
          network 10.1.15.0 mask 255.255.255.128
          neighbor 192.168.15.18 remote-as 12076
          neighbor 192.168.15.18 fall-over bfd
          neighbor 192.168.15.18 activate
          neighbor 192.168.15.18 soft-reconfiguration inbound
       exit-address-family
    ```

1. Test failover of the connectivity to your network. Your onboarding team will work with you to plan this testing and gather the required evidence.
1. Work with your onboarding team to validate emergency call handling.

## Get your go-to-market resources approved

Before you can go live, you must get your customer-facing materials approved by Microsoft Teams. Provide the following to your onboarding team for review.

- Press releases and other marketing material
- Content for your landing page
- Logo for the Microsoft Teams Operator Directory (200 px by 200 px)
- Logo for the Microsoft Teams Admin Center (170 px by 90 px)

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

## Learn about monitoring and maintenance

[!INCLUDE [monitoring and service health notifications](includes/communications-gateway-monitoring-maintenance.md)]

## Verify API integration

Your onboarding team must provide Microsoft with proof that you have integrated with the Microsoft Teams Operator Connect APIs for provisioning. Choose the appropriate instructions for your deployment.

# [Provisioning API (preview)](#tab/provisioning-api)

Your onboarding team can obtain proof automatically. You don't need to do anything.

# [Number Management Portal (preview)](#tab/number-management-portal)

You can't use the Number Management Portal after you launch your service, because the Operator Connect and Teams Phone Mobile programs require full API integration. You can integrate with Azure Communications Gateway's [Provisioning API](provisioning-platform.md) or directly with the Operator Connect API.

If you integrate with the Provisioning API, your onboarding team can obtain proof automatically.

If you integrate with the Operator Connect API, provide your onboarding team with proof of successful Operator Connect API calls for:

- Partner consent
- TN Upload to Account
- Unassign TN
- Release TN

# [Operator Connect APIs](#tab/no-flow-through)

Provide your onboarding team with proof of successful API calls for:

- Partner consent
- TN Upload to Account
- Unassign TN
- Release TN

---

## Arrange synthetic testing

Your onboarding team must arrange synthetic testing of your deployment. This synthetic testing is a series of automated tests lasting at least seven days. It verifies the most important metrics for quality of service and availability.

After launch, synthetic traffic will be sent through your deployment using your test numbers. This traffic is used to continuously check the health of your deployment.

## Schedule launch

Your launch date is the date that you appear to enterprises in the Teams Admin Center. Your onboarding team must arrange this date by making a request to Microsoft Teams.

Your service can be launched on specific dates each month. Your onboarding team must submit the request at least two weeks before your preferred launch date.

## Next steps

- Wait for your launch date.
- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [using the Number Management Portal to manage enterprises](manage-enterprise-operator-connect.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [maintenance notifications](maintenance-notifications.md).
