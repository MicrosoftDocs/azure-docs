---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 07/07/2022
---

Repeat the previous step to create the following extra app settings:

- *DB_HOST*: Use the *\<database-server-domain-name>* from the copied connection string as the value.
- *DB_USERNAME*: Use the *\<username>* from the copied connection string as the value.
- *DB_PASSWORD*: Use the *\<password>* from the copied connection string as the value.
- *APP_DEBUG*: Use *true* as the value. This is a [Laravel debugging variable](https://laravel.com/docs/8.x/errors#configuration).
- *APP_KEY*: Use *base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=* as the value. This is a [Laravel encryption variable](https://laravel.com/docs/8.x/encryption#configuration).

    > [!IMPORTANT]
    > This `APP_KEY` value is used here for convenience. For production scenarios, it should be generated specifically for your deployment using `php artisan key:generate --show` in the command line.
