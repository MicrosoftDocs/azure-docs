---
title: 'Quickstart: Set up Azure Attestation by using the Azure portal'
description: In this quickstart, you'll learn how to set up and configure an attestation provider by using the Azure portal.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: quickstart
ms.date: 11/14/2022
ms.author: mbaldwin


---
# Quickstart: Set up Azure Attestation by using the Azure portal

Follow this quickstart to get started with Azure Attestation. Learn how to manage an attestation provider, a policy signer, and a policy by using the Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. The user creating an attestation provider should have sufficient access levels on the subscription to create a resource (e.g: owner/contributor). For more information, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

## Attestation provider

In this section, you'll create an attestation provider and configure it with either unsigned policies or signed policies. You'll also learn how to view and delete the attestation provider.

### Create and configure the provider with unsigned policies

1. Go to the Azure portal menu or the home page and select **Create a resource**.
1. In the search box, enter **attestation**.
1. In the results list, select **Microsoft Azure Attestation**.
1. On the **Microsoft Azure Attestation** page, select **Create**.
1. On the **Create attestation provider** page, provide the following inputs:

   - **Subscription**: Choose a subscription.
   - **Resource Group**: Select an existing resource group, or select **Create new** and enter a resource group name.
   - **Name**: Enter a unique name.
   - **Location**: Choose a location.
   - **Policy signer certificates file**: Don't upload the policy signer certificates file to configure the provider with unsigned policies.

1. After you provide the required inputs, select **Review+Create**.
1. Fix any validation issues and select **Create**.

### Create and configure the provider with signed policies

1. Go to the Azure portal menu or the home page and select **Create a resource**.
1. In the search box, enter **attestation**.
1. In the results list, select **Microsoft Azure Attestation**.
1. On the **Microsoft Azure Attestation** page, select **Create**.
1. On the **Create attestation provider** page, provide the following information:

   - **Subscription**: Choose a subscription.
   - **Resource Group**: Select an existing resource group, or select **Create new** and enter a resource group name.
   - **Name**: Enter a unique name.
   - **Location**: Choose a location.
   - **Policy signer certificates file**: Upload the policy signer certificates file to configure the attestation provider with signed policies. [See examples of policy signer certificates](./policy-signer-examples.md).

1. After you provide the required inputs, select **Review+Create**.
1. Fix any validation issues and select **Create**.

### View the attestation provider

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name and select it.

### Delete the attestation provider

There are two ways to delete the attestation provider. You can:

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name.
1. Select the check box and select **Delete**.
1. Enter **yes** and select **Delete**.

Or you can:

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name.
1. Select the attestation provider and go to the overview page.
1. Select **Delete** on the menu bar and select **Yes**.

## Attestation policy signers

Follow the steps in this section to view, add, and delete policy signer certificates.

### View the policy signer certificates

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name.
1. Select the attestation provider and go to the overview page.
1. Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane. If you see a prompt to select certificate for authentication, select cancel to proceed.
1. Select **Download policy signer certificates**. The button will be disabled for attestation providers created without the policy signing requirement.
1. The downloaded text file will have all certificates in a JWS format.
1. Verify the certificate count and the downloaded certificates.

### Add the policy signer certificate

1.	Go to the Azure portal menu or the home page and select **All resources**.
1.	In the filter box, enter the attestation provider name.
1.	Select the attestation provider and go to the overview page.
1.	Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane. If you see a prompt to select certificate for authentication, select cancel to proceed.
1.	Select **Add** on the upper menu. The button will be disabled for attestation providers created without the policy signing requirement.
1.	Upload the policy signer certificate file and select **Add**. [See examples of policy signer certificates](./policy-signer-examples.md).

### Delete the policy signer certificates

1.	Go to the Azure portal menu or the home page and select **All resources**.
1.	In the filter box, enter the attestation provider name.
1.	Select the attestation provider and go to the overview page.
1.	Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane. If you see a prompt to select certificate for authentication,  Select **Cancel** to proceed.
1.	Select **Delete** on the upper menu. The button will be disabled for attestation providers created without the policy signing requirement.
1.	Upload the policy signer certificate file and select **Delete**. [See examples of policy signer certificates](./policy-signer-examples.md). 

## Attestation policy

This section describes how to view an attestation policy and how to configure policies that were created with and without a policy signing requirement.

### View an attestation policy

1.	Go to the Azure portal menu or the home page and select **All resources**.
1.	In the filter box, enter the attestation provider name.
1.	Select the attestation provider and go to the overview page.
1.	Select **Policy** on the resource menu on the left side of the window or on the lower pane. If you see a prompt to select certificate for authentication, select **Cancel**  to proceed.
1.	Select the preferred **Attestation Type** and view the **Current policy**.

### Configure an attestation policy

Follow these steps to upload a policy in JWT or text format if the attestation provider was created without a policy signing requirement.

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name.
1. Select the attestation provider and go to the overview page.
1. Select **Policy** on the resource menu on the left side of the window or on the lower pane. If you see a prompt to select certificate for authentication, select **Cancel**  proceed.
1. Select **Configure** on the upper menu.
1. Select **Policy Format** as **JWT** or as **Text**.

   If the attestation provider was created without policy signing requirement, the user can upload a policy in either **JWT** or **Text** format.

      - If you chose JWT format, upload the policy file with the policy content in **unsigned/signed JWT** format and select **Save**. [See policy examples](./policy-examples.md).
      - If you chose text format, upload the policy file with the content in **Text** format or enter the policy content in the text area and select **Save**. [See policy examples](./policy-examples.md).

   For the file upload option, the policy preview is shown in text format and isn't editable.

1. Select **Refresh** on the upper menu to view the configured policy.


If the attestation provider was created with a policy signing requirement,  follow these steps to upload a policy in JWT format.

1.	Go to the Azure portal menu or the home page and select **All resources**.
1.	In the filter box, enter the attestation provider name.
1.	Select the attestation provider and go to the overview page.
1.	Select **Policy** on the resource menu on the left side of the window or on the lower pane.
1.	Select **Configure** on the upper menu.
1.	Upload the policy file in **signed JWT format** and select **Save**. [See policy examples](./policy-examples.md).

    If the attestation provider was created with a policy signing requirement, the user can upload a policy only in **signed JWT format**.

    For the file upload option, the policy preview is shown in text format and isn't editable.
	
1.	Select **Refresh** to view the configured policy.

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Attest an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)

