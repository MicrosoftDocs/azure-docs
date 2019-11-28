---
title: Use certificates with Azure Stack Edge | Microsoft Docs
description: Describes use of certificates with Azure Stack Edge device including why to use, which types and how to upload certificates on your device.
services: Azure Stack Edge
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 11/27/2019
ms.author: alkohli
---
# Use certificates with Azure Stack Edge Rugged series 

This article describes the types of certificates that can be installed on your Azure Stack Edge device. The article also includes the details for each certificate type along with the procedure to install and identify the expiration date. 

## About certificates

A certificate provides a link between a **public key** and an entity (such as domain name) that has been **signed** (verified) by a trusted third party (such as a **certificate authority**).  A certificate provides a convenient way of distributing trusted public encryption keys. Certificates thereby ensure that your communication is trusted and that you're sending encrypted information to the right server. 

When your Azure Stack Edge device is initially configured, self-signed certificates are automatically generated. Optionally, you can bring your own certificates. There are guidelines that you need to follow if you plan to bring your own certificates.

## Types of certificates

The various types of certificates that are used on your Azure Stack Edge device are as follows: 
- Signing chain certificate
- Node certificate
- Endpoint certificates
- IoT device certificates
- Local UI certificates
Each of these certificates are described in detail in the following sections.

## Signing chain certificates

These are the certificates for the authority that signs the certificates or the signing certificate authority. 

### Types

These certificates could be root certificates or the intermediate certificates. The root certificates are always self-signed (or signed by itself). The intermediate certificates are not self-signed and are signed by the signing authority.

### Caveats

- The root certificates can be uploaded on your device in the following format: 
    - **DER** – These are available as a .cer format
    - **Base-64 encoded** – These are available as .pem format.
    - **P7b** – This format is used only for signing chain certificates that includes the root and intermediate certificates.
- Signing chain certificates are always uploaded before you upload any other certificates.


## Node certificates

Your Azure Stack Edge device could be a 1-node device or a 4-node device. All the nodes in the device are constantly communicating with each other and therefore need to have a trust relationship. Node certificates provide a way to establish that trust. Node certificates also come into play when you are connecting to the device node using a remote PowerShell session over https.

### Caveats

- The node certificate should be provided in .pfx format with a private key. 
- You can create and upload 1 wildcard node certificate or 4 individual node certificates. 
- A node certificate must be changed if the DNS domain changes but the device name does not change. If you are bringing your own node certificate, then you can't change the device serial number, you can only change the domain name.
- Use the following table to guide you when creating a node certificate.
   
    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Node|`<DeviceSerialNo>.<DnsDomain>`|`*.<DnsDomain><DeviceSerialNo>.<DnsDomain>`|`mydevice1.microsoftdatabox.com` |
   

## Endpoint certificates

For any endpoints that the device exposes, a certificate is required for trusted communication. The endpoint certificates include those required when accessing the Azure Resource Manager and the blob storage via the REST APIs. 

When you bring in a signed certificate of your own, you also need the corresponding signing chain of the certificate. For the signing chain, Azure Resource Manager, and the blob certificates on the device, you will need the corresponding certificates on the client machine also to authenticate and communicate with the device.

### Caveats

- The endpoint certificates need to be in .pfx format with a private key. Signing chain should be *.cer*. 
- When you bring your own endpoint certificates, these can be as individual certificates or multidomain certificates. 
- If you are bringing in signing chain, the signing chain certificate must be uploaded before you upload an endpoint certificate.
- These certificates must be changed if the device name and the DNS domain names changes.
- A wildcard endpoint certificate can be used.
- The properties of the endpoint certificates are similar to those of a typical SSL certificate. 
- Use the following table when creating an endpoint certificate:

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Azure Resource Manager|`management.<Device name>.<Dns Domain>`|`login.<Device name>.<Dns Domain><br>management.<Device name>.<Dns Domain>`|`management.mydevice1.microsoftdatabox.com` |
    |Blob storage|`*.blob.<Device name>.<Dns Domain>`|`*.blob.< Device name>.<Dns Domain>`|`*.blob.mydevice1.microsoftdatabox.com` |
    |Multi-SAN single certificate for both endpoints|`<Device name>.<dnsdomain>|login.<Device name>.<Dns Domain><br>management.<Device name>.<Dns Domain><br>*.blob.<Device name>.<Dns Domain>`|`mydevice1.microsoftdatabox.com` |


## Local UI certificates

You can access the local web UI of your device via a browser. To ensure that this communication is secure, you can upload your own certificate. 

### Caveats

- The local UI certificate is also uploaded in a *.pfx* format with a private key.
- After you upload the local UI certificate, you will need to restart the browser and clear the cache. Refer to the specific instructions for your browser.

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Local UI| `<Device name>.<DnsDomain>`|`<Device name>.<DnsDomain>`| `mydevice1.microsoftdatabox.com` |
   

## IoT Edge device certificates

Your Azure Stack Edge device is also an IoT device with the compute enabled by an IoT Edge device connected to it. For any secure communication between this IoT Edge device and the downstream devices that may connect to it, you can also upload IoT Edge certificates. 

There are three IoT Edge certificates that you need to install to enable this trust relation:

- Root certificate authority or the owner certificate authority – If tiering to Azure Stack, then this root certificate comes from Azure Stack.
- Device certificate authority 
- Device key certificate

### Caveats

- The IoT Edge certificates are uploaded in *.pem* format. 
- Use the following guidance when creating IoT device certificates.

For more information on IoT Edge certificates, see [Azure IoT Edge certificate details](azure-stack-edge-r-series-placeholder.md).

## Support session certificates

If your Azure Stack Edge device is experiencing any issues, then to troubleshoot those issues, a remote PowerShell Support session may be opened on the device. To enable a secure, encrypted communication over this Support session, you can upload a certificate. 

### Caveats

- The Support session certificate must be provided in a *.cer* format.
- Use the following guidance when creating Support session certificates.

## VPN certificates

If VPN is configured on your Azure Stack Edge device, then you will also need a certificate for any communication that occurs over the VPN channel. You can bring your own VPN certificate to ensure the communication is trusted.

### Caveats

- The VPN certificate must be provided in a *.cer* format.
- Use the following guidance when creating VPN certificates.

## Create and upload certificates

The following section describes the procedure to create signing chain and endpoint certificates, import these certificates on your Windows client, and finally upload these certificates on the device.

### Create certificates

You will have a defined way to create the certificates for the devices operating in your environment. **For development or test purposes only, you can also use Windows PowerShell to create certificates on your local system.** While creating the certificates for the client, follow these guidelines:

1. You can create any of the following types of certificates:

    - Create a single certificate valid for use with a single fully qualified domain name (FQDN). For example, *www.mydomain.com*.
    - Create a wildcard certificate to secure the main domain name and multiple sub domains as well. For example, **.mydomain.com*.
    - Create a subject alternative name (SAN) certificate that will cover multiple domain names in a single certificate. 

2. If you are bringing your own certificate, you will need a root certificate for the signing chain. See steps to [Create signing chain and endpoint certificates](azure-stack-edge-r-series-placeholder.md).

3. You can next create the endpoint certificates for the local UI of the appliance, blob, and Azure Resource Manager. You can create 3 separate certificates for the appliance, blob, and ARM or you can create one certificate for all the 3 endpoints. For detailed steps, see [Create signing and endpoint certificates](azure-stack-edge-r-series-placeholder.md).

4. Whether you are creating 3 separate certificates or one certificate, specify the subject names (SN) and subject alternative names (SAN) as per the guidance provided for each certificate type. 

Once the certificates are created, the next step is to upload the certificates on your Azure Stack Edge device


### Upload certificates 

The certificates that you created in the previous step will be in the Personal store on your client. These certificates need to be exported on your client into appropriate format files that can then be uploaded to your device.

1. The root certificate must be exported as a *.cer* format file. For detailed steps, see [Export certificates as a *.cer* format file](azure-stack-edge-r-series-placeholder.md).
2. The endpoint certificates must be exported as *.pfx* files with private keys. For detailed steps, see [Export certificates as *.pfx* file with private keys](azure-stack-edge-r-series-placeholder.md). 
3. The root and endpoint certificates are then uploaded on the device using the **+ Add certificate** option on the Certificates page in the local web UI. 

    1. Upload the root certificates first. In the local web UI, go to **Certificates > + Add certificate**.

        ![Add signing chain certificate](media/azure-stack-edge-series-manage-certificates/add-cert-1.png)

    2. Next upload the endpoint certificates. 

        ![Add signing chain certificate](media/azure-stack-edge-series-manage-certificates/add-cert-2.png)

        Choose the certificate files in *.pfx* format and enter the password you supplied when you exported the certificate. The Azure Resource Manager certificate may take a few minutes to apply.

        If the signing chain is not updated first, and you try to upload the endpoint certificates, then you will get an error.

        ![Apply certificate error](media/azure-stack-edge-series-manage-certificates/apply-cert-error-1.png)

        Go back and upload the signing chain certificate and then upload and apply the endpoint certificates.

> [!IMPORTANT]
> If the device name or the DNS domain are changed, new certificates must be created. The client certificates and the device certificates should then be updated with the new device name and DNS domain. 

### Import certificates on the client accessing the device

The certificates that you created in the previous step must be imported on your Windows client into the appropriate certificate store.

1. The root certificate that you exported as the *.cer* should now be imported in the Trusted Root Certificate Authorities on your client system. For detailed steps, see [Import certificates into the Trusted Root Certificate Authorities store](azure-stack-edge-r-series-placeholder.md).

2. The endpoint certificates that you exported as the *.pfx* must be exported as *.cer*. This *.cer* is then imported in the Personal certificate store on your system. For detailed steps, see [Import certificates into the Personal certificate store](azure-stack-edge-r-series-placeholder.md).

## Supported certificate algorithms

Certificate algorithms are cryptographic algorithms that describe the mathematical procedures that are used for creating key pairs and performing digital signature operations. The Elliptic Curve Cryptographic (ECC) and RSA algorithms are the supported public key algorithms from which you can choose to generate the public-private key pair. 

The certificate contains information to specify which algorithm to use for the key. Certificates that contain an RSA public key are referred to as RSA certificates. Certificates that contain an ECC public key are referred to as ECDSA (Elliptic Curve Digital Signature Algorithm) certificates. 

> [!IMPORTANT]
> Only the RSA certificates are supported with your Azure Stack Edge device. If ECDSA certificates are used, then the device behavior is indeterminate.

## View certificate expiry

If you bring in your own certificates, the certificates will expire typically in 1 year or 6 months. To view the expiration date on your certificate, go to the **Certificates** page in the local web UI of your device. If you select a specific certificate, you can view the expiration date on your certificate.

## Rotate certificates

Rotation of certificates is not implemented in this release. You are also not notified of the pending expiration date on your certificate. 

View the certificate expiration date on the **Certificates** page in the local web UI of your device. Once the certificate expiration is approaching, create and upload new certificates as per the detailed instructions in [Create and upload certificates](azure-stack-edge-r-series-placeholder.md).

## Next steps

[Deploy your Azure Stack Edge device](azure-stack-edge-r-series-placeholder.md)
