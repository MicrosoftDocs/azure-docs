---
title: Data Collection in Azure Security Center | Microsoft Docs
description: " Learn how to enable data collection in Azure Security Center. "
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/19/2018
ms.author: rkarlin

---
# Data collection in Azure Security Center
Security Center collects data from your Azure virtual machines (VMs) and non-Azure computers to monitor for security vulnerabilities and threats. Data is collected using the Microsoft Monitoring Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, logged in user, AppLocker events, and tenant ID. The Microsoft Monitoring Agent also copies crash dump files to your workspace.

## Enable automatic provisioning of Microsoft Monitoring Agent     
Automatic provisioning is off by default. When automatic provisioning is enabled, Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is strongly recommended but manual agent installation is also available. [Learn how to install the Microsoft Monitoring Agent extension](../log-analytics/log-analytics-quick-collect-azurevm.md#enable-the-log-analytics-vm-extension).

> [!NOTE]
> - Disabling automatic provisioning limits security monitoring for your resources. To learn more, see [disable automatic provisioning](security-center-enable-data-collection.md#disable-automatic-provisioning) in this article. VM disk snapshots and artifact collection are enabled even if automatic provisioning is disabled.
> - To enable data collection for [Adaptive Application Controls](security-center-adaptive-application.md), Security Center configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Security Center. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 
>

To enable automatic provisioning of the Microsoft Monitoring Agent:
1. Under the Security Center main menu, select **Security policy**.
2. Select the subscription.

  ![Select subscription][7]

3. Under **Security policy**, select **Data Collection**.
4. Under **Auto Provisioning**, select **On** to enable automatic provisioning.
5. Select **Save**.

  ![Enable automatic provisioning][1]

## Default workspace configuration
Data collected by Security Center is stored in Log Analytics workspace(s).  You can elect to have data collected from Azure VMs stored in workspaces created by Security Center or in an existing workspace you created.

To use your existing Log Analytics workspace:
- The workspace must be associated with your selected Azure subscription.
- At a minimum, you must have read permissions to access the workspace.

To select an existing Log Analytics workspace:

1. Under **Default workspace configuration**, select **Use another workspace**.

   ![Select existing workspace][2]

2. From the pull-down menu, select a workspace to store collected data.

  > [!NOTE]
  > In the pull down menu, all the workspaces across all of your subscriptions are available. See [cross subscription workspace selection](security-center-enable-data-collection.md#cross-subscription-workspace-selection) for more information.
  >
  >

3. Select **Save**.
4. After selecting **Save**, you will be asked if you would like to reconfigure monitored VMs.

   - Select **No** if you want the new workspace settings to apply on new VMs only. The new workspace settings only apply to new agent installations; newly discovered VMs that do not have the Microsoft Monitoring Agent installed.
   - Select **Yes** if you want the new workspace settings to apply on all VMs. In addition, every VM connected to a Security Center created workspace is reconnected to the new target workspace.

   > [!NOTE]
   > If you select Yes, you must not delete the workspace(s) created by Security Center until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.
   >
   >

   - Select **Cancel** to cancel the operation.

     ![Select existing workspace][3]

## Cross subscription workspace selection
When you select a workspace to store your data, all the workspaces across all of your subscriptions are available. Cross subscription workspace selection allows you to collect data from virtual machines running in different subscriptions and store it in the workspace of your choice. This capability works for both virtual machines running on Linux and Windows.

> [!NOTE]
> Cross subscription workspace selection is part of Azure Security Center’s Free Tier. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
>
>

## Data collection tier
Security Center can reduce the volume of events while maintaining enough events for investigation, auditing, and threat detection. You can choose the right filtering policy for your subscriptions and workspaces from four sets of events to be collected by the agent.

- **All events** – For customers who want to make sure all events are collected. This is the default.
- **Common** – This is a set of events that satisfies most customers and allows them a full audit trail.
- **Minimal** – A smaller set of events for customers who want to minimize the event volume.
- **None** – Disable security event collection from security and App Locker logs. For customers who choose this option, their security dashboards have only Windows Firewall logs and proactive assessments like antimalware, baseline, and update.

> [!NOTE]
> These security events sets are available only on Security Center’s Standard tier. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
These sets were designed to address typical scenarios. Make sure to evaluate which one fits your needs before implementing it.
>
>

To determine the events that will belong to the **Common** and **Minimal** event sets, we worked with customers and industry standards to learn about the unfiltered frequency of each event and their usage. We used the following guidelines in this process:

- **Minimal** - Make sure that this set covers only events that might indicate a successful breach and important events that have a very low volume. For example, this set contains user successful and failed login (event IDs 4624, 4625), but it doesn’t contain logout which is important for auditing but not meaningful for detection and has relatively high volume. Most of the data volume of this set is the login events and process creation event (event ID 4688).
- **Common** - Provide a full user audit trail in this set. For example, this set contains both user logins and user logoff (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Events that have very low volume were included in the Common set as the main motivation to choose it over all the events is to reduce the volume and not to filter out specific events.

Here is a complete breakdown of the Security and App Locker event IDs for each set:

| Data tier | Collected event indicators |
| --- | --- |
| Minimal | 1102,4624,4625,4657,4663,4688,4700,4702,4719,4720,4722,4723,4724,4727,4728,4732,4735,4737,4739,4740,4754,4755, |
| | 4756,4767,4799,4825,4946,4948,4956,5024,5033,8001,8002,8003,8004,8005,8006,8007,8222 |
| Common | 1,299,300,324,340,403,404,410,411,412,413,431,500,501,1100,1102,1107,1108,4608,4610,4611,4614,461,4622, |
| |  4624,4625,4634,4647,4648,4649,4657,4661,4662,4663,4665,4666,4667,4688,4670,4672,4673,4674,4675,4689,4697, |
| | 4700,4702,4704,4705,4716,4717,4718,4719,4720,4722,4723,4724,4725,4726,4727,4728,4729,4733,4732,4735,4737, |
| | 4738,4739,4740,4742,4744,4745,4746,4750,4751,4752,4754,4755,4756,4757,4760,4761,4762,4764,4767,4768,4771, |
| | 4774,4778,4779,4781,4793,4797,4798,4799,4800,4801,4802,4803,4825,4826,4870,4886,4887,4888,4893,4898,4902, |
| | 4904,4905,4907,4931,4932,4933,4946,4948,4956,4985,5024,5033,5059,5136,5137,5140,5145,5632,6144,6145,6272, |
| | 6273,6278,6416,6423,6424,8001,8002,8003,8004,8005,8006,8007,8222,26401,30004 |

> [!NOTE]
> - If you are using Group Policy Object (GPO), it is recommended that you enable audit policies Process Creation Event 4688 and the *CommandLine* field inside event 4688. For more information about Process Creation Event 4688, see Security Center's [FAQ](security-center-faq.md#what-happens-when-data-collection-is-enabled). For more information about these audit policies, see [Audit Policy Recommendations](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations).
> -  To enable data collection for [Adaptive Application Controls](security-center-adaptive-application.md), Security Center configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Security Center. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 
>

To choose your filtering policy:
1. On the **Security policy Data Collection** blade, select your filtering policy under **Security Events**.
2. Select **Save**.

   ![Choose filtering policy][5]

## Disable automatic provisioning
You can disable automatic provisioning from resources at any time by turning off this setting in the security policy. Automatic provisioning is highly recommended in order to get security alerts and recommendations about system updates, OS vulnerabilities and endpoint protection.

> [!NOTE]
> Disabling automatic provisioning does not remove the Microsoft Monitoring Agent from Azure VMs where the agent has been provisioned.
>
>

1. Return to the Security Center main menu and select the Security policy.
2. Select the subscription that you wish to disable automatic provisioning.
3. On the **Security policy – Data Collection** blade, under **Auto provisioning** select **Off**.
4. Select **Save**.

  ![Disable auto provisioning][6]

When auto provisioning is disabled (turned off), the default workspace configuration section does not display.

## Next steps
This article showed you how data collection and automatic provisioning in Security Center works. To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center data security](security-center-data-security.md) - Learn how data is managed and safeguarded in Security Center.
* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-data-collection/enable-automatic-provisioning.png
[2]: ./media/security-center-enable-data-collection/use-another-workspace.png
[3]: ./media/security-center-enable-data-collection/reconfigure-monitored-vm.png
[5]: ./media/security-center-enable-data-collection/data-collection-tiers.png
[6]: ./media/security-center-enable-data-collection/disable-data-collection.png
[7]: ./media/security-center-enable-data-collection/select-subscription.png
