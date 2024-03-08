---
title: Allocate credits to educators - Azure Education Hub
description: This article will show IT Administrators at a University how to assign credits to Educators to use in Education Hub labs
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: quickstart
ms.date: 2/6/2023
ms.custom: template-quickstart
---

# Quickstart: Allocate credits to educators

This quickstart article explains how to allocate credit to educators in the Azure Education Hub. This article is meant for IT Administrators to give credits to educators at their university to spend on creating labs for their students.

## Prerequisites

- Signed up for the Azure for Teaching Paid Program
- Signed MCA
- In direct field led motion
- Have billing profile and billing account
- Have desired Educators owners on the billing profile

## Visit Education Hub in the Azure portal

The first step in assigning credit to educators is to navigate to the Education section of the Azure portal

1. Go to portal.azure.com
2. Sign in with the account that is associated with Azure for Teaching Paid
3. Search for "Education" in the search bar

You will now be in Education Hub.

## Add a credit

Now that you are in Education Hub, you can provision a credit to Educators at your university. Assigning credit to an Educator means that you are allowing them to use "x" amount of money from your billing profile to use in Education Hub creating labs. Ensure that the desired Educator you want to assign the credit to are in the same tenant as you and are owners of the billing profile you want to create the credit on.

1. Navigate to the "Credits" section of Education Hub
2. Select "Add" to begin adding a new Credit
3. Choose the billing profile you want the educators to draw the money from
4. Set the amount of credit. 

   > [!NOTE] 
   > Due to latency issues, there may be cases where the money spent is slightly higher than the set budget.
   
5. Set the date these credits will expire. You will be able to extend the date and modify credits after creation
6. Select next and confirm details
7. Finally, select the "create" button to finalize the credits

Congratulations! You just created a Credit that your Educators can use in labs to distribute money to students to deploy Azure Resources.

## Modify credits

After you have created credits, they will be shown as rows in the "Credits" tab. You can modify these credits after creation if needed.

1. Select the edit button to the right of the credit
2. You will be able to modify the end date and credit amount. 

   > [!NOTE]
   > You can only extend the credit end date.
   
3. You can also modify which Educator's have access to the Credit. To do this, navigate to Cost Management and add or remove Educators from the billing profile associated with the credit.

The chosen Educators should now receive an email inviting them to visit the Education Hub to begin using these Credits. Ensure the Educators sign in to the Azure portal with the account associated with the credit's billing profile.

## Next steps

> [!div class="nextstepaction"]
> [Create an assignment and allocate credit](create-assignment-allocate-credit.md)
