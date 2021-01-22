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
7. If there are validation issues, fix them and select **Create**.

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
   - **Policy signer certificates file**: upload the policy signer certificates file to configure the attestation provider with signed policies. Look at some [examples of policy signer certificates](/azure/attestation/policy-signer-examples) for more information.

6. After you provide the required inputs, select **Review+Create**.
7. If there are validation issues, fix them and select **Create**.

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

### View policy signer certificates

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Download policy signer certificates** (The button will be disabled for the attestation providers created without policy signing requirement)
6.	The text file downloaded will have all certs in a JWS format.
a.	Verify the certificates count and certs downloaded.

### Add policy signer certificate

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Add** in the top menu (The button will be disabled for the attestation providers created without policy signing requirement)
6.	Upload policy signer certificate file and click **Add**. See examples [here](/azure/attestation/policy-signer-examples)

### Delete policy signer certificate

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Delete** in the top menu (The button will be disabled for the attestation providers created without policy signing requirement)
6.	Upload policy signer certificate file and click **Delete**. See examples [here](/azure/attestation/policy-signer-examples) 

## Attestation policy

### View attestation policy

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Select the preferred **Attestation Type** and view the **Current policy**

### Configure attestation policy

#### When attestation provider is created without policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Click **Configure** in the top menu
6.	When the attestation provider is created without policy signing requirement, user can upload a policy in **JWT** or **Text** format
7.	Select **Policy Format** as **JWT**
8.	Upload policy file with policy content in an **unsigned/signed JWT** format and click **Save**. See examples [here](/azure/attestation/policy-examples)
	
	For file upload option, policy preview will be shown in text format and policy preview is not editable.

7.	Click **Refresh** in the top menu to view the configured policy

##### Upload policy in Text format

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Click **Configure** in the top menu
6.	When the attestation provider is created without policy signing requirement, user can upload a policy in **JWT** or **Text** format
7.	Select **Policy Format** as **Text**
8.	Upload policy file with content in **Text** format or enter policy content in text area and click **Save**. See examples [here](/azure/attestation/policy-examples)

	For file upload option, policy preview will be shown in text format and policy preview is not editable.

8.	Click **Refresh** to view the configured policy

#### When attestation provider is created with policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Click **Configure** in the top menu
6.	When the attestation provider is created with policy signing requirement, user can upload a policy only in **signed JWT format**
7.	Upload policy file is **signed JWT format** and click **Save**. See examples [here](/azure/attestation/policy-examples)

	For file upload option, policy preview will be shown in text format and policy preview is not editable.
	
8.	Click **Refresh** to view the configured policy

 










