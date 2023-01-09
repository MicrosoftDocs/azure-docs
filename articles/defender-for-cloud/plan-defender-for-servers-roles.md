---
title: Plan roles and permissions for Defender for Servers 
description: Review roles and permissions for Defender for Servers 
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
---
# Review Defender for Servers roles and permissions

This article helps you to understand how to control access to Defender for Servers. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).


## Before you start

This article is the third in the Defender for Servers planning guide series. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)


## Determine access and ownership

In complex enterprises, different teams manage different [security functions](/azure/cloud-adoption-framework/organize/cloud-security).

Figuring out ownership for server and endpoint security is critical. Ownership that's undefined, or hidden within organizational silos, causes friction that leads to delays, insecure deployments, and difficulties for security operations (SecOps) teams who need to identify and follow threats across the enterprise.

- Security leadership should identify the teams, roles, and individuals responsible for making and implementing decisions about server security.
- Typically, responsibility is shared between a [central IT team](/azure/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint).

Individuals in these teams need Azure access rights to manage and use Defender for Cloud. As part of planning, figure out the right level of access for individuals, based on Defender for Cloud's role-base access control (RBAC) model. 

## Defender for Cloud roles

In addition to the built-in Owner, Contributor, Reader roles for an Azure subscription/resource group, there are a couple of built-in roles that control Defender for Cloud access.

- **Security Reader**: Provides viewing rights to Defender for Cloud recommendations, alerts, security policy and states. This role can't make changes to Defender for Cloud settings.
- **Security Admin**: Provide Security Reader rights, and the ability to update security policy, dismiss alerts and recommendations, and apply recommendations.

[Get more details](permissions.md#roles-and-allowed-actions) about allowed role actions



## Next steps

After working through these planning steps, [decide which Defender for Servers plan](plan-defender-for-servers-select-plan.md) is right for your organization.

