---
title: Intune Conditional Access Policies for Dev Boxes
titleSuffix: Microsoft Dev Box
description: Learn how to configure Intune Conditional Access policies to manage access to dev boxes to ensure that your organization's devices remain secure.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/29/2025
ms.topic: how-to

# Customer intent: As a platform engineer, I want to configure Conditional Access policies in Intune so that I can control access to dev boxes.

---

# Configure Conditional Access policies for Dev Box
This article shows how organizations use Conditional Access policies to manage access to dev boxes. 

Microsoft Dev Box uses Microsoft Intune for device management, providing centralized control over device configuration, compliance policies, and app deployment to ensure secure access to corporate resources. To ensure access to resources, Dev Box automatically registers new dev boxes in Intune when you create them. 

To enhance security, you can apply Conditional Access policies to control who can access Dev Boxes and from which locations.

Conditional Access is the protection of regulated content in a system by requiring certain criteria to be met before granting access to the content. Conditional Access policies at their simplest are if-then statements. If a user wants to access a resource, they must complete an action. Conditional Access policies are powerful tools to help keep your organization's devices secure and your environments compliant.

-   **Device-based Conditional Access**:

    - Intune and Microsoft Entra ID work together to make sure that only managed and compliant devices can use Dev Box. Policies include Conditional Access based on network access control.
    - Learn more about [device-based Conditional Access with Intune](/mem/intune/protect/create-conditional-access-intune).

-   **App-based Conditional Access**:

    - Intune and Microsoft Entra ID work together to make sure that only dev box users can access managed apps like the Microsoft developer portal.
    - Learn more about [app-based Conditional Access with Intune](/mem/intune/protect/app-based-conditional-access-intune).

## Prerequisites

- [Intune licenses](/mem/intune/fundamentals/licenses)
- [Microsoft Entra ID P1 licenses](/entra/identity/conditional-access/overview#license-requirements)

## Provide access to Dev Box

Your organization might start with Conditional Access policies that, by default, allow nothing. You can set up a Conditional Access policy that allows your developers to access their dev boxes by specifying the conditions under which they can connect.

You can configure Conditional Access policies through Intune or Microsoft Entra ID. Each path brings you to a configuration pane.

:::image type="content" source="media/how-to-configure-intune-conditional-access-policies/conditional-access-policy.png" alt-text="Screenshot that shows the options for creating a new Conditional Access policy.":::

## Scenario 1: Allow access to dev boxes from trusted networks

You want to allow dev box access, but only from specified networks, like your office or a trusted vendor's location.

### Define a location

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

1. Browse to **Protection** > **Conditional Access** > **Named locations**.

1. Choose the type of location to create:

    - **Countries location**
    - **IP ranges location**

1. Give your location a name.

1. Provide the IP ranges or select the country/region for the location that you're specifying.

    - If you select **IP ranges**, you can optionally select **Mark as trusted** > **location**.
    - If you select **Countries/Regions**, you can optionally choose to include unknown areas.

1. Select **Create**.

For more information, see [What is the location condition in Microsoft Entra Conditional Access?](/entra/identity/conditional-access/location-condition).

### Create a new policy

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

1. Browse to **Protection** > **Conditional Access** > **Policies**.

1. Select **New policy**.

1. Give your policy a name. Use a meaningful naming convention for Conditional Access policies.

1. Under **Assignments**, select **Users or workload identities**:

    1. Under **Include**, select **All users**.
    1. Under **Exclude**, select **Users and groups**. Choose your organization's emergency access accounts.

1. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**.

1. Under **Network**:

    1. Set **Configure** to **Yes**.
    1. Under **Exclude**, select **Selected networks and locations**.
    1. Select the location that you created for your organization.
    1. Choose **Select**.

1. Under **Access controls**, select **Block Access** > **Select**.

1. Confirm your settings, and set **Enable policy** to **Report-only**.

1. Select **Create** to create your policy.

Confirm that your policy works as expected by using Report-only mode. Confirm that the policy is working correctly, and then enable it.

For information on how to configure a Conditional Access policy to block access, see [Conditional Access: Block access by location](/entra/identity/conditional-access/howto-conditional-access-policy-location).

## Scenario 2: Allow access to the developer portal

You want to allow developer access to the developer portal only. Developers should access and manage their dev boxes through the developer portal.

### Create a new policy

> [!NOTE]
> The application Microsoft Developer Portal was renamed from Fidalgo Dev Portal Public, so it's possible for certain tenants to still see the previous name. Even though they see a different name, they still have the same application ID, so it's the correct app. If you want to try fixing this naming problem, delete and readd the tenant's service principal for the app.

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

1. Browse to **Protection** > **Conditional Access** > **Policies**.

1. Select **New policy**.

1. Give your policy a name. Use a meaningful naming convention for Conditional Access policies.

1. Under **Assignments**, select **Users or workload identities**.

    1. Under **Include**, select **Dev Box Users**.
    1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access accounts.

1. Under **Target resources** > **Cloud apps** > **Include**, select **Microsoft Developer Portal** > **Fidalgo dataplane public** > **Windows Azure Service Management API**.

1. Under **Access controls**, select **Allow Access** and choose **Select**.

1. Confirm your settings, and set **Enable policy** to **Report-only**.

1. Select **Create** to create your policy.

Confirm that your policy works as expected by using Report-only mode. Confirm that the policy is working correctly, and then enable it.

> [!CAUTION]
> Misconfiguration of a block policy can lead to organizations being locked out. You can configure [accounts for emergency access](/entra/identity/role-based-access-control/security-emergency-access) to prevent tenant-wide account lockout. In the unlikely scenario that all administrators are locked out of your tenant, you can use your emergency-access administrative account to sign in to the tenant to take steps to recover access.

## Apps that are required for Dev Box

The following table describes the apps that are relevant for Dev Box. You can customize Conditional Access policies to suit the needs of your organization by allowing or blocking these apps.

| App name               | App ID                        | Description                                               |
|------------------------|-------------------------------|-----------------------------------------------------------|
| Windows 365            | 0af06dc6-e4b5-4f28-818e-e78e62d137a5 | Used when Microsoft Remote Desktop is opened to retrieve the list of resources for the user, and when users initiate actions on their dev box, like Restart. |
| Azure Virtual Desktop  | 9cdead84-a844-4324-93f2-b2e6bb768d07 | Used to authenticate to the gateway during the connection and when the client sends diagnostic information to the service. Might also appear as Windows Virtual Desktop. |
| Microsoft Remote Desktop | a4a365df-50f1-4397-bc59-1a1564b8bb9c | Used to authenticate users to the dev box. Required when you configure single sign-on in a provisioning policy. |
| Windows Cloud sign-in    | 270efc09-cd0d-444b-a71f-39af4910ec45 | Used to authenticate users to the dev box. This app replaces the Microsoft Remote Desktop app. Required when you configure single sign-on in a provisioning policy. |
| Windows Azure Service Management API | 797f4846-ba00-4fd7-ba43-dac1f8f63013 | Used to query for DevCenter projects where the user can create dev boxes. |
| Fidalgo Dataplane Public | e526e72f-ffae-44a0-8dac-cf14b8bd40e2 | Used to manage dev boxes and other DevCenter resources via the DevCenter REST APIs, the Azure CLI, or the Microsoft developer portal. |
| Microsoft developer portal | 0140a36d-95e1-4df5-918c-ca7ccd1fafc9 | Used to sign in to the Microsoft developer portal web app. |

You can allow apps based on your requirements. For example, you can allow Fidalgo Dataplane Public to allow dev box management by using the DevCenter REST APIs, the Azure CLI, or the Microsoft developer portal. The following table lists the apps that are used in common scenarios.

| App                             | Sign in to and manage dev boxes in developer portal | Dev box management (create/delete/stop etc.) | Connect through browser | Connect through Remote Desktop |
|---------------------------------|------------------------|----------------------------------------------|-------------------------|--------------------------------|
| Microsoft developer portal      | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Fidalgo Dataplane Public     | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Windows Azure Service Management API | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Windows 365                     | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |
| Azure Virtual Desktop           | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |
| Microsoft Remote Desktop        | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |

For more information on how to configure Conditional Access policies, see [Conditional Access: Users, groups, and workload identities](/entra/identity/conditional-access/concept-conditional-access-users-groups).

## Related content

- [Users and groups in Conditional Access policy](/entra/identity/conditional-access/concept-conditional-access-users-groups)
- [Cloud apps, actions, and authentication context in Conditional Access policy](/entra/identity/conditional-access/concept-conditional-access-cloud-apps)
- [Network in Conditional Access policy](/entra/identity/conditional-access/concept-assignment-network)
