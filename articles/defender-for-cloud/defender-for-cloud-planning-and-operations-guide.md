---
title: Defender for Cloud Planning and Operations Guide
description: This document helps you to plan before adopting Defender for Cloud and considerations regarding daily operations.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 02/06/2023
---

# Planning and operations guide

This guide is for information technology (IT) professionals, IT architects, information security analysts, and cloud administrators planning to use Defender for Cloud.

It provides the background for how Defender for Cloud fits into your organization's security requirements and cloud management model. It's important to understand how different individuals or teams in your organization use the service to meet secure development and operations, monitoring, governance, and incident response needs.

For common questions you may have on Defender for Cloud, read [Defender for Cloud common questions guide](faq-general.yml).

## Security roles and access controls

Depending on the size and structure of your organization, multiple individuals and teams may use Defender for Cloud to perform different security-related tasks. In the following diagram, you have an example of fictitious personas and their respective roles and security responsibilities:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png" alt-text="Roles.":::

Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure. When a user opens Defender for Cloud, they only see information related to resources they have access to. This means the user is assigned the role of Owner, Contributor, or Reader to the subscription or resource group that a resource belongs to. In addition to these roles, there are two other roles specific to Defender for Cloud:

- **Security reader**: A user that belongs to this role is able to view Defender for Cloud configurations, which include recommendations, alerts, policy, and health, but it won't be able to make changes.

- **Security admin**: Has the same privileges as security reader, but it can also update the security policy and dismiss recommendations and alerts.

The personas explained in the previous diagram need these Azure RBAC roles:

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

- Access to the workspace may be required.

> [!Important]
> Subscription Owners/Contributors and Security Admins are the only ones that can edit a security policy. Subscription and resource group Owners and Contributors are the only ones that can apply security recommendations for a resource.

When planning access control using Azure RBAC for Defender for Cloud, make sure you understand who in your organization needs access to Defender for Cloud for the tasks they'll perform. Only then you can configure Azure RBAC properly.

We recommend that you assign the least permissive role needed for users to complete their tasks. For example, users who only need to view information about the security state of resources but not take action, such as applying recommendations or editing policies, should be assigned the Reader role.

## Security policies and recommendations

### Security policies

A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Defender for Cloud, you can define policies for your Azure subscriptions, which can be tailored to the type of workload or the sensitivity of data.

Defenders for Cloud policies contain the following components:

- **[Data collection](monitoring-components.md)**: Includes agent provisioning and data collection settings.

- **[Security policy](tutorial-security-policy.md)**: An [Azure Policy](../governance/policy/overview.md) that determines which controls are monitored and recommended by Defender for Cloud. You can also use Azure Policy to create new definitions, define more policies, and assign policies across management groups.

- **[Email notifications](configure-email-notifications.md)**: Includes security contacts and notification settings.
- **[Pricing tier](defender-for-cloud-introduction.md#protect-cloud-workloads)**: Offered with or without Microsoft Defender for Cloud's Defender plans, which determine which Defender for Cloud features are available for resources in scope (can be specified for subscriptions and workspaces using the API).

Specifying a security contact ensures that Azure can reach the right person in your organization if a security incident occurs. 

For more information on how to enable this recommendation, read [Configure email notifications for security alerts](configure-email-notifications.md).

### Security policy definitions and recommendations

Defender for Cloud automatically creates a default security policy for each of your Azure subscriptions. You can edit the policy in Defender for Cloud or use Azure Policy to create new definitions, define more policies, and assign policies across management groups. Management groups can represent the entire organization or a business unit within the organization. You can monitor policy compliance across these management groups.

Before configuring security policies, review each of these three [security recommendations](review-security-recommendations.md):

1. See if these policies are appropriate for your various subscriptions and resource groups.

2. Understand what actions address the security recommendations.

3. Determine who in your organization is responsible for monitoring and remediating new recommendations.

## Data collection and storage

Defender for Cloud uses the Log Analytics Agent and the Azure Monitor Agent to collect security data from your Virtual Machines (VM). [Data collected](monitoring-components.md) from the Log Analytics Agent is stored in your Log Analytics workspaces.

> [!Note]
> Microsoft ensures the privacy and security of your data. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service. For more information about data handling and privacy, read [Defender for Cloud data security](data-security.md).

### Log Analytics Agent

When automatic provisioning is enabled in the security policy, the [data collection agent](monitoring-components.md) is installed on all supported Azure VMs and any new supported VMs that are created. If the VM or computer already has the Log Analytics Agent installed, Defender for Cloud uses the current installed agent. The agent's process is designed to be non-invasive and have minimal effect on VM performance.

> [!Important]
> If you want to disable Data Collection at some point, you can turn it off in the security policy. However, because the Log Analytics Agent may be used by other Azure management and monitoring services, the agent won't be uninstalled automatically when you turn off Data Collection in Defender for Cloud. You can manually uninstall the agent if needed.

To find a list of supported VMs, read [Defender for Cloud VMs common questions](faq-vms.yml).

### Workspace

A workspace is an Azure resource that serves as a container for data. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

Data collected from the Log Analytics Agent can be stored in an existing Log Analytics workspace associated with your Azure subscription or in a new workspace.

In the Azure portal, you can browse to see a list of your Log Analytics workspaces, including any created by Defender for Cloud. A related resource group is created for new workspaces. Resources are created according to this naming convention:

- **Workspace**: *DefaultWorkspace-[subscription-ID]-[geo]*

- **Resource Group**: *DefaultResourceGroup-[geo]*

For workspaces created by Defender for Cloud, data is retained for 30 days. For existing workspaces, retention is based on the workspace pricing tier. 

If your agent reports to a workspace other than the default workspace, any Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads) that you've enabled on the subscription should also be enabled.

## Ongoing security monitoring

After initial configuration and application of Defender for Cloud recommendations, the next step is considering Defender for Cloud operational processes.

The [Defender for Cloud Overview](overview-page.md) provides a unified view of security across all your Azure resources and any non-Azure resources you've connected. This example shows an environment with many issues to resolve:

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

 Defender for Cloud doesn't interfere with your normal operational procedures. It passively monitors your deployments and provides recommendations based on the security policies you enabled.

When you first opt in to use Defender for Cloud for your current Azure environment, make sure that you review all recommendations, which can be done in the **Recommendations** page, located on the left hand side of the navigation menu.

> [!Note]
> Use the threat intelligence option as part of your daily security operations. You'll be able to identify security threats against the environment, such as identify if a particular computer is part of a botnet.

### Onboard non-Azure resources

Defender for Cloud can monitor the security posture of your non-Azure computers but you need to first onboard these resources. 

For more information on how to onboard non-Azure resources, read [Onboard non-Azure computers](quickstart-onboard-machines.md)

### Monitoring for new or changed resources

Most Azure environments are dynamic, with resources regularly being created, spun up or down, reconfigured, and changed. Defender for Cloud helps ensure that you have visibility into the security state of these new resources.

When you add new resources such as VMs and Structured Query Language Databases (SQL DBs) to your Azure environment, Defender for Cloud automatically discovers these resources and begins to monitor their security, including Platform as a Service (PaaS) web roles and worker roles. If Data Collection is enabled in the [Security Policy](tutorial-security-policy.md), more monitoring capabilities are enabled automatically for your VSs.

You should also regularly monitor existing resources for configuration changes that can create security risks, drift from recommended baselines, and security alerts.

### Hardening access and applications

As part of your security operations, you should also adopt preventative measures to restrict access to VMs, and control the applications that are running on VMs. By locking down inbound traffic to your Azure VMs, you're reducing the exposure to attacks, and at the same time providing easy access to connect to VMs when needed. Use the [just-in-time VM access](just-in-time-access-usage.md) feature to harden access to your VMs.

You can use [adaptive application controls](adaptive-application-controls.md) to limit which applications can run on your VMs located in Azure. Among other benefits, adaptive application controls help harden your VMs against malware. With the help of machine learning, Defender for Cloud analyzes processes running in the VM to help you create allowlist rules.

## Incident response

Defender for Cloud detects and alerts you to threats as they occur. Organizations should monitor for new security alerts and take action as needed to investigate further or remediate the attack. 

For more information on how Defender for Cloud threat protection works, read [How Defender for Cloud detects and responds to threats](alerts-overview.md#detect-threats).

Although we can't create your incident response plan, we'll use Microsoft Azure Security Response in the Cloud lifecycle as the foundation for incident response stages. The stages of incident response in the cloud lifecycle are in this order:

1. Detect
2. Assess
3. Diagnose
4. Stabilize
5. Close

> [!Note]
> You can use the National Institute of Standards and Technology (NIST) [Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) as a reference to assist you as you build your own incident response plan.

You can use Defender for Cloud alerts during the following stages:

- **Detect**: Identify a suspicious activity in one or more resources.

- **Assess**: Perform the initial assessment to obtain more information about the suspicious activity.

- **Diagnose**: Use the remediation steps to conduct the technical procedure to address the issue.

Each Security Alert provides information that can be used to better understand the nature of the attack and suggest possible mitigations. Some alerts also provide links to either more information or to other sources of information within Azure. You can use the information provided for further research and to begin mitigation, and you can also search security-related data that is stored in your workspace.

The following example shows a suspicious Remote Desktop Protocol (RDP) activity taking place:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-ga.png" alt-text="Suspicious activity.":::

This page shows the details regarding the time that the attack took place, the source hostname, the target VM, and also gives recommendation steps. 

> [!NOTE]
> In some circumstances, the source information of the attack may be empty. For more information about this type of behavior, read [Missing Source Information in Defender for Cloud alerts](/archive/blogs/azuresecurity/missing-source-information-in-azure-security-center-alerts).

Once you identify the compromised system, you can run a [workflow automation](workflow-automation.md) that was previously created. Workflow automations are a collection of procedures that can be executed from Defender for Cloud after they've been triggered by an alert.

For more information on how to use Defender for Cloud capabilities to assist you during your incident response process, read [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md).

## Next steps

In this guide, you learned how to plan for Defender for Cloud adoption. Learn more about Defender for Cloud:

- [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md)
- [Monitoring partner solutions with Defender for Cloud](./partner-integration.md) - Learn how to monitor the health status of your partner solutions.
- [Defender for Cloud common questions](faq-general.yml) - Find frequently asked questions about using the service.
- [Azure Security blog](/archive/blogs/azuresecurity/) - Read blog posts about Azure security and compliance.
