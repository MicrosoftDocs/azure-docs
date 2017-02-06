<properties
  pageTitle="Create a VM with a Resource Manager template | Microsoft Docs"
  description="Use a Resource Manager template and PowerShell to easily create a new Windows virtual machine."
  services="virtual-machines-windows" 
  documentationcenter=""
  author="davidmu1"
  manager="timlt"
  editor=""
  tags="azure-resource-manager"/>

<tags
  ms.assetid="19129d61-8c04-4aa9-a01f-361a09466805"
  ms.service="virtual-machines-windows"
  ms.workload="na"
  ms.tgt_pltfrm="vm-windows"
  ms.devlang="na"
  ms.topic="article"
  ms.date="01/06/2017"
  ms.author="davidmu"/>

# Create a Windows virtual machine with a Resource Manager template

This article shows you how to deploy an Azure Resource Manager template using PowerShell. The [template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json) deploys a single virtual machine running Windows Server in a new virtual network with a single subnet.

For a detailed description of the virtual machine resource, see [Virtual machines in an Azure Resource Manager template](virtual-machines-windows-template-description.md). For more information about all the resources in a template, see [Azure Resource Manager template walkthrough](../resource-manager-template-walkthrough.md).

It should take about five minutes to do the steps in this article.

## Step 1: Install Azure PowerShell
See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Step 2: Create a resource group
All resources must be deployed in a [resource group](../azure-resource-manager/resource-group-overview.md).

1. Get a list of available locations where resources can be created.
   
  ```powershell   
  Get-AzureRmLocation | sort DisplayName | Select DisplayName
  ```

2. Create the resource group in the location that you select. This example shows the creation of a resource group named **myResourceGroup** in the **Central US** location:

  ```powershell   
  New-AzureRmResourceGroup -Name "myResourceGroup" -Location "Central US"
  ```
   
  You should see something like this example:

  ```
  ResourceGroupName : myResourceGroup
  Location          : centralus
  ProvisioningState : Succeeded
  Tags              :
  ResourceId        : /subscriptions/{subscription-id}/resourceGroups/myResourceGroup
  ```

## Step 3: Create the resources
Deploy the template and provide parameter values when prompted. This example deploys the 101-vm-simple-windows template in the resource group that you created:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName "myResourceGroup" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json" 
```
You are asked to provide the name of the administrator account on the VM, the password of the account, and the DNS prefix.

You should see something like this example:

```
DeploymentName    : azuredeploy
ResourceGroupName : myResourceGroup
ProvisioningState : Succeeded
Timestamp         : 12/29/2016 8:11:37 PM
Mode              : Incremental
TemplateLink      :
                    Uri            : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/
                    101-vm-simple-windows/azuredeploy.json
                    ContentVersion : 1.0.0.0
Parameters        :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    adminUsername    String                     myAdminUser
                    adminPassword    SecureString
                    dnsLabelPrefix   String                     myDomain
                    windowsOSVersion String                     2016-Datacenter
Outputs           :
                    Name             Type                       Value
                    ===============  =========================  ===========
                    hostname         String                     myDomain.centralus.cloudapp.azure.com
DeploymentDebugLogLevel :
```

> [!NOTE]
> You can also deploy templates and parameters from local files. To learn more, see [Using Azure PowerShell with Azure Storage](../storage/storage-powershell-guide-full.md).

## Next Steps
* If there were issues with the deployment, a next step would be to look at [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/resource-manager-common-deployment-errors.md)
* Learn how to manage the virtual machine that you created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

