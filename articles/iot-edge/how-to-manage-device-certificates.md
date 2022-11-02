---
title: Manage IoT Edge certificates
description: How to install and manage certificates on an Azure IoT Edge device to prepare for production deployment. 
author: PatAltimore

ms.author: patricka
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# Manage IoT Edge certificates

[!INCLUDE [iot-edge-version-1.1-or-1.4](./includes/iot-edge-version-1.1-or-1.4.md)]

All IoT Edge devices use certificates to create secure connections between the runtime and any modules running on the device. IoT Edge devices functioning as gateways use these same certificates to connect to their downstream devices, too. For more information about the function of the different certificates on an IoT Edge device, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

> [!NOTE]
> The term *root CA* used throughout this article refers to the topmost authority's certificate in the certificate chain for your IoT solution. You do not need to use the certificate root of a syndicated certificate authority, or the root of your organization's certificate authority. In many cases, it is actually an intermediate CA certificate.

## Prerequisites

* [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

* An IoT Edge device.
    If you don't have an IoT Edge device set up, you can create one in an Azure virtual machine. Follow the steps in one of the quickstart articles to [Create a virtual Linux device](quickstart-linux.md) or [Create a virtual Windows device](quickstart.md).

* Ability to edit the IoT Edge configuration file `config.toml` following the [configuration template](https://github.com/Azure/iotedge/blob/main/edgelet/contrib/config/linux/template.toml).
  * If your `config.toml` isn't based on the template, open the [template](https://github.com/Azure/iotedge/blob/main/edgelet/contrib/config/linux/template.toml) and use the commented guidance to add configuration sections following the structure of the template.
  * If you have a new IoT Edge installation that hasn't been configured, copy the template to initialize the configuration. Don't use this command if you have an existing configuration. It overwrites the file.

    ```bash
    sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
    ```

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

## Format requirements

> [!TIP]
>
> * A certificate can be encoded in a binary representation called DER, or a textual representation called PEM. The PEM format is a `-----BEGIN CERTIFICATE-----` header followed by the base64-encoded DER followed by a `-----END CERTIFICATE-----` footer.
> * Similar to the certificate, the private key can be encoded in binary DER or textual representation PEM.
> * Because PEM is delineated, it is also possible to construct a PEM that combines both the `CERTIFICATE` and `PRIVATE KEY` sequentially in the same file.
> * Lastly, the certificate and private key can be encoded together in a binary representation called *PKCS#12*, that is encrypted with an optional password.
>
> File extensions are arbitrary and you need to run the `file` command or view the file verify the type. In general, files use the following extension conventions:
>
> * `.cer` is a certificate in DER or PEM form.
> * `.pem` is either a certificate, private key, or both in PEM form.
> * `.pfx` is a *PKCS#12* file.

IoT Edge requires the certificate and private key to be:

* PEM format
* Separate files
* In most cases, with the full chain

If you get a `.pfx` file from your PKI provider, it's likely the certificate and private key encoded together in one file. Verify it's a PKCS#12 file type by using the `file` command. You can convert a PKCS#12 `.pfx` file to PEM files using the [openssl pkcs12 command](https://www.openssl.org/docs/man1.1.1/man1/pkcs12.html).

If your PKI provider provides a `.cer` file, it may contain the same certificate as the `.pfx`, or it might be the PKI provider's issuing (root) certificate. To verify, inspect the file with the `openssl x509` command. If it's the issuing certificate:

1. If it's in DER (binary) format, convert it to PEM with `openssl x509 -in cert.cer -out cert.pem`.
1. Use the PEM file as the trust bundle. For more information about the trust bundle, see the next section.

## Manage trusted root CA (trust bundle)

Using a self-signed certificate authority (CA) certificate as a root of trust with IoT Edge and modules is known as *trust bundle*. The trust bundle is available for IoT Edge and modules to communicate with servers. To configure the trust bundle, specify its file path in the IoT Edge configuration file.

1. Get a publicly-trusted root CA certificate from a PKI provider.

1. Check the certificate [meets format requirements](#format-requirements).

1. Copy the PEM file and give IoT Edge's certificatge access. For example, with `/var/aziot/certs` directory:

   ```bash
   # Make the directory as root if doesn't exist
   sudo mkdir /var/aziot/certs -p
   # Copy certificate over
   sudo cp root-ca.pem /var/aziot/certs

   # Give aziotcs ownership to certificate
   # Read and write for aziotcs, read-only for others
   sudo chown aziotcs:aziotcs /var/aziot/certs/root-ca.pem
   sudo chmod 644 /var/aziot/certs/root-ca.pem
   ```

1. In the IoT Edge configuration file `config.toml`, find **Trust bundle cert** section. If the section is missing, you can copy it from the configuration template file.

   >[!TIP]
   >If the config file doesn't exist on your device yet, then use `/etc/aziot/config.toml.edge.template` as a template to create one.

1. Set `trust_bundle_cert` key to the certificate file location.

   ```toml
   trust_bundle_cert = "file:///var/aziot/certs/root-ca.pem"
   ```

1. Apply the configuration.

   ```bash
   sudo iotege config apply
   ```

Installing the certificate to the trust bundle file makes it available to container modules but not to host modules like Azure Device Update or Defender. If you use host level components or run into other TLS issues, also install the root CA certificate to the operating system certificate store:

# [Linux](#tab/linux)

  ```bash
  sudo cp /var/aziot/certs/my-root-ca.pem /usr/local/share/ca-certificates/my-root-ca.pem.crt

  sudo update-ca-certificates
  ```

# [IoT Edge for Linux on Windows (EFLOW)](#tab/windows)

  ```bash
  sudo cp /var/aziot/certs/my-root-ca.pem /etc/pki/ca-trust/source/anchors/my-root-ca.pem.crt

  sudo update-ca-trust
  ```

---

## Import certificate and private key files

IoT Edge can use existing certificate and private key files to authenticate or attest to Azure, issue new module server certificates, and authenticate to EST servers. To install them:

1. Check the certificate and private key files meet the [format requirements](#format-requirements).

1. Copy the PEM file to the IoT Edge device where IoT Edge modules can have access. For example, `/var/aziot/` directory.

   ```bash
   # Make the directory if doesn't exist
   sudo mkdir /var/aziot/certs -p
   sudo mkdir /var/aziot/secrets -p

   # Copy certificate and private key over
   sudo cp my-cert.pem /var/aziot/certs
   sudo cp my-private-key.pem /var/aziot/secrets
   ```

1. Grant ownership to IoT Edge's certificate service `aziotcs` and key service `aziotks` to the certificate and private key, respectively.

   ```bash
   # Give aziotcs ownership to certificate
   # Read and write for aziotcs, read-only for others
   sudo chown aziotcs:aziotcs /var/aziot/certs/my-cert.pem
   sudo chmod 644 /var/aziot/certs/my-cert.pem

   # Give aziotks ownership to private key
   # Read and write for aziotks, no permission for other
   sudo chown aziotks:aziotks /var/aziot/secrets/my-private-key.pem
   sudo chmod 600 /var/aziot/secrets/my-private-key.pem
   ```

1. In `config.toml`, find the relevant section for the type of the certificate to configure. For example, you can search for the keyword `cert`.

1. Using the example from the configuration template, configure the device identity certificate or Edge CA files. The example pattern is:

    ```toml
    cert = "file:///var/aziot/certs/my-cert.pem"
    pk = "file:///var/aziot/secrets/my-private-key.pem"
    ```

1. Apply the configuration

   ```bash
   sudo iotedge config apply
   ```

To prevent errors when certificates expire, remember to manually update the files and configuration before certificate expiration.

### Example: use device identity certificate files from PKI provider

Request a TLS client certificate and a private key from your PKI provider. Ensure that the common name (CN) matches the IoT Edge device ID registered with IoT Hub or registration ID with DPS. For example, in the following device identity certificate, `Subject: CN = my-device` is the critical field that needs to match.

Example device identity certificate:

```output
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 48 (0x30)
        Signature Algorithm: ecdsa-with-SHA256
        Issuer: CN = myPkiCA
        Validity
            Not Before: Jun 28 21:27:30 2022 GMT
            Not After : Jul 28 21:27:30 2022 GMT
        Subject: CN = my-device
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:ad:b0:63:1f:48:19:9e:c4:9d:91:d1:b0:b0:e5:
                    ...
                    80:58:63:6d:ab:56:9f:90:4e:3f:dd:df:74:cf:86:
                    04:af
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Key Usage:
                Digital Signature
            X509v3 Extended Key Usage:
                TLS Web Client Authentication
            X509v3 Subject Key Identifier:
                C7:C2:DC:3C:53:71:B8:42:15:D5:6C:4B:5C:03:C2:2A:C5:98:82:7E
            X509v3 Authority Key Identifier:
                keyid:6E:57:C7:FC:FE:50:09:75:FA:D9:89:13:CB:D2:CA:F2:28:EF:9B:F6

    Signature Algorithm: ecdsa-with-SHA256
         30:45:02:20:3c:d2:db:06:3c:d7:65:b7:22:fe:df:9e:11:5b:
         ...
         eb:da:fc:f1:6a:bf:31:63:db:5a:16:02:70:0f:cf:c8:e2
-----BEGIN CERTIFICATE-----
MIICdTCCAhugAwIBAgIBMDAKBggqhkjOPQQDAjAXMRUwEwYDVQQDDAxlc3RFeGFt
...
354RWw+eLOpQSkTqXxzjmfw/kVOOAQIhANvRmyCQVb8zLPtqdOVRkuva/PFqvzFj
21oWAnAPz8ji
-----END CERTIFICATE-----
```

> [!TIP]
> To test without access to certificate files provided by a PKI, see [Create demo certificates to test device features](/azure/iot-edge/how-to-create-test-certificates) to generate a short-lived non-production device identity certificate and private key.

Configuration example when provisioning with IoT Hub:

```toml
[provisioning]
source = "manual"
# ...
[provisioning.authentication]
method = "x509"

identity_cert = "file:///var/aziot/device-id.pem"
identity_pk = "file:///var/aziot/device-id.key.pem"
```

Configuration example when provisioning with DPS:

```toml
[provisioning]
source = "dps"
# ...
[provisioning.attestation]
method = "x509"
registration_id = "my-device"

identity_cert = "file:///var/aziot/device-id.pem"
identity_pk = "file:///var/aziot/device-id.key.pem"
```

Overhead with manual certificate management can be risky and error-prone. For production, using IoT Edge with automatic certificate management is recommended.

## Manage Edge CA

Edge CA has two different modes:

* *Quickstart* is the default behavior. Quickstart is for testing and **not** suitable for production.
* *Production* mode requires you provide your own source for Edge CA certificate and private key.

### Quickstart Edge CA

To help with getting started, IoT Edge automatically generates an **Edge CA certificate** when started for the first time by default. This self-signed certificate is only meant for development and testing scenarios, not production. By default, the certificate expires after 90 days. Expiration can be configured. This behavior is referred to as *quickstart Edge CA*.

*Quickstart Edge CA* enables `edgeHub` and other IoT Edge modules to have a valid server certificate when IoT Edge is first installed with no configuration. The certificate is needed by `edgeHub` because modules or downstream devices [need to establish secure communication channels](iot-edge-certs.md#device-verifies-gateway-identity). Without the quickstart Edge CA, getting started would be significantly harder because you'd need to provide a valid server certificate from a PKI provider or with tools like `openssl`.

> [!IMPORTANT]
> Never use the quickstart Edge CA for production because the locally generated certificate in it isn't connected to a PKI.
>
> The security of a certificates-based identity derives from a well-operated PKI (the infrastructure) in which the certificate (a document) is only a component. A well-operated PKI enables definition, application, management, and enforcements of security policies to include but not limited to certificates issuance, revocation, and lifecycle management.

#### Customize lifetime for quickstart Edge CA

To configure the certificate expiration to something other than the default 90 days, add the value in days to the **Edge CA certificate (Quickstart)** section of the config file.

```toml
[edge_ca]
auto_generated_edge_ca_expiry_days = 180
```

Delete the contents of the `/var/lib/aziot/certd/certs` and `/var/lib/aziot/keyd/keys` folders to remove any previously generated certificates then apply the configuration.

#### Renew quickstart Edge CA

By default, IoT Edge automatically renews the quickstart Edge CA certificate when at 80% of the certificate lifetime. For example, if a certificate has a 90 day lifetime, IoT Edge automatically regenerates the Edge CA certificate at 72 days from issuance.

To change the auto-renewal logic, add the following settings to the *Edge CA certificate* section in `config.toml`. For example:

```toml
[edge_ca.auto_renew]
rotate_key = true
threshold = "70%"
retry = "2%"
```

### Edge CA in production

Once you move into a production scenario, or you want to create a gateway device, you can no longer use the quickstart Edge CA.

One option is to provide your own certificates and manage them manually. However, to avoid the risky and error-prone manual certificate management process, use an EST server whenever possible.

### Plan for Edge CA renewal

When the Edge CA certificate renews, all the certificates it issued like module server certificates are regenerated. To give the modules new server certificates, IoT Edge restarts all modules when Edge CA certificate renews.

To minimize potential negative effects of module restarts, plan to renew the Edge CA certificate at a specific time (for example, `threshold = "10d"`) and notify dependents of the solution about the downtime.

### Example: use Edge CA certificate files from PKI provider

Request the following files from your PKI provider:

* The PKI's root CA certificate
* An issuing/CA certificate and associated private key

For the issuing CA certificate to become Edge CA, it must have these extensions:

```text
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
basicConstraints = critical, CA:TRUE, pathlen:0
keyUsage = critical, digitalSignature, keyCertSign
```

Example of the result Edge CA certificate:

```bash
openssl x509 -in my-edge-ca-cert.pem -text
```

```output
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4098 (0x1002)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = myPkiCA
        Validity
            Not Before: Aug 27 00:00:50 2022 GMT
            Not After : Sep 26 00:00:50 2022 GMT
        Subject: CN = my-edge-ca.ca
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                Modulus:
                    00:e1:cb:9c:c0:41:d2:ee:5d:8b:92:f9:4e:0d:3e:
                    ...
                    25:f5:58:1e:8c:66:ab:d1:56:78:a5:9c:96:eb:01:
                    e4:e3:49
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier:
                FD:64:48:BB:41:CE:C1:8A:8A:50:9B:2B:2D:6E:1D:E5:3F:86:7D:3E
            X509v3 Authority Key Identifier:
                keyid:9F:E6:D3:26:EE:2F:D7:84:09:63:84:C8:93:72:D5:13:06:8E:7F:D1
            X509v3 Basic Constraints: critical
                CA:TRUE, pathlen:0
            X509v3 Key Usage: critical
                Digital Signature, Certificate Sign
    Signature Algorithm: sha256WithRSAEncryption
         20:c9:34:41:a3:a4:8e:7c:9c:6e:17:f5:a6:6f:e5:fc:6e:59:
         ...
         7c:20:5d:e5:51:85:4c:4d:f7:f8:01:84:87:27:e3:76:65:47:
         9e:6a:c3:2e:1a:f0:dc:9d
-----BEGIN CERTIFICATE-----
MIICdTCCAhugAwIBAgIBMDAKBggqhkjOPQQDAjAXMRUwEwYDVQQDDAxlc3RFeGFt
...
354RWw+eLOpQSkTqXxzjmfw/kVOOAQIhANvRmyCQVb8zLPtqdOVRkuva/PFqvzFj
21oWAnAPz8ji
-----END CERTIFICATE-----
```

Once you receive the latest files, [update the trust bundle](#manage-trusted-root-ca-trust-bundle):

```toml
trust_bundle_cert = "file:///var/aziot/root-ca.pem"
```

Then, configure IoT Edge to use the certificate and private key files:

```toml
[edge_ca]
cert = "file:///var/aziot/my-edge-ca-cert.pem"
pk = "file:///var/aziot/my-edge-ca-private-key.key.pem"
```

If you've used any other certificates for IoT Edge on the device before, delete the files in `/var/lib/aziot/certd/certs` and the private keys associated with certificates (*not* all keys) in `/var/lib/aziot/keyd/keys`. IoT Edge recreates them with the new CA certificate you provided.

This approach requires you to manually update the files as certificate expires. To avoid this issue, consider using EST for automatic management.

## Automatic certificate management with EST server

IoT Edge can interface with an [Enrollment over Secure Transport (EST) server](https://wikipedia.org/wiki/Enrollment_over_Secure_Transport) for automatic certificate issuance and renewal. Using EST is recommended for production as it replaces the need for manual certificate management, which can be risky and error-prone. It can be configured globally and overridden for each certificate type.

In this scenario, the bootstrap certificate and private key are expected to be long-lived and potentially installed on the device during manufacturing. IoT Edge uses the bootstrap credentials to authenticate to the EST server for the initial request to issue an identity certificate for subsequent requests, as well as for authentication to DPS or IoT Hub.

1. Get access to an EST server. If you don't have an EST server, use one of the following options to start testing:

   * Create a test EST server using the steps in [Tutorial: Configure Enrollment over Secure Transport Server for Azure IoT Edge](tutorial-configure-est-server.md).

   * Microsoft partners with GlobalSign to [provide a demo account](https://www.globalsign.com/lp/globalsign-and-microsoft-azure-iot-edge-enroll-demo).

1. In the IoT Edge device configuration file `config.toml`, configure the path to a trusted root certificate that IoT Edge uses to validate the EST server's TLS certificate. This step is optional if the EST server has a publicly-trusted root TLS certificate.

   ```toml
   [cert_issuance.est]
   trusted_certs = [
      "file:///var/aziot/root-ca.pem",
   ]
   ```

1. Provide a default URL for the EST server. In `config.toml`, add the following section with the URL of the EST server:

   ```toml
   [cert_issuance.est.urls]
   default = "https://example.org/.well-known/est"
   ```

1. To configure the EST certificate for authentication, add the following section with the path to the certificate and private key:

   ```toml
   [cert_issuance.est.auth]
   bootstrap_identity_cert = "file:///var/aziot/my-est-id-bootstrap-cert.pem"
   bootstrap_identity_pk = "file:///var/aziot/my-est-id-bootstrap-pk.key.pem"

   [cert_issuance.est.identity_auto_renew]
   rotate_key = true
   threshold = "80%"
   retry = "4%"
   ```

1. Apply the configuration changes.

   ```bash
   sudo iotedge config apply
   ```

The settings in `[cert_issuance.est.identity_auto_renew]` are covered in the next section.

### Username and password authentication

If authentication to EST server using certificate isn't possible, you can use a shared secret or username and password instead.

```toml
[cert_issuance.est.auth]
username = "username"
password = "password"
```

### Configure auto-renew parameters

Instead of manually managing the certificate files, IoT Edge has the built-in ability to get and renew certificates before expiry. Certificate renewal requires an issuance method that IoT Edge can manage. Enrollment over Secure Transport (EST) server is one issuance method, but IoT Edge can also automatically [renew the quickstart CA by default](#renew-quickstart-edge-ca). Certificate renewal is configured per type of certificate.

1. In `config.toml`, find the relevant section for the type of the certificate to configure. For example, you can search for the keyword `auto_renew`.

1. Using the example from the configuration template, configure the device identity certificate, Edge CA, or EST identity certificates. The example pattern is:

   ```toml
   [REPLACE_WITH_CERT_TYPE]
   # ...
   method = "est"
   # ...

   [REPLACE_WITH_CERT_TYPE.auto_renew]
   rotate_key = true
   threshold = "80%" 
   retry = "4%"
   ```

1. Apply the configuration

   ```bash
   sudo iotege config apply
   ```

The following table lists what each option in `auto_renew` does:

| Parameter | Description |
|---------|---------|
|`rotate_key`| Controls if the private key should be rotated when IoT Edge renews the certificate.|
|`threshold`| Sets when IoT Edge should start renewing the certificate. It can be specified as: <br> - Percentage: integer between `0` and `100` followed by `%`. Renewal starts relative to the certificate lifetime. For example, when set to `80%`, a certificate that is valid for 100 days begins renewal at 20 days before its expiry. <br> - Absolute time: integer followed by `min` (minutes) or `day` (days). Renewal starts relative to the certificate expiration time. For example, when set to `4day` for four days or `10min` for 10 minutes, the certificate begins renewing at that time before expiry. To avoid unintentional misconfiguration where the `threshold` is bigger than the certificate lifetime, we recommend using *percentage* instead whenever possible.|
|`retry`| controls how often renewal should be retried on failure. Like `threshold`, it can similarly be specified as a *percentage* or *absolute time* using the same format.|

### Example: renew device identity certificate automatically with EST

To use EST and IoT Edge for automatic device identity certificate issuance and renewal, which is recommended for production, IoT Edge must provision as part of a [DPS CA-based enrollment group](/azure/iot-edge/how-to-provision-devices-at-scale-linux-x509?tabs=group-enrollment%2Cubuntu). For example:

```toml
## DPS provisioning with X.509 certificate
[provisioning]
source = "dps"
# ...
[provisioning.attestation]
method = "x509"
registration_id = "my-device"

[provisioning.attestation.identity_cert]
method = "est"
common_name = "my-device"

[provisioning.attestation.identity_cert.auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"
```

Don't use EST or `auto_renew` with other methods of provisioning, including manual X.509 provisioning with IoT Hub and DPS with individual enrollment. IoT Edge can't update certificate thumbprints in Azure when a certificate is renewed, which prevents IoT Edge from reconnecting.

### Example: automatic Edge CA management with EST

Use EST automatic Edge CA issuance and renewal for production. Once EST server is configured, you can use the global setting, or override it similar to this example:

```toml
[edge_ca]
method = "est"

common_name = "my-edge-CA"
url = "https://ca.example.org/.well-known/est"

bootstrap_identity_cert = "file:///var/aziot/my-est-id-bootstrap-cert.pem"
bootstrap_identity_pk = "file:///var/aziot/my-est-id-bootstrap-pk.key.pem"
```

By default, and when there's no specific `auto_renew` configuration, Edge CA automatically renews at 80% certificate lifetime if EST is set as the method. You can update the auto renewal values to other values. For example:

```toml
[edge_ca.auto_renew]
rotate_key = true
threshold = "90%"
retry = "2%"
```

Automatic renewal for Edge CA can't be disabled when issuance method is set to EST, since Edge CA expiration must be avoided as it breaks many IoT Edge functionalities. If a situation requires total control over Edge CA certificate lifecycle, use the [manual Edge CA management method](#example-use-edge-ca-certificate-files-from-pki-provider) instead.

:::moniker-end
<!-- end iotedge-2020-11 -->

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

## Device CA

All IoT Edge devices use certificates to create secure connections between the runtime and any modules running on the device. IoT Edge devices functioning as gateways use these same certificates to connect to their downstream devices, too. For more information about the function of the different certificates on an IoT Edge device, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

IoT Edge automatically generates device CA on the device in several cases, including:

* If you don't provide your own production certificates when you install and provision IoT Edge, the IoT Edge security manager automatically generates a **device CA certificate**. This self-signed certificate is only meant for development and testing scenarios, not production. This certificate expires after 90 days.
* The IoT Edge security manager also generates a **workload CA certificate** signed by the device CA certificate.

For these two automatically generated certificates, you have the option of setting a flag in the config file to configure the number of days for the lifetime of the certificates.

> [!NOTE]
> There is a third auto-generated certificate that the IoT Edge security manager creates, the **IoT Edge hub server certificate**. This certificate always has a 30 day lifetime, but is automatically renewed before expiring. The auto-generated CA lifetime value set in the config file doesn't affect this certificate.

## Customize quickstart device CA certificate lifetime

Upon expiry after the specified number of days, IoT Edge has to be restarted to regenerate the device CA certificate. The device CA certificate isn't renewed automatically.

# [Linux containers](#tab/linux)

1. To configure the certificate expiration to something other than the default 90 days, add the value in days to the **certificates** section of the config file.

   ```yaml
   certificates:
     device_ca_cert: "<ADD URI TO DEVICE CA CERTIFICATE HERE>"
     device_ca_pk: "<ADD URI TO DEVICE CA PRIVATE KEY HERE>"
     trusted_ca_certs: "<ADD URI TO TRUSTED CA CERTIFICATES HERE>"
     auto_generated_ca_lifetime_days: <value>
   ```

   > [!NOTE]
   > Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

1. Delete the contents of the `hsm` folder to remove any previously generated certificates.

   * `/var/aziot/hsm/certs`
   * `/var/aziot/hsm/cert_keys`

1. Restart the IoT Edge service.

   ```bash
   sudo systemctl restart iotedge
   ```

1. Confirm the lifetime setting.

   ```bash
   sudo iotedge check --verbose
   ```

   Check the output of the **production readiness: certificates** check, which lists the number of days until the automatically generated device CA certificates expire.

# [Windows containers](#tab/windows)

1. To configure the certificate expiration to something other than the default 90 days, add the value in days to the **certificates** section of the config file.

   ```yaml
   certificates:
     device_ca_cert: "<ADD URI TO DEVICE CA CERTIFICATE HERE>"
     device_ca_pk: "<ADD URI TO DEVICE CA PRIVATE KEY HERE>"
     trusted_ca_certs: "<ADD URI TO TRUSTED CA CERTIFICATES HERE>"
     auto_generated_ca_lifetime_days: <value>
   ```

   > [!NOTE]
   > Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

1. Delete the contents of the `hsm` folder to remove any previously generated certificates.

   * `C:\ProgramData\iotedge\hsm\certs`
   * `C:\ProgramData\iotedge\hsm\cert_keys`

1. Restart the IoT Edge service.

   ```powershell
   Restart-Service iotedge
   ```

1. Confirm the lifetime setting.

   ```powershell
   iotedge check --verbose
   ```

   Check the output of the **production readiness: certificates** check, which lists the number of days until the automatically generated device CA certificates expire.

---

## Install device CA for production

Once you move into a production scenario, or you want to create a gateway device, you need to provide your own certificates.

### Create and install device CA for production

1. Use your own certificate authority to create the following files:

   * Root CA
   * Device CA certificate
   * Device CA private key

   The *root CA* isn't the topmost certificate authority for an organization. It's the topmost certificate authority for the IoT Edge scenario, which the IoT Edge hub module, user modules, and any downstream devices use to establish trust between each other.

   To see an example of these certificates, review the scripts that create demo certificates in [Managing test CA certificates for samples and tutorials](https://github.com/Azure/iotedge/tree/master/tools/CACertificates).

   > [!NOTE]
   > Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

1. Copy the three certificate and key files onto your IoT Edge device. You can use a service like [Azure Key Vault](../key-vault/index.yml) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files. If you generated the certificates on the IoT Edge device itself, you can skip this step and use the path to the working directory.

   > [!TIP]
   > If you used the sample scripts to [create demo certificates](how-to-create-test-certificates.md), the three certificate and key files are located at the following paths:

   * Device CA certificate: `<WRKDIR>\certs\iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem`
   * Device CA private key: `<WRKDIR>\private\iot-edge-device-MyEdgeDeviceCA.key.pem`
   * Root CA: `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

# [Linux containers](#tab/linux)

1. Open the IoT Edge security daemon config file: `/etc/iotedge/config.yaml`

1. Set the **certificate** properties in config.yaml to the file URI path to the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Make sure the **certificates:** line has no preceding whitespace and that nested items are indented by two spaces. For example:

   ```yaml
   certificates:
      device_ca_cert: "file:///<path>/<device CA cert>"
      device_ca_pk: "file:///<path>/<device CA key>"
      trusted_ca_certs: "file:///<path>/<root CA cert>"
   ```

1. Make sure that the user **iotedge** has read/write permissions for the directory holding the certificates.

1. If you've used any other certificates for IoT Edge on the device before, delete the files in the following two directories before starting or restarting IoT Edge:

   * `/var/aziot/hsm/certs`
   * `/var/aziot/hsm/cert_keys`

1. Restart IoT Edge.

   ```bash
   sudo iotedge system restart
   ```

# [Windows containers](#tab/windows)

1. Open the IoT Edge security daemon config file: `C:\ProgramData\iotedge\config.yaml`

1. Set the **certificate** properties in config.yaml to the file URI path to the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Make sure the **certificates:** line has no preceding whitespace and that nested items are indented by two spaces. For example:

   ```yaml
   certificates:
      device_ca_cert: "file:///C:/<path>/<device CA cert>"
      device_ca_pk: "file:///C:/<path>/<device CA key>"
      trusted_ca_certs: "file:///C:/<path>/<root CA cert>"
   ```

1. If you've used any other certificates for IoT Edge on the device before, delete the files in the following two directories before starting or restarting IoT Edge:

   * `C:\ProgramData\iotedge\hsm\certs`
   * `C:\ProgramData\iotedge\hsm\cert_keys`

1. Restart IoT Edge.

   ```powershell
   Restart-Service iotedge
   ```

---

:::moniker-end
<!-- end 1.1 -->

## Module server certificates

Edge Daemon issues module server and identity certificates for use by Edge modules. It remains the responsibility of Edge modules to renew their identity and server certificates as needed.

### Renewal

Server certificates may be issued off the Edge CA certificate or through a DPS-configured CA. Regardless of the issuance method, these certificates must be renewed by the module.

## Changes in 1.2 and later

* The **Device CA certificate** was renamed as **Edge CA certificate**.
* The **workload CA certificate** was deprecated. Now the IoT Edge security manager generates the IoT Edge hub `edgeHub` server certificate directly from the Edge CA certificate, without the intermediate workload CA certificate between them.
* The default config file has a new name and location, from `/etc/iotedge/config.yaml` to `/etc/aziot/config.toml` by default. The `iotedge config import` command can be used to help migrate configuration information from the old location and syntax to the new one.

## Next steps

Installing certificates on an IoT Edge device is a necessary step before deploying your solution in production. Learn more about how to [Prepare to deploy your IoT Edge solution in production](production-checklist.md).
