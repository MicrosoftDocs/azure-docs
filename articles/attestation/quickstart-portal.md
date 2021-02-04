---
title: Set up Azure Attestation with Azure portal
description: How to set up and configure an attestation provider using Azure portal.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Quickstart: Set up Azure Attestation with Azure portal

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Follow the below steps to manage an attestation provider using Azure portal.

## 1. Attestation provider

### 1.1 Create an attestation provider

#### 1.1.1 To configure the provider with unsigned policies

1.	From the Azure portal menu, or from the Home page, select **Create a resource**
2.	In the Search box, enter **attestation**
3.	From the results list, choose **Microsoft Azure Attestation**
4.	On the Microsoft Azure Attestation page, choose **Create**
5.	On the Create attestation provider page, provide the following inputs:
	
	**Subscription**: Choose a subscription
	
	**Resource Group**: select an existing resource group or choose **Create new** and enter a resource group name
	
	**Name**: A unique name is required

	**Location**: choose a location 
	
	**Policy signer certificates file**: Do not upload policy signer certificates file to configure the provider with unsigned policies 
6.	After providing the required inputs, click **Review+Create**
7.	Fix validation issues if any and click **Create**.

#### 1.1.2 To configure the provider with signed policies

1.	From the Azure portal menu, or from the Home page, select **Create a resource**
2.	In the Search box, enter **attestation**
3.	From the results list, choose **Microsoft Azure Attestation**
4.	On the Microsoft Azure Attestation page, choose **Create**
5.	On the Create attestation provider page, provide the following information:
	
	a. **Subscription**: Choose a subscription
	
	b. **Resource Group**: select an existing resource group or choose **Create new** and enter a resource group name
	
	c. **Name**: A unique name is required

	d. **Location**: choose a location 
	
	e. **Policy signer certificates file**: To configure the attestation provider with policy signing certs, upload certs file. See examples [here](./policy-signer-examples.md) 
6.	After providing the required inputs, click **Review+Create**
7.	Fix validation issues if any and click **Create**.

### 1.2 View attestation provider

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name and select it

### 1.3 Delete attestation provider

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the checkbox and click **Delete**
4.	Type yes and click **Delete**
[OR]
1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Delete** in the top menu and click **Yes**


## 2. Attestation policy signers

### 2.1 View policy signer certificates

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Download policy signer certificates** (The button will be disabled for the attestation providers created without policy signing requirement)
6.	The text file downloaded will have all certs in a JWS format.
a.	Verify the certificates count and certs downloaded.

### 2.2 Add policy signer certificate

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Add** in the top menu (The button will be disabled for the attestation providers created without policy signing requirement)
6.	Upload policy signer certificate file and click **Add**. See examples [here](./policy-signer-examples.md)

### 2.3 Delete policy signer certificate

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy signer certificates** in left-side resource menu or in the bottom pane
5.	Click **Delete** in the top menu (The button will be disabled for the attestation providers created without policy signing requirement)
6.	Upload policy signer certificate file and click **Delete**. See examples [here](./policy-signer-examples.md) 

## 3. Attestation policy

### 3.1 View attestation policy

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Select the preferred **Attestation Type** and view the **Current policy**

### 3.2 Configure attestation policy

#### 3.2.1 When attestation provider is created without policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Click **Configure** in the top menu
6.	When the attestation provider is created without policy signing requirement, user can upload a policy in **JWT** or **Text** format
7.	Select **Policy Format** as **JWT**
8.	Upload policy file with policy content in an **unsigned/signed JWT** format and click **Save**. See examples [here](./policy-examples.md)
	
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
8.	Upload policy file with content in **Text** format or enter policy content in text area and click **Save**. See examples [here](./policy-examples.md)

	For file upload option, policy preview will be shown in text format and policy preview is not editable.

8.	Click **Refresh** to view the configured policy

#### 3.2.2 When attestation provider is created with policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Policy** in left-side resource menu or in the bottom pane
5.	Click **Configure** in the top menu
6.	When the attestation provider is created with policy signing requirement, user can upload a policy only in **signed JWT format**
7.	Upload policy file is **signed JWT format** and click **Save**. See examples [here](./policy-examples.md)

	For file upload option, policy preview will be shown in text format and policy preview is not editable.
	
8.	Click **Refresh** to view the configured policy

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Attest an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)

