---
title: Migration of compute resources from Azure Germany to global Azure
description: Provides help for migrating compute resources
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of compute resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Compute resources from Azure Germany to global Azure.

## Compute IaaS

Unfortunately, no direct migration from Azure Germany to global Azure is possible. But there's more than one way to "duplicate" your VMs.

### Duplicate with Azure Site Recovery

Azure Site Recovery can help you migrate your VMs from Azure Germany to global Azure. Since source and target are in different tenants, you can't use the normal Azure Disaster Recovery option available for VMs. The trick here is to set up a Site Recovery vault in the target environment (global Azure), and to proceed like moving a physical server into Azure. Choose a replication path from *not virtualized* to Azure global and - after the replication finished - do a failover.

> [!NOTE]
> These steps are the same that you would take to migrate a physical server running on-premise to Azure.

There's a [good tutorial for Site Recovery](../site-recovery/physical-azure-disaster-recovery.md) available. For a quick overview, here's a shorter and slightly adopted version:

Install a Configuration/Process Server in your source environment to build the images of the servers. Then replicate the images to the Recovery Service Vault in your target environment. This is all done by the Configuration Server, and there's no need to touch the single servers.

- Sign in to the Azure Germany Portal
- Compare the OS version of the VMs you want to migrate against the [support matrix](../site-recovery/vmware-physical-secondary-support-matrix.md)
- Set up a new VM in your source VNet acting as the configuration server:
  - Choose DS4v3 or higher (4-8 cores, 16 GB Memory)
  - Attach an additional disk with at least 1 TB available space (for the VM images)
  - Use Windows Server 2012R2 or higher
- Make sure ports 443 and 9443 are open for the subnet in both directions
- Sign in to this new VM (ConfigurationServer)
- From within your remote desktop session, sign in to the global Azure portal with your global Azure credentials
- Set up a VNet where the replicated VMs will run
- Create a storage account
- Set up the Recovery Service Vault
- Define Protection goal (**To Azure** -- **Not virtualized/other**)
- Download Recovery Unified Setup installation file (**Prepare Infrastructure** > **Source**). When you opened the portal URL from within the ConfigurationServer, the file will be downloaded to the correct server. If not, upload the install file to the ConfigurationServer.
- Download the vault registration key (and upload to ConfigurationServer like above if necessary)
- Run the Recovery Unified Setup installation on the ConfigurationServer
- Set up the target environment (you should still be signed in to the target portal)
- Define replication policy
- Start replication

When replication has succeeded the first time, you should test the scenario by doing a test failover, verifying and deleting the test. Your final step is to do the real failover.

> [!CAUTION]
> There is no synchronization back to the source VM. If you want to re-migrate, you must clean up everything and start again at the beginning!

### Duplicate with Resource Manager template export/import

You can export the Resource Manager template used for the deployment to your local machine. Edit the template to change location and other parameters or variables, and then redeploy in Azure global. 

> [!IMPORTANT]
> Change Location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

Export the Resource Manager template in the portal by selecting the resource group. Click *deployments* and select the most recent deployment. Click *Template* in the left menu and download it.

You get a zip file with several files in it. The PowerShell, CLI, Ruby, or .NET scripts help you to deploy your template. The file *parameters.json* has all the input from the last deployment, most likely you have to change some settings here. Edit the *template.json* file if you only want to redeploy a subset of the resources.


### Next steps

- Refresh your knowledge about Azure Site Recovery by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/site-recovery/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### Reference

- [Physical to Azure using Site Recovery](../site-recovery/physical-azure-disaster-recovery.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)







## Cloud Services

Cloud Services can be redeployed by providing the `.cspkg` and `.cscfg` definitions again.

### By portal

- [Create a new Cloud Service](../cloud-services/cloud-services-how-to-create-deploy-portal.md) with your `.cspkg` and `.cscfg`.
- Update the [CNAME or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new cloud service.
- Delete your old cloud service in Azure Germany after your traffic is pointing to the new Cloud Service.

### By PowerShell

- [Create a new Cloud Service](/powershell/module/azure/new-azureservice?view=azuresmps-4.0.0) with your `.cspkg` and `.cscfg`.

```powershell
New-AzureService -ServiceName <yourServiceName> -Label <MyTestService> -Location <westeurope>
```

- [Create a new deployment](/powershell/module/azure/new-azuredeployment?view=azuresmps-4.0.0) with your `.cspkg` and `.cscfg`. See details [here].

```powershell
New-AzureDeployment -ServiceName <yourServiceName> -Slot <Production> -Package <YourCspkgFile.cspkg> -Configuration <YourConfigFile.cscfg>
```

- Update the [CNAME or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new Cloud Service.
- [Delete your old Cloud Service](/powershell/module/azure/remove-azureservice?view=azuresmps-4.0.0) in Azure Germany after your traffic is pointing to the new Cloud Service.

```powershell
Remove-AzureService -ServiceName <yourOldServiceName>
```

### By REST API

- [Create a new cloud service](/rest/api/compute/cloudservices/rest-create-cloud-service) in the target environment.

```http
https://management.core.windows.net/<subscription-id>/services/hostedservices
```

- Create a new deployment by using the [create deployment API](https://msdn.microsoft.com/library/azure/ee460813.aspx). If you need to find your `.cspkg` and `.cscfg`, you can call the [Get-Package API](https://msdn.microsoft.com/library/azure/jj154121.aspx).

```http
https://management.core.windows.net/<subscription-id>/services/hostedservices/<cloudservice-name>/deploymentslots/production
```

- [Delete your old Cloud Service](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-delete-cloud-service) in Azure Germany after your traffic is pointing to the new Cloud Service.

```http
https://management.core.cloudapi.de/<subscription-id>/services/hostedservices/<old-cloudservice-name>
```

### References
- [Cloud Services Overview](../cloud-services/cloud-services-choose-me.md)











## Service Fabric

It's not possible to migrate Service Fabric resources from Azure Germany to global Azure. You must re-deploy in the new environment.

You can gather some information about your current service fabric environment by using PowerShell cmdlets. You find all cmdlets related to service fabric by entering `Get-Help *ServiceFabric*` in PowerShell.

 
### Next steps

- Refresh your knowledge about Service Fabric by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/service-fabric/#step-by-step-tutorials).
- [Create a new cluster](../service-fabric/service-fabric-cluster-creation-via-portal.md)

### References

- [Service Fabric Overview](../service-fabric/service-fabric-overview.md)












## Batch

It's not possible to migrate Batch account data from one region to another. The account may have running VMs associated with it, interacting with data in storage accounts, databases, or other storage systems.

Redeploy your deployment scripts, templates, or code in the new region, including:

- [Create a Batch account](../batch/batch-account-create-portal.md)
- [Get Batch account quota increased](../batch/batch-quota-limit.md)
- Create Batch pools
- Create new storage accounts, databases, or whatever services used to persist input and output data.
- Update configuration and code to point to new Batch account and use new credentials.

### Next steps

- Refresh your knowledge about Azure Batch by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/batch/#step-by-step-tutorials).

### References

- [Azure Batch Overview](../batch/batch-technical-overview.md)










## Functions

Migration of Functions between Azure Germany and global Azure isn't supported at this time. The recommended approach is to export Resource Manager template, change the location, and redeploy to target region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Next steps

- Refresh your knowledge about Functions by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/azure-functions/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [Azure Functions Overview](../azure-functions/functions-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)











## Virtual Machines Scale Set

The recommended approach is to export the Resource Manager template, adopt it to the new environment, and redeploy it to target region. You should just export the base template and redeploy it in the new environment, as individual VMSS instances should all be the same.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Next steps

- Refresh your knowledge about Virtual Machine Scale Sets following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/virtual-machine-scale-sets/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md)
- Read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [Azure Virtual Machine Scale Set Overview](../virtual-machine-scale-sets/overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)










## App Service - Web Apps

The migration of App Services from Azure Germany to global Azure isn't supported at this time. The recommended approach is to export as Resource Manager template and redeploy after changing the location property to the new destination region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Next steps

- Refresh your knowledge about App Services by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/app-service/#step-by-step-tutorials).
- Make yourself familiar how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

### References

- [App Service Overview](../app-service/app-service-web-overview.md)
- [Export a Resource Manager template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)
- [Redeploy a template](../azure-resource-manager/resource-group-template-deploy.md)
