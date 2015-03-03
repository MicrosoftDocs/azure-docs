<properties 
	pageTitle="Add a certificate to the Java CA store - Azure" 
	description="Learn how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store for Twilio service or Azure Service Bus." 
	services="" 
	documentationCenter="java" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="robmcm"/>

# Adding a Certificate to the Java CA Certificates Store
The following steps show you how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store. The example used is for the CA certificate required by the Twilio service. Information provided later in the topic describes how to install the CA certificate for the Azure Service Bus. 

You can use keytool to add the CA certificate prior to zipping your JDK and adding it to your Azure project's **approot** folder, or you could run an Azure start-up task that uses keytool to add the certificate. This example assumes you will add a CA certificate prior to the JDK being zipped. Also, a specific CA certificate will be used in the example, but the steps of obtaining a different CA certificate and importing it into the cacerts store would be similar.

## To add a certificate to the cacerts store

1. At a command prompt that is set to your JDK's **jdk\jre\lib\security** folder, run the following to see what certificates are installed:

	`keytool -list -keystore cacerts`

	You'll be prompted for the store password. The default password is **changeit**. (If you want to change the password, see the keytool documentation at <http://docs.oracle.com/javase/7/docs/technotes/tools/windows/keytool.html>.) This example assumes that the certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 is not listed, and that you want to import it (this particular certificate is needed by the Twilio API service).
2. Obtain the certificate from the list of certificates listed at [GeoTrust Root Certificates](http://www.geotrust.com/resources/root-certificates/). Right-click the link for the certificate with serial number 35:DE:F4:CF and save it to the **jdk\jre\lib\security** folder. For purposes of this example, it was saved to a file named **Equifax\_Secure\_Certificate\_Authority.cer**.
3. Import the certificate via the following command:

	`keytool -keystore cacerts -importcert -alias equifaxsecureca -file Equifax_Secure_Certificate_Authority.cer`

	When prompted to trust this certificate, if the certificate has MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4, respond by typing **y**.
4. Run the following command to ensure the CA certificate has been successfully imported:

	`keytool -list -keystore cacerts`

5. Zip the JDK and add it to your Azure project's **approot** folder.

For information about keytool, see <http://docs.oracle.com/javase/7/docs/technotes/tools/windows/keytool.html>.

# Azure Root Certificates

Your applications that use Azure services (such as Azure Service Bus) need to trust the Baltimore CyberTrust Root certificate. (Beginning April 15, 2013, Azure began migrating from the GTE CyberTrust Global Root to the Baltimore CyberTrust Root. This migration took several months to complete.)

The Baltimore certificate might already be installed in your cacerts store, so remember to run the **keytool -list** command first to see if it already exists.

If you need to add the Baltimore CyberTrust Root, it has serial number 02:00:00:b9 and SHA1 fingerprint d4:de:20:d0:5e:66:fc:53:fe:1a:50:88:2c:78:db:28:52:ca:e4:74. It can be downloaded from <https://cacert.omniroot.com/bc2025.crt>, saved to a local file with extension **.cer**, and then imported using **keytool** as shown above.

For more information about the root certificates used by Azure, see [Windows Azure Root Certificate Migration](http://blogs.msdn.com/b/windowsazure/archive/2013/03/15/windows-azure-root-certificate-migration.aspx).

