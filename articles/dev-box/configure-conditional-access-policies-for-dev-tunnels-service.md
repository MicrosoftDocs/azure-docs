---
title: Configure Conditional Access Policies for Dev Tunnels Service
description: Learn how to configure conditional access policies for the Dev tunnels service in Microsoft Entra ID to secure remote development environments and restrict access based on device management and IP ranges.
author: RoseHJM
contributors:
ms.topic: concept-article
ms.date: 05/16/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
---

# Background

The Dev Box service gives you an alternative connectivity method on top of Dev tunnels. You can develop remotely while coding locally or keep development going during AVD outages or poor network performance. Many large enterprises using Dev Box have strict security and compliance policies, and their code is valuable to their business. Restricting Dev tunnels with conditional access policies is crucial for these controls.

## Goals

- Let Dev tunnels connect from managed devices, but deny connections from unmanaged devices.

- Let Dev tunnels connect from specific IP ranges, but deny connections from other IP ranges.

- Support other regular CA configurations.

- Conditional access policies apply to both the VSCode application and VSCode web.



## CA Configurations

The conditional access policies work correctly for the Dev tunnels service. Because registering the Dev tunnels service app to a tenant and making it available to the CA picker is unique, this article documents the steps for engineering, PM, and technical writers.

### Register Dev tunnels service to a tenant

According to [Apps & service principals in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals?tabs=browser), a service principal is created in each tenant where the application is used. However, this doesn't apply to the Dev tunnels service. This article doesn't explore the root cause. If you know about app definitions, review the [Dev tunnels service app registration specification](https://msazure.visualstudio.com/One/_git/AAD-FirstPartyApps?path=/Customers/Configs/AppReg/46da2f7e-b5ef-422a-88d4-2a7f9de6a0b2/AppReg.Parameters.Production.json&version=GBmaster&_a=contents).

Therefore, we are using [Microsoft.Graph PowerShell](/powershell/module/microsoft.graph.authentication/connect-mggraph?view=graph-powershell-1.0) to register the app to a tenant.

1. Install PowerShell 7.x

1. Follow [Install the Microsoft Graph PowerShell SDK | Microsoft Learn](/powershell/microsoftgraph/installation?view=graph-powershell-1.0) to install Microsoft.Graph PowerShell

1. Run the following commands

1. Go to "Microsoft Entra ID" -> "Manage" -> "Enterprise applications" to verify if the Dev tunnels service is registered.

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image1.png" alt-text="Screenshot of the Enterprise applications page in Microsoft Entra ID, showing the Dev tunnels service registration.":::

### Enable the Dev tunnels service for the CA picker

The Entra ID team is working on removing the need to onboard apps for them to appear in the app picker, with delivery expected in May. Therefore, we are not onboarding Dev tunnel service to the CA picker. Instead, target the Dev tunnels service in a CA policy using [Custom Security Attributes](/entra/identity/conditional-access/concept-filter-for-applications).

1. Follow [Add or deactivate custom security attribute definitions in Microsoft Entra ID](/entra/fundamentals/custom-security-attributes-add?tabs=ms-powershell) to add the following Attribute set and New attributes.

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image2.png" alt-text="Screenshot of the custom security attribute definition process in Microsoft Entra ID.":::

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image3.png" alt-text="Screenshot of the new attribute creation in Microsoft Entra ID.":::

1. Follow [Create a conditional access policy](/entra/identity/conditional-access/concept-filter-for-applications#create-a-conditional-access-policy) to create a conditional access policy.

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image4.png" alt-text="Screenshot of the conditional access policy creation process for Dev tunnels service.":::

1. Follow [Configure custom attributes](/entra/identity/conditional-access/concept-filter-for-applications#configure-custom-attributes) to configure the custom attribute for the Dev tunnels service.

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image5.png" alt-text="Screenshot of configuring custom attributes for the Dev tunnels service in Microsoft Entra ID.":::

### Testing

1. Turn off the BlockDevTunnelCA

1. Create a DevBox in the test tenant and run the following commands inside it. Dev tunnels can be created and connected externally.

1. Enable the BlockDevTunnelCA.

    1. New connections to the existing Dev tunnels can't be established. Please test with an alternate browser if a connection has already been established.

    1. Any new attempts to execute the commands in step #2 will fail. Both errors are:

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image6.png" alt-text="Screenshot of error message when Dev tunnels connection is blocked by conditional access policy.":::

1. The Entra ID sign-in logs show these entries.

:::image type="content" source="media/configure-conditional-access-policies-for-dev-tunnels-service/image7.png" alt-text="Screenshot of Entra ID sign-in logs showing entries related to Dev tunnels conditional access policy.":::

## Limitations

- Configure conditional access policies for Dev Box service to manage Dev tunnels for Dev Box users.

- Limit Dev tunnels that are not managed by the Dev Box service. In the context of Dev Boxes, if the Dev tunnels GPO is configured **to allow only selected Microsoft Entra tenant IDs**, Conditional Access policies can also restrict self-created Dev tunnels.

## Related content
- [Conditional Access policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policies)