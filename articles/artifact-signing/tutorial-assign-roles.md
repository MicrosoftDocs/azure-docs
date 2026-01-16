---
title: "Tutorial: Assign roles in Artifact Signing"
description: Learn how to assign roles in Artifact Signing.
author: TacoTechSharma
ms.author: mesharm
ms.service: trusted-signing
ms.topic: tutorial
ms.date: 12/29/2025
ms.custom: sfi-image-nochange
---

# Tutorial: Assign roles in Artifact Signing

Artifact Signing uses [Azure role-based access control (RBAC)](../role-based-access-control/overview.md) to control access to verify identities and certificate profiles. The following roles are essential for enabling workflows:

| Role Name                                 | Purpose                                                                                          | Notes                                                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Artifact Signing Identity Verifier**     | Required to manage identity validation requests                                                  | Can only be used in the Azure portal—not supported via Azure CLI                          |
| **Artifact Signing Certificate Profile Signer** | Required to successfully sign using Azure Artifact Signing                                        | Necessary for signing operations; works with both Azure CLI and portal                    |


In this tutorial, you'll review the supported roles for Artifact Signing and learn how to assign them to your Artifact Signing resources using the Azure portal.

## Supported roles for Artifact Signing

The following table lists the roles that Artifact Signing supports, including what each role can access within the service’s resources:

| Role | Manage and view account  | Manage certificate profiles  | Sign by using a certificate profile | View signing history  | Manage role assignment  | Manage identity validation |
|--------------|----------|------------|--------------|-----------|------------|-------------|
| Artifact Signing Identity Verifier|   | |  | |  | x|
| Artifact Signing Certificate Profile Signer |   | | x | x|  | |
| Owner |  x |x |  | | x | |
| Contributor |  x |x |  | | | |
| Reader |  x | |  | | | |
| User Access Admin | | |  | |x | |

The Artifact Signing Identity Verifier role is *required* to manage identity validation requests, which you can do only in the Azure portal, and not by using the Azure CLI. The Artifact Signing Certificate Profile Signer role is required to successfully sign by using Artifact Signing.

## Assign roles

1. In the Azure portal, go to your Artifact Signing account. On the resource menu, select **Access Control (IAM)**.
1. Select the **Roles** tab and search for **Artifact Signing**. The following figure shows the two custom roles.

   :::image type="content" source="media/artifact-signing-rbac-roles.png" alt-text="Screenshot that shows the Azure portal UI and the Artifact Signing custom RBAC roles.":::

1. To assign these roles, select **Add**, and then select **Add role assignment**. Follow the guidance in [Assign roles in Azure](/azure/role-based-access-control/role-assignments-portal) to assign the relevant roles to your identities.

   To create an Artifact Signing account and certificate profile, you must be assigned at least the *Contributor* role.
1. For more granular access control on the certificate profile level, you can use the Azure CLI to assign roles. You can use the following commands to assign the Artifact Signing Certificate Profile Signer role to users and service principals to sign files:

   ```azurecli
   az role assignment create --assignee <objectId of user/service principle> 
   --role "Artifact Signing Certificate Profile Signer" 
   --scope "/subscriptions/<subscriptionId>/resourceGroups/<resource-group-name>/providers/Microsoft.CodeSigning/codeSigningAccounts/<artifactsigning-account-name>/certificateProfiles/<profileName>" 
   ```

## Related content

- [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md)
- [Set up Artifact Signing quickstart](quickstart.md)
