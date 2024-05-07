---
title: Quickstart Trusted Signing 
description: Quickstart onboarding to Trusted Signing to sign your files 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: quickstart 
ms.date: 04/12/2024 
ms.custom: references_regions 
---


# Quickstart: Onboarding to Trusted Signing

Trusted Signing is a fully managed end to end signing service.  In this Quickstart, you create the following three Trusted Signing resources:

- Trusted Signing account
- Identity Validation
- Certificate Profile

Trusted Signing provides users with both an Azure portal and Azure CLI extension experience to create and manage their Trusted Signing resources. **Identity Validation can only be completed in the Azure portal – it can not be completed with Azure CLI.**

## Prerequisites

An existing Azure Tenant ID and Azure subscription. [Create Azure tenant](/azure/active-directory/fundamentals/create-new-tenant#create-a-new-tenant-for-your-organization) and [Create Azure subscription](../cost-management-billing/manage/create-subscription.md#create-a-subscription) before you begin if you don’t already have.


## Register the Trusted Signing resource provider

Before using Trusted Signing, you must first register the Trusted Signing resource provider.

**How to register**
A resource provider is a service that supplies Azure resources. Use the Azure portal or Azure CLI az provider register command to register the Trusted Signing resource provider, 'Microsoft.CodeSigning'.

# [Azure portal](#tab/registerrp-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From either the Azure portal search bar or under All services, select **Subscriptions**.
3. Select your **Subscription**, where you intend to create Trusted Signing resources.

:::image type="content" source="media/trusted-signing-subscription-resource-provider.png" alt-text="Screenshot of trusted-signing-subscription-resource-provider." lightbox="media/trusted-signing-subscription-resource-provider.png":::

4. From the list of resource providers, select **Microsoft.CodeSigning**. By default the resource provider is NotRegistered.
5. Click on the ellipsis, select **Register**.
6. The status changes to **Registered**.

:::image type="content" source="media/trusted-signing-resource-provider-registration.png" alt-text="Screenshot of trusted-signing-resource-provider-registration." lightbox="media/trusted-signing-resource-provider-registration.png":::

# [Azure CLI](#tab/registerrp-cli)

1. If you're using a local installation, login to Azure CLI using the `az login` command.  

2. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

3. When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see Use extensions with the [Azure CLI](/cli/azure/azure-cli-extensions-overview). Additional information for Trusted Signing CLI extension is available at [Trusted Signing Service](https://learn.microsoft.com/cli/azure/service-page/trusted%20signing%20service?view=azure-cli-latest)

4. To see the versions of Azure CLI and dependent libraries that are installed, use the `az version` command.
•   To upgrade to the latest version, use the following command:

```bash
az upgrade [--all {false, true}]
   [--allow-preview {false, true}]
    [--yes]
```

5. To set your default subscription ID, use the `az account set -s <subscriptionId>` command.

6. You can register Trusted Signing resource provider with the command below:

```
az provider register --namespace "Microsoft.CodeSigning"
```

7. You can verify that registration is complete with the command below: 

```
az provider show --namespace "Microsoft.CodeSigning"
```

8. You can add the extension for Trusted Signing with the command below:
```
az extension add --name trustedsigning
```

---

## Create a Trusted Signing account

A Trusted Signing account is a logical container of identity validation and certificate profile resources.

# [Azure portal](#tab/account-portal)

The resources must be created in Azure regions where Trusted Signing is currently available. Refer to the table below for the current Azure regions with Trusted Signing resources:  

| Region                               | Region Class Fields  | Endpoint URI Value                   |
| :----------------------------------- | :------------------- |:-------------------------------------|
| East US                              | EastUS               | `https://eus.codesigning.azure.net`  |
| West US                              | WestUS               | `https://wus.codesigning.azure.net`  |
| West Central US                      | WestCentralUS        | `https://wcus.codesigning.azure.net` |
| West US 2                            | WestUS2              | `https://wus2.codesigning.azure.net` |
| North Europe                         | NorthEurope          | `https://neu.codesigning.azure.net`  |
| West Europe                          | WestEurope           | `https://weu.codesigning.azure.net`  |


1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From either the Azure portal menu or the Home page, select **Create a resource**.
3. In the Search box, enter **Trusted Signing account**.
4. From the results list, select **Trusted Signing account**.
5. On the Trusted Signing account section, select **Create**. The Create Trusted Signing account section displays.
6. In the **Subscription** pull-down menu, select a subscription.
7. In the **Resource group** field, select **Create new** and enter a resource group name.
8. In the **Account Name** field, enter a unique account name. (See the below Certificate Profile naming constraints for naming requirements.)
9. In the **Region** pull-down menu, select a region.
10. In the **Pricing** tier pull-down menu, select a pricing tier.
11. Select the **Review + Create** button.

    :::image type="content" source="media/trusted-signing-account-creation.png" alt-text="Screenshot of trusted-signing-account-creation." lightbox="media/trusted-signing-account-creation.png":::

12. After successfully creating your Trusted Signing account, select **Go to resource**.  

**Trusted Signing account naming constraints**:

- Between 3-24 alphanumeric characters.
- Begin with a letter, end with a letter or digit, and not contain consecutive hyphens.
- Case insensitive (“Abc” is the same as “abc”).
- Account names beginning with "one" are rejected by ARM.

# [Azure CLI](#tab/account-cli)

The resources must be created in Azure regions where Trusted Signing is currently available. Refer to the table below for the current Azure regions with Trusted Signing resources:

| Region                               | Region Class Fields  | Endpoint URI Value                   |
| :----------------------------------- | :------------------- |:-------------------------------------|
| East US                              | EastUS               | `https://eus.codesigning.azure.net`  |
| West US                              | WestUS               | `https://wus.codesigning.azure.net`  |
| West Central US                      | WestCentralUS        | `https://wcus.codesigning.azure.net` |
| West US 2                            | WestUS2              | `https://wus2.codesigning.azure.net` |
| North Europe                         | NorthEurope          | `https://neu.codesigning.azure.net`  |
| West Europe                          | WestEurope           | `https://weu.codesigning.azure.net`  |


Complete the following steps to create a Trusted Signing account with Azure CLI:

1. Create a resource group using the following command (Skip this step if you plan to use an existing resource group):

```
az group create --name MyResourceGroup --location EastUS
```

2. Create a unique Trusted Signing account using the following command. (See the below Certificate Profile naming constraints for naming requirements.)

```
trustedsigning create -n MyAccount -l eastus -g MyResourceGroup --sku Basic
```

Or

```
trustedsigning create -n MyAccount -l eastus -g MyResourceGroup --sku Premium
```
3. Verify your Trusted Signing account using the `trustedsigning show -g MyResourceGroup -n MyAccount` command.

>[!Note]
>If you are using older version of CLI from Trusted Signing Private Preview, your account is defaulted to Basic SKU. To use Premium either upgrade CLI to latest version or use Azure portal to create account.

**Trusted Signing account naming constraints**:

- Between 3-24 alphanumeric characters.
- Begin with a letter, end with a letter or digit, and not contain consecutive hyphens.
- Case insensitive (“Abc” is the same as “abc”).
- Account names beginning with "one" are rejected by ARM.

**Helpful commands**:

| Command                                                                                  | Description                               |  
|:-----------------------------------------------------------------------------------------|:------------------------------------------|
| `trustedsigning -h`                                                                      | Show help commands and detailed options   |
| `trustedsigning show -n MyAccount  -g MyResourceGroup`                                   | Show the details of an account            |
| `trustedsigning update -n MyAccount -g MyResourceGroup --tags "key1=value1 key2=value2"` | Update tags                               |
| `trustedsigning list -g MyResourceGroup`                                                 | To list accounts under the resource group |


---

## Create an Identity Validation request

You can complete your own Identity Validation by filing out the request form with the information that should be included in the certificate.  Identity Validation can only be completed in the Azure portal – it can't be completed with Azure CLI.

> [!NOTE]
> You will not be able to create an identity validation if you do not have the appropriate role assigned. If the "New identity" button is greyed out on the Azure portal ensure you have the "Trusted Signing Identity Verifier role" in order to proceed with identity validation. 

Here are the steps to create an Identity Validation request:

1. Navigate to your new Trusted Signing account in the Azure portal.
2. Confirm you have the **Trusted Signing Identity Verifier role**.
    - To learn more about Role Based Access management (RBAC) access management, see [Assigning roles in Trusted Signing](tutorial-assign-roles.md).
3. From either the Trusted Signing account overview page or from Objects, select **Identity Validation**.
4. Select **New Identity Validation** > Public or Private.
    - Public identity validation is applicable to certificate profile types: Public Trust, Public Trust Test, VBS Enclave.
    - Private identity validation is applicable to certificate profile types: Private Trust, Private Trust CI Policy.
5. On the **New identity validation** screen, provide the following information:

| Input Fields       | Details     |
| :------------------- | :------------------- |
| **Organization Name**          | For Public Identity Validation, provide the Legal Business Entity to which the certificate will be issued. For Private Identity Validation, it defaults to your Azure Tenant Name.|
| **(Private Identity Type only) Organizational Unit**          | Enter the relevant information|
| **Website url**          | Enter the website that belongs to the Legal Business Entity.|
| **Primary Email**           | Enter the organization’s primary email address. A verification link is sent to this email address to verify it, ensure the email address can receive emails from external email addresses with links. The verification link expires in seven days.  |
| **Secondary Email**          | These email addresses must be different than the primary email address. For organizations, the domain must match the email address provided in primary email address field. ensure the email address can receive emails from external email addresses with links.|
| **Business Identifier**           |Enter a business identifier for the above Legal Business Entity.|
| **Seller ID**          | Only applicable to Microsoft Store customers. Find your Seller ID on Partner Center portal.|
| **Street, City, Country, State, Postal code**           | Enter the business address of the Legal Business Entity.|

6. **Certificate subject preview**:  The preview provides a snapshot of the information displayed in the certificate.
7. **Review and accept Trusted Signing Terms of Use**.  Terms of Use can be downloaded for review.  
8. Select the **Create** button.
9. Upon successful creation of the request, the Identity Validation request status changes to "In Progress".
10. If Additional documents are required, an email is sent and the request status changes to "Action Required".
11. Once the identity validation process is complete, the request status will change, and an email is sent with the updated status of the request.
    1. "Completed": When process is completed successfully.
    1. "Failed": When the process is not completed successfully. 

:::image type="content" source="media/trusted-signing-identity-validation-public.png" alt-text="Screenshot of trusted-signing-identityvalidation-public." lightbox="media/trusted-signing-identity-validation-public.png":::

:::image type="content" source="media/trusted-signing-identity-validation-private.png" alt-text="Screenshot of trusted-signing-identityvalidation-private." lightbox="media/trusted-signing-identity-validation-private.png":::

### Important information for Public Identity Validation

| Requirements         | Details     |
| :------------------- | :------------------- |
| Onboarding           | Trusted Signing at this time can only onboard Legal Business Entities that have verifiable tax history of three or more years. For a quicker onboarding process ensure public records for the Legal Entity being validated are upto date. |
| Accuracy             | Ensure you provide the correct information for Public Identity Validation. Any changes or typos require you to complete a new Identity Validation request and affect the associated certificates used for signing.|
| Additional documentation            | You are notified though email, if we need extra documentation to process the identity validation request. The documents can be uploaded in Azure portal. The email contains information about the file size requirements. Ensure the documents provided are latest.|
| Failure to perform email verification            | You are required to initiate a new Identity Validation request if you missed to verify your emaail address within 7 days of receiving the verification link.|
| Identity Validation status            | You are notified through email when there is an update to the Identity Validation status. You can also check the status in the Azure portal at any time. |
| Processing time            | Expect anywhere between 1-7 business days (or sometimes longer if we need extra documentation from you) to process your Identity Validation request.|

## Create a certificate profile  

A certificate profile resource is the logical container of the certificates that will be issued to you for signing.

# [Azure portal](#tab/certificateprofile-portal)

 To create a certificate profile in the Azure portal, follow these steps:

1. Navigate to your new trusted signing account in the Azure portal.
2. On the trusted signing account overview page or from Objects, select **Certificate Profile**.
3. On the **Certificate Profiles**, choose the certificate profile type from the pull-down menu.
    - Public identity validation is applicable to Public Trust, Public Trust Test.
    - Private identity validation is applicable to Private Trust, Private Trust CI Policy.
4. On the **Create certificate profile**, provide the following information:
•   **Certificate Profile Name**: A unique name is required. (See the below Certificate Profile naming constraints for naming requirements.)
•   **Certificate Type**: This field is autopopulated based on your selection.
•   In **Verified CN and O** pull-down menu, choose an identity validation that needs to be displayed on the certificate.
•   Include **street address**, select the box if this field must be included in the certificate.
•   Include **postal code**, select the box if this field must be included in the certificate.
•   Generated **Certificate Subject Preview** shows the preview of the certificate issued.
•   The values in remaining fields are autopopulated based on the selection in Verified CN and O.
•   Select **Create**.

:::image type="content" source="media/trusted-signing-certificate-profile-creation.png" alt-text="Screenshot of trusted-signing-certificateprofile-creation." lightbox="media/trusted-signing-certificate-profile-creation.png":::

**Certificate Profile naming constraints**:

- Between 5-100 alphanumeric characters.
- Begin with a letter, end with a letter or digit, and not contain consecutive hyphens.
- Unique within the account.
- Inherits region from the account.
- Case insensitive (“Abc” is the same as “abc”).

# [Azure CLI](#tab/certificateprofile-cli)

**Prerequisites**
You need the Identity Validation ID for the entity that the certificate profile is being created for. The below steps will guide you to obtain your Identity Validation ID from Azure Portal. 

1. Navigate to your Trusted Signing account in the Azure portal.
2. From either the Trusted Signing account overview page or from Objects, select **Identity Validation**.
3. Select the hyperlink for the relevant entity, from the panel on the right you can copy the **Identity validation Id**.

:::image type="content" source="media/trusted-signing-identity-validation-id.png" alt-text="Screenshot of trusted-signing-identity-validation-id." lightbox="media/trusted-signing-identity-validation-id.png":::



To create a certificate profile with Azure CLI, follow these steps:

1. Create a certificate profile using the following command:

```
trustedsigning certificate-profile create -g MyResourceGroup --a
    account-name MyAccount -n MyProfile --profile-type PublicTrust --identity-validation-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

- See the below Certificate Profile naming constraints for naming requirements.

2. Create a certificate profile that includes optional fields (street address or postal code) in subject name of certificate using the following command:

```
    trustedsigning certificate-profile create -g MyResourceGroup --account-name MyAccount -n MyProfile --profile-type PublicTrust --identity-validation-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --include-street true
```

3. Verify you successfully created a certificate profile by getting the Certificate Profile details using the following command:

```
trustedsigning certificate-profile show -g myRG --account-name MyAccount -n  MyProfile
```

**Certificate Profile naming constraints**:

- Between 5-100 alphanumeric characters.
- Begin with a letter, end with a letter or digit, and not contain consecutive hyphens.
- Unique within the account.
- Inherits region from the account.
- Case insensitive (“Abc” is the same as “abc”).

**Helpful commands**:

| Command                               | Description  | 
| :----------------------------------- | :------------------- |
| `trustedsigning certificate-profile create -–help`                            | Show help for sample commands and detailed parameter descriptions              |
| `trustedsigning certificate-profile list -g MyResourceGroup --account-name MyAccount`                            |List certificate profile under a Trusted Signing account          |
| `trustedsigning certificate-profile show -g MyResourceGroup --account-name MyAccount -n MyProfile`                            | Get details of a profile              |

---

## Clean up resources

# [Azure portal](#tab/deleteresources-portal)

- Delete the Trusted Signing account:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the Search box, enter **Trusted Signing account**.
3. From the results list, select **Trusted Signing account**.
4. On the Trusted Signing account section, select the Trusted Signing account to be deleted.
5. Select **Delete**.

>[!Note]
>This action removes all certificate profiles linked to this account, effectively halting the signing process associated with those specific certificate profiles.

- Delete the Certificate Profile:

1. Navigate to your trusted signing account in the Azure portal.
2. On the trusted signing account overview page or from Objects, select **Certificate Profile**.
3. On the **Certificate Profiles**, choose the certificate profile to be deleted.
4. Select **Delete**.

>[!Note]
> This action halts any signing associated with the corresponding certificate profiles.

# [Azure CLI](#tab/adeleteresources-cli)

- Delete the Trusted Signing account:

```
trustedsigning delete -n MyAccount -g MyResourceGroup
```

>[!Note]
>This action removes all certificate profiles linked to this account, effectively halting the signing process associated with those specific certificate profiles.

- Delete the certificate profile:

 ```
trustedsigning certificate-profile delete -g MyResourceGroup --account-name MyAccount -n MyProfile
```

>[!Note]
>This action halts any signing associated with the corresponding certificate profiles.

---

## Next steps

In this Quickstart, you created a Trusted Signing account, an Identity Validation and a Certificate Profile. To delve deeper into Trusted Signing and kickstart your signing journey, explore the following articles:

- [Learn more about the signing integrations.](how-to-signing-integrations.md)
- [Learn more about different Trust Models supported in Trusted Signing](concept-trusted-signing-trust-models.md)
- [Learn more about Certificate management](concept-trusted-signing-cert-management.md)

