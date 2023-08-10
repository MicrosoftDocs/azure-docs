---
title: Prepare for live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 07/18/2023
---

# Prepare for live traffic with Azure Communications Gateway

Before you can launch your Operator Connect or Teams Phone Mobile service, you and your onboarding team must:

- Integrate Azure Communications Gateway with your network.
- Test your service.
- Prepare for launch.

In this article, you learn about the steps you and your onboarding team must take.

> [!TIP]
> In many cases, your onboarding team is from Microsoft, provided through the [Included Benefits](onboarding.md) or through a separate arrangement.

## Prerequisites

- You must have [deployed Azure Communications Gateway](deploy.md) using the Microsoft Azure portal.
- You must have [chosen some test numbers](prepare-to-deploy.md#prerequisites).
- You must have a tenant you can use for testing (representing an enterprise customer), and some users in that tenant to whom you can assign the test numbers.
- You must have access to the:
  - [Operator Connect portal](https://operatorconnect.microsoft.com/).
  - [Teams Admin Center](https://admin.teams.microsoft.com/) for your test tenant.
- You must be able to manage users in your test tenant.

## Methods

In some parts of this article, the steps you must take depend on whether your deployment includes the Number Management Portal. This article provides instructions for both types of deployment. Choose the appropriate instructions.

## 1. Connect Azure Communications Gateway to your networks

1. Exchange TLS certificate information with your onboarding team.
    1. Azure Communications Gateway is preconfigured to support the DigiCert Global Root G2 certificate and the Baltimore CyberTrust Root certificate as root certificate authority (CA) certificates. If the certificate that your network presents to Azure Communications Gateway uses a different root CA certificate, provide your onboarding team with this root CA certificate.
    1. The root CA certificate for Azure Communications Gateway's certificate is the DigiCert Global Root G2 certificate. If your network doesn't have this root certificate, download it from https://www.digicert.com/kb/digicert-root-certificates.htm and install it in your network.
1. Configure your infrastructure to meet the call routing requirements described in [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).
1. Configure your network devices to send and receive SIP traffic from Azure Communications Gateway. You might need to configure SBCs, softswitches and access control lists (ACLs). To find the hostnames to use for SIP traffic:
    1. Go to the **Overview** page for your Azure Communications Gateway resource.
    1. In each **Service Location** section, find the **Hostname** field. You need to validate TLS connections against this hostname to ensure secure connections.
1. If your Azure Communications Gateway includes integrated MCP, configure the connection to MCP:
    1. Go to the **Overview** page for your Azure Communications Gateway resource.
    1. In each **Service Location** section, find the **MCP hostname** field.
    1. Configure your test numbers with an iFC of the following form, replacing *`<mcp-hostname>`* with the MCP hostname for the preferred region for that subscriber.
       ```xml
        <InitialFilterCriteria>
            <Priority>0</Priority>
            <TriggerPoint>
                <ConditionTypeCNF>0</ConditionTypeCNF>
                <SPT>
                    <ConditionNegated>0</ConditionNegated>
                    <Group>0</Group>
                    <Method>INVITE</Method>
                </SPT>
                <SPT>
                    <ConditionNegated>1</ConditionNegated>
                    <Group>0</Group>
                    <SessionCase>4</SessionCase>
                </SPT>
            </TriggerPoint>
            <ApplicationServer>
                <ServerName>sips:<mcp-hostname>;transport=tcp;service=mcp</ServerName>
                <DefaultHandling>0</DefaultHandling>
            </ApplicationServer>
            <ProfilePartIndicator>0</ProfilePartIndicator>
        </InitialFilterCriteria>
        ```
1. Configure your routers and peering connection to ensure all traffic to Azure Communications Gateway is through Azure Internet Peering for Communications Services (also known as MAPS for Voice).
1. Enable Bidirectional Forwarding Detection (BFD) on your on-premises edge routers to speed up link failure detection.
    - The interval must be 150 ms (or 300 ms if you can't use 150 ms).
    - With MAPS, BFD must bring up the BGP peer for each Private Network Interface (PNI).
1. Meet any other requirements in the _Network Connectivity Specification_ for Operator Connect or Teams Phone Mobile. If you don't have access to this specification, contact your onboarding team.

## 2. Ask your onboarding team to register your test enterprise tenant

Your onboarding team must register the test enterprise tenant that you chose in [Prerequisites](#prerequisites) with Microsoft Teams.

1. Provide your onboarding contact with:
    - Your company's name.
    - Your company's ID ("Operator ID").
    - The ID of the tenant to use for testing.
2. Wait for your onboarding team to confirm that your test tenant has been registered.

## 3. Assign numbers to test users in your tenant

1. Ask your onboarding team for the name of the Calling Profile that you must use for these test numbers. The name typically has the suffix `commsgw`. This Calling Profile has been created for you during the Azure Communications Gateway deployment process.
1. In your test tenant, request service from your company.
    1. Sign in to the [Teams Admin Center](https://admin.teams.microsoft.com/) for your test tenant.
    1. Select **Voice** > **Operators**.
    1. Select your company in the list of operators, fill in the form and select **Add as my operator**.
1. In your test tenant, create some test users (if you don't already have suitable users). These users must be licensed for Teams Phone System and in Teams Only mode.
1. Configure emergency locations in your test tenant.
1. Upload numbers in the Number Management Portal (if you chose to deploy it as part of Azure Communications Gateway) or the Operator Connect Operator Portal. Use the Calling Profile that you obtained from your onboarding team.

    # [Number Management Portal](#tab/number-management-portal)

    1. Sign in to the [Azure portal](https://azure.microsoft.com/).
    1. In the search bar at the top of the page, search for your Communications Gateway resource.
    1. Select your Communications Gateway resource.
    1. On the overview page, select **Consents** in the sidebar.
    1. Select your test tenant.
    1. From the menu, select **Update Relationship Status**. Set the status to **Agreement signed**.
    1. From the menu, select **Manage Numbers**.
    1. Select **Upload numbers**.
    1. Fill in the fields as required, and then select **Review + upload** and **Upload**.

    # [Operator Portal](#tab/no-number-management-portal)

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

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft will make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## 5. Run a connectivity test and upload proof

Before you can launch, Microsoft Teams requires proof that your network is properly connected to Microsoft's network.

1. Provide your onboarding team with proof that BFD is enabled. You enabled BFD in [1. Connect Azure Communications Gateway to your networks](#1-connect-azure-communications-gateway-to-your-networks). For example, if you have a Cisco router, you can provide configuration similar to the following.

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

1. Test failover of the MAPS connections to your network. Your onboarding team will work with you to plan this testing and gather the required evidence.
1. Work with your onboarding team to validate emergency call handling.

## 6. Get your go-to-market resources approved

Before you can go live, you must get your customer-facing materials approved by Microsoft Teams. Provide the following to your onboarding team for review.

- Press releases and other marketing material
- Content for your landing page
- Logo for the Microsoft Teams Operator Directory (200 px by 200 px)
- Logo for the Microsoft Teams Admin Center (170 px by 90 px)

## 7. Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

## 8. Learn about monitoring Azure Communications Gateway

Your staff can use a selection of key metrics to monitor Azure Communications Gateway. These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway. See [Monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).

## 9. Verify API integration

Your onboarding team must provide Microsoft with proof that you have integrated with the Microsoft Teams Operator Connect API for provisioning.

# [Number Management Portal](#tab/number-management-portal)

If you have the Number Management Portal, your onboarding team can obtain proof automatically. You don't need to do anything.

# [Without the Number Management Portal](#tab/no-number-management-portal)

If you don't have the Number Management Portal, you must provide your onboarding team with proof that you have made successful API calls for:

- Partner consent
- TN Upload to Account
- Unassign TN
- Release TN

---

## 10. Arrange synthetic testing

Your onboarding team must arrange synthetic testing of your deployment. This synthetic testing is a series of automated tests lasting at least seven days. It verifies the most important metrics for quality of service and availability.

After launch, synthetic traffic will be sent through your deployment using your test numbers. This traffic is used to continuously check the health of your deployment.

## 11. Schedule launch

Your launch date is the date that you'll appear to enterprises in the Teams Admin Center. Your onboarding team must arrange this date by making a request to Microsoft Teams.

Your service can be launched on specific dates each month. Your onboarding team must submit the request at least two weeks before your preferred launch date.

## Next steps

- Wait for your launch date.
- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [planning and managing costs for Azure Communications Gateway](plan-and-manage-costs.md).
