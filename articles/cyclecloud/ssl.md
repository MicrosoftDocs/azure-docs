# SSL Configuration

Azure CycleCloud can be configured to run using SSL encryption, providing
encrypted communication between CycleCloud and any web browser via an
*HTTPS* URL.

## Generating a Keystore

In order to use SSL you must provide a [keystore](http://en.wikipedia.org/wiki/Keystore) of certificates that the server can use for encrypted communication with browsers. A keystore is created by importing sets of encryption keys in to a keystore container using the [keytool](http://download.oracle.com/javase/1.3/docs/tooldocs/win32/keytool.html) command that ships with the Java Runtime Engine.

## Working with Self-Generated Certificates

If you don't purchase certificates from a Certificate Authority (CA) such as VeriSign, you can create your own certificates for use in the keystore file. The upside to this approach is it can get you up and running quickly with SSL with zero cost. The downside is most browsers will display a warning at least the first time you visit your CycleCloud installation, letting you know a trusted authority has not verified the certificate being used to encrypt the channel. For some cases, like internal CycleCloud deployments on secure networks, this is acceptable. Users will have to add an exception to their browser to view the site, but the contents and the
session will otherwise be encrypted as expected.

On Windows, you can use the JRE that ships with CycleCloud to create a keystore with a self-generated set of keys in it:

      C:\Program Files\CycleServer\system\jre\bin\keytool.exe

On Linux, you can use the keytool in the JRE you installed to run CycleCloud. In CycleCloud 4.4+, the JRE is included with CycleCloud in `$CS_HOME/system/jre/bin`.

To generate the self-signed certificate and keystore, run:

      keytool -genkey -keyalg RSA -sigalg SHA256withRSA -alias CycleServer -keypass "changeit" -keystore .keystore -storepass "changeit"

You will be asked some questions about you and your domain, and a `.keystore` file will be stored on disk. You should substitute your own password for the "changeit" passwords used in the above example.

> [!WARNING]
> If you're using self-signed certificates, browsers will issue a warning about the SSL certificates being untrusted. Users will have to explicitly accept them to view the web console.

## Working With CA-Generated Certificates

To get a certificate signed from a certificate authority (CA), you need to generate two files: a private key for the server, and a certificate signing request (CSR) that you send to the CA.

First generate the key:

    openssl genrsa -des3 -out server.key 2048

Then generate the CSR:

    openssl req -new -key server.key -out server.csr

Most fields are informational, but the CN (Common Name) field must be the hostname of the server as seen by clients. You must provide the CSR to the CA and wait to get the certificate (server.crt). You will also need the root certificates and any intermediate ones used in the chain between your new certificate and the root certificate. The CA should provide these for you.

To import the root certificate:

    keytool -import -alias root -keystore .keystore -trustcacerts -file root.crt

This will prompt you for a keystore password. You can use whatever you like, but remember it for below. Check that the verification information displayed matches what you expect, and type `yes` if so. If it is already included, you do not need to include it.

For each intermediate or cross certificate, run this command, using a unique alias for each:

    keytool -import -alias intermediate -keystore .keystore -trustcacerts -file intermediate.crt

To import your server's certificate, you must first combine the signed certificate with the key you created for the CSR:

    openssl pkcs12 -export -inkey server.key -in server.crt -out combined.p12

This step will also ask you for an *export password*. Make sure it matches the password you used to
create `.keystore`. If they do not match, CycleCloud will not be able start its SSL
connector.

Next, import the combined certificate into your keystore. You will be prompted for the password you used to export the combined certificate and then for password you used to create `.keystore`. **Make sure they match!** :

      keytool -importkeystore -srckeystore combined.p12 -srcstoretype PKCS12 -destkeystore .keystore -alias 1 -destalias tomcat

To verify the keystore is defined correctly, run the following command:

    keytool -list -keystore .keystore

You should get output similar to the following:

    Your keystore contains 2 entries

    intermediate, Oct 8, 2013, trustedCertEntry,
    Certificate fingerprint (MD5): 9D:48:42:0D:FF:58:19:38:86:BC:FD:41:D4:8A:41:F0
    tomcat, Oct 8, 2013, PrivateKeyEntry,
    Certificate fingerprint (MD5): 7C:3C:D2:E5:4D:8C:68:FE:52:5A:F8:78:C5:43:16:A1

Note that the `tomcat` entry **must** be listed as PrivateKeyEntry.

Often the certificate authority will provide you with a PKCS7 formatted certificate, which packages the server and intermediate certificates into a single file. To import this certificate, you will first need to create a keystore using your combined certificate:

    keytool -importkeystore -srckeystore combined.p12 -srcstoretype PKCS12 -destkeystore CycleCloud.keystore -alias 1 -destalias tomcat

You will then need to import the .pkb file into the keystore:

    keytool -import -trustcacerts -alias tomcat -keystore CycleServer.keystore -file certificate.pkb

Finally you can verify the keystore is defined correctly:

    keytool -list -keystore CycleServer.keystore

You should see the following:

    Your keystore contains 1 entry

    tomcat, Oct 8, 2013, PrivateKeyEntry,
    Certificate fingerprint (MD5): 7C:3C:D2:E5:4D:8C:68:FE:52:5A:F8:78:C5:43:16:A1

## Configuring Azure CycleCloud to Use Your Keystore

With a .keystore file on disk, you now need to deploy this store file in to your CycleCloud installation and tell CycleCloud to use this file for encrypted communications.

To deploy on Windows, run:

    move .keystore C:\Program Files\CycleServer\

To deploy on Linux, assuming CycleCloud is installed at /opt/cycle_server:

    mv .keystore /opt/cycle_server/

On Linux you'll also want to make certain that .keystore can only be read and written to by the user your CycleCloud instance runs as.

Next, edit the `CycleCloud Installation Dir/config/cycle_server.properties` file to tell CycleCloud the location and name of your keystore file and to turn on SSL in CycleCloud.

> [!NOTE]
> When editing the cycle_server.properties file it is important that you first look for pre-existing key-value definitions in the file. If there is more than one definition, the last one is in effect.

Open the cycle_server.properties file with a text editor and set the following
values appropriately:

     # The location of the keystore with the SSL certificate.
     webServerKeystoreFile=${cycle_server.home}/.keystore

     # The password for the keystore
     webServerKeystorePass=changeit

     # True if SSL is enabled
     webServerEnableHttps=true

where `changeit` should be the password used when creating the keystore.

The default SSL port for CycleCloud is port 8443. If you'd like to
run encrypted web communications on some other port you can change the
`webServerSslPort` property to the port value. Please make sure the
`webServerSslPort` and the `webServerPort` values DO NOT CONFLICT. 

## Configuring CycleCloud to use Native HTTPS

By default, Azure CycleCloud is configured to use the standard Java IO HTTPS
implementation. This default works well on all supported platforms.

To improve performance when running on Linux platforms, CycleCloud may
optionally be configured to use the Tomcat Native HTTPS implementation.

To enable Native HTTPS on Linux, add the `webServerEnableHttps` and `webServerUseNativeHttps` attributes to your cycle_server.properties file. If your keystore uses an alias other than 1 for the certificate to use, then you must also set the certificate's alias using the `webServerKeystoreAlias`
attribute.

Open the cycle_server.properties file with a text editor and set the following
values appropriately:

     # Turn on HTTPS
     webServerEnableHttps = true

     # Use Native HTTPS connector
     webServerUseNativeHttps = true

     # Specify the Keystore Alias of the key to use (if alias is not "1")
     webServerKeystoreAlias = ${key_alias}

When Native HTTPS with CA-Generated certificates as describe above, you should
already have a CA Certificate file and Key file. If so, then you may use the
following configuration attributes to reference the key and certificate directly
instead of generating a Java Keystore:

     # Optionally specify the OpenSSL compatible Certificate and Key directly
     webServerSSLCertificateFile=${full_path_to}/server.crt
     webServerSSLCertificateKeyFile=${full_path_to}/server.key

### Backwards compatibility for TLS 1.0 and 1.1

By default, the Java and Native HTTPS connectors will be configured to use only the
TLS 1.2 protocol. If you need to offer TLS 1.0 or 1.1 protocols for older web clients, you may
opt-in for backwards compatibility.

Open the cycle_server.properties file with a text editor, and look for the `sslEnabledProtocols`
attribute:

    sslEnabledProtocols="TLSv1.2"

Change the attribute to a `+` delimited list of protocols you wish to support.

    sslEnabledProtocols="TLSv1.0+TLSv1.1+TLSv1.2"

## Testing

With the modifications made to your cycle_server.properties file and your .keystore file deployed, you will need to restart CycleCloud for the encrypted communication channel to activate. On Windows:

    C:\Program Files\CycleServer\cycle_server.cmd restart

On Linux:

    /opt/cycle_server/cycle_server restart

Assuming you did not change the SSL port for CycleCloud when
configuring it for encrypted communications, you can now go to
`http://<my CycleCloud address>:8443/` to verify the SSL connection.

> [!NOTE]
> If the HTTPS URL does not work, check the`<CycleCloud Home>/logs/tomcat.log` and `<CycleCloud Home>/logs/cycle_server.log` for error messages that might indicate why the encrypted channel is not responding.

## Turning Off Unencrypted Communications

Once you have tested the encrypted communication channel you may wish
to prevent unencrypted (HTTP) access to your CycleCloud installation. To
turn off unencrypted communications open your cycle_server.properties
file in a text editor. Look for the `webServerEnableHttp` property and
change it to:

     # HTTP
     webServerEnableHttp=false

Save the changes and restart CycleCloud. HTTP access to CycleCloud will be disabled.

## Backup and Restore

CycleCloud automatically creates backups of data on a periodic basis. Backups are written to
`$CS_HOME/data/backups`.

In the rare case that data needs to be restored, use the command `util/restore.sh` (Linux) or
`util/restore.cmd` (Windows). For example, from the `$CS_HOME` directory:

    ./util/restore.sh /opt/cycle_server/data/backups/backup-2014-02-28_15-36-45-0500
