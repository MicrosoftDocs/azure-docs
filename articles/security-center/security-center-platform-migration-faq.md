---
title: Security Center platform migration FAQ | Microsoft Docs
description: This FAQ answers questions about the Azure Security Centre platform migration.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 4d1364cd-7847-425a-bb3a-722cb0779f78
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/14/2017
ms.author: terrylan

---
# Security Center platform migration FAQ
In early June 2017, Azure Security Center began using the Microsoft Monitoring Agent to collect and store data. To learn more, see [Azure Security Center Platform Migration](security-center-platform-migration.md). This FAQ answers questions about the platform migration.

## Data collection, agents, and workspaces

### How is data collected?
Security Center uses the Microsoft Monitoring Agent to collect security data from your VMs. The security data includes information about security configurations, which are used to identify vulnerabilities, and security events, which are used to detect threats. Data collected by the agent is stored in either an existing Log Analytics workspace connected to the VM or a new workspace created by Security Center. When Security Center creates a new workspace, the geolocation of the VM is taken into account.

> [!NOTE]
> The Microsoft Monitoring Agent is the same agent used by the Operations Management Suite (OMS), Log Analytics service and System Center Operations Manager (SCOM).
>
>

When data collection is enabled for the first time or when your subscriptions are migrated, Security Center checks to see if the Microsoft Monitoring Agent is already installed as an Azure extension on each of your VMs. If the Microsoft Monitoring Agent is not installed, then Security Center will:

- install the Microsoft Monitoring agent on the VM
   - if a workspace created by Security Center already exists in the same geolocation as the VM, the agent is connected to this workspace
   - if a workspace does not exist, Security Center creates a new resource group and default workspace in that geolocation, and connect the agent to that workspace. The naming convention for the workspace and resource group is:

       Workspace: DefaultWorkspace-[subscription-ID]-[geo]

       Resource Group: DefaultResouceGroup-[geo]
- install a Security Center solution on the workspace

The location of the workspace is based on the location of the VM. To learn more, see [Data Security](security-center-data-security.md).

> [!NOTE]
> Prior to platform migration, Security Center collected security data from your VMs using the Azure Monitoring Agent, and data was stored in your storage account. After the platform migration, Security Center uses the Microsoft Monitoring Agent and workspace to collect and store the same data. The storage account can be removed after the migration.
>
>

### Am I billed for Log Analytics or OMS on the workspaces created by Security Center?
No. Workspaces created by Security Center, while configured for OMS per node billing, do not incur OMS charges. Security Center billing is always based on your Security Center security policy and the solutions installed on a workspace:

- **Free tier** – Security Center installs the 'SecurityCenterFree' solution on the default workspace. You are not billed for the Free tier.
- **Standard tier** – Security Center installs the 'SecurityCenterFree' and 'Security’ solutions on the default workspace.

For more information on pricing, see [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/). The pricing page addresses changes to security data storage and prorated billing starting in June 2017.

> [!NOTE]
> The OMS pricing tier of workspaces created by Security Center does not affect Security Center billing.
>
>

### Can I delete the default workspaces created by Security Center?
**Deleting the default workspace is not recommended.** Security Center uses the default workspaces to store security data from your VMs.  If you delete a workspace, Security Center is unable to collect this data and some security recommendations and alerts are unavailable

To recover, remove the Microsoft Monitoring Agent on the VMs connected to the deleted workspace. Security Center reinstalls the agent and creates new default workspaces.

### How can I use my existing Log Analytics workspace?

You can select an existing Log Analytics workspace to store data collected by Security Center. To use your existing Log Analytics workspace:

- The workspace must be associated with your selected Azure subscription.
- At a minimum, you must have read permissions to access the workspace.

To select an existing Log Analytics workspace:

1. Under **Security policy – Data Collection**, select **Use another workspace**.

   ![Use another workspace][5]

2. From the pull-down menu, select a workspace to store collected data.

   > [!NOTE]
   > In the pull down menu, only workspaces that you have access to and are in your Azure subscription are shown.
   >
   >

3. Select **Save**.
4. After selecting **Save**, you will be asked if you would like to reconfigure monitored VMs.

   - Select **No** if you want the new workspace settings to **apply on new VMs only**. The new workspace settings only apply to new agent installations; newly discovered VMs that do not have the Microsoft Monitoring Agent installed.
   - Select **Yes** if you want the new workspace settings to **apply on all VMs**. In addition, every VM connected to a Security Center created workspace is reconnected to the new target workspace.

   > [!NOTE]
   > If you select Yes, you must not delete the workspace(s) created by Security Center until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.
   >
   >

   - Select **Cancel** to cancel the operation.

      ![Reconfigure monitored VMs][6]

### What if the Microsoft Monitoring Agent was already installed as an extension on the VM?
Security Center does not override existing connections to user workspaces. Security Center stores security data from the VM in the workspace already connected.

### What if I had a Microsoft Monitoring Agent installed on the machine but not as an extension?
If the Microsoft Monitoring Agent is installed directly on the VM (not as an Azure extension), Security Center does not install the Microsoft Monitoring Agent and security monitoring is limited.

### What is the impact of removing these extensions?
If you remove the Microsoft Monitoring Extension, Security Center is not able to collect security data from the VM and some security recommendations and alerts are unavailable. Within 24 hours, Security Center determines that the VM is missing the extension and reinstalls the extension.

### How do I stop the automatic agent installation and workspace creation?
You can turn off automatic provisioning for your subscriptions in the security policy but this is not recommended. Turning off automatic provisioning limits Security Center recommendations and alerts. Automatic provisioning is required for subscriptions on the Standard pricing tier. To disable automatic provisioning:

1. If your subscription is configured for the Standard tier, open the security policy for that subscription and select the **Free** tier.

   ![Pricing tier][1]

2. Next, turn off automatic provisioning by selecting **Off** on the **Security policy – Data collection** blade.
   ![Data collection][2]

### How do I remove OMS extensions installed by Security Center?
You can manually remove the Microsoft Monitoring Agent. This is not recommended as it limits Security Center recommendations and alerts.

> [!NOTE]
> If data collection is enabled, Security Center will reinstall the agent after you remove it.  You need to disable data collection before manually removing the agent. See [How do I stop the automatic agent installation and workspace creation?](#how-do-i-stop-the-automatic-agent-installation-and-workspace-creation?) for instructions on disabling data collection.
>
>

To manually remove the agent:

1.	In the portal, open **Log Analytics**.
2.	On the Log Analytics blade, select a workspace:
3.	Select each VM that you don’t want to monitor and select **Disconnect**.

   ![Remove the agent][3]

> [!NOTE]
> If a Linux VM already has a non-extension OMS agent, removing the extension removes the agent as well and the customer has to reinstall it.
>
>

## Existing OMS customers

### Does Security Center override any existing connections between VMs and workspaces?
If a VM already has the Microsoft Monitoring Agent installed as an Azure extension, Security Center does not override the existing workspace connection. Instead, Security Center uses the existing workspace.

A Security Center solution is installed on the workspace if not present already, and the solution is applied only to the relevant VMs. When you add a solution, it's automatically deployed by default to all Windows and Linux agents connected to your Log Analytics workspace. [Solution Targeting](../operations-management-suite/operations-management-suite-solution-targeting.md), which is an OMS feature, allows you to apply a scope to your solutions.

If the Microsoft Monitoring Agent is installed directly on the VM (not as an Azure extension), Security Center does not install the Microsoft Monitoring Agent and security monitoring is limited.

### What should I do if I suspect that the data platform migration broke the connection between one of my VMs and my workspace?
This should not happen. If it does happen, then [Create an Azure support request](../azure-supportability/how-to-create-azure-support-request.md) and include the following details:

- The Azure resource ID of the impacted VM
- The Azure resource ID of the workspace configured on the extension before the connection was broken
- The agent and version that was previously installed

### Does Security Center install solutions on my existing OMS workspaces? What are the billing implications?
When Security Center identifies that a VM is already connected to a workspace you created, Security Center enables solutions on this workspace according to your pricing tier. The solutions are applied only to the relevant Azure VMs, via [solution targeting](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-solution-targeting), so the billing remains the same.

- **Free tier** – Security Center installs the 'SecurityCenterFree' solution on the workspace. You are not billed for the Free tier.
- **Standard tier** – Security Center installs the 'SecurityCenterFree' and 'Security' solutions on the workspace.

   ![Solutions on default workspace][4]

> [!NOTE]
> The ‘Security’ solution in Log Analytics is the Security & Audit solution in OMS.
>
>

### I already have workspaces in my environment, can I use them to collect security data?
If a VM already has the Microsoft Monitoring Agent installed as an Azure extension, Security Center uses the existing connected workspace. A Security Center solution is installed on the workspace if not present already, and the solution is applied only to the relevant VMs via [solution targeting](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-solution-targeting).

When Security Center installs the Microsoft Monitoring Agent on VMs, it uses the default workspace(s) created by Security Center. Soon customers will be able to configure which workspace(s) are used.

### I already have security solution on my workspaces. What are the billing implications?
The Security & Audit solution is used to enable Security Center Standard tier features for Azure VMs. If the Security & Audit solution is already installed on a workspace, Security Center uses the existing solution. There is no change in billing.

## Next steps
To learn more about the Security Center platform migration, see

- [Azure Security Center Platform Migration](security-center-platform-migration.md)
- [Azure Security Center Troubleshooting Guide](security-center-troubleshooting-guide.md)

<!--Image references-->
[1]: ./media/security-center-platform-migration-faq/pricing-tier.png
[2]: ./media/security-center-platform-migration-faq/data-collection.png
[3]: ./media/security-center-platform-migration-faq/remove-the-agent.png
[4]: ./media/security-center-platform-migration-faq/solutions.png
[5]: ./media/security-center-platform-migration-faq/use-another-workspace.png
[6]: ./media/security-center-platform-migration-faq/reconfigure-monitored-vm.png
