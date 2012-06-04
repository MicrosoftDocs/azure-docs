###Install as a PEAR package

To install the PHP Client Libraries for Windows Azure as a PEAR package, follow these steps:

1. [Install PEAR][chunk-install-pear].
2. Install the PEAR package:

		pear install pear.windowsazure.com/WindowsAzure

After the installation completes, you can reference class libraries from your application.

###Install manually

To download and install the PHP Client Libraries for Windows Azure manually, follow these steps:

1. Download a .zip archive that contains the libraries from [GitHub][chunk-php-sdk-github]. Alternatively, fork the repository and clone it to your local machine. (The latter option requires a GitHub account and having Git installed locally.)

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>The PHP Client Libraries for Windows Azure have a dependency on the <a href="http://pear.php.net/package/HTTP_Request2">HTTP_Request2</a>, <a href="http://pear.php.net/package/Mail_mime">Mail_mime</a>, and <a href="http://pear.php.net/package/Mail_mimeDecode">Mail_mimeDecode</a> PEAR packages. The recommended way to resolve these dependencies is to install these packages using the <a href="http://pear.php.net/manual/en/installation.php">PEAR package manager</a>.</p> 
	</div>


2. Copy the `WindowsAzure` directory of the downloaded archive to your application directory structure.

[chunk-install-pear]: http://pear.php.net/manual/en/installation.php
[chunk-php-sdk-github]: http://go.microsoft.com/fwlink/?LinkId=252719