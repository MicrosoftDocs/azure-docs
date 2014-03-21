###Install via Composer

1. [Install Git][install-git]. 

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>On Windows, you will also need to add the Git executable to your PATH environment variable.</p>
	</div>

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

To download and install the PHP Client Libraries for Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>The PHP Client Libraries for Azure have a dependency on the <a href="http://pear.php.net/package/HTTP_Request2">HTTP_Request2</a>, <a href="http://pear.php.net/package/Mail_mime">Mail_mime</a>, and <a href="http://pear.php.net/package/Mail_mimeDecode">Mail_mimeDecode</a> PEAR packages. The recommended way to resolve these dependencies is to install these packages using the <a href="http://pear.php.net/manual/en/installation.php">PEAR package manager</a>.</p> 
	</div>


2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure.

For more information about installing the PHP Client Libraries for Azure (including information about installing as a PEAR package), see [Download the Azure SDK for PHP][download-SDK-PHP].


[php-sdk-github]: http://go.microsoft.com/fwlink/?LinkId=252719
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[download-SDK-PHP]: ../php-download-sdk/
[composer-phar]: http://getcomposer.org/composer.phar
