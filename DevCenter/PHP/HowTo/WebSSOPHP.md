<properties linkid="develop-php-how-to-guides-web-sso" urlDisplayName="Web SSO" pageTitle="Single sign-on with Windows Azure Active Directory (PHP)" metaKeywords="Azure PHP web app, Azure single sign-on, Azure PHP Active Directory" metaDescription="Learn how to create a PHP web application that uses single sign-on with Windows Azure Active Directory." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


# How to implement single sign-on with Windows Azure Active Directory - PHP Application#
<h2>Table of Contents</h2>
<li>
<a href="#overview">Overview</a>
</li>
<li>
<a href="#prerequisites">Prerequisites</a></li>
<li><a href="#step1">Step 1 - Create a PHP application</a></li>
<li><a href="#step2">Step 2 - Provision the PHP application in Windows Azure Active Directory</a></li>
<li><a href="#step3">Step 3 - Protect the PHP application via WS-Federation and onboard the first customer</a></li>
<li><a href="#step4">Step 4 - Configure the PHP application for single sign-on with multiple tenants</a></li>	

<a name="overview"></a>
## Overview ##
This guide provides instructions for creating a PHP application and configuring it to leverage Windows Azure Active Directory. 

Imagine the following scenario:

- Fabrikam is an independent software vendor with a PHP application

- Awesome Computers has a subscription to Office 365

- Trey Research Inc. has a subscription to Office 365

Awesome Computers wants to provide their users (employees) with the access to the Fabrikam's PHP application. After some deliberation, both parties agree to utilize the web single sign-on approach, also called identity federation with the end result being that Awesome Computers' users will be able to access Fabrikam's PHP application in exactly the same way they access Office 365 applications. 

This web single sign-on method is made possible with the help of the Windows Azure Active Directory, which is also used by Office 365. Windows Azure Active Directory provides directory, authentication, and authorization services, including a Security Token Service (STS). 

With the web single sign-on approach, Awesome Computers will provide single sign-on access to their users through a federated mechanism that relies on an STS. Since Awesome Computers does not have its own STS, they will rely on the STS provided by Windows Azure Active Directory that was provisioned for them when they acquired Office 365.

In the instructions provided in this guide, we will play the roles of both Fabrikam and Awesome Computers and recreate this scenario by performing the following tasks: 

- Create a simple PHP application (performed by Fabrikam)
- Provision a PHP application in Windows Azure Active Directory (performed by Awesome Computers).

	**Note:** As part of this step, Awesome Computers must in turn be provisioned by the Fabrikam as a customer of their PHP application. Basically, Fabrikam needs to know that users from the Office 365 tenant with the domain **awesomecomputers.onmicrosoft.com** should be granted access to their PHP application.
- Protect the PHP application with WS-Federation and onboard the first customer (performed by Fabrikam)
- Modify the PHP application to handle single sign-on with multiple tenants (performed by Fabrikam)

**Assets**

This guide is available together with several code samples and scripts that can help you with some of the most time-consuming tasks. All materials are available at [Azure Active Directory SSO for PHP](https://github.com/WindowsAzure/azure-sdk-for-php-samples) for you to study and modify to fit your environment. 

<a name="prerequisites"></a>
## Prerequisites ##

To complete the tasks in this guide, you will need the following:

**General environment requirements:**

- Internet Information Services (IIS) 7.5 (with SSL enabled)
- Windows PowerShell 2.0
- <a href="http://onlinehelp.microsoft.com/en-us/office365-enterprises/hh124998.aspx ">Microsoft Online Services Module</a>

**PHP-specific requirements:**
    <li>PHP 5.3.1 (through Web Platform Installer)</li>
    <li>
      <a href=" http://www.eclipse.org/pdt/downloads/">Eclipse PDT 3.0.x All In Ones </a>
    </li>
   



<a name="step1"></a>
## Step 1 - Create a PHP application ##

The instructions in this step demonstrate how to create a simple PHP application. In our scenario, this step is performed by Fabrikam.


**To create a PHP application:**

1.	Open a new instance of Eclipse.
2.	Create a new project: **File** -> **New Project** -> **PHP Project**
3.	In the first wizard window provide a project name and a folder where the project will be created and click **Finish**.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step3.png" />

4. Select the sample project, right-click and select **New** -> **PHP File**.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step4.png" />

5.	Provide a name for the page and click **Finish**.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step5.png" />

6.	Replace the generated code with the following:

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

7.	Open Internet Information Service (IIS) Manager.

8.	Right-click the **Default Web Site** item and choose **Add Application**…

	<img src="../../../DevCenter/PHP/Media/phpstep1Step8.png" />

9.	Provide an alias and the path where the **phpSample** project is created and click **OK**.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step9.png" />

10.	Go back to Eclipse, click the arrow beside the play button on the toolbar and select **Index**.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step10.png" />

11.	At this point you should be able to browse the index page.

	<img src="../../../DevCenter/PHP/Media/phpstep1Step11.png" />

12.	Open a Powershell console and run the following command to generate a new GUID for this application:

		PS C:\Windows\system32> [guid]::NewGuid()
		Guid
		----
		d184f6dd-d5d6-44c8-9cfa-e2d630dea392
	
	*Note:* Make sure to record this value. This identifier will be the AppPrincipalId used in further steps in this guide when provisioning this PHP web applicaiton in Office 365. 

<a name="step2"></a>
## Step 2 - Provision the PHP application in Windows Azure Active Directory ##

Instructions in this step demonstrate how you can provision the PHP application in Windows Azure Active Directory. In our scenario, this step is performed by Awesome Computers.  Then Awesome Computers provides the application owner (Fabrikam) with the data Fabrikam needs in order to set up single sign-on access for Awesome Computers's users. 

Note: If you don’t have access to an Office 365 tenant, you can obtain one by applying for a FREE TRIAL subscription on the [Office 365’s Sign-up page](http://www.microsoft.com/en-us/office365/online-software.aspx#fbid=8qpYgwknaWN)). 

To provision the PHP application in Windows Azure Active Directory, Awesome Computers creates a new Service Principal for it in the directory. In order to create a new Service principal for the PHP application in the directory, Awesome Computers must obtain the following information from Fabrikam:

- The value of the ServicePrincipalName (phpSample/localhost)
- The AppPrincipalId (d184f6dd-d5d6-44c8-9cfa-e2d630dea392)
- The ReplyUrl 

**To provision the PHP application in Windows Azure Active Directory**

1.	Download and install a set of [Powershell scripts](https://bposast.vo.msecnd.net/MSOPMW/5164.009/amd64/administrationconfig-en.msi) from the Office 365’s online help page.
2.	Locate the **CreateServicePrincipal.ps1** script in this code example set under WAAD.WebSSO.PHP/Scripts

3.	Launch the Microsoft Online Services Module for Windows PowerShell console.

4.	Run the SampleAppServicePrincipal.ps1 command from the Microsoft Online Services Module for Windows PowerShell Console.

		PS C:\Windows\system32> ./CreateServicePrincipal.ps1		

	When asked to provide a name for your Service Principal, type in a descriptive name that you can remember in case you wish to inspect or remove the Service Principal later on.

	<img src="../../../DevCenter/PHP/Media/phpstep2Step45.png" />

5.	When prompted, enter your administration credentials for your Office365 tenant:

	<img src="../../../DevCenter/PHP/Media/phpstep2Step5.png" />

6.	If the script runs successfully, your screen will look similar to the figure below. Make sure to record the values of the following for use later in this guide:

- company ID
- AppPrincipal ID
- App Principal Secret
- Audience URI

	<img src="../../../DevCenter/PHP/Media/phpstep2Step6.png" />

	*Note: In the command shown here, AppPrincipalId values are those provided by Fabrikam.*

The Fabrikam's PHP application has been successfully provisioned in the directory tenant of Awesome Computers. 

Now Fabrikam must provision Awesome Computers as a customer of the PHP application. In other words, Fabrikam must know that users from the Office 365 tenant with domain *awesomecomputers.onmicrosoft.com* should be granted access to the PHP applicaiton. How that information reaches Fabrikam depends on how the subscriptions are handled. In this guide, the instructions for this provisioning step are not provided. 

<a name="step3"></a>
## Step 3 - Protect the PHP application via WS-Federation and onboard the first customer##

The instructions in this step demonstrate how to add support for federated login to the PHP web application created in Step 1. In our scenario, this step is performed by Fabrikam. 

This step is performed by using the **federation** and **simpleSAML.php** libraries  and adding some extra artifacts, like a login page. With the application ready to authenticate requests using the WS-Federation protocol, we’ll add the Windows Azure Active Directory tenant of Awesome Computers as a trusted provider.

1.	Create a **federation.ini** file in the project’s root and provide the following information:

	*NOTE: **audienceuri=** and **realm=** are the values you retrieved from the PowerShell command above. Remember that you must add **spn:** to be beginning of this value. Use the **audienceuri** for both values below.*

		federation.trustedissuers.issuer=https://accounts.accesscontrol.windows.net/v2/wsfederation
		federation.trustedissuers.thumbprint=3f5dfcdf4b3d0eab9ba49befb3cfd760da9cccf1
		federation.trustedissuers.friendlyname=Awesome Computers
		federation.audienceuris=spn:d184f6dd-d5d6-44c8-9cfa-e2d630dea392@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7
		federation.realm=spn:d184f6dd-d5d6-44c8-9cfa-e2d630dea392@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7
		federation.reply=https://localhost/phpSample/index.php

2.	Create a new PHP file called **secureResource.php**, include the following code, and replace the **c:\phpLibraries\** path according to the library’s folder location (the federation and the simpleSAMLphp folders should be inside the phpLibraries folder):

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

3.	Open the index.php page to secure the page by adding the require_once sentence and the code for listing the claims for the authenticated user.

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

4.	Run the project. You should be automatically redirected to the Office365 page where you can log in using your awesomecomputers.onmicrosoft.com credentials (e.g. john.doe@awesomecomputers.onmicrosoft.com).

	<img src="../../../DevCenter/PHP/Media/phpstep3Step4.png" />

5.	Finally, if the login process is successful you will be redirected to the secured page (phpSample/index.php) as an authenticated user.

	<img src="../../../DevCenter/PHP/Media/phpstep3Step5.png" />


**Important:** If your application is meant to work with a single Windows Azure Active Directory tenant, for example, if you are writing a LoB application, you can stop following the instructions in this guide at this point. By running the three steps above, you have successfully set up Windows Azure AD-enabled single sign-on to a simple PHP application for the users in one tenant.

If, however, you are developing applications that need to be accessed by more than one tenant, the next step can help you modify your code to accommodate multiple tenants.  

<a name="step4"></a>
## Step 4 - Configure the PHP application for single sign-on with Multiple tenants ##

What if Fabrikam wants to provide access to its application to multiple customers? The steps we performed in this guide so far ensure that single sign-on works with only one trusted provider. Fabrikam's developers must make some changes to their PHP application in order to provide single sign-on to whatever future customers they obtain. The main new features needed are:

- Support for multiple identity providers in the login page
- Maintenance of the list of all trusted providers and the audienceURI they will send to the application; That list can be used to determine how to validate incoming tokens

Let's add another fictitious customer to our scenario, Trey research Inc. Trey Research Inc. must register Fabrikam's PHP application in its tenant the same way Awesome Computers have done in Step 2. The following is the list of configuration changes that Fabrikam needs to perform to their PHP application to enable multi-tenant single sign-on, intertwined with the provisioning of Trey Research Inc.

1.	From Eclipse, right-click the **phpSample** project, select **New** -> **Xml File** and provide “**trustedIssuers.xml**” as the file name. This file will contain a list of the trusted issuers for the application (in this case with Awesome Computers and Trey Research Inc.) which will be used by the dynamic audience Uri validator.

	<img src="../../../DevCenter/PHP/Media/phpstep4Step1.png" />

2.	Go to the scripts folder and open the **Microsoft.Samples.Waad.Federation.PS** link to generate the trusted issuers’ nodes to add to the XML repository. It will ask you for the **AppPrincipalId** and the **AppDomain** name to generate the issuer node as depicted below:

	<img src="../../../DevCenter/PHP/Media/phpstep4Step2.png" />

	*Note: Behind the scenes the script will retrieve the federation metadata to get the issuer identifier for generating the realm’s SPN value.*

3.	Open the XML file, create an **issuers** root node and include the output node:

		<issuers>
			<issuer name="awesomecomputers.onmicrosoft.com" displayName="awesomecomputers.onmicrosoft.com " realm="spn:d184f6dd-d5d6-44c8-9cfa-e2d630dea392@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7" />
		</issuers>

4.	Repeat Step 2 to generate Trey Research Inc. node. Notice that you can change the display name to show a user-friendly name.

		<issuers>
			<issuer name="awesomecomputers.onmicrosoft.com" displayName="Awesome Computers" realm="spn:d184f6dd-d5d6-44c8-9cfa-e2d630dea392@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7" />
			<issuer name="treyresearchinc.onmicrosoft.com" displayName="Trey Research Inc." realm="spn:d184f6dd-d5d6-44c8-9cfa-e2d630dea392@13292593-4861-4847-8441-6da6751cfb86" />
		</issuers>

5.	Create a new **login.php** file and include the following code: 

		<?php
		ini_set('include_path', ini_get('include_path').';c:\phpLibraries\;');
		
		require_once ('waad-federation/TrustedIssuersRepository.php');
		
		$repository = new TrustedIssuersRepository();
		$trustedIssuers = $repository->getTrustedIdentityProviderUrls();
		
		?>
		<!DOCTYPE html>
		<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
			<title>Login Page</title>
		</head>
		<body>
			<h3>Login Page</h3>
			
			<ul>
		<?php 
			foreach ($trustedIssuers as $trustedIssuer) {
				print_r('<li><a href="' . $trustedIssuer->getLoginUrl("https://localhost/phpSample/index.php") . '">' . $trustedIssuer->displayName . '</a></li>');
			}
		?>
			</ul>
		</body>
		</html>

	*Note: Replace the **c:\phpLibraries\** path with the path where the libraries are located (federation, waad-federation and simpleSAMLphp should be inside this folder).*

6.	Open the **secureResource.php** file and replace the required library “**federation/FederatedLoginManager.php**” with “**waad-federation/ConfigurableFederatedLoginManager.php**”

		require_once ('waad-federation/ConfigurableFederatedLoginManager.php');	

7.	Replace the class name **FederatedLoginManager** with **ConfigurableFederatedLoginManager** when instantiating the object.

		$loginManager = new ConfigurableFederatedLoginManager();	

8.	Also replace the Location header with the following:

		header("Location: https://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']) . "/login.php?returnUrl=" . $returnUrl, true, 302);	

9.	Run the project and you will be able to see a list with the links for each trusted identity provider retrieved from the “trusted.issuers.xml” repository.

	<img src="../../../DevCenter/PHP/Media/phpstep4Step9.png" />

	*Note: The home realm discovery strategy of presenting an explicit list of trusted providers is not always feasible in practice. Here it is used for the sake of simplicity.*

	Once you see the list of the trusted identity providers in your browser, you can navigate to either provider: the authentication flow will unfold in the same way described in the former section. The application will validate the incoming token accordingly. You can try to delete entries in trusted.issuers.xml, as it would happen, for example, once a subscription expires, and verify that the application then will reject authentication attempts from the corresponding provider. 