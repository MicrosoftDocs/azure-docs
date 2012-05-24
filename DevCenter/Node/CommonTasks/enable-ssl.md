<properties linkid="dev-nodejs-enablessl" urldisplayname="Enable SSL" headerexpose="" pagetitle="Enable SSL - Node.js - Develop" metakeywords="Node.js Azure SSL, Node.js Azure HTTPS" footerexpose="" metadescription="Learn how to specify an HTTPS endpoint for a Node.js web role and how to upload an SSL certificate to secure your application." umbraconavihide="0" disquscomments="1"></properties>

# Configuring SSL for a Node.js Application in Windows Azure

Secure Socket Layer (SSL) encryption is the most commonly used method of
securing data sent across the internet. This common task discusses how
to specify an HTTPS endpoint for a Node.js web role and how to upload an
SSL certificate to secure your application.

This task includes the following steps:

-   [Step 1: Create a Node.js service and publish the service to the cloud]
-   [Step 2: Get an SSL Certificate]
-   [Step 3: Upload the SSL Certificate to the cloud]
-   [Step 4: Modify the Service Definition and Configuration Files]
-   [Step 5: Connect to the Role Instance by Using HTTPS]

## <a name="step1"> </a>Step 1: Create a Node.js service and publish the service to the cloud

When a Node.js service is deployed to a Windows Azure web role, the
server certificate and SSL connection are managed by Internet
Information Services (IIS), so that the Node.js service can be written
as if it were an http service. You can create a simple Node.js 'hello
world' service using the Windows Azure PowerShell using these steps:

1.  From the **Start** menu, select [**Windows Azure PowerShell**].

    ![][0]

2.  Create a new service, using **New-AzureServiceProject** cmdlet provided with a unique service name. This service name will determine the URL of your service in Windows Azure.

	![][1]

3.  Add a web role to your service using **Add-AzureNodeWebRole** cmdlet:

    ![][2]

4.  Publish your service to the cloud using **Publish-AzureServiceProject** cmdlet:

    ![][3]

Now that you have an http service published to Windows Azure, you will
need to obtain an SSL certificate and configure your service to use it

## <a name="step2"> </a>Step 2: Get an SSL Certificate

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

## <a name="step3"> </a>Step 3: Upload the SSL Certificate to the cloud

Now that you have an SSL certificate, you must upload the certificate to
your service in Windows Azure, following these steps:

1.   Log on to the [Windows Azure Management Portal][], select **Cloud Services** and select the service you created in step 1.
	
	![cloud services][cloud-services]

2.   Click on **Certificates** entry for the cloud service and
    select **Add Certificate** or **Upload** to upload a certificate.

    ![add certificate page][add-certificate]

3.   In the **Add a Certificate** dialog, enter the location of
    the SSL certificate .pfx file, the password for the certificate, and
    click the **Checkmark**.

	![add certificate dialog][add-certificate-dialog]

Now you must modify your service definition to use the certificate you
have uploaded.

## <a name="step4"> </a>Step 4: Modify the Service Definition and Configuration Files

Your application must be configured to use the certificate, and an HTTPS
endpoint must be added. As a result, the service definition and service
configuration files need to be updated.

1.  In the service directory, open the service definition file
    (ServiceDefinition.csdef), add a **Certificates** section within the **WebRole** section, and include the following information about the
    certificate:

        <WebRole name="WebRole1" vmsize="ExtraSmall">
        ...
            <Certificates>
                <Certificate name="SampleCertificate" 
                    storeLocation="LocalMachine" storeName="CA" />
            </Certificates>
        ...
        </WebRole>

    The **Certificates** section defines the name of the certificate,
    its location, and the name of the store where it is located. We have
    chosen to store the certificate in the CA (Certificate Authority)
    store, but you can choose other options as well. See [How to
    Associate a Certificate with a Service] for more information.

2.  In your service definition file, update the http **InputEndpoint** element within the **Endpoints** section to enable HTTPS:

        <WebRole name="WebRole1" vmsize="Small">
        ...
            <Endpoints>
                <InputEndpoint name="Endpoint1" protocol="https" 
                    port="443" certificate="SampleCertificate" />
            </Endpoints>
        ...
        </WebRole>

    All of the required changes to the service definition file have been
    completed, but you still need to add the certificate information to
    the service configuration file.

3.  In your service configuration files
    (**ServiceConfiguration.Cloud.cscfg** and
    **ServiceConfiguration.Local.cscfg**), add the certificate to the
    empty **Certificates** section within the **Role** section,
    replacing the sample thumbprint value below with that of your
    certificate:

        <Role name="WebRole1">
        ...
            <Certificates>
                <Certificate name="SampleCertificate" 
                    thumbprint="9427befa18ec6865a9ebdc79d4c38de50e6316ff" 
                    thumbprintAlgorithm="sha1" />
            </Certificates>
        ...
        </Role>

4.  To refresh your service configuration in the cloud, you must publish
    your service again. At the Windows Azure PowerShell
    prompt, type **Publish-AzureServiceProject** from the service directory.

    ![][6]

## <a name="step5"> </a>Step 5: Connect to the Role Instance by Using HTTPS

Now that your deployment is up and running in Windows Azure, you can
connect to it using HTTPS.

1.  In the Management Portal, select your cloud service, then click **Dashboard**.

2. Scroll down and click the link displayed as the **Site URL**:

    ![the site url][site-url]

3.  A new browser will open and display your website.

    Your browser will display the address in green to indicate that it is
    using an HTTPS connection. This also indicates that your application
    has been configured correctly for SSL.

    ![][8]

## Additional Resources

[How to Associate a Certificate with a Service]

[How to Configure an SSL Certificate on an HTTPS Endpoint]

  [Step 1: Create a Node.js service and publish the service to the cloud]: #step1
  [Step 2: Get an SSL Certificate]: #step2
  [Step 3: Upload the SSL Certificate to the cloud]: #step3
  [Step 4: Modify the Service Definition and Configuration Files]: #step4
  [Step 5: Connect to the Role Instance by Using HTTPS]: #step5
  [**Windows Azure PowerShell**]: http://go.microsoft.com/?linkid=9790229&clcid=0x409
  [add-certificate-dialog]: ../Media/add-certificate.png
  [add-certificate]: ../Media/no-certificates.png
  [cloud-services]: ../Media/cloud-services.png
  [0]: ../../Shared/Media/azure-powershell-menu.png
  [1]: ../Media/enable-ssl-01.png
  [2]: ../Media/enable-ssl-02.png
  [3]: ../Media/enable-ssl-03.png
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [4]: ../Media/enable-ssl-04.png
  [5]: ../Media/enable-ssl-05.png
  [How to Associate a Certificate with a Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx
  [6]: ../Media/enable-ssl-03.png
  [site-url]: ../Media/site-url.png
  [8]: ../Media/enable-ssl-08.png
  [How to Configure an SSL Certificate on an HTTPS Endpoint]: http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx
