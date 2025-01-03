---
title: Deploy the Microsoft Sentinel solution for SAP applications
description: Get an introduction to the process of deploying the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 11/05/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to deploy and configure a monitoring solution for SAP applications so that I can detect and respond to security threats within my SAP environment.

---

# Microsoft Sentinel solution for SAP applications: Deployment overview

Use the Microsoft Sentinel solution for SAP applications to monitor your SAP systems with Microsoft Sentinel, detecting sophisticated threats throughout the business logic and application layers of your SAP applications.

This article introduces you to the Microsoft Sentinel solution for SAP applications deployment.

> [!IMPORTANT]
> Noted features are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Solution components

The Microsoft Sentinel solution for SAP applications includes a data connector, which collects logs from your SAP systems and sends them to your Microsoft Sentinel workspace, and out-of-the-box security content, which helps you gain insight into your organization's SAP environment and detect and respond to security threats.

### Data connector

The Microsoft Sentinel solution for SAP applications supports both a containerized data connector agent and an agentless data connector. Both agents collect application logs for all your onboarded SAP SIDs from across the entire SAP system landscape, and then send those logs to your Log Analytics workspace in Microsoft Sentinel.

Select one of the following tabs to learn more:

### [Containerized data connector agent](#tab/agent)

For example, the following image shows a multi-SID SAP landscape with a split between production and nonproduction systems, including the SAP Business Technology Platform. All the systems in this image are onboarded to Microsoft Sentinel for the SAP solution.

:::image type="content" source="media/deployment-overview/sap-sentinel-multi-sid-overview.png" alt-text="Diagram that shows a multi-SID SAP landscape with Microsoft Sentinel." lightbox="media/deployment-overview/sap-sentinel-multi-sid-overview.png" border="false":::

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system, using a user and role created specifically for this purpose.

Microsoft Sentinel supports a few options for storing your agent configuration information, including the configuration for your SAP authentication secrets. The decision of which option might depend on where you deploy your VM and which SAP authentication mechanism you use. Supported options are as follows, listed in order of preference:

- An **Azure Key Vault** accessed through an Azure **system-assigned managed identity**
- An **Azure Key Vault** accessed through a Microsoft Entra ID **registered-application service principal**
- A plaintext **configuration file**

You can also authenticate using SAP's Secure Network Communication (SNC) and X.509 certificates. While using SNC provides a higher level of authentication security, it might not be practical for all scenarios.

### [Agentless data connector (limited preview)](#tab/agentless)

The Microsoft Sentinel agentless data connector for SAP uses the SAP Cloud Connector and SAP Integration Suite to connect to your SAP system and pull logs from it, as shown in the following image:

:::image type="content" source="media/deployment-overview/agentless-connector.png" alt-text="Diagram that shows the Microsoft Sentinel agentless data connector in an SAP environment." border="false" lightbox="media/deployment-overview/agentless-connector.png":::

By using the SAP Cloud Connector, the **Agentless solution** profits from already existing setups and established integration processes. This means you don't have to tackle network challenges again, as the people running your SAP Cloud Connector have already gone through that process.

The **Agentless solution** is compatible with SAP S/4HANA Cloud, Private Edition RISE with SAP, SAP S/4HANA on-premises, and SAP ERP Central Component (ECC), ensuring continued functionality of existing security content, including detections, workbooks, and playbooks.

The agentless solution in limited preview starts by supporting the SAP audit log, which typically covers the majority of SAP threat scenarios.

> [!IMPORTANT]
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it’s commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also [requires registration](https://aka.ms/SentinelSAPAgentlessSignUp) and is only available to approved customers and partners during the preview period. For more information, see [Microsoft Sentinel for SAP goes agentless ](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238).

---

### Security content

The Microsoft Sentinel solutions for SAP applications include the following types of security content to help you gain insight into your organization's SAP environment and detect and respond to security threats:

- **Analytics rules** and **watchlists** for threat detection.
- **Functions** for easy data access.
- **Workbooks** to create interactive data visualization.
- **Watchlists** for customization of the built-in solution parameters.
- **Playbooks** that you can use to automate responses to threats.

For more information, see [Microsoft Sentinel solution for SAP applications: security content reference](sap-solution-security-content.md).

## Deployment flow and personas

Deploying the Microsoft Sentinel solutions for SAP applications involves several steps and requires collaboration across multiple teams, differing depending on whether you're using a data connector agent or the agentless solution. Select one of the following tabs to learn more:

### [Containerized data connector agent](#tab/agent)

Deploying the Microsoft Sentinel solutions for SAP applications involves several steps and requires collaboration across multiple teams, including the **security**, **infrastructure**, and **SAP BASIS** teams. The following image shows the steps in deploying the Microsoft Sentinel solutions for SAP applications, with relevant teams indicated:

:::image type="content" source="media/deployment-steps/full-flow.png" alt-text="Diagram showing the full steps in the Microsoft Sentinel solution for SAP applications deployment flow." border="false":::

We recommend that you involve all relevant teams when planning your deployment to ensure that effort is allocated and the deployment can move smoothly.

**Deployment steps include**:

1. [Review the prerequisites for deploying the Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md). Some prerequisites require coordination with your infrastructure or SAP BASIS teams.

1. The following steps can happen in parallel as they involve separate teams, and aren't dependent on each other:

    1. [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md). Make sure that you install the correct solution for your environment. This step is handled by the security team on the Azure portal.

    1. [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md), including configuring SAP authorizations, configuring SAP auditing, and more. We recommend that these steps be done by your SAP BASIS team, and our documentation includes references to SAP documentation.

1. [Connect your SAP system](deploy-data-connector-agent-container.md) by deploying a containerized data connector agent.     This step requires coordination between your security, infrastructure, and SAP BASIS teams.

1. [Enable SAP detections and threat protection](deployment-solution-configuration.md). This step is handled by the security team on the Azure portal.

**Extra options include:**

- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
- [Deploy an SAP data connector agent manually](sap-solution-deploy-alternate.md)

## Stop SAP data collection

If you're using the data connector agent and need to stop Microsoft Sentinel from collecting your SAP data, stop log ingestion and disable the connector. Then remove the extra user role and any optional CRs installed on your SAP system.

For more information, see [Stop SAP data collection](stop-collection.md).

### [Agentless data connector (limited preview)](#tab/agentless)

Deploying the Microsoft Sentinel solutions for SAP applications involves several steps and requires collaboration across your **security** and **SAP BASIS** teams. The following image shows the steps in deploying the Microsoft Sentinel solutions for SAP applications, with relevant teams indicated:

:::image type="content" source="media/deployment-steps/full-flow-agentless.png" alt-text="Diagram showing the full steps in the Microsoft Sentinel agentless solution for SAP applications deployment flow." border="false":::

We recommend that you involve both teams when planning your deployment to ensure that effort is allocated and the deployment can move smoothly.

**Deployment steps include**:

1. [Review the prerequisites for deploying the SAP agentless solution](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

1. The following steps can happen in parallel as they involve separate teams, and aren't dependent on each other:

    1. [Deploy the SAP agentless solution from the content hub](deploy-sap-security-content.md). This step is handled by the security team on the Azure portal.

    1. [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md), including configuring SAP authorizations, configuring SAP auditing, and more. We recommend that these steps be done by your SAP BASIS team, and our documentation includes references to SAP documentation.

1. [Connect your SAP system](deploy-data-connector-agent-container.md) using an agentless data connector with the SAP Cloud Connector. This step is handled by your security team on the Azure portal, using information provided by your SAP BASIS team.

1. [Enable SAP detections and threat protection](deployment-solution-configuration.md). This step is handled by the security team on the Azure portal.

---

## Related content

For more information, see:

- [About Microsoft Sentinel content and solutions](../sentinel-solutions.md).
- [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md)
- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md)

## Next step

Begin the deployment of the Microsoft Sentinel solution for SAP applications by reviewing the prerequisites:

> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
