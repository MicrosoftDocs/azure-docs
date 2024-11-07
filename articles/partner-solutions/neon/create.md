---
title: "Quickstart: Create a  Neon Serverless Postgres (preview) resource"
description: Learn how to create a resource for  Neon Serverless Postgres (preview) using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 10/29/2024

---
# Quickstart: Create a Neon Serverless Postgres (preview) resource

This quickstart shows you how to create a Neon Serverless Postgres (preview) resource using the Azure portal.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/). Make sure you're an *Owner* or a *Contributor* in the subscription.

## Setup

Begin by signing in to the [Azure portal](https://portal.azure.com).

### Register Neon Serverless Postgres as a resource provider

To create a Neon Serverless Postgres resource, you must register the `Neon Serverless Postgres` resource provider first.

1. Under Azure services, choose **Subscriptions**.
1. Choose the subscription you plan to use. 
1. From your subscription, select **Settings** > **Resource providers**.
1. In the Filter by name search box, type **ADD NEON NAME HERE**.
1. Select the ellipse next to `Neon Serverless Postgres` and choose **Register**. 

## Create a Neon Serverless Postgres resource

To create your Neon Serverless Postgres resource, start at the Azure portal home page.

1. Search for the Neon Serverless Postgres resource provider by typing **Azure Native Neon Serverless Postgres Service** the header search bar.

1. Choose **Azure Native Neon Serverless Postgres Service** from the *Services* search results.

1. Select the **+ Create** option.

## Create an Azure Native Neon Serverless Postgres Service

The Create an Azure Native Neon Serverless Postgres Service pane opens to the *Basics* tab by default.

### Basics tab

The *Basics* tab has three sections:

- Project Details
- Instance Details
- Company Details

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Setting  |Action  |
    |---------|---------|
    |Subscription    |Select a subscription from your existing subscriptions.         |
    |Resource group     |Use an existing resource group or create a new one.          |

1. Enter the values for each required setting under *Instance details*.

    |Setting  |Action  |
    |---------|---------|
    |Resource name     |Specify a unique name for the resource.    |
    |Region     |Select the [region](https://azure.microsoft.com/explore/global-infrastructure/geographies/) where you want to enable this service and its child resources to be located.         |

1. Enter the values for each required setting under *Company details*.

1. Select the **Review and create** button at the bottom of the page.

### Tag tab (optional)

If you wish, you have the option to create a tag for your resources. 

### Review and create tab

If the review identifies errors, a red dot appears next each tabbed section where errors exist. Fields with errors are highlighted in red. 

1. Open each tabbed section with errors and fix the errors.

1. Select the **Review and create** button again.

1. Select the **Create** button.

## Related content

To learn more about Azure, review [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts).

## Next steps