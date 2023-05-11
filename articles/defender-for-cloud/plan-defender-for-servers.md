---
title: Plan a Defender for Servers deployment to protect on-premises and multicloud servers
description: Design a solution to protect on-premises and multicloud servers with Microsoft Defender for Servers. 
ms.topic: conceptual
ms.date: 05/11/2023
author: dcurwin
ms.author: dacurwin
---
# Plan your Defender for Servers deployment

Microsoft Defender for Servers extends protection to your Windows and Linux machines that run in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), and on-premises. Defender for Servers integrates with Microsoft Defender for Endpoint to provide endpoint detection and response (EDR) and other threat protection features.

This guide helps you design and plan an effective Defender for Servers deployment. [Microsoft Defender for Cloud](defender-for-cloud-introduction.md) offers two paid plans for Defender for Servers.

## About this guide

The intended audience of this guide is cloud solution and infrastructure architects, security architects and analysts, and anyone who's involved in protecting cloud and hybrid servers and workloads. 

The guide answers these questions:

- What does Defender for Servers do and how is it deployed?
- Where will my data be stored and what Log Analytics workspaces do I need?
- Who needs access to my Defender for Servers resources?
- Which Defender for Servers plan should I choose and which vulnerability assessment solution should I use?
- When do I need to use Azure Arc and which agents and extensions are required?
- How do I scale a deployment?

## Before you begin

Before you review the series of articles in the Defender for Servers planning guide:

- Review Defender for Servers [pricing details](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
- If you're deploying for AWS machines or GCP projects, review the [multicloud planning guide](plan-multicloud-security-get-started.md).

## Deployment overview

The following diagram shows an overview of the Defender for Servers deployment process:

:::image type="content" source="media/plan-defender-for-servers/deployment-overview.png" border="false" alt-text="Diagram showing a summary overview of the deployment steps for Microsoft Defender for Servers.":::

- Learn more about [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
- Learn more about [Azure Arc](../azure-arc/index.yml) onboarding.

When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on an Azure subscription or a connected AWS account, all of the connected machines will be protected by Defender for Servers. You can enable Microsoft Defender for Servers at the Log Analytics workspace level, but only servers reporting to that workspace will be protected and billed and those servers won't receive some benefits, such as Microsoft Defender for Endpoint, vulnerability assessment, and just-in-time VM access.

## Next steps

After kicking off the planning process, review the [second article in this planning series](plan-defender-for-servers-data-workspace.md) to understand how your data is stored, and Log Analytics workspace requirements.
