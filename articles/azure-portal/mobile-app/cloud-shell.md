---
title: Use Cloud Shell in the Azure mobile app
description: Use the Azure mobile app to execute commands in Cloud Shell.
ms.date: 05/21/2024
ms.topic: conceptual
---

# Use Cloud Shell in the Azure mobile app

The Azure Cloud Shell feature in the Azure mobile app provides an interactive, authenticated, browser-accessible terminal for managing Azure resources.

You can execute commands in Cloud Shell through either Bash or PowerShell, and you can switch shells anytime.

:::image type="content" source="media/cloud-shell/cloud-shell-bash-powershell.png" alt-text="Screenshot showing Bash and PowerShell options for Cloud Shell in the Azure mobile app.":::

## Access Cloud Shell in the Azure mobile app

To launch Cloud Shell from within the Azure mobile app, select the **Cloud Shell** card on the [Azure mobile app **Home**](home.md). If you don't see the **Cloud Shell** card, you may need to scroll down. You can rearrange the order in which cards are displayed by selecting the **Edit** (pencil) icon on Azure mobile app **Home**.

:::image type="content" source="media/cloud-shell/cloud-shell-home.png" alt-text="Screenshot showing the Azure mobile app Home with the Cloud Shell card.":::

## Set up storage account

Cloud Shell requires a storage account to be associated with your sessions (or an [ephemeral session](/azure/cloud-shell/get-started/ephemeral)). If you already set up a storage account for Cloud shell, or you opted to use ephemeral sessions, that selection is remembered when you launch Cloud Shell in the Azure mobile app.

If you haven't used Cloud Shell before, you need to create a new storage account for Cloud Shell. When you first launch Cloud Shell, you'll be prompted to select a subscription in which a new storage account will be created.

:::image type="content" source="media/cloud-shell/cloud-shell-storage.png" alt-text="Screenshot of Cloud Shell in the Azure mobile app for a new user. ":::

## Use toolbar actions

The Cloud Shell toolbar in the Azure mobile app offers several helpful commands:

:::image type="content" source="media/cloud-shell/cloud-shell-toolbar.png" alt-text="Screenshot showing the Cloud Shell toolbar in the Azure mobile app.":::

- Select **X** to close Cloud Shell and return to **Home**.
- Select the dropdown to switch between Bash and PowerShell.
- Select the **Power** button to restart Cloud Shell with a new session.
- Select the **Clipboard** icon to paste content from your device's clipboard.

## Current limitations

The Cloud Shell feature in the Azure mobile app has certain limitations compared to the same feature in the Azure portal. The following functionalities are currently unavailable in the Azure mobile app:

- Command history
- IntelliSense
- File/script uploading
- Cloud Shell editor
- Port preview
- Retrieve additional tokens
- Reset user settings
- Font changes

## Next steps

- Learn more about the [Azure mobile app](overview.md).
- Learn more about [Azure mobile app **Home**](home.md) and how to customize it.
- Download the Azure mobile app for free from the [Apple App Store](https://aka.ms/azureapp/ios/doc), [Google Play](https://aka.ms/azureapp/android/doc) or [Amazon App Store](https://aka.ms/azureapp/amazon/doc).
- Learn more about [Azure Cloud Shell](/azure/cloud-shell/overview).
