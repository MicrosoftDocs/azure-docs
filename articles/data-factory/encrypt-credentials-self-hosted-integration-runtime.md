---
title: Encrypt credentials in Azure Data Factory | Microsoft Docs
description: Learn how to encrypt and store credentials for your on-premises data stores on a machine with self-hosted integration runtime. 
services: data-factory
documentationcenter: ''
author: nabhishek
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/15/2018
ms.author: abnarain

---

# Encrypt credentials for on-premises data stores in Azure Data Factory
You can encrypt and store credentials for your on-premises data stores (linked services with sensitive information) on a machine with self-hosted integration runtime. 

You pass a JSON definition file with credentials to the <br/>[**New-AzureRmDataFactoryV2LinkedServiceEncryptedCredential**](https://docs.microsoft.com/powershell/module/azurerm.datafactoryv2/New-AzureRmDataFactoryV2LinkedServiceEncryptedCredential?view=azurermps-4.4.0) cmdlet to produce an output JSON definition file with the encrypted credentials. Then, use the updated JSON definition to create the linked services.

## Author SQL Server linked service
Create a JSON file named **SqlServerLinkedService.json** in any folder with the following content:  

Replace `<servername>`, `<databasename>`, `<username>`, and `<password>` with values for your SQL Server before saving the file. And, replace `<integration runtime name>` with the name of your integration runtime. 

```json
{
	"properties": {
		"type": "SqlServer",
		"typeProperties": {
			"connectionString": {
				"type": "SecureString",
				"value": "Server=<servername>;Database=<databasename>;User ID=<username>;Password=<password>;Timeout=60"
			}
		},
		"connectVia": {
			"type": "integrationRuntimeReference",
			"referenceName": "<integration runtime name>"
		},
		"name": "SqlServerLinkedService"
	}
}
```

## Encrypt credentials
To encrypt the sensitive data from the JSON payload on an on-premises self-hosted integration runtime, run **New-AzureRmDataFactoryV2LinkedServiceEncryptedCredential**, and pass on the JSON payload. This cmdlet ensures the credentials are encrypted using DPAPI and stored on the self-hosted integration runtime node locally. The output payload can be redirected to another JSON file (in this case 'encryptedLinkedService.json'), which contains encrypted credentials.

```powershell
New-AzureRmDataFactoryV2LinkedServiceEncryptedCredential -DataFactoryName $dataFactoryName -ResourceGroupName $ResourceGroupName -Name "SqlServerLinkedService" -DefinitionFile ".\SQLServerLinkedService.json" > encryptedSQLServerLinkedService.json
```

## Use the JSON with encrypted credentials
Now, use the output JSON file from the previous command containing the encrypted credential to set up the **SqlServerLinkedService**.

```powershell
Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $ResourceGroupName -Name "EncryptedSqlServerLinkedService" -DefinitionFile ".\encryptedSqlServerLinkedService.json" 
```

## Next steps
For information about security considerations for data movement, see [Data movement security considerations](data-movement-security-considerations.md).

