---
title: Create an Azure Cloud Service (extended support) - Templates
description: Create an Azure Cloud Service (extended support) by using ARM templates
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Create a Cloud Service (extended support) using ARM templates

This tutorial explains how to create a Cloud Service (extended support) deployment using ARM templates. 

## Before you begin
1. Register the Cloud Service feature to the desired subscription

    ```powershell
    Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
    ```

2.  View the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support). 

3. When creating a Cloud Service (extended support) deployment using ARM templates, the template and other artifacts (cscfg/ csdef/ cspkg) need to be kept in sync. 


## Create a Cloud Service (extended Support) using ARM templates

1. Prepare your deployment artifacts (csdef and cscfg) and associated resources. For more information see [Deployment prerequisites](deploy-prerequisites.md)

2. Create an Azure resource group with New-AzResourceGroup command (or through portal). A resource group is a logical container into which Azure resources are deployed and managed. 
     
    ```powershell
    New-AzResourceGroup -ResourceGroupName “ContosOrg” -Location “East US” 
    ```
 
3. Create storage account and upload Service Definition and Service configuration files 

    ### Service Package 
    
    - Regenerate your package in case you changed your service definition file. Otherwise, you can use the same package from cloud service (classic) 
    
    - Package needs to be passed in ARM template as packageUrl that refers to the location of the service package in the Blob service. The package URL can be Shared Access Signature (SAS) URI from any storage account 
    
    ### Service Configuration 
    
    - Service Configuration can be specified either as string XML or URL format 
    
    - Service Configuration needs to be passed in ARM template as configurationUrl that refers to Shared Access Signature (SAS) URI from any storage account 
    
    - Service configuration can also be passed in ARM template as configuration that specifies the XML service configuration (.cscfg) for the cloud service in string format 

    | Parameter Name | Type | Description | 
    |---|---|---|
     PackageUrl | string | Specifies a URL that refers to the location of the service package in the Blob service. The service package URL can be Shared Access Signature (SAS) URI from any storage account. | 
    | Configuration | string | Specifies the XML service configuration (.cscfg) for the cloud service. | 
    | ConfigurationUrl | string | Specifies a URL that refers to the location of the service configuration in the Blob service. The service package URL can be Shared Access Signature (SAS) URI from any storage account. | 

    Refer to this document to create storage account and obtain SAS URIs for Service Package and Service Configuration (Link to PS document section for storage account creation and accessing SAS URIs  

    ```arm
    "properties": { 
            "packageUrl": "[parameters('packageSasUri')]", 
            "configurationUrl": "[parameters('configurationSasUri')]", 
            } 
    ```
 

4. Create virtual network and subnet (skip if these resources are already created) and make sure the names match the references in Service Configuration as mentioned in Step1. 

    You can also create it together with the cloud service, in the same ARM template as shared below.  

 
    ```arm
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
    
    Add the ‘depends on’ section under the cloud service resource to ensure ARM creates the virtual network prior to creating the cloud service. 

    ```arm
    "dependsOn": [ 
            "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]" 
     ] 
    ```
  
5. Create a public IP address and (optionally) set the DNS label property of the public IP address.  Only if you are using a static IP, you need to additionally reference it as a Reserved IP in Service Configuration file.  
 
    ```arm
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
     
     Add the ‘depends on’ section under the cloud service resource to ensure ARM creates the virtual network prior to creating the cloud service. 
    
    ```arm
    "dependsOn": [ 
            "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPName'))]" 
          ] 
    ```
 
6. Create Network Profile Object and associate public IP address to the frontend of the platform created load balancer. Load balancer is automatically created by the platform.  

    ```arm
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
 

7. Create Key vault  (Optional if using existing KeyVault) & upload the certificates. 
 
    Certificates can be attached to cloud services to enable secure communication to and from the service. In order to use certificates, their thumbprints must be specified in your ServiceConfiguration.cscfg file and the certificates must be uploaded to your Key vault. KeyVault can be created through portal and  powershell. KeyVault must be created in the same region and subscription as cloud service. You will also need to add your key vault reference in the OsProfile section of the ARM template.    
     
    ```arm
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
    
    - SourceVault is the ARM Resource ID to your Key Vault. You can find this information by looking in the properties section of the Key Vault. It is the Resource ID.   
    - VaultCertificates is stored in the certificate of your key vault. Browse to your certificate in the Azure portal and copy the Certificate Identifier (Secret URI)  
    - For further details, please use Certificate documentation (give link to the right doc) 


8. Create Role Profile. Ensure that the number of roles, Role names, number of instances in each role and sizes should be same across .cscfg, .csdef and role profile section in ARM template. 
    
    ```arm
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
        } 
    ```

9. Create an extension profile to add desired extension to your cloud service. For this example, we are adding RDP extension. For further details, please use separate extension documentation (give link) 
    
    ```arm
    "extensionProfile": { 
              "extensions": [ 
                 { 
                  "name": "RDPExtension", 
                  "properties": { 
                    "autoUpgradeMinorVersion": true, 
                    "publisher": "Microsoft.Windows.Azure.Extensions", 
                    "type": "RDP", 
                    "typeHandlerVersion": "1.2.1", 
                    "settings": "[parameters('rdpPublicConfig')]", 
                    "protectedSettings": "[parameters('rdpPrivateConfig')]" 
                  } 
                } 
              ] 
            } 
    ```
    
    Use this document to get details of each object referenced above. (ARM template reference documentation) 
    
 

10.  Use the template & parameters (link to github hyperlinks) file to create/update the Cloud Services (extended support) deployment 
  

```powershell
New-AzResourceGroupDeployment -ResourceGroupName “ContosOrg” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file”  
```

 
### ARM Template Sample
```arm
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
        "description": "SAS Uri of the CSPKG file to deploy"
      }
    },
    "configurationSasUri": {
      "type": "securestring",
      "metadata": {
        "description": "SAS Uri of the service configuration (.cscfg)"
      }
    },
    "roles": {
      "type": "array",
      "metadata": {
        "description": "Roles created in the cloud service application"
      }
    },
    "rdpPublicConfig": {
      "type": "string",
      "metadata": {
        "description": "Public config of remote desktop extension"
      }
    },
    "rdpPrivateConfig": {
      "type": "securestring",
      "metadata": {
        "description": "Private config of remote desktop extension"
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
      "apiVersion": "2020-10-01-preview",
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
                "settings": "[parameters('rdpPublicConfig')]",
                "protectedSettings": "[parameters('rdpPrivateConfig')]"
              }
            }
          ]
        }
      }
    }
  ]
}
```

Add below template here –  

https://microsoft.sharepoint.com/:u:/t/CloudServicesonVMScaleSets-PrivatePreview-MSFT-onlydiscussionpage/EacV7Gqud1FIq-lwCD45XQUBdL9NcP_PocQl4uoTL7mX_g?e=qM1vtE 

 
## Next steps

See [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)
