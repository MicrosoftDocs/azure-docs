---
title: 'Report an Azure VPN Client problem via Feedback Hub'
description: Learn how to report problems for the Azure VPN Client using the Microsoft Feedback Hub app.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/16/2024
ms.author: cherylmc

---
# Use Feedback Hub to report an Azure VPN Client problem

This article helps you report an Azure VPN Client problem or improve the Azure VPN Client experience using the **FeedBack Hub** app. Use the steps in this article to help collect logs, send files and screenshots, and review diagnostics. The steps in this article apply to the Windows 10 and Windows 11 operating systems and the Azure VPN Client.

The Feedback Hub app is automatically a part of Windows 10 and Windows 11. You don't need to download it separately. The screenshots shown in this article might be slightly different, depending on the version of Feedback Hub. For more information about FeedBack Hub, see [Send feedback to Microsoft with the Feedback Hub app](https://support.microsoft.com/en-us/windows/send-feedback-to-microsoft-with-the-feedback-hub-app-f59187f8-8739-22d6-ba93-f66612949332).

## Open Feedback Hub

1. To open the Feedback Hub app, on your Windows computer, press the **Windows logo key** + **F**, or select **Start** on your Windows 10 or Windows 11 computer and type **Feedback Hub**.
1. **Sign in**. Signing in is the only way to track your feedback and get the full experience of the Feedback Hub.
1. On the left side of the page, make sure you are on **Feedback**.

## Enter your feedback

1. Summarize your feedback. The **Summarize your feedback** box is used as a title for your feedback. Make your title concise and descriptive. This helps the search function locate similar problems and also helps others find and upvote your feedback.

   :::image type="content" source="./media/feedback-hub-azure-vpn-client/summary.png" alt-text="Screenshot showing the Enter your feedback fields." lightbox="./media/feedback-hub-azure-vpn-client/summary.png":::
1. In the **Explain in more detail** box you can give us more specific information, like how you encountered the problem. This field is public, so be sure not to include personal information.
1. Select **Next** to advance to **Choose a category**.

## Choose a category

1. Under **Choose a category**, select whether this is a **Problem** or a **Suggestion**.

1. Choose the following category settings. There are multiple options available in the dropdown. Make sure to select **Azure VPN Client**. This ensures that log files are sent to the correct destination.

   **Problem** -> **Network and Internet** -> **Azure VPN Client**.

    :::image type="content" source="./media/feedback-hub-azure-vpn-client/category.png" alt-text="Screenshot showing the Choose a category page." lightbox="./media/feedback-hub-azure-vpn-client/category.png":::
1. Select **Next** to advance to **Find similar feedback**.

## Find similar feedback

1. In the **Find similar feedback** section, look for bugs with similar feedback to see if anything matches the issue you're having.
  
   * If you see feedback that's **similar or the same** as the issue you're experiencing, select this option.
   * If you don't see anything or are unsure of what to select, select **New feedback** and **Make a new bug**.
1. Select **Next** to advance to the **Add more details** section.

## Add more details

In this section, you add diagnostic and other details.

* If your feedback is a **Suggestion**, the app takes you directly to the **Attachments (optional)** section.
* If your feedback is a **Problem** and you feel the problem merits more urgent attention, you can specify this problem as a high priority or blocking issue.

In the **Attachments (optional)** section, you should supply as much comprehensive information as possible. If a screen doesn't look right, [attach a screenshot](#attach-a-screenshot). If you're reporting a problem other than a screen issue, it's best to follow the steps in [Recreate my problem](#recreate-my-problem) and then use the steps in [Attach a file](#attach-a-file) to attach the log files.

### Attach a screenshot

If you're reporting an issue with the way a screen appears, submit a screenshot.

* Select **Choose a screenshot** to add an image.
* You can either create a new screenshot, or select one you previously created.

### Recreate my problem

The **Recreate my problem** option provides us with crucial information. This option has you recreate the problem while recording data. You can review and edit the data before you submit the problem.

:::image type="content" source="./media/feedback-hub-azure-vpn-client/start-recording.png" alt-text="Screenshot showing the Azure VPN Client start recording." lightbox="./media/feedback-hub-azure-vpn-client/start-recording.png":::

1. To use this option, first select the following items:

   * **Include data about Azure VPN Client (Default)**
   * **Include screenshots of each step**
1. Press the **Start recording** button.
1. Reproduce the issue you're experiencing with the Azure VPN Client.
1. Once you reproduce the issue, press **Stop recording**.

   :::image type="content" source="./media/feedback-hub-azure-vpn-client/stop-recording.png" alt-text="Screenshot showing the Azure VPN Client recording." lightbox="./media/feedback-hub-azure-vpn-client/stop-recording.png":::

### Attach a file

Attach the Azure VPN Client **log files**. It's best if you attach the file after you recreate the problem to make sure the problem is included in the log file. To attach the client log files:

1. Select **Attach a file** and locate the log files for the Azure VPN client. Log files are stored locally in the following folder: **%localappdata%\Packages\Microsoft.AzureVpn_8wekyb3d8bbwe\LocalState\LogFiles**.

1. From the LogFiles folder, select **Azure VPNClient.log** and **Azure VpnCxn.log**.

   :::image type="content" source="./media/feedback-hub-azure-vpn-client/locate-files.png" alt-text="Screenshot showing the Azure VPN client log files." lightbox="./media/feedback-hub-azure-vpn-client/locate-files.png":::

### Submit the problem

1. Review the files listed in the **Attached** section. You can view images by selecting **View**.
1. If everything is correct, select **Save a local copy of diagnostics** and **I agree to send attached files**.

   :::image type="content" source="./media/feedback-hub-azure-vpn-client/attached-log-files.png" alt-text="Screenshot the attached files to submit." lightbox="./media/feedback-hub-azure-vpn-client/attached-log-files.png":::
1. Select **Submit**.
1. The **Thank you for your feedback!** message appears at the end of the collection process.

## View your feedback

You can view your feedback in Feedback Hub.

1. Open Feedback Hub.
1. In the left pane, select **Feedback**. Then, select **My feedback**

## Feedback Hub and Azure Support tickets

If you need immediate attention for your issue, open an Azure Support ticket and share the Feedback Hub identification information. To find the Feedback Hub item identifiers:

1. Open Feedback Hub.
1. In the left pane, select **Feedback**. Then, select **My feedback**.
1. Locate and select the **Problem** to view more details and access the identifier for your collection logs.
1. Select **Share** to see the identifier associated with the generated logs.
1. Select **Other sharing option** to access the URI associated with the diagnostic logs that were sent to Microsoft.
1. Copy the **Short Link** and the **URI**.

   :::image type="content" source="./media/feedback-hub-azure-vpn-client/copy-links.png" alt-text="Screenshot showing the Problem links to copy." lightbox="./media/feedback-hub-azure-vpn-client/copy-links.png":::
1. Report the **Short Link** and **URI** to the Microsoft Azure ticket to associate the diagnostic logs to your support case.

## Next steps

For more information about FeedBack Hub, see [Send feedback to Microsoft with the Feedback Hub app](https://support.microsoft.com/windows/send-feedback-to-microsoft-with-the-feedback-hub-app-f59187f8-8739-22d6-ba93-f66612949332).