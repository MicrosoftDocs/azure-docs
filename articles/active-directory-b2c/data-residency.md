---
title: Region availability and data residency
titleSuffix: Azure AD B2C
description: Region availability, data residency, and information about Azure Active Directory B2C preview tenants.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 10/19/2020
ms.author: mimart
ms.subservice: B2C
ms.custom: references_regions
---

# Azure Active Directory B2C: Region availability & data residency

Region availability and data residency are two very different concepts that apply differently to Azure AD B2C from the rest of Azure. This article explains the differences between these two concepts, and compares how they apply to Azure versus Azure AD B2C.

Azure AD B2C is **generally available worldwide** with the option for **data residency** in the **United States, Europe, or Asia Pacific**.

[Region availability](#region-availability) refers to where a service is available for use.

[Data residency](#data-residency) refers to where user data is stored.

## Region availability

Azure AD B2C is available worldwide via the Azure public cloud.

This differs from the model followed by most other Azure services, which typically couple *availability* with *data residency*. You can see examples of this in both Azure's [Products Available By Region](https://azure.microsoft.com/regions/services/) page and the [Active Directory B2C pricing calculator](https://azure.microsoft.com/pricing/details/active-directory-b2c/).

## Data residency

Azure AD B2C stores user data in either United States, Europe, or the Asia Pacific region.

Data residency is determined by the country/region you select when you [create an Azure AD B2C tenant](tutorial-create-tenant.md):

![Screenshot of a Create Tenant form, choosing country or region.](./media/data-residency/data-residency-b2c-tenant.png)

Data resides in the **United States** for the following countries/regions:

> United States (US), Canada (CA), Costa Rica (CR), Dominican Republic (DO), El Salvador (SV), Guatemala (GT), Mexico (MX), Panama (PA), Puerto Rico (PR) and Trinidad & Tobago (TT)

Data resides in **Europe** for the following countries/regions:

> Algeria (DZ), Austria (AT), Azerbaijan (AZ), Bahrain (BH), Belarus (BY), Belgium (BE), Bulgaria (BG), Croatia (HR), Cyprus (CY), Czech Republic (CZ), Denmark (DK), Egypt (EG), Estonia (EE), Finland (FT), France (FR), Germany (DE), Greece (GR), Hungary (HU), Iceland (IS), Ireland (IE), Israel (IL), Italy (IT), Jordan (JO), Kazakhstan (KZ), Kenya (KE), Kuwait (KW), Latvia (LV), Lebanon (LB), Liechtenstein (LI), Lithuania (LT), Luxembourg (LU), North Macedonia (ML), Malta (MT), Montenegro (ME), Morocco (MA), Netherlands (NL), Nigeria (NG), Norway (NO), Oman (OM), Pakistan (PK), Poland (PL), Portugal (PT), Qatar (QA), Romania (RO), Russia (RU), Saudi Arabia (SA), Serbia (RS), Slovakia (SK), Slovenia (ST), South Africa (ZA), Spain (ES), Sweden (SE), Switzerland (CH), Tunisia (TN), Turkey (TR), Ukraine (UA), United Arab Emirates (AE) and United Kingdom (GB)

Data resides in **Asia Pacific** for the following countries/regions:

> Afghanistan (AF), Hong Kong SAR (HK), India (IN), Indonesia (ID), Japan (JP), Korea (KR), Malaysia (MY), Philippines (PH), Singapore (SG), Sri Lanka (LK), Taiwan (TW), and Thailand (TH).

The following countries/regions are in the process of being added to the list. For now, you can still use Azure AD B2C by picking any of the countries/regions above.

> Argentina, Australia, Brazil, Chile, Colombia, Ecuador, Iraq, New Zealand, Paraguay, Peru, Uruguay, and Venezuela.

## Remote profile solution

With Azure AD B2C [custom policy](custom-policy-overview.md) you can integrate with [RESTful APIs services](custom-policy-rest-api-intro.md), which allows you to store and read user profile from a remote database (a marketing database, CRM system, or any line of business application). 
- During the sign-up and profile editing flow, Azure AD B2C calls a custom REST API to persist the user profile to the remote data source. While the user's credentials are stored in Azure AD B2C directory. 
- On sign-in, after the credentials validation, with local or social account, Azure AD B2C invokes the REST API, sending the user unique identifier as a user primary key (email address, or user objectId). The REST API reads the data from the remote database and return the user profile. 

After sign-up, edit profile, or sign-in, is completed Azure AD B2C includes the user profile in the access token that returns back to the application. For more information, see [Azure AD B2C Remote profile GitHub solution](https://github.com/azure-ad-b2c/samples/tree/master/policies/remote-profile).

## Nest steps

- [Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).
