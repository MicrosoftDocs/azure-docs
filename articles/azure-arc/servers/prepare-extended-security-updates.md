---
title: How to prepare to deliver Extended Security Updates for Windows Server 2012 through Azure Arc
description: Learn how to prepare to deliver Extended Security Updates for Windows Server 2012 through Azure Arc.
ms.date: 06/27/2023
ms.topic: conceptual
---

# Prepare to deliver Extended Security Updates for Windows Server 2012

With Windows Server 2012 reaching End-of-Life on October 10, 2023, customers have the option to enroll their existing Windows Server 2012 machines in Extended Security Updates (ESUs) delivered through Azure Arc. Doing so helps to position customers for migration to Azure on their own terms, affording both billing flexibility and an enhanced delivery experience.

## Key benefits

Delivering ESUs to your Windows Server 2012 resources provides these key benefits:

- **Pay-as-you-go:** Flexibility to sign up for a monthly subscription service with the ability to migrate mid-year.

- **Azure billed:** Customers can draw down from their existing Microsoft Azure Consumption Commitment (MACC) and analyze their costs using Azure Cost Commitment.

- **Built-in inventory:** The coverage and enrollment status of Windows Server 2012 ESUs on eligible Arc-enabled servers will display in the Azure portal, highlighting gaps and status changes.

- **Keyless delivery:** The enrollment of ESUs on Azure Arc-enabled Windows Server 2012 machines won't require the acquisition or activation of keys.

Customers can use additional Azure services through Azure Arc-enabled servers, with offerings such as Microsoft Defender for Cloud affording Cloud Security Posture Management and specialized server protection capabilities suitable for eligible Windows Server 2012 machines. 

## Preparing to deliver ESUs

To prepare for this new offer, customers need to onboard their servers to Azure Arc through the installation of the [Azure Connected Machine agent](agent-overview.md) and running a script to establish a connection to Azure.

- **Deployment options:** There are several at-scale onboarding options for Azure Arc-enabled servers, including running a [Custom Task Sequence](onboard-configuration-manager-custom-task.md) through Configuration Manager and deploying a [Scheduled Task through Group Policy](onboard-group-policy-powershell.md).

- **Networking:** Connectivity options include public endpoint, proxy server, and private link or Azure Express Route. Customers should review the [networking prerequisites](network-requirements.md) to prepare their non-Azure environment for deployment to Azure Arc.

Customers should deploy their Windows Server 2012 machines to Azure Arc through September 2023. Once those machines are onboarded to Azure Arc, customers will have visibility into their ESU coverage and enroll through point-and-click or Azure policy experiences to ESUs delivered through Azure Arc, one month before Windows Server 2012 End-of-Life. Billing for this service will commence from October 2023, after the End-of-Life for Windows Server 2012.
