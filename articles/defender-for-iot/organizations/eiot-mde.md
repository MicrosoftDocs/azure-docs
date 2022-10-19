---
title: Enhance device discovery with an Enterprise IoT network sensor - Microsoft Defender for IoT
description: Learn how to start integrating between Microsoft Defender for IoT and Microsoft Defender for Endpoint.
ms.topic: tutorial
ms.date: 10/19/2022
---

# Onboard with Microsoft Defender for IoT

<!--these include files don't work [!INCLUDE [Microsoft 365 Defender rebranding](/microsoft-365/security/includes/microsoft-defender.md)]-->

**Applies to:**

- [Microsoft Defender for Endpoint P2](https://go.microsoft.com/fwlink/?linkid=2154037)
- [Microsoft 365 Defender](https://go.microsoft.com/fwlink/?linkid=2118804)

<!--these include files don't work [!INCLUDE[Prerelease information](/microsoft-365/security/includes/prerelease.md)]-->

> Want to experience Microsoft Defender for Endpoint? [Sign up for a free trial.](https://signup.microsoft.com/create-account/signup?products=7f379fee-c4f9-4278-b0a1-e4c8c2fcdf7e&ru=https://aka.ms/MDEp2OpenTrial?ocid=docs-wdatp-enablesiem-abovefoldlink)

This article describes how to onboard to Microsoft Defender for IoT from Microsoft Defender for Endpoint, providing extra security value in Defender for Endpoint and extending device discovery in Defender for IoT.

Together, Defender for Endpoint and Defender for IoT provide security monitoring for enterprise IoT devices in your network, such as Voice over Internet Protocol (VoIP) devices, printers, and cameras.

For more information, see [Secure Enterprise IoT network resources with Defender for Endpoint and Defender for IoT](concept-eiot.md).

## Prerequisites

To modify settings for your Defender for Endpoint integration, the user must have the following roles:

- **In Azure Active Directory**, [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator) for your Tenant

- **In Azure RBAC**, [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) for the Azure subscription that you'll be using for the integration

## Onboard a Defender for IoT plan

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - Select the Azure subscription from the list of available subscriptions in your Azure Active Directory tenant where you'd like to add a plan.

    - For the sake of this tutorial, select a trial pricing plan. Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.

        For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

    <!--For example: TBD image and validate this with the UI-->

1. Accept the **terms and conditions** and select **Save**.

## View and manage IoT devices

View and manage your IoT devices in the [Microsoft 365 Defender portal](https://security.microsoft.com/). From the **Endpoints** navigation menu, select **Endpoints** > **IoT devices**. For example:

<!--For example: TBD image-->

For more information, see [Device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview).

## View related alerts, recommendations, and vulnerabilities

After onboarding to an Enterprise IoT plan, view newly detected data and security assessments in the following locations:

- View alerts from `<tbd>`. For more information, see [Alerts queue in Microsoft 365 Defender](/microsoft-365/security/defender-endpoint/alerts-queue-endpoint-detection-response).

- View recommendations from `<tbd>`. For more information, see [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation).

- View vulnerabilities from `<tbd>`. For more information, see [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-weaknesses).

## Cancel your Defender for IoT plan

You may need to cancel a Defender for IoT plan if you no longer need the service.

You'll also need to cancel your plan and onboard again if you need to work with a new payment entity or Azure subscription, or if you've [registered an Enterprise IoT network sensor](eiot-sensor.md) and need to update the number of [committed devices](architecture.md#what-is-a-defender-for-iot-committed-device). <!--right? b/c no need to add more committed devices if they're all managed by mde-->

Cancel your Defender for IoT plan from the Defender for Endpoint settings page in the [https://security.microsoft.com](https://security.microsoft.com/) portal.

<TBD - how?>

After you cancel your plan, the integration stops and you'll no longer get added security value in Defender for Endpoint, or detect new Enterprise IoT devices in Defender for IoT.

> [!IMPORTANT]
> You can also cancel a plan from Defender for IoT in the Azure portal. Canceling a plan from the Azure portal removes all Defender for IoT services from the subscription, including both OT and Enterprise IOT services. Do this with care.
>
> If you've registered an Enterprise IoT network sensor (Public preview), data collected by the sensor, such as extra devices, remains in your Defender for Endpoint instance. Make sure to manually delete data from Defender for Endpoint as needed. <!-- what data? is this only if we've included a sensor? what if you're switching subscriptions or changing payment? should you delete data? how can you do this? maybe let's move this to the sensor page?-->

## Next steps

After onboarding a Enterprise IoT plan, you'll also be able to view detected devices in Defender for IoT in the Azure portal. For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

To gain more visibility into additional IoT segments of your corporate network, not otherwise covered by Defender for Endpoint, set up an Enterprise IoT network sensor (Public preview). Customers that have set up an Enterprise IoT network sensor will be able to see all discovered devices in the **Device inventory** in either Defender for Endpoint or Defender for IoT.

For more information, see [Enhance device discovery with an Enterprise IoT network sensor](eiot-sensor.md).


