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

Follow the below steps to manage an attestation provider using Azure portal.

## Attestation provider

### Create an attestation provider

#### To configure the provider with unsigned policies

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

#### To configure the provider with signed policies

1.	From the Azure portal menu, or from the Home page, select **Create a resource**
2.	In the Search box, enter **attestation**
3.	From the results list, choose **Microsoft Azure Attestation**
4.	On the Microsoft Azure Attestation page, choose **Create**
5.	On the Create attestation provider page, provide the following information:
	
	a. **Subscription**: Choose a subscription
	
	b. **Resource Group**: select an existing resource group or choose **Create new** and enter a resource group name
	
	c. **Name**: A unique name is required

	d. **Location**: choose a location 
	
	e. **Policy signer certificates file**: To configure the attestation provider with policy signing certs, upload certs file. See examples [here](/azure/attestation/policy-signer-examples) 
6.	After providing the required inputs, click **Review+Create**
7.	Fix validation issues if any and click **Create**.

### View attestation provider

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name and select it

### Delete attestation provider

1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the checkbox and click **Delete**
4.	Type yes and click **Delete**
[OR]
1.	From the Azure portal menu, or from the Home page, select **All resources**
2.	In the filter box, enter attestation provider name
3.	Select the attestation provider and navigate to overview page
4.	Click **Delete** in the top menu and click **Yes**


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

 










