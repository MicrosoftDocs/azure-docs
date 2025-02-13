---
title: Configure TLS mutual authentication
description: Learn how to authenticated client certificates on TLS. Azure App Service can make the client certificate available to the app code for verification.

author: msangapu-msft
ms.author: msangapu
ms.assetid: cd1d15d3-2d9e-4502-9f11-a306dac4453a
ms.topic: article
ms.date: 06/21/2024
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
---
# Configure TLS mutual authentication for Azure App Service

You can restrict access to your Azure App Service app by enabling different types of authentication for it. One way to do it is to request a client certificate when the client request is over TLS/SSL and validate the certificate. This mechanism is called Transport Layer Security (TLS) mutual authentication or client certificate authentication. This article shows how to set up your app to use client certificate authentication.

> [!NOTE]
> Your app code is responsible for validating the client certificate. App Service doesn't do anything with this client certificate other than forwarding it to your app.
> 
> If you access your site over HTTP and not HTTPS, you will not receive any client certificate. So if your application requires client certificates, you should not allow requests to your application over HTTP.

[!INCLUDE [Prepare your web app](../../includes/app-service-ssl-prepare-app.md)]

## Enable client certificates
When you enable client certificate for your app, you should select your choice of client certificate mode. Each mode defines how your app handles incoming client certificates:

|Client certificate modes|Description|
|-|-|
|Required|All requests require a client certificate.|
|Optional|Requests may or may not use a client certificate and clients are prompted for a certificate by default. For example, browser clients will show a prompt to select a certificate for authentication.|
|Optional Interactive User|Requests may or may not use a client certificate and clients are not prompted for a certificate by default. For example, browser clients won't show a prompt to select a certificate for authentication.|

### [Azure portal](#tab/azureportal)
To set up your app to require client certificates in Azure portal:
1. Navigate to your app's management page.
1. From the left navigation of your app's management page, select **Configuration** > **General Settings**.
1. Select **Client certificate mode** of choice. Select **Save** at the top of the page.

### [Azure CLI](#tab/azurecli)
With Azure CLI, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp update --set clientCertEnabled=true --name <app-name> --resource-group <group-name>
```

### [Bicep](#tab/bicep)
For Bicep, modify the properties `clientCertEnabled`, `clientCertMode`, and `clientCertExclusionPaths`. A sample Bicep snippet is provided for you:

```bicep
resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webSiteName
  location: location
  kind: 'app'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
    clientCertEnabled: true
    clientCertMode: 'Required'
    clientCertExclusionPaths: '/sample1;/sample2'
  }
}
```

### [ARM template](#tab/arm)
For ARM templates, modify the properties `clientCertEnabled`, `clientCertMode`, and `clientCertExclusionPaths`. A sample ARM template snippet is provided for you:

```ARM
{
    "type": "Microsoft.Web/sites",
    "apiVersion": "2020-06-01",
    "name": "[parameters('webAppName')]",
    "location": "[parameters('location')]",
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanPortalName'))]"
    ],
    "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanPortalName'))]",
        "siteConfig": {
            "linuxFxVersion": "[parameters('linuxFxVersion')]"
        },
        "clientCertEnabled": true,
        "clientCertMode": "Required",
        "clientCertExclusionPaths": "/sample1;/sample2"
    }
}
```

---

## Exclude paths from requiring authentication

When you enable mutual auth for your application, all paths under the root of your app require a client certificate for access. To remove this requirement for certain paths, define exclusion paths as part of your application configuration.

> [!NOTE]
> Using any client certificate exclusion path triggers TLS renegotiation for incoming requests to the app.

1. From the left navigation of your app's management page, select **Configuration** > **General Settings**.

1. Next to **Certificate exclusion paths**, select the edit icon.

1. Select **New path**, specify a path, or a list of paths separated by `,` or `;`, and select **OK**.

1. Select **Save** at the top of the page.

In the following screenshot, any path for your app that starts with `/public` doesn't request a client certificate. Path matching is case-insensitive.

![Certificate Exclusion Paths][exclusion-paths]

## Client certificate and TLS renegotiation
For some client certificate settings, App Service requires TLS renegotiation to read a request before knowing whether to prompt for a client certificate. Any of the following settings triggers TLS renegotiation:
1. Using "Optional Interactive User" client certificate mode.
1. Using [client certificate exclusion path](#exclude-paths-from-requiring-authentication).

> [!NOTE]
> TLS 1.3 and HTTP 2.0 don't support TLS renegotiation. These protocols will not work if your app is configured with client certificate settings that use TLS renegotiation.

To disable TLS renegotiation and to have the app negotiate client certificates during TLS handshake, you must configure your app with *all* these settings:
1. Set client certificate mode to "Required" or "Optional"
2. Remove all client certificate exclusion paths

### Uploading large files with TLS renegotiation
Client certificate configurations that use TLS renegotiation cannot support incoming requests with large files greater than 100 kb due to buffer size limitations. In this scenario, any POST or PUT requests over 100 kb will fail with a 403 error. This limit isn't configurable and can't be increased.

To address the 100 kb limit, consider these alternative solutions:

1. Disable TLS renegotiation. Update your app's client certificate configurations with _all_ these settings:
    - Set client certificate mode to either "Required" or "Optional"
    - Remove all client certificate exclusion paths
1. Send a HEAD request before the PUT/POST request. The HEAD request handles the client certificate.
1. Add the header `Expect: 100-Continue` to your request. This causes the client to wait until the server responds with a `100 Continue` before sending the request body, which bypasses the buffers.

## Access client certificate

In App Service, TLS termination of the request happens at the frontend load balancer. When App Service forwards the request to your app code with [client certificates enabled](#enable-client-certificates), it injects an `X-ARR-ClientCert` request header with the client certificate. App Service doesn't do anything with this client certificate other than forwarding it to your app. Your app code is responsible for validating the client certificate.

For ASP.NET, the client certificate is available through the **HttpRequest.ClientCertificate** property.

For other application stacks (Node.js, PHP, etc.), the client cert is available in your app through a base64 encoded value in the `X-ARR-ClientCert` request header.

## ASP.NET Core sample

For ASP.NET Core, middleware is provided to parse forwarded certificates. Separate middleware is provided to use the forwarded protocol headers. Both must be present for forwarded certificates to be accepted. You can place custom certificate validation logic in the [CertificateAuthentication options](/aspnet/core/security/authentication/certauth).

```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews();
        // Configure the application to use the protocol and client ip address forwarded by the frontend load balancer
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // Only loopback proxies are allowed by default. Clear that restriction to enable this explicit configuration.
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });       
        
        // Configure the application to client certificate forwarded the frontend load balancer
        services.AddCertificateForwarding(options => { options.CertificateHeader = "X-ARR-ClientCert"; });

        // Add certificate authentication so when authorization is performed the user will be created from the certificate
        services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }
        
        app.UseForwardedHeaders();
        app.UseCertificateForwarding();
        app.UseHttpsRedirection();

        app.UseAuthentication()
        app.UseAuthorization();

        app.UseStaticFiles();

        app.UseRouting();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}
```

## ASP.NET WebForms sample

```csharp
    using System;
    using System.Collections.Specialized;
    using System.Security.Cryptography.X509Certificates;
    using System.Web;

    namespace ClientCertificateUsageSample
    {
        public partial class Cert : System.Web.UI.Page
        {
            public string certHeader = "";
            public string errorString = "";
            private X509Certificate2 certificate = null;
            public string certThumbprint = "";
            public string certSubject = "";
            public string certIssuer = "";
            public string certSignatureAlg = "";
            public string certIssueDate = "";
            public string certExpiryDate = "";
            public bool isValidCert = false;

            //
            // Read the certificate from the header into an X509Certificate2 object
            // Display properties of the certificate on the page
            //
            protected void Page_Load(object sender, EventArgs e)
            {
                NameValueCollection headers = base.Request.Headers;
                certHeader = headers["X-ARR-ClientCert"];
                if (!String.IsNullOrEmpty(certHeader))
                {
                    try
                    {
                        byte[] clientCertBytes = Convert.FromBase64String(certHeader);
                        certificate = new X509Certificate2(clientCertBytes);
                        certSubject = certificate.Subject;
                        certIssuer = certificate.Issuer;
                        certThumbprint = certificate.Thumbprint;
                        certSignatureAlg = certificate.SignatureAlgorithm.FriendlyName;
                        certIssueDate = certificate.NotBefore.ToShortDateString() + " " + certificate.NotBefore.ToShortTimeString();
                        certExpiryDate = certificate.NotAfter.ToShortDateString() + " " + certificate.NotAfter.ToShortTimeString();
                    }
                    catch (Exception ex)
                    {
                        errorString = ex.ToString();
                    }
                    finally 
                    {
                        isValidCert = IsValidClientCertificate();
                        if (!isValidCert) Response.StatusCode = 403;
                        else Response.StatusCode = 200;
                    }
                }
                else
                {
                    certHeader = "";
                }
            }

            //
            // This is a SAMPLE verification routine. Depending on your application logic and security requirements, 
            // you should modify this method
            //
            private bool IsValidClientCertificate()
            {
                // In this example we will only accept the certificate as a valid certificate if all the conditions below are met:
                // 1. The certificate isn't expired and is active for the current time on server.
                // 2. The subject name of the certificate has the common name nildevecc
                // 3. The issuer name of the certificate has the common name nildevecc and organization name Microsoft Corp
                // 4. The thumbprint of the certificate is 30757A2E831977D8BD9C8496E4C99AB26CB9622B
                //
                // This example doesn't test that this certificate is chained to a Trusted Root Authority (or revoked) on the server 
                // and it allows for self signed certificates
                //

                if (certificate == null || !String.IsNullOrEmpty(errorString)) return false;

                // 1. Check time validity of certificate
                if (DateTime.Compare(DateTime.Now, certificate.NotBefore) < 0 || DateTime.Compare(DateTime.Now, certificate.NotAfter) > 0) return false;

                // 2. Check subject name of certificate
                bool foundSubject = false;
                string[] certSubjectData = certificate.Subject.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string s in certSubjectData)
                {
                    if (String.Compare(s.Trim(), "CN=nildevecc") == 0)
                    {
                        foundSubject = true;
                        break;
                    }
                }
                if (!foundSubject) return false;

                // 3. Check issuer name of certificate
                bool foundIssuerCN = false, foundIssuerO = false;
                string[] certIssuerData = certificate.Issuer.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string s in certIssuerData)
                {
                    if (String.Compare(s.Trim(), "CN=nildevecc") == 0)
                    {
                        foundIssuerCN = true;
                        if (foundIssuerO) break;
                    }

                    if (String.Compare(s.Trim(), "O=Microsoft Corp") == 0)
                    {
                        foundIssuerO = true;
                        if (foundIssuerCN) break;
                    }
                }

                if (!foundIssuerCN || !foundIssuerO) return false;

                // 4. Check thumbprint of certificate
                if (String.Compare(certificate.Thumbprint.Trim().ToUpper(), "30757A2E831977D8BD9C8496E4C99AB26CB9622B") != 0) return false;

                return true;
            }
        }
    }
```

## Node.js sample

The following Node.js sample code gets the `X-ARR-ClientCert` header and uses [node-forge](https://github.com/digitalbazaar/forge) to convert the base64-encoded PEM string into a certificate object and validate it:

```javascript
import { NextFunction, Request, Response } from 'express';
import { pki, md, asn1 } from 'node-forge';

export class AuthorizationHandler {
    public static authorizeClientCertificate(req: Request, res: Response, next: NextFunction): void {
        try {
            // Get header
            const header = req.get('X-ARR-ClientCert');
            if (!header) throw new Error('UNAUTHORIZED');

            // Convert from PEM to pki.CERT
            const pem = `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
            const incomingCert: pki.Certificate = pki.certificateFromPem(pem);

            // Validate certificate thumbprint
            const fingerPrint = md.sha1.create().update(asn1.toDer(pki.certificateToAsn1(incomingCert)).getBytes()).digest().toHex();
            if (fingerPrint.toLowerCase() !== 'abcdef1234567890abcdef1234567890abcdef12') throw new Error('UNAUTHORIZED');

            // Validate time validity
            const currentDate = new Date();
            if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw new Error('UNAUTHORIZED');

            // Validate issuer
            if (incomingCert.issuer.hash.toLowerCase() !== 'abcdef1234567890abcdef1234567890abcdef12') throw new Error('UNAUTHORIZED');

            // Validate subject
            if (incomingCert.subject.hash.toLowerCase() !== 'abcdef1234567890abcdef1234567890abcdef12') throw new Error('UNAUTHORIZED');

            next();
        } catch (e) {
            if (e instanceof Error && e.message === 'UNAUTHORIZED') {
                res.status(401).send();
            } else {
                next(e);
            }
        }
    }
}
```

## Java sample

The following Java class encodes the certificate from `X-ARR-ClientCert` to an `X509Certificate` instance. `certificateIsValid()` validates that the certificate's thumbprint matches the one given in the constructor and that certificate hasn't expired.


```java
import java.io.ByteArrayInputStream;
import java.security.NoSuchAlgorithmException;
import java.security.cert.*;
import java.security.MessageDigest;

import sun.security.provider.X509Factory;

import javax.xml.bind.DatatypeConverter;
import java.util.Base64;
import java.util.Date;

public class ClientCertValidator { 

    private String thumbprint;
    private X509Certificate certificate;

    /**
     * Constructor.
     * @param certificate The certificate from the "X-ARR-ClientCert" HTTP header
     * @param thumbprint The thumbprint to check against
     * @throws CertificateException If the certificate factory cannot be created.
     */
    public ClientCertValidator(String certificate, String thumbprint) throws CertificateException {
        certificate = certificate
                .replaceAll(X509Factory.BEGIN_CERT, "")
                .replaceAll(X509Factory.END_CERT, "");
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        byte [] base64Bytes = Base64.getDecoder().decode(certificate);
        X509Certificate X509cert =  (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(base64Bytes));

        this.setCertificate(X509cert);
        this.setThumbprint(thumbprint);
    }

    /**
     * Check that the certificate's thumbprint matches the one given in the constructor, and that the
     * certificate hasn't expired.
     * @return True if the certificate's thumbprint matches and hasn't expired. False otherwise.
     */
    public boolean certificateIsValid() throws NoSuchAlgorithmException, CertificateEncodingException {
        return certificateHasNotExpired() && thumbprintIsValid();
    }

    /**
     * Check certificate's timestamp.
     * @return Returns true if the certificate hasn't expired. Returns false if it has expired.
     */
    private boolean certificateHasNotExpired() {
        Date currentTime = new java.util.Date();
        try {
            this.getCertificate().checkValidity(currentTime);
        } catch (CertificateExpiredException | CertificateNotYetValidException e) {
            return false;
        }
        return true;
    }

    /**
     * Check the certificate's thumbprint matches the given one.
     * @return Returns true if the thumbprints match. False otherwise.
     */
    private boolean thumbprintIsValid() throws NoSuchAlgorithmException, CertificateEncodingException {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] der = this.getCertificate().getEncoded();
        md.update(der);
        byte[] digest = md.digest();
        String digestHex = DatatypeConverter.printHexBinary(digest);
        return digestHex.toLowerCase().equals(this.getThumbprint().toLowerCase());
    }

    // Getters and setters

    public void setThumbprint(String thumbprint) {
        this.thumbprint = thumbprint;
    }

    public String getThumbprint() {
        return this.thumbprint;
    }

    public X509Certificate getCertificate() {
        return certificate;
    }

    public void setCertificate(X509Certificate certificate) {
        this.certificate = certificate;
    }
}
```

## Python sample

The following Flask and Django Python code samples implement a decorator named `authorize_certificate` that can be used on a view function to permit access only to callers that present a valid client certificate. It expects a PEM formatted certificate in the `X-ARR-ClientCert` header and uses the Python [cryptography](https://pypi.org/project/cryptography/) package to validate the certificate based on its fingerprint (thumbprint), subject common name, issuer common name, and beginning and expiration dates. If validation fails, the decorator ensures that an HTTP response with status code 403 (Forbidden) is returned to the client.

### [Flask](#tab/flask)

```python
from functools import wraps
from datetime import datetime, timezone
from flask import abort, request
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes


def validate_cert(request):

    try:
        cert_value =  request.headers.get('X-ARR-ClientCert')
        if cert_value is None:
            return False
        
        cert_data = ''.join(['-----BEGIN CERTIFICATE-----\n', cert_value, '\n-----END CERTIFICATE-----\n',])
        cert = x509.load_pem_x509_certificate(cert_data.encode('utf-8'))
    
        fingerprint = cert.fingerprint(hashes.SHA1())
        if fingerprint != b'12345678901234567890':
            return False
        
        subject = cert.subject
        subject_cn = subject.get_attributes_for_oid(NameOID.COMMON_NAME)[0].value
        if subject_cn != "contoso.com":
            return False
        
        issuer = cert.issuer
        issuer_cn = issuer.get_attributes_for_oid(NameOID.COMMON_NAME)[0].value
        if issuer_cn != "contoso.com":
            return False
    
        current_time = datetime.now(timezone.utc)
    
        if current_time < cert.not_valid_before_utc:
            return False
        
        if current_time > cert.not_valid_after_utc:
            return False
        
        return True

    except Exception as e:
        # Handle any errors encountered during validation
        print(f"Encountered the following error during certificate validation: {e}")
        return False
    
def authorize_certificate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not validate_cert(request):
            abort(403)
        return f(*args, **kwargs)
    return decorated_function
```

The following code snippet shows how to use the decorator on a Flask view function.

```python
@app.route('/hellocert')
@authorize_certificate
def hellocert():
   print('Request for hellocert page received')
   return render_template('index.html')
```

### [Django](#tab/django)

```python
from functools import wraps
from datetime import datetime, timezone
from django.core.exceptions import PermissionDenied
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes


def validate_cert(request):

    try:
        cert_value =  request.headers.get('X-ARR-ClientCert')
        if cert_value is None:
            return False
        
        cert_data = ''.join(['-----BEGIN CERTIFICATE-----\n', cert_value, '\n-----END CERTIFICATE-----\n',])
        cert = x509.load_pem_x509_certificate(cert_data.encode('utf-8'))
    
        fingerprint = cert.fingerprint(hashes.SHA1())
        if fingerprint != b'12345678901234567890':
            return False
        
        subject = cert.subject
        subject_cn = subject.get_attributes_for_oid(NameOID.COMMON_NAME)[0].value
        if subject_cn != "contoso.com":
            return False
        
        issuer = cert.issuer
        issuer_cn = issuer.get_attributes_for_oid(NameOID.COMMON_NAME)[0].value
        if issuer_cn != "contoso.com":
            return False
    
        current_time = datetime.now(timezone.utc)
    
        if current_time < cert.not_valid_before_utc:
            return False
        
        if current_time > cert.not_valid_after_utc:
            return False
        
        return True

    except Exception as e:
        # Handle any errors encountered during validation
        print(f"Encountered the following error during certificate validation: {e}")
        return False

def authorize_certificate(view):
    @wraps(view)
    def _wrapped_view(request, *args, **kwargs):
        if not validate_cert(request):
            raise PermissionDenied
        return view(request, *args, **kwargs)
    return _wrapped_view
```

The following code snippet shows how to use the decorator on a Django view function.

```python
@authorize_certificate
def hellocert(request):
    print('Request for hellocert page received')
    return render(request, 'hello_azure/index.html')
```

---

[exclusion-paths]: ./media/app-service-web-configure-tls-mutual-auth/exclusion-paths.png
