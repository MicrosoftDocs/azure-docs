<properties
    pageTitle="Azure Government Services | Microsoft Azure"
    description="Infomration on manager your subscription in Azure Government"
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


#  Managing and Connecting to you Subscription in Azure Goverment

##Connecting to Azure Government with PowerhSell

Whether you are using Azure PowerShell to manage a large subscription through script or access features that are not currently available in the Azure Portal you will need to connect to Azure Government instead of Azure Public.  If you have used PowerShell in Azure Public, it is mostly the same.  The differences in Azure Government are:

+ Connecting your account
+ Region names

>[AZURE.NOTE] If you have not used PowerShell yet, check out the [Introduction to Azure PowerShell](..\powershell-install-configure.md).

When you start PowerShell you have to tell Azure PowerShell to connect to Azure Government by specifying an environment parameter.  The parameter will ensure that PowerShell is connecting to all of the correct endpoints.  The collection of endpoints is determined when you connect log into your account.  Different APIs require different versions of the environment switch:

Connection Type | Command
---|----
[Service Management](https://msdn.microsoft.com/en-us/library/dn708504.aspx) commands | `Add-AzureAccount -Environment AzureUSGovernment`
[Resource Management](https://msdn.microsoft.com/en-us/library/mt125356.aspx) commands | `Add-AzureRmAccount -EnvironmentName AzureUSGovernment`
[Azure Active Directory](https://msdn.microsoft.com/en-us/library/azure/jj151815.aspx) commands | `Connect-MsolService -AzureEnvironment UsGovernment`
[Azure Active Directory command v2](https://msdn.microsoft.com/en-us/library/azure/mt757189.aspx) | `Connect-AzureAD -AzureEnvironmentName AzureUSGovernment`

You may also use the Environment switch when connecting to a storage account using New-AzureStorageContext and specify AzureUSGovernment.

###Determining Region

Once you are connected there is one additional difference – The regions used to target a service.  Every Azure cloud has different regions.  You can see them listed on the service availability page.   You normally use the region in the Location parameter for a command.

There is one catch.  The Azure Government regions need to be formatted slightly differently from the way they are listed for the PowerShell commands:

+ US Gov Virginia = USGov Virginia
+ US Gov Iowa = USGov Iowa

>[AZURE.NOTE] There is no space between US and Gov when using the Location Parameter.

If you ever want to validate the available regions in Azure Government you can run the following commands and it will print the current list:

 $Get-AzureLocation

If you are curious about the available environments across Azure, you can run:

 $Get-AzureEnvironment

##Next Steps

If you are looking for more information you can check out the following:

+ [PowerShell docs on GitHub](https://github.com/Azure/azure-powershell)
+ [Step-by-step instruction on connecting to Resource Management](https://blogs.msdn.microsoft.com/azuregov/2015/10/08/configuring-arm-on-azure-gc/)
+ [Azure PowerShell docs on MSDN](https://msdn.microsoft.com/en-us/library/mt619274.aspx)

For supplemental information and updates subscribe to the [Microsoft Azure Government Blog] (https://blogs.msdn.microsoft.com/azuregov/)
