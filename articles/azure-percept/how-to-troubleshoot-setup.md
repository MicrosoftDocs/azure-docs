---
title: Troubleshoot issues during the on-boarding experience
description: Get troubleshooting tips for some of the more common issues found during the on-boarding experience
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Azure Percept DK On-boarding Experience Troubleshooting Guide

Here are some issues you may encounter during the Azure Percept DK onboarding experience. If after using the steps in this guide, the issue still persists. Contact Azure customer support.

|Issue|Reason|Workaround|
|:-----|:------|:----------|
|When connecting to the Azure account sign-up pages or to the Azure portal, you may automatically sign in with a cached account. If this is not the account you intended on using, it may result in an experience that is inconsistent with the documentation.|This is usually because of a setting in the browser to "remember" an account you have previously used.|From the Azure page, click on the upper right corner of the page where it shows your account name, and then click "sign out." You will then be able to sign in with the correct account.|
|The Azure Percept DK access point (scz-xxxx) network does not appear in the list of available wi-fi networks.|This is usually a temporary issue that resolves itself with a little time.|Wait for the network to appear. If it does not after more than 15 minutes, reboot the device.|
|The connection to the Azure Percept DK access point frequently disconnects.|This can be due to a poor connection between the device and the host computer. It can also be caused by interference from other wifi connections on the host computer.|Make sure that the antennas are properly attached to the dev kit. If the dev kit is far away from the host computer, try moving it closer. Turn off any other internet connections such as LTE/5G if they are running on the host computer.|
|The host computer shows a security warning about the connection to the Azure Percept DK access point.|This is a known issue that will be fixed in a later update.|It is safe to proceed through the on-boarding experience over the dev kit Wi-Fi access point.|
|The Azure Percept DK access point (scz-xxxx) network appears in the network list but fails to connect.|This could be due to a temporary corruption of the dev kit Wi-Fi access point.|Reboot the dev kit and try again.|
|Unable to connect to a wi-fi network during the setup experience.|The wi-fi network must currently have internet connectivity so we can communicate with Azure. EAP[PEAP/MSCHAP], captive portals, and Enterprise EAP-TLS connectivity is currently not supported.|Ensure the type wi-fi network you are connecting is supported and has internet connectivity.|