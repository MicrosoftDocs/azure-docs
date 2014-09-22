#Service Security Configurations 

The Azure Databases Elastic Scale Public Preview includes Split-Merge (SM) self-hosted serviceIt is distributed in the form of Azure deployment packages (.cspgk) with their corresponding service configuration files (.cscfg). 

Because the service is self-hosted, these configuration files require customizations that are specific to each user hosting these services. This document describes the available security settings and provides guidance to protect the service. 

The following configurations should be applied to each instance of the service being hosted and they should be applied prior to deploying each service instance. The configuration settings discussed in the following focus on protecting the Web Role service as it is typically exposed to the internet. 

##Restricting access to specific IP addresses 

Similarly to Azure SQL DB, access to the endpoints exposed by these services can be restricted to specific ranges of IP addresses. 

###2.1 Basic HTTP and HTTPS Configuration 

The default configuration allows any source IP to access the HTTPS endpoint, and disallows all access to the HTTP endpoint.  It looks like this: 

	<NetworkConfiguration> 
    <AccessControls> 
     <!--  
	      Add or update <AccessControl> items below in order to filter the remote IP addresses 
          from which the service endpoints are accessible. 

          The default configuration below sets up two rules: 
          1. One that denies access from all IP addresses, which is bound to the HTTP endpoint by default 
          2. One that allows access from any IP address, which is bound to the HTTPS endpoint by default 
          See http://msdn.microsoft.com/en-us/library/azure/dn376541.aspx for more information. 
      --> 

		 <AccessControl name="DenyAll"> 
	        <Rule action="deny" description="Deny all addresses" order="1" remoteSubnet="0.0.0.0/0" /> 
	      </AccessControl> 

	      <AccessControl name="AllowAll"> 
	        <Rule action="permit" description="All remote addresses are allowed" order="1" remoteSubnet="0.0.0.0/0" /> 
	      </AccessControl> 
    </AccessControls> 

    <EndpointAcls> 

      <!--  
          Update the 'accessControl' attribute of <EndpointAcl> items below as appropriate. They must 
          refer to <AccessControl> items configured above. 
      --> 
      <EndpointAcl role="SplitMergeWeb" endPoint="HttpIn" accessControl="DenyAll" /> 
      <EndpointAcl role="SplitMergeWeb" endPoint="HttpsIn" accessControl="AllowAll" /> 
    </EndpointAcls> 
	</NetworkConfiguration> 

While we recommend to disable HTTP and only allow HTTPS, you can change this setting by configuring the HTTP endpoint as `accessControl="AllowAll"` and removing (or commenting out) the `<AccessControl name="DenyAll">…</AccessControl>` section. 


###2.2 Restricting remote IPs further 

One may choose to limit access to the HTTPS endpoint even further, by creating or modifying <AccessControl> items with sets of <Rule> that act in conjunction, respecting the order attribute, in order to configure fine-grained sets of IP addresses to be allowed or denied access. For more information please refer to About Network Access Control Lists (ACLs). These settings can also be configured programmatically via Azure PowerShell. For more information please refer to Creating ACLs for Windows Azure Endpoints Part 1, Part 2 and Part 3. 

##3 Configuring SSL 

SSL must be configured in order to host the service, and in order to configure SSL the server certificate must be uploaded into the cloud service Certificates store. More details about setting up SSL for a Microsoft Azure service can he found here.  

Once the certificate is uploaded, the Management Portal will display the certificate’s thumbprint. Please copy the thumbprint to the service configuration file, in the following section: 

    <Certificates> 
      <!--  
        Update the 'thumbprint' attribute with the thumbprint of the certificate uploaded to the 
        cloud service that should be used for SSL communication. 
      --> 

      <Certificate name="SSL" thumbprint="0" thumbprintAlgorithm="sha1" /> 
    </Certificates> 

If you’re not using certificates issued by a public certification authority, please follow the steps below to create self-signed certificates. 

###3.1.1 Creating a self-signed certificate 

If you don't have a certificate issued by a certification authority, you may choose to use a self-signed certificate for testing. Details about creating a SSL for a Microsoft Azure service can he found here. In order to make a self-signed certificate, please refer to Create and Upload a Management Certificate for Azure. Ensure that the Certificate Name matches the URL for your cloud service. For example, if your cloud service name is mysplitmergeservice, then the URL will be https://mysplitmergeservice.cloudapp.net. Using the Visual Studio Developer Command Prompt, the command line should look like this: makecert -sky exchange -r -n "CN=mysplitmergeservice.cloudapp.net" -pe -a sha1 -len 2048 -ss My "MySplitMergeService.cer"

Note that "MySplitMergeService.cer" parameter is just the output file name and does not affect the contents of the certificate. You might want to copy the certificates into a different directory than the default directory of the VS Developer Command Prompt. 

###3.1.2 Exporting the private key 

The certificate used for SSL needs to include the private key so that the server can encrypt traffic using the private key and clients can use the public key to decrypt. Note that only the SSL certificate uploaded needs to include private keys.  

In order to create the PFX file that contains the private key, you must export the key from Certificate Manager. 

1. Open the Certificate Manager snap-in for the management console by typing certmgr.msc in the Start menu textbox. 2. If you used the procedure that includes using the makecert program to create a certificate, the new certificate was automatically added to the personal certificate store. If your certificate is not listed under Personal Certificates, import your X.509 certificate.

3. Export the certificate by right-clicking the certificate in the right pane, pointing to All Tasks, and then clicking Export. 

4. On the Export Private Key page, ensure that you select Yes, export the private key. 

5. Finish the wizard. 

This will export the private key to a PFX file. 

###3.1.3 Uploading the certificate 
To upload the certificate, open https://manage.windowsazure.com/ and navigate to your cloud service. At the top, click “Certificates”, then at the bottom click “Upload”. Choose the PFX file that you created earlier, and enter the password that you chose. 


###3.1.4 Adding the certificate’s thumbprint to your configuration file 

Once the certificate is uploaded, the Management Portal will display the certificate’s thumbprint. 

Please copy the thumbprint to the service configuration file as the SSL certificate, in this section: 

    <Certificates> 
      <!--  
        Update the 'thumbprint' attribute with the thumbprint of the certificate uploaded to the 
        cloud service that should be used for SSL communication. 
      --> 
      <Certificate name="SSL" thumbprint="copy thumbprint here" thumbprintAlgorithm="sha1" /> 
      <Certificate name="CA" thumbprint="copy thumbprint here" thumbprintAlgorithm="sha1" /> 
    </Certificates> 

Note that the “CA” certificate is used as the Certificate Authority for client authentication, which is not enabled by default in the template configuration file, but is further explained in the Service Security Configurations document. If those configurations are not in use, just repeating the thumbprint will suffice. 

Make sure that the thumbprints do not include special characters. If you copy-paste the thumbprint from the Windows Certificate dialog, there may be a hidden character at the start of the thumbprint which must be removed. Loading the file into Visual Studio will perform a validation and will highlight malformed thumbprints. 

##4 Configuring Client Authentication 

Client certificates is the only authentication mechanism currently supported and is highly recommended. It is disabled in the service configuration template as it requires specific information for your setup. It is recommended that the IP restriction settings are made more restrictive as per steps in Section 3 above if the client certificate settings are kept as is, for improved security. In order to enforce authentication based on client certificates, please follow the next steps. Also, see instructions in the last step in this section, which includes configuration required if client certificates are not to be used.

###4.1 Turning on Client Certificates

Authentication via client certificates is turned on by setting both SetupWebAppForClientCertificates and SetupWebserverForClientCertificates to true.  

The client certificates that are allowed access must be configured using the AllowedClientCertificateThumbprints setting, which holds a comma-separated list of thumbprints, one for each client certificate allowed. 

	<!--  
	  The comma-separated list of client certificate thumbprints that are authorized  
	  to access the Web and API endpoints. 
	--> 
	<Setting name="AllowedClientCertificateThumbprints" value="" /> 

To find the thumbprint for these certificates (which don’t need to be uploaded to the Microsoft Azure Cloud Service configuration), please find the corresponding certificate through the certmgr tool. If these are certificates issued for use as client certificates only, they’ll be found in the Personal directory within the certificate store. Once found, inspect the properties of the certificates. In the “details” pane there will be “thumbprint” field. Notice the content on this UI includes a Unicode character right ahead of the first digit of the hex values for the thumbprint. Be careful not to copy that character (you may use backspace to delete characters after pasting to be sure); the format expected by the configuration file does not include the spaces, and is case-insensitive. 

###4.2 Self-signed client certificates 

In case client certificates issued by common certification authorities are not available, you may still setup and secure your service endpoints. 

For testing purposes, you may use the same self-signed SSL certificate created above and keep the setup simple. Copy its thumbprint into the “CA” certificate field and in the “AllowedClientCertificateThumbprints” fields. 

It’s also possible to mimic the process followed by certification authorities more closely, making it easier for you to support multiple client certificates which are not shared between the individuals who have them issued for them. This includes creating a self-signed certificate for your own equivalent of a certification authority. This is the certificate that must be uploaded to the service and which thumbprint should be added to the “CA” certificate field in the configuration file. Then, issuing new client certificates that are in turn signed with the CA one, establishing a chain of trust between them. The thumbprints of these certificates are the ones added to the “AllowedClientCertificateThumbprints” field. These steps are documented here.

###4.3 Certification Authority (CA) for client certificate 
Microsoft Azure VMs are pre-loaded with a limited set of Root Certification Authorities.  If the CA that issued the client certificates to be allowed is not already present (e.g., self-signed client certificates), then the public key of the CA must be uploaded to the service. 

Such public keys are commonly stored in .cer files, and once uploaded, copy the thumbprint displayed by the Microsoft Azure Management Portal into the <Certificate name="CA"> setting of the web role. You may also find the certificate entry for the proper Trusted Root Authority in your machine, through the certmgr tool, and export the .cer file. 

Once this certificate is uploaded into the Microsoft Azure cloud service configuration, copy the thumbprint that the Microsoft Azure Management Portal shows you into the “CA” certificate thumbprint field in the service configuration, under the section for the web role. 

This setting may not be left unset; so if client certificates are left turned off, please set this to another thumbprint in the service’s certificate list (e.g., the SSL one above). 

###4.4 Certificate revocation check 

The last setting related to client certificates involves the behavior when checking for revocation. If you are using self-signed certificates, revocation checks won’t succeed, therefore must be left configured as “NoCheck”. Thumbprints should be edited in the service configuration file as they’re revoked. 

If you are using client certificates issued by public certification authorities, you may use the other settings documented in the template file. 

##5 Configuring DoS Protection 

Denial of Service (DoS) detection and prevention is disabled by default.  

##5.1 Turning on DoS prevention measures 

To actively refuse large number of requests originating from the same source, concurrently or in a short period of time, please use the settings below, further documented in this document. 

	<!--  
	  Dynamic IP Restriction 
	  Configures the Denial of Service detection and prevention mechanisms in IIS. These   
	  settings correspond to the ones in  
	  http://www.iis.net/configreference/system.webserver/security/dynamicipsecurity. 
	--> <Setting name="DynamicIpRestrictionDenyByConcurrentRequests" value="false" /> 
	<Setting name="DynamicIpRestrictionMaxConcurrentRequests" value="20" /> 
	<Setting name="DynamicIpRestrictionDenyByRequestRate" value="false" /> 
	<Setting name="DynamicIpRestrictionMaxRequests" value="100" /> 
	<Setting name="DynamicIpRestrictionRequestIntervalInMilliseconds" value="2000" /> 
	<Setting name="DynamicIpRestrictionDenyAction" value="AbortRequest" />


To enable dynamic IP restriction, you need to set the underlined values above from false to true.  

Keep in mind these factors when configuring the settings below; they usually mean that the numbers configured seem higher than one would assume without taking these factors in consideration: 

1. When accessing the web interface for these services, each resource being accessed (scripts, images, etc.) counts as a request.  
2. Web browsers may be behind proxies and NAT devices that effectively cause many clients to share IP addresses. 
