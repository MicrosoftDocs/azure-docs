---
title: Data Collection in Azure Security Center | Microsoft Docs
description: This article describes how to install a Log Analytics agent and set a Log Analytics workspace in which to store the collected data.
services: security-center
author: memildin
manager: rkarlin

ms.service: security-center
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: memildin

---
# Data collection in Azure Security Center
Security Center collects data from your Azure virtual machines (VMs), virtual machine scale sets, IaaS containers, and non-Azure (including on-premises) computers to monitor for security vulnerabilities and threats. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, and logged in user.

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat protection. 

This article describes how to install a Log Analytics agent and set a Log Analytics workspace in which to store the collected data. Both operations are required to enable data collection. 

> [!NOTE]
> - Data collection is only needed for Compute resources (VMs, virtual machine scale sets, IaaS containers, and non-Azure computers). You can benefit from Azure Security Center even if you don’t provision agents; however, you will have limited security and the capabilities listed above are not supported.  
> - For the list of supported platforms, see [Supported platforms in Azure Security Center](security-center-os-coverage.md).
> - Storing data in Log Analytics, whether you use a new or existing workspace, might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Enable automatic provisioning of the Log Analytics agent <a name="auto-provision-mma"></a>

To collect the data from the machines, you should have the Log Analytics agent installed. Installation of the agent can be done automatically (recommended) or you can install the agent manually. By default, automatic provisioning is off.

When automatic provisioning is on, Security Center deploys the Log Analytics agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is recommended but you can install the agent manually if necessary (see [Manual installation of the Log Analytics agent](#manual-agent)).


To enable automatic provisioning of the Log Analytics agent:
1. From Security Center's menu in the portal, select **Pricing & settings**.
2. Select the relevant subscription.

   ![Select subscription][7]

3. Select **Data Collection**.
4. Under **Auto Provisioning**, select **On** to enable automatic provisioning.
5. Select **Save**. The agent will be deployed on all VMs within 15 minutes. 

>[!TIP]
> If a workspace needs to be provisioned, agent installation might take up to 25 minutes.

   ![Enable automatic provisioning][1]

>[!NOTE]
> - For instructions on how to provision a pre-existing installation, see [Automatic provisioning in cases of a preexisting agent installation](#preexisting).
> - For instructions on manual provisioning, see [Install the Log Analytics agent extension manually](#manual-agent).
> - For instructions on turning off automatic provisioning, see [Turn off automatic provisioning](#offprovisioning).
> - For instructions on how to onboard Security Center using PowerShell, see [Automate onboarding of Azure Security Center using PowerShell](security-center-powershell-onboarding.md).
>

## Workspace configuration
Data collected by Security Center is stored in Log Analytics workspace(s). Your data can be collected from Azure VMs stored in workspaces created by Security Center or in an existing workspace you created. 

Workspace configuration is set per subscription, and many subscriptions may use the same workspace.

### Using a workspace created by Security Center

Security center can automatically create a default workspace in which to store the data. 

To select a workspace created by Security Center:

1. Under **Default workspace configuration**, select Use workspace(s) created by Security center.
   ![Select pricing tier][10] 

1. Click **Save**.<br>
	Security Center creates a new resource group and default workspace in that geolocation, and connects the agent to that workspace. The naming convention for the workspace and resource group is:<br>
   **Workspace: DefaultWorkspace-[subscription-ID]-[geo]<br>
   Resource Group: DefaultResourceGroup-[geo]**

   If a subscription contains VMs from multiple geolocations, then Security Center creates multiple workspaces. Multiple workspaces are created to maintain data privacy rules.
1. Security Center will automatically enable a Security Center solution on the workspace per the pricing tier set for the subscription. 

> [!NOTE]
> The Log Analytics pricing tier of workspaces created by Security Center does not affect Security Center billing. Security Center billing is always based on your Security Center security policy and the solutions installed on a workspace. For the Free tier, Security Center enables the *SecurityCenterFree* solution on the default workspace. For the Standard tier, Security Center enables the *Security* solution on the default workspace.
> Storing data in Log Analytics might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

For more information about existing log analytics accounts, see [Existing log analytics customers](./faq-azure-monitor-logs.md).

### Using an existing workspace

If you already have an existing Log Analytics workspace, you might want to use the same workspace.

To use your existing Log Analytics workspace, you must have read and write permissions on the workspace.

> [!NOTE]
> Solutions enabled on the existing workspace will be applied to Azure VMs that are connected to it. For paid solutions, this could result in additional charges. For data privacy considerations, make sure your selected workspace is in the right geographic region.
> Storing data in log analytics might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

To select an existing Log Analytics workspace:

1. Under **Default workspace configuration**, select **Use another workspace**.

   ![Select existing workspace][2]

2. From the pull-down menu, select a workspace to store collected data.

   > [!NOTE]
   > In the pull down menu, all the workspaces across all of your subscriptions are available. See [cross subscription workspace selection](security-center-enable-data-collection.md#cross-subscription-workspace-selection) for more information. You must have permission to access the workspace.
   >
   >

3. Select **Save**.
4. After selecting **Save**, you will be asked if you would like to reconfigure monitored VMs that were previously connected to a default workspace.

   - Select **No** if you want the new workspace settings to apply on new VMs only. The new workspace settings only apply to new agent installations; newly discovered VMs that do not have the Log Analytics agent installed.
   - Select **Yes** if you want the new workspace settings to apply on all VMs. In addition, every VM connected to a Security Center created workspace is reconnected to the new target workspace.

   > [!NOTE]
   > If you select Yes, you must not delete the workspace(s) created by Security Center until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.
   >
   >

   - Select **Cancel** to cancel the operation.

     ![Select existing workspace][3]

5. Select the pricing tier for the desired workspace you intend to set the Log Analytics agent. <br>To use an existing workspace, set the pricing tier for the workspace. This will install a security Center solution on the workspace if one is not already present.

    a.  In the Security Center main menu, select **Pricing & settings**.
     
    b.	Select the desired Workspace in which you intend to connect the agent.
        ![Select workspace][7]
    c. Set the pricing tier.
        ![Select pricing tier][9]
   
   >[!NOTE]
   >If the workspace already has a **Security** or **SecurityCenterFree** solution enabled, the pricing will be set automatically. 

## Cross-subscription workspace selection
When you select a workspace in which to store your data, all the workspaces across all your subscriptions are available. Cross-subscription workspace selection allows you to collect data from virtual machines running in different subscriptions and store it in the workspace of your choice. This selection is useful if you are using a centralized workspace in your organization and want to use it for security data collection. For more information on how to manage workspaces, see [Manage workspace access](https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-access).


## Data collection tier
Selecting a data collection tier in Azure Security Center will only affect the storage of security events in your Log Analytics workspace. The Log Analytics agent will still collect and analyze the security events required for Azure Security Center’s threat protection, regardless of which tier of security events you choose to store in your Log Analytics workspace (if any). Choosing to store security events in your workspace will enable investigation, search, and auditing of those events in your workspace. 
> [!NOTE]
> Storing data in log analytics might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).
> 
> You can choose the right filtering policy for your subscriptions and workspaces from four sets of events to be stored in your workspace: 

- **None** – Disable security event storage. This is the default setting.
- **Minimal** – A smaller set of events for customers who want to minimize the event volume.
- **Common** – This is a set of events that satisfies most customers and allows them a full audit trail.
- **All events** – For customers who want to make sure all events are stored.


> [!NOTE]
> These security events sets are available only on Security Center’s Standard tier. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
These sets were designed to address typical scenarios. Make sure to evaluate which one fits your needs before implementing it.
>
>

To determine the events that will belong to the **Common** and **Minimal** event sets, we worked with customers and industry standards to learn about the unfiltered frequency of each event and their usage. We used the following guidelines in this process:

- **Minimal** - Make sure that this set covers only events that might indicate a successful breach and important events that have a very low volume. For example, this set contains user successful and failed login (event IDs 4624, 4625), but it doesn’t contain sign out which is important for auditing but not meaningful for detection and has relatively high volume. Most of the data volume of this set is the login events and process creation event (event ID 4688).
- **Common** - Provide a full user audit trail in this set. For example, this set contains both user logins and user sign outs (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Events that have very low volume were included in the Common set as the main motivation to choose it over all the events is to reduce the volume and not to filter out specific events.

Here is a complete breakdown of the Security and App Locker event IDs for each set:

| Data tier | Collected event indicators |
| --- | --- |
| Minimal | 1102,4624,4625,4657,4663,4688,4700,4702,4719,4720,4722,4723,4724,4727,4728,4732,4735,4737,4739,4740,4754,4755, |
| | 4756,4767,4799,4825,4946,4948,4956,5024,5033,8001,8002,8003,8004,8005,8006,8007,8222 |
| Common | 1,299,300,324,340,403,404,410,411,412,413,431,500,501,1100,1102,1107,1108,4608,4610,4611,4614,4622, |
| |  4624,4625,4634,4647,4648,4649,4657,4661,4662,4663,4665,4666,4667,4688,4670,4672,4673,4674,4675,4689,4697, |
| | 4700,4702,4704,4705,4716,4717,4718,4719,4720,4722,4723,4724,4725,4726,4727,4728,4729,4733,4732,4735,4737, |
| | 4738,4739,4740,4742,4744,4745,4746,4750,4751,4752,4754,4755,4756,4757,4760,4761,4762,4764,4767,4768,4771, |
| | 4774,4778,4779,4781,4793,4797,4798,4799,4800,4801,4802,4803,4825,4826,4870,4886,4887,4888,4893,4898,4902, |
| | 4904,4905,4907,4931,4932,4933,4946,4948,4956,4985,5024,5033,5059,5136,5137,5140,5145,5632,6144,6145,6272, |
| | 6273,6278,6416,6423,6424,8001,8002,8003,8004,8005,8006,8007,8222,26401,30004 |

> [!NOTE]
> - If you are using Group Policy Object (GPO), it is recommended that you enable audit policies Process Creation Event 4688 and the *CommandLine* field inside event 4688. For more information about Process Creation Event 4688, see Security Center's [FAQ](faq-data-collection-agents.md#what-happens-when-data-collection-is-enabled). For more information about these audit policies, see [Audit Policy Recommendations](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations).
> -  To enable data collection for [Adaptive Application Controls](security-center-adaptive-application.md), Security Center configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Security Center. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 
> - To collect Windows Filtering Platform [Event ID 5156](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=5156), you need to enable [Audit Filtering Platform Connection](https://docs.microsoft.com/windows/security/threat-protection/auditing/audit-filtering-platform-connection) (Auditpol /set /subcategory:"Filtering Platform Connection" /Success:Enable)
>

To choose your filtering policy:
1. On the **Data Collection** page, select your filtering policy under **Security Events**.
2. Select **Save**.

   ![Choose filtering policy][5]

### Automatic provisioning in cases of a pre-existing agent installation <a name="preexisting"></a> 

The following use cases specify how automatic provision works in cases when there is already an agent or extension installed. 

- Log Analytics agent is installed on the machine, but not as an extension (Direct agent)<br>
If the Log Analytics agent is installed directly on the VM (not as an Azure extension), Security Center will install the Log Analytics agent extension, and may upgrade the Log Analytics agent to the latest version.
The agent installed will continue to report to its already configured workspace(s), and additionally will report to the workspace configured in Security Center (Multi-homing is supported on Windows machines).
If the configured workspace is a user workspace (not Security Center's default workspace), then you will need to install the "security/"securityFree" solution on it for Security Center to start processing events from VMs and computers reporting to that workspace.<br>
<br>
For Linux machines, Agent multi-homing is not yet supported - hence, if an existing agent installation is detected, automatic provisioning will not occur and the machine's configuration will not be altered.
<br>
For existing machines on subscriptions onboarded to Security Center before 2019-03-17, when an existing agent will be detected, the Log Analytics agent extension will not be installed and the machine will not be affected. For these machines, see to the "Resolve monitoring agent health issues on your machines" recommendation to resolve the agent installation issues on these machines.

  
- System Center Operations Manager agent is installed on the machine<br>
Security center will install the Log Analytics agent extension side by side to the existing Operations Manager. The existing Operations Manager agent will continue to report to the Operations Manager server normally. The Operations Manager agent and Log Analytics agent share common run-time libraries, which will be updated to the latest version during this process. If Operations Manager agent version 2012 is installed, **do not** enable automatic provisioning.<br>

- A pre-existing VM extension is present<br>
    - When the Monitoring Agent is installed as an extension, the extension configuration allows reporting to only a single workspace. Security Center does not override existing connections to user workspaces. Security Center will store security data from the VM in the workspace already connected, provided that the "security" or "securityFree" solution has been installed on it. Security Center may upgrade the extension version to the latest version in this process.  
    - To see to which workspace the existing extension is sending data to, run the test to [Validate connectivity with Azure Security Center](https://blogs.technet.microsoft.com/yuridiogenes/2017/10/13/validating-connectivity-with-azure-security-center/). Alternatively, you can open Log Analytics workspaces, select a workspace, select the VM, and look at the Log Analytics agent connection. 
    - If you have an environment where the Log Analytics agent is installed on client workstations and reporting to an existing Log Analytics workspace, review the list of [operating systems supported by Azure Security Center](security-center-os-coverage.md) to make sure your operating system is supported. For more information, see [Existing log analytics customers](./faq-azure-monitor-logs.md).
 
### Turn off automatic provisioning <a name="offprovisioning"></a>
You can turn off automatic provisioning from resources at any time by turning off this setting in the security policy. 


1. Return to the Security Center main menu and select the Security policy.
2. Click **Edit settings** in the row of the subscription for which you want to disable automatic provisioning.
3. On the **Security policy – Data Collection** page, under **Auto provisioning** select **Off**.
4. Select **Save**.

   ![Disable auto provisioning][6]

When auto provisioning is disabled (turned off), the default workspace configuration section is not displayed.

If you switch off auto provision after it was previously on agents will not be provisioned on new VMs.

 
> [!NOTE]
>  Disabling automatic provisioning does not remove the Log Analytics agent from Azure VMs where the agent was provisioned. For information on removing the OMS extension, see [How do I remove OMS extensions installed by Security Center](faq-data-collection-agents.md#remove-oms).
>
	
## Manual agent provisioning <a name="manual-agent"></a>
 
There are several ways to install the Log Analytics agent manually. When installing manually, make sure you disable auto provisioning.

### Operations Management Suite VM extension deployment 

You can manually install the Log Analytics agent, so Security Center can collect security data from your VMs and provide recommendations and alerts.
1. Select Auto provision – OFF.
2. Create a workspace and set the pricing tier for the workspace you intend to set the Log Analytics agent:

   a.  In the Security Center main menu, select **Security policy**.
     
   b.  Select the Workspace in which you intend to connect the agent. Make sure the workspace is in the same subscription you use in Security Center and that you have read/write permissions on the workspace.
       ![Select workspace][8]
3. Set the pricing tier.
   ![Select pricing tier][9] 
   >[!NOTE]
   >If the workspace already has a **Security** or **SecurityCenterFree** solution enabled, the pricing will be set automatically. 
   > 

4. If  you want to deploy the agents on new VMs using a Resource Manager template, install the OMS virtual machine extension:

   a.  [Install the OMS virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md)
    
   b.  [Install the OMS virtual machine extension for Linux](../virtual-machines/extensions/oms-linux.md)
5. To deploy the extensions on existing VMs, follow the instructions in [Collect data about Azure Virtual Machines](../azure-monitor/learn/quick-collect-azurevm.md).

   > [!NOTE]
   > The section **Collect event and performance data** is optional.
   >
6. To use PowerShell to deploy the extension, use the following PowerShell example:
   
   [!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
   
   1. Go to **Log Analytics** and click on **Advanced settings**.
    
      ![Set log analytics][11]

   2. Copy the values out of **WorkspaceID** and **Primary key**.
  
      ![Copy values][12]

   3. Populate the public config and the private config with these values:
     
           $PublicConf = @{
               "workspaceId"= "<WorkspaceID value>"
           }
 
           $PrivateConf = @{
               "workspaceKey"= "<Primary key value>"
           }

	  - When installing on a Windows VM:
	    
            Set-AzVMExtension -ResourceGroupName $vm.ResourceGroupName -VMName $vm.Name -Name "MicrosoftMonitoringAgent" -Publisher "Microsoft.EnterpriseCloud.Monitoring" -ExtensionType "MicrosoftMonitoringAgent" -TypeHandlerVersion '1.0' -Location $vm.Location -settings $PublicConf -ProtectedSettingString $PrivateConf -ForceRerun True 
	
      - When installing on a Linux VM:
	    
            Set-AzVMExtension -ResourceGroupName $vm1.ResourceGroupName -VMName $vm1.Name -Name "OmsAgentForLinux" -Publisher "Microsoft.EnterpriseCloud.Monitoring" -ExtensionType "OmsAgentForLinux" -TypeHandlerVersion '1.0' -Location $vm.Location -Settingstring $PublicConf -ProtectedSettingString $PrivateConf -ForceRerun True`

> [!NOTE]
> For instructions on how to onboard Security Center using PowerShell, see [Automate onboarding of Azure Security Center using PowerShell](security-center-powershell-onboarding.md).

## Troubleshooting

-	To identify automatic provision installation issues, see [Monitoring agent health issues](security-center-troubleshooting-guide.md#mon-agent).

-  To identify monitoring agent network requirements, see [Troubleshooting monitoring agent network requirements](security-center-troubleshooting-guide.md#mon-network-req).
-	To identify manual onboarding issues, see [How to troubleshoot Operations Management Suite onboarding issues](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues).

- To identify Unmonitored VMs and computers issues:

    A VM or computer is unmonitored by Security Center if the machine is not running the Log Analytics agent extension. A machine may have a local agent already installed, for example the OMS direct agent or the System Center Operations Manager agent. Machines with these agents are identified as unmonitored because these agents are not fully supported in Security Center. To fully benefit from all of Security Center’s capabilities, the Log Analytics agent extension is required.

    For more information about the reasons Security Center is unable to successfully monitor VMs and computers initialized for automatic provisioning, see [Monitoring agent health issues](security-center-troubleshooting-guide.md#mon-agent).


## Next steps
This article showed you how data collection and automatic provisioning in Security Center works. To learn more about Security Center, see the following pages:

* [Azure Security Center FAQ](faq-general.md)--Find frequently asked questions about using the service.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.



<!--Image references-->
[1]: ./media/security-center-enable-data-collection/enable-automatic-provisioning.png
[2]: ./media/security-center-enable-data-collection/use-another-workspace.png
[3]: ./media/security-center-enable-data-collection/reconfigure-monitored-vm.png
[5]: ./media/security-center-enable-data-collection/data-collection-tiers.png
[6]: ./media/security-center-enable-data-collection/disable-data-collection.png
[7]: ./media/security-center-enable-data-collection/select-subscription.png
[8]: ./media/security-center-enable-data-collection/manual-provision.png
[9]: ./media/security-center-enable-data-collection/pricing-tier.png
[10]: ./media/security-center-enable-data-collection/workspace-selection.png
[11]: ./media/security-center-enable-data-collection/log-analytics.png
[12]: ./media/security-center-enable-data-collection/log-analytics2.png
