---
title: Microsoft Intune Conditional Access policies for dev boxes
titleSuffix: Microsoft Dev Box
description: Learn how to configure Microsoft Intune conditional access policies to manage access to dev boxes, ensuring your organization's devices remain secure.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2024
ms.topic: how-to

# Customer intent: As a platform engineer, I want to configure conditional access policies in Microsoft Intune so that I can control access to dev boxes.

---

# Configure Conditional Access policies for Microsoft Dev Box

Conditional access is the protection of regulated content in a system by requiring certain criteria to be met before granting access to the
content. Conditional access policies at their simplest are if-then statements. If a user wants to access a resource, then they must
complete an action. Conditional access policies are a powerful tool for being able to keep your organization's devices secure and environments
compliant.

This article provides examples of how organizations can use conditional access policies to manage access to dev boxes. For Microsoft Dev Box,
it's common to configure conditional access policies to restrict who can access dev box, what from which locations they can access their dev
boxes.

-   **Device-based Conditional Access**
    -   Microsoft Intune and Microsoft Entra ID work together to make sure only managed and compliant devices can Dev Box. Policies include Conditional Access based on network access control.
    -   Learn more about [device-based Conditional Access with Intune](/mem/intune/protect/create-conditional-access-intune)

-   **App-based Conditional Access**

    -   Intune and Microsoft Entra ID work together to make sure only dev box users can access managed apps like the developer portal.
    -   Learn more about [app-based Conditional Access with Intune](/mem/intune/protect/app-based-conditional-access-intune).

## Prerequisites

-   [Microsoft Intune licenses](/mem/intune/fundamentals/licenses)
-   [Microsoft Entra ID P1 licenses](/entra/identity/conditional-access/overview#license-requirements)

## Provide access to Dev Box

Your organization might start with conditional access policies that, by default, allow nothing. You can set up a conditional access policy that allows your developers to access their dev boxes by specifying the conditions under which they can connect.

You can configure conditional access policies through Microsoft Intune, or through Microsoft Entra ID. Each path brings you to a configuration pane, an example of which is shown in the following screenshot:

:::image type="content" source="media/how-to-configure-intune-conditional-access-policies/conditional-access-policy.png" alt-text="Screenshot showing the options for creating anew conditional access policy.":::

## Scenario 1: Allow access to dev boxes from trusted networks

You want to allow dev box access, but only from specified networks, like your office or a trusted vendor's location.

### Define a location

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

2. Browse to **Protection** > **Conditional Access** > **Named locations**.

3. Choose the type of location to create.

    -   **Countries location** or **IP ranges location**.

4. Give your location a name.

5. Provide the **IP ranges** or select the **Countries/Regions** for the location you're specifying.

    -   If you select IP ranges, you can optionally **Mark as trusted > location**.

    -   If you choose Countries/Regions, you can optionally choose to include unknown areas.

6. Select **Create**

For more information, see, [What is the location condition in Microsoft Entra Conditional Access](/entra/identity/conditional-access/location-condition).

### Create new policy

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

2. Browse to **Protection** > **Conditional Access** > **Policies**.

3. Select **New policy**.

4. Give your policy a name. Use a meaningful naming convention for conditional access policies.

5. Under **Assignments**, select **Users or workload identities**.

    a. Under **Include**, select **All users**.

    b. Under **Exclude**, select **Users and groups** and choose your organization's emergency access accounts.

6. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**.

7. Under **Network**.

    a. Set **Configure** to **Yes**

    b. Under **Exclude**, select **Selected networks and locations**

    c. Select the location you created for your organization.

    d. Select **Select**.

8. Under **Access controls** > select **Block Access** and select **Select**.

9. Confirm your settings and set **Enable policy** to **Report-only**.

10. Select **Create** to create your policy.

Confirm that your policy works as expected by using Report-only mode. Confirm that the policy is working correctly, and then enable it.

For information on configuring conditional access policy to block access, see [Conditional Access: Block access by location](/entra/identity/conditional-access/howto-conditional-access-policy-location).

## Scenario 2: Allow access to the developer portal

You want to allow developer access to the developer portal only. Developers should access and manage their dev boxes through the developer portal.

### Create a new policy

Follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).

2. Browse to **Protection** > **Conditional Access** > **Policies**.

3. Select **New policy**.

4. Give your policy a name. Use a meaningful naming convention for conditional access policies.

5. Under **Assignments**, select **Users or workload identities**.

    a. Under **Include**, select **Dev Box Users**.

    b. Under **Exclude**, select **Users and groups** and choose your organization's emergency access accounts.

6. Under **Target resources** > **Cloud apps** > **Include**, select **Microsoft Developer Portal**, **Fidalgo dataplane public**, **Windows Azure Service Management API**.

7. Under **Access controls** > select **Allow Access**, and select **Select**.

8. Confirm your settings and set **Enable policy** to **Report-only**.

9. Select **Create** to create to enable your policy.

Confirm that your policy works as expected by using Report-only mode. Confirm that the policy is working correctly, and then enable it.

> [!Caution]
> Misconfiguration of a block policy can lead to organizations being locked out. You can configure [accounts for emergency access](/entra/identity/role-based-access-control/security-emergency-access) to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant to take steps
to recover access.

## Apps required for Dev Box

The following table describes the apps relevant for Microsoft Dev Box. You can customize conditional access policies to suit the needs of your
organization by allowing or blocking these apps.

| App name               | App ID                        | Description                                               |
|------------------------|-------------------------------|-----------------------------------------------------------|
| Windows 365            | 0af06dc6-e4b5-4f28-818e-e78e62d137a5 | Used when Microsoft Remote Desktop is opened, to retrieve the list of resources for the user and when users initiate actions on their dev box like Restart. |
| Azure Virtual Desktop  | 9cdead84-a844-4324-93f2-b2e6bb768d07 | Used to authenticate to the Gateway during the connection and when the client sends diagnostic information to the service. Might also appear as Windows Virtual Desktop. |
| Microsoft Remote Desktop | a4a365df-50f1-4397-bc59-1a1564b8bb9c | Used to authenticate users to the dev box. Only needed when you configure single sign-on in a provisioning policy. |
| Windows Cloud Login    | 270efc09-cd0d-444b-a71f-39af4910ec45 | Used to authenticate users to the dev box. This app replaces the Microsoft Remote Desktop app. Only needed when you configure single sign-on in a provisioning policy. |
| Windows Azure Service Management API | 797f4846-ba00-4fd7-ba43-dac1f8f63013 | Used to query for DevCenter projects where the user can create dev boxes. |
| Fidalgo Dataplane Public | e526e72f-ffae-44a0-8dac-cf14b8bd40e2 | Used to manage dev boxes and other DevCenter resources via the DevCenter REST APIs, Azure CLI, or Dev Portal. |
| Microsoft Developer Portal | 0140a36d-95e1-4df5-918c-ca7ccd1fafc9 | Used to sign into the developer portal web app. |

You can allow apps based on your requirements. For example, you can allow Fidalgo Dataplane Public to allow dev box management by using the DevCenter REST APIs, Azure CLI, or Dev Portal. The following table lists the apps used in common scenarios.

| App                             | Log in to and manage dev boxes in developer portal | Dev box management (create/delete/stop etc.) | Connect through browser | Connect through Remote Desktop |
|---------------------------------|------------------------|----------------------------------------------|-------------------------|--------------------------------|
| Microsoft Developer Portal      | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Fidalgo Dataplane Public     | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Windows Azure Service Management API | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> |
| Windows 365                     | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |
| Azure Virtual Desktop           | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |
| Microsoft Remote Desktop        | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/no.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> | <sub>:::image type="icon" source="./media/how-to-configure-intune-conditional-access-policies/yes.svg" border="false":::</sub> |

For more information on configuring conditional access policies, see: [Conditional Access: Users, groups, and workload identities](/entra/identity/conditional-access/concept-conditional-access-users-groups).

## Related content

- [Users and groups in Conditional Access policy](/entra/identity/conditional-access/concept-conditional-access-users-groups)
- [Cloud apps, actions, and authentication context in Conditional Access policy](/entra/identity/conditional-access/concept-conditional-access-cloud-apps)
- [Network in Conditional Access policy](/entra/identity/conditional-access/concept-assignment-network)
