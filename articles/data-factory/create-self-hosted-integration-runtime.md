---
title: Create a self-hosted integration runtime in Azure Data Factory | Microsoft Docs
description: Learn how to create a self-hosted integration runtime in Azure Data Factory, which allows data factories to access data stores in a private network.
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
# Create and configure a self-hosted integration runtime
The integration runtime (IR) is the compute infrastructure that Azure Data Factory uses to provide data-integration capabilities across different network environments. For details about IR, see [Integration runtime overview](concepts-integration-runtime.md).

A self-hosted integration runtime can run copy activities between a cloud data store and a data store in a private network, and it can dispatch transform activities against compute resources in an on-premises network or an Azure virtual network. The installation of a self-hosted integration runtime needs on an on-premises machine or a virtual machine (VM) inside a private network.  

This document describes how you can create and configure a self-hosted IR.

## High-level steps to install a self-hosted IR
1. Create a self-hosted integration runtime. You can use the Azure Data Factory UI for this task. Here is a PowerShell example:

	```powershell
	Set-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntimeName -Type SelfHosted -Description "selfhosted IR description"
	```
  
2. [Download](https://www.microsoft.com/download/details.aspx?id=39717) and install the self-hosted integration runtime on a local machine.

3. Retrieve the authentication key and register the self-hosted integration runtime with the key. Here is a PowerShell example:

	```powershell
	Get-AzureRmDataFactoryV2IntegrationRuntimeKey -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntime.  
	```

## Setting up a self-hosted IR on an Azure VM by using an Azure Resource Manager template (automation)
You can automate self-hosted IR setup on an Azure virtual machine by using [this Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vms-with-selfhost-integration-runtime). This template provides an easy way to have a fully functioning self-hosted IR inside an Azure virtual network with high-availability and scalability features (as long as you set the node count to 2 or higher).

## Command flow and data flow
When you move data between on-premises and the cloud, the activity uses a self-hosted integration runtime to transfer the data from an on-premises data source to the cloud and vice versa.

Here is a high-level data flow for the summary of steps for copying with a self-hosted IR:

![High-level overview](media\create-self-hosted-integration-runtime\high-level-overview.png)

1. The data developer creates a self-hosted integration runtime within an Azure data factory by using a PowerShell cmdlet. Currently, the Azure portal does not support this feature.
2. The data developer creates a linked service for an on-premises data store by specifying the self-hosted integration runtime instance that it should use to connect to data stores. As part of setting up the linked service, the data developer uses the Credential Manager application (currently not supported) for setting authentication types and credentials. The Credential Manager application communicates with the data store to test the connection and the self-hosted integration runtime to save credentials.
3. The self-hosted integration runtime node encrypts the credentials by using Windows Data Protection Application Programming Interface (DPAPI) and saves the credentials locally. If multiple nodes are set for high availability, the credentials are further synchronized across other nodes. Each node encrypts the credentials by using DPAPI and stores them locally. Credential synchronization is transparent to the data developer and is handled by the self-hosted IR.    
4. The Data Factory service communicates with the self-hosted integration runtime for scheduling and management of jobs via a *control channel* that uses a shared Azure Service Bus queue. When an activity job needs to be run, Data Factory queues the request along with any credential information (in case credentials are not already stored on the self-hosted integration runtime). The self-hosted integration runtime kicks off the job after polling the queue.
5. The self-hosted integration runtime copies data from an on-premises store to a cloud storage, or vice versa depending on how the copy activity is configured in the data pipeline. For this step, the self-hosted integration runtime directly communicates with cloud-based storage services such as Azure Blob storage over a secure (HTTPS) channel.

## Considerations for using a self-hosted IR

- A single self-hosted integration runtime can be used for multiple on-premises data sources. A single self-hosted integration runtime  can be shared with another data factory within the same Azure Active Directory tenant. For more information, see [Sharing a self-hosted integration runtime](#sharing-the-self-hosted-integration-runtime-with-multiple-data-factories).
- You can have only one instance of a self-hosted integration runtime installed on a single machine. If you have two data factories that need to access on-premises data sources, you need to install the self-hosted integration runtime on two on-premises computers. In other words, a self-hosted integration runtime is tied to a specific data factory.
- The self-hosted integration runtime does not need to be on the same machine as the data source. However, having the self-hosted integration runtime closer to the data source reduces the time for the self-hosted integration runtime to connect to the data source. We recommend that you install the self-hosted integration runtime on a machine that is different from the one that hosts on-premises data source. When the self-hosted integration runtime and data source are on different machines, the self-hosted integration runtime does not compete for resources with the data source.
- You can have multiple self-hosted integration runtimes on different machines that connect to the same on-premises data source. For example, you might have two self-hosted integration runtimes that serve two data factories, but the same on-premises data source is registered with both the data factories.
- If you already have a gateway installed on your computer to serve a Power BI scenario, install a separate self-hosted integration runtime for Azure Data Factory on another machine.
- The self-hosted integration runtime must be used for supporting data integration within an Azure virtual network.
- Treat your data source as an on-premises data source that is behind a firewall, even when you use Azure ExpressRoute. Use the self-hosted integration runtime to establish connectivity between the service and the data source.
- You must use the self-hosted integration runtime even if the data store is in the cloud on an Azure IaaS virtual machine.
- Tasks might fail in a self-hosted integration runtime that's installed on a Windows server on which FIPS-compliant encryption is enabled. To work around this problem, disable FIPS-compliant encryption on the server. To disable FIPS-compliant encryption, change the following registry value from 1 (enabled) to 0 (disabled): `HKLM\System\CurrentControlSet\Control\Lsa\FIPSAlgorithmPolicy\Enabled`.

## Prerequisites

- The supported operating system versions are Windows 7 Service Pack 1, Windows 8.1, Windows 10, Windows Server 2008 R2 SP1, Windows Server 2012, Windows Server 2012 R2, and Windows Server 2016. Installation of the self-hosted integration runtime on a domain controller is not supported.
- .NET Framework 4.6.1 or later is required. If you're installing the self-hosted integration runtime on a Windows 7 machine, install .NET Framework 4.6.1 or later. See [.NET Framework System Requirements](/dotnet/framework/get-started/system-requirements) for details.
- The recommended configuration for the self-hosted integration runtime machine is at least 2 GHz, four cores, 8 GB of RAM, and an 80-GB disk.
- If the host machine hibernates, the self-hosted integration runtime does not respond to data requests. Configure an appropriate power plan on the computer before you install the self-hosted integration runtime. If the machine is configured to hibernate, the self-hosted integration runtime installation prompts a message.
- You must be an administrator on the machine to install and configure the self-hosted integration runtime successfully.
- Copy activity runs happen on a specific frequency. Resource usage (CPU, memory) on the machine follows the same pattern with peak and idle times. Resource utilization also depends heavily on the amount of data being moved. When multiple copy jobs are in progress, you see resource usage go up during peak times.

## Installation best practices
You can install the self-hosted integration runtime by downloading an MSI setup package from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=39717). See [Move data between on-premises and cloud article](tutorial-hybrid-copy-powershell.md) for step-by-step instructions.

- Configure a power plan on the host machine for the self-hosted integration runtime so that the machine does not hibernate. If the host machine hibernates, the self-hosted integration runtime goes offline.
- Back up the credentials associated with the self-hosted integration runtime regularly.

## Install and register self-hosted IR from the Download Center

1. Go to the [Microsoft integration runtime download page](https://www.microsoft.com/download/details.aspx?id=39717).
2. Select **Download**, select the appropriate version (**32-bit** or **64-bit**), and select **Next**.
3. Run the MSI file directly, or save it to your hard disk and run it.
4. On the **Welcome** page, select a language and select **Next**.
5. Accept the Microsoft Software License Terms and select **Next**.
6. Select **folder** to install the self-hosted integration runtime, and select **Next**.
7. On the **Ready to install** page, select **Install**.
8. Click **Finish** to complete installation.
9. Get the authentication key by using Azure PowerShell. Here's a PowerShell example for retrieving the authentication key:

	```powershell
	Get-AzureRmDataFactoryV2IntegrationRuntimeKey -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $selfHostedIntegrationRuntime
	```
11. On the **Register Integration Runtime (Self-hosted)** page of Microsoft Integration Runtime Configuration Manager running on your machine, take the following steps:

	a. Paste the authentication key in the text area.

	b. Optionally, select **Show authentication key** to see the key text.

	c. Select **Register**.


## High availability and scalability
A self-hosted integration runtime can be associated with multiple on-premises machines. These machines are called nodes. You can have up to four nodes associated with a self-hosted integration runtime. The benefits of having multiple nodes (on-premises machines with a gateway installed) for a logical gateway are:
* Higher availability of the self-hosted integration runtime so that it's no longer the single point of failure in your big data	solution or cloud data integration with Azure Data Factory, ensuring continuity with up to four nodes.
* Improved performance and throughput during data movement between on-premises and cloud data stores. Get more information on [performance comparisons](copy-activity-performance.md).

You can associate multiple nodes by installing the self-hosted integration runtime software from the [Download Center](https://www.microsoft.com/download/details.aspx?id=39717). Then, register it by using either of the authentication keys obtained from the **New-AzureRmDataFactoryV2IntegrationRuntimeKey** cmdlet, as described in the [tutorial](tutorial-hybrid-copy-powershell.md).

> [!NOTE]
> You don't need to create new self-hosted integration runtime for associating each node. You can install the self-hosted integration runtime on another machine and register it by using the same authentication key. 

> [!NOTE]
> Before you add another node for high availability and scalability, ensure that the **Remote access to intranet** option is enabled on the first node (**Microsoft Integration Runtime Configuration Manager** > **Settings** > **Remote access to intranet**). 

### Scale considerations

#### Scale out

When the available memory on the self-hosted IR is low and the CPU usage is high, adding a new node helps scale out the load across machines. If activities are failing because they're timing out or because the self-hosted IR node is offline, it helps if you add a node to the gateway.

#### Scale up

When the available memory and CPU are not utilized well, but the execution of concurrent jobs is reaching the limit, you should scale up by increasing the number of concurrent jobs that can run on a node. You might also want to scale up when activities are timing out because the self-hosted IR is overloaded. As shown in the following image, you can increase the maximum capacity for a node:  

![Increasing concurrent jobs that can run on a node](media\create-self-hosted-integration-runtime\scale-up-self-hosted-IR.png)

### TLS/SSL certificate requirements

Here are the requirements for the TLS/SSL certificate that is used for securing communications between integration runtime nodes:

- The certificate must be a publicly trusted X509 v3 certificate. We recommend that you use certificates that are issued by a public (partner) certification authority (CA).
- Each integration runtime node must trust this certificate.
- We don't recommend Subject Alternative Name (SAN) certificates because only the last SAN item will be used and all others will be ignored due to current limitations. For example, if you have a SAN certificate whose SANs are **node1.domain.contoso.com** and **node2.domain.contoso.com**, you can use this certificate only on a machine whose FQDN is **node2.domain.contoso.com**.
- The certificate supports any key size supported by Windows Server 2012 R2 for SSL certificates.
- Certificates that use CNG keys are not supported.  

## Sharing the self-hosted integration runtime with multiple data factories

You can reuse an existing self-hosted integration runtime infrastructure that you already set up in a data factory. This enables you to create a *linked self-hosted integration runtime* in a different data factory by referencing an existing self-hosted IR (shared).

### Terminology

- **Shared IR**: The original self-hosted IR that's running on a physical infrastructure.  
- **Linked IR**: The IR that references another shared IR. This is a logical IR and uses the infrastructure of another self-hosted IR (shared).

### High-level steps for creating a linked self-hosted IR

1. In the self-hosted IR to be shared, grant permission to the data factory in which you want to create the linked IR. 

   ![Button for granting permission on the Sharing tab](media\create-self-hosted-integration-runtime\grant-permissions-IR-sharing.png)

   ![Selections for assigning permissions](media\create-self-hosted-integration-runtime\3_rbac_permissions.png)

2. Note the resource ID of the self-hosted IR to be shared.

   ![Location of the resource ID](media\create-self-hosted-integration-runtime\4_ResourceID_self-hostedIR.png)

3. In the data factory to which the permissions were granted, create a new self-hosted IR (linked) and enter the resource ID.

   ![Button for creating a linked self-hosted integration runtime](media\create-self-hosted-integration-runtime\6_create-linkedIR_2.png)

   ![Boxes for name and resource ID](media\create-self-hosted-integration-runtime\6_create-linkedIR_3.png)

### Monitoring 

- **Shared IR**

  ![Selections for finding a shared integration runtime](media\create-self-hosted-integration-runtime\Contoso-shared-IR.png)

  ![Tab for monitoring](media\create-self-hosted-integration-runtime\contoso-shared-ir-monitoring.png)

- **Linked IR**

  ![Selections for finding a linked integration runtime](media\create-self-hosted-integration-runtime\Contoso-linked-ir.png)

  ![Tab for monitoring](media\create-self-hosted-integration-runtime\Contoso-linked-ir-monitoring.png)

### Known limitations of self-hosted IR sharing

* The data factory in which a linked IR will be created must have an [MSI](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview). By default, the data factories created in the Azure portal or PowerShell cmdlets have an MSI created implicitly. But when a data factory is created through an Azure Resource Manager template or SDK, the **Identity** property must be set explicitly to ensure that Azure Resource Manager creates a data factory that contains an MSI. 

* The Azure Data Factory .NET SDK that supports this feature is version 1.1.0 or later.

* The Azure PowerShell version that supports this feature is 6.6.0 or later (AzureRM.DataFactoryV2, 0.5.7 or later).

* To grant permission, the user needs the Owner role or the inherited Owner role in the data factory where the shared IR exists. 

* For Active Directory [guest users](https://docs.microsoft.com/azure/active-directory/governance/manage-guest-access-with-access-reviews), the search functionality (listing all data factories by using a search keyword) in the UI [does not work](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes#SearchLimits). But as long as the guest user is the Owner of the data factory, they can share the IR without the search functionality, by directly typing the MSI of the data factory with which the IR needs to be shared in the **Assign Permission** text box and selecting **Add** in the Azure Data Factory UI. 

  > [!NOTE]
  > This feature is available only in Azure Data Factory V2. 

## Notification area icons and notifications

If you move your cursor over the icon or message in the notification area, you can find details about the state of the self-hosted integration runtime.

![Notifications in the notification area](media\create-self-hosted-integration-runtime\system-tray-notifications.png)

## Ports and firewall
There are two firewalls to consider: the *corporate firewall* running on the central router of the organization, and the *Windows firewall* configured as a daemon on the local machine where the self-hosted integration runtime is installed.

![Firewall](media\create-self-hosted-integration-runtime\firewall.png)

At the *corporate firewall* level, you need to configure the following domains and outbound ports:

Domain names | Ports | Description
------------ | ----- | ------------
*.servicebus.windows.net | 443 | Used for communication with the back-end data movement service
*.core.windows.net | 443 | Used for staged copy through Azure Blob storage (if configured)
*.frontend.clouddatahub.net | 443 | Used for communication with the back-end data movement service
download.microsoft.com | 443 | Used for downloading the updates

At the *Windows firewall* level (machine level), these outbound ports are normally enabled. If not, you can configure the domains and ports accordingly on a self-hosted integration runtime machine.

> [!NOTE]
> Based on your source and sinks, you might have to whitelist additional domains and outbound ports in your corporate firewall or Windows firewall.
>
> For some cloud databases (for example, Azure SQL Database and Azure Data Lake), you might need to whitelist IP addresses of self-hosted integration runtime machines on their firewall configuration.

### Copy data from a source to a sink
Ensure that the firewall rules are enabled properly on the corporate firewall, the Windows firewall on the self-hosted integration runtime machine, and the data store itself. Enabling these rules allows the self-hosted integration runtime to connect to both source and sink successfully. Enable rules for each data store that is involved in the copy operation.

For example, to copy from an on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink, take the following steps:

1. Allow outbound TCP communication on port 1433 for both Windows firewall and corporate firewall.
2. Configure the firewall settings of the Azure SQL database to add the IP address of the self-hosted integration runtime machine to the list of allowed IP addresses.

> [!NOTE]
> If your firewall does not allow outbound port 1433, the self-hosted integration runtime can't access the Azure SQL database directly. In this case, you can use a [staged copy](copy-activity-performance.md) to Azure SQL Database and Azure SQL Data Warehouse. In this scenario, you would require only HTTPS (port 443) for the data movement.


## Proxy server considerations
If your corporate network environment uses a proxy server to access the internet, configure the self-hosted integration runtime to use appropriate proxy settings. You can set the proxy during the initial registration phase.

![Specify proxy](media\create-self-hosted-integration-runtime\specify-proxy.png)

The self-hosted integration runtime uses the proxy server to connect to the cloud service. Select **Change link** during initial setup. You see the proxy-setting dialog box.

![Set proxy](media\create-self-hosted-integration-runtime\set-http-proxy.png)

There are three configuration options:

- **Do not use proxy**: The self-hosted integration runtime does not explicitly use any proxy to connect to cloud services.
- **Use system proxy**: The self-hosted integration runtime uses the proxy setting that is configured in diahost.exe.config and diawp.exe.config. If no proxy is configured in diahost.exe.config and diawp.exe.config, the self-hosted integration runtime connects to the cloud service directly without going through a proxy.
- **Use custom proxy**: Configure the HTTP proxy setting to use for the self-hosted integration runtime, instead of using configurations in diahost.exe.config and diawp.exe.config. **Address** and **Port** are required. **User Name** and **Password** are optional depending on your proxy’s authentication setting. All settings are encrypted with Windows DPAPI on the self-hosted integration runtime and stored locally on the machine.

The integration runtime Host Service restarts automatically after you save the updated proxy settings.

After the self-hosted integration runtime has been successfully registered, if you want to view or update proxy settings, use Integration Runtime Configuration Manager.

1. Open **Microsoft Integration Runtime Configuration Manager**.
2. Switch to the **Settings** tab.
3. Select the **Change** link in the **HTTP Proxy** section to open the **Set HTTP Proxy** dialog box.
4. Select **Next**. You then see a warning that asks for your permission to save the proxy setting and restart the integration runtime Host Service.

You can view and update the HTTP proxy by using the Configuration Manager tool.

![View proxy](media\create-self-hosted-integration-runtime\view-proxy.png)

> [!NOTE]
> If you set up a proxy server with NTLM authentication, the integration runtime Host Service runs under the domain account. If you change the password for the domain account later, remember to update the configuration settings for the service and restart it accordingly. Due to this requirement, we suggest that you use a dedicated domain account to access the proxy server that does not require you to update the password frequently.

### Configure proxy server settings

If you select the **Use system proxy** setting for the HTTP proxy, the self-hosted integration runtime uses the proxy setting in diahost.exe.config and diawp.exe.config. If no proxy is specified in diahost.exe.config and diawp.exe.config, the self-hosted integration runtime connects to the cloud service directly without going through proxy. The following procedure provides instructions for updating the diahost.exe.config file:

1. In File Explorer, make a safe copy of C:\Program Files\Microsoft Integration Runtime\3.0\Shared\diahost.exe.config to back up the original file.
2. Open Notepad.exe running as an administrator, and open the text file C:\Program Files\Microsoft Integration Runtime\3.0\Shared\diahost.exe.config. Find the default tag for system.net as shown in the following code:

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

	Additional properties are allowed inside the proxy tag to specify the required settings like `scriptLocation`. See [proxy Element (Network Settings)](https://msdn.microsoft.com/library/sa91de1e.aspx) for syntax.

	```xml
	<proxy autoDetect="true|false|unspecified" bypassonlocal="true|false|unspecified" proxyaddress="uriString" scriptLocation="uriString" usesystemdefault="true|false|unspecified "/>
	```
3. Save the configuration file in the original location. Then restart the self-hosted integration runtime Host Service, which picks up the changes. 

   To restart the service, use the services applet from the control panel. Or from Integration Runtime Configuration Manager, select the **Stop Service** button, and then select **Start Service**. 
   
   If the service does not start, it's likely that an incorrect XML tag syntax was added in the application configuration file that was edited.

> [!IMPORTANT]
> Don't forget to update both diahost.exe.config and diawp.exe.config.

You also need to make sure that Microsoft Azure is in your company’s whitelist. You can download the list of valid Microsoft Azure IP addresses from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=41653).

### Possible symptoms for firewall and proxy server-related issues
If you encounter errors similar to the following ones, it's likely due to improper configuration of the firewall or proxy server, which blocks the self-hosted integration runtime from connecting to Data Factory to authenticate itself. To ensure that your firewall and proxy server are properly configured, refer to the previous section.

* When you try to register the self-hosted integration runtime, you receive the following error: "Failed to register this Integration Runtime node! Confirm that the Authentication key is valid and the integration service Host Service is running on this machine."
* When you open Integration Runtime Configuration Manager, you see a status of **Disconnected** or **Connecting**. When you're viewing Windows event logs, under **Event Viewer** > **Application and Services Logs** > **Microsoft Integration Runtime**, you see error messages like this one:

	```
	Unable to connect to the remote server
	A component of Integration Runtime has become unresponsive and restarts automatically. Component name: Integration Runtime (Self-hosted).
	```

### Enabling remote access from an intranet  
If you use PowerShell or the Credential Manager application to encrypt credentials from another machine (in the network) other than where the self-hosted integration runtime is installed, you can enable the **Remote Access from Intranet** option. 
If you run PowerShell or the Credential Manager application to encrypt credentials on the same machine where the self-hosted integration runtime is installed, you can't enable **Remote Access from Intranet**.

You should enable **Remote Access from Intranet** before you add another node for high availability and scalability.  

During self-hosted integration runtime setup (version 3.3.xxxx.x later), by default, the self-hosted integration runtime installation disables **Remote Access from Intranet** on the self-hosted integration runtime machine.

If you're using a third-party firewall, you can manually open port 8060 (or the user-configured port). If you have a firewall problem while setting up the self-hosted integration runtime, try using the following command to install the self-hosted integration runtime without configuring the firewall:

```
msiexec /q /i IntegrationRuntime.msi NOFIREWALL=1
```
> [!NOTE]
> The Credential Manager application is not yet available for encrypting credentials in Azure Data Factory V2.  

If you choose not to open port 8060 on the self-hosted integration runtime machine, use mechanisms other than the Setting Credentials application to configure data store credentials. For example, you can use the **New-AzureRmDataFactoryV2LinkedServiceEncryptCredential** PowerShell cmdlet.


## Next steps
See the following tutorial for step-by-step instructions: [Tutorial: Copy on-premises data to cloud](tutorial-hybrid-copy-powershell.md).
