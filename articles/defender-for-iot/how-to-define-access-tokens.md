---
title: Define access tokens
description: You can allow external systems to access discovered data and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens to access the Defender for IoT REST API.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/09/2020
ms.topic: how-to
ms.service: azure
---

# Configure access tokens

You can allow external systems to access discovered data and perform actions with that data using the external REST API, over SSL connections. You can generate access tokens to access the Defender for IoT REST API. 

To configure access tokens:

1. In the left pane, select **System Settings**.

2. In the **General** section select **Access Tokens.**

    :::image type="content" source="media/how-to-define-access-tokens/access-tokens.png" alt-text="The access tokens windows where you can generate your token.":::

3. Select **Generate New Token** from the Access Tokens dialog box.

4. Enter a description regarding the purpose of the new access token and select **NEXT**. A new access token appears.

    :::image type="content" source="media/how-to-define-access-tokens/new-token.png" alt-text="Your new token appears and then select next.":::

5. Copy and save the new access token, as you will not be able to see it again.

6. Select **Finish**. The tokens you create appear in the Access Tokens dialog box.

    :::image type="content" source="media/how-to-define-access-tokens/created-tokens.png" alt-text="View your created access tokens.":::

**Used** indicates the last time an external call with this token was received.

If **N/A** is displayed in the **Used** field for this token, the connection between the sensor and the connected server is not working.
