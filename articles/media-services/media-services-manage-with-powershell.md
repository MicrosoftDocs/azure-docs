<properties 
	pageTitle="Manage Azure Media Services Accounts with PowerShell" 
	description="Learn how to manage Azure Media Services accounts with PowerShell cmdlets." 
	authors="Juliako" 
	manager="erikre" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/09/2016"
	ms.author="juliako"/>


#Manage Azure Media Services Accounts with PowerShell

> [AZURE.SELECTOR]
- [Portal](media-services-create-account.md)
- [PowerShell](media-services-manage-with-powershell.md)
- [REST](http://msdn.microsoft.com/library/azure/dn194267.aspx)

> [AZURE.NOTE] To be able to create an Azure Media Services account, you must have an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A8A8397B5" target="_blank">Azure Free Trial</a>.

##Overview 

This article lists the Azure PowerShell cmdlets for Azure Media Services (AMS) in the Azure Resource Manager framework. The cmdlets exist in the **Microsoft.Azure.Commands.Media** namespace.

## Versions

**ApiVersion**:   "2015-10-01"
               

## New-AzureRmMediaService

Creates a media service.

### Syntax

Parameter Set: StorageAccountIdParamSet

	New-AzureRmMediaService [-ResourceGroupName] <string> [-AccountName] <string> [-Location] <string> [-StorageAccountId] <string> [-Tags <hashtable>]  [<CommonParameters>]

Parameter Set: StorageAccountsParamSet

	New-AzureRmMediaService [-ResourceGroupName] <string> [-AccountName] <string> [-Location] <string> [-StorageAccounts] <PSStorageAccount[]> [-Tags <hashtable>]  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases | none
---|---
Required?   |  true
Position?   |  0
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters?  |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |Name
---|---
Required? |true
Position? |1
Default value |none
Accept pipeline input? |false
Accept wildcard characters? |false

**-Location &lt;String&gt;**

Specifies the resource location of the media service.

Aliases |none
---|---
Required? |true
Position? |2
Default value  |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**-StorageAccountId &lt;String&gt;**

Specifies a primary storage account that associated with the media service.

- New storage account (created with the Resource Manager API) supported only.

- The storage account must exist and has the same location with the media service.

Aliases |none
---|---
Required? |true
Position? |3
Default value  |none
Accept pipeline input? |true(ByPropertyName)
Parameter set name |StorageAccountIdParamSet
Accept wildcard characters?|false

**-StorageAccounts &lt;PSStorageAccount\[\]&gt;**

Specifies storage accounts that associated with the media service.

- New storage account (created with the Resource Manager API) supported only.

- The storage account must exist and has the same location with the media service.

- Only one storage account can be specified as primary.

Aliases |none
---|---
Required?  |true
Position?  |3
Default value |none
Accept pipeline input? |true(ByPropertyName)
Parameter set name |StorageAccountsParamSet
Accept wildcard characters? |false

**-Tags &lt;Hashtable&gt;**

Specifies a hash table of the tags that are associated with the media service.

- Example: @{"tag1"="value1";"tag2"=:value2"}

Aliases |none
---|---
Required?  |false
Position?  |named
Default value |none
Accept pipeline input? |false
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Set-AzureRmMediaService

Updates a media service.

### Syntax

	Set-AzureRmMediaService [-ResourceGroupName] <string> [-AccountName] <string> [-Tags <hashtable>] [-StorageAccounts <PSStorageAccount[]>]  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required?  |true
Position?  |0
Default Value |none
Accept Pipeline Input? |true(ByPropertyName)
Accept wildcard characters? |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |Name
---|---
Required? |True
Position? |1
Default value |None
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |False

**-StorageAccounts &lt;PSStorageAccount\[\]&gt;**

Specifies storage accounts that associated with the media service.

- New storage account (created with the Resource Manager API) supported only.

- The storage account must exist and has the same location with the media service.

- Only one storage account can be specified as primary.

Aliases |none
---|---
Required? |false
Position? |Named
Default value |none
Accept pipeline input? |true(ByPropertyName)
Parameter set name |StorageAccountsParamSet
Accept wildcard characters? |false

**-Tags &lt;Hashtable&gt;**

Specifies a hash table of the tags that are associated with this media service.

- The tags that are associated with the media service are replaced with value specified by the customer.

Aliases |none
---|---
Required? |False
Position?  |Named
Default value |None
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Remove-AzureRmMediaService

Removes a media service.

### Syntax

	Remove-AzureRmMediaService [-ResourceGroupName] <string> [-AccountName] <string>  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required? |true
Position? |0
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |none
---|---
Required? |true
Position? |2
Default value |None
Accept pipeline input?  |true(ByPropertyName)
Accept wildcard characters? |False

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Get-AzureRmMediaService

Gets all media services in a resource group or a media service with a given name.

### Syntax

ParameterSet: ResourceGroupParameterSet

	Get-AzureRmMediaService [-ResourceGroupName] <string>  [<CommonParameters>]	

ParameterSet: AccountNameParameterSet

	Get-AzureRmMediaService [-ResourceGroupName] <string> [-AccountName] <string>  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required? |true
Position?  |0
Default value |none
Accept pipeline input? |true(ByPropertyName)
Parameter set name |ResourceGroupParameterSet, AccountNameParameterSet
Accept wildcard characters?   false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |none
---|---
Required? |true
Position?  |1
Default value |none
Accept pipeline input? |true(ByPropertyName)
Parameter set name  |AccountNameParameterSet
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Get-AzureRmMediaServiceKeys

Gets keys of a media service.

### Syntax

	Get-AzureRmMediaServiceKeys [-ResourceGroupName] <string> [-AccountName] <string>  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required? |true
Position?  |0
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |none
---|---
Required? |true
Position? |1
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Set-AzureRmMediaServiceKey

Regenerates a primary or secondary key of a media service.

### Syntax

	Set-AzureRmMediaServiceKey [-ResourceGroupName] <string> [-AccountName] <string> [-KeyType] <KeyType> {Primary | Secondary}  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required?  |true
Position?  |0
Default value |none
Accept pipeline input?  |true(ByPropertyName)
Accept wildcard characters? |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |none
---|---
Required? |true
Position?  |1
Default value |none
Accept pipeline input?   |true(ByPropertyName)
Accept wildcard characters? |false

**-KeyType &lt;KeyType&gt;**

Specifies the key type of the media service.

- Primary or Secondary

Aliases |none
---|---
Required?  |true
Position?  |2
Default value |none
Accept pipeline input? |false
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the
cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Sync-AzureRmMediaServiceStorageKeys

Synchronizes storage account keys for a storage account associated with
the media service.

### Syntax

	Sync-AzureRmMediaServiceStorageKeys [-ResourceGroupName] <string> [-MediaServiceAccountName] <string>    [-StorageAccountName] <string>  [<CommonParameters>]

### Parameters

**-ResourceGroupName &lt;String&gt;**

Specifies the name of the resource group to which this media service belongs.

Aliases |none
---|---
Required? |true
Position? |0
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**-AccountName &lt;String&gt;**

Specifies the name of the media service.

Aliases |none
---|---
Required? |true
Position? |1
Default value |none
Accept pipeline input? |true(ByPropertyName)
Accept wildcard characters? |false

**-StorageAccountId &lt;String&gt;**

Specifies the storage account associated with the media service.

Aliases |Id
---|---
Required? |true
Position?  |2
Default value |none
Accept pipeline input? |      true(ByPropertyName)
Accept wildcard characters? |false

**&lt;CommandParameters&gt;**

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.

### Inputs

The input type is the type of the objects that you can pipe to the cmdlet.

### Outputs

The output type is the type of the objects that the cmdlet emits.

## Next step 

Check out Media Services learning paths.

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

 
