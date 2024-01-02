---
title: "Azure AD B2C: Region availability & data residency"
titleSuffix: Azure AD B2C
description: Region availability, data residency, high availability, SLA, and information about Azure Active Directory B2C preview tenants.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 06/24/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: references_regions
---

# Azure Active Directory B2C: Region availability & data residency

Azure Active Directory B2C (Azure AD B2C) stores customer data in a geographic location based on how a tenant was created and provisioned. For the Azure portal or Microsoft Entra API, the location is defined when a customer selects a location from the pre-defined list.

Region availability and data residency are two different concepts that apply to Azure AD B2C. This article explains the differences between these two concepts, and compares how they apply to Azure versus Azure AD B2C. [Region availability](#region-availability) refers to where a service is available for use whereas [Data residency](#data-residency) refers to where user data is stored.

 
Azure AD B2C is **generally available worldwide** with the option for **data residency** in the **United States, Europe, Asia Pacific, or Australia**.

[Region availability](#region-availability) refers to where a service is available for use. [Data residency](#data-residency) refers to where customer data is stored. For customers in the EU and EFTA, see [EU Data Boundary](#eu-data-boundary).

If you enable [Go-Local add-on](#go-local-add-on), you can store your data exclusively in a specific country/region.


## Region availability

Azure AD B2C service is available worldwide via the Azure public cloud. You can see availability of this service in both Azure's [Products Available By Region](https://azure.microsoft.com/regions/services/) page and the [Active Directory B2C pricing calculator](https://azure.microsoft.com/pricing/details/active-directory-b2c/). Also, Azure AD B2C service is highly available. Learn more about [Service Level Agreement (SLA) for Azure Active Directory B2C](https://azure.microsoft.com/support/legal/sla/active-directory-b2c/v1_1).

## Data residency

Azure AD B2C stores customer data in the United States, Europe, the Asia Pacific region, Japan or Australia.

Data residency is determined by the location you select when you [create an Azure AD B2C tenant](tutorial-create-tenant.md):

![Screenshot of a Create Tenant form, choosing country or region.](./media/data-residency/data-residency-b2c-tenant.png)

Data resides in the **United States** for the following locations:

> United States (US), Canada (CA), Costa Rica (CR), Dominican Republic (DO), El Salvador (SV), Guatemala (GT), Mexico (MX), Panama (PA), Puerto Rico (PR) and Trinidad & Tobago (TT)

Data resides in **Europe** for the following locations:

> Algeria (DZ), Austria (AT), Azerbaijan (AZ), Bahrain (BH), Belarus (BY), Belgium (BE), Bulgaria (BG), Croatia (HR), Cyprus (CY), Czech Republic (CZ), Denmark (DK), Egypt (EG), Estonia (EE), Finland (Fl), France (FR), Germany (DE), Greece (GR), Hungary (HU), Iceland (IS), Ireland (IE), Israel (IL), Italy (IT), Jordan (JO), Kazakhstan (KZ), Kenya (KE), Kuwait (KW), Latvia (LV), Lebanon (LB), Liechtenstein (LI), Lithuania (LT), Luxembourg (LU), North Macedonia (ML), Malta (MT), Montenegro (ME), Morocco (MA), Netherlands (NL), Nigeria (NG), Norway (NO), Oman (OM), Pakistan (PK), Poland (PL), Portugal (PT), Qatar (QA), Romania (RO), Russia (RU), Saudi Arabia (SA), Serbia (RS), Slovakia (SK), Slovenia (ST), South Africa (ZA), Spain (ES), Sweden (SE), Switzerland (CH), Tunisia (TN), Türkiye (TR), Ukraine (UA), United Arab Emirates (AE) and United Kingdom (GB)

Data resides in **Asia Pacific** for the following locations:

> Afghanistan (AF), Hong Kong SAR (HK), India (IN), Indonesia (ID), Japan (JP), Korea (KR), Malaysia (MY), Philippines (PH), Singapore (SG), Sri Lanka (LK), Taiwan (TW), and Thailand (TH)

Data resides in **Australia** for the following locations:

> Australia (AU) and New Zealand (NZ)

The following locations are in the process of being added to the list. For now, you can still use Azure AD B2C by picking any of the locations previously listed.

> Argentina, Brazil, Chile, Colombia, Ecuador, Iraq, Paraguay, Peru, Uruguay, and Venezuela

To find the exact location where your data is located per country/region, refer to [where Microsoft Entra data is located](https://aka.ms/aaddatamap)service.   


### Go-Local add-on

*Go-Local* refers to Microsoft’s commitment to allow some customers to configure some services to store their data at rest in the Geo of the customer’s choice, typically a country/region. Go-Local is as way of fulfilling corporate policies and compliance requirements. You choose the country/region where you want to store your data when you [create your Azure AD B2C](tutorial-create-tenant.md).  

The Go-Local add-on is a paid add-on, but it's optional. If you choose to use it, you'll incur an extra charge in addition to your Azure AD B2C **Premium P1 or P2** licenses. See more information in [Billing model](billing.md). 

At the moment, the following countries/regions have the local data residence option:

- Japan 

- Australia 

#### What do I need to do? 

|Tenant status  | What to do  |
|-------------|---------|
| I've an existing tenant | You need to opt in to start using Go-Local add-on by using the steps in [Activate Go-Local ad-on](tutorial-create-tenant.md#activate-azure-ad-b2c-go-local-add-on). |
| I'm creating a new tenant | You enable Go-Local add-on when you create your new Azure AD B2C tenant. Learn how to [create your Azure AD B2C](tutorial-create-tenant.md) tenant.|

## EU Data Boundary

> [!IMPORTANT]
> For comprehensive details about Microsoft's EU Data Boundary commitment, see [Microsoft's EU Data Boundary documentation](/privacy/eudb/eu-data-boundary-learn).


## Remote profile solution

With Azure AD B2C [custom policies](custom-policy-overview.md), you can integrate with [RESTful API services](api-connectors-overview.md), which allow you to store and read user profiles from a remote database (such as a marketing database, CRM system, or any line-of-business application).  
- During the sign-up and profile editing flows, Azure AD B2C calls a custom REST API to persist the user profile to the remote data source. The user's credentials are stored in Azure AD B2C directory. 
- Upon sign in, after credentials validation with a local or social account, Azure AD B2C invokes the REST API, which sends the user's unique identifier as a user primary key (email address or user objectId). The REST API reads the data from the remote database and returns the user profile.  

After sign-up, profile editing, or sign-in action is complete, Azure AD B2C includes the user profile in the access token that is returned to the application. For more information, see the [Azure AD B2C Remote profile sample solution](https://github.com/azure-ad-b2c/samples/tree/master/policies/remote-profile) in GitHub.

## Next steps

- [Create an Azure AD B2C tenant](tutorial-create-tenant.md).
