---
title: Block access to and from other tenants
description: Block connections between your tenant and other Microsoft Entra tenants in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/15/2024
# Customer intent: As a developer, I want to prevent access to and from other Microsoft Entra tenants.
---

# Block connections to and from other tenants in Azure Logic Apps

Azure Logic Apps includes many connectors for you to build integration apps and workflows and to access various data, apps, services, systems, and other resources. These connectors authorize your access to these resources by using Microsoft Entra ID to authenticate your credentials.

When you create a connection from your workflow to access a resource, you can share that connection with others in the same Microsoft Entra tenant or different tenant by sending a consent link. This shared connection provides access to same resource but creates a security vulnerability.

As a security measure to prevent this scenario, you can block access to and from your own Microsoft Entra tenant through such shared connections. You can also permit but restrict connections only to specific tenants. By setting up a tenant isolation policy, you can better control data movement between your tenant and resources that require Microsoft Entra authorized access.

## Prerequisites

- An Azure subscription and account with owner permissions to set up a new policy or make changes to existing tenant policies.

  > [!NOTE]
  >
  > You can apply policies that affect only your own tenant, not other tenants.

- Collect the following information:

  - The tenant ID for your Microsoft Entra tenant.

  - The choice whether to enforce two-way tenant isolation for connections that don't have a client tenant ID.

    For example, some legacy connections might not have an associated tenant ID. So, you have to choose whether to block or allow such connections.

  - The choice whether to enable or disable the isolation policy.

  - The tenant IDs for any tenants where you want to allow connections to or from your tenant.

    If you choose to allow such connections, include the following information:
    
    - The choice whether to allow inbound connections to your tenant from each allowed tenant.

    - The choice whether to allow outbound connections from your tenant to each allowed tenant.

- To test the tenant isolation policy, you need a second Microsoft Entra tenant. From this tenant, you'll try connecting to and from the isolated tenant after the isolation policy takes effect.

## Request an isolation policy for your tenant

To start this process, you'll request a new isolation policy or update your existing isolation policy for your tenant. Only Azure subscription owners can request new policies or changes to existing policies.

1. Open a Customer Support ticket to request a new isolation policy or update your existing isolation policy for your tenant.

1. Wait for the request to finish verification and processing by the person who handles the support ticket.

   > [!NOTE]
   >
   > Policies take effect immediately in the West Central US region. However, these changes 
   > might take up to four hours to replicate in all other regions.

## Test the isolation policy

After the policy takes effect in a region, test the policy. You can try immediately in the West Central US region.

### Test inbound connections to your tenant

1. Sign in to your "other" Microsoft Entra tenant.

1. Create logic app workflow with a connection, such as Office 365 Outlook.

1. Try to sign in to your isolated tenant.

   You get a message that the connection to the isolated tenant has failed authorization due to a tenant isolation configuration.

### Test outbound connections from your tenant

1. Sign in to your isolated tenant.

1. Create a logic app workflow with a connection, such as Office 365 Outlook.

1. Try to sign in to your other tenant.

   You get a message that the connection to your other tenant has failed authorization due to a tenant isolation configuration.

## Next steps

[Block connector usage in Azure Logic Apps](block-connections-connectors.md)
