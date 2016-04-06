## Set up a storage connection string

The Azure Storage Client Library for .NET supports using a storage connection string to configure endpoints and credentials for accessing storage services. The best way to maintain your storage connection string is in a configuration file. 

For more information about connection strings, see [Configure a Connection String to Azure Storage](../articles/storage/storage-configure-connection-string.md).

> [AZURE.NOTE] Your storage account key is similar to the root password for your storage account. Always be careful to protect your storage account key. Avoid distributing it to other users, hard-coding it, or saving it in a plain-text file that is accessible to others. Regenerate your key using the Azure Portal if you believe it may have been compromised.

### Determine your target environment

You have two environment options for running the examples in this guide:

- You can run your code against the Azure storage emulator. The storage emulator is a local environment that emulates an Azure Storage account in the cloud. The emulator is a free option for testing and debugging your code while your application is under development. The emulator uses a well-known account and key. For more details, see [Use the Azure Storage Emulator for Development and Testing](../articles/storage/storage-use-emulator.md)
- You can run your code against an Azure Storage account in the cloud. 

If you are targeting a storage account in the cloud, copy the primary access key for your storage account from the Azure Portal. For more information, see [View and copy storage access keys](../articles/storage/storage-create-storage-account.md#view-and-copy-storage-access-keys).

> [AZURE.NOTE] You can target the storage emulator to avoid incurring any costs associated with Azure Storage. However, if you do choose to target an Azure storage account in the cloud, costs for performing this tutorial will be negligible.
	
### Configure your connection string using .NET configuration

If your application runs on a desktop or mobile device, on an Azure virtual machine, or in an Azure Web App, save your connection string using .NET configuration (*e.g.*, in the application's `web.config` or `app.config` file). Store your connection string using the `<appSettings>` element as follows. Replace `account-name` with the name of your storage account, and `account-key` with your account access key:

	<configuration>
  		<appSettings>
    		<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key" />
  		</appSettings>
	</configuration>

For example, your configuration setting will be similar to:

	<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=account-key" />

To target the storage emulator, you can use a shortcut that maps to the well-known account name and key. In that case, your connection string setting will be:

	<add key="StorageConnectionString" value="UseDevelopmentStorage=true;" />

### Configure your connection string for an Azure cloud service

If your application runs in an Azure cloud service, save your connection string using the Azure service configuration files (`*.csdef` and `*.cscfg` files). See [How to Create and Deploy a Cloud Service](../articles/cloud-services/cloud-services-how-to-create-deploy.md) for details about Azure cloud service configuration.
