---
title: Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent 
description: Ingest syslog messages from linux machines, devices, and appliances to Microsoft Sentinel using data connectors based on the Azure Monitor Agent (AMA).
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 05/08/2024
#Customer intent: As a security operator, I want to ingest and filter Syslog and CEF messages from Linux machines and from network and security devices and appliances to my Microsoft Sentinel workspace, so that security analysts can monitor activity on these systems and detect security threats.
---

# Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent

This article describes how to use the **Syslog via AMA** and **Common Event Format (CEF) via AMA** connectors to quickly filter and ingest Syslog messages, including messages in Common Event Format (CEF), from Linux machines and from network and security devices and appliances. To learn more about these data connectors, see [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md). After you configure the connector using the steps in this article, configure the device.

## Prerequisites

Before you begin, you must have the resources configured and the appropriate permissions described in this section. 

### Microsoft Sentinel prerequisites

- Install the appropriate Microsoft Sentinel solution&mdash;**Syslog** and/or **Common Event Format**. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- Your Azure account must have the following Azure role-based access control (Azure RBAC) roles:

  | Built-in role | Scope | Reason |
  | ------------- | ----- | ------ |
  | - [Virtual Machine Contributor](../role-based-access-control/built-in-roles/compute.md#virtual-machine-contributor)<br>- [Azure Connected Machine<br>&nbsp;&nbsp;&nbsp;Resource Administrator](../role-based-access-control/built-in-roles/management-and-governance.md#azure-connected-machine-resource-administrator) | <li>Virtual machines<li>Virtual Machine Scale Sets<li>Azure Arc-enabled servers | To deploy the agent |
  | Any role that includes the action<br>*Microsoft.Resources/deployments/\** | <li>Subscription<li>Resource group<li>Existing data collection rule | To deploy Azure Resource Manager templates |
  | [Monitoring Contributor](../role-based-access-control/built-in-roles/monitor.md#monitoring-contributor) | <li>Subscription<li>Resource group<li>Existing data collection rule | To create or edit data collection rules |

### Log forwarder prerequisites

If you're collecting messages from a log forwarder, the following prerequisites apply:

- You must have a designated Linux VM (your **Log forwarder**) to collect logs.
    - [Create a Linux VM in the Azure portal](../virtual-machines/linux/quick-create-portal.md).
    - [Supported Linux operating systems for Azure Monitor Agent](../azure-monitor/agents/agents-overview.md#linux).

- If your log forwarder *isn't* an Azure virtual machine, it must have the Azure Arc [Connected Machine agent](../azure-arc/servers/overview.md) installed on it.

- The Linux log forwarder VM must have Python 2.7 or 3 installed. Use the ``python --version`` or ``python3 --version`` command to check. If using Python 3 make sure it's set as the default command on the machine, or run scripts with the 'python3' command instead of 'python'.

- The log forwarder must have either the `syslog-ng` or `rsyslog` daemon enabled.

- For space requirements for your log forwarder, refer to the [Azure Monitor Agent Performance Benchmark](../azure-monitor/agents/azure-monitor-agent-performance.md). You can also review [this blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516), which includes designs for scalable ingestion.

- Your log sources (your security devices and appliances) must be configured to send their log messages to the log forwarder's Syslog daemon instead of to their local Syslog daemon.

### Machine security prerequisites

Configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](../virtual-machines/security-policy.md), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending Syslog and CEF logs over TLS (because, for example, your log forwarder is in the cloud), you need to configure the Syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

## Set up the data connector

Set up the appropriate data connector in one of two ways:
- Deploy and configure the **Syslog via AMA** or **Common Event Format (CEF) via AMA** data connector in Microsoft Sentinel. With this setup, you can create, manage, and delete DCRs per workspace. The AMA is installed automatically on the VMs you select in the connector configuration.  
    **&mdash;OR&mdash;**
- Send HTTP requests to the Logs Ingestion API. With this setup, you can create, manage, and delete DCRs. This option is more flexible than the portal. For example, with the API, you can filter by specific log levels, where with the UI, you can only select a minimum log level. The downside is that you have to manually install the Azure Monitor Agent on the log forwarder before creating a DCR.

Select the appropriate tab for instructions.

# [Syslog in portal](#tab/syslog)

### Create data collection rule

To get started, open the data connector in Microsoft Sentinel and create a data connector rule.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Data connectors**.

1. Type *Syslog* in the **Search** box. From the results, select the **Syslog via AMA** connector.

1. Select **Open connector page** on the details pane.

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-cef-ama/syslog-connector-page-create-dcr.png" alt-text="Screenshot showing the CEF via AMA connector page." lightbox="media/connect-cef-ama/cef-connector-page-create-dcr.png":::

1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

### Define VM resources

In the **Resources** tab, select the machines on which you want to install the AMA&mdash;in this case, your log forwarder machine. (If your log forwarder doesn't appear in the list, it might not have the Azure Connected Machine agent installed.)

1. Use the available filters or search box to find your log forwarder VM. You can expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the log forwarder VM that you want to install the AMA on. The check box appears next to the VM name when you hover over it.

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

### Select facilities and severities

Be aware that using the same facility for both Syslog and CEF messages might result in data ingestion duplication. Learn how to [avoid data ingestion duplication](#avoid-data-ingestion-duplication).

1. In the **Collect** tab, select the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your selections and select **Next: Review + create**. 

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

   The connector installs the Azure Monitor Agent on the machines you selected when creating your DCR.

1. Check the notifications in the Azure portal or Microsoft Defender portal to see when the DCR is created and the agent is installed.

1. Select **Refresh** on the connector page to see the DCR displayed in the list.

# [CEF in portal](#tab/cef)

### Create data collection rule

To get started, open the data connector in Microsoft Sentinel and create a data connector rule.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Data connectors**.

1. Type *CEF* in the **Search** box. From the results, select the **Common Event Format (CEF) via AMA** connector.

1. Select **Open connector page** on the details pane.

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-cef-ama/cef-connector-page-create-dcr.png" alt-text="Screenshot showing the CEF via AMA connector page." lightbox="media/connect-cef-ama/cef-connector-page-create-dcr.png":::

1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

### Define VM resources

In the **Resources** tab, select the machines on which you want to install the AMA&mdash;in this case, your log forwarder machine. (If your log forwarder doesn't appear in the list, it might not have the Azure Connected Machine agent installed.)

1. Use the available filters or search box to find your log forwarder VM. You can expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the log forwarder VM that you want to install the AMA on. The check box appears next to the VM name when you hover over it.

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

### Select facilities and severities

Be aware that using the same facility for both Syslog and CEF messages might result in data ingestion duplication. For more information, see [Data ingestion duplication](cef-syslog-ama-overview.md#data-ingestion-duplication).

1. In the **Collect** tab, select the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your selections and select **Next: Review + create**. 

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

   The connector installs the Azure Monitor Agent on the machines you selected when creating your DCR.

1. Check the notifications in the Azure portal or Microsoft Defender portal to see when the DCR is created and the agent is installed.

1. Select **Refresh** on the connector page to see the DCR displayed in the list.

# [Logs Ingestion API](#tab/api)

### Install the Azure Monitor Agent

Follow these instructions, from the Azure Monitor documentation, to install the Azure Monitor Agent on your log forwarder. Remember to use the instructions for Linux, not those for Windows.
- [Install the AMA using PowerShell](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-powershell)
- [Install the AMA using the Azure CLI](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-cli)
- [Install the AMA using an Azure Resource Manager template](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-resource-manager)

You can create Data Collection Rules (DCRs) using the [Azure Monitor Logs Ingestion API](/rest/api/monitor/data-collection-rules). Learn more about [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md).

### Create the data collection rule

Create a JSON file for the data collection rule, create an API request, and send the request.
 
1. Prepare a DCR file in JSON format. The contents of this file is the request body in your API request.

    For an example, see [Syslog/CEF DCR creation request body](api-dcr-reference.md#syslogcef-dcr-creation-request-body).

    - Verify that the `streams` field is set to `Microsoft-Syslog` for Syslog messages, or to `Microsoft-CommonSecurityLog` for CEF messages.
    - Add the filter and facility log levels in the `facilityNames` and `logLevels` parameters. See [Examples of facilities and log levels sections](cef-syslog-ama-overview.md#examples-of-facilities-and-log-levels-sections).

1. Create an API request in a REST API client of your choosing.
    1. For the **request URL and header**, copy the following request URL and header.

        ```http
        PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2022-06-01
        ```

        - Substitute the appropriate values for the `{subscriptionId}` and `{resourceGroupName}` placeholders. 
        - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleName}` placeholder.

    1. For the **request body**, copy and paste the contents of the DCR JSON file that you created (in step 1 above) into the request body.

1. Send the request.
 
    For an example of the response that you should receive, see [Syslog/CEF DCR creation response](api-dcr-reference.md#syslogcef-dcr-creation-response)

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

---


## Run the "installation" script

The "installation" script doesn't actually install anything, but it configures the Syslog daemon on your log forwarder properly to collect the logs.

1. From the connector page, copy the command line that appears under **Run the following command to install and apply the CEF collector:** by selecting the *copy* icon next to it.

    :::image type="content" source="media/connect-cef-ama/run-install-script.png" alt-text="Screenshot of command line on connector page.":::

    You can also copy it from here:
    ```python
    sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
    ```

1. Sign in to the log forwarder machine where you just installed the AMA.

1. Paste the command you copied in the last step to launch the installation script.  
    The script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon. The script opens port 514 to listen to incoming messages in both UDP and TCP protocols. To change this setting, refer to the Syslog daemon configuration file according to the daemon type running on the machine:
    - Rsyslog: `/etc/rsyslog.conf`
    - Syslog-ng: `/etc/syslog-ng/syslog-ng.conf`

    > [!NOTE] 
    > To avoid [Full Disk scenarios](../azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) where the agent can't function, we recommend that you set the `syslog-ng` or `rsyslog` configuration not to store unneeded logs. A Full Disk scenario disrupts the function of the installed AMA.
    > Read more about [RSyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [Syslog-ng](https://www.syslog-ng.com/technical-documents/doc/syslog-ng-open-source-edition/3.26/administration-guide/34#TOPIC-1431029).

## Configure the device

Some providers have device instructions available in the article [Configure specific devices for Microsoft Sentinel syslog or CEF AMA data connectors](unified-connectors-configure-devices.md). Contact the solution provider for more information.

## Test the connector

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

- [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)
- [Data collection rules in Azure Monitor](../azure-monitor/essentials/data-collection-rule-overview.md)
- [Configure specific devices for Microsoft Sentinel syslog or CEF AMA data connectors](unified-connectors-configure-devices.md)