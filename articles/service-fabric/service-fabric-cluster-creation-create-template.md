---
title: Create an Azure Service Fabric cluster template | Microsoft Docs
description: Learn how to create a Resource Manager template for a Service Fabric cluster. Configure security, Azure Key Vault, and Azure Active Directory (Azure AD) for client authentication.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: timlt
editor: chackdan
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/16/2018
ms.author: aljo

---
# Create a Service Fabric cluster Resource Manager template

An [Azure Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual machines into which your microservices are deployed and managed. A Service Fabric cluster running in Azure is an Azure resource and is deployed, managed, and monitored using the Resource Manager.  This article describes how create a Resource Manager template for a Service Fabric cluster running in Azure.  When the template is complete, you can [deploy the cluster on Azure](service-fabric-cluster-creation-via-arm.md).

Cluster security is configured when the cluster is first set up and cannot be changed later. Before setting up a cluster, read [Service Fabric cluster security scenarios][service-fabric-cluster-security]. In Azure, Service Fabric uses x509 certificate to secure your cluster and its endpoints, authenticate clients, and encrypt data. Azure Active Directory is also recommended to secure access to management endpoints. Azure AD tenants and users must be created before creating the cluster.  For more information, read [Set up Azure AD to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

Before deploying a production cluster to run production workloads, be sure to first read the [Production readiness checklist](service-fabric-production-readiness-checklist.md).

## Create the Resource Manager template
Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template.

This article uses the [five-node secure cluster][service-fabric-secure-cluster-5-node-1-nodetype] example template and template parameters. Download *azuredeploy.json* and *azuredeploy.parameters.json* to your computer and open both files in your favorite text editor.

> [!NOTE]
> For national clouds (Azure Government, Azure China, Azure Germany), you should also add the following `fabricSettings` to your template: `AADLoginEndpoint`, `AADTokenEndpointFormat` and `AADCertEndpointFormat`.

## Add certificates
You add certificates to a cluster Resource Manager template by referencing the key vault that contains the certificate keys. Add those key-vault parameters and values in a Resource Manager template parameters file (*azuredeploy.parameters.json*).

### Add all certificates to the virtual machine scale set osProfile
Every certificate that's installed in the cluster must be configured in the **osProfile** section of the scale set resource (Microsoft.Compute/virtualMachineScaleSets). This action instructs the resource provider to install the certificate on the VMs. This installation includes both the cluster certificate and any application security certificates that you plan to use for your applications:

```json
{
  "apiVersion": "[variables('vmssApiVersion')]",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "osProfile": {
      ...
      "secrets": [
        {
          "sourceVault": {
            "id": "[parameters('sourceVaultValue')]"
          },
          "vaultCertificates": [
            {
              "certificateStore": "[parameters('clusterCertificateStorevalue')]",
              "certificateUrl": "[parameters('clusterCertificateUrlValue')]"
            },
            {
              "certificateStore": "[parameters('applicationCertificateStorevalue')",
              "certificateUrl": "[parameters('applicationCertificateUrlValue')]"
            },
            ...
          ]
        }
      ]
    }
  }
}
```

### Configure the Service Fabric cluster certificate

The cluster authentication certificate must be configured in both the Service Fabric cluster resource (Microsoft.ServiceFabric/clusters) and the Service Fabric extension for virtual machine scale sets in the virtual machine scale set resource. This arrangement allows the Service Fabric resource provider to configure it for use for cluster authentication and server authentication for management endpoints.

#### Add the certificate information the Virtual machine scale set resource

```json
{
  "apiVersion": "[variables('vmssApiVersion')]",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "virtualMachineProfile": {
      "extensionProfile": {
        "extensions": [
          {
            "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
            "properties": {
              ...
              "settings": {
                ...
                "certificate": {
                  "commonNames": ["[parameters('certificateCommonName')]"],
                  "x509StoreName": "[parameters('clusterCertificateStoreValue')]"
                },
                ...
              }
            }
          }
        ]
      }
    }
  }
}
```

#### Add the certificate information to the Service Fabric cluster resource

```json
{
  "apiVersion": "2018-02-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  "location": "[parameters('clusterLocation')]",
  "dependsOn": [
    "[concat('Microsoft.Storage/storageAccounts/', variables('supportLogStorageAccountName'))]"
  ],
  "properties": {
    "certificateCommonNames": {
        "commonNames": [
        {
            "certificateCommonName": "[parameters('certificateCommonName')]",
            "certificateIssuerThumbprint": ""
        }
        ],
        "x509StoreName": "[parameters('certificateStoreValue')]"
    },
    ...
  }
}
```

## Add Azure AD configuration to use Azure AD for client access

You add the Azure AD configuration to a cluster Resource Manager template by referencing the key vault that contains the certificate keys. Add those Azure AD parameters and values in a Resource Manager template parameters file (*azuredeploy.parameters.json*). 

> [!NOTE]
> Azure AD tenants and users must be created before creating the cluster.  For more information, read [Set up Azure AD to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

```json
{
  "apiVersion": "2018-02-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  ...
  "properties": {
    "certificateCommonNames": {
        "commonNames": [
        {
            "certificateCommonName": "[parameters('certificateCommonName')]",
            "certificateIssuerThumbprint": ""
        }
        ],
        "x509StoreName": "[parameters('certificateStoreValue')]"
    },
    ...
    "azureActiveDirectory": {
      "tenantId": "[parameters('aadTenantId')]",
      "clusterApplication": "[parameters('aadClusterApplicationId')]",
      "clientApplication": "[parameters('aadClientApplicationId')]"
    },
    ...
  }
}
```

## Populate the parameter file with the values

Finally, use the output values from the key vault and Azure AD PowerShell commands to populate the parameters file.

If you plan to use the Azure service fabric RM PowerShell modules, then you do not need to populate the cluster certificate information. If you want the system to generate the self signed certificate for cluster security you, just keep them as null. 

> [!NOTE]
> For the RM modules to pick up and populate these empty parameter values, the parameters names much match the names below

```json
"clusterCertificateThumbprint": {
    "value": ""
},
"certificateCommonName": {
    "value": ""
},
"clusterCertificateUrlValue": {
    "value": ""
},
"sourceVaultvalue": {
    "value": ""
},
```

If you are using application certs or are using an existing cluster that you have uploaded to the key vault, you need to get this information and populate it.

The RM modules do not have the ability to generate the Azure AD configuration for you, so if you plan to use the Azure AD for client access, you need to populate it.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        ...
        "clusterCertificateStoreValue": {
            "value": "My"
        },
        "clusterCertificateThumbprint": {
            "value": "<thumbprint>"
        },
        "clusterCertificateUrlValue": {
            "value": "https://myvault.vault.azure.net:443/secrets/myclustercert/4d087088df974e869f1c0978cb100e47"
        },
        "applicationCertificateStorevalue": {
            "value": "My"
        },
        "applicationCertificateUrlValue": {
            "value": "https://myvault.vault.azure.net:443/secrets/myapplicationcert/2e035058ae274f869c4d0348ca100f08"
        },
        "sourceVaultvalue": {
            "value": "/subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault"
        },
        "aadTenantId": {
            "value": "<guid>"
        },
        "aadClusterApplicationId": {
            "value": "<guid>"
        },
        "aadClientApplicationId": {
            "value": "<guid>"
        },
        ...
    }
}
```

## Test your template
Use the following PowerShell command to test your Resource Manager template with a parameter file:

```PowerShell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

In case you run into issues and get cryptic messages, then use "-Debug" as an option.

```PowerShell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json -Debug
```

The following diagram illustrates where your key vault and Azure AD configuration fit into your Resource Manager template.

![Resource Manager dependency map][cluster-security-arm-dependency-map]

## Next steps
Now that you have a template for your cluster, learn how to [deploy the cluster to Azure](service-fabric-cluster-creation-via-arm.md).  If you haven't already, read the [Production readiness checklist](service-fabric-production-readiness-checklist.md) before deploying a production cluster.


<!-- Links -->
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[service-fabric-secure-cluster-5-node-1-nodetype]: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure
[resource-group-template-deploy]: https://azure.microsoft.com/documentation/articles/resource-group-template-deploy/

<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-cluster-creation-create-template/cluster-security-arm-dependency-map.png
