---
title: Create self-hosted integration runtime in Azure Data Factory | Microsoft Docs
description: Learn how to create self-hosted integration runtime in Azure Data Factory, which allows data factories to access data stores in a private network.
services: data-factory
documentationcenter: ''
author: nabhishek
manager: craigg


ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/15/2018
ms.author: abnarain

---
# How to create and configure Self-hosted Integration Runtime
The Integration Runtime (IR) is the compute infrastructure used by Azure Data Factory to provide data integration capabilities across different network environments. For details about IR, see [Integration Runtime Overview](concepts-integration-runtime.md).

A self-hosted integration runtime is capable of running copy activities between a cloud data stores and a data store in private network and dispatching transform activities against compute resources in an on-premises or Azure Virtual Network. Install Self-hosted integration runtime needs on an on-premises machine or a virtual machine inside a private network.  

This document introduces how you can create and configure Self-hosted IR.

## High-level steps to install self-hosted IR
1. Create a Self-hosted integration runtime. You can use ADF UI for creating the self-hosted IR. Here is a PowerShell example:

	```powershell
	Set-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntimeName -Type SelfHosted -Description "selfhosted IR description"
	```
2. Download and install self-hosted integration runtime (on local machine).
3. Retrieve authentication key and register self-hosted integration runtime with the key. Here is a PowerShell example:

	```powershell
	Get-AzureRmDataFactoryV2IntegrationRuntimeKey -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntime.  
	```

## Setting up self-hosted IR on Azure VM using Azure Resource Manager Template (automation)
You can automate self-hosted IR setup on an Azure VM using [this Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vms-with-selfhost-integration-runtime). This provides an easy way to have a fully functioning Self-hosted IR inside Azure VNet with High Avalaibility and Scalability feature (as long as you set node count to be 2 or higher).

## Command flow and data flow
When you move the data between on-premises and cloud, the activity uses a self-hosted integration runtime to transfer the data from on-premises data source to cloud and vice versa.

Here is a high-level data flow for the summary of steps for copy with self-hosted IR:

![High-level overview](media\create-self-hosted-integration-runtime\high-level-overview.png)

1. Data developer creates a self-hosted integration runtime within an Azure data factory using a PowerShell cmdlet. Currently, the Azure portal does not support this feature.
2. Data developer creates a linked service for an on-premises data store by specifying the self-hosted integration runtime instance that it should use to connect to data stores. As part of setting up the linked service, data developer uses the ‘Credential Manager’ application (currently, not supported) for setting authentication types and credentials. The Credential manager application dialog communicates with the data store to test connection and the self-hosted integration runtime to save credentials.
   - Self-hosted integration runtime node encrypts the credential using Windows Data Protection Application Programming Interface (DPAPI) and saves it locally. If multiple nodes are set for high availability, the credentials are further synchronized across other nodes. Each node encrypts it using DPAPI and stores it locally. Credential synchronization is transparent to the data developer and is handled by self-hosted IR.    
   - Data Factory service communicates with the self-hosted integration runtime for scheduling & management of jobs via **control channel** that uses a shared Azure service bus queue. When an activity job needs to be run, Data Factory queues the request along with any credential information (in case credentials are not already stored on the self-hosted integration runtime). Self-hosted integration runtime kicks off the job after polling the queue.
   - Self-hosted integration runtime copies data from an on-premises store to a cloud storage, or vice versa depending on how the copy activity is configured in the data pipeline. For this step, the self-hosted integration runtime directly communicates with cloud-based storage services such as Azure Blob Storage over a secure (HTTPS) channel.

## Considerations for using self-hosted IR

- A single self-hosted integration runtime can be used for multiple on-premises data sources. However, a **single self-hosted integration runtime is tied to only one Azure data factory** and cannot be shared with another data factory.
- You can have **only one instance of self-hosted integration runtime** installed on a single machine. Suppose, you have two data factories that need to access on-premises data sources, you need to install self-hosted integration runtime on two on-premises computers. In other words, a self-hosted integration runtime is tied to a specific data factory
- The **self-hosted integration runtime does not need to be on the same machine as the data source**. However, having self-hosted integration runtime closer to the data source reduces the time for the self-hosted integration runtime to connect to the data source. We recommend that you install the self-hosted integration runtime on a machine that is different from the one that hosts on-premises data source. When the self-hosted integration runtime and data source are on different machines, the self-hosted integration runtime does not compete for resources with data source.
- You can have **multiple self-hosted integration runtimes on different machines connecting to the same on-premises data source**. For example, you may have two self-hosted integration runtime serving two data factories but the same on-premises data source is registered with both the data factories.
- If you already have a gateway installed on your computer serving a **Power BI** scenario, install a **separate self-hosted integration runtime for Azure Data Factory** on another machine.
- Self-hosted integration runtime must be used for supporting data integration within Azure Virtual Network.
- Treat your data source as an on-premises data source (that is behind a firewall) even when you use **ExpressRoute**. Use the self-hosted integration runtime to establish connectivity between the service and the data source.
- You must use the self-hosted integration runtime even if the data store is in the cloud on an **Azure IaaS virtual machine**.
- Tasks may fail in a Self-hosted Integration Runtime installed on a Windows Server on which FIPS-compliant encryption is enabled. To work around this issue, disable FIPS-compliant encryption on the server. To disable FIPS-compliant encryption, change the following registry value from 1 (enabled) to 0 (disabled): `HKLM\System\CurrentControlSet\Control\Lsa\FIPSAlgorithmPolicy\Enabled`.

## Prerequisites

- The supported **Operating System** versions are Windows 7 Service Pack 1, Windows 8.1, Windows 10, Windows Server 2008 R2 SP1, Windows Server 2012, Windows Server 2012 R2, Windows Server 2016. Installation of the self-hosted integration runtime on a **domain controller is not supported**.
- **.NET Framework 4.6.1 or above** is required. If you are installing self-hosted integration runtime on a Windows 7 machine, install .NET Framework 4.6.1 or later. See [.NET Framework System Requirements](/dotnet/framework/get-started/system-requirements) for details.
- The recommended **configuration** for the self-hosted integration runtime machine is at least 2 GHz, 4 cores, 8-GB RAM, and 80-GB disk.
- If the host machine hibernates, the self-hosted integration runtime does not respond to data requests. Therefore, configure an appropriate power plan on the computer before installing the self-hosted integration runtime. If the machine is configured to hibernate, the self-hosted integration runtime installation prompts a message.
- You must be an administrator on the machine to install and configure the self-hosted integration runtime successfully.
- As copy activity runs happen on a specific frequency, the resource usage (CPU, memory) on the machine also follows the same pattern with peak and idle times. Resource utilization also depends heavily on the amount of data being moved. When multiple copy jobs are in progress, you see resource usage go up during peak times.

## Installation best practices
Self-hosted integration runtime can be installed by downloading an MSI setup package from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=39717). See [Move data between on-premises and cloud article](tutorial-hybrid-copy-powershell.md) for step-by-step instructions.

- Configure power plan on the host machine for the self-hosted integration runtime so that the machine does not hibernate. If the host machine hibernates, the self-hosted integration runtime turns offline.
- Back up the credentials associated with the self-hosted integration runtime regularly.

## Install and Register Self-hosted IR from download center

1. Navigate to [Microsoft Integration Runtime download page](https://www.microsoft.com/download/details.aspx?id=39717).
2. Click **Download**, select the appropriate version (**32-bit** vs. **64-bit**), and click **Next**.
3. Run the **MSI** directly or save it to your hard disk and run.
4. On the **Welcome** page, select a **language** click **Next**.
5. **Accept** the End-User License Agreement and click **Next**.
6. Select **folder** to install the self-hosted integration runtime and click **Next**.
7. On the **Ready to install** page, click **Install**.
8. Click **Finish** to complete installation.
9. Get the Authentication key using Azure PowerShell. PowerShell example for retrieving authentication key:

	```powershell
	Get-AzureRmDataFactoryV2IntegrationRuntimeKey -ResourceGroupName $resouceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntime
	```
11. On the **Register Integration Runtime (Self-hosted)** page of Microsoft Integration Runtime Configuration Manager running on your machine, do the following steps:
	1. Paste the **authentication key** in the text area.
	2. Optionally, click **Show authentication key** to see the key text.
	3. Click **Register**.


## High Availability and Scalability
A Self-hosted Integration Runtime can be associated to multiple on-premises machines. These machines are called nodes. You can have up to four nodes associated with a Self-hosted Integration Runtime. The benefits of having multiple nodes (on-premises machines with gateway installed) for a logical gateway are:
1. Higher availability of Self-hosted Integration Runtime so that it is no longer the single point of failure in your Big Data	solution or cloud data integration with Azure Data Factory, ensuring continuity with up to 4 nodes.
2. Improved performance and throughput during data movement between on-premises and cloud data stores. Get more information on [performance comparisons](copy-activity-performance.md).

You can associate multiple nodes by simply installing the Self-hosted Integration Runtime software from the [download center](https://www.microsoft.com/download/details.aspx?id=39717) and by registering it by either of the Authentication Keys obtained from New-AzureRmDataFactoryV2IntegrationRuntimeKey cmdlet as described in the [Tutorial](tutorial-hybrid-copy-powershell.md)

> [!NOTE]
> You do not need to create new Self-hosted Integration Runtime for associating each node. You can install the self-hosted integration runtime on another machine and register it using the same Authentication Key. 

> [!NOTE]
> Before adding another node for **High Availability and Scalability**, please ensure **'Remote access to intranet'** option is **enabled** on the 1st node (Microsoft Integration Runtime Configuration Manager -> Settings -> Remote access to intranet). 

### Scale considerations

#### Scale out

When the **available memory on the self-hosted IR is low** and the **CPU usage is high**, adding a new node helps scale out the load across machines. If activities are failing due to time-out or self-hosted IR node being offline, it helps if you add a node to the gateway.

#### Scale up

When the available memory and CPU are not utilized well, but the concurrent jobs execution is reaching the limit, you should scale up by increasing the number of concurrent jobs that can run on a node. You may also want to scale up when activities are timing out because the self-hosted IR is overloaded. As shown in the following image, you can increase the maximum capacity for a node.  

![](media\create-self-hosted-integration-runtime\scale-up-self-hosted-IR.png)

### TLS/SSL certificate requirements

Here are the requirements for the TLS/SSL certificate that is used for securing communications between integration runtime nodes:

- The certificate must be a publicly trusted X509 v3 certificate. We recommend that you use certificates that are issued by a public (third-party) certification authority (CA).
- Each integration runtime node must trust this certificate.
- SAN certificates are not recommended since only the last item of the Subject Alternative Names will be used and all others will be ignored due to current limitation. E.g. you have a SAN certificate whose SAN are **node1.domain.contoso.com** and **node2.domain.contoso.com**, you can only use this cert on machine whose FQDN is **node2.domain.contoso.com**.
- Supports any key size supported by Windows Server 2012 R2 for SSL certificates.
- Certificate using CNG keys are not supported.  

## Sharing the self-hosted Integration Runtime (IR) with multiple data factories

You can reuse an existing self-hosted integration runtime infrastructure that you may already have setup in a data factory. This allows you to create a **linked self-hosted integration runtime** in a different data factory by referencing an already existing self-hosted IR (Shared).

#### **Terminologies**

- **Shared IR** – The original self-hosted IR which is running on a physical infrastructure.  
- **Linked IR** – The IR which references another Shared IR. This is a logical IR and uses the infrastructure of another self-hosted IR (shared).

#### High level steps for creating a Linked self-hosted IR

In the self-hosted IR to be shared,

1. Grant permission to the Data Factory in which you would like to create the Linked IR. 

   ![](media\create-self-hosted-integration-runtime\grant-permissions-IR-sharing.png)

   ![](media\create-self-hosted-integration-runtime\3_rbac_permissions.png)

2. Note the **Resource ID** of the self-hosted IR to be shared.

   ![](media\create-self-hosted-integration-runtime\4_ResourceID_self-hostedIR.png)

In the Data Factory to which the permissions were granted,

3. Create a new Self-hosted IR (linked) and enter the above **Resource ID**

   ![](media\create-self-hosted-integration-runtime\6_create-linkedIR_2.png)

   ![](media\create-self-hosted-integration-runtime\6_create-linkedIR_3.png)

#### Monitoring 

- **Shared IR**

  ![](media\create-self-hosted-integration-runtime\Contoso-shared-IR.png)

  ![](media\create-self-hosted-integration-runtime\contoso-shared-ir-monitoring.png)

- **Linked IR**

  ![](media\create-self-hosted-integration-runtime\Contoso-linked-ir.png)

  ![](media\create-self-hosted-integration-runtime\Contoso-linked-ir-monitoring.png)

#### Known limitations of self-hosted IR sharing

1. Default number of linked IR that can be created under single self-hosted IR is **20**. If you require more then contact Support. 

2. The data factory in which linked IR is to be created must have an MSI ([managed service identity](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview)). By default, the data factories created in Ibiza portal or PowerShell cmdlets will have MSI 
  created implicitly. However, in some cases when data factory is created using an Azure Resorce Manager template or SDK, the “**Identity**” **property must be set** explicitly to ensure Azure Resorce Manager creates a data factory containing an MSI. 

3. The self-hosted IR version must be equal or greater than 3.8.xxxx.xx. Please [download the latest version](https://www.microsoft.com/download/details.aspx?id=39717) of self-hosted IR

4. The data factory in which linked IR is to be created must have an MSI ([managed service identity](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview)). By default,
the data factories created in Ibiza portal or PowerShell cmdlets will have MSI ([managed service identity](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview)).
created implicitly, however, data factories created with Azure Resource Manager (ARM) template or SDK requires “Identity” property to be set to ensure an MSI is created.

5. The ADF .Net SDK which support this feature is version >= 1.1.0

6. The Azure PowerShell which support this feature is version >= 6.6.0
(AzureRM.DataFactoryV2 >= 0.5.7)

7. To Grant permission, the user will require "Owner" role or inherited "Owner" role in the Data Factory where the Shared IR exists. 

  > [!NOTE]
  > This feature is only available in Azure Data Factory version 2 

## System tray icons/ notifications

If you move cursor over the system tray icon/notification message, you can find details about the state of the self-hosted integration runtime.

![System tray notifications](media\create-self-hosted-integration-runtime\system-tray-notifications.png)

## Ports and firewall
There are two firewalls you need to consider: **corporate firewall** running on the central router of the organization, and **Windows firewall** configured as a daemon on the local machine where the self-hosted integration runtime is installed.

![Firewall](media\create-self-hosted-integration-runtime\firewall.png)

At **corporate firewall** level, you need configure the following domains and outbound ports:

Domain names | Ports | Description
------------ | ----- | ------------
*.servicebus.windows.net | 443 | Used for communication with Data Movement Service backend
*.core.windows.net | 443 | Used for Staged copy using Azure Blob (if configured)
*.frontend.clouddatahub.net | 443 | Used for communication with Data Movement Service backend
download.microsoft.com | 443 | Used for downloading the updates

At **Windows firewall** level (machine level), these outbound ports are normally enabled. If not, you can configure the domains and ports accordingly on self-hosted integration runtime machine.

> [!NOTE]
> Based on your source/ sinks, you may have to whitelist additional domains and outbound ports in your corporate/Windows firewall.
>
> For some Cloud Databases (For example: Azure SQL Database, Azure Data Lake, etc.), you may need to whitelist IP address of self-hosted integration runtime machine on their firewall configuration.

### Copy data from a source to a sink
Ensure that the firewall rules are enabled properly on the corporate firewall, Windows firewall on the self-hosted integration runtime machine, and the data store itself. Enabling these rules allows the self-hosted integration runtime to connect to both source and sink successfully. Enable rules for each data store that is involved in the copy operation.

For example, to copy from an **on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink**, do the following steps:

- Allow outbound **TCP** communication on port **1433** for both Windows firewall and corporate firewall.
- Configure the firewall settings of Azure SQL server to add the IP address of the self-hosted integration runtime machine to the list of allowed IP addresses.

> [!NOTE]
> If your firewall does not allow outbound port 1433, self-hosted integration runtime can't access Azure SQL directly. In this case, you may use [Staged Copy](copy-activity-performance.md) to SQL Azure Database/ SQL Azure DW. In this scenario, you would only require HTTPS (port 443) for the data movement.


## Proxy server considerations
If your corporate network environment uses a proxy server to access the internet, configure self-hosted integration runtime to use appropriate proxy settings. You can set the proxy during the initial registration phase.

![Specify proxy](media\create-self-hosted-integration-runtime\specify-proxy.png)

Self-hosted integration runtime uses the proxy server to connect to the cloud service. Click Change link during initial setup. You see the proxy setting dialog.

![Set proxy](media\create-self-hosted-integration-runtime\set-http-proxy.png)

There are three configuration options:

- **Do not use proxy**: Self-hosted integration runtime does not explicitly use any proxy to connect to cloud services.
- **Use system proxy**: Self-hosted integration runtime uses the proxy setting that is configured in diahost.exe.config and diawp.exe.config. If no proxy is configured in diahost.exe.config and diawp.exe.config, self-hosted integration runtime connects to cloud service directly without going through proxy.
- **Use custom proxy**: Configure the HTTP proxy setting to use for self-hosted integration runtime, instead of using configurations in diahost.exe.config and diawp.exe.config. Address and Port are required. User Name and Password are optional depending on your proxy’s authentication setting. All settings are encrypted with Windows DPAPI on the self-hosted integration runtime and stored locally on the machine.

The integration runtime Host Service restarts automatically after you save the updated proxy settings.

After self-hosted integration runtime has been successfully registered, if you want to view or update proxy settings, use Integration Runtime Configuration Manager.

1. Launch **Microsoft Integration Runtime Configuration Manager**.
   - Switch to the **Settings** tab.
   - Click **Change** link in **HTTP Proxy** section to launch the **Set HTTP Proxy** dialog.
   - After you click the **Next** button, you see a warning dialog asking for your permission to save the proxy setting and restart the Integration Runtime Host Service.

You can view and update HTTP proxy by using Configuration Manager tool.

![View proxy](media\create-self-hosted-integration-runtime\view-proxy.png)

> [!NOTE]
> If you set up a proxy server with NTLM authentication, Integration runtime Host Service runs under the domain account. If you change the password for the domain account later, remember to update configuration settings for the service and restart it accordingly. Due to this requirement, we suggest you use a dedicated domain account to access the proxy server that does not require you to update the password frequently.

### Configure proxy server settings

If you select **Use system proxy** setting for the HTTP proxy, self-hosted integration runtime uses the proxy setting in diahost.exe.config and diawp.exe.config. If no proxy is specified in diahost.exe.config and diawp.exe.config, self-hosted integration runtime connects to cloud service directly without going through proxy. The following procedure provides instructions for updating the diahost.exe.config file.

1. In File Explorer, make a safe copy of C:\Program Files\Microsoft Integration Runtime\3.0\Shared\diahost.exe.config to back up the original file.
2. Launch Notepad.exe running as administrator, and open text file “C:\Program Files\Microsoft Integration Runtime\3.0\Shared\diahost.exe.config. You find the default tag for system.net as shown in the following code:

	```xml
	<system.net>
		<defaultProxy useDefaultCredentials="true" />
	</system.net>
	```
	You can then add proxy server details as shown in the following example:

	```xml
	<system.net>
        <defaultProxy enabled="true">
              <proxy bypassonlocal="true" proxyaddress="http://proxy.domain.org:8888/" />
        </defaultProxy>
	</system.net>
	```

	Additional properties are allowed inside the proxy tag to specify the required settings like scriptLocation. See [proxy Element (Network Settings)](https://msdn.microsoft.com/library/sa91de1e.aspx) for syntax.

	```xml
	<proxy autoDetect="true|false|unspecified" bypassonlocal="true|false|unspecified" proxyaddress="uriString" scriptLocation="uriString" usesystemdefault="true|false|unspecified "/>
	```
3. Save the configuration file into the original location, then restart the Self-hosted Integration Runtime Host service, which picks up the changes. To restart the service: use services applet from the control panel, or from the **Integration Runtime Configuration Manager** > click the **Stop Service** button, then click the **Start Service**. If the service does not start, it is likely that an incorrect XML tag syntax has been added into the application configuration file that was edited.

> [!IMPORTANT]
> Do not forget to update both diahost.exe.config and diawp.exe.config.

In addition to these points, you also need to make sure Microsoft Azure is in your company’s whitelist. The list of valid Microsoft Azure IP addresses can be downloaded from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=41653).

### Possible symptoms for firewall and proxy server-related issues
If you encounter errors similar to the following ones, it is likely due to improper configuration of the firewall or proxy server, which blocks self-hosted integration runtime from connecting to Data Factory to authenticate itself. Refer to previous section to ensure your firewall and proxy server are properly configured.

1. When you try to register the self-hosted integration runtime, you receive the following error: "Failed to register this Integration Runtime node! Confirm that the Authentication key is valid and the Integration Service Host Service is running on this machine. "
   - When you open Integration Runtime Configuration Manager, you see status as “**Disconnected**” or “**Connecting**”. When viewing Windows event logs, under “Event Viewer” > “Application and Services Logs” > “Microsoft Integration Runtime”, you see error messages such as the following error:

	```
	Unable to connect to the remote server
	A component of Integration Runtime has become unresponsive and restarts automatically. Component name: Integration Runtime (Self-hosted).
	```

### Enable Remote Access from Intranet  
In case if you use **PowerShell** or **Credential Manager application**  to encrypt credentials from another machine (in the network) other than where the self-hosted integration runtime is installed, then you would require the **'Remote Access from Intranet'** option to be enabled. 
If you run the **PowerShell** or **Credential Manager application**  to encrypt credential on the same machine where the self-hosted integration runtime is installed, then **'Remote Access from Intranet'** may not be enabled.

Remote Access from Intranet should be **enabled** before adding another node for **High Availability and Scalability**.  

During self-hosted integration runtime setup (v 3.3.xxxx.x onwards), by default, the self-hosted integration runtime installation disables the **'Remote Access from Intranet'** on the self-hosted integration runtime machine.

If you are using a third-party firewall, you can manually open the port 8060 (or the user configured port). If you run into firewall issue during self-hosted integration runtime setup, you can try using the following command to install the self-hosted integration runtime without configuring the firewall.

```
msiexec /q /i IntegrationRuntime.msi NOFIREWALL=1
```
> [!NOTE]
> **Credential Manager Application** is not yet available for encrypting credentials in ADFv2. We will add this support later.  

If you choose not to open the port 8060 on the self-hosted integration runtime machine, use mechanisms other than using the **Setting Credentials **application to configure data store credentials. For example, you could use New-AzureRmDataFactoryV2LinkedServiceEncryptCredential PowerShell cmdlet. See Setting Credentials and Security section on how data store credentials can be set.


## Next steps
See the following tutorial for step-by-step instructions: [Tutorial: copy on-premises data to cloud](tutorial-hybrid-copy-powershell.md).
