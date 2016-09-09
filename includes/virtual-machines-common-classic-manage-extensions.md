


##Using VM Extensions

Azure VM Extensions implement behaviors or features that either help other programs work on Azure VMs (for example, the **WebDeployForVSDevTest** extension allows Visual Studio to Web Deploy solutions on your Azure VM) or provide the ability for you to interact with the VM to support some other behavior (for example, you can use the VM Access extensions from PowerShell, the Azure CLI, and REST clients to reset or modify remote access values on your Azure VM).

>[AZURE.IMPORTANT] For a complete list of extensions by the features they support, see [Azure VM Extensions and Features](../articles/virtual-machines/virtual-machines-windows-extensions-features.md). Because each VM extension supports a specific feature, exactly what you can and cannot do with an extension depends on the extension. Therefore, before modifying your VM, make sure you have read the documentation for the VM Extension you want to use. Removing some VM Extensions is not supported; others have properties that can be set that change VM behavior radically.

The most common tasks are:

1.  Finding Available Extensions

2.  Updating Loaded Extensions

3.  Adding Extensions

4.  Removing Extensions

##Find Available Extensions

You can locate extension and extended information using:

-   PowerShell
-   Azure Cross-Platform Command Line Interface (Azure CLI)
-   Service Management REST API

###Azure PowerShell

Some extensions have PowerShell cmdlets that are specific to them, which may make their configuration from PowerShell easier; but the following cmdlets work for all VM extensions.

You can use the following cmdlets to obtain information about available extensions:

-   For instances of web roles or worker roles, you can use the [Get-AzureServiceAvailableExtension](https://msdn.microsoft.com/library/azure/dn722498.aspx)
    cmdlet.
-   For instances of Virtual Machines, you can use the [Get-AzureVMAvailableExtension](https://msdn.microsoft.com/library/azure/dn722480.aspx) cmdlet.

     For example, the following code example shows how to list the
    information for the **IaaSDiagnostics** extension using PowerShell.

        PS C:\> Get-AzureVMAvailableExtension -ExtensionName IaaSDiagnostics

        Publisher                   : Microsoft.Azure.Diagnostics
        ExtensionName               : IaaSDiagnostics
        Version                     : 1.2
        Label                       : Microsoft Monitoring Agent Diagnostics
        Description                 : Microsoft Monitoring Agent Extension
        PublicConfigurationSchema   :
        PrivateConfigurationSchema  :
        IsInternalExtension         : False
        SampleConfig                :
        ReplicationCompleted        : True
        Eula                        :
        PrivacyUri                  :
        HomepageUri                 :
        IsJsonExtension             : True
        DisallowMajorVersionUpgrade : False
        SupportedOS                 :
        PublishedDate               :
        CompanyName                 :


###Azure Command Line Interface (Azure CLI)

Some extensions have Azure CLI commands that are specific to them (the Docker VM Extension is one example), which may make their configuration easier; but the following commands work for all VM extensions.

You can use the **azure vm extension list** command to obtain information about available extensions, and use the **–-json** option to display all available information about one or more extensions. If you do not use an extension name, the command returns a JSON description of all available extensions.

For example, the following code example shows how to list the information for the **IaaSDiagnostics** extension using the Azure CLI **azure vm extension list** command and uses the **–-json** option to return complete information.


    $ azure vm extension list -n IaaSDiagnostics --json
    [
      {
        "publisher": "Microsoft.Azure.Diagnostics",
        "name": "IaaSDiagnostics",
        "version": "1.2",
        "label": "Microsoft Monitoring Agent Diagnostics",
        "description": "Microsoft Monitoring Agent Extension",
        "replicationCompleted": true,
        "isJsonExtension": true
      }
    ]



###Service Management REST APIs

You can use the following REST APIs to obtain information about available extensions:

-   For instances of web roles or worker roles, you can use the [List Available Extensions](https://msdn.microsoft.com/library/dn169559.aspx) operation. To list the versions of available extensions, you can use [List Extension Versions](https://msdn.microsoft.com/library/dn495437.aspx).

-   For instances of Virtual Machines, you can use the [List Resource Extensions](https://msdn.microsoft.com/library/dn495441.aspx) operation. To list the versions of available extensions, you can use [List Resource Extension Versions](https://msdn.microsoft.com/library/dn495440.aspx).

##Add, Update, or Disable Extensions

Extensions can be added when an instance is created or they can be added to a running instance. Extensions can be updated, disabled, or removed. You can perform these actions by using Azure PowerShell cmdlets or by using the Service Management REST API operations. Parameters are required to install and set up some extensions. Public and private parameters are supported for extensions.


###Azure PowerShell

Using Azure PowerShell cmdlets is the easiest way to add and update extensions. When you use the extension cmdlets, most of the configuration of the extension is done for you. At times, you may need to programmatically add an extension. When you need to do this, you must provide the configuration of the extension.

You can use the following cmdlets to know whether an extension requires a configuration of public and private parameters:

-   For instances of web roles or worker roles, you can use the **Get-AzureServiceAvailableExtension** cmdlet.

-   For instances of Virtual Machines, you can use the **Get-AzureVMAvailableExtension** cmdlet.

###Service Management REST APIs

When you retrieve a listing of available extensions by using the REST
APIs, you receive information about how the extension is to be configured. The information that is returned might show parameter information represented by a public schema and private schema. Public parameter values are returned in queries about the instances. Private parameter values are not returned.

You can use the following REST APIs to know whether an extension requires a configuration of public and private parameters:

-   For instances of web roles or worker roles, the **PublicConfigurationSchema** and **PrivateConfigurationSchema** elements contain the information in the response from the [List Available Extensions](https://msdn.microsoft.com/library/dn169559.aspx) operation.

-   For instances of Virtual Machines, the **PublicConfigurationSchema** and **PrivateConfigurationSchema** elements contain the information in the response from the [List Resource Extensions](https://msdn.microsoft.com/library/dn495441.aspx) operation.

>[AZURE.NOTE]Extensions can also use configurations that are defined with JSON. When these types of extensions are used, only the **SampleConfig** element is used.
