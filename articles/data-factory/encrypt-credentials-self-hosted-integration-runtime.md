---
title: Encrypt credentials in Azure Data Factory | Microsoft Docs
description: Learn how to encrypt and store credentials for your on-premises data stores on a machine with self-hosted integration runtime. 
services: data-factory
documentationcenter: ''
author: nabhishek
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/24/2017
ms.author: abnarain

---

# Encrypt credentials for on-premises data stores in Azure Data Factory
You can encrypt and store credentials for your on-premises data stores (linked services with sensitive information) on a machine with self-hosted integration runtime. You pass a JSON definition file with credentials to the **Set-AzureRmDataFactoryV2LinkedServiceEncryptCredential** cmdlet to produce an output JSON definition file with the encrypted credentials. Then, use the updated JSON definition to create the linked services.

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
To encrypt the sensitive data from the JSON payload on an on-premises self-hosted integration runtime, run **Set-AzureRmDataFactoryV2LinkedServiceEncryptCredential**, and pass on the JSON payload. This cmdlet ensures the credentials are encrypted using DPAPI and stored on the self-hosted integration runtime node locally. The output payload can be redirected to another JSON file (in this case 'encryptedLinkedService.json'), which contains encrypted credentials.

```powershell
Set-AzureRmDataFactoryV2LinkedServiceEncryptCredential -DataFactory $df -ResourceGroupName $ResourceGroupName -Name "SqlServerLinkedService" -File ".\SQLServerLinkedService.json" > encryptedSQLServerLinkedService.json
```

## Use the JSON with encrypted credentials
Now, use the output JSON file from the previous command containing the encrypted credential to set up the **SqlServerLinkedService**.

```powershell
Set-AzureRmDataFactoryV2LinkedService -DataFactory $df -ResourceGroupName $ResourceGroupName -Name "EncryptedSqlServerLinkedService" -File ".\encryptedSqlServerLinkedService.json" 
```

## Next steps
For information about security considerations for data movement, see [Data movement security considerations](data-movement-security-considerations.md).

