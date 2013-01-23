<properties linkid="develop-java-how-to-add-a-certificate" urlDisplayName="Add a Cert to the CA Store" pageTitle="Add a certificate to the Java CA store - Windows Azure" metaKeywords="Azure Twilio Java, Twilio Java Certificate, Azure Service Bus Certificate" metaDescription="Learn how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store for Twilio service or Windows Azure Service Bus." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

# Adding a Certificate to the Java CA Certificates Store
The following steps show you how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store. The example used is for the CA certificate required by the Twilio service. Information provided later in the topic describes how to install the CA certificate for the Windows Azure Service Bus. 

You can use keytool to add the CA certificate prior to zipping your JDK and adding it to your Windows Azure project's **approot** folder, or you could run a Windows Azure start-up task that uses keytool to add the certificate. This example assumes you will add a CA certificate prior to the JDK being zipped. Also, a specific CA certificate will be used in the example, but the steps of obtaining a different CA certificate and importing it into the cacerts store would be similar.

## To add a certificate to the cacerts store

1. At a command prompt that is set to your JDK's **jdk\jre\lib\security** folder, run the following to see what certificates are installed:

	`keytool -list -keystore cacerts`

	You'll be prompted for the store password. The default password is **changeit**. (If you want to change the password, see the keytool documentation at <http://docs.oracle.com/javase/1.4.2/docs/tooldocs/solaris/keytool.html>.) This example assumes that the certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 is not listed, and that you want to import it (this particular certificate is needed by the Twilio API service).
2. Obtain the certificate from the list of certificates listed at [GeoTrust Root Certificates](http://www.geotrust.com/resources/root-certificates/). Right-click the link for the certificate with serial number 35:DE:F4:CF and save it to the **jdk\jre\lib\security** folder. For purposes of this example, it was saved to a file named **Equifax\_Secure\_Certificate\_Authority.cer**.
3. Import the certificate via the following command:

	`keytool -keystore cacerts -importcert -alias equifaxsecureca -file Equifax_Secure_Certificate_Authority.cer`

	When prompted to trust this certificate, if the certificate has MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4, respond by typing **y**.
4. Run the following command to ensure the CA certificate has been successfully imported:

	`keytool -list -keystore cacerts`

5. Zip the JDK and add it to your Windows Azure project's **approot** folder.

If you want to add the CA certificate for Windows Azure Service Bus, it is the GTE CyberTrust Global Root certificate (with serial number 01:a5 and SHA1 fingerprint 97:81:79:50:D8:1C:96:70:CC:34:D8:09:CF:79:44:31:36:7E:F4:74). It can be downloaded from <https://www.globaltrustpoint.com/x509/x509trustcenter_list.jsp>, saved to a local file with extension **.cer**, and then imported using **keytool** as shown above. This certificate might already be installed in your cacerts store, so remember to run the **keytool -list** command first to see if it already exists.

For information about keytool, see <http://docs.oracle.com/javase/1.4.2/docs/tooldocs/solaris/keytool.html>.
