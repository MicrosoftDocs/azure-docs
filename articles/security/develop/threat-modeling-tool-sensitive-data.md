---
title: Sensitive Data - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: mitigations for threats exposed in the Threat Modeling Tool 
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: security
ms.subservice: security-develop
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib

---

# Security Frame: Sensitive Data | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **Machine Trust Boundary** | <ul><li>[Ensure that binaries are obfuscated if they contain sensitive information](#binaries-info)</li><li>[Consider using Encrypted File System (EFS) is used to protect confidential user-specific data](#efs-user)</li><li>[Ensure that sensitive data stored by the application on the file system is encrypted](#filesystem)</li></ul> | 
| **Web Application** | <ul><li>[Ensure that sensitive content is not cached on the browser](#cache-browser)</li><li>[Encrypt sections of Web App's configuration files that contain sensitive data](#encrypt-data)</li><li>[Explicitly disable the autocomplete HTML attribute in sensitive forms and inputs](#autocomplete-input)</li><li>[Ensure that sensitive data displayed on the user screen is masked](#data-mask)</li></ul> | 
| **Database** | <ul><li>[Implement dynamic data masking to limit sensitive data exposure non privileged users](#dynamic-users)</li><li>[Ensure that passwords are stored in salted hash format](#salted-hash)</li><li>[Ensure that sensitive data in database columns is encrypted](#db-encrypted)</li><li>[Ensure that database-level encryption (TDE) is enabled](#tde-enabled)</li><li>[Ensure that database backups are encrypted](#backup)</li></ul> | 
| **Web API** | <ul><li>[Ensure that sensitive data relevant to Web API is not stored in browser's storage](#api-browser)</li></ul> | 
| Azure Document DB | <ul><li>[Encrypt sensitive data stored in Azure Cosmos DB](#encrypt-docdb)</li></ul> | 
| **Azure IaaS VM Trust Boundary** | <ul><li>[Use Azure Disk Encryption to encrypt disks used by Virtual Machines](#disk-vm)</li></ul> | 
| **Service Fabric Trust Boundary** | <ul><li>[Encrypt secrets in Service Fabric applications](#fabric-apps)</li></ul> | 
| **Dynamics CRM** | <ul><li>[Perform security modeling and use Business Units/Teams where required](#modeling-teams)</li><li>[Minimize access to share feature on critical entities](#entities)</li><li>[Train users on the risks associated with the Dynamics CRM Share feature and good security practices](#good-practices)</li><li>[Include a development standards rule proscribing showing config details in exception management](#exception-mgmt)</li></ul> | 
| **Azure Storage** | <ul><li>[Use Azure Storage Service Encryption (SSE) for Data at Rest (Preview)](#sse-preview)</li><li>[Use Client-Side Encryption to store sensitive data in Azure Storage](#client-storage)</li></ul> | 
| **Mobile Client** | <ul><li>[Encrypt sensitive or PII data written to phones local storage](#pii-phones)</li><li>[Obfuscate generated binaries before distributing to end users](#binaries-end)</li></ul> | 
| **WCF** | <ul><li>[Set clientCredentialType to Certificate or Windows](#cert)</li><li>[WCF-Security Mode is not enabled](#security)</li></ul> | 

## <a id="binaries-info"></a>Ensure that binaries are obfuscated if they contain sensitive information

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that binaries are obfuscated if they contain sensitive information such as trade secrets, sensitive business logic that should not reversed. This is to stop reverse engineering of assemblies. Tools like `CryptoObfuscator` may be used for this purpose. |

## <a id="efs-user"></a>Consider using Encrypted File System (EFS) is used to protect confidential user-specific data

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Consider using Encrypted File System (EFS) is used to protect confidential user-specific data from adversaries with physical access to the computer. |

## <a id="filesystem"></a>Ensure that sensitive data stored by the application on the file system is encrypted

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that sensitive data stored by the application on the file system is encrypted (e.g., using DPAPI), if EFS cannot be enforced |

## <a id="cache-browser"></a>Ensure that sensitive content is not cached on the browser

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, Web Forms, MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Browsers can store information for purposes of caching and history. These cached files are stored in a folder, like the Temporary Internet Files folder in the case of Internet Explorer. When these pages are referred again, the browser displays them from its cache. If sensitive information is displayed to the user (such as their address, credit card details, Social Security Number, or username), then this information could be stored in browser's cache, and therefore retrievable through examining the browser's cache or by simply pressing the browser's "Back" button. Set cache-control response header value to "no-store" for all pages. |

### Example
```XML
<configuration>
  <system.webServer>
   <httpProtocol>
    <customHeaders>
        <add name="Cache-Control" value="no-cache" />
        <add name="Pragma" value="no-cache" />
        <add name="Expires" value="-1" />
    </customHeaders>
  </httpProtocol>
 </system.webServer>
</configuration>
```

### Example
This may be implemented through a filter. Following example may be used: 
```csharp
public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null || (filterContext.HttpContext != null && filterContext.HttpContext.Response != null && filterContext.HttpContext.Response.IsRequestBeingRedirected))
            {
                //// Since this is MVC pipeline, this should never be null.
                return;
            }

            var attributes = filterContext.ActionDescriptor.GetCustomAttributes(typeof(System.Web.Mvc.OutputCacheAttribute), false);
            if (attributes == null || **Attributes**.Count() == 0)
            {
                filterContext.HttpContext.Response.Cache.SetNoStore();
                filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                filterContext.HttpContext.Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                if (!filterContext.IsChildAction)
                {
                    filterContext.HttpContext.Response.AppendHeader("Pragma", "no-cache");
                }
            }

            base.OnActionExecuting(filterContext);
        }
``` 

## <a id="encrypt-data"></a>Encrypt sections of Web App's configuration files that contain sensitive data

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [How To: Encrypt Configuration Sections in ASP.NET 2.0 Using DPAPI](https://msdn.microsoft.com/library/ff647398.aspx), [Specifying a Protected Configuration Provider](https://msdn.microsoft.com/library/68ze1hb2.aspx), [Using Azure Key Vault to protect application secrets](https://azure.microsoft.com/documentation/articles/guidance-multitenant-identity-keyvault/) |
| **Steps** | Configuration files such as the Web.config, appsettings.json are often used to hold sensitive information, including user names, passwords, database connection strings, and encryption keys. If you do not protect this information, your application is vulnerable to attackers or malicious users obtaining sensitive information such as account user names and passwords, database names and server names. Based on the deployment type (azure/on-prem), encrypt the sensitive sections of config files using DPAPI or services like Azure Key Vault. |

## <a id="autocomplete-input"></a>Explicitly disable the autocomplete HTML attribute in sensitive forms and inputs

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [MSDN: autocomplete attribute](https://msdn.microsoft.com/library/ms533486(VS.85).aspx), [Using AutoComplete in HTML](https://msdn.microsoft.com/library/ms533032.aspx), [HTML Sanitization Vulnerability](https://technet.microsoft.com/security/bulletin/MS10-071), [Autocomplete.,again?!](https://blog.mindedsecurity.com/2011/10/autocompleteagain.html) |
| **Steps** | The autocomplete attribute specifies whether a form should have autocomplete on or off. When autocomplete is on, the browser automatically complete values based on values that the user has entered before. For example, when a new name and password is entered in a form and the form is submitted, the browser asks if the password should be saved.Thereafter when the form is displayed, the name and password are filled in automatically or are completed as the name is entered. An attacker with local access could obtain the clear text password from the browser cache. By default autocomplete is enabled, and it must explicitly be disabled. |

### Example
```csharp
<form action="Login.aspx" method="post " autocomplete="off" >
      Social Security Number: <input type="text" name="ssn" />
      <input type="submit" value="Submit" />    
</form>
```

## <a id="data-mask"></a>Ensure that sensitive data displayed on the user screen is masked

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Sensitive data such as passwords, credit card numbers, SSN etc. should be masked when displayed on the screen. This is to prevent unauthorized personnel from accessing the data (e.g., shoulder-surfing passwords, support personnel viewing SSN numbers of users) . Ensure that these data elements are not visible in plain text and are appropriately masked. This has to be taken care while accepting them as input (e.g,. input type="password") as well as displaying back on the screen (e.g., display only the last 4 digits of the credit card number). |

## <a id="dynamic-users"></a>Implement dynamic data masking to limit sensitive data exposure non privileged users

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Sql Azure, OnPrem |
| **Attributes**              | SQL Version - V12, SQL Version - MsSQL2016 |
| **References**              | [Dynamic Data Masking](https://msdn.microsoft.com/library/mt130841) |
| **Steps** | The purpose of dynamic data masking is to limit exposure of sensitive data, preventing users who should not have access to the data from viewing it. Dynamic data masking does not aim to prevent database users from connecting directly to the database and running exhaustive queries that expose pieces of the sensitive data. Dynamic data masking is complementary to other SQL Server security features (auditing, encryption, row level security…) and it is highly recommended to use this feature in conjunction with them in addition in order to better protect the sensitive data in the database. Please note that this feature is supported only by SQL Server starting with 2016 and Azure SQL Database. |

## <a id="salted-hash"></a>Ensure that passwords are stored in salted hash format

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Password Hashing using .NET Crypto APIs](https://docs.asp.net/en/latest/security/data-protection/consumer-apis/password-hashing.html) |
| **Steps** | Passwords should not be stored in custom user store databases. Password hashes should be stored with salt values instead. Make sure the salt for the user is always unique and you apply b-crypt, s-crypt or PBKDF2 before storing the password, with a minimum work factor iteration count of 150,000 loops to eliminate the possibility of brute forcing.| 

## <a id="db-encrypted"></a>Ensure that sensitive data in database columns is encrypted

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | SQL Version - All |
| **References**              | [Encrypting sensitive data in SQL server](https://technet.microsoft.com/library/ff848751(v=sql.105).aspx), [How to: Encrypt a Column of Data in SQL Server](https://msdn.microsoft.com/library/ms179331), [Encrypt by Certificate](https://msdn.microsoft.com/library/ms188061) |
| **Steps** | Sensitive data such as credit card numbers has to be encrypted in the database. Data can be encrypted using column-level encryption or by an application function using the encryption functions. |

## <a id="tde-enabled"></a>Ensure that database-level encryption (TDE) is enabled

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Understanding SQL Server Transparent Data Encryption (TDE)](https://technet.microsoft.com/library/bb934049(v=sql.105).aspx) |
| **Steps** | Transparent Data Encryption (TDE) feature in SQL server helps in encrypting sensitive data in a database and protect the keys that are used to encrypt the data with a certificate. This prevents anyone without the keys from using the data. TDE protects data "at rest", meaning the data and log files. It provides the ability to comply with many laws, regulations, and guidelines established in various industries. |

## <a id="backup"></a>Ensure that database backups are encrypted

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | SQL Azure, OnPrem |
| **Attributes**              | SQL Version - V12, SQL Version - MsSQL2014 |
| **References**              | [SQL database backup encryption](https://msdn.microsoft.com/library/dn449489) |
| **Steps** | SQL Server has the ability to encrypt the data while creating a backup. By specifying the encryption algorithm and the encryptor (a Certificate or Asymmetric Key) when creating a backup, one can create an encrypted backup file. |

## <a id="api-browser"></a>Ensure that sensitive data relevant to Web API is not stored in browser's storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC 5, MVC 6 |
| **Attributes**              | Identity Provider - ADFS, Identity Provider - Azure AD |
| **References**              | N/A  |
| **Steps** | <p>In certain implementations, sensitive artifacts relevant to Web API's authentication are stored in browser's local storage. E.g., Azure AD authentication artifacts like adal.idtoken, adal.nonce.idtoken, adal.access.token.key, adal.token.keys, adal.state.login, adal.session.state, adal.expiration.key etc.</p><p>All these artifacts are available even after sign out or browser is closed. If an adversary gets access to these artifacts, he/she can reuse them to access the protected resources (APIs). Ensure that all sensitive artifacts related to Web API is not stored in browser's storage. In cases where client-side storage is unavoidable (e.g., Single Page Applications (SPA) that leverage Implicit OpenIdConnect/OAuth flows need to store access tokens locally), use storage choices with do not have persistence. e.g., prefer SessionStorage to LocalStorage.</p>| 

### Example
The below JavaScript snippet is from a custom authentication library which stores authentication artifacts in local storage. Such implementations should be avoided. 
```javascript
ns.AuthHelper.Authenticate = function () {
window.config = {
instance: 'https://login.microsoftonline.com/',
tenant: ns.Configurations.Tenant,
clientId: ns.Configurations.AADApplicationClientID,
postLogoutRedirectUri: window.location.origin,
cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
};
```

## <a id="encrypt-docdb"></a>Encrypt sensitive data stored in Cosmos DB

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Document DB | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Encrypt sensitive data at application level before storing in document DB or store any sensitive data in other storage solutions like Azure Storage or Azure SQL| 

## <a id="disk-vm"></a>Use Azure Disk Encryption to encrypt disks used by Virtual Machines

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure IaaS VM Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Using Azure Disk Encryption to encrypt disks used by your virtual machines](https://azure.microsoft.com/documentation/articles/storage-security-guide/#_using-azure-disk-encryption-to-encrypt-disks-used-by-your-virtual-machines) |
| **Steps** | <p>Azure Disk Encryption is a new feature that is currently in preview. This feature allows you to encrypt the OS disks and Data disks used by an IaaS Virtual Machine. For Windows, the drives are encrypted using industry-standard BitLocker encryption technology. For Linux, the disks are encrypted using the DM-Crypt technology. This is integrated with Azure Key Vault to allow you to control and manage the disk encryption keys. The Azure Disk Encryption solution supports the following three customer encryption scenarios:</p><ul><li>Enable encryption on new IaaS VMs created from customer-encrypted VHD files and customer-provided encryption keys, which are stored in Azure Key Vault.</li><li>Enable encryption on new IaaS VMs created from the Azure Marketplace.</li><li>Enable encryption on existing IaaS VMs already running in Azure.</li></ul>| 

## <a id="fabric-apps"></a>Encrypt secrets in Service Fabric applications

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure |
| **References**              | [Managing secrets in Service Fabric applications](https://azure.microsoft.com/documentation/articles/service-fabric-application-secret-management/) |
| **Steps** | Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. Use Azure Key Vault to manage keys and secrets in service fabric applications. |

## <a id="modeling-teams"></a>Perform security modeling and use Business Units/Teams where required

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Perform security modeling and use Business Units/Teams where required |

## <a id="entities"></a>Minimize access to share feature on critical entities

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Minimize access to share feature on critical entities |

## <a id="good-practices"></a>Train users on the risks associated with the Dynamics CRM Share feature and good security practices

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Train users on the risks associated with the Dynamics CRM Share feature and good security practices |

## <a id="exception-mgmt"></a>Include a development standards rule proscribing showing config details in exception management

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Include a development standards rule proscribing showing config details in exception management outside development. Test for this as part of code reviews or periodic inspection.|

## <a id="sse-preview"></a>Use Azure Storage Service Encryption (SSE) for Data at Rest (Preview)

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | StorageType - Blob |
| **References**              | [Azure Storage Service Encryption for Data at Rest (Preview)](https://azure.microsoft.com/documentation/articles/storage-service-encryption/) |
| **Steps** | <p>Azure Storage Service Encryption (SSE) for Data at Rest helps you protect and safeguard your data to meet your organizational security and compliance commitments. With this feature, Azure Storage automatically encrypts your data prior to persisting to storage and decrypts prior to retrieval. The encryption, decryption and key management is totally transparent to users. SSE applies only to block blobs, page blobs, and append blobs. The other types of data, including tables, queues, and files, will not be encrypted.</p><p>Encryption and Decryption Workflow:</p><ul><li>The customer enables encryption on the storage account</li><li>When the customer writes new data (PUT Blob, PUT Block, PUT Page, etc.) to Blob storage; every write is encrypted using 256-bit AES encryption, one of the strongest block ciphers available</li><li>When the customer needs to access data (GET Blob, etc.), data is automatically decrypted before returning to the user</li><li>If encryption is disabled, new writes are no longer encrypted and existing encrypted data remains encrypted until rewritten by the user. While encryption is enabled, writes to Blob storage will be encrypted. The state of data does not change with the user toggling between enabling/disabling encryption for the storage account</li><li>All encryption keys are stored, encrypted, and managed by Microsoft</li></ul><p>Please note that at this time, the keys used for the encryption are managed by Microsoft. Microsoft generates the keys originally, and manage the secure storage of the keys as well as the regular rotation as defined by internal Microsoft policy. In the future, customers will get the ability to manage their own >encryption keys, and provide a migration path from Microsoft-managed keys to customer-managed keys.</p>| 

## <a id="client-storage"></a>Use Client-Side Encryption to store sensitive data in Azure Storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](https://azure.microsoft.com/documentation/articles/storage-client-side-encryption/), [Tutorial: Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](https://azure.microsoft.com/documentation/articles/storage-encrypt-decrypt-blobs-key-vault/), [Storing Data Securely in Azure Blob Storage with Azure Encryption Extensions](https://blogs.msdn.microsoft.com/partnercatalystteam/2015/06/17/storing-data-securely-in-azure-blob-storage-with-azure-encryption-extensions/) |
| **Steps** | <p>The Azure Storage Client Library for .NET Nuget package supports encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The library also supports integration with Azure Key Vault for storage account key management. Here is a brief description of how client side encryption works:</p><ul><li>The Azure Storage client SDK generates a content encryption key (CEK), which is a one-time-use symmetric key</li><li>Customer data is encrypted using this CEK</li><li>The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in Azure Key Vault. The Storage client itself never has access to the KEK. It just invokes the key wrapping algorithm that is provided by Key Vault. Customers can choose to use custom providers for key wrapping/unwrapping if they want</li><li>The encrypted data is then uploaded to the Azure Storage service. Check the links in the references section for low-level implementation details.</li></ul>|

## <a id="pii-phones"></a>Encrypt sensitive or PII data written to phones local storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Mobile Client | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, Xamarin  |
| **Attributes**              | N/A  |
| **References**              | [Manage settings and features on your devices with Microsoft Intune policies](https://docs.microsoft.com/mem/intune/configuration/), [Keychain Valet](https://components.xamarin.com/view/square.valet) |
| **Steps** | <p>If the application writes sensitive information like user's PII (email, phone number, first name, last name, preferences etc.)- on mobile's file system, then it should be encrypted before writing to the local file system. If the application is an enterprise application, then explore the possibility of publishing application using Windows Intune.</p>|

### Example
Intune can be configured with following security policies to safeguard sensitive data: 
```csharp
Require encryption on mobile device    
Require encryption on storage cards
Allow screen capture
```

### Example
If the application is not an enterprise application, then use platform provided keystore, keychains to store encryption keys, using which cryptographic operation may be performed on the file system. Following code snippet shows how to access key from keychain using xamarin: 
```csharp
        protected static string EncryptionKey
        {
            get
            {
                if (String.IsNullOrEmpty(_Key))
                {
                    var query = new SecRecord(SecKind.GenericPassword);
                    query.Service = NSBundle.MainBundle.BundleIdentifier;
                    query.Account = "UniqueID";

                    NSData uniqueId = SecKeyChain.QueryAsData(query);
                    if (uniqueId == null)
                    {
                        query.ValueData = NSData.FromString(System.Guid.NewGuid().ToString());
                        var err = SecKeyChain.Add(query);
                        _Key = query.ValueData.ToString();
                    }
                    else
                    {
                        _Key = uniqueId.ToString();
                    }
                }

                return _Key;
            }
        }
```

## <a id="binaries-end"></a>Obfuscate generated binaries before distributing to end users

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Mobile Client | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Crypto Obfuscation For .Net](https://www.ssware.com/cryptoobfuscator/obfuscator-net.htm) |
| **Steps** | Generated binaries (assemblies within apk) should be obfuscated to stop reverse engineering of assemblies.Tools like `CryptoObfuscator` may be used for this purpose. |

## <a id="cert"></a>Set clientCredentialType to Certificate or Windows

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [Fortify](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_weak_token) |
| **Steps** | Using a UsernameToken with a plaintext password over an unencrypted channel exposes the password to attackers who can sniff the SOAP messages. Service Providers that use the UsernameToken might accept passwords sent in plaintext. Sending plaintext passwords over an unencrypted channel can expose the credential to attackers who can sniff the SOAP message. | 

### Example
The following WCF service provider configuration uses the UsernameToken: 
```
<security mode="Message"> 
<message clientCredentialType="UserName" />
``` 
Set clientCredentialType to Certificate or Windows. 

## <a id="security"></a>WCF-Security Mode is not enabled

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, .NET Framework 3 |
| **Attributes**              | Security Mode - Transport, Security Mode - Message |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_weak_class_reference), [Fundamentals of WCF Security CoDe Magazine](https://www.codemag.com/article/0611051) |
| **Steps** | No transport or message security has been defined. Applications that transmit messages without transport or message security cannot guarantee the integrity or confidentiality of the messages. When a WCF security binding is set to None, both transport and message security are disabled. |

### Example
The following configuration sets the security mode to None. 
```
<system.serviceModel> 
  <bindings> 
    <wsHttpBinding> 
      <binding name=""MyBinding""> 
        <security mode=""None""/> 
      </binding> 
  </bindings> 
</system.serviceModel> 
```

### Example
Security Mode Across all service bindings there are five possible security modes: 
* None. Turns security off. 
* Transport. Uses transport security for mutual authentication and message protection. 
* Message. Uses message security for mutual authentication and message protection. 
* Both. Allows you to supply settings for transport and message-level security (only MSMQ supports this). 
* TransportWithMessageCredential. Credentials are passed with the message and message protection and server authentication are provided by the transport layer. 
* TransportCredentialOnly. Client credentials are passed with the transport layer and no message protection is applied. Use transport and message security to protect the integrity and confidentiality of messages. The configuration below tells the service to use transport security with message credentials.
  ```
  <system.serviceModel>
  <bindings>
    <wsHttpBinding>
    <binding name=""MyBinding""> 
    <security mode=""TransportWithMessageCredential""/> 
    <message clientCredentialType=""Windows""/> 
    </binding> 
  </bindings> 
  </system.serviceModel> 
  ```
