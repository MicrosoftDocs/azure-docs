---
title: Collect logs from text files with the Azure Monitor Agent and ingest to Microsoft Sentinel - AMA
description: Collect text file-based logs from network or security applications installed on Windows- or Linux-based machines, using the Custom Logs via AMA data connector based on the Azure Monitor Agent (AMA).
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/06/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security operator, I want to ingest and filter text file-based logs from network or security applications installed on Windows- or Linux-based machines to my Microsoft Sentinel workspace, so that security analysts can monitor activity on these systems and detect security threats.
---

# Collect logs from text files with the Azure Monitor Agent and ingest to Microsoft Sentinel

This article describes how to use the **Custom Logs via AMA** connector to quickly filter and ingest logs in text-file format from network or security applications installed on Windows or Linux machines.

Many applications log data to text files instead of standard logging services like Windows Event log or Syslog. You can use the Azure Monitor Agent (AMA) to collect data in text files of nonstandard formats from both Windows and Linux computers. The AMA can also effect transformations on the data at the time of collection, to parse it into different fields.

For more information about the applications for which Microsoft Sentinel has solutions to support log collection, see [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](unified-connector-custom-device.md).

For more general information about ingesting custom logs from text files, see [Collect logs from a text file with Azure Monitor Agent](../azure-monitor/agents/data-collection-log-text.md).

> [!IMPORTANT]
> - The **Custom Logs via AMA** data connector is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> - [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

## Prerequisites

Before you begin, you must have the resources configured and the appropriate permissions assigned, as described in this section. 

### Microsoft Sentinel prerequisites

- Install the Microsoft Sentinel solution that matches your application and make sure you have the permissions to complete the steps in this article. You can find these solutions in the **Content hub** in Microsoft Sentinel, and they all include the **Custom Logs via AMA** connector.

    For the list of applications that have solutions in the content hub, see [Specific instructions per application](unified-connector-custom-device.md#specific-instructions-per-application-type). If there isn't a solution available for your application, install the **Custom Logs via AMA** solution.

    For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- Have an Azure account with the following Azure role-based access control (Azure RBAC) roles:

  | Built-in role | Scope | Reason |
  | ------------- | ----- | ------ |
  | - [Virtual Machine Contributor](../role-based-access-control/built-in-roles/compute.md#virtual-machine-contributor)<br>- [Azure Connected Machine<br>&nbsp;&nbsp;&nbsp;Resource Administrator](../role-based-access-control/built-in-roles/management-and-governance.md#azure-connected-machine-resource-administrator) | <li>Virtual machines (VM)<li>Virtual Machine Scale Sets<li>Azure Arc-enabled servers | To deploy the agent |
  | Any role that includes the action<br>*Microsoft.Resources/deployments/\** | <li>Subscription<li>Resource group<li>Existing data collection rule | To deploy Azure Resource Manager templates |
  | [Monitoring Contributor](../role-based-access-control/built-in-roles/monitor.md#monitoring-contributor) | <li>Subscription<li>Resource group<li>Existing data collection rule | To create or edit data collection rules |

### Log forwarder prerequisites

Certain custom applications are hosted on closed appliances that necessitate sending their logs to an external log collector/forwarder. In such a scenario, the following prerequisites apply to the log forwarder:

- You must have a designated Linux VM as a log forwarder to collect logs.
    - [Create a Linux VM in the Azure portal](../virtual-machines/linux/quick-create-portal.md).
    - [Supported Linux operating systems for Azure Monitor Agent](../azure-monitor/agents/agents-overview.md#linux).

- If your log forwarder *isn't* an Azure virtual machine, it must have the Azure Arc [Connected Machine agent](../azure-arc/servers/overview.md) installed on it.

- The Linux log forwarder VM must have Python 2.7 or 3 installed. Use the ``python --version`` or ``python3 --version`` command to check. If you're using Python 3, make sure it's set as the default command on the machine, or run scripts with the 'python3' command instead of 'python'.

- The log forwarder must have either the `syslog-ng` or `rsyslog` daemon enabled.

- For space requirements for your log forwarder, refer to the [Azure Monitor Agent Performance Benchmark](../azure-monitor/agents/azure-monitor-agent-performance.md). You can also review [this blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516), which includes designs for scalable ingestion.

- Your log sources, security devices, and appliances must be configured to send their log messages to the log forwarder's syslog daemon instead of to their local syslog daemon.

#### Machine security prerequisites

Configure the log forwarder machine's security according to your organization's security policy. For example, configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](../virtual-machines/security-policy.md), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending logs over TLS because, for example, your log forwarder is in the cloud, you need to configure the syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS. For more information, see:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

## Configure the data connector

The setup process for the Custom Logs via AMA data connector includes the following steps:

1. Create the destination table in Log Analytics (or Advanced Hunting if you're in the Defender portal).

    The table's name must end with `_CL` and it must consist of only the following two fields:
    - **TimeGenerated** (of type *DateTime*): the timestamp of the creation of the log message.
    - **RawData** (of type *String*): the log message in its entirety.  
        (If you're collecting logs from a log forwarder and not directly from the device hosting the application, name this field **Message** instead of **RawData**.)

1. Install the Azure Monitor Agent and create a Data Collection Rule (DCR) by using either of the following methods:
    - [Azure or Defender portal](?tabs=syslog%2Cportal#create-data-collection-rule-dcr)
    - [Azure Monitor Logs Ingestion API](?tabs=syslog%2Capi#install-the-azure-monitor-agent)

1. If you're collecting logs using a log forwarder, [**run the "installation" script**](#run-the-installation-script) on the log forwarder to configure the syslog daemon to listen for messages from other machines, and to open the necessary local ports.

Select the appropriate tab for instructions.

# [Azure or Defender portal](#tab/portal)

### Create data collection rule (DCR)

To get started, open either the **Custom Logs via AMA** data connector in Microsoft Sentinel and create a data collection rule (DCR).

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Data connectors**.

1. Type *custom* in the **Search** box. From the results, select the **Custom Logs via AMA** connector.

1. Select **Open connector page** on the details pane.

    :::image type="content" source="media/connect-custom-logs-ama/custom-logs-connector-open.png" alt-text="Screenshot of custom logs AMA connector in gallery." lightbox="media/connect-custom-logs-ama/custom-logs-connector-open.png":::

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-custom-logs-ama/custom-logs-connector-page-create-dcr.png" alt-text="Screenshot showing the Custom Logs via AMA connector page." lightbox="media/connect-custom-logs-ama/custom-logs-connector-page-create-dcr.png":::

1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

### Define VM resources

In the **Resources** tab, select the machines on which you want to install the AMA. This is either the machine on which your application is installed, or your log forwarder machine. If the machine you're looking for doesn't appear in the list, it might not be an Azure VM with the Azure Connected Machine agent installed.

1. Use the available filters or search box to find the machine you're looking for. Expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the machine that you want to install the AMA on. The check box appears next to the VM name when you hover over it.

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

### Configure the DCR for your application

1. In the **Collect** tab, select your application or device type from the **Select device type (optional)** drop-down box, or leave it as **Custom new table** if your application or device isn't listed.

1. If you chose one of the listed applications or devices, the **Table name** field is automatically populated with the right table name. If you chose **Custom new table**, enter a table name under **Table name**. The name must end with the `_CL` suffix.

1. In the **File pattern** field, enter the path and file name of the text log files to be collected. To find the default file names and paths for each application or device type, see [Specific instructions per application type](unified-connector-custom-device.md#specific-instructions-per-application-type). You don't have to use the default file names or paths, and you can use wildcards in the file name.

1. In the **Transform** field, if you chose a custom new table in step 1, enter a Kusto query that applies a transformation of your choice to the data.

    If you chose one of the listed applications or devices in step 1, this field is automatically populated with the proper transformation. DO NOT edit the transformation that appears there. Depending on the chosen type, this value should be one of the following:  
    - `source` (the default&mdash;no transformation)
    - `source | project-rename Message=RawData` (for devices that send logs to a forwarder)

1. Review your selections and select **Next: Review + create**.

### Review and create the rule

After you complete all the tabs, review what you entered and create the data collection rule.

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

   The connector installs the Azure Monitor Agent on the machines you selected when creating your DCR.

1. Check the notifications in the Azure portal or Microsoft Defender portal to see when the DCR is created and the agent is installed.

1. Select **Refresh** on the connector page to see the DCR displayed in the list.

# [Resource Manager template](#tab/arm)

### Install the Azure Monitor Agent

Follow the appropriate instructions from the Azure Monitor documentation to install the Azure Monitor Agent on the machine hosting your application, or on your log forwarder. Use the instructions for Windows or for Linux, as appropriate.
- [Install the AMA using PowerShell](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-powershell)
- [Install the AMA using the Azure CLI](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-cli)
- [Install the AMA using an Azure Resource Manager template](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-resource-manager)

Create Data Collection Rules (DCRs) using the [Azure Monitor Logs Ingestion API](/rest/api/monitor/data-collection-rules). For more information, see [Data collection rules in Azure Monitor](../azure-monitor/essentials/data-collection-rule-overview.md).

### Create the data collection rule

Use the following ARM template to create or modify a DCR for collecting text log files:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "{DCR_NAME}",
            "location": "{DCR_LOCATION}",
            "apiVersion": "2022-06-01",
            "properties": {
                "streamDeclarations": {
                    "Custom-Text-{TABLE_NAME}": {
                        "columns": [
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "RawData",
                                "type": "string"
                            },
                        ]
                    }
                },
                "dataSources": {
                    "logFiles": [
                        {
                            "streams": [
                                "Custom-Text-{TABLE_NAME}"
                            ],
                            "filePatterns": [
                                "{LOCAL_PATH_FILE_1}","{LOCAL_PATH_FILE_2}"
                            ],
                            "format": "text",
                            "name": "Custom-Text-{TABLE_NAME}"
                        }
                    ]
                },
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId": "{WORKSPACE_RESOURCE_PATH}",
                            "workspaceId": "{WORKSPACE_ID}",
                            "name": "workspace"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-Text-{TABLE_NAME}"
                        ],
                        "destinations": [
                            "DataCollectionEvent"
                        ],
                        "transformKql": "source",
                        "outputStream": "Custom-{TABLE_NAME}"
                    }
                ]
            }
        }
    ]
}
```

Replace the {PLACE_HOLDER} values with the following values:
| Placeholder | Value |
| ----------- | ----- |
| {DCR_NAME} | The name you choose for your Data Collection Rule. It must be unique within your workspace. |
| {DCR_LOCATION} | The region where the resource group containing the DCR is located. |
| {TABLE_NAME} | The name of the destination table in Log Analytics. Must end with `_CL`. |
| {LOCAL_PATH_FILE_1}&nbsp;*(required)*,<br>{LOCAL_PATH_FILE_2} *(optional)* | Paths and file names of the text files containing the logs you want to collect. These must be on the machine where the Azure Monitor Agent is installed. |
| {WORKSPACE_RESOURCE_PATH} | The Azure resource path of your Microsoft Sentinel workspace. |
| {WORKSPACE_ID} | The GUID of your Microsoft Sentinel workspace. Find it [here](link). |
  

### Associate the DCR with the Azure Monitor Agent

If you create the DCR using an ARM template, you still must associate the DCR with the agents that will use it. You can edit the DCR in the Azure portal and select the agents as described in [Define VM resources](#define-vm-resources).

## Run the "installation" script

If you're collecting logs from an appliance using a log forwarder, configure the syslog daemon on the log forwarder to listen for messages from other machines, and open the necessary local ports.

1. Copy the following command line:

    ```python
    sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
    ```

1. Sign in to the log forwarder machine where you just installed the AMA.

1. Paste the command you copied in the last step to launch the installation script.  
    The script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon. The script opens port 514 to listen to incoming messages in both UDP and TCP protocols. To change this setting, refer to the syslog daemon configuration file according to the daemon type running on the machine:
    - Rsyslog: `/etc/rsyslog.conf`
    - Syslog-ng: `/etc/syslog-ng/syslog-ng.conf`

    If you're using Python 3, and it's not set as the default command on the machine, substitute `python3` for `python` in the pasted command. See [Log forwarder prerequisites](#log-forwarder-prerequisites).

    > [!NOTE] 
    > To avoid [Full Disk scenarios](../azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) where the agent can't function, we recommend that you set the `syslog-ng` or `rsyslog` configuration not to store unneeded logs. A Full Disk scenario disrupts the function of the installed AMA.
    > For more information, see [RSyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [Syslog-ng](https://syslog-ng.github.io/).

## Configure the security device or appliance

For specific instructions to configure your security application or appliance, see [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](unified-connector-custom-device.md)

Contact the solution provider for more information or where information is unavailable for the appliance or device.

## Test the connector

***(IS THIS SECTION RELEVANT??? -YL)***

Verify that logs messages from your linux machine or security devices and appliances are ingested into Microsoft Sentinel. 

1. To validate that the syslog daemon is running on the UDP port and that the AMA is listening, run this command:

    ```
    netstat -lnptv
    ```

    You should see the `rsyslog` or `syslog-ng` daemon listening on port 514. 

1. To capture messages sent from a logger or a connected device, run this command in the background:

    ```
    tcpdump -i any port 514 -A -vv &
    ```
1. After you complete the validation, we recommend that you stop the `tcpdump`: Type `fg` and then select <kbd>Ctrl</kbd>+<kbd>C</kbd>.
1. To send demo messages, complete of the following steps: 
    - Use the netcat utility. In this example, the utility reads data posted through the `echo` command with the newline switch turned off. The utility then writes the data to UDP port `514` on the localhost with no timeout. To execute the netcat utility, you might need to install another package.
    
        ```
        echo -n "<164>CEF:0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time" | nc -u -w0 localhost 514
        ```
    - Use the logger. This example writes the message to the `local 4` facility, at severity level `Warning`, to port `514`, on the local host, in the CEF RFC format. The `-t` and `--rfc3164` flags are used to comply with the expected RFC format.
    
        ```
        logger -p local4.warn -P 514 -n 127.0.0.1 --rfc3164 -t CEF "0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time"
        ```    

1. To verify that the connector is installed correctly, run the troubleshooting script with one of these commands:

    - For CEF logs, run:
        
        ```python
         sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --cef
        ```

## Related content

- [Data collection rules in Azure Monitor](../azure-monitor/essentials/data-collection-rule-overview.md)
- [Collect logs from a text file with Azure Monitor Agent](../azure-monitor/agents/data-collection-log-text.md)
