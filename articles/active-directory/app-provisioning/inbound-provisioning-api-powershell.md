---
title: Quick start for inbound provisioning to Azure Active Directory with PowerShell
description: Learn how to configure Inbound Provisioning API with PowerShell.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 06/30/2023
ms.author: kenwith
ms.reviewer: arvinh
---

# Quick start for inbound provisioning to Azure Active Directory with PowerShell

This document describes how to use PowerShell to configure the inbound provisioning API for Azure Active Directory (Azure AD). To perform the steps described in this doc, you need either the Azure AD Application Administrator or the Global Administrator role.  

Using the steps in this guide, you will be able to successfully convert a CSV file containing HR data into a SCIM bulk request payload and send it to the Azure AD inbound provisioning API endpoint. 

To help you with this conversion process, we are providing a sample PowerShell script that you can customize as per your requirements. You can download this script from the Inbound Provisioning Private Preview Teams folder.  

## Configure provisioning job for API-based data ingestion 

The following steps successfully configure out-of-the-box provisioning job with default mappings: 

1. Sign in to Microsoft Entra portal with Global Administrator or Application Administrator role credentials.  
1. Browse to **Azure Active Directory** > **Applications** > **Enterprise applications**. 
1. Click **New application** to create a new provisioning application to store the configuration for API-driven inbound provisioning. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/new-application.png" alt-text="Screenshot of how to create a new application.":::

1. Type 'API-driven' in the search text box. Select the application **API-driven Inbound User Provisioning to Azure AD**. 

   >[!NOTE]
   >The application “API-driven Inbound User Provisioning to on-premises AD” isn't supported. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/select-app.png" alt-text="Screenshot of how to select the inbound provisioning API application.":::

1. You can rename the application to meet your naming requirements and then click **Create**. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/create.png" alt-text="Screenshot of how to create an inbound provisioning API application.":::

   >[!TIP]
   >If you plan to ingest data from multiple sources that each have their own sync rules, you can create multiple apps and give each app a descriptive name, such as API2AAD-Provision-Employees-From-CSV or API2AAD-Provision-Contractors.

1. After the application is created, go to the **Provisioning** blade and click **Get started**. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/get-started.png" alt-text="Screenshot of how to get started on the Provisioning blade.":::

1. Switch **Provisioning Mode** from **Manual** to **Automatic**.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/mode.png" alt-text="Screenshot of how to switch the provisioning mode.":::

1. Click **Save** to create the initial configuration of the provisioning job.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/save-initial-job.png" alt-text="Screenshot of how to save the initial configuration of the job.":::

1. After the operation is saved, you will see two more expansion panels: one for Mappings and one for Settings. Before you proceed, make sure you provide a valid notification email ID and **Save** the configuration once more. 

   >[!NOTE]
   >Providing the notification email is mandatory, though the user interface doesn’t require it. If the notification email remains empty, then the provisioning job goes into quarantine when you start the execution. Make sure you set the notification email.    

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/email.png" alt-text="Screenshot of how to set email notification.":::

1. Click the hyperlink in the Mappings expansion panel to view the default attribute mappings.

   >[!IMPORTANT]
   >The default configuration in the **Attribute Mappings** page maps SCIM Core User and Enterprise User attributes to Azure AD attributes. We recommend using the default mappings to get started and customizing these mappings later as you get more familiar with the overall data flow. For more information about customization, see [](). 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/attribute-mapping.png" alt-text="Screenshot of how to set attribute mapping.":::

1. Navigate back to the Provisioning blade landing page by clicking the provisioning app name.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/navigate.png" alt-text="Screenshot of how to navigate to provisioning app name.":::

1. On the Provisioning App Landing page, you will see the following information and controls.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/provisioning-controls.png" alt-text="Screenshot of provisioning controls.":::

   >[!TIP]
   >First time users, before you click **Start provisioning**, copy the HTTPS URL value shown under Provisioning API endpoint and follow the instructions in Invoke the API in Graph Explorer with a user account to post data to the API endpoint. After the POST operation succedes, then come back and click **Start provisioning**. By following this step, you should immediately see processing results in less than 5 minutes, and you can then go to the section: Verify processing from Microsoft Entra portal. 

   | Control | Description |
   |---------|-------------|
   | **Start provisioning** | Place the provisioning job in "listen mode". In the "Start" state, the provisioning job wakes up every 40 minutes and checks if any SCIM bulk request payloads need to be processed. |
   | **Stop provisioning** | Pause or stop the provisioning job. |
   | **Restart provisioning** | Purge any SCIM payloads that are pending processing, and start a new provisioning cycle. |
   | **Edit provisioning** | Edit the job settings, attribute mappings, and customize the SCIM schema. |
   | **Provision on demand** | Not yet enabled. |
   | **Provisioning API endpoint** | Copy the HTTPS URL value shown here and save it in Notepad or OneNote for use later with the API client.|

## Download the CSV2SCIM script

Download the CSV2SCIM PowerShell script and samples.

1. Extract the contents to your local folder. It has the following directory structure

   **azure-activedirectory-inbound-provisioning**

   - src
     - CSV2SCIM.ps1 (main script)
     - ScimSchemaRepresentations (folder containing standard SCIM schema definitions for validating AttributeMapping.psd1 files)
     - EnterpriseUser.json, Group.json, Schema.json, User.json
   - Samples
     - AttributeMapping.psd1 (sample mapping of columns in CSV file to standard SCIM attributes)
     - csv-with-2-records.csv (sample CSV file with two records)
     - csv-with-1000-records.csv (sample CSV file with 1000 records)
     - Test-ScriptCommands.ps1 (sample usage commands)
     - UseClientCertificate.ps1 (script to generate self-signed certificate and upload it as service principal credential for use in OAuth flow)
     - Sample1 (folder with more examples of how CSV file columns can be mapped to SCIM standard attributes. If you get different CSV files for employees, contractors, interns, you can create a separate AttributeMapping.psd1 file for each entity.)
1. Download and install the latest version of PowerShell. 
1. Run the command to enable execution of remote signed scripts: set-executionpolicy remotesigned
1. Install the following pre-requisite modules
1. Install-Module -Name Microsoft.Graph.Applications,Microsoft.Graph.Reports

## Generate SCIM payload with standard schema

In this section, we will explore how to generate a SCIM payload with standard Core User and Enterprise User attribute from a CSV file. 
To illustrate the procedure, we will use the CSV file Samples/csv-with-2-records.csv present in the **azure-activedirectory-inbound-provisioning** folder. 


1. Open the CSV file Samples/csv-with-2-records.csv in Notepad/Excel/TextPad to check the columns present in the file. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/columns.png" alt-text="Screenshot of columns in Excel.":::

1. In Notepad++ or a source code editor like Visual Studio Code, open the PowerShell data file Samples/AttributeMapping.psd1 that enables mapping of CSV file columns to SCIM standard schema elements. The file that is shipped out-of-the-box already has pre-configured mapping of CSV file columns to corresponding SCIM elements. We will use it as-is for this execution. 
1. Open PowerShell and change to the directory **azure-activedirectory-inbound-provisioning\src**.
1. Run the following command to initialize the AttributeMapping variable. 

   ```powershell
   $AttributeMapping = Import-PowerShellDataFile '..\Samples\AttributeMapping.psd1'
   ```

1. Run the following command to validate if the AttributeMapping specified has valid standard SCIM schema attributes. This command will return **True** if the validation is successful. 

   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -ValidateAttributeMapping
   ```

1. Let’s say the AttributeMapping file has an invalid SCIM attribute called **userId**, then the ValidateAttributeMapping mode will display the following error. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/mapping-error.png" alt-text="Screenshot of a mapping error.":::


1. Once you verified that the AttributeMapping is valid, run the following command to generate a SCIM bulk request in the file **SCIMPayload.json** that includes the two records present in the CSV file. 


   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping > SCIMPayload.json
   ```

1. You can open the contents of the file **SCIMPayload.json** to verify if the SCIM attributes have been set as per mapping defined in the file **AttributeMapping.psd1**.

1. You can post this file as-is to the Provisioning API endpoint using Graph Explorer or Postman. Reference: 

   - [Quick start with Graph Explorer]() 
   - [Quick start with Postman]()

   Or you can refer to the next step and directly upload the generated payload to the API endpoint. 


## Generate and upload SCIM payload with standard schema

## Get provisioning logs of the latest Sync Cycles

## Appendix

### CSV2SCIM PowerShell usage details

### AttributeMapping.psd file for CSV2SCIM script

### Extending provisioning job schema with CSV2SCIM script