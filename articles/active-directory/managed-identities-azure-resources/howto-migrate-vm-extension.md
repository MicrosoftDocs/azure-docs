---
title: How to migrate from the virtual machine extension for managed identity to Azure Instance Metadata Service for authentication
description: Step by step instructions to migrate off of the VM extension to Azure Instance Metadata Service (IMDS) for authentication.
services: active-directory
documentationcenter: 
author: priyamohanram
manager: daveba
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/25/2018
ms.author: priyamo
---

# How to migrate from the virtual machine managed identities extension to Azure Instance Metadata Service

## Virtual machine extension for managed identities

The virtual machine (VM) extension for managed identities is used to request tokens on behalf of services that run on the VM. The workflow consists of the following steps:

1. First, the service calls a local endpoint, `http://localhost/oauth2/token` to request an access token.
2. The VM extension then uses the locally injected credentials to get an access token from Azure AD. 
3. The service then uses the access token to authenticate to an Azure service like KeyVault or storage.

Due to several limitations as outlined in the next section, the VM extension is planned to be deprecated in favor of using the Azure Instance Metadata Service (IMDS) endpoint. 

## Limitations of the VM extension 

There are several major limitations to using the VM extension. 

 * The most serious limitation is the fact that the credentials used to request tokens are stored on the VM. An attacker who successfully breaches the VM can exfiltrate the credentials. 
 * Furthermore, the VM extension is still unsupported by several Linux distributions, with a huge development cost to modify, build and test the extension on each of those distributions.
 * There is a performance impact to deploying VMs with managed identities, as the VM extension also has to be provisioned. 
 * Finally, the VM extension can only support having 32 user-assigned managed identities per VM. 
 
## Azure Instance Metadata Service

The [Azure Instance Metadata Service (IMDS)](https://docs.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service) is a REST endpoint that provides information about running virtual machine instances that can be used to manage and configure your virtual machines. The endpoint is available at a well-known non-routable IP address (`169.254.169.254`) that can be accessed only from within the VM.

There are several advantages to using Azure IMDS to request tokens. 

1. The service is external to the VM, therefore the credentials used by managed identities are no longer present on the VM. Instead, they are hosted and secured on the host machine of the Azure VM.   
2. All Windows and Linux operating systems supported on Azure IaaS can use managed identities.
3. Deployment is faster and easier, since the VM extension no longer needs to be provisioned.
4. With the IMDS endpoint, up to 1000 user-assigned managed identities can be assigned to a single VM.
5. There is no significant change to the requests using IMDS as opposed to those using the VM extension, therefore it is fairly simple to port over existing deployments that currently use the VM extension.

For these reasons, the Azure IMDS service will be the defacto way to request tokens, once the VM extension is deprecated. 

## Sample HTTP requests to Azure Instance Metadata Service

The following table lists commonly used HTTP requests on both the VM extension and Azure IDMS endpoint. 

