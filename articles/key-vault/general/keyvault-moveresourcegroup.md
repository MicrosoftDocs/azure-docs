---
title: Azure Key Vault moving a vault to a different resource group | Microsoft Docs
description: Guidance on moving a key vault to a different resource group.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: sudbalas
Customer intent: As a key vault administrator, I want to move my vault to another resource group.
---

# Moving an Azure Key Vault across resource groups

## Overview

Moving a key vault across resource groups is a supported key vault feature. Moving a key vault between resource groups will not affect key vault firewall or access policy configurations. Connected applications and service principals should continue to work as intended.

## Design Considerations

Your organization may have implemented Azure Policy with enforcement or exclusions at the resource group level. There may be a different set of policy assignments in the resource group where your key vault currently exists and the resource group where you are moving your key vault. A conflict in policy requirements has the potential to break your applications.

### Example

You have an application connected to key vault that creates certificates that are valid for two years. The resource group where you are attempting to move your key vault has a policy assignment that blocks the creation of certificates that are valid for longer than one year. After moving your key vault to the new resource group the operation to create a certificate that is valid for two years will be blocked by an Azure policy assignment.

### Solution

Make sure that you go to the Azure Policy page on the Azure portal and look at the policy assignments for your current resource group as well as the resource group you are moving to and ensure that there are no mismatches.

## Procedure

1. Log in to the Azure portal
2. Navigate to your key vault
3. Click on the "Overview" tab
4. Select the "Move" button
5. Select "Move to another resource group" from the dropdown options
6. Select the resource group where you want to move your key vault
7. Acknowledge the warning regarding moving resources
8. Select "OK"

Key Vault will now evaluate the validity of the resource move, and alert you of any errors. If no errors are found, the resource move will be completed. 
