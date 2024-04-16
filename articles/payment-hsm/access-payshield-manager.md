---
title: Use your browser to access the payShield manager for your Azure Payment HSM
description: Use your browser to access the payShield manager for your Azure Payment HSM
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom:
ms.date: 01/30/2024
---

# Tutorial: Use a VPN to access the payShield manager for your payment HSM

After you [Create an Azure Payment HSM](create-payment-hsm.md), you can connect to its payShield manager through your browser.

To connect to payShield manager, you need to have an on-premises, standard PC with a supported web-browser, together with the USB connected payShield Manager Reader and payShield Manager smart cards. Users connect to the payShield 10K via HTTP(s) using a configured management NIC IP address.

You need a minimum of five smart cards (three cards for a CTA set, a Left Key Card and a Right Key Card) and one reader.  See Thales's payShield 10K Installation and User Guide for the detailed instructions.

## Sample deployment scenarios

Here are two sample scenarios for connecting to payShield manager for your payment HSM.

Sample deployment 1:

:::image type="content" source="./media/access-payshield-sample-deployment-1.png" lightbox="./media/access-payshield-sample-deployment-1.png" alt-text="An architecture diagram of a sample deployment, allowing you to access the payShield manager for your payment HSM.":::

Sample deployment 2:

:::image type="content" source="./media/access-payshield-sample-deployment-2.png" lightbox="./media/access-payshield-sample-deployment-2.png" alt-text="An architecture diagram of an alternative, sample deployment, allowing you to access the payShield manager for your payment HSM.":::

To access payShield manager  from your on-premises PC, directly connect to HSMMgmtNic private IP address (10.1.0.4)

:::image type="content" source="./media/access-payshield-browser.png" lightbox="./media/access-payshield-browser.png" alt-text="A screenshot showing a successful connection to the payShield manager through a browser.":::

## Next steps

When you can access payShield Manager, proceed to the steps for HSM commissioning, HSM configuration, and loading LMKs:

1. Install the smart card reader driver.
1. Install the Thales browser extension and local application component.
1. Commission your payShield.
1. Do the initial configuration steps.
1. Generate and install LMKs.
1. Test the API.

Please follow Thales’s payShield 10K Installation and User Guide for the detailed instructions, and contact Thales support if there are any issues.

Microsoft maintains a base firmware across the fleet, you can check the base firmware version from the HSM allocated, or check the [support guide](support-guide.md). You must upgrade the firmware based on your requirements.

More resources:
- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- [Create a payment HSM](create-payment-hsm.md)
