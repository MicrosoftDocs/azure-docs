**Tool to generate the dangling domains for a tenant (multiple subscriptions)**

This tool is to be used by Azure customers to list all domain chains that have a CNAME associated to an existing Azure resource that was created on their subscriptions or tenants. Alternatively, for customers like Contoso, who have the CNAMES in the other DNS services pointing to Azure resources, the customer can provide the CNAMEs in an input file to the tool. You can use this tool by executing this as a PowerShell script.

This tool can be used against the Azure resources listed at the bottom of this file. The tool extracts, or takes as inputs, all the CNAMES that the tenant has either within Azure DNS or fed as a file (in case CNAMES are in the external DNS system like in case of Contoso).

The following are the broad steps on how to use the tool:

1. Get all CNAMES (Option of querying all CNAMES for current tenant that you have acccess to, or take as input in a file)
2. Filter to those CNAME that have canonical name ending with well-known resource URLs: azurefd.net, blob.core.windows.net, azureedge.net etc.
3. For each CNAME in the above, check if a resource exists for this tenant that has the FQDN that matches with the canonical name in the CNAME.
4. For the CNAME records that do not have corresponding matching resource in the tenant, put it into a list of dangling sub-domains, while the CNAME records that do have corresponding matching resource in tenant goes into a separate list.
5. Make the complete list available to the customer in a tabulated and csv list that can be imported into Excel.

Some more details about each step:

**To get all CNAMES:**
  1. Query all subscriptions for your user account or tenant. Use [Get-AzureRmSubscription](https://docs.microsoft.com/en-us/powershell/module/azurerm.profile/get-azurermsubscription?view=azurermps-6.13.0)
  2. For each subscription get all resource groups. Use [Get-AzResourceGroup](https://docs.microsoft.com/en-us/powershell/module/az.resources/get-azresourcegroup?view=azps-4.4.0)
  3. For each Resource Group get all Zones. Use [Get-AzDnsZone](https://docs.microsoft.com/en-us/powershell/module/az.dns/get-azdnszone?view=azps-4.4.0)
  4. For each DNS Zone, Get all record sets of type CNAME. Use [Get-AzDnsrecordSet](https://docs.microsoft.com/en-us/powershell/module/az.dns/get-azdnsrecordset?view=azps-4.4.0)

1. Filter CNAMEs for the canonical name having ending part of URL as in table below.

| Service | Type | Example |
| --- | --- | --- |
| Azure Front Door | microsoft.network/frontdoors | abc .azurefd.net |
| Azure Blob Storage | microsoft.storage/storageaccounts | abc. blob.core.windows.net |
| Azure CDN | microsoft.cdn/profiles/endpoints | abc.azureedge.net |
| Public IP addresses | microsoft.network/publicipaddresses | abc.EastUs.cloudapp.azure.com |
| Azure Traffic Manager | microsoft.network/trafficmanagerprofiles | abc.trafficmanager.net |
| Azure Container Instance | microsoft.containerinstance/containergroups | abc.EastUs.azurecontainer.io |
| Azure API Management | microsoft.apimanagement/service | abc.azure-api.net |
| Azure App Service | microsoft.web/sites | abc.azurewebsites.net |
| Azure App Service - Slots | microsoft.web/sites/slots | abc-def.azurewebsites.net |



> ℹ️ **_NOTE:_**  The script only works on zones and resources the user has the access to in the subscription. If you are a Global Tenant Admin you can elevate your account to get access to all of the subscriptions under your tenant.  To do this, go [here:](https://docs.microsoft.com/en-us/azure/role-based-access-control/elevate-access-global-admin)


**How to use the tool.**

Generate dangling DNS records list from given CName list (Csv/Json file) and/or using Azure resource graphs based on the user authentication running the script.

**Prerequisites:**

- Azure subscription with read access to Azure resource graph

- Appropriate permission to be able download, install the required AZ libraries

There are 2 versions of the script, both have the same input params and produce similar output.

```powershell
Get-DanglingDnsRecordsPsCore.ps1

- Parallel mode is supported only in PowerShell version 7 and higher, else will run serial mode.

Get-DanglingDnsRecordsPsDesktop.ps1 – meant for PowerShell desktop version (version lower than 6)

- Only supported in PowerShell desktop/version lower than 6, as this script is using windows workflows.
```

**Input params:**

```powershell
-InputFileDNSRecords 

Input Csv/Json filename with (CName, FQDN mapping), default None

-FetchDnsRecordsFromAzureSubscription

Switch to express the intent to query azure subscriptions, default off.

-FileAndAzureSubscription 

Switch to express the intent to fetch DNS records from both input file and from Azure DNS records, default off.

-InputSubscriptionIdRegexFilter 

Filter to run the query against matching subscription Ids, default match all.

-InputDnsZoneNameRegexFilter 

Filter to run the query against matching DNS zone names, default match all.

-InputInterestedDnsZones 

Filter to match the target matching domain zone names, default match all.

-OutputFileLocation 

Location of the output files produced; default current directory.
```

**Help:**

To get more help with the current params

```powershell
Get-Help .\Get-DanglingDnsRecordsPsCore.ps1

Get-Help .\Get-DanglingDnsRecordsPsDesktop.ps1

```

To get examples

```powershell
Get-Help .\Get-DanglingDnsRecordsPsCore.ps1 -Examples

Get-Help .\Get-DanglingDnsRecordsPsDesktop.ps1 -Examples

```
**Input Examples:**

To fetch DNS records from an Azure subscription

```powershell

.\Get-DanglingDnsRecordsPsCore.ps1 -FetchDnsRecordsFromAzureSubscription

To fetch DNS records from Input file Csv/Json

.\Get-DanglingDnsRecordsPsCore.ps1 -InputFileDnsRecords .\CNameDNSMap.csv

To fetch DNS records from both the input file and an Azure subscription

.\Get-DanglingDnsRecordsPsCore.ps1 -InputFileDnsRecords .\CNameDNSMap.csv -FileAndAzureSubscription

To fetch DNS records from Azure subscription with Subscription Id and DNS zone filters to reduce the scope of search.

.\Get-DanglingDnsRecordsPsCore.ps1 -FetchDnsRecordsFromAzureSubscription -InputSubscriptionIdRegexFilter 533 -InputDnsZoneNameRegexFilter testdnszone-1.a

```

**Example output:**

 ``` 
Found 87 CName records missing Azure resources; saved the file as: .\AzureCNameMissingResources.csv Output files contain dangling DNS records that needs further investigation.

Fetched 1 Azure resources; Saved the file as: .\AzureResources.csv

Fetched 63 Azure CName records; Saved the file as: .\AzureDnsCNameRecordSets.csv

Processed 24 CName records from input file: .\CNameDNSMap.csv

NameOfProcessSection : Time in Milliseconds

InputFileProcessingTime : 24

AzureLibrariesLoadTime : 3

AzureResourcesFetchTime : 2548

AzureDnsRecordsFetchTime : 10250

InputDnsCNameListProcessingTime : 3

AzureCNameListProcessingTime : 10

SummarizeTime : 11

ScriptExectionTime : 19754

TypeOfRecords : Details

ProcessedType : Parallel

AzureSubscriptions : 1

AzureResources : 1

AzureDnsZones : 1

AzureDnsRecordSets : 88

InputDnsCNameList : 24

AzureDnsCNameRecordSets : 63

AzureCNameMatchingResources : 0

AzureCNameMissingResources : 87
``` 
``` 
AzureResourceProviderName AzureResourceCount AzureCNameMatchingResources AzureCNameMissingResources
------------------------- ------------------ --------------------------- --------------------------
Azure API Management                       0                           0                          7 ( Dangling DNS records needs attention if count is more than 0)
Azure Container Instance                   0                           0                          7
Azure CDN                                  0                           0                         10
Azure Front Door                           0                           0                         12
Azure App Service                          0                           0                         16
Azure Blob Storage                         1                           0                         24
Azure Public IP addresses                  0                           0                          7
Azure Classic Cloud                        0                           0                          0
Azure Traffic Manager                      0                           0                          0
Azure Xbox                                 0                           0                          
 ``` 
