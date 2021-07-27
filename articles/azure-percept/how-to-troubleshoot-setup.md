---
title: Troubleshoot issues during the Azure Percept DK setup experience
description: Get troubleshooting tips for some of the more common issues found during the setup experience
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: troubleshooting
ms.date: 03/25/2021
ms.custom: template-how-to
---

# Azure Percept DK setup experience troubleshooting guide

Refer to the table below for workarounds to common issues found during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md). If your issue still persists, contact Azure customer support.

|Issue|Reason|Workaround|
|:-----|:------|:----------|
|When connecting to the Azure account sign-up pages or to the Azure portal, you may automatically sign in with a cached account. If you don't sign in with the correct account, it may result in an experience that is inconsistent with the documentation.|The result of a browser setting to "remember" an account you have previously used.|From the Azure page, select on your account name in the upper right corner and select **sign out**. You can then sign in with the correct account.|
|The Azure Percept DK Wi-Fi access point (apd-xxxx) doesn't appear in the list of available Wi-Fi networks.|It's usually a temporary issue that resolves within 15 minutes.|Wait for the network to appear. If it doesn't appear after more than 15 minutes, reboot the device.|
|The connection to the Azure Percept DK Wi-Fi access point frequently disconnects.|It's usually because of a poor connection between the device and the host computer. It can also be caused by interference from other Wi-Fi connections on the host computer.|Make sure that the antennas are properly attached to the dev kit. If the dev kit is far away from the host computer, try moving it closer. Turn off any other internet connections such as LTE/5G if they're running on the host computer.|
|The host computer shows a security warning about the connection to the Azure Percept DK access point.|It's a known issue that will be fixed in a later update.|It's safe to continue through the setup experience.|
|The Azure Percept DK Wi-Fi access point (scz-xxxx or apd-xxxx) appears in the network list but fails to connect.|It could be because of a temporary corruption of the dev kit's Wi-Fi access point.|Reboot the dev kit and try again.|
|Unable to connect to a Wi-Fi network during the setup experience.|The Wi-Fi network must currently have internet connectivity to communicate with Azure. EAP[PEAP/MSCHAP], captive portals, and enterprise EAP-TLS connectivity is currently not supported.|Ensure your Wi-Fi network type is supported and has internet connectivity.|
|After using the Device Code and signing into Azure, you're presented with an error about policy permissions or compliance issues and will be unable to continue. Here are some of the errors you may see:<br>**BlockedByConditionalAccessOnSecurityPolicy** The tenant admin has configured a security policy that blocks this request. Check the security policies defined at the tenant level to determine if your request meets the policy. <br>**DevicePolicyError** The user tried to sign into a device from a platform that's currently not supported through Conditional Access policy.<br>**DeviceNotCompliant** - Conditional Access policy requires a compliant device, and the device isn't compliant. The user must enroll their device with an approved MDM provider like Intune<br>**BlockedByConditionalAccess** Access has been blocked by Conditional Access policies. The access policy doesn't allow token issuance.    |Some Azure tenants may block the usage of “Device Codes” for manipulating Azure resources as a Security precaution. It's usually the result of your organization's IT policies. As a result, the Azure Percept Setup experience can't create any Azure resources for you.    |Work with your organization to navigate their IT policies.    |
