#Configuring an SSL certificate for a Windows Azure web site

Secure Socket Layer (SSL) encryption is the most commonly used method of securing data sent across the internet, and assures visitors to your site that their transactions with your site are secure. This common task discusses how to enable SSL for a Windows Azure Web Site.

The steps in this task require you to configure your web sites for reserved mode, which may incur additional costs if you are currently using free or shared mode. For more information, see For more information on shared and reserved mode pricing, see [Pricing Details][pricing].


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

4. Once you have obtained a certificate from a CA, create a copy of the **myserver.key** named **myserver.pem**. Using a text editor, open this file and add the certificate returned from your CA to the end of this file. It should similar to the following:

		-----BEGIN RSA PRIVATE KEY-----
		<private key contents omitted>
		-----END RSA PRIVATE KEY-----
		-----BEGIN CERTIFICATE-----
		<certificate contents omitted>
		-----END CERTIFICATE-----

	Save the file.

5. From the command-line, Bash or terminal session, use the following command to convert the **myserver.pem** into **myserver.pfx**, which is the format required by Windows Azure Web Sites:

		openssl pkcs12 -export -in myserver.pem -out myserver.pfx

	If prompted, enter a password to secure the new .pfx file.

	After running this command, you should have a **myserver.pfx** file suitable for use with Windows Azure Web Sites.

<a href="bkmk_reservedmode"></a><h2>Configure reserved mode</h2>

Enabling SSL on a web site is only available for the reserved mode of Windows Azure web sites. Before switching a web site from the free web site mode to the reserved web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on shared and reserved mode pricing, see [Pricing Details][pricing].

1. In your browser, open the [Management Portal][portal].

2. In the **Web Sites** tab, click the name of your web site.

	![selecting a web site][website]

3. Click the **SCALE** tab.

	![The scale tab][scale]

4. In the **general** section, set the web site mode by clicking **RESERVED**.

	![reserved mode selected][reserved]

5. Click **Save**. When prompted, click **Yes**.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you receive a "Configuring scale for web site '&lt;site name&gt;' failed" error you can use the details button to get more information. You may receive a "Not enough available reserved instance servers to satisfy this request." error. If you receive this error, you will need to try again later to upgrade your account.</p> 
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
[reserved]: ../media/sslreserved.png
[pricing]: https://www.windowsazure.com/en-us/pricing/details/
[configure]: ../media/sslconfig.png
[uploadcert]: ../media/ssluploadcert.png
[uploadcertdlg]: ../media/ssluploaddlg.png
[sslbindings]: ../media/sslbindings.png
[sni]: http://en.wikipedia.org/wiki/Server_Name_Indication