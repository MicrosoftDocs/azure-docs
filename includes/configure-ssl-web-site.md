#Enable HTTPS for an Azure website

When someone visits your website using HTTPS, the communication between the website and the browser is secured using Secure Socket Layer (SSL) encryption. This is the most commonly used method of securing data sent across the internet, and assures visitors that their transactions with your site are secure. This article discusses how to enable HTTPS for an Azure Website. 

> [WACOM.NOTE] In order to enable HTTPS for custom domain names, you must configure your websites for standard mode. This may incur additional costs if you are currently using free or shared mode. For more information on shared and standard mode pricing, see [Pricing Details][pricing]. To get started with Azure, see [Microsoft Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/).

<a href="bkmk_azurewebsites"></a><h2>The \*.azurewebsites.net domain</h2>

If you are not planning on using a custom domain name, but are instead planning on using the \*.azurewebsites.net domain assigned to your website by Azure (for example, contoso.azurewebsites.net,) then your site is already secured by a certificate provided by Microsoft. You can use **https://mywebsite.azurewebsites.net** to access your site securely. However, \*.azurewebsites.net is a shared domain, and like all shared domains is not as secure as using a custom domain with your own certificate.

The rest of this document provides details on enabling HTTPS for custom domain names, such as **contoso.com**, **www.contoso.com**, or **\*.contoso.com**

<a href="bkmk_domainname"></a><h2>Custom domain names</h2>

To enable HTTPS for a custom domain name, such as **contoso.com**, you must register a custom domain name with a domain name registrar. For more information on how to configure the domain name of an Azure Website, see [Configuring a custom domain name for an Azure Web Site](/en-us/develop/net/common-tasks/custom-dns-web-site/). Once you have registered a custom domain name and configured your website to respond to the custom name, you must request an SSL certificate for the domain. 

Registering a domain name also enables you to create subdomains such as **www.contoso.com** or **mail.contoso.com**. Before requesting an SSL certificate you must first determine which domain names will be secured by the certificate. This will determine what type of certificate you must obtain. If you just need to secure a single domain name such as **contoso.com** or **www.contoso.com** a basic certificate will probably be sufficient. If you need to secure multiple domain names, such as **contoso.com**, **www.contoso.com**, and **mail.contoso.com**, then a wildcard certificate, or a certificate with Subject Alternate Name (subjectAltName, SAN) will be required.

> [WACOM.NOTE] Most browsers will display a warning if the domain name specified in the certificate does not match the domain name that was entered in the browser. For example, if the certificate only lists www.contoso.com, but login.contoso.com is the domain name used to access the site in Internet Explorer, you will receive a warning that "The security certificate presented by this website was issued for a different website's address."

**Basic certificates** are certificates where the Common Name (CN) of the certificate is set to the specific domain or subdomain that clients will use to visit the site. For example, **www.contoso.com**. These certificates only secure the single domain name specified by the CN.

**Wildcard certificates** are certificates where the CN of the certificate contains a wildcard '\*' at the subdomain level. This allows the certificate to match a single level of subdomains for a given domain. For example, a wildcard certificate for **\*.contoso.com** would be valid for **www.contoso.com**, **payment.contoso.com**, and **login.contoso.com**. It would not be valid for **test.login.contoso.com**, as this adds an extra subdomain level. It would also not be valid for **contoso.com**, as this is the root domain level and not a subdomain.

A wildcard certificate is what Microsoft provides for the \*.azurewebsites.net domain name automatically created for your website.

**subjectAltName** is an certificate extension that allows various values, or Subject Alternate Names, to be associated with a certificate. For the purpose of SSL certificates, this allows you to add additional DNS names that the certificate will be valid against. For example, a certificate using subjectAltName may have a CN of **contoso.com**, but may also have alternate names of **www.contoso.com**, **payment.contoso.com**, **test.login.contoso.com**, and even **fabrikam.com**. Such a certificate would be valid for all domain names specified in the Common Name and subjectAltName.

It is possible for a certificate to provide support for both wildcards and subjectAltName.

<a href="bkmk_getcert"></a><h2>Get a certificate</h2>

SSL certificates used with Azure Websites must be signed by a Certificate Authority (CA), a trusted third-party who issues certificates for this purpose. If you do not already have one, you will need to obtain one from a company that sells SSL certificates. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

The certificate must meet the following requirements for SSL certificates in Azure:

* The certificate must contain a private key.

* The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.

* The certificate's subject name must match the domain used to access the website. If you need to serve multiple domains with this certificate, you will need to use a wildcard value or specify subjectAltName values as discussed previously.

	* For information on configuring a custom domain name for an Azure Website, see [Configuring a custom domain name for an Azure Web Site][customdomain].
	
	> [WACOM.NOTE] Do not attempt to obtain or generate a certificate for the azurewebsites.net domain.

* The certificate should use a minimum of 2048-bit encryption.

> [WACOM.NOTE] Certificates issued from private CA servers are not supported by Azure Websites.

To get an SSL certificate from a Certificate Authority you must generate a Certificate Signing Request (CSR), which is sent to the CA. The CA will then return a certificate that is used to complete the CSR. Two common ways to generate a CSR are by using the certmgr.exe or [OpenSSL][openssl] applications. Certmgr.exe is only available on Windows, while OpenSSL is available for most platforms. The steps for using both of these utilities are below.

> [WACOM.NOTE] Elliptic Curve Cryptography (ECC) certificates are supported with Azure Websites; however, they are relatively new and you should work with your CA on the exact steps to create the CSR. Once you have obtained an ECC certificate, you can upload it to your Website as described in the steps below.

You may also need to obtain **intermediate certificates** (also known as chain certificates), if these are used by your CA. The use of intermediate certificates is considered more secure than 'unchained certificates', so it is common for a CA to use them. Intermediate certificates are often provided as a separate download from the CAs website. The steps in this article provide steps on how to ensure that any intermediate certificates are merged with the certificate uploaded to your Azure website. 

> [WACOM.NOTE] When following either series of steps, you will be prompted to enter a **Common Name**. If you will be obtaining a wildcard certificate for use with multiple domains (www.contoso.com, sales.contoso.com,) then this value should be \*.domainname (for example, \*.contoso.com). If you will be obtaining a certificate for a single domain name, this value must be the exact value that users will enter in the browser to visit your website. For example, www.contoso.com.
>
> If you need to support both a wildcard name like \*.contoso.com and a root domain name like contoso.com, you can use a wildcard Subject Alternative Name (SAN) certificate. For an example of creating a certificate request that uses the SubjectAltName extensions, see [SubjectAltName certificate](#bkmk_subjectaltname).
> 
> For more information on how to configure the domain name of an Azure Website, see <a href="/en-us/develop/net/common-tasks/custom-dns-web-site/">Configuring a custom domain name for an Azure Website</a>.

###Get a certificate using Certreq.exe (Windows only)

Certreq.exe is Windows utility for creating certificate requests. It has been part of the base Windows installation since Windows XP/Windows Server 2000, so should be available on recent Windows systems. Use the following steps to obtain an SSL certificate using certreq.exe.

If you wish to create a self-signed certificate for testing, see the [Self-signed Certificates](#bkmk_selfsigned) section of this document.

If you wish to use the IIS Manager to create a certificate request, see the [Get a certificate using IIS Manager](#bkmk_iismgr) section.

1. Open **Notepad** and create a new document that contains the following. Replace **mysite.com** on the Subject line with the custom domain name of your website. For example, Subject = "CN=www.contoso.com".

		[NewRequest]
		Subject = "CN=mysite.com"
		Exportable = TRUE
		KeyLength = 2048
		KeySpec = 1
		KeyUsage = 0xA0
		MachineKeySet = True
		ProviderName = "Microsoft RSA SChannel Cryptographic Provider"
		ProviderType = 12
		RequestType = CMC

		[EnhancedKeyUsageExtension]
		OID=1.3.6.1.5.5.7.3.1

	For more information on the options specified above, as well as other available options, see the [Certreq reference documentationn](http://technet.microsoft.com/library/cc725793.aspx).

2. Save the text file as **myrequest.txt**.

3. From the **Start Screen** or **Start Menu**, run **cmd.exe**.

4. From the command prompt, use the following command to create the certificate request file:

		certreq -new \path\to\myrequest.txt \path\to\create\myrequest.csr

	Specify the path to the **myrequest.txt** file created in step 1, and the path to use when creating the **myrequest.csr** file.

5. Submit the **myrequest.csr** to a Certificate Authority to obtain an SSL certificate. This may involve uploading the file, or opening the file in Notepad and pasting the contents directly into a web form.

	For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

6. Once the Certificate Authority has provided you with a certificate (.CER) file, save this file to the computer used to generate the request, and then use the following command to accept the request and complete the certificate generation process.

		certreq -accept -user mycert.cer

	In this case, the **mycert.cer** certificate received from the Certificate Authority will be used to complete the signature of the certificate. No file will be created; instead, the certificate will be stored in the Windows certificate store.

6. If your CA uses intermediate certificates, you must install these certificates before exporting the certificate in the next steps. Usually these certificates are provided as a separate download from your CA, and are provided in several formats for different web server types. Select the version that is provided for Microsoft IIS.

	Once you have downloaded the certificate, right click on it in explorer and select **Install certificate**. Use the default values in the **Certificate Import Wizard**, and continue selecting **Next** until the import has completed.

7. To export the certificate from the certificate store, run **certmgr.msc** from the **Start Screen** or **Start Menu**. When **Certificate Manager** appears, expand the **Personal** folder, and then select **Certificates**. In the **Issued To** field, look for an entry with the custom domain name you requested a certificate for. In the **Issued By** field, it should list the Certificate Authority you used for this certificate.

	![insert image of cert manager here][certmgr]

9. Right click the certificate and select **All Tasks**, and then select **Export**. In the **Certificate Export Wizard**, click **Next** and then select **Yes, export the private key**. Click **Next**.

	![Export the private key][certwiz1]

10. Select **Personal Information Exchange - PKCS #12**, **Include all certificates in the certificate chain**, and **Export all extended properties**. Click **Next**.

	![include all certs and extended properties][certwiz2]

11. Select **Password**, and then enter and confirm the password. Click **Next**.

	![specify a password][certwiz3]

12. Provide a path and filename that will contain the exported certificate. The filename should have an extension of **.pfx**. Click **Next** to complete the process.

	![provide a file path][certwiz4]

You can now upload the exported PFX file to your Azure Website.

###Get a certificate using OpenSSL

1. Generate a private key and Certificate Signing Request by using the following from a command-line, bash or terminal session:

		openssl req -new -nodes -keyout myserver.key -out server.csr -newkey rsa:2048

2. When prompted, enter the appropriate information. For example:

 		Country Name (2 letter code) 
        State or Province Name (full name) []: Washington
        Locality Name (eg, city) []: Redmond
        Organization Name (eg, company) []: Microsoft
        Organizational Unit Name (eg, section) []: Azure
        Common Name (eg, YOUR name) []: www.microsoft.com
        Email Address []:

		Please enter the following 'extra' attributes to be sent with your certificate request

       	A challenge password []: 

	Once this process completes, you should have two files; **myserver.key** and **server.csr**. The **server.csr** contains the Certificate Signing Request.

3. Submit your CSR to a Certificate Authority to obtain an SSL certificate. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

4. Once you have obtained a certificate from a CA, save it to a file named **myserver.crt**. If your CA provided the certificate in a text format, simply paste the certificate text into the **myserver.crt** file. The file contents should be similar to the following when viewed in a text editor:

		-----BEGIN CERTIFICATE-----
		MIIDJDCCAgwCCQCpCY4o1LBQuzANBgkqhkiG9w0BAQUFADBUMQswCQYDVQQGEwJV
		UzELMAkGA1UECBMCV0ExEDAOBgNVBAcTB1JlZG1vbmQxEDAOBgNVBAsTB0NvbnRv
		c28xFDASBgNVBAMTC2NvbnRvc28uY29tMB4XDTE0MDExNjE1MzIyM1oXDTE1MDEx
		NjE1MzIyM1owVDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdS
		ZWRtb25kMRAwDgYDVQQLEwdDb250b3NvMRQwEgYDVQQDEwtjb250b3NvLmNvbTCC
		ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN96hBX5EDgULtWkCRK7DMM3
		enae1LT9fXqGlbA7ScFvFivGvOLEqEPD//eLGsf15OYHFOQHK1hwgyfXa9sEDPMT
		3AsF3iWyF7FiEoR/qV6LdKjeQicJ2cXjGwf3G5vPoIaYifI5r0lhgOUqBxzaBDZ4
		xMgCh2yv7NavI17BHlWyQo90gS2X5glYGRhzY/fGp10BeUEgIs3Se0kQfBQOFUYb
		ktA6802lod5K0OxlQy4Oc8kfxTDf8AF2SPQ6BL7xxWrNl/Q2DuEEemjuMnLNxmeA
		Ik2+6Z6+WdvJoRxqHhleoL8ftOpWR20ToiZXCPo+fcmLod4ejsG5qjBlztVY4qsC
		AwEAATANBgkqhkiG9w0BAQUFAAOCAQEAVcM9AeeNFv2li69qBZLGDuK0NDHD3zhK
		Y0nDkqucgjE2QKUuvVSPodz8qwHnKoPwnSrTn8CRjW1gFq5qWEO50dGWgyLR8Wy1
		F69DYsEzodG+shv/G+vHJZg9QzutsJTB/Q8OoUCSnQS1PSPZP7RbvDV9b7Gx+gtg
		7kQ55j3A5vOrpI8N9CwdPuimtu6X8Ylw9ejWZsnyy0FMeOPpK3WTkDMxwwGxkU3Y
		lCRTzkv6vnHrlYQxyBLOSafCB1RWinN/slcWSLHADB6R+HeMiVKkFpooT+ghtii1
		A9PdUQIhK9bdaFicXPBYZ6AgNVuGtfwyuS5V6ucm7RE6+qf+QjXNFg==
		-----END CERTIFICATE-----

	Save the file.

5. From the command-line, Bash or terminal session, use the following command to convert the **myserver.key** and **myserver.crt** into **myserver.pfx**, which is the format required by Azure Websites:

		openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

	When prompted, enter a password to secure the .pfx file.

	<div class="dev-callout"> 
	<b>Note</b>
	<p>If your CA uses intermediate certificates, you must install these certificates before exporting the certificate in the next step. Usually these certificates are provided as a separate download from your CA, and are provided in several formats for different web server types. Select the version that is provided as a PEM file (.pem file extension.)</p>
	<p>The follow command demonstrates how to create a .pfx file that includes intermediate certificates, which are contained in the <b>intermediate-cets.pem</b> file:</p>
	<pre><code>
	openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt -certfile intermediate-cets.pem
	</code></pre>
	</div>

	After running this command, you should have a **myserver.pfx** file suitable for use with Azure Websites.

<a href="bkmk_standardmode"></a><h2>Configure standard mode</h2>

Enabling HTTPS for a custom domain is only available for the standard mode of Azure websites. Use the following steps to switch to standard mode.

> [WACOM.NOTE] Before switching a website from the free website mode to the standard website mode, you should remove spending caps in place for your Website subscription, otherwise you risk your site becoming unavailable if you reach your caps before the billing period ends. For more information on shared and standard mode pricing, see [Pricing Details][pricing].

1. In your browser, open the [Management Portal][portal].

2. In the **Websites** tab, click the name of your website.

	![selecting a web site][website]

3. Click the **SCALE** tab.

	![The scale tab][scale]

4. In the **general** section, set the website mode by clicking **STANDARD**.

	![standard mode selected][standard]

5. Click **Save**. When prompted, click **Yes**.

	> [WACOM.NOTE] If you receive a "Configuring scale for website '&lt;site name&gt;' failed" error you can use the details button to get more information. You may receive a "Not enough available standard instance servers to satisfy this request." error. If you receive this error, please contact [Azure support](http://www.windowsazure.com/en-us/support/options/).

<a href="bkmk_configuressl"></a><h2>Configure SSL</h2>

Before performing the steps in this section, you must have associated a custom domain name with your Azure Website. For more information, see [Configuring a custom domain name for an Azure Web Site][customdomain].

1. In your browser, open the [Azure Management Portal][portal].

2. In the **Websites** tab, click the name of your site and then select the **CONFIGURE** tab.

	![the configure tab][configure]

3. In the **certificates** section, click **upload a certificate**

	![upload a certificate][uploadcert]

4. Using the **Upload a certificate** dialog, select the .pfx certificate file created earlier using the IIS Manager or OpenSSL. Specify the password, if any, that was used to secure the .pfx file. Finally, click the **check** to upload the certificate. Please note : The Certificates should be SSL Certificate with Extended Key Value of 1.3.6.1.5.5.7.3.1. If not the certficate upload will fail with error message “Could not upload the certificate for web site xxx”.

	![upload certificate dialog][uploadcertdlg]

5. In the **ssl bindings** section of the **CONFIGURE** tab, use the dropdowns to select the domain name to secure with SSL, and the certificate to use. You may also select whether to use [Server Name Indication][sni] (SNI) or IP based SSL.

	![ssl bindings][sslbindings]
	
	* IP based SSL associates a certificate with a domain name by mapping the dedicated public IP address of the server to the domain name. This requires each domain name (contoso.com, fabricam.com, etc.) associated with your service to have a dedicated IP address. This is the traditional method of associating SSL certificates with a web server.

	* SNI based SSL is an extension to SSL and [Transport Layer Security][tls] (TLS) that allows multiple domains to share the same IP address, with separate security certificates for each domain. Most modern browsers (including Internet Explorer, Chrome, Firefox and Opera) support SNI, however older browsers may not support SNI. For more information on SNI, see the [Server Name Indication][sni] article on Wikipedia.

6. Click **Save** to save the changes and enable SSL.

> [WACOM.NOTE] If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps:
>
> 1. After you have configured an IP based SSL binding, a dedicated IP address is assigned to your website. You can find this IP address on the **Dashboard** page of your website, in the **quick glance** section. It will be listed as **Virtual IP Address**:
>    
>     ![Virtual IP address](./media/configure-ssl-web-site/staticip.png)
>    
>     Note that this IP address will be different than the virtual IP address used previously to configure the A record for your domain. If you are configured to use SNI based SSL, or are not configured to use SSL, no address will be listed for this entry.
>
> 2. Using the tools provided by your domain name registrar, modify the A record for your custom domain name to point to the IP address from the previous step.


At this point, you should be able to visit your website using HTTPS to verify that the certificate has been configured correctly.

<a href="bkmk_subjectaltname"></a><h2>SubjectAltName certificates (Optional)</h2>

OpenSSL can be used to create a certificate request that uses the SubjectAltName extension to support multiple domain names with a single certificate, however it requires a configuration file. The following steps walk through creating a configuration file, and then using it to request a certificate.

1. Create a new file named __sancert.cnf__ and use the following as the contents of the file:
 
		# -------------- BEGIN custom sancert.cnf -----
		HOME = .
		oid_section = new_oids
		[ new_oids ]
		[ req ]
		default_days = 730
		distinguished_name = req_distinguished_name
		encrypt_key = no
		string_mask = nombstr
		req_extensions = v3_req # Extensions to add to certificate request
		[ req_distinguished_name ]
		countryName = Country Name (2 letter code)
		countryName_default = 
		stateOrProvinceName = State or Province Name (full name)
		stateOrProvinceName_default = 
		localityName = Locality Name (eg, city)
		localityName_default = 
		organizationalUnitName  = Organizational Unit Name (eg, section)
		organizationalUnitName_default  = 
		commonName              = Your common name (eg, domain name)
		commonName_default      = www.mydomain.com
		commonName_max = 64
		[ v3_req ]
		subjectAltName=DNS:ftp.mydomain.com,DNS:blog.mydomain.com,DNS:*.mydomain.com
		# -------------- END custom sancert.cnf -----

	Note the line that begins with 'subjectAltName'. Replace the domain names currently listed with domain names you wish to support in addition to the common name. For example:

		subjectAltName=DNS:sales.contoso.com,DNS:support.contoso.com,DNS:fabrikam.com

	You do not need to change the commonName_default field, as you will be prompted to enter your common name in one of the following steps.

2. Save the __sancert.cnf__ file.

1. Generate a private key and Certificate Signing Request by using the sancert.cnf configuration file. From a bash or terminal session, use the following command:

		openssl req -new -nodes -keyout myserver.key -out server.csr -newkey rsa:2048 -config sancert.cnf

2. When prompted, enter the appropriate information. For example:

 		Country Name (2 letter code) []: US
        State or Province Name (full name) []: Washington
        Locality Name (eg, city) []: Redmond
        Organizational Unit Name (eg, section) []: Azure
        Your common name (eg, domain name) []: www.microsoft.com
 

	Once this process completes, you should have two files; **myserver.key** and **server.csr**. The **server.csr** contains the Certificate Signing Request.

3. Submit your CSR to a Certificate Authority to obtain an SSL certificate. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

4. Once you have obtained a certificate from a CA, save it to a file named **myserver.crt**. If your CA provided the certificate in a text format, simply paste the certificate text into the **myserver.crt** file. The file contents should be similar to the following when viewed in a text editor:

		-----BEGIN CERTIFICATE-----
		MIIDJDCCAgwCCQCpCY4o1LBQuzANBgkqhkiG9w0BAQUFADBUMQswCQYDVQQGEwJV
		UzELMAkGA1UECBMCV0ExEDAOBgNVBAcTB1JlZG1vbmQxEDAOBgNVBAsTB0NvbnRv
		c28xFDASBgNVBAMTC2NvbnRvc28uY29tMB4XDTE0MDExNjE1MzIyM1oXDTE1MDEx
		NjE1MzIyM1owVDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdS
		ZWRtb25kMRAwDgYDVQQLEwdDb250b3NvMRQwEgYDVQQDEwtjb250b3NvLmNvbTCC
		ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN96hBX5EDgULtWkCRK7DMM3
		enae1LT9fXqGlbA7ScFvFivGvOLEqEPD//eLGsf15OYHFOQHK1hwgyfXa9sEDPMT
		3AsF3iWyF7FiEoR/qV6LdKjeQicJ2cXjGwf3G5vPoIaYifI5r0lhgOUqBxzaBDZ4
		xMgCh2yv7NavI17BHlWyQo90gS2X5glYGRhzY/fGp10BeUEgIs3Se0kQfBQOFUYb
		ktA6802lod5K0OxlQy4Oc8kfxTDf8AF2SPQ6BL7xxWrNl/Q2DuEEemjuMnLNxmeA
		Ik2+6Z6+WdvJoRxqHhleoL8ftOpWR20ToiZXCPo+fcmLod4ejsG5qjBlztVY4qsC
		AwEAATANBgkqhkiG9w0BAQUFAAOCAQEAVcM9AeeNFv2li69qBZLGDuK0NDHD3zhK
		Y0nDkqucgjE2QKUuvVSPodz8qwHnKoPwnSrTn8CRjW1gFq5qWEO50dGWgyLR8Wy1
		F69DYsEzodG+shv/G+vHJZg9QzutsJTB/Q8OoUCSnQS1PSPZP7RbvDV9b7Gx+gtg
		7kQ55j3A5vOrpI8N9CwdPuimtu6X8Ylw9ejWZsnyy0FMeOPpK3WTkDMxwwGxkU3Y
		lCRTzkv6vnHrlYQxyBLOSafCB1RWinN/slcWSLHADB6R+HeMiVKkFpooT+ghtii1
		A9PdUQIhK9bdaFicXPBYZ6AgNVuGtfwyuS5V6ucm7RE6+qf+QjXNFg==
		-----END CERTIFICATE-----

	Save the file.

5. From the command-line, Bash or terminal session, use the following command to convert the **myserver.key** and **myserver.crt** into **myserver.pfx**, which is the format required by Azure Websites:

		openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

	When prompted, enter a password to secure the .pfx file.

	<div class="dev-callout"> 
	<b>Note</b>
	<p>If your CA uses intermediate certificates, you must install these certificates before exporting the certificate in the next step. Usually these certificates are provided as a separate download from your CA, and are provided in several formats for different web server types. Select the version that is provided as a PEM file (.pem file extension.)</p>
	<p>The follow command demonstrates how to create a .pfx file that includes intermediate certificates, which are contained in the <b>intermediate-cets.pem</b> file:</p>
	<pre><code>
	openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt -certfile intermediate-cets.pem
	</code></pre>
	</div>

	After running this command, you should have a **myserver.pfx** file suitable for use with Azure Websites.

##<a name="bkmk_iismgr"></a>Get a certificate using the IIS Manager (Optional)

If you are familiar with IIS Manager, you can use it to generate a certificate that can be used with Azure Websites.

1. Generate a Certificate Signing Request (CSR) with IIS Manager to send to the Certificate Authority. For more information on generating a CSR, see [Request an Internet Server Certificate (IIS 7)][iiscsr].

2. Submit your CSR to a Certificate Authority to obtain an SSL certificate. For a list of Certificate Authorities, see [Windows and Windows Phone 8 SSL Root Certificate Program (Members CAs)][cas] on the Microsoft TechNet Wiki.

3. Complete the CSR with the certificate provided by the Certificate Authority vendor. For more information on completing the CSR, see [Install an Internet Server Certificate (IIS 7)][installcertiis].

4. If your CA uses intermediate certificates, you must install these certificates before exporting the certificate in the next step. Usually these certificates are provided as a separate download from your CA, and are provided in several formats for different web server types. Select the version that is provided for Microsoft IIS.

	Once you have downloaded the certificate, right click on it in explorer and select **Install certificate**. Use the default values in the **Certificate Import Wizard**, and continue selecting **Next** until the import has completed.

4. Export the certificate from IIS Manager For more information on exporting the certificate, see [Export a Server Certificate (IIS 7)][exportcertiis]. The exported file will be used in later steps to upload to Azure for use with your Azure Website.

	<div class="dev-callout"> 
	<b>Note</b>
	<p>During the export process, be sure to select the option <strong>Yes, export the private key</strong>. This will include the private key in the exported certificate.</p>
	</div>

	<div class="dev-callout"> 
	<b>Note</b>
	<p>During the export process, be sure to select the option <strong>include all certs in the certification path</strong> and and <strong>Export all extended properties</strong>. This will include any intermediate certificates in the exported certificate.</p>
	</div>

<a href="bkmk_selfsigned"></a><h2>Self-signed certificates (Optional)</h2>

In some cases you may wish to obtain a certificate for testing, and delay purchasing one from a trusted CA until you go into production. Self-signed certificates can fill this gap. A self-signed certificate is a certificate you create and sign as if you were a Certificate Authority. While this certificate can be used to secure a website, most browsers will return errors when visiting the site as the certificate was not signed by a trusted CA. Some browsers may even refuse to allow you to view the site.

While there are multiple ways to create a self-signed certificate, this article only provides information on using **makecert** and **OpenSSL**.

###Create a self-signed certificate using makecert

You can create a test certificate from a Windows system that has Visual Studio installed by performing the following steps:

1. From the **Start Menu** or **Start Screen**, search for **Developer Command Prompt**. Finally, right-click **Developer Command Prompt** and select **Run As Administrator**.

	If you receive a User Account Control dialog, select **Yes** to continue.

2. From the Developer Command Prompt, use the following command to create a new self-signed certificate. You must substitute **serverdnsname** with the DNS of your website.

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

	This specifies the configuration settings required to produce an SSL certificate that can be used by Azure Websites.

2. Generate a new self-signed certificate by using the following from a command-line, bash or terminal session:

		openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myserver.key -out myserver.crt -config serverauth.cnf

	This creates a new certificate using the configuration settings specified in the **serverauth.cnf** file.

3. To export the certificate to a .PFX file that can be uploaded to an Azure Website, use the following command:

		openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

	When prompted, enter a password to secure the .pfx file.

	The **myserver.pfx** produced by this command can be used to secure your Azure Website for testing purposes.

[customdomain]: /en-us/develop/net/common-tasks/custom-dns-web-site/
[iiscsr]: http://technet.microsoft.com/en-us/library/cc732906(WS.10).aspx
[cas]: http://go.microsoft.com/fwlink/?LinkID=269988
[installcertiis]: http://technet.microsoft.com/en-us/library/cc771816(WS.10).aspx
[exportcertiis]: http://technet.microsoft.com/en-us/library/cc731386(WS.10).aspx
[openssl]: http://www.openssl.org/
[portal]: https://manage.windowsazure.com/
[tls]: http://en.wikipedia.org/wiki/Transport_Layer_Security
[staticip]: ./media/configure-ssl-web-site/staticip.png
[website]: ./media/configure-ssl-web-site/sslwebsite.png
[scale]: ./media/configure-ssl-web-site/sslscale.png
[standard]: ./media/configure-ssl-web-site/sslreserved.png
[pricing]: https://www.windowsazure.com/en-us/pricing/details/
[configure]: ./media/configure-ssl-web-site/sslconfig.png
[uploadcert]: ./media/configure-ssl-web-site/ssluploadcert.png
[uploadcertdlg]: ./media/configure-ssl-web-site/ssluploaddlg.png
[sslbindings]: ./media/configure-ssl-web-site/sslbindings.png
[sni]: http://en.wikipedia.org/wiki/Server_Name_Indication
[certmgr]: ./media/configure-ssl-web-site/waws-certmgr.png
[certwiz1]: ./media/configure-ssl-web-site/waws-certwiz1.png
[certwiz2]: ./media/configure-ssl-web-site/waws-certwiz2.png
[certwiz3]: ./media/configure-ssl-web-site/waws-certwiz3.png
[certwiz4]: ./media/configure-ssl-web-site/waws-certwiz4.png
