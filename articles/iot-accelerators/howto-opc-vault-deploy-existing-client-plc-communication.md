---
title: Secure the communication of OPC client and OPC PLC with OPC Vault - Azure | Microsoft Docs
description: Secure the communication of OPC client and OPC PLC by signing their certificates using OPC Vault CA.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Secure the communication of OPC client and OPC PLC

OPC Vault is a microservice that can configure, register, and manage certificate life cycle for OPC UA server and client applications in the cloud. This article shows you how to secure the communication of OPC client and OPC PLC by signing their certificates using OPC Vault CA.

In the following setup, the OPC client tests the connectivity to the OPC PLC. By default, the connectivity is not possible because both the components are not provisioned with the right certificates. If an OPC UA component was not yet provisioned with a certificate, it would generate a self-signed certificate on startup. However, the certificate can be signed by a Certificate Authority (CA) and installed in the OPC UA component. After this is done for OPC client and OPC PLC, the connectivity is enabled. The workflow below describes the process. Some background information on OPC UA security can be found in [this document](https://opcfoundation.org/wp-content/uploads/2014/05/OPC-UA_Security_Model_for_Administrators_V1.00.pdf) white paper. The complete information can be found in the OPC UA specification.

Testbed: The following environment is configured for testing.

OPC Vault scripts:
- Secure communication of OPC client and OPC PLC by signing their certificates using OPC Vault CA.

> [!NOTE]
> For more information, see the GitHub [repository](https://github.com/Azure-Samples/iot-edge-industrial-configs#testbeds).

## Generate a self-signed certificate on startup

**Preparation**

- Ensure that the environment variables `$env:_PLC_OPT` and `$env:_CLIENT_OPT` are undefined, for example, `$env:_PLC_OPT=""` in your PowerShell.

- Set the environment variable `$env:_OPCVAULTID` to a string that allows you to find your data again in OPC Vault. Only alphanumeric characters are allowed. For our example, "123456" was used as the value for this variable.

- Ensure there are no docker volumes `opcclient` or `opcplc`. Check with `docker volume ls` and remove them with `docker volume rm <volumename>`. You may need to remove also containers with `docker rm <containerid>` if the volumes are still used by a container.

**Quickstart**

Run the following PowerShell command in the root of the repository:

```
docker-compose -f connecttest.yml up
```

**Verification**

Verify in the log that there are no certificates installed on the first startup. Here the log output of OPC PLC (similar shows up for OPC client):..
```
opcplc-123456 | [20:51:32 INF] Trusted issuer store contains 0 certs
opcplc-123456 | [20:51:32 INF] Trusted issuer store has 0 CRLs.
opcplc-123456 | [20:51:32 INF] Trusted peer store contains 0 certs
opcplc-123456 | [20:51:32 INF] Trusted peer store has 0 CRLs.
opcplc-123456 | [20:51:32 INF] Rejected certificate store contains 0 certs
```
If you do see certificates reported, follow the preparation steps above and delete the docker volumes.

Verify that the connection to the OPC PLC has failed. You should see the following output in the OPC client log output:

```
opcclient-123456 | [20:51:35 INF] Create secured session for endpoint URI 'opc.tcp://opcplc-123456:50000/' with timeout of 10000 ms.
opcclient-123456 | [20:51:36 ERR] Session creation to endpoint 'opc.tcp://opcplc-123456:50000/' failed 1 time(s). Please verify if server is up and OpcClient configuration is correct.
opcclient-123456 | Opc.Ua.ServiceResultException: Certificate is not trusted.
```
The reason for the failure is that the certificate is not trusted. This means that `opc-client` tried to connect to `opc-plc` and received a response back, indicating that `opc-plc` does not trust `opc-client`, a result of `opc-plc` unable to validate the certificate that `opc-client` has provided. This is a self-signed certificate with no further certificate configuration on `opc-plc`,  and thus the connection failed.

## Sign and install certificates in OPC UA components

**Preparation**
1. Look at the log output of Step 1 and fetch "CreateSigningRequest information" for the OPC PLC and the OPC client. Here the output is only shown for OPC PLC:

    ```
    opcplc-123456 | [20:51:32 INF] ----------------------- CreateSigningRequest information ------------------
    opcplc-123456 | [20:51:32 INF] ApplicationUri: urn:OpcPlc:opcplc-123456
    opcplc-123456 | [20:51:32 INF] ApplicationName: OpcPlc
    opcplc-123456 | [20:51:32 INF] ApplicationType: Server
    opcplc-123456 | [20:51:32 INF] ProductUri: https://github.com/azure-samples/iot-edge-opc-plc
    opcplc-123456 | [20:51:32 INF] DiscoveryUrl[0]: opc.tcp://opcplc-123456:50000
    opcplc-123456 | [20:51:32 INF] ServerCapabilities: DA
    opcplc-123456 | [20:51:32 INF] CSR (base64 encoded):
    opcplc-123456 | MIICmzCCAYMCAQAwETEPMA0GA1UEAwwGT3BjUGxjMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwTvlbinAPWPxR9Lw1ndGsrLGy8GiqVOxyGaDpPUcMchX0k0/ncg28h7xrB2H1PThdiZxUJuUwsNM74HrVgt
    ofmXhA4dLM1cTxZHyJVFjl2L3vK5M58NNf6UNdKcB0x3LyuoT6mAIMXmCioqymFCk1TMzIMzbAe7JVAdUaSRBP1vuqQ1rV/cfNAe35dKQW4aPYgl7pR5f1hqprcDu/oca67X8L4kTl4oN0/bCYTk+Ibcd9cG462oAN+bSwbHn8a2jNky8rGsofA
    o9DOT+0ALPhk6CApCYIP2yxoI/kT188eqUUxzAFF9nyU79AyCkpGPuY8DGMyf56pDofgtGpfY3wQIDAQABoEUwQwYJKoZIhvcNAQkOMTYwNDAyBgNVHREEKzAphhh1cm46T3BjUGxjOm9wY3BsYy0xMjM0NTaCDW9wY3BsYy0xMjM0NTYwDQYJK
    oZIhvcNAQELBQADggEBAAsZLoOLzS2VhDcQRu0QhRbG7CGAxX19l7fDCG2WjU7lTFnCvYVTWTYyaY61ljmrWc7IbCaQdMJM8GRnAnvAzUh/PBDxkOX7NqI2+8F1yQOHgs/AfKuppOd6DIP8EzFAHnc0H85jay6zFdmIDWoWwpy0ACqOVooOTKST
    7uty0mT87bj8Cdy1yf4mvBNQx+nsuTbKgxWCBxGYAyg9dIL2uKL0aeB/ROW5Gkelz5sCEzQ1fFDokUA4oC5QiATQBN3cY7EmvRbPgdToY7CpRN3iiO7J+7bC7BP9YKfuE34E8xOFpskHPHAPf3r002/L0S67HyuVSXLUj1+Jc0LeAAF9Bw0=
    opcplc-123456 | [20:51:32 INF] ---------------------------------------------------------------------------
    ```
	
1. Go to the [OPC Vault website](https://opcvault.azurewebsites.net/).

1. Select `Register New`

1. Enter the OPC PLC information from the log outputs `CreateSigningRequest information` area into the input fields on the `Register New OPC UA Application` page, select `Server` as ApplicationType.

1. Select `Register`.

1. On the next page, `Request New Certificate for OPC UA Application` select `Request new Certificate with Signing Request`.

1. On the next page, `Generate a new Certificate with a Signing Request` paste in the `CSR (base64 encoded)` string from the log output into the `CreateRequest` input field. Ensure you copy the full string.

1. Select `Generate New Certificate`.

1. You are now moving forward to `View Certificate Request Details`. On this page, you can download all required information to provision the certificate stores of `opc-plc`.

1. On this page:  
    - Select `Certificate` in `Download as Base64` and copy the text string presented in the `EncodedBase64` field and store it for later use. We refer to it as `<applicationcertbase64-string>` later on. Select `Back`.

    - Select `Issuer` in `Download as Base64` and copy the text string presented in the `EncodedBase64` field and store it for later use. We refer to it as `<addissuercertbase64-string>` later on. Select `Back`.

    - Select `Crl` in `Download as Base64` and copy the text string presented in the `EncodedBase64` field and store it for later use. We refer to it as `<updatecrlbase64-string>` later on. Select `Back`.

1. Now set in your PowerShell a variable named `$env:_PLC_OPT`:

    ```
    `$env:_PLC_OPT="--applicationcertbase64 <applicationcertbase64-string> --addtrustedcertbase64 <addissuercertbase64-string> --addissuercertbase64 <addissuercertbase64-string> --updatecrlbase64 <updatecrlbase64-string>"`  
    ```
    > [!NOTE] 
	> Replace the strings passed in as option values Base64 strings you fetched from the website.

Repeat the complete process starting with `Register New` (step 3 above) for the OPC client. There are only the following differences you need to be aware of:

- Use the log output from the `opcclient`.
- Select `Client` as ApplicationType during registration.
- Use `$env:_CLIENT_OPT` as name of the PowerShell variable.

> [!NOTE]
> While working with this scenario, you may have recognized that the `<addissuercertbase64-string>` and `<updatecrlbase64-string>` values are identical for `opcplc` and `opcclient`. This is true for our use case and can save you some time while doing the steps.

**Quickstart**

Run the following PowerShell command in the root of the repository:

```
docker-compose -f connecttest.yml up
```

**Verification**
Verify that the two components have now signed application certificates. Check the log output for the following output:

```
opcplc-123456 | [20:54:38 INF] Starting to add certificate(s) to the trusted issuer store.
opcplc-123456 | [20:54:38 INF] Certificate 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' and thumbprint 'BC78F1DDC3BB5D2D8795F3D4FF0C430AD7D68E83' was added to the trusted issuer store.
opcplc-123456 | [20:54:38 INF] Starting to add certificate(s) to the trusted peer store.
opcplc-123456 | [20:54:38 INF] Certificate 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' and thumbprint 'BC78F1DDC3BB5D2D8795F3D4FF0C430AD7D68E83' was added to the trusted peer store.
opcplc-123456 | [20:54:38 INF] Starting to update the current CRL.
opcplc-123456 | [20:54:38 INF] Remove the current CRL from the trusted peer store.
opcplc-123456 | [20:54:38 INF] The new CRL issued by 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' was added to the trusted peer store.
opcplc-123456 | [20:54:38 INF] Remove the current CRL from the trusted issuer store.
opcplc-123456 | [20:54:38 INF] The new CRL issued by 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' was added to the trusted issuer store.
opcplc-123456 | [20:54:38 INF] Start updating the current application certificate.
opcplc-123456 | [20:54:38 INF] The current application certificate has SubjectName 'CN=OpcPlc' and thumbprint '8FD43F66479398BDA3AAF5B193199A6657632B49'.
opcplc-123456 | [20:54:39 INF] Remove the existing application certificate with thumbprint '8FD43F66479398BDA3AAF5B193199A6657632B49'.
opcplc-123456 | [20:54:39 INF] The new application certificate 'CN=OpcPlc' and thumbprint 'DA6B8B2FB533FBC188F7017BAA8A36FDB77E2586' was added to the application certificate store.
opcplc-123456 | [20:54:39 INF] Activating the new application certificate with thumbprint 'DA6B8B2FB533FBC188F7017BAA8A36FDB77E2586'.
opcplc-123456 | [20:54:39 INF] Application certificate with thumbprint 'DA6B8B2FB533FBC188F7017BAA8A36FDB77E2586' found in the application certificate store.
opcplc-123456 | [20:54:39 INF] Application certificate is for ApplicationUri 'urn:OpcPlc:opcplc-123456', ApplicationName 'OpcPlc' and Subject is 'OpcPlc'
 ```
The Application certificate is there and signed by a CA.

Verify in the log that there are now certificates installed. Below is the log output of OPC PLC, and OPC client has a similar output.
```
opcplc-123456 | [20:54:39 INF] Trusted issuer store contains 1 certs
opcplc-123456 | [20:54:39 INF] 01: Subject 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' (thumbprint: BC78F1DDC3BB5D2D8795F3D4FF0C430AD7D68E83)
opcplc-123456 | [20:54:39 INF] Trusted issuer store has 1 CRLs.
opcplc-123456 | [20:54:39 INF] 01: Issuer 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.', Next update time '10/19/2019 22:06:46'
opcplc-123456 | [20:54:39 INF] Trusted peer store contains 1 certs
opcplc-123456 | [20:54:39 INF] 01: Subject 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.' (thumbprint: BC78F1DDC3BB5D2D8795F3D4FF0C430AD7D68E83)
opcplc-123456 | [20:54:39 INF] Trusted peer store has 1 CRLs.
opcplc-123456 | [20:54:39 INF] 01: Issuer 'CN=Azure IoT OPC Vault CA, O=Microsoft Corp.', Next update time '10/19/2019 22:06:46'
opcplc-123456 | [20:54:39 INF] Rejected certificate store contains 0 certs
```
The issuer of the application certificate is the CA `CN=Azure IoT OPC Vault CA, O=Microsoft Corp.` and the OPC PLC trust also all certificates signed by this CA.


Verify that the connection to the OPC PLC has been created successfully and the OPC client can read data from OPC PLC. You should see the following output in the OPC client log output:
```
opcclient-123456 | [20:54:42 INF] Create secured session for endpoint URI 'opc.tcp://opcplc-123456:50000/' with timeout of 10000 ms.
opcclient-123456 | [20:54:42 INF] Session successfully created with Id ns=3;i=1085867946.
opcclient-123456 | [20:54:42 INF] The session to endpoint 'opc.tcp://opcplc-123456:50000/' has 4 entries in its namespace array:
opcclient-123456 | [20:54:42 INF] Namespace index 0: http://opcfoundation.org/UA/
opcclient-123456 | [20:54:42 INF] Namespace index 1: urn:OpcPlc:opcplc-123456
opcclient-123456 | [20:54:42 INF] Namespace index 2: http://microsoft.com/Opc/OpcPlc/
opcclient-123456 | [20:54:42 INF] Namespace index 3: http://opcfoundation.org/UA/Diagnostics
opcclient-123456 | [20:54:42 INF] The server on endpoint 'opc.tcp://opcplc-123456:50000/' supports a minimal sampling interval of 0 ms.
opcclient-123456 | [20:54:42 INF] Execute 'OpcClient.OpcTestAction' action on node 'i=2258' on endpoint 'opc.tcp://opcplc-123456:50000/' with security.
opcclient-123456 | [20:54:42 INF] Action (ActionId: 000 ActionType: 'OpcTestAction', Endpoint: 'opc.tcp://opcplc-123456:50000/' Node 'i=2258') completed successfully
opcclient-123456 | [20:54:42 INF] Value (ActionId: 000 ActionType: 'OpcTestAction', Endpoint: 'opc.tcp://opcplc-123456:50000/' Node 'i=2258'): 10/20/2018 20:54:42
```
If you see this output, then the OPC PLC is now trusting OPC client and vice versa, since both have now certificates signed by a CA and both trust certificates which where signed by this CA.

> [!NOTE] 
> Although we showed the first two verification steps only for OPC PLC, those need to be verified also for OPC client.


## Next steps

Now that you have learned how to deploy OPC Vault to an existing project, here is the suggested next step:

> [!div class="nextstepaction"]
> [Deploy OPC Twin to an existing project](howto-opc-twin-deploy-existing.md)