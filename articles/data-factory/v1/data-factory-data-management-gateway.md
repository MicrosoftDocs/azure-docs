---
title: Data Management Gateway for Data Factory 
description: Use Data Management Gateway in Azure Data Factory to move your data.
author: nabhishek
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: abnarain 
ms.custom: devx-track-azurepowershell
robots: noindex
---
# Data Management Gateway
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [self-hosted integration runtime in](../create-self-hosted-integration-runtime.md).

> [!NOTE]
> Data Management Gateway has now been rebranded as Self-hosted Integration Runtime.

The Data management gateway is a client agent that you must install in your on-premises environment to copy data between cloud and on-premises data stores. The on-premises data stores supported by Data Factory are listed in the [Supported data sources](data-factory-data-movement-activities.md#supported-data-stores-and-formats) section.

This article complements the walkthrough in the [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md) article. In the walkthrough, you create a pipeline that uses the gateway to move data from a SQL Server database to an Azure blob. This article provides detailed in-depth information about the data management gateway.

You can scale out a data management gateway by associating multiple on-premises machines with the gateway. You can scale up by increasing number of data movement jobs that can run concurrently on a node. This feature is also available for a logical gateway with a single node. See [Scaling data management gateway in Azure Data Factory](data-factory-data-management-gateway-high-availability-scalability.md) article for details.

> [!NOTE]
> Currently, gateway supports only the copy activity and stored procedure activity in Data Factory. It is not possible to use the gateway from a custom activity to access on-premises data sources.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Overview
### Capabilities of data management gateway
Data management gateway provides the following capabilities:

* Model on-premises data sources and cloud data sources within the same data factory and move data.
* Have a single pane of glass for monitoring and management with visibility into gateway status from the Data Factory page.
* Manage access to on-premises data sources securely.
  * No changes required to corporate firewall. Gateway only makes outbound HTTP-based connections to open internet.
  * Encrypt credentials for your on-premises data stores with your certificate.
* Move data efficiently - data is transferred in parallel, resilient to intermittent network issues with auto retry logic.

### Command flow and data flow
When you use a copy activity to copy data between on-premises and cloud, the activity uses a gateway to transfer data from on-premises data source to cloud and vice versa.

Here is the high-level data flow for and summary of steps for copy with data gateway:
:::image type="content" source="./media/data-factory-data-management-gateway/data-flow-using-gateway.png" alt-text="Data flow using gateway":::

1. Data developer creates a gateway for an Azure Data Factory using either the [Azure portal](https://portal.azure.com) or [PowerShell Cmdlet](/powershell/module/az.datafactory/).
2. Data developer creates a linked service for an on-premises data store by specifying the gateway. As part of setting up the linked service, data developer uses the Setting Credentials application to specify authentication types and credentials. The Setting Credentials application dialog communicates with the data store to test connection and the gateway to save credentials.
3. Gateway encrypts the credentials with the certificate associated with the gateway (supplied by data developer), before saving the credentials in the cloud.
4. Data Factory service communicates with the gateway for scheduling & management of jobs via a control channel that uses a shared Azure service bus queue. When a copy activity job needs to be kicked off, Data Factory queues the request along with credential information. Gateway kicks off the job after polling the queue.
5. The gateway decrypts the credentials with the same certificate and then connects to the on-premises data store with proper authentication type and credentials.
6. The gateway copies data from an on-premises store to a cloud storage, or vice versa depending on how the Copy Activity is configured in the data pipeline. For this step, the gateway directly communicates with cloud-based storage services such as Azure Blob Storage over a secure (HTTPS) channel.

### Considerations for using gateway
* A single instance of data management gateway can be used for multiple on-premises data sources. However, **a single gateway instance is tied to only one Azure data factory** and cannot be shared with another data factory.
* You can have **only one instance of data management gateway** installed on a single machine. Suppose, you have two data factories that need to access on-premises data sources, you need to install gateways on two on-premises computers. In other words, a gateway is tied to a specific data factory
* The **gateway does not need to be on the same machine as the data source**. However, having gateway closer to the data source reduces the time for the gateway to connect to the data source. We recommend that you install the gateway on a machine that is different from the one that hosts on-premises data source. When the gateway and data source are on different machines, the gateway does not compete for resources with data source.
* You can have **multiple gateways on different machines connecting to the same on-premises data source**. For example, you may have two gateways serving two data factories but the same on-premises data source is registered with both the data factories.
* If you already have a gateway installed on your computer serving a **Power BI** scenario, install a **separate gateway for Azure Data Factory** on another machine.
* Gateway must be used even when you use **ExpressRoute**.
* Treat your data source as an on-premises data source (that is behind a firewall) even when you use **ExpressRoute**. Use the gateway to establish connectivity between the service and the data source.
* You must **use the gateway** even if the data store is in the cloud on an **Azure IaaS VM**.

## Installation
### Prerequisites
* The supported **Operating System** versions are Windows 7, Windows 8/8.1, Windows 10, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2. Installation of the data management gateway on a domain controller is currently not supported.
* .NET Framework 4.5.1 or above is required. If you are installing gateway on a Windows 7 machine, install .NET Framework 4.5 or later. See [.NET Framework System Requirements](/dotnet/framework/get-started/system-requirements) for details.
* The recommended **configuration** for the gateway machine is at least 2 GHz, 4 cores, 8-GB RAM, and 80-GB disk.
* If the host machine hibernates, the gateway does not respond to data requests. Therefore, configure an appropriate **power plan** on the computer before installing the gateway. If the machine is configured to hibernate, the gateway installation prompts a message.
* You must be an administrator on the machine to install and configure the data management gateway successfully. You can add additional users to the **data management gateway Users** local Windows group. The members of this group are able to use the **Data Management Gateway Configuration Manager** tool to configure the gateway.

As copy activity runs happen on a specific frequency, the resource usage (CPU, memory) on the machine also follows the same pattern with peak and idle times. Resource utilization also depends heavily on the amount of data being moved. When multiple copy jobs are in progress, you see resource usage go up during peak times.

### Installation options
Data management gateway can be installed in the following ways:

* By downloading an MSI setup package from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=39717). The MSI can also be used to upgrade existing data management gateway to the latest version, with all settings preserved.
* By clicking **Download and install data gateway** link under MANUAL SETUP or **Install directly on this computer** under EXPRESS SETUP. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on using express setup. The manual step takes you to the download center. The instructions for downloading and installing the gateway from download center are in the next section.

### Installation best practices:
1. Configure power plan on the host machine for the gateway so that the machine does not hibernate. If the host machine hibernates, the gateway does not respond to data requests.
2. Back up the certificate associated with the gateway.

### Install the gateway from download center
1. Navigate to [Microsoft Data Management Gateway download page](https://www.microsoft.com/download/details.aspx?id=39717).
2. Click **Download**, select the **64-bit** version (32-bit is no more supported), and click **Next**.
3. Run the **MSI** directly or save it to your hard disk and run.
4. On the **Welcome** page, select a **language** click **Next**.
5. **Accept** the End-User License Agreement and click **Next**.
6. Select **folder** to install the gateway and click **Next**.
7. On the **Ready to install** page, click **Install**.
8. Click **Finish** to complete installation.
9. Get the key from the Azure portal. See the next section for step-by-step instructions.
10. On the **Register gateway** page of **Data Management Gateway Configuration Manager** running on your machine, do the following steps:
    1. Paste the key in the text.
    2. Optionally, click **Show gateway key** to see the key text.
    3. Click **Register**.

### Register gateway using key
#### If you haven't already created a logical gateway in the portal
To create a gateway in the portal and get the key from the **Configure** page, Follow steps from walkthrough in the [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

#### If you have already created the logical gateway in the portal
1. In Azure portal, navigate to the **Data Factory** page, and click **Linked Services** tile.

    :::image type="content" source="media/data-factory-data-management-gateway/data-factory-blade.png" alt-text="Data Factory page":::
2. In the **Linked Services** page, select the logical **gateway** you created in the portal.

    :::image type="content" source="media/data-factory-data-management-gateway/data-factory-select-gateway.png" alt-text="logical gateway":::
3. In the **Data Gateway** page, click **Download and install data gateway**.

    :::image type="content" source="media/data-factory-data-management-gateway/download-and-install-link-on-portal.png" alt-text="Download link in the portal":::
4. In the **Configure** page, click **Recreate key**. Click Yes on the warning message after reading it carefully.

    :::image type="content" source="media/data-factory-data-management-gateway/recreate-key-button.png" alt-text="Recreate key button":::
5. Click Copy button next to the key. The key is copied to the clipboard.

    :::image type="content" source="media/data-factory-data-management-gateway/copy-gateway-key.png" alt-text="Copy key":::

### System tray icons/ notifications
The following image shows some of the tray icons that you see.

:::image type="content" source="./media/data-factory-data-management-gateway/gateway-tray-icons.png" alt-text="system tray icons":::

If you move cursor over the system tray icon/notification message, you see details about the state of the gateway/update operation in a popup window.

### Ports and firewall
There are two firewalls you need to consider: **corporate firewall** running on the central router of the organization, and **Windows firewall** configured as a daemon on the local machine where the gateway is installed.

:::image type="content" source="./media/data-factory-data-management-gateway/firewalls2.png" alt-text="firewalls":::

At corporate firewall level, you need configure the following domains and outbound ports:

| Domain names | Ports | Description |
| --- | --- | --- |
| *.servicebus.windows.net |443 |Used for communication with Data Movement Service backend |
| *.core.windows.net |443 |Used for Staged copy using Azure Blob (if configured)|
| *.frontend.clouddatahub.net |443 |Used for communication with Data Movement Service backend |
| *.servicebus.windows.net |9350-9354, 5671 |Optional service bus relay over TCP used by the Copy Wizard |

At Windows firewall level, these outbound ports are normally enabled. If not, you can configure the domains and ports accordingly on gateway machine.

> [!NOTE]
> 1. Based on your source/ sinks, you may have to allow additional domains and outbound ports in your corporate/Windows firewall.
> 2. For some Cloud Databases (For example: [Azure SQL Database](/azure/azure-sql/database/firewall-configure), [Azure Data Lake](../../data-lake-store/data-lake-store-secure-data.md#set-ip-address-range-for-data-access), etc.), you may need to allow IP address of Gateway machine on their firewall configuration.
>
>

#### Copy data from a source data store to a sink data store
Ensure that the firewall rules are enabled properly on the corporate firewall, Windows firewall on the gateway machine, and the data store itself. Enabling these rules allows the gateway to connect to both source and sink successfully. Enable rules for each data store that is involved in the copy operation.

For example, to copy from **an on-premises data store to an Azure SQL Database sink or an Azure Synapse Analytics sink**, do the following steps:

* Allow outbound **TCP** communication on port **1433** for both Windows firewall and corporate firewall.
* Configure the firewall settings of logical SQL server to add the IP address of the gateway machine to the list of allowed IP addresses.

> [!NOTE]
> If your firewall does not allow outbound port 1433, Gateway can't access Azure SQL directly. In this case, you may use [Staged Copy](./data-factory-copy-activity-performance.md#staged-copy) to SQL Database / SQL Managed Instance / SQL Azure DW. In this scenario, you would only require HTTPS (port 443) for the data movement.
>
>

### Proxy server considerations
If your corporate network environment uses a proxy server to access the internet, configure data management gateway to use appropriate proxy settings. You can set the proxy during the initial registration phase.

:::image type="content" source="media/data-factory-data-management-gateway/SetProxyDuringRegistration.png" alt-text="Set proxy during registration":::

Gateway uses the proxy server to connect to the cloud service. Click **Change** link during initial setup. You see the **proxy setting** dialog.

:::image type="content" source="media/data-factory-data-management-gateway/SetProxySettings.png" alt-text="Set proxy using config manager 1":::

There are three configuration options:

* **Do not use proxy**: Gateway does not explicitly use any proxy to connect to cloud services.
* **Use system proxy**: Gateway uses the proxy setting that is configured in diahost.exe.config and diawp.exe.config. If no proxy is configured in diahost.exe.config and diawp.exe.config, gateway connects to cloud service directly without going through proxy.
* **Use custom proxy**: Configure the HTTP proxy setting to use for gateway, instead of using configurations in diahost.exe.config and diawp.exe.config. Address and Port are required. User Name and Password are optional depending on your proxy's authentication setting. All settings are encrypted with the credential certificate of the gateway and stored locally on the gateway host machine.

The data management gateway Host Service restarts automatically after you save the updated proxy settings.

After gateway has been successfully registered, if you want to view or update proxy settings, use Data Management Gateway Configuration Manager.

1. Launch **Data Management Gateway Configuration Manager**.
2. Switch to the **Settings** tab.
3. Click **Change** link in **HTTP Proxy** section to launch the **Set HTTP Proxy** dialog.
4. After you click the **Next** button, you see a warning dialog asking for your permission to save the proxy setting and restart the Gateway Host Service.

You can view and update HTTP proxy by using Configuration Manager tool.

:::image type="content" source="media/data-factory-data-management-gateway/SetProxyConfigManager.png" alt-text="Set proxy using config manager 2":::

> [!NOTE]
> If you set up a proxy server with NTLM authentication, Gateway Host Service runs under the domain account. If you change the password for the domain account later, remember to update configuration settings for the service and restart it accordingly. Due to this requirement, we suggest you use a dedicated domain account to access the proxy server that does not require you to update the password frequently.
>
>

### Configure proxy server settings
If you select **Use system proxy** setting for the HTTP proxy, gateway uses the proxy setting in diahost.exe.config and diawp.exe.config. If no proxy is specified in diahost.exe.config and diawp.exe.config, gateway connects to cloud service directly without going through proxy. The following procedure provides instructions for updating the diahost.exe.config file.

1. In File Explorer, make a safe copy of *C:\\Program Files\\Microsoft Integration Runtime\\5.0\\Shared\\diahost.exe.config* to back up the original file.
2. Launch Notepad.exe running as administrator, and open text file *C:\\Program Files\\Microsoft Integration Runtime\\5.0\\Shared\\diahost.exe.config*. You find the default tag for system.net as shown in the following code:

    ```
    <system.net>
        <defaultProxy useDefaultCredentials="true" />
    </system.net>
    ```

    You can then add proxy server details as shown in the following example:

    ```
    <system.net>
        <defaultProxy enabled="true">
            <proxy bypassonlocal="true" proxyaddress="http://proxy.domain.org:8888/" />
        </defaultProxy>
    </system.net>
    ```

    Additional properties are allowed inside the proxy tag to specify the required settings like scriptLocation. Refer to [proxy Element (Network Settings)](/dotnet/framework/configure-apps/file-schema/network/proxy-element-network-settings) on syntax.

    ```
    <proxy autoDetect="true|false|unspecified" bypassonlocal="true|false|unspecified" proxyaddress="uriString" scriptLocation="uriString" usesystemdefault="true|false|unspecified "/>
    ```
3. Save the configuration file into the original location, then restart the Data Management Gateway Host service, which picks up the changes. To restart the service: use services applet from the control panel, or from the **Data Management Gateway Configuration Manager** > click the **Stop Service** button, then click the **Start Service**. If the service does not start, it is likely that an incorrect XML tag syntax has been added into the application configuration file that was edited.

> [!IMPORTANT]
> Do not forget to update **both** diahost.exe.config and diawp.exe.config.

In addition to these points, you also need to make sure Microsoft Azure is in your company's allowed list. The list of valid Microsoft Azure IP addresses can be downloaded from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=41653).

#### Possible symptoms for firewall and proxy server-related issues
If you encounter errors similar to the following ones, it is likely due to improper configuration of the firewall or proxy server, which blocks gateway from connecting to Data Factory to authenticate itself. Refer to previous section to ensure your firewall and proxy server are properly configured.

1. When you try to register the gateway, you receive the following error: "Failed to register the gateway key. Before trying to register the gateway key again, confirm that the data management gateway is in a connected state and the Data Management Gateway Host Service is Started."
2. When you open Configuration Manager, you see status as "Disconnected" or "Connecting." When viewing Windows event logs, under "Event Viewer" > "Application and Services Logs" > "Data Management Gateway", you see error messages such as the following error:
   `Unable to connect to the remote server`
   `A component of Data Management Gateway has become unresponsive and restarts automatically. Component name: Gateway.`

### Open port 8050 for credential encryption
The **Setting Credentials** application uses the inbound port **8050** to relay credentials to the gateway when you set up an on-premises linked service in the Azure portal. During gateway setup, by default, the gateway installation opens it on the gateway machine.

If you are using a third-party firewall, you can manually open the port 8050. If you run into firewall issue during gateway setup, you can try using the following command to install the gateway without configuring the firewall.

```cmd
msiexec /q /i DataManagementGateway.msi NOFIREWALL=1
```

If you choose not to open the port 8050 on the gateway machine, use mechanisms other than using the **Setting Credentials** application to configure data store credentials. For example, you could use [New-AzDataFactoryEncryptValue](/powershell/module/az.datafactory/new-azdatafactoryencryptvalue) PowerShell cmdlet. See Setting Credentials and Security section on how data store credentials can be set.

## Update
By default, data management gateway is automatically updated when a newer version of the gateway is available. The gateway is not updated until all the scheduled tasks are done. No further tasks are processed by the gateway until the update operation is completed. If the update fails, gateway is rolled back to the old version.

You see the scheduled update time in the following places:

* The gateway properties page in the Azure portal.
* Home page of the Data Management Gateway Configuration Manager
* System tray notification message.

The Home tab of the Data Management Gateway Configuration Manager displays the update schedule and the last time the gateway was installed/updated.

:::image type="content" source="media/data-factory-data-management-gateway/UpdateSection.png" alt-text="Schedule updates":::

You can install the update right away or wait for the gateway to be automatically updated at the scheduled time. For example, the following image shows you the notification message shown in the Gateway Configuration Manager along with the Update button that you can click to install it immediately.

:::image type="content" source="./media/data-factory-data-management-gateway/gateway-auto-update-config-manager.png" alt-text="Update in DMG Configuration Manager":::

The notification message in the system tray would look as shown in the following image:

:::image type="content" source="./media/data-factory-data-management-gateway/gateway-auto-update-tray-message.png" alt-text="System Tray message":::

You see the status of update operation (manual or automatic) in the system tray. When you launch Gateway Configuration Manager next time, you see a message on the notification bar that the gateway has been updated along with a link to [what's new topic](data-factory-gateway-release-notes.md).

### To disable/enable auto-update feature
You can disable/enable the auto-update feature by doing the following steps:

[For single node gateway]

1. Launch Windows PowerShell on the gateway machine.
2. Switch to the *C:\\\\Program Files\\Microsoft Integration Runtime\\5.0\\PowerShellScript\\* folder.
3. Run the following command to turn the auto-update feature OFF (disable).

    ```powershell
    .\IntegrationRuntimeAutoUpdateToggle.ps1 -off
    ```

4. To turn it back on:

    ```powershell
    .\IntegrationRuntimeAutoUpdateToggle.ps1 -on
    ```
[For multi-node highly available and scalable gateway](data-factory-data-management-gateway-high-availability-scalability.md)

1. Launch Windows PowerShell on the gateway machine.

2. Switch to the *C:\\\\Program Files\\Microsoft Integration Runtime\\5.0\\PowerShellScript\\* folder.

3. Run the following command to turn the auto-update feature OFF (disable).

    For gateway with high availability feature, an extra AuthKey param is required.

    ```powershell
    .\IntegrationRuntimeAutoUpdateToggle.ps1 -off -AuthKey <your auth key>
    ```

4. To turn it back on:

    ```powershell
    .\IntegrationRuntimeAutoUpdateToggle.ps1 -on -AuthKey <your auth key>
    ```

## Configuration Manager

Once you install the gateway, you can launch Data Management Gateway Configuration Manager in one of the following ways:

1. In the **Search** window, type **Data Management Gateway** to access this utility.
2. Run the executable *ConfigManager.exe* in the folder: *C:\\Program Files\\Microsoft Integration Runtime\\5.0\\Shared\\*.

### Home page
The Home page allows you to do the following actions:

* View status of the gateway (connected to the cloud service etc.).
* **Register** using a key from the portal.
* **Stop** and start the **Integration Runtime service** on the gateway machine.
* **Schedule updates** at a specific time of the days.
* View the date when the gateway was **last updated**.

### Settings page
The Settings page allows you to do the following actions:

* View, change, and export **certificate** used by the gateway. This certificate is used to encrypt data source credentials.
* Change **HTTPS port** for the endpoint. The gateway opens a port for setting the data source credentials.
* **Status** of the endpoint
* View **SSL certificate** is used for TLS/SSL communication between portal and the gateway to set credentials for data sources.

### Remote access from intranet
You can enable/ disable any remote connectivity that today happens using port 8050 (see section above) while using PowerShell or Credential Manager application for encrypting credentials.

### Diagnostics page
The Diagnostics page allows you to do the following actions:

* Enable verbose **logging**, view logs in event viewer, and send logs to Microsoft if there was a failure.
* **Test connection** to a data source.

### Help page
The Help page displays the following information:

* Brief description of the gateway
* Version number
* Links to online help, privacy statement, and license agreement.

## Monitor gateway in the portal
In the Azure portal, you can view near-real time snapshot of resource utilization (CPU, memory, network(in/out), etc.) on a gateway machine.

1. In Azure portal, navigate to the home page for your data factory, and click **Linked services** tile.

    :::image type="content" source="./media/data-factory-data-management-gateway/monitor-data-factory-home-page.png" alt-text="Data factory home page":::
2. Select the **gateway** in the **Linked services** page.

    :::image type="content" source="./media/data-factory-data-management-gateway/monitor-linked-services-blade.png" alt-text="Linked services page":::
3. In the **Gateway** page, you can see the memory and CPU usage of the gateway.

    :::image type="content" source="./media/data-factory-data-management-gateway/gateway-simple-monitoring.png" alt-text="CPU and memory usage of gateway":::
4. Enable **Advanced settings** to see more details such as network usage.
    
    :::image type="content" source="./media/data-factory-data-management-gateway/gateway-advanced-monitoring.png" alt-text="Advanced monitoring of gateway":::

The following table provides descriptions of columns in the **Gateway Nodes** list:

Monitoring Property | Description
:------------------ | :----------
Name | Name of the logical gateway and nodes associated with the gateway. Node is an on-premises Windows machine that has the gateway installed on it. For information on having more than one node (up to four nodes) in a single logical gateway, see [Data Management Gateway - high availability and scalability](data-factory-data-management-gateway-high-availability-scalability.md).
Status | Status of the logical gateway and the gateway nodes. Example: Online/Offline/Limited/etc. For information about these statuses, See [Gateway status](#gateway-status) section.
Version | Shows the version of the logical gateway and each gateway node. The version of the logical gateway is determined based on version of majority of nodes in the group. If there are nodes with different versions in the logical gateway setup, only the nodes with the same version number as the logical gateway function properly. Others are in the limited mode and need to be manually updated (only in case auto-update fails).
Available memory | Available memory on a gateway node. This value is a near real-time snapshot.
CPU utilization | CPU utilization of a gateway node. This value is a near real-time snapshot.
Networking (In/Out) | Network utilization of a gateway node. This value is a near real-time snapshot.
Concurrent Jobs (Running/ Limit) | Number of jobs or tasks running on each node. This value is a near real-time snapshot. Limit signifies the maximum concurrent jobs for each node. This value is defined based on the machine size. You can increase the limit to scale up concurrent job execution in advanced scenarios, where CPU/memory/network is under-utilized, but activities are timing out. This capability is also available with a single-node gateway (even when the scalability and availability feature is not enabled).
Role | There are two types of roles in a multi-node gateway - Dispatcher and worker. All nodes are workers, which means they can all be used to execute jobs. There is only one dispatcher node, which is used to pull tasks/jobs from cloud services and dispatch them to different worker nodes (including itself).

In this page, you see some settings that make more sense when there are two or more nodes (scale out scenario) in the gateway. See [Data Management Gateway - high availability and scalability](data-factory-data-management-gateway-high-availability-scalability.md) for details about setting up a multi-node gateway.

### Gateway status
The following table provides possible statuses of a **gateway node**:

Status    | Comments/Scenarios
:------- | :------------------
Online | Node connected to Data Factory service.
Offline | Node is offline.
Upgrading | The node is being auto-updated.
Limited | Due to Connectivity issue. May be due to HTTP port 8050 issue, service bus connectivity issue, or credential sync issue.
Inactive | Node is in a configuration different from the configuration of other majority nodes.<br/><br/> A node can be inactive when it cannot connect to other nodes.

The following table provides possible statuses of a **logical gateway**. The gateway status depends on statuses of the gateway nodes.

Status | Comments
:----- | :-------
Needs Registration | No node is yet registered to this logical gateway
Online | Gateway Nodes are online
Offline | No node in online status.
Limited | Not all nodes in this gateway are in healthy state. This status is a warning that some node might be down! <br/><br/>Could be due to credential sync issue on dispatcher/worker node.

## Scale up gateway
You can configure the number of **concurrent data movement jobs** that can run on a node to scale up the capability of moving data between on-premises and cloud data stores.

When the available memory and CPU are not utilized well, but the idle capacity is 0, you should scale up by increasing the number of concurrent jobs that can run on a node. You may also want to scale up when activities are timing out because the gateway is overloaded. In the advanced settings of a gateway node, you can increase the maximum capacity for a node.

## Troubleshooting gateway issues
See [Troubleshooting gateway issues](data-factory-troubleshoot-gateway-issues.md) article for information/tips for troubleshooting issues with using the data management gateway.

## Move gateway from one machine to another
This section provides steps for moving gateway client from one machine to another machine.

1. In the portal, navigate to the **Data Factory home page**, and click the **Linked Services** tile.

    :::image type="content" source="./media/data-factory-data-management-gateway/DataGatewaysLink.png" alt-text="Data Gateways Link":::
2. Select your gateway in the **DATA GATEWAYS** section of the **Linked Services** page.

    :::image type="content" source="./media/data-factory-data-management-gateway/LinkedServiceBladeWithGateway.png" alt-text="Linked Services page with gateway selected":::
3. In the **Data gateway** page, click **Download and install data gateway**.

    :::image type="content" source="./media/data-factory-data-management-gateway/DownloadGatewayLink.png" alt-text="Download gateway link":::
4. In the **Configure** page, click **Download and install data gateway**, and follow instructions to install the data gateway on the machine.

    :::image type="content" source="./media/data-factory-data-management-gateway/ConfigureBlade.png" alt-text="Configure page":::
5. Keep the **Microsoft Data Management Gateway Configuration Manager** open.

    :::image type="content" source="./media/data-factory-data-management-gateway/ConfigurationManager.png" alt-text="Configuration Manager":::
6. In the **Configure** page in the portal, click **Recreate key** on the command bar, and click **Yes** for the warning message. Click **copy button** next to key text that copies the key to the clipboard. The gateway on the old machine stops functioning as soon you recreate the key.

    :::image type="content" source="./media/data-factory-data-management-gateway/RecreateKey.png" alt-text="Recreate key 2":::
7. Paste the **key** into text box in the **Register Gateway** page of the **Data Management Gateway Configuration Manager** on your machine. (optional) Click **Show gateway key** check box to see the key text.

    :::image type="content" source="./media/data-factory-data-management-gateway/CopyKeyAndRegister.png" alt-text="Copy key and Register":::
8. Click **Register** to register the gateway with the cloud service.
9. On the **Settings** tab, click **Change** to select the same certificate that was used with the old gateway, enter the **password**, and click **Finish**.

   :::image type="content" source="./media/data-factory-data-management-gateway/SpecifyCertificate.png" alt-text="Specify Certificate":::

   You can export a certificate from the old gateway by doing the following steps: launch Data Management Gateway Configuration Manager on the old machine, switch to the **Certificate** tab, click **Export** button and follow the instructions.
10. After successful registration of the gateway, you should see the **Registration** set to **Registered** and **Status** set to **Started** on the Home page of the Gateway Configuration Manager.

## Encrypting credentials
To encrypt credentials in the Data Factory Editor, do the following steps:

1. Launch web browser on the **gateway machine**, navigate to [Azure portal](https://portal.azure.com). Search for your data factory if needed, open data factory in the **DATA FACTORY** page and then click **Author & Deploy** to launch Data Factory Editor.
2. Click an existing **linked service** in the tree view to see its JSON definition or create a linked service that requires a data management gateway (for example: SQL Server or Oracle).
3. In the JSON editor, for the **gatewayName** property, enter the name of the gateway.
4. Enter server name for the **Data Source** property in the **connectionString**.
5. Enter database name for the **Initial Catalog** property in the **connectionString**.
6. Click **Encrypt** button on the command bar that launches the click-once **Credential Manager** application. You should see the **Setting Credentials** dialog box.

    :::image type="content" source="./media/data-factory-data-management-gateway/setting-credentials-dialog.png" alt-text="Setting credentials dialog":::
7. In the **Setting Credentials** dialog box, do the following steps:
   1. Select **authentication** that you want the Data Factory service to use to connect to the database.
   2. Enter name of the user who has access to the database for the **USERNAME** setting.
   3. Enter password for the user for the **PASSWORD** setting.
   4. Click **OK** to encrypt credentials and close the dialog box.
8. You should see a **encryptedCredential** property in the **connectionString** now.

    ```json
    {
        "name": "SqlServerLinkedService",
        "properties": {
            "type": "OnPremisesSqlServer",
            "description": "",
            "typeProperties": {
                "connectionString": "data source=myserver;initial catalog=mydatabase;Integrated Security=False;EncryptedCredential=eyJDb25uZWN0aW9uU3R",
                "gatewayName": "adftutorialgateway"
            }
        }
    }
    ```

    If you access the portal from a machine that is different from the gateway machine, you must make sure that the Credentials Manager application can connect to the gateway machine. If the application cannot reach the gateway machine, it does not allow you to set credentials for the data source and to test connection to the data source.

When you use the **Setting Credentials** application, the portal encrypts the credentials with the certificate specified in the **Certificate** tab of the **Gateway Configuration Manager** on the gateway machine.

If you are looking for an API-based approach for encrypting the credentials, you can use the [New-AzDataFactoryEncryptValue](/powershell/module/az.datafactory/new-azdatafactoryencryptvalue) PowerShell cmdlet to encrypt credentials. The cmdlet uses the certificate that gateway is configured to use to encrypt the credentials. You add encrypted credentials to the **EncryptedCredential** element of the **connectionString** in the JSON. You use the JSON with the [New-AzDataFactoryLinkedService](/powershell/module/az.datafactory/new-azdatafactorylinkedservice) cmdlet or in the Data Factory Editor.

```JSON
"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",
```

There is one more approach for setting credentials using Data Factory Editor. If you create a SQL Server linked service by using the editor and you enter credentials in plain text, the credentials are encrypted using a certificate that the Data Factory service owns. It does NOT use the certificate that gateway is configured to use. While this approach might be a little faster in some cases, it is less secure. Therefore, we recommend that you follow this approach only for development/testing purposes.

## PowerShell cmdlets
This section describes how to create and register a gateway using Azure PowerShell cmdlets.

1. Launch **Azure PowerShell** in administrator mode.
2. Log in to your Azure account by running the following command and entering your Azure credentials.

    ```powershell
    Connect-AzAccount
    ```
3. Use the **New-AzDataFactoryGateway** cmdlet to create a logical gateway as follows:

    ```powershell
    $MyDMG = New-AzDataFactoryGateway -Name <gatewayName> -DataFactoryName <dataFactoryName> -ResourceGroupName ADF -Description <desc>
    ```
    **Example command and output**:

    ```
    PS C:\> $MyDMG = New-AzDataFactoryGateway -Name MyGateway -DataFactoryName $df -ResourceGroupName ADF -Description "gateway for walkthrough"

    Name              : MyGateway
    Description       : gateway for walkthrough
    Version           :
    Status            : NeedRegistration
    VersionStatus     : None
    CreateTime        : 9/28/2014 10:58:22
    RegisterTime      :
    LastConnectTime   :
    ExpiryTime        :
    ProvisioningState : Succeeded
    Key               : ADF#00000000-0000-4fb8-a867-947877aef6cb@fda06d87-f446-43b1-9485-78af26b8bab0@4707262b-dc25-4fe5-881c-c8a7c3c569fe@wu#nfU4aBlq/heRyYFZ2Xt/CD+7i73PEO521Sj2AFOCmiI
    ```

1. In Azure PowerShell, switch to the folder: *C:\\\\Program Files\\Microsoft Integration Runtime\\5.0\\PowerShellScript\\*. Run *RegisterGateway.ps1* associated with the local variable **$Key** as shown in the following command. This script registers the client agent installed on your machine with the logical gateway you create earlier.

    ```powershell
    PS C:\> .\RegisterGateway.ps1 $MyDMG.Key
    ```
    ```
    Agent registration is successful!
    ```
    You can register the gateway on a remote machine by using the IsRegisterOnRemoteMachine parameter. Example:

    ```powershell
    .\RegisterGateway.ps1 $MyDMG.Key -IsRegisterOnRemoteMachine true
    ```
2. You can use the **Get-AzDataFactoryGateway** cmdlet to get the list of Gateways in your data factory. When the **Status** shows **online**, it means your gateway is ready to use.

    ```powershell
    Get-AzDataFactoryGateway -DataFactoryName <dataFactoryName> -ResourceGroupName ADF
    ```

    You can remove a gateway using the **Remove-AzDataFactoryGateway** cmdlet and update description for a gateway using the **Set-AzDataFactoryGateway** cmdlets. For syntax and other details about these cmdlets, see Data Factory Cmdlet Reference.  

### List gateways using PowerShell

```powershell
Get-AzDataFactoryGateway -DataFactoryName jasoncopyusingstoredprocedure -ResourceGroupName ADF_ResourceGroup
```

### Remove gateway using PowerShell

```powershell
Remove-AzDataFactoryGateway -Name JasonHDMG_byPSRemote -ResourceGroupName ADF_ResourceGroup -DataFactoryName jasoncopyusingstoredprocedure -Force
```

## Next steps
* See [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md) article. In the walkthrough, you create a pipeline that uses the gateway to move data from a SQL Server database to an Azure blob.
