# Configuring SSL for an Application in Windows Azure

Secure Socket Layer (SSL) encryption is the most commonly used method of
securing data sent across the internet. This common task discusses how
to specify an HTTPS endpoint for a web role and how to upload an SSL
certificate to secure your application.

This task includes the following steps:

-   [Step 1: Get an SSL Certificate][]
-   [Step 2: Modify the Service Definition and Configuration Files][]
-   [Step 3: Upload the Deployment Package and Certificate][]
-   [Step 4: Connect to the Role Instance by Using HTTPS][]

<a name="step1"> </a>

## Step 1: Get an SSL Certificate

To configure SSL for an application, you first need to get an SSL
certificate that has been signed by a Certificate Authority (CA), a
trusted third-party who issues certificates for this purpose. If you do
not already have one, you will need to obtain one from a company that
sells SSL certificates.

The certificate must meet the following requirements for SSL
certificates in Windows Azure:

-   The certificate must contain a private key.
-   The certificate must be created for key exchange (.pfx file).
-   The certificate's subject name must match the domain used to access
    the cloud service. You cannot acquire an SSL certificate for the
    cloudapp.net domain, so the certificate's subject name must match
    the custom domain name used to access your application.
-   The certificate must use a minimum of 2048-bit encryption.

For test purposes, you can create and use a self-signed certificate. For
details about how to create a self-signed certificate using IIS Manager,
See [How to Create a Certificate for a Role][].

Next, you must include information about the certificate in your service
definition and service configuration files.

<a name="step2"> </a>

## Step 2: Modify the Service Definition and Configuration Files

Your application must be configured to use the certificate, and an HTTPS
endpoint must be added. As a result, the service definition and service
configuration files need to be updated.

1.  In your development environment, open the service definition file
    (CSDEF), add a **Certificates** section within the **WebRole**
    section, and include the following information about the
    certificate:

        <WebRole name="CertificateTesting" vmsize="Small">
        ...
            <Certificates>
                <Certificate name="SampleCertificate" storeLocation="LocalMachine" 
                    storeName="CA" />
            </Certificates>
        ...
        </WebRole>

    The **Certificates** section defines the name of our certificate,
    its location, and the name of the store where it is located. We have
    chosen to store the certificate in the CA (Certificate Authority)
    store, but you can choose other options as well. See [How to Associate a Certificate with a Service][] for more information.

2.  In your service definition file, add an **InputEndpoint** element
    within the **Endpoints** section to enable HTTPS:

        <WebRole name="CertificateTesting" vmsize="Small">
        ...
            <Endpoints>
                <InputEndpoint name="HttpsIn" protocol="https" port="443" 
                    certificate="SampleCertificate" />
            </Endpoints>
        ...
        </WebRole>

3.  In your service definition file, add a **Binding** element within
    the **Sites** section. This adds an HTTPS binding to map the
    endpoint to your site:

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

    All of the required changes to the service definition file have been
    completed, but you still need to add the certificate information to
    the service configuration file.

4.  In your service configuration file (CSCFG), add a **Certificates**
    section within the **Role** section, replacing the sample thumbprint
    value below with that of your certificate:

        <Role name="Deployment">
        ...
            <Certificates>
                <Certificate name="SampleCertificate" 
                    thumbprint="9427befa18ec6865a9ebdc79d4c38de50e6316ff" 
                    thumbprintAlgorithm="sha1" />
            </Certificates>
        ...
        </Role>

Now that the service definition and service configuration files have
been updated, package your deployment for uploading to Windows Azure. If
you are using **cspack**, ensure that you don't use the
**/generateConfigurationFile** flag, as that will overwrite the
certificate information you just inserted.

<a name="step3"> </a>

## Step 3: Upload the Deployment Package and Certificate

Your deployment package has been updated to use the certificate, and an
HTTPS endpoint has been added. Now you can upload the package and
certificate to Windows Azure with the Management Portal.

1.  Log on to the [Windows Azure Management Portal].

2.  In the Management Portal, click **+ NEW** in the botom left, and then clidk **Cloud Service**.
	![cloud service dialog][new-cloud-service]

3.  Select **Custom Create**, and then specify the **URL** and **Region/Affinity Group**.  
	Finally, select **Deploy a Cloud Service Package Now** and click the arrow to continue.
	![custom create cloud service][custom-create-page1]
	
4.  On the second page of the **Custom Create** dialog, fill in the required information and select **Add certificates now**. Click the arrow to continue.
	![custom create cloud service][custom-create-page2]

5. Use the third page of the **Custom Create** dialog to attach the certificate(s), and then click the checkbox.
	![custom create cloud service][custom-create-page3] 

<a name="step4"> </a>

## Step 4: Connect to the Role Instance by Using HTTPS

Now that your deployment is up and running in Windows Azure, you can
connect to it using HTTPS.

1.  In the Management Portal, select **Cloud Services**, and then click the URL for the service.

2.  The browser will navigate to the URL; make sure that it starts
	with **https** instead of **http**..

    Your browser displays the address in green to indicate that it's
    using an HTTPS connection. This also indicates that your application
    has been configured correctly for SSL.

    **Note:** If you are using a self-signed certificate, when you
    browse to an HTTPS endpoint that's associated with the self-signed
    certificate you will see a certificate error in the browser. Using a
    certificate signed by a certification authority will eliminate this
    problem; in the meantime, you can ignore the error.

    ![][3]

## Additional Resources
* [How to Associate a Certificate with a Service][]
* [How to Configure an SSL Certificate on an HTTPS Endpoint][]

  [Step 1: Get an SSL Certificate]: #step1
  [Step 2: Modify the Service Definition and Configuration Files]: #step2
  [Step 3: Upload the Deployment Package and Certificate]: #step3
  [Step 4: Connect to the Role Instance by Using HTTPS]: #step4
  [How to Create a Certificate for a Role]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432987.aspx
  [How to Associate a Certificate with a Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [0]: ../../../DevCenter/Shared/Media/ssl-01.png
  [1]: ../../../DevCenter/Shared/Media/ssl-02.png
  [2]: ../../../DevCenter/Shared/Media/ssl-03.png
  [3]: ../../../DevCenter/Shared/Media/ssl-04.png
  [How to Configure an SSL Certificate on an HTTPS Endpoint]: http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx
  [new-cloud-service]: ../Media/cloud-service-new-custom-create.png
  [custom-create-page1]: ../../Shared/Media/cloud-service-custom-create.png
  [custom-create-page2]: ../../Shared/Media/cloud-service-custom-create-package.png
  [custom-create-page3]: ../../Shared/Media/cloud-service-custom-created-add-cert.png
