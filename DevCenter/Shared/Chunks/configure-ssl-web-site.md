#Configuring an SSL certificate for a Windows Azure web site

Secure Socket Layer (SSL) encryption is the most commonly used method of securing data sent across the internet, and assures visitors to your site that their transactions with your site are secure. This common task discusses how to enable SSL for a Windows Azure Web Site.

The steps in this task require you to configure your web sites for standard mode, which may incur additional costs if you are currently using free or shared mode. For more information, see For more information on shared and standard mode pricing, see [Pricing Details][pricing].


<a href="bkmk_getcert"></a><h2>Get a Certificate</h2>

To configure SSL for an application, you first need to get an SSL certificate that has been signed by a Certificate Authority (CA), a trusted third-party who issues certificates for this purpose. If you do not already have one, you will need to obtain one from a company that sells SSL certificates.

The certificate must meet the following requirements for SSL certificates in Windows Azure:

* The certificate must contain a private key.

* The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.

* The certificate's subject name must match the domain used to access the web site. 

	* You cannot obtain an SSL certificate from a certificate authority (CA) for the azurewebsites.net domain. You must acquire a custom domain name to use when accessing your web site. 

	* For information on configuring a custom domain name for a Windows Azure Web Site, see [Configuring a custom domain name for a Windows Azure Web Site][customdomain].

* The certificate must use a minimum of 2048-bit encryption.

To get an SSL certificate from a Certificate Authority you must generate a Certificate Signing Request (CSR), which is sent to the CA. The CA will then return a certificate that is used to complete the CSR. Two common ways to generate a CSR are by using the IIS Manager or [OpenSSL][openssl]. IIS Manager is only available on Windows, while OpenSSL is available for most platforms. The steps for using both of these utilities are below.

<div class="dev-callout">
<strong>Note</strong>
<p>When following either series of steps, you will be prompted to enter a <strong>Common Name</strong>. If you will be obtaining a wildcard certificate for use with multiple domains (contoso.com, www.contoso.com, sales.contoso.com,) then this value should be *.domainname. For example, *.contoso.com. If you will be obtaining a certificate for a single domain name, this value must be the exact value that users will enter in the browser to visit your web site. For example, www.contoso.com.</p>
<p>If the Common Name specified in the certificate does not match the domain name specified in the browser, the user may receive a security alert when visiting your site.</p>
<p>For more information on how to configure the domain name of a Windows Azure Web Site, see <a href="/en-us/develop/net/common-tasks/custom-dns-web-site/">Configuring a custom domain name for a Windows Azure Web Site</a>.</p>
</div>

###Get a certificate using the IIS Manager

This section describes the steps to obtain a certificate from a trusted Certificate Authority. If you wish to create a self-signed certificate for testing, see the [Self-signed Certificates](#bkmk_selfsigned) section of this document.

1. Generate a Certificate Signing Request (CSR) with IIS Manager to send to the Certificate Authority. For more information on generating a CSR, see [Request an Internet Server Certificate (IIS 7)][iiscsr].

2. Submit your CSR to a Certificate Authority to obtain an SSL certificate. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

3. Complete the CSR with the certificate provided by the Certificate Authority vendor. For more information on completing the CSR, see [Install an Internet Server Certificate (IIS 7)][installcertiis].

4. Export the certificate from IIS Manager For more information on exporting the certificate, see [Export a Server Certificate (IIS 7)][exportcertiis]. The exported file will be used in later steps to upload to Windows Azure for use with your Windows Azure Web Site.

###Get a certificate using OpenSSL

1. Generate a private key and Certificate Signing Request by using the following from a command-line, bash or terminal session:

		openssl req -new -nodes -keyout myserver.key -out server.csr -newkey rsa:2048

2. When prompted, enter the appropriate information. For example:

 		Country Name (2 letter code) [US]: US
        State or Province Name (full name) []: Washington
        Locality Name (eg, city) []: Redmond
        Organization Name (eg, company) []: Microsoft
        Organizational Unit Name (eg, section) []: Windows Azure
        Common Name (eg, YOUR name) []: www.microsoft.com
        Email Address []:

		Please enter the following 'extra' attributes to be sent with your certificate request

       	A challenge password []: 

	Once this process completes, you should have two files; **myserver.key** and **server.csr**. The **server.csr** contains the Certificate Signing Request.

3. Submit your CSR to a Certificate Authority to obtain an SSL certificate. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

4. Once you have obtained a certificate from a CA, save it to a file named **myserver.crt**. If your CA provided the certificate in a text format, simply paste the certificate text into the **myserver.crt** file. The file should appear as follows when viewed in a text editor:

		-----BEGIN CERTIFICATE-----
		<certificate contents omitted>
		-----END CERTIFICATE-----

	Save the file.

5. From the command-line, Bash or terminal session, use the following command to convert the **myserver.key** and **myserver.crt** into **myserver.pfx**, which is the format required by Windows Azure Web Sites:

		openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

	When prompted, enter a password to secure the .pfx file.

	After running this command, you should have a **myserver.pfx** file suitable for use with Windows Azure Web Sites.

<a href="bkmk_standardmode"></a><h2>Configure standard mode</h2>

Enabling SSL on a web site is only available for the standard mode of Windows Azure web sites. Before switching a web site from the free web site mode to the standard web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on shared and standard mode pricing, see [Pricing Details][pricing].

1. In your browser, open the [Management Portal][portal].

2. In the **Web Sites** tab, click the name of your web site.

	![selecting a web site][website]

3. Click the **SCALE** tab.

	![The scale tab][scale]

4. In the **general** section, set the web site mode by clicking **STANDARD**.

	![standard mode selected][standard]

5. Click **Save**. When prompted, click **Yes**.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you receive a "Configuring scale for web site '&lt;site name&gt;' failed" error you can use the details button to get more information. You may receive a "Not enough available standard instance servers to satisfy this request." error. If you receive this error, you will need to try again later to upgrade your account.</p> 
	</div>

<a href="bkmk_getcert"></a><h2>Configure SSL</h2>

Before performing the steps in this section, you must have associated a custom DNS name with your Windows Azure Web Site. For more information, see [Configuring a custom domain name for a Windows Azure Web Site][customdomain].

1. In your browser, open the [Windows Azure Management Portal][portal].

2. In the **Web Sites** tab, click the name of your site and then select the **CONFIGURE** tab.

	![the configure tab][configure]

3. In the **certificates** section, click **upload a certificate**

	![upload a certificate][uploadcert]

4. Using the **Upload a certificate** dialog, select the .pfx certificate file created earlier using the IIS Manager or OpenSSL. Specify the password, if any, that was used to secure the .pfx file. Finally, click the **check** to upload the certificate.

	![upload certificate dialog][uploadcertdlg]

5. In the **ssl bindings** section of the **CONFIGURE** tab, use the dropdowns to select the domain name to secure with SSL, and the certificate to use. You may also select whether to use [Server Name Indication][sni] (SNI) or IP based SSL.

	![ssl bindings][sslbindings]
	
	* IP based SSL associates a certificate with a domain name by mapping the dedicated public IP address of the server to the domain name. This requires each domain name (contoso.com, fabricam.com, etc.) associated with your service to have a dedicated IP address. This is the traditional method of associating SSL certificates with a web server.

	* SNI based SSL is an extension to SSL and [Transport Layer Security][tls] (TLS) that allows multiple domains to share the same IP address, with separate security certificates for each domain. Most modern browsers (including Internet Explorer, Chrome, Firefox and Opera) support SNI, however older browsers may not support SNI. For more information on SNI, see the [Server Name Indication][sni] article on Wikipedia.

6. Click **Save** to save the changes and enable SSL.

At this point, you should be able to visit your website using HTTPS to verify that the certificate has been configured correctly.

<a href="bkmk_selfsigned"></a><h2>Self-signed certificates (Optional)</h2>

In some cases you may wish to obtain a certificate for testing, and delay purchasing one from a trusted CA until you go into production. Self-signed certificates can fill this gap. A self-signed certificate is a certificate you create and sign as if you were a Certificate Authority. While this certificate can be used to secure a web site, most browsers will return errors when visiting the site as the certificate was not signed by a trusted CA. Some browsers may even refuse to allow you to view the site.

While there are multiple ways to create a self-signed certificate, this article only provides information on using **makecert** and **OpenSSL**.

###Create a self-signed certificate using makecert

You can create a test certificate from a Windows system that has Visual Studio installed by performing the following steps:

1. From the **Start Menu** or **Start Screen**, search for **Developer Command Prompt**. Finally, right-click **Developer Command Prompt** and select **Run As Administrator**.

	If you receive a User Account Control dialog, select **Yes** to continue.

2. From the Developer Command Prompt, use the following command to create a new self-signed certificate. You must substitute **serverdnsname** with the DNS of your web site.

		makecert -r -pe -b 01/01/2013 -e 01/01/2014 -eku 1.3.6.1.5.5.7.3.1 -ss My -n CN=serverdnsname -sky exchange -sp "Microsoft RSA SChannel Cryptographic Provider" -sy 12 -len 2048

	This command will create a certificate that is good between the dates of 01/01/2013 and 01/01/2014, and will store the location in the CurrentUser certificate store.

3. From the **Start Menu** or **Start Screen**, search for **Windows PowerShell** and start this application.

4. From the Windows PowerShell prompt, use the following commands to export the certificate created previously:

		$mypwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
		get-childitem cert:\currentuser\my -dnsname serverdnsname | export-pfxcertificate -filepath file-to-export-to.pfx -password $mypwd

	This stores the specified password as a secure string in $mypwd, then finds the certificate by using the DNS name specified by the **dnsname** parameter, and exports to the file specified by the **filepath** parameter. The secure string containing the password is used to secure the exported file.

###Create a self-signed certificate using OpenSSL

1. Create a new document named **serverauth.cnf**, using the following as the contents of this file:

        [ req ]
        default_bits           = 2048
        default_keyfile        = privkey.pem
        distinguished_name     = req_distinguished_name
        attributes             = req_attributes
        x509_extensions        = v3_ca

        [ req_distinguished_name ]
        countryName			= Country Name (2 letter code)
        countryName_min			= 2
        countryName_max			= 2
        stateOrProvinceName		= State or Province Name (full name)
        localityName			= Locality Name (eg, city)
        0.organizationName		= Organization Name (eg, company)
        organizationalUnitName		= Organizational Unit Name (eg, section)
        commonName			= Common Name (eg, your website's domain name)
        commonName_max			= 64
        emailAddress			= Email Address
        emailAddress_max		= 40

        [ req_attributes ]
        challengePassword		= A challenge password
        challengePassword_min		= 4
        challengePassword_max		= 20

        [ v3_ca ]
         subjectKeyIdentifier=hash
         authorityKeyIdentifier=keyid:always,issuer:always
         basicConstraints = CA:false
         keyUsage=nonRepudiation, digitalSignature, keyEncipherment
         extendedKeyUsage = serverAuth

	This specifies the configuration settings required to produce an SSL certificate that can be used by Windows Azure Web Sites.

2. Generate a new self-signed certificate by using the following from a command-line, bash or terminal session:

		openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myserver.key -out myserver.crt -config serverauth.cnf

	This creates a new certificate using the configuration settings specified in the **serverauth.cnf** file.

3. To export the certificate to a .PFX file that can be uploaded to a Windows Azure Web Site, use the following command:

		openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

	When prompted, enter a password to secure the .pfx file.

	The **myserver.pfx** produced by this command can be used to secure your Windows Azure Web Site for testing purposes.

[customdomain]: /en-us/develop/net/common-tasks/custom-dns-web-site/
[iiscsr]: http://technet.microsoft.com/en-us/library/cc732906(WS.10).aspx
[cas]: http://go.microsoft.com/fwlink/?LinkID=269988
[installcertiis]: http://technet.microsoft.com/en-us/library/cc771816(WS.10).aspx
[exportcertiis]: http://technet.microsoft.com/en-us/library/cc731386(WS.10).aspx
[openssl]: http://www.openssl.org/
[portal]: https://manage.windowsazure.com/
[tls]: http://en.wikipedia.org/wiki/Transport_Layer_Security

[website]: ../media/sslwebsite.png
[scale]: ../media/sslscale.png
[standard]: ../media/sslreserved.png
[pricing]: https://www.windowsazure.com/en-us/pricing/details/
[configure]: ../media/sslconfig.png
[uploadcert]: ../media/ssluploadcert.png
[uploadcertdlg]: ../media/ssluploaddlg.png
[sslbindings]: ../media/sslbindings.png
[sni]: http://en.wikipedia.org/wiki/Server_Name_Indication