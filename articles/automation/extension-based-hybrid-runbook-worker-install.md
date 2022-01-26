---
title: Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Azure Automation (Preview)
description: This article tells how to deploy an extension-based Windows or Linux Hybrid Runbook Worker that you can use to run runbooks on Windows-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 09/28/2021
ms.topic: how-to
#Customer intent: As a developer, I want to learn about extension so that I can efficiently deploy Hybrid Runbook Workers.
---

# Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Automation (Preview)

The extension-based onboarding is only for **User** Hybrid Runbook Workers. For **System** Hybrid Runbook Worker onboarding, see [Deploy an agent-based Windows Hybrid Runbook Worker in Automation](./automation-windows-hrw-install.md) or [Deploy an agent-based Linux Hybrid Runbook Worker in Automation](./automation-linux-hrw-install.md). 

You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on an Azure or non-Azure machine, including servers registered with [Azure Arc-enabled servers](../azure-arc/servers/overview.md). From the machine or server that's hosting the role, you can run runbooks directly against it and against resources in the environment to manage those local resources.

Azure Automation stores and manages runbooks and then delivers them to one or more chosen machines. This article describes how to: deploy a user Hybrid Runbook Worker on a Windows or Linux machine, remove the worker, and remove a Hybrid Runbook Worker group.

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.


> [!NOTE]
> A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. If you install Extension based (V2)on a hybrid worker already running Agent based (V1), then you would see two entries of the Hybrid Runbook Worker in the group. One with Platform Extension based (V2) and the other Agent based (V1). [**Learn more**](#install-extension-based-v2-on-existing-agent-based-v1-hybrid-worker).

## Prerequisites

### Machine minimum requirements
- Two cores.
- 4 GB of RAM.
- The system-assigned managed identity must be enabled on the Azure virtual machine or Arc enabled server.  If the system-assigned managed identity isn't enabled, it will be enabled as part of the adding process.
- Non-Azure machines must have the Azure Arc enabled servers agent installed (The connected machine agent). For instructions to install the `AzureConnectedMachineAgent`, see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md).

### Supported operating systems
| Windows | Linux (x64)|
|---|---|
| &#9679; Windows Server 2019 (including Server Core), <br> &#9679; Windows Server 2016, version 1709 and 1803 (excluding Server Core), and <br> &#9679; Windows Server 2012, 2012 R2 <br><br> | &#9679; Debian GNU/Linux 7 and 8, <br> &#9679; Ubuntu 18.04, and 20.04 LTS, <br> &#9679; SUSE Linux Enterprise Server 15, and 15.1 (SUSE didn't release versions numbered 13 or 14), and <br> &#9679; Red Hat Enterprise Linux Server 7 and 8 |

### Other Requirements
| Windows | Linux (x64)|
|---|---|
| Windows PowerShell 5.1 (download WMF 5.1). PowerShell Core isn't supported.| Linux Hardening must not be enabled.  |
| .NET Framework 4.6.2 or later. ||

### Package requirements for Linux

| Required package | Description |Minimum version|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported)|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | Foreign function library for Python| Python 2.x or Python 3.x are required |
|PAM | Pluggable Authentication Modules|

| Optional package | Description | Minimum version|
|--------------------- | --------------------- | -------------------|
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. For instructions, see [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) | 6.0.0 |

### Network requirements

### Proxy server use

If you use a proxy server for communication between Azure Automation and machines running the extension-base Hybrid Runbook Worker, ensure that the appropriate resources are accessible. The timeout for requests from the Hybrid Runbook Worker and Automation services is 30 seconds. After three attempts, a request fails.

> [!NOTE]
> You can set up the proxy settings either by PowerShell cmdlets or API.

**Proxy server settings**
# [Windows](#tab/windows) 
 
```azurepowershell
$settings = @{
    "AutomationAccountURL"  = "<registrationurl>/<subscription-id>";    
    "ProxySettings" = @{
        "ProxyServer" = "<ipaddress>:<port>";
        "UserName"="test";
    }
};
$protectedsettings = @{
"ProxyPassword" = "password";
};
```

# [Linux](#tab/linux)
```
$protectedsettings = @{
      "Proxy_URL"="http://username:password@<IP Address>"
};
$settings = @{
    "AutomationAccountURL"  = "<registration-url>/<subscription-id>";    
};
```
---

### Firewall use

If you use a firewall to restrict access to the Internet, you must configure the firewall to permit access. The following port and URLs are required for the Hybrid Runbook Worker, and for [Automation State Configuration](./automation-dsc-overview.md) to communicate with Azure Automation.

| Property | Description |
|---|---|
|Port | 443 for outbound internet access|
|Global URL |*.azure-automation.net|
|Global URL of US Gov Virginia |*.azure-automation.us|

## Create hybrid worker group 

Perform the following steps to create a hybrid worker group in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account. 

1. Under **Process Automation**, select **Hybrid worker groups**. 

1. Select **+ Create hybrid worker group**. 

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-groups-portal.png" alt-text="Selecting hybrid worker groups option in portal.":::

1. From the **Basics** tab, in the **Name** text box, enter a name for your Hybrid worker group. 

1. For the **Use run as credential** option: 
   - If you select **No**, the hybrid extension will be installed using the local system account.
   - If you select **Yes**, then from the drop-down list, select the credential asset.

1. Select **Next** to advance to the **Hybrid workers** tab. You can select Azure virtual machines or Azure Arc-enabled servers to be added to this Hybrid worker group. If you don't select any machines, an empty Hybrid worker group will be created. You can still add machines later. 

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/basics-tab-portal.png" alt-text="Entering name and credentials in basics tab.":::

1. Select **Add machines** to go to the **Add machines as hybrid worker** page. You'll only see machines that aren't part of any other hybrid worker group. 

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine.  

1. Select **Add**. 

1. Select **Next** to advance to the **Review + Create** tab. 

1. Select **Create**. The hybrid worker extension installs on the machine and the hybrid worker gets registered to the hybrid worker group. Adding a hybrid worker to the group happens immediately, while installation of the extension might take a few minutes. Select **Refresh** to see the new group. Select the group name to view the hybrid worker details.

   > [!NOTE]
   > A selected machine will not be added to a hybrid worker group if it is already part of another hybrid worker group.

## Add a machine to a hybrid worker group

You can also add machines to an existing hybrid worker group.

1. Under **Process Automation**, select **Hybrid worker groups** and then your existing hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-group-add-machine.png" alt-text="Add button to add machines to existing group.":::

1. Select **+ Add** to go to the **Add machines as hybrid worker** page. You'll only see machines that aren't part of any other hybrid worker group. 

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine.

1. Select **Add** to add the machine to the group. Once added, you can see the machine type as Azure virtual machine or Arc-enabled server. The **Platform** field shows the worker as **Agent based (V1)** or **Extension based (V2)**.

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/hybrid-worker-group-platform.png" alt-text="Platform field showing agent or extension based.":::

## Install Extension-based (V2) on existing Agent-based (V1) Hybrid Worker

A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. To install Extension based (V2) on a hybrid worker that already has an Agent based (V1): 

  1.  Under **Process Automation**, select **Hybrid Workers groups** and then your existing hybrid worker group to go to the **Hybrid Worker Group** page.
  1.  Under **Hybrid worker group**, select **Hybrid Workers**.
  1.  Select **+ Add** to go to the **Add machines as hybrid worker** page.
  1.  Select the checkbox next to existing Agent based (V1) Hybrid worker.
  1.  Select **Add** to add the machine to the group. </br>

The **Platform** column shows the same worker as both **Agent based (V1)** and **Extension based (V2)**. Delete the Agent based (V1) Hybrid Worker after you are sure on the working of Extension based (V2) worker.


## Delete a Hybrid Runbook Worker

You can delete the Hybrid Runbook Worker from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

1. Select the checkbox next to the machine(s) you want to delete from the hybrid worker group.

1. Select **Delete**.  You'll be presented with a warning in a dialog box **Delete Hybrid worker** that the selected hybrid worker would be deleted permanently. Select **Delete**. This operation will delete the extension for the **Extension based (V2)** worker or remove the **Agent based (V1)** entry from the portal. However, it leaves the stale hybrid worker on the VM. To manually uninstall the agent, see [Uninstall agent](../azure-monitor/agents/agent-manage.md#uninstall-agent).

   :::image type="content" source="./media/extension-based-hybrid-runbook-worker-install/delete-machine-from-group.png" alt-text="Delete virtual machine from existing group.":::

   > [!NOTE]
   > - A hybrid worker can co-exist with both platforms: **Agent based (V1)** and **Extension based (V2)**. If you install **Extension based (V2)** on a hybrid worker already running **Agent based (V1)**, then you would see two entries of the Hybrid Runbook Worker in the group. One with Platform **Extension based (V2)** and the other **Agent based (V1)**. </br> </br>
   > - After you disable the Private Link in your Automation account, it might take up to 60 minutes to remove the Hybrid Runbook worker.

## Delete a Hybrid Runbook Worker group

You can delete an empty Hybrid Runbook Worker group from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Select **Delete**. A warning message appears to remove any machines that are defined as hybrid workers in the hybrid worker group. If there's already a worker added to the group, you'll first have to delete the worker from the group.

1. Select **Yes**. The hybrid worker group will be deleted.

## Use Azure Resource Manager template

You can use an Azure Resource Manager (ARM) template to create a new Azure Windows VM and connect it to an existing Automation account and Hybrid Worker Group. To learn more about ARM templates, see [What are ARM templates?](../azure-resource-manager/templates/overview.md)

### Review the template

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
      "defaultValue": "simple-vm",
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
          "name": "[concat(parameters('workerGroupName'),'/',guid('AzureAutomationJobName', variables('UniqueStringBasedOnTimeStamp')))]",
          "type": "hybridRunbookWorkerGroups/hybridRunbookWorkers",
          "apiVersion": "2021-06-22",
          "dependsOn": [
            "[resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))]",
            "[resourceId('Microsoft.Compute/virtualMachines', variables('vmName'))]"
          ],
          "properties": {
            "vmResourceId": "[resourceId('Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
          }
        }
      ]
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[concat(parameters('virtualMachineName'),'/HybridWorkerExtension')]",
      "apiVersion": "2020-12-01",
      "location": "[parameters('vmLocation')]",
      "dependsOn": [
        "[resourceId('Microsoft.Automation/automationAccounts', parameters('automationAccount'))]",
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
      ],
      "properties": {
        "publisher": "Microsoft.Azure.Automation.HybridWorker",
        "type": "HybridWorkerForWindows",
        "typeHandlerVersion": "0.1",
        "autoUpgradeMinorVersion": true,
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

The Azure resources defined in the template:

- [hybridRunbookWorkerGroups/hybridRunbookWorkers](/azure/templates/microsoft.automation/automationaccounts/hybridrunbookworkergroups/hybridrunbookworkers)
- [Microsoft.Compute/virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions)

### Review parameters

Review the parameters used in this template.

|Property |Description |
|---|---|
|automationAccount| The name of the existing Automation account. |
|automationAccountLocation | The region of the existing Automation account. |
|workerGroupName | The name of the existing Hybrid Worker Group. |
|virtualMachineName| The name for the VM to be created. The default value is `simple-vm`.|
|adminUsername| The VM admin user name. |
|adminPassword| The VM admin password. |
|vmLocation| The region for the new VM. The default value is `North Central US`.|
|vmSize| The size for the new VM. The default value is `Standard_DS1_v2`. |
|osVersion| The OS for the new Windows VM. The default value is `2019-Datacenter`.|
|dnsNameForPublicIP| The DNS name for the public IP. |


## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/hybrid-runbook-worker.md#general).
