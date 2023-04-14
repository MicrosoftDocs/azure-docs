---
title: Plan a Defender for Servers deployment to protect on-premises and multicloud servers
description: Design a solution to protect on-premises and multicloud servers with Microsoft Defender for Servers. 
ms.topic: conceptual
ms.date: 11/06/2022
author: bmansheim
ms.author: benmansheim
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

## Defender for Servers pricing FAQ

- [My subscription has Microsoft Defender for Servers enabled, which machines do I pay for?](#my-subscription-has-microsoft-defender-for-servers-enabled-which-machines-do-i-pay-for)
- [If I already have a license for Microsoft Defender for Endpoint, can I get a discount for Defender for Servers?](#if-i-already-have-a-license-for-microsoft-defender-for-endpoint-can-i-get-a-discount-for-defender-for-servers)

### My subscription has Microsoft Defender for Servers enabled, which machines do I pay for?

When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on a subscription, all machines in that subscription (including machines that are part of PaaS services and reside in this subscription) are billed according to their power state as shown in the following table:

| State        | Description                                                                                                                                      | Instance usage billed |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Starting     | VM is starting up.                                                                                                                               | Not billed            |
| Running      | Normal working state for a VM                                                                                                                    | Billed                |
| Stopping     | This state is transitional. When completed, it will show as Stopped.                                                                           | Billed                |
| Stopped      | The VM has been shut down from within the guest OS or using the PowerOff APIs. Hardware is still allocated to the VM and it remains on the host. | Billed                |
| Deallocating | This state is transitional. When completed, the VM will show as Deallocated.                                                                             | Not billed            |
| Deallocated  | The VM has been stopped successfully and removed from the host.                                                                                  | Not billed            |

:::image type="content" source="media/plan-defender-for-servers/deallocated-virtual-machines.png" alt-text="Screenshot of Azure Virtual Machines showing a deallocated machine.":::

### If I already have a license for Microsoft Defender for Endpoint, can I get a discount for Defender for Servers?

If you already have a license for **Microsoft Defender for Endpoint for Servers Plan 2**, you won't have to pay for that part of your Microsoft Defender for Servers license. Learn more about [this license](/microsoft-365/security/defender-endpoint/minimum-requirements#licensing-requirements).

To request your discount, [contact Defender for Cloud's support team](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). You'll need to provide the relevant workspace ID, region, and number of Microsoft Defender for Endpoint for servers licenses applied for machines in the given workspace.

The discount will be effective starting from the approval date, and won't take place retroactively.

## Next steps

After kicking off the planning process, review the [second article in this planning series](plan-defender-for-servers-data-workspace.md) to understand how your data is stored, and Log Analytics workspace requirements.
