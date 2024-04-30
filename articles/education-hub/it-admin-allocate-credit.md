---
title: Allocate credits to educators in the Azure Education Hub
description: This article shows IT administrators at a university how to assign credits to educators to use in Education Hub labs.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: quickstart
ms.date: 2/6/2023
ms.custom: template-quickstart
---

# Quickstart: Allocate credits to educators

In this quickstart, you allocate credits to educators in the Azure Education Hub. Educators use these credits in labs to distribute money to students for the deployment of Azure resources. These instructions are for IT administrators.

## Prerequisites

To complete this quickstart, you first need to:

- Sign up for the Azure Dev Tools for Teaching program.
- Sign a Microsoft Customer Agreement.
- Be in direct field-led motion.
- Have a billing profile and a billing account.
- Assign educators as owners on the billing profile.

## Go to the Education Hub

The first step in assigning credit to educators is to go to the Education Hub:

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Sign in with the account that's associated with Azure Dev Tools for Teaching.
3. Search for **education** on the search bar, and then select the **Education** result. You're now in the Education Hub.

## Add a credit

Assigning credit means that you're allowing educators to use a certain amount of money from your billing profile to create labs in the Education Hub. Educators that you want to receive the credit must be in the same tenant as you. They must also be owners of the billing profile where you want to create the credit.

1. Go to the **Credits** section of the Education Hub.
2. Select **Add** to begin adding a new credit.
3. Choose the billing profile that you want the educators to draw the money from.
4. Set the amount of credit.

   > [!NOTE]
   > Because of latency issues, there might be cases where the money spent is slightly higher than the set budget.

5. Set an expiration date for this credit. You can extend the date later, if necessary.
6. Select **Next** and confirm details.
7. Select **Create** to finish creating the credit.

## Modify credits

After you create credits, they appear as rows on the **Credits** tab. You can modify them if necessary:

1. Select the **Edit** button to the right of the credit.
2. Change the end date or the credit amount.

   > [!NOTE]
   > You can only extend the credit end date. You can't shorten it.

## Modify access

You can also modify which educators have access to the credit:

1. Go to **Cost Management** and add or remove educators from the billing profile associated with the credit.
2. Added educators receive an email that invites them to visit the Education Hub to begin using the credit. Ensure that the educators sign in to the Azure portal with the account that's associated with the credit's billing profile.

## Next step

> [!div class="nextstepaction"]
> [Create an assignment and allocate credit](create-assignment-allocate-credit.md)
