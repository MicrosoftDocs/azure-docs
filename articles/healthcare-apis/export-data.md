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
2. Creating a storage account (if not done before) and assigning permission to Azure API for FHIR to the storage account
3. Selecting the storage account in Azure API for FHIR as export storage account
4. Performing the export by invoking $export command on Azure API for FHIR

## Enabling Managed Identity on Azure API for FHIR

First step in configuring Azure API for FHIR for export is to enable system wide managed identity on the service. You can read all about Managed Identities in Azure [here](../active-directory/managed-identities-azure-resources/overview.md).

To do so, navigate to Azure API for FHIR service and select Identity blade. Changing the status to On will enable managed identity in Azure API for FHIR Service.

:::image type="content" source="media/export-data/FHIR-MI-Enabled.png" alt-text="Enable MI":::

Now we can move to next step and creater a storage account and assign permission to our service.

## Adding permission to storage account

Next step in export is to assign permission for Azure API for FHIR service to write to the storage account.

After we have created a storage account, we need to navigate to Access Control (AIM) blade in Storage Account and select Add Role Assignments

:::image type="content" source="media/export-data/FHIR-Export-Role-Assignment.png" alt-text="Enable MI":::

Here we then add role Storage Blob Data Contributor to our service name.

:::image type="content" source="media/export-data/FHIR-Export-Role-Add.png" alt-text="Enable MI":::

Now we are ready for next step where we can select the storage account in Azure API for FHIR as a default storage account for $export.

## Selecting the storage account for $export


