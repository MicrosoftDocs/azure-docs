---
title: Defender for Cloud Planning and Operations Guide
description: This document helps you to plan before adopting Defender for Cloud and considerations regarding daily operations.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 02/06/2023
---

# Planning and operations guide

This guide is for information technology (IT) professionals, IT architects, information security analysts, and cloud administrators planning to use Defender for Cloud.

## Planning guide

This guide provides the background for how Defender for Cloud fits into your organization's security requirements and cloud management model. It's important to understand how different individuals or teams in your organization use the service to meet secure development and operations, monitoring, governance, and incident response needs. The key areas to consider when planning to use Defender for Cloud are:

- Security Roles and Access Controls
- Security Policies and Recommendations
- Data Collection and Storage
- Onboarding non-Azure resources
- Ongoing Security Monitoring
- Incident Response

In the next section, you'll learn how to plan for each one of those areas and apply those recommendations based on your requirements.

> [!NOTE]
> Read [Defender for Cloud common questions](faq-general.yml) for a list of common questions that can also be useful during the designing and planning phase.

## Security roles and access controls

Depending on the size and structure of your organization, multiple individuals and teams might use Defender for Cloud to perform different security-related tasks. In the following diagram, you have an example of fictitious personas and their respective roles and security responsibilities:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png" alt-text="Roles.":::

Defender for Cloud enables these individuals to meet these various responsibilities. For example:

**Jeff (Workload Owner)**

- Manage a cloud workload and its related resources.

- Responsible for implementing and maintaining protections in accordance with company security policy.

**Ellen (CISO/CIO)**

- Responsible for all aspects of security for the company.

- Wants to understand the company's security posture across cloud workloads.

- Needs to be informed of major attacks and risks.

**David (IT Security)**

- Sets company security policies to ensure the appropriate protections are in place.

- Monitors compliance with policies.

- Generates reports for leadership or auditors.

**Judy (Security Operations)**

- Monitors and responds to security alerts at any time.

- Escalates to Cloud Workload Owner or IT Security Analyst.

**Sam (Security Analyst)**

- Investigate attacks.

- Work with Cloud Workload Owner to apply remediation.

Defender for Cloud uses [Azure role-based access control (Azure Role-based access control)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure. When a user opens Defender for Cloud, they only see information related to resources they have access to. Which means the user is assigned the role of Owner, Contributor, or Reader to the subscription or resource group that a resource belongs to. In addition to these roles, there are two roles specific to Defender for Cloud:

- **Security reader**: a user that belongs to this role is able to view only Defender for Cloud configurations, which include recommendations, alerts, policy, and health, but it won't be able to make changes.

- **Security admin**: same as security reader but it can also update the security policy, dismiss recommendations and alerts.

The personas explained in the previous diagram need these Azure Role-based access control roles:

**Jeff (Workload Owner)**

- Resource Group Owner/Contributor.

**Ellen (CISO/CIO)**

- Subscription Owner/Contributor or Security Admin.

**David (IT Security)**

- Subscription Owner/Contributor or Security Admin.

**Judy (Security Operations)**

- Subscription Reader or Security Reader to view alerts.

- Subscription Owner/Contributor or Security Admin required to dismiss alerts.

**Sam (Security Analyst)**

- Subscription Reader to view alerts.

- Subscription Owner/Contributor required to dismiss alerts.

- Access to the workspace might be required.

Some other important information to consider:

- Only subscription Owners/Contributors and Security Admins can edit a security policy.

- Only subscription and resource group Owners and Contributors can apply security recommendations for a resource.

When planning access control using Azure Role-based access control for Defender for Cloud, make sure you understand who in your organization needs access to Defender for Cloud the tasks they'll perform. Then you can configure Azure Role-based access control properly.

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, users who only need to view information about the security state of resources but not take action, such as applying recommendations or editing policies, should be assigned the Reader role.

## Security policies and recommendations

A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Defender for Cloud, you can define policies for your Azure subscriptions, which can be tailored to the type of workload or the sensitivity of data.

Defenders for Cloud policies contain the following components:

- [Data collection](monitoring-components.md): agent provisioning and data collection settings.

- [Security policy](tutorial-security-policy.md): an [Azure Policy](../governance/policy/overview.md) that determines which controls are monitored and recommended by Defender for Cloud. You can also use Azure Policy to create new definitions, define more policies, and assign policies across management groups.

- [Email notifications](configure-email-notifications.md): security contacts and notification settings.
- [Pricing tier](defender-for-cloud-introduction.md#protect-cloud-workloads): with or without Microsoft Defender for Cloud's Defender plans, which determine which Defender for Cloud features are available for resources in scope (can be specified for subscriptions and workspaces using the API).

> [!NOTE]
> Specifying a security contact ensures that Azure can reach the right person in your organization if a security incident occurs. Read [Provide security contact details in Defender for Cloud](configure-email-notifications.md) for more information on how to enable this recommendation.

### Security policies definitions and recommendations

Defender for Cloud automatically creates a default security policy for each of your Azure subscriptions. You can edit the policy in Defender for Cloud or use Azure Policy to create new definitions, define more policies, and assign policies across management groups. Management groups can represent the entire organization or a business unit within the organization. You can monitor policy compliance across these management groups.

Before configuring security policies, review each of the [security recommendations](review-security-recommendations.md):

- See if these policies are appropriate for your various subscriptions and resource groups.

- Understand what actions address the security recommendations.

- Determine who in your organization is responsible for monitoring and remediating new recommendations.

## Data collection and storage

Defender for Cloud uses the Log Analytics agent and the Azure Monitor Agent to collect security data from your virtual machines. [Data collected](monitoring-components.md) from this agent is stored in your Log Analytics workspaces.

### Agent

When automatic provisioning is enabled in the security policy, the [data collection agent](monitoring-components.md) is installed on all supported Azure VMs and any new supported VMs that are created. If the VM or computer already has the Log Analytics agent installed, Defender for Cloud uses the current installed agent. The agent's process is designed to be non-invasive and have minimal effect on VM performance.

If at some point you want to disable Data Collection, you can turn it off in the security policy. However, because the Log Analytics agent might be used by other Azure management and monitoring services, the agent won't be uninstalled automatically when you turn off data collection in Defender for Cloud. You can manually uninstall the agent if needed.

> [!NOTE]
> To find a list of supported VMs, read the [Defender for Cloud common questions](faq-vms.yml).

### Workspace

A workspace is an Azure resource that serves as a container for data. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

Data collected from the Log Analytics agent can be stored in an existing Log Analytics workspace associated with your Azure subscription or a new workspace.

In the Azure portal, you can browse to see a list of your Log Analytics workspaces, including any created by Defender for Cloud. A related resource group is created for new workspaces. Resources are created according to this naming convention:

- Workspace: *DefaultWorkspace-[subscription-ID]-[geo]*

- Resource Group: *DefaultResourceGroup-[geo]*

For workspaces created by Defender for Cloud, data is retained for 30 days. For existing workspaces, retention is based on the workspace pricing tier. If you want, you can also use an existing workspace.

If your agent reports to a workspace other than the **default** workspace, any Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads) that you've enabled on the subscription should also be enabled on the workspace.

> [!NOTE]
> Microsoft makes strong commitments to protect the privacy and security of this data. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service. For more information about data handling and privacy, read [Defender for Cloud Data Security](data-security.md).

## Onboard non-Azure resources

Defender for Cloud can monitor the security posture of your non-Azure computers but you need to first onboard these resources. Read [Onboard non-Azure computers](quickstart-onboard-machines.md) for more information on how to onboard non-Azure resources.

## Ongoing security monitoring

After initial configuration and application of Defender for Cloud recommendations, the next step is considering Defender for Cloud operational processes.

The Defender for Cloud Overview provides a unified view of security across all your Azure resources and any non-Azure resources you've connected. This example shows an environment with many issues to resolve:

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

> [!NOTE]
> Defender for Cloud doesn't interfere with your normal operational procedures. Defender for Cloud passively monitors your deployments and provides recommendations based on the security policies you enabled.

When you first opt in to use Defender for Cloud for your current Azure environment, make sure that you review all recommendations, which can be done in the **Recommendations** page.

Plan to visit the threat intelligence option as part of your daily security operations. There you can identify security threats against the environment, such as identify if a particular computer is part of a botnet.

### Monitoring for new or changed resources

Most Azure environments are dynamic, with resources regularly being created, spun up or down, reconfigured, and changed. Defender for Cloud helps ensure that you have visibility into the security state of these new resources.

When you add new resources (VMs, SQL DBs) to your Azure environment, Defender for Cloud automatically discovers these resources and begins to monitor their security, including PaaS web roles and worker roles. If Data Collection is enabled in the [Security Policy](tutorial-security-policy.md), more monitoring capabilities are enabled automatically for your virtual machines.

You should also regularly monitor existing resources for configuration changes that could have created security risks, drift from recommended baselines, and security alerts.

### Hardening access and applications

As part of your security operations, you should also adopt preventative measures to restrict access to VMs, and control the applications that are running on VMs. By locking down inbound traffic to your Azure VMs, you're reducing the exposure to attacks, and at the same time providing easy access to connect to VMs when needed. Use [just-in-time VM access](just-in-time-access-usage.md) access feature to hardening access to your VMs.

You can use [adaptive application controls](adaptive-application-controls.md) to limit which applications can run on your VMs located in Azure. Among other benefits, adaptive application controls help harden your VMs against malware. With the help of machine learning, Defender for Cloud analyzes processes running in the VM to help you create allowlist rules.

## Incident response

Defender for Cloud detects and alerts you to threats as they occur. Organizations should monitor for new security alerts and take action as needed to investigate further or remediate the attack. For more information on how Defender for Cloud threat protection works, read [How Defender for Cloud detects and responds to threats](alerts-overview.md#detect-threats).

Although we can't create your Incident Response plan, we'll use Microsoft Azure Security Response in the Cloud lifecycle as the foundation for incident response stages. The stages of incident response in the cloud lifecycle are:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-1.png" alt-text="Stages of the incident response in the cloud lifecycle.":::

> [!NOTE]
> You can use the National Institute of Standards and Technology (NIST) [Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) as a reference to assist you building your own.

You can use Defender for Cloud alerts during the following stages:

- **Detect**: identify a suspicious activity in one or more resources.

- **Assess**: perform the initial assessment to obtain more information about the suspicious activity.

- **Diagnose**: use the remediation steps to conduct the technical procedure to address the issue.

Each Security Alert provides information that can be used to better understand the nature of the attack and suggest possible mitigations. Some alerts also provide links to either more information or to other sources of information within Azure. You can use the information provided for further research and to begin mitigation, and you can also search security-related data that is stored in your workspace.

The following example shows a suspicious RDP activity taking place:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-ga.png" alt-text="Suspicious activity.":::

This page shows the details regarding the time that the attack took place, the source hostname, the target VM and also gives recommendation steps. In some circumstances, the source information of the attack might be empty. Read [Missing Source Information in Defender for Cloud alerts](/archive/blogs/azuresecurity/missing-source-information-in-azure-security-center-alerts) for more information about this type of behavior.

Once you identify the compromised system, you can run a [workflow automation](workflow-automation.md) that was previously created. Workflow automations are a collection of procedures that can be executed from Defender for Cloud once triggered by an alert.

> [!NOTE]
> Read [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md) for more information on how to use Defender for Cloud capabilities to assist you during your Incident Response process.

## Next steps

In this document, you learned how to plan for Defender for Cloud adoption. Learn more about Defender for Cloud:

- [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md)
- [Monitoring partner solutions with Defender for Cloud](./partner-integration.md) - Learn how to monitor the health status of your partner solutions.
- [Defender for Cloud common questions](faq-general.yml) - Find frequently asked questions about using the service.
- [Azure Security blog](/archive/blogs/azuresecurity/) - Read blog posts about Azure security and compliance.
