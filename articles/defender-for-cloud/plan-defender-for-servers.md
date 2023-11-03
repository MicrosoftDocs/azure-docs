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
- Where is my data stored and what Log Analytics workspaces do I need?
- Who needs access to my Defender for Servers resources?
- Which Defender for Servers plan should I choose and which vulnerability assessment solution should I use?
- When do I need to use Azure Arc and which agents and extensions are required?
- How do I scale a deployment?

## Before you begin

Before you review the series of articles in the Defender for Servers planning guide:

- Review Defender for Servers [pricing details](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
- If you're deploying for AWS machines or GCP projects, review the [multicloud planning guide](plan-multicloud-security-get-started.md).

## Deployment overview

The following table shows an overview of the Defender for Servers deployment process:

| Stage                       | Details                                                      |
| --------------------------- | ------------------------------------------------------------ |
| Start protecting resources  | • When you open Defender for Cloud in the portal, it starts protecting resources with free foundational CSPM assessments and recommendations.<br /><br />• Defender for Cloud creates a default Log Analytics workspace with the *SecurityCenterFree* solution enabled.<br /><br />• Recommendations start appearing in the portal. |
| Enable Defender for Servers | • When you enable a paid plan, Defender for Cloud enables the *Security* solution on its default workspace.<br /><br />• Enable Defender for Servers Plan 1 (subscription only) or Plan 2 (subscription and workspace).<br /><br />• After enabling a plan, decide how you want to install agents and extensions on Azure VMs in the subscription or workgroup.<br /><br />•By default, auto-provisioning is enabled for some extensions. |
| Protect AWS/GCP machines    | • For a Defender for Servers deployment, you set up a connector, turn off plans you don't need, configure auto-provisioning settings, authenticate to AWS/GCP, and deploy the settings.<br /><br />• Auto-provisioning includes the agents used by Defender for Cloud and the Azure Connected Machine agent for onboarding to Azure with Azure Arc.<br /><br />• AWS uses a CloudFormation template.<br /><br />• GCP uses a Cloud Shell template.<br /><br />• Recommendations start appearing in the portal. |
| Protect on-premises servers | • Onboard them as Azure Arc machines and deploy agents with automation provisioning. |
| Foundational CSPM           | • There are no charges when you use foundational CSPM with no plans enabled.<br /><br />• AWS/GCP machines don't need to be set up with Azure Arc for foundational CSPM. On-premises machines do.<br /><br />• Some foundational recommendations rely only agents: Antimalware / endpoint protection (Log Analytics agent or Azure Monitor agent) \| OS baselines recommendations (Log Analytics agent or Azure Monitor agent and Guest Configuration extension) \| 

- Learn more about [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
- Learn more about [Azure Arc](../azure-arc/index.yml) onboarding.

When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on an Azure subscription or a connected AWS account, all of the connected machines are protected by Defender for Servers. You can enable Microsoft Defender for Servers at the Log Analytics workspace level, but only servers reporting to that workspace will be protected and billed and those servers won't receive some benefits, such as Microsoft Defender for Endpoint, vulnerability assessment, and just-in-time VM access.

## Next steps

After kicking off the planning process, review the [second article in this planning series](plan-defender-for-servers-data-workspace.md) to understand how your data is stored, and Log Analytics workspace requirements.
