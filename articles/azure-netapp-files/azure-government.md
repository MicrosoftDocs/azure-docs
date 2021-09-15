---
title: Azure NetApp Files with Azure Government | Microsoft Docs
description: This article outlines how to connect to Azure Government US to use with Azure NetApp Files
services: azure-netapp-files
documentationcenter: ''
services: azure-netapp-files
author: b-juche
ms.author: b-juche
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: concepts
ms.date: 09/15/2021
---

# Azure NetApp Files with Azure Government

[Microsoft Azure Government](../azure-government/documentation-government-welcome.md) delivers a dedicated cloud enabling government agencies and their partners to transform mission-critical workloads to the cloud.  

This article shows you how to access the Azure NetApp Files service within Azure Government. 

## Portal 

Azure Government users can access Azure NetApp Files by pointing their browsers to **portal.azure.us**.  The portal site name is **Microsoft Azure Government**.   

![Screenshot of the Azure Government portal highlighting portal.azure.us as the URL])(../media/azure-netapp-files/anf-azuregov.jpg)

From the Microsoft Azure Government portal, you can access Azure NetApp Files the same way you would in the public Azure portal. For example, you can enter **Azure NetApp** Files in the portal’s Search Resources box, and then select **Azure NetApp Files** from the list that appears.  

You can follow [Azure NetApp Files](/azure/azure-netapp-files/) documentation for details about using the service.

## CLI 

You can connect to the Azure Government by setting the cloud name to `AzureUSGovernment` and then proceeding to log in as you normally would with the `az login` command. After running the log in command, a browser will launch where you enter the appropriate Azure Government credentials.  

```azurecli 

az cloud set --name AzureUSGovernment 

``` 

To confirm the cloud has been set to `AzureUSGovernment`, run: 

```azurecli 

az cloud list --output table 

``` 

This command will produce a table with Azure cloud locations. The `isActive` column entry for `AzureUSGovernment` should read `true`.  

For more information on using the CLI with Azure Government, see [Connect to Azure Government with Azure CLI](../azure-government/documentation-government-get-started-connect-with-cli.md)

## REST API

Endpoints for Azure Government are different from commercial Azure endpoints. For a list of different endpoints, see Azure Government’s [Guidance for Developers](../azure-government/compare-azure-government-global-azure#guidance-for-developers.md).

## PowerShell

When connecting to Azure Government through PowerShell, you must specify an environmental parameter to ensure you connect to the correct endpoints. From there, you can proceed to use Azure NetApp Files as you normally would with PowerShell. 

| Connection type | Command | 

| --- | --- | 

| [Azure](/powershell/module/az.accounts/Connect-AzAccount) commands |`Connect-AzAccount -EnvironmentName AzureUSGovernment` | 

| [Azure Active Directory](/powershell/module/azuread/connect-azuread) commands |`Connect-AzureAD -AzureEnvironmentName AzureUSGovernment` | 

| [Azure (Classic deployment model)](/powershell/module/servicemanagement/azure.service/add-azureaccount) commands |`Add-AzureAccount -Environment AzureUSGovernment` | 

| [Azure Active Directory (Classic deployment model)](/previous-versions/azure/jj151815(v=azure.100)) commands |`Connect-MsolService -AzureEnvironment UsGovernment` | 

## Next Steps
* [What is Azure Government?](../azure-government/documentation-government-welcome.md)
* [Compare Azure Government and global Azure](../azure-government/compare-azure-government-global-azure.md)
* [Azure NetApp Files REST API](azure-netapp-files-develop-with-rest-api.md)
* [Azure NetApp Files REST API using PowerShell](azure-netapp-files/develop-rest-api-powershell.md)
