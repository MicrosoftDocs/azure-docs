---
title: Copy billing roles from one MCA to another MCA across tenants with a script
titleSuffix: Microsoft Cost Management
description: Describes how to Copy billing roles from one MCA to another MCA across tenants using a PowerShell script.
author: bandersmsft
ms.reviewer: vkulkarni
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.author: banders
---

# Copy billing roles from one MCA to another MCA across tenants with a script

Subscription migration is automated using the Azure portal however, role migrations aren't. The information in this article helps Billing Account owners to automate role assignments when they consolidate Microsoft Customer Agreement (MCA) enterprise accounts. You can copy billing roles from one MCA enterprise account to another MCA enterprise account across tenants with a script. The following example scenario describes the overall process.

Contoso Ltd acquires Fabrikam, Inc. Both Contoso and Fabrikam have an MCA in their respective tenants. Contoso wants to bring billing management of Fabrikam subscriptions under its own Contoso MCA. Contoso also wants a separate invoice generated for Fabrikam subscriptions and to enable the assignment of users in the Fabrikam tenant to billing roles.

The Contoso MCA billing account owner uses the following process:

1. Associate the Fabrikam tenant with the Contoso MCA billing account.
1. Create a new billing profile for Fabrikam subscriptions.
1. Assign a billing profile owner role to a user in Fabrikam tenant.

Keep in mind that there are many other users that have billing roles in the source Fabrikam MCA at the billing account, billing profile, and several invoice section levels.

After the Fabrikam Billing Account Owner role on the source MCA has been given a Billing Account Owner role on the Contoso (target) MCA, they use the following sections to automate the billing role migration from their source MCA to the target MCA.

Use the following information to automate billing role migration from the source (Fabrikam) MCA to the target (Contoso) MCA. The script works at the **billing profile** scope.

## Prerequisites

- You must have **Billing account owner** role on the target MCA and Billing account owner or billing account contributor role on the source MCA.
- A storage account prepared for the script. For more information, see [Get started with AzCopy](../../storage/common/storage-use-azcopy-v10.md).

## Prepare the target environment

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary permissions to the target tenant MCA billing account.
1. Associate the source tenant with the target MCA billing account. For more information, see [Add an associated billing tenant](manage-billing-across-tenants.md#add-an-associated-billing-tenant).
1. Add the billing account owner from the associated tenant. For more information, see [Assign roles to users from the associated billing tenant](manage-billing-across-tenants.md#assign-roles-to-users-from-the-associated-billing-tenant).
1. In the target tenant, add billing profile and invoice section as needed.

## Prepare and run the script

Use the following steps to prepare and then run the script.

1. Copy the script example from the [Role migration script example](#role-migration-script-example) section.
1. Paste and then save the file locally as PS1 file.
1. Update the script with source to target mappings for:
   - `Tenant`
   - `Billing account`
   - `Billing profile`
   - `Invoice sections`
1. Sign in to the Azure portal (source tenant) and open Cloud Shell. If you're prompted to select between Bash and PowerShell, select **PowerShell**.  
    :::image type="content" source="./media/mca-role-migration/cloud-shell.png" alt-text="Screenshot showing the Cloud Shell symbol." lightbox="./media/mca-role-migration/cloud-shell.png" :::
1. If you used Bash previously, select **PowerShell** in the Cloud Shell toolbar.  
    :::image type="content" source="./media/mca-role-migration/bash-powershell.png" alt-text="Screenshot showing the PowerShell selection." lightbox="./media/mca-role-migration/bash-powershell.png" :::
1. Upload the PS1 file to your Azure Storage account.
1. Execute the PS1 file.
1. Authenticate to Azure Cloud Shell.
1. Verify that the roles are in the target MCA after the script runs.

## Role migration script example

You use the following example script to automate the migration of the billing role. The role is copied from the source MCA billing profile to the target MCA billing profile in a different tenant.

```powershell
## Define source target mapping for
##	1. Tenant
##	2. Billing Account
##	3. Billing Profile
##	4. Invoice Sections
##(source) MCA-E details
$tenantId = "" 
$billingAccount=""
$billingProfile = ""
##(destination) MCA-E details
$targetBillingProfile = ""
$targetTenantId = ""
$targerbillingAccout=""
## Invoice section mapping in hash table
$hash = @{
"" = ""; #invoice section 1
"" = ""; #invoice section 2
}
## Conect to Azure account using device authentication using tenantId
Connect-AzAccount -UseDeviceAuthentication -TenantId $tenantId
Set-AzContext -TenantId $tenantId
## Aquire access token for the current user
$var = Get-AzAccessToken
$auth = 'Bearer ' + $var.Token
#### Get Billing Account Role Assignments from source MCA-E
#define parameters for REST API call
$params = @{
    Uri         = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/"+ $billingAccount +"/billingRoleAssignments?api-version=2019-10-01-preview"
    Headers     = @{ 'Authorization' = $auth }
    Method      = 'GET'
    ContentType = 'application/json'
}
#### Call API with parameters defined above
$ret = Invoke-RestMethod @params 
####Initialize array lists 
$ArrayListBARoles = [System.Collections.Generic.List[string]]::new();
$ArrayListBPRoles = [System.Collections.Generic.List[string]]::new();
$ArrayListISRoles = [System.Collections.Generic.List[string]]::new();
#### Add each billing account role and principal id to array list 
#### Push down the billing accout role assignments to billing profile role assignments (replacong 5 series with 4 series)
foreach($j in $ret.value){                                                     
	$BANameArrayArray= $j.name -replace "500000", "500000" #-split '_'                                           
	foreach($i in $BANameArrayArray){
	 $ArrayListBARoles.Add($i)
	 }
 }
#### Get Billing Role assignments for billing profile
$paramsBPRoleAssignments = @{
	Uri         = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/"+$billingAccount +"/billingProfiles/" +$billingProfile +"/billingRoleAssignments?api-version=2019-10-01-preview"
    Headers     = @{ 'Authorization' = $auth }
    Method      = 'GET'
    ContentType = 'application/json'
		}
$retBPRoles = Invoke-RestMethod @paramsBPRoleAssignments 
####add each role to arraylist
foreach($k in $retBPRoles.value){                                                     
	$BPNameArrayArray= $k.name #-split '_'                                           
	foreach($l in $BPNameArrayArray){
	$ArrayListBPRoles.Add($l)
	}
}
#### Get Invoice sections for billing profile
$invoiceSections = Get-AzInvoiceSection -BillingAccountName $billingAccount -BillingProfile $billingProfile
for ($ii=0; $ii -lt $ArrayListBARoles.count;  $ii=$ii+1){ 
	$paramsBARoleCreation = @{
		Uri = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/"+$targerbillingAccout+"/createBillingRoleAssignment?api-version=2020-12-15-privatepreview"
		Headers     = @{ 'Authorization' = $auth }
		Method      = 'POST'
		ContentType = 'application/json'
		}
	$BodyBARoleCreation = @{
		principalTenantId = $tenantId
		roleDefinitionId = "/providers/Microsoft.Billing/billingAccounts/" +$targerbillingAccout +"/" +($ArrayListBARoles[$ii] -SPLIT '_')[0]
		principalId=($ArrayListBARoles[$ii] -SPLIT '_')[1]
		}
	$retBARoles = Invoke-RestMethod @paramsBARoleCreation -body @($BodyBARoleCreation | ConvertTo-Json)
}
#BILLING PROFILE	
for ($ii=0; $ii -lt $ArrayListBPRoles.count;  $ii=$ii+1){
	$paramsBPRoleCreation = @{
		Uri = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/" +$targerbillingAccout +"/billingProfiles/"+ $targetBillingProfile +"/createBillingRoleAssignment?api-version=2020-12-15-privatepreview"
		Headers     = @{ 'Authorization' = $auth }
		Method      = 'POST'
		ContentType = 'application/json'
	}
	$BodyBPRoleCreation = @{
		principalTenantId = $tenantId
		roleDefinitionId = "/providers/Microsoft.Billing/billingAccounts/" +$targerbillingAccout +"/billingProfiles/"+ $targetBillingProfile +"/" +($ArrayListBPRoles[$ii] -SPLIT '_')[0]
		principalId=($ArrayListBPRoles[$ii] -SPLIT '_')[1]
    }
	$retBPRoles = Invoke-RestMethod @paramsBPRoleCreation -body @($BodyBPRoleCreation | ConvertTo-Json)
}
#INVOICE SECTIONS
$targetinvoiceSection=""
#Get Roles for each invoice section
foreach ($m in $invoiceSections){
	if ($hash.ContainsKey($m.Name)){
		$targetinvoiceSection=$hash[$m.Name]
		'targetinvoiceSection'
		$targetinvoiceSection
		
	$paramsISRoleAssignments = @{
		Uri = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/" +$billingAccount +"/billingProfiles/" + $billingProfile +"/invoiceSections/" +$m.Name+ "/billingRoleAssignments?api-version=2019-10-01-preview"			
		Headers     = @{ 'Authorization' = $auth }
		Method      = 'GET'
		ContentType = 'application/json'
	}
	$retISRoles = Invoke-RestMethod @paramsISRoleAssignments 
	$ISNameArrayArray=$null
	$ArrayListISRoles = [System.Collections.Generic.List[string]]::new();
	foreach($n in $retISRoles.value){  
		$ISNameArrayArray= $n.name #-split '_'                                           
			foreach($o in $ISNameArrayArray){
				$ArrayListISRoles.Add($o)
			}
	}
		for ($ii=0; $ii -lt $ArrayListISRoles.count;  $ii=$ii+1){
			$paramsISRoleCreation = @{
				Uri = "https://management.azure.com/providers/Microsoft.Billing/billingAccounts/" +$targerbillingAccout+ "/billingProfiles/"+ $targetBillingProfile +"/invoiceSections/"+ $targetinvoiceSection +"/createBillingRoleAssignment?api-version=2020-12-15-privatepreview"
				Headers     = @{ 'Authorization' = $auth }
				Method      = 'POST'
				ContentType = 'application/json'
			}
			$BodyISRoleCreation = @{
				principalTenantId = $tenantId
				roleDefinitionId = "/providers/Microsoft.Billing/billingAccounts/" +$targerbillingAccout +"/billingProfiles/"+ $targetBillingProfile +"/invoiceSections/"+ $targetinvoiceSection+ "/" +($ArrayListISRoles[$ii] -SPLIT '_')[0]
				#userEmailAddress = ($graph.UserPrincipalName -Replace '_', '@' -split '#EXT#@' )[0]
				principalId=($ArrayListISRoles[$ii] -SPLIT '_')[1]
			}
			$resISRolesCreation= Invoke-RestMethod @paramsISRoleCreation -body @($BodyISRoleCreation | ConvertTo-Json)
		}
		}
}
```

## Next steps

- If necessary, give access to billing accounts, billing profiles, and invoice sections using the information at  [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).