---
title: Azure Service Fabric infrastructure as Code Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric as infrastructure as code.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: chackdan  
editor: ''
ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/23/2019
ms.author: pepogors
---

# Infrastructure as code

In a production scenario, create Azure Service Fabric clusters using Resource Manager templates. Resource Manager templates provide greater control of resource properties and ensure that you have a consistent resource model.

Sample Resource Manager templates are available for Windows and Linux in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template. Download `azuredeploy.json` and `azuredeploy.parameters.json` and edit them to meet your custom requirements.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To deploy the `azuredeploy.json` and `azuredeploy.parameters.json` templates you downloaded above, use the following Azure CLI commands:

```azurecli
ResourceGroupName="sfclustergroup"
Location="westus"

az group create --name $ResourceGroupName --location $Location 
az group deployment create --name $ResourceGroupName  --template-file azuredeploy.json --parameters @azuredeploy.parameters.json
```

Creating a resource using Powershell

```powershell
$ResourceGroupName="sfclustergroup"
$Location="westus"
$Template="azuredeploy.json"
$Parameters="azuredeploy.parameters.json"

New-AzResourceGroup -Name $ResourceGroupName -Location $Location
New-AzResourceGroupDeployment -Name $ResourceGroupName -TemplateFile $Template -TemplateParameterFile $Parameters
```

## Azure Service Fabric resources

You can deploy applications and services onto your Service Fabric cluster via Azure Resource Manager. See [Manage applications and services as Azure Resource Manager resources](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-arm-resource) for details. The following are best practice Service Fabric application specific resources to include in your  Resource Manager template resources.

```json
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applications/services",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
    "location": "[variables('clusterLocation')]"
}
```

To deploy your application using Azure Resource Manager, you first must [create a sfpkg](https://docs.microsoft.com/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg) Service Fabric Application package. The following python script is an example of how to create a sfpkg:

```python
# Create SFPKG that needs to be uploaded to Azure Storage Blob Container
microservices_sfpkg = zipfile.ZipFile(self.microservices_app_package_name, 'w', zipfile.ZIP_DEFLATED)
package_length = len(self.microservices_app_package_path)

for root, dirs, files in os.walk(self.microservices_app_package_path):
    root_folder = root[package_length:]
    for file in files:
        microservices_sfpkg.write(os.path.join(root, file), os.path.join(root_folder, file))

microservices_sfpkg.close()
```

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-tutorial-create-vnet-and-windows-cluster.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md)
* Learn about [Service Fabric support options](service-fabric-support.md)
