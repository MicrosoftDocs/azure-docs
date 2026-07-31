---
title: Enable Insights to troubleshoot SAP workload issues
description: Learn how to enable the Insights capability in Azure Monitor for SAP solutions to troubleshoot availability and performance issues with your SAP workloads on Azure.
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 04/07/2026
ms.author: akak
author: akarshprabhu
# Customer intent: As an SAP BASIS team member, I want to enable SAP Insights on Azure Monitor for my SAP instance, so that I can effectively troubleshoot availability and performance issues with my SAP workloads.
---

# Enable Insights to troubleshoot SAP workload issues (preview)

The Insights capability in Azure Monitor for SAP solutions helps you troubleshoot availability and performance issues on your SAP workloads. It helps you correlate key SAP component issues with SAP logs, Azure platform metrics, and health events.

In this how-to guide, learn to enable Insights in Azure Monitor for SAP solutions. You can use SAP Insights only with the latest version of the service, *Azure Monitor for SAP solutions*, not *Azure Monitor for SAP solutions (classic)*.

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-sap-insights.md)]

## Scope of the preview

The Insights capability is available for a limited set of issues as part of the preview. This capability extends to most of the issues supported by AMS alerts before it becomes generally available (GA).

* Availability insights let you detect and troubleshoot unavailability of NetWeaver system, instance, and HANA DB.
* Performance insights are provided for NetWeaver metrics—high response time (ST03) and long-running batch jobs.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).
- An existing NetWeaver and HANA (optional) provider. To configure a NetWeaver provider, see [NetWeaver provider configuration](provider-netweaver.md).
- (Optional) Alerts set up for availability or performance issues on the NetWeaver/HANA provider. To configure alerts, see [Setting up alerts on Azure Monitor for SAP](get-alerts-portal.md).

## Enable Insights in Azure Monitor for SAP solutions

To enable Insights for Azure Monitor for SAP solutions, follow the information provided in:

* [Prerequisite - Unprotect methods](#unprotect-the-getenvironment-method)
* [Provide required access](#provide-required-access)

### Unprotect the GetEnvironment method

Follow steps to unprotect methods from the [NetWeaver provider configuration page](provider-netweaver.md#prerequisite-unprotect-methods-for-metrics).

If you completed these steps during NetWeaver provider setup, you can skip this section. Make sure that you unprotect the GetEnvironment method for this capability to work.

### Provide required access

To provide issue correlations with infrastructure, the Azure Monitor for SAP solutions (AMS) service requires Reader access over the resource groups or subscriptions that hold your SAP system infrastructure—virtual machines and virtual networks. You can assign these role assignments by using one of the two methods described.

#### Provide access by using the AMS portal experience

1. Open the AMS instance of your choice and go to the **Insights** tab under **Monitoring** on the left navigation pane, and select **Configure Insights**.

   :::image type="content" source="./media/enable-sap-insights/configure-insights-button.png" alt-text="Screenshot that shows the configuration button of Insights on AMS.":::

1. Select **Add role assignment** to open the role assignment experience.

   :::image type="content" source="./media/enable-sap-insights/configure-insights-flyout.png" alt-text="Screenshot that shows the configuration flyout of Insights on AMS.":::

1. Choose the scope at which you want to assign the Reader role. You can assign the Reader role to multiple resource groups at a time under a subscription scope. Make sure that the scopes chosen encompass the SAP system's infrastructure on Azure. Save the role assignments.

   :::image type="content" source="./media/enable-sap-insights/add-role-assignment.png" alt-text="Screenshot that shows the 'Add role assignment' screen of Insights on AMS.":::

#### Provide access using a PowerShell script

This script gives your AMS instance Reader role permission over the subscriptions that hold the SAP systems. You can change the script to scope it down to a resource group or a set of virtual machines.

1. Download the [onboarding script](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/blob/main/Scripts/AMS_AIOPS_SETUP.ps1) from GitHub.

1. In the Azure portal, select the **Cloud Shell** tab from the menu bar at the top. To get started, see the [Cloud Shell quickstart](../../cloud-shell/quickstart.md).

1. Switch from Bash to PowerShell.

   :::image type="content" source="./media/enable-sap-insights/powershell-upload.png" alt-text="Screenshot that shows the upload button on Azure Cloud Shell.":::

1. Upload the script downloaded in the first step.

1. Go to the folder that contains the script by using the command:

   ```powershell
   cd <script_path>
   ```

1. Set the AMS Resource/ARM ID with the command:

   ```powershell
   $armId = "<AMS ARM ID>"
   ```

1. If the virtual machines (VMs) belong to a different subscription than AMS, set the list of subscriptions in which VMs of the SAP system are present (use subscription IDs):

   ```powershell
   $subscriptions = "<Subscription ID 1>","<Subscription ID 2>"
   ```

   > [!IMPORTANT]
   > To run this script successfully, make sure you have Contributor + User Access Admin or Owner access on all subscriptions in the list. See [role assignments steps in Azure](../../role-based-access-control/role-assignments-steps.md).

1. Run the script uploaded in step 4 by using the command:

   - If `$subscriptions` was set:

     ```powershell
     .\AMS_AIOPS_SETUP.ps1 -ArmId $armId -subscriptions $subscriptions
     ```

   - If `$subscriptions` wasn't set:

     ```powershell
     .\AMS_AIOPS_SETUP.ps1 -ArmId $armId
     ```

   > [!IMPORTANT]
   > You might have to wait for up to 30 minutes for your AMS to start receiving metadata of the infrastructure that it needs to monitor.

## Use Insights in Azure Monitor for SAP solutions

The Insights capability provides two categories of issue analysis:

* [Availability issues](#investigate-availability-insights)
* [Performance degradations](#investigate-performance-insights)

> [!IMPORTANT]
> As a user of the Insights capability, you require Reader access on all virtual machines on which the SAP systems are hosted that you're trying to monitor by using AMS. This access is needed to view Azure Monitor metrics and Resource Health events of these virtual machines in context of SAP issues. See [role assignments steps in Azure](../../role-based-access-control/role-assignments-steps.md).

### Investigate availability insights

This capability helps you get an overview of your SAP system availability in one place. You can also correlate SAP availability with Azure platform VM availability and its health events, easing the overall root-cause analysis process.

#### Use availability insights

1. Open the AMS instance of your choice and go to the **Insights** tab under **Monitoring** on the left navigation pane.

   :::image type="content" source="./media/enable-sap-insights/visit-insights-tab.png" alt-text="Screenshot that shows the landing page of Insights on AMS.":::

1. If you completed all [the steps mentioned](#enable-insights-in-azure-monitor-for-sap-solutions), you should see the screen shown in step 1 asking for context to be set up. You can set the **Time range**, **SID**, and the provider (optional, **All** selected by default).

1. At the top, the page shows the fired alerts related to SAP system and instance availability.

   :::image type="content" source="./media/enable-sap-insights/availability-overview.png" alt-text="Screenshot of the overview page of availability insights.":::

1. The page shows the SAP system availability trend, categorized by VM - SAP process list. If you selected a fired alert in the previous step, these trends appear in context with the fired alert. If not, these trends respect the time range you set on the main **Time range** filter.

   :::image type="content" source="./media/enable-sap-insights/availability-trends.png" alt-text="Screenshot of the availability trends of availability insights.":::

1. The page shows the Azure virtual machine on which the process is hosted and the corresponding availability trends for the combination. To view detailed insights, select the **Investigate** link.

1. A context pane opens that shows you availability insights on the corresponding virtual machine and the SAP application. It has two categories of insights:

   - **Azure platform**: VM health events filtered by the time range set, either by the workbook filter or the selected alert. This pane also includes the VM availability metric trend for the chosen VM.

     :::image type="content" source="./media/enable-sap-insights/availability-vm-health.png" alt-text="Screenshot of the VM health events of availability insights.":::

   - **SAP Application**: Process availability and contextual insights on the process like error messages (SM21), lock entries (SM12), and canceled jobs (SM37) that can help you find issues that might exist in parallel in the system at that time.

### Investigate performance insights

This capability helps you get an overview of your SAP system performance in one place. You can also correlate key SAP performance issues with related SAP application logs alongside Azure platform utilization metrics and SAP workload configuration drifts, easing the overall root-cause analysis process.

#### Use performance insights

1. Open the AMS instance of your choice and go to the **Insights** tab under **Monitoring** on the left navigation pane.

1. At the top, the page shows the fired alerts related to SAP application performance degradations.

   :::image type="content" source="./media/enable-sap-insights/performance-overview.png" alt-text="Screenshot of the overview page of performance insights.":::

1. Next, the page shows key metrics related to performance issues and their trend during the time range you chose.

1. To view detailed insights, either investigate a fired alert or view insights for a key metric.

1. When you investigate, a context pane shows four categories of metrics in context of the issue or key metric chosen.

   - **Issue/Key metric details**: Detailed visualizations of the key metric that defines the problem.

     :::image type="content" source="./media/enable-sap-insights/performance-detail-pane.png" alt-text="Screenshot of the context pane of performance insights.":::

   - **SAP application**: Visualizations of the key SAP logs that pertain to the issue type.

     :::image type="content" source="./media/enable-sap-insights/performance-sap-platform-pane.png" alt-text="Screenshot of the SAP pane of performance insights.":::

   - **Azure platform**: Key Azure platform metrics that present an overview of the virtual machine of the SAP system.

     :::image type="content" source="./media/enable-sap-insights/performance-azure-pane.png" alt-text="Screenshot of the infrastructure pane of performance insights.":::

   - **Configuration drift**: [Quality checks](../center-sap-solutions/get-quality-checks-insights.md) violations on the SAP system.

1. This capability, with the set of metrics in context of the issue, helps you visually correlate trends of key metrics. This experience eases the root-cause analysis of performance degradations observed in SAP workloads on Azure.

## Related content

- [Azure Monitor for SAP solutions providers](providers.md)
