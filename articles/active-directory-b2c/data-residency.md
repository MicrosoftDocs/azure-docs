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
ms.date: 06/06/2020
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

## Preview tenant

If you had created a B2C tenant during Azure AD B2C's preview period, it's likely that your **Tenant type** says **Preview tenant**.

If this is the case, you must use your tenant ONLY for development and testing purposes. DO NOT use a preview tenant for production applications.

**There is no migration path** from a preview B2C tenant to a production-scale B2C tenant. You must create a new B2C tenant for your production applications.

There are known issues when you delete a preview B2C tenant and create a production-scale B2C tenant with the same domain name. *You must create a production-scale B2C tenant with a different domain name*.

![Screenshot of a tenant type, as preview tenant.](./media/data-residency/preview-b2c-tenant.png)