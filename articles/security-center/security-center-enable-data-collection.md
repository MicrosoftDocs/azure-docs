---
title: Data Collection in Azure Security Center | Microsoft Docs
description: " Learn how to enable data collection in Azure Security Center. "
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: terrylan

---
# Data collection in Azure Security Center
Security Center collects data from your Azure virtual machines (VMs) and non-Azure computers to monitor for security vulnerabilities and threats. Data is collected using the Microsoft Monitoring Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, logged in user, and tenant ID. The Microsoft Monitoring Agent also copies crash dump files to your workspace.

## Enable automatic provisioning of Microsoft Monitoring Agent     
When automatic provisioning is enabled, Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is strongly recommended, and is required for subscriptions on the Standard tier of Security Center.

> [!NOTE]
> Disabling automatic provisioning limits security monitoring for your resources. To learn more, see [disable automatic provisioning](security-center-enable-data-collection.md#disable-automatic-provisioning) in this article. VM disk snapshots and artifact collection are enabled even if automatic provisioning is disabled.
>
>

To enable automatic provisioning of the Microsoft Monitoring Agent:
1. Under the Security Center main menu, select **Security Policy**.
2. Select the subscription.
3. Under **Security policy**, select **Data Collection**.
4. Under **Onboarding**, select **On** to enable automatic provisioning.
5. Select **Save**.

![Enable automatic provisioning][1]

## Default workspace configuration
Data collected by Security Center is stored in Log Analytics workspace(s).  You can elect to have data collected from Azure VMs stored in workspaces created by Security Center or in an existing workspace you created.

To use your existing Log Analytics workspace:
- The workspace must be associated with your selected Azure subscription.
- At a minimum, you must have read permissions to access the workspace.

To select an existing Log Analytics workspace:

1. Under **Security policy – Data Collection**, select **Use another workspace**.

   ![Select existing workspace][2]

2. From the pull-down menu, select a workspace to store collected data.

> [!NOTE]
> In the pull down menu, only workspaces that you have access to and are in your Azure subscription are shown.
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

## Data collection tier
Security Center can reduce the volume of events while maintaining enough events for investigation, auditing, and threat detection. You can choose the right filtering policy for your subscriptions and workspaces from four sets of events to be collected by the agent.

- **All events** – For customers who want to make sure all events are collected. This is the default.
- **Common** – This is a set of events that satisfies most customers and allows them a full audit trial.
- **Minimal** – A smaller set of events for customers who want to minimize the event volume.
- **None** – Disable security event collection from security and App Locker logs. For customers who choose this option, their security dashboards have only Windows Firewall logs and proactive assessments like antimalware, baseline, and update.

> [!NOTE]
> These sets were designed to address typical scenarios. Make sure to evaluate which one fits your needs before implementing it.
>
>

To determine the events that will belong to the **Common** and **Minimal** event sets, we worked with customers and industry standards to learn about the unfiltered frequency of each event and their usage. We used the following guidelines in this process:

- **Minimal** - Make sure that this set covers only events that might indicate a successful breach and important events that have a very low volume. For example, this set contains user successful and failed login (event IDs 4624, 4625), but it doesn’t contain logout which is important for auditing but not meaningful for detection and has relatively high volume. Most of the data volume of this set is the login events and process creation event (event ID 4688).
- **Common** - Provide a full user audit trail in this set. For example, this set contains both user logins and user logoff (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Events that have very low volume were included in the Common set as the main motivation to choose it over all the events is to reduce the volume and not to filter out specific events.

Here is a complete breakdown of the Security and App Locker event IDs for each set:

   ![Event IDs][4]

To choose your filtering policy:
1. On the **Security policy & settings** blade, select your filtering policy under **Security Events**.
2. Select **Save**.

   ![Choose filtering policy][5]

## Disable automatic provisioning
You can disable automatic provisioning from resources at any time by turning off this setting in the security policy. Automatic provisioning is highly recommended in order to get security alerts and recommendations about system updates, OS vulnerabilities and endpoint protection.

> [!NOTE]
> Disabling automatic provisioning does not remove the Microsoft Monitoring Agent from Azure VMs where the agent has been provisioned.
>
>

1. Return to the Security Center main menu and select the Security policy.

   ![Disable automatic provisioning][6]

2. Select the subscription that you wish to disable automatic provisioning.
3. On the **Security policy – Data Collection** blade, under **Onboarding** select **Off** to disable automatic provisioning.
4. Select **Save**.  

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
[4]: ./media/security-center-enable-data-collection/event-id.png
[5]: ./media/security-center-enable-data-collection/data-collection-tiers.png
[6]: ./media/security-center-enable-data-collection/disable-automatic-provisioning.png
