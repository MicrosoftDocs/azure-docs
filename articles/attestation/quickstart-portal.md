---
title: 'Quickstart: Set up Azure Attestation by using the Azure portal'
description: In this quickstart, you'll learn how to set up and configure an attestation provider by using the Azure portal.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Quickstart: Set up Azure Attestation by using the Azure portal

Get started with Azure Attestation by following this quickstart to manage an attestation provider, a policy signer, and a policy by using the Azure portal.

## Attestation provider

In this section, you'll create an attestation provider and configure it with either unsigned policies or signed policies. This section also explains how to view and how to delete the attestation provider.

### Create and configure the provider with unsigned policies

1. Go to the Azure portal menu or the home page and select **Create a resource**.
2. In the search box, enter **attestation**.
3. On the results list, choose **Microsoft Azure Attestation**.
4. On the **Microsoft Azure Attestation** page, select **Create**.
5. On the **Create attestation provider** page, provide the following inputs:

   - **Subscription**: choose a subscription.
   - **Resource Group**: select an existing resource group or choose **Create new** and enter a resource group name.
   - **Name**: enter a unique name.
   - **Location**: choose a location.
   - **Policy signer certificates file**: don't upload the policy signer certificates file to configure the provider with unsigned policies.

6. After you provide the required inputs, select **Review+Create**.
7. If there are validation issues, fix them and then select **Create**.

### Create and configure the provider with signed policies

1. Go to the Azure portal menu or the home page and select **Create a resource**.
2. In the search box, enter **attestation**.
3. On the results list, choose **Microsoft Azure Attestation**.
4. On the **Microsoft Azure Attestation** page, choose **Create**.
5. On the **Create attestation provider** page, provide the following information:

   - **Subscription**: choose a subscription.
   - **Resource Group**: select an existing resource group or choose **Create new** and enter a resource group name.
   - **Name**: enter a unique name.
   - **Location**: choose a location.
   - **Policy signer certificates file**: upload the policy signer certificates file to configure the attestation provider with signed policies. See [examples of policy signer certificates](./policy-signer-examples.md).

6. After you provide the required inputs, select **Review+Create**.
7. If there are validation issues, fix them and then select **Create**.

### View the attestation provider

1. Go to the Azure portal menu or the home page and select **All resources**.
2. In the filter box, enter the attestation provider name and select it.

### Delete the attestation provider

There are two ways to delete the attestation provider. You can:

1. Go to the Azure portal menu or the home page and select **All resources**.
2. In the filter box, enter the attestation provider name.
3. Select the checkbox and choose **Delete**.
4. Enter **yes** and select **Delete**.

Or you can:

1. Go to the Azure portal menu or the home page and select **All resources**.
2. In the filter box, enter the attestation provider name.
3. Select the attestation provider and go to the overview page.
4. Select **Delete** on the menu bar and choose **Yes**.

## Attestation policy signers

Follow the steps in this section to view, add, and delete policy signer certificates.

### View the policy signer certificates

1. Go to the Azure portal menu or the home page and select **All resources**.
2. In the filter box, enter the attestation provider name.
3. Select the attestation provider and go to the overview page.
4. Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane.
5. Select **Download policy signer certificates**. The button will be disabled for attestation providers created without the policy signing requirement.
6. The downloaded text file will have all certificates in a JWS format.
1. Verify the certificate count and the downloaded certificates.

### Add the policy signer certificate

1.	Go to the Azure portal menu or the home page and select **All resources**.
2.	In the filter box, enter the attestation provider name.
3.	Select the attestation provider and go to the overview page.
4.	Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane.
5.	Select **Add** on the upper menu. The button will be disabled for attestation providers created without the policy signing requirement.
6.	Upload the policy signer certificate file and select **Add**. See [examples of policy signer certificates](./policy-signer-examples.md).

### Delete the policy signer certificates

1.	Go to the Azure portal menu or the home page and select **All resources**.
2.	In the filter box, enter the attestation provider name.
3.	Select the attestation provider and go to the overview page.
4.	Select **Policy signer certificates** on the resource menu on the left side of the window or on the lower pane.
5.	Select **Delete** on the upper menu. The button will be disabled for attestation providers created without the policy signing requirement.
6.	Upload the policy signer certificate file and select **Delete**. See [examples of policy signer certificates](./policy-signer-examples.md). 

## Attestation policy

This section describes how to view an attestation policy and how to configure policies that were created with and without a policy signing requirement.

### View an attestation policy

1.	Go to the Azure portal menu or the home page and select **All resources**.
2.	In the filter box, enter the attestation provider name.
3.	Select the attestation provider and go to the overview page.
4.	Select **Policy** on the resource menu on the left side of the window or on the lower pane.
5.	Select the preferred **Attestation Type** and view the **Current policy**.

### Configure an attestation policy

Follow these steps to upload a policy in JWT or Text format if the attestation provider was created without a policy signing requirement.

1. Go to the Azure portal menu or the home page and select **All resources**.
1. In the filter box, enter the attestation provider name.
1. Select the attestation provider and go to the overview page.
1. Select **Policy** on the resource menu on the left side of the window or on the lower pane.
1. Select **Configure** on the upper menu.
1. If the attestation provider was created without policy signing requirement, the user can upload a policy in either **JWT** or **Text** format.
   1. Select **Policy Format** as **JWT** or as **Text**.

   - If you chose JWT format, upload the policy file with the policy content in **unsigned/signed JWT** format and select **Save**. See [policy examples](./policy-examples.md).
   - If you chose Text format, upload the policy file with the content in **Text** format or enter the policy content in the text area and select **Save**. See [policy examples](./policy-examples.md).

   For the file upload option, the policy preview is shown in text format and isn't editable.

1. Select **Refresh** on the upper menu to view the configured policy.

Follow these steps to upload a policy in JWT format if the attestation provider was created with a policy signing requirement.

1.	Go to the Azure portal menu or the home page and select **All resources**.
2.	In the filter box, enter the attestation provider name.
3.	Select the attestation provider and go to the overview page.
4.	Select **Policy** on the resource menu on the left side of the window or on the lower pane.
5.	Select **Configure** on the upper menu.
6.	If the attestation provider was created with a policy signing requirement, the user can upload a policy only in **signed JWT format**.
    1. Upload the policy file in **signed JWT format** and select **Save**. See [policy examples](./policy-examples.md).

    For the file upload option, the policy preview is shown in text format and isn't editable.
	
8.	Select **Refresh** to view the configured policy.