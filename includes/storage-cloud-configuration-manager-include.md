The [Microsoft Azure Configuration Manager Library for .NET](https://www.nuget.org/packages/Microsoft.WindowsAzure.ConfigurationManager/) provides a class for parsing a connection string from a configuration file. The [CloudConfigurationManager class](https://msdn.microsoft.com/library/azure/mt634650.aspx) parses configuration settings regardless of whether the client application is running on the desktop, on a mobile device, in an Azure virtual machine, or in an Azure cloud service.

To reference the CloudConfigurationManager package, add the following `using` statement to your class:

	using Microsoft.Azure;	//Namespace for CloudConfigurationManager

Here's an example that shows how to use retrieve a connection string from a configuration file:

    // Parse the connection string and return a reference to the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		CloudConfigurationManager.GetSetting("StorageConnectionString"));

Using Azure Configuration Manager is optional. You can also use an API such as the .NET Framework's [ConfigurationManager class](https://msdn.microsoft.com/library/system.configuration.configurationmanager.aspx).
