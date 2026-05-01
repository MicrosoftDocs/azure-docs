---
title: Create and debug Azure API Management policies in VS Code
description: Learn how to create, understand, and debug Azure API Management Policies with Copilot assistance using the Azure API Management Visual Studio Code extension.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 04/23/2026
ms.update-cycle: 180-days
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom: sfi-image-nochange
#customer intent: As an API developer who uses Azure API Management to make my APIs available, I need to understand how to create and use policies by using Visual Studio Code.
---

# Create, understand, and debug Azure API Management policies in Visual Studio Code

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article explains how to use the [Azure API Management Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement) to create, understand, and debug API Management policies. The extension integrates with [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction) to help draft and explain policies.

An Azure API Management [policy](api-management-howto-policies.md) is a sequence of statements that address cross-cutting concerns applied to API requests or responses. These concerns include authentication, authorization, throttling, caching, and transformation.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/).

- The latest version of [Azure API Management Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement).

- The following extensions are needed for the specified scenarios:

  - [GitHub Copilot for Azure extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) to create and explain policies
  - [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for policy debugging

- An API Management instance. If you need to create one, see [Create a new Azure API Management instance](vscode-create-service-instance.md).

- Import an API to your API Management instance. See [Use the API Management Extension for Visual Studio Code to import and manage APIs](visual-studio-code-tutorial.md).

## Restrictions and limitations

- Policy debugging is currently supported only in the API Management Developer tier.

- Policy debugging uses the built-in (service-level) all-access subscription, which has the display name *Built-in all-access subscription*. You must be a service owner to use this subscription.
 
## Create a policy using GitHub Copilot for Azure

The Azure API Management extension integrates with GitHub Copilot for Azure to help you create a draft of a policy. With AI assistance, create and edit policies in a user-friendly way.

To create a policy:

1. Open the API Management extension in Visual Studio Code.
1. Select the API Management instance you want to work with.
1. Select the policy scope that you want to work with.

    - To create a policy that applies to all APIs in the instance, select **Global Policy**.
    - To create a policy that applies to a specific API, under **APIs**, select the API, and then select **Policy**.
    - To create a policy that applies to a specific API operation, select the operation, and then select **Policy**.

1. Open Chat.
1. In the Chat window, enter a prompt in natural language to create a policy. Examples:

    ```copilot-prompt
    @azure I want to limit requests to 100 calls per minute
    ```

    ```copilot-prompt
    @azure Create a policy that sets the backend URL to https://mybackend.contoso.com and adds a custom header to the request
    ```

   Copilot generates a policy draft in the Chat window. You can refine the prompt if you want Copilot to change the output.

1. When you're ready, select the **Copy** button to copy the policy to the clipboard, or select **Apply in Editor** to insert the policy in the editor window. If you're satisfied with the change in the policy XML, select **Keep**.

> [!TIP]
> Check in the **Problems** window for explanation of any issues in the policy XML.

## Explain a policy using GitHub Copilot for Azure

Copilot can help explain an existing policy in your API Management instance.

To receive an explanation:

1. Open the API Management extension in Visual Studio Code.
1. Select the API Management instance you want to work with.
1. Select the policy scope that you want to work with.

    - To explain a policy that applies to all APIs in the instance, select **Global Policy**.
    - To explain a policy that applies to a specific API, under **APIs**, select the API, and then select **Policy**.
    - To explain a policy that applies to a specific API operation, select the operation, and then select **Policy**.

1. In the policy editor window that appears, right-click, then select **Explain**.
1. An overview and explanation of policies in the policy XML document are generated in the Chat window.

## Debug policies using the VS Code extension

The Azure API Management extension for Visual Studio Code provides a debugging experience that allows you to step through the policy pipeline or set a breakpoint when you send a request to the gateway.

### Initiate a debugging session

1. Open the API Management extension in Visual Studio Code.
1. Select the API Management instance to debug.
1. Select the API and operation to debug.
1. Right-click on the operation and select **Start Policy Debugging**.

The extension starts to establish a debugging session with the API Management gateway. Check the progress in the **Debug Console** window.

:::image type="content" source="media/api-management-debug-policies/initiate-debugging-session.png" alt-text="Screenshot if initiating a policy debugging session in Visual Studio Code.":::

> [!NOTE]
> Starting a debugging session also enables request tracing during the session, to help you diagnose and solve issues.

### Send a test request

When the debugging session is established, the REST Client extension opens a new editor that allows you to create and send a test HTTP request to the gateway.

The **Ocp-Apim-Debug** header is added automatically to the request. This header is required and the value must be set to the service-level, all-access subscription key to trigger the debugging functionality in the API Management gateway.

Modify the HTTP request in the editor according to your test scenario. Then select **Send Request** to send the test request to the API Management gateway.

:::image type="content" source="media/api-management-debug-policies/rest-client.png" alt-text="Screenshot of sending a test request in Visual Studio Code.":::

### Debug policies

After the test HTTP request is sent, the extension opens the debugging window, which shows the effective policies of this operation and stops at the first effective policy.

:::image type="content" source="media/api-management-debug-policies/main-window.png" alt-text="Screenshot of the debugging window in Visual Studio Code." lightbox="media/api-management-debug-policies/main-window.png":::

To follow the policy pipeline, you can single-step through individual policies or set a breakpoint at a policy and step directly to that policy.

- In the **Variables** panel, inspect values of system-created and user-created variables.
- In the **Breakpoints** panel, view the list of all breakpoints that you set.
- In the **Call Stack** panel, view the current effective policy scope.

If there's an error during policy execution, you see the details of the error at the policy where it happened.

To exit the debugging session, select **Stop**.

:::image type="content" source="media/api-management-debug-policies/exception.png" alt-text="Screenshot of a policy exception in Visual Studio Code." lightbox="media/api-management-debug-policies/exception.png":::

> [!TIP]
> To review the request trace, select the value of the `Ocp-Apim-Trace-Location` header that is provided in the HTTP response.

## Related content

- Learn more about the [API Management extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement)
- Report issues in the [GitHub repository](https://github.com/Microsoft/vscode-apimanagement)
