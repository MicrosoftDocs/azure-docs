---
title: Set Up TLS Mutual Authentication
titleSuffix: Azure App Service
description: Learn how to set up TLS mutual authentication in Azure App Service to help secure two-way communication between client and server.
keywords: TLS mutual authentication, Azure App Service security, secure client-server communication
author: msangapu-msft
ms.author: msangapu
ms.topic: how-to
ms.date: 05/09/2025
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
 
#customer intent: As a developer, I want to set up mutual authentication so that I can restrict access to an App Service app. 
---

# Configure TLS mutual authentication in Azure App Service

You can restrict access to your Azure App Service app by enabling various types of authentication for the app. One way to set up authentication is to request a client certificate when the client request is sent by using Transport Layer Security (TLS) / Secure Sockets Layer (SSL) and to validate the certificate. This mechanism is called *mutual authentication* or *client certificate authentication*. This article shows how to set up your app to use client certificate authentication.

> [!NOTE]
> Your app code must validate the client certificate. App Service doesn't do anything with the client certificate other than forward it to your app.
>
> If you access your site over HTTP and not HTTPS, you don't receive any client certificates. If your application requires client certificates, you shouldn't allow requests to your application over HTTP.

[!INCLUDE [Prepare your web app](../../includes/app-service-ssl-prepare-app.md)]

## Enable client certificates

When you enable client certificates for your app, you should select your choice of client certificate mode. The mode defines how your app handles incoming client certificates. The modes are described in the following table:

|Client certificate mode|Description|
|-|-|
|Required|All requests require a client certificate.|
|Optional|Requests can use a client certificate. Clients are prompted for a certificate by default. For example, browser clients show a prompt to select a certificate for authentication.|
|Optional Interactive User|Requests can use a client certificate. Clients aren't prompted for a certificate by default. For example, browser clients don't show a prompt to select a certificate for authentication.|

### [Azure portal](#tab/azureportal)

To use the Azure portal to enable client certificates:

1. Go to your app management page.
1. In the left menu, select **Configuration** > **General settings**.
1. For **Client certificate mode**, select your choice.
1. Select **Save**.

### [Azure CLI](#tab/azurecli)

To use the Azure CLI to enable client certificates, run the following command in [Azure Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp update --set clientCertEnabled=true --name <app-name> --resource-group <group-name>
```

### [Bicep](#tab/bicep)

To enable client certificates in Bicep, modify the `clientCertEnabled`, `clientCertMode`, and `clientCertExclusionPaths` properties.

Here's a sample Bicep snippet:

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

To enable client certificates in an Azure Resource Manager template (ARM template), modify the `clientCertEnabled`, `clientCertMode`, and `clientCertExclusionPaths` properties.

Here's a sample ARM template snippet:

```json
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

When you enable mutual authentication for your application, all paths under the root of your app require a client certificate for access. To remove this requirement for certain paths, define exclusion paths as part of your application configuration.

> [!NOTE]
> Using any client certificate exclusion path triggers TLS renegotiation for incoming requests to the app.

1. In the left menu of your app management page, select **Settings** > **Configuration**. Select the **General settings** tab.

1. Next to **Certificate exclusion paths**, select the pencil icon.

1. Select **New path**, specify a path or a list of paths separated by `,` or `;`, and then select **OK**.

1. Select **Save**.

The following screenshot shows how to set a certificate exclusion path. In this example, any path for the app that starts with `/public` doesn't request a client certificate. Path matching isn't case specific.

:::image type="content" source="media/app-service-web-configure-tls-mutual-auth/exclusion-paths.png" alt-text="Screenshot that shows how to set a certificate exclusion path." lightbox="media/app-service-web-configure-tls-mutual-auth/exclusion-paths.png":::

## Client certificate and TLS renegotiation

For some client certificate settings, App Service requires TLS renegotiation to read a request before knowing whether to prompt for a client certificate. Both of the following settings trigger TLS renegotiation:

- Using the **Optional Interactive User** client certificate mode.
- Using a [client certificate exclusion path](#exclude-paths-from-requiring-authentication).

> [!NOTE]
> TLS 1.3 and HTTP 2.0 don't support TLS renegotiation. These protocols don't work if your app is configured with client certificate settings that use TLS renegotiation.

To disable TLS renegotiation and have the app negotiate client certificates during TLS handshake, you must take the following actions in your app:

- Set the client certificate mode to **Required** or **Optional**.
- Remove all client certificate exclusion paths.

### Upload large files with TLS renegotiation

Client certificate configurations that use TLS renegotiation can't support incoming requests with files that are larger than 100 KB. This limit is caused by buffer size limitations. In this scenario, any POST or PUT requests that are over 100 KB fail with a 403 error. This limit isn't configurable and can't be increased.

To address the 100-KB limit, consider these solutions:

- Disable TLS renegotiation. Take the following actions in your app's client certificate configurations:
    - Set the client certificate mode to **Required** or **Optional**.
    - Remove all client certificate exclusion paths.
- Send a HEAD request before the PUT/POST request. The HEAD request handles the client certificate.
- Add the header `Expect: 100-Continue` to your request. This header causes the client to wait until the server responds with a `100 Continue` before sending the request body, and the buffers are bypassed.

## Access the client certificate

In App Service, TLS termination of the request happens at the front-end load balancer. When App Service forwards the request to your app code with [client certificates enabled](#enable-client-certificates), it injects an `X-ARR-ClientCert` request header with the client certificate. App Service doesn't do anything with this client certificate other than forward it to your app. Your app code needs to validate the client certificate.

In ASP.NET, the client certificate is available through the `HttpRequest.ClientCertificate` property.

In other application stacks (Node.js, PHP), the client certificate is available via a Base64-encoded value in the `X-ARR-ClientCert` request header.

## ASP.NET Core sample

For ASP.NET Core, middleware is available to parse forwarded certificates. Separate middleware is available for using the forwarded protocol headers. Both must be present for forwarded certificates to be accepted. You can place custom certificate validation logic in the [CertificateAuthentication options](/aspnet/core/security/authentication/certauth):

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
        // Configure the application to use the protocol and client IP address forwarded by the front-end load balancer.
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            // By default, only loopback proxies are allowed. Clear that restriction to enable this explicit configuration.
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });       
        
        // Configure the application to use the client certificate forwarded by the front-end load balancer.
        services.AddCertificateForwarding(options => { options.CertificateHeader = "X-ARR-ClientCert"; });

        // Add certificate authentication so that when authorization is performed the user will be created from the certificate.
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

## ASP.NET Web Forms sample

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
            // Read the certificate from the header into an X509Certificate2 object.
            // Display properties of the certificate on the page.
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
            // This is a sample verification routine. You should modify this method to suit  your application logic and security requirements. 
            // 
            //
            private bool IsValidClientCertificate()
            {
                // In this example, the certificate is accepted as a valid certificate only if these conditions are met:
                // - The certificate isn't expired and is active for the current time on the server.
                // - The subject name of the certificate has the common name nildevecc.
                // - The issuer name of the certificate has the common name nildevecc and the organization name Microsoft Corp.
                // - The thumbprint of the certificate is 30757A2E831977D8BD9C8496E4C99AB26CB9622B.
                //
                // This example doesn't test that the certificate is chained to a trusted root authority (or revoked) on the server. 
                // It allows self-signed certificates.
                //

                if (certificate == null || !String.IsNullOrEmpty(errorString)) return false;

                // 1. Check time validity of the certificate.
                if (DateTime.Compare(DateTime.Now, certificate.NotBefore) < 0 || DateTime.Compare(DateTime.Now, certificate.NotAfter) > 0) return false;

                // 2. Check the subject name of the certificate.
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

                // 3. Check the issuer name of the certificate.
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

                // 4. Check the thumbprint of the certificate.
                if (String.Compare(certificate.Thumbprint.Trim().ToUpper(), "30757A2E831977D8BD9C8496E4C99AB26CB9622B") != 0) return false;

                return true;
            }
        }
    }
```

## Node.js sample

The following Node.js sample code gets the `X-ARR-ClientCert` header and uses [node-forge](https://github.com/digitalbazaar/forge) to convert the Base64-encoded Privacy Enhanced Mail (PEM) string into a certificate object and validate it:

```javascript
import { NextFunction, Request, Response } from 'express';
import { pki, md, asn1 } from 'node-forge';

export class AuthorizationHandler {
    public static authorizeClientCertificate(req: Request, res: Response, next: NextFunction): void {
        try {
            // Get header.
            const header = req.get('X-ARR-ClientCert');
            if (!header) throw new Error('UNAUTHORIZED');

            // Convert from PEM to PKI certificate.
            const pem = `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
            const incomingCert: pki.Certificate = pki.certificateFromPem(pem);

            // Validate certificate thumbprint.
            const fingerPrint = md.sha1.create().update(asn1.toDer(pki.certificateToAsn1(incomingCert)).getBytes()).digest().toHex();
            if (fingerPrint.toLowerCase() !== 'abcdef1234567890abcdef1234567890abcdef12') throw new Error('UNAUTHORIZED');

            // Validate time validity.
            const currentDate = new Date();
            if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw new Error('UNAUTHORIZED');

            // Validate issuer.
            if (incomingCert.issuer.hash.toLowerCase() !== 'abcdef1234567890abcdef1234567890abcdef12') throw new Error('UNAUTHORIZED');

            // Validate subject.
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

The following Java class encodes the certificate from `X-ARR-ClientCert` to an `X509Certificate` instance. `certificateIsValid()` validates that the certificate's thumbprint matches the one given in the constructor and that the certificate isn't expired.

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
     * @param certificate. The certificate from the "X-ARR-ClientCert" HTTP header.
     * @param thumbprint. The thumbprint to check against.
     * @throws CertificateException if the certificate factory can't be created.
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
     * certificate isn't expired.
     * @return True if the certificate's thumbprint matches and isn't expired. False otherwise.
     */
    public boolean certificateIsValid() throws NoSuchAlgorithmException, CertificateEncodingException {
        return certificateHasNotExpired() && thumbprintIsValid();
    }

    /**
     * Check certificate's timestamp.
     * @return True if the certificate isn't expired. It returns False if it is expired.
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
     * Check whether the certificate's thumbprint matches the given one.
     * @return True if the thumbprints match. False otherwise.
     */
    private boolean thumbprintIsValid() throws NoSuchAlgorithmException, CertificateEncodingException {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] der = this.getCertificate().getEncoded();
        md.update(der);
        byte[] digest = md.digest();
        String digestHex = DatatypeConverter.printHexBinary(digest);
        return digestHex.toLowerCase().equals(this.getThumbprint().toLowerCase());
    }

    // Getters and setters.

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

The following Flask and Django Python code samples implement a decorator named `authorize_certificate` that can be used on a view function to permit access only to callers that present a valid client certificate. It expects a PEM-formatted certificate in the `X-ARR-ClientCert` header and uses the Python [cryptography](https://pypi.org/project/cryptography/) package to validate the certificate based on its fingerprint (thumbprint), subject common name, issuer common name, and beginning and expiration dates. If validation fails, the decorator ensures that an HTTP response with status code 403 (Forbidden) is returned to the client.

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
        # Handle any errors encountered during validation.
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
        # Handle any errors encountered during validation.
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

The following code snippet shows how to use the decorator on a Django view function:

```python
@authorize_certificate
def hellocert(request):
    print('Request for hellocert page received')
    return render(request, 'hello_azure/index.html')
```

---
