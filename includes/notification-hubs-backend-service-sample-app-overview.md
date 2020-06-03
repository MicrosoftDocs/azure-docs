---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

It will allow you to explicitly register and deregister from a notification hub via the backend service that you created previously. Alert style notifications will appear in the notification center (when the app is stopped or in the background) and notifications with an action will result in an alert (when the app is in the foreground) showing the action text for that silent notification.

> [!NOTE]
> You would typically perform the registration (and deregisration) actions during the appropriate point in the application lifecycle (or as part of your first-run experience perhaps) without explicit user register/deregister inputs. However, this example will require explicit user input to allow this functionality to be explored and tested more easily. The notifications are defined client-side using [custom templates](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-templates-cross-platform-push-messages) in this case but could be handled server-side in future.
