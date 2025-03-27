---
title: 'Create S2S VPN connection between on-premises network and Azure virtual network - certificate authentication: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN Gateway server settings for site-to-site configurations - certificate authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 12/17/2024
ms.author: cherylmc

#customer intent: As a network engineer, I want to create a site-to-site VPN connection between my on-premises location and my Azure virtual network using certificate authentication and Azure Key Vault.

---
# Configure a S2S VPN Gateway certificate authentication connection - Preview

In this article, you use the Azure portal to create a site-to-site (S2S) certificate authentication VPN gateway connection between your on-premises network and your virtual network. The steps for this configuration use Managed Identity, Azure Key Vault, and certificates. If you need to create a site-to-site VPN connection that uses a shared key instead, see [Create a S2S VPN connection](tutorial-site-to-site-portal.md).

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Diagram that shows site-to-site VPN gateway cross-premises connections." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

## Prerequisites

> [!NOTE]
> Site-to-site certificate authentication isn't supported on Basic SKU VPN gateways.

* You already have a virtual network and a VPN gateway. If you don't, follow the steps to [Create a VPN gateway](tutorial-create-gateway-portal.md), then return to this page to configure your site-to-site certificate authentication connection.

* Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).

* Verify that you have an externally facing public IPv4 address for your VPN device.

* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure routes to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.

## <a name="identity"></a>Create a Managed Identity

This configuration requires a managed identity. For more information about managed identities, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)? If you already have a user-assigned managed identity, you can use it for this exercise. If not, use the following steps to create a managed identity.

1. In the Azure portal, search for and select **Managed Identities**.
1. Select **Create**.
1. Input the required information. When you create the name, use something intuitive. For example, **site-to-site-managed** or **vpngwy-managed**. You need the name for key vault configuration steps. The **Resource group** doesn't have to be the same as the resource group that you use for your VPN gateway.
1. Select **Review + create**.
1. The values validate. When validation completes, select **Create**.

## <a name="enable"></a>Enable VPN Gateway for Key Vault and Managed Identity

In this section, you enable the gateway for Azure Key Vault and the managed identity you created earlier. For more information about Azure Key Vault, see [About Azure Key Vault](/azure/key-vault/general/overview).

1. In the portal, go to your virtual network gateway (VPN gateway).
1. Go to **Settings -> Configuration**. On the Configuration page, specify the following authentication settings:
   * **Enable Key Vault Access**: Enabled.
   * **Managed Identity**: Select the **Managed Identity** you created earlier.
1. Save your settings.

## <a name="LocalNetworkGateway"></a>Create a local network gateway

The local network gateway is a specific object that represents your on-premises location (the site) for routing purposes. You give the site a name by which Azure can refer to it, and then specify the IP address of the on-premises VPN device to which you create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later.

> [!NOTE]
> The local network gateway object is deployed in Azure, not to your on-premises location.

Create a local network gateway by using the following values:

* **Name**: Site1
* **Resource Group**: TestRG1
* **Location**: East US

[!INCLUDE [Add a local network gateway](../../includes/vpn-gateway-add-local-network-gateway-portal-include.md)]

## <a name="generatecert"></a>Certificates

Site-to-site certificate authentication architecture relies on both inbound and outbound certificates.

> [!NOTE]
> The inbound and outbound certificates don't need to be generated from the same root certificate.

**Outbound certificate**

* The outbound certificate is used to verify connections coming from Azure to your on-premises site.
* The certificate is stored in Azure Key Vault. You specify the outbound certificate path identifier when you configure your site-to-site connection.
* You can create a certificate using a certificate authority of your choice, or you can create a self-signed root certificate.

When you generate an **outbound certificate**, the certificate must adhere to the following guidelines:

* Minimum key length of 2048 bits.
* Must have a private key.
* Must have server and client authentication.
* Must have a subject name.

**Inbound certificate**

* The inbound certificate is used when connecting from your on-premises location to Azure.
* The subject name value is used when you configure your site-to-site connection.
* The certificate chain public key is specified when you configure your site-to-site connection.

### Generate certificates

Use PowerShell locally on your computer to generate certificates. The following steps show you how to create a self-signed root certificate and leaf certificates (inbound and outbound). When using the following examples, don't close the PowerShell window between creating the self-signed Root CA and the leaf certificates.

#### <a name="rootcert"></a>Create a self-signed root certificate

Use the New-SelfSignedCertificate cmdlet to create a self-signed root certificate. For more information about parameters, see [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate).

1. From a computer running Windows 10 or later, or Windows Server 2016, open a Windows PowerShell console with elevated privileges.
1. Create a self-signed root certificate. The following example creates a self-signed root certificate named 'VPNRootCA01', which is automatically installed in 'Certificates-Current User\Personal\Certificates'. Once the certificate is created, you can view it by opening *certmgr.msc*, or *Manage User Certificates*.

   Make any needed modifications before using this example. The 'NotAfter' parameter is optional. By default, without this parameter, the certificate expires in one year.

   ```powershell
   $params = @{
       Type = 'Custom'
       Subject = 'CN=VPNRootCA01'
       KeySpec = 'Signature'
       KeyExportPolicy = 'Exportable'
       KeyUsage = 'CertSign'
       KeyUsageProperty = 'Sign'
       KeyLength = 2048
       HashAlgorithm = 'sha256'
       NotAfter = (Get-Date).AddMonths(120)
       CertStoreLocation = 'Cert:\CurrentUser\My'
       TextExtension = @('2.5.29.19={critical}{text}ca=1&pathlength=4')
   }
   $cert = New-SelfSignedCertificate @params
   ```

1. To generate leaf certificates, leave the PowerShell console open and proceed with the next steps.
  
#### <a name="outbound "></a>Generate leaf certificates

These examples use the [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate) cmdlet to generate outbound and inbound leaf certificates. Certificates are automatically installed in 'Certificates - Current User\Personal\Certificates' on your computer.

**Outbound certificate**

```powershell

   $params = @{
       Type = 'Custom'
       Subject = 'CN=Outbound-certificate'
       KeySpec = 'Signature'
       KeyExportPolicy = 'Exportable'
       KeyLength = 2048
       HashAlgorithm = 'sha256'
       NotAfter = (Get-Date).AddMonths(120)
       CertStoreLocation = 'Cert:\CurrentUser\My'
       Signer = $cert
       TextExtension = @(
        '2.5.29.37={text}1.3.6.1.5.5.7.3.2,1.3.6.1.5.5.7.3.1')
   }
   New-SelfSignedCertificate @params
```

**Inbound certificate**

```powershell

   $params = @{
       Type = 'Custom'
       Subject = 'CN=Inbound-certificate'
       KeySpec = 'Signature'
       KeyExportPolicy = 'Exportable'
       KeyLength = 2048
       HashAlgorithm = 'sha256'
       NotAfter = (Get-Date).AddMonths(120)
       CertStoreLocation = 'Cert:\CurrentUser\My'
       Signer = $cert
       TextExtension = @(
        '2.5.29.37={text}1.3.6.1.5.5.7.3.2,1.3.6.1.5.5.7.3.1')
   }
   New-SelfSignedCertificate @params
```

### Outbound certificate - export private key data

Export the **outbound certificate** information (with the private key) to a .pfx or .pem file. You upload this certificate information securely to Azure Key Vault in later steps. To export to .pfx using Windows, use the following steps:

1. To get the certificate *.cer* file, open **Manage user certificates**.
1. Locate the outbound certificate, typically in **Certificates - Current User\Personal\Certificates**, and right-click. Select **All Tasks** -> **Export**. This opens the **Certificate Export Wizard**.
1. In the wizard, select **Next**.
1. Select **Yes, export the private key**, and then select **Next**.
1. On the **Export File Format** page, select **Personal Information Exchange - PKCS #12 (PFX)**. Select the following items:

   * Include all certificates in the certification path if possible
   * Export all extended properties
   * Enable certificate privacy
1. Select **Next**. On the **Security** page, select **Password** and an encryption method. Then, select **Next**.
1. Specify a file name and browse to the location to which you want to export.
1. Select **Finish** to export the certificate.
1. You see a confirmation saying **The export was successful**.

### Inbound certificate - export public key data

Export the public key data for the **inbound certificate**. The information in the file is used for the inbound certificate chain field when you configure your site-to-site connection. Exported files must be in the `.cer` format. Don't encrypt the certificate value.

1. To get the certificate *.cer* file, open **Manage user certificates**.
1. Locate the certificate, typically in **Certificates - Current User\Personal\Certificates**, and right-click. Select **All Tasks** -> **Export**. This opens the **Certificate Export Wizard**.
1. In the wizard, select **Next**.
1. Select **No, do not export the private key**. Then select **Next**.
1. Select **Base-64 encoded X.509 (.CER)**, then select **Next**.
1. Specify a file name and browse to the location to which you want to export.
1. Select **Finish** to export the certificate.
1. You see a confirmation saying **The export was successful**.
1. This `.cer` file is used later, when you configure your connection.

### Root certificate - export public key data

Export the public key data for the **root certificate**. Exported files must be in the `.cer` format. Don't encrypt the certificate value.

1. To get the certificate *.cer* file, open **Manage user certificates**.
1. Locate the certificate, typically in **Certificates - Current User\Personal\Certificates**, and right-click. Select **All Tasks** -> **Export**. This opens the **Certificate Export Wizard**.
1. In the wizard, select **Next**.
1. Select **No, do not export the private key**. Then select **Next**.
1. Select **Base-64 encoded X.509 (.CER)**, then select **Next**.
1. Specify a file name and browse to the location to which you want to export.
1. Select **Finish** to export the certificate.
1. You see a confirmation saying **The export was successful**.
1. This `.cer` file is used later, when you configure your connection.

## Create a key vault

This configuration requires Azure Key Vault. The following steps create a key vault. You add your certificate and Managed Identity to your key vault later. For more comprehensive steps, see [Quickstart - Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

1. In the Azure portal, search for **Key Vaults**. On the **Key vaults** page, select **+Create**.
1. On the **Create a key vault** page, fill out the required information. The resource group doesn't have to be the same as the resource group that you used for your VPN gateway.
1. On the **Access configuration** tab, for Permission model, select **Vault access policy**.
1. Don't fill out any of the other fields.
1. Select **Review + create**, then **Create** the key vault.

## Add the outbound certificate file to your key vault

The following steps help you upload the outbound certificate information to Azure Key Vault.

1. Go to your key vault. In the left pane, open the **Certificates** page.
1. On the **Certificates** page, select **+Generate/Import**.
1. For **Method of Certificate Creation**, select **Import** from the dropdown.
1. Input an intuitive certificate name. This doesn't need to be the certificate CN or the certificate file name.
1. Upload your outbound certificate file. The certificate file must be in one of the following formats:
   * .pfx
   * .pfm
1. Input the password used to protect the certificate information.
1. Select **Create** to upload the certificate file.

## Add the Managed Identity to your key vault

1. Go to your key vault. In the left pane, open the **Access policies** page.
1. Select **+Create**.
1. On the **Create an access policy** page, for **Secret Management Options** and **Certificate Management Operations**, select **Select all**.
1. Select **Next** to move to the *Principal** page.
1. On the **Principal** page, search and select the Managed Identity that you created earlier.
1. Select **Next** and advance to the **Review + create** page. Select **Create**.

## <a name="VPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, configure your VPN device. When you configure your VPN device, you need the following values:

* **Certificate**: You'll need the certificate data used for authentication. This certificate will also be used as the inbound certificate when creating the VPN connection.
* **Public IP address values for your virtual network gateway**: To find the public IP address for your VPN gateway VM instance using the Azure portal, go to your virtual network gateway and look under **Settings** -> **Properties**. If you have an active-active mode gateway (recommended), make sure to set up tunnels to each VM instance. Both tunnels are part of the same connection. Active-active mode VPN gateways have two public IP addresses, one for each gateway VM instance.

[!INCLUDE [Configure a VPN device](../../includes/vpn-gateway-configure-vpn-device-include.md)]

## <a name="CreateConnection"></a>Create the site-to-site connection

In this section, you create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device.

### Gather configuration values

Before moving forward, gather the following information for the required configuration values.

* **Outbound Certificate path**: This is the path to the outbound certificate. The outbound certificate is the certificate used when connecting from Azure to your on-premises location. This information is from the same certificate you uploaded to Azure Key Vault.

   1. Go to **Key Vaults** and click your key vault. In the left pane, expand **Objects** and select **Certificates**.
   1. Locate and click your certificate to open the certificate page.
   1. Click the line for your certificate version.
   1. Copy the path next to **Key Identifier**. The path is specific to the certificate.

  Example: `https://s2s-vault1.vault.azure.net/certificates/site-to-site/<certificate-value>`

* **Inbound certificate subject name**: This is the CN for the inbound certificate. To locate this value:

   1. If you generated the certificate on your Windows computer, you can locate it using **Certificate Management**.
   1. Go to the **Details** tab. Scroll and click **Subject**. You see the values in the lower pane.
   1. Don't include *CN=* in the value.

* **Inbound Certificate Chain**: This certificate information is used only to verify the incoming inbound certificate and doesn't contain private keys. You should always have at least two certificates in the inbound certificate section of the portal.

  If you have intermediate CAs in your certificate chain, first add the root certificate as the first intermediate certificate, then follow that with the inbound intermediate certificate.

  Use the following steps to extract certificate data in the required format for the inbound certificate field.

  1. To extract the certificate data, make sure that you exported your inbound certificate as a Base-64 encoded X.509 (.CER) file in the previous steps. You need to export the certificate in this format so you can open the certificate with text editor.

  1. Locate and open the `.cer` certificate file with a text editor. When copying the certificate data, make sure that you copy the text as one continuous line.

  1. Copy the data that's listed between `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` as one continuous line to the **Inbound Certificate Chain** field when you create a connection.
  
     Example:

     :::image type="content" source="./media/site-to-site-certificate-authentication-gateway-portal/certificate.png" alt-text="Screenshot showing intermediate certificate information in Notepad." lightbox="./media/site-to-site-certificate-authentication-gateway-portal/certificate.png":::

### Create a connection

1. Go to the virtual network gateway you created and select **Connections**.
1. At the top of the **Connections** page, select **+ Add** to open the **Create connection** page.
1. On the **Create connection** page, on the **Basics** tab, configure the values for your connection:
   * Under **Project details**, select the subscription and the resource group where your resources are located.
   * Under **Instance details**, configure the following settings:

     * **Connection type**: Select **Site-to-site (IPSec)**.
     * **Name**: Name your connection. Example: VNet-to-Site1.
     * **Region**: Select the region for this connection.
1. Select the **Settings** tab.

   :::image type="content" source="./media/site-to-site-certificate-authentication-gateway-portal/create-connection.png" alt-text="Screenshot that shows the Settings page." lightbox="./media/site-to-site-certificate-authentication-gateway-portal/create-connection.png":::

   Configure the following values:

   * **Virtual network gateway**: Select the virtual network gateway from the dropdown list.
   * **Local network gateway**: Select the local network gateway from the dropdown list.
   * **Authentication Method**: Select **Key Vault Certificate**.
   * **Outbound Certificate Path**: The path to the outbound certificate that's located in Key Vault. The method to get this information is at the beginning of this section.
   * **Inbound Certificate Subject Name**: The CN for the inbound certificate. The method to get this information is at the beginning of this section.
   * **Inbound Certificate Chain**: The certificate data you copied from the `.cer` file. Copy and paste the certificate information for the inbound certificate. The method to get this information is at the beginning of this section.
   * **IKE Protocol**: Select **IKEv2**.
   * **Use Azure Private IP Address**: Don't select.
   * **Enable BGP**: Only enable if you want to use BGP.
   * **IPsec/IKE policy:** Select **Default**.
   * **Use policy based traffic selector**: Select **Disable**.
   * **DPD timeout in seconds**: Select **45**.
   * **Connection Mode**: Select **Default**. This setting is used to specify which gateway can initiate the connection. For more information, see [VPN Gateway settings - Connection modes](vpn-gateway-about-vpn-gateway-settings.md#connectionmode).
   * For **NAT Rules Associations**, leave both **Ingress** and **Egress** as **0 selected**.
1. Select **Review + create** to validate your connection settings, then select **Create** to create the connection.
1. After the deployment is finished, you can view the connection on the **Connections** page of the virtual network gateway. The status changes from *Unknown* to *Connecting* and then to *Succeeded*.

## Next steps

Once your connection is complete, you can add virtual machines to your VNets. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-network/network-overview.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
