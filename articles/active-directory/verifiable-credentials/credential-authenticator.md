---
title: Using the Microsoft Authenticator app with Azure Verifiable Credentials
description: Download and install the Microsoft Authenticator app with Azure Verifiable Credentials
services: active-directory
author: barclayn
manager: davba
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Using the Microsoft Authenticator app with Azure Verifiable Credentials

This article explains how to use the Verifiable Credential Preview feature in the Microsoft Authenticator app. Currently, Android is the only mobile operating system supported for this preview feature.

## Download Authenticator

In order to get a Verifiable Credential, you will need to download the latest version of the Microsoft Authenticator app on the Google Play store.

If you already have the Microsoft Authenticator app on your Android device, make sure that it is version `6.2005.3599` or higher. If you need to install it, go to Google Play to [download and install the Microsoft Authenticator app.](https://play.google.com/store/apps/details?id=com.azure.authenticator&referrer=adjust_reftag%3DcFu2eQVkePeS5%26utm_source%3DDocs%253A%2BAAD%2Bend%2Buser%2B%2528docs.microsoft.com%2529))

If you're not currently on your mobile device, you can still get the Microsoft Authenticator app by sending a download link to your [phone.](https://www.microsoft.com/account/authenticator)

## Scan your first Verifiable Credential QR code

Once you have the Authenticator app set up, it's time to get your first Verifiable Credential!

If you don't have any accounts configured, there will be a blue button on the middle of the page that says "Add Account", otherwise tap the plus button in the top right. Then choose 'Other account' and scan the QR code created from the [developer documentation.](xref:152f1c4c-ea67-4958-9d17-e9b0b5e3040b) 

![Scan QR code](/media/credential-authenticator/scan_qr.png)

## Issuance flow

Now that you've scanned a QR code, you will go through the issuance flow based on the rules file that was set up in the earlier articles. The following is an example of what you should see in Authenticator.

![Add a card](/media/credential-authenticator/add_card.png)

## Next Steps

- One
- Two
- ...
