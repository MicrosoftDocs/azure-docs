---
title: Configure verified ID settings for an access package in entitlement management
description: Learn how to configure verified ID settings for an access package in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: HANKI
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: hanki
ms.collection: M365-identity-device-management

---

# Configure verified ID settings for an access package in entitlement management

When setting up an access package policy, admins can specify whether it’s for users in the directory, connected organizations, or any external user. Entitlement Management determines if the person requesting the access package is within the scope of the policy. 

Sometimes you might want users to present additional identity proofs during the request process such as a training certification, work authorization, or citizenship status.  As an access package manager, you can require that requestors present a verified ID containing those credentials from a trusted issuer. Approvers can then quickly view if a user’s verifiable credentials were validated at the time that the user presented their credentials and submitted the access package request. 

As an access package manager, you can include verified ID requirements for an access package at any time by editing an existing policy or adding a new policy for requesting access. 

This article describes how to configure the verified ID requirement settings for an access package.

## Prerequisites

Before you begin, you must set up your tenant to use the [Microsoft Entra Verified ID service](../verifiable-credentials/decentralized-identifier-overview.md). You can find detailed instructions on how to do that here: [Configure your tenant for Microsoft Entra Verified ID](../verifiable-credentials/verifiable-credentials-configure-tenant.md). 


## License requirements

[!INCLUDE [active-directory-entra-governance-license.md](../../../includes/active-directory-entra-governance-license.md)]

## Create an access package with verified ID requirements

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To add a verified ID requirement to an access package, you must start from the access package’s requests tab. Follow these steps to add a verified ID requirement to a new access package.


**Prerequisite role**: Global administrator

> [!NOTE]
> Identity Governance administrator, User administrator, Catalog owner, or Access package manager will be able to add verified ID requirements to access packages soon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** page select **+ New access package**.

1. On the **Requests** tab, scroll to the **Required Verified Ids** section.

1. Select **+ Add issuer** and choose an issuer from the Microsoft Entra Verified ID network. If you want to issue your own credentials to users, see: [Issue Microsoft Entra Verified ID credentials from an application](../verifiable-credentials/verifiable-credentials-configure-issuer.md).
    :::image type="content" source="media/entitlement-management-verified-id-settings/select-issuer.png" alt-text="Select issuer for Microsoft Entra Verified I D.":::

1. Select the **credential type(s)** you want users to present during the request process.
    :::image type="content" source="media/entitlement-management-verified-id-settings/issuer-credentials.png" alt-text="Screenshot of credential types for Microsoft Entra Verified I D.":::
    > [!NOTE]
    > If you select multiple credential types from one issuer, users will be required to present credentials of all selected types. Similarly, if you include multiple issuers, users will be required to present credentials from each of the issuers you include in the policy. To give users the option of presenting different credentials from various issuers, configure separate policies for each issuer/credential type you’ll accept.
1. Select **Add** to add the verified ID requirement to the access package policy. 

1. Once you have finished configuring the rest of the settings, you can review your selections on the **Review + create** tab. You can see all verified ID requirements for this access package policy in the **Verified IDs** section.
    :::image type="content" source="media/entitlement-management-verified-id-settings/verified-ids-list.png" alt-text="Screenshot of a list of verified IDs.":::


## Request an access package with verified ID requirements

Once an access package is configured with a verified ID requirement, end-users who are within the scope of the policy are able to request access using the My Access portal. Similarly, approvers are able to see the claims of the VCs presented by requestors when reviewing requests for approval.

The requestor steps are as follows:

1. Go to [myaccess.microsoft.com](HTTPS://myaccess.microsoft.com) and sign in.

1. Search for the access package you want to request access to (you can browse the listed packages or use the search bar at the top of the page) and select **Request**.

1. If the access package requires you to present a verified ID, you should see a grey information banner as shown here:
    :::image type="content" source="media/entitlement-management-verified-id-settings/present-verified-id-access-package.png" alt-text="Screenshot of the present verified ID for access package option.":::
1. Select **Request Access**. You should now see a QR code. Use your phone to scan the QR code. This launches Microsoft Authenticator, where you'll be prompted to share your credentials.
    :::image type="content" source="media/entitlement-management-verified-id-settings/verified-id-qr-code.png" alt-text="Screenshot of use QR code for verified IDs.":::
1. After you share your credentials, My Access will automatically take you to the next step of the request process.


## Next steps

[Delegate access governance to access package managers](entitlement-management-delegate-managers.md)
