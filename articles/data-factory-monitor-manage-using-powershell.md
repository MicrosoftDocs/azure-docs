<properties title="Monitor and manage Azure Data Factory using Azure PowerShell" pageTitle="Monitor and manage Azure Data Factory using Azure PowerShell" description="Learn how to use Azure PowerShell to monitor and manage Azure data factories you have created." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Monitor and manage Azure Data Factory using Azure PowerShell
The following table lists cmdlets you can use monitor and manage Azure data factories by using Azure PowerShell.


- [Get-AzureDataFactory](#get-azuredatafactory)
- [Get-AzureDataFactoryLinkedService](#get-azuredatafactorylinkedservice)
- [Get-AzureDataFactoryTable](#get-azuredatafactorytable)


##<a name="get-azuredatafactory"></a>Get-AzureDataFactory
Gets the information about a specific data factory or all data factories in an Azure subscription within the specified resource group.
 
###Example 1

    Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup

This command returns all the data factories in the resource group ADFTutorialResourceGroup.
 
###Example 2

    Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactory

This command returns details about the ADFTutorialDataFactory datafactory in the resource group ADFTutorialResourceGroup. 

## <a name="get-azuredatafactorylinkedservice"></a> Get-AzureDataFactoryLinkedService ##
The Get-AzureDataFactoryLinkedService cmdlet gets information about a specific linked service or all linked services in an Azure data factory.

### Example 1 ###

    Get-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
 
This command returns information about all linked services in the Azure data factory ADFTutorialDataFactory.

### Example 2

    Get-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name MyBlobStore

This command returns information about the linked service MyBlobStore in the Azure data factoryADFTutorialDataFactory.

## <a name="get-azuredatafactorytable"></a> Get-AzureDataFactoryTable
The Get-AzureDataFactoryTable cmdlet gets information about a specific table or all tables in an Azure data factory. 

### Example 1

    Get-AzureDataFactoryTable -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory

This command returns information about all tables in the Azure data factory ADFTutorialDataFactory.

### Example 2

    Get-AzureDataFactoryTable -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name EmpTableFromBlob

This command returns information about the table EmpTableFromBlob in the Azure data factory ADFTutorialDataFactory.
