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

This article describes how to integrate partner network ground stations for customers with partner network contracts.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active contract with the partner network(s) you wish to integrate with Azure Orbital:
   - [KSAT Lite](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/kongsbergsatelliteservicesas1657024593438.ksatlite?exp=ubp8&tab=Overview)
   - [Viasat RTE](https://azuremarketplace.microsoft.com/marketplace/apps/viasatinc1628707641775.viasat-real-time-earth?tab=overview)

## Request authorization of the new spacecraft resource

1. Navigate to the newly created spacecraft resource's overview page.
1. Select **New support request** in the Support + troubleshooting section of the left-hand blade.
1. In the **New support request** page, enter or select this information in the Basics tab:

| **Field** | **Value** |
| --- | --- |
| Summary | Request Authorization for [Spacecraft Name] |
| Issue type |	Select **Technical** |
| Subscription |	Select the subscription in which the spacecraft resource was created |
| Service |	Select **My services** |
| Service type |	Search for and select **Azure Orbital** |
| Problem type |	Select **Spacecraft Management and Setup** |
| Problem subtype |	Select **Spacecraft Registration** |

1. Select the Details tab at the top of the page
1. In the Details tab, enter this information in the Problem details section:

| **Field** | **Value** |
| --- | --- |
| When did the problem start? |	Select the current date & time |
| Description |	List your spacecraft's frequency bands and desired ground stations |
| File upload |	Upload any pertinent licensing material, contract details, or partner POCs, if applicable |

1. Complete the **Advanced diagnostic information** and **Support method** sections of the **Details** tab.
1. Select the **Review + create** tab, or select the **Review + create** button.
1. Select **Create**.

   > [!NOTE]
   > A [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.
 
## Next steps

- [Configure a contact profile](./contact-profile.md)
- [Learn more about the contact profile object](./concepts-contact-profile.md)
- [Overview of the Azure Space Partner Community](./space-partner-program-overview.md)
