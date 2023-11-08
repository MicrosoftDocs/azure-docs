---
title: Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Azure Automation
description: This article provides information about deploying the extension-based User Hybrid Runbook Worker to run runbooks on Windows or Linux machines in your on-premises datacenter or other cloud environment.
services: automation
ms.subservice: process-automation
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-bicep
ms.date: 04/10/2023
ms.topic: how-to
#Customer intent: As a developer, I want to learn about extension so that I can efficiently deploy Hybrid Runbook Workers.
---

# Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Azure Automation

The extension-based onboarding is only for **User** Hybrid Runbook Workers. This article describes how to: deploy a user Hybrid Runbook Worker on a Windows or Linux machine, remove the worker, and remove a Hybrid Runbook Worker group. 

For **System** Hybrid Runbook Worker onboarding, see [Deploy an agent-based Windows Hybrid Runbook Worker in Automation](./automation-windows-hrw-install.md) or [Deploy an agent-based Linux Hybrid Runbook Worker in Automation](./automation-linux-hrw-install.md). 


You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on an Azure or non-Azure machine, including [Azure Arc-enabled servers](../azure-arc/servers/overview.md) and [Arc-enabled VMware vSphere (preview)](../azure-arc/vmware-vsphere/overview.md). From the machine or server that's hosting the role, you can run runbooks directly against it and against resources in the environment to manage those local resources.
Azure Automation stores and manages runbooks and then delivers them to one or more chosen machines. After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.


> [!NOTE]
> A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. If you install Extension based (V2)on a hybrid worker already running Agent based (V1), then you would see two entries of the Hybrid Runbook Worker in the group. One with Platform Extension based (V2) and the other Agent based (V1). [**Learn more**](#migrate-an-existing-agent-based-to-extension-based-hybrid-workers).

## Prerequisites

### Machine minimum requirements

- Two cores
- 4 GB of RAM
- **Non-Azure machines** must have the [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) installed. To install the `AzureConnectedMachineAgent`, see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md) for Arc-enabled servers or see [Manage VMware virtual machines Azure Arc](../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md#enable-guest-management) to enable guest management for Arc-enabled VMware vSphere VMs.
- The system-assigned managed identity must be enabled on the Azure virtual machine, Arc-enabled server or Arc-enabled VMware vSphere VM.  If the system-assigned managed identity isn't enabled, it will be enabled as part of the adding process.
 
### Supported operating systems

| Windows (x64)  | Linux (x64) |
|---|---|
| &#9679; Windows Server 2022 (including Server Core) <br> &#9679; Windows Server 2019 (including Server Core) <br> &#9679; Windows Server 2016, version 1709, and 1803 (excluding Server Core) <br> &#9679; Windows Server 2012, 2012 R2 (excluding Server Core) <br> &#9679; Windows 10 Enterprise (including multi-session) and Pro | &#9679; Debian GNU/Linux 8, 9, 10, and 11 <br> &#9679; Ubuntu 18.04 LTS, 20.04 LTS, and 22.04 LTS <br> &#9679; SUSE Linux Enterprise Server 15.2, and 15.3 <br> &#9679; Red Hat Enterprise Linux Server 7, and 8 </br> &#9679; Oracle Linux 7 and 8 <br> *Hybrid Worker extension would follow support timelines of the OS vendor*.|
 

### Other Requirements

| Windows (x64)  | Linux (x64) |
|---|---|
| Windows PowerShell 5.1 (download WMF 5.1). PowerShell Core isn't supported.| Linux Hardening must not be enabled.  |
| .NET Framework 4.6.2 or later. |            |

### Package requirements for Linux

| Required package | Description | Minimum version |
|--------------------- | --------------------- | ------------------- |
| Glibc |GNU C Library | 2.5-12 |
| Openssl | OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported) |
| Curl | cURL web client | 7.15.5 |
| Python-ctypes | Foreign function library for Python | Python 2.x or Python 3.x are required |
| PAM | Pluggable Authentication Modules |       |

| Optional package | Description | Minimum version |
| --------------------- | --------------------- | ------------------- |
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. For instructions, see [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) | 6.0.0 |

> [!NOTE]
> Hybrid Runbook Worker is currently not supported for Virtual Machine Scale Sets (VMSS).

## Network requirements

### Proxy server use

If you use a proxy server for communication between Azure Automation and machines running the extension-base Hybrid Runbook Worker, ensure that the appropriate resources are accessible. The timeout for requests from the Hybrid Runbook Worker and Automation services is 30 seconds. After three attempts, a request fails.

> [!NOTE]
> For Azure VMs and Arc-enabled Servers, you can set up the proxy settings using PowerShell cmdlets or API. This is currently not supported for Arc-enabled VMware vSphere VMs. 

 To install the extension using cmdlets:
 
1. Get the automation account details using the below API call.

   ```http
   GET https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}?api-version=2021-06-22

   ```

   The API call will provide the value with the key: `AutomationHybridServiceUrl`. Use the URL in the next step to enable extension on the VM.

1. Install the Hybrid Worker Extension on the VM by running the following PowerShell cmdlet (Required module: Az.Compute). Use the `properties.automationHybridServiceUrl` provided by the above API call  
  

**Proxy server settings**
# [Windows](#tab/windows)

```azurepowershell-interactive
$settings = @{
    "AutomationAccountURL"  = "<registrationurl>";    
    "ProxySettings" = @{
        "ProxyServer" = "<ipaddress>:<port>";
        "UserName"="test";
    }
};
$protectedsettings = @{
"ProxyPassword" = "password";
};
```
**Azure VMs**

```powershell
Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
```

**Azure Arc-enabled VMs**

```powershell
New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Setting $settings -NoWait -EnableAutomaticUpgrade
```

# [Linux](#tab/linux)

```azurepowershell-interactive
$protectedsettings = @{
      "Proxy_URL"="http://username:password@<IP Address>"
};
$settings = @{
    "AutomationAccountURL"  = "<registration-url>";    
};
```
**Azure VMs**

```powershell
Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForLinux -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true
```

**Azure Arc-enabled VMs**

```powershell
New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForLinux -TypeHandlerVersion 1.1 -Setting $settings -EnableAutomaticUpgrade $true
```

---

### Firewall use

If you use a firewall to restrict access to the Internet, you must configure the firewall to permit access. The following port and URLs are required for the Hybrid Runbook Worker, and for [Automation State Configuration](./automation-dsc-overview.md) to communicate with Azure Automation.

| Property | Description |
| --- | --- |
| Port | 443 for outbound internet access |
| Global URL | *.azure-automation.net |
| Global URL of US Gov Virginia | *.azure-automation.us |

### CPU quota limit

There is a CPU quota limit of 25% while configuring extension-based Linux Hybrid Runbook worker. There is no such limit for Windows Hybrid Runbook Worker.

## Create hybrid worker group

To create a hybrid worker group in the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Automation account.

1. Under **Process Automation**, select **Hybrid worker groups**.

1. Select **+ Create hybrid worker group**.

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-groups-portal.png" alt-text="Screenshot showing to select hybrid Worker Groups option in portal.":::

1. From the **Basics** tab, in the **Name** text box, enter a name for your Hybrid worker group.

1. For the **Use Hybrid Worker Credentials** option:

   - If you select **Default**, the hybrid extension will be installed using the local system account.
   - If you select **Custom**, then from the drop-down list, select the credential asset.

1. Select **Next** to advance to the **Hybrid workers** tab. You can select Azure virtual machines, Azure Arc-enabled servers or Azure Arc-enabled VMware vSphere (preview) to be added to this Hybrid worker group. If you don't select any machines, an empty Hybrid worker group will be created. You can still add machines later.

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/basics-tab-portal.png" alt-text="Screenshot showing to enter name and credentials in basics tab.":::

1. Select **Add machines** to go to the **Add machines as hybrid worker** page. You'll only see machines that aren't part of any other hybrid worker group.

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine.

1. Select **Add**.

1. Select **Next** to advance to the **Review + Create** tab.

1. Select **Create**.

    The hybrid worker extension installs on the machine and the hybrid worker gets registered to the hybrid worker group. Adding a hybrid worker to the group happens immediately, while installation of the extension might take a few minutes. Select **Refresh** to see the new group. Select the group name to view the hybrid worker details.

   > [!NOTE]
   > A selected machine won't be added to a hybrid worker group if it is already part of another hybrid worker group.

## Add a machine to a hybrid worker group

You can also add machines to an existing hybrid worker group.

1. Under **Process Automation**, select **Hybrid worker groups** and then your existing hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

1. Select **+ Add** to go to the **Add machines as hybrid worker** page. You'll only see machines that aren't part of any other hybrid worker group. 

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-group-add-machine.png" alt-text="Screenshot showing the Add button to add machines to existing group.":::

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. 

   If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine. To install the `AzureConnectedMachineAgent` see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md) for Arc-enabled servers or see [Manage VMware virtual machines Azure Arc](../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md#enable-guest-management) to enable guest management for Arc-enabled VMware vSphere VMs.

1. Select **Add** to add the machine to the group.

   After adding, you can see the machine type as Azure virtual machine, Server-Azure Arc or VMware virtual machine-Azure Arc. The **Platform** field shows the worker as **Agent based (V1)** or **Extension based (V2)**.

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-group-platform-inline.png" alt-text="Screenshot of platform field showing agent or extension based." lightbox="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-group-platform-expanded.png":::

## Migrate an existing Agent based to Extension based Hybrid Workers

To utilize the benefits of extension based Hybrid Workers, you must migrate all existing agent based User Hybrid Workers to extension based Workers. A hybrid worker machine can co-exist on both **Agent based (V1)** and **Extension based (V2)** platforms. The extension based installation doesn't affect the installation or management of an agent based Worker.

To install Hybrid worker extension on an existing agent based hybrid worker, follow these steps:

1. Under **Process Automation**, select **Hybrid worker groups**, and then select your existing hybrid worker group to go to the **Hybrid worker group** page.
1. Under **Hybrid worker group**, select **Hybrid Workers** > **+ Add** to go to the **Add machines as hybrid worker** page.
1. Select the checkbox next to the existing Agent based (V1) Hybrid worker.
1. Select **Add** to append the machine to the group.

The Platform column shows the same Hybrid worker as both **Agent based (V1)** and **Extension based (V2)**. After you're confident of the extension based Hybrid Worker experience and use, you can remove the agent based Worker. 
   
For at-scale migration of multiple Agent based Hybrid Workers, you can also use other [channels](#manage-hybrid-worker-extension-using-bicep--arm-templates-rest-api-azure-cli-and-powershell) such as - Bicep, ARM templates, PowerShell cmdlets, REST API, and Azure CLI.


## Delete a Hybrid Runbook Worker

You can delete the Hybrid Runbook Worker from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

1. Select the checkbox next to the machine(s) you want to delete from the hybrid worker group.

1. Select **Delete**.

   You'll be presented with a warning in a dialog box **Delete Hybrid worker** that the selected hybrid worker would be deleted permanently. Select **Delete**. This operation will delete the extension for the **Extension based (V2)** worker or remove the **Agent based (V1)** entry from the portal. However, it leaves the stale hybrid worker on the VM. To manually uninstall the agent, see [Uninstall agent](../azure-monitor/agents/agent-manage.md#uninstall-agent).

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/delete-machine-from-group.png" alt-text="Screenshot showing to delete virtual machine from existing group.":::

   > [!NOTE]
   > - A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. If you install **Extension based (V2)** on a hybrid worker already running **Agent based (V1)**, then you would see two entries of the Hybrid Runbook Worker in the group. One with Platform **Extension based (V2)** and the other **Agent based (V1)**. </br> </br>
   > - After you disable the Private Link in your Automation account, it might take up to 60 minutes to remove the Hybrid Runbook worker.

## Delete a Hybrid Runbook Worker group

You can delete an empty Hybrid Runbook Worker group from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Select **Delete**.

   A warning message appears to remove any machines that are defined as hybrid workers in the hybrid worker group. If there's already a worker added to the group, you'll first have to delete the worker from the group.

1. Select **Yes**.

   The hybrid worker group will be deleted.


## Automatic upgrade of extension

Hybrid Worker extension supports [Automatic upgrade](../virtual-machines/automatic-extension-upgrade.md) of minor versions by default. We recommend that you enable Automatic upgrades to take advantage of any security or feature updates without manual overhead. However, to prevent the extension from automatically upgrading (for example, if there is a strict change windows and can only be updated at specific time), you can opt out of this feature by setting the `enableAutomaticUpgrade`property in ARM, Bicep template, PowerShell cmdlets to *false*. Set the same property to *true* whenever you want to re-enable the Automatic upgrade.

```powershell
$extensionType = "HybridWorkerForLinux/HybridWorkerForWindows"
$extensionName = "HybridWorkerExtension"
$publisher = "Microsoft.Azure.Automation.HybridWorker"
Set-AzVMExtension -ResourceGroupName <RGName> -Location <Location>  -VMName <vmName> -Name $extensionName -Publisher $publisher -ExtensionType $extensionType -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
```
Major version upgrades must be managed manually. Run the below cmdlets with the latest TypeHandlerVersion.

> [!NOTE]
> If you had installed the Hybrid Worker extension during the public preview, ensure to upgrade it to the latest major version.

**Azure VMs**

```powershell
Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
```
**Azure Arc-enabled VMs**

```powershell
New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Setting $settings -NoWait -EnableAutomaticUpgrade
```


## Manage Hybrid Worker extension using Bicep & ARM templates, REST API, Azure CLI, and PowerShell

#### [Bicep template](#tab/bicep-template)

You can use the Bicep template to create a new Hybrid Worker group, create a new Azure Windows VM and add it to an existing Hybrid Worker Group. Learn more about [Bicep](../azure-resource-manager/bicep/overview.md).

Follow the steps mentioned below as an example:

1. Create a Hybrid Worker Group.
1. Create either an Azure VM or Arc-enabled server. Alternatively, you can also use an existing Azure VM or Arc-enabled server.
1. Connect the Azure VM or Arc-enabled server to the above created Hybrid Worker Group. 
1. Generate a new GUID and pass it as the name of the Hybrid Worker.
1. Enable System-assigned managed identity on the VM.
1. Install Hybrid Worker Extension on the VM.
1. To confirm if the extension has been successfully installed on the VM, in **Azure portal**, go to the VM > **Extensions** tab and check the status of the Hybrid Worker extension installed on the VM.

```Bicep
param automationAccount string
param automationAccountLocation string
param workerGroupName string

@description('Name of the virtual machine.')
param virtualMachineName string

@description('Username for the Virtual Machine.')
param adminUsername string

@description('Password for the Virtual Machine.')
@minLength(12)
@secure()
param adminPassword string

@description('Location for the VM.')
param vmLocation string = 'North Central US'

@description('Size of the virtual machine.')
param vmSize string = 'Standard_DS1_v2'

@description('The Windows version for the VM. This will pick a fully patched image of this given Windows version.')
@allowed([
  '2008-R2-SP1'
  '2012-Datacenter'
  '2012-R2-Datacenter'
  '2016-Nano-Server'
  '2016-Datacenter-with-Containers'
  '2016-Datacenter'
  '2019-Datacenter'
  '2019-Datacenter-Core'
  '2019-Datacenter-Core-smalldisk'
  '2019-Datacenter-Core-with-Containers'
  '2019-Datacenter-Core-with-Containers-smalldisk'
  '2019-Datacenter-smalldisk'
  '2019-Datacenter-with-Containers'
  '2019-Datacenter-with-Containers-smalldisk'
])
param osVersion string = '2019-Datacenter'

@description('DNS name for the public IP')
param dnsNameForPublicIP string

var nicName_var = 'myVMNict'
var addressPrefix = '10.0.0.0/16'
var subnetName = 'Subnet'
var subnetPrefix = '10.0.0.0/24'
var subnetRef = resourceId('Microsoft.Network/virtualNetworks/subnets', virtualNetworkName_var, subnetName)
var vmName_var = virtualMachineName
var virtualNetworkName_var = 'MyVNETt'
var publicIPAddressName_var = 'myPublicIPt'
var networkSecurityGroupName_var = 'default-NSGt'
var UniqueStringBasedOnTimeStamp = uniqueString(resourceGroup().id)

resource publicIPAddressName 'Microsoft.Network/publicIPAddresses@2020-08-01' = {
  name: publicIPAddressName_var
  location: vmLocation
  properties: {
    publicIPAllocationMethod: 'Dynamic'
    dnsSettings: {
      domainNameLabel: dnsNameForPublicIP
    }
  }
}

resource networkSecurityGroupName 'Microsoft.Network/networkSecurityGroups@2020-08-01' = {
  name: networkSecurityGroupName_var
  location: vmLocation
  properties: {
    securityRules: [
      {
        name: 'default-allow-3389'
        properties: {
          priority: 1000
          access: 'Allow'
          direction: 'Inbound'
          destinationPortRange: '3389'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
        }
      }
    ]
  }
}

resource virtualNetworkName 'Microsoft.Network/virtualNetworks@2020-08-01' = {
  name: virtualNetworkName_var
  location: vmLocation
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: subnetPrefix
          networkSecurityGroup: {
            id: networkSecurityGroupName.id
          }
        }
      }
    ]
  }
}

resource nicName 'Microsoft.Network/networkInterfaces@2020-08-01' = {
  name: nicName_var
  location: vmLocation
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicIPAddressName.id
          }
          subnet: {
            id: subnetRef
          }
        }
      }
    ]
  }
  dependsOn: [

    virtualNetworkName
  ]
}

resource vmName 'Microsoft.Compute/virtualMachines@2020-12-01' = {
  name: vmName_var
  location: vmLocation
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    hardwareProfile: {
      vmSize: vmSize
    }
    osProfile: {
      computerName: vmName_var
      adminUsername: adminUsername
      adminPassword: adminPassword
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsServer'
        offer: 'WindowsServer'
        sku: osVersion
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: nicName.id
        }
      ]
    }
  }
}

resource automationAccount_resource 'Microsoft.Automation/automationAccounts@2021-06-22' = {
  name: automationAccount
  location: automationAccountLocation
  properties: {
    sku: {
      name: 'Basic'
    }
  }
}

resource automationAccount_workerGroupName 'Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups@2022-02-22' = {
  parent: automationAccount_resource
  name: workerGroupName
  dependsOn: [

    vmName
  ]
}

resource automationAccount_workerGroupName_testhw_UniqueStringBasedOnTimeStamp 'Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers@2021-06-22' = {
  parent: automationAccount_workerGroupName
  name: guid('testhw', UniqueStringBasedOnTimeStamp)
  properties: {
    vmResourceId: resourceId('Microsoft.Compute/virtualMachines', virtualMachineName)
  }
  dependsOn: [
    vmName
  ]
}

resource virtualMachineName_HybridWorkerExtension 'Microsoft.Compute/virtualMachines/extensions@2022-03-01' = {
  name: '${virtualMachineName}/HybridWorkerExtension'
  location: vmLocation
  properties: {
    publisher: 'Microsoft.Azure.Automation.HybridWorker'
    type: 'HybridWorkerForWindows'
    typeHandlerVersion: '1.1'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
    settings: {
      AutomationAccountURL: automationAccount_resource.properties.automationHybridServiceUrl
    }
  }
  dependsOn: [
    vmName
  ]
}

output output1 string = automationAccount_resource.properties.automationHybridServiceUrl
```

#### [ARM template](#tab/arm-template)

You can use an Azure Resource Manager (ARM) template to create a new Azure Windows VM and connect it to an existing Automation account and Hybrid Worker Group. To learn more about ARM templates, see [What are ARM templates?](../azure-resource-manager/templates/overview.md)

Follow the steps mentioned below as an example:

1. Create a Hybrid Worker Group.
1. Create either an Azure VM or Arc-enabled server. Alternatively, you can also use an existing Azure VM or Arc-enabled server.
1. Connect the Azure VM or Arc-enabled server to the above created Hybrid Worker Group. 
1. Generate a new GUID and pass it as the name of the Hybrid Worker.
1. Enable System-assigned managed identity on the VM.
1. Install Hybrid Worker Extension on the VM.
1. To confirm if the extension has been successfully installed on the VM, in **Azure portal**, go to the VM > **Extensions** tab and check the status of the Hybrid Worker extension installed on the VM.


**Review the template**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "automationAccount": {
      "type": "string"
    },
    "automationAccountLocation": {
      "type": "string"
    },
    "workerGroupName": {
      "type": "string"
    },
    "virtualMachineName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "Username for the Virtual Machine."
      }
    },
    "adminPassword": {
      "type": "securestring",
      "minLength": 12,
      "metadata": {
        "description": "Password for the Virtual Machine."
      }
    },
    "vmLocation": {
      "type": "string",
      "defaultValue": "North Central US",
      "metadata": {
        "description": "Location for the VM."
      }
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_DS1_v2",
      "metadata": {
        "description": "Size of the virtual machine."
      }
    },
    "osVersion": {
      "type": "string",
      "defaultValue": "2019-Datacenter",
      "allowedValues": [
        "2008-R2-SP1",
        "2012-Datacenter",
        "2012-R2-Datacenter",
        "2016-Nano-Server",
        "2016-Datacenter-with-Containers",
        "2016-Datacenter",
        "2019-Datacenter",
        "2019-Datacenter-Core",
        "2019-Datacenter-Core-smalldisk",
        "2019-Datacenter-Core-with-Containers",
        "2019-Datacenter-Core-with-Containers-smalldisk",
        "2019-Datacenter-smalldisk",
        "2019-Datacenter-with-Containers",
        "2019-Datacenter-with-Containers-smalldisk"
      ],
      "metadata": {
        "description": "The Windows version for the VM. This will pick a fully patched image of this given Windows version."
      }
    },
    "dnsNameForPublicIP": {
      "type": "string",
      "metadata": {
        "description": "DNS name for the public IP"
      }
    },
    "_CurrentDateTimeInTicks": {
      "type": "string",
      "defaultValue": "[utcNow('yyyy-MM-dd')]"
    }
  },
  "variables": {
    "nicName": "myVMNict",
    "addressPrefix": "10.0.0.0/16",
    "subnetName": "Subnet",
    "subnetPrefix": "10.0.0.0/24",
    "subnetRef": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]",
    "vmName": "[parameters('virtualMachineName')]",
    "virtualNetworkName": "MyVNETt",
    "publicIPAddressName": "myPublicIPt",
    "networkSecurityGroupName": "default-NSGt",
    "UniqueStringBasedOnTimeStamp": "[uniqueString(deployment().name, parameters('_CurrentDateTimeInTicks'))]"
  },
  "resources": [
    {
      "apiVersion": "2020-08-01",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[variables('publicIPAddressName')]",
      "location": "[parameters('vmLocation')]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
        "dnsSettings": {
          "domainNameLabel": "[parameters('dnsNameForPublicIP')]"
        }
      }
    },
    {
      "comments": "Default Network Security Group for template",
      "type": "Microsoft.Network/networkSecurityGroups",
      "apiVersion": "2020-08-01",
      "name": "[variables('networkSecurityGroupName')]",
      "location": "[parameters('vmLocation')]",
      "properties": {
        "securityRules": [
          {
            "name": "default-allow-3389",
            "properties": {
              "priority": 1000,
              "access": "Allow",
              "direction": "Inbound",
              "destinationPortRange": "3389",
              "protocol": "Tcp",
              "sourceAddressPrefix": "*",
              "sourcePortRange": "*",
              "destinationAddressPrefix": "*"
            }
          }
        ]
      }
    },
    {
      "apiVersion": "2020-08-01",
      "type": "Microsoft.Network/virtualNetworks",
      "name": "[variables('virtualNetworkName')]",
      "location": "[parameters('vmLocation')]",
      "dependsOn": [
        "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
      ],
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[variables('addressPrefix')]"
          ]
        },
        "subnets": [
          {
            "name": "[variables('subnetName')]",
            "properties": {
              "addressPrefix": "[variables('subnetPrefix')]",
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
              }
            }
          }
        ]
      }
    },
    {
      "apiVersion": "2020-08-01",
      "type": "Microsoft.Network/networkInterfaces",
      "name": "[variables('nicName')]",
      "location": "[parameters('vmLocation')]",
      "dependsOn": [
        "[variables('publicIPAddressName')]",
        "[variables('virtualNetworkName')]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIPAddressName'))]"
              },
              "subnet": {
                "id": "[variables('subnetRef')]"
              }
            }
          }
        ]
      }
    },
    {
      "apiVersion": "2020-12-01",
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[variables('vmName')]",
      "location": "[parameters('vmLocation')]",
      "dependsOn": [
        "[variables('nicName')]"
      ],
      "identity": {
             "type": "SystemAssigned"
      } ,
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "computerName": "[variables('vmName')]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "MicrosoftWindowsServer",
            "offer": "WindowsServer",
            "sku": "[parameters('osVersion')]",
            "version": "latest"
          },
          "osDisk": {
            "createOption": "FromImage"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.Automation/automationAccounts",
      "apiVersion": "2021-06-22",
      "name": "[parameters('automationAccount')]",
      "location": "[parameters('automationAccountLocation')]",
      "properties": {
        "sku": {
          "name": "Basic"
        }
      },
      "resources": [
        {
          "name": "[parameters('workerGroupName')]",
          "type": "hybridRunbookWorkerGroups",
          "apiVersion": "2022-02-22",
          "dependsOn": [
            "[resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))]",
            "[resourceId('Microsoft.Compute/virtualMachines', variables('vmName'))]"
          ],
          "resources" : [
            {
              "name": "[guid('testhw', variables('UniqueStringBasedOnTimeStamp'))]",
              "type": "hybridRunbookWorkers",
              "apiVersion": "2021-06-22",
              "dependsOn": [
                "[resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))]",
                "[resourceId('Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups', parameters('automationAccount'),parameters('workerGroupName'))]",
                "[resourceId('Microsoft.Compute/virtualMachines', variables('vmName'))]"
              ],
              "properties": {
                "vmResourceId": "[resourceId('Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
              }
            }
          ]
        }
      ]
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[concat(parameters('virtualMachineName'),'/HybridWorkerExtension')]",
      "apiVersion": "2022-03-01",
      "location": "[parameters('vmLocation')]",
      "dependsOn": [
        "[resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))]",
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
      ],
      "properties": {
        "publisher": "Microsoft.Azure.Automation.HybridWorker",
        "type": "HybridWorkerForWindows",
        "typeHandlerVersion": "1.1",
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true,
        "settings": {
          "AutomationAccountURL": "[reference(resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))).AutomationHybridServiceUrl]"
        }
      }
    }
  ],
  "outputs": {
    "output1": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))).AutomationHybridServiceUrl]"
    }
  }
}
```

The following Azure resources are defined in the template:

- [hybridRunbookWorkerGroups/hybridRunbookWorkers](/azure/templates/microsoft.automation/automationaccounts/hybridrunbookworkergroups/hybridrunbookworkers)
- [Microsoft.Compute/virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions)

**Review parameters**

Review the parameters used in this template.

| Property | Description |
| --- | --- |
| automationAccount | The name of the existing Automation account. |
| automationAccountLocation | The region of the existing Automation account. |
| workerGroupName | The name of the existing Hybrid Worker Group. |
| virtualMachineName | The name for the VM to be created. The default value is `simple-vm`. |
| adminUsername | The VM admin user name. |
| adminPassword | The VM admin password. |
| vmLocation | The region for the new VM. The default value is `North Central US`. |
| vmSize | The size for the new VM. The default value is `Standard_DS1_v2`. |
| osVersion | The OS for the new Windows VM. The default value is `2019-Datacenter`. |
| dnsNameForPublicIP | The DNS name for the public IP. |

 
#### [REST API](#tab/rest-api)

**Prerequisites**

You would require an Azure VM or Arc-enabled server. You can follow the steps [here](../azure-arc/servers/onboard-portal.md) to create an Arc connected machine.

**Install and use Hybrid Worker extension**

To install and use Hybrid Worker extension using REST API, follow these steps. The West Central US region is considered in this example.

1. Create a Hybrid Worker Group by making this API call.

   ```http
   PUT https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/hybridRunbookWorkerGroups/{hybridRunbookWorkerGroupName}?api-version=2021-06-22

   ```

   The request body should contain the following information:

   ```http
   {
   }
   ```

   Response of _PUT_ confirms if the Hybrid worker group is created or not. To reconfirm, you have to make another GET call on Hybrid worker group as follows:

   ```http
   GET https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/hybridRunbookWorkerGroups/{hybridRunbookWorkerGroupName}?api-version=2021-06-22

   ```

1. Connect a VM to the above created Hybrid Worker Group by making the below API call. Before making the call, generate a new GUID to be used as _hybridRunbookWorkerId_.

   ```http
   PUT https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/hybridRunbookWorkerGroups/{hybridRunbookWorkerGroupName}/hybridRunbookWorkers/{hybridRunbookWorkerId}?api-version=2021-06-22

   ```

   The request body should contain the following information:

   ```json
   {
   "properties": {"vmResourceId": "{VmResourceId}"}
   }
   ```

   Response of PUT call confirms if the Hybrid worker is created or not. To reconfirm, you would have to make another GET call on Hybrid worker as follows.

   ```http
   GET https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/hybridRunbookWorkerGroups/{hybridRunbookWorkerGroupName}/hybridRunbookWorkers/{hybridRunbookWorkerId}?api-version=2021-06-22

   ```
    
1. Follow the steps [here](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm) to enable the System-assigned managed identity on the VM.

1. Get the automation account details using this API call.

   ```http
   GET https://westcentralus.management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/HybridWorkerExtension?api-version=2021-06-22

   ```

   The API call will provide the value with the key: `AutomationHybridServiceUrl`. Use the URL in the next step to enable extension on the VM.

1. Install the Hybrid Worker Extension on Azure VM by using the following API call. 
  
    ```http
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}/extensions/HybridWorkerExtension?api-version=2021-11-01

    ```
   
   The request body should contain the following information:

    ```json
    {
    "location": "<VMLocation>",
    "properties": {
    "publisher": "Microsoft.Azure.Automation.HybridWorker",
    "type": "<HybridWorkerForWindows/HybridWorkerForLinux>",
    "typeHandlerVersion": <version>,
    "settings": {
      "AutomationAccountURL" = "<AutomationHybridServiceUrl>"
      }
     }
    }

    ```
   
   For ARC VMs, use the below API call for enabling the extension:

    ```http
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HybridCompute/machines/{machineName}/extensions/{extensionName}?api-version=2021-05-20

    ```
      
   The request body should contain the following information:

    ```json
    {
    "location": "<VMLocation>",
    "properties": {
    "publisher": "Microsoft.Azure.Automation.HybridWorker",
    "type": "<HybridWorkerForWindows/HybridWorkerForLinux>",
    "typeHandlerVersion": <version>,
    "settings": {
      "AutomationAccountURL" = "<AutomationHybridServiceUrl>"
      }
     }
    }
    ```
   Response of the *PUT* call will confirm if the extension is successfully installed or not on the targeted VM. You can also go to the VM in the Azure portal, and check status of extensions installed on the target VM under **Extensions** tab.

#### [Azure CLI](#tab/cli)

You can use Azure CLI to create a new Hybrid Worker group, create a new Azure VM, add it to an existing Hybrid Worker Group and install the Hybrid Worker extension. Learn more about [Azure CLI](/cli/azure/what-is-azure-cli).

Follow the steps mentioned below as an example:

1. Create a Hybrid Worker Group.
   ```azurecli-interactive
      az automation hrwg create --automation-account-name accountName --resource-group groupName --name hybridrunbookworkergroupName
   ```
1. Create an Azure VM or Arc-enabled server and add it to the above created Hybrid Worker Group. Use the below command to add an existing Azure VM or Arc-enabled Server to the Hybrid Worker Group. Generate a new GUID and pass it as `hybridRunbookWorkerGroupName`. To fetch `vmResourceId`, go to the **Properties** tab of the VM on Azure portal.

   ```azurecli-interactive
    az automation hrwg hrw create --automation-account-name accountName --resource-group groupName --hybrid-runbook-worker-group-name hybridRunbookWorkerGroupName --hybrid-runbook-worker-id
   ```
1. Follow the steps [here](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm) to enable the System-assigned managed identity on the VM.
1. Install Hybrid Worker Extension on the VM

   ```azurecli-interactive
       az vm extension set --name HybridWorkerExtension --publisher Microsoft.Azure.Automation.HybridWorker --version 1.1 --vm-name <vmname> -g <resourceGroupName> \ 
      --settings '{"AutomationAccountURL" = "<registration-url>";}' --enable-auto-upgrade true 
   ```
1. To confirm if the extension has been successfully installed on the VM, in **Azure portal**, go to the VM > **Extensions** tab and check the status of the Hybrid Worker extension installed on the VM.

**Manage Hybrid Worker Extension**

- To create, delete, and manage extension-based Hybrid Runbook Worker groups, see [az automation hrwg | Microsoft Docs](/cli/azure/automation/hrwg)
- To create, delete, and manage extension-based Hybrid Runbook Worker, see [az automation hrwg hrw | Microsoft Docs](/cli/azure/automation/hrwg/hrw)

After creating new Hybrid Runbook Worker, you must install the extension on the Hybrid Worker using [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set).


#### [PowerShell](#tab/ps)

You can use PowerShell cmdlets to create a new Hybrid Worker group, create a new Azure VM, add it to an existing Hybrid Worker Group and install the Hybrid Worker extension.

Follow the steps mentioned below as an example:

1. Create a Hybrid Worker Group.

   ```powershell-interactive
       New-AzAutomationHybridRunbookWorkerGroup -AutomationAccountName "Contoso17" -Name "RunbookWorkerGroupName" -ResourceGroupName "ResourceGroup01" 
   ```
1. Create an Azure VM or Arc-enabled server and add it to the above created Hybrid Worker Group. Use the below command to add an existing Azure VM or Arc-enabled Server to the Hybrid Worker Group. Generate a new GUID and pass it as `hybridRunbookWorkerGroupName`. To fetch `vmResourceId`, go to the **Properties** tab of the VM on Azure portal.

    ```azurepowershell
      New-AzAutomationHybridRunbookWorker -AutomationAccountName "Contoso17" -Name "RunbookWorkerName" -HybridRunbookWorkerGroupName "RunbookWorkerGroupName" -VmResourceId "VmResourceId" -ResourceGroupName "ResourceGroup01" 
    ```
1. Follow the steps [here](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm) to enable the System-assigned managed identity on the VM.

1. Install Hybrid Worker Extension on the VM.
  
    **Hybrid Worker extension settings**

    ```powershell-interactive
      $settings = @{
    "AutomationAccountURL"  = "<registrationurl>";
    };
    ```
    
    **Azure VMs**

   ```powershell
    Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
   ```
    **Azure Arc-enabled VMs**

   ```powershell
     New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Setting $settings -NoWait -EnableAutomaticUpgrade
   ```

1.  To confirm if the extension has been successfully installed on the VM, In **Azure portal**, go to the VM > **Extensions** tab and check the status of Hybrid Worker extension installed on the VM.


**Manage Hybrid Worker Extension**

You can use the following PowerShell cmdlets to manage Hybrid Runbook Worker and Hybrid Runbook Worker groups:

| PowerShell cmdlet | Description |
| ----- | ----------- |
|[`Get-AzAutomationHybridRunbookWorkerGroup`](/powershell/module/az.automation/get-azautomationhybridrunbookworkergroup) | Gets Hybrid Runbook Worker group|
|[`Remove-AzAutomationHybridRunbookWorkerGroup`](/powershell/module/az.automation/remove-azautomationhybridrunbookworkergroup) | Removes Hybrid Runbook Worker group|
|[`Set-AzAutomationHybridRunbookWorkerGroup`](/powershell/module/az.automation/set-azautomationhybridrunbookworkergroup) | Updates Hybrid Worker group with Hybrid Worker credentials|
|[`New-AzAutomationHybridRunbookWorkerGroup`](/powershell/module/az.automation/new-azautomationhybridrunbookworkergroup) | Creates new Hybrid Runbook Worker group|
|[`Get-AzAutomationHybridRunbookWorker`](/powershell/module/az.automation/get-azautomationhybridrunbookworker) | Gets Hybrid Runbook Worker|
|[`Move-AzAutomationHybridRunbookWorker`](/powershell/module/az.automation/move-azautomationhybridrunbookworker) | Moves Hybrid Worker from one group to other|
|[`New-AzAutomationHybridRunbookWorker`](/powershell/module/az.automation/new-azautomationhybridrunbookworker) | Creates new Hybrid Runbook Worker|
|[`Remove-AzAutomationHybridRunbookWorker`](/powershell/module/az.automation/remove-azautomationhybridrunbookworker)| Removes Hybrid Runbook Worker|

After creating new Hybrid Runbook Worker, you must install the extension on the Hybrid Worker.

**Hybrid Worker extension settings**

```powershell-interactive
$settings = @{
    "AutomationAccountURL"  = "<registrationurl>";
};
```
**Azure VMs**

```powershell
Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
```
**Azure Arc-enabled VMs**

```powershell
New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Setting $settings -NoWait -EnableAutomaticUpgrade
```
---

## Manage Role permissions for Hybrid Worker Groups and Hybrid Workers

You can create custom Azure Automation roles and grant following permissions to Hybrid Worker Groups and Hybrid Workers. To learn more about how to create Azure Automation custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).

**Actions** | **Description**
--- | ---
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/write | Creates a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete | Deletes a Hybrid Runbook Worker Group.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/read | Reads a Hybrid Runbook Worker.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/write | Creates a Hybrid Runbook Worker.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/move/action | Moves Hybrid Runbook Worker from one Worker Group to another.
Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/hybridRunbookWorkers/delete | Deletes a Hybrid Runbook Worker.


## Check version of Hybrid Worker
To check the version of the extension-based Hybrid Runbook Worker:

|OS types | Paths | Description|
|--- |--- |--- |
|**Windows** |`C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\`| The path has *version* folder that has the version information. |
|**Linux** | `/var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-<version>` | The folder name ends with *version* information. |


## Monitor performance of Hybrid Workers using VM insights

Using [VM insights](../azure-monitor/vm/vminsights-overview.md), you can monitor the performance of Azure VMs and Arc-enabled Servers deployed as Hybrid Runbook workers. Among multiple elements that are considered during performances, the VM insights monitors the key operating system performance indicators related to processor, memory, network adapter, and disk utilization.
- For Azure VMs, see [How to chart performance with VM insights](../azure-monitor/vm/vminsights-performance.md).
- For Arc-enabled servers, see [Tutorial: Monitor a hybrid machine with VM insights](../azure-arc/servers/learn/tutorial-enable-vm-insights.md).

## Next steps

- To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environments, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

- To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/extension-based-hybrid-runbook-worker.md).

- To learn about Azure VM extensions, see [Azure VM extensions and features for Windows](../virtual-machines/extensions/features-windows.md) and [Azure VM extensions and features for Linux](../virtual-machines/extensions/features-linux.md).

- To learn about VM extensions for Arc-enabled servers, see [VM extension management with Azure Arc-enabled servers](../azure-arc/servers/manage-vm-extensions.md).
- To learn about VM extensions for Arc-enabled VMware vSphere VMs, see [Manage VMware VMs in Azure through Arc-enabled VMware vSphere (preview)](../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md).
