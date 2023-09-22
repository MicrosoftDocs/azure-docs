---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 07/07/2022
---

Create the following extra app settings by following the same steps for creating an app setting.

- *DB_HOST*: Use the *\<database-server-domain-name>* from the copied connection string as the value.
- *DB_USERNAME*: Use the *\<username>* from the copied connection string as the value.
- *DB_PASSWORD*: Use the *\<password>* from the copied connection string as the value.
- *MYSQL_ATTR_SSL_CA*: Use */home/site/wwwroot/ssl/DigiCertGlobalRootCA.crt.pem* as the value. 

    This app setting points to the path of the [TLS/SSL certificate you need to access the MySQL server](../../../mysql/flexible-server/how-to-connect-tls-ssl.md#download-the-public-ssl-certificate). It's included in the sample repository for convenience.

- *APP_DEBUG*: Use *true* as the value. This is a [Laravel debugging variable](https://laravel.com/docs/8.x/errors#configuration).
- *APP_KEY*: Use *base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=* as the value. This is a [Laravel encryption variable](https://laravel.com/docs/8.x/encryption#configuration).

    > [!IMPORTANT]
    > This `APP_KEY` value is used here for convenience. For production scenarios, it should be generated specifically for your deployment using `php artisan key:generate --show` in the command line.
