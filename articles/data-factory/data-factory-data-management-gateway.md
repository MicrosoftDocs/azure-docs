<properties
	pageTitle="Data Management Gateway for Data Factory | Microsoft Azure"
	description="Set up a data gateway to move data between on-premises and the cloud. Use Data Management Gateway in Azure Data Factory to move your data."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/05/2016"
	ms.author="spelluru"/>

# Data Management Gateway
Data Management Gateway is a client agent that you must install in your on-premises environment to move data between cloud and on-premises data stores that are [supported by Copy Activity](data-factory-data-movement-activities.md##supported-data-stores).

This article complements the content in [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md), which has a walkthrough for creating an Azure Data Factory pipeline. The pipeline uses the gateway to move data from an on-premises SQL Server database to an Azure blob. This article provides detailed in-depth information about Data Management Gateway.   

## Overview

### Capabilities of Data Management Gateway
With Data Management Gateway, you can:

- Move data and model on-premises data sources and cloud data sources within the same data factory.
- Have a single pane for monitoring and management, with visibility into gateway status from the Data Factory blade.
- Securely manage access to on-premises data sources.
	- No changes to corporate firewalls are required. Data Management Gateway makes only outbound HTTP-based connections to the Internet.
	- Encrypt credentials for your on-premises data stores with your certificate.
- Move data efficiently--data is transferred in parallel, resilient to intermittent network issues with auto-retry logic.

### Command flow and data flow
When you use a copy activity in a data pipeline to ingest on-premises data to the cloud for further processing, Copy Activity uses a gateway to transfer data from your on-premises data source to the cloud. Copy Activity uses the gateway when you export result data in the cloud back to an on-premises data store.

Following is a representation of high-level data flow and summary of steps for copy with Data Management Gateway:
![Data flow using gateway](./media/data-factory-data-management-gateway/data-flow-using-gateway.png)

1.	A data developer creates a gateway for a data factory by using either the [Azure portal](https://portal.azure.com) or [PowerShell cmdlet](https://msdn.microsoft.com/library/dn820234.aspx).
2.	A data developer creates a linked service for an on-premises data store by specifying the gateway. As part of setting up the linked service, the data developer uses the Setting Credentials application to specify authentication types and credentials. The Setting Credentials application communicates with the data store to test the connection and the gateway before saving credentials.
3. Data Management Gateway encrypts the credentials with the certificate associated with the gateway (supplied by the data developer) before saving the credentials in the cloud.
4. The Data Factory service communicates with the gateway for scheduling and management of jobs via a control channel that uses a shared Azure Service Bus queue. When a copy activity job needs to be initiated, Data Factory queues the request along with credential information. Data Management Gateway starts the job after polling the queue.
5.	The gateway decrypts the credentials with the same certificate. It then connects to the on-premises data store with the proper authentication type and credentials.
6.	The gateway copies data from the on-premises store to cloud storage, or from cloud storage to an on-premises data store, depending on how Copy Activity is configured in the data pipeline. For this step, the gateway directly communicates with cloud-based storage service (for example, Azure Blob storage or Azure SQL Database) over a secure (HTTPS) channel.

### Considerations for using Data Management Gateway
- A single instance of Data Management Gateway can be used for multiple on-premises data sources, but a single gateway instance is tied to only one Azure data factory and cannot be shared with another data factory.
- You can have only one instance of Data Management Gateway installed on a single machine. If you have two data factories that need to access on-premises data sources, you need to install gateways on two on-premises computers where each gateway tied to a separate data factory.
- The gateway does not need to be on the same machine as the data source, but staying closer to the data source reduces the time the gateway needs to connect to the data source. We recommend that you install the gateway on a machine that is different from the one that hosts the on-premises data source so that the gateway does not compete for resources with the data source.
- You can have multiple gateways on different machines connecting to the same on-premises data source. For example, you may have two gateways serving two data factories, but the same on-premises data source is registered with both the data factories.
- If you already have a gateway installed on your computer serving a Microsoft Power BI scenario, install a separate gateway for Azure Data Factory on another machine.
- You must use the gateway even when you use Azure ExpressRoute.
- You should treat your data source as an on-premises data source (behind a firewall) even when you use ExpressRoute and use the gateway to establish connectivity between the service and the data source.
- You must use the gateway even if the data store is in the cloud on an Azure IaaS virtual machine.

## Installation

### Prerequisites
- Data Management Gateway installation supports Windows 7, Windows 8/8.1, Windows 10, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2. Installation of Data Management Gateway on a domain controller is currently not supported.
- .NET Framework 4.5.1 or later is required. If you are installing the gateway on a Windows 7 machine, install .NET Framework 4.5 or later. See [.NET Framework System Requirements](https://msdn.microsoft.com/library/8z6watww.aspx) for details.
- The recommended configuration for the gateway machine is at least 2 GHz, 4 cores, 8 GB of RAM and 80 GB of hard drive space.
- If the host machine hibernates, the gateway won’t be able to respond to data requests. Therefore, configure an appropriate power plan on the computer before installing the gateway. If the machine is configured to hibernate, the gateway installation responds with a message.
- You must be an administrator on the machine to install and configure Data Management Gateway. You can add additional users to the Data Management Gateway Users local Windows group. The members of this group are able to use the Data Management Gateway Configuration Manager tool to configure the gateway.

Because Copy Activity runs happen on a specific frequency, the resource usage (CPU and memory) on the machine also follows the same pattern with peak and idle times. Resource utilization also depends heavily on the amount of data being moved. When multiple copy jobs are in progress, you see resource usage go up during peak times. While the minimum configuration is functional, it is always better to have a configuration with more resources, depending on your specific load for data movement.

### Installation options
Data Management Gateway can be installed in the following ways:

- By downloading an MSI setup package from [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=39717). MSI can also be used to upgrade your existing Data Management Gateway to the latest version, with all settings preserved.
- By clicking the **Download and install data gateway** link under MANUAL SETUP or **Install directly on this computer** under EXPRESS SETUP. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) for step-by-step instructions on using express setup. The manual step takes you to the download center. The instructions for downloading and installing Data Management Gateway from the Microsoft Download Center are in the following section.

### Installation best practices
1.	Configure the power plan on the host machine for the gateway so that the machine does not hibernate. If the host machine hibernates, the gateway does not respond to data requests.
2.	Back up the certificate associated with the gateway.

### Install Data Management Gateway from Download Center
1. Navigate to the [Microsoft Data Management Gateway download page](https://www.microsoft.com/download/details.aspx?id=39717).
2. Click **Download**, select the appropriate version (**32-bit** or **64-bit**), and click **Next**.
3. Run the **MSI** directly or save it to your hard drive and run it locally.
4. On the **Welcome** page, select a **language** and click **Next**.
5. **Accept** the End-User License Agreement and click **Next**.
6. Select the folder where the gateway will be installed and click **Next**.
7. On the **Ready to install** page, click **Install**.
8. Click **Finish** to complete installation.
9. Get the key from the Azure portal. See the following section for step-by-step instructions.
10. On the **Register gateway** page of Data Management Gateway Configuration Manager running on your machine, paste the key into the text box and click **Register**. You can also click **Show gateway key** to see the key text.

### Register the gateway by using the key

To register the gateway by using the key, you must have a logical gateway in the Azure portal. If you haven't created a logical gateway, follow steps from the walkthrough in [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) to create a gateway in the Azure portal and get the key from the **Configure** blade.   

If you have already created the logical gateway in the Azure portal, the following steps will show you how to register the gateway by using the key.

1. In the Azure portal, go to the **Data Factory** blade, and click **Linked services**.

	![Data Factory blade](media/data-factory-data-management-gateway/data-factory-blade.png)

2. On the **Linked services** blade, select the logical **gateway** you created in the Azure portal.

	![Logical gateway](media/data-factory-data-management-gateway/data-factory-select-gateway.png)  
2. On the **Data Gateway** blade, click **Download and install data gateway**.

	![Download link in the portal](media/data-factory-data-management-gateway/download-and-install-link-on-portal.png)   
3. On the **Configure** blade, click **Recreate key**. Click **Yes** on the warning message after reading it carefully.

	![Recreate key](media/data-factory-data-management-gateway/recreate-key-button.png)
4. Click **Copy** next to the key to copy it to the clipboard.

	![Copy key](media/data-factory-data-management-gateway/copy-gateway-key.png)

### Notification area icons and notifications
The following image shows some of the notification icons.

![Notification area icons](./media/data-factory-data-management-gateway/gateway-tray-icons.png)

If you move the cursor over the notification area icon or notification message, you will see details about the state of the gateway or update operation in a pop-up window.

### Ports and firewalls
There are two firewalls: a *corporate firewall* running on the central router of the organization, and the *Windows firewall* configured as a daemon on the local machine where the gateway is installed.  

![Firewalls](./media/data-factory-data-management-gateway/firewalls.png)

At the corporate firewall level, you need to configure the following domains and outbound ports:

| Domain names | Ports | Description |
| ------ | --------- | ------------ |
| *.servicebus.windows.net | 443, 80 | Listeners on Azure Service Bus relay over TCP (requires 443 for Access Control token acquisition) |
| *.servicebus.windows.net | 9350-9354, 5671 | Optional Service Bus relay over TCP |
| *.core.windows.net | 443 | HTTPS |
| *.clouddatahub.net | 443 | HTTPS |
| graph.windows.net | 443 | HTTPS |
| login.windows.net | 443 | HTTPS |

At the Windows firewall level, these outbound ports are normally enabled. If they are not, you can configure the domains and ports accordingly on the gateway machine.

#### Copy data from a source data store to a sink data store

Make sure the firewall rules are enabled on the corporate firewall, the Windows firewall on the gateway machine, and the data store itself. This enables the gateway to connect to both source and sink successfully. You must enable rules for each data store that is involved in the copy operation.

To copy from an on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink, you need to allow outbound TCP communication on port 1433 for both the Windows firewall and the cooperate firewall. You must also configure the firewall settings of the Azure SQL server to add the IP address of the gateway machine to the list of allowed IP addresses.


### Proxy server settings
By default, Data Management Gateway applies the proxy settings from Internet Explorer and uses default credentials to access it. If this does not suit your case, you can further configure proxy server settings to ensure that the gateway is able to connect to Azure Data Factory:

1.	After installing Data Management Gateway, go to File Explorer and make a safe copy of C:\Program Files\Microsoft Data Management Gateway\1.0\Shared\diahost.exe.config to back up the original file.
2.	Open Notepad.exe as an administrator and open the text file C:\Program Files\Microsoft Data Management Gateway\1.0\Shared\diahost.exe.config. The default tag for system.net is:

			<system.net>
				<defaultProxy useDefaultCredentials="true" />
			</system.net>

	You can then add the proxy server details, such as proxy address, inside that parent tag. For example:

			<system.net>
			      <defaultProxy enabled="true">
			            <proxy bypassonlocal="true" proxyaddress="http://proxy.domain.org:8888/" />
			      </defaultProxy>
			</system.net>

	Additional properties are allowed inside the proxy tag to specify the required settings, like scriptLocation. Refer to [proxy Element (Network Settings)](https://msdn.microsoft.com/library/sa91de1e.aspx) for syntax.

			<proxy autoDetect="true|false|unspecified" bypassonlocal="true|false|unspecified" proxyaddress="uriString" scriptLocation="uriString" usesystemdefault="true|false|unspecified "/>

3. Save the configuration file to the original location, and then restart Data Management Gateway to pick up the changes. You can do this from **Start** > **Services.msc**, or from the **Data Management Gateway Configuration Manager**. Click **Stop Service**, and then click **Start Service**. If the service does not start, it is likely that an incorrect XML tag syntax has been added into the application configuration file that was edited. 	

In addition to the points described previously, you also need to make sure Microsoft Azure is in your company’s Safe Recipients list. The list of valid Microsoft Azure IP addresses can be downloaded from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=41653).

#### Possible symptoms for firewall-related and proxy server-related issues
The following errors are generally caused by improper configuration of the firewall or proxy server, which blocks Data Management Gateway from connecting to Azure Data Factory to authenticate itself. Refer to the previous section to ensure that your firewall and proxy server are properly configured.

-	When you try to register the gateway, you receive the following error: "Failed to register the gateway key. Before trying to register the gateway key again, confirm that the Data Management Gateway is in a connected state and the Data Management Gateway Host Service is started."
-	When you open Configuration Manager, you see the status as **Disconnected** or **Connecting**. When you view Windows event logs, under **Event Viewer > Application and Services Logs > Data Management Gateway**, you see error messages such as “Unable to connect to the remote server” or “A component of Data Management Gateway has become unresponsive and restarts automatically. Component name: Gateway.”

### Open port 8050 for credential encryption
The Setting Credentials application uses the inbound port 8050 to relay the credentials to the gateway when you [set up an on-premises linked service in the Azure portal](#encrypt-credentials). During gateway setup, Data Management Gateway installation opens it on the gateway machine.

If you are using a third-party firewall, you can manually open port 8050. If you run into firewall issues during gateway setup, you can try to use the following command to install the gateway without configuring the firewall.

	msiexec /q /i DataManagementGateway.msi NOFIREWALL=1

If you choose not to open port 8050 on the gateway machine, you need to use mechanisms other than Setting Credentials to configure the data store credentials and set up an on-premises linked service. For example, use the [New-AzureRmDataFactoryEncryptValue](https://msdn.microsoft.com/library/mt603802.aspx) PowerShell cmdlet. See [Setting credentials and security](#set-credentials-and-security) for more information about how data store credentials can be set.

## Update
By default, Data Management Gateway is automatically updated when a newer version of the gateway is available. The gateway is not updated until all scheduled tasks are done. The gateway processes no further tasks until the update operation is completed. If the update fails, the gateway is rolled back to the old version.

The scheduled update time is listed on the **Gateway properties** blade, on the home page of Data Management Gateway Configuration Manager, and in the notification area.

The **Home** tab of Data Management Gateway Configuration Manager displays the update schedule and the last time the gateway was installed or updated.

![Schedule updates](media/data-factory-data-management-gateway/UpdateSection.png)

You can install the update right away or wait for the gateway to be automatically updated at the scheduled time. The following screenshot shows you the notification message shown in Data Management Gateway Configuration Manager, along with the **Update** button that you click to install it immediately.

![Update in Data Management Gateway Configuration Manager](./media/data-factory-data-management-gateway/gateway-auto-update-config-manager.png)

The notification message in the notification area looks like the following:

![Notification area message](./media/data-factory-data-management-gateway/gateway-auto-update-tray-message.png)

You see the status of the update operation (manual or automatic) in the notification area. The next time you open Data Management Gateway Configuration Manager, you will see a message on the notification bar that the gateway has been updated, along with a link to the [What's new topic](data-factory-gateway-release-notes.md).

### Disable or enable the auto-update feature
You can disable or enable the auto-update feature by doing the following:

1. Open Windows PowerShell on the gateway machine.
2. Go to the C:\Program Files\Microsoft Data Management Gateway\1.0\PowerShellScript folder.
3. Run the following command to turn off the auto-update feature.   

		.\GatewayAutoUpdateToggle.ps1  -off

4. Run the following command to turn on the auto-update feature.

		.\GatewayAutoUpdateToggle.ps1  -on  

## Configuration Manager
After you install the gateway, you can open Data Management Gateway Configuration Manager in one of the following ways:

- In the **Search** box, type **Data Management Gateway** to access this utility.
- Run the executable **ConfigManager.exe** in the folder: C:\Program Files\Microsoft Data Management Gateway\1.0\Shared.

### Home page
You can perform the following actions on the home page:

- View the status of the gateway (such as connected to the cloud service).
- Register by using a key from the Azure portal.
- Stop and start the Data Management Gateway host service on the gateway machine.
- Schedule updates at specific times.
- View the date when the gateway was last updated.

### Settings page
You can perform the following actions on the Settings page:

- View, change, and export certificates used by the gateway. These certificates are used to encrypt data source credentials.
- Change the HTTPS port for the endpoint. The gateway opens a port for setting the data source credentials.
- View the status of the endpoint.
- View the SSL certificate used for SSL communication between the Azure portal and the gateway to set credentials for data sources.  

### Diagnostics page
You can perform the following actions on the Diagnostics page:

- Enable verbose logging, view logs in the event viewer, and send logs to Microsoft if there is a failure.
- Test a connection to a data source.  

### Help page
The Help page displays the following:

- A brief description of the gateway
- Version number
- Links to online help, the privacy statement, and license agreement

## Troubleshooting

- You can find detailed information in the gateway logs under Windows event logs. You can find them by using Windows Event Viewer under **Application and Services Logs** > **Data Management Gateway**. While troubleshooting gateway-related issues, look for error-level events in the event viewer.
- If the gateway stops working after you change the certificate, restart the Data Management Gateway service by using the Microsoft Data Management Gateway Configuration Manager tool or the Services control panel applet. If you still see an error, you may have to use Certificate Manager (certmgr.msc) to give explicit permissions for the Data Management Gateway service user to access the certificate. The default user account for the service is **NT Service\DIAHostService**.
- If the Credential Manager application fails to encrypt credentials when you click **Encrypt** in Data Factory Editor, verify that you are running this application on the machine on which the gateway is installed. If not, run the application on the gateway machine and try to encrypt credentials.  
- If you see data store connection or driver-related errors, open Data Management Gateway Configuration Manager on the gateway machine and select the **Diagnostics** tab. Select or enter appropriate values for fields in the **Test connection to an on-premises data source using this gateway** group, and click **Test connection** to see if you can connect to an on-premises data source from the gateway machine by using the connection information and credentials. If the test connection still fails after you install a driver, restart the gateway so it can pick up the latest change.  

	![Test connection](./media/data-factory-data-management-gateway/TestConnection.png)

### Send gateway logs to Microsoft
If you have gateway issues and need to contact Microsoft Support, you may be asked to share your gateway logs. The release of the gateway allows you to easily share required gateway logs in Data Management Gateway Configuration Manager.   

1. Click the **Diagnostics** tab of Data Management Gateway Configuration Manager.
2. Click **Send logs**.
![Data Management Gateway--Diagnostics tab](media/data-factory-data-management-gateway/data-management-gateway-diagnostics-tab.png)
3. Click **view logs** to review logs in the event viewer (optional).
![Data Management Gateway--send logs](media/data-factory-data-management-gateway/data-management-gateway-send-logs-dialog.png)
4. Click **privacy** to review the Microsoft Online Services privacy statement (optional).
3. When you are satisfied with what you are about to upload, click **Send Logs** to send logs from the last seven days to Microsoft for troubleshooting. You should see the status of the operation, as shown in the following example.

	![Data Management Gateway--send logs status](media/data-factory-data-management-gateway/data-management-gateway-send-logs-status.png)
4. When the operation is complete, you will see the following dialog box.

	![Data Management Gateway--send logs status](media/data-factory-data-management-gateway/data-management-gateway-send-logs-result.png)
5. Record the **report ID** and share it with Microsoft Support. The report ID is used to locate the gateway logs you uploaded for troubleshooting. The report ID is also saved in Event Viewer for your reference. You can find it by looking at the event ID “25” and checking the date and time.

	![Data Management Gateway--send logs report ID](media/data-factory-data-management-gateway/data-management-gateway-send-logs-report-id.png)

### Archive gateway logs on a gateway host machine
There are some scenarios in which you have gateway issues and you cannot share gateway logs directly:

- You manually install and register the gateway.
- You try to register the gateway with a regenerated key on Configuration Manager.
- You try to send logs, but gateway host service cannot be connected.

In such cases, you can save gateway logs as .zip files and share them with Microsoft support, as shown in the following example.  

![Data Management Gateway--registration error](media/data-factory-data-management-gateway/data-management-gateway-registration-error.png)

Click **Archive gateway logs** to archive and save logs, and then share the .zip file with Microsoft support.

![Data Management Gateway--archive logs](media/data-factory-data-management-gateway/data-management-gateway-archive-logs.png)


## Move a gateway client from one machine to another
This section provides steps for moving a gateway client between machines.

2. In the Azure portal, go to the Data Factory home page and click **Linked Services**.

	![Data gateways link](./media/data-factory-data-management-gateway/DataGatewaysLink.png)
3. Select your gateway in the **DATA GATEWAYS** section of the **Linked Services** blade.

	![Linked Services blade with gateway selected](./media/data-factory-data-management-gateway/LinkedServiceBladeWithGateway.png)
4. On the **Data gateway** blade, click **Download and install data gateway**.

	![Download gateway link](./media/data-factory-data-management-gateway/DownloadGatewayLink.png)
5. On the **Configure** blade, click **Download and install data gateway**, and follow the instructions to install the data gateway on the machine.

	![Configure blade](./media/data-factory-data-management-gateway/ConfigureBlade.png)
6. Keep Data Management Gateway Configuration Manager open.

	![Configuration Manager](./media/data-factory-data-management-gateway/ConfigurationManager.png)
7. On the **Configure** blade in the Azure portal, click **Recreate key**, and click **Yes** on the warning message. Click **copy** to copy the key to the clipboard. The gateway on the old machine stops functioning as soon you recreate the key.  

	![Recreate key](./media/data-factory-data-management-gateway/RecreateKey.png)

8. Paste the key into the text box on the **Register Gateway** page of Data Management Gateway Configuration Manager on your machine. Click **Show gateway key** to see the key text (optional).

	![Copy key and register](./media/data-factory-data-management-gateway/CopyKeyAndRegister.png)
9. Click **Register** to register the gateway with the cloud service.
10. On the **Settings** tab, click **Change** to select the same certificate that was used with the old gateway, enter the password, and click **Finish**.

	![Specify certificate](./media/data-factory-data-management-gateway/SpecifyCertificate.png)

	You can export a certificate from the old gateway by doing the following: open Data Management Gateway Configuration Manager on the old machine, select the **Certificate** tab, click **Export**, and follow the instructions.
10. After successful registration of the gateway, you should see the **Registration** set to **Registered** and **Status** set to **Started** on the home page of Data Management Gateway Configuration Manager.

## Encrypt credentials
To encrypt credentials in Data Factory Editor, do the following:

1. Open a web browser on the gateway machine, go to the [Azure portal](http://portal.azure.com), search for your data factory if needed, open Data Factory on the Data Factory blade, and click **Author & Deploy** to open Data Factory Editor.   
1. Click an existing linked service in the tree view to see its JSON definition or to create a linked service that requires Data Management Gateway (for example: SQL Server or Oracle).
2. In the JSON editor, enter the name of the gateway for the **gatewayName** property.
3. Enter the server name for the **Data Source** property in *connectionString*.
4. Enter the database name for the **Initial Catalog** property in *connectionString*.    
5. Click **Encrypt** to open the **Credential Manager** application. You should see the **Setting Credentials** dialog box.
	![Setting credentials dialog](./media/data-factory-data-management-gateway/setting-credentials-dialog.png)
6. In the **Setting Credentials** dialog box, do the following:  
	1.	Select the authentication that you want the Data Factory service to use to connect to the database.
	2.	In the **USERNAME** box, enter the name of the user who has access to the database.
	3.	In the **PASSWORD** box, enter the password for the user.  
	4.	Click **OK** to encrypt credentials and close the dialog box.
5.	You should see a **encryptedCredential** property in *connectionString*.		

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

If you access the Azure portal from a machine that is different from the gateway machine, you must make sure that Credentials Manager can connect to the gateway machine. If the application cannot reach the gateway machine, it does not allow you to set credentials for the data source or to test the connection to the data source.  

When you use **Setting Credentials** opened from the Azure portal to set credentials for an on-premises data source, the Azure portal encrypts the credentials with the certificate you specified on the **Certificate** tab of Data Management Gateway Configuration Manager on the gateway machine.

If you are looking for an API-based approach for encrypting the credentials, you can use the [New-AzureRmDataFactoryEncryptValue](https://msdn.microsoft.com/library/mt603802.aspx) PowerShell cmdlet to encrypt them. The cmdlet uses the same certificate that the gateway is configured to use to encrypt the credentials. You add encrypted credentials to the same **EncryptedCredential** element of *connectionString* in the JSON file that you use with the [New-AzureRmDataFactoryLinkedService](https://msdn.microsoft.com/library/mt603647.aspx) cmdlet or in the JSON snippet in Data Factory Editor in the Azure portal.

	"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",

There is one more approach for setting credentials by using Data Factory Editor. If you create a SQL Server linked service by using the editor and you enter credentials in plain text, the credentials are encrypted by using a certificate that the Data Factory service owns, not the certificate that the gateway is configured to use. This approach might be a little faster in some cases, but it is less secure. Therefore, we recommend that you follow this approach only for development or testing purposes.


## PowerShell cmdlets
This section describes how to create and register a gateway by using Azure PowerShell cmdlets.

1. Open **Azure PowerShell** in administrator mode.
2. Sign in to your Azure account by running the following command and entering your Azure credentials.

	Login-AzureRmAccount
	
2. Use the New-AzureRmDataFactoryGateway cmdlet to create a logical gateway as follows.

		$MyDMG = New-AzureRmDataFactoryGateway -Name <gatewayName> -DataFactoryName <dataFactoryName> -ResourceGroupName ADF –Description <desc>

	**Example command and output**:


		PS C:\> $MyDMG = New-AzureRmDataFactoryGateway -Name MyGateway -DataFactoryName $df -ResourceGroupName ADF –Description “gateway for walkthrough”

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


4. To register the client agent installed on your machine with the logical gateway you've already created, first open Azure PowerShell. Go to C:\Program Files\Microsoft Data Management Gateway\1.0\PowerShellScript\ and run the **RegisterGateway.ps1** script associated with the local variable **$Key** as shown in the following command.

		PS C:\> .\RegisterGateway.ps1 $MyDMG.Key

		Agent registration is successful!

	You can register the gateway on a remote machine by using the *IsRegisterOnRemoteMachine* parameter. For example:

		.\RegisterGateway.ps1 $MyDMG.Key -IsRegisterOnRemoteMachine true

5. You can use the Get-AzureRmDataFactoryGateway cmdlet to get the list of gateways in your data factory. When the **Status** appears as **online**, it means your gateway is ready to use.

		Get-AzureRmDataFactoryGateway -DataFactoryName <dataFactoryName> -ResourceGroupName ADF

You can remove a gateway by using the Remove-AzureRmDataFactoryGateway cmdlet and update a gateway description by using the Set-AzureRmDataFactoryGateway cmdlets. For syntax and other details about these cmdlets, see [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/dn820234.aspx).  

### List gateways by using PowerShell

	Get-AzureRmDataFactoryGateway -DataFactoryName jasoncopyusingstoredprocedure -ResourceGroupName ADF_ResourceGroup

### Remove a gateway by using PowerShell

	Remove-AzureRmDataFactoryGateway -Name JasonHDMG_byPSRemote -ResourceGroupName ADF_ResourceGroup -DataFactoryName jasoncopyusingstoredprocedure -Force


## Next steps
See [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md), which has a walkthrough for creating a Data Factory pipeline that uses the gateway to move data from an on-premises SQL Server database to an Azure blob.
