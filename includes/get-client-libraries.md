###Install via Composer

1. [Install Git][install-git]. 
	
	> WACOM.NOTE
	> On Windows, you will also need to add the Git executable to your PATH environment variable.

2. Create a file named **composer.json** in the root of your project and add the following code to it:

		{
			"require": {
				"microsoft/windowsazure": "*"
			},			
			"repositories": [
				{
					"type": "pear",
					"url": "http://pear.php.net"
				}
			],
			"minimum-stability": "dev"
		}

3. Download **[composer.phar][composer-phar]** in your project root.

4. Open a command prompt and execute this in your project root

		php composer.phar install

###Install manually

To download and install the PHP Client Libraries for Windows Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][chunk-php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)


	> WACOM.NOTE
	> The PHP Client Libraries for Windows Azure have a dependency on the [HTTP_Request2](http://pear.php.net/package/HTTP_Request2), [Mail_mime](http://pear.php.net/package/Mail_mime), and [Mail_mimeDecode](http://pear.php.net/package/Mail_mimeDecode) PEAR packages. The recommended way to resolve these dependencies is to install these packages using the [PEAR package manager](http://pear.php.net/manual/en/installation.php).


2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure.

For more information about installing the PHP Client Libraries for Windows Azure (including information about installing as a PEAR package), see [Download the Windows Azure SDK for PHP][download-php-sdk].

[chunk-install-pear]: http://pear.php.net/manual/en/installation.php
[chunk-php-sdk-github]: http://go.microsoft.com/fwlink/?LinkId=252719
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[download-php-sdk]: https://www.windowsazure.com/en-us/develop/php/common-tasks/download-php-sdk/
[composer-phar]: http://getcomposer.org/composer.phar
