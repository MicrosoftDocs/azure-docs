---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating compute resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---
# Compute

## Compute IaaS

Azure Site Recovery (ASR) can help you migrate your VMs from Azure Germany to public Azure. Since source and target are in different tenants, you can't use the normal Azure Disaster Recovery option available for VMs. The trick here is to set up a Site Recovery vault in the target environment (public Azure) and to install the backup agent (MARS) inside the VMs running in the source environment (Azure Germany). Choose a replication path from *not virtualized* to Azure global and - after the replication finished - do a failover. Notice: These are the same steps that you would take to migrate a physical server running on-premise to Azure.

There is a [good ASR tutorial available](https://docs.microsoft.com/en-us/azure/site-recovery/physical-azure-disaster-recovery), here is a shorter and slightly adopted version to replicate a single Virtual Machine:

The overall process is that a Configuration/Process Server is used in your source environment to build the images of the servers, and then replicate them to the Recovery Service Vault in your target environment. With this, not all the servers have to communicate with the Vault, but only the ConfigurationServer.

- Log in to the Azure Germany Portal
- Compare the OS version of the VMs you want to migrate against the [support matrix](../site-recovery/vmware-physical-secondary-support-matrix.md)
- Set up a new VM in your source VNet acting as the configuration and process server:
  - Choose DS4v3 or higher (4-8 cores, 16 GB RAM)
  - Attach an additional disk with 1TB minimum (for the VM images)
  - Use Windows 2012R2 or higher
- Make sure ports 443 and 9443 are open for the subnet in both directions
- Log into this new VM (we will call it the ConfigurationServer from now on)
- From within your remote desktop session, login to the public Azure portal with your public Azure credentials
- Set up a VNet where the replicated VMs will run
- Create a storage account
- Set up the Recovery Service Vault
- Define Protection goal (**To Azure** -- **Not virtualized/other**)
- Download Recovery Unified Setup installation file (topic **Prepare Infrastructure** > **Source**). When you opened the portal URL from within the ConfigurationServer, the file will be downloaded to the correct server, if you are not logged in the ConfigurationServer please upload the install file to that server
- Download the vault registration key (and upload to ConfigurationServer like above if necessary)
- Run the Recovery Unified Setup installation on the ConfigurationServer
- Set up the target environment (you should still be logged in the target portal)
- Define replication policy
- Start replication

When replication has succeeded the first time, you should test the scenario by doing a test failover, verifying and deleting the test. Your final step is to do the real failover. 

> [!CAUTION]
> There is no synchronization back to the source VM. If you want to re-migrate, you must clean up everything and start again at the beginning!

### Links

- [Overview of Azure Site Recovery](../site-recovery/site-recovery-overview.md)
- [Replication architecture](../site-recovery/physical-azure-architecture.md)
- [Replicate an Azure VM](../site-recovery/azure-to-azure-quickstart.md)

## Cloud Services

Cloud Services can be redeployed by simply providing the `.cspkg` and `.cscfg` definitions again.

### By portal

[Create a new Cloud Service](../cloud-services/cloud-services-how-to-create-deploy-portal.md) with your `.cspkg` and `.cscfg`.

Update the [CNAME or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new cloud service.

Delete your old cloud service in Azure Germany after your traffic is pointing to the new Cloud Service.

### By PowerShell

[Create a new Cloud Service](/powershell/module/azure/new-azureservice?view=azuresmps-4.0.0) with your `.cspkg` and `.cscfg`.

    New-AzureService -ServiceName <yourServiceName> -Label <MyTestService> -Location <westeurope>

[Create a new deployment](/powershell/module/azure/new-azuredeployment?view=azuresmps-4.0.0) with your `.cspkg` and `.cscfg`. See details [here].

    New-AzureDeployment -ServiceName <yourServiceName> -Slot <Production> -Package <YourCspkgFile.cspkg> -Configuration <YourConfigFile.cscfg>

Update the [CName or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new Cloud Service.

[Delete your old Cloud Service](/powershell/module/azure/remove-azureservice?view=azuresmps-4.0.0) in Azure Germany after your traffic is pointing to the new Cloud Service.

    Remove-AzureService -ServiceName <yourOldServiceName>

### By REST API

[Create a new cloud service](/rest/api/compute/cloudservices/rest-create-cloud-service).

    https://management.core.windows.net/<subscription-id>/services/hostedservices

Create a new deployment by using the [create deployment API](https://msdn.microsoft.com/en-us/library/azure/ee460813.aspx). If you need to find your `.cspkg` and `.cscfg`, you can call [Get-Package API](https://msdn.microsoft.com/library/azure/jj154121.aspx).

    https://management.core.windows.net/<subscription-id>/services/hostedservices/<cloudservice-name>/deploymentslots/production

[Delete your old Cloud Service](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-delete-cloud-service) in Azure Germany after your traffic is pointing to the new Cloud Service.

    https://management.core.cloudapi.de/<subscription-id>/services/hostedservices/<old-cloudservice-name>

## Service Fabric

When the network connectivity between Azure Germany and the target region is enabled, follow these steps:

- [Enable network ports](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/7-VM-Windows-3-NodeTypes-Secure-NSG)

- [Scale out capacity](../service-fabric/service-fabric-cluster-windows-server-add-remove-nodes.md) for the cluster by including resources from target region

- [Use placement constraints](../service-fabric/service-fabric-cluster-resource-manager-configure-services.md#placement-constraints) to distribute load to the target region

- Drain out the workload in the Azure Germany region and remove machines from the cluster

Without network connectivity between Azure Germany and target region, you need to [create a new cluster](../service-fabric/service-fabric-cluster-creation-via-portal).

## Batch

It is not possible to migrate Batch account data from one region to another. The account may have running VMs associated with it interacting with data in storage accounts, databases, or other storage systems.

You must take your deployment scripts, templates, or code and re-deploy in the new region.  This could involve:
- [Creating a Batch account](../batch/batch-account-create-portal.md)
- [Getting Batch account quota increased](../batch/batch-quota-limit.md)
- Creating Batch pools
- Creating new storage accounts, databases, or whatever services used to persist input and output data.
- Updating configuration and/or code to point to new Batch account and use new credentials.

### Links

- [Azure Batch documentation](../batch/)

## Functions

Unfortunately, a migration of Functions between Azure Germany and public Azure is not supported at this time. The recommended approach is to export ARM template, change the location, and redeploy to target region.

- [Export an ARM template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell.md#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/en-us/global-infrastructure/locations/)
- Change Key Vault secrets, certs, and other GUIDs to be consistent with new Region (location).
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)

## Virtual Machines Scale Sets (VMSS)

## App Service - Web Apps

The migration of App Services from Azure Germany to public Azure is not supported at this time. The recommended approach is to export as ARM template and redeploy after changing the location property to the new destination region.

- [Export an ARM template using PowerShell](../azure-resource-manager/resource-manager-export-template-powershell\#export-resource-group-as-template)
- [Azure locations](https://azure.microsoft.com/en-us/global-infrastructure/locations/)
- Change Key Vault secrets, certs, and other GUIDs to be consistent with new Region (location).
- [Redeploy the application](../azure-resource-manager/resource-group-template-deploy.md)
