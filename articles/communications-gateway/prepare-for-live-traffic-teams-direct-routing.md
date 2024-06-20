---
title: Prepare for Microsoft Teams Direct Routing live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your Microsoft Teams Direct Routing service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/24/2024
---

# Prepare for live traffic with Microsoft Teams Direct Routing and Azure Communications Gateway

Before you can launch your Microsoft Teams Direct Routing service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your Azure Communications Gateway onboarding team must take.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

Complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md)
- [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)

This procedure includes setting up test numbers for integration testing. The test numbers must be in a Microsoft 365 tenant other than the tenant for Azure Communications Gateway, as if you're providing service to a real customer. We call this tenant (which you control) a _test customer tenant_, corresponding to your _test customer_ (to which you allocate the test numbers).

You must be able to do the following for your test customer tenant:

- Sign in to the Microsoft 365 admin center as a Global Administrator
- Use PowerShell to change Microsoft Teams Direct Routing configuration.
- Provide user accounts licensed for Microsoft Teams in the test customer tenant. For more information on suitable licenses, see the [Microsoft Teams documentation](/microsoftteams/direct-routing-sbc-multiple-tenants#activate-the-subdomain-name).

    - You need two user or resource accounts to activate tenant-specific Azure Communications Gateway subdomains that you choose and add to Microsoft 365 as part of this procedure. Lab deployments require one account.
    - You need at least one user account to use for testing calls. You can reuse one of the accounts that you use to activate the tenant-specific subdomains, or you can use an account with one of the other domain names for this tenant.

You must be able to provision Azure Communications Gateway during this procedure.

[!INCLUDE [communications-gateway-provisioning-permissions](includes/communications-gateway-provisioning-permissions.md)]

You must be able to make changes to your network's routing configuration.

## Configure numbers for integration testing

Setting up test numbers requires configuration in the test customer tenant and on Azure Communications Gateway.

Follow [Manage Microsoft Teams Direct Routing customers and numbers with Azure Communications Gateway](manage-enterprise-teams-direct-routing.md) for your test customer tenant and numbers. For steps that describe asking a customer to make changes to their tenant, make those changes yourself in your test customer tenant.

> [!IMPORTANT]
> Ensure you configure a dedicated test customer (Microsoft 365) tenant, not the Azure tenant that contains Azure Communications Gateway. Using a dedicated test customer tenant matches the configuration required for a real customer.

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling and media flows used for call hold and session refresh.

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

## Learn about monitoring and maintenance

[!INCLUDE [monitoring and service health notifications](includes/communications-gateway-monitoring-maintenance.md)]

## Next steps

- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [maintenance notifications](maintenance-notifications.md).