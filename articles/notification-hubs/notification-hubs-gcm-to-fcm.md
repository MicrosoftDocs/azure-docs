---
title: Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration
description: Describes how Azure Notification Hubs addresses the Google GCM to FCM migration.
services: notification-hubs
author: jwargo
manager: patniko
editor: spelluru

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 04/10/2019
ms.author: jowargo
---

# Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration

## Current state

When Google announced its migration from Google Cloud Messaging (GCM) to Firebase Cloud Messaging (FCM), push services like ours had to adjust how we sent notifications to Android devices to accommodate the change.

We updated our service backend, then published updates to our API and SDKs as needed. With our implementation, we made the decision to maintain compatibility with existing GCM notification schemas to minimize customer impact. This means that we currently send notifications to Android devices using FCM in FCM Legacy Mode. Ultimately, we want to add true support for FCM, including the new features and payload format. That is a longer-term change and the current migration is focused on maintaining compatibility with existing applications and SDKs. You can use either the GCM or FCM SDKs in your app (along with our SDK) and we make sure the notification is sent correctly.

Some customers recently received an email from Google warning about apps using a GCM endpoint for notifications. This was just a warning, and nothing is broken – your app’s Android notifications are still sent to Google for processing and Google still processes them. Some customers who specified the GCM endpoint explicitly in their service configuration were still using the deprecated endpoint. We had already identified this gap and were working on fixing the issue when Google sent the email.

We replaced that deprecated endpoint and the fix is deployed.

## Going forward

Google’s FCM FAQ says you don't have to do anything. In the [FCM FAQ](https://developers.google.com/cloud-messaging/faq), Google said "client SDKs and GCM tokens will continue to work indefinitely. However, you won't be able to target the latest version of Google Play Services in your Android app unless you migrate to FCM."

If your app uses the GCM library, go ahead and follow Google’s instructions to upgrade to the FCM library in your app. Our SDK is compatible with either, so you won’t have to update anything in your app on our side (as long as you’re up to date with our SDK version).

## Questions and answers

Here’s some answers to common questions we’ve heard from customers:

**Q:** What do I need to do to be compatible by the cutoff date (Google’s current cutoff date is May 29th and may change)?

**A:** Nothing. We will maintain compatibility with existing GCM notification schema. Your GCM key will continue to work as normal as will any GCM SDKs and libraries used by your application.

If/when you decide to upgrade to the FCM SDKs and libraries to take advantage of new features, your GCM key will still work. You may switch to using an FCM key if you wish, but ensure you are adding Firebase to your existing GCM project when creating the new Firebase project. This will guarantee backward compatibility with your customers that are running older versions of the app that still use GCM SDKs and libraries.

If you are creating a new FCM project and not attaching to the existing GCM project, once you update Notification Hubs with the new FCM secret you will lose the ability to push notifications to your current app installations, since the new FCM key has no link to the old GCM project.

**Q:** Why am I getting this email about old GCM endpoints being used? What do I have to do?

**A:** Nothing. We have been migrating to the new endpoints and will be finished soon, so no change is necessary. Nothing is broken, our one missed endpoint simply caused warning messages from Google.

**Q:** How can I transition to the new FCM SDKs and libraries without breaking existing users?

A: Upgrade at any time. Google has not yet announced any deprecation of existing GCM SDKs and libraries. To ensure you don't break push notifications to your existing users, make sure when you create the new Firebase project you are associating with your existing GCM project. This will ensure new Firebase secrets will work for users running the older versions of your app with GCM SDKs and libraries, as well as new users of your app with FCM SDKs and libraries.

**Q:** When can I use new FCM features and schemas for my notifications?

**A:** Once we publish an update to our API and SDKs, stay tuned – we expect to have something for you in the coming months.
