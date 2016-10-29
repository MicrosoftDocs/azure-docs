<properties
    pageTitle="Azure Government Services | Microsoft Azure"
    description="Information on managing your subscription in Azure Government"
    services="Azure-Government"
    cloud="gov" 
    documentationCenter=""
    authors="zakramer"
    manager="liki"
    editor="" />

<tags
    ms.service="multiple"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="azure-government"
    ms.date="10/21/2016"
    ms.author="zakramer" />


#  Managing and connecting to your subscription in Azure Government

Azure Government has unique URLs and endpoints for managing your environment. It is important to use the right connections to manage your environment through the portal or PowerShell. Once you are connected to the Azure Government environment, the normal operations for managing a service works if the component has been deployed.

## Connecting via the portal
The portal is the primary way that most people connect to Azure Government.  To connect, browse to the portal at [https://portal.azure.us](https://portal.azure.us).  The legacy version of the Azure portal can be accessed via [https://manage.windowsazure.us](https://manage.windowsazure.us).

Subscriptions can be created for your account by connecting to [https://account.windowsazure.us](https://account.windowsazure.us).

## Connecting via PowerShell

Whether you are using Azure PowerShell to manage a large subscription through script or access features that are not currently available in the Azure portal you need to connect to Azure Government instead of Azure Public.  If you have used PowerShell in Azure Public, it is mostly the same.  The differences in Azure Government are:

+ Connecting your account
+ Region names

>[AZURE.NOTE] If you have not used PowerShell yet, check out the [Introduction to Azure PowerShell](../powershell-install-configure.md).

When you start PowerShell, you have to tell Azure PowerShell to connect to Azure Government by specifying an environment parameter.  The parameter ensures that PowerShell is connecting to the correct endpoints.  The collection of endpoints is determined when you connect log in to your account.  Different APIs require different versions of the environment switch:

Connection type | Command
---|----
[Service Management](https://msdn.microsoft.com/library/dn708504.aspx) commands | `Add-AzureAccount -Environment AzureUSGovernment`
[Resource Management](https://msdn.microsoft.com/library/mt125356.aspx) commands | `Add-AzureRmAccount -EnvironmentName AzureUSGovernment`
[Azure Active Directory](https://msdn.microsoft.com/library/azure/jj151815.aspx) commands | `Connect-MsolService -AzureEnvironment UsGovernment`
[Azure Active Directory command v2](https://msdn.microsoft.com/library/azure/mt757189.aspx) | `Connect-AzureAD -AzureEnvironmentName AzureUSGovernment`
[Azure CLI Command Line](../xplat-cli-install.md) | `azure login –environment "AzureUSGovernment"`

You may also use the Environment switch when connecting to a storage account using New-AzureStorageContext and specify AzureUSGovernment.

### Determining region

Once you are connected, there is one additional difference – The regions used to target a service.  Every Azure cloud has different regions.  You can see them listed on the service availability page.  You normally use the region in the Location parameter for a command.

There is one catch.  The Azure Government regions need to be formatted differently than their common names:

Common name | Command
---|----
US Gov Virginia | USGov Virginia
US Gov Iowa | USGov Iowa

>[AZURE.NOTE] There is no space between US and Gov when using the Location Parameter.

If you ever want to validate the available regions in Azure Government, you can run the following commands and print the current list:

    Get-AzureLocation

If you are curious about the available environments across Azure, you can run:

    Get-AzureEnvironment

## Connecting via Visual Studio

Visual Studio is used by developers to easily manage their Azure subscriptions while building solutions.  Visual Studio does not currently allow you to configure a connection to Azure Government in the user interface.  

### Updating Visual Studio for Azure Government
To enable Visual Studio to connect to Azure Government, you need to update the registry.

1. Create a text file named **VisualStudioForAzureGov.reg**
2. Copy and paste the following text into **VisualStudioForAzureGov.reg**:
    ```
    [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
    "AadInstance"="https://login-us.microsoftonline.com/"
    "adaluri"="https://management.usgovcloudapi.net"
    "AzureRMEndpoint"=" https://management.usgovcloudapi.net"
    "AzureRMAudienceEndpoint"="https://management.core.usgovcloudapi.net"
    "EnableAzureRMIdentity"="true"
    "GraphUrl"="graph.windows.net"
    "AadApplicationTenant"="63296244-ce2c-46d8-bc36-3e558792fbee"
    ```
3. Save and then run the file.
4. Launch Visual Studio and begin using [Cloud Explorer](../vs-azure-tools-resources-managing-with-cloud-explorer.md)

>[AZURE.NOTE] Once this registry key is set only Azure Government subscriptions are accessible.  To return to using Azure Public, you 
need to delete the registry key *HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser* and restart Visual Studio.


## Next steps

If you are looking for more information, you can check out:

+ [PowerShell docs on GitHub](https://github.com/Azure/azure-powershell)
+ [Step-by-step instruction on connecting to Resource Management](https://blogs.msdn.microsoft.com/azuregov/2015/10/08/configuring-arm-on-azure-gc/)
+ [Azure PowerShell docs on MSDN](https://msdn.microsoft.com/library/mt619274.aspx)

For supplemental information and updates subscribe to the [Microsoft Azure Government Blog] (https://blogs.msdn.microsoft.com/azuregov/)
