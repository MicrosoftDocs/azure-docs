---
title: Azure Service Fabric infrastructure as Code Best Practices
description: Best practices and design considerations for managing Azure Service Fabric as infrastructure as code.
author: peterpogorski

ms.topic: conceptual
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
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications/services",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
    "location": "[variables('clusterLocation')]"
}
```

To deploy your application using Azure Resource Manager, you first must [create a sfpkg](https://docs.microsoft.com/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg) Service Fabric Application package. The following python script is an example of how to create a sfpkg:

```python
# Create SFPKG that needs to be uploaded to Azure Storage Blob Container
microservices_sfpkg = zipfile.ZipFile(
    self.microservices_app_package_name, 'w', zipfile.ZIP_DEFLATED)
package_length = len(self.microservices_app_package_path)

for root, dirs, files in os.walk(self.microservices_app_package_path):
    root_folder = root[package_length:]
    for file in files:
        microservices_sfpkg.write(os.path.join(
            root, file), os.path.join(root_folder, file))

microservices_sfpkg.close()
```

## Azure Virtual Machine Operating System Automatic Upgrade Configuration 
Upgrading your virtual machines is a user initiated operation, and it is recommended that you use [Virtual Machine Scale Set Automatic Operating System upgrade](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade) for Azure Service Fabric clusters host patch management; Patch Orchestration Application is an alternative solution that is intended for when hosted outside of Azure, although POA can be used in Azure, with overhead of hosting POA in Azure being a common reason to prefer Virtual Machine Operating System Automatic Upgrade over POA. The following are the Compute Virtual Machine Scale Set Resource Manager template properties to enable Auto OS upgrade:

```json
"upgradePolicy": {
   "mode": "Automatic",
   "automaticOSUpgradePolicy": {
        "enableAutomaticOSUpgrade": true,
        "disableAutomaticRollback": false
    }
},
```
When using Automatic OS Upgrades with Service Fabric, the new OS image is rolled out one Update Domain at a time to maintain high availability of the services running in Service Fabric. To utilize Automatic OS Upgrades in Service Fabric your cluster must be configured to use the Silver Durability Tier or higher.

Ensure the following registry key is set to false to prevent your windows host machines from initiating uncoordinated updates: HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU.

The following are the Compute Virtual Machine Scale Set Resource Manager template properties to set the WindowsUpdate registry key to false:
```json
"osProfile": {
        "computerNamePrefix": "{vmss-name}",
        "adminUsername": "{your-username}",
        "secrets": [],
        "windowsConfiguration": {
          "provisionVMAgent": true,
          "enableAutomaticUpdates": false
        }
      },
```

## Azure Service Fabric Cluster Upgrade Configuration
The following is the Service Fabric cluster Resource Manager template property to enable automatic upgrade:
```json
"upgradeMode": "Automatic",
```
To manually upgrade your cluster, download the cab/deb distribution to a cluster virtual machine, and then invoke the following PowerShell:
```powershell
Copy-ServiceFabricClusterPackage -Code -CodePackagePath <"local_VM_path_to_msi"> -CodePackagePathInImageStore ServiceFabric.msi -ImageStoreConnectionString "fabric:ImageStore"
Register-ServiceFabricClusterPackage -Code -CodePackagePath "ServiceFabric.msi"
Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <"msi_code_version">
```

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-tutorial-create-vnet-and-windows-cluster.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md)
* Learn about [Service Fabric support options](service-fabric-support.md)
