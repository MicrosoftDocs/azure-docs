---
title: Setting HTTPOnly or Secure flag for Session Affinity cookie
titleSuffix: Azure Application Gateway
description: Learn how to set HTTPOnly or Secure flag for Session Affinity cookie
services: application-gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 10/22/2024
ms.author: jaysoni 
---

# Setting HTTPOnly or Secure flag for Session Affinity cookie
In this guide you learn to create a Rewrite set for your Application Gateway and configure Secure and HttpOnly [ApplicationGatewayAffinity cookie](configuration-http-settings.md#cookie-based-affinity).


## Prerequisites
* You must have an Azure subscription. You can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An existing Application Gateway resource configured with at least one Listener, Rule, Backend Setting and Backend Pool configuration. If you don't have one, you can create one by following the [QuickStart guide](quick-create-portal.md).

## Creating a Rewrite set

1. Sign in to the Azure portal.
1. Navigate to the required Application Gateway resource.
1. Select Rewrites in the left pane.
1. Select Rewrite set.
1. Under the Name and Association tab
    1. Specify a name for this new rewrite set.
    1. Select the routing rules for which you wish to rewrite the ApplicationGatewayAffinity cookie's flag.
    1. Select Next.
1. Select "Add rewrite rule"
    1. Enter a name for the rewrite rule.
    1. Enter a numeric value for Rule Sequence field.
1. Select "Add condition"
1. Now open the "If" condition box and use the following details.
    1. Type of variable to check - HTTP header
    1. Header type - Response header
    1. Header name - Common header
    1. Common header - Set-Cookie
    1. Case-sensitive - No
    1. Operator - equal (=)
    1. Pattern to match - (.*)
    1. To save these details, select **OK**.
1. Go to the **Then** box to specify action details.
    1. Rewrite type - Response header
    1. Action type - Set
    1. Header name - Common header
    1. Common header - Set-Cookie
    1. Header value - {http_resp_Set-Cookie_1}; HttpOnly; Secure
    1. Select **OK**
1. Select Update to save the rewrite set configurations.


## Next steps
[Visit other configurations of a Backend Setting](configuration-http-settings.md)
