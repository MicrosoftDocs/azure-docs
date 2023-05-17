---
title: Plan Defender for Servers roles and permissions 
description: Review roles and permissions for Microsoft Defender for Servers.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 11/06/2022
---
# Plan roles and permissions for Defender for Servers

This article helps you understand how to control access to your Defender for Servers deployment.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *third* article in the Defender for Servers planning guide. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)

## Determine ownership and access

In complex enterprises, different teams manage different [security functions](/azure/cloud-adoption-framework/organize/cloud-security) in the organization.

It's critical that you identify ownership for server and endpoint security in your organization. Ownership that's undefined or hidden in organizational silos  increases risk for the organization. Security operations (SecOps) teams that need to identify and follow threats across the enterprise are hindered. Deployments might be delayed or they might not be secure.

Security leadership should identify the teams, roles, and individuals that are responsible for making and implementing decisions about server security.

Responsibility usually is shared between a [central IT team](/azure/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint). Individuals on these teams need Azure access rights to manage and use Defender for Cloud. As part of planning, determine the right level of access for individuals based on the Defender for Cloud role-based access control (RBAC) model.

## Defender for Cloud roles

In addition to the built-in Owner, Contributor, and Reader roles for an Azure subscription and resource group, Defender for Cloud has built-in roles that control Defender for Cloud access:

- **Security Reader**: Provides viewing rights to Defender for Cloud recommendations, alerts, security policy, and states. This role can't make changes to Defender for Cloud settings.
- **Security Admin**: Provides Security Reader rights and the ability to update security policy, dismiss alerts and recommendations, and apply recommendations.

Learn more about [allowed role actions](permissions.md#roles-and-allowed-actions).

## Next steps

After you work through these planning steps, [decide which Defender for Servers plan](plan-defender-for-servers-select-plan.md) is right for your organization.
