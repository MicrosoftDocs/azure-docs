---
title: Azure Service Fabric security best practices
description: Best practices and design considerations for keeping Azure Service Fabric clusters and applications secure.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: ignite-2022
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric security 

For more information about [Azure Security Best Practices](../security/index.yml), review [Azure Service Fabric security best practices](../security/fundamentals/service-fabric-best-practices.md)

## Key Vault

[Azure Key Vault](../key-vault/index.yml) is the recommended secrets management service for Azure Service Fabric applications and clusters.
> [!NOTE]
> If certificates/secrets from a Key Vault are deployed to a Virtual Machine Scale Set as a Virtual Machine Scale Set Secret, then the Key Vault and Virtual Machine Scale Set must be co-located.

## Create certificate authority issued Service Fabric certificate

An Azure Key Vault certificate can be either created or imported into a Key Vault. When a Key Vault certificate is created, the private key is created inside the Key Vault and never exposed to the certificate owner. Here are the ways to create a certificate in Key Vault:

- Create a self-signed certificate to create a public-private key pair and associate it with a certificate. The certificate will be signed by its own key. 
- Create a new certificate manually to create a public-private key pair and generate an X.509 certificate signing request. The signing request can be signed by your registration authority or certification authority. The signed x509 certificate can be merged with the pending key pair to complete the KV certificate in Key Vault. Although this method requires more steps, it does provide you with greater security because the private key is created in and restricted to Key Vault. This is explained in the diagram below. 

Review [Azure Keyvault Certificate Creation Methods](../key-vault/certificates/create-certificate.md) for additional details.

## Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets

To deploy certificates from a co-located keyvault to a Virtual Machine Scale Set, use Virtual Machine Scale Set [osProfile](/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile). The following are the Resource Manager template properties:

```json
"secrets": [
   {
       "sourceVault": {
           "id": "[parameters('sourceVaultValue')]"
       },
       "vaultCertificates": [
          {
              "certificateStore": "[parameters('certificateStoreValue')]",
              "certificateUrl": "[parameters('certificateUrlValue')]"
          }
       ]
   }
]
```

> [!NOTE]
> The vault must be enabled for Resource Manager template deployment.

## Apply an Access Control List (ACL) to your certificate for your Service Fabric cluster

[Virtual Machine Scale Set extensions](/cli/azure/vmss/extension) publisher Microsoft.Azure.ServiceFabric is used to configure your Nodes Security.
To apply an ACL to your certificates for your Service Fabric Cluster processes, use the following Resource Manager template properties:

```json
"certificate": {
   "commonNames": [
       "[parameters('certificateCommonName')]"
   ],
   "x509StoreName": "[parameters('certificateStoreValue')]"
}
```

## Secure a Service Fabric cluster certificate by common name

To secure your Service Fabric cluster by certificate `Common Name`, use the Resource Manager template property [certificateCommonNames](/rest/api/servicefabric/sfrp-model-clusterproperties#certificatecommonnames), as follows:

```json
"certificateCommonNames": {
    "commonNames": [
        {
            "certificateCommonName": "[parameters('certificateCommonName')]",
            "certificateIssuerThumbprint": "[parameters('certificateIssuerThumbprint')]"
        }
    ],
    "x509StoreName": "[parameters('certificateStoreValue')]"
}
```

> [!NOTE]
> Service Fabric clusters will use the first valid certificate it finds in your host's certificate store. On Windows, this will be the certificate with the latest expiring date that matches your Common Name and Issuer thumbprint.

Azure domains, such as *\<YOUR SUBDOMAIN\>.cloudapp.azure.com or \<YOUR SUBDOMAIN\>.trafficmanager.net, are owned by Microsoft. Certificate Authorities will not issue certificates for domains to unauthorized users. Most users will need to purchase a domain from a registrar, or be an authorized domain admin, for a certificate authority to issue you a certificate with that common name.

For additional details on how to configure DNS Service to resolve your domain to a Microsoft IP address, review how to configure [Azure DNS to host your domain](../dns/dns-delegate-domain-azure-dns.md).

> [!NOTE]
> After delegating your domains name servers to your Azure DNS zone name servers, add the following two records to your DNS Zone:
> - An 'A' record for domain APEX that is NOT an `Alias record set` to all IP Addresses your custom domain will resolve.
> - A 'C' record for Microsoft sub domains you provisioned that are NOT an `Alias record set`. For example, you could use your Traffic Manager or Load Balancer's DNS name.

To update your portal to display a custom DNS name for your Service Fabric Cluster `"managementEndpoint"`, update the follow Service Fabric Cluster Resource Manager template properties:

```json
 "managementEndpoint": "[concat('https://<YOUR CUSTOM DOMAIN>:',parameters('nt0fabricHttpGatewayPort'))]",
```

## Encrypting Service Fabric package secret values

Common values that are encrypted in Service Fabric Packages include Azure Container Registry (ACR) credentials, environment variables, settings, and Azure Volume plugin storage account keys.

To [set up an encryption certificate and encrypt secrets on Windows clusters](./service-fabric-application-secret-management-windows.md):

Generate a self-signed certificate for encrypting your secret:

```powershell
New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
```

Use the instructions in [Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets](#deploy-key-vault-certificates-to-service-fabric-cluster-virtual-machine-scale-sets) to deploy Key Vault Certificates to your Service Fabric Cluster's Virtual Machine Scale Sets.

Encrypt your secret using the following PowerShell command, and then update your Service Fabric application manifest with the encrypted value:

``` powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```

To [set up an encryption certificate and encrypt secrets on Linux clusters](./service-fabric-application-secret-management-linux.md):

Generate a self-signed certificate for encrypting your secrets:

```bash
openssl req -newkey rsa:2048 -nodes -keyout TestCert.prv -x509 -days 365 -out TestCert.pem
cat TestCert.prv >> TestCert.pem
```

Use the instructions in [Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets](#deploy-key-vault-certificates-to-service-fabric-cluster-virtual-machine-scale-sets) to your Service Fabric Cluster's Virtual Machine Scale Sets.

Encrypt your secret using the following commands, and then update your Service Fabric Application Manifest with the encrypted value:

```bash
echo "Hello World!" > plaintext.txt
iconv -f ASCII -t UTF-16LE plaintext.txt -o plaintext_UTF-16.txt
openssl smime -encrypt -in plaintext_UTF-16.txt -binary -outform der TestCert.pem | base64 > encrypted.txt
```

After encrypting your protected values, [specify encrypted secrets in Service Fabric Application](./service-fabric-application-secret-management.md#specify-encrypted-secrets-in-an-application), and [decrypt encrypted secrets from service code](./service-fabric-application-secret-management.md#decrypt-encrypted-secrets-from-service-code).

## Include endpoint certificate in Service Fabric applications

To configure your application endpoint certificate, include the certificate by adding a **EndpointCertificate** element along with the **User** element for the principal account to the application manifest. By default the principal account is NetworkService. This will provide management of the application certificate private key ACL for the provided principal.

```xml
<ApplicationManifest … >
  ...
  <Principals>
    <Users>
      <User Name="Service1" AccountType="NetworkService" />
    </Users>
  </Principals>
  <Certificates>
    <EndpointCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbprint]"/>
  </Certificates>
</ApplicationManifest>
```

## Include secret certificate in Service Fabric applications

To give your application access to secrets, include the certificate by adding a **SecretsCertificate** element to the application manifest.

```xml
<ApplicationManifest … >
  ...
  <Certificates>
    <SecretsCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbprint]"/>
  </Certificates>
</ApplicationManifest>
```
## Authenticate Service Fabric applications to Azure Resources using Managed Service Identity (MSI)

To learn about managed identities for Azure resources, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).
Azure Service Fabric clusters are hosted on Virtual Machine Scale Sets, which support [Managed Service Identity](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-managed-identities-for-azure-resources).
To get a list of services that MSI can be used to authenticate to, see [Azure Services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).


To enable system assigned managed identity during the creation of a virtual machines scale set or an existing virtual machines scale set, declare the following `"Microsoft.Compute/virtualMachinesScaleSets"` property:

```json
"identity": { 
    "type": "SystemAssigned"
}
```
See [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vmss.md#system-assigned-managed-identity) for more information.

If you created a  [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm.md#create-a-user-assigned-managed-identity), declare the following resource in your template to assign it to your virtual machine scale set. Replace `\<USERASSIGNEDIDENTITYNAME\>` with the name of the user-assigned managed identity you created:

```json
"identity": {
    "type": "userAssigned",
    "userAssignedIdentities": {
        "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
    }
}
```

Before your Service Fabric application can make use of a managed identity, permissions must be granted to the Azure Resources it needs to authenticate with.
The following commands grant access to an Azure Resource:

```bash
PRINCIPAL_ID=$(az resource show --id /subscriptions/<YOUR SUBSCRIPTON>/resourceGroups/<YOUR RG>/providers/Microsoft.Compute/virtualMachineScaleSets/<YOUR SCALE SET> --api-version 2018-06-01 | python -c "import sys, json; print(json.load(sys.stdin)['identity']['principalId'])")

az role assignment create --assignee $PRINCIPAL_ID --role 'Contributor' --scope "/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/<PROVIDER NAME>/<RESOURCE TYPE>/<RESOURCE NAME>"
```

In your Service Fabric application code, [obtain an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http) for Azure Resource Manager by making a REST all similar to the following:

```bash
ACCESS_TOKEN=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true | python -c "import sys, json; print json.load(sys.stdin)['access_token']")

```

Your Service Fabric app can then use the access token to authenticate to Azure Resources that support Active Directory.
The following example shows how to do this for a Azure Cosmos DB resource:

```bash
COSMOS_DB_PASSWORD=$(curl 'https://management.azure.com/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/Microsoft.DocumentDB/databaseAccounts/<YOUR ACCOUNT>/listKeys?api-version=2016-03-31' -X POST -d "" -H "Authorization: Bearer $ACCESS_TOKEN" | python -c "import sys, json; print(json.load(sys.stdin)['primaryMasterKey'])")
```
## Windows security baselines
[We recommend that you implement an industry-standard configuration that is broadly known and well-tested, such as Microsoft security baselines, as opposed to creating a baseline yourself](/windows/security/threat-protection/windows-security-baselines); an option for provisioning these on your Virtual Machine Scale Sets is to use Azure Desired State Configuration (DSC) extension handler, to configure the VMs as they come online, so they are running the production software.

## Azure Firewall
[Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It is a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.](../firewall/overview.md); this enables the ability to limit outbound HTTP/S traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature does not require TLS/SSL termination. Its recommended that you leverage [Azure Firewall FQDN tags](../firewall/fqdn-tags.md) for Windows Updates, and to enable network traffic to Microsoft Windows Update endpoints can flow through your firewall. [Deploy Azure Firewall using a template](../firewall/deploy-template.md) provides a sample for Microsoft.Network/azureFirewalls resource template definition. Firewall rules common to Service Fabric Applications is to allow the following for your clusters virtual network:

- *download.microsoft.com
- *servicefabric.azure.com
- *.core.windows.net

These firewall rules complement your allowed outbound Network Security Groups, that would include ServiceFabric and Storage, as allowed destinations from your virtual network.

## TLS 1.2

Microsoft [Azure recommends](https://azure.microsoft.com/updates/azuretls12/) all customers complete migration towards solutions that support transport layer security (TLS) 1.2 and to make sure that TLS 1.2 is used by default.

Azure services, including [Service Fabric](https://techcommunity.microsoft.com/t5/azure-service-fabric/microsoft-azure-service-fabric-6-3-refresh-release-cu1-notes/ba-p/791493), have completed the engineering work to remove dependency on TLS 1.0/1.1 protocols and provide full support to customers that want to have their workloads configured to accept and initiate only TLS 1.2 connections.

Customers should configure their Azure-hosted workloads and on-premises applications interacting with Azure services to use TLS 1.2 by default. Here's how to [configure Service Fabric cluster nodes and applications](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/TLS%20Configuration.md) to use a specific TLS version.

## Windows Defender 

By default, Windows Defender antivirus is installed on Windows Server 2016. For details, see [Windows Defender Antivirus on Windows Server 2016](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows). The user interface is installed by default on some SKUs, but is not required. To reduce any performance impact and resource consumption overhead incurred by Windows Defender, and if your security policies allow you to exclude processes and paths for open-source software, declare the following Virtual Machine Scale Set Extension Resource Manager template properties to exclude your Service Fabric cluster from scans:


```json
 {
    "name": "[concat('VMIaaSAntimalware','_vmNodeType0Name')]",
    "properties": {
        "publisher": "Microsoft.Azure.Security",
        "type": "IaaSAntimalware",
        "typeHandlerVersion": "1.5",
        "settings": {
            "AntimalwareEnabled": "true",
            "Exclusions": {
                "Paths": "[concat(parameters('svcFabData'), ';', parameters('svcFabLogs'), ';', parameters('svcFabRuntime'))]",
                "Processes": "Fabric.exe;FabricHost.exe;FabricInstallerService.exe;FabricSetup.exe;FabricDeployer.exe;ImageBuilder.exe;FabricGateway.exe;FabricDCA.exe;FabricFAS.exe;FabricUOS.exe;FabricRM.exe;FileStoreService.exe;FabricBRS.exe;BackupCopier.exe"
            },
            "RealtimeProtectionEnabled": "true",
            "ScheduledScanSettings": {
                "isEnabled": "true",
                "scanType": "Quick",
                "day": "7",
                "time": "120"
            }
        },
        "protectedSettings": null
    }
}
```

> [!NOTE]
> Refer to your Antimalware documentation for configuration rules if you are not using Windows Defender. 
> Windows Defender isn't supported on Linux.

## Hosting untrusted applications in a Service Fabric cluster
A Service Fabric cluster is single tenant by design and hosted applications are considered **trusted**. Applications are, therefore, granted access to the Service Fabric runtime, which manifests in different forms, some of which are: [environment variables](service-fabric-environment-variables-reference.md) pointing to file paths on the host corresponding to application and Fabric files, host paths mounted with write access onto container workloads, an inter-process communication endpoint which accepts application-specific requests, and the client certificate which Fabric expects the application to use to authenticate itself.

If you are considering hosting **untrusted applications**, you must take additional steps to define and own the hostile multi-tenant experience for your Service Fabric cluster. This will require you to consider multiple aspects, in the context of your scenario, including, but not limited to, the following:
* A thorough security review of the untrusted applications' interactions with other applications, the cluster itself, and the underlying compute infrastructure.
* Use of the strongest sandboxing technology applicable (e.g., appropriate [isolation modes](/virtualization/windowscontainers/manage-containers/hyperv-container) for container workloads).
* Risk assessment of the untrusted applications escaping the sandboxing technology, as the next trust and security boundary is the cluster itself.
* Removal of the untrusted applications' [access to Service Fabric runtime](service-fabric-service-model-schema-complex-types.md#servicefabricruntimeaccesspolicytype-complextype).

### RemoveServiceFabricRuntimeAccess
Access to Service Fabric runtime can be removed by using the following declaration in the Policies section of the application manifest: 

```xml
<ServiceManifestImport>
    <Policies>
        <ServiceFabricRuntimeAccessPolicy RemoveServiceFabricRuntimeAccess="true"/>
    </Policies>
</ServiceManifestImport>

```

## Next steps

* Create a cluster on VMs, or computers, running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md).
* Create a cluster on VMs, or computers, running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md).
* Learn about [Service Fabric support options](service-fabric-support.md).

[Image1]: ./media/service-fabric-best-practices/generate-common-name-cert-portal.png
