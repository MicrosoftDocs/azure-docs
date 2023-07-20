---

title: Defender for Cloud Planning and Operations Guide
description: Learn about planning to adopt Defender for Cloud and considerations about using it for operations tasks.
author: meijei22
ms.author: dcurwin
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 07/20/2023
---

# Planning and operations guide

This document will help you plan how to use Defender for Cloud and integrate it into your organization's operations tasks.

##  <a name='planning-guide'></a>Planning guide

To understand how you can use Defender for Cloud to protect your organization's cloud-based applications you will need to understand the distinct requirements of the range of individuals or teams in your organization. Including understanding their needs for secure development and operations, monitoring, governance, and incident response. The key areas to consider are:

* [Security roles and access controls](#security-roles-and-access-controls)
* [Security policies and recommendations](#security-policies-and-recommendations)
* [Data collection and storage](#data-collection-and-storage)
* [Onboarding non-Azure resources](#onboard-non-azure-resources)
* [Ongoing security monitoring](#ongoing-security-monitoring)
* [Incident response](#incident-response)


> [!NOTE]
> For further Defender for Cloud details, see [Defender for Cloud common questions](faq-general.yml).

##  <a name='security-roles-and-access-controls'></a>Security roles and access controls

When planning access control, consider who in your organization needs access to Defender for Cloud to complete their security-related tasks, and what level of access they actually need, in order to configure their roles using [Azure role-based access control (RBAC)](../role-based-access-control/role-assignments-portal.md), properly. 

Depending on the size and structure of your organization, your organization may have multiple individuals and teams using Defender for Cloud for different tasks. For instance, consider the following fictional staff members and their roles: 
* **Jeff** (Workload Owner)
* **Ellen** (CISO/CIO)
* **David** (IT Security)  
* **Judy** (Security Operations)
* **Sam**  (Security Analyst)

Each of them has a range of security responsibilities:
:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig01-new.png" alt-text="Graphic visualizing the example team members, their roles, and security related tasks as described in the following text.":::


|Person   | Role   |Security Responsibility|
|----------|-----------|------------|
|**Jeff** |Workload Owner       | Manages a cloud workload and its related resources. </br></br>Is responsible for implementing and maintaining protections according to the company security policy. </br></br>May define policies and monitor alerts (small organizations).|
|**Ellen**  | CISO/CIO    | Handles all aspects of security for the company.</br>Wants to understand the company's security posture across cloud workloads.</br> Must be informed of major attacks and risks.  |
|**David** | IT Security| Sets company security policies to ensure the appropriate protections are in place.</br> Monitors policy compliance.</br>Generates reports for leadership or auditors.|
| **Judy** | Security Operations| Monitors and responds to security alerts at any time.</br> Escalates issues to a Cloud Workload Owner or an IT Security Analyst. |
| **Sam** | Security Analyst| Investigates attacks.</br> Works with a Cloud Workload Owner to apply remediation.</br>

Defender for Cloud uses Azure RBAC to assign [built-in roles](../role-based-access-control/built-in-roles.md) based on the [scope](..//role-based-access-control/scope-overview.md) levels each team member needs. Team members and other users, groups, and services, only are assigned those subscriptions or resources for which they are responsible and see only the information related to those assignments.

The most general built-in roles include:
- **Owner**: Has full permissions to change resources and roles. 
- **Contributor**: Has full permissions to change resources but can't change Azure RBAC roles.
- **Reader**: Has the ability to view, but not change, resources.

In addition, there are roles specific to Defender for Cloud:

- **Security Reader**: Can view, but not change, Defender for Cloud configurations, such as for recommendations, alerts, policy, and health.

- **Security Admin**: Can view and update configurations and the security policy, as well as dismiss recommendations and alerts.

- **Security Assessment Contributor**: Can push assessments to Microsoft Defender for Cloud.

It's a best practice to assign team members the least privilege needed to complete their work. In the example, team members could be assigned the following Azure RBAC roles based on their work needs:

|Person   | Role   |Azure RBAC role(s)|
|----------|-----------|------------|
|**Jeff** |Workload Owner       | Resource Group Owner/Contributor|
|**Ellen**  | CISO/CIO    | Subscription Owner/Contributor or Security Admin  |
|**David** | IT Security| Subscription Owner/Contributor or Security Admin|
| **Judy** | Security Operations |Subscription Reader or Security Reader to view alerts. Subscription Owner/Contributor or Security Admin to dismiss alerts. |
| **Sam** | Security Analyst| Subscription Reader to view alerts.</br>Subscription Owner/Contributor to dismiss alerts.</br> If there is a need to access the workspace, Resource Group Owner/Contributor may be needed. |

Knowing the needs of your team members will help you ultimately decide which roles are appropriate. 

When assigning roles to team members remember that:

- Only subscription Owners, subscription Contributors, and Security Admins can edit a security policy.

- Only subscription and resource group Owners and Contributors can apply security recommendations for a resource.

- Team members should be granted the least permissive role needed to complete their tasks.


##  <a name='security-policies-and-recommendations'></a>Security policies and recommendations

Defender for Cloud allows you to define [security policies](security-policy-concept.md) for your Azure subscriptions, based on the type of workload, sensitivity of data, or compliance needs of your organization. Based on the security policy, Defender for Cloud may make security recommendations which you can use to improve the security of your organization.

### <a name='security-policies'></a>Security Policies

A [security policy](tutorial-security-policy.md) is an [Azure Policy](../governance/policy/overview.md) that defines the security conditions you want to control, monitor, and improve through Defender for Cloud recommendations. You can also use Azure Policy to create new definitions and policies and assign policies across management groups. 

The following contribute to the process of maintaining and improving your security policies and should be configured to your organization's needs:

- [Data collection](monitoring-components.md): Monitoring components that use agent provisioning and data collection settings to provide visibility into your workload security, and which can be enabled in most plans. The components ensure security coverage for all supported resources.

- [Email notifications](configure-email-notifications.md): Sets the security contacts and security notification settings to ensure security messages reach the right contact if an incident occurs. See [Provide security contact details in Defender for Cloud](configure-email-notifications.md) for more information.

- [Pricing tier](defender-for-cloud-introduction.md#protect-cloud-workloads): This determines which Defender for Cloud features are available for resources in scope and can be specified for subscriptions and workspaces using the API.


###  <a name='security-policies-definitions-and-recommendations'></a>Security policies, definitions, and recommendations

 Defender for Cloud automatically creates a default security policy for each of your Azure subscriptions. You can edit the policy, create new security policy definitions and policies, and assign policies across management groups in Defender for Cloud or through [Azure Policy](../governance/policy/overview.md). You can monitor policy compliance across the management groups, whether they represent your entire organization or a business unit. 


Recommendations are generated based on your security policy. Check the [security recommendations](review-security-recommendations.md) before configuring security policies to:

- See if your existing policies are appropriate for your various subscriptions and resource groups or require any changes.

- Understand what actions address the security recommendations.

- Decide who in your organization is responsible for monitoring and remediating new recommendations.

##  <a name='data-collection-and-storage'></a>Data collection and storage

When automatic provisioning is enabled in your security policy, Defender for Cloud uses the Log Analytics agent and the Azure Monitor Agent to [collect security data](monitoring-components.md) from your Virtual Machines (VMs). The data is stored in your Log Analytics workspaces. 

### <a name='agents'></a>Agents

When automatic provisioning is enabled, the [Log Analytics agent](monitoring-components.md#log-analytics-agent) is installed on all currently supported Azure hosted VMs and any new ones created. If a Log Analytics agent is already installed, Defender for Cloud uses the installed agent. The agent's process is non-invasive and designed to have minimal effect on VM performance.

[Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) replaces all of Azure Monitor's legacy monitoring agents, including Log Analytics agent. The legacy Log Analytics agent will be deprecated after August 2024. If you have machines already deployed with legacy Log Analytics agents, we recommend you [migrate to Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-migration.md) as soon as possible.

You can disable data collection at any time in the security policy. However, the agent may be used by other Azure management and monitoring services. You'll need to turn off data collection in Defender for Cloud manually to uninstall the agent. 

> [!TIP]
> To find a list of supported VMs, read the [Defender for Cloud common questions](faq-vms.yml).
>
> See [Collect data from your workloads with the Log Analytics agent](working-with-log-analytics-agent.md) for more information about Log Analytic agent installation and configuration.

### <a name='workspace'></a>Workspace

You or other organization members might use multiple Azure workspaces to manage and contain different data sets collected throughout your IT infrastructure.

You can store your Log Analytics agent data in existing or new Log Analytics workspaces associated with your Azure subscription. 

View a list of your Log Analytics workspaces in the Azure portal, including any created by Defender for Cloud to ensure compliance with data privacy requirements. Defender for Cloud creates a related resource group for a new workspace in the same geolocation. Resources are created according to this naming convention:

- **Workspace**: *DefaultWorkspace-[subscription-ID]-[geo]*

- **Resource Group**: *DefaultResourceGroup-[geo]*

Defender for Cloud keeps data for workspaces it created for 30 days. If you use [an existing workspace](working-with-log-analytics-agent.md), retention is based on the workspace pricing tier.

If your agent reports to a workspace other than the **default** workspace, any [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads) that you've enabled on the subscription, should also be enabled on that workspace.



> [!NOTE]
> Microsoft is committed to protecting the privacy and security of this data. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service. For more information about data handling and privacy see [Microsoft Defender for Cloud data security](data-security.md).

##  <a name='onboard-non-azure-resources'></a>Onboarding non-Azure resources

Defender for Cloud can monitor the security posture of your non-Azure machines, but you need to onboard them first. For more information on how to onboard non-Azure resources see [Onboard non-Azure computers](quickstart-onboard-machines.md).

## <a name='ongoing-security-monitoring'></a>Ongoing security monitoring

Once you have configured and are reviewing and applying Defender for Cloud [ **Recommendations**](security-policy-concept.md#what-is-a-security-recommendation), you should consider Defender for Cloud in the context of your overall operational monitoring processes.

The [Defender for Cloud Overview page](overview-page.md) provides a unified view to monitor security across all your Azure and connected non-Azure resources.  

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

> [!NOTE]
> Defender for Cloud doesn't interfere with your normal operational procedures. It passively monitors your deployments and provides recommendations based on the enabled security policies.

Plan [monitoring threat intelligence reports](threat-intelligence-reports.md) into your daily security monitoring tasks, to learn more about potential security threats, such as identifying if a particular computer is part of a botnet.

### <a name='monitoring-for-new-or-changed-resources'></a>Monitoring for new or changed resources

Most Azure environments are dynamic. Resources are regularly created, spun up or down, reconfigured, and changed. Defender for Cloud helps ensure visibility into the security state of these new and changing resources.

Defender for Cloud can automatically discover any new resources (VMs, SQL DBs) added to your Azure environment and begins to monitor their security state, including Platform as a Service (PaaS) web and worker roles. With [Data Collection enabled](monitoring-components.md) additional monitoring capabilities, such as visibility into missing updates and misconfigured OS security settings, are enabled automatically for your VMs and other compute resources.

Regularly monitor existing resources for security risks introduced due to configuration changes, drift from recommended baselines, as well as check related security alerts.

### <a name='hardening-access-and-applications'></a>Hardening access and applications

As part of your security operations, you should adopt preventative measures to restrict access to and control applications running on VMs. The [just-in-time VM access](just-in-time-access-usage.md) feature hardens access to your VMs by locking down inbound traffic to your Azure hosted VMs. This reduces exposure to attacks while providing access to your VMs, as needed. 

[Adaptive application controls](adaptive-application-controls.md) limit which applications can run on your Azure hosted VMs. Using machine learning to define allowlists of known-safe applications, adaptive application controls helps harden your VMs against malware, [among other benefits](adaptive-application-controls.md). 

##  <a name='incident-response'></a>Incident response

Defender for Cloud detects and alerts you to threats as they occur. Monitor for new security alerts, examine aggregated security incidents, and act as needed to investigate and remediate the attack. For more information on how Defender for Cloud threat protection works, see [How Defender for Cloud detects and responds to threats](alerts-overview.md#detect-threats).

Your organization should have an incident response plan  which defines roles, responsibilities, and steps to help your team work together and resolve an incident. Your incident response plan may roughly have stages like those in the Microsoft Azure Security Response in the Cloud lifecycle.

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-1.png" alt-text="Stages of the incident response in the cloud lifecycle including detect, assess, diagnose, stabilize, and close.":::

> [!NOTE]
> You can use the National Institute of Standards and Technology (NIST) [Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf) as a reference when building your incident response plan.

You can use Defender for Cloud alerts to support implementing your incident response plan in the following stages:

- **Detect**: Identify a suspicious activity in one or more resources.

- **Assess**: Perform the initial assessment to obtain more information about the suspicious activity.

- **Diagnose**: Use the remediation steps to conduct the technical procedure to address the issue.

Each Security Alert provides information that can be used to better understand the nature of the attack and suggest mitigations.

Some alerts provide links to more information or to other sources of information within Azure. Use this information to further research the problem and begin mitigation steps. You may also search security-related data stored in your workspace.

### Example alert

The security alert below shows a suspicious Remote Desktop Protocol (RDP) activity taking place:

:::image type="content" source="./media/defender-for-cloud-planning-and-operations-guide/defender-for-cloud-planning-and-operations-guide-fig5-ga.png" alt-text=" Screenshot of the Suspicious Remote Desktop Protocol VM activity security alert.":::

The alert page shows the alert descriptions as well as details including:
* When the attack took place.
* The source hostname.
* The target VM.
* Steps to take to remediate the security alert.

In some circumstances, the source information of the attack may be empty. See [Missing Source Information in Defender for Cloud alerts](/archive/blogs/azuresecurity/missing-source-information-in-azure-security-center-alerts.md) for more information.

### Workflow automation

Once you've identified the security problem, you can trigger a [workflow automation](workflow-automation.md). This automates incidence response procedures that you defined in your incidence response plan and in Defender for Cloud. Workflow automations are usually triggered automatically by an alert.

> [!NOTE]
> See [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md) for more information on how to use Defender for Cloud during your Incident Response process.

## <a name='next-steps'></a>Next steps

In this document, you learned how to plan for Defender for Cloud adoption. Learn more about Defender for Cloud:

- [Managing and responding to security alerts in Defender for Cloud](managing-and-responding-alerts.md)
- [Monitoring partner solutions with Defender for Cloud](./partner-integration.md) - Learn how to monitor the health status of your partner solutions.
- [Defender for Cloud common questions](faq-general.yml) - Find frequently asked questions about using the service.
- [Azure Security blog](/archive/blogs/azuresecurity/) - Read blog posts about Azure security and compliance.
