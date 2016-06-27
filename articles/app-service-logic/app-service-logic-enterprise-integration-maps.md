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

# Maps

## Overview
Enterprise integration uses maps to transform XML data from one format to another format. 

## What is a map?
A map is an XML document that defines who data in a document should be transformed into another format. 

## Why use maps?
Let's assume you regularly receive B2B orders or invoices from a customers who uses the YYYMMDD format for dates. However, in your organization, you store dates in the MMDDYYY format. You can use a map to *transform* the YYYMMDD date format into the MMDDYYY before storing the order or invoice details in your customer activity database.

## How to upload a map?
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
3. Select the **integration account** to which you will add the map  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
4.  Select the **Maps** tile  
![](./media/app-service-logic-enterprise-integration-maps/map-1.png)
5. Select the **Add** button in the Maps blade that opens  
![](./media/app-service-logic-enterprise-integration-maps/map-2.png)
6. Enter a **Name** for your map, then to upload the map file, select the folder icon on the right side of the **Map** text box. After the upload process is completed, select the **OK** button.  
![](./media/app-service-logic-enterprise-integration-maps/map-3.png) 
7. The map is now being provisioned into your integration account. This will receive an onscreen notification that indicates the success or failure of adding the map file. Select the **Maps** tile, you will then see your newly added map in the Maps blade:    

8. Select the **Maps** tile. This refreshes the tile and you should see the number of maps increase, reflecting the new map that has been added successfully.    
![](./media/app-service-logic-enterprise-integration-maps/map-4.png) 

## How to upload a map using PowerShell

````
#Create metadata

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

#Map content file path

$mapFilePath = "<your map file path>" # e.g. "D:\Resources\Maps\SampleXsltMap.xsl

#Map content object created from file path

$mapContent = [IO.File]::ReadAllText($mapFilePath)

#Create a new integration account map

New-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap1" -MapDefinition $mapContent

#Create a new integration account map with metadata

New-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap2" -MapFilePath $mapFilePath -Metadata $newMetadata

#Create a new integration account map with optional parameters

New-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap31" -MapFilePath $mapFilePath -MapType "Xslt" -Metadata $newMetadata -ContentType "application/xml"

#Get integration account map by name

Get-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap1"

#Get integration account map by name using pipe input from resource group object

$RG | Get-AzureRmIntegrationAccountMap -Name $AccountName -MapName "integrationAccountMap1"

#Get all integration account maps in the integration account

Get-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName | Select Name, CreatedTime

#Update integration account map

Set-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap1" -Metadata $newMetadata -MapDefinition $mapContent

#Remove integration account map

Remove-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap1" -Force

#Remove integration account map

Remove-AzureRmIntegrationAccountMap -ResourceGroupName $ResourceGroupName -Name $AccountName -MapName "integrationAccountMap2" -Force

#Remove integration account map

$RG | Remove-AzureRmIntegrationAccountMap -Name $AccountName -MapName "integrationAccountMap3" -Force
```` 
//todo: update the images to the map images
## How to edit a map?
Follow these steps to edit a map that already exists in your integration account:  
1. Select the **Maps** tile
2. Select the map you wish to edit when the Maps blade opens up
3. On the **Update Maps** blade, select the **Update** link
4. Select the map file (XSLT file) you wish to upload by using the file picker dialog that opens up then select **Open** in the file picker
![](./media/app-service-logic-enterprise-integration-partners/edit-1.png)


## How to delete a map?
1. Select the **Maps** tile  
2. Select the map you wish to delete when the Maps blade opens up  
3. Select the **Delete** link    
![](./media/app-service-logic-enterprise-integration-maps/delete.png)  
4. Confirm you that you really intend to delete the map.  
![](./media/app-service-logic-enterprise-integration-maps/delete-confirmation-1.png)   


## Next Steps
