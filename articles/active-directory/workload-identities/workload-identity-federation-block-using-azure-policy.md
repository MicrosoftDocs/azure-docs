---
title: Block workload identity federation using Azure Policy
description: Learn how to use a built-in Azure Policy to block workload identity federation on user-assigned managed identities. Govern the use of federated identity credentials on managed identities so that no one can access Microsoft Entra protected resources from external workloads.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: workload-identities
ms.topic: how-to
ms.workload: identity
ms.date: 03/09/2023
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: cbrooks, udayh, vakarand

#Customer intent: As an application developer or administrator, I want to block the creation of a federated credential on a managed identity so I can block everyone from using workload identity federation.
---

# Block workload identity federation on managed identities using a policy

This article describes how to block the creation of federated identity credentials on user-assigned managed identities by using Azure Policy. By blocking the creation of federated identity credentials, you can block everyone from using [workload identity federation](workload-identity-federation.md) to access Microsoft Entra protected resources. [Azure Policy](../../governance/policy/overview.md) helps enforce certain business rules on your Azure resources and assess compliance of those resources.

The Not allowed resource types built-in policy can be used to block the creation of federated identity credentials on user-assigned managed identities.

## Create a policy assignment

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To create a policy assignment for the Not allowed resource types that blocks the creation of federated identity credentials in a subscription or resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Policy** in the Azure portal.
1. Go to the **Definitions** pane.
1. In the **Search** box, search for "Not allowed resource types" and select the *Not allowed resource types* policy in the list of returned items.
    :::image type="content" source="media/workload-identity-federation-block-using-azure-policy/azure-policy-search.png" alt-text="Screenshot showing search results in the Azure Policy Definitions pane." border="false":::
1. After selecting the policy, you can now see the **Definition** tab.
1. Click the **Assign** button to create an Assignment.
    :::image type="content" source="media/workload-identity-federation-block-using-azure-policy/azure-policy-assign.png" alt-text="Screenshot showing Policy Definition pane." border="false":::
1. In the **Basics** tab, fill out **Scope** by setting the **Subscription** and optionally set the **Resource Group**.
1. In the **Parameters** tab, select **userAssignedIdentities/federatedIdentityCredentials** from the **Not allowed resource types** list.  Select **Review and create**.
    :::image type="content" source="media/workload-identity-federation-block-using-azure-policy/azure-policy-assign-parameters.png" alt-text="Screenshot showing Parameters tab." border="false":::
1. Apply the Assignment by selecting  **Create**.
1. View your assignment in the **Assignments** tab next to **Definition**.

## Next steps

Learn how to [manage a federated identity credential on a user-assigned managed identity](workload-identity-federation-create-trust-user-assigned-managed-identity.md) in Microsoft Entra ID.
