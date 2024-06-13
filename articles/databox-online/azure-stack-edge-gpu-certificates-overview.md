---
title: Azure Stack Edge Pro GPU, Pro R, Mini R certificate overview 
description: Describes an overview of all the certificates that can be used on Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 09/01/2021
ms.author: alkohli
---
# What are certificates on Azure Stack Edge Pro GPU?

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the types of certificates that can be installed on your Azure Stack Edge Pro GPU device. The article also includes the details for each certificate type.  

## About certificates

A certificate provides a link between a **public key** and an entity (such as domain name) that has been **signed** (verified) by a trusted third party (such as a **certificate authority**).  A certificate provides a convenient way of distributing trusted public encryption keys. Certificates thereby ensure that your communication is trusted and that you're sending encrypted information to the right server. 

## Deploying certificates on device

On your Azure Stack Edge device, you can use the self-signed certificates or bring your own certificates.

- **Device-generated certificates**: When your  device is initially configured, self-signed certificates are automatically generated. If needed, you can regenerate these certificates via the local web UI. Once the certificates are regenerated, download and import the certificates on the clients used to access your device.

- **Bring your own certificates**: Optionally, you can bring your own certificates. There are guidelines that you need to follow if you plan to bring your own certificates.

    - Start by understanding the types of the certificates that can be used with your Azure Stack Edge device in this article.
    - Next, review the [Certificate requirements for each type of certificate](azure-stack-edge-gpu-certificate-requirements.md).  
    - You can then [Create your certificates via Azure PowerShell](azure-stack-edge-gpu-create-certificates-powershell.md) or [Create your certificates via Readiness Checker tool](azure-stack-edge-gpu-create-certificates-tool.md).
    - Finally, [Convert the certificates to appropriate format](azure-stack-edge-gpu-prepare-certificates-device-upload.md) so that they are ready to upload on to your device.
    - [Upload your certificates](azure-stack-edge-gpu-manage-certificates.md#upload-certificates-on-your-device) on the device.
    - [Import the certificates on the clients](azure-stack-edge-gpu-manage-certificates.md#import-certificates-on-the-client-accessing-the-device) accessing the device.

## Types of certificates

The various types of certificates that you can bring for your device are as follows: 
- Signing certificates
    - Root CA
    - Intermediate

- Node certificates

- Endpoint certificates   
   
    - Azure Resource Manager certificates
    - Blob storage certificates

- Local UI certificates
- IoT device certificates
    
- Kubernetes certificates

    - Edge Container Registry certificate
    - Kubernetes dashboard certificate
    
- Wi-Fi certificates
- VPN certificates  

- Encryption certificates
    - Support session certificates

Each type of certificate is described in detail in the following sections.

## Signing chain certificates

These are the certificates for the authority that signs the certificates or the signing certificate authority. 

### Types

These certificates could be root certificates or the intermediate certificates. The root certificates are always self-signed (or signed by itself). The intermediate certificates are not self-signed and are signed by the signing authority.

#### Caveats

- The root certificates should be signing chain certificates.
- The root certificates can be uploaded on your device in the following format: 
    - **DER** – These are available as a `.cer` file extension.
    - **Base-64 encoded** – These are available as `.cer` file extension.
    - **P7b** – This format is used only for signing chain certificates that includes the root and intermediate certificates.
- Signing chain certificates are always uploaded before you upload any other certificates.


## Node certificates

<!--Your  device could be a 1-node device or a 4-node device.--> All the nodes in your device are constantly communicating with each other and therefore need to have a trust relationship. Node certificates provide a way to establish that trust. Node certificates also come into play when you are connecting to the device node using a remote PowerShell session over https.

#### Caveats

- The node certificate should be provided in `.pfx` format with a private key that can be exported. 
- You can create and upload 1 wildcard node certificate or 4 individual node certificates. 
- A node certificate must be changed if the DNS domain changes but the device name does not change. If you are bringing your own node certificate, then you can't change the device serial number, you can only change the domain name.
- Use the following table to guide you when creating a node certificate.
   
    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Node|`<NodeSerialNo>.<DnsDomain>`|`*.<DnsDomain>`<br><br>`<NodeSerialNo>.<DnsDomain>`|`mydevice1.microsoftdatabox.com` |
   

## Endpoint certificates

For any endpoints that the device exposes, a certificate is required for trusted communication. The endpoint certificates include those required when accessing the Azure Resource Manager and the blob storage via the REST APIs. 

When you bring in a signed certificate of your own, you also need the corresponding signing chain of the certificate. For the signing chain, Azure Resource Manager, and the blob certificates on the device, you will need the corresponding certificates on the client machine also to authenticate and communicate with the device.

#### Caveats

- The endpoint certificates need to be in `.pfx` format with a private key. Signing chain should be DER format (`.cer` file extension). 
- When you bring your own endpoint certificates, these can be as individual certificates or multidomain certificates. 
- If you are bringing in signing chain, the signing chain certificate must be uploaded before you upload an endpoint certificate.
- These certificates must be changed if the device name or the DNS domain names change.
- A wildcard endpoint certificate can be used.
- The properties of the endpoint certificates are similar to those of a typical SSL certificate. 
- Use the following table when creating an endpoint certificate:

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Azure Resource Manager|`management.<Device name>.<Dns Domain>`|`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`|`management.mydevice1.microsoftdatabox.com` |
    |Blob storage|`*.blob.<Device name>.<Dns Domain>`|`*.blob.< Device name>.<Dns Domain>`|`*.blob.mydevice1.microsoftdatabox.com` |
    |Multi-SAN single certificate for both endpoints|`<Device name>.<dnsdomain>`|`<Device name>.<dnsdomain>`<br>`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`<br>`*.blob.<Device name>.<Dns Domain>`|`mydevice1.microsoftdatabox.com` |


## Local UI certificates

You can access the local web UI of your device via a browser. To ensure that this communication is secure, you can upload your own certificate. 

#### Caveats

- The local UI certificate is also uploaded in a `.pfx` format with a private key that can be exported.
- After you upload the local UI certificate, you will need to restart the browser and clear the cache. Refer to the specific instructions for your browser.

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Local UI| `<Device name>.<DnsDomain>`|`<Device name>.<DnsDomain>`| `mydevice1.microsoftdatabox.com` |
   

## IoT Edge device certificates

Your  device is also an IoT device with the compute enabled by an IoT Edge device connected to it. For any secure communication between this IoT Edge device and the downstream devices that may connect to it, you can also upload IoT Edge certificates. 

The device has self-signed certificates that can be used if you want to use only the compute scenario with the device. If the  device is however connected to downstream devices, then you'll need to bring your own certificates.

There are three IoT Edge certificates that you need to install to enable this trust relation:

- **Root certificate authority or the owner certificate authority**
- **Device certificate authority** 
- **Device key certificate**


#### Caveats

- The IoT Edge certificates are uploaded in `.pem` format. 

For more information on IoT Edge certificates, see [Azure IoT Edge certificate details](../iot-edge/iot-edge-certs.md) and [Create IoT Edge production certificates](../iot-edge/how-to-manage-device-certificates.md).

## Kubernetes certificates

The following Kubernetes certificates may be used with your Azure Stack Edge device.

- **Edge container registry certificate**: If your device has an Edge container registry, then you'll need an Edge Container Registry certificate for secure communication with the client that is accessing the registry on the device.
- **Dashboard endpoint certificate**: You'll need a dashboard endpoint certificate to access the Kubernetes dashboard on your device.


#### Caveats

- The Edge Container Registry certificate should: 
    - Be a PEM format certificate.
    - Contain either Subject Alternative Name (SAN) or CName (CN) of type: `*.<endpoint suffix>` or `ecr.<endpoint suffix>`. For example: `*.dbe-1d6phq2.microsoftdatabox.com OR ecr.dbe-1d6phq2.microsoftdatabox.com`


- The dashboard certificate should:
    - Be a PEM format certificate.
    - Contain either Subject Alternative Name (SAN) or CName (CN) of type:  `*.<endpoint-suffix>` or `kubernetes-dashboard.<endpoint-suffix>`. For example: `*.dbe-1d6phq2.microsoftdatabox.com` or `kubernetes-dashboard.dbe-1d6phq2.microsoftdatabox.com`. 


## VPN certificates

If VPN (Point-to-site) is configured on your  device, you can bring your own VPN certificate to ensure the communication is trusted. The root certificate is installed on the Azure VPN Gateway and the client certificates are installed on each client computer that connects to a virtual network using Point-to-Site.

#### Caveats

- The VPN certificate must be uploaded as a *.pfx* format with a  private key.
- The VPN certificate is not dependent on the device name, device serial number, or device configuration. It only requires the external FQDN.
- Make sure that the client OID is set.

For more information, see [Generate and export certificates for Point-to-Site using PowerShell](../vpn-gateway/vpn-gateway-certificates-point-to-site.md#generate-and-export-certificates-for-point-to-site-using-powershell).

## Wi-Fi certificates

If your device is configured to operate on a WPA2-Enterprise wireless network, then you will also need a Wi-Fi certificate for any communication that occurs over the wireless network. 

#### Caveats

- The Wi-Fi certificate must be uploaded as a *.pfx* format with a private key.
- Make sure that the client OID is set.

## Support session certificates

If your  device is experiencing any issues, then to troubleshoot those issues, a remote PowerShell Support session may be opened on the device. To enable a secure, encrypted communication over this Support session, you can upload a certificate.

#### Caveats

- Make sure that the corresponding `.pfx` certificate with private key is installed on the client machine using the decryption tool.
- Verify that the **Key Usage** field for the certificate is not **Certificate Signing**. To verify this, right-click the certificate, choose **Open** and in the **Details** tab, find **Key Usage**. 

- The Support session certificate must be provided as DER format with a `.cer` extension.


## Next steps

[Review certificate requirements](azure-stack-edge-gpu-certificate-requirements.md).