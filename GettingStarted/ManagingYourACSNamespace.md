# Managing Your ACS Namespace #

This topic outlines management tasks that it is recommended you perform regularly so that your applications that use the Windows Azure Acccess Control Service (ACS) continue to function properly and without interruptions. These management tasks are as follows:


1. Important: track expiry and carry out rollover for certificates, keys and passwords used by the ACS namespace, relying party applications, service identities, identity providers, and the ACS Management Service account. See Certificates and Key Management Guidelines below for more information.

2. Review your identity providers, service identities, rules, and portal administrators and remove the outdated ones. 

For more information about ACS, see [Access Control Service 2.0](http://msdn.microsoft.com/en-us/library/gg429786.aspx).



## Certificates and Keys Management Guidelines ##

For security reasons, certificates and keys that are used in ACS are guaranteed to expire. It is important to keep track of the expiration dates so these certificates and keys can be renewed.
 


It is good practice to upload a new certificate well in advance of the expiration of the current certificate. The high-level steps that should be involved are as follows:

- Upload a new secondary certificate. 
- Notify the partners that use the service of the upcoming change. Partners should update their certificate configuration for their relying parties (for example, a thumbprint of the certificate configured in web.config under trustedIssuers node in an ASP.NET web application) 
- Switch signing over to the new certificate (mark it primary) while leaving the previous one in place for a reasonable grace period. 
- After the grace period ends, remove the old certificate.  


Note: this procedure is similar but different for public keys versus private keys. Private keys (that are used for token signing and decryption) support a primary/secondary field that must be toggled. ACS can only sign with one key at a time. Public keys (such as identity provider and system identities keys) do not have primary/secondary fields. In the case of signing, public keys are used for signature validation and ACS will check all configured public keys for the given entity until one matches. 

When a certificate or a key expires, ACS will fail issuing tokens preventing your relying party from operating normally. Expired certificates and keys will be ignored by ACS, effectively causing exceptions as if no certificate or key was configured in first place. In the following sections you will find information for each certificate and key managed by ACS, how to renew it and how to recognize if it is expired and needs to be renewed. 

- Use the Certificates and Keys section in the ACS Management Portal to manage certificates and keys related to service namespace and relying party applications. For more information about these credential types, see [Certificates and Keys](http://msdn.microsoft.com/en-us/library/gg185932.aspx).
- Use the Service identities section in the ACS Management Portal to manage credentials (certificates, keys or passwords) related to service identities. For more information about service identities, see [Service Identities](http://msdn.microsoft.com/en-us/library/gg185945.aspx).
- Use the Management Service section in the ACS Management Portal to manage credentials (certificates, keys or passwords) related to the ACS Management Service accounts. For more information about the ACS Management Service, see [ACS Management Service](http://msdn.microsoft.com/en-us/library/gg185972.aspx).

There are some certificate and key types that are not visible in the ACS management portal. Specifically for WS-Federation identity providers such as AD FS, you must proactively check the validity of the certificates that the identity providers use. Currently, certificates available through WS-Federation identity providers’ metadata are not visible on the ACS management portal. To verify the validity of the certificates you must use the management service to inspect the Effective and Expiration dates for the [IdentityProviderKey](http://msdn.microsoft.com/en-us/library/hh124084.aspx)’s StartDate and EndDate properties. When the certificate or a key expires, and therefore becomes invalid, ACS will start throwing exceptions [ACS Error Codes](http://msdn.microsoft.com/en-us/library/gg185949.aspx) specific to the certificate or key. Consult the sections below for specific error codes.

You can update the certificates and keys programmatically using [ACS Management Service](http://msdn.microsoft.com/en-us/library/gg185972.aspx). Consider reviewing KeyManagement code sample available for download as part of the [Code Sample: Management Service](http://msdn.microsoft.com/en-us/library/gg185970.aspx).

## Available certificates and keys ##

The following list displays the available certificates and keys that are used in ACS and must be tracked for expiration dates:

- Token signing certificates
- Token signing keys
- Token encryption certificates
- Token decryption certificates
- Service identity credentials
- ACS Management Service account credentials
- Identity provider signing and encryption certificates

The rest of this topic covers each certificate and key in detail.

## Token signing certificates ##

ACS signs all security tokens it issues. X.509 certificates are used for signing when you build an application that consumes SAML tokens issued by ACS. You can manage token signing certificates via the Certificates and Key section of the ACS Management Portal. For more information, see [Certificates and Keys](http://msdn.microsoft.com/en-us/library/gg185932.aspx).

When signing certificates expire you will receive the following errors when trying to request a token:

<table><tr><td><b>Error Code</b></td>
<td><b>Message</b></td>
<td><b>Action required to fix the message</b></td>
</tr>
<tr>
<td>ACS50004</td>
<td>No primary X.509 signing certificate is configured. A signing certificate is required for SAML.</td>
<td>If the chosen relying party uses SAML as its token type, ensure that a valid X.509 certificate is configured for the relying party or the service namespace. The certificate must be set to primary and must be within its validity period.</td></tr>
</table> 

## Token signing key ##

ACS signs all security tokens it issues. 256-bit symmetric signing keys are used when you build an application that consumes SWT tokens issued by ACS. You can manage token signing keys via the Certificates and Key section of the ACS Management Portal. For more information, see [Certificates and Keys](http://msdn.microsoft.com/en-us/library/gg185932.aspx).

When signing keys expire you will receive the following errors when trying to request a token:

<table><tr><td><b>Error Code</b></td>
<td><b>Message</b></td>
<td><b>Action required to fix the message</b></td>
</tr>
<tr>
<td>ACS50003</td>
<td>No primary symmetric signing key is configured. A symmetric signing key is required for SWT.</td>
<td>If the chosen relying party uses SWT as its token type, ensure that a symmetric key is configured for the relying party or the service namespace, and that the key is set to primary and within its validity period.</td></tr>
</table> 

## Token encryption certificates ##

Token encryption is required if a relying party application is a web service using proof-of-possession tokens over the WS-Trust protocol, in other cases token encryption is optional.  You can manage token encryption certificates via the Certificates and Key section of the ACS Management Portal. For more information, see [Certificates and Keys](http://msdn.microsoft.com/en-us/library/gg185932.aspx).

When encryption certificates expire you will receive the following errors when trying to request a token:

<table><tr><td><b>Error Code</b></td>
<td><b>Message</b></td>
<td><b>Action required to fix the message</b></td>
</tr>
<tr>
<td>ACS50005</td>
<td>Token encryption is required but no encrypting certificate is configured for the relying party.</td>
<td>Either disable token encryption for the chosen relying party or upload an X.509 certificate to be used for token encryption.</td></tr>
</table> 

## Token decryption certificates ##

ACS can accept encrypted tokens from WS-Federation identity providers (for example, AD FS 2.0). An X.509 certificate hosted in ACS is used for decryption. You can manage token decryption certificates via the Certificates and Key section of the ACS Management Portal. For more information, see [Certificates and Keys](http://msdn.microsoft.com/en-us/library/gg185932.aspx).

When decryption certificates expire you will receive the following errors when trying to request a token:

<table><tr><td><b>Error Code</b></td>
<td><b>Message</b></td>
</tr>
<tr>
<td>ACS10001</td>
<td>An error occurred while processing the SOAP header.</td>
</tr>
<tr><td>ACS20001</td>
<td>An error occurred while processing a WS-Federation sign-in response.</td></tr>
</table> 

## Service identity credentials ##

Service identities are credentials that are configured globally for the ACS namespace that allow applications or clients to authenticate directly with ACS and receive a token. There are three credential types that an ACS service identity can be associated with Symmetric key, Password, and X.509 certificate. You can manage service identity credentials via the Service identities page of the ACS Management Portal. For more information, see [Service Identities](http://msdn.microsoft.com/en-us/library/gg185945.aspx).

Following are the exception that ACS will throw if the credentials are expired:

<table><tr><td><b>Credential></b></td><td><b>Error Code</b></td>
<td><b>Message</b></td><td><b>Action required to fix the message</b></td>
</tr>
<tr>
<td>Symmetric key, Password</td>
<td>ACS50006</td>
<td>Signature verification failed. (There may be more details in the message.)</td>
<td></td>
</tr>
<tr><td>X.509 Certificate</td>
<td>ACS50016</td>
<td>X509Certificate with subject '<Certificate subject name>' and thumbprint '<Certificate thumbprint>' does not match any configured certificate.</td>
<td>Ensure that the requested certificate has been uploaded to ACS.</td>
</tr>
</table> 

To verify and update expiration dates of symmetric keys or password, or to upload new certificate as service identity credentials follow instructions outlined in [How To: Add Service Identities with an X.509 Certificate, Password, or Symmetric Key](http://msdn.microsoft.com/en-us/library/gg185924.aspx). List of service identity credentials available in the Edit Service Identity page.

## Management Service Credentials ##

The ACS Management Service is a key component of ACS that allows you to programmatically manage and configure settings in an ACS namespace. There are three credential types that the ACS Management service account can be associated with. These are symmetric key, password, and an X.509 certificate. You can manage the management service credentials via the Management service page of the ACS Management Portal. For more information, see [ACS Management Service](http://msdn.microsoft.com/en-us/library/gg185972.aspx).

ACS will throw out the following exceptions if these credentials are expired:

<table><tr><td><b>Credential></b></td><td><b>Error Code</b></td>
<td><b>Message</b></td><td><b>Action required to fix the message</b></td>
</tr>
<tr>
<td>Symmetric key, Password</td>
<td>ACS50006</td>
<td>Signature verification failed. (There may be more details in the message.)</td>
<td></td>
</tr>
<tr><td>X.509 Certificate</td>
<td>ACS50016</td>
<td>X509Certificate with subject '<Certificate subject name>' and thumbprint '<Certificate thumbprint>' does not match any configured certificate.</td>
<td>Ensure that the requested certificate has been uploaded to ACS.</td>
</tr>
</table> 

The List of the ACS Management Service account credentials is available on the Edit Management Service Account page in the ACS Management Portal.

## WS-Federation identity provider certificate ##

WS-Federation identity provider certificate is available through its metadata. When configuring WS-Federation identity provider, such as AD FS, the WS-Federation signing certificate is configured through WS-Federation metadata available via URL or as a file, read [WS-Federation Identity Providers](http://msdn.microsoft.com/en-us/library/gg185933.aspx) and [How To: Configure AD FS 2.0 as an Identity Provider](http://msdn.microsoft.com/en-us/library/gg185961.aspx) for more information. After the WS-Federation identity provider configured in ACS use ACS management service to query it for its certificates validness. Note that for each consecutive upload of the metadata via the ACS Management Portal or the ACS Management Service, the keys will be replaced. 


Following are the exceptions that ACS will throw if the certificate is expired:

<table><tr><td><b>Error Code</b></td>
<td><b>Message</b></td>
</tr>
<tr>
<td>ACS10001</td>
<td>An error occurred while processing the SOAP header.</td>
</tr>
<tr><td>ACS20001</td>
<td>An error occurred while processing a WS-Federation sign-in response.</td></tr>
<tr><td>ACS50006</td><td>Signature verification failed. (There may be more details in the message.)</td></tr>
</table> 

