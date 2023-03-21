---
title: What's new in Azure Communications Gateway?
description: Discover what's new in Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: whats-new
ms.date: 03/16/2023
---

# What's new in Azure Communications Gateway?

This article covers new features and improvements for Azure Communications Gateway.

## March 2023: Simpler authentication for Operator Connect APIs

Azure Communications Gateway contains services that need to access the Operator Connect API on your behalf. Azure Communications Gateway therefore needs to authenticate with your Operator Connect or Teams Phone Mobile environment.

From March 2023, Azure Communications Gateway automatically provides a service principal for this authentication. You must set up specific permissions for this service principal and then add the service principal to your Operator Connect or Teams Phone Mobile environment. For more information, see [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).

This new authentication model replaces an earlier model that required you to create an App registration and manage secrets for it. With the new model, you no longer need to create, manage or rotate secrets.

## Next steps

- [Learn more about Azure Communications Gateway](overview.md).
- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).