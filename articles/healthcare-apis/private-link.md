---
title: Private Link for Azure API for FHIR
description: private endpoint for Azure API for FHIR services
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: Configure settings
ms.date: 10/12/2020
ms.author: matjazl
---

# Configure Private Link

Private link enables you to access our services over a private endpoint, a network interface that connects you privately and securely using a private IP address from your virtual network. With private link, you can access our service securely from your Vnet as a first party service without having to go through a public DNS. This article walks you through how to create, test, and manage your private endpoint for Azure API for FHIR.

## Pre-requisites
Before creating a private endpoint, there are some Azure resources that you will need to create first: 
1.	Resource Group – The Azure resource group that will contain the virtual network and private endpoint.
2.	Azure API for FHIR - The FHIR resource you would like to put behind a private endpoint.
3.	Virtual Network – The VNet to which your client services and Private Endpoint will be connected.

For more information, check out the [Private Link Documentation](https://docs.microsoft.com/azure/private-link/).




## Creating a Private Endpoint Using Private Link Center
### Portal
### CLI
### PowerShell
## Disabling Public Network Access

## Testing Private Endpoint

## Managing Private Endpoint
### View
### Delete