<properties 
   pageTitle="Automation Assets"
   description="Automation Assets"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Automation Assets

Automation Assets are resources that are available to all runbooks in an Automation account. You create and configure assets using either the Azure portal or Windows PowerShell cmdlets. You can retrieve values for assets in a runbook with activities that are available for each asset type.


The following table lists the different types of automation assets.  Refer to their individual topics for details on how to create and edit them and how to use them with activities in a runbook.

| Asset | Description |
|:---|:---|
|[Certificate](../automation-certificates)|Certificates can be stored in Azure Automation so they can be used by runbooks for authentication or added to an Azure resource.|
|[Connection](../automation-connections)|Contain the information required to connect to a service or application from a runbook.|
|[Credential](../automation-credentials) | Hold a [PSCredential](http://aka.ms/runbookauthor/pscredential) object which contains security credentials such as a username and password.
|[Schedule](../automation-schedules)|Used to schedule runbooks to run automatically.
|[Variables](../automation-variables)| Values that are available to all runbooks.

## Secure Assets

Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in the Azure Automation using a unique key that is generated for each automation account. This key is encrypted by a master certificate and stored in Azure Automation. Before storing a secure asset, the key for the automation account is decrypted using the master certificate and then used to encrypt the asset.

## Creating an Automation Asset

### <a name="CreateAsset"></a>To create a new asset with the Azure Management Portal

1. Select the **Automation** workspace.

2. At the top of the window, click **Assets**.

3. At the bottom of the window, click **Add Setting**.

4. Click the type of asset that you want to create.

5. Follow the dialog boxes to provide values for each property of the asset.  See the topic for each asset type for details. 

### To create a new asset with Windows PowerShell

You can create and modify all of the asset types using [cmdlets in Windows PowerShell](http://aka.ms/runbookauthor/azureautomationcmdlets).  See the topic for each asset type for specific examples.


## Using Automation Assets in Runbooks

You can access assets in a runbook using activities for each asset type. You should not use cmdlets to access activities in a runbook since they are less efficient and cannot access secure assets such as credentials and encrypted variables.  See the topic for each asset type for specific examples.




