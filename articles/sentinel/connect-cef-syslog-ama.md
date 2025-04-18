---
title: Ingest syslog and CEF messages to Microsoft Sentinel - AMA
description: Ingest syslog messages from linux machines and from network and security devices and appliances to Microsoft Sentinel, using data connectors based on the Azure Monitor Agent (AMA).
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 06/27/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security engineer, I want to ingest and filter syslog and CEF messages from Linux machines and from network and security devices and appliances to my workspace, so that I can enhance threat detection and incident response capabilities.

---

# Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent

This article describes how to use the **Syslog via AMA** and **Common Event Format (CEF) via AMA** connectors to quickly filter and ingest syslog messages, including messages in Common Event Format (CEF), from Linux machines and from network and security devices and appliances. To learn more about these data connectors, see [Syslog and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md). 

> [!NOTE]
> Container Insights now supports the automatic collection of Syslog events from Linux nodes in your AKS clusters. To learn more, see [Syslog collection with Container Insights](/azure/azure-monitor/containers/container-insights-syslog).

## Prerequisites

Before you begin, you must have the resources configured and the appropriate permissions assigned, as described in this section. 

### Microsoft Sentinel prerequisites

Install the appropriate Microsoft Sentinel solution and make sure you have the permissions to complete the steps in this article.

- Install the appropriate solution from the **Content hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- Identify which data connector the Microsoft Sentinel solution requires &mdash; **Syslog via AMA** or **Common Event Format (CEF) via AMA** and whether you need to install the **Syslog** or **Common Event Format** solution. To fulfill this prerequisite, 

  - In the **Content hub**, select **Manage** on the installed solution and review the data connector listed. 

  - If either **Syslog via AMA** or **Common Event Format (CEF) via AMA** isn't installed with the solution, identify whether you need to install the **Syslog** or **Common Event Format** solution by finding your appliance or device from one of the following articles:

    - [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
    - [Syslog via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)

    Then install either the **Syslog** or **Common Event Format** solution from the content hub to get the related AMA data connector.

- Have an Azure account with the following Azure role-based access control (Azure RBAC) roles:

  | Built-in role | Scope | Reason |
  | ------------- | ----- | ------ |
  | - [Virtual Machine Contributor](../role-based-access-control/built-in-roles/compute.md#virtual-machine-contributor)<br>- [Azure Connected Machine<br>&nbsp;&nbsp;&nbsp;Resource Administrator](../role-based-access-control/built-in-roles/management-and-governance.md#azure-connected-machine-resource-administrator) | <li>Virtual machines (VM)<li>Virtual Machine Scale Sets<li>Azure Arc-enabled servers | To deploy the agent |
  | Any role that includes the action<br>*Microsoft.Resources/deployments/\** | <li>Subscription<li>Resource group<li>Existing data collection rule | To deploy Azure Resource Manager templates |
  | [Monitoring Contributor](../role-based-access-control/built-in-roles/monitor.md#monitoring-contributor) | <li>Subscription<li>Resource group<li>Existing data collection rule | To create or edit data collection rules |

### Log forwarder prerequisites

If you're collecting messages from a log forwarder, the following prerequisites apply:

- You must have a designated Linux VM as a log forwarder to collect logs.
    - [Create a Linux VM in the Azure portal](/azure/virtual-machines/linux/quick-create-portal).
    - [Supported Linux operating systems for Azure Monitor Agent](/azure/azure-monitor/agents/agents-overview#linux).

- If your log forwarder *isn't* an Azure virtual machine, it must have the Azure Arc [Connected Machine agent](/azure/azure-arc/servers/overview) installed on it.

- The Linux log forwarder VM must have Python 2.7 or 3 installed. Use the ``python --version`` or ``python3 --version`` command to check. If you're using Python 3, make sure it's set as the default command on the machine, or run scripts with the 'python3' command instead of 'python'.

- The log forwarder must have either the `syslog-ng` or `rsyslog` daemon enabled.

- For space requirements for your log forwarder, refer to the [Azure Monitor Agent Performance Benchmark](/azure/azure-monitor/agents/azure-monitor-agent-performance). You can also review [this blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516), which includes designs for scalable ingestion.

- Your log sources, security devices, and appliances, must be configured to send their log messages to the log forwarder's syslog daemon instead of to their local syslog daemon.

> [!NOTE]
> When deploying the AMA to a Virtual Machine Scale Set (VMSS), you're strongly encouraged to use a load balancer that supports the round-robin method to ensure load distribution across all deployed instances.

### Machine security prerequisites

Configure the machine's security according to your organization's security policy. For example, configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](/azure/virtual-machines/security-policy), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending syslog and CEF logs over TLS because, for example, your log forwarder is in the cloud, you need to configure the syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS. For more information, see:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

## Configure the data connector

The setup process for the Syslog via AMA  or Common Event Format (CEF) via AMA data connectors includes the following steps:

1. Install the Azure Monitor Agent and create a Data Collection Rule (DCR) by using either of the following methods:
    - [Azure or Defender portal](?tabs=syslog%2Cportal#create-data-collection-rule-dcr)
    - [Azure Monitor Logs Ingestion API](?tabs=syslog%2Capi#install-the-azure-monitor-agent)
1. If you're collecting logs from other machines using a log forwarder, [**run the "installation" script**](#run-the-installation-script) on the log forwarder to configure the syslog daemon to listen for messages from other machines, and to open the necessary local ports.

Select the appropriate tab for instructions.

# [Azure or Defender portal](#tab/portal)

### Create data collection rule (DCR)

To get started, open either the **Syslog via AMA** or **Common Event Format (CEF) via AMA** data connector in Microsoft Sentinel and create a data collection rule (DCR).

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Data connectors**.

1. For syslog, type *Syslog* in the **Search** box. From the results, select the **Syslog via AMA** connector. <br> For CEF, type *CEF* in the **Search** box. From the results, select the **Common Event Format (CEF) via AMA** connector.

1. Select **Open connector page** on the details pane.

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-cef-ama/syslog-connector-page-create-dcr.png" alt-text="Screenshot showing the Syslog via AMA connector page." lightbox="media/connect-cef-ama/syslog-connector-page-create-dcr.png":::

    :::image type="content" source="media/connect-cef-ama/cef-connector-page-create-dcr.png" alt-text="Screenshot showing the CEF via AMA connector page." lightbox="media/connect-cef-ama/cef-connector-page-create-dcr.png":::
    
1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

### Define VM resources

In the **Resources** tab, select the machines on which you want to install the AMA&mdash;in this case, your log forwarder machine. If your log forwarder doesn't appear in the list, it might not have the Azure Connected Machine agent installed. 

1. Use the available filters or search box to find your log forwarder VM. Expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the log forwarder VM that you want to install the AMA on. The check box appears next to the VM name when you hover over it.

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

### Select facilities and severities

Be aware that using the same facility for both syslog and CEF messages might result in data ingestion duplication. For more information, see [Data ingestion duplication avoidance](cef-syslog-ama-overview.md#data-ingestion-duplication-avoidance).

1. In the **Collect** tab, select the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your selections and select **Next: Review + create**.

### Review and create the rule

After you complete all the tabs, review what you entered and create the data collection rule.

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

   The connector installs the Azure Monitor Agent on the machines you selected when creating your DCR.

1. Check the notifications in the Azure portal or Microsoft Defender portal to see when the DCR is created and the agent is installed.

1. Select **Refresh** on the connector page to see the DCR displayed in the list.

# [Logs Ingestion API](#tab/api)

### Install the Azure Monitor Agent

Follow the appropriate instructions from the Azure Monitor documentation to install the Azure Monitor Agent on your log forwarder. Remember to use the instructions for Linux, not for Windows.
- [Install the AMA using PowerShell](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-powershell)
- [Install the AMA using the Azure CLI](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-cli)
- [Install the AMA using an Azure Resource Manager template](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-resource-manager)

You can create Data Collection Rules (DCRs) using the [Azure Monitor Logs Ingestion API](/rest/api/monitor/data-collection-rules). For more information, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview).

### Create the data collection rule

Create a JSON file for the data collection rule, create an API request, and send the request.
 
1. Prepare a DCR file in JSON format. The contents of this file is the request body in your API request.

    For an example, see [Syslog/CEF DCR creation request body](api-dcr-reference.md#syslogcef-dcr-creation-request-body). To collect syslog and CEF messages in the same data collection rule, see the example [Syslog and CEF streams in the same DCR](#syslog-and-cef-streams-in-the-same-dcr).

    - Verify that the `streams` field is set to `Microsoft-Syslog` for syslog messages, or to `Microsoft-CommonSecurityLog` for CEF messages.
    - Add the filter and facility log levels in the `facilityNames` and `logLevels` parameters. See [Examples of facilities and log levels sections](#examples-of-facilities-and-log-levels-sections).

1. Create an API request in a REST API client of your choosing.
    1. For the **request URL and header**, copy the following request URL and header.

        ```http
        PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2022-06-01
        ```

        - Substitute the appropriate values for the `{subscriptionId}` and `{resourceGroupName}` placeholders. 
        - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleName}` placeholder.

    1. For the **request body**, copy and paste the contents of the DCR JSON file that you created (in step 1 above) into the request body.

1. Send the request.
 
    For an example of the response that you should receive, see [Syslog/CEF DCR creation response](api-dcr-reference.md#syslogcef-dcr-creation-response).

### Associate the DCR with the log forwarder

Now you need to create a DCR Association (DCRA) that ties the DCR to the VM resource that hosts your log forwarder.

1. Create an API request in a REST API client of your choosing.

1. For the **request URL and header**, copy the following request URL and the header.

    ```http
    PUT 
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/providers/Microsoft.Insights/dataCollectionRuleAssociations/{dataCollectionRuleAssociationName}?api-version=2022-06-01
    ```
    - Substitute the appropriate values for the `{subscriptionId}`, `{resourceGroupName}`, and `{virtualMachineName}` placeholders. 
    - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleAssociationName}` placeholder.

1. For the **request body**, copy the following request body.

    ```json
    {
      "properties": {
        "dataCollectionRuleId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}"
      }
    }
    ```

    - Substitute the appropriate values for the `{subscriptionId}` and `{resourceGroupName}` placeholders. 
    - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleName}` placeholder.

1. Send the request.

### Examples of facilities and log levels sections

Review these examples of the facilities and log levels settings. The `name` field includes the filter name.

For CEF message ingestion, the value for `"streams"` should be `"Microsoft-CommonSecurityLog"` instead of `"Microsoft-Syslog"`.

This example collects events from the `cron`, `daemon`, `local0`, `local3` and `uucp` facilities, with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels:

```json
    "dataSources": {
      "syslog": [
        {
        "name": "SyslogStream0",
        "streams": [
          "Microsoft-Syslog"
        ],
        "facilityNames": [ 
          "cron",
          "daemon",
          "local0",
          "local3", 
          "uucp"
        ],
        "logLevels": [ 
          "Warning", 
          "Error", 
          "Critical", 
          "Alert", 
          "Emergency"
        ]
      }
    ]
  }
```

### Syslog and CEF streams in the same DCR

This example shows how you can collect syslog and CEF messages in the same DCR.

The DCR collects CEF event messages for:
- The `authpriv` and `mark` facilities with the `Info`, `Notice`, `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `daemon` facility with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 

It collects syslog event messages for:
- The `kern`, `local0`, `local5`, and `news` facilities with the `Critical`, `Alert`, and `Emergency` log levels 
- The `mail` and `uucp` facilities with the `Emergency` log level

```json
    "dataSources": {
      "syslog": [
        {
          "name": "CEFStream1",
          "streams": [ 
            "Microsoft-CommonSecurityLog"
          ],
          "facilityNames": [ 
            "authpriv", 
            "mark"
          ],
          "logLevels": [
            "Info",
            "Notice", 
            "Warning", 
            "Error", 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "CEFStream2",
          "streams": [ 
            "Microsoft-CommonSecurityLog"
          ],
          "facilityNames": [ 
            "daemon"
          ],
          "logLevels": [ 
            "Warning", 
            "Error", 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "SyslogStream3",
          "streams": [ 
            "Microsoft-Syslog"
          ],
          "facilityNames": [ 
            "kern",
            "local0",
            "local5", 
            "news"
          ],
          "logLevels": [ 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "SyslogStream4",
          "streams": [ 
            "Microsoft-Syslog"
          ],
          "facilityNames": [ 
            "mail",
            "uucp"
          ],
          "logLevels": [ 
            "Emergency"
          ]
        }
      ]
    }

```

---


## Run the "installation" script

If you're using a log forwarder, configure the syslog daemon to listen for messages from other machines, and open the necessary local ports.

1. From the connector page, copy the command line that appears under **Run the following command to install and apply the CEF collector:**

    :::image type="content" source="media/connect-cef-ama/run-install-script.png" alt-text="Screenshot of command line on connector page.":::

    Or copy it from here:
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
    > To avoid [Full Disk scenarios](/azure/azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog) where the agent can't function, we recommend that you set the `syslog-ng` or `rsyslog` configuration not to store unneeded logs. A Full Disk scenario disrupts the function of the installed AMA.
    > For more information, see [RSyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [Syslog-ng](https://syslog-ng.github.io/).

## Configure the security device or appliance

Get specific instructions to configure your security device or appliance by going to one of the following articles:

- [CEF via AMA data connector - Configure specific appliances and devices for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliances and devices for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)

Contact the solution provider for more information or where information is unavailable for the appliance or device.

## Test the connector

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

    - For Cisco Adaptive Security Appliance (ASA) logs, run:

        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --asa
        ```
 
    - For Cisco Firepower Threat Defense (FTD) logs, run:
    
        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --ftd
        ```

## Related content

- [Syslog and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)
- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
- [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliance or device for the Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)
