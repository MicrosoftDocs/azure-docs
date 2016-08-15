### Parse the connection string

The Microsoft Azure Configuration Manager library that you referenced above provides a class for parsing a connection string from a configuration file. The [CloudConfigurationManager class](https://msdn.microsoft.com/library/azure/mt634650.aspx) parses configuration settings regardless of whether the client application is running on the desktop, on a mobile device, in an Azure virtual machine, or in an Azure cloud service.

Add the following code to the `Main()` method in `program.cs`:

    // Parse the connection string and return a reference to the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		CloudConfigurationManager.GetSetting("StorageConnectionString"));

Using Azure Configuration Manager is optional. You can also use an API such as the .NET Framework's [ConfigurationManager class](https://msdn.microsoft.com/library/system.configuration.configurationmanager.aspx).
