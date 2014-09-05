The Azure Storage Client Library for .NET supports using a storage connection string to configure endpoints and credentials for accessing storage services. We recommend that you maintain your storage connection string in a configuration file, rather than hard-coding it into your application. You have two options for saving your connection string:

- If your application runs in an Azure cloud service, save your connection string using the Azure service configuration system (`*.csdef` and `*.cscfg` files).
- If your application runs on Azure virtual machines, or if you are building .NET applications that will run outside of Azure, save your connection string using the .NET configuration system (e.g. `web.config` or `app.config` file).

Later on in this guide, we will show how to retrieve your connection string from your code.

### Configuring your connection string from an Azure cloud service

Azure Cloud Services has a unique service configuration mechanism that enables you to dynamically change configuration settings from the Azure Management Portal without redeploying your application.

To configure your connection string in the Azure service configuration:

1.  Within the Solution Explorer of Visual Studio, in the **Roles**
    folder of your Azure Deployment Project, right-click your
    web role or worker role and click **Properties**.  
    ![Select the properties on a Cloud Service role in Visual Studio][connection-string1]

2.  Click the **Settings** tab and press the **Add Setting** button.  
    ![Add a Cloud Service setting in visual Studio][connection-string2]

    A new **Setting1** entry will then show up in the settings grid.

3.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Set connection string type][connection-string3]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog will open.

5.  Choose whether you want to target the storage emulator (Windows
    Azure storage simulated on your local machine) or a storage
    account in the cloud. The code in this guide works with either
    option. Enter the **Primary Access Key** value copied from the
    earlier step in this tutorial if you wish to target the
    storage account we created earlier on Azure.

	> [WACOM.NOTE] You can target the storage emulator to avoid incurring any costs associated with Windows Azure Storage. However, if you do choose to target an Azure storage account in the cloud, costs for performing this tutorial will be negligible.
	
    ![Select target environment][connection-string4]

6.  Change the entry **Name** from **Setting1** to a friendlier name
    like **StorageConnectionString**. You will reference this
    connection string later in the code in this guide.  
    ![Change connection string name][connection-string5]
	
### Configuring your connection string using .NET configuration

If you are writing an application that is not an Azure cloud service, (see previous section), it is recommended you use the .NET configuration system (e.g. `web.config` or `app.config`). This includes Azure Websites or Azure Virtual Machines, as well as applications designed to run outside of Azure. You store the connection string using the `<appSettings>` element as follows. Replace `account-name` with the name of your storage account, and `account-key` with your account access key:

	<configuration>
  		<appSettings>
    		<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key" />
  		</appSettings>
	</configuration>

For example, the configuration setting in your config file may be similar to:

	<configuration>
    	<appSettings>
      		<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=nYV0gln9fT7bvY+rxu2iWAEyzPNITGkhM88J8HUoyofpK7C8fHcZc2kIZp6cKgYRUM74lHI84L50Iau1+9hPjB==" />
    	</appSettings>
	</configuration>

See [Configuring Connection Strings][] for more information on storage connection strings.
	
You are now ready to perform the how-to tasks in this guide.

[connection-string1]: ./media/storage-configure-connection-string/connection-string1.png
[connection-string2]: ./media/storage-configure-connection-string/connection-string2.png
[connection-string3]: ./media/storage-configure-connection-string/connection-string3.png
[connection-string4]: ./media/storage-configure-connection-string/connection-string4.png
[connection-string5]: ./media/storage-configure-connection-string/connection-string5.png

[Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx