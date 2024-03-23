---
title: Set up a test tenant for Microsoft Teams Direct Routing with Azure Communications Gateway
description: Learn how to configure Azure Communications Gateway and Microsoft 365 for a Microsoft Teams Direct Routing customer for testing.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 03/22/2024

#CustomerIntent: As someone deploying Azure Communications Gateway, I want to test my deployment so that I can be sure that calls work.
---

# Configure a test customer for Microsoft Teams Direct Routing with Azure Communications Gateway

Testing Microsoft Teams Direct Routing requires some test numbers in a Microsoft 365 tenant, as if you're providing service to a real customer. We call this tenant (which you control) a _test customer tenant_, corresponding to your _test customer_ (to which you allocate the test numbers). Setting up a test customer requires configuration in the test customer tenant and on Azure Communications Gateway. This article explains how to set up that configuration. You can then configure test users and numbers in the tenant and start testing.

> [!TIP]
> When you onboard a real customer, you'll typically need to ask them to change their tenant's configuration, because your organization won't have permission. You'll still need to make configuration changes on Azure Communications Gateway.
>
> For more information about how Azure Communications Gateway and Microsoft Teams use tenant configuration to route calls, see [Support for multiple customers with the Microsoft Teams multitenant model](interoperability-teams-direct-routing.md#support-for-multiple-customers-with-the-microsoft-teams-multitenant-model).

This article provides detailed guidance equivalent to the following steps in the [Microsoft Teams documentation for configuring an SBC for multiple tenants](/microsoftteams/direct-routing-sbc-multiple-tenants).

- Registering a subdomain name in the customer tenant.
- Configuring derived trunks in the customer tenant (including failover).

## Prerequisites

You must have a Microsoft 365 tenant that you can use as a test customer. You must have at least one number that you can allocate to this test customer.

You must complete the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)

Your organization must [integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md). Someone in your organization must be able to make requests using the Provisioning API during this procedure.

You must be able to sign in to the Microsoft 365 admin center for your test customer tenant as a Global Administrator.

You must be able to configure the tenant with at least two user or resource accounts licensed for Microsoft Teams. For more information on suitable licenses, see the [Microsoft Teams documentation](/microsoftteams/direct-routing-sbc-multiple-tenants#activate-the-subdomain-name).

- You need two user or resource accounts to activate the Azure Communications Gateway domains that you add to Microsoft 365 by following this article. Lab deployments require one account.
- You need at least one user account to use for testing later when you carry out [Configure test numbers for Microsoft Teams Direct Routing with Azure Communications Gateway](configure-test-numbers-teams-direct-routing.md). You can reuse one of the accounts that you use to activate the domains, or you can use an account with one of the other domain names for this tenant.

## Choose a DNS subdomain label to use to identify the customer

Azure Communications Gateway has _per-region domain names_ for connecting to Microsoft Teams Direct Routing. You need to set up subdomains of these domain names for your test customer. Microsoft Phone System and Azure Communications Gateway use these subdomains to match calls to tenants.

1. Work out the per-region domain names for connecting to Microsoft Teams Direct Routing. These use the form `1-r<region-number>.<base-domain-name>`. The base domain name is the **Domain** on your Azure Communications Gateway resource in the [Azure portal](https://azure.microsoft.com/).
1. Choose a DNS label to identify the test customer.
    - The label must be up to **eight** characters in length and can only contain letters, numbers, underscores, and dashes.
    - You must not use wildcard subdomains or subdomains with multiple labels.
    - For example, you could allocate the label `test`.
    > [!IMPORTANT]
    > The full customer subdomains (including the per-region domain names) must be a maximum of 48 characters. Microsoft Entra ID does not support domain names of more than 48 characters. For example, the customer subdomain `contoso1.1-r1.a1b2c3d4e5f6g7h8.commsgw.azure.com` is 48 characters.
1. Use this label to create a _customer subdomain_ of each per-region domain name for your Azure Communications Gateway.
1. Make a note of the label you choose and the corresponding customer subdomains.

For example:
- Your base domain name might be `<deployment-id>.commsgw.azure.com`, where `<deployment-id>` is autogenerated and unique to the deployment.
- Your per-region domain names are therefore:
    - `1-r1.<deployment-id>.commsgw.azure.com`
    - `1-r2.<deployment-id>.commsgw.azure.com`
- If you allocate the label `test`, this label combined with the per-region domain names creates the following customer subdomains for your test customer:
    - `test.1-r1.<deployment-id>.commsgw.azure.com`
    - `test.1-r2.<deployment-id>.commsgw.azure.com`

> [!IMPORTANT]
> The per-region domain names for connecting to Microsoft Teams Direct Routing are different to the per-region domain names for connecting to your network.

> [!TIP]
> Lab deployments have one per-region domain name. Your test customer therefore also only has one customer subdomain.

## Start registering the subdomains in the customer tenant and get DNS TXT values

To route calls to a customer tenant, the customer tenant must be configured with the customer subdomains that you allocated in [Choose a DNS subdomain label to use to identify the customer](#choose-a-dns-subdomain-label-to-use-to-identify-the-customer). Microsoft 365 then requires you (as the carrier) to create DNS records that use a verification code from the customer tenant.

1. Sign into the Microsoft 365 admin center for the customer tenant as a Global Administrator.
1. Using [Add a subdomain to the customer tenant and verify it](/microsoftteams/direct-routing-sbc-multiple-tenants#add-a-subdomain-to-the-customer-tenant-and-verify-it):
    1. Register the first customer subdomain (for example `test.1-r1.<deployment-id>.commsgw.azure.com`).
    1. Start the verification process using TXT records.
    1. Note the TXT value that Microsoft 365 provides.
1. (Production deployments only) Repeat the previous step for the second customer subdomain.

> [!IMPORTANT]
> Don't complete the verification process yet. You must carry out [Use Azure Communications Gateway's Provisioning API to configure the customer and generate DNS records](#use-azure-communications-gateways-provisioning-api-to-configure-the-customer-and-generate-dns-records) first.

## Use Azure Communications Gateway's Provisioning API to configure the customer and generate DNS records

Azure Communications Gateway includes a DNS server. You must use Azure Communications Gateway to create the DNS records required to verify the customer subdomains. To generate the records, provision the details of the customer tenant and the DNS TXT values on Azure Communications Gateway.

1. Use Azure Communications Gateway's Provisioning API to configure the customer as an account. The request must:
    - Enable Direct Routing for the account.
    - Specify the label for the subdomain that you chose (for example, `test`).
    - Specify the DNS TXT values from [Start registering the subdomains in the customer tenant and get DNS TXT values](#start-registering-the-subdomains-in-the-customer-tenant-and-get-dns-txt-values). These values allow Azure Communications Gateway to generate DNS records for the subdomain.
2. Use the Provisioning API to confirm that the DNS records have been generated, by checking the `direct_routing_provisioning_state` for the account.

For example API requests, see [Create an account to represent a customer](/rest/api/voiceservices/#create-an-account-to-represent-a-customer) and [View the details of the account](/rest/api/voiceservices/#view-the-details-of-the-account) in the _API Reference_ for the Provisioning API.

## Finish verifying the domains in the customer tenant

When you have used Azure Communications Gateway to generate the DNS records for the customer subdomains, verify the subdomains in the Microsoft 365 admin center for your customer tenant.

1. Sign into the Microsoft 365 admin center for the customer tenant as a Global Administrator.
1. Select **Settings** > **Domains**.
1. Finish verifying the customer subdomains by following [Add a subdomain to the customer tenant and verify it](/microsoftteams/direct-routing-sbc-multiple-tenants#add-a-subdomain-to-the-customer-tenant-and-verify-it).

## Activate the domains in the customer tenant

To activate the customer subdomains in Microsoft 365, set up at least one user or resource account licensed for Microsoft Teams for each  domain name. For information on the licenses you can use and instructions, see [Activate the subdomain name](/microsoftteams/direct-routing-sbc-multiple-tenants#activate-the-subdomain-name).

> [!IMPORTANT]
> Ensure the accounts use the customer subdomains (for example, `test.1-r1.<deployment-id>.commsgw.azure.com`), instead of any existing domain names in the tenant.

## Configure the customer tenant's call routing to use Azure Communications Gateway

In the customer tenant, [configure a call routing policy](/microsoftteams/direct-routing-voice-routing) (also called a voice routing policy) with a voice route that routes calls to Azure Communications Gateway.
- Set the PSTN gateway to the customer subdomains for Azure Communications Gateway (for example, `test.1-r1.<deployment-id>.commsgw.azure.com` and `test.1-r2.<deployment-id>.commsgw.azure.com`). This sets up _derived trunks_ for the customer tenant.
- Don't configure any users to use the call routing policy yet.

> [!IMPORTANT]
> You must use PowerShell to set the PSTN gateways for the voice route, because the Microsoft Teams Admin Center doesn't support adding derived trunks. You can use the Microsoft Teams Admin Center for all other voice route configuration.
>
> To set the PSTN gateways for a voice route, use the following PowerShell command.
> ```powershell
> Set-CsOnlineVoiceRoute -id "<voice-route-id>" -OnlinePstnGatewayList <customer-subdomain-1>, <customer-subdomain-2>
> ```

## Next step

> [!div class="nextstepaction"]
> [Configure test numbers](configure-test-numbers-teams-direct-routing.md)