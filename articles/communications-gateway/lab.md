---
title: Lab deployments for Azure Communications Gateway
description: Learn about the benefits of lab deployments for Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 01/08/2024

#CustomerIntent: As someone planning a deployment, I want to know about lab deployments so that I can decide if I want one
---

# Lab Azure Communications Gateway overview


You can experiment with and test Azure Communications Gateway by connecting your preproduction networks to a dedicated Azure Communications Gateway _lab deployment_. A lab deployment is separate from the deployment for your production traffic. We call the deployment type that you use for production traffic a _production deployment_ or _standard deployment_.

You must have deployed a standard deployment or be about to deploy a standard deployment. You can't use a lab deployment as a standalone Azure Communications Gateway deployment.

## Uses of lab deployments

Lab deployments allow you to make changes and test them without affecting your production deployment. For example, you can:

- Test configuration changes to Azure Communications Gateway.
- Test new Azure Communications Gateway features and services (for example, configuring Microsoft Teams Direct Routing or Zoom Phone Cloud Peering).
- Test changes in your preproduction network, before rolling them out to your production networks.

Lab deployments support all the communications services supported by production deployments.

## Considerations for lab deployments

Lab deployments:

- Use a single Azure region, which means there's no geographic redundancy.
- Don't have an availability service-level agreement (SLA).
- Are limited to 200 users.

For Operator Connect and Teams Phone Mobile, lab deployments connect to the same Microsoft Entra tenant as production deployments. Microsoft Teams configuration for your tenant shows configuration for your lab deployments and production deployments together.

You can't automatically apply the same configuration to lab deployments and production deployments. You need to configure each deployment separately.

[!INCLUDE [communications-gateway-lab-ticket-sla](includes/communications-gateway-lab-ticket-sla.md)]

## Setting up and using a lab deployment

You plan for, order, and deploy lab deployments in the same way as production deployments.

We recommend the following approach.

1. Integrate your preproduction network with the lab deployment and your chosen communications services.
1. Carry out the acceptance test plan (ATP) and any automated testing for your communications services in your preproduction environment.
1. Integrate your production network with a production deployment and your communications services, by applying the working configuration from your preproduction environment to your production environment.
1. Optionally, carry out the acceptance plan in your production environment.
1. Carry out any automated tests and network failover tests in your production environment.

You can separate access to lab deployments and production deployments by using Microsoft Entra ID to assign different permissions to the resources.

## Related content

- [Learn more about planning a deployment](get-started.md#learn-about-and-plan-for-azure-communications-gateway)
- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
