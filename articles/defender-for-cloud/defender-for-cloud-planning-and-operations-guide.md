---
title: When to use Defender for Cloud?
description: Learn how to plan before adopting Defender for Cloud and considerations regarding daily operations.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 02/02/2024

#Customer intent: As an information technology professional, IT architect, information security analyst, and cloud administrators, I want to learn when to use Defender for Cloud.
---

# When to use Defender for Cloud?

In this article, you learn about Defender for Cloud's integration with your organization's security requirements and cloud management model. It's important to understand how different individuals or teams in your organization use the service to meet secure development and operations, monitoring, governance, and incident response needs.

## Security roles and access controls

Depending on the size and structure of your organization, multiple individuals and teams might use Defender for Cloud to perform different security-related tasks. The following diagram provides an example of fictitious personas and their respective roles. Defender for Cloud enables these individuals to meet their various security responsibilities.

:::image type="complex" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png" alt-text="Diagram showing fictitious personas and their security roles and responsibilities." lightbox="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png"::: Diagram that shows five fictitious personas. Jeff manages a cloud workload and its related resources. Jeff is responsible for implementing and maintaining protections in accordance with company security policy. Ellen, CISO/CIO is responsible for all aspects of security for the company. Ellen wants to understand the company's security posture across cloud workloads and needs to be informed of major attacks and risks. David sets company security policies to ensure the appropriate protections are in place. David monitors compliance with policies and generates reports for leadership or auditors. Judy monitors and responds to security alerts at any time and escalates to Cloud workload owner or IT Security Analyst. Sam investigates attacks and works with Cloud Workload Owner to apply remediation. :::image-end:::

Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure. When a user opens Defender for Cloud, they only see information related to resources they have access to. Which means the user is assigned either the role of Owner, Contributor, or Reader to the subscription or resource group that a resource belongs to. In addition to these roles, there are two roles specific to Defender for Cloud:

- **Security reader**: a user that belongs to this role is able to view only Defender for Cloud configurations. This includes viewing recommendations, alerts, policy, and health, but not being able to make any changes.

- **Security admin**: this role is similar to the security reader role, but it also includes having the ability to update security policies and dismiss recommendations and alerts.

For example, the following table shows the required authorization roles for each of the fictitious personas mentioned in the previous diagram:

|Persona| Required authorization role|
|--|--|
|Jeff (Workload Owner)| Resource group owner or contributor.|
|Ellen (CISO/CIO)| Subscription owner or contributor, or security admin.|
|David (IT Security)| Subscription owner or contributor, or security admin.|
|Judy (Security Operations)| To view alerts: subscription reader or security reader. To dismiss alerts: subscription owner or contributor, or security admin.|
|Same (Security analyst)| To view alerts: subscription reader. To dismiss alerts: subscription owner or contributor. Workspace access might be required.|

> [!IMPORTANT]
>
> - Only subscription owners or contributors and security admins can edit a security policy.
> - Only subscription and resource group owners and contributors can apply security recommendations for a resource.

When planning access control using Azure Role-based access control for Defender for Cloud, make sure you understand who in your organization needs access to Defender for Cloud and what tasks they perform. Then you can assign the Azure Role-based access control accordingly.

> [!TIP]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, users who only need to view information about the security state of resources but not take action, such as applying recommendations or editing policies, should be assigned the Reader role.

## Security policies

A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Defender for Cloud, you can define policies for your Azure subscriptions, which can be tailored to the type of workload or the data's sensitivity.

Defender for Cloud policies contain the following components:

- [Data collection](monitoring-components.md): agent provisioning and data collection settings.

- [Security policy](tutorial-security-policy.md): an [Azure Policy](../governance/policy/overview.md) that determines which controls are monitored and recommended by Defender for Cloud. You can also use Azure Policy to create new definitions, define more policies, and assign policies across management groups.

- [Email notifications](configure-email-notifications.md): security contacts and notification settings.
- [Pricing tier](defender-for-cloud-introduction.md#protect-cloud-workloads): with or without Microsoft Defender for Cloud's Defender plans, which determine which Defender for Cloud features are available for resources in scope (can be specified for subscriptions and workspaces using the API).

> [!NOTE]
> Specifying a security contact ensures that Azure can reach the right person in your organization if a security incident occurs. For more information, see [Provide security contact details in Defender for Cloud](configure-email-notifications.md).

### Defining security policies

Defender for Cloud automatically creates a default security policy for each of your Azure subscriptions. You can edit the policy in Defender for Cloud or use Azure Policy to create and define more policies and assign policies across management groups. Management groups can represent the entire organization or a business unit within the organization. You can monitor policy compliance across these management groups.

Before configuring security policies, review each of the [security recommendations](review-security-recommendations.md):

- See if these policies are appropriate for your various subscriptions and resource groups.

- Understand what actions address the security recommendations.

- Determine who in your organization is responsible for monitoring and remediating new recommendations.

## Data collection and storage

Defender for Cloud uses the Log Analytics agent the Azure Monitor Agent to collect security data from your virtual machines. Data collected from these agents is stored in your Log Analytics workspaces.

For more information on data collection, see [How does Defender for Cloud collect data?](monitoring-components.md)

> [!IMPORTANT]
> Microsoft is strongly committed to protecting the privacy and security of collected data. Microsoft adheres to strict compliance and security guidelines in both the coding and service operating process. For more information on data handling and privacy, see [Defender for Cloud Data Security](data-security.md).

### Agent

When automatic provisioning is enabled in the security policy, Defender for Cloud installs a [data collection agent](monitoring-components.md) on all supported Azure virtual machines and any new supported virtual machines that are created. If the virtual machine or computer already has the Log Analytics agent installed, Defender for Cloud uses the current installed agent. The agent's process is designed to be non-invasive and have minimal effect on the virtual machine's performance. For a list of supported virtual machines, see [Defender for Cloud common questions](faq-vms.yml).

You can turn off Defender for Cloud's data collection in the security policy. However, the Log Analytics agent isn't uninstalled automatically when you turn off data collection because it might be used by other Azure management and monitoring services. You can manually uninstall the agent if needed.

### Workspace

A workspace is an Azure resource that serves as a container for data. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

Data collected from the Log Analytics agent can be stored in an existing Log Analytics workspace associated with your Azure subscription or a new workspace. You can either use an existing workspace or a workspace created by Defender for Cloud. The existing workspace's pricing tear determines the data retention period. However, data in workspaces created by Defender for Cloud is retained for 30 days.

If your agent reports to a workspace other than the **default** workspace, any Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads) that you enabled on the subscription should also be enabled on the workspace.

In the Azure portal, you can view your Log Analytics workspaces, including any created by Defender for Cloud. A related resource group is created for new workspaces. Resources are created according to the following naming convention:

- Workspace: `*DefaultWorkspace-[subscription-ID]-[geo]*`

- Resource Group: `*DefaultResourceGroup-[geo]*`

## Onboard non-Azure resources

Defender for Cloud can monitor the security posture of your non-Azure computers. To do so, you first need to onboard these resources. For more information, see [Onboard non-Azure computers](quickstart-onboard-machines.md).

## Ongoing security monitoring

After initial configuration and application of Defender for Cloud recommendations, the next step is to consider Defender for Cloud operational processes.

The Defender for Cloud **Overview** provides a unified view of security across all of your Azure resources and any non-Azure resources you connected. This example shows an environment with many issues to resolve:

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

> [!NOTE]
> Defender for Cloud doesn't interfere with your normal operational procedures. Defender for Cloud passively monitors your deployments and provides recommendations based on the security policies you enabled.

When you first opt in to use Defender for Cloud for your current Azure environment, make sure that you review all recommendations. To review the recommendations, under **General**, select **Recommendations**.

Plan to visit the threat intelligence option as part of your daily security operations. There you can identify security threats against the environment, such as identify if a particular computer is part of a botnet.

### Monitoring for new or changed resources

Most Azure environments are dynamic, with resources regularly being created, spun up or down, reconfigured, and changed. Defender for Cloud helps ensure that you have visibility into the security state of these new resources.

Defender for Cloud automatically discovers newly added sources to your Azure environment, such as virtual machines and SQL databases, and begins to monitor their security, including PaaS web roles and worker roles. If data collection is enabled in the [Security Policy](tutorial-security-policy.md), more monitoring capabilities are enabled automatically for your virtual machines.

You should also regularly monitor existing resources for configuration changes that can create security risks, drift from recommended baselines, and security alerts.

### Hardening access and applications

As part of your security operations, you should also adopt preventative measures to restrict access to virtual machines, and control the applications that are running on virtual machines. By locking down inbound traffic to your Azure virtual machines, you reduce exposure to attacks, and at the same time provide easy access to connect to virtual machines when needed. Use the [just-in-time virtual machine access](just-in-time-access-usage.md) access feature to harden access to your virtual machines.

You can also use [adaptive application controls](adaptive-application-controls.md) to limit which applications can run on your virtual machines that are located in Azure. Among other benefits, adaptive application controls help harden your virtual machines against malware. With the assistance of machine learning, Defender for Cloud analyzes processes running in the virtual machine to help you create `allowlist` rules.

## Incident response

Defender for Cloud detects and alerts you to threats as they occur. Organizations should monitor for new security alerts and take action as needed to investigate further or remediate the attack. For more information on how Defender for Cloud threat protection works, see [How Defender for Cloud detects and responds to threats](alerts-overview.md#detect-threats).

Although we can't create your Incident Response plan, we use Microsoft Azure Security Response in the Cloud lifecycle as the foundation for incident response stages. The stages of incident response in the cloud lifecycle are: detection, assessment, diagnosis, stabilization, and closing.

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-1.png" alt-text="Stages of the incident response in the cloud lifecycle.":::

> [!NOTE]
> You can use the National Institute of Standards and Technology (NIST) [Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) as a reference to assist in building your own cloud lifecycle.

You can use Defender for Cloud alerts during the following stages:

- **Detect**: identify a suspicious activity in one or more resources.

- **Assess**: perform the initial assessment to obtain more information about the suspicious activity.

- **Diagnose**: use the remediation steps to conduct the technical procedure to address the issue.

Each Security Alert provides information that can be used to better understand the nature of the attack and suggest possible mitigations. Some alerts also provide links to either more information or to other sources of information within Azure. You can use the information provided for further research and to begin mitigation, and you can also search security-related data that is stored in your workspace.

The following example shows a suspicious RDP virtual machine activity taking place:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-ga.png" alt-text="Screenshot showing suspicious RDP virtual machine activity.":::

This report details the time that the attack took place, the source hostname, the target virtual machine and also provides recommendation steps. In some circumstances, the source information of the attack might be empty. For more information, see [Missing Source Information in Defender for Cloud alerts](/archive/blogs/azuresecurity/missing-source-information-in-azure-security-center-alerts).

Once you identify the compromised system, you can run a [workflow automation](workflow-automation.md) that was previously created. Workflow automations are a collection of procedures that can be executed from Defender for Cloud once triggered by an alert.

For more information on how to use Defender for Cloud capabilities during your Incident Response process, see [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md).

## Related content

- [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md).
- [Monitoring partner solutions with Defender for Cloud](./partner-integration.md).
- [Defender for Cloud common questions](faq-general.yml).
- [Azure Security blog](/archive/blogs/azuresecurity/).
