<properties 
	pageTitle="How to uninstall elastic database job tool" 
	description="How to uninstall elastic database job tool" 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="sidneyh"/>

# How to uninstall the elastic database job components

If a failure occurs when attempting to install the elastic database job service, delete the resource group for the service.

## To uninstall the service components

1. Go to the [Azure classic portal](https://manage.windowsazure.com).
2. Navigate to the subscription that contains the elastic job. 
2. Navigate to the cloud service with the name that starts with "edj".
3. Delete the cloud service.
2. Open the [Azure preview portal](https://ms.portal.azure.com/).
3. Navigate to the subscription that contains the elastic job.
4. Click **Browse** and click **Resource groups**.
5. Select the resource group named "__ElasticDatabaseJob".
6. Delete the resource group.

Alternatively, use this PowerShell script:

1. Launch a [Microsoft Azure PowerShell window](powershell-install-configure.md). 
2. Ensure you are using PowerShell SDK version 0.8.10 or later.
3. Run the script:

		$ResourceGroupName = "__ElasticDatabaseJob"
		Switch-AzureMode AzureResourceManager
		
		$resourceGroup = Get-AzureResourceGroup -Name $ResourceGroupName
		if(!$resourceGroup)
		{
		    Write-Host "The Azure Resource Group: $ResourceGroupName has already been deleted.  Elastic database job is uninstalled."
		    return
		}
		
		# Delete the cloud service within the resource group first.
		$domainResources = Get-AzureResource -ResourceGroupName $ResourceGroupName -ResourceType "Microsoft.ClassicCompute/domainNames" -ErrorAction SilentlyContinue
		if($domainResources)
		{
		    Switch-AzureMode AzureServiceManagement
		    Foreach($domainResource in $domainResources)
		    {
		        $domainNameToRemove = $domainResources.Name
		        Write-Host "Removing Azure Service: $domainNameToRemove.  This may take a few minutes.”
		        Remove-AzureService -ServiceName $domainNameToRemove -Force
		        Write-Host "Completed removing Azure Service: $domainNameToRemove"
		    }
		    Switch-AzureMode AzureResourceManager
		}
		
		Write-Host "Removing the Azure Resource Group: $ResourceGroupName.  This may take a few minutes.”
		Remove-AzureResourceGroup -Name $ResourceGroupName -Force
		Write-Host "Completed removing the Azure Resource Group: $ResourceGroupName.  Elastic database job is now uninstalled."

## Next steps

To reinstall the elastic database jobs, see [Installing the elastic database job service](sql-database-elastic-jobs-service-installation.md)

For an overview of the elastic job service, see [Elastic jobs overview](sql-database-elastic-jobs-overview.md).

<!--Image references-->
[1]: ./media/sql-database-elastic-job-uninstall/
