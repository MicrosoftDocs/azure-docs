### Create the console application and obtain the assembly

To create a new console application in Visual Studio and install the NuGet package containing the Azure Storage Client Library:

1. In Visual Studio, choose **File > New Project**, and then choose **Windows > Console Application** from the list of Visual C# templates.
2. Provide a name for the console application, and then click **OK**.
3. Once your project has been created, right-click the project in Solution Explorer and choose **Manage NuGet Packages**. Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage Client Library for .NET package and dependencies.

The code examples in this article also use the [Microsoft Azure Configuration Manager Library](https://msdn.microsoft.com/library/azure/mt634646.aspx) to retrieve the storage connection string from an app.config file in the console application. With Azure Configuration Manager, you can retrieve your connection string at runtime regardless of whether your application is running in Microsoft Azure or from a desktop, mobile, or web application. 

To install the Azure Configuration Manager package, right-click the project in Solution Explorer and choose **Manage NuGet Packages**. Search online for "ConfigurationManager" and click **Install** to install the package.

Using Azure Configuration Manager is optional. You can also use an API such as the .NET Framework's [ConfigurationManager class](https://msdn.microsoft.com/library/system.configuration.configurationmanager.aspx).


