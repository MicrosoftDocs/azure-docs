---
title: Deploy Azure Cloud Services (extended support) - ARM template
description: Deploy Azure Cloud Services (extended support) by using an ARM template.
ms.topic: quickstart
ms.service: azure-cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
---

# Deploy Cloud Services (extended support) by using an ARM template

This article shows you how to use an [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) to create an Azure Cloud Services (extended support) deployment.

## Prerequisites

Complete the following steps as prerequisites to creating your deployment by using ARM templates.

1. Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the required resources.

1. Create a new resource group by using the [Azure portal](../azure-resource-manager/management/manage-resource-groups-portal.md) or [Azure PowerShell](../azure-resource-manager/management/manage-resource-groups-powershell.md). This step is optional if you use an existing resource group.

1. Create a new storage account by using the [Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal) or [Azure PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell). This step is optional if you use an existing storage account.

1. Upload the package (.cspkg or .zip) file and configuration (.cscfg) file to the storage account by using the [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob) or [Azure PowerShell](../storage/blobs/storage-quickstart-blobs-powershell.md#upload-blobs-to-the-container). Save the shared access signature (SAS) URIs for both files to add to the ARM template in a later step.

1. (Optional) Create a key vault and upload the certificates.

    - You can attach certificates to your deployment for secure communication to and from the service. If you use certificates, the certificate thumbprints must be specified in your configuration (.cscfg) file and be uploaded to a key vault. You can create a key vault by using the [Azure portal](/azure/key-vault/general/quick-create-portal) or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).
    - The associated key vault must be in the same region and subscription as your Cloud Services (extended support) deployment.
    - The associated key vault must have the relevant permissions so that Cloud Services (extended support) resources can retrieve certificates from the key vault. For more information, see [Use certificates with Cloud Services (extended support)](certificates-and-key-vault.md).
    - The key vault must be referenced in the `osProfile` section of the ARM template as shown in a later step.

## Deploy Cloud Services (extended support)

To deploy Cloud Services (extended support) by using a template:

> [!NOTE]
> An easier and faster way to generate your ARM template and parameter file is by using the [Azure portal](https://portal.azure.com). You can [download the generated ARM template](generate-template-portal.md) in the portal to create your Cloud Services (extended support) via Azure PowerShell.

1. Create a virtual network. The name of the virtual network must match virtual network references in the configuration (.cscfg) file. If you use an existing virtual network, omit this section from the ARM template.

    ```json
    "resources": [ 
        { 
          "apiVersion": "2019-08-01", 
          "type": "Microsoft.Network/virtualNetworks", 
          "name": "[parameters('vnetName')]", 
          "location": "[parameters('location')]", 
          "properties": { 
            "addressSpace": { 
              "addressPrefixes": [ 
                "10.0.0.0/16" 
              ] 
            }, 
            "subnets": [ 
              { 
                "name": "WebTier", 
                "properties": { 
                  "addressPrefix": "10.0.0.0/24" 
                } 
              } 
            ] 
          } 
        } 
    ] 
    ```
  
     If you create a new virtual network, add the following lines to the `dependsOn` section to ensure that the platform creates the virtual network before it creates the Cloud Services (extended support) instance:

    ```json
    "dependsOn": [ 
            "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]" 
     ] 
    ```

1. Create a public IP address and (optionally) set the DNS label property of the public IP address. If you use a static IP address, you must reference it as a reserved IP address in the configuration (.cscfg) file. If you use an existing IP address, skip this step and add the IP address information directly in the load balancer configuration settings in your ARM template.

    ```json
    "resources": [ 
        { 
          "apiVersion": "2019-08-01", 
          "type": "Microsoft.Network/publicIPAddresses", 
          "name": "[parameters('publicIPName')]", 
          "location": "[parameters('location')]", 
          "properties": { 
            "publicIPAllocationMethod": "Dynamic", 
            "idleTimeoutInMinutes": 10, 
            "publicIPAddressVersion": "IPv4", 
            "dnsSettings": { 
              "domainNameLabel": "[variables('dnsName')]" 
            } 
          }, 
          "sku": { 
            "name": "Basic" 
          } 
        } 
    ] 
    ```

     If you create a new IP address, add the following lines to the `dependsOn` section to ensure that the platform creates the IP address before it creates the Cloud Services (extended support) instance:

    ```json
    "dependsOn": [ 
            "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]" 
          ] 
    ```

1. Create a Cloud Services (extended support) object. Add relevant `dependsOn` references if you deploy virtual networks or public IP addresses in your template.

    ```json
    {
      "apiVersion": "2021-03-01",
      "type": "Microsoft.Compute/cloudServices",
      "name": "[variables('cloudServiceName')]",
      "location": "[parameters('location')]",
      "tags": {
        "DeploymentLabel": "[parameters('deploymentLabel')]",
        "DeployFromVisualStudio": "true"
      },
      "dependsOn": [
        "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]",
        "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]"
      ],
      "properties": {
        "packageUrl": "[parameters('packageSasUri')]",
        "configurationUrl": "[parameters('configurationSasUri')]",
        "upgradeMode": "[parameters('upgradeMode')]"
      }
    }
    ```

1. Create a network profile object for your deployment, and associate the public IP address with the front end of the load balancer. The Azure platform automatically creates a load balancer.

    ```json
    "networkProfile": { 
        "loadBalancerConfigurations": [ 
          { 
            "id": "[concat(variables('resourcePrefix'), 'Microsoft.Network/loadBalancers/', variables('lbName'))]", 
            "name": "[variables('lbName')]", 
            "properties": { 
              "frontendIPConfigurations": [ 
                { 
                  "name": "[variables('lbFEName')]", 
                  "properties": { 
                    "publicIPAddress": { 
                      "id": "[concat(variables('resourcePrefix'), 'Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]" 
                    } 
                  } 
                } 
              ] 
            } 
          } 
        ] 
      } 
    ```

1. Add your key vault reference in the `osProfile` section of the ARM template. A key vault stores certificates that are associated with Cloud Services (extended support). Add the certificates to the key vault, and then reference the certificate thumbprints in the configuration (.cscfg) file. Also, set the key vault access policy for **Azure Virtual Machines for deployment** in the Azure portal so that the Cloud Services (extended support) resource can retrieve the certificates that are stored as secrets in the key vault. The key vault must be in the same region and subscription as your Cloud Services (extended support) resource and have a unique name. For more information, see [Use certificates with Cloud Services (extended support)](certificates-and-key-vault.md).

    ```json
    "osProfile": { 
          "secrets": [ 
            { 
              "sourceVault": { 
                "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.KeyVault/vaults/{keyvault-name}" 
              }, 
              "vaultCertificates": [ 
                { 
                  "certificateUrl": "https://{keyvault-name}.vault.azure.net:443/secrets/ContosoCertificate/{secret-id}" 
                } 
              ] 
            } 
          ] 
        } 
    ```
  
    > [!NOTE]
    > `sourceVault`in the ARM template  is the value of the resource ID for your key vault. You can get this information by finding **Resource ID** in the **Properties** section of your key vault.
    > - You can get the value for `certificateUrl` by going to the certificate in the key vault that's labeled **Secret Identifier**.  
    > - `certificateUrl` should be of the form of `https://{keyvault-endpoint}/secrets/{secret-name}/{secret-id}`.

1. Create a role profile. Ensure that the number of roles, the number of instances in each role, role names, and role sizes are the same across the configuration (.cscfg) file, the definition (.csdef) file, and the `roleProfile` section in the ARM template.
  
    ```json
    "roleProfile": {
      "roles": {
        "value": [
          {
            "name": "WebRole1",
            "sku": {
              "name": "Standard_D1_v2",
              "capacity": "1"
            }
          },
          {
            "name": "WorkerRole1",
            "sku": {
              "name": "Standard_D1_v2",
              "capacity": "1"
            } 
          } 
        ]
      }
    }   
    ```

1. (Optional) Create an extension profile to add extensions to your Cloud Services (extended support) deployment. The following example adds the Remote Desktop Protocol (RDP) extension and the Azure Diagnostics extension.

   > [!NOTE]
   > The password for RDP must from 8 to 123 characters and must satisfy at least *three* of the following password-complexity requirements:
   >
   > Contains an uppercase character.  
   > Contains a lowercase character.  
   > Contains a numeric digit.  
   > Contains a special character.  
   > Cannot contain a control character.  

    ```json
        "extensionProfile": {
          "extensions": [
            {
              "name": "RDPExtension",
              "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Windows.Azure.Extensions",
                "type": "RDP",
                "typeHandlerVersion": "1.2.1",
                "settings": "<PublicConfig>\r\n <UserName>[Insert Username]</UserName>\r\n <Expiration>1/21/2022 12:00:00 AM</Expiration>\r\n</PublicConfig>",
                "protectedSettings": "<PrivateConfig>\r\n <Password>[Insert Password]</Password>\r\n</PrivateConfig>"
              }
            },
            {
              "name": "Microsoft.Insights.VMDiagnosticsSettings_WebRole1",
              "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.Diagnostics",
                "type": "PaaSDiagnostics",
                "typeHandlerVersion": "1.5",
                "settings": "[parameters('wadPublicConfig_WebRole1')]",
                "protectedSettings": "[parameters('wadPrivateConfig_WebRole1')]",
                "rolesAppliedTo": [
                  "WebRole1"
                ]
              }
            }
          ]
        }
    ```

1. Review the full template:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "cloudServiceName": {
          "type": "string",
          "metadata": {
            "description": "Name of the cloud service"
          }
        },
        "location": {
          "type": "string",
          "metadata": {
            "description": "Location of the cloud service"
          }
        },
        "deploymentLabel": {
          "type": "string",
          "metadata": {
            "description": "Label of the deployment"
          }
        },
        "packageSasUri": {
          "type": "securestring",
          "metadata": {
            "description": "SAS URI of the package (.cspkg) file to deploy"
          }
        },
        "configurationSasUri": {
          "type": "securestring",
          "metadata": {
            "description": "SAS URI of the configuration (.cscfg) file"
          }
        },
        "roles": {
          "type": "array",
          "metadata": {
            "description": "Roles created in the cloud service application"
          }
        },
        "wadPublicConfig_WebRole1": {
          "type": "string",
          "metadata": {
             "description": "Public configuration of the Azure Diagnostics extension"
          }
        },
        "wadPrivateConfig_WebRole1": {
          "type": "securestring",
          "metadata": {
            "description": "Private configuration of the Azure Diagnostics extension"
          }
        },
        "vnetName": {
          "type": "string",
          "defaultValue": "[concat(parameters('cloudServiceName'), 'VNet')]",
          "metadata": {
            "description": "Name of vitual network"
          }
        },
        "publicIPName": {
          "type": "string",
          "defaultValue": "contosocsIP",
          "metadata": {
            "description": "Name of public IP address"
          }
        },
        "upgradeMode": {
          "type": "string",
          "defaultValue": "Auto",
          "metadata": {
            "UpgradeMode": "UpgradeMode of the CloudService"
          }
        }
      },
      "variables": {
        "cloudServiceName": "[parameters('cloudServiceName')]",
        "subscriptionID": "[subscription().subscriptionId]",
        "dnsName": "[variables('cloudServiceName')]",
        "lbName": "[concat(variables('cloudServiceName'), 'LB')]",
        "lbFEName": "[concat(variables('cloudServiceName'), 'LBFE')]",
        "resourcePrefix": "[concat('/subscriptions/', variables('subscriptionID'), '/resourceGroups/', resourceGroup().name, '/providers/')]"
      },
      "resources": [
        {
          "apiVersion": "2019-08-01",
          "type": "Microsoft.Network/virtualNetworks",
          "name": "[parameters('vnetName')]",
          "location": "[parameters('location')]",
          "properties": {
            "addressSpace": {
              "addressPrefixes": [
                "10.0.0.0/16"
              ]
            },
            "subnets": [
              {
                "name": "WebTier",
                "properties": {
                  "addressPrefix": "10.0.0.0/24"
                }
              }
            ]
          }
        },
        {
          "apiVersion": "2019-08-01",
          "type": "Microsoft.Network/publicIPAddresses",
          "name": "[parameters('publicIPName')]",
          "location": "[parameters('location')]",
          "properties": {
            "publicIPAllocationMethod": "Dynamic",
            "idleTimeoutInMinutes": 10,
            "publicIPAddressVersion": "IPv4",
            "dnsSettings": {
              "domainNameLabel": "[variables('dnsName')]"
            }
          },
          "sku": {
            "name": "Basic"
          }
        },
        {
          "apiVersion": "2021-03-01",
          "type": "Microsoft.Compute/cloudServices",
          "name": "[variables('cloudServiceName')]",
          "location": "[parameters('location')]",
          "tags": {
            "DeploymentLabel": "[parameters('deploymentLabel')]",
            "DeployFromVisualStudio": "true"
          },
          "dependsOn": [
            "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]",
            "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]"
          ],
          "properties": {
            "packageUrl": "[parameters('packageSasUri')]",
            "configurationUrl": "[parameters('configurationSasUri')]",
            "upgradeMode": "[parameters('upgradeMode')]",
            "roleProfile": {
              "roles": [
                {
                  "name": "WebRole1",
                  "sku": {
                    "name": "Standard_D1_v2",
                    "capacity": "1"
                  }
                },
                {
                  "name": "WorkerRole1",
                  "sku": {
                    "name": "Standard_D1_v2",
                    "capacity": "1"
                  }
                }
              ]
            },
            "networkProfile": {
              "loadBalancerConfigurations": [
                {
                  "id": "[concat(variables('resourcePrefix'), 'Microsoft.Network/loadBalancers/', variables('lbName'))]",
                  "name": "[variables('lbName')]",
                  "properties": {
                    "frontendIPConfigurations": [
                      {
                        "name": "[variables('lbFEName')]",
                        "properties": {
                          "publicIPAddress": {
                            "id": "[concat(variables('resourcePrefix'), 'Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]"
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            },
            "osProfile": {
              "secrets": [
                {
                  "sourceVault": {
                    "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.KeyVault/vaults/{keyvault-name}"
                  },
                  "vaultCertificates": [
                    {
                      "certificateUrl": "https://{keyvault-name}.vault.azure.net:443/secrets/ContosoCertificate/{secret-id}"
                    }
                  ]
                }
              ]
            },
            "extensionProfile": {
              "extensions": [
                {
                  "name": "RDPExtension",
                  "properties": {
                    "autoUpgradeMinorVersion": true,
                    "publisher": "Microsoft.Windows.Azure.Extensions",
                    "type": "RDP",
                    "typeHandlerVersion": "1.2.1",
                    "settings": "<PublicConfig>\r\n <UserName>[Insert Username]</UserName>\r\n <Expiration>1/21/2022 12:00:00 AM</Expiration>\r\n</PublicConfig>",
                    "protectedSettings": "<PrivateConfig>\r\n <Password>[Insert Password]</Password>\r\n</PrivateConfig>"
                  }
                },
                {
                  "name": "Microsoft.Insights.VMDiagnosticsSettings_WebRole1",
                  "properties": {
                    "autoUpgradeMinorVersion": true,
                    "publisher": "Microsoft.Azure.Diagnostics",
                    "type": "PaaSDiagnostics",
                    "typeHandlerVersion": "1.5",
                    "settings": "[parameters('wadPublicConfig_WebRole1')]",
                    "protectedSettings": "[parameters('wadPrivateConfig_WebRole1')]",
                    "rolesAppliedTo": [
                      "WebRole1"
                  ]
                }
              }
            ]
          }
        }
       }
      ]
    }
    ```

1. To create the Cloud Services (extended support) deployment, deploy the template and parameter file (to define parameters in the template file). You can use these [sample templates](https://github.com/Azure-Samples/cloud-services-extended-support).

    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName "ContosOrg" -TemplateFile "file path to your template file" -TemplateParameterFile "file path to your parameter file"
    ```

## Related content

- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy Cloud Services (extended support) by using the [Azure portal](deploy-portal.md), [Azure PowerShell](deploy-powershell.md), or [Visual Studio](deploy-visual-studio.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support).
