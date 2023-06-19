---
title: Peering Service customer walkthrough
description: Peering Services customer walkthrough.
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: how-to
ms.date: 06/09/2023
ms.author: jsaraco
ms.custom: template-how-to
---

# Peering Service customer walkthrough

This section explains the steps to optimize your prefixes with an Internet Service Provider (ISP) or Internet Exchange Provider (IXP) who is a Peering Service partner.

The complete list of Peering Service providers can be found here: [Peering Service partners](../peering-service/location-partners.md)

**Prefix Activation**

If you have received a peering service prefix key from your Peering Service provider, then you can activate your prefixes for optimized routing with Peering Service.

Below are the steps to activate the prefix.

1. Look for “Peering Services” resource 

  :::image type="content" source="./media/peering-service-search.png" alt-text="Screenshot on searching for Peering Service on Azure portal." :::
  
  :::image type="content" source="./media/peering-service-list.png" alt-text="Screenshot of a list of existing peering services." :::

2. Create a new Peering Service resource

  :::image type="content" source="./media/create-peering-service.png" alt-text="Screenshot showing how to create a new peering service." :::

3. Choose your provider in the list, and choose the primary and backup interconnect locations. If backup location is set to “none”, the traffic will fail over the internet. 

    The prefix key should be the same one you received from your Peering Service provider. 

  :::image type="content" source="./media/peering-service-properties.png" alt-text="Screenshot of the fields to be filled to create a peering service." :::

  :::image type="content" source="./media/peering-service-deployment.png" alt-text="Screenshot showing the validation of peering service resource before deployment." :::

## FAQs:

**Q.** Will Microsoft re-advertise your prefixes to the Internet?

**A.** No.