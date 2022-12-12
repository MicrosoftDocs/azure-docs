---
title: "VMRay Email Threat Defender Connector  connector for Microsoft Sentinel"
description: "Learn how to install the connector VMRay Email Threat Defender Connector  to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 12/12/2022
ms.service: microsoft-sentinel
ms.author: cwatson
---

# VMRay Email Threat Defender Connector  connector for Microsoft Sentinel

This connector ingests email data collected by [VMRay Email Threat Defender (ETD)](https://www.vmray.com/products/email-threat-defender/). It requires a connection to a VMRay Platform 4.3.0 (or later) installation that has ETD enabled.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | vmray_emails_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [VMRay](https://support.vmray.com/) |

## Query samples

**All ingested emails**
   ```kusto
vmray_emails_CL

   | order by TimeGenerated desc
   ```

**Malicious emails**
   ```kusto
vmray_emails_CL

   | where email_verdict_s == "malicious"
   ```

**Recipients of malicious emails**
   ```kusto
vmray_emails_CL

   | where email_verdict_s == "malicious"

   | extend recipient=parse_json(email_recipients_s)

   | mv-expand recipient to typeof(string)

   | distinct recipient
   ```

**Malicious attachments**
   ```kusto
vmray_emails_CL

   | where email_attachments_s has '"malicious"'

   | extend attachment=parse_json(email_attachments_s)

   | mv-expand attachment

   | where attachment.attachment_verdict == "malicious"

   | extend filename=tostring(attachment.attachment_filename)

   | extend hash=tostring(attachment.attachment_sha256hash)

   | summarize filenames=make_set(filename, 5) by hash
   ```



## Prerequisites

To integrate with VMRay Email Threat Defender Connector for Azure Sentinel make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](https://learn.microsoft.com/azure/azure-functions/).
- **VMRay Platform Access**: Access to a VMRay Platform 4.3.0 (or later) installation that has ETD enabled. Ensure that the VMRay Platform's REST API is accessible to external clients so that the connector can fetch data through it.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to a VMRay Platform API to pull ETD email data into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store Workspace and API keys in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**STEP 1 - Configuration Steps for the VMRay Platform**

In the VMRay Platform, create a user that has permissions to access ETD and the email data you want to ingest. If you are using ETD Cloud, see the *Setting up and Managing Users* chapter of the *Cloud Account Manager Guide* for more information. If you are using ETD On Premises, see the *Setting up Users and Assigning Roles* section of the *On Premises Installation Guide* for more information.

Next, create an API key for that user, which will be used by the Microsoft Sentinel connector. For detailed instructions, refer to the *API Programmer Guide*.

Verify that your API key has the required permissions by running the following command:

	$ curl -H "Authorization: api_key <vmray_api_key>" <vmray_platform_url>/rest/email
This should return a list of emails that ETD has analyzed.


**STEP 2 - Deploy the Azure Resource Manager (ARM) Template**

>**IMPORTANT:** Before deploying the VMRay ETD connector, have the Microsoft Sentinel Workspace ID and Primary Key (can be copied from below), as well as the VMRay Platform API key, readily available.


   Workspace Primary Key


1. Click the **Deploy to Azure** button below.

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinel-VMRayETD-azuredeploy)
2. Select the preferred **Subscription**, **Resource group** and **Region**.
3. Enter the **Workspace ID**, **Workspace Key**, **VMRay Platform URL** and **VMRay API Key**.
>Note: If you are using Azure Key Vault secrets for any of the values above, use the`@Microsoft.KeyVault(SecretUri={Security Identifier})`schema in place of the string values. Refer to the [Key Vault references documentation](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references) for further details.
Adjust the other connector settings as required.

4. Finish the wizard and wait for the deployment to complete.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/vmraygmbh1623334327435.vmray-etd-azure-sentinel-free?tab=Overview) in the Azure Marketplace.
