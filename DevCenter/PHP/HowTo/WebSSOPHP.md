<properties linkid="develop-php-how-to-guides-web-sso" urlDisplayName="Web SSO" pageTitle="Web Single Sign-On with PHP and Windows Azure Active Directory" metaKeywords="Azure PHP web app, Azure single sign-on, Azure PHP Active Directory, PHP SSO AAD" metaDescription="Learn how to create a PHP web application that uses single sign-on with Windows Azure Active Directory." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />


# Web Single Sign-On with PHP and Windows Azure Active Directory

<h2><a name="introduction"></a>Introduction</h2>

This tutorial will show PHP developers how to leverage Windows Azure Active Directory to enable single sign-on for users of Office 365 customers. You will learn how to:

* Provision the web application in a customer's tenant
* Protect the application using WS-Federation

<h3>Prerequisites</h3>
The following development environment prerequisites are required for this walkthrough:

* [PHP Sample Code for Windows Azure Active Directory]
* [Eclipse PDT 3.0.x All In Ones]
* PHP 5.3.1 (via Web Platform Installer)
* Internet Information Services (IIS) 7.5 with SSL enabled
* Windows PowerShell
* [Office 365 PowerShell Commandlets]

<h3>Table of Contents</h3>
* [Introduction][]
* [Step 1: Create a PHP Application][]
* [Step 2: Provision the Application in a Company's Directory Tenant][]
* [Step 3: Protect the Application Using WS-Federation for Employee Sign In][]
* [Summary][]

<h2><a name="createapp"></a>Step 1: Create a PHP Application</h2>
This step describes how to create a simple PHP application that will represent a protected resource. Access to this resource will be granted through federated authentication managed by the company's STS, which is described later in the tutorial.

1. Open a new instance of Eclipse.
2. From the **File** menu, click **New**, then click **New PHP Project**. 
3. On the **New PHP Project** dialog, name the project *phpSample*, then click **Finish**.
4. From the **PHP Explorer** menu on the left, right-click *phpProject*, click **New**, then click **PHP File**.
5. On the **New PHP File** dialog, name the file **index.php**, then click **Finish**.
6. Replace the generated markup with the following, then save **index.php**:

		<!DOCTYPE>
		<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
			<title>Index</title>
		</head>
		<body>
			<h2>Index Page</h2>
		</body>
		</html> 

7. Open **Internet Information Services (IIS) Manager** by typing *inetmgr* at the Run prompt and pressing Enter.

8. In IIS Manager, expand the **Sites** folder in the left menu, right-click **Default Web Site**, then click **Add Application...**.

9. On the **Add Application** dialog, set the **Alias** value to *phpSample* and the **Physical path** to the file path where you created the PHP project.

10. In Eclipse, from the **Run** menu, click **Run**.

11. On the **Run PHP Web Application** menu, click **OK**.

12. The **index.php** page will open in a new tab in Eclipse. The page should simply display the text: *Index Page*. 

<h2><a name="provisionapp"></a>Step 2: Provision the Application in a Company's Directory Tenant</h2>
This step describes how an administrator of a Windows Azure Active Directory customer provisions the PHP application in their tenant and configures single sign-on. After this step is accomplished, the company's employees can authenticate to the web application using their Office 365 accounts.

The provisioning process begins by creating a new Service Principal for the application. Service Principals are used by Windows Azure Active Directory to register and authenticate applications to the directory.

1. Download and install the Office 365 PowerShell Commandlets if you haven't done so already.
2. From the **Start** menu, run the **Microsoft Online Services Module for Windows PowerShell** console. This console provides a command-line environment for configuring attributes about your Office 365 tenant, such as creating and modifying Service Principals.
3. To import the required **MSOnlineExtended** module, type the following command and press Enter:

		Import-Module MSOnlineExtended -Force
4. To connect to your Office 365 directory, you will need to provide the company's administrator credentials. Type the following command and press Enter, then enter your credential's at the prompt:

		Connect-MsolService
5. Now you will create a new Service Principal for the application. Type the following command and press Enter:

		New-MsolServicePrincipal -ServicePrincipalNames @("phpSample/localhost") -DisplayName "Federation Sample Web Site" -Type Symmetric -Usage Verify -StartDate "12/01/2012" -EndDate "12/01/2013" 
This step will output information similar to the following:

		The following symmetric key was created as one was not supplied qY+Drf20Zz+A4t2w e3PebCopoCugO76My+JMVsqNBFc=
		DisplayName           : Federation Sample PHP Web Site
		ServicePrincipalNames : {phpSample/localhost}
		ObjectId              : 59cab09a-3f5d-4e86-999c-2e69f682d90d
		AppPrincipalId        : 7829c758-2bef-43df-a685-717089474505
		TrustedForDelegation  : False
		AccountEnabled        : True
		KeyType               : Symmetric
		KeyId                 : f1735cbe-aa46-421b-8a1c-03b8f9bb3565
		StartDate             : 12/01/2012 08:00:00 a.m.
		EndDate               : 12/01/2013 08:00:00 a.m.
		Usage                 : Verify 
	<div class="dev-callout"><strong>Note</strong><p>You should save this output, especially the generated symmetric key. This key is only revealed to you during Service Principal creation, and you will be unable to retrieve it in the future. The other values are required for using the Graph API to read and write information in the directory.</p></div>

6. The final step sets the reply URL for your application. The reply URL is where responses are sent following authentication attempts. Type the following commands and press enter:

		$replyUrl = New-MsolServicePrincipalAddresses –Address "https://localhost/phpSample" 

		Set-MsolServicePrincipal –AppPrincipalId "7829c758-2bef-43df-a685-717089474505" –Addresses $replyUrl 
	
The web application has now been provisioned in the directory and it can be used for web single sign-on by company employees.

<h2><a name="protectapp"></a>Step 3: Protect the Application Using WS-Federation for Employee Sign In</h2>
This step shows you how to add support for federated login using Windows Identity Foundation (WIF) and the simpleSAML.php libraries you downloaded with the sample code in the prerequisites. You will also add a login page and configure trust between the application and the directory tenant.

1. In Eclipse, right-click the **phpSample** project, click **New**, then click **File**. 

2. On the **New File** dialog, name the file **federation.ini**, then click  **Finish**.

3. In the new **federation.ini** file, enter the following information, supplying the values with the information you saved in Step 2 when creating your Service Principal:

		federation.trustedissuers.issuer=https://accounts.accesscontrol.windows.net/v2/wsfederation
		federation.trustedissuers.thumbprint=qY+Drf20Zz+A4t2we3PebCopoCugO76My+JMVsqNBFc=
		federation.trustedissuers.friendlyname=Fabrikam
		federation.audienceuris=spn:7829c758-2bef-43df-a685-717089474505
		federation.realm=spn:7829c758-2bef-43df-a685-717089474505
		federation.reply=https://localhost/phpSample/index.php 

	<div class="dev-callout"><strong>Note</strong><p>The <b>audienceuris</b> and <b>realm</b> values must be prefaced by "spn:".</p></div>

4. In Eclipse, right-click the **phpSample** project, click **New**, then click **PHP File**. 

5. On the **New PHP File** dialog, name the file **secureResource.php**, then click  **Finish**.

6. In the new **secureResource.php** file, enter the following code, replacing the **c:\phpLibraries** path with the root location where you downloaded the sample code. The root location should include the **simpleSAML.php** file and **federation** folder:

		<?php
		ini_set('include_path', ini_get('include_path').';c:\phpLibraries\;');
		require_once ('federation/FederatedLoginManager.php');
		session_start();
		$token = $_POST['wresult'];
		$loginManager = new FederatedLoginManager();
		if (!$loginManager->isAuthenticated()) {
			if (isset ($token)) {
				try {
					$loginManager->authenticate($token);
				} catch (Exception $e) {
					print_r($e->getMessage());
				}  
			} else {
				$returnUrl = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
				header('Pragma: no-cache');
				header('Cache-Control: no-cache, must-revalidate');
				header("Location: " . FederatedLoginManager :: getFederatedLoginUrl($returnUrl), true, 302);
				exit();
			}
		}
		?> 

7. Open the **index.php** page and update its contents to secure the page, then save it:

		<?php
		require_once (dirname(__FILE__) . '/secureResource.php');
		?>
		<!DOCTYPE html>
		<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
			<title>Index Page</title>
		</head>
		<body>
			<h2>Index Page</h2>
			<h3>Welcome <strong><?php print_r($loginManager->getPrincipal()->getName()); ?></strong>!</h3>
			<h4>Claim list:</h4>
			<ul>
				<?php
				foreach ($loginManager->getClaims() as $claim) {
					print_r('<li>' . $claim->toString() . '</li>');
				}
				?>  
			</ul>
		</body>
		</html> 

8. From the **Run** menu, click **Run**. You should automatically be redirected to the Office 365 Identity Provider page, where you can log in using your directory tenant credentials. For example, *john.doe@fabrikam.onmicrosoft.com*.

<h2><a name="summary"></a>Summary</h2>
This tutorial has shown you how to create and configure a single tenant PHP application that uses the single sign-on capabilities of Windows Azure Active Directory.

[Introduction]: #introduction
[Step 1: Create a PHP Application]: #createapp
[Step 2: Provision the Application in a Company's Directory Tenant]: #provisionapp
[Step 3: Protect the Application Using WS-Federation for Employee Sign In]: #protectapp
[Summary]: #summary
[Developing Multi-Tenant Cloud Applications with Windows Azure Active Directory]: http://g.microsoftonline.com/0AX00en/121
[Windows Identity Foundation 3.5 SDK]: http://www.microsoft.com/en-us/download/details.aspx?id=4451
[Windows Identity Foundation 1.0 Runtime]: http://www.microsoft.com/en-us/download/details.aspx?id=17331
[Office 365 Powershell Commandlets]: http://onlinehelp.microsoft.com/en-us/office365-enterprises/ff652560.aspx
[ASP.NET MVC 3]: http://www.microsoft.com/en-us/download/details.aspx?id=4211
[Eclipse PDT 3.0.x All In Ones]: http://www.eclipse.org/pdt/downloads/
[PHP Sample Code for Windows Azure Active Directory]: https://github.com/WindowsAzure/azure-sdk-for-php-samples/tree/master/WAAD.WebSSO.PHP 
