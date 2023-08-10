---
title: Overview of the extensions that collect data from your workloads
description: Learn about the extensions that collect data from your workloads to let you protect your workloads with Microsoft Defender for Cloud.
author: dcurwin
ms.author: dacurwin
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 11/27/2022
---

# How does Defender for Cloud collect data?

Defender for Cloud collects data from your Azure virtual machines (VMs), Virtual Machine Scale Sets, IaaS containers, and non-Azure (including on-premises) machines to monitor for security vulnerabilities and threats. Some Defender plans require monitoring components to collect data from your workloads.

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat protection. Data collection is only needed for compute resources such as VMs, Virtual Machine Scale Sets, IaaS containers, and non-Azure computers.

You can benefit from Microsoft Defender for Cloud even if you don’t provision agents. However, you'll have limited security and the capabilities listed above aren't supported.  

Data is collected using:

- [Azure Monitor Agent](auto-deploy-azure-monitoring-agent.md) (AMA)
- [Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) (MDE)
- [Log Analytics agent](working-with-log-analytics-agent.md)
- **Security components**, such as the [Azure Policy Add-on for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md)

## Why use Defender for Cloud to deploy monitoring components?

Visibility into the security of your workloads depends on the data that the monitoring components collect. The components ensure security coverage for all supported resources.

To save you the process of manually installing the extensions, Defender for Cloud reduces management overhead by installing all required extensions on existing and new machines. Defender for Cloud assigns the appropriate **Deploy if not exists** policy to the workloads in the subscription. This policy type ensures the extension is provisioned on all existing and future resources of that type.

> [!TIP]
> Learn more about Azure Policy effects, including **Deploy if not exists**, in [Understand Azure Policy effects](../governance/policy/concepts/effects.md).

## What plans use monitoring components?

These plans use monitoring components to collect data:

- Defender for Servers
  - [Azure Arc agent](../azure-arc/servers/manage-vm-extensions.md) (For multicloud and on-premises servers)
  - [Microsoft Defender for Endpoint](#microsoft-defender-for-endpoint)
  - Vulnerability assessment
  - [Azure Monitor Agent](#azure-monitor-agent-ama) or [Log Analytics agent](#log-analytics-agent)
- [Defender for SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md)
  - [Azure Arc agent](../azure-arc/servers/manage-vm-extensions.md) (For multicloud and on-premises servers)
  - [Azure Monitor Agent](#azure-monitor-agent-ama) or [Log Analytics agent](#log-analytics-agent)
  - Automatic SQL server discovery and registration
- Defender for Containers
  - [Azure Arc agent](../azure-arc/servers/manage-vm-extensions.md) (For multicloud and on-premises servers)
  - [Defender profile, Azure Policy Extension, Kubernetes audit log data](defender-for-containers-introduction.md)

## Availability of extensions

[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

### Azure Monitor Agent (AMA)

[!INCLUDE [azure-monitor-agent-availability](includes/azure-monitor-agent-availability.md)]

Learn more about [using the Azure Monitor Agent with Defender for Cloud](auto-deploy-azure-monitoring-agent.md).

### Log Analytics agent

| Aspect | Azure virtual machines | Azure Arc-enabled machines |
|---|:--|:--|
| Release state: | Generally available (GA) | Generally available (GA) |
| Relevant Defender plan: | [Foundational Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options) for agent-based security recommendations<br>[Microsoft Defender for Servers](defender-for-servers-introduction.md)<br>[Microsoft Defender for SQL](defender-for-sql-introduction.md) | [Foundational Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options) for agent-based security recommendations<br>[Microsoft Defender for Servers](defender-for-servers-introduction.md)<br>[Microsoft Defender for SQL](defender-for-sql-introduction.md) |
| Required roles and permissions (subscription-level): |[Owner](/azure/role-based-access-control/built-in-roles)| [Owner](../role-based-access-control/built-in-roles.md#owner) |
| Supported destinations: | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines |
| Policy-based: | :::image type="icon" source="./media/icons/no-icon.png"::: No | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet |

#### Supported operating systems for the Log Analytics agent

Defender for Cloud depends on the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md). Ensure your machines are running one of the supported operating systems for this agent as described on the following pages:

- [Log Analytics agent for Windows supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)
- [Log Analytics agent for Linux supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)

Also ensure your Log Analytics agent is [properly configured to send data to Defender for Cloud](working-with-log-analytics-agent.md#manual-agent)

<a name="preexisting"></a>

#### Deploying the Log Analytics agent in cases of a pre-existing agent installation

The following use cases explain how deployment of the Log Analytics agent works in cases when there's already an agent or extension installed.

- **Log Analytics agent is installed on the machine, but not as an extension (Direct agent)** - If the Log Analytics agent is installed directly on the VM (not as an Azure extension), Defender for Cloud will install the Log Analytics agent extension and might upgrade the Log Analytics agent to the latest version. The installed agent will continue to report to its already configured workspaces and to the workspace configured in Defender for Cloud. (Multi-homing is supported on Windows machines.)

  If the Log Analytics is configured with a user workspace and not Defender for Cloud's default workspace, you'll need to install the "Security" or "SecurityCenterFree" solution on it for Defender for Cloud to start processing events from VMs and computers reporting to that workspace.

  For Linux machines, Agent multi-homing isn't yet supported. If an existing agent installation is detected, the Log Analytics agent won't be deployed.

  For existing machines on subscriptions onboarded to Defender for Cloud before 17 March 2019, when an existing agent will be detected, the Log Analytics agent extension won't be installed and the machine won't be affected. For these machines, see to the "Resolve monitoring agent health issues on your machines" recommendation to resolve the agent installation issues on these machines.
  
- **System Center Operations Manager agent is installed on the machine** - Defender for Cloud will install the Log Analytics agent extension side by side to the existing Operations Manager. The existing Operations Manager agent will continue to report to the Operations Manager server normally. The Operations Manager agent and Log Analytics agent share common run-time libraries, which will be updated to the latest version during this process.

- **A pre-existing VM extension is present**:
  - When the Monitoring Agent is installed as an extension, the extension configuration allows reporting to only a single workspace. Defender for Cloud doesn't override existing connections to user workspaces. Defender for Cloud will store security data from the VM in the workspace already connected, if the "Security" or "SecurityCenterFree" solution has been installed on it. Defender for Cloud may upgrade the extension version to the latest version in this process.
  - To see to which workspace the existing extension is sending data to, run the *TestCloudConnection.exe* tool to validate connectivity with Microsoft Defender for Cloud, as described in [Verify Log Analytics Agent connectivity](/services-hub/health/assessments-troubleshooting#verify-log-analytics-agent-connectivity). Alternatively, you can open Log Analytics workspaces, select a workspace, select the VM, and look at the Log Analytics agent connection.
  - If you have an environment where the Log Analytics agent is installed on client workstations and reporting to an existing Log Analytics workspace, review the list of [operating systems supported by Microsoft Defender for Cloud](security-center-os-coverage.md) to make sure your operating system is supported.

Learn more about [working with the Log Analytics agent](working-with-log-analytics-agent.md).

### Microsoft Defender for Endpoint

| Aspect                                               | Linux                                                                                                                                                                              | Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Generally available (GA)                                                                                                                                                           | Generally available (GA)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Relevant Defender plan:                              | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                             | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Required roles and permissions (subscription-level): | [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Security Admin](../role-based-access-control/built-in-roles.md#security-admin)                       | [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Security Admin](../role-based-access-control/built-in-roles.md#security-admin)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines       | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure VMs running Windows Server 2022, 2019, 2016, 2012 R2, 2008 R2 SP1, [Azure Virtual Desktop](../virtual-desktop/overview.md), [Windows 10 Enterprise multi-session](../virtual-desktop/windows-10-multisession-faq.yml)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure VMs running Windows 10 |
| Policy-based:                                        | :::image type="icon" source="./media/icons/no-icon.png"::: No                                                                                                                      | :::image type="icon" source="./media/icons/no-icon.png"::: No                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet                                                                                                                                                                                                                                                                                                                                                                          |

Learn more about [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint).

### Vulnerability assessment

| Aspect                                               | Details                                                                                                                                                                            |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Generally available (GA)                                                                                                                                                           |
| Relevant Defender plan:                              | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                             |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner)                                                                                                                      |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines       |
| Policy-based:                                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                                                                                                                    |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet |

### Guest Configuration

| Aspect                                               | Details                                                                                                                                                                            |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Preview                                                                                                                                                                            |
| Relevant Defender plan:                              | No plan required                                                                                                    |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner)                                                                                                                      |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines                                                                                                 |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet |

Learn more about Azure's [Guest Configuration extension](../governance/machine-configuration/overview.md).

### Defender for Containers extensions

This table shows the availability details for the components that are required by the protections offered by [Microsoft Defender for Containers](defender-for-containers-introduction.md).

By default, the required extensions are enabled when you enable Defender for Containers from the Azure portal.

| Aspect                                               | Azure Kubernetes Service clusters                                                      | Azure Arc-enabled Kubernetes clusters                                                       |
|------------------------------------------------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Release state:                                       | • Defender profile: GA<br> • Azure Policy add-on: Generally available (GA) | • Defender extension: Preview<br> • Azure Policy extension: Preview |
| Relevant Defender plan:                              | [Microsoft Defender for Containers](defender-for-containers-introduction.md)           | [Microsoft Defender for Containers](defender-for-containers-introduction.md)                |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                          | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                               |
| Supported destinations:                              | The AKS Defender profile only supports [AKS clusters that have RBAC enabled](../aks/concepts-identity.md#kubernetes-rbac).                                                                                   | [See Kubernetes distributions supported for Arc-enabled Kubernetes](supported-machines-endpoint-solutions-clouds-containers.md?tabs=azure-aks#kubernetes-distributions-and-configurations)             |
| Policy-based:                                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                             |
| Clouds:                                              | **Defender profile**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet<br>**Azure Policy add-on**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet|**Defender extension**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet<br>**Azure Policy extension for Azure Arc**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Microsoft Azure operated by 21Vianet|

Learn more about the [roles used to provision Defender for Containers extensions](permissions.md#roles-used-to-automatically-provision-agents-and-extensions).

## Troubleshooting

- To identify monitoring agent network requirements, see [Troubleshooting monitoring agent network requirements](troubleshooting-guide.md#mon-network-req).
- To identify manual onboarding issues, see [How to troubleshoot Operations Management Suite onboarding issues](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues).

## Next steps

This page explained what monitoring components are and how to enable them.

Learn more about:

- [Setting up email notifications](configure-email-notifications.md) for security alerts
- Protecting workloads with [the Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads)


