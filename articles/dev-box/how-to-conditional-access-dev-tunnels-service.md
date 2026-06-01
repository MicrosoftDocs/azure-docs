---
title: Secure Dev Tunnel Access with Conditional Policies
description: Learn how to configure conditional access policies for the Dev Tunnels service in Microsoft Entra ID to secure remote development environments and restrict access based on device management and IP ranges.
author: RoseHJM
contributors:
ms.topic: how-to
ms.date: 10/31/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ai-usage: ai-assisted
ms.custom: peer-review-program
---

# Secure Dev Tunnel access with conditional policies

Dev Tunnels offer a streamlined way to connect to your Dev Box directly from Visual Studio Code, eliminating the need to use separate applications like Windows App or a browser. This method provides a more immediate and integrated development experience. Unlike traditional connection methods, Dev Tunnels simplify access and enhance productivity. 

Many large enterprises that use Dev Box have strict security and compliance policies, and their code is valuable to their business. This article explains how to configure conditional access policies to secure Dev Tunnel usage in your environment.

## Prerequisites

Before proceeding, ensure you have:

- Access to a Dev Box environment.
- Visual Studio Code installed.
- PowerShell 7.x or later (any version in the 7.x series is acceptable).
- Appropriate permissions to configure conditional access policies in Microsoft Entra ID.

## Benefits of conditional access for Dev Tunnels

Conditional access policies for the Dev Tunnels service:

- Let Dev Tunnels connect from managed devices, but deny connections from unmanaged devices.
- Let Dev Tunnels connect from specific IP ranges, but deny connections from other IP ranges.
- Support other regular conditional access configurations.
- Apply to both the Visual Studio Code application and VS Code web.

> [!NOTE]
> This article focuses on setting up conditional access policies specifically for Dev Tunnels. If you're configuring policies for Dev Box more broadly, see [Configure conditional access for Dev Box](how-to-configure-intune-conditional-access-policies.md).

## Configure conditional access policies

To secure Dev Tunnels with conditional access, you need to target the Dev Tunnels service using custom security attributes. This section guides you through the process of configuring these attributes and creating the appropriate conditional access policy.

## Enable the Dev Tunnels service for the conditional access picker

The Microsoft Entra ID team is working on removing the need to onboard apps for them to appear in the app picker, with delivery expected in May. Therefore, we aren't onboarding Dev tunnel service to the conditional access picker. Instead, target the Dev tunnels service in a conditional access policy using [Custom Security Attributes](/entra/identity/conditional-access/concept-filter-for-applications).

1. Follow [Add or deactivate custom security attribute definitions in Microsoft Entra ID](/entra/fundamentals/custom-security-attributes-add?tabs=ms-powershell) to add the following Attribute set and New attributes.

   :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-custom-attributes.png" alt-text="Screenshot of the custom security attribute definition process in Microsoft Entra ID." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-custom-attributes.png":::

   :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-attribute.png" alt-text="Screenshot of the new attribute creation in Microsoft Entra ID." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-attribute.png":::

1. Follow [Create a conditional access policy](/entra/identity/conditional-access/concept-filter-for-applications#create-a-conditional-access-policy) to create a conditional access policy.

   :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-conditional-access-policy.png" alt-text="Screenshot of the conditional access policy creation process for Dev tunnels service." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-conditional-access-policy.png":::

1. Follow [Configure custom attributes](/entra/identity/conditional-access/concept-filter-for-applications#configure-custom-attributes) to configure the custom attribute for the Dev tunnels service.

   :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-security-attributes.png" alt-text="Screenshot of configuring custom attributes for the Dev tunnels service in Microsoft Entra ID." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-security-attributes.png":::

## Testing

1. Turn off the BlockDevTunnelCA policy.

1. Create a Dev Box in the test tenant and run the following commands inside it. You can create and connect to Dev Tunnels externally.

   ```powershell
   code tunnel user login --provider microsoft
   code tunnel
   ```

1. Turn on the BlockDevTunnelCA policy.

   1. You can't establish new connections to the existing Dev Tunnels. If a connection is already established, test with an alternate browser.

   1. Any new attempts to execute the commands in step 2 fail. Both errors are:

      :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-no-access.png" alt-text="Screenshot of error message when Dev tunnels connection is blocked by conditional access policy." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-no-access.png":::

1. The Microsoft Entra ID sign-in logs show these entries.

   :::image type="content" source="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-activity-logs.png" alt-text="Screenshot of Microsoft Entra ID sign-in logs showing entries related to Dev tunnels conditional access policy." lightbox="media/how-to-conditional-access-dev-tunnels-service/dev-tunnels-activity-logs.png":::

## Limitations

With Dev Tunnels, the following limitations apply:

- **Policy assignment restrictions**: You can't configure conditional access policies for the Dev Box service to manage Dev Tunnels for Dev Box users. Instead, configure policies at the Dev Tunnels service level as described in this article.
- **Self-created Dev Tunnels**: You can't limit Dev Tunnels that aren't managed by the Dev Box service. In the context of Dev Boxes, if the Dev Tunnels GPO is configured **to allow only selected Microsoft Entra tenant IDs**, conditional access policies can also restrict self-created Dev Tunnels.
- **IP range enforcement**: Dev Tunnels might not support granular IP restrictions. Consider using network-level controls or consult your security team for alternative enforcement strategies.

## Related content
- [Open a dev box in VS Code](how-to-set-up-dev-tunnels.md)
- [Conditional Access policies](/entra/identity/conditional-access/concept-conditional-access-policies)