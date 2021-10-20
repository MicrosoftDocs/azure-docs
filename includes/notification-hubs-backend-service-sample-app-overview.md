---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

It enables you to register and deregister from a notification hub via the backend service that you created. 

An alert is displayed when an action is specified and the app is in the foreground. Otherwise, notifications appear in notification center.

> [!NOTE]
> You would typically perform the registration (and deregistration) actions during the appropriate point in the application lifecycle (or as part of your first-run experience perhaps) without explicit user register/deregister inputs. However, this example will require explicit user input to allow this functionality to be explored and tested more easily.
