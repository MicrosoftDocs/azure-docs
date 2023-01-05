---
title: Plan a Defender for Servers deployment to protect on-premises and multicloud servers
description: Design a solution to protect on-premises and multicloud servers with Defender for Servers 
ms.topic: conceptual
ms.date: 11/06/2022
ms.author: benmansheim
author: bmansheim
---
# Plan Defender for Servers deployment

Microsoft Defender for Servers extends protection to your Windows and Linux machines running in Azure, AWS, GCP, and on-premises. Defender for Servers integrates with Microsoft Defender for Endpoint to provide endpoint detection and response (EDR), and also provides a host of additional threat protection features.

This guide helps you to design and plan an effective Microsoft Defender for Servers deployment. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## About this guide

This planning guide is aimed at cloud solution and infrastructure architects, security architects and analysts, and anyone else who's involved in protecting cloud and hybrid servers and workloads. The guide aims to answer these questions:

- What does Defender for Servers do and how is it deployed?
- Where will my data be stored, and what Log Analytics workspaces do I need?
- Who needs access?
- Which Defender for Servers plan should I choose and which vulnerability assessment solution should I use?
- When do I need Azure Arc, and which agents and extensions must be deployed?
- How do I scale a deployment?

## Before you begin

- Review pricing details for [Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
- If you're deploying for AWS or GCP machines, we suggest that you first review the [multi-cloud planning guide](plan-multicloud-security-get-started.md).

## Deployment overview

The following diagram shows an overview of the deployment process:

:::image type="content" source="media/plan-defender-for-servers/deployment-overview.png" alt-text="Summary overview of the deployment steps for Microsoft Defender for Servers.":::

- Learn more about [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
- Learn more about [Azure Arc](../azure-arc/index.yml) onboarding.

## Next steps

You've begun the planning process. Next, review the [second article in this planning series](plan-defender-for-servers-data-workspace.md) to understand how your data is stored and the Log Analytics workspace requirements.
