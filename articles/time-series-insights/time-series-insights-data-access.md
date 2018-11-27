---
title: Configure security to access and manage Azure Time Series Insights | Microsoft Docs
description: This article describes how to configure security and permissions as management access policies and data access policies to secure Azure Time Series Insights.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.workload: big-data
ms.topic: conceptual
ms.date: 11/26/2018
---

# Grant data access to a Time Series Insights environment using Azure portal

This article discusses the two types of Azure Time Series Insights (TSI) update access policies.

## Grant data access

Follow these steps to grant data access for a user principal:

1. Sign in to the [Azure Portal](https://portal.azure.com/).
1. Locate your TSI environment. Type `Time Series` in the **search** box. Select **Time Series Environment** in the search results.
1. Select your TSI environment from the list.
1. Select **Data Access Policies**, then select **+ Add**.

    ![data-access-one][1]

1. Select **Select user**. Search for the user name or email address to locate the user you want to add. Click **Select** to confirm the selection.

    ![data-access-two][2]

1. Select **Select role**. Choose the appropriate access role for the user:

    * Select **Contributor** if you want to allow user to change reference data and share saved queries and perspectives with other users of the environment.

    * Otherwise, select **Reader** to allow user query data in the environment and save personal (not shared) queries in the environment.

    Select **Ok** to confirm the role choice.

    ![data-access-three][3]

1. Select **Ok** in the **Select User Role** page.

    ![data-access-four][4]

1. The **Data Access Policies** page lists the users and the role(s) for each user.

    ![data-access-five[5]

## Provide guest access to a user from another Azure Active Directory tenant

`Guest` isn’t a management role; it’s a term used for an account that’s been invited from one tenant to another. After the guest account has been invited into the tenant’s directory, it can have the same access control applied to it like any other account, either to grant management access to a TSI Environment using the Access Control (IAM) blade, or to grant access to the data in the environment through the Data Access Policies blade. For more information on Azure Active Directory (AAD) tenant guest access, read [Add Azure Active Directory B2B collaboration users in the Azure portal](https://docs.microsoft.com/azure/active-directory/b2b/add-users-administrator).

Follow these steps to grant guest access to a TSI environment to an AAD user from another tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Locate your TSI environment. Type **Time Series** in the search box. Select **Time Series Environment** in the search results.
1. Select your TSI environment from the list.
1. Select **Data Access Policies**, then select **+ Invite**.

    ![data-access-six][6]

1. Provide the user's email that you wish to invite. Note this should be an email associated with AAD. You can optionally include a personal message with the invitation.

    ![data-access-seven][7]

1. You should see a confirmation bubble appear on the screen.

    ![data-access-eight][8]

1. Select **Select user**. Search for the email address of the guest user you just invited to locate the user you want to add. Click **Select** to confirm the selection.

    ![data-access-nine][9]

1. Select **Select** role. Choose the appropriate access role for the guest user:

    1. Select **Contributor** if you want to allow the user to change reference data and share saved queries and perspectives with other users of the environment.
    1. Otherwise, select **Reader** to allow user query data in the environment and save personal (not shared) queries in the environment.

    ![data-access-ten][10]

1. Select **Ok** in the **Select User Role** page.

1. The **Data Access Policies** page now lists the guest user and the role(s) for each guest user.

    ![data-access-eleven][11]

1. Now the guest user will need to take certain steps to access the environment located in the Azure tenant you just invited them to. First, they need to accept the invitation you just sent them. This invite is sent via email to the email address you invited in step 5. They should click **Get Started**, to accept.

    ![data-access-twelve][12]

1. Next, the guest user will need to accept the permissions associated with the admin's organization.

    ![data-access-thirteen][13]

1. When the guest user is logged into the email address you invited, and they accept the invite, they will head to insights.azure.com. Once there, they will need to click on the avatar next to their email in the upper right-hand corner of the screen.

    ![data-access-fourteen][14]

1. Next, the guest user will select your Azure tenant from the directory drop-down menu. This is the tenant that you invited them to.

    ![data-access-fifteen][15]

1. Finally, when the guest user selects your tenant, they will see the TSI environment that you just provided them access to. They now should have all capabilities associated with the role you provided them in step 8.

## Next steps

* Learn [how to add an Event Hub event source](./time-series-insights-how-to-add-an-event-source-eventhub.md) to your Azure TSI environment.
* Send [events to the event source](./time-series-insights-send-events.md).
* View [your environment in Time Series Insights explorer](./time-series-insights-update-explorer.md).

<!-- Images -->
[1]: media/data-access/data-access-one.png
[2]: media/data-access/data-access-two.png
[3]: media/data-access/data-access-three.png
[4]: media/data-access/data-access-four.png
[5]: media/data-access/data-access-five.png
[6]: media/data-access/data-access-six.png
[7]: media/data-access/data-access-seven.png
[8]: media/data-access/data-access-eight.png
[9]: media/data-access/data-access-nine.png
[10]: media/data-access/data-access-ten.png
[11]: media/data-access/data-access-eleven.png
[12]: media/data-access/data-access-twelve.png
[13]: media/data-access/data-access-thirteen.png
[14]: media/data-access/data-access-fourteen.png
[15]: media/data-access/data-access-fifteen.png