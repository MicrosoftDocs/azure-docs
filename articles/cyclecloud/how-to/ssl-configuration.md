---
title: SSL Configuration
description: Enable SSL for secure transfers in Azure CycleCloud. Review self-generated certificates. Work with Let's Encrypt or CA-generated certificates.
author: adriankjohnson
ms.date: 02/04/2020
ms.author: adjohnso
---

# SSL Configuration

## Enable SSL

SSL can be enabled by editing the _cycle_server.properties_ file found within the CycleCloud installation directory. Open the _cycle_server.properties_ file with a text editor and set the following values appropriately:

``` properties
# True if SSL is enabled
webServerEnableHttps=true
webServerRedirectHttp=true
```

> [!IMPORTANT]
> Please note that when editing the _cycle_server.properties_ file, it is important that you first look for pre-existing keyvalue definitions in the file. If there is more than one definition, the **last** one is in effect.

The default SSL port for CycleCloud is port 8443. If you'd like to run encrypted web communications on some other port, you can change the `webServerSslPort` property to the new port value. Please make sure the `webServerSslPort` and the `webServerPort` values **DO NOT CONFLICT**.

After editing your _cycle_server.properties_ file, you will need to restart CycleCloud for the encrypted communication channel to activate:

``` CLI
/opt/cycle_server/cycle_server restart
```

Assuming you did not change the SSL port for CycleCloud when configuring it for encrypted communications, you can now go to `http://<my CycleCloud address>:8443/` to verify the SSL connection.

> [!NOTE]
> If the HTTPS URL does not work, check the _&lt;CycleCloud Home&gt;/logs/catalina.err_ and _&lt;CycleCloud Home&gt;/logs/cycle_server.log_ for error messages that might indicate why the encrypted channel is not responding.

## Self-Generated Certificates

If you do not have a certificate from a Certificate Authority (CA) such as VeriSign, you can use the auto-generated self-signed certificate provided with Azure CycleCloud. This is a quick way to start using SSL at no cost, but most web browsers will display a warning stating a trusted authority has not verified the certificate being used to encrypt the channel. For some cases, like internal CycleCloud deployments on secure networks, this is acceptable. Users will have to add an exception to their browser to view the site, but the contents and the session will otherwise be encrypted as expected.

> [!WARNING]
> The Azure CycleCloud self-signed certificate has a shortened shelf life. When it expires, browsers will re-issue the warning about the SSL certificates being untrusted. Users will have to explicitly accept them to view the web console.

## Working with Let's Encrypt

CycleCloud supports certificates from [Let's Encrypt](https://letsencrypt.org/). To use Let's Encrypt with CycleCloud, you must:

* enable SSL on port 443
* ensure CycleCloud is publicly reachable over port 443 with an external domain name

You can enable Let's Encrypt support with the "SSL" option on the settings page, or by running `cycle_server keystore automatic DOMAIN_NAME` from the CycleCloud machine.

## Working With CA-Generated Certificates

Using a CA-generated certificate will allow web access to your CycleCloud installation without displaying the trusted certificate error. To start the process, first run:

``` CLI
./cycle_server keystore create_request <FQDN>
```

You will be asked to provide a domain name, which is the "Common Name" field on the signed certificate. This will generate a new self-signed certificate for the specified domain and write a cycle_server.csr file. You must provide the CSR to a certificate authority, and they will provide the final signed certificate (which will be referred to as server.crt below). You will also need the root certificates and any intermediate ones used in the chain between your new certificate and the root certificate. The CA should provide these for you. If they have provided them bundled as a single certificate file, you can import them with the following command:

``` CLI
./cycle_server keystore import server.crt
```

If they provided multiple certificate files, you should import them all at once appending the names to that same command, separated by spaces:

``` CLI
./cycle_server keystore import server.crt ca_cert_chain.crt
```

### Import Existing Certificates

If you have previously created a CA or self-signed certificate, you can update CycleCloud to use it with the following command:

``` CLI
./cycle_server keystore update server.crt
```

If you want to import a PFX file, you can do it with the following command in CycleCloud 7.9.7 or later:

``` CLI
./cycle_server keystore import_pfx server.pfx --pass PASSWORD
```

Note the PFX file can only contain one entry.

Finally, if you make changes to the keystore outside of these commands, you can reload the keystore immediately in CycleCloud 7.9.7 or later:

``` CLI
./cycle_server keystore reconfig
```

::: moniker range="=cyclecloud-7"
## Backwards compatibility for TLS 1.0 and 1.1

By default, CycleServer will be configured to use only the
TLS 1.2 protocol. If you need to offer TLS 1.0 or 1.1 protocols for older web clients, you may
opt-in for backwards compatibility.

Open _cycle_server.properties_ with a text editor, and look for the `sslEnabledProtocols`
attribute:

``` properties
sslEnabledProtocols="TLSv1.2"
```

Change the attribute to a `+` delimited list of protocols you wish to support.

``` properties
sslEnabledProtocols="TLSv1.0+TLSv1.1+TLSv1.2"
```
::: moniker-end

## Turning Off Unencrypted Communications

The above setup allows unencrypted (HTTP) connections to be made, but they are redirected to HTTPS for security.
You may wish to prevent unencrypted access to your CycleCloud installation. To turn off
unencrypted communications open your _cycle_server.properties_ file in a
text editor. Look for the `webServerEnableHttp` property and change it
to:

``` properties
# HTTP
webServerEnableHttp=false
```

Save the changes and restart CycleCloud. HTTP access to CycleCloud will be disabled.
