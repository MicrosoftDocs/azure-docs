---
title: 'Microsoft Entra Connect: ADSync PowerShell Reference'
description: This document provides reference information for the ADSync.psm1 PowerShell module.
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.topic: reference

ms.collection: M365-identity-device-management 
ms.custom:
---

# Microsoft Entra Connect: ADSync PowerShell Reference
The following documentation provides reference information for the `ADSync.psm1` PowerShell module that is included with Microsoft Entra Connect.


## Add-ADSyncADDSConnectorAccount

 ### SYNOPSIS
 This cmdlet resets the password for the service account and updates it both in Microsoft Entra ID and in the sync engine.

 ### SYNTAX

  #### byIdentifier
  ```powershell
     Add-ADSyncADDSConnectorAccount [-Identifier] <Guid> [-EACredential <PSCredential>] [<CommonParameters>]
  ```

 #### byName
 ```powershell
     Add-ADSyncADDSConnectorAccount [-Name] <String> [-EACredential <PSCredential>] [<CommonParameters>]
 ```

 ### DESCRIPTION
 This cmdlet resets the password for the service account and updates it both in Microsoft Entra ID and in the sync engine.

 ### EXAMPLES

 #### Example 1
   ```powershell
     PS C:\> Add-ADSyncADDSConnectorAccount -Name contoso.com -EACredential $EAcredentials
   ```

 Resets the password for the service account connected to contoso.com.

 ### PARAMETERS

   #### -EACredential
   Credentials for an Enterprise Administrator account in the Active Directory.

   ```yaml
     Type: PSCredential
     Parameter Sets: (All)
     Aliases:

     Required: False
     Position: Named
     Default value: None
     Accept pipeline input: False
     Accept wildcard characters: False
   ```

  #### -Identifier
  Identifier of the connector whose service account's password needs to be reset.

   ```yaml
     Type: Guid
     Parameter Sets: byIdentifier
     Aliases:

     Required: True
     Position: 0
     Default value: None
     Accept pipeline input: True (ByValue)
     Accept wildcard characters: False
   ```

  #### -Name
  Name of the connector.

   ```yaml
     Type: String
     Parameter Sets: byName
     Aliases:
 
     Required: True
     Position: 1
     Default value: None
     Accept pipeline input: True (ByValue)
     Accept wildcard characters: False
   ```

  #### CommonParameters
  This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

  #### System.Guid

  #### System.String

 ### OUTPUTS

  #### System.Object



## Disable-ADSyncExportDeletionThreshold

 ### SYNOPSIS
 Disables feature for deletion threshold at Export stage.

 ### SYNTAX
   
 ```powershell
    Disable-ADSyncExportDeletionThreshold [[-AADCredential] <PSCredential>] [-WhatIf] [-Confirm]
     [<CommonParameters>]
 ```

 ### DESCRIPTION
 Disables feature for deletion threshold at Export stage.

 ### EXAMPLES

 #### Example 1
 ```powershell
     PS C:\> Disable-ADSyncExportDeletionThreshold -AADCredential $aadCreds
 ```

 Uses the provided Microsoft Entra Credentials to disable the feature for export deletion threshold.

 ### PARAMETERS

  #### -AADCredential
  The Microsoft Entra credential.

  ```yaml
     Type: PSCredential
     Parameter Sets: (All)
     Aliases:

     Required: False
     Position: 1
     Default value: None
     Accept pipeline input: True (ByPropertyName)
     Accept wildcard characters: False
  ```

  #### -Confirm
  Parameter switch for prompting for confirmation.

 ```yaml
     Type: SwitchParameter
     Parameter Sets: (All)
     Aliases: cf

     Required: False
     Position: Named
     Default value: None
     Accept pipeline input: False
     Accept wildcard characters: False
 ```

  #### -WhatIf
  Shows what would happen if the cmdlet runs.
  The cmdlet is not run.

 ```yaml
     Type: SwitchParameter
     Parameter Sets: (All)
     Aliases: wi

     Required: False
     Position: Named
     Default value: None
     Accept pipeline input: False
     Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

  #### System.Management.Automation.PSCredential

 ### OUTPUTS

  #### System.Object

## Enable-ADSyncExportDeletionThreshold

 ### SYNOPSIS
 Enables Export Deletion threshold feature and sets a value for the threshold.

 ### SYNTAX

 ```powershell
 Enable-ADSyncExportDeletionThreshold [-DeletionThreshold] <UInt32> [[-AADCredential] <PSCredential>] [-WhatIf]
 [-Confirm] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Enables Export Deletion threshold feature and sets a value for the threshold.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Enable-ADSyncExportDeletionThreshold -DeletionThreshold 777 -AADCredential $aadCreds
 ```

 Enables export deletion threshold feature and sets the deletion threshold to 777.

 ### PARAMETERS

 #### -AADCredential
 The Microsoft Entra credential.

 ```yaml
 Type: PSCredential
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 2
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -DeletionThreshold
 The deletion threshold.

 ```yaml
 Type: UInt32
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.UInt32
 
 #### System.Management.Automation.PSCredential

 ### OUTPUTS

 #### System.Object


## Get-ADSyncAutoUpgrade

 ### SYNOPSIS
 Gets the status of AutoUpgrade on your installation.

 ### SYNTAX

 ```powershell
 Get-ADSyncAutoUpgrade [-Detail] [<CommonParameters>]
 ``` 

 ### DESCRIPTION
 Gets the status of AutoUpgrade on your installation.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncAutoUpgrade -Detail
 ```

 Returns the AutoUpgrade status of the installation and shows the suspension reason if AutoUpgrade is suspended.

 ### PARAMETERS

 #### -Detail
 If the AutoUpgrade state is suspended, using this parameter shows the suspension reason.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 1
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object

## Get-ADSyncCSObject

 ### SYNOPSIS
 Gets the specified Connector Space object.

 ### SYNTAX
 
 #### SearchByIdentifier
 ```powershell
 Get-ADSyncCSObject [-Identifier] <Guid> [<CommonParameters>]
 ```
 
 #### SearchByConnectorIdentifierDistinguishedName
 ```powershell
 Get-ADSyncCSObject [-ConnectorIdentifier] <Guid> [-DistinguishedName] <String> [-SkipDNValidation] [-Transient]
 [<CommonParameters>]
 ```

 #### SearchByConnectorIdentifier
 ```powershell
 Get-ADSyncCSObject [-ConnectorIdentifier] <Guid> [-Transient] [-StartIndex <Int32>] [-MaxResultCount <Int32>]
 [<CommonParameters>]
 ```

 #### SearchByConnectorNameDistinguishedName
 ```powershell
 Get-ADSyncCSObject [-ConnectorName] <String> [-DistinguishedName] <String> [-SkipDNValidation] [-Transient]
 [<CommonParameters>]
 ```

 #### SearchByConnectorName
 ```powershell
 Get-ADSyncCSObject [-ConnectorName] <String> [-Transient] [-StartIndex <Int32>] [-MaxResultCount <Int32>]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets the specified Connector Space object.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncCSObject -ConnectorName "contoso.com" -DistinguishedName "CN=fabrikam,CN=Users,DC=contoso,DC=com"
 ```

 Gets the CS object for the user fabrikam in the contoso.com domain.

 ### PARAMETERS

 #### -ConnectorIdentifier
 The identifier of the connector.

 ```yaml
 Type: Guid
 Parameter Sets: SearchByConnectorIdentifierDistinguishedName, SearchByConnectorIdentifier 
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ConnectorName
 The name of the connector.

 ```yaml
 Type: String
 Parameter Sets: SearchByConnectorNameDistinguishedName, SearchByConnectorName
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -DistinguishedName
 The distinguished name of the connector space object.

 ```yaml
 Type: String
 Parameter Sets: SearchByConnectorIdentifierDistinguishedName, SearchByConnectorNameDistinguishedName
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Identifier
 The identifier of the connector space object.

 ```yaml
 Type: Guid
 Parameter Sets: SearchByIdentifier
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -MaxResultCount
 The max count of the result set.

 ```yaml
 Type: Int32
 Parameter Sets: SearchByConnectorIdentifier, SearchByConnectorName
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -SkipDNValidation
 Parameter Switch to Skip DN validation.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: SearchByConnectorIdentifierDistinguishedName, SearchByConnectorNameDistinguishedName
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -StartIndex
 The start index to return the count from.

 ```yaml
 Type: Int32
 Parameter Sets: SearchByConnectorIdentifier, SearchByConnectorName
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Transient
 Parameter Switch to get Transient CS objects.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: SearchByConnectorIdentifierDistinguishedName, SearchByConnectorIdentifier, SearchByConnectorNameDistinguishedName, SearchByConnectorName
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object

## Get-ADSyncCSObjectLog

 ### SYNOPSIS
 Gets connector space object log entries.

 ### SYNTAX

 ```powershell
 Get-ADSyncCSObjectLog [-Identifier] <Guid> [-Count] <UInt32> [<CommonParameters>]
 ```
 
 ### DESCRIPTION
 Gets connector space object log entries.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncCSObjectLog -Identifier "00000000-0000-0000-0000-000000000000" -Count 1
 ```

 Returns one object with the specified identifier.

 ### PARAMETERS

 #### -Count
 Expected maximum number of connector space object log entries to retrieve.

 ```yaml
 Type: UInt32
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Identifier
 The connector space object identifier.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object

## Get-ADSyncDatabaseConfiguration

 ### SYNOPSIS
 Gets the configuration of the ADSync Database.
 
 ### SYNTAX

 ```powershell
 Get-ADSyncDatabaseConfiguration [<CommonParameters>]
 ```
 
 ### DESCRIPTION
 Gets the configuration of the ADSync Database.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncDatabaseConfiguration
 ```

 Gets the configuration of the ADSync Database.

 ### PARAMETERS

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Get-ADSyncExportDeletionThreshold

 ### SYNOPSIS
 Gets the export deletion threshold from Microsoft Entra ID.

 ### SYNTAX

 ```powershell
 Get-ADSyncExportDeletionThreshold [[-AADCredential] <PSCredential>] [-WhatIf] [-Confirm] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets the export deletion threshold from Microsoft Entra ID.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncExportDeletionThreshold -AADCredential $aadCreds
 ```

 Gets the export deletion threshold from Microsoft Entra ID using the specified Microsoft Entra credentials.

 ### PARAMETERS

 #### -AADCredential
 The Microsoft Entra credential.

 ```yaml
 Type: PSCredential
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 1
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.Management.Automation.PSCredential

 ### OUTPUTS

 #### System.Object


## Get-ADSyncMVObject

 ### SYNOPSIS
 Gets a metaverse object.

 ### SYNTAX

 ```powershell
 Get-ADSyncMVObject -Identifier <Guid> [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets a metaverse object.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncMVObject -Identifier "00000000-0000-0000-0000-000000000000"
 ```

 Gets metaverse object with the specified identifier.

 ### PARAMETERS

 #### -Identifier
 The identifier of the metaverse object.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object

## Get-ADSyncRunProfileResult

 ### SYNOPSIS
 Processes the inputs from the client and retrieves the run profile result(s).

 ### SYNTAX

 ```powershell
 Get-ADSyncRunProfileResult [-RunHistoryId <Guid>] [-ConnectorId <Guid>] [-RunProfileId <Guid>]
 [-RunNumber <Int32>] [-NumberRequested <Int32>] [-RunStepDetails] [-StepNumber <Int32>] [-WhatIf] [-Confirm]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Processes the inputs from the client and retrieves the run profile result(s).

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncRunProfileResult -ConnectorId "00000000-0000-0000-0000-000000000000"
 ```

 Retrieves all sync run profile results for the specified connector.

 ### PARAMETERS

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ConnectorId
 The connector identifier.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -NumberRequested
 The maximum number of returns.

 ```yaml
 Type: Int32
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunHistoryId
 The identifier of a specific run.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunNumber
 The run number of a specific run.

 ```yaml
 Type: Int32
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunProfileId
 The run profile identifier of a specific run.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunStepDetails
 Parameter switch for Run Step Details.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -StepNumber
 Filters by step number.

 ```yaml
 Type: Int32
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Get-ADSyncRunStepResult

 ### SYNOPSIS
 Gets the AD Sync Run Step Result.

 ### SYNTAX

 ```powershell
 Get-ADSyncRunStepResult [-RunHistoryId <Guid>] [-StepHistoryId <Guid>] [-First] [-StepNumber <Int32>] [-WhatIf]
 [-Confirm] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets the AD Sync Run Step Result.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncRunStepResult -RunHistoryId "00000000-0000-0000-0000-000000000000"
 ```

 Gets the AD Sync Run Step Result of the specified run.

 ### PARAMETERS

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -First
 Parameter switch for getting only the first object.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunHistoryId
 The ID of a specific run.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -StepHistoryId
 The ID of a specific run step.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -StepNumber
 The step number.

 ```yaml
 Type: Int32
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object



## Get-ADSyncScheduler

 ### SYNOPSIS
 Gets the current synchronization cycle settings for the sync scheduler.

 ### SYNTAX

 ```powershell
 Get-ADSyncScheduler [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets the current synchronization cycle settings for the sync scheduler.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Get-ADSyncScheduler
 ```

 Gets the current synchronization cycle settings for the sync scheduler.

 ### PARAMETERS

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object

## Get-ADSyncSchedulerConnectorOverride

 ### SYNOPSIS
 Gets the AD Sync Scheduler override values for the specified connector(s).

 ### SYNTAX

 ```powershell
 Get-ADSyncSchedulerConnectorOverride [-ConnectorIdentifier <Guid>] [-ConnectorName <String>]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Gets the AD Sync Scheduler override values for the specified connector(s).

 ### EXAMPLES

 #### Example 1 
 ```powershell
 PS C:\> Get-ADSyncSchedulerConnectorOverride -ConnectorName "contoso.com"
 ```

 Gets the AD Sync Scheduler override values for the 'contoso.com' connector.

 #### Example 2
 ```powershell
 PS C:\> Get-ADSyncSchedulerConnectorOverride
 ```

 Gets all AD Sync Scheduler override values.

 ### PARAMETERS

 #### -ConnectorIdentifier
 The connector identifier.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ConnectorName
 The connector name.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Invoke-ADSyncCSObjectPasswordHashSync

 ### SYNOPSIS
 Synchronize password hash for the given AD connector space object.

 ### SYNTAX

 #### SearchByDistinguishedName
 ```powershell
 Invoke-ADSyncCSObjectPasswordHashSync [-ConnectorName] <String> [-DistinguishedName] <String>
 [<CommonParameters>]
 ```

 #### SearchByIdentifier
 ```powershell
 Invoke-ADSyncCSObjectPasswordHashSync [-Identifier] <Guid> [<CommonParameters>]
 ```

 #### CSObject
 ```powershell
 Invoke-ADSyncCSObjectPasswordHashSync [-CsObject] <CsObject> [<CommonParameters>]
 ```

 ### DESCRIPTION
 Synchronize password hash for the given AD connector space object.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Invoke-ADSyncCSObjectPasswordHashSync -ConnectorName "contoso.com" -DistinguishedName "CN=fabrikam,CN=Users,DN=contoso,DN=com"
 ```

 Synchronizes password hash for the specified object.

 ### PARAMETERS

 #### -ConnectorName
 The name of the connector.

 ```yaml
 Type: String
 Parameter Sets: SearchByDistinguishedName
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -CsObject
 Connector space object.

 ```yaml
 Type: CsObject
 Parameter Sets: CSObject
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -DistinguishedName
 Distinguished Name of the connector space object.

 ```yaml
 Type: String
 Parameter Sets: SearchByDistinguishedName
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Identifier
 The identifier of the connector space object.

 ```yaml
 Type: Guid
 Parameter Sets: SearchByIdentifier
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Invoke-ADSyncRunProfile

 ### SYNOPSIS
 Invokes a specific run profile.

 ### SYNTAX

 #### ConnectorName
 ```powershell
 Invoke-ADSyncRunProfile -ConnectorName <String> -RunProfileName <String> [-Resume] [<CommonParameters>]
 ```

 #### ConnectorIdentifier
 ```powershell
 Invoke-ADSyncRunProfile -ConnectorIdentifier <Guid> -RunProfileName <String> [-Resume] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Invokes a specific run profile.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Invoke-ADSyncRunProfile -ConnectorName "contoso.com" -RunProfileName Export
 ```

 Invokes an export on the 'contoso.com' connector.

 ### PARAMETERS

 #### -ConnectorIdentifier
 Identifier of the Connector.

 ```yaml
 Type: Guid
 Parameter Sets: ConnectorIdentifier
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -ConnectorName
 Name of the Connector.

 ```yaml
 Type: String
 Parameter Sets: ConnectorName
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -Resume
 Parameter switch to attempt to resume a previously stalled/half-finished RunProfile.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -RunProfileName
 Name of the run profile to invoke on the selected Connector.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.String

 #### System.Guid

 ### OUTPUTS

 #### System.Object


## Remove-ADSyncAADServiceAccount

 ### SYNOPSIS
 Deletes an/all existing Microsoft Entra service account(s) in the Microsoft Entra tenant (associated with the specified credentials).

 ### SYNTAX

 #### ServiceAccount
 ```powershell
 Remove-ADSyncAADServiceAccount [-AADCredential] <PSCredential> [-Name] <String> [-WhatIf] [-Confirm]
 [<CommonParameters>]
 ```

 #### ServicePrincipal
 ```powershell
 Remove-ADSyncAADServiceAccount [-ServicePrincipal] [-WhatIf] [-Confirm] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Deletes an/all existing Microsoft Entra service account(s) in the Microsoft Entra tenant (associated with the specified credentials).

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Remove-ADSyncAADServiceAccount -AADCredential $aadcreds -Name contoso.com
 ```

 Deletes all existing Microsoft Entra service accounts in contoso.com.

 ### PARAMETERS

 #### -AADCredential
 The Microsoft Entra credential.

 ```yaml
 Type: PSCredential
 Parameter Sets: ServiceAccount
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Name
 The name of the account.

 ```yaml
 Type: String
 Parameter Sets: ServiceAccount
 Aliases:

 Required: True
 Position: 2
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -ServicePrincipal
 The service principal of the account.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: ServicePrincipal
 Aliases:

 Required: True
 Position: 3
 Default value: None
 Accept pipeline input: True (ByPropertyName)
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.Management.Automation.PSCredential

 #### System.String

 #### System.Management.Automation.SwitchParameter

 ### OUTPUTS

 #### System.Object


## Set-ADSyncAutoUpgrade

 ### SYNOPSIS
 Changes the AutoUpgrade state on your installation between Enabled and Disabled.

 ### SYNTAX

 ```powershell
 Set-ADSyncAutoUpgrade [-AutoUpgradeState] <AutoUpgradeConfigurationState> [[-SuspensionReason] <String>]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Sets the AutoUpgrade state on your installation. This  cmdlet should only be used to change AutoUpgrade state between Enabled and Disabled. Only the system should set the state to Suspended.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Set-ADSyncAutoUpgrade -AutoUpgradeState Enabled
 ```

 Sets the AutoUpgrade state to Enabled.

 ### PARAMETERS

 #### -AutoUpgradeState
 The AtuoUpgrade state. Accepted values: Suspended, Enabled, Disabled.

 ```yaml
 Type: AutoUpgradeConfigurationState
 Parameter Sets: (All)
 Aliases:
 Accepted values: Suspended, Enabled, Disabled

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -SuspensionReason
 The suspension reason. Only the system should set the AutoUpgrade state to suspended.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 1
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Set-ADSyncScheduler

 ### SYNOPSIS
 Sets the current synchronization cycle settings for the sync scheduler.

 ### SYNTAX

 ```powershell
 Set-ADSyncScheduler [[-CustomizedSyncCycleInterval] <TimeSpan>] [[-SyncCycleEnabled] <Boolean>]
 [[-NextSyncCyclePolicyType] <SynchronizationPolicyType>] [[-PurgeRunHistoryInterval] <TimeSpan>]
 [[-MaintenanceEnabled] <Boolean>] [[-SchedulerSuspended] <Boolean>] [-Force] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Sets the current synchronization cycle settings for the sync scheduler.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Set-ADSyncScheduler -SyncCycleEnabled $true
 ```

 Sets the current synchronization cycle setting for SyncCycleEnabled to True.
 
 ### PARAMETERS

 #### -CustomizedSyncCycleInterval
 Please specify the timespan value for custom sync interval you want to set.
 If you want to run on lowest allowed setting, please set this parameter to null.

 ```yaml
 Type: TimeSpan
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 0
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -Force
 Parameter switch for forcing the setting of a value.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 6
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -MaintenanceEnabled
 Parameter for setting MaintenanceEnabled.

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 4
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -NextSyncCyclePolicyType
 Parameter for setting NextSyncCyclePolicyType. Accepted values: Unspecified, Delta, Initial.

 ```yaml
 Type: SynchronizationPolicyType
 Parameter Sets: (All)
 Aliases:
 Accepted values: Unspecified, Delta, Initial

 Required: False
 Position: 2
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -PurgeRunHistoryInterval
 Parameter for setting PurgeRunHistoryInterval.

 ```yaml
 Type: TimeSpan
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 3
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -SchedulerSuspended
 Parameter for setting SchedulerSuspended.

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 5
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -SyncCycleEnabled
 Parameter for setting SyncCycleEnabled.

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 1
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.Nullable`1[[System.TimeSpan, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]

 #### System.Nullable`1[[System.Boolean, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]

 #### System.Nullable`1[[Microsoft.IdentityManagement.PowerShell.ObjectModel.SynchronizationPolicyType, Microsoft.IdentityManagement.PowerShell.ObjectModel, Version=1.4.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35]]

 #### System.Management.Automation.SwitchParameter

 ### OUTPUTS

 #### System.Object


## Set-ADSyncSchedulerConnectorOverride

 ### SYNOPSIS
 Sets the current synchronization cycle settings for the sync scheduler.

 ### SYNTAX

 #### ConnectorIdentifier
 ```powershell
 Set-ADSyncSchedulerConnectorOverride -ConnectorIdentifier <Guid> [-FullImportRequired <Boolean>]
 [-FullSyncRequired <Boolean>] [<CommonParameters>]
 ```

 #### ConnectorName
 ```powershell
 Set-ADSyncSchedulerConnectorOverride -ConnectorName <String> [-FullImportRequired <Boolean>]
 [-FullSyncRequired <Boolean>] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Sets the current synchronization cycle settings for the sync scheduler.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Set-ADSyncSchedulerConnectorOverride -Connectorname "contoso.com" -FullImportRequired $true
 -FullSyncRequired $false
 ```

 Sets the synchronization cycle settings for the 'contoso.com' connector to require full import and to not require full sync.

 ### PARAMETERS

 #### -ConnectorIdentifier
 The connector identifier.

 ```yaml
 Type: Guid
 Parameter Sets: ConnectorIdentifier
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -ConnectorName
 The connector name.

 ```yaml
 Type: String
 Parameter Sets: ConnectorName
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -FullImportRequired
 Set as true to require full import on the next cycle.

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -FullSyncRequired
 Set as true to require full sync on the next cycle.

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.Guid

 #### System.String

 #### System.Nullable`1[[System.Boolean, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]

 ### OUTPUTS

 #### System.Object


## Start-ADSyncPurgeRunHistory

 ### SYNOPSIS
 Cmdlet to purge run history older than specified timespan.

 ### SYNTAX

 #### online
 ```powershell
 Start-ADSyncPurgeRunHistory [[-PurgeRunHistoryInterval]  <TimeSpan>] [<CommonParameters>]
 ```

 #### offline
 ```powershell
 Start-ADSyncPurgeRunHistory [-Offline] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Cmdlet to purge run history older than specified timespan.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Start-ADSyncPurgeRunHistory -PurgeRunHistoryInterval (New-Timespan -Hours 5)
 ```

 Purges all run history older than 5 hours.

 ### PARAMETERS

 #### -Offline
 Purges all run history from the database while the service is offline.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: offline
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -PurgeRunHistoryInterval
 Interval for which history to preserve.

 ```yaml
 Type: TimeSpan
 Parameter Sets: online
 Aliases:

 Required: False
 Position: 0
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.TimeSpan

 ### OUTPUTS

 #### System.Object

## Start-ADSyncSyncCycle

 ### SYNOPSIS
 Triggers a synchronization cycle.

 ### SYNTAX

 ```powershell
 Start-ADSyncSyncCycle [[-PolicyType] <SynchronizationPolicyType>] [[-InteractiveMode] <Boolean>]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Triggers a synchronization cycle.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Start-ADSyncSyncCycle -PolicyType Initial
 ```

 Triggers a synchronization cycle with an Initial policy type.

 ### PARAMETERS

 #### -InteractiveMode
 Differentiates between interactive (command line) mode and script/code mode (calls from other code).

 ```yaml
 Type: Boolean
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 2
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -PolicyType
 The policy type to run. Accepted values: Unspecified, Delta, Initial.

 ```yaml
 Type: SynchronizationPolicyType
 Parameter Sets: (All)
 Aliases:
 Accepted values: Unspecified, Delta, Initial

 Required: False
 Position: 1
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.Nullable`1[[Microsoft.IdentityManagement.PowerShell.ObjectModel.SynchronizationPolicyType, Microsoft.IdentityManagement.PowerShell.ObjectModel, Version=1.4.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35]]

 #### System.Boolean

 ### OUTPUTS

 #### System.Object


## Stop-ADSyncRunProfile

 ### SYNOPSIS
 Finds and stops all or specified busy connectors.

 ### SYNTAX

 ```powershell
 Stop-ADSyncRunProfile [[-ConnectorName] <String>] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Finds and stops all or specified busy connectors.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Stop-ADSyncRunProfile -ConnectorName "contoso.com"
 ```

 Stops any running synchronization on 'contoso.com'.

 ### PARAMETERS

 #### -ConnectorName
 Name of the Connector.
 If this is not given, then all busy connectors will be stopped.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 0
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Stop-ADSyncSyncCycle

 ### SYNOPSIS
 Signals the server to stop the currently running sync cycle.

 ### SYNTAX

 ```powershell
 Stop-ADSyncSyncCycle [<CommonParameters>]
 ```

 ### DESCRIPTION
 Signals the server to stop the currently running sync cycle.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Stop-ADSyncSyncCycle
 ```

 Signals the server to stop the currently running sync cycle.

 ### PARAMETERS

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Sync-ADSyncCSObject

 ### SYNOPSIS
 Runs sync preview on connector space object.

 ### SYNTAX

 #### ConnectorName_ObjectDN
 ```powershell
 Sync-ADSyncCSObject -ConnectorName <String> -DistinguishedName <String> [-Commit] [<CommonParameters>]
 ```

 #### ConnectorIdentifier_ObjectDN
 ```powershell
 Sync-ADSyncCSObject -ConnectorIdentifier <Guid> -DistinguishedName <String> [-Commit] [<CommonParameters>]
 ```

 #### ObjectIdentifier
 ```powershell
 Sync-ADSyncCSObject -Identifier <Guid> [-Commit] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Runs sync preview on connector space object.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Sync-ADSyncCSObject -ConnectorName "contoso.com" -DistinguishedName "CN=fabrikam,CN=Users,DC=contoso,DC=com"
 ```

 Returns a sync preview for the specified object.

 ### PARAMETERS

 #### -Commit
 Parameter Switch for commit.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ConnectorIdentifier
 The identifier of the connector.

 ```yaml
 Type: Guid
 Parameter Sets: ConnectorIdentifier_ObjectDN
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ConnectorName
 The name of the connector.

 ```yaml
 Type: String
 Parameter Sets: ConnectorName_ObjectDN
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -DistinguishedName
 Distinguished Name of the connector space object.

 ```yaml
 Type: String
 Parameter Sets: ConnectorName_ObjectDN, ConnectorIdentifier_ObjectDN
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Identifier
 The identifier of the connector space object.

 ```yaml
 Type: Guid
 Parameter Sets: ObjectIdentifier
 Aliases:

 Required: True
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### None

 ### OUTPUTS

 #### System.Object


## Test-AdSyncAzureServiceConnectivity

 ### SYNOPSIS
 Investigates and identifies connectivity issues to Microsoft Entra ID.

 ### SYNTAX

 #### ByEnvironment
 ```powershell
 Test-AdSyncAzureServiceConnectivity [-AzureEnvironment] <Identifier> [[-Service] <AzureService>] [-CurrentUser]
 [<CommonParameters>]
 ```

 #### ByTenantName
 ```powershell
 Test-AdSyncAzureServiceConnectivity [-Domain] <String> [[-Service] <AzureService>] [-CurrentUser]
 [<CommonParameters>]
 ```

 ### DESCRIPTION
 Investigates and identifies connectivity issues to Microsoft Entra ID.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Test-AdSyncAzureServiceConnectivity -AzureEnvironment Worldwide -Service SecurityTokenService -CurrentUser
 ```

 Returns "True" if there are no connectivity issues.

 ### PARAMETERS

 #### -AzureEnvironment
 Azure environment to test. Accepted values: Worldwide, China, UsGov, Germany, AzureUSGovernmentCloud, AzureUSGovernmentCloud2, AzureUSGovernmentCloud3, PreProduction, OneBox, Default.

 ```yaml
 Type: Identifier
 Parameter Sets: ByEnvironment
 Aliases:
 Accepted values: Worldwide, China, UsGov, Germany, AzureUSGovernmentCloud, AzureUSGovernmentCloud2, AzureUSGovernmentCloud3, PreProduction, OneBox, Default

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -CurrentUser
 The user running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases:

 Required: False
 Position: 3
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -Domain
 The domain whose connectivity is being tested.

 ```yaml
 Type: String
 Parameter Sets: ByTenantName
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -Service
 The service whose connectivity is being tested.

 ```yaml
 Type: AzureService
 Parameter Sets: (All)
 Aliases:
 Accepted values: SecurityTokenService, AdminWebService

 Required: False
 Position: 2
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### Microsoft.Online.Deployment.Client.Framework.MicrosoftOnlineInstance+Identifier

 #### System.String

 #### System.Nullable`1[[Microsoft.Online.Deployment.Client.Framework.AzureService, Microsoft.Online.Deployment.Client.Framework, Version=1.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35]]

 #### System.Management.Automation.SwitchParameter

 ### OUTPUTS

 #### System.Object


## Test-AdSyncUserHasPermissions

 ### SYNOPSIS
 Cmdlet to check if ADMA user has required permissions.

 ### SYNTAX

 ```powershell
 Test-AdSyncUserHasPermissions [-ForestFqdn] <String> [-AdConnectorId] <Guid>
 [-AdConnectorCredential] <PSCredential> [-BaseDn] <String> [-PropertyType] <String> [-PropertyValue] <String>
 [-WhatIf] [-Confirm] [<CommonParameters>]
 ```

 ### DESCRIPTION
 Cmdlet to check if ADMA user has required permissions.

 ### EXAMPLES

 #### Example 1
 ```powershell
 PS C:\> Test-AdSyncUserHasPermissions -ForestFqdn "contoso.com" -AdConnectorId "00000000-0000-0000-000000000000"
 -AdConnectorCredential $connectorAcctCreds -BaseDn "CN=fabrikam,CN=Users,DC=contoso,DC=com" -PropertyType "Allowed-Attributes" -PropertyValue "name"
 ```

 Checks if ADMA user has permissions to access the 'name' property of the user 'fabrikam'.

 ### PARAMETERS

 #### -AdConnectorCredential
 AD Connector account credentials.

 ```yaml
 Type: PSCredential
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 2
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -AdConnectorId
 AD Connector ID.

 ```yaml
 Type: Guid
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 1
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -BaseDn
 Base DN of the object to check.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 3
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -Confirm
 Prompts you for confirmation before running the cmdlet.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: cf

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -ForestFqdn
 Name of the forest.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 0
 Default value: None
 Accept pipeline input: True (ByValue)
 Accept wildcard characters: False
 ```

 #### -PropertyType
 Permission type you are looking for. Accepted values: Allowed-Attributes, Allowed-Attributes-Effective, Allowed-Child-Classes, Allowed-Child-Classes-Effective.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 4
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -PropertyValue
 The value you are looking for in PropertyType attribute.

 ```yaml
 Type: String
 Parameter Sets: (All)
 Aliases:

 Required: True
 Position: 5
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### -WhatIf
 Shows what would happen if the cmdlet runs.
 The cmdlet is not run.

 ```yaml
 Type: SwitchParameter
 Parameter Sets: (All)
 Aliases: wi

 Required: False
 Position: Named
 Default value: None
 Accept pipeline input: False
 Accept wildcard characters: False
 ```

 #### CommonParameters
 This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

 ### INPUTS

 #### System.String

 #### System.Guid

 ### OUTPUTS

 #### System.Object

## Next Steps

- [What is hybrid identity?](./../whatis-hybrid-identity.md)
- [What is Microsoft Entra Connect and Connect Health?](whatis-azure-ad-connect.md)
