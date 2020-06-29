---
title: Migrate Azure compute resource from Azure Germany to global Azure
description: This article provides information about migrating your Azure compute resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate compute resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure compute resources from Azure Germany to global Azure.

## Compute IaaS

You can't directly migrate Azure compute infrastructure as a service (IaaS) resources from Azure Germany to global Azure. But, there are multiple ways you can "duplicate" your VMs.

### Duplicate by using Site Recovery

Azure Site Recovery can help you migrate your VMs from Azure Germany to global Azure. Because the source and target are in different tenants in a migration from Azure Germany to global Azure, you can't use the normal Azure Disaster Recovery option that's available for VMs. The trick is to set up a Site Recovery vault in the target environment (global Azure) and to proceed like you're moving a physical server to Azure. In the Azure portal, select a replication path labeled **Not virtualized**. When the replication is finished, do a failover.

> [!NOTE]
> The following steps are the same steps you would take to migrate a physical server that's running on-premises to Azure.

To learn more, review this [helpful Site Recovery tutorial](../site-recovery/physical-azure-disaster-recovery.md). For a quick overview, here's a shorter and slightly adapted version of the process:

Install a configuration/process server in your source environment to build the server images. Then, replicate the images to the Azure Recovery Services vault in your target environment. The work is all done by the configuration server. You don't need to touch the individual servers.

1. Sign in to the Azure Germany portal.
1. Compare the OS versions of the VMs you want to migrate against the [support matrix](../site-recovery/vmware-physical-secondary-support-matrix.md).
1. Set up a new VM in your source Azure Virtual Network instance to act as the configuration server:
   1. Select **DS4v3** or higher (4 to 8 cores, 16-GB memory).
   1. Attach an additional disk that has at least 1 TB of available space (for the VM images).
   1. Use Windows Server 2012 R2 or later.
1. Make sure that ports 443 and 9443 are open for the subnet in both directions.
1. Sign in to the new VM (ConfigurationServer).
1. In your remote desktop session, sign in to the global Azure portal by using your global Azure credentials.
1. Set up a virtual network in which the replicated VMs will run.
1. Create an Azure Storage account.
1. Set up the Recovery Services vault.
1. Define **Protection goal** (**To Azure** > **Not virtualized/other**).
1. Download the Recovery Unified Setup installation file (**Prepare Infrastructure** > **Source**). When you open the portal URL from within ConfigurationServer, the file is downloaded to the correct server. From outside ConfigurationServer, upload the installation file to ConfigurationServer.
1. Download the vault registration key (upload it to ConfigurationServer like in the preceding step, if necessary).
1. Run the Recovery Unified Setup installation on ConfigurationServer.
1. Set up the target environment (check that you're still signed in to the target portal).
1. Define the replication policy.
1. Start replication.

After replication initially succeeds, test the scenario by doing a test failover. Verify and delete the test. Your final step is to do the real failover.

> [!CAUTION]
> Syncing back to the source VM doesn't occur. If you want to migrate again, clean up everything and start again at the beginning!

### Duplicate by using Resource Manager template export/import

You can export the Azure Resource Manager template that you use to deploy to your local machine. Edit the template to change the location and other parameters or variables. Then, redeploy in global Azure. 

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

Export the Resource Manager template in the portal by selecting the resource group. Select **deployments**, and then select the most recent deployment. Select **Template** in the left menu and download the template.

A .zip file that has several files in it downloads. The PowerShell, Azure CLI, Ruby, or .NET scripts help you deploy your template. The file *parameters.json* has all the input from the last deployment. It's likely that you will need to change some settings in this file. Edit the *template.json* file if you want to redeploy only a subset of the resources.

For more information:

- Refresh your knowledge by completing the [Site Recovery tutorials](/azure/site-recovery/).
- Get information about how to [export Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md) or read an overview of [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- Learn more about [physical-to-Azure disaster recovery by using Site Recovery](../site-recovery/physical-azure-disaster-recovery.md).
- Read the [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn more about how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Cloud Services

You can redeploy Azure Cloud Services resources by providing the `.cspkg` and `.cscfg` definitions again.

### Azure portal

To redeploy cloud services in the Azure portal:

1. [Create a new cloud service](../cloud-services/cloud-services-how-to-create-deploy-portal.md) by using your `.cspkg` and `.cscfg` definitions.
1. Update the [CNAME or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new cloud service.
1. When traffic points to the new cloud service, delete the old cloud service in Azure Germany.

### PowerShell

To redeploy cloud services by using PowerShell:

1. [Create a new cloud service](/powershell/module/servicemanagement/azure/new-azureservice) by using your `.cspkg` and `.cscfg` definitions.

    ```powershell
    New-AzureService -ServiceName <yourServiceName> -Label <MyTestService> -Location <westeurope>
    ```

1. [Create a new deployment](/powershell/module/servicemanagement/azure/new-azuredeployment) by using your `.cspkg` and `.cscfg` definitions.

    ```powershell
    New-AzureDeployment -ServiceName <yourServiceName> -Slot <Production> -Package <YourCspkgFile.cspkg> -Configuration <YourConfigFile.cscfg>
    ```

1. Update the [CNAME or A record](../cloud-services/cloud-services-custom-domain-name-portal.md) to point traffic to the new cloud service.
1. When traffic points to the new cloud service, [delete the old cloud service](/powershell/module/servicemanagement/azure/remove-azureservice) in Azure Germany.

    ```powershell
    Remove-AzureService -ServiceName <yourOldServiceName>
    ```

### REST API

To redeploy cloud services by using the REST API:

1. [Create a new cloud service](/rest/api/compute/cloudservices/rest-create-cloud-service) in the target environment.

    ```http
    https://management.core.windows.net/<subscription-id>/services/hostedservices
    ```

1. Create a new deployment by using the [Create Deployment API](/previous-versions/azure/reference/ee460813(v=azure.100)). To find your `.cspkg` and `.cscfg` definitions, you can call the [Get Package API](/previous-versions/azure/reference/jj154121(v=azure.100)).

    ```http
    https://management.core.windows.net/<subscription-id>/services/hostedservices/<cloudservice-name>/deploymentslots/production
    ```

1. When traffic points to the new cloud service, [delete the old cloud service](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-delete-cloud-service) in Azure Germany.

    ```http
    https://management.core.cloudapi.de/<subscription-id>/services/hostedservices/<old-cloudservice-name>
    ```

For more information:

- Review the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md).

## Service Fabric

You can't migrate Azure Service Fabric resources from Azure Germany to global Azure. You must redeploy Service Fabric resources in the new environment.

You can get information about your current Service Fabric environment by using PowerShell cmdlets. Access all cmdlets that are related to Service Fabric by entering `Get-Help *ServiceFabric*` in PowerShell.

For more information:

- Refresh your knowledge by completing the [Service Fabric tutorials](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-create-dotnet-app).
- Learn how to [create a new cluster](../service-fabric/service-fabric-cluster-creation-via-portal.md).
- Review the [Service Fabric overview](../service-fabric/service-fabric-overview.md).

## Batch

You can't migrate Azure Batch account data from one region to another. The account might have running VMs associated with it and be actively interacting with data in storage accounts, databases, or other storage systems.

Redeploy your deployment scripts, templates, or code in the new region. Redeployment includes the following tasks:

1. [Create a Batch account](../batch/batch-account-create-portal.md).
1. [Increase your Batch account quota](../batch/batch-quota-limit.md).
1. Create Batch pools.
1. Create new storage accounts, databases, and other services that are used to persist input and output data.
1. Update your configuration and code to point to the new Batch account and use new credentials.

For more information:

- Refresh your knowledge by completing the [Batch tutorials](https://docs.microsoft.com/azure/batch/tutorial-parallel-dotnet).
- Review the [Azure Batch overview](../batch/batch-technical-overview.md).

## Functions

Migrating Azure Functions resources from Azure Germany to global Azure isn't supported at this time. We recommend that you export the Resource Manager template, change the location, and then redeploy to the target region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certificates, App Settings, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [Functions tutorials](https://docs.microsoft.com/azure/azure-functions).
- Learn how to [export Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md) or read an overview of [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- Review the [Azure Functions overview](../azure-functions/functions-overview.md).
- Get an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Virtual machine scale sets

To migrate virtual machine scale sets to global Azure, export the Resource Manager template, adapt it to the new environment, and then redeploy to the target region. Export only the base template and redeploy the template in the new environment. Individual virtual machine scale set instances should all be the same.

> [!IMPORTANT]
> Change location, Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [virtual machine scale set tutorials](https://docs.microsoft.com/azure/virtual-machine-scale-sets/tutorial-create-and-manage-cli).
- Learn how to [export Azure Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md).
- Review the [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).
- Get an overview of [virtual machine scale sets](../virtual-machine-scale-sets/overview.md).
- Read an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Web Apps

Currently, apps that you created by using the Web Apps feature of Azure App Service can't be migrated from Azure Germany to global Azure. We recommend that you export a web app as a Resource Manager template, and then redeploy after you change the location property to the new region.

> [!IMPORTANT]
> Change location, Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

For more information:

- Refresh your knowledge by completing the [App Service tutorials](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-dotnetcore-sqldb).
- Learn how to [export Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md) or read an overview of [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- Review the [App Service overview](../app-service/overview.md).
- Read the [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
