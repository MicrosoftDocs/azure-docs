---
title: Set up Azure Attestation with Azure Portal
description: How to set up and configure an attestation provider using Azure Portal.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Quickstart: Set up Azure Attestation with Azure Portal

Follow the below steps to manage an attestation provider using Azure Portal.

## Attestation provider

### Create an attestation provider

#### When policy signing is not required

1.	From the Azure portal menu, or from the Home page, select Create a resource
2.	In the Search box, enter attestation
3.	From the results list, choose Microsoft Azure Attestation
4.	On the Microsoft Azure Attestation section, choose Create
5.	On the Create attestation provider section provide the following information:
a.	Name: A unique name is required
b.	Subscription: Choose a subscription
c.	Under Resource Group, 
choose Create new and enter a resource group name, if you already have a subscription ready to use.
OR if EnS look for Resource group: EnS. SRE.Prod.1(subscription) /BugBash(or reach out to Prakhar Srivastava)
OR if Azure Security look for the test subscription (or reach out to Sindhuri Dittakavi)

d.	In the Location pull-down menu, choose a location 
e.	Do not upload policy signer certificates file if policy signing is not required
6.	After providing the information above, select Review+Create 
7.	Fix validation issues if any and click Create.

#### When policy signing is required

1. From the Azure portal menu, or from the Home page, select Create a resource
2.	In the Search box, enter attestation
3.	From the results list, choose Microsoft Azure Attestation
4.	On the Microsoft Azure Attestation section, choose Create
5.	On the Create attestation provider section provide the following information:
a.	Name: A unique name is required
b.	Subscription: Choose a subscription
c.	Under Resource Group, 
choose Create new and enter a resource group name
Or use BugBash/, you should already be added to one of the resource groups.
d.	In the Location pull-down menu, choose a location 
e.	To configure the attestation provider with policy signing certs, upload certs file.
For Policy signer certificates file either use one provided here: https://microsoft-my.sharepoint-df.com/:f:/p/prsriva/Em79jFyxTpNKpg5CzvNkZvEBG7kWpt0yI4sqiuf8qJE4qA?e=qqkqdP
             		OR see how to generate signing certs

For management of policy signers, please see Scenario 2: Policy signer certificates flows
		Learn more about an attestation policy and benefits of policy signing here

6.	After providing the information above, select Review+Create 
7.	Fix validation issues if any and click Create.
8.	At this point, your Azure account is authorized to perform operations on this attestation provider.

### View attestation provider

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name and select it

### Delete attestation provider

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Select the checkbox and click Delete button
4.	Type yes and click Delete button in the top menu

[OR]
1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on Delete button in the top menu and click yes


## Attestation policy signers

### View policy signer certificates

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy signer certificates in left-side resource menu or in the bottom pane
5.	Click Download policy signer certificates
6.	The text file downloaded will have all certs in a JWS format.
a.	Verify the count and cert used.

### Add policy signer certificate

Note*: Please use the test data provided, self-created cert functionality has not been added to the tooling.
1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy signer certificates in left-side resource menu or in the bottom pane
5.	Click Add button in the top menu
6.	Upload policy signer certificate file and click Add 

### Delete policy signer certificate

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy signer certificates in left-side resource menu or in the bottom pane
5.	Click Delete button in the top menu
6.	Upload policy signer certificate file and click Delete
## Attestation policy

### View attestation policy

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy in left-side resource menu or in the bottom pane

You can also find certs and policies here: https://microsoft-my.sharepoint-df.com/:f:/p/prsriva/Em79jFyxTpNKpg5CzvNkZvEBG7kWpt0yI4sqiuf8qJE4qA?e=qqkqdP

Note: On first creation of the attestation provider and accessing the policy, a pop up with certificate selection will come up. Kindly choose your Windows Hello PIN cert. This is not an expected behavior and a bug has been filed. 
Failing to choose to the right cert will need you to delete the resource and recreate the attestation service.

### Configure attestation policy

#### When attestation provider is created without policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy in left-side resource menu or in the bottom pane
5.	Click Configure button in the top menu
6.	When the attestation provider is not configured with policy signing, user can upload a policy in JWT or Text format. 
Upload policy file with policy content in an unsigned/signed JWT format and click Save. 
Check instructions in portal UI for policy format.

Note: For file upload option, policy preview will be shown in text format and policy preview is not editable.

You can find test data for certs and policies here: https://microsoft-my.sharepoint-df.com/:f:/p/prsriva/Em79jFyxTpNKpg5CzvNkZvEBG7kWpt0yI4sqiuf8qJE4qA?e=qqkqdP

Or see how to generate signing cert and JWS token

7.	Click Refresh to view the updated policy

##### Upload policy in Text format

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy in left-side resource menu or in the bottom pane
5.	Click Configure button in the top menu
6.	When the attestation provider is not configured with policy signing, user can upload a policy in JWT or Text format. 
Upload policy file with content in Text format or enter policy content in text area.

Note: For file upload option, policy preview will be shown in text format and policy preview is not editable.

You can find test data for certs and policies here: https://microsoft-my.sharepoint-df.com/:f:/p/prsriva/Em79jFyxTpNKpg5CzvNkZvEBG7kWpt0yI4sqiuf8qJE4qA?e=qqkqdP

OR update your policy https://docs.microsoft.com/en-us/azure/attestation/author-sign-policy

7.	Click Save. 
8.	Click Refresh to view the updated policy

#### When attestation provider is created with policy signing requirement

##### Upload policy in JWT format

1.	From the Azure portal menu, or from the Home page, select All resources
2.	In the filter box, enter attestation provider name
3.	Click on the attestation provider and navigate to overview page
4.	Click on the policy in left-side resource menu or in the bottom pane
5.	Click Configure button in the top menu
6.	When the attestation provider is configured with policy signing, user can upload a policy only in signed JWT format. Upload policy file and click Save. 
Check instructions in portal UI for policy format.

Note: For file upload option, policy preview will be shown in text format and policy preview is not editable.

You can find test data for certs and policies here: https://microsoft-my.sharepoint-df.com/:f:/p/prsriva/Em79jFyxTpNKpg5CzvNkZvEBG7kWpt0yI4sqiuf8qJE4qA?e=qqkqdP

Or see how to generate signing cert and JWS token

7.	Click Refresh to view the updated policy

 










