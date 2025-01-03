---
title: Renew and delete Trusted Signing Identity Validation
description: How-to renew and delete a Trusted Signing Identity Validation. 
author: TacoTechSharma
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 04/12/2024 
---

# Renew or delete Trusted Signing Identity Validations
You can renew or delete your Trusted Signing Identity Validations with the right role.

## Renew Identity Validation 
You can check the expiration date of your Identity Validation on the Identity Validation page. You can renew your Trusted Signing Identity Validation **60 days** before the expiration. A notification is to the primary and secondary email addresses with the reminder to renew your Identity Validation.
**Identity Validation can only be completed in the Azure portal – it can not be completed with Azure CLI.**

>[!Note]
>Failure to renew Identity Validation before the expiration date will stop certificate renewal, effectively halting the signing process associated with those specific certificate profiles.
>EKU does not change when you renew Identity Validation. 

1. Navigate to your Trusted Signing account in the [Azure portal](https://portal.azure.com/).
2. Confirm you have the **Trusted Signing Identity Verifier role**.
    - To learn more about Role Based Access management (RBAC) access management, see [Assigning roles in Trusted Signing](tutorial-assign-roles.md).
3. From either the Trusted Signing account overview page or from Objects, select **Identity Validation**.
4. Select the Identity Validation request that needs to be renewed. Select **Renew** on the top. 

:::image type="content" source="media/trusted-signing-renew-identity-validation.png" alt-text="Screenshot of trusted signing renew identity-validation button.png." lightbox="media/trusted-signing-renew-identity-validation.png":::

5. If you encounter validation errors while renewing through the renew button or if Identity Validation is Expired, you need to create a new Identity Validation. 
    - To learn more about creating new Identity Validation, see [Quickstart](quickstart.md). 
6. After the Identity Validation status changes to Completed.
7. To ensure you can continue with your existing metadata.json.
    - Navigate back to the trusted signing account overview page or from Objects, select **Certificate Profile**.
    - On the **Certificate Profiles**, delete the existing cert profile associated to the Identity Validation expiring soon:
    - Create new cert profile with the same name.
    - Select the Identity Validation from the pull-down. Once the certificate profile is created successfully, signing resumes requiring no configuration changes on your end.
    
## Delete Identity Validation

You can delete an Identity Validation that is not in "In Progress" state from the Identity Validation page.

>[!Note]
>Deleting an Identity Validation before stops the renewal of linked certificate profiles across all the accounts within a subscription where Identity Validation was done. This impacts signing. 
>Deleted identity validation requests cannot be recovered.

1. Navigate to your Trusted Signing account in the [Azure portal](https://portal.azure.com/).
2. Confirm you have the **Trusted Signing Identity Verifier role**.
    - To learn more about Role Based Access management (RBAC) access management, see [Assigning roles in Trusted Signing](tutorial-assign-roles.md).
3. From either the Trusted Signing account overview page or from Objects, select **Identity Validation**.
4. Select the Identity Validation request that needs to be deleted. Select **Delete** on the top. 

:::image type="content" source="media/trusted-signing-delete-identity-validation.png" alt-text="Screenshot of trusted signing delete identity-validation button.png." lightbox="media/trusted-signing-delete-identity-validation.png":::

5. A blade opens on the right hand side and lists the number of associated accounts and shows the certificate profiles linked to this Identity Validation. 
    - Ensure you have read permissions at the subscription level or on all trusted signing accounts to verify the usage of the current identity validation request across all certificate profiles. 
    
    :::image type="content" source="media/trusted-signing-delete-identity-validation-linked-profiles.png" alt-text="Screenshot of trusted signing delete identity-validation showing linked-profiles.png." lightbox="media/trusted-signing-delete-identity-validation-linked-profiles.png"::: 

6. Select **Delete**, if you wish to continue with the deletion of the certificate profile. A deleted Identity Validation request cannot be recovered. 
    
