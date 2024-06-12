---
title: Troubleshoot VM insights
description: Get troubleshooting information for installation of VM insights.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
ms.custom: references_regions

---

# Troubleshoot VM insights

This article provides troubleshooting information to help you with problems that you might experience when you try to enable or use virtual machine (VM) insights in Azure Monitor.

## Can't enable VM insights on a machine

When you onboard an Azure virtual machine from the Azure portal, the following actions occur:

- A default Log Analytics workspace is created if you selected that option.
- The Azure Monitor Agent is installed on Azure virtual machines through a VM extension, if the agent is already installed.
- The Dependency Agent is installed on Azure virtual machines through an extension, if it's required.

During the onboarding process, each of these steps is verified and a notification status appears in the portal. Configuration of the workspace and the agent installation typically takes 5 to 10 minutes. It takes another 5 to 10 minutes for data to become available to view in the portal.

If you receive a message that the virtual machine needs to be onboarded after you perform the onboarding process, allow up to 30 minutes for the process to finish. If the issue persists, see the following sections for possible causes.

### Is the virtual machine running?

If the virtual machine has been turned off for a while, is off currently, or was only recently turned on, you won't have data to display until data arrives.

### Is the operating system supported?

If the operating system isn't in the [list of supported operating systems](vminsights-enable-overview.md#supported-operating-systems), installation of the extension fails and you get a message about waiting for data to arrive.

> [!IMPORTANT]
> As of April 11, 2022, if your virtual machine doesn't appear in VM insights, you might be running an older version of the Dependency Agent. For more information, see the blog post [Potential breaking changes for VM insights Linux customers](https://techcommunity.microsoft.com/t5/azure-monitor-status/potential-breaking-changes-for-vm-insights-linux-customers/ba-p/3271989). This consideration doesn't apply for Windows machines and for VMs that you onboarded before April 11, 2022.

### Was the extension installed properly?

If you still see a message that the virtual machine needs to be onboarded, it might mean that one or both of the extensions failed to be installed correctly. In the Azure portal, on the **Extensions** pane for your virtual machine, check whether the following extensions appear.

| Operating system | Agents |
|:---|:---|
| Windows | MicrosoftMonitoringAgent<br>Microsoft.Azure.Monitoring.DependencyAgent |
| Linux | OMSAgentForLinux<br>DependencyAgentLinux |

If you don't see both extensions for your operating system in the list of installed extensions, you must install them. If the extensions are listed but their status doesn't appear as **Provisioning succeeded**, remove the extensions and reinstall them.

### Do you have connectivity issues?

For Windows machines, you can use the TestCloudConnectivity tool to identify the connectivity issue. This tool is installed by default with the agent in the folder *%SystemDrive%\Program Files\Microsoft Monitoring Agent\Agent*. Run the tool from an elevated command prompt. It returns results and highlights where the test fails.

:::image type="content" source="media/vminsights-troubleshoot/test-cloud-connectivity.png" lightbox="media/vminsights-troubleshoot/test-cloud-connectivity.png" alt-text="Screenshot that shows the tool for testing cloud connectivity." border="false":::

## DCR created by the VM insights process was modified and now data is missing

### Identify the issue

To identify whether a data collection rule (DCR) was modified:

1. Go to the Azure Monitor dashboard.
1. Locate the DCR.
1. View the JSON properties by using the **JSON View** link on the upper-right side of the overview pane.

   ![Screenshot of JSON for a data collection rule.](media/vminsights-troubleshoot/dcr-overview.png)

   In this example, the original stream name was changed to reflect the name of the performance counter stream.

   ![Screenshot that shows a changed stream name in a data collection rule.](media/vminsights-troubleshoot/dcr-json.png)

   Although the counter sections are pointing the `perf` table, the stream dataflow is still configured for the proper destination `Microsoft-InsightsMetrics`.

### Resolve the issue

You can't resolve this issue by using the Azure Monitor dashboard directly. But you can resolve it by exporting the template, normalizing the name, and then importing the modified rule over itself.

#### Export the DCR and save locally

1. On the Azure Monitor dashboard, go to the DCR.

2. Select **Export template**.

   ![Screenshot of the menu option to export a template for a data collection rule.](media/vminsights-troubleshoot/dcr-export.png)

3. On the **Export template** pane for the selected DCR, the portal creates the template file and a matching parameter file. After this process is complete, select **Download** to download the template package and save it locally.

   ![Screenshot of the button for downloading a template for a data collection rule.](media/vminsights-troubleshoot/template-download.png)

4. Select **Open file**.

   ![Screenshot that shows the link for opening a downloaded file package.](media/vminsights-troubleshoot/downloads.png)

5. Copy the two .json files to a local folder.

   ![Screenshot that shows parameter and template files copied to a local folder.](media/vminsights-troubleshoot/copy-file.png)

#### Modify the template

1. Open the template file in the editor of your choice. Then locate the invalid stream name under the performance counter data source.

   ![Screenshot of a template file.](media/vminsights-troubleshoot/update-template.png)

2. Using the valid stream name from the dataflow node, fix the invalid reference. Then save and close your file.

   ![Screenshot of an updated stream name in a template file.](media/vminsights-troubleshoot/correct-template.png)

#### Import the template by using the custom deployment feature

1. Back in the portal, search for and then select **Deploy a custom template**.

   ![Screenshot of search results for the service that deploys a custom template.](media/vminsights-troubleshoot/deploy-template.png)

2. On the **Custom deployment** pane, select **Build your own template in the editor**.

   ![Screenshot of the option to build your own template in the editor.](media/vminsights-troubleshoot/build-template.png)

3. Select **Load file**, and then browse to your saved template and parameter file.

   ![Screenshot of Load File.](media/vminsights-troubleshoot/load-file.png)

4. Visually inspect the template to validate the change is in place and select the Save button.

   ![Screenshot of Edit Template.](media/vminsights-troubleshoot/save-template.png)

5. From here the portal will use the parameter file to fill in the deployment options (which can be changed) or left intact to overwrite the existing DCR, Once completed select the review and Create button.

   ![Screenshot of Custom Deployment.](media/vminsights-troubleshoot/deploy.png)

6. After validation then we can select the Create button to finalize the deployment.

   ![Screenshot of Create Deployment.](media/vminsights-troubleshoot/create-deployment.png)

7. After the deployment is complete, we can browse to the DCR again and review the JSON in overview blade:

   ![Screenshot of Review JSON.](media/vminsights-troubleshoot/updated-json.png)

8. The agent will detect this change and download the new configuration, and this should restore ingestion to the insight metrics table.

## Performance view has no data

If the agents appear to be installed correctly but you don't see any data in the **Performance** view, see the following sections for possible causes.

### Has your Log Analytics workspace reached its data limit?

Check the [capacity reservations and the pricing for data ingestion](https://azure.microsoft.com/pricing/details/monitor/).

### Is your virtual machine agent connected to Azure Monitor Logs?

Open Log Analytics from **Logs** in the Azure Monitor menu in the Azure portal. Run the following query for your computer:

```kusto
Heartbeat
| where Computer == "my-computer"
| sort by TimeGenerated desc 
```

If you don't see any data or if the computer hasn't sent a heartbeat recently, you might have problems with your agent. See the preceding section for agent troubleshooting information.

## Virtual machine doesn't appear in the Map view

See the following sections for issues with the **Map** view.

### Is the Dependency Agent installed?

Use the information in the preceding sections to determine if the Dependency Agent is installed and working properly.

### Are you on the Log Analytics free tier?

The [Log Analytics free tier](https://azure.microsoft.com/pricing/details/monitor/) is a legacy pricing plan that allows for up to five unique Service Map machines. Any subsequent machines won't appear in Service Map, even if the prior five are no longer sending data.

### Is your virtual machine sending log and performance data to Azure Monitor Logs?

Use the log query in the [Performance view has no data](#performance-view-has-no-data) section to determine if data is being collected for the virtual machine. If no data is being collected, use the TestCloudConnectivity tool to determine if you have connectivity issues.

## Virtual machine appears in the Map view but has missing data

If the virtual machine is in the **Map** view, the Dependency Agent is installed and running, but the kernel driver didn't load, check the log file at the following locations:

| Operating system | Log |
|:---|:---|
| Windows | C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log |
| Linux | /var/opt/microsoft/dependency-agent/log/service.log |

The last lines of the file should indicate why the kernel didn't load. For example, the kernel might not be supported on Linux if you updated your kernel.

## Related content

- [Enable VM insights overview](vminsights-enable-overview.md).
- [Troubleshoot issues with the Log Analytics agent for Windows](../agents/agent-windows-troubleshoot.md)
- [Troubleshoot issues with the Log Analytics agent for Linux](../agents/agent-linux-troubleshoot.md)
