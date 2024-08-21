---
title: Revoke a certificate profile in Trusted Signing 
description: Learn how to revoke a Trusted Signing certificate in the Azure portal. 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 04/12/2024 
---


# Revoke a certificate profile in Trusted Signing

Revoking a certificate makes a certificate invalid. When a certificate is successfully revoked, all the files that are signed with the revoked certificate become invalid beginning at the revocation date and time you select.

If the certificate that's issued to you doesn’t match your intended values or if you suspect any compromise of your account, consider taking the following steps:

1. Revoke the existing certificate.

   Revoking the certificate ensures that any compromised or incorrect certificates become invalid. Make sure that you promptly revoke any certificates that no longer meet your requirements.

1. For assistance revoking a certificate, contact Microsoft.

   - If you encounter any issues revoking a certificate by using the Azure portal (especially for scenarios that don't involve misuse or abuse), contact Microsoft.
   - For any misuse or abuse of certificates that are issued to you by Trusted Signing, contact Microsoft immediately at `acsrevokeadmins@microsoft.com`.

1. Continue signing by using Trusted Signing.

   1. Initiate a new identity validation request.
   1. Verify that the information in the certificate subject preview accurately reflects your intended values.
   1. Create a new certificate profile that uses the newly completed identity validation.

Before you initiate a certificate revocation, it’s crucial that you verify that all the details are accurate and as intended. After a certificate is revoked, reversing the process isn't possible. Use caution and double-check the information before you proceed with the revocation process.

Revocation can be completed only in the Azure portal. You can't revoke the certificate by using the Azure CLI.

This article describes how to revoke a certificate profile in a Trusted Signing account.

## Prerequisites

To complete the steps in this article:

- Ensure that you're assigned the Owner role for the subscription. To learn more about role-based access control (RBAC) access management, see [Assign roles in Trusted Signing](tutorial-assign-roles.md).

## Revoke a certificate

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Trusted Signing account resource pane.
1. On the account **Overview** pane or on the resource menu under **Objects**, select **Certificate profiles**.
1. Select the relevant certificate profile.
1. In the search box, enter the thumbprint of the certificate you want to revoke.

   You can get the thumbprint for a .cer file, for example, on the **Details** tab.

1. Select the thumbprint, and then select **Revoke**.
1. For **Revocation reason**, select a reason.
1. For **Revocation date time**, enter a value that's within the date and time of the certificate creation and expiration.

   The **Revocation date time** value is converted to your local time zone.
1. For **Remarks**, enter any information you'd like to add to the certificate revocation.
1. Select **Revoke**.
1. When the certificate is successfully revoked:

   - The status of the thumbprint that was revoked is updated.
   - An email is sent to the email addresses that you provided during identity validation.
