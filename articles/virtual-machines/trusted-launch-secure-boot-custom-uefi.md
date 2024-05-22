---
title: Secure Boot UEFI Keys 
description: This feature allows customers to bind UEFI keys (db/dbx/pk/kek) for drivers/kernel modules signed using a private key that is owned by Azure partners or customer’s third-party vendors
author: Howie425
ms.author: howieasmerom
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 04/10/2024
ms.custom: template-concept
---

# Secure Boot UEFI Keys

## Overview

When a Trusted Launch VM is deployed, during the boot process, signatures of all the boot components such as UEFI (Unified Extensible Firmware Interface), shim/bootloader, kernel, and kernel modules/drivers are verified against trusted preloaded UEFI keys. Verification failure on any of the boot components results in no-boot of the VM, or no-load of kernel modules/drivers only. Verification can fail due to a component signed by a key not in the preloaded UEFI keys list or an unsigned component.

Many Azure partners provided or customer procured software (disaster recovery, network monitoring) installs drivers/kernel modules as part of their solution. These drivers/kernel modules must be signed for a Trusted Launch VM to boot. Many Azure partners sign their drivers/kernel modules with their own private key. This requires that the public key (UEFI keys) of the private key pair available in UEFI layer so that the Trusted Launch VM can verify boot components and boot successfully.

For Trusted Launch VM, a new feature called Secure Boot UEFI keys is now in preview. This feature allows customers to bind UEFI keys (db/dbx/pk/kek) for drivers/kernel modules signed using a private key that is owned by Azure partners or customer’s third-party vendors. In this public preview, you can bind UEFI keys using Azure compute gallery. Binding UEFI keys for marketplace image, or as part of VM deployment parameters, isn't currently supported.

>[!NOTE]
> Binding UEFI keys is mostly applicable for Linux based Trusted Launch VMs.
##  Bind secureboot keys to Azure compute gallery image

To bind and create a Trusted Launch VM, the following steps must be followed.

1.  **Get VHD of marketplace image**

- Create a Gen2 VM using a marketplace image
- Stop the VM to access OS disk

:::image type="content" source="media/trusted-launch/trusted-launch-custom-stop-vm.png" alt-text="Screenshot showing how to stop VM.":::

- Open disk from the left navigation pane of stopped VM

:::image type="content" source="media/trusted-launch/trusted-launch-custom-open-disk.png" alt-text="Screenshot showing access OS VHD.":::

- Export disk to access OS VHD SAS

:::image type="content" source="media/trusted-launch/trusted-launch-custom-generate-url.png" alt-text="Screenshot showing how to generate URL.":::

- Copy OS VHD using SAS URI to the storage account 
        1. Use [azcopy](../storage/common/storage-use-azcopy-v10.md) to perform copy operation.
        2. Use this storage account and the copied VHD as input to SIG creation.

2.  **Create SIG using VHD**

- Create SIG image by deploying the provided ARM template.

:::image type="content" source="media/trusted-launch/trusted-launch-custom-template.png" alt-text="Screenshot showing how to use Azure template.":::

<details>
<summary> Access the SIG from OS VHD JSON template </summary>
<pre>
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "galleryName": {
            "defaultValue": "customuefigallery",
            "type": "String",
            "metadata": {
                "description": "Name of the gallery"
            }
        },
        "imageDefinitionName": {
            "defaultValue": "image_def",
            "type": "String",
            "metadata": {
                "description": "Name of the image definition"
            }
        },
        "versionName": {
            "defaultValue": "1.0.0",
            "type": "String",
            "metadata": {
                "description": "Name of the image version"
            }
        },
		"storageAccountName": {
		    "defaultValue": "",
			"type": "string",
			"metadata": {
			    "description": "Storage account name containing the OS vhd"
			}
		},
        "vhdURI": {
            "defaultValue": "",
            "type": "String",
			"metadata": {
			    "description": "OS vhd URL"
			}
        },
        "imagePublisher": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "Publisher name of the image"
            }
        },
        "offer": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "Offer of the image"
            }
        },
        "sku": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "Sku of the image"
            }
        },
        "osType": {
            "defaultValue": "Linux",
            "allowedValues": [
                "Windows",
                "Linux"
            ],
            "type": "String",
            "metadata": {
                "description": "Operating system type"
            }
        },
		"gallerySecurityType": {
			"defaultValue": "TrustedLaunchSupported",
			"type": "String",
			"allowedValues": [
			    "TrustedLaunchSupported",
				"TrustedLaunchAndConfidentialVMSupported"
			],
			"metadata": {
				"description": "Gallery Image security type"
			}
		},
		"customDBKey": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "Custom UEFI DB cert. in base64 format"
            }
		}
    },
	"variables": {
		"linuxSignatureTemplate": "MicrosoftUefiCertificateAuthorityTemplate",
		"windowsSignatureTemplate": "MicrosoftWindowsTemplate"
	},
    "resources": [
        {
            "type": "Microsoft.Compute/galleries",
            "apiVersion": "2022-01-03",
            "name": "[parameters('galleryName')]",
            "location": "[resourceGroup().location]",
            "tags": {
                "AzSecPackAutoConfigReady": "true"
            },
            "properties": {
                "identifier": {}
            }
        },
        {
            "type": "Microsoft.Compute/galleries/images",
            "apiVersion": "2022-08-03",
            "name": "[concat(parameters('galleryName'), '/', parameters('imageDefinitionName'))]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[resourceId('Microsoft.Compute/galleries', parameters('galleryName'))]"
            ],
            "tags": {
                "AzSecPackAutoConfigReady": "true"
            },
            "properties": {
                "hyperVGeneration": "V2",
                "architecture": "x64",
                "osType": "[parameters('osType')]",
                "osState": "Generalized",
                "identifier": {
                    "publisher": "[parameters('imagePublisher')]",
                    "offer": "[parameters('offer')]",
                    "sku": "[parameters('sku')]"
                },
                "features": [
                    {
                        "name": "SecurityType",
                        "value": "TrustedLaunchAndConfidentialVMSupported"
                    }
                ],
                "recommended": {
                    "vCPUs": {
                        "min": 1,
                        "max": 16
                    },
                    "memory": {
                        "min": 1,
                        "max": 32
                    }
                }
            }
        },
        {
            "type": "Microsoft.Compute/galleries/images/versions",
            "apiVersion": "2022-08-03",
            "name": "[concat(parameters('galleryName'), '/',parameters('imageDefinitionName'),'/', parameters('versionName'))]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[resourceId('Microsoft.Compute/galleries/images', parameters('galleryName'), parameters('imageDefinitionName'))]",
                "[resourceId('Microsoft.Compute/galleries', parameters('galleryName'))]"
            ],
            "properties": {
                "publishingProfile": {
                    "targetRegions": [
                        {
                            "name": "[resourceGroup().location]",
                            "regionalReplicaCount": 1
                        }
                    ]
                },
                "storageProfile": {
                    "osDiskImage": {
                        "hostCaching": "ReadOnly",
                        "source": {
                            "uri": "[parameters('vhdURI')]",
							"storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
                        }
                    }
                },
                "securityProfile": {
                    "uefiSettings": {
                        "signatureTemplateNames": [
						    "[if(equals(parameters('osType'),'Linux'), variables('linuxSignatureTemplate'), variables('windowsSignatureTemplate'))]"
                        ],
                        "additionalSignatures": {
                            "db": [
								{
									"type": "x509",
									"value": ["[parameters('customDBKey')]"]
								}
                            ]
                        }
                    }
                }
            }
        }
    ]
}
</pre>
</details>

- Use this Azure compute gallery image creation template and provide OS vhd URL and its containing storage account name from previous step.

3.  **Create VM (Deploy ARM Template through Portal)**
- Create a Trusted Launch or Confidential VM using the Azure compute gallery image created in Step 1.
- Sample TrustedLaunch VM creation template with Azure compute gallery image: 

<details>
<summary> Access the deploy TVM from SIG JSON template </summary>
<pre>
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#", 
  "contentVersion": "1.0.0.0",
  "parameters": {
    "networkInterfaceName": {
      "type": "String",
      "defaultValue": "TVM-nic"
    },
    "networkSecurityGroupName": {
      "type": "String",
      "defaultValue": "TVM-nsg"
    },
    "subnetName": {
      "type": "String",
      "defaultValue": "default"
    },
    "virtualNetworkName": {
      "type": "String",
      "defaultValue": "TVM-vnet"
    },
    "addressPrefixes": {
      "type": "Array",
      "defaultValue": [
        "10.27.0.0/16"
      ]
    },
    "subnets": {
      "type": "Array",
      "defaultValue": [
        {
          "name": "default",
          "properties": {
            "addressPrefix": "10.27.0.0/24"
          }
        }
      ]
    },
    "publicIpAddressName": {
      "type": "String",
      "defaultValue": "TVM-ip"
    },
    "publicIpAddressType": {
      "type": "String",
      "defaultValue": "Static"
    },
    "publicIpAddressSku": {
      "type": "String",
      "defaultValue": "Standard"
    },
    "pipDeleteOption": {
      "type": "String",
      "defaultValue": "Detach"
    },
    "virtualMachineName": {
      "type": "String",
      "defaultValue": "TVM"
    },
    "virtualMachineComputerName": {
      "type": "String",
      "defaultValue": "TVM"
    },
    "osDiskType": {
      "type": "String",
      "defaultValue": "Premium_LRS"
    },
    "osDiskDeleteOption": {
      "type": "String",
      "defaultValue": "Detach"
    },
    "virtualMachineSize": {
      "type": "String",
      "defaultValue": "Standard_D2s_v3"
    },
    "nicDeleteOption": {
      "type": "String",
      "defaultValue": "Detach"
    },
    "adminUsername": {
      "type": "String",
      "defaultValue": "vmadmin"
    },
    "adminPassword": {
      "type": "SecureString"
    },
    "securityType": {
      "type": "String",
      "defaultValue": "TrustedLaunch"
    },
    "secureBoot": {
      "type": "Bool",
      "defaultValue": true
    },
    "vTPM": {
      "type": "Bool",
      "defaultValue": true
    },
    "galleryName": {
      "type": "String"
    },
	"galleryImageName": {
		"type": "String"
	},
	"galleryImageVersion": {
		"type": "String"
	}
  },
  "variables": {
    "nsgId": "[resourceId(resourceGroup().name, 'Microsoft.Network/networkSecurityGroups', parameters('networkSecurityGroupName'))]",
    "vnetName": "[parameters('virtualNetworkName')]",
    "vnetId": "[resourceId(resourceGroup().name,'Microsoft.Network/virtualNetworks', parameters('virtualNetworkName'))]",
    "subnetRef": "[concat(variables('vnetId'), '/subnets/', parameters('subnetName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2021-03-01",
      "name": "[parameters('networkInterfaceName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Network/networkSecurityGroups/', parameters('networkSecurityGroupName'))]",
        "[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]",
        "[concat('Microsoft.Network/publicIpAddresses/', parameters('publicIpAddressName'))]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig",
            "properties": {
              "subnet": {
                "id": "[variables('subnetRef')]"
              },
              "privateIPAllocationMethod": "Dynamic",
              "publicIpAddress": {
                "id": "[resourceId(resourceGroup().name, 'Microsoft.Network/publicIpAddresses', parameters('publicIpAddressName'))]",
                "properties": {
                  "deleteOption": "[parameters('pipDeleteOption')]"
                }
              }
            }
          }
        ],
        "networkSecurityGroup": {
          "id": "[variables('nsgId')]"
        }
      }
    },
    {
      "type": "Microsoft.Network/networkSecurityGroups",
      "apiVersion": "2019-02-01",
      "name": "[parameters('networkSecurityGroupName')]",
      "location": "[resourceGroup().location]"
    },
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2020-11-01",
      "name": "[parameters('virtualNetworkName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": "[parameters('addressPrefixes')]"
        },
        "subnets": "[parameters('subnets')]"
      }
    },
    {
      "type": "Microsoft.Network/publicIpAddresses",
      "apiVersion": "2020-08-01",
      "name": "[parameters('publicIpAddressName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "[parameters('publicIpAddressSku')]"
      },
      "properties": {
        "publicIpAllocationMethod": "[parameters('publicIpAddressType')]"
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-07-01",
      "name": "[parameters('virtualMachineName')]",
      "location": "[resourceGroup().location]",
      "identity": {
        "type": "SystemAssigned"
      },
      "dependsOn": [
        "[concat('Microsoft.Network/networkInterfaces/', parameters('networkInterfaceName'))]"
      ],
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('virtualMachineSize')]"
        },
        "storageProfile": {
          "osDisk": {
            "createOption": "fromImage",
            "managedDisk": {
              "storageAccountType": "[parameters('osDiskType')]"
            },
            "deleteOption": "[parameters('osDiskDeleteOption')]"
          },
          "imageReference": {
            "id": "[resourceId('Microsoft.Compute/galleries/images/versions', parameters('galleryName'), parameters('galleryImageName'), parameters('galleryImageVersion'))]"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces', parameters('networkInterfaceName'))]",
              "properties": {
                "deleteOption": "[parameters('nicDeleteOption')]"
              }
            }
          ]
        },
        "osProfile": {
          "computerName": "[parameters('virtualMachineComputerName')]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "securityProfile": {
          "securityType": "[parameters('securityType')]",
          "uefiSettings": {
            "secureBootEnabled": "[parameters('secureBoot')]",
            "vTpmEnabled": "[parameters('vTPM')]"
          }
        },
        "diagnosticsProfile": {
          "bootDiagnostics": {
            "enabled": true
          }
        }
      }
    }
  ]
}
</pre>
</details>

4.  **Validate custom UEFI key presence in VM.**
- Do ssh on Linux VM and run **“mokutil--db”** or **“mokutil--dbx”** to check the corresponding custom UEFI keys in the results.

## Regions Supported

| Country | Regions |
|:--- |:--- |
| United States | West US, East US, East US 2 |
| Europe | North Europe, West Europe, West Europe 2, Switzerland North |
| Asia Pacific | Southeast Asia, East Asia |
| India | Central India |
| Germany | Germany West Central |
| United Arab Emirates | UAE North |
| Japan | Japan East |


## Supplemental Information 

> [!IMPORTANT]
> Method to generate base64 public key certificate to insert as custom UEFI db:
[Excerpts taken from Chapter 3. Signing a kernel and modules for Secure Boot Red Hat Enterprise Linux 8 | Red Hat Customer Portal](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/signing-a-kernel-and-modules-for-secure-boot_managing-monitoring-and-updating-the-kernel#generating-a-public-and-private-key-pair_signing-a-kernel-and-modules-for-secure-boot)

**Install dependencies**

```bash
~$ sudo yum install pesign openssl kernel-devel mokutil keyutils
```

**Create key pair to sign the kernel module**

```bash
$ sudo efikeygen --dbdir /etc/pki/pesign --self-sign --module --common-name 'CN=Organization signing key' --nickname 'Custom Secure Boot key'
```

**Export public key to cer file**

```bash
$ sudo certutil -d /etc/pki/pesign -n 'Custom Secure Boot key' -Lr > sb_cert.cer
```

**Convert to base64 format**

```bash
$ openssl x509 -inform der -in sb_cert.cer -out sb_cert_base64.cer
```

**Extract base64 string to use in SIG creation ARM template**

```bash
$ sed -e '/BEGIN CERTIFICATE/d;/END CERTIFICATE/d' sb_cert_base64.cer
```


## Method to create Azure compute gallery and corresponding TrustedLaunch VM using Azure CLI:
Example Azure compute gallery template with prefilled entries:


```json   
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
    },
    "resources": [
        {
            "type": "Microsoft.Compute/galleries",
            "apiVersion": "2022-01-03",
            "name": "customuefigallerytest",
            "location": "[resourceGroup().location]",
            "tags": {
                "AzSecPackAutoConfigReady": "true"
            },
            "properties": {
                "identifier": {}
            }
        },
        {
            "type": "Microsoft.Compute/galleries/images",
            "apiVersion": "2022-08-03",
            "name": "[concat('customuefigallerytest', '/', 'image_def')]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[resourceId('Microsoft.Compute/galleries', 'customuefigallerytest')]"
            ],
            "tags": {
                "AzSecPackAutoConfigReady": "true"
            },
            "properties": {
                "hyperVGeneration": "V2",
                "architecture": "x64",
                "osType": "Linux",
                "osState": "Generalized",
                "identifier": {
                    "publisher": "testpublisher",
                    "offer": "testoffer",
                    "sku": "testsku"
                },
                "features": [
                    {
                        "name": "SecurityType",
                        "value": "TrustedLaunchSupported"
                    }
                ],
                "recommended": {
                    "vCPUs": {
                        "min": 1,
                        "max": 16
                    },
                    "memory": {
                        "min": 1,
                        "max": 32
                    }
                }
            }
        },
        {
            "type": "Microsoft.Compute/galleries/images/versions",
            "apiVersion": "2022-08-03",
            "name": "[concat('customuefigallerytest', '/','image_def','/', '1.0.0')]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[resourceId('Microsoft.Compute/galleries/images', 'customuefigallerytest', 'image_def')]",
                "[resourceId('Microsoft.Compute/galleries', 'customuefigallerytest')]"
            ],
            "properties": {
                "publishingProfile": {
                    "targetRegions": [
                        {
                            "name": "[resourceGroup().location]",
                            "regionalReplicaCount": 1
                        }
                    ]
                },
                "storageProfile": {
                    "osDiskImage": {
                        "hostCaching": "ReadOnly",
                        "source": {
                            "uri": "https://sourceosvhdeastus2euap.blob.core.windows.net/ubuntu2204cvmsmalldisk/abcd",
                            "storageAccountId": "/subscriptions/130068aa-dcf8-46e8-a2cc-205ab4a32b30/resourceGroups/sharmade-customuefi-canarytest/providers/Microsoft.Storage/storageAccounts/sourceosvhdeastus2euap"
                        }
                    }
                },
                "securityProfile": {
                    "uefiSettings": {
                        "signatureTemplateNames": [
                            "MicrosoftUefiCertificateAuthorityTemplate"
                        ],
                        "additionalSignatures": {
                            "db": [
                                {
                                    "type": "x509",
                                    "value": [
                                        "MIIDNzCCAh+gAwIBAgIRANcuAK10JUqNpehWlkldzxEwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAxMMQ3VzdG9tRGJLZXkzMB4XDTIzMDYxOTEwNTI0MloXDTMzMDYxNjEwNTI0MlowFzEVMBMGA1UEAxMMQ3VzdG9tRGJLZXkzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq+QdB6n3TDk12Qa/JcbmdfEpIrx4dKG9d5D/SRHWfJACInxtH64jzvGohVnAqIDqcKK+FvVLDPrqD7hbzV34AOXkyVoRtHEsdDErkG9CVBJlWleuew+if9TkW8wabFT3/sHSzVbG6+6AFOHsnDbO1Rpvh1ZPp2AgqiNg7XUHQM9zH00BYz7xtL9XEr+sRRgp0Bn0PGQGQU1Q302TK6jlHwJGMidke4Le2IIDJTUTGx3yWuX7f/T/u6alZeKjg+hYysJ7dpaaC5DyRTT5pJv62pZBJa3DkwWWSKroJozp9ujf93KYP7NoCLHkyiITAUK04hsHm/UvIt7ZhayTS24MbwIDAQABo34wfDAfBgNVHSMEGDAWgBQBXPUO5tTx8gh9G1iwS1KMwXUi/zAVBglghkgBhvhCAQEBAf8EBQMDAPABMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA4GA1UdDwEB/wQEAwIEsDAdBgNVHQ4EFgQUAVz1DubU8fIIfRtYsEtSjMF1Iv8wDQYJKoZIhvcNAQELBQADggEBAA4xZmr3HhDOc2xzDMjqiVnCBMPT8nS9P+jCXezTeG1SIWrMmQUSs8rtU0YoNRIq1wbT/rqbYIwwhRfth0nUGf22zp4UdigVcpt+FQj9eGgeF6sJyHVWmMZu8rEi8BhHEsS6jHqExckp0vshhyW5whr86znWFWf/EsVGFkxd7kjv/KB0ff2ide5vLOWxoTfYmSxYyg2K1FQXP7L87Rb7O6PKzo0twVgeZ616e/yFLcmUQgnHBhb2IKtdo+CdTCxcw9/nNqGPwsNLsti2jyr5oNm9mX6wVaAuXCC3maX35DdWFVK0gXcENEw+Q6+JSyPV1ItXc5CD0NU9pd+R85qsFlY="
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]
}
```

### Deploy SIG template using az cli

```azurecli-interactive
> az deployment group create --resource-group <resourceGroupName> --template-file "<location to template>\SIGWithCustomUEFIKeyExample.json"
```

### Deploy Trusted Launch VM using Azure compute gallery

```azurecli-interactive
> $imagDef="/subscriptions/<subscription id>/resourceGroups/<resourcegroup name>/providers/Microsoft.Compute/galleries/customuefigallerytest/images/image_def/versions/1.0.0"
> az vm create --resource-group <resourcegroup name> --name <vm name> --image $imagDef --admin-username <username> --generate-ssh-keys --security-type TrustedLaunch
```

## Useful links:
1. [Base64 conversion of certificates](https://www.base64encode.org/enc/certificate/)
2. [X.509 Certificate Public Key in Base64](https://stackoverflow.com/questions/24492981/x-509-certificate-public-key-in-base64)
3. [UEFI: What is UEFI Secure Boot and how it works?](https://access.redhat.com/articles/5254641)
4. [Ubuntu: How to sign things for Secure Boot?](https://ubuntu.com/blog/how-to-sign-things-for-secure-boot)
5. [Redhat: Signing a kernel and modules for Secure Boot](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/signing-a-kernel-and-modules-for-secure-boot_managing-monitoring-and-updating-the-kernel)
