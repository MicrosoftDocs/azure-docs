---
title: Getting started
description: In general, when using an external API on the CyberX Sensor or Central Manager, you need to generate an access token.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Getting started

In general, when using an external API on the CyberX Sensor or Central Manager, you need to generate an access token. Tokens, however, are not required for Sensor and Central Manager authentication APIs.

**To generate a token**:

1. In the **System Settings** window, select **Access Tokens**.
    :::image type="content" source="media/image3.png" alt-text="Screenshot of System Settings view":::

2. Select **Generate new token**.
    :::image type="content" source="media/image4.png" alt-text="Screenshot of Access Tokens view":::

3. Describe the purpose of the new token and select **Next**.
    :::image type="content" source="media/image5.png" alt-text="Screenshot of Generate new token view":::

4. The access token appears. Copy it as it will not be displayed again.
    :::image type="content" source="media/image6.png" alt-text="Screenshot of New Asset Token view":::

5. Select **Finish**. The tokens you create appear in the Access Tokens dialog box.
    :::image type="content" source="media/image7.png" alt-text="Screenshot of Asset Tokens Dialog view":::

    **Used** indicates the last time an external call with this token was received.

    If **N/A** is displayed in the **Used** field for this token, the connection between the Sensor and the connected server is not working.

6. Add an http header entitled **‘Authorization’** to your request to and set its value to the token you generated.