---

title: Send APNS VOIP notifications with Azure Notification Hubs
description: Learn how to send APNS VOIP notifications through Azure Notification Hubs (not officially supported).
author: sethmanheim
ms.author: sethm
ms.date: 3/23/2020
ms.topic: how-to
ms.service: notification-hubs

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart

---

# Use APNS VOIP through Notification Hubs (not officially supported)

It is possible to use APNS VOIP notifications through Azure Notification Hubs; however, there is no official support for this scenario.

## Considerations

If you still choose to send APNS VOIP notifications through Notification Hubs, be aware of the following limitations:

- Sending a VOIP notification requires the `apns-topic` header to be set to the application bundle ID + the `.voip` suffix. For example, for a sample app with the bundle ID `com.microsoft.nhubsample`, the `apns-topic` header should be set to `com.microsoft.nhubsample.voip.`

   This method doesn't work well with Azure Notification Hubs, because the app's bundle ID must be configured as part of the hub's APNS credentials, and the value cannot be changed. Also, Notification Hubs does not allow the value of the `apns-topic` header to be overridden at runtime.

   To send VOIP notifications, you must configure a separate notification hub with the `.voip` app bundle ID.

- Sending a VOIP notification requires the `apns-push-type` header to be set to the value `voip`.

   To help customers with the transition to iOS 13, Notification Hubs attempts to infer the correct value for the `apns-push-type` header. The inference logic is intentionally simple, in an effort to avoid breaking standard notifications. Unfortunately, this method causes issues with VOIP notifications, because Apple treats VOIP notifications as a special case that does not follow the same rules as standard notifications.

   To send VOIP notifications, you must specify an explicit value for the `apns-push-type` header.

- Notification Hubs limits APNS payloads to 4 KB, as documented by Apple. For VOIP notifications, Apple allows payloads up to 5 KB. Notification Hubs does not differentiate between standard and VOIP notifications; therefore, all                notifications are limited to 4 KB.

   To send VOIP notifications, you must not exceed the 4-KB payload size limit.

## Next steps

For more information, see the following links:

- [Documentation for `apns-topic` and `apns-push-type` headers and values, including the special cases for VOIP notifications](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns).

- [Documentation for payload size limit](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification).

- [Notification Hubs updates for iOS 13](push-notification-updates-ios-13.md#apns-push-type).
