---
title: Renew or delete Artifact Signing Identity Validation
description: How-to renew and delete an Artifact Signing Identity Validation. 
author: TacoTechSharma
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 12/30/2025 
ms.custom: sfi-image-nochange
---

# Renew or delete Artifact Signing Identity Validations
You can renew or delete your Artifact Signing Identity Validations with an Artifact Signing Identity Verifier role.

## Renew Identity Validation

You can check the expiration date of your Identity Validation on the Identity Validation page under an Artifact Signing account. You can renew your Artifact Signing Identity Validation **60 days** before the expiration. A notification email is sent to the primary and secondary email addresses with the reminder to renew your Identity Validation.
**Identity Validation can only be completed in the Azure portal – it can not be completed with Azure CLI.**

>[!Note]
>Failure to renew Identity Validation before the expiration date will stop certificate renewal, effectively halting the signing process associated with those specific certificate profiles.
>EKU does not change when you renew Identity Validation. 

1. Navigate to your Artifact Signing account in the [Azure portal](https://portal.azure.com/).
1. Confirm you have the **Artifact Signing Identity Verifier role**.
    - To learn more about Role Based Access management (RBAC) access management, see [Assigning roles in Artifact Signing](tutorial-assign-roles.md).
1. From either the Artifact Signing account overview page or from Objects, select **Identity Validation**.
1. Select the Identity Validation request that needs to be renewed. Select **Renew** on the top. 

    :::image type="content" source="media/artifact-signing-renew-identity-validation.png" alt-text="Screenshot of artifact signing renew identity-validation button.png." lightbox="media/artifact-signing-renew-identity-validation.png":::

1. If you encounter validation errors while renewing through the renew button or if Identity Validation is Expired, you need to create a new Identity Validation. 
    - To learn more about creating new Identity Validation, see [Quickstart](quickstart.md). 
1. After the Identity Validation status changes to Completed.
1. To ensure you can continue with your existing metadata.json.
    - Navigate back to the Artifact Signing account overview page or from Objects, select **Certificate Profile**.
    - On the **Certificate Profiles**, delete the existing cert profile associated to the Identity Validation expiring soon:
    - Create new cert profile with the same name.
    - Select the Identity Validation from the pull-down. Once the certificate profile is created successfully, signing resumes requiring no configuration changes on your end.
    
## Delete Identity Validation

You can delete an Identity Validation that is not in "In Progress" state from the Identity Validation page.

>[!Note]
>Deleting an Identity Validation before stops the renewal of linked certificate profiles across all the accounts within a subscription where Identity Validation was done. This impacts signing. 
>Deleted identity validation requests cannot be recovered.

1. Navigate to your Artifact Signing account in the [Azure portal](https://portal.azure.com/).
1. Confirm you have the **Artifact Signing Identity Verifier role**.
    - To learn more about Role Based Access management (RBAC) access management, see [Assigning roles in Artifact Signing](tutorial-assign-roles.md).
1. From either the Artifact Signing account overview page or from Objects, select **Identity Validation**.
1. Select the Identity Validation request that needs to be deleted. Select **Delete** on the top. 

    :::image type="content" source="media/artifact-signing-delete-identity-validation.png" alt-text="Screenshot of artifact signing delete identity-validation button.png." lightbox="media/artifact-signing-delete-identity-validation.png":::

1. A blade opens on the right hand side and lists the number of associated accounts and shows the certificate profiles linked to this Identity Validation. 
    - Ensure you have read permissions at the subscription level or on all artifact signing accounts to verify the usage of the current identity validation request across all certificate profiles. 
    
    :::image type="content" source="media/artifact-signing-delete-identity-validation-linked-profiles.png" alt-text="Screenshot of artifact signing delete identity-validation showing linked-profiles.png." lightbox="media/artifact-signing-delete-identity-validation-linked-profiles.png"::: 

1. Select **Delete**, if you wish to continue with the deletion of the certificate profile. A deleted Identity Validation request cannot be recovered.