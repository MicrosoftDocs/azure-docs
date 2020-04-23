---
title: Configure export settings in Azure API for FHIR
description: This article describes how to configure export settings in Azure API for FHIR
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 3/5/2020
ms.author: matjazl
---

# Configure export setting and export the data to a storage account

Azure API for FHIR supports $export command that allows you to export the data out of Azure API for FHIR account to a storage account.

There are four steps involved in performing export in Azure API for FHIR:

1. Enable Managed Identity on Azure API for FHIR Service
2. Creating a Azure storage account (if not done before) and assigning permission to Azure API for FHIR to the storage account
3. Selecting the storage account in Azure API for FHIR as export storage account
4. Executing the export by invoking $export command on Azure API for FHIR

## Enabling Managed Identity on Azure API for FHIR

First step in configuring Azure API for FHIR for export is to enable system wide managed identity on the service. You can read all about Managed Identities in Azure [here](../active-directory/managed-identities-azure-resources/overview.md).

To do so, navigate to Azure API for FHIR service and select Identity blade. Changing the status to On will enable managed identity in Azure API for FHIR Service.

![Enable Managed Identity](media/export-data/fhir-mi-enabled.png)

Now we can move to next step and create a storage account and assign permission to our service.

## Adding permission to storage account

Next step in export is to assign permission for Azure API for FHIR service to write to the storage account.

After we have created a storage account, navigate to Access Control (IAM) blade in Storage Account and select Add Role Assignments

![Enable Managed Identity](media/export-data/fhir-export-role-assignment.png)

Here we then add role Storage Blob Data Contributor to our service name.

![Enable Managed Identity](media/export-data/fhir-export-role-add.png)

Now we are ready for next step where we can select the storage account in Azure API for FHIR as a default storage account for $export.

## Selecting the storage account for $export

Final step before invoking $export command is to assign the Azure storage account that Azure API for FHIR will use to export the data to. To do this, navigate to Integration blade in Azure API for FHIR service in Azure portal and select the storage account 

![Enable Managed Identity](media/export-data/fhir-export-storage.png)

After that we are ready to export the data using $export command.

## Exporting the data using $export command

After we have configured Azure API for FHIR for export, we can now go and use the $export command to export the data out of the service into the storage account we specified. To learn how to invoke $export command in FHIR server, please read documentation on $export specification at [https://hl7.org/Fhir/uv/bulkdata/export/index.html](https://hl7.org/Fhir/uv/bulkdata/export/index.html)

> [!IMPORTANT]
> Note that currently Azure API for FHIR only supports System Level Export as defined in Export specification at [https://hl7.org/Fhir/uv/bulkdata/export/index.html](https://hl7.org/Fhir/uv/bulkdata/export/index.html). We also currently do not support query parameters with the $export.

>[!div class="nextstepaction"]
>[Additional Settings](azure-api-for-fhir-additional-settings.md)