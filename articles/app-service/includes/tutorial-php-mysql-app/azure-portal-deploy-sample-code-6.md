---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 07/07/2022
---

In Visual Studio Code in the browser:

1. From the explorer, open *config/database.php*.

1. By default, Azure Database for MySQL enforces TLS connections from clients. To connect to your MySQL database in Azure, you must use the [.pem certificate supplied by Azure Database for MySQL](../../../mysql/single-server/how-to-configure-ssl). The certificate `ssl/BaltimoreCyberTrustRoot.crt.pem` is provided in the sample repository for convenience in this tutorial. At the bottom of the `mysql` section in *config/database.php*, change the `options` parameter to the following code: 

    ```PHP
    'options' => extension_loaded('pdo_mysql') ? array_filter([
        PDO::MYSQL_ATTR_SSL_KEY    => '/ssl/BaltimoreCyberTrustRoot.crt.pem',
    ]) : [],
    ```

    In the `mysql` connection, the app settings you created earlier are already being referenced.
