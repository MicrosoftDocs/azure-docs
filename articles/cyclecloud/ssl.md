# SSL Configuration

## Enable SSL

SSL can easily be enabled by editing the `cycle_server.properties` file found within the CycleCloud installation directory. Please note that when editing the `cycle_server.properties` file, it is important that you first look for pre-existing keyvalue definitions in the file. If there is more than one definition, the **last** one is in effect.

Open the `cycle_server.properties` file with a text editor and set the following values appropriately:

     # True if SSL is enabled
     webServerEnableHttps=true

The default SSL port for CycleCloud is port 8443. If you'd like to run encrypted web communications on some other port, you can change the `webServerSslPort` property to the new port value. Please make sure the `webServerSslPort` and the `webServerPort` values **DO NOT CONFLICT**.

Azure CycleCloud can also be configured to run using SSL encryption, providing
encrypted communication between CycleCloud and any web browser via an
*HTTPS* URL.

## Self-Generated Certificates

If you do not have a certificate from a Certificate Authority (CA) such as VeriSign, you can use the auto-generated self-signed certificate provided with Azure CycleCloud. This is a quick way to start using SSL at no cost, but most web browsers will display a warning stating a trusted authority has not verified the certificate being used to encrypt the channel. For some cases, like internal CycleCloud deployments on secure networks, this is acceptable. Users will have to add an exception to their browser to view the site, but the contents and the session will otherwise be encrypted as expected.

> [!WARNING]
> The Azure CycleCloud self-signed certificate has a shortened shelf life. When it expires, browsers will re-issue the warning about the SSL certificates being untrusted. Users will have to explicitly accept them to view the web console.

## Working With CA-Generated Certificates

Using a CA-generated certificate will allow web access to your CycleCloud installation without displaying the trusted certificate error. To use a CA certificate:

      ./cycle_server keystore create_request <FQDN>

You will be asked to provide a domain name, which is the "Common Name" field on the signed certificate. A `cycle_server.csr` file will be generated, which must be imported with the Certificate Authority response. The CA response certificate will likely be PKCS7 file, which can be imported with the file name:

      ./cycle_server keystore import <ca-response.crt>

If the response returns multiple file names, you can import them all at once by separating the file names with a space:

      ./cycle_server keystore import ca_cert_chain.crt server.crt

### Import Existing Certificates

If you have previously created a CA or self-signed Certificate, you can update the keystore to use it:

      ./cycle_server keystore update

## Configuring CycleCloud to use Native HTTPS

By default, Azure CycleCloud is configured to use the standard Java IO HTTPS
implementation. This default works well on all supported platforms.

To improve performance when running on Linux platforms, CycleCloud may
optionally be configured to use the Tomcat Native HTTPS implementation.

To enable Native HTTPS on Linux, add the `webServerEnableHttps` and `webServerUseNativeHttps` attributes to your cycle_server.properties file. Open the cycle_server.properties file with a text editor and set the following values:

     # Turn on HTTPS
     webServerEnableHttps = true

     # Use Native HTTPS connector
     webServerUseNativeHttps = true

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

With the modifications made to your cycle_server.properties file, you will need to restart CycleCloud for the encrypted communication channel to activate. On Windows:

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
