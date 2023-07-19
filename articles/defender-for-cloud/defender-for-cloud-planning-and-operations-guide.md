---
title: Defender for Cloud Planning and Operations Guide
description: This document is intended to assist you during your planning phase prior to adopting Defender for Cloud. It includes practical information and examples pertaining to daily operations, roles, and procedures within a typical organization, and how Microsoft Defender for Cloud fits into your organizational and security context.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 02/06/2023
---

# Planning and Operations Guide

This guide is intended for information technology (IT) professionals, IT architects, information security analysts, and cloud administrators planning to use Defender for Cloud. 

## Planning Guide

This guide is meant to provide a detailed explanation of how Defender for Cloud fits into your organization's security requirements and cloud management model. It's important to understand how different individuals or teams in your organization can use the service to meet secure development and operations (SecDevOps), monitoring, governance, and incident response needs. First, here are some relevant areas of consideration when planning to use Defender for Cloud:

- Security Roles
- Access Controls
- Security Policies and Recommendations
- Data Collection and Storage
- Onboarding non-Azure resources
- Ongoing Security Monitoring
- Incident Response

In this first section, we'll address each area briefly, applying Defender for Cloud to each of the areas. 

> [!NOTE]
> Read [Defender for Cloud common questions](faq-general.yml) for a list of common questions (FAQ) that may be useful during the designing and planning phase.

## Security Roles

Depending on the size and structure of your organization, multiple individuals and teams may use Defender for Cloud to perform different security-related tasks. In the following diagram, you can see an example of fictitious personas in a typical organization, and their respective roles and security responsibilities.  Following the diagram we explain how different aspects of Microsoft Defender for Cloud provide value to a given role and responsibility, enabling each person to succeed in their security-related role. 

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png" alt-text="Roles.":::

Here is an example of how Defender for Cloud enables the following roles (roles and responsibilities can vary across organizations, so the features are not limited to these roles only) to meet their respective security responsibilities. 

**Cloud Workload Owner**:

-Microsoft Defender for Cloud offers deep visibility into your cloud environment, enabling the cloud workload owner to gain insights into their cloud workloads, applications, and data. It provides a unified view of their cloud resources, allowing them to understand the usage patterns, user behavior, and potential security risks. This level of visibility enables the owner to better manage their cloud workload and its related resources. 

**Chief Information Security Officer (CISO)/Chief Information Officer (CIO)**

-Understanding the company's security posture across cloud workloads and being informed of major attacks and risks takes a critical role in the life of a CISO or CIO. Microsoft Defender Cloud Security Posture Management (MDCSM) prioritizes remediation and helps gain resource insights. Defender for Cloud highlights why some security recommendations are more important than others, allowing the security team to focus on the biggest risks in the organization. By using curated paths to conduct attack path analysis on the environment, the system reveals connections across your assets and lets the relevant parties know how one vulnerability can open multiple doors to your cloud environment, allowing you to take action to mitigate risks and prevent attacks.  

**IT Security**

To simplify the setting up of company security policies to ensure the appropriate protections, Microsoft Defender for Cloud helps to maintain compliance with various industry regulations and security standards. It offers a set of predefined policies and controls that can be customized to align with your specific compliance and policy requirements. It provides continuous monitoring, alerts, and reports to ensure that your cloud resources adhere to the necessary security and governance guidelines.

- Report generation using Microsoft Defender for Cloud: For information on generating reports for leadership or auditors read https://learn.microsoft.com/en-us/azure/defender-for-cloud/regulatory-compliance-dashboard#generate-compliance-status-reports-and-certificates.

**Security Operations**

-Microsoft Defender for Cloud continuously monitors your cloud resources and applications, detecting suspicious activities and potential security incidents. It generates real-time alerts based on predefined detection rules and advanced analytics, notifying the relevant parties of potential threats. These alerts provide critical information about the nature of the attack, affected resources, and associated users, enabling a prompt investigation.
In the event of a security incident, Microsoft Defender for Cloud supports you from detection of the incident, all the way through remediation and post-incident management. You can read more about Microsoft Defender for Cloud Incident Management below in this article. 

**Security Analyst**

--By leveraging investigation capabilities, Microsoft Defender for Cloud empowers security teams to swiftly and effectively investigate attacks, understand the nature of the incident, and take appropriate remediation actions to mitigate the impact and prevent future occurrences. 

**Access Controls**

Defender for Cloud uses [Azure role-based access control (Azure Role-based access control)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure. When a user opens Defender for Cloud, they can only see information related to resources they have access to. According to the Azure Role-based Access Controls, a user can be assigned the role of **Owner**, **Contributor** or **Reader** within the subscription or resource group that the relevant resource belongs to. In addition to these Azure-based roles, there are two roles specific to Defender for Cloud:

1. **Security Reader**: Security Reader has view-only permission for Defender for Cloud configurations. These include recommendations, alerts, policy, and health. A Security Reader is not permitted to make changes.

2. **Security Admin**: Security Admin has the same permissions as the Security Reader (above) plus the added capabilities of updating the security policy and dismissing recommendations and alerts.

The following roles ( as shown in the previous diagram) would theoretically need one of the following Azure Role-based access control roles to utilize Microsoft Defender for Cloud:

-Cloud Workload Owner: Resource Group Owner/Contributor.

-Chief Information Security Officer (CISO)/Chief Information Officer (CIO): Subscription Owner/Contributor or Security Admin (depends on the exact use case and responsibilities)

-IT Security: Subscription Owner/Contributor or Security Admin

-Security Operations: Subscription Reader or Security Reader to view alerts, or Subscription Owner/Contributor or Security Admin required to dismiss alerts

Security Analyst: Subscription Reader to view alerts, Subscription Owner/Contributor required to dismiss alerts

Additional important information to consider:

- Only subscription Owners/Contributors and Security Admins can edit a security policy.

- Only subscription and resource group Owners and Contributors can apply security recommendations for a resource.

During the planning phase, keep in mind that in order to configure Azure Role-based access control correctly for Defender for Cloud, it is critical to understand who in your organization needs what type of access to Defender for Cloud for the tasks they'll need to perform using the service. 
> [!NOTE]
> We recommend assigning the least permissive role necessary for a user to complete their task. For example, users who need to view information about the security state of resources only, but not to take action, such as applying recommendations or editing policies, would ideally be assigned the Reader role.

## Security policies and recommendations

A security policy defines the desired security configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Defender for Cloud, you can define policies for your Azure subscriptions. Any policy you define can be tailored to the type of workload or the sensitivity of your data.

Defenders for Cloud policies contain the following components:

- [Data collection](monitoring-components.md): Agent provisioning and data collection settings.

- [Security policy](tutorial-security-policy.md): an [Azure Policy](../governance/policy/overview.md) that determines which controls are monitored and recommended by Defender for Cloud. You can also use Azure Policy to create new definitions, define more policies, and assign policies across management groups.

- [Email notifications](configure-email-notifications.md): Security contacts and notification settings.
- [Pricing tier](defender-for-cloud-introduction.md#protect-cloud-workloads): The pricing depends on the Microsoft Defender for Cloud's Defender plan/s you are subscribed to. The type of subscription/s will also determine the available features for resources in scope (can be specified for subscriptions and workspaces using the API).

> [!NOTE]
> Specifying a security contact ensures that Azure can reach the right person in your organization in the case of a security incident. Read [Provide security contact details in Defender for Cloud](configure-email-notifications.md) for more information on how to enable this recommendation.

### Security Policies Definitions and Recommendations

Defender for Cloud automatically creates a default security policy for each of your Azure subscriptions. You can edit the policy in Defender for Cloud or use Azure Policy to create new definitions, define more policies, and assign policies across management groups. Management groups can represent the entire organization or specific business units within an organization. You can monitor policy compliance across any management group.

Before configuring security policies, review each of the [security recommendations](review-security-recommendations.md):

- Check that the policies are appropriate for your subscriptions and resource groups.

- Understand the actionable guidance that come with security recommendations.

- Determine the responsible party in your organization for monitoring and remediating security recommendations.

## Data collection and storage

Defender for Cloud uses the Log Analytics agent and the Azure Monitor Agent to collect security data from your virtual machines. [Data collected](monitoring-components.md) from this agent is stored in your Log Analytics workspaces.

### Agent

When automatic provisioning is enabled in the security policy, the [data collection agent](monitoring-components.md) is installed on all supported Azure VMs and on any new supported VMs that are created. If the VM or computer already has the Log Analytics agent installed, Defender for Cloud uses the currently installed agent. The agent's process is designed to be non-invasive and has minimal effect on VM performance.

If at some point you want to disable Data Collection, you can turn it off manually in the security policy. Because the Log Analytics agent may be used by other Azure management and monitoring services, the agent cannot be uninstalled automatically when you turn off data collection in Defender for Cloud. You have to manually uninstall the agent.

> [!NOTE]
> To find a list of supported VMs, read the [Defender for Cloud common questions](faq-vms.yml).

### Workspace

A workspace is an Azure resource that serves as a container for data. You or other members of your organization might use multiple workspaces to manage different sets of data that are collected from all or portions of your IT infrastructure.

Data collected from the Log Analytics agent can be stored either in an existing Log Analytics workspace associated with your Azure subscription or in a new workspace.

In the Azure portal, you can browse to see a list of your Log Analytics workspaces, including the ones created by Defender for Cloud. A related resource group is created for new workspaces. Resources are created using the following naming convention:

- Workspace: *DefaultWorkspace-[subscription-ID]-[geo]*

- Resource Group: *DefaultResourceGroup-[geo]*

For workspaces created by Defender for Cloud, data is retained for 30 days. For existing workspaces, retention is based on the workspace pricing tier. You can also use an existing workspace.

If your agent reports to a workspace other than the **default** workspace, any Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads) that you've enabled on the subscription should also be enabled on the workspace.

> [!NOTE]
> Microsoft makes strong commitments to protect the privacy and security of this data. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service. For more information about data handling and privacy, read [Defender for Cloud Data Security](data-security.md).

## Onboard Non-Azure Resources

Defender for Cloud can also monitor the security posture of your non-Azure computers, however you must first onboard these resources. Read [Onboard non-Azure computers](quickstart-onboard-machines.md) for more information on how to onboard non-Azure resources.

## Ongoing Security Monitoring

After the initial configuration and application of Defender for Cloud recommendations, the next step is utilizing Defender for Cloud for operational processes, using Defender for Cloud Overview. Defender for Cloud Overview provides a unified view of the secure state across all your Azure and non-Azure (if applicable) resources. The following image shows an example of an environment with issues to resolve using the Defender for Cloud Overview:

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

> [!NOTE]
> Defender for Cloud doesn't interfere with your regular operational procedures. Defender for Cloud passively monitors your deployments and provides recommendations based on the security policies you enabled.

When you first opt-in to use Defender for Cloud for your current Azure environment, make sure to review all recommendations on the **Recommendations** page.

It is recommended to check the threat intelligence feature as part of your daily security operations, to identify and protect against security threats against your environment. Identifying malicious activities, suspicious behavior, and potential vulnerabilities, helps mitigate risks before they impact your cloud workload.

### Monitoring for New or Changed Resources

Most Azure environments are dynamic, with resources being created regularly, spun up or down, reconfigured, and changed. Defender for Cloud helps ensure clear visibility into the security state of these new resources.

When you add new resources (VMs, SQL DBs) to your Azure environment, Defender for Cloud automatically discovers these resources and begins to monitor their security, including PaaS web roles and worker roles. If Data Collection is enabled in the [Security Policy](tutorial-security-policy.md), additional monitoring capabilities are enabled automatically for your virtual machines.

Part of security best practice also includes regularly monitoring existing resources for configuration changes that could create security risks, drift from recommended baselines, and security alerts.

### Hardening access and applications

As part of your security operations, it is wise to adopt preventative measures to restrict access to VMs, and control the applications that are running on VMs. By locking down inbound traffic to your Azure VMs, you reduce exposure to attacks, while simultaneously providing easy access to connect to VMs when needed. Use the [just-in-time VM access](just-in-time-access-usage.md) access feature to harden access to your VMs.

Use [adaptive application controls](adaptive-application-controls.md) to limit the applications that can run on your VMs located in Azure. Amongst other benefits, adaptive application controls help to harden your VMs against malware. With the help of machine learning, Defender for Cloud analyzes processes running in the VM to help you create allowlist rules. More information on Adaptive Application Controls, including their benefits (referred to at the beginning of this paragraph), is available to read in the link above.

## Incident Response and Remediation

Microsoft Incident Response provides support for customers before, during, and after a cybersecurity incident. In the event of a security incident, Microsoft Defender for Cloud facilitates rapid incident response and remediation. It provides real-time alerts and actionable insights to help security teams investigate and respond to security events effectively. It also offers automated response actions and containment measures to mitigate ongoing threats and limit their impact. Read this article for more detailed information on Defender for Cloud Incident Response


The stages of incident response in the cloud lifecycle are:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-1.png" alt-text="Stages of the incident response in the cloud lifecycle.":::

> [!NOTE]
> You can use the National Institute of Standards and Technology (NIST) [Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) as a reference to assist you in building your own.

Here are the typical stages of incident response in Microsoft Defender for Cloud:

- **Detect**: Detection of security alerts generated by Microsoft Defender for Cloud. These alerts are triggered based on predefined policies, anomaly detection, or threat intelligence, indicating potential security incidents in your cloud environment.

- **Assess**: Assess the alert's severity, context, and relevance to your organization's cloud resources and user activities. Microsoft Defender for Cloud provides tools to query and explore relevant security data, including user activity logs, application access logs, and threat intelligence feeds. 

- **Diagnose**:  Categorize and prioritize the incident based on its potential impact and risk level.

-**Remediate**:  Contain the threat and prevent it from spreading further. Work to remove any remaining malicious elements, close security gaps, and implement necessary patches or configuration changes to prevent similar incidents in the future.

-**Report**:  Detailed incident reports are prepared to document the incident, response actions, and any lessons learned.

-**Post-Incident Monitoring & Prevention**: Implement additional security measures based on insights gained from the incident response process

The following example shows a suspicious RDP activity taking place:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-ga.png" alt-text="Suspicious activity.":::

This page shows the details regarding the time that the attack took place, the source hostname, the target VM and also gives recommendation steps. In some circumstances, the source information of the attack may be empty. Read [Missing Source Information in Defender for Cloud alerts](/archive/blogs/azuresecurity/missing-source-information-in-azure-security-center-alerts) for more information about this type of behavior.

Once you identify the compromised system, you can run a [workflow automation](workflow-automation.md) that was previously created. Workflow automations are a collection of procedures that can be executed from Defender for Cloud once triggered by an alert.

> [!NOTE]
> Read [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md) for more information on how to use Defender for Cloud capabilities to assist you during your Incident Response process.

## Next steps

We hope this document guided you on how to plan for Defender for Cloud adoption. You can learn about Defender for Cloud in the articles below, and you are always welcome to search for more information on Microsft Learn.

- [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md) How to manage and respond to alerts. 
- [Monitoring partner solutions with Defender for Cloud](./partner-integration.md) - Learn how to monitor the health status of your partner solutions.
- [Defender for Cloud common questions](faq-general.yml) - Frequently asked questions about using Defender for Cloud service.
- [Azure Security blog](/archive/blogs/azuresecurity/) - Read blog posts about Azure security and compliance.
