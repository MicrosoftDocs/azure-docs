---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: azure-storage
 ms.topic: include
 ms.date: 05/28/2024
 ms.author: rogarana
 ms.custom: include file
---
The following list contains the regions Elastic SAN is currently available in, and which regions support both zone-redundant storage (ZRS) and locally redundant storage (LRS), or only LRS:

- Australia East - LRS
- Brazil South - LRS
- Canada Central - LRS
- Central US - LRS
- East Asia - LRS
- East US - LRS
- East US 2 - LRS
- France Central - LRS & ZRS
- Germany West Central - LRS
- India Central - LRS
- Japan East - LRS
- Korea Central - LRS
- North Europe - LRS & ZRS
- Norway East - LRS
- South Africa North - LRS
- South Central US - LRS
- Southeast Asia - LRS
- Sweden Central - LRS
- Switzerland North - LRS
- UAE North - LRS
- UK South - LRS
- West Europe - LRS & ZRS
- West US 2 - LRS & ZRS
- West US 3 - LRS

Elastic SAN is also available in the following regions, but without Availability Zone support: 
- Canada East - LRS
- Japan West - LRS
- North Central US - LRS

To enable these regions, run the following command to register the necessary feature flag: 
```azurepowershell
Register-AzProviderFeature -FeatureName "EnableElasticSANRegionalDeployment" -ProviderNamespace "Microsoft.ElasticSan"
```
