---
title: Sentinel syslog integration
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# About the Microsoft Azure Sentinel Integration

## AboutDefender for IoT

Defender for IoT delivers the only OT and IoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure. Defender for IoT is the only platform with patented OT-aware threat analytics and machine learning.Defender for IoT provides:

- Immediate insights about the OT device landscape with an extensive range of details about attributes.

- Deep embedded knowledge of OT protocols, devices, applications — and their behaviors

- Immediate insights into vulnerabilities, as well as known and zero-day threats.

- An automated OT threat modeling technology to predict the most likely paths of targeted OT attacks via proprietary analytics.

## About Microsoft Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

Azure Sentinel is your birds-eye view across the enterprise alleviating the stress of increasingly sophisticated attacks, increasing volumes of alerts, and long resolution timeframes.

## About the integration

Defender for IoT delivers out-of-the-box integration with Azure Sentinel to provide real-time threat information over encrypted connections in order to enhance security analytics and threat intelligence across the enterprise.

IoT and OT security threats are identified by Defender for IoT security engines, which provide immediate alert response to malware attacks, network and security baseline deviations, as well as operational and protocol anomalies.

:::image type="content" source="media/integration-sentinel-syslog/alerts.png" alt-text="The alert response screen to malware attacks.":::

Threat information is displayed in **Microsoft Azure Sentinel.**

:::image type="content" source="media/integration-sentinel-syslog/sentinel.png" alt-text="The graphical display of the threat information in Microsoft Azure Sentinel.":::

:::image type="content" source="media/integration-sentinel-syslog/report.png" alt-text="The threat information report based on a specific time range.":::

These bridged platforms help SOC Administrators, IT teams, and analysts:

- Reduce the time required for industrial and critical infrastructure organizations to detect, investigate, and act on cyber threats.

- Obtain real-time intelligence about OT risks.

- Correlate Defender for IoT threat detection with Sentinel threat monitoring and incident management workflows.

### Getting more Defender for IoT information

- For White Papers, Webinars & Videos, Additional Product Information and Industrial Security News, go to [CyberX.io](https://cyberx-labs.com/).

- For technical support visit [https://cyberx-labs.zendesk.com](https://cyberx-labs.zendesk.com/)

- For additional troubleshooting information, contact <support@cyberx-labs.com>.

- To access the Defender for IoT User Guide from the Console, select :::image type="content" source="media/integration-sentinel-syslog/person-icon.png" alt-text="The icon used to select the user guide."::: and select **Download User Guide**.

## System Requirements and Architecture

- Defender for IoT version 2.8 or above

- Data sent to Azure Sentinel servers can be encrypted using TLS1.2. If you want to encrypt, verify that you have a TLS certificate.

- Azure Sentinel receives data from a network proxy. Verify that a proxy is set up. See [***Set Up a Proxy***](./set-up-a-proxy.md) if required.

### Architecture

The system is composed of the following components:

- Azure Sentinel

- Defender for IoT sensors and on-premises management console

- Azure Log Analytics DB

- Proxy (CEF Collector)

:::image type="content" source="media/integration-sentinel-syslog/structure.png" alt-text="Screenshot of the Azure Sentinel architecture":::

### Defender for IoT sensors and on-premises management console

You can send Defender for IoT alert information to more than one Azure Sentinel instance from a single Defender for IoT sensor or on-premises management console or from several sensors or on-premises management console. To do this, create more than one Defender for IoT *Forwarding* rule from a specific Defender for IoT sensor or on-premises management console. See [***Sending Threat Information to Multiple Sentinel***](./cyberx-setup.md) for details.

## Defender for IoT Setup

This article describes how to set up communication from the Defender for IoT platform to Azure Sentinel.

- Set up the Defender for IoT platform.

- Test the Forwarding Rule.

### Set up the Defender for IoT platform

To display alert information in Azure Sentinel, create Defender for IoT *Forwarding Rules*. Information can be encrypted using TLS1.2.

Sentinel uses CEF over UDP.

If you want to encrypt traffic, verify that you have a TLS certificate (ca.pem file). The certificate will be uploaded to the sensor and on-premises management console.

#### Set up forwarding rules

This article describes how to set up *Forwarding rules* from a Defender for IoT sensor and test the connection defined in the rule.

Forwarding rules let you:

- Connect to a Sentinel proxy.

- Define under what conditions to send threat information to Sentinel. For example, only when certain protocols are detected or only if threats are critical.

- Send information over encrypted connections.

> [!NOTE]
> Instructions that appear in this article also apply to the Defender for IoT on-premises management console.

To define the Forwarding rule:

1. In the Defender for IoT Platform left pane, select **Forwarding**.

   :::image type="content" source="media/integration-sentinel-syslog/forwarding.png" alt-text="Create a forwarding rule by clicking th blue button.":::

2. In the **Forwarding** pane, select **Create Forwarding Rule**.

   :::image type="content" source="media/integration-sentinel-syslog/rule.png" alt-text="Fill in the fields needed for the forwarding rule..":::

3. Add a rule name in the **Name** field.

4. In the **Protocols** section:

    - Select **Specific** to forward threat information based on specific protocols. Select the required protocols.

    - Select **All** to forward threat information regardless of the protocol.

5. In the **Engines** section, select the required Defender for IoT engines or choose **All**. Threat information detected by selected or all engines will be sent. Refer to the *Defender for IoT Platform User Guide* for more information about engines.

6. Send threat information based on severity levels that you want to handle. Severity levels reflect the minimum-security level incident to forward. For example, if **Minor** is selected, information regarding minor threats and any threat alert above this severity level will be forwarded. Levels are pre-defined by Defender for IoT. Select the **Severity** drop-down arrow and choose a level.

    :::image type="content" source="media/integration-sentinel-syslog/severity.png" alt-text="Select the pre-defined severity level.":::

7. Select **Send to Sentinel** from the **Action** list.

    :::image type="content" source="media/integration-sentinel-syslog/send-to.png" alt-text="Select send to Sentinel from the Action list.":::

    The **Sentinel** integration parameters appear in the **Actions** pane.

    :::image type="content" source="media/integration-sentinel-syslog/actions.png" alt-text="The actions pane for sentinel integration parameters.":::

8. Enter the **Proxy**, **Host**, and **Port** that will receive the threat alert information.

9. Enter the **Timezone**. This is the time stamp for the alert detection.

10. Enable encryption if required.

    - Select the **Enable Encryption** checkbox. Encryption is carried out using TLS 1.2.
    - Upload the TLS certificate you generated by selecting **Upload Certificate**.

11. Select **Submit**. The rule appears in the Forwarding Rule pane.

### Test the forwarding rule

This article describes how to verify that threat information will be sent to the proxy.

To test:

1. Select the rule you created from the **Forwarding Rule** pane.

2. Select **More** and then select **Send Test Message**.

    :::image type="content" source="media/integration-sentinel-syslog/send-test.png" alt-text="The dropdown menu showing options to manage messages.":::

3. A test message is sent to the Proxy.

#### Sending threat information to multiple Sentinel instances

You can send Defender for IoT alert information to more than one Azure Sentinel instance from a single Defender for IoT sensor or on-premises management console or from several sensors or on-premises management consoles. To do this, create more than one Defender for IoT *Forwarding Rule* from a specific Defender for IoT sensor or on-premises management console.

Support for dispersed distribution of alert threat information requires that you create a **new Forwarding rule** for each Sentinel instance.

This means you should not use the *Add another action* option.

## Set Up a Proxy

Azure Sentinel receives data from a network proxy. Verify that a proxy is set up. If it is not, use the instructions in This article to set it up.

### Configure the proxy Virtual Machine

This article describes how to configure the proxy in a Virtual Machine (VM).

To set up:

1. Make sure your proxy VM meets the prerequisites defined in the following [Microsoft manual](https://docs.microsoft.com/azure/sentinel/connect-common-event-format).

2. Deploy the agent as described in [Step 1](https://docs.microsoft.com/azure/sentinel/connect-common-event-format#step-1-deploy-the-agent) in the same Microsoft manual.

3. Set up the system to receive TLS traffic.

4. Configure the Azure Sentinel forwarding in the sensor and on-premises management console. Use the ca.pem file generated in the server as the encryption certificate.

5. Optional: Validate connectivity using [Step 3](https://docs.microsoft.com/azure/sentinel/connect-common-event-format#step-3-validate-connectivity) in the same Microsoft manual.

### Setup system to receive TLS traffic

1. Generate the CA private key:

```azurecli
sudo certtool --generate-privkey --outfile ca-key.pem
```

2. Generate the CA (certificate authority) certificate:

```azurecli
sudo certtool --generate-self-signed --load-privkey ca-key.pem --outfile ca.pem
```

3. Generate the machine private key:

```azurecli
sudo certtool --generate-privkey --outfile key.pem --bits 2048
```

4. Generate the certificate request:

```azurecli
sudo certtool --generate-request --load-privkey key.pem --outfile request.pem
```

5. Generate the certificate:

```azurecli
sudo certtool --generate-certificate --load-request request.pem --outfile cert.pem --load-ca-certificate ca.pem --load-ca-privkey ca-key.pem
```

6. Add the following lines to `/etc/rsyslog.conf` on the server machine (replace if exists):

```azurecli
module(load="imuxsock") # local messages
    module(load="imtcp" # TCP listener
    StreamDriver.Name="gtls"
    StreamDriver.Mode="1" # run driver in TLS-only mode
    StreamDriver.Authmode="anon"
    )

    # make gtls driver the default and set certificate files
    global(
    DefaultNetstreamDriver="gtls"
    DefaultNetstreamDriverCAFile="/path/to/contrib/gnutls/ca.pem"
    DefaultNetstreamDriverCertFile="/path/to/contrib/gnutls/cert.pem"
    DefaultNetstreamDriverKeyFile="/path/to/contrib/gnutls/key.pem"
    )

    # start up listener at port 6514
    input(
    type="imtcp"
    port="6514"
    )
```

#### System setup output sample

This article provides sample setup output files for the steps carried out above. The information shown below should be similar to the output you receive. Use the information in This article as a basic guideline for troubleshooting.

1. Step 1

```azurecli
[root@rgf9dev sample] certtool --generate-privkey --outfile ca-key.pem --bits 2048
Generating a 2048 bit RSA private key...
```

2 Step 2

```azurecli
[root@rgf9dev sample] certtool --generate-self-signed --load-privkey ca-key.pem --outfile ca.pem
Generating a self signed certificate...
Please enter the details of the certificate's distinguished name. Just press enter to ignore a field.
Country name (2 chars): US
Organization name: SomeOrg
Organizational unit name: SomeOU
Locality name: Somewhere
State or province name: CA
Common name: someName (not necessarily DNS!)
UID:
This field should not be used in new certificates.
E-mail:
Enter the certificate's serial number (decimal):


Activation/Expiration time.
The certificate will expire in (days): 3650

Extensions.
Does the certificate belong to an authority? (Y/N): y
Path length constraint (decimal, -1 for no constraint):
Is this a TLS web client certificate? (Y/N):
Is this also a TLS web server certificate? (Y/N):
Enter the e-mail of the subject of the certificate: someone@example.net
Will the certificate be used to sign other certificates? (Y/N): y
Will the certificate be used to sign CRLs? (Y/N):
Will the certificate be used to sign code? (Y/N):
Will the certificate be used to sign OCSP requests? (Y/N):
Will the certificate be used for time stamping? (Y/N):
Enter the URI of the CRL distribution point:
X.509 Certificate Information:
    Version: 3
    Serial Number (hex): 485a365e
    Validity:
        Not Before: Thu Jun 19 10:35:12 UTC 2008
        Not After: Sun Jun 17 10:35:25 UTC 2018
    Subject: C=US,O=SomeOrg,OU=SomeOU,L=Somewhere,ST=CA,CN=someName (not necessarily DNS!)
    Subject Public Key Algorithm: RSA
        Modulus (bits 2048):
            d9:9c:82:46:24:7f:34:8f:60:cf:05:77:71:82:61:66
            05:13:28:06:7a:70:41:bf:32:85:12:5c:25:a7:1a:5a
            28:11:02:1a:78:c1:da:34:ee:b4:7e:12:9b:81:24:70
            ff:e4:89:88:ca:05:30:0a:3f:d7:58:0b:38:24:a9:b7
            2e:a2:b6:8a:1d:60:53:2f:ec:e9:38:36:3b:9b:77:93
            5d:64:76:31:07:30:a5:31:0c:e2:ec:e3:8d:5d:13:01
            11:3d:0b:5e:3c:4a:32:d8:f3:b3:56:22:32:cb:de:7d
            64:9a:2b:91:d9:f0:0b:82:c1:29:d4:15:2c:41:0b:97
        Exponent:
            01:00:01
    Extensions:
        Basic Constraints (critical):
            Certificate Authority (CA): TRUE
        Subject Alternative Name (not critical):
            RFC822name: someone@example.net
        Key Usage (critical):
            Certificate signing.
        Subject Key Identifier (not critical):
            fbfe968d10a73ae5b70d7b434886c8f872997b89
    Other Information:
    Public Key Id:
        fbfe968d10a73ae5b70d7b434886c8f872997b89

Is the above information ok? (Y/N): y

Signing certificate...
[root@rgf9dev sample] chmod 400 ca-key.pem
[root@rgf9dev sample] ls -l
total 8
-r-------- 1 root root  887 2008-06-19 12:33 ca-key.pem
-rw-r--r-- 1 root root 1029 2008-06-19 12:36 ca.pem
[root@rgf9dev sample]
```

3. Step 3

```azurecli
[root@rgf9dev sample] certtool --generate-privkey --outfile key.pem --bits 2048
Generating a 2048 bit RSA private key...
```

4. Step 4

```azurecli
[root@rgf9dev sample] certtool --generate-request --load-privkey key.pem --outfile request.pem
Generating a PKCS 10 certificate request...
Country name (2 chars): US
Organization name: SomeOrg
Organizational unit name: SomeOU
Locality name: Somewhere
State or province name: CA
Common name: machine.example.net
UID:
Enter a dnsName of the subject of the certificate:
Enter the IP address of the subject of the certificate:
Enter the e-mail of the subject of the certificate:
Enter a challenge password:
Does the certificate belong to an authority? (y/N): n
Will the certificate be used for signing (DHE and RSA-EXPORT ciphersuites)? (y/N):
Will the certificate be used for encryption (RSA ciphersuites)? (y/N):
Is this a TLS web client certificate? (y/N): y
Is this also a TLS web server certificate? (y/N): y
```

5. Step 5

```azurecli
[root@rgf9dev sample] certtool --generate-certificate --load-request request.pem --outfile cert.pem --load-ca-certificate ca.pem --load-ca-privkey ca-key.pem
Generating a signed certificate...
Enter the certificates serial number (decimal):


Activation/Expiration time.
The certificate will expire in (days): 1000


Extensions.
Do you want to honour the extensions from the request? (y/N):
Does the certificate belong to an authority? (Y/N): n
Will the certificate be used for IPsec IKE operations? (y/N):
Is this a TLS web client certificate? (Y/N): y
Is this also a TLS web server certificate? (Y/N): y
Enter the dnsName of the subject of the certificate: machine.example.net {This is the name of the machine that will use the certificate}
Enter the IP address of the subject of certificate:
Will the certificate be used for signing (DHE and RSA-EXPORT ciphersuites)? (Y/N):
Will the certificate be used for encryption (RSA ciphersuites)? (Y/N):
X.509 Certificate Information:
    Version: 3
    Serial Number (hex): 485a3819
    Validity:
        Not Before: Thu Jun 19 10:42:54 UTC 2008
        Not After: Wed Mar 16 10:42:57 UTC 2011
    Subject: C=US,O=SomeOrg,OU=SomeOU,L=Somewhere,ST=CA,CN=machine.example.net
    Subject Public Key Algorithm: RSA
        Modulus (bits 2048):
            b2:4e:5b:a9:48:1e:ff:2e:73:a1:33:ee:d8:a2:af:ae
            2f:23:76:91:b8:39:94:00:23:f2:6f:25:ad:c9:6a:ab
            2d:e6:f3:62:d8:3e:6e:8a:d6:1e:3f:72:e5:d8:b9:e0
            d0:79:c2:94:21:65:0b:10:53:66:b0:36:a6:a7:cd:46
            1e:2c:6a:9b:79:c6:ee:c6:e2:ed:b0:a9:59:e2:49:da
            c7:e3:f0:1c:e0:53:98:87:0d:d5:28:db:a4:82:36:ed
            3a:1e:d1:5c:07:13:95:5d:b3:28:05:17:2a:2b:b6:8e
            8e:78:d2:cf:ac:87:13:15:fc:17:43:6b:15:c3:7d:b9
        Exponent:
            01:00:01
    Extensions:
        Basic Constraints (critical):
            Certificate Authority (CA): FALSE
        Key Purpose (not critical):
            TLS WWW Client.
            TLS WWW Server.
        Subject Alternative Name (not critical):
            DNSname: machine.example.net
        Subject Key Identifier (not critical):
            0ce1c3dbd19d31fa035b07afe2e0ef22d90b28ac
        Authority Key Identifier (not critical):
            fbfe968d10a73ae5b70d7b434886c8f872997b89
Other Information:
    Public Key Id:
        0ce1c3dbd19d31fa035b07afe2e0ef22d90b28ac

Is the above information ok? (Y/N): y
Signing certificate...
[root@rgf9dev sample] rm -f request.pem
[root@rgf9dev sample] ls -l
total 16
-r-------- 1 root root  887 2008-06-19 12:33 ca-key.pem
-rw-r--r-- 1 root root 1029 2008-06-19 12:36 ca.pem
-rw-r--r-- 1 root root 1074 2008-06-19 12:43 cert.pem
-rw-r--r-- 1 root root  887 2008-06-19 12:40 key.pem
```
