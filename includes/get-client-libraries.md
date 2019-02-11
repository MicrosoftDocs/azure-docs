---
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 11/25/2018
ms.author: spelluru
---
### Install via Composer
1. Create a file named **composer.json** in the root of your project and add the following code to it:
   
    ```json
    {
      "require": {
        "microsoft/azure-storage": "*"
      }
    }
    ```
2. Download **[composer.phar][composer-phar]** in your project root.
3. Open a command prompt and execute the following command in your project root
   
    ```
    php composer.phar install
    ```

Alternatively go to the [Azure Storage PHP Client Library][php-sdk-github] on GitHub to clone the source code.

[php-sdk-github]: https://github.com/Azure/azure-storage-php
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[download-SDK-PHP]: ../articles/php-download-sdk.md
[composer-phar]: http://getcomposer.org/composer.phar
