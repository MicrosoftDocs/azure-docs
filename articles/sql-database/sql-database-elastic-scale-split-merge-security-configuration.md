<properties 
    pageTitle="Split-merge security configuration | Microsoft Azure" 
    description="Set up x409 certificates for encryption" 
    metaKeywords="Elastic Database certificates security" 
    services="sql-database" 
    documentationCenter="" 
    manager="jhubbard" 
    authors="torsteng"/>

<tags 
    ms.service="sql-database" 
    ms.workload="sql-database" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="05/27/2016" 
    ms.author="torsteng" />


# Split-merge security configuration  

To use the Split/Merge service, you must correctly configure security. The service is part of the Elastic Scale feature of Microsoft Azure SQL Database. For more information, see [Elastic Scale Split and Merge Service Tutorial](sql-database-elastic-scale-configure-deploy-split-and-merge.md).

## Configuring certificates

Certificates are configured in two ways. 

1. [To Configure the SSL Certificate](#To-Configure-the-SSL#Certificate)
2. [To Configure Client Certificates](#To-Configure-Client-Certificates) 

## To obtain certificates

Certificates can be obtained from public Certificate Authorities (CAs) or from the [Windows Certificate Service](http://msdn.microsoft.com/library/windows/desktop/aa376539.aspx). These are the preferred methods to obtain certificates.

If those options are not available, you can generate **self-signed certificates**.
 
## Tools to generate certificates

* [makecert.exe](http://msdn.microsoft.com/library/bfsktky3.aspx)
* [pvk2pfx.exe](http://msdn.microsoft.com/library/windows/hardware/ff550672.aspx)

### To run the tools

* From a Developer Command Prompt for Visual Studios, see [Visual Studio Command Prompt](http://msdn.microsoft.com/library/ms229859.aspx) 

    If installed, go to:

        %ProgramFiles(x86)%\Windows Kits\x.y\bin\x86 

* Get the WDK from [Windows 8.1: Download kits and tools](http://msdn.microsoft.com/windows/hardware/gg454513#drivers)

## To configure the SSL certificate
A SSL certificate is required to encrypt the communication and authenticate the server. Choose the most applicable of the three scenarios below, and execute all its steps:

### Create a new self-signed certificate

1.    [Create a Self-Signed Certificate](#Create-a-Self-Signed-Certificate)
2.    [Create PFX file for Self-Signed SSL Certificate](#Create-PFX-file-for-Self-Signed-SSL-Certificate)
3.    [Upload SSL Certificate to Cloud Service](#Upload-SSL-Certificate-to-Cloud-Service)
4.    [Update SSL Certificate in Service Configuration File](#Update-SSL-Certificate-in-Service-Configuration-File)
5.    [Import SSL Certification Authority](#Import-SSL-Certification-Authority)

### To use an existing certificate from the certificate store
1. [Export SSL Certificate From Certificate Store](#Export-SSL-Certificate-From-Certificate-Store)
2. [Upload SSL Certificate to Cloud Service](#Upload-SSL-Certificate-to-Cloud-Service)
3. [Update SSL Certificate in Service Configuration File](#Update-SSL-Certificate-in-Service-Configuration-File)

### To use an existing certificate in a PFX file

1. [Upload SSL Certificate to Cloud Service](#Upload-SSL-Certificate-to-Cloud-Service)
2. [Update SSL Certificate in Service Configuration File](#Update-SSL-Certificate-in-Service-Configuration-File)

## To configure client certificates
Client certificates are required in order to authenticate requests to the service. Choose the most applicable of the three scenarios below, and execute all its steps:

### Turn off client certificates
1.    [Turn Off Client Certificate-Based Authentication](#Turn-Off-Client-Certificate-Based-Authentication)

### Issue new self-signed client certificates
1.    [Create a Self-Signed Certification Authority](#Create-a-Self-Signed-Certification-Authority)
2.    [Upload CA Certificate to Cloud Service](#Upload-CA-Certificate-to-Cloud-Service)
3.    [Update CA Certificate in Service Configuration File](#Update-CA-Certificate-in-Service-Configuration-File)
4.    [Issue Client Certificates](#Issue-Client-Certificates)
5.    [Create PFX files for Client Certificates](#Create-PFX-files-for-Client-Certificates)
6.    [Import Client Certificate](#Import-Client-Certificate)
7.    [Copy Client Certificate Thumbprints](#Copy-Client-Certificate-Thumbprints)
8.    [Configure Allowed Clients in the Service Configuration File](#Configure-Allowed-Clients-in-the-Service-Configuration-File)

### Use existing client certificates
1.    [Find CA Public Key](#Find-CA-Public Key)
2.    [Upload CA Certificate to Cloud Service](#Upload-CA-certificate-to-cloud-service)
3.    [Update CA Certificate in Service Configuration File](#Update-CA-Certificate-in-Service-Configuration-File)
4.    [Copy Client Certificate Thumbprints](#Copy-Client-Certificate-Thumbprints)
5.    [Configure Allowed Clients in the Service Configuration File](#Configure-Allowed-Clients-in-the-Service-Configuration File)
6.    [Configure Client Certificate Revocation Check](#Configure-Client-Certificate-Revocation-Check)

## Allowed IP addresses

Access to the service endpoints can be restricted to specific ranges of IP addresses.

## To configure encryption for the store

A certificate is required to encrypt the credentials that are stored in the metadata store. Choose the most applicable of the three scenarios below, and execute all its steps:

### Use a new self-signed certificate

1.     [Create a Self-Signed Certificate](#Create-a-Self-Signed-Certificate)
2.     [Create PFX file for Self-Signed Encryption Certificate](#Create-PFX-file-for-Self-Signed-Encryption-Certificate)
3.     [Upload Encryption Certificate to Cloud Service](#Upload-Encryption-Certificate-to-Cloud-Service)
4.     [Update Encryption Certificate in Service Configuration File](#Update-Encryption-Certificate-in-Service-Configuration-File)

### Use an existing certificate from the certificate store

1.     [Export Encryption Certificate From Certificate Store](#Export-Encryption-Certificate-From-Certificate-Store)
2.     [Upload Encryption Certificate to Cloud Service](#Upload-Encryption-Certificate-to-Cloud-Service)
3.     [Update Encryption Certificate in Service Configuration File](#Update-Encryption-Certificate-in-Service-Configuration-File)

### Use an existing certificate in a PFX file

1.     [Upload Encryption Certificate to Cloud Service](#Upload-Encryption-Certificate-to-Cloud-Service)
2.     [Update Encryption Certificate in Service Configuration File](#Update-Encryption-Certificate-in-Service-Configuration-File)

## The default configuration

The default configuration denies all access to the HTTP endpoint. This is the recommended setting, since the requests to these endpoints may carry sensitive information like database credentials.
The default configuration allows all access to the HTTPS endpoint. This setting may be restricted further.

### Changing the Configuration

The group of access control rules that apply to and endpoint are configured in the **<EndpointAcls>** section in the **service configuration file**.

    <EndpointAcls>
      <EndpointAcl role="SplitMergeWeb" endPoint="HttpIn" accessControl="DenyAll" />
      <EndpointAcl role="SplitMergeWeb" endPoint="HttpsIn" accessControl="AllowAll" />
    </EndpointAcls>

The rules in an access control group are configured in a <AccessControl name=""> section of the service configuration file. 

The format is explained in Network Access Control Lists documentation.
For example, to allow only IPs in the range 100.100.0.0 to 100.100.255.255 to access the HTTPS endpoint, the rules would look like this:

    <AccessControl name="Retricted">
      <Rule action="permit" description="Some" order="1" remoteSubnet="100.100.0.0/16"/>
      <Rule action="deny" description="None" order="2" remoteSubnet="0.0.0.0/0" />
    </AccessControl>
    <EndpointAcls>
    <EndpointAcl role="SplitMergeWeb" endPoint="HttpsIn" accessControl="Restricted" />

## Denial of service prevention

There are two different mechanisms supported to detect and prevent Denial of Service attacks:

*    Restrict number of concurrent requests per remote host (off by default)
*    Restrict rate of access per remote host (on by default)

These are based on the features further documented in Dynamic IP Security in IIS. When changing this configuration beware of the following factors:

* The behavior of proxies and Network Address Translation devices over the remote host information
* Each request to any resource in the web role is considered (e.g. loading scripts, images, etc)

## Restricting number of concurrent accesses

The settings that configure this behavior are:

    <Setting name="DynamicIpRestrictionDenyByConcurrentRequests" value="false" />
    <Setting name="DynamicIpRestrictionMaxConcurrentRequests" value="20" />

Change DynamicIpRestrictionDenyByConcurrentRequests to true to enable this protection.

## Restricting rate of access

The settings that configure this behavior are:

    <Setting name="DynamicIpRestrictionDenyByRequestRate" value="true" />
    <Setting name="DynamicIpRestrictionMaxRequests" value="100" />
    <Setting name="DynamicIpRestrictionRequestIntervalInMilliseconds" value="2000" />

## Configuring the response to a denied request

The following setting configures the response to a denied request:

    <Setting name="DynamicIpRestrictionDenyAction" value="AbortRequest" />
Refer to the documentation for Dynamic IP Security in IIS for other supported values.

## Operations for configuring service certificates
This topic is for reference only. Please follow the configuration steps outlined in:

* Configure the SSL certificate
* Configure client certificates

## Create a self-signed certificate
Execute:

    makecert ^
      -n "CN=myservice.cloudapp.net" ^
      -e MM/DD/YYYY ^
      -r -cy end -sky exchange -eku "1.3.6.1.5.5.7.3.1" ^
      -a sha1 -len 2048 ^
      -sv MySSL.pvk MySSL.cer

To customize:

*    -n with the service URL. Wildcards ("CN=*.cloudapp.net") and alternative names ("CN=myservice1.cloudapp.net, CN=myservice2.cloudapp.net") are supported.
*    -e with the certificate expiration date
Create a strong password and specify it when prompted.

## Create PFX file for self-signed SSL certificate

Execute:

        pvk2pfx -pvk MySSL.pvk -spc MySSL.cer

Enter password and then export certificate with these options:
* Yes, export the private key
* Export all extended properties

## Export SSL certificate from certificate store

* Find certificate
* Click Actions -> All tasks -> Export…
* Export certificate into a .PFX file with these options:
    * Yes, export the private key
    * Include all certificates in the certification path if possible
    *Export all extended properties

## Upload SSL certificate to cloud service

Upload certificate with the existing or generated .PFX file with the SSL key pair:

* Enter the password protecting the private key information

## Update SSL certificate in service configuration file

Update the thumbprint value of the following setting in the service configuration file with the thumbprint of the certificate uploaded to the cloud service:

    <Certificate name="SSL" thumbprint="" thumbprintAlgorithm="sha1" />

## Import SSL certification authority

Follow these steps in all account/machine that will communicate with the service:

* Double-click the .CER file in Windows Explorer
* In the Certificate dialog, click Install Certificate…
* Import certificate into the Trusted Root Certification Authorities store

## Turn off client certificate-based authentication

Only client certificate-based authentication is supported and disabling it will allow for public access to the service endpoints, unless other mechanisms are in place (e.g. Microsoft Azure Virtual Network).

Change these settings to false in the service configuration file to turn the feature off:

    <Setting name="SetupWebAppForClientCertificates" value="false" />
    <Setting name="SetupWebserverForClientCertificates" value="false" />

Then, copy the same thumbprint as the SSL certificate in the CA certificate setting:

    <Certificate name="CA" thumbprint="" thumbprintAlgorithm="sha1" />

## Create a self-signed certification authority
Execute the following steps to create a self-signed certificate to act as a Certification Authority:

    makecert ^
    -n "CN=MyCA" ^
    -e MM/DD/YYYY ^
     -r -cy authority -h 1 ^
     -a sha1 -len 2048 ^
      -sr localmachine -ss my ^
      MyCA.cer

To customize it

*    -e with the certification expiration date


## Find CA public key

All client certificates must have been issued by a Certification Authority trusted by the service. Find the public key to the Certification Authority that issued the client certificates that are going to be used for authentication in order to upload it to the cloud service.

If the file with the public key is not available, export it from the certificate store:

* Find certificate
    * Search for a client certificate issued by the same Certification Authority
* Double-click the certificate.
* Select the Certification Path tab in the Certificate dialog.
* Double-click the CA entry in the path.
* Take notes of the certificate properties.
* Close the **Certificate** dialog.
* Find certificate
    * Search for the CA noted above.
* Click Actions -> All tasks -> Export…
* Export certificate into a .CER with these options:
    * **No, do not export the private key**
    * Include all certificates in the certification path if possible.
    * Export all extended properties.

## Upload CA certificate to cloud service

Upload certificate with the existing or generated .CER file with the CA public key.

## Update CA certificate in service configuration file

Update the thumbprint value of the following setting in the service configuration file with the thumbprint of the certificate uploaded to the cloud service:

    <Certificate name="CA" thumbprint="" thumbprintAlgorithm="sha1" />

Update the value of the following setting with the same thumbprint:

    <Setting name="AdditionalTrustedRootCertificationAuthorities" value="" />

## Issue client certificates

Each individual authorized to access the service should have a client certificate issued for his/hers exclusive use and should choose his/hers own strong password to protect its private key. 

The following steps must be executed in the same machine where the self-signed CA certificate was generated and stored:

    makecert ^
      -n "CN=My ID" ^
      -e MM/DD/YYYY ^
      -cy end -sky exchange -eku "1.3.6.1.5.5.7.3.2" ^
      -a sha1 -len 2048 ^
      -in "MyCA" -ir localmachine -is my ^
      -sv MyID.pvk MyID.cer

Customizing:

* -n with an ID for to the client that will be authenticated with this certificate
* -e with the certificate expiration date
* MyID.pvk and MyID.cer with unique filenames for this client certificate

This command will prompt for a password to be created and then used once. Use a strong password.

## Create PFX files for client certificates

For each generated client certificate, execute:

    pvk2pfx -pvk MyID.pvk -spc MyID.cer

Customizing:

    MyID.pvk and MyID.cer with the filename for the client certificate

Enter password and then export certificate with these options:

* Yes, export the private key
* Export all extended properties
* The individual to whom this certificate is being issued should choose the export password

## Import client certificate

Each individual for whom a client certificate has been issued should import the key pair in the machines he/she will use to communicate with the service:

* Double-click the .PFX file in Windows Explorer
* Import certificate into the Personal store with at least this option:
    * Include all extended properties checked

## Copy client certificate thumbprints
Each individual for whom a client certificate has been issued must follow these steps in order to obtain the thumbprint of his/hers certificate which will be added to the service configuration file:
* Run certmgr.exe
* Select the Personal tab
* Double-click the client certificate to be used for authentication
* In the Certificate dialog that opens, select the Details tab
* Make sure Show is displaying All
* Select the field named Thumbprint in the list
* Copy the value of the thumbprint
** Delete non-visible Unicode characters in front of the first digit
** Delete all spaces

## Configure Allowed clients in the service configuration file

Update the value of the following setting in the service configuration file with a comma-separated list of the thumbprints of the client certificates allowed access to the service:

    <Setting name="AllowedClientCertificateThumbprints" value="" />

## Configure client certificate revocation check

The default setting does not check with the Certification Authority for client certificate revocation status. To turn on the checks, if the Certification Authority which issued the client certificates supports such checks, change the following setting with one of the values defined in the X509RevocationMode Enumeration:

    <Setting name="ClientCertificateRevocationCheck" value="NoCheck" />

## Create PFX file for self-signed encryption certificates

For an encryption certificate, execute:

    pvk2pfx -pvk MyID.pvk -spc MyID.cer

Customizing:

    MyID.pvk and MyID.cer with the filename for the encryption certificate

Enter password and then export certificate with these options:
*    Yes, export the private key
*    Export all extended properties
*    You will need the password when uploading the certificate to the cloud service.

## Export encryption certificate from certificate store

*    Find certificate
*    Click Actions -> All tasks -> Export…
*    Export certificate into a .PFX file with these options: 
  *    Yes, export the private key
  *    Include all certificates in the certification path if possible 
*    Export all extended properties

## Upload encryption certificate to cloud service

Upload certificate with the existing or generated .PFX file with the encryption key pair:

* Enter the password protecting the private key information

## Update encryption certificate in service configuration file

Update the thumbprint value of the following settings in the service configuration file with the thumbprint of the certificate uploaded to the cloud service:

    <Certificate name="DataEncryptionPrimary" thumbprint="" thumbprintAlgorithm="sha1" />

## Common certificate operations

* Configure the SSL certificate
* Configure client certificates

## Find certificate

Follow these steps:

1. Run mmc.exe.
2. File -> Add/Remove Snap-in…
3. Select **Certificates**.
4. Click **Add**.
5. Choose the certificate store location.
6. Click **Finish**.
7. Click **OK**.
8. Expand **Certificates**.
9. Expand the certificate store node.
10. Expand the Certificate child node.
11. Select a certificate in the list.

## Export certificate
In the **Certificate Export Wizard**:

1. Click **Next**.
2. Select **Yes**, then **Export the private key**.
3. Click **Next**.
4. Select the desired output file format.
5. Check the desired options.
6. Check **Password**.
7. Enter a strong password and confirm it.
8. Click **Next**.
9. Type or browse a filename where to store the certificate (use a .PFX extension).
10. Click **Next**.
11. Click **Finish**.
12. Click **OK**.

## Import certificate

In the Certificate Import Wizard:

1. Select the store location.

    * Select **Current User** if only processes running under current user will access the service
    * Select **Local Machine** if other processes in this computer will access the service
2. Click **Next**.
3. If importing from a file, confirm the file path.
4. If importing a .PFX file:
    1.     Enter the password protecting the private key
    2.     Select import options
5.     Select "Place" certificates in the following store
6.     Click **Browse**.
7.     Select the desired store.
8.     Click **Finish**.
       
    * If the Trusted Root Certification Authority store was chosen, click **Yes**.
9.     Click **OK** on all dialog windows.

## Upload certificate

In the [Azure Portal](https://portal.azure.com/)

1. Select **Cloud Services**.
2. Select the cloud service.
3. On the top menu, click **Certificates**.
4. On the bottom bar, click **Upload**.
5. Select the certificate file.
6. If it is a .PFX file, enter the password for the private key.
7. Once completed, copy the certificate thumbprint from the new entry in the list.

## Other security considerations
 
The SSL settings described in this document encrypt communication between the service and its clients when the HTTPS endpoint is used. This is important since credentials for database access and potentially other sensitive information are contained in the communication. Note, however, that the service persists internal status, including credentials, in its internal tables in the Microsoft Azure SQL database that you have provided for metadata storage in your Microsoft Azure subscription. That database was defined as part of the following setting in your service configuration file (.CSCFG file): 

    <Setting name="ElasticScaleMetadata" value="Server=…" />

Credentials stored in this database are encrypted. However, as a best practice, ensure that both web and worker roles of your service deployments are kept up to date and secure as they both have access to the metadata database and the certificate used for encryption and decryption of stored credentials. 

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]
