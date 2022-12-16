---
title: Prepare for live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 12/14/2022
---

# Prepare for live traffic with Azure Communications Gateway

Before you can launch your Operator Connect or Teams Phone Mobile service, you and your onboarding team must:

- Integrate Azure Communications Gateway with your network.
- Test your service.
- Prepare for launch.

In this article, you learn about the steps you and your onboarding team must take.

> [!TIP]
> In many cases, your onboarding team is from Microsoft.

## Prerequisites

- You must have [deployed Azure Communications Gateway](deploy.md) using the Microsoft Azure portal.
- You must have [chosen some test numbers](prepare-to-deploy.md#prerequisites)
- You must have a tenant you can use for testing (representing an enterprise customer), and some users in that tenant to whom you can assign the test numbers.
- You must have access to the:
  - [Operator Connect portal](https://operatorconnect.microsoft.com/)
  - Teams Admin Center for your test tenant
- You must be able to manage users in your test tenant

## Methods

In some parts of this article, the steps you must take depend on whether your deployment includes the API Bridge. This article provides instructions for both types of deployment. Choose the appropriate instructions.

## 1. Connect Azure Communications Gateway to your networks

> [!WARNING]
> TODO: who sets up the Teams trunks?

1. Configure your network devices to send and receive traffic from Azure Communications Gateway. You might need to configure SBCs, softswitches and access control lists (ACLs).
1. Configure your routers and peering connection to ensure all traffic to AzCoG is through the Microsoft Azure Peering Service (MAPS) for Voice.
1. Enable Bidirectional Forwarding Detection (BFD) on your on-premises edge routers to speed up link failure detection. With MAPS, BFD must bring up the BGP peer for each Private Network Interface (PNI).
1. Meet any other requirements in the _Network Connectivity Specification_ for Operator Connect or Teams Phone Mobile.

## 2. Register your test enterprise tenant

You and your onboarding team must carry out testing. You must register a tenant for this testing with Microsoft Teams.

1. Provide your onboarding contact with:
    - Your company's name.
    - Your company's ID ("Operator ID").
    - The ID of the tenant to use for testing.
2. Wait for your onboarding team to confirm that your test tenant has been registered.

## 3. Assign numbers to test users in your tenant

> [!WARNING]
> TODO: confirm how the customer gets the Calling Profile. Is it the onboarding team, AzCoG team, or do they have to set it up (another step)?

> [!WARNING]
> TODO: how do customers get to the swivel-chair portal?

1. Confirm the name of the Calling Profile that you must use for these test numbers.
1. In your test tenant, request service from your company.
    1. Sign in to the Teams Admin Center for your test tenant.
    1. Select **Voice** > **Operators**.
    1. Select your company in the list of operators, fill in the form and select **Add as my operator**.
1. In your test tenant, create some test users (if you don't already have suitable users). These users must be licensed for Teams Phone System and in Teams Only mode.
1. Configure emergency locations in your test tenant.
1. Upload numbers in the swivel-chair portal provided by the API Bridge (if you deployed the API Bridge) or the Operator Connect Operator Portal.

    # [API Bridge swivel-chair portal](#tab/api-bridge)

    1. Open the swivel-chair portal from your list of Azure resources.
    1. Select **Go to Consents**.
    1. Select your test tenant.
    1. From the menu, select **Update Relationship Status**. Set the status to **Agreement signed**.
    1. From the menu, select **Manage Numbers**.
    1. Select **Upload numbers**.
    1. Fill in the fields as required, and then select **Review + upload** and **Upload**.

    # [Operator Portal](#tab/no-api-bridge)

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

## 4. Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling & media flows used for call hold and session refresh.

You must test typical call flows for your network. Consult your onboarding team for advice, for example for an example test plan.

- If you decide that you need changes to Azure Communication Gateway, ask your onboarding team. Microsoft will make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## 5. Run a connectivity test and upload proof

> [!WARNING]
> TODO: who verifies the SIP trunks by monitoring OPTIONS?

Before you can launch, Microsoft Teams requires proof that your service can connect to the Microsoft Phone System and your own networks correctly.

1. Provide your onboarding team with proof that BFD is enabled. You enabled BFD in [1. Connect Azure Communications Gateway to your networks](#1-connect-azure-communications-gateway-to-your-networks).

    ``` output
    interface TenGigabitEthernet2/0/0.150
       description private peering to Azure
       encapsulation dot1Q 15 second-dot1q 150
       ip vrf forwarding 15
       ip address 192.168.15.17 255.255.255.252
       bfd interval 300 min_rx 300 multiplier 3

    router bgp 65020
       address-family ipv4 vrf 15
          network 10.1.15.0 mask 255.255.255.128
          neighbor 192.168.15.18 remote-as 12076
          neighbor 192.168.15.18 fall-over bfd
          neighbor 192.168.15.18 activate
          neighbor 192.168.15.18 soft-reconfiguration inbound
       exit-address-family
    ```

1. Work with your onboarding team to validate emergency call handling.

## 6. Get your go-to-market resources approved

Before you can go live, you must get your customer-facing materials approved by Microsoft Teams. Provide the following to your onboarding team for review.

- Press releases and other marketing material
- Content for your landing page
- Logo for the Microsoft Teams Operator Directory (200 px by 200 px)
- Logo for the Microsoft Teams Admin Center (170 px by 90 px)

## 7. Test raising a ticket

> [!WARNING]
> TODO: Link to Azure Communications Gateway docs on making a support request

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway.

## 8. Learn about monitoring Azure Communications Gateway

Your staff can monitor Azure Communications Gateway with the dashboards included in your service. These dashboards are available to anyone with the Reader role on the subscription for Azure Communications Gateway.

> [!WARNING]
> TODO: Link to Azure Communications Gateway monitoring docs

## 9. Verify API integration

Your onboarding team must provide Microsoft with proof that you have integrated with the Microsoft Teams Operator Connect API for provisioning.

# [API Bridge](#tab/api-bridge)

If you have the API Bridge, your onboarding team can obtain proof automatically. You don't need to do anything.

# [Without the API Bridge](#tab/no-api-bridge)

If you don't have the API Bridge, you must provide your onboarding team with proof that you have made successful API calls for:

- Partner consent
- TN Upload to Account
- Unassign TN
- Release TN

---

## 10. Arrange synthetic testing

Your onboarding team must arrange synthetic testing of your deployment. This synthetic testing is a series of automated tests lasting at least seven days. It verifies the most important metrics for quality of service and availability.

## 11. Schedule launch

Your launch date is the date that you'll appear to enterprises in the Teams Admin Center. Your onboarding team must arrange this date by making a request to Microsoft Teams.

Your service can be launched on specific dates each month. Your onboarding team must submit the request at least two weeks before your preferred launch date.

## Next steps

> [!WARNING]
> TODO: Add your next step link(s). Something about learning how to monitor / request support
