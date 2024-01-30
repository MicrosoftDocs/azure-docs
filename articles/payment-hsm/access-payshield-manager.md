---
title: Use your browser to access the payShield manager for your Azure Payment HSM
description: Use your browser to access the payShield manager for your Azure Payment HSM
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 01/31/2024
---

# Tutorial: Use your browser to access the payShield manager for your payment HSM

After you have [Created an Azure Payment HSM](create-payment-hsm.md), you can connect to its payShield manager through your browser.

## Sample deployment scenarios

To connect to payShield manager, you will need to have an on-prem standard PC with a supported web-browser, together with the USB connected payShield Manager Reader and payShield Manager smart cards. Users connect to the payShield 10K via HTTP(s) using a configured management NIC IP addres.

You will need minimum 5 smart cards (3 cards for a CTA set, 2 cards function as Left Key Card and Right Key Card) and one reader.  Please see Thales's payShield 10K Installation and User Guide for the detail instructions.

:::image type="content" source="./media/access-payshield-sample-deployment-1.png" lightbox="./media/access-payshield-sample-deployment-1.png" alt-text="A sample deployment, allowing you to access the payShield manager for your payment HSM.":::

Placeholder text

:::image type="content" source="./media/access-payshield-sample-deployment-2.png" lightbox="./media/access-payshield-sample-deployment-2.png" alt-text="Another sample deployment, allowing you to access the payShield manager for your payment HSM.":::

To access payShield manager  from your on-prem PC, directly connect to HSMMgmtNic private IP address (10.1.0.4)

:::image type="content" source="./media/access-payshield-browser.png" lightbox="./media/access-payshield-browser.png" alt-text="A screenshot showing a succesful connection to the payShield manager through a browser.":::

## Next steps

Advance to the next article to learn how to remove a commissioned payment HSM through the payShield manager.
> [!div class="nextstepaction"]
> [Remove a commissioned payment HSM](remove-payment-hsm.md)

More resources:
- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- [Create a payment HSM](create-payment-hsm.md)
