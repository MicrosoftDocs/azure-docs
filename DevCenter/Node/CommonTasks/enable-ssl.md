<properties linkid="dev-nodejs-enablessl" urldisplayname="Enable SSL" headerexpose pagetitle="Enable SSL - Node.js - Develop" metakeywords="Node.js Azure SSL, Node.js Azure HTTPS" footerexpose metadescription="Learn how to specify an HTTPS endpoint for a Node.js web role and how to upload an SSL certificate to secure your application." umbraconavihide="0" disquscomments="1"></properties>

# Configuring SSL for a Node.js Application in Windows Azure

Secure Socket Layer (SSL) encryption is the most commonly used method of
securing data sent across the internet. This common task discusses how
to specify an HTTPS endpoint for a Node.js web role and how to upload an
SSL certificate to secure your application.

This task includes the following steps:

-   [Step 1: Create a Node.js service and publish the service to the
    cloud][]
-   [Step 2: Get an SSL Certificate][]
-   [Step 3: Upload the SSL Certificate to the cloud][]
-   [Step 4: Modify the Service Definition and Configuration Files][]
-   [Step 5: Connect to the Role Instance by Using HTTPS][]

## <a name="step1"> </a>Step 1: Create a Node.js service and publish the service to the cloud

When a Node.js service is deployed to a Windows Azure web role, the
server certificate and SSL connection are managed by Internet
Information Services (IIS), so that the Node.js service can be written
as if it were an http service. You can create a simple Node.js 'hello
world' service using the Windows Azure PowerShell for Node.js using
these steps:

1.  From the **Start** menu, select [**Windows Azure PowerShell for
    Node.js**][].

    ![][]

2.  Create a new service, using **New-AzureService** cmdlet provided
    with a unique service name. This service name will determine the URL
    of your service in Windows Azure:

    ![][1]

3.  Add a web role to your service using **Add-AzureNodeWebRole**
    cmdlet:

    ![][2]

4.  Publish your service to the cloud using **Publish-AzureService**
    cmdlet:

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
    the hosted service. You cannot acquire an SSL certificate for the
    cloudapp.net domain, so the certificate's subject name must match
    the custom domain name used to access your application.
-   The certificate must use a minimum of 2048-bit encryption.

## <a name="step3"> </a>Step 3: Upload the SSL Certificate to the cloud

Now that you have an SSL certificate, you must upload the certificate to
your hosted service in Windows Azure, following these steps:

-   Log on to the [Windows Azure Management Portal][], go to the
    **Hosted Services** section, and locate the service you created in
    step 1.

-   Right click on the **Certificates** entry for the hosted service and
    select **Add Certificate...** from the drop down menu.

    ![][4]

-   In the **Upload an X.509 Certificate** dialog, enter the location of
    the SSL certificate .pfx file, the password for the certificate, and
    click **OK**.

    ![][5]

Now you must modify your service definition to use the certificate you
have uploaded.

## <a name="step4"> </a>Step 4: Modify the Service Definition and Configuration Files

Your application must be configured to use the certificate, and an HTTPS
endpoint must be added. As a result, the service definition and service
configuration files need to be updated.

1.  In the service directory, open the service definition file
    (ServiceDefinition.csdef), add a **Certificates** section within the
    **WebRole** section, and include the following information about the
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
    Associate a Certificate with a Service][] for more information.

2.  In your service definition file, update the http **InputEndpoint**
    element within the **Endpoints** section to enable HTTPS:

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
    **ServiceConfiguration.Local.cscfg**), add the certifcate to the
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
    your service again. At the Windows Azure PowerShell for Node.js
    prompt, type **Publish-AzureService** from the service directory.
    ![][6]

## <a name="step5"> </a>Step 5: Connect to the Role Instance by Using HTTPS

Now that your deployment is up and running in Windows Azure, you can
connect to it using HTTPS.

1.  In the Management Portal, select your deployment, then right-click
    on the DNS name link in the **Properties** pane and choose **Copy**.

    ![][7]

2.  Paste the address in a web browser, but make sure that it starts
    with **https** instead of **http**, and then visit the page.

    Your browser displays the address in green to indicate that it is
    using an HTTPS connection. This also indicates that your application
    has been configured correctly for SSL.

    ![][8]

## Additional Resources

[How to Associate a Certificate with a Service][]

[How to Configure an SSL Certificate on an HTTPS Endpoint][]

  [Step 1: Create a Node.js service and publish the service to the
  cloud]: #step1
  [Step 2: Get an SSL Certificate]: #step2
  [Step 3: Upload the SSL Certificate to the cloud]: #step3
  [Step 4: Modify the Service Definition and Configuration Files]: #step4
  [Step 5: Connect to the Role Instance by Using HTTPS]: #step5
  [**Windows Azure PowerShell for Node.js**]: http://go.microsoft.com/?linkid=9790229&clcid=0x409
  []: ../../../DevCenter/Node/Media/enable-ssl-00.png
  [1]: ../../../DevCenter/Node/Media/enable-ssl-01.png
  [2]: ../../../DevCenter/Node/Media/enable-ssl-02.png
  [3]: ../../../DevCenter/Node/Media/enable-ssl-03.png
  [Windows Azure Management Portal]: http://windows.azure.com
  [4]: ../../../DevCenter/Node/Media/enable-ssl-04.png
  [5]: ../../../DevCenter/Node/Media/enable-ssl-05.png
  [How to Associate a Certificate with a Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx
  [6]: ../../../DevCenter/Node/Media/enable-ssl-06.png
  [7]: ../../../DevCenter/Node/Media/enable-ssl-07.png
  [8]: ../../../DevCenter/Node/Media/enable-ssl-08.png
  [How to Configure an SSL Certificate on an HTTPS Endpoint]: http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx
