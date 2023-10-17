---
title: Configure customer-managed Keys (CMK) - Azure Health Data Services
description: This document describes how to configure Customer Managed Keys (CMK) for the DICOM service in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/16/2023
ms.author: mmitrik
---

# Configure customer-managed keys (CMK) for the DICOM service

Customer-managed keys (CMK) enable customers to protect and control access to their data using keys they create and manage.  The DICOM service supports CMK, allowing customers to create and manage keys using Azure Key Vault and then use those keys to encrypt the data stored by the DICOM service.  This article shows how to configure Azure Key Vault and the DICOM service to use customer-managed keys.

## Create a key in Azure Key Vault

To use customer-managed keys with the DICOM service, the key must first be created in Azure Key Vault.  The DICOM service also requires that keys meet the following requirements:

1. The key vault or managed HSM that stores the key must have both soft delete and purge protection enabled.
2. 

## Enable system assigned managed identity

### Assign Key Vault Crypto Officer role

## Use an ARM template to update the encryption key

## Losing access to the key

## Rotating they key
