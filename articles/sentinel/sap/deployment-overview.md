---
title: Deploy Microsoft Sentinel solution for SAP applications
description: Get an introduction to the process of deploying the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 05/26/2024

# customer intent: As a business user or decision maker, I want to get an overview of how to deploy the Microsoft Sentinel solution for SAP applications so that I know the scope of the information I need and how to access it.
---

# Deploy Microsoft Sentinel solution for SAP applications

Use the Microsoft Sentinel solution for SAP applications to monitor your SAP systems with Microsoft Sentinel, detecting sophisticated threats throughout the business logic and application layers of your SAP applications.

This article introduces you to the Microsoft Sentinel solution for SAP applications deployment.

## Solution components

The Microsoft Sentinel solution for SAP applications includes a data connector, which collects logs from your SAP systems and sends them to your Microsoft Sentinel workspace, and out-of-the-box security content, which helps you gain insight into your organization's SAP environment and detect and respond to security threats.

### Microsoft Sentinel solution for SAP applications data connector

The Microsoft Sentinel for SAP data connector is an agent that's installed as a container on a Linux virtual machine, physical server, or Kubernetes cluster. The agent collects application logs for all of your SAP SIDs from across the entire SAP system landscape, and then sends those logs to your Log Analytics workspace in Microsoft Sentinel.

For example, the following image shows a multi-SID SAP landscape with a split between production and nonproduction systems, including the SAP Business Technology Platform. All the systems in this image are onboarded to Microsoft Sentinel for the SAP solution.

:::image type="content" source="media/deployment-overview/sap-sentinel-multi-sid-overview.png" alt-text="Diagram that shows a multi-SID SAP landscape with Microsoft Sentinel." lightbox="media/deployment-overview/sap-sentinel-multi-sid-overview.png" border="false":::

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system, using a user and role created specifically for this purpose.

Microsoft Sentinel supports a few options for storing your agent configuration information, including your SAP authentication secrets. The decision of which option might depend on where you deploy your VM and which SAP authentication mechanism you use. Supported options are as follows, listed in order of preference:

- An **Azure Key Vault**, accessed through an Azure **system-assigned managed identity**
- An **Azure Key Vault**, accessed through a Microsoft Entra ID **registered-application service principal**
- A plaintext **configuration file**

You can also always authenticate using SAP's Secure Network Communication (SNC) and X.509 certificates. Whle using SNC provides a higher level of authentication security, it might not be practical for all scenarios.

### Microsoft Sentinel solution for SAP applications security content

The Microsoft Sentinel solution for SAP applications includes the following types of security content to help you gain insight into your organization's SAP environment and detect and respond to security threats:

    - **Analytics rules** and **watchlists** for threat detection.
    - **Functions** for easy data access.
    - **Workbooks** to create interactive data visualization.
    - **Watchlists** for customization of the built-in solution parameters.
    - **Playbooks** that you can use to automate responses to threats.

For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).

## Deployment flow and personas

Deploying the Microsoft Sentinel solution for SAP applications involves several steps, crossing your security, SAP, and infrastructure teams. The following image shows the steps in deploying the Microsoft Sentinel solution for SAP applications, with relevant teams indicated:

:::image type="content" source="media/deployment-steps/full-flow.png" alt-text="Diagram showing the full steps in the Microsoft Sentinel solution for SAP applications deployment flow":::.

We recommend that you involve all relevant teams when planning your deployment to ensure that effort is allocated and the deployment can move smoothly.

**Deployment steps include**:

1. [Review the prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md). Some prerequisites, such as enabling auditing on your SAP systems, require coordination with your SAP team.

1. [Prepare your SAP environment](preparing-sap.md), incuding configuring SAP authorizations and deploying optional SAP change requests. This step must be done by your SAP team.

1. [Deploy and configure the SAP data connector agent container](deploy-data-connector-agent-container.md). This step requires coordination between your security, infrastructure, and SAP teams.

1. [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md). This step is handled by the security team.

1. [Configure Microsoft Sentinel solution for SAP applications](deployment-solution-configuration.md). This step is handled by the security team.

**Extra, optional configurations include**:

- [Configure the Microsoft Sentinel for SAP data connector to use SNC](configure-snc.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
- [Configure audit log monitoring rules](configure-audit-log-rules.md)
- [Deploy SAP connector manually](sap-solution-deploy-alternate.md)
- [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Related content

For more information, see:

- [About Microsoft Sentinel content and solutions](../sentinel-solutions.md).
- [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md)
- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md)

## Next step

Begin the deployment of the Microsoft Sentinel solution for SAP applications by reviewing the prerequisites:

> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
