<properties 
   pageTitle="Connect a web app in Azure App Service to Redis Cache via the Memcache Protocol" 
   description="Connect a web app in Azure App service to Redis Cache using the Memcached Protocol" 
   services="app-service\web" 
   documentationCenter="php" 
   authors="syntaxc4" 
   manager="wpickett" 
   editor="riande"/>
   
<tags
   ms.service="app-service-web"
   ms.devlang="php"
   ms.topic="article"
   ms.tgt_pltfrm="windows"
   ms.workload="web" 
   ms.date="03/31/2015"
   ms.author="cfowler"/>

# Connect a web app in Azure App Service to Redis Cache via the Memcache Protocol

Azure App Service Web Apps is an open platform which provides support for a variety of programming languages including Open Source programming languages such as PHP, Python and Node.js. When building high scale applications, especially those which are distributed amongst multiple servers, a common practice is to introduce a centralized in-memory caching mechanism to offset time intensive calls to external dependencies such as third-party services or the data tier of an application. In many new scenarios [Redis][12], a popular open source data structure server, facilitates the role of an in-memory cache for the application. The Azure Redis Cache Service is the suggested first-party caching mechanism within Microsoft Azure. In many applications and application frameworks, the role of an in-memory cache is facilitated by [memcache][13], another popular scalable caching system.

In order to service the needs of most applications, especially those which use open source languages, Web Apps now exposes a local memcache endpoint which proxies caching calls into the Azure Redis Cache Service. This enables any application which communicates using the memcached protocol to cache data into a centralized caching mechanism thus alleviating the application from expensive transactions. This post will outline how to configure and validate the Web Apps memcache shim as a centralized in-memory cache for a WordPress site. It is important to note, that this memcache shim works at the protocol level, so it isn’t specific to any particular application or application framework as long as it communicates using the memcached protocol.


## Prerequisites

The memcache shim could be used with any application provided it communicates using the memcached protocol. For this particular example, the reference application is a Scalable WordPress site which can be provisioned from the Azure Marketplace. 

Follow the steps outlined in these posts:

* [Deploy a Scalable WordPress site in Azure][0]
* [Provision an instance of the Azure Redis Cache Service][1]

Once you have the Scalable WordPress site deployed and a Redis Cache instance provisioned you will be ready to proceed with enabling the memcache shim in Azure App Service Web Apps.

## Enable the Azure App Service Web App memcache shim

In order to configure the Web Apps shim, you must create three App Settings. This can be done using a variety of methods including the [Full Featured Portal][2], the [Preview Portal][3], the [Azure PowerShell Cmdlets][4] or the [Azure Cross Platform Command-Line tools][5]. For the purposes of this post, I’m going to use the Preview Portal to set the application settings. The following values can be retrieved from the Redis Cache Service Settings blade.

![Azure Redis Cache Settings Blade](./media/web-sites-connect-to-redis-using-memcache-protocol/1-azure-redis-cache-settings.png)

### Add REDIS_HOST App Setting

The first app setting which we will create is the **REDIS\_HOST** app setting which will set the destination in which the cache information will be sent once it is passed through the shim. The value required for the REDIS_HOST app setting can be retrieved from the Properties blade of the Redis Cache Service.

![Azure Redis Cache Host Name](./media/web-sites-connect-to-redis-using-memcache-protocol/2-azure-redis-cache-hostname.png)

Set the key of the app setting to **REDIS\_HOST** and the value of the app setting to the **hostname** of the Redis Cache Service.

![Web App AppSetting REDIS_HOST](./media/web-sites-connect-to-redis-using-memcache-protocol/3-azure-website-appsettings-redis-host.png)

### Add REDIS_KEY App Setting

The second app setting which we will create is the **REDIS\_KEY** app setting which will provide the Authentication token required to securely access the Redis Cache Service. The calue required for the REDIS_KEY app setting can be retrieved from the Access keys blade of the Redis Cache Service.

![Azure Redis Cache Primary Key](./media/web-sites-connect-to-redis-using-memcache-protocol/4-azure-redis-cache-primarykey.png)

Set the key of the app setting to **REDIS\_KEY** and the value of the app setting to the **Primary Key** of the Redis Cache Service.

![Azure Website AppSetting REDIS_KEY](./media/web-sites-connect-to-redis-using-memcache-protocol/5-azure-website-appsettings-redis-primarykey.png)

### Add MEMCACHESHIM_REDIS_ENABLE App Setting

The last app setting is used to enable the Memcache Shim in Web Apps which will use the REDIS_HOST and REDIS_KEY to connect and proxy cache calls to the Azure Redis Cache Service. Set the key of the app setting to **MEMCACHESHIM\_REDIS\_ENABLE** and the value to **true**.

![Web App AppSetting MEMCACHESHIM_REDIS_ENABLE](./media/web-sites-connect-to-redis-using-memcache-protocol/6-azure-website-appsettings-enable-shim.png)

Once you’ve completed adding the three (3) app settings, click **Save**.

## Enable Memcache Extension for PHP

In order for the application to speak the memcached protocol, it is necessary to install the memcache extension to the PHP programming language.

### Download the php_memcache Extension

Browse to [PECL][6], under the caching category, click on [memcache][7]. Under the downloads column click on the DLL link.

![PHP PECL Website](./media/web-sites-connect-to-redis-using-memcache-protocol/7-php-pecl-website.png)

Download the Non-Thread Safe (NTS) x86 link for the version of PHP enabled in Web Apps. (Default is PHP 5.4)

![PHP PECL Website Memcache Package](./media/web-sites-connect-to-redis-using-memcache-protocol/8-php-pecl-memcache-package.png)

### Enable the php_memcache extension

After downloading the file, unzip and upload the **php\_memcache.dll** into the **d:\\home\\site\\wwwroot\\bin\\ext\\** directory. After the php_memcache.dll has been uploaded into the web app, the extension needs to be enabled to the PHP Runtime. To enable the memcache extension, open the Application Settings blade for the web app, then add a new App Setting with the key of **PHP\_EXTENSIONS** and the value **bin\\ext\\php_memcache.dll**.


> If the site requires multiple PHP extensions to be loaded the value of PHP_EXTENSIONS should be a comma delimited list of relative paths to dll files.

![Web App AppSetting PHP_EXTENSIONS](./media/web-sites-connect-to-redis-using-memcache-protocol/9-azure-website-appsettings-php-extensions.png)

Once finished, click **Save**.

## Install Memcache WordPress Plugin

On the WordPress plugins page, click the **Add New** button.

![WordPress Plugin Page](./media/web-sites-connect-to-redis-using-memcache-protocol/10-wordpress-plugin.png)

In the search box, type **memcached** and press the enter key.

![WordPress Add New Plugin](./media/web-sites-connect-to-redis-using-memcache-protocol/11-wordpress-add-new-plugin.png)

Find **Memcached Object Cache** in the list, then click on the **Install Now** button.

![WordPress Install Memcache Plugin](./media/web-sites-connect-to-redis-using-memcache-protocol/12-wordpress-install-memcache-plugin.png)

### Enable the memcache WordPress Plugin

> Follow the instructions in this blog on [How to enable a Site Extension in Web Apps][6] to install the Visual Studio Online “Monaco”.


```php
$memcached_servers = array(
	'default' => array('localhost:' . getenv("MEMCACHESHIM_PORT"))
);
```

Drag and drop **object-cache.php** from **wp-content/memcached** folder to the **wp-content** folder to enable the Memcache Object Cache functionality.

![Locate the memcache object-cache.php plugin](./media/web-sites-connect-to-redis-using-memcache-protocol/13-locate-memcache-object-cache-plugin.png)

Now that the **object-cache.php** file is in the **wp-content** folder,  the Memcached Object Cache is now enabled.

![Enable the memcache object-cache.php plugin](./media/web-sites-connect-to-redis-using-memcache-protocol/14-enable-memcache-object-cache-plugin.png)

## Verifying the Memcache Object Cache Plugin is Functioning

All of the steps to enable the Web Apps Memcache shim are now complete, but there is still one additional important step, verify that the data is populating the Redis Cache Service.

### Enable the Non-SSL Port Support in Azure Redis Cache Service

> At the time of writing this document, the Redis CLI does not support SSL connectivity, thus the following steps are necessary.

Browse to the Redis Cache Service that was created for this site. Once the cache blade is open, click on the Settings icon.

![Azure Redis Cache Settings Button](./media/web-sites-connect-to-redis-using-memcache-protocol/15-azure-redis-cache-settings-button.png)

Select **Access Ports** from the list.

![Azure Redis Cache Access Port](./media/web-sites-connect-to-redis-using-memcache-protocol/16-azure-redis-cache-access-port.png)

Where asked to **Allow access only via SSL**, click **No**.

![Azure Redis Cache Access Port SSL Only](./media/web-sites-connect-to-redis-using-memcache-protocol/17-azure-redis-cache-access-port-ssl-only.png)

You will see that the NON-SSL port is now set. Click **Save**.

![Azure Redis Cache Redis Access Portal Non-SSL](./media/web-sites-connect-to-redis-using-memcache-protocol/18-azure-redis-cache-access-port-non-ssl.png)

### Connect to Azure Redis Cache from redis-cli

> This step assumes that redis is installed locally on your development machine. [Install Redis locally using these instructions][9].

Open Terminal or your console of choice. Type the following command:

```shell
redis-cli –h <hostname-for-redis-cache> –a <primary-key-for-redis-cache> –p 6379
```

Replace the **<hostname-for-redis-cache>** with the actual xxxxx.redis.cache.windows.net hostname and the **<primary-key-for-redis-cache>** with the access key for the cache, then Press enter. Once the CLI has connected to the Redis Cache Service issue any redis command, I’ve chosen to list the keys.

![Connect to Azure Redis Cache from Redis CLI in Terminal](./media/web-sites-connect-to-redis-using-memcache-protocol/19-redis-cli-terminal.png)

The call to list the keys should return a value, if a list of results isn’t returned, try navigating to the site and trying again.

## Conclusion

Congratulations the application now has a centralized in-memory cache to aid in increasing throughput. Remember, the Web Apps Memcache Shim can be used with any memcache client regardless of programming language or application framework. To provide feedback or to ask questions about the Web Apps memcache shim post to the [MSDN Forums][10] or [Stackoverflow][11].

[0]: http://bit.ly/1F0m3tw
[1]: http://bit.ly/1t0KxBQ
[3]: http://manage.windowsazure.com
[4]: http://portal.azure.com
[5]: http://azure.microsoft.com/downloads
[6]: http://pecl.php.net
[7]: http://pecl.php.net/package/memcache
[8]: http://blog.syntaxc4.net/post/2015/02/05/how-to-enable-a-site-extension-in-azure-websites.aspx
[9]: http://redis.io/download#installation
[10]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazurewebsitespreview
[11]: http://stackoverflow.com/questions/tagged/azure-web-sites
[12]: http://redis.io
[13]: http://memcached.org
