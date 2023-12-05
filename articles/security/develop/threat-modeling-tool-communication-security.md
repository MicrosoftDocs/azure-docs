---
title: Communication security for the Microsoft Threat Modeling Tool 
titleSuffix: Azure
description: Learn about mitigation for communication security threats exposed in the Threat Modeling Tool. See mitigation information and view code examples.
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: information-protection
ms.subservice: aiplabels
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib
ms.custom: devx-track-csharp

---

# Security Frame: Communication Security | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **Azure Event Hub** | <ul><li>[Secure communication to Event Hub using SSL/TLS](#comm-ssltls)</li></ul> |
| **Dynamics CRM** | <ul><li>[Check service account privileges and check that the custom Services or ASP.NET Pages respect CRM's security](#priv-aspnet)</li></ul> |
| **Azure Data Factory** | <ul><li>[Use Data management gateway while connecting On-premises SQL Server to Azure Data Factory](#sqlserver-factory)</li></ul> |
| **Identity Server** | <ul><li>[Ensure that all traffic to Identity Server is over HTTPS connection](#identity-https)</li></ul> |
| **Web Application** | <ul><li>[Verify X.509 certificates used to authenticate SSL, TLS, and DTLS connections](#x509-ssltls)</li><li>[Configure TLS/SSL certificate for custom domain in Azure App Service](#ssl-appservice)</li><li>[Force all traffic to Azure App Service over HTTPS connection](#appservice-https)</li><li>[Enable HTTP Strict Transport Security (HSTS)](#http-hsts)</li></ul> |
| **Database** | <ul><li>[Ensure SQL server connection encryption and certificate validation](#sqlserver-validation)</li><li>[Force Encrypted communication to SQL server](#encrypted-sqlserver)</li></ul> |
| **Azure Storage** | <ul><li>[Ensure that communication to Azure Storage is over HTTPS](#comm-storage)</li><li>[Validate MD5 hash after downloading blob if HTTPS cannot be enabled](#md5-https)</li><li>[Use SMB 3.0 compatible client to ensure in-transit data encryption to Azure File Shares](#smb-shares)</li></ul> |
| **Mobile Client** | <ul><li>[Implement Certificate Pinning](#cert-pinning)</li></ul> |
| **WCF** | <ul><li>[Enable HTTPS - Secure Transport channel](#https-transport)</li><li>[WCF: Set Message security Protection level to EncryptAndSign](#message-protection)</li><li>[WCF: Use a least-privileged account to run your WCF service](#least-account-wcf)</li></ul> |
| **Web API** | <ul><li>[Force all traffic to Web APIs over HTTPS connection](#webapi-https)</li></ul> |
| **Azure Cache for Redis** | <ul><li>[Ensure that communication to Azure Cache for Redis is over TLS](#redis-ssl)</li></ul> |
| **IoT Field Gateway** | <ul><li>[Secure Device to Field Gateway communication](#device-field)</li></ul> |
| **IoT Cloud Gateway** | <ul><li>[Secure Device to Cloud Gateway communication using SSL/TLS](#device-cloud)</li></ul> |

## <a id="comm-ssltls"></a>Secure communication to Event Hub using SSL/TLS

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Event Hub | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Event Hubs authentication and security model overview](../../event-hubs/authenticate-shared-access-signature.md) |
| **Steps** | Secure AMQP or HTTP connections to Event Hub using SSL/TLS |

## <a id="priv-aspnet"></a>Check service account privileges and check that the custom Services or ASP.NET Pages respect CRM's security

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Check service account privileges and check that the custom Services or ASP.NET Pages respect CRM's security |

## <a id="sqlserver-factory"></a>Use Data management gateway while connecting On-premises SQL Server to Azure Data Factory

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Data Factory | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Linked Service Types - Azure and On-premises |
| **References**              |[Moving data between On-premises and Azure Data Factory](../../data-factory/create-self-hosted-integration-runtime.md?tabs=data-factory) |
| **Steps** | <p>The Data Management Gateway (DMG) tool is required to connect to data sources which are protected behind corpnet or a firewall.</p><ol><li>Locking down the machine isolates the DMG tool and prevents malfunctioning programs from damaging or snooping on the data source machine. (E.g. latest updates must be installed, enable minimum required ports, controlled accounts provisioning, auditing enabled, disk encryption enabled etc.)</li><li>Data Gateway key must be rotated at frequent intervals or whenever the DMG service account password renews</li><li>Data transits through Link Service must be encrypted</li></ol> |

## <a id="identity-https"></a>Ensure that all traffic to Identity Server is over HTTPS connection

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Identity Server | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [IdentityServer3 - Keys, Signatures and Cryptography](https://identityserver.github.io/Documentation/docsv2/configuration/crypto.html), [IdentityServer3 - Deployment](https://identityserver.github.io/Documentation/docsv2/advanced/deployment.html) |
| **Steps** | By default, IdentityServer requires all incoming connections to come over HTTPS. It is absolutely mandatory that communication with IdentityServer is done over secured transports only. There are certain deployment scenarios like TLS offloading where this requirement can be relaxed. See the Identity Server deployment page in the references for more information. |

## <a id="x509-ssltls"></a>Verify X.509 certificates used to authenticate SSL, TLS, and DTLS connections

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Applications that use SSL, TLS, or DTLS must fully verify the X.509 certificates of the entities they connect to. This includes verification of the certificates for:</p><ul><li>Domain name</li><li>Validity dates (both beginning and expiration dates)</li><li>Revocation status</li><li>Usage (for example, Server Authentication for servers, Client Authentication for clients)</li><li>Trust chain. Certificates must chain to a root certification authority (CA) that is trusted by the platform or explicitly configured by the administrator</li><li>Key length of certificate's public key must be >2048 bits</li><li>Hashing algorithm must be SHA256 and above |

## <a id="ssl-appservice"></a>Configure TLS/SSL certificate for custom domain in Azure App Service

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | EnvironmentType - Azure |
| **References**              | [Enable HTTPS for an app in Azure App Service](../../app-service/configure-ssl-bindings.md) |
| **Steps** | By default, Azure already enables HTTPS for every app with a wildcard certificate for the *.azurewebsites.net domain. However, like all wildcard domains, it is not as secure as using a custom domain with own certificate [Refer](https://casecurity.org/2014/02/26/pros-and-cons-of-single-domain-multi-domain-and-wildcard-certificates/). It is recommended to enable TLS for the custom domain which the deployed app will be accessed through|

## <a id="appservice-https"></a>Force all traffic to Azure App Service over HTTPS connection

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | EnvironmentType - Azure |
| **References**              | [Enforce HTTPS on Azure App Service](../../app-service/configure-ssl-bindings.md#enforce-https) |
| **Steps** | <p>Though Azure already enables HTTPS for Azure app services with a wildcard certificate for the domain *.azurewebsites.net, it do not enforce HTTPS. Visitors may still access the app using HTTP, which may compromise the app's security and hence HTTPS has to be enforced explicitly. ASP.NET MVC applications should use the [RequireHttps filter](/dotnet/api/system.web.mvc.requirehttpsattribute) that forces an unsecured HTTP request to be re-sent over HTTPS.</p><p>Alternatively, the URL Rewrite module, which is included with Azure App Service can be used to enforce HTTPS. URL Rewrite module enables developers to define rules that are applied to incoming requests before the requests are handed to your application. URL Rewrite rules are defined in a web.config file stored in the root of the application</p>|

### Example
The following example contains a basic URL Rewrite rule that forces all incoming traffic to use HTTPS
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Force HTTPS" enabled="true">
          <match url="(.*)" ignoreCase="false" />
          <conditions>
            <add input="{HTTPS}" pattern="off" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" appendQueryString="true" redirectType="Permanent" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```
This rule works by returning an HTTP status code of 301 (permanent redirect) when the user requests a page using HTTP. The 301 redirects the request to the same URL as the visitor requested, but replaces the HTTP portion of the request with HTTPS. For example, `HTTP://contoso.com` would be redirected to `HTTPS://contoso.com`. 

## <a id="http-hsts"></a>Enable HTTP Strict Transport Security (HSTS)

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [OWASP HTTP Strict Transport Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) |
| **Steps** | <p>HTTP Strict Transport Security (HSTS) is an opt-in security enhancement that is specified by a web application through the use of a special response header. Once a supported browser receives this header that browser will prevent any communications from being sent over HTTP to the specified domain and will instead send all communications over HTTPS. It also prevents HTTPS click through prompts on browsers.</p><p>To implement HSTS, the following response header has to be configured for a website globally, either in code or in config. Strict-Transport-Security: max-age=300; includeSubDomains HSTS addresses the following threats:</p><ul><li>User bookmarks or manually types `https://example.com` and is subject to a man-in-the-middle attacker: HSTS automatically redirects HTTP requests to HTTPS for the target domain</li><li>Web application that is intended to be purely HTTPS inadvertently contains HTTP links or serves content over HTTP: HSTS automatically redirects HTTP requests to HTTPS for the target domain</li><li>A man-in-the-middle attacker attempts to intercept traffic from a victim user using an invalid certificate and hopes the user will accept the bad certificate: HSTS does not allow a user to override the invalid certificate message</li></ul>|

## <a id="sqlserver-validation"></a>Ensure SQL server connection encryption and certificate validation

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | SQL Azure  |
| **Attributes**              | SQL Version - V12 |
| **References**              | [Best Practices on Writing Secure Connection Strings for SQL Database](https://social.technet.microsoft.com/wiki/contents/articles/2951.windows-azure-sql-database-connection-security.aspx#best) |
| **Steps** | <p>All communications between SQL Database and a client application are encrypted using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), at all times. SQL Database doesn't support unencrypted connections. To validate certificates with application code or tools, explicitly request an encrypted connection and do not trust the server certificates. If your application code or tools do not request an encrypted connection, they will still receive encrypted connections</p><p>However, they may not validate the server certificates and thus will be susceptible to "man in the middle" attacks. To validate certificates with ADO.NET application code, set `Encrypt=True` and `TrustServerCertificate=False` in the database connection string. To validate certificates via SQL Server Management Studio, open the Connect to Server dialog box. Click Encrypt connection on the Connection Properties tab</p>|

## <a id="encrypted-sqlserver"></a>Force Encrypted communication to SQL server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | OnPrem |
| **Attributes**              | SQL Version - MsSQL2016, SQL Version - MsSQL2012, SQL Version - MsSQL2014 |
| **References**              | [Enable Encrypted Connections to the Database Engine](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine)  |
| **Steps** | Enabling TLS encryption increases the security of data transmitted across networks between instances of SQL Server and applications. |

## <a id="comm-storage"></a>Ensure that communication to Azure Storage is over HTTPS

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Azure Storage Transport-Level Encryption – Using HTTPS](../../storage/blobs/security-recommendations.md#networking) |
| **Steps** | To ensure the security of Azure Storage data in-transit, always use the HTTPS protocol when calling the REST APIs or accessing objects in storage. Also, Shared Access Signatures, which can be used to delegate access to Azure Storage objects, include an option to specify that only the HTTPS protocol can be used when using Shared Access Signatures, ensuring that anybody sending out links with SAS tokens will use the proper protocol.|

## <a id="md5-https"></a>Validate MD5 hash after downloading blob if HTTPS cannot be enabled

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | StorageType - Blob |
| **References**              | [Windows Azure Blob MD5 Overview](https://blogs.msdn.microsoft.com/windowsazurestorage/2011/02/17/windows-azure-blob-md5-overview/) |
| **Steps** | <p>Windows Azure Blob service provides mechanisms to ensure data integrity both at the application and transport layers. If for any reason you need to use HTTP instead of HTTPS and you are working with block blobs, you can use MD5 checking to help verify the integrity of the blobs being transferred</p><p>This will help with protection from network/transport layer errors, but not necessarily with intermediary attacks. If you can use HTTPS, which provides transport level security, then using MD5 checking is redundant and unnecessary.</p>|

## <a id="smb-shares"></a>Use SMB 3.x compatible client to ensure in-transit data encryption to Azure file shares

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Mobile Client | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | StorageType - File |
| **References**              | [Azure Files](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/#comment-2529238931), [Azure Files SMB Support for Windows Clients](../../storage/files/storage-dotnet-how-to-use-files.md#understanding-the-net-apis) |
| **Steps** | Azure Files supports HTTPS when using the REST API, but is more commonly used as an SMB file share attached to a VM. SMB 2.1 does not support encryption, so connections are only allowed within the same region in Azure. However, SMB 3.x supports encryption, and can be used with Windows Server 2012 R2, Windows 8, Windows 8.1, and Windows 10, allowing cross-region access and even access on the desktop. |

## <a id="cert-pinning"></a>Implement Certificate Pinning

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, Windows Phone |
| **Attributes**              | N/A  |
| **References**              | [Certificate and Public Key Pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning) |
| **Steps** | <p>Certificate pinning defends against Man-In-The-Middle (MITM) attacks. Pinning is the process of associating a host with their expected X509 certificate or public key. Once a certificate or public key is known or seen for a host, the certificate or public key is associated or 'pinned' to the host. </p><p>Thus, when an adversary attempts to do TLS MITM attack, during TLS handshake the key from attacker's server will be different from the pinned certificate's key, and the request will be discarded, thus preventing MITM Certificate pinning can be achieved by implementing ServicePointManager's `ServerCertificateValidationCallback` delegate.</p>|

### Example
```csharp
using System;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography;

namespace CertificatePinningExample
{
    class CertificatePinningExample
    {
        /* Note: In this example, we're hardcoding the certificate's public key and algorithm for 
           demonstration purposes. In a real-world application, this should be stored in a secure
           configuration area that can be updated as needed. */

        private static readonly string PINNED_ALGORITHM = "RSA";

        private static readonly string PINNED_PUBLIC_KEY = "3082010A0282010100B0E75B7CBE56D31658EF79B3A1" +
            "294D506A88DFCDD603F6EF15E7F5BCBDF32291EC50B2B82BA158E905FE6A83EE044A48258B07FAC3D6356AF09B2" +
            "3EDAB15D00507B70DB08DB9A20C7D1201417B3071A346D663A241061C151B6EC5B5B4ECCCDCDBEA24F051962809" +
            "FEC499BF2D093C06E3BDA7D0BB83CDC1C2C6660B8ECB2EA30A685ADE2DC83C88314010FFC7F4F0F895EDDBE5C02" +
            "ABF78E50B708E0A0EB984A9AA536BCE61A0C31DB95425C6FEE5A564B158EE7C4F0693C439AE010EF83CA8155750" +
            "09B17537C29F86071E5DD8CA50EBD8A409494F479B07574D83EDCE6F68A8F7D40447471D05BC3F5EAD7862FA748" +
            "EA3C92A60A128344B1CEF7A0B0D94E50203010001";


        public static void Main(string[] args)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://azure.microsoft.com");
            request.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) =>
            {
                if (certificate == null || sslPolicyErrors != SslPolicyErrors.None)
                {
                    // Error getting certificate or the certificate failed basic validation
                    return false;
                }

                var targetKeyAlgorithm = new Oid(certificate.GetKeyAlgorithm()).FriendlyName;
                var targetPublicKey = certificate.GetPublicKeyString();
                
                if (targetKeyAlgorithm == PINNED_ALGORITHM &&
                    targetPublicKey == PINNED_PUBLIC_KEY)
                {
                    // Success, the certificate matches the pinned value.
                    return true;
                }
                // Reject, either the key or the algorithm does not match the expected value.
                return false;
            };

            try
            {
                var response = (HttpWebResponse)request.GetResponse();
                Console.WriteLine($"Success, HTTP status code: {response.StatusCode}");
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Failure, {ex.Message}");
            }
            Console.WriteLine("Press any key to end.");
            Console.ReadKey();
        }
    }
}
```

## <a id="https-transport"></a>Enable HTTPS - Secure Transport channel

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_transport_security_enabled) |
| **Steps** | The application configuration should ensure that HTTPS is used for all access to sensitive information.<ul><li>**EXPLANATION:** If an application handles sensitive information and does not use message-level encryption, then it should only be allowed to communicate over an encrypted transport channel.</li><li>**RECOMMENDATIONS:** Ensure that HTTP transport is disabled and enable HTTPS transport instead. For example, replace the `<httpTransport/>` with `<httpsTransport/>` tag. Do not rely on a network configuration (firewall) to guarantee that the application can only be accessed over a secure channel. From a philosophical point of view, the application should not depend on the network for its security.</li></ul><p>From a practical point of view, the people responsible for securing the network do not always track the security requirements of the application as they evolve.</p>|

## <a id="message-protection"></a>WCF: Set Message security Protection level to EncryptAndSign

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff650862(v=pandp.10)) |
| **Steps** | <ul><li>**EXPLANATION:** When Protection level is set to "none" it will disable message protection. Confidentiality and integrity is achieved with appropriate level of setting.</li><li>**RECOMMENDATIONS:**<ul><li>when `Mode=None` - Disables message protection</li><li>when `Mode=Sign` - Signs but does not encrypt the message; should be used when data integrity is important</li><li>when `Mode=EncryptAndSign` - Signs and encrypts the message</li></ul></li></ul><p>Consider turning off encryption and only signing your message when you just need to validate the integrity of the information without concerns of confidentiality. This may be useful for operations or service contracts in which you need to validate the original sender but no sensitive data is transmitted. When reducing the protection level, be careful that the message does not contain any personal data.</p>|

### Example
Configuring the service and the operation to only sign the message is shown in the following examples. Service Contract Example of `ProtectionLevel.Sign`: The following is an example of using ProtectionLevel.Sign at the Service Contract level: 
```
[ServiceContract(Protection Level=ProtectionLevel.Sign] 
public interface IService 
  { 
  string GetData(int value); 
  } 
```

### Example
Operation Contract Example of `ProtectionLevel.Sign` (for Granular Control): The following is an example of using `ProtectionLevel.Sign` at the OperationContract level:

```
[OperationContract(ProtectionLevel=ProtectionLevel.Sign] 
string GetData(int value);
``` 

## <a id="least-account-wcf"></a>WCF: Use a least-privileged account to run your WCF service

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648826(v=pandp.10)) |
| **Steps** | <ul><li>**EXPLANATION:** Do not run WCF services under admin or high privilege account. in case of services compromise it will result in high impact.</li><li>**RECOMMENDATIONS:** Use a least-privileged account to host your WCF service because it will reduce your application's attack surface and reduce the potential damage if you are attacked. If the service account requires additional access rights on infrastructure resources such as MSMQ, the event log, performance counters, and the file system, appropriate permissions should be given to these resources so that the WCF service can run successfully.</li></ul><p>If your service needs to access specific resources on behalf of the original caller, use impersonation and delegation to flow the caller's identity for a downstream authorization check. In a development scenario, use the local network service account, which is a special built-in account that has reduced privileges. In a production scenario, create a least-privileged custom domain service account.</p>|

## <a id="webapi-https"></a>Force all traffic to Web APIs over HTTPS connection

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [Enforcing SSL in a Web API Controller](https://www.asp.net/web-api/overview/security/working-with-ssl-in-web-api) |
| **Steps** | If an application has both an HTTPS and an HTTP binding, clients can still use HTTP to access the site. To prevent this, use an action filter to ensure that requests to protected APIs are always over HTTPS.|

### Example 
The following code shows a Web API authentication filter that checks for TLS: 
```csharp
public class RequireHttpsAttribute : AuthorizationFilterAttribute
{
    public override void OnAuthorization(HttpActionContext actionContext)
    {
        if (actionContext.Request.RequestUri.Scheme != Uri.UriSchemeHttps)
        {
            actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden)
            {
                ReasonPhrase = "HTTPS Required"
            };
        }
        else
        {
            base.OnAuthorization(actionContext);
        }
    }
}
```
Add this filter to any Web API actions that require TLS: 
```csharp
public class ValuesController : ApiController
{
    [RequireHttps]
    public HttpResponseMessage Get() { ... }
}
```
 
## <a id="redis-ssl"></a>Ensure that communication to Azure Cache for Redis is over TLS

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Cache for Redis | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Azure Redis TLS support](../../azure-cache-for-redis/cache-faq.yml) |
| **Steps** | Redis server does not support TLS out of the box, but Azure Cache for Redis does. If you are connecting to Azure Cache for Redis and your client supports TLS, like StackExchange.Redis, then you should use TLS. By default non-TLS port is disabled for new Azure Cache for Redis instances. Ensure that the secure defaults are not changed unless there is a dependency on TLS support for redis clients. |

Please note that Redis is designed to be accessed by trusted clients inside trusted environments. This means that usually it is not a good idea to expose the Redis instance directly to the internet or, in general, to an environment where untrusted clients can directly access the Redis TCP port or UNIX socket. 

## <a id="device-field"></a>Secure Device to Field Gateway communication

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | For IP based devices, the communication protocol could typically be encapsulated in a SSL/TLS channel to protect data in transit. For other protocols that do not support SSL/TLS investigate if there are secure versions of the protocol that provide security at transport or message layer. |

## <a id="device-cloud"></a>Secure Device to Cloud Gateway communication using SSL/TLS

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Choose your Communication Protocol](../../iot-hub/iot-hub-devguide.md) |
| **Steps** | Secure HTTP/AMQP or MQTT protocols using SSL/TLS. |