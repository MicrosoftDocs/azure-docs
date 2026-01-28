---
title: "Quickstart: Set up Artifact Signing"
description: This quickstart helps you get started with using Artifact Signing to sign your files.
author: TacoTechSharma
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: quickstart 
ms.date: 12/31/2025 
ms.custom:
  - references_regions
  - devx-track-azurecli
  - sfi-image-nochange
---


# Quickstart: Set up Artifact Signing

Artifact Signing is a Microsoft fully managed, end-to-end certificate signing service. In this quickstart, you create the following three Artifact Signing resources to begin using Artifact Signing:

- An Artifact Signing account
- An identity validation
- A certificate profile

You can use either the Azure portal or an Azure CLI extension to create and manage most of your Artifact Signing resources. (You can complete identity validation *only* in the Azure portal. You can't complete identity validation by using the Azure CLI.) This quickstart shows you how.

## Prerequisites

> [!NOTE]
> For Public Trust certificates, Artifact Signing is currently available to organizations in the USA, Canada, the European Union, and the United Kingdom, as well as individual developers in the USA and Canada. This limitation is not applicable to Private Trust certificates.

To complete this quickstart, you need:

- A Microsoft Entra tenant ID.

   For more information, see [Create a Microsoft Entra tenant](/azure/active-directory/fundamentals/create-new-tenant#create-a-new-tenant-for-your-organization).

- An Azure subscription.

   If you don't already have one, see [Create an Azure subscription](../cost-management-billing/manage/create-subscription.md#create-a-subscription) before you begin.

## Register the Artifact Signing resource provider

Before you use Artifact Signing, you must register the Artifact Signing resource provider.

A resource provider is a service that supplies Azure resources. Use the Azure portal or the Azure CLI to register the `Microsoft.CodeSigning` Artifact Signing resource provider.

# [Azure portal](#tab/registerrp-portal)

To register an Artifact Signing resource provider by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In either the search box or under **All services**, select **Subscriptions**.
3. Select the subscription where you want to create Artifact Signing resources.
4. On the resource menu under **Settings**, select **Resource providers**.

5. In the list of resource providers, select **Microsoft.CodeSigning**.

   By default, the resource provider status is **NotRegistered**.

:::image type="content" source="media/artifact-signing-resource-provider-registration.png" alt-text="Screenshot that shows creating an Artifact Signing account." lightbox="media/artifact-signing-resource-provider-registration.png":::

6. Select the ellipsis, and then select **Register**.

   :::image type="content" source="media/artifact-signing-resource-provider.png" alt-text="Screenshot that shows the Microsoft.CodeSigning resource provider as registered." lightbox="media/artifact-signing-resource-provider.png":::

   The status of the resource provider changes to **Registered**.

# [Azure CLI](#tab/registerrp-cli)

To register an Artifact Signing resource provider by using the Azure CLI:

1. If you're using a local installation of the Azure CLI, sign in to the Azure CLI by using the `az login` command.  

2. To finish the authentication process, complete the steps that appear in your terminal. For other sign-in options, see [Sign in by using the Azure CLI](/cli/azure/authenticate-azure-cli).

3. When you're prompted on first use, install the Azure CLI extension.

   For more information, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

   For more information about the Artifact Signing Azure CLI extension, see [Artifact Signing service](/cli/azure/service-page/trusted%20signing%20service?view=azure-cli-latest&preserve-view=true).

4. To see the versions of the Azure CLI and the dependent libraries that are installed, use the `az version` command.

5. To upgrade to the latest versions of the Azure CLI and dependent libraries, run the following command:

   ```azurecli
   az upgrade [--all {false, true}] [--allow-preview {false, true}] [--yes]
   ```

6. To set your default subscription ID, use the `az account set -s <subscription ID>` command.

7. To register an Artifact Signing resource provider, use this command:

   ```azurecli
   az provider register --namespace "Microsoft.CodeSigning"
   ```

8. Verify the registration:

   ```azurecli
   az provider show --namespace "Microsoft.CodeSigning"
   ```

9. To add the extension for Artifact Signing, use this command:

   ```azurecli
   az extension add --name artifact-signing
   ```

---

## Create an Artifact Signing account

An Artifact Signing account is a logical container that holds identity validation and certificate profile resources.

### Azure regions that support Artifact Signing

You can create Artifact Signing resources only in Azure regions where the service is currently available. The following table lists the Azure regions that currently support Artifact Signing resources:

 | Region            | Region class fields  | Endpoint URI value                   |
 | :---------------- | :------------------- | :----------------------------------- |
 | Brazil South      | BrazilSouth          | `https://brs.codesigning.azure.net`  |
 | Central US        | CentralUS            | `https://cus.codesigning.azure.net`  |
 | East US           | EastUS               | `https://eus.codesigning.azure.net`  |
 | Japan East        | JapanEast            | `https://jpe.codesigning.azure.net`  |
 | Korea Central     | KoreaCentral         | `https://krc.codesigning.azure.net`  |
 | North Central US  | NorthCentralUS       | `https://ncus.codesigning.azure.net` |
 | North Europe      | NorthEurope          | `https://neu.codesigning.azure.net`  |
 | Poland Central    | PolandCentral        | `https://plc.codesigning.azure.net`  |
 | South Central US  | SouthCentralUS       | `https://scus.codesigning.azure.net` |
 | Switzerland North | SwitzerlandNorth     | `https://swn.codesigning.azure.net`  |
 | West Central US   | WestCentralUS        | `https://wcus.codesigning.azure.net` |
 | West Europe       | WestEurope           | `https://weu.codesigning.azure.net`  |
 | West US           | WestUS               | `https://wus.codesigning.azure.net`  |
 | West US 2         | WestUS2              | `https://wus2.codesigning.azure.net` |
 | West US 3         | WestUS3              | `https://wus3.codesigning.azure.net` |

### Naming constraints for Artifact Signing accounts

Artifact Signing account names have some constraints.

An Artifact Signing account name must:

- Contain from 3 to 24 alphanumeric characters.
- Be globally unique.
- Begin with a letter.
- End with a letter or number.
- Not contain consecutive hyphens.

An Artifact Signing account name is:

- Not case-sensitive (*ABC* is the same as *abc*).
- Rejected by Azure Resource Manager if it begins with "one".

# [Azure portal](#tab/account-portal)

To create an Artifact Signing account by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for and then select **Artifact Signing Accounts**.

   :::image type="content" source="media/artifact-signing-search-service.png" alt-text="Screenshot that shows searching for Artifact Signing Accounts in the Azure portal." lightbox="media/artifact-signing-search-service.png":::
3. On the **Artifact Signing Accounts** pane, select **Create**.
4. For **Subscription**, select your Azure subscription.
5. For **Resource group**, select **Create new**, and then enter a resource group name.
6. For **Account name**, enter a unique account name.

   For more information, see [Naming constraints for Artifact Signing accounts](#naming-constraints-for-artifact-signing-accounts).
7. For **Region**, select an Azure region that supports Artifact Signing.
8. For **Pricing**, select a pricing tier.
9. Select the **Review + Create** button.

   :::image type="content" source="media/artifact-signing-account-creation.png" alt-text="Screenshot that shows creating an Artifact Signing account." lightbox="media/artifact-signing-account-creation.png":::

10. After you successfully create your Artifact Signing account, select **Go to resource**.  

# [Azure CLI](#tab/account-cli)

To create an Artifact Signing account by using the Azure CLI:

1. Create a resource group by using the following command. If you choose to use an existing resource group, skip this step.

```azurecli
   az group create --name MyResourceGroup --location EastUS
```

2. Create a unique Artifact Signing account by using the following command.

   For more information, see [Naming constraints for Artifact Signing accounts](#naming-constraints-for-artifact-signing-accounts).

   To create an Artifact Signing account that has a Basic SKU:

```azurecli
  az artifact-signing create -n MyAccount -l eastus -g MyResourceGroup --sku Basic
```

   To create an Artifact Signing account that has a Premium SKU:

   ```azurecli
  az artifact-signing create -n MyAccount -l eastus -g MyResourceGroup --sku Premium
   ```

3. Verify your Artifact Signing account by using: 
```azurecli
az artifact-signing show -g MyResourceGroup -n MyAccount` command.
```
   > [!NOTE]
   > If you use an earlier version of the Azure CLI from the Artifact Signing preview, your account defaults to the Basic SKU. To use the Premium SKU, either upgrade the Azure CLI to the latest version or use the Azure portal to create the account.

The following table lists *helpful commands* to use when you create an Artifact Signing account:

| Command                                                                                       | Description                                      |  
|:----------------------------------------------------------------------------------------------|:-------------------------------------------------|
| `az artifact-signing -h`                                                                      | Shows help commands and detailed options.        |
| `az artifact-signing show -n MyAccount  -g MyResourceGroup`                                   | Shows the details of an account.                 |
| `az artifact-signing update -n MyAccount -g MyResourceGroup --tags "key1=value1 key2=value2"` | Updates tags.                                    |
| `az artifact-signing list -g MyResourceGroup`                                                 | Lists all accounts that are in a resource group. |

---

## Create an identity validation request

You can complete your own identity validation by filling in the request form with the information that must be included in the certificate. Identity validation can be completed only in the Azure portal. You can't complete identity validation by using the Azure CLI.

> [!NOTE]
> You can't create an identity validation request if you aren't assigned the appropriate role. If the **New identity** button on the menu bar appears dimmed in the Azure portal, ensure that you're assigned the Artifact Signing Identity Verifier role to proceed with identity validation.

# [Identity Validation - Organization](#tab/orgvalidation)

To create an identity validation request for an Organization or a DBA:

1. In the Azure portal, go to your new Artifact Signing account.
1. Confirm that you're assigned the Artifact Signing Identity Verifier role.

   To learn how to manage, access by using role-based access control (RBAC), see [Tutorial: Assign roles in Artifact Signing](tutorial-assign-roles.md).
1. On the Artifact Signing account **Overview** pane or on the resource menu under **Objects**, select **Identity validations**.
1. Select **New identity**, and then select either **Public** or **Private**.

   - Public identity validation applies only to these certificate profile types: Public Trust, Public Trust Test, VBS Enclave.
   - Private identity validation applies only to these certificate profile types: Private Trust, Private Trust CI Policy.
1. On **New identity validation**, provide the following information:

    | Fields       | Details     |
    | :------------------- | :------------------- |
    | **Organization Name**          | For public identity validation, provide the legal business entity to which the certificate is issued. For private identity validation, the value defaults to your Microsoft Entra tenant name. |
    | **(Private Identity Type only) Organizational Unit**          | Enter the relevant information. |
    | **Website url**          | Enter the website that belongs to the legal business entity. |
    | **Primary Email**           | Enter the email address of an individual (distribution lists aren't accepted) associated with the legal business entity undergoing validation. Part of the Identity Validation process, a verification link is sent to this email address and the link expires in seven days. Ensure that the email address can receive emails(with links) from external email addresses.  |
    | **Secondary Email**          | This email address must be different from the primary email address (distribution lists are accepted). For organizations, the domain must match the email address that is provided in the primary email address. Ensure that the email address can receive emails from external email addresses that have links.|
    | **Business Identifier**           | Enter a business identifier for the legal business entity. |
    | **Seller ID**          | Applies only to Microsoft Store customers. Find your Seller ID in the Partner Center portal. |
    | **Street, City, Country/Region, State/Province, Postal code**           | Enter the business address of the legal business entity. |
    | **First Name**           | Enter the first name of the individual representing the organization that will perform individual identity validation. Use the exact name as it appears on your government-issued identification document for the Identity Validation process. |
    | **Last Name**           | Enter the last name of the individual representing the organization. This individual performs individual identity validation. Use the exact name as it appears on your government-issued identification document for the Identity Validation process.  |

1. Select **Certificate subject preview** to see the preview of the information that appears in the certificate.
1. Select the **Create** button.
1. When the request is successfully created, the identity validation request status changes to **In Progress**.
1. When the status changes to **Action Required**, follow the instructions step 9 onwards in the Identity Validation - Individual Developer tab above.
1. The link for individual identity validation is also sent through email to the primary email address. 
1. Once Individual Identity Validation is successfully completed, the status changes back to **In Progress** and the validation process continues.
1. If more documents are required, an email is sent and the request status changes to **Action Required**.  
1. When the identity validation process is finished, the request status changes, and an email is sent with the updated status of the request:

   - **Completed** if the process is completed successfully.
   - **Failed** if the process isn't completed successfully.

   :::image type="content" source="media/artifact-signing-identity-validation-public.png" alt-text="Screenshot that shows the Public option in the New identity validation pane." lightbox="media/artifact-signing-identity-validation-public.png":::

   :::image type="content" source="media/artifact-signing-identity-validation-private.png" alt-text="Screenshot that shows the Private option in the New identity validation pane." lightbox="media/artifact-signing-identity-validation-private.png":::

### Important information for public identity validation

| Requirements         | Details     |
| :------------------- | :------------------- |
| Onboarding           | Artifact Signing at this time can onboard only legal business entities that have verifiable tax history of three or more years. For a quicker onboarding process, ensure that public records for the legal business entity that you're validated are up to date. |
| Accuracy             | Ensure that you provide the correct information for public identity validation. If you need to make any changes after it's created, you must complete a new identity validation request. This change affects the associated certificates that are being used for signing. |
| Failed email verification            | If email verification fails, you must initiate a new identity validation request. |
| Identity validation status            | You're notified through email when there's an update to the identity validation status. You can also check the status in the Azure portal at any time. |
| Processing time            | Processing your identity validation request takes from 1 to 7 business days (possibly longer if we need to request more documentation from you). |
| More documentation            | If we need more documentation to process the identity validation request, you're notified through email. You can upload the documents in the Azure portal. For documentation upload, there are three attempts. The documentation request email contains information about file size requirements. Ensure that any documents you provide are the most current. <br> - All documents submitted must be issued within the previous 12 months and where the expiration date is a future date that is at least two months away. <br>  - If it isn't possible to provide additional documentation, update your account information to match any legal documents already provided or your official Company registration details. <br>  - When providing official business document, such as business registration form, business charter, or articles of incorporation that list the company name and address as it is provided at the time of Identity Validation request creation. <br>  - Ensure the domain registration or domain invoice from registration or renewal that lists the entity and contact name and all the domains that are included/mentioned in the request.|

# [Identity Validation - Individual Developer](#tab/indiedevvalidation)

 To create an Individual identity validation request for an Individual Developer:

1. In the Azure portal, go to your new Artifact Signing account.

1. Confirm that you're assigned the Artifact Signing Identity Verifier role.

     To learn how to manage access by using role-based access control (RBAC), see [Tutorial: Assign roles in Artifact Signing](tutorial-assign-roles.md).
1. On the Artifact Signing account **Overview** pane or on the resource menu under **Objects**, select **Identity validations**.
1. Select **Organization**, in the dropdown select **Individual** and then select **Public**.
    - Public identity validation applies to these certificate profile types: Public Trust, Public Trust Test, VBS Enclave.
    - Private identity validation is only for Organizations.
1. On **New identity validation**, provide the following information:

   | Fields       | Details     |
   | :------------------- | :------------------- |
   | **First Name**          | Use the exact name as it appears on your government-issued identification document for the Identity Validation process. |
   | **Last Name**          | Use the exact name as it appears on your government-issued identification document for the Identity Validation process. |
   | **Primary Email**           | Enter the email address that is going to receive the Identity Validation link. Make sure to use the same email address when logging into the Microsoft Account to access the Identity Validation link. |
   | **Street, City, Country/Region, State/Province, Postal code**           | Enter the address as it appears on your government issued identification document or utility bill or bank statement. The city, state/province, and country/region from the address entered here's displayed on the certificate. |

1. **Certificate subject preview** shows the preview of the information that appears on the certificate.  
    - Your email address and street address aren't included in the certificate.
1. Select the **Create** button.
1. When the request is successfully created, the identity validation request status changes to **In Progress**.  
1. When the status changes to **Action Required**. Select your name, a blade opens on the right-hand side. Select the link under "Please complete your verification here".
1. Follow the link to complete the Identity Validation process. Use the email address provided at the time of the request creation. Enter the credentials when prompted, and you'll be navigated to the next screen.
1. Select **Get verified here through our trusted ID-verifiers**.

   :::image type="content" source="media/artifact-signing-first-qr-code.png" alt-text="Screenshot that shows the first screen for Verified ID." lightbox="media/artifact-signing-first-qr-code.png":::

1. Create verified credentials by using the trusted partners' pages. The following steps show an example walkthrough. It uses the trusted partner: AU10TIX. You're navigated to a third party website.

   1. Select **Let’s Begin**.

   :::image type="content" source="media/artifact-signing-second-verified-id.png" alt-text="Screenshot that shows the second screen for Verified ID." lightbox="media/artifact-signing-second-verified-id.png":::

1. Enter your primary email address from the request here.

   :::image type="content" source="media/artifact-signing-enter-email-id.png" alt-text="Screenshot that shows screen to enter email address for Verified ID." lightbox="media/artifact-signing-enter-email-id.png":::

    AU10TIX sends an email verification in email that includes a PIN code.

   1. Check your email for the verification email and enter the PIN code to verify your email account.

   :::image type="content" source="media/artifact-signing-enter-pin-code.png" alt-text="Screenshot that shows screen to enter pincode for Verified ID." lightbox="media/artifact-signing-enter-pin-code.png":::

1. Enter phone number when prompted on the next screen.

   :::image type="content" source="media/artifact-signing-enter-phone-number.png" alt-text="Screenshot that shows screen to enter phone number for Verified ID." lightbox="media/artifact-signing-enter-phone-number.png":::

1. Select **Start**.

   :::image type="content" source="media/artifact-signing-begin-on-laptop.png" alt-text="Screenshot that shows screen begin Verified ID." lightbox="media/artifact-signing-begin-on-laptop.png":::

1. Use camera of your mobile device to scan the QR code. Don't close this screen on your browser.

   :::image type="content" source="media/artifact-signing-scan-qr-code-on-phone.png" alt-text="Screenshot that shows screen to scan QR code on phone to begin Verified ID." lightbox="media/artifact-signing-scan-qr-code-on-phone.png":::

1. On your mobile device, select **Start**. Follow the steps to complete the process and present the relevant documentation when prompted.

1. After the Au10TIX process is complete on your mobile device, select **Open Authenticator**.

   :::image type="content" source="media/artifact-signing-open-authenticator.png" alt-text="Screenshot that shows screen to navigate to Authenticator." lightbox="media/artifact-signing-open-authenticator.png":::

1. Now back on the browser, scan the QR code from your mobile device. Don't close the browser.

   :::image type="content" source="media/artifact-signing-scan-qr-code-again.png" alt-text="Screenshot that shows screen to scan QR code on phone once again to being Verified ID." lightbox="media/artifact-signing-scan-qr-code-again.png":::

1. Select **Add** to add a verified ID to the Microsoft Authenticator app.

   :::image type="content" source="media/artifact-signing-add-verified-id.png" alt-text="Screenshot that shows screen to Verified ID to their authenticator app." lightbox="media/artifact-signing-add-verified-id.png":::

1. The browser screen shows Present your Verified ID. Scan the QR code.
1. Select **Verifiable Credential** to share with Artifact Signing.
1. Select **Share** to share the credentials with Artifact Signing.
1. For successful completion the browser screen on your nonmobile device updates to: **Verification Successful** .

   :::image type="content" source="media/artifact-signing-indie-identity-validation-onevet.png" alt-text="Screenshot that shows the indie successful on onevet." lightbox="media/artifact-signing-indie-identity-validation-onevet.png":::

1. It takes a couple of minutes for the Identity Validation status on Azure portal to update. For a successful Verified ID the status, on Azure portal changes to **Completed**.

   :::image type="content" source="media/artifact-signing-identity-validation-indie.png" alt-text="Screenshot that shows the indie successful on Azure portal." lightbox="media/artifact-signing-identity-validation-indie.png":::

### Important information for public identity validation for Individual Developers

1. Minimum Requirements for Mobile OSes and supported Browsers:

   :::image type="content" source="media/artifact-signing-au10tix-mobileOS-supported.png" alt-text="Screenshot that shows the mobile OSes supported for indie." lightbox="media/artifact-signing-au10tix-mobileOS-supported.png":::

   :::image type="content" source="media/artifact-signing-au10tix-browser-supported.png" alt-text="Screenshot that shows the browsers supported for indie." lightbox="media/artifact-signing-au10tix-browser-supported.png":::

1. Types of ID Accepted:

    - Government-issued IDs such as passports, driving licenses, or ID cards.
    - Photo IDs (or a US Social Security Card).
    - Official government-issued IDs such as a passport, driver’s license, or state ID.
    - Don't submit privately issued IDs such as library cards, school IDs, club membership cards, etc.

1. Visibility/Low Light/Bright Light:

    - Don't use flash.
    - Don't place the ID in direct sunlight.
    - Hold the camera or mobile device steady while taking the picture.

1. Best Practices for Supplemental Docs:

    - Utility Bills: Electricity, water, gas, or telephone bills (should be recent, typically within the last three months).
    - Bank Statements: Official statements from banks or credit card companies that show the individual’s address.
    - The POA document must have the address, name, and date appear on the main page (first page), so multiple pages aren't required.

1. General best practices:

    - Single picture per file, if two-sided, create one file per side.
    - Handwritten documents aren't accepted.
    - Don't crop the image (cut corners, miss parts) try to have margins on all sides of the captured image before capturing.
    - Don't use Photoshop or other editing software; don't alter the document in any way.
    - Don't use flash.
    - Take the photo from directly above the document while it is on a flat surface.
    - Avoid colored and noisy background.
    - Don't obstruct the ID (no fingers covering part of the document).
    - Use color images not lower than 200 DPI. The ideal image size is 500Kb. AU10TIX best practice is to accept images with 400 DPI and above.
    - The minimum threshold for the image size for an OK result is 600 W X 370 H pixels.
    - Accepted file types: .bmp .jpg .gif .tif .pdf.
    - Users can't upload images smaller than 30kb or larger than 5MB.

--- 

## Create a certificate profile  

A certificate profile resource is the logical container of the certificates that are issued to you for signing.

### Naming constraints for certificate profiles

Certificate profile names have some constraints.

A certificate profile name must:

- Contain from 5 to 100 alphanumeric characters.
- Begin with a letter, end with a letter or number, and not contain consecutive hyphens.
- Be unique within the account.

A certificate profile name is:

- In the same Azure region as the account, by default inheritance.
- Not case-sensitive (*ABC* is the same as *abc*).

# [Azure portal](#tab/certificateprofile-portal)

To create a certificate profile in the Azure portal:

1. In the Azure portal, go to your new Artifact Signing account.
2. On the Artifact Signing account **Overview** pane or on the resource menu under **Objects**, select **Certificate profiles**.
3. On the command bar, select **Create** and select a certificate profile type.

   :::image type="content" source="media/artifact-signing-certificate-profile-types.png" alt-text="Screenshot that shows the Artifact Signing certificate profile types to choose from.":::
4. On **Create certificate profile**, provide the following information:

   a. For **Certificate Profile Name**, enter a unique name.

      For more information, see [Naming constraints for certificate profiles](#naming-constraints-for-certificate-profiles).

      The value for **Certificate Type** is autopopulated based on the certificate profile type you selected.
   
   b. For **Verified CN and O**, select an identity validation that must be displayed on the certificate.
   - If the street address must be displayed on the certificate, select the **Include street address** checkbox.
   - If the postal code must be displayed on the certificate, select the **Include postal code** checkbox.

      The values for the remaining fields are autopopulated based on your selection for **Verified CN and O**.

      A generated **Certificate Subject Preview** shows the preview of the certificate that will be issued.
5. Select **Create**.

   :::image type="content" source="media/artifact-signing-certificate-profile-creation.png" alt-text="Screenshot that shows the Create certificate profile pane." lightbox="media/artifact-signing-certificate-profile-creation.png":::

# [Azure CLI](#tab/certificateprofile-cli)

### Prerequisites

You need the identity validation ID for the entity that the certificate profile is being created for. Complete these steps find your identity validation ID in the Azure portal.

1. In the Azure portal, go to your Artifact Signing account.
2. On the Artifact Signing account **Overview** pane or on the resource menu under **Objects**, select **Identity validations**.
3. Select the hyperlink for the relevant entity. On the **Identity validation** pane, you can copy the value for **Identity validation Id**.

   :::image type="content" source="media/artifact-signing-identity-validation-id.png" alt-text="Screenshot that shows copying the identity validation ID for an Artifact Signing account." lightbox="media/artifact-signing-identity-validation-id.png":::

To create a certificate profile by using the Azure CLI:

1. Create a certificate profile by using the following command:

```azurecli
az artifact-signing certificate-profile create -g MyResourceGroup --a
   account-name MyAccount -n MyProfile --profile-type PublicTrust --identity-validation-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

   For more information, see [Naming constraints for certificate profiles](#naming-constraints-for-certificate-profiles).

2. Create a certificate profile that includes optional fields (street address or postal code) in the subject name of the certificate by using the following command:

  ```azurecli
  az artifact-signing certificate-profile create -g MyResourceGroup --account-name MyAccount -n MyProfile --profile-type PublicTrust --identity-validation-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --include-street true
   ```

3. Verify that you successfully created a certificate profile by using the following command:

  ```azurecli
  az artifact-signing certificate-profile show -g myRG --account-name MyAccount -n  MyProfile
   ```

The following table lists *helpful commands* to use when you create a certificate profile by using the Azure CLI:

| Command                                                                                                    | Description                                                                           |
| :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `az artifact-signing certificate-profile create -–help`                                                    | Shows help for sample commands, and shows detailed parameter descriptions.            |
| `az artifact-signing certificate-profile list -g MyResourceGroup --account-name MyAccount`                 | Lists all certificate profiles that are associated with an Artifact Signing account.  |
| `az artifact-signing certificate-profile show -g MyResourceGroup --account-name MyAccount -n MyProfile`    | Gets the details for a certificate profile.                                           |

---

## Clean up resources

# [Azure portal](#tab/deleteresources-portal)

To delete Artifact Signing resources by using the Azure portal:

### Delete a certificate profile

1. In the Azure portal, go to your Artifact Signing account.
2. On the Artifact Signing account **Overview** pane or on the resource menu under **Objects**, select **Certificate profiles**.
3. On **Certificate profiles**, select the certificate profile that you want to delete.
4. On the command bar, select **Delete**.

> [!NOTE]
> This action stops any signing that's associated with the certificate profile.

### Delete an Artifact Signing account

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the search box, enter and then select **Artifact Signing Accounts**.
3. On **Artifact Signing Accounts**, select the Artifact Signing account that you want to delete.
4. On the command bar, select **Delete**.

> [!NOTE]
> This action removes all certificate profiles that are linked to this account. Any signing processes that are associated with the certificate profiles stops.

# [Azure CLI](#tab/adeleteresources-cli)

To delete Artifact Signing resources by using the Azure CLI:

### Delete a certificate profile

To delete an Artifact Signing certificate profile, run this command:

```azurecli
az artifact-signing certificate-profile delete -g MyResourceGroup --account-name MyAccount -n MyProfile
```

> [!NOTE]
> This action stops any signing that's associated with the certificate profile.

### Delete an Artifact Signing account

You can use the Azure CLI to delete Artifact Signing resources.

To delete an Artifact Signing account, run this command:

```azurecli
az artifact-signing delete -n MyAccount -g MyResourceGroup
```

> [!NOTE]
> This action removes all certificate profiles that are linked to this account. Any signing processes that are associated with the certificate profiles stops.

---

## Related content

In this quickstart, you created an Artifact Signing account, an identity validation request, and a certificate profile. To learn more about Artifact Signing and to start your signing journey, see these articles:

- Learn more about [signing integrations](how-to-signing-integrations.md).
- Learn more about the [trust models that Artifact Signing supports](concept-trust-models.md).
- Learn more about [certificate management](concept-certificate-management.md).
- Need assistance with your setup:
    - Reach out via Azure Support through Azure portal.
    - Post your query on Stack Overflow or Microsoft Q&A, use the tag: artifact-signing. 
        - Identity Validation issues can only be addressed with Stack Overflow or Microsoft Q&A.
