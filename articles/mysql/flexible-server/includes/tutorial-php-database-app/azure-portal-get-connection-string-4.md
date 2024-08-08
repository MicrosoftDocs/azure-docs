---
author: shreyaaithal
ms.author: shaithal
ms.reviewer: maghan
ms.date: 06/18/2024
ms.topic: include
---

Create the following extra app settings by following the same steps, then click on **Save**.

- *APP_DEBUG*: Use *true* as the value. This is a [Laravel debugging variable](https://laravel.com/docs/8.x/errors#configuration).
- *APP_KEY*: Use *base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=* as the value. This is a [Laravel encryption variable](https://laravel.com/docs/8.x/encryption#configuration).

    > [!IMPORTANT]
    > This `APP_KEY` value is used here for convenience. For production scenarios, it should be generated specifically for your deployment using `php artisan key:generate --show` in the command line.
