---
title: "Tutorial: Assign roles in Trusted Signing"
description: Learn how to assign roles in the Trusted Signing service.
author: TacoTechSharma
ms.author: mesharm
ms.service: trusted-signing
ms.topic: tutorial
ms.date: 03/21/2024
---

# Tutorial: Assign roles in Trusted Signing

Trusted Signing uses [Azure role-based access control (RBAC)](../role-based-access-control/overview.md) to control access to verify identities and certificate profiles. The following roles are essential for enabling workflows:

| Role Name                                 | Purpose                                                                                          | Notes                                                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Trusted Signing Identity Verifier**     | Required to manage identity validation requests                                                  | Can only be used in the Azure portal—not supported via Azure CLI                          |
| **Trusted Signing Certificate Profile Signer** | Required to successfully sign using Azure Trusted Signing                                        | Necessary for signing operations; works with both Azure CLI and portal                    |


In this tutorial, you'll review the supported roles for Trusted Signing and learn how to assign them to your Trusted Signing resources using the Azure portal.

## Supported roles for Trusted Signing

The following table lists the roles that Trusted Signing supports, including what each role can access within the service’s resources:

| Role | Manage and view account  | Manage certificate profiles  | Sign by using a certificate profile | View signing history  | Manage role assignment  | Manage identity validation |
|--------------|----------|------------|--------------|-----------|------------|-------------|
| Trusted Signing Identity Verifier|   | |  | |  | x|
| Trusted Signing Certificate Profile Signer |   | | x | x|  | |
| Owner |  x |x |  | | x | |
| Contributor |  x |x |  | | | |
| Reader |  x | |  | | | |
| User Access Admin | | |  | |x | |

The Trusted Signing Identity Verifier role is *required* to manage identity validation requests, which you can do only in the Azure portal, and not by using the Azure CLI. The Trusted Signing Certificate Profile Signer role is required to successfully sign by using Trusted Signing.

## Assign roles

1. In the Azure portal, go to your Trusted Signing account. On the resource menu, select **Access Control (IAM)**.
1. Select the **Roles** tab and search for **Trusted Signing**. The following figure shows the two custom roles.

   :::image type="content" source="media/trusted-signing-rbac-roles.png" alt-text="Screenshot that shows the Azure portal UI and the Trusted Signing custom RBAC roles.":::

1. To assign these roles, select **Add**, and then select **Add role assignment**. Follow the guidance in [Assign roles in Azure](../role-based-access-control/role-assignments-portal.yml) to assign the relevant roles to your identities.

   To create a Trusted Signing account and certificate profile, you must be assigned at least the *Contributor* role.
1. For more granular access control on the certificate profile level, you can use the Azure CLI to assign roles. You can use the following commands to assign the Trusted Signing Certificate Profile Signer role to users and service principals to sign files:

   ```azurecli
   az role assignment create --assignee <objectId of user/service principle> 
   --role "Trusted Signing Certificate Profile Signer" 
   --scope "/subscriptions/<subscriptionId>/resourceGroups/<resource-group-name>/providers/Microsoft.CodeSigning/codeSigningAccounts/<trustedsigning-account-name>/certificateProfiles/<profileName>" 
   ```

## Related content

- [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md)
- [Set up Trusted Signing quickstart](quickstart.md)
