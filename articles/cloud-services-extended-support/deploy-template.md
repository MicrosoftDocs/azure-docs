---
title: Create a Azure Azure Cloud Service (extended support) - Templates
description: Create a Azure Cloud Service (extended support) using ARM Templates
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Create a Cloud Service (extended support) using ARM Templates

This tutorial explains how to create a Cloud Service (extended support) deployment using ARM templates. 

## Before you begin
When creating a Cloud Service (extended support) deployment using ARM templates, the template and other artifacts (cscfg/ csdef/ cspkg) need to be kept in sync in order to have seemless deployments. Prior to deploying, review the below information related to the configuration requirements. 

### Package
- Parameter name: `packageUrl`
- Package is specified by a URL that refers to the location of the blob service.
- The service package URL can be a Shared Access Signature (SAS) URI from any storage account. 

### Configuration

- Configuration can be specified either as string XML or URL format. 
- If using XML format, the parameter name is `configuration` and specifies the XML service configuration (cscfg) for the Cloud Service in string format.
- If using URL format, the parameter name is `configurationUrl` and specifies the URL that refers to the location of the service configuration (cscfg) in the blob service. The service package URL can be a Shared Access Signature (SAS) URI from any storage account. 
     

### Roles
- Parameter name: `roleprofile`
- Number of roles, role names and number of instances in each role should be the same across the cscfg, csdef and template files. 

### Certificates
- Parameter name: `osProfile`
- Object name: `sourceVault`
- Ob
### Load balancer
- Parameter name: `networkProfile`
- A load balancer is automatically created by the platform. 
- The load balancer name and `FrontEndIP` config pointing to the public IP address or subnet must be specified in the template. 

### Virtual network
- A virtual network is required for all Cloud Service (extended support) deployments and must be referenced in the cscfg file. 
- A virtual network should be created prior to deploying a Cloud Service or specified as a resource object in the ARM template if being created though the deployment template. 

### Extensions
- Parameter name: `extensionProfile`
- For more information on adding extensions to Cloud Service (extended support) deployments, see [Update a Azure Cloud Service (extended Support) deployment](sample-update-cloud-service.md)

## Create a Cloud Service (extended support)

1. Upload the cscfg and cspkg file to a storage account and obtain the SAS URLs.
2. Add the SAS URLs to the `cloudservices` resource section of the ARM template.
3. Ensure required resources are available and added to the template. 
    - Make sure the required resources are defined and reflected in the `cloudservices` resource section. 
    - The `dependsOn` clause defines the order.
4. Create the Cloud Service (extended support) deployment using PowerShell and the template file and parameter file.
    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName “ContosOrg” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file”  
    ```

## Next steps

See [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)