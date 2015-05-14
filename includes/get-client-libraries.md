###Install via Composer

1. [Install Git][install-git]. 

 
	> [AZURE.NOTE] On Windows, you will also need to add the Git executable to your PATH environment variable.

2. Create a file named **composer.json** in the root of your project and add the following code to it:

        {
            "repositories": [
                {
                    "type": "pear",
                    "url": "http://pear.php.net"
                }
            ],
            "require": {
                "pear-pear.php.net/mail_mime" : "*",
                "pear-pear.php.net/http_request2" : "*",
                "pear-pear.php.net/mail_mimedecode" : "*",
                "microsoft/windowsazure": "*"
            }
        }


3. Download **[composer.phar][composer-phar]** in your project root.

4. Open a command prompt and execute this in your project root

		php composer.phar install

###Install manually

To download and install the PHP Client Libraries for Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)

	
	> [AZURE.NOTE] The PHP Client Libraries for Azure have a dependency on the [HTTP_Request2](http://pear.php.net/package/HTTP_Request2), [Mail_mime](http://pear.php.net/package/Mail_mime), and [Mail_mimeDecode](http://pear.php.net/package/Mail_mimeDecode) PEAR packages. The recommended way to resolve these dependencies is to install these packages using the [PEAR package manager](http://pear.php.net/manual/en/installation.php).


2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure.

For more information about installing the PHP Client Libraries for Azure (including information about installing as a PEAR package), see [Download the Azure SDK for PHP][download-SDK-PHP].


[php-sdk-github]: http://go.microsoft.com/fwlink/?LinkId=252719
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[download-SDK-PHP]: ../articles/php-download-sdk.md
[composer-phar]: http://getcomposer.org/composer.phar
