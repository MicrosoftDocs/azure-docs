---
title: Tutorial - Delegate access governance to others in Azure AD entitlement management (Preview) - Azure Active Directory
description: Step-by-step tutorial for how to delegate access governance from IT administrators to department managers and project managers in Azure Active Directory entitlement management (Preview).
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.subservice: compliance
ms.date: 08/19/2019
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management


#Customer intent: As a IT admin, I want step-by-step instructions of how to delegate access governance to others in my organization.

---
# Tutorial: Delegate access governance to others in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Delegate access governance from IT administrator to department managers
> * Delegate access governance from department managers to project managers
> * Perform day-to-day management

## Prerequisites

To use Azure AD entitlement management (Preview), you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5 license

If you don't have an Azure AD Premium P2 or Enterprise Mobility + Security E5 license, create a free [Enterprise Mobility + Security E5 trial](https://signup.microsoft.com/Signup?OfferId=87dd2714-d452-48a0-a809-d2f58c4f68b7&ali=1).

## Job roles

- IT administrator
- Department manager
- Project manager
- Employee

## Entitlement management roles

- Catalog creator
- Catalog owner
- Access package manager


## Delegate access governance from IT administrator to department managers

### Step 1: Specify who can manage resources

**Job role:** IT administrator

**Azure AD role:** Global administrator or User administrator

### Step 2: Create a catalog

**Job role:** Department manager

**Entitlement management role:** Catalog creator

### Step 3: Specify who can manage the catalog

**Job role:** Department manager

**Entitlement management role:** Catalog owner

### Step 4: Add resources to the catalog

**Job role:** Department manager

**Entitlement management role:** Catalog owner


## Delegate access governance from department managers to project managers

### Step 1: Specify who can manage access packages

**Job role:** Department manager

**Entitlement management role:** Catalog owner

### Step 2: Create access package

**Job role:** Project manager

**Entitlement management role:** Access package manager

### Step 3: Request access to an access package

**Job role:** Employee

## Perform day-to-day management

### Step 1: Update resources in access package

**Job role:** Project manager

**Entitlement management role:** Access package manager

### Step 2: See how resources have changed

**Job role:** Employee

### Step 3: Update access package settings

**Job role:** Project manager

**Entitlement management role:** Access package manager

### Step 4: See how access has changed

**Job role:** Employee

### Step 5: Extend access to access package

**Job role:** Employee


## Next steps

Advance to the next article to learn about common scenario steps in entitlement management.
> [!div class="nextstepaction"]
> [Common scenarios](entitlement-management-scenarios.md)
