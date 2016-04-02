### Parse the connection string

The Microsoft Azure Configuration Manager library that you referenced above provides a class for parsing a connection string from a configuration file. The [CloudConfigurationManager class](https://msdn.microsoft.com/library/azure/mt634650.aspx) parses configuration settings regardless of whether the client application is running on the desktop, on a mobile device, in an Azure virtual machine, or in an Azure cloud service.

Add the following code to the `Main()` method:

    // Parse the connection string and return a reference to the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));

> [AZURE.NOTE] If you prefer, you can use other configuration file parsers to retrieve your connection string. For example, the .NET framework [ConfigurationManager Class](https://msdn.microsoft.com/library/system.configuration.configurationmanager.aspx) provides access to configuration settings. However, the Azure Configuration Manager is ideal if you do not know whether your application will be running locally or in the cloud. 
