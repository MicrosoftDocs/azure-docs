---
title: Configure conditional access to your Azure Container Registry.
description: Learn how to configure conditional access to your registry by using Azure CLI and Azure portal.
ms.author: tejaswikolli
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: tutorial  #Don't change.
ms.date: 11/02/2023
---

# Conditional Access policy for Azure Container Registry

Azure Container Registry (ACR) gives you the option to create and configure the *Conditional Access policy*. Conditional Access policies, which are typically associated with Azure Active Directory (Azure AD), are used to enforce strong authentication and access controls for various Azure services, including ACR.

The Conditional Access policy applies after the first-factor authentication to the Azure Container Registry is complete. The purpose of Conditional Access for ACR is for user authentication only. The policy enables the user to choose the controls and further blocks or grants access based on the policy decisions.

The [Conditional Access policy](../active-directory/conditional-access/overview.md) is designed to enforce strong authentication. The policy enables the security to meet the organizations compliance requirements and keep the data and user accounts safe.

>[!IMPORTANT]
> To configure Conditional Access policy for the registry, you must disable [`authentication-as-arm`](container-registry-disable-authentication-as-arm.md) for all the registries within the desired tenant. 

Learn more about [Conditional Access policy](../active-directory/conditional-access/overview.md), the [conditions](../active-directory/conditional-access/overview.md#common-signals) you'll take it into consideration to make [policy decisions.](../active-directory/conditional-access/overview.md#common-decisions)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure Conditional Access policy for Azure Container Registry.
> * Troubleshoot Conditional Access policy.

## Prerequisites

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) version 2.40.0 or later. To find the version, run `az --version`.
* Sign in to the [Azure portal](https://portal.azure.com).

## Create and configure a Conditional Access policy - Azure portal

ACR supports Conditional Access policy for Active Directory users only. It currently doesn't support Conditional Access policy for Service Principal. To configure Conditional Access policy for the registry, you must disable `authentication-as-arm` for all the registries within the desired tenant. In this tutorial, we'll create a basic Conditional Access policy for the Azure Container Registry from the Azure portal.

Create a Conditional Access policy and assign your test group of users as follows:

   1. Sign in to the [Azure portal](https://portal.azure.com) by using an account with *global administrator* permissions.

   1. Search for and select **Microsoft Entra ID**. Then select **Security** from the menu on the left-hand side.

   1. Select **Conditional Access**, select **+ New policy**, and then select **Create new policy**.
   
      :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select 'New policy' and then select 'Create new policy'." source="media/container-registry-enable-conditional-policy/01-create-conditional-access.png":::

   1. Enter a name for the policy, such as *demo*.

   1. Under **Assignments**, select the current value under **Users or workload identities**.
   
      :::image type="content" alt-text="A screenshot of the Conditional Access page, where you select the current value under 'Users or workload identities'." source="media/container-registry-enable-conditional-policy/02-conditional-access-users-and-groups.png":::

   1. Under **What does this policy apply to?**, verify and select **Users and groups**.

   1. Under **Include**, choose **Select users and groups**, and then select **All users**.
   
      :::image type="content" alt-text="A screenshot of the page for creating a new policy, where you select options to specify users." source="media/container-registry-enable-conditional-policy/03-conditional-access-users-groups-select-users.png":::

   1. Under **Exclude**, choose **Select users and groups**, to exclude any choice of selection.

   1. Under **Cloud apps or actions**, choose **Cloud apps**.

   1. Under **Include**, choose **Select apps**.

      :::image type="content" alt-text="A screenshot of the page for creating a new policy, where you select options to specify cloud apps." source="media/container-registry-enable-conditional-policy/04-select-cloud-apps-select-apps.png":::

   1.  Browse for and select apps to apply Conditional Access, in this case *Azure Container Registry*, then choose **Select**.

         :::image type="content" alt-text="A screenshot of the list of apps, with results filtered, and 'Azure Container Registry' selected." source="media/container-registry-enable-conditional-policy/05-select-azure-container-registry-app.png":::

   1.  Under **Conditions** , configure control access level with options such as *User risk level*, *Sign-in risk level*, *Sign-in risk detections (Preview)*, *Device platforms*, *Locations*, *Client apps*, *Time (Preview)*, *Filter for devices*.

   1. Under **Grant**, filter and choose from options to enforce grant access or block access, during a sign-in event to the Azure portal. In this case grant access with *Require multifactor authentication*, then choose **Select**.

      >[!TIP]
      > To configure and grant multi-factor authentication, see [configure and conditions for multi-factor authentication.](../active-directory/authentication/tutorial-enable-azure-mfa.md#configure-the-conditions-for-multi-factor-authentication)

   1. Under **Session**, filter and choose from options to enable any control on session level experience of the cloud apps.

   1. After selecting and confirming, Under **Enable policy**, select **On**.

   1. To apply and activate the policy, Select **Create**.

      :::image type="content" alt-text="A screenshot showing how to activate the Conditional Access policy." source="media/container-registry-enable-conditional-policy/06-enable-conditional-access-policy.png":::

   We have now completed creating the Conditional Access policy for the Azure Container Registry.

## Troubleshoot Conditional Access policy

- For problems with Conditional Access sign-in, see [Troubleshoot Conditional Access sign-in](/entra/identity/conditional-access/troubleshoot-conditional-access).

- For problems with Conditional Access policy, see [Troubleshoot Conditional Access policy](/entra/identity/conditional-access/troubleshoot-conditional-access-what-if).

## Next steps 

> [!div class="nextstepaction"]
> [Azure Policy definitions](../governance/policy/concepts/definition-structure.md) and [effects](../governance/policy/concepts/effects.md).
>[Common access concerns that Conditional Access policies can help with](../active-directory/conditional-access/concept-conditional-access-policy-common.md).
> [Conditional Access policy components](../active-directory/conditional-access/concept-conditional-access-policies.md).
