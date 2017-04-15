---
title: Connect to Azure Stack with CLI | Microsoft Docs
description: Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: f576079c-5384-4c23-b5a4-9ae165d1e3c3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2016
ms.author: sngun

---
# Install and configure Azure Stack CLI

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack resources on Linux and Mac client platforms. The following steps required to connect to Azure Stack:

* [Install Node.js](#install-nodejs)
* [Install Azure Stack CLI](#install-azure-stack-cli)
* [Connect to Azure Stack](#connect-to-azure-stack)

## Install Node.js
Azure Stack requires the **4.4.6** version of Node.js. Navigate to https://nodejs.org/en/blog/release/v4.4.6/ and install the required version of Node.js for Windows, Mac OS or Linux machines.

## Install Azure Stack CLI
Azure Stack requires the **0.9.18** version of Azure CLI. Use the following command to install the required version of Azure CLI:

```
npm install -g azure-cli@0.9.18
```

## Connect to Azure Stack
Use the following steps to connect to Azure Stack by using Azure CLI:

1. Open a PowerShell session and get the Active Directory Resource Id by running the following PowerShell command:

   ```
   PowerShell(Invoke-RestMethod -Uri https://management.local.azurestack.external/metadata/endpoints?api-version=2015-01-01 -Method Get).authentication.audiences[0]
   ```
   
2. Open a command prompt window and add the Azure Stack environment by using the following command, make sure to replace the `<Active directory resource ID>` with the value retrieved in the previous step:

   ```
   azure account env add AzureStack --resource-manager-endpoint-url "https://management.local.azurestack.external" --management-endpoint-url "https://management.local.azurestack.external" --active-directory-endpoint-url  "https://login.windows.net" --portal-url "https://portal.local.azurestack.external" --gallery-endpoint-url "https://portal.local.azurestack.external/" --active-directory-resource-id "<Active directory resource ID>" --active-directory-graph-resource-id "https://graph.windows.net/"  
   ```

3. Disable the TLS certificate validation by running the following command:

   ```
   set NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   
4. Sign in to the Azure Stack administrator or user account by using the following command, make sure to replace the <username> and the <Password> with your Azure Stack administrator or user Active Directory account name. 
   
   ```
   azure login -e AzureStack -u “<Active directory username>” -p "<Password>"
   ```
   For example, an Azure Stack service administrator can sign into their Azure Stack account as follows:
   
   ```
   azure login -e Azure -u "serviceadmin@contoso.onmicrosoft.com
   ```
   
5. Set the Azure configuration mode to Azure Resource Manager by using the following command:

   ```
   azure config mode arm
   ```

6. After connecting, you can use the Azure CLI commands such as:

   ```
   # Get the list of subscriptions in the current account
   azure account list   

   # get the list of resources
   azure resource list
   ```

## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Connect with PowerShell](azure-stack-connect-powershell.md)

[Manage user permissions](azure-stack-manage-permissions.md)

