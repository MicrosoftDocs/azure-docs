---
title: Cancel a scheduled contact on Azure Orbital Ground Station service 
description: Learn how to cancel a scheduled contact.
author: apoorvanori
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 07/13/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Cancel a scheduled contact

To cancel a scheduled contact, the contact entry must be deleted on the **Contacts** page.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A registered spacecraft. Learn more on how to [register a spacecraft](register-spacecraft.md).
- A contact profile. Learn more on how to [configure a contact profile](contact-profile.md).
- A scheduled contact. Learn more on how to [schedule a contact](schedule-contact.md).

## Sign in to Azure

Sign in to the [Azure portal - Orbital](https://aka.ms/orbital/portal).

## Delete a scheduled contact entry

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select the name of the spacecraft for the scheduled contact.
3. Select **Contacts** from the left menu bar in the spacecraft’s overview page.

   :::image type="content" source="media/orbital-eos-delete-contact.png" alt-text="Select a scheduled contact" lightbox="media/orbital-eos-delete-contact.png":::

4. Select the name of the contact to be deleted
5. Select **Delete** from the top bar of the contact's configuration view

   :::image type="content" source="media/orbital-eos-contact-config-view.png" alt-text="Delete a scheduled contact" lightbox="media/orbital-eos-contact-config-view.png":::

6. The scheduled contact will be canceled once the contact entry is deleted.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Update the spacecraft TLE](update-tle.md)
