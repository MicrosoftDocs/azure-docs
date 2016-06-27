<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Schemas  
- todo:

## Overview
- todo:

## What is a schema?
- todo:
-
## Why use a schema?
- todo:

## How to add a schema?
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  
3. Select the **integration account** to which you will add the schema    
![](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  
4.  Select the **Schemas** tile  
![](./media/app-service-logic-enterprise-integration-schemas/schema-1.png)  
5. Select the **Add** button in the Schemas blade that opens  
![](./media/app-service-logic-enterprise-integration-schemas/schema-2.png)  
6. Enter a **Name** for your schema, then to upload the schema file, select the folder icon on the right side of the **Schema** text box. After the upload process is completed, select the **OK** button.    
![](./media/app-service-logic-enterprise-integration-schemas/schema-3.png)  
7. Select the *bell* notification icon to see the progress of the schema upload process.  
![](./media/app-service-logic-enterprise-integration-schemas/schema-4.png)  
8. Select the **Schemas** tile. This refreshes the tile and you should see the number of schemas increase, reflecting the new schema has been added successfully. After you select the **Schemas** tile, you will also see the newly added partner is displayed in the Schemas blade, on the right.     
![](./media/app-service-logic-enterprise-integration-schemas/schema-5.png)  

## How to add a schema using PowerShell

````
$childItems = New-Object PSObject |
   Add-Member -PassThru NoteProperty Item1 'ChildItem' |
   Add-Member -PassThru NoteProperty Item2 1 |
   Add-Member -PassThru NoteProperty Item3 ("Prop1","Prop2","Prop3") 

$items = (New-Object PSObject |
   Add-Member -PassThru NoteProperty MyCustomProperty1 'Main' |
   Add-Member -PassThru NoteProperty MyCustomProperty2 $childItems
)
$metadata = $items | ConvertTo-JSON -Compress

#new metadata for update
$childnewItems = New-Object PSObject |
   Add-Member -PassThru NoteProperty Item1 'ChildItem' |
   Add-Member -PassThru NoteProperty Item2 1 

$newItems = (New-Object PSObject |
   Add-Member -PassThru NoteProperty Property1 'Main' |
   Add-Member -PassThru NoteProperty Property2 $childnewItems
)
$newMetadata = $newItems | ConvertTo-JSON -Compress

#Schema content file path
$schemaFilePath = "<your schema file path>" # e.g. "D:\Resources\Schemas\OrderFile.xsd

#Schema definition object created from a file
$schemaContent = [IO.File]::ReadAllText($schemaFilePath)
#Schema targetname space
$schemaTargetNamespace = "http://Inbound_EDI.OrderFile"

#Remove integration account schema
Remove-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema1" -Force
Remove-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema2" -Force
$RG | Remove-AzureRmIntegrationAccountSchema -Name $AccountName -SchemaName "integrationAccountSchema3" -Force
	
#Create integration Account Schema
$integrationAccountSchema1 = $RG | New-AzureRmIntegrationAccountSchema -Name $AccountName -SchemaName "integrationAccountSchema1" -SchemaDefinition $schemaContent -TargetNamespace $schemaTargetNamespace -Metadata $metadata

$integrationAccountSchema2 = New-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema2" -SchemaFilePath $schemaFilePath -TargetNamespace $schemaTargetNamespace -Metadata $newMetadata

$integrationAccountSchema3 = New-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema3" -SchemaFilePath $schemaFilePath -TargetNamespace $schemaTargetNamespace -SchemaType "Xml" -ContentType "application/xml" -Metadata $metadata

#Get integration Account Schema by name
Get-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema1"

#Get integration Account Schemas in the integration account
Get-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName

#Get integration Account Schemas in the integration account using pipe input from resource group object
$RG | Get-AzureRmIntegrationAccountSchema -Name $AccountName | Select Name, CreatedTime

#Update integration Account Schema
Set-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema1" -SchemaDefinition $schemaContent -TargetNamespace "http://tempuri.org" -Metadata $newMetadata
Set-AzureRmIntegrationAccountSchema -ResourceGroupName $ResourceGroupName -Name $AccountName -SchemaName "integrationAccountSchema2" -SchemaDefinition $schemaContent -TargetNamespace "http://tempuri.org" -Metadata $metadata

#Error Scenario: Error in update if integration account schema does not exists
$RG | Set-AzureRmIntegrationAccountSchema -Name $AccountName -SchemaName "integrationAccountSchema4" -SchemaDefinition $schemaContent 

````

## How to use schemas?
- todo: 

## How to edit shemas?
- todo:

## How to delete schemas?

## Next steps


      
