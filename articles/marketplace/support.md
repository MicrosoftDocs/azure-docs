---
title: Get support for the commercial marketplace program in Partner Center
description: Learn about your support options for the commercial marketplace program in Partner Center, including how to file a support request.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: navits09
ms.author: navits
ms.date: 01/19/2020
---

# Support for the commercial marketplace program in Partner Center

Microsoft provides support for a wide variety of products and services. Finding the right support team is important to ensure an appropriate and timely response. Consider the following scenarios, which should help you route your query to the appropriate team:

- If you're a publisher and have a question from a customer, ask your customer to request support using the support links in the [Azure portal](https://portal.azure.com/).
- If you’re a publisher and have detected a security issue with an application running on Azure, see [How to log a security event support ticket](../security/fundamentals/event-support-ticket.md). Publishers must report suspected security events, including security incidents and vulnerabilities of their Azure Marketplace software and service offerings, at the earliest opportunity.
- If you're a publisher and have a question relating to your app or service, review the following support options.

## Get help or open a support ticket

#### [Workspaces view](#tab/Workspaces-view)

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home) with your work account. If you have not yet done so, you will need to [create a Partner Center account](create-account.md).

1. On the Home page, select the **Help + support** tile.

    :::image type="content" source="./media/workspaces/partner-center-help-support-tile.png" alt-text="Illustrates the Partner Center Home page with the Help + support tile highlighted.":::

1. Under **My support requests**, select **+ New request**.

1. In the **Problem summary** box, enter a brief description of the issue.

1. In the **Problem type** box, do one of the following:

    - **Option 1**: Enter keywords such as: Marketplace, Azure app, SaaS offer, account management, lead management, deployment issue, payout, or co-sell offer migration. Then select a problem type from the recommended list that appears.

    - **Option 2**: Select **Browse topics** from the **Category** list and then select **Commercial Marketplace**. Then select the appropriate **Topic** and **Subtopic**.

1. After you have found the topic of your choice, select **Review Solutions**.

    ![Next step](./media/support/next-step.png)

The following options are shown:

- To select a different topic, click **Select a different issue**.
- To help solve the issue, review the recommended steps and documents, if available.

    ![Recommended solutions](./media/support/recommended-solutions.png)

If you cannot find your answer in the self help, select **Provide issue details**. Complete all required fields to speed up the resolution process, then select **Submit**.

>[!Note]
>If you have not signed in to Partner Center, you may be required to sign in before you can create a ticket.

#### [Classic view](#tab/classic-view)

1. Sign in with your work account. If you have not yet done so, you will need to [create a Partner Center account](create-account.md).

1. In the menu on the upper-right of the page, select the **Support** icon. The **Help and support** pane appears on the right side of the page.

1. For help with the commercial marketplace, select **Commercial Marketplace**.

   ![Support drop-down menu](./media/support/commercial-marketplace-support-pane.png)

1. In the **Problem summary** box, enter a brief description of the issue.

1. In the **Problem type** box, do one of the following:

    - **Option 1**: Enter keywords such as: Marketplace, Azure app, SaaS offer, account management, lead management, deployment issue, payout, or co-sell offer migration. Then select a problem type from the recommended list that appears.

    - **Option 2**: Select **Browse topics** from the **Category** list and then select **Commercial Marketplace**. Then select the appropriate **Topic** and **Subtopic**.

1. After you have found the topic of your choice, select **Review Solutions**.

    ![Next step](./media/support/next-step.png)

The following options are shown:

- To select a different topic, click **Select a different issue**.
- To help solve the issue, review the recommended steps and documents, if available.

    ![Recommended solutions](./media/support/recommended-solutions.png)

If you cannot find your answer in the self help, select **Provide issue details**. Complete all required fields to speed up the resolution process, then select **Submit**.

>[!Note]
>If you have not signed in to Partner Center, you may be required to sign in before you can create a ticket.

---

## Track your existing support requests

#### [Workspaces view](#tab/Workspaces-view)

1. To review your open and closed tickets, sign in to [Partner Center](https://partner.microsoft.com/dashboard/home) with your work account.

1. On the Home page, select the **Help + support** tile.

    :::image type="content" source="./media/workspaces/partner-center-help-support-tile.png" alt-text="Illustrates the Partner Center Home page with the Help + support tile highlighted.":::

#### [Classic view](#tab/classic-view)

To review your open and closed tickets, in the left-navigation menu, select **Commercial Marketplace** > **Support**.

---

## Record issue details with a HAR file

To help support agents troubleshoot your issue, consider attaching an HTTP Archive format (HAR) file to your support ticket. HAR files are logs of network requests in a web browser.

> [!WARNING]
> HAR files may record sensitive data about your Partner Center account.

### Microsoft Edge and Google Chrome

To generate a HAR file using **Microsoft Edge** or **Google Chrome**:

1. Go to the web page where you’re experiencing the issue.
2. In the top right corner of the window, select the ellipsis icon, then **More tools** > **Developer tools**. You can press F12 as a shortcut.
3. In the Developer tools pane, select the **Network** tab.
4. Select **Stop recording network log** and **Clear** to remove existing logs. The record icon will turn grey.

    ![How to remove existing logs in Microsoft Edge or Google Chrome](media/support/chromium-stop-clear-session.png)

5. Select **Record network log** to start recording. When you start recording, the record icon will turn red.

    ![How to start recording in Microsoft Edge or Google Chrome](media/support/chromium-start-session.png)

6. Reproduce the issue you want to troubleshoot.
7. After you’ve reproduced the issue, select **Stop recording network log**.
8. Select **Export HAR**, marked with a downward-arrow icon, and save the file.

    ![How to export a HAR file in Microsoft Edge or Google Chrome](media/support/chromium-network-export-har.png)

### Mozilla Firefox

To generate a HAR file using **Mozilla Firefox**:

1. Go to the web page where you’re experiencing the issue.
1. In the top right corner of the window, select the ellipsis icon, then **Web Developer** > **Toggle Tools**. You can press F12 as a shortcut.
1. Select the **Network** tab, then select **Clear** to remove existing logs.

    ![How to remove existing logs in Mozilla Firefox](media/support/firefox-clear-session.png)

1. Reproduce the issue you want to troubleshoot.
1. After you’ve reproduced the issue, select **HAR Export/Import** > **Save All As HAR**.

    ![How to export a HAR file in Mozilla Firefox](media/support/firefox-network-export-har.png)

### Apple Safari

To generate a HAR file using **Safari**:

1. Enable the developer tools in Safari: select **Safari** > **Preferences**. Go to the **Advanced** tab, then select **Show Develop menu in menu bar**.
1. Go to the web page where you’re experiencing the issue.
1. Select **Develop**, then select **Show Web Inspector**.
1. Select the **Network** tab, then select **Clear Network Items** to remove existing logs.

    ![How to remove existing logs in Safari](media/support/safari-clear-session.png)

1. Reproduce the issue you want to troubleshoot.
1. After you’ve reproduced the issue, select **Export** and save the file.

    ![How to export a HAR file in Safari](media/support/safari-network-export-har.png)

## Next steps

- [Update an existing offer in the Commercial Marketplace](update-existing-offer.md)