---
title: Direct log ingestion in Azure Monitor walkthrough
description: Walkthrough for sending log data to Azure Monitor using custom logs API.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---

# Direct log ingestion in Azure Monitor walkthrough

## Prerequisites

- Workspace


## Register AAD application
The Data Collection Endpoint uses standard Azure Resource Manager (ARM) authentication. Any ARM authentication scheme is supported. This walkthrough uses the Application ID and an Application Key (similar to logging in using a username and password) as a simple authentication scheme. This will follow the Client Credential Grant Flow scheme for authentication. 

Select **App Registrations** from the **Azure Active Directory** menu in the Azure portal and then click **New registration**.

:::image type="content" source="media/direct-ingestion-walkthrough/aad-registration.png" alt-text="Screenshot of AAD registration" lightbox="media/direct-ingestion-walkthrough/aad-registration.png":::

Provide a name for the application that will be descriptive to you. Modify the **supported account types** if necessary for your security requirements.

:::image type="content" source="media/direct-ingestion-walkthrough/aad-registration-configuration.png" alt-text="Screenshot of AAD registration configuration" lightbox="media/direct-ingestion-walkthrough/aad-registration-configuration.png":::

When the application is registered, note the **Application (client) ID** and **Directory (tenant) ID** since you will require these values 

:::image type="content" source="media/direct-ingestion-walkthrough/aad-registration-details.png" alt-text="Screenshot of AAD registration details" lightbox="media/direct-ingestion-walkthrough/aad-registration-details.png":::

With the application registered, you to generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets**, then **New client secret**. Specify a name to identify the secret's purpose and an expiration time and then click **Add**. 

:::image type="content" source="media/direct-ingestion-walkthrough/aad-registration-client-secret.png" alt-text="Screenshot of AAD registration client secret" lightbox="media/direct-ingestion-walkthrough/aad-registration-client-secret.png":::

Copy the string in the **Value** field for later use. You cannot retrieve this value again once you navigate away from this page.

:::image type="content" source="media/direct-ingestion-walkthrough/aad-registration-client-secret-value.png" alt-text="Screenshot of AAD registration client secret value" lightbox="media/direct-ingestion-walkthrough/aad-registration-client-secret-value.png":::

## Create new table to receive data
You need to create a table to receive the data. This walkthrough uses a custom table, but you can also write to existing Microsoft tables. There is currently no option in the portal to perform this function, so the walkthrough will use REST calls using PowerShell.

Select your workspace from the **Log Analytics workspaces** menu in the Azure portal. Select **Properties** and copy the **Resource ID** value.

:::image type="content" source="media/direct-ingestion-walkthrough/workspace-details.png" alt-text="Screenshot of workspace details" lightbox="media/direct-ingestion-walkthrough/workspace-details.png":::



Custom tables must have a name that ends with _CL.


## Next steps