---
title: Renew a Trusted Signing identity validation
description: Learn how to renew a Trusted Signing identity validation. 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 04/12/2024 
---

# Renew a Trusted Signing identity validation

On the **Identity validation** pane, you can check the expiration date of your identity validation. You can renew your Trusted Signing identity validation 60 days before the expiration date. A reminder notification to renew your identity validation is sent to the primary and secondary email addresses for the Trusted Signing account.

You can complete identity validation *only* in the Azure portal. You can't complete identity validation by using the Azure CLI.

> [!NOTE]
> If you don't renew your identity validation before the expiration date, certificate renewal stops. The signing process that's associated with the specific certificate profiles is effectively halted.

1. In the [Azure portal](https://portal.azure.com/), go to your Trusted Signing account.
1. Confirm that you're assigned the Trusted Signing Identity Verifier role.

   To learn about managing access by using role-based access control (RBAC), see [Assign roles in Trusted Signing](tutorial-assign-roles.md).
1. On the Trusted Signing account **Overview** pane or on the resource menu under **Objects**, select **Identity validations**.
1. Select the identity validation request that you want to renew. On the menu bar, select **Renew**.

   :::image type="content" source="media/trusted-signing-renew-identity-validation.png" alt-text="Screenshot that shows the Renew option for an identity validation request." lightbox="media/trusted-signing-renew-identity-validation.png":::

   If you encounter validation errors when you renew by selecting the **Renew** button or if the identity validation request is expired, create a new identity validation request. To learn more about creating a new identity validation, see the [Set up Trusted Signing quickstart](quickstart.md).
1. Verify that after you renew a request, the identity validation status is **Completed**.
1. To ensure that you can continue to use your existing *metadata.json* file:

   1. On the Trusted Signing account **Overview** pane or on the resource menu under **Objects**, select **Certificate profiles**.
   1. On the **Certificate profiles** pane, delete the existing certificate profile that's associated with the expiring identity validation.
   1. Create a new certificate profile that has the same name.
   1. Select the identity validation.

      When the certificate profile is successfully created, signing resumes without any other configuration changes.
