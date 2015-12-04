You must create a load-balanced endpoint for each VM hosting an Azure replica. If you have replicas in multiple regions, each replica for that region must be in the same cloud service in the same VNet. Creating Availability Group replicas that span multiple Azure regions requires configuring multiple VNets. For more information on configuring cross VNet connectivity, see  [Configure VNet to VNet Connectivity](../articles/vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md).

1. In the Azure portal, navigate to each VM hosting a replica and view the details.

1. Click the **Endpoints** tab for each of the VMs.

1. Verify that the **Name** and **Public Port** of the listener endpoint you want to use is not already in use. In the example below, the name is “MyEndpoint” and the port is “1433”.

1. On your local client, download and install [the latest PowerShell module](http://azure.microsoft.com/downloads/).

1. Launch **Azure PowerShell**. A new PowerShell session is opened with the Azure administrative modules loaded.

1. Run **Get-AzurePublishSettingsFile**. This cmdlet directs you to a browser to download a publish settings file to a local directory. You may be prompted for your log-in credentials for your Azure subscription.

1. Run the **Import-AzurePublishSettingsFile** command with the path of the publish settings file that you downloaded:

		Import-AzurePublishSettingsFile -PublishSettingsFile <PublishSettingsFilePath>

	Once the publish settings file is imported, you can manage your Azure subscription in the PowerShell session.