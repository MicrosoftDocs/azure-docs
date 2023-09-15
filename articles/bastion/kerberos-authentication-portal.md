---
title: 'Configure Bastion for Kerberos authentication: Azure portal'
titleSuffix: Azure Bastion
description: Learn how to configure Bastion to use Kerberos authentication via the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 09/14/2023
ms.author: cherylmc

---

# Configure Bastion for Kerberos authentication using the Azure portal

This article shows you how to configure Azure Bastion to use Kerberos authentication. Kerberos authentication can be used with both the Basic and the Standard Bastion SKUs. For more information about Kerberos authentication, see the [Kerberos authentication overview](/windows-server/security/kerberos/kerberos-authentication-overview). For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

## Considerations

* The Kerberos setting for Azure Bastion can be configured in the Azure portal only and not with native client.
* VMs migrated from on-premises to Azure aren't currently supported for Kerberos. 
* Cross-realm authentication isn't currently supported for Kerberos. 
* Changes to DNS server aren't currently supported for Kerberos. After making any changes to DNS server, you'll need to delete and re-create the Bastion resource.
* If additional DC (domain controllers) are added, Bastion will only recognize the first DC.
* If additional DCs are added for different domains, the added domains can't successfully authenticate with Kerberos.

## Prerequisites

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). To be able to connect to a VM through your browser using Bastion, you must be able to sign in to the Azure portal.

* An Azure virtual network. For steps to create a VNet, see [Quickstart: Create a virtual network](../virtual-network/quick-create-portal.md).

## Update VNet DNS servers

In this section, the following steps help you update your virtual network to specify custom DNS settings.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the virtual network for which you want to deploy the Bastion resources.
1. Go to the **DNS servers** page for your VNet and select **Custom**. Add the IP address of your Azure-hosted domain controller and **Save**.

## Deploy Bastion

1. Begin configuring your bastion deployment using the steps in [Tutorial: Deploy Bastion using manual configuration settings](tutorial-create-host-portal.md). Configure the settings on the **Basics** tab. Then, at the top of the page, click **Advanced** to go to the Advanced tab.

1. On the **Advanced** tab, select **Kerberos**.

   :::image type="content" source="./media/kerberos-authentication-portal/select-kerberos.png" alt-text="Screenshot of select bastion features." lightbox="./media/kerberos-authentication-portal/select-kerberos.png":::

1. At the bottom of the page, select **Review + create**, then **Create** to deploy Bastion to your virtual network.

1. Once the deployment completes, you can use it to sign in to any reachable Windows VMs joined to the custom DNS you specified in the earlier steps.

## To modify an existing Bastion deployment

In this section, the following steps help you modify your virtual network and existing Bastion deployment for Kerberos authentication.

1. [Update the DNS settings](#update-vnet-dns-servers) for your virtual network.
1. Go to the portal page for your Bastion deployment and select **Configuration**.
1. On the Configuration page, select **Kerberos authentication**, then select **Apply**.
1. Bastion updates with the new configuration settings.

## To verify Bastion is using Kerberos

> [!NOTE]
> You must use the User Principal Name (UPN) to sign in using Kerberos.

Once you have enabled Kerberos on your Bastion resource, you can verify that it's actually using Kerberos for authentication to the target domain-joined VM.

1. Sign into the target VM (either via Bastion or not). Search for "Edit Group Policy" from the taskbar and open the **Local Group Policy Editor**.
1. Select **Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options**.
1. Find the policy **Networking security: Restrict NTLM: Incoming NTLM Traffic** and set it to **Deny all domain accounts**. Because Bastion uses NTLM for authentication when Kerberos is disabled, this setting ensures that NTLM-based authentication is unsuccessful for future sign-in attempts on the VM.
1. End the VM session.
1. Connect to the target VM again using Bastion. Sign-in should succeed, indicating that Bastion used Kerberos (and not NTLM) for authentication.

   > [!NOTE]
   > To prevent failback to NTLM, make sure you follow the preceding steps. Enabling Kerberos (without following the procedure) won't prevent failback to NTLM.

## Quickstart: Set up Bastion with Kerberos - Resource Manager template

### Review the template

```
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "defaultValue": "[resourceGroup().location]",
      "type": "string"
    },
    "defaultNsgName": {
      "type": "string",
      "defaultValue": "Default-nsg"
    },
    "VnetName": {
      "type": "string",
      "defaultValue": "myVnet"
    },
    "ClientVMName": {
      "defaultValue": "Client-vm",
      "type": "string"
    },
    "ServerVMName": {
      "defaultValue": "Server-vm",
      "type": "string"
    },
    "vmsize": {
      "defaultValue": "Standard_DS1_v2",
      "type": "string",
      "metadata": {
        "description": "VM SKU to deploy"
      }
    },
    "ServerVMUsername": {
      "type": "string",
      "defaultValue": "serveruser",
      "metadata": {
        "description": "Admin username on all VMs."
      }
    },
    "ServerVMPassword": {
      "type": "securestring",
      "metadata": {
        "description": "Admin password on all VMs."
      }
    },
    "SafeModeAdministratorPassword": {
      "type": "securestring",
      "metadata": {
        "description": "See https://learn.microsoft.com/en-us/powershell/module/addsdeployment/install-addsdomaincontroller?view=windowsserver2022-ps#-safemodeadministratorpassword"
      }
    },
    "ClientVMUsername": {
      "type": "string",
      "defaultValue": "clientuser",
      "metadata": {
        "description": "username on ClientVM."
      }
    },
    "ClientVMPassword": {
      "type": "securestring",
      "metadata": {
        "description": "password on ClientVM."
      }
    },
    "ServerVmImage": {
      "type": "object",
      "defaultValue": {
        "offer": "WindowsServer",
        "publisher": "MicrosoftWindowsServer",
        "sku": "2019-Datacenter",
        "version": "latest"
      }
    },
    "ClientVmImage": {
      "type": "object",
      "defaultValue": {
        "offer": "Windows",
        "publisher": "microsoftvisualstudio",
        "sku": "Windows-10-N-x64",
        "version": "latest"
      }
    },
    "publicIPAllocationMethod": {
      "type": "string",
      "defaultValue": "Static"
    },
    "BastionName": {
      "defaultValue": "Bastion",
      "type": "string"
    },
    "BastionPublicIPName": {
        "defaultValue": "Bastion-ip",
        "type": "string"
    }
  },
  "variables": {
    "DefaultSubnetId": "[concat(resourceId('Microsoft.Network/virtualNetworks', parameters('VnetName')), '/subnets/default')]",
    "ClientVMSubnetId": "[concat(resourceId('Microsoft.Network/virtualNetworks', parameters('VnetName')), '/subnets/clientvm-subnet')]",
    "DNSServerIpAddress": "10.16.0.4",
    "ClientVMPrivateIpAddress": "10.16.1.4"
  },
  "resources": [
    {
      "apiVersion": "2020-03-01",
      "name": "[parameters('VnetName')]",
      "type": "Microsoft.Network/virtualNetworks",
      "location": "[parameters('location')]",
      "properties": {
        "dhcpOptions": {
          "dnsServers": [ "[variables('DNSServerIpAddress')]" ]
        },
        "subnets": [
          {
            "name": "default",
            "properties": {
              "addressPrefix": "10.16.0.0/24"
            }
          },
          {
            "name": "clientvm-subnet",
            "properties": {
              "addressPrefix": "10.16.1.0/24"
            }
          },
          {
            "name": "AzureBastionSubnet",
            "properties": {
              "addressPrefix": "10.16.2.0/24"
            }
          }
        ],
        "addressSpace": {
          "addressPrefixes": [
            "10.16.0.0/16"
          ]
        }
      }
    },
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2018-10-01",
      "name": "[concat(parameters('ServerVMName'), 'Nic')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Network/virtualNetworks/', parameters('VnetName'))]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "[concat(parameters('ServerVMName'), 'NicIpConfig')]",
            "properties": {
              "privateIPAllocationMethod": "Static",
              "privateIPAddress": "[variables('DNSServerIpAddress')]",
              "subnet": {
                "id": "[variables('DefaultSubnetId')]"
              }
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2020-06-01",
      "name": "[parameters('ServerVMName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Network/networkInterfaces/', parameters('ServerVMName'), 'Nic')]"
      ],
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "AdminUsername": "[parameters('ServerVMUsername')]",
          "AdminPassword": "[parameters('ServerVMPassword')]",
          "computerName": "[parameters('ServerVMName')]"
        },
        "storageProfile": {
          "imageReference": "[parameters('ServerVmImage')]",
          "osDisk": {
            "createOption": "FromImage",
            "managedDisk": {
              "storageAccountType": "Standard_LRS"
            }
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[ResourceId('Microsoft.Network/networkInterfaces/', concat(parameters('ServerVMName'), 'Nic'))]"
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-04-01",
      "name": "[concat(parameters('ServerVMName'),'/', 'PromoteToDomainController')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/',parameters('ServerVMName'))]"
      ],
      "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.7",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "commandToExecute": "[concat('powershell.exe -Command \"Install-windowsfeature AD-domain-services; Import-Module ADDSDeployment;$Secure_String_Pwd = ConvertTo-SecureString ',parameters('SafeModeAdministratorPassword'),' -AsPlainText -Force; Install-ADDSForest -DomainName \"bastionkrb.test\" -SafeModeAdministratorPassword $Secure_String_Pwd -Force:$true')]"
          }
      }
    },
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2018-10-01",
      "name": "[concat(parameters('ClientVMName'), 'Nic')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Network/virtualNetworks/', parameters('VnetName'))]",
        "[concat('Microsoft.Compute/virtualMachines/', parameters('ServerVMName'))]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "[concat(parameters('ClientVMName'), 'NicIpConfig')]",
            "properties": {
              "privateIPAllocationMethod": "Static",
              "privateIPAddress": "[variables('ClientVMPrivateIpAddress')]",
              "subnet": {
                "id": "[variables('ClientVMSubnetId')]"
              }
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2020-06-01",
      "name": "[parameters('ClientVMName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Network/networkInterfaces/', parameters('ClientVMName'), 'Nic')]"
      ],
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "AdminUsername": "[parameters('ClientVMUsername')]",
          "AdminPassword": "[parameters('ClientVMPassword')]",
          "computerName": "[parameters('ClientVMName')]"
        },
        "storageProfile": {
          "imageReference": "[parameters('ClientVmImage')]",
          "osDisk": {
            "createOption": "FromImage",
            "managedDisk": {
              "storageAccountType": "Standard_LRS"
            }
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[ResourceId('Microsoft.Network/networkInterfaces/', concat(parameters('ClientVMName'), 'Nic'))]"
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-04-01",
      "name": "[concat(parameters('ClientVMName'),'/', 'DomainJoin')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/',parameters('ClientVMName'))]",
        "[concat('Microsoft.Compute/virtualMachines/', parameters('ServerVMName'),'/extensions/', 'PromoteToDomainController')]",
        "[concat('Microsoft.Network/bastionHosts/', parameters('BastionName'))]"
      ],
      "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.7",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "commandToExecute": "[concat('powershell.exe -Command Set-ItemProperty -Path HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\MSV1_0\\ -Name RestrictReceivingNTLMTraffic -Value 1; $Pass= ConvertTo-SecureString -String ',parameters('ServerVMPassword'),' -AsPlainText -Force; $Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList \"AD\\serveruser\", $Pass; do { try { $joined = add-computer -computername Client-vm -domainname bastionkrb.test –credential $Credential -passthru -restart –force; } catch {}} while ($joined.HasSucceeded -ne $true)')]"
          }
      }
    },
    {
      "apiVersion": "2020-11-01",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[parameters('BastionPublicIPName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard"
      },
      "properties": {
        "publicIPAllocationMethod": "Static"
      },
      "tags": {}
    },
    {
        "type": "Microsoft.Network/bastionHosts",
        "apiVersion": "2020-11-01",
        "name": "[parameters('BastionName')]",
        "location": "[resourceGroup().location]",
        "dependsOn": [
            "[concat('Microsoft.Network/virtualNetworks/', parameters('VnetName'))]",
            "[concat('Microsoft.Network/publicIpAddresses/', parameters('BastionPublicIPName'))]"
        ],
        "sku": {
            "name": "Standard"
        },
        "properties": {
            "enableKerberos": "true",
            "ipConfigurations": [
                {
                    "name": "IpConf",
                    "properties": {
                        "privateIPAllocationMethod": "Dynamic",
                        "publicIPAddress": {
                            "id": "[resourceId('Microsoft.Network/publicIpAddresses', parameters('BastionPublicIPName'))]"
                        },
                        "subnet": {
                            "id": "[concat(resourceId('Microsoft.Network/virtualNetworks', parameters('VnetName')), '/subnets/AzureBastionSubnet')]"
                        }
                    }
                }
            ]
        }
    }
  ]
}
```

The following resources have been defined in the template:
- Deploys the following Azure resources: 
  - [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): create an Azure virtual network.
  - [**Microsoft.Network/bastionHosts**](/azure/templates/microsoft.network/bastionHosts): create a Standard SKU Bastion with a public IP and Kerberos feature enabled.
  - Create a Windows 10 ClientVM and a Windows Server 2019 ServerVM.
- Have the DNS Server of the VNet point to the private IP address of the ServerVM (domain controller).
- Runs a Custom Script Extension on the ServerVM to promote it to a domain controller with domain name: `bastionkrb.test`.
- Runs a Custom Script Extension on the ClientVM to have it: 
  - **Restrict NTLM: Incoming NTLM traffic** = Deny all domain accounts (this is to ensure Kerberos is used for authentication).
  - Domain-join the `bastionkrb.test` domain.

## Deploy the template
To set up Kerberos, deploy the preceding ARM template by running the following PowerShell cmd: 
```
New-AzResourceGroupDeployment -ResourceGroupName <your-rg-name> -TemplateFile "<path-to-template>\KerberosDeployment.json"`
```
## Review deployed resources
Now, sign in to ClientVM using Bastion with Kerberos authentication:
- credentials: username = `serveruser@bastionkrb.test` and password = `<password-entered-during-deployment>`.


## Next steps

For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)
