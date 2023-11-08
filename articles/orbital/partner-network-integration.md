---
title: Integrate partner network ground stations into your Azure Orbital Ground Station solution
description: Leverage partner network ground station locations through Azure Orbital.
author: apoorvanori
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 01/05/2023
ms.author: apoorvanori
---

# Integrate partner network ground stations into your Azure Orbital Ground Station solution

This article describes how to integrate partner network ground stations for customers with partner network contracts. In order to use Azure Orbital Ground Station to make contacts with partner network ground station sites, your spacecraft must be authorized in the portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Contributor permissions](/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles) at the subscription level.
- A [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.
- A spacecraft license is required for private spacecraft.
- An active contract with the partner network(s) you wish to integrate with Azure Orbital Ground Station:
   - [KSAT Lite](https://azuremarketplace.microsoft.com/marketplace/apps/kongsbergsatelliteservicesas1657024593438.ksatlite?exp=ubp8&tab=Overview)
   - [Viasat RTE](https://azuremarketplace.microsoft.com/marketplace/apps/viasatinc1628707641775.viasat-real-time-earth?tab=overview)
- A ground station license for each of the partner network sites you wish to contact is required for private spacecraft.
- A registered spacecraft object. Learn more on how to [register a spacecraft](register-spacecraft.md).

## Obtain licencses

Obtain the proper **spacecraft license(s)** for a private spacecraft. Additionally, work with the partner network to obtain a **ground station license** for each partner network site you intend to use with your spacecraft.

 > [!NOTE]
 > Public spacecraft do not require licensing for authorization. The Azure Orbital Ground Station service supports several public satellites including Aqua, Suomi NPP, JPSS-1/NOAA-20, and Terra.

## Create spacecraft resource

Create a registered spacecraft object on the Orbital portal by following the [spacecraft registration](register-spacecraft.md) instructions.

## Request authorization of the new spacecraft resource

1. Navigate to the newly created spacecraft resource's overview page.
2. Select **New support request** in the Support + troubleshooting section of the left-hand blade.
3. In the **New support request** page, enter or select this information in the Basics tab:

| **Field** | **Value** |
| --- | --- |
| Summary | Request Authorization for [Spacecraft Name] |
| Issue type |	Select **Technical** |
| Subscription |	Select the subscription in which the spacecraft resource was created |
| Service |	Select **My services** |
| Service type |	Search for and select **Azure Orbital** |
| Problem type |	Select **Spacecraft Management and Setup** |
| Problem subtype |	Select **Spacecraft Registration** |

4. Select the Details tab at the top of the page
5. In the Details tab, enter this information in the Problem details section:

| **Field** | **Value** |
| --- | --- |
| When did the problem start? |	Select the current date & time |
| Description |	List your spacecraft's **frequency bands** and **desired partner network ground stations**. |
| File upload |	Upload all pertinent **spacecraft licensing material**, **ground station licensing material**, **partner network contract details**, or **partner POCs**, if applicable. |

6. Complete the **Advanced diagnostic information** and **Support method** sections of the **Details** tab.
7. Select the **Review + create** tab, or select the **Review + create** button.
8. Select **Create**.

   > [!NOTE]
   > A [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.

After the authorization request is generated, our regulatory team will investigate the request and validate the material. The partner network must inform Microsoft of the ground station license approval(s) to complete the spacecraft authorization. Once verified, we will enable your spacecraft to communicate with the partner network ground stations outlined in the request.

## Confirm spacecraft is authorized

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the Spacecraft page, select the **newly registered spacecraft**.
3. In the new spacecraft's overview page, check that the **Authorization status** shows **Allowed**.

## Next steps

- [Configure a contact profile](./contact-profile.md)
- [Learn more about the contact profile object](./concepts-contact-profile.md)

