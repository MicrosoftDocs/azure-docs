---
title: Upgrade Ubuntu for a Service Fabric cluster in Azure 
description: Learn how to upgrade a Linux Service Fabric cluster's Ubuntu version on an existing Azure virtual network using Azure CLI.
author: nickomang

ms.author: v-nioma
ms.topic: tutorial
ms.date: 02/21/2020
---

# Upgrade Ubuntu version for an Azure Service Fabric Linux Cluster

Service Fabric supports the ability to create clusters based on Ubuntu 18.04 LTS. Upgrading the cluster is simple and can be done for clusters running stateless or stateful services. To upgrade a cluster from Ubuntu 16.04 LTS seamlessly, take the following steps:

1. Create an identical deployment with the necessary modifications for using Ubuntu 18.04 LTS.
2. Migrate data and point other resources at the new deployment.
3. Delete the original deployment and clean up resources.

You can follow along by beginning with this template, which deploys a secure seven node, three node type cluster with Ubuntu 16.04 LTS:

* [AzureDeploy.json][template]
* [AzureDeploy.Parameters.json][parameters]

## Create an identical deployment for 18.04 LTS

The first thing to do is modify the cluster for the new version of Ubuntu. The cluster operating system can be specified in Azure Resource Manager templates. Modify the **vmImageSku** attribute, and make sure **typeHandlerVersion** for each node type is set to **1.1**. The updated version of the template using Ubuntu 18.04 LTS can be downloaded here:

* [AzureDeploy.json][template2]
* [AzureDeploy.Parameters.json][parameters2]

```json
"vmImageSku": {
    "type": "string",
    "defaultValue": "18.04-LTS",
    "metadata": {
        "description": "VM image SKU"
    }
}
```

```json
"name": "[concat('ServiceFabricNodeVmExt','_vmNodeType1Name')]",
"properties": {
    "type": "ServiceFabricLinuxNode",
    "autoUpgradeMinorVersion": true,
    "protectedSettings": {
        "StorageAccountKey1": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('supportLogStorageAccountName')),'2015-05-01-preview').key1]",
        "StorageAccountKey2": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('supportLogStorageAccountName')),'2015-05-01-preview').key2]"
    },
    "publisher": "Microsoft.Azure.ServiceFabric",
    "settings": {
        "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
        "nodeTypeRef": "[variables('vmNodeType1Name')]",
        "durabilityLevel": "Bronze",
        "enableParallelJobs": true,
        "nicPrefixOverride": "[variables('subnet1Prefix')]",
        "certificate": {
            "thumbprint": "[parameters('certificateThumbprint')]",
            "x509StoreName": "[parameters('certificateStoreValue')]"
        }
    },
    "typeHandlerVersion": "1.1"
}
```

Once the settings have been configured, deploy on Azure.

## Migrate data and configure resources

After deploying, we need to configure traffic and resources to point to our new cluster. For a stateful service, this means we must move our data over. A stateless service doesn't require moving any data, but traffic must be configured to reference the new deployment.

### Stateful Services

A stateful service is reliant on existing data, so to seamlessly transition our application we need to port the data over.

Data can be downloaded to an external data store for migration. Following the instructions in [Backup and Restore for Service Fabric Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-backup-restore), complete a full backup of the original service. Follow the instructions for restoring data to the service in our new deployment.

### Stateless Services

Stateless services don't use collections of data so we don't have to port anything over to the new cluster. However, we must still configure any resource dependent on or pointing at our old deployment to reference the new one. For example, CNAME and A records enabling a custom domain would need to be updated. Guidance can be found at  [Configuring a custom domain for an Azure cloud service](https://docs.microsoft.com/azure/cloud-services/cloud-services-custom-domain-name-portal).

>[!NOTE]
>When using Azure Key Vault, if the deployment is taking place in a different region than the previous, in order to restore a key backup both of these conditions must be true:
>
> * Both of the Azure locations belong to the same geographical location
> * Both of the key vaults belong to the same Azure subscription
>
>For example, a backup taken by a given subscription of a key in a key vault in West India, can only be restored to another key vault in the same subscription and geo location; West India, Central India or South India.
    
## Delete original deployment and clean up resources

Finally, we can delete our now unused Ubuntu 16.04-LTS deployment. This can be done from the Azure portal or by using a command-line tool like Azure PowerShell or the Azure CLI.

It's possible to delete the whole resource group:

```powershell
Remove-AzResourceGroup -Name ExampleResourceGroup
```

as well as individual resources:

```powershell
Remove-AzResource `
    -ResourceGroupName ExampleResourceGroup `
    -ResourceName ExampleVM `
    -ResourceType Microsoft.Compute/
```

## Next Steps

* [Learn how to scale a cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-scale-cluster)
* [Monitor your cluster with Azure Monitor](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-oms)


<!-- Links -->
[template]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-3-NodeTypes-Secure/AzureDeploy.json
[parameters]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-3-NodeTypes-Secure/AzureDeploy.Parameters.json
[template2]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-1804-3-NodeTypes-Secure/AzureDeploy.json
[parameters2]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-1804-3-NodeTypes-Secure/AzureDeploy.Parameters.json
