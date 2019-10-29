---
author: miaojiang
ms.service: api-management
ms.topic: include
ms.date: 11/01/2019
ms.author: apimpm
---
## Generate a token for the gateway

A token is required for the self-hosted gateway to securely communicate with the API Management instance. To generate a token:

1. Go to your Azure API Management instance in the Azure portal.
1. Select the **Gateway** tab under **Settings**.
1. Select the gateway that was just provisioned.
1. Select **Deployment**.
1. Enter the **expriy** date and time of the token.
1. Select the **Secret key** for generating the token.
1. A token should be automatically generated. You could click **Generate** to create a new token.
1. Make a note of the **Token**, for use in a subsequent step.