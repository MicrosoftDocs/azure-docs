---
title: Author API Management policies using Microsoft Copilot for Azure (preview)
description: Learn about how Microsoft Copilot for Azure (preview) can generate Azure API Management policies based on your requirements.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Author API Management policies using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can author [Azure API Management policies](/azure/api-management/api-management-howto-policies) based on your requirements. This lets you create policies quickly, even if you're not sure what code you need.

To get help authoring API Management policies, start from the **Design** tab of an API you previously imported to your API Management instance. Be sure to use the [code editor view](/azure/api-management/set-edit-policies?tabs=editor#configure-policy-in-the-portal). You can then ask Microsoft Copilot for Azure (preview) to generate policy definitions for you, then copy the results right into the editor, making any desired changes. This can be especially helpful when creating complex policies with many requirements.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to get help authoring API Management policies. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Generate a policy to configure rate limiting with 5 requests per second"
- "Generate a policy to remove a `X-AspNet-Version` header from the response"
- "Explain <selected-policy-in-the-editor> to me"

## Examples

When creating an API Management policy, you can say "Generate a policy to configure rate limiting with 5 requests per second." Microsoft Copilot for Azure (preview) provides an example and explains how you might want to modify the provided based on your requirements.

:::image type="content" source="media/author-api-management-policies/api-management-policy-rate-limiting.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) generating a policy to configure rate limiting.":::

In this example, a policy is generated based on the prompt "Generate a policy to remove a `X-AspNet-Version` header from the response."

:::image type="content" source="media/author-api-management-policies/api-management-policy-remove-header.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) generating a policy to remove a header.":::

When you have questions about a certain policy element, you can get more information by copying a section of the policy and asking Microsoft Copilot for Azure (preview) to explain more. Microsoft Copilot for Azure (preview) understands the context of your question in relation to an API Management policy and explains how the code works, adding details when helpful about best practices and behaviors.  You can ask about one element (such as in this example asking about `<on-error> <base /> </on-error>`) or about a larger, more complex section of your policy.

:::image type="content" source="media/author-api-management-policies/api-management-policy-explain.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing information about a specific API Management policy.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure API Management](/azure/api-management/api-management-key-concepts).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
