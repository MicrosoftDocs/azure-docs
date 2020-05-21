---
title: Enable Azure Automation Start/Stop VMs during off-hours
description: This article tells how to enable the Start/Stop VMs during off-hours feature for your Azure VMs.
services: automation
ms.subservice: process-automation
ms.date: 04/01/2020
ms.topic: conceptual
---

# Enable Start/Stop VMs during off-hours

Perform the steps in this topic in sequence to enable the Start/Stop VMs during off-hours feature for VMs using a new or existing Automation account and linked Log Analytics workspace. After completing the setup process, configure the variables to customize the feature.

>[!NOTE]
>To use this feature with classic VMs, you need a Classic Run As account, which is not created by default. See [Create a Classic Run As account](automation-create-standalone-account.md#create-a-classic-run-as-account).
>

## Create resources for the feature

1. Sign in to the Azure [portal](https://portal.azure.com).
2. Search for and select **Automation Accounts**.
3. On the Automation Accounts page, select your Automation account from the list.
4. From the Automation account, select **Start/Stop VM** under **Related Resources**. From here, you can click **Learn more about and enable the solution**. If you already have the feature deployed, you can click **Manage the solution** and finding it in the list.

   ![Enable from automation account](./media/automation-solution-vm-management/enable-from-automation-account.png)

   > [!NOTE]
   > You can also create the resource from anywhere in the Azure portal, by clicking **Create a resource**. In the Marketplace page, type a keyword such as **Start** or **Start/Stop**. As you begin typing, the list filters based on your input. Alternatively, you can type in one or more keywords from the full name of the feature and then press **Enter**. Select **Start/Stop VMs during off-hours** from the search results.

5. On the Start/Stop VMs during off-hours page for the selected deployment, review the summary information and then click **Create**.

   ![Azure portal](media/automation-solution-vm-management/azure-portal-01.png)

## Configure the feature

With the resource created, the Add Solution page appears. You're prompted to configure the feature before you can import it into your Automation subscription. See [Configure Start/Stop VMs during off-hours](automation-solution-vm-management-config.md).

   ![VM management Add Solution page](media/automation-solution-vm-management/azure-portal-add-solution-01.png)

## Select a Log Analytics workspace

1. On the Add Solution page, select **Workspace**. Select a Log Analytics workspace that's linked to the Azure subscription used by the Automation account. 

2. If you don't have a workspace, select **Create New Workspace**. On the Log Analytics workspace page, perform the following steps:

   - Specify a name for the new Log Analytics workspace, such as **ContosoLAWorkspace**.
   - Select a **Subscription** to link to by selecting from the dropdown list, if the default selected is not appropriate.
   - For **Resource Group**, you can create a new resource group or select an existing one.
   - Select a **Location**.
   - Select a **Pricing tier**. Choose the **Per GB (Standalone)** option. Azure Monitor logs have updated [pricing](https://azure.microsoft.com/pricing/details/log-analytics/) and the Per GB tier is the only option.

   > [!NOTE]
   > When enabling features, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

3. After providing the required information on the Log Analytics workspace page, click **Create**. You can track its progress under **Notifications** from the menu, which returns you to the Add Solution page when done.

## Add Automation account

Access the Add Solution page again and select **Automation account**. You can select an existing Automation account that not already linked to a Log Analytics workspace. If you're creating a new Log Analytics workspace, you can create a new Automation account to associate with it. Select an existing Automation account or click **Create an Automation account**, and on the Add Automation account page, provide the the name of the Automation account in the **Name** field.

All other options are automatically populated, based on the Log Analytics workspace selected. You can't modify these options. An Azure Run As account is the default authentication method for the runbooks included with the feature. 

After you click **OK**, the configuration options are validated and the Automation account is created. You can track its progress under **Notifications** from the menu.

## Define feature parameters

1. On the Add Solution page, select **Configuration**. The Parameters page appears.

    ![Parameters page for solution](media/automation-solution-vm-management/azure-portal-add-solution-02.png)

2. Specify a value for the **Target ResourceGroup Names** field. The field defines group names that contain VMs for the feature to manage. You can enter more than one name and separate the names using commas (values are not case-sensitive). Using a wildcard is supported if you want to target VMs in all resource groups in the subscription. The values are stored in the `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupNames` variables.

    > [!IMPORTANT]
    > The default value for **Target ResourceGroup Names** is a **&ast;**. This setting targets all VMs in a subscription. If you don't want the feature to target all the VMs in your subscription, you must provide a list of resource group names before selecting a schedule.
  
3. Specify a value for the **VM Exclude List (string)** field. This value is the name of one or more virtual machines from the target resource group. You can enter more than one name and separate the names using commas (values are not case-sensitive). Using a wildcard is supported. This value is stored in the `External_ExcludeVMNames` variable.
  
4. Use the **Schedule** field to select a schedule for VM management by the feature. Select a start date and time for your schedule, to create a recurring daily schedule starting at the chosen time. Selecting a different region is not available. To configure the schedule to your specific time zone after configuring the feature, see [Modify the startup and shutdown schedules](automation-solution-vm-management-config.md#modify-the-startup-and-shutdown-schedules).

5. To receive email notifications from an [action group](../azure-monitor/platform/action-groups.md), accept the default value of **Yes** in the  **Email notifications** field, and provide a valid email address. If you select **No** but decide at a later date that you want to receive email notifications, you can update the action group that is created with valid email addresses separated by commas. 

6. Enable the following alert rules:

   - `AutoStop_VM_Child`
   - `Scheduled_StartStop_Parent`
   - `Sequenced_StartStop_Parent`

## Create alerts

Start/Stop VMs during off-hours doesn't include a predefined set of alerts. Review [Create log alerts with Azure Monitor](../azure-monitor/platform/alerts-log.md) to learn how to create job failed alerts to support your DevOps or operational processes and procedures.

## Deploy the feature

1. After you have configured the initial settings required for the feature, click **OK** to close the Parameters page.

2. Click **Create**. After all settings are validated, the feature deploys to your subscription. This process can take several seconds to finish, and you can track its progress under **Notifications** from the menu.

    > [!NOTE]
    > If you have an Azure Cloud Solution Provider (Azure CSP) subscription, after deployment is complete, in your Automation account, go to **Variables** under **Shared Resources** and set the [External_EnableClassicVMs](automation-solution-vm-management.md#variables) variable to **False**. This stops the solution from looking for Classic VM resources.

## Next steps

* To set up the feature, see [Configure Stop/Start VMs during off-hours](automation-solution-vm-management-config.md).
* To resolve feature errors, see [Troubleshoot Start/Stop VMs during off-hours issues](troubleshoot/start-stop-vm.md).