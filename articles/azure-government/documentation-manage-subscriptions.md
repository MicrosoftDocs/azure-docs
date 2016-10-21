Whether you are using Azure PowerShell to manage a large subscription through script or access features that are not currently available in the Azure Portal you will need to connect to Azure Government instead of Azure Public.  If you have used PowerShell in Azure Public, it is mostly the same.  The differences in Azure Government are:
•Connecting your account
•Region names

If you have not used PowerShell yet check out the Introduction to Azure PowerShell.

##Connecting to Azure Government with PowerhSell

When you start PowerShell you have to tell Azure PowerShell to connect to Azure Government by specifying an environment parameter.  The parameter will ensure that PowerShell is connecting to all of the correct endpoints (for more details see ‘Going Deeper’).  The collection of endpoints is determined when you connect log into your account.  Different APIs require different versions of the environment switch:


Service Management commands| Add-AzureAccount -Environment AzureUSGovernment
Resource Management commands | Add-AzureRmAccount -EnvironmentName AzureUSGovernment
Azure Active Directory commands | Connect-MsolService -AzureEnvironment UsGovernment
 

Note: Add-AzureRmAccount uses the EnvironmentName switch instead of Environment.

You may also use the Environment switch when connecting to a storage account using New-AzureStorageContext and specify AzureUSGovernment.

Determining Region

Once you are connected there is one additional difference – The regions used to target a service.  Every Azure cloud has different regions.  You can see them listed on the service availability page.   You normally use the region in the Location parameter for a command.

There is one catch.  The Azure Government regions need to be formatted slightly differently from the way they are listed for the PowerShell commands:
•US Gov Virginia = USGov Virginia
•US Gov Iowa = USGov Iowa

Note that there is no space between US and Gov when using the Location Parameter.

If you ever want to validate the available regions in Azure Government you can run the following commands and it will print the current list:

Get-AzureLocation

If you are curious about the available environments across Azure, you can run:

Get-AzureEnvironment

References

If you are looking for more information you can check out the following:
•PowerShell docs on GitHub
•Step-by-step instruction on connecting to Resource Management
•Azure PowerShell docs on MSDN
