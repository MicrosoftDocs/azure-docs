---
title: Migrate an existing agent-based hybrid workers to extension-based-workers in Azure Automation
description: This article provides information on how to migrate an existing agent-based hybrid worker to extension based workers.
services: automation
ms.subservice: process-automation
ms.date: 03/15/2023
ms.topic: how-to
#Customer intent: As a developer, I want to learn about extension so that I can efficiently migrate agent based hybrid workers to extension based workers.
---

# Migrate the existing agent-based hybrid workers to extension-based hybrid workers

> [!IMPORTANT]
>  Azure Automation Agent-based User Hybrid Runbook Worker (Windows and Linux) will retire on **31 August 2024** and wouldn't be supported after that date. You must complete migrating existing Agent-based User Hybrid Runbook Workers to Extension-based Workers before 31 August 2024. Moreover, starting **1 October 2023**, creating new Agent-based Hybrid Workers wouldn't be possible. [Learn more](migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md).

This article describes the benefits of Extension-based User Hybrid Runbook Worker and how to migrate existing Agent-based User Hybrid Runbook Workers to Extension-based Hybrid Workers. 

There are two Hybrid Runbook Workers installation platforms supported by Azure Automation:
- **Agent based hybrid runbook worker** (V1) -  The Agent-based hybrid runbook worker depends on the [Log Analytics Agent](../azure-monitor/agents/log-analytics-agent.md).
- **Extension based hybrid runbook worker** (V2) - The Extension-based hybrid runbook worker provides native integration of the hybrid runbook worker role through the Virtual machine (VM) extension framework. 

The process of executing runbooks on Hybrid Runbook Workers remains the same for both.

## Benefits of Extension-based User Hybrid Runbook Workers over Agent-based workers

The purpose of the Extension-based approach is to simplify the installation and management of the Hybrid Worker and remove the complexity working with the Agent-based version. Here are some key benefits:

- **Seamless onboarding** – The Agent-based approach for onboarding Hybrid Runbook worker is dependent on the Log Analytics Agent, which is a multi-step, time-consuming, and error-prone process. The Extension-based approach offers more security and is no longer dependent on the Log Analytics Agent. 

- **Ease of Manageability** – It offers native integration with Azure Resource Manager (ARM) identity for Hybrid Runbook Worker and provides the flexibility for governance at scale through policies and templates. 

- **Azure Active Directory based authentication** – It uses a VM system-assigned managed identities provided by Azure Active Directory. This centralizes control and management of identities and resource credentials. 

- **Unified experience** – It offers an identical experience for managing Azure and off-Azure Arc-enabled machines. 

- **Multiple onboarding channels** – You can choose to onboard and manage Extension-based workers through the Azure portal, PowerShell cmdlets, Bicep, ARM templates, REST API and Azure CLI.  

- **Default Automatic upgrade** – It offers Automatic upgrade of minor versions by default, significantly reducing the manageability of staying updated on the latest version. We recommend enabling Automatic upgrades to take advantage of any security or feature updates without the manual overhead. You can also opt out of automatic upgrades at any time. Any major version upgrades are currently not supported and should be managed manually.

>[!NOTE]
> The Extension-based Hybrid Runbook Worker only supports the User Hybrid Runbook Worker type, and doesn't include the System Hybrid Runbook Worker required for the Update Management feature.

## Prerequisites

### Machine minimum requirements

- Two cores
- 4 GB of RAM
- **Non-Azure machines** must have the [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) installed. To install the `AzureConnectedMachineAgent`, see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md) for Arc-enabled servers or see [Manage VMware virtual machines Azure Arc](../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md#enable-guest-management) to enable guest management for Arc-enabled VMware vSphere VMs.
- The system-assigned managed identity must be enabled on the Azure virtual machine, Arc-enabled server or Arc-enabled VMware vSphere VM.  If the system-assigned managed identity isn't enabled, it will be enabled as part of the installation process through the Azure portal.
 
### Supported operating systems

| Windows | Linux |
|---|---|
| &#9679; Windows Server 2022 (including Server Core) <br> &#9679; Windows Server 2019 (including Server Core) <br> &#9679; Windows Server 2016, version 1709 and 1803 (excluding Server Core) <br> &#9679; Windows Server 2012, 2012 R2 <br> &#9679; Windows 10 Enterprise (including multi-session) and Pro| &#9679; Debian GNU/Linux 8,9,10, and 11 <br> &#9679; Ubuntu 18.04 LTS, 20.04 LTS, and 22.04 LTS <br> &#9679; SUSE Linux Enterprise Server 15.2, and 15.3 <br> &#9679; Red Hat Enterprise Linux Server 7, and 8 </br> *Hybrid Worker extension would follow support timelines of the OS vendor. |

### Other Requirements

| Windows | Linux |
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

### Permissions for Hybrid Worker credentials

If agent-based Hybrid Worker is using custom Hybrid Worker credentials, then ensure that following permissions are assigned to the custom user to avoid jobs from getting suspended on the extension-based Hybrid Worker.

| **Resource type** | **Folder permissions** |
| --- | --- |
|Azure VM | C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows (read and execute) |
|Arc-enabled Server | C:\ProgramData\AzureConnectedMachineAgent\Tokens (read)</br> C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows (read and execute) |

> [!NOTE]
> Hybrid Runbook Worker is currently not supported for Virtual Machine Scale Sets (VMSS).

## Migrate an existing Agent based Hybrid Worker to Extension based Hybrid Worker

To utilize the benefits of extension based Hybrid Workers, you must migrate all existing agent based User Hybrid Workers to extension based Workers. A hybrid worker machine can co-exist on both **Agent based (V1)** and **Extension based (V2)** platforms. The extension based installation doesn't affect the installation or management of an agent based Worker.

To install Hybrid worker extension on an existing agent based hybrid worker, follow these steps:

1. Under **Process Automation**, select **Hybrid worker groups**, and then select your existing hybrid worker group to go to the **Hybrid worker group** page.
1. Under **Hybrid worker group**, select **Hybrid Workers** > **+ Add** to go to the **Add machines as hybrid worker** page.
1. Select the checkbox next to the existing Agent based (V1) Hybrid worker. If you don't see your agent-based Hybrid Worker listed, ensure Azure Arc Connected Machine agent is installed on the machine. To install the `AzureConnectedMachineAgent`, see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md) for Arc-enabled servers, or see [Manage VMware virtual machines Azure Arc](../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md#enable-guest-management) to enable guest management for Arc-enabled VMware vSphere VMs.

   :::image type="content" source="./media/migrate-existing-agent-based-hybrid-worker-extension-based-hybrid-worker/add-machines-hybrid-worker-inline.png" alt-text="Screenshot of adding machines as hybrid worker." lightbox="./media/migrate-existing-agent-based-hybrid-worker-extension-based-hybrid-worker/add-machines-hybrid-worker-expanded.png":::

1. Select **Add** to append the machine to the group.

   The **Platform** column shows the same Hybrid worker as both **Agent based (V1)** and **Extension based (V2)**. After you're confident of the extension based Hybrid Worker experience and use, you can [remove](#remove-agent-based-hybrid-worker) the agent based Worker. 

   :::image type="content" source="./media/migrate-existing-agent-based-hybrid-worker-extension-based-hybrid-worker/hybrid-workers-group-platform-inline.png" alt-text="Screenshot of platform field showing agent or extension based hybrid worker." lightbox="./media/migrate-existing-agent-based-hybrid-worker-extension-based-hybrid-worker/hybrid-workers-group-platform-expanded.png":::

For at-scale migration of multiple Agent based Hybrid Workers, you can also use other [channels](#manage-hybrid-worker-extension-using-bicep--arm-templates-rest-api-azure-cli-and-powershell) such as - Bicep, ARM templates, PowerShell cmdlets, REST API, and Azure CLI.


## Manage Hybrid Worker extension using Bicep & ARM templates, REST API, Azure CLI, and PowerShell

#### [Bicep template](#tab/bicep-template)

You can use the Bicep template to create a new Hybrid Worker group, create a new Azure Windows VM and add it to an existing Hybrid Worker Group. Learn more about [Bicep](../azure-resource-manager/bicep/overview.md).

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

**Manage Hybrid Worker Extension**

- To create, delete, and manage extension-based Hybrid Runbook Worker groups, see [az automation hrwg | Microsoft Docs](/cli/azure/automation/hrwg?view=azure-cli-latest)
- To create, delete, and manage extension-based Hybrid Runbook Worker, see [az automation hrwg hrw | Microsoft Docs](/cli/azure/automation/hrwg/hrw?view=azure-cli-latest)

After creating new Hybrid Runbook Worker, you must install the extension on the Hybrid Worker using [az vm extension set](/cli/azure/vm/extension?view=azure-cli-latest#az-vm-extension-set).


#### [PowerShell](#tab/ps)

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

**Azure VMs**

```powershell
Set-AzVMExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -VMName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Settings $settings -EnableAutomaticUpgrade $true/$false
```
**Azure Arc-enabled VMs**

```powershell
New-AzConnectedMachineExtension -ResourceGroupName <VMResourceGroupName> -Location <VMLocation> -MachineName <VMName> -Name "HybridWorkerExtension" -Publisher "Microsoft.Azure.Automation.HybridWorker" -ExtensionType HybridWorkerForWindows -TypeHandlerVersion 1.1 -Setting $settings -NoWait -EnableAutomaticUpgrade
```
---

## Remove agent-based Hybrid Worker

#### [Windows Hybrid Worker](#tab/win-hrw)

1. In the Azure portal, go to your Automation account.

1. Under **Account Settings**, select **Keys** and note the values for **URL** and **Primary Access Key**.

1. Open a PowerShell session in Administrator mode and run the following command with your URL and primary access key values. Use the `Verbose` parameter for a detailed log of the removal process. To remove stale machines from your Hybrid Worker group, use the optional `machineName` parameter.

```powershell-interactive
Remove-HybridRunbookWorker -Url <URL> -Key <primaryAccessKey> -MachineName <computerName>
```
> [!NOTE]
> - After you disable the Private Link in your Automation account, it might take up to 60 minutes to remove the Hybrid Runbook worker.
> - After you remove the Hybrid Worker, the Hybrid Worker authentication certificate on the machine is valid for 45 minutes.

#### [Linux Hybrid Worker](#tab/lin-hrw)

You can use the command `ls /var/opt/microsoft/omsagent` on the Hybrid Runbook Worker to get the workspace ID. A folder is created that is named with the workspace ID.

```bash
sudo python onboarding.py --deregister --endpoint="<URL>" --key="<PrimaryAccessKey>" --groupname="Example" --workspaceid="<workspaceId>"
```

> [!NOTE]
> - This script doesn't remove the Log Analytics agent for Linux from the machine. It only removes the functionality and configuration of the Hybrid Runbook Worker role. </br>
> - After you disable the Private Link in your Automation account, it might take up to 60 minutes to remove the Hybrid Runbook worker.
> - After you remove the Hybrid Worker, the Hybrid Worker authentication certificate on the machine is valid for 45 minutes.

---

## Next steps

- To learn more about Hybrid Runbook Worker, see [Automation Hybrid Runbook Worker overview](automation-hybrid-runbook-worker.md).
- To deploy Extension-based Hybrid Worker, see [Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Azure Automation](extension-based-hybrid-runbook-worker-install.md).
- To learn about Azure VM extensions, see [Azure VM extensions and features for Windows](../virtual-machines/extensions/features-windows.md) and [Azure VM extensions and features for Linux](../virtual-machines/extensions/features-linux.md).
