# Configuring SSL for an Application in Windows Azure

Secure Socket Layer (SSL) encryption is the most commonly used method of securing data sent across the internet. This common task discusses how to specify an HTTPS endpoint for a web role and how to upload an SSL certificate to secure your application.

This task includes the following steps:

* [Step 1: Get an SSL Certificate] (#Step1)
* [Step 2: Modify the Service Definition and Configuration Files] (#Step2)
* [Step 3: Upload the Deployment Package and Certificate] (#Step3)
* [Step 4: Connect to the Role Instance by Using HTTPS] (#Step4)

<h2 id="Step1">Step 1: Get an SSL Certificate</h2>

To configure SSL for an application, you first need to get an SSL certificate that has been signed by a Certificate Authority (CA), a trusted third-party who issues certificates for this purpose. If you do not already have one, you will need to obtain one from a company that sells SSL certificates.

The certificate must meet the following requirements for SSL certificates in Windows Azure:

* The certificate must contain a private key.
* The certificate must be created for key exchange (.pfx file).
* The certificate's subject name must match the domain used to access the hosted service. You cannot acquire an SSL certificate for the cloudapp.net domain, so the certificate's subject name must match the custom domain name used to access your application.
* The certificate must use a minimum of 2048-bit encryption.

For test purposes, you can create and use a self-signed certificate. For details about how to create a self-signed certificate using IIS Manager, See [How to Create a Certificate for a Role] [].

Next, you must include information about the certificate in your service definition and service configuration files.

<h2 id="Step2">Step 2: Modify the Service Definition and Configuration Files</h2>

Your application must be configured to use the certificate, and an HTTPS endpoint must be added. As a result, the service definition and service configuration files need to be updated.

1.	In your development environment, open the service definition file (CSDEF), add a **Certificates** section within the **WebRole** section, and include the following information about the certificate:
	
		<WebRole name="CertificateTesting" vmsize="Small">
		...
		    <Certificates>
		        <Certificate name="SampleCertificate" storeLocation="LocalMachine" 
		            storeName="CA" />
		    </Certificates>
		...
		</WebRole>
	
	The **Certificates** section defines the name of our certificate, its location, and the name of the store where it is located. We have chosen to store the certificate in the CA (Certificate Authority) store, but you can choose other options as well. See [How to Associate a Certificate with a Service] [] for more information.

2.	In your service definition file, add an **InputEndpoint** element within the **Endpoints** section to enable HTTPS:
	
		<WebRole name="CertificateTesting" vmsize="Small">
		...
		    <Endpoints>
		        <InputEndpoint name="HttpsIn" protocol="https" port="443" 
		            certificate="SampleCertificate" />
		    </Endpoints>
		...
		</WebRole>

3.	In your service definition file, add a **Binding** element within the **Sites** section. This adds an HTTPS binding to map the endpoint to your site:
	
		<WebRole name="CertificateTesting" vmsize="Small">
		...
		    <Sites>
		        <Site name="Web">
		            <Bindings>
		                <Binding name="HttpsIn" endpointName="HttpsIn" />
		            </Bindings>
		        </Site>
		    </Sites>
		...
		</WebRole>
	
	All of the required changes to the service definition file have been completed, but you still need to add the certificate information to the service configuration file.

4.	In your service configuration file (CSCFG), add a **Certificates** section within the **Role** section, replacing the sample thumbprint value below with that of your certificate:
	
		<Role name="Deployment">
		...
		    <Certificates>
		        <Certificate name="SampleCertificate" 
		            thumbprint="9427befa18ec6865a9ebdc79d4c38de50e6316ff" 
		            thumbprintAlgorithm="sha1" />
		    </Certificates>
		...
		</Role>

Now that the service definition and service configuration files have been updated, package your deployment for uploading to Windows Azure. If you are using **cspack**, ensure that you don't use the **/generateConfigurationFile** flag, as that will overwrite the certificate information you just inserted.

<h2 id="Step3">Step 3: Upload the Deployment Package and Certificate</h2>

Your deployment package has been updated to use the certificate, and an HTTPS endpoint has been added. Now you can upload the package and certificate to Windows Azure with the Management Portal.

1.	Log into the [Windows Azure Management Portal] [], and go to the Hosted Services section. Click **New Hosted Service**, add the required information about your hosted service, and then click **Add Certificate**.
	
	![Create a New Hosted Service Image] [Image1]

2.	In **Upload Certificates**, enter the location for the SSL certificate .pfx file, the password for the certificate, and click **OK**.
	
	![Upload Certificates Image] [Image2]

3.	Click **OK** to create your hosted service. When the deployment has reached the **Ready** status, you can proceed to the next steps.

<h2 id="Step4">Step 4: Connect to the Role Instance by Using HTTPS</h2>

Now that your deployment is up and running in Windows Azure, you can connect to it using HTTPS.

1.	In the Management Portal, select your deployment, then right-click on the DNS name link in the **Properties** pane and choose **Copy**.
	
	![Management Portal DNS Property Pane Image] [Image3]

2.	Paste the address in a web browser, but make sure that it starts with **https** instead of **http**, and then visit the page.

	Your browser displays the address in green to indicate that it's using an HTTPS connection. This also indicates that your application has been configured correctly for SSL.

	**Note:** If you are using a self-signed certificate, when you browse to an HTTPS endpoint that's associated with the self-signed certificate you will see a certificate error in the browser. Using a certificate signed by a certification authority will eliminate this problem; in the meantime, you can ignore the error.

	![Browser showing your Cloud Application] [Image4]

## Additional Resources

[How to Associate a Certificate with a Service] []

[How to Configure an SSL Certificate on an HTTPS Endpoint] []



[How to Associate a Certificate with a Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx
[How to Create a Certificate for a Role]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432987.aspx
[Windows Azure Management Portal]: http://windows.azure.com/
[How to Configure an SSL Certificate on an HTTPS Endpoint]: http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx

[Image1]: media/common-task-ssl-01.png
[Image2]: media/common-task-ssl-02.png
[Image3]: media/common-task-ssl-03.png
[Image4]: media/common-task-ssl-04.png

