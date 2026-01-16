---
title: Generate self-signed certificate with a custom root CA
titleSuffix: Azure Application Gateway
description: Learn how to generate an Azure Application Gateway self-signed certificate with a custom root CA
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 12/09/2025
ms.author: mbender
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
# Customer intent: As a cloud administrator, I want to generate a self-signed certificate using a custom root CA for my Application Gateway, so that I can securely establish TLS connections with backend servers in a development environment without incurring costs for commercial certificates.
---

# Generate an Azure Application Gateway self-signed certificate with a custom root CA

The Application Gateway v2 SKU introduces the use of Trusted Root Certificates to allow TLS connections with the backend servers. This feature removes the use of authentication certificates (individual Leaf certificates) that were required in the v1 SKU. The *root certificate* is a Base-64 encoded X.509(.CER) format root certificate from the backend certificate server. It identifies the root certificate authority (CA) that issued the server certificate and the server certificate is then used for the TLS/SSL communication.

Application Gateway trusts your website's certificate by default if a well-known CA (for example, GoDaddy or DigiCert) signs it. Explicitly uploading the root certificate isn't required in that case. For more information, see [Overview of TLS termination and end to end TLS with Application Gateway](ssl-overview.md). However, if you have a dev/test environment and don't want to purchase a verified CA signed certificate, you can create your own custom Root CA and a leaf certificate signed by that Root CA.

> [!NOTE]
> Self-generated certificates aren't trusted by default and can be difficult to maintain. Also, they can use outdated hash and cipher suites that aren't strong. For better security, purchase a certificate signed by a well-known certificate authority.

**Use the following options to generate your private certificate for backend TLS connections.**
1. Use the [**private certificate generator tool**](https://appgwbackendcertgenerator.azurewebsites.net/). By using the domain name (Common Name) that you provide, this tool performs the same steps as documented in this article to generate Root and Server certificates. With the generated certificate files, you can immediately upload the Root certificate (.CER) file to the Backend Setting of your gateway and the corresponding certificate chain (.PFX) to the backend server. The password for the PFX file is also supplied in the downloaded ZIP file.

1. Use OpenSSL commands to customize and generate certificates as per your needs. Continue to follow the instructions in this article if you want to do this process entirely on your own.

In this article, you learn how to:

- Create your own custom Certificate Authority
- Create a self-signed certificate signed by your custom CA
- Upload a self-signed root certificate to an Application Gateway to authenticate the backend server

## Prerequisites

- **[OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux**

   While other tools might be available for certificate management, this tutorial uses OpenSSL. You can find OpenSSL bundled with many Linux distributions, such as Ubuntu.
- **A web server**

   For example, Apache, IIS, or NGINX to test the certificates.

- **An Application Gateway v2 SKU**

  If you don't have an existing application gateway, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md).

## Create a root CA certificate

Create your root CA certificate by using OpenSSL.

### Create the root key

1. Sign in to your computer where OpenSSL is installed and run the following command. This command creates an encrypted key.

   ```
   openssl ecparam -out contoso.key -name prime256v1 -genkey
   ```

### Create a root certificate and self-sign it

1. Use the following command to generate the Certificate Signing Request (CSR).

   ```
   openssl req -new -sha256 -key contoso.key -out contoso.csr
   ```

1. When prompted, type the password for the root key, and the organizational information for the custom CA such as country/region, state, org, OU, and the fully qualified domain name (this domain is the issuer).

   :::image type="content" source="media/self-signed-certificates/root-cert.png" alt-text="Screenshot of create root certificate.":::

1. Use the following command to generate the root certificate.

   ```
   openssl x509 -req -sha256 -days 365 -in contoso.csr -signkey contoso.key -out contoso.crt
   ```
   The previous commands create the root certificate. You use this certificate to sign your server certificate.

## Create a server certificate

Next, you create a server certificate by using OpenSSL.

### Create the certificate's key

Use the following command to generate the key for the server certificate.

   ```
   openssl ecparam -out fabrikam.key -name prime256v1 -genkey
   ```

### Create the CSR (Certificate Signing Request)

The CSR is a public key that you give to a CA when requesting a certificate. The CA issues the certificate for this specific request.

> [!NOTE]
> The CN (Common Name) for the server certificate must be different from the issuer's domain. For example, in this case, the CN for the issuer is `www.contoso.com` and the server certificate's CN is `www.fabrikam.com`.


1. Use the following command to generate the CSR:

   ```
   openssl req -new -sha256 -key fabrikam.key -out fabrikam.csr
   ```

1. When prompted, type the password for the root key, and the organizational information for the custom CA: Country/Region, State, Org, OU, and the fully qualified domain name. This domain is the website's domain and it should be different from the issuer.

   :::image type="content" source="media/self-signed-certificates/server-cert.png" alt-text="Screenshot of server certificate.":::

### Generate the certificate with the CSR and the key and sign it with the CA's root key

1. Use the following command to create the certificate:

   ```
   openssl x509 -req -in fabrikam.csr -CA  contoso.crt -CAkey contoso.key -CAcreateserial -out fabrikam.crt -days 365 -sha256
   ```
### Verify the newly created certificate

1. Use the following command to print the output of the CRT file and verify its content:

   ```
   openssl x509 -in fabrikam.crt -text -noout
   ```

   :::image type="content" source="media/self-signed-certificates/verify-cert.png" alt-text="Screenshot of certificate verification.":::

1. Verify the files in your directory, and ensure you have the following files:

   - contoso.crt
   - contoso.key
   - fabrikam.crt
   - fabrikam.key

## Configure the certificate in your web server's TLS settings

In your web server, configure TLS by using the fabrikam.crt and fabrikam.key files. If your web server can't take two files, you can combine them into a single .pem or .pfx file by using OpenSSL commands.

### IIS

For instructions on how to import certificate and upload them as server certificate on IIS, see [HOW TO: Install Imported Certificates on a Web Server in Windows Server 2003](https://support.microsoft.com/help/816794/how-to-install-imported-certificates-on-a-web-server-in-windows-server).

For TLS binding instructions, see [How to Set Up SSL on IIS 7](/iis/manage/configuring-security/how-to-set-up-ssl-on-iis#create-an-ssl-binding-1).

### Apache

The following configuration is an example [virtual host configured for SSL](https://cwiki.apache.org/confluence/display/HTTPD/NameBasedSSLVHosts) in Apache:

```
<VirtualHost www.fabrikam:443>
      DocumentRoot /var/www/fabrikam
      ServerName www.fabrikam.com
      SSLEngine on
      SSLCertificateFile /home/user/fabrikam.crt
      SSLCertificateKeyFile /home/user/fabrikam.key
</VirtualHost>
```

### NGINX

The following configuration is an example [NGINX server block](https://nginx.org/docs/http/configuring_https_servers.html) with TLS configuration:

:::image type="content" source="media/self-signed-certificates/nginx-ssl.png" alt-text="Screenshot of NGINX with TLS.":::

## Access the server with the self-signed certificate

1. Add the root certificate to your machine's trusted root store. When you access the website, ensure the entire certificate chain is seen in the browser.

   :::image type="content" source="media/self-signed-certificates/trusted-root-cert.png" alt-text="Screenshot of trusted root certificates.":::

   > [!NOTE]
   > DNS should be configured to point the web server name (in this example, `www.fabrikam.com`) to your web server's IP address. If not, you can edit the [hosts file](/answers/questions/4310469/host-file) to resolve the name.
1. Browse to your website, and click the lock icon on your browser's address box to verify the site and certificate information.

## Verify the configuration with OpenSSL

Or, you can use OpenSSL to verify the certificate.

```
openssl s_client -connect localhost:443 -servername www.fabrikam.com -showcerts
```

:::image type="content" source="media/self-signed-certificates/openssl-verify.png" alt-text="Screenshot of OpenSSL certificate verification.":::

## Upload the root certificate to Application Gateway's HTTP Settings

To upload the certificate in Application Gateway, you must export the .crt certificate into a .cer format Base-64 encoded. Since .crt already contains the public key in the base-64 encoded format, just rename the file extension from .crt to .cer.

### Azure portal

To upload the trusted root certificate from the portal, select the **Backend Settings** and select **HTTPS** in the **Backend protocol**.

:::image type="content" source="./media/self-signed-certificates/portal-cert.png" alt-text="Screenshot of adding a certificate using the portal.":::
### Azure PowerShell

Or, use Azure CLI or Azure PowerShell to upload the root certificate. The following code is an Azure PowerShell sample.

> [!NOTE]
> The following sample adds a trusted root certificate to the application gateway, creates a new HTTP setting, and adds a new rule, assuming the backend pool and the listener already exist.

```azurepowershell
## Add the trusted root certificate to the Application Gateway

$gw=Get-AzApplicationGateway -Name appgwv2 -ResourceGroupName rgOne

Add-AzApplicationGatewayTrustedRootCertificate `
   -ApplicationGateway $gw `
   -Name CustomCARoot `
   -CertificateFile "C:\Users\surmb\Downloads\contoso.cer"

$trustedroot = Get-AzApplicationGatewayTrustedRootCertificate `
   -Name CustomCARoot `
   -ApplicationGateway $gw

## Get the listener, backend pool and probe

$listener = Get-AzApplicationGatewayHttpListener `
   -Name basichttps `
   -ApplicationGateway $gw

$bepool = Get-AzApplicationGatewayBackendAddressPool `
  -Name testbackendpool `
  -ApplicationGateway $gw

Add-AzApplicationGatewayProbeConfig `
  -ApplicationGateway $gw `
  -Name testprobe `
  -Protocol Https `
  -HostName "www.fabrikam.com" `
  -Path "/" `
  -Interval 15 `
  -Timeout 20 `
  -UnhealthyThreshold 3

$probe = Get-AzApplicationGatewayProbeConfig `
  -Name testprobe `
  -ApplicationGateway $gw

## Add the configuration to the HTTP Setting and don't forget to set the "hostname" field
## to the domain name of the server certificate as this will be set as the SNI header and
## will be used to verify the backend server's certificate. Note that TLS handshake will
## fail otherwise and might lead to backend servers being deemed as Unhealthy by the probes

Add-AzApplicationGatewayBackendHttpSettings `
  -ApplicationGateway $gw `
  -Name testbackend `
  -Port 443 `
  -Protocol Https `
  -Probe $probe `
  -TrustedRootCertificate $trustedroot `
  -CookieBasedAffinity Disabled `
  -RequestTimeout 20 `
  -HostName www.fabrikam.com

## Get the configuration and update the Application Gateway

$backendhttp = Get-AzApplicationGatewayBackendHttpSettings `
  -Name testbackend `
  -ApplicationGateway $gw

Add-AzApplicationGatewayRequestRoutingRule `
  -ApplicationGateway $gw `
  -Name testrule `
  -RuleType Basic `
  -BackendHttpSettings $backendhttp `
  -HttpListener $listener `
  -BackendAddressPool $bepool

Set-AzApplicationGateway -ApplicationGateway $gw
```

### Verify the application gateway backend health

1. Select the **Backend Health** view of your application gateway to check if the probe is healthy.
1. You should see that the Status is **Healthy** for the HTTPS probe.

:::image type="content" source="media/self-signed-certificates/https-probe.png" alt-text="Screenshot of HTTPS probe.":::

## Next steps

To learn more about SSL\TLS in Application Gateway, see [Overview of TLS termination and end to end TLS with Application Gateway](ssl-overview.md).
