<properties umbracoNaviHide="1" pageTitle="Add a Certificate to the CA Store" metaKeywords="Azure Twilio Java, Twilio Java Certificate" 
metaDescription="The following steps show you how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store." 
linkid="develop-java-how-to-add-a-certificate" urlDisplayName="Add a Certificate to the CA Store" headerExpose="" footerExpose="" disqusComments="1" />

# Adding a Certificate to the Java CA Certificates Store
The following steps show you how to add a certificate authority (CA) certificate to the Java CA certificate (cacerts) store.

You can use keytool to add the CA certificate prior to zipping your JDK and adding it to your Windows Azure project’s **approot** folder, or you could run a Windows Azure start-up task that uses keytool to add the certificate. This example assumes you will add a CA certificate prior to the JDK being zipped. Also, a specific CA certificate will be used in the example, but the steps of obtaining a different CA certificate and importing it into the cacerts store would be similar.

## To add a certificate to the cacerts store

1. At a command prompt that is set to your JDK’s **jdk\jre\lib\security** folder, run the following to see what certificates are installed:

	`keytool -list -keystore cacerts`

	You’ll be prompted for the store password. The default password is **changeit**. (If you want to change the password, see the keytool documentation at [http://docs.oracle.com/javase/1.4.2/docs/tooldocs/solaris/keytool.html][keytooldoc].) This example assumes that the certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 is not listed, and that you want to import it.
2. Obtain the certificate from the list of certificates listed at [GeoTrust Root Certificates][geotrust_root_certs]: Right-click the link for the certificate with serial number 35:DE:F4:CF and save it to the **jdk\jre\lib\security** folder. For purposes of this example, it was saved to a file named **Equifax\_Secure\_Certificate\_Authority.cer**.
3. Import the certificate via the following command:

	`keytool -keystore cacerts -importcert -alias equifaxsecureca -file Equifax_Secure_Certificate_Authority.cer`

	When prompted to trust this certificate, if the certificate has MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4, respond by typing **y**.
4. Run the following command to ensure the CA certificate has been successfully imported:

	`keytool -list -keystore cacerts`

5. Zip the JDK and add it to your Windows Azure project’s **approot** folder.

For information about keytool, see [http://docs.oracle.com/javase/1.4.2/docs/tooldocs/solaris/keytool.html][keytooldoc].

[keytooldoc]: http://docs.oracle.com/javase/1.4.2/docs/tooldocs/solaris/keytool.html
[geotrust_root_certs]: http://www.geotrust.com/resources/root-certificates/



