---
title: Planning multicloud security determine multicloud dependencies CSPM CWPP guidance cloud workload protection
description: Learn about determining multicloud dependencies when planning multicloud deployment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.date: 12/13/2023
---

# Determine multicloud dependencies

This article is one of a series providing guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Figure out dependencies that might influence your multicloud design.

## Get started

As you design  your multicloud solution, it’s important to have a clear picture of the components needed to enjoy all multicloud features in Defender for Cloud.

## CSPM

Defender for Cloud provides Cloud Security Posture Management (CSPM) features for your AWS and GCP workloads.

- After you onboard AWS and GCP, Defender for Cloud starts assessing your multicloud workloads against industry standards, and reports on your security posture.
- CSPM features are agentless and don’t rely on any other components except for successful onboarding of AWS/GCP connectors.
- It’s important to note that the Security Posture Management plan is turned on by default and can’t be turned off.
- Learn about the [IAM permissions](./quickstart-onboard-aws.md?pivots=env-settings) needed to discover AWS resources for CSPM.

## CWPP

> [!NOTE]
> As the Log Analytics agent is set to retire in August 2024 and as part of the Defender for Cloud [updated strategy](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation), all **Defender for Servers** features and capabilities will be provided either through Microsoft Defender for Endpoint integration or agentless scanning, without dependency on either the Log Analytics agent (MMA) or Azure Monitor agent (AMA). For more information about this change, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

In Defender for Cloud, you enable specific plans to get Cloud Workload Platform Protection (CWPP) features. Plans to protect multicloud resources include:

- [Defender for Servers](./defender-for-servers-introduction.md): Protect AWS/GCP Windows and Linux machines.
- [Defender for Containers](./defender-for-containers-introduction.md): Help secure your Kubernetes clusters with security recommendations and hardening, vulnerability assessments, and runtime protection.
- [Defender for SQL](./defender-for-sql-usage.md): Protect SQL databases running in AWS and GCP.

### What extension do I need?

The following table summarizes extension requirements for CWPP.

| Extension  |Defender for Servers|Defender for Containers|Defender for SQL on Machines|
|:---:|:---:|:---:|:---:|
|Azure Arc Agent |  ✔  |  ✔ | ✔ |
|Microsoft Defender for Endpoint extension |✔|||
|Vulnerability assessment| ✔| ||
|Agentless Disk Scanning| ✔ | ✔ ||
|Log Analytics or Azure Monitor Agent (preview) extension|✔| |✔|
|Defender sensor| | ✔| |
|Azure Policy for Kubernetes | | ✔| |
|Kubernetes audit log data | | ✔| |
|SQL servers on machines | |  | ✔|
|Automatic SQL server discovery and registration | | | ✔|

### Defender for Servers

Enabling Defender for Servers on your AWS or GCP connector allows Defender for Cloud to provide server protection to your Google Compute Engine VMs and AWS EC2 instances.

#### Review plans

Defender for Servers offers two different plans:

- **Plan 1:**
  - **MDE integration:** Plan 1 integrates with [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2) to provide a full endpoint detection and response (EDR) solution for machines running a [range of operating systems](/microsoft-365/security/defender-endpoint/minimum-requirements). Defender for Endpoint features include:
    - [Reducing the attack surface](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) for machines.
    - Providing [antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection) capabilities.
    - Threat management, including [threat hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), [detection](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response), [analytics](/microsoft-365/security/defender-endpoint/threat-analytics), and [automated investigation and response](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).
  - **Provisioning:** Automatic provisioning of the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.
  - **Licensing:** Charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they are in use.
- **Plan 2:** Includes all the components of Plan 1 along with additional capabilities such as File Integrity Monitoring (FIM), Just-in-time (JIT) VM access, and more.

    Review the [features of each plan](./defender-for-servers-introduction.md) before onboarding to Defender for Servers.

#### Review components - Defender for Servers

The following components and requirements are needed to receive full protection from the Defender for Servers plan:

- **Azure Arc agent**: AWS and GCP machines connect to Azure using Azure Arc. The Azure Arc agent connects them.
  - The Azure Arc agent is needed to read security information on the host level and allow Defender for Cloud to deploy the agents/extensions required for complete protection.
  To autoprovision the Azure Arc agent, the OS configuration agent on [GCP VM instances](./quickstart-onboard-gcp.md?pivots=env-settings) and the AWS Systems Manager (SSM) agent for [AWS EC2 instances](./quickstart-onboard-aws.md?pivots=env-settings) must be configured. [Learn more](../azure-arc/servers/agent-overview.md) about the agent.
- **Defender for Endpoint capabilities**: The [Microsoft Defender for Endpoint](./integration-defender-for-endpoint.md?tabs=linux) agent provides comprehensive endpoint detection and response (EDR) capabilities.
- **Vulnerability assessment**: Using either the integrated [Qualys vulnerability scanner](./deploy-vulnerability-assessment-vm.md), or the [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management) solution.
- **Log Analytics agent/[Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) (AMA) (in preview)**: Collects security-related configuration information and event logs from machines.

#### Check networking requirements

Machines must meet [network requirements](../azure-arc/servers/network-requirements.md?tabs=azure-cloud) before onboarding the agents.  Autoprovisioning is enabled by default.

### Defender for Containers

Enabling Defender for Containers provides GKE and EKS clusters and underlying hosts with [these security capabilities](defender-for-containers-introduction.md#agentless-capabilities).

#### Review components - Defender for Containers

The required [components](./defender-for-containers-introduction.md) are as follows:

- **Azure Arc Agent**: Connects your GKE and EKS clusters to Azure, and onboards the Defender sensor.
- **[Defender sensor](defender-for-cloud-glossary.md#defender-sensor)**: Provides host-level runtime threat protection.  
- **Azure Policy for Kubernetes**: Extends the Gatekeeper v3 to monitor every request to the Kubernetes API server, and ensures that security best practices are being followed on clusters and workloads.
- **Kubernetes audit logs**: Audit logs from the API server allow Defender for Containers to identify suspicious activity within your multicloud servers, and provide deeper insights while investigating alerts. Sending of the “Kubernetes audit logs” needs to be enabled on the connector level.

#### Check networking requirements - Defender for Containers

Make sure to check that your clusters meet network requirements so that the Defender sensor can connect with Defender for Cloud.

### Defender for SQL

Defender for SQL provides threat detection for the GCP Compute Engine and AWS. The Defender for SQL Server on Machines plan must be enabled on the subscription where the connector is located.

#### Review components - Defender for SQL

To receive the full benefits of Defender for SQL on your multicloud workload, you need these components:

- **Azure Arc agent**: AWS and GCP machines connect to Azure using Azure Arc. The Azure Arc agent connects them.
  - The Azure Arc agent is needed to read security information on the host level and allow Defender for Cloud to deploy the agents/extensions required for complete protection.
  - To autoprovision the Azure Arc agent, the OS configuration agent on [GCP VM instances](./quickstart-onboard-gcp.md?pivots=env-settings) and the AWS Systems Manager (SSM) agent for [AWS EC2 instances](./quickstart-onboard-aws.md?pivots=env-settings) must be configured. [Learn more](../azure-arc/servers/agent-overview.md) about the agent.
- **Log Analytics agent/[Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) (AMA) (in preview)**: Collects security-related configuration information and event logs from machines
- **Automatic SQL server discovery and registration**: Supports automatic discovery and registration of SQL servers

## Next steps

In this article, you have learned how to determine multicloud dependencies when designing a multicloud security solution. Continue with the next step to [automate connector deployment](plan-multicloud-security-automate-connector-deployment.md).
