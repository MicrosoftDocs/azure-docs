---
title: Define access tokens
description: You can allow external systems to access discovered data and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens to access the Defender for IoT REST API.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/18/2020
ms.topic: article
ms.service: azure
---

# Configure access tokens

You can allow external systems to access discovered data and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens to access the Defender for IoT REST API. The Defender for IoT API Guide is located in the [***Help Center, Technical Reference Guides***](https://cyberx-labs.zendesk.com/hc/en-us/articles/360013335072-CyberX-API-Specification-Guide) section.

**To configure access tokens:**

1. In the left pane, select **System Settings**.

2. In the **General** section select **Access Tokens.**

    :::image type="content" source="media/how-to-define-access-tokens/image296.png" alt-text="Access Tokens":::

3. Select **Generate New Token** from the Access Tokens dialog box.

4. Enter a description regarding the purpose of the new access token and select **NEXT**. A new access token appears.

    :::image type="content" source="media/how-to-define-access-tokens/image297.png" alt-text="select NEXT":::

5. Copy and save the new access token, as you will not be able to see it again.

6. Select **Finish**. The tokens you create appear in the Access Tokens dialog box.

    :::image type="content" source="media/how-to-define-access-tokens/image298.png" alt-text="Finish":::

**Used** indicates the last time an external call with this token was received.

If **N/A** is displayed in the **Used** field for this token, the connection between the sensor and the connected server is not working.