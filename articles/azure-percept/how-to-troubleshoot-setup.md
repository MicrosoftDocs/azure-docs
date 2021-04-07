---
title: Troubleshoot issues during the Azure Percept DK setup experience
description: Get troubleshooting tips for some of the more common issues found during the setup experience
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/25/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Azure Percept DK setup experience troubleshooting guide

Refer to the table below for workarounds to common issues found during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md). If your issue still persists, contact Azure customer support.

|Issue|Reason|Workaround|
|:-----|:------|:----------|
|When connecting to the Azure account sign-up pages or to the Azure portal, you may automatically sign in with a cached account. If this is not the account you intended to use, it may result in an experience that is inconsistent with the documentation.|This is usually because of a setting in the browser to "remember" an account you have previously used.|From the Azure page, click on your account name in the upper right corner and select **sign out**. You will then be able to sign in with the correct account.|
|The Azure Percept DK Wi-Fi access point (scz-xxxx or apd-xxxx) does not appear in the list of available Wi-Fi networks.|This is usually a temporary issue that resolves within 15 minutes.|Wait for the network to appear. If it does not appear after more than 15 minutes, reboot the device.|
|The connection to the Azure Percept DK Wi-Fi access point frequently disconnects.|This can be due to a poor connection between the device and the host computer. It can also be caused by interference from other Wi-Fi connections on the host computer.|Make sure that the antennas are properly attached to the dev kit. If the dev kit is far away from the host computer, try moving it closer. Turn off any other internet connections such as LTE/5G if they are running on the host computer.|
|The host computer shows a security warning about the connection to the Azure Percept DK access point.|This is a known issue that will be fixed in a later update.|It is safe to proceed through the setup experience.|
|The Azure Percept DK Wi-Fi access point (scz-xxxx or apd-xxxx) appears in the network list but fails to connect.|This could be due to a temporary corruption of the dev kit's Wi-Fi access point.|Reboot the dev kit and try again.|
|Unable to connect to a Wi-Fi network during the setup experience.|The Wi-Fi network must currently have internet connectivity to communicate with Azure. EAP[PEAP/MSCHAP], captive portals, and enterprise EAP-TLS connectivity is currently not supported.|Ensure your Wi-Fi network type is supported and has internet connectivity.|