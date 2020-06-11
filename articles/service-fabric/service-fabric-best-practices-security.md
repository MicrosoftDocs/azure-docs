---
title: Azure Service Fabric security best practices
description: Best practices and design considerations for keeping Azure Service Fabric clusters and applications secure.
author: peterpogorski
ms.topic: conceptual
ms.date: 01/23/2019
ms.author: pepogors
---

# Azure Service Fabric security 

For more information about [Azure Security Best Practices](https://docs.microsoft.com/azure/security/), review [Azure Service Fabric security best practices](https://docs.microsoft.com/azure/security/fundamentals/service-fabric-best-practices)

## Key Vault

[Azure Key Vault](https://docs.microsoft.com/azure/key-vault/) is the recommended secrets management service for Azure Service Fabric applications and clusters.
> [!NOTE]
> If certificates/secrets from a Key Vault are deployed to a Virtual Machine Scale Set as a Virtual Machine Scale Set Secret, then the Key Vault and Virtual Machine Scale Set must be co-located.

## Create certificate authority issued Service Fabric certificate

An Azure Key Vault certificate can be either created or imported into a Key Vault. When a Key Vault certificate is created, the private key is created inside the Key Vault and never exposed to the certificate owner. Here are the ways to create a certificate in Key Vault:

- Create a self-signed certificate to create a public-private key pair and associate it with a certificate. The certificate will be signed by its own key. 
- Create a new certificate manually to create a public-private key pair and generate an X.509 certificate signing request. The signing request can be signed by your registration authority or certification authority. The signed x509 certificate can be merged with the pending key pair to complete the KV certificate in Key Vault. Although this method requires more steps, it does provide you with greater security because the private key is created in and restricted to Key Vault. This is explained in the diagram below. 

Review [Azure Keyvault Certificate Creation Methods](https://docs.microsoft.com/azure/key-vault/create-certificate) for additional details.

## Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets

To deploy certificates from a co-located keyvault to a Virtual Machine Scale Set, use Virtual Machine Scale Set [osProfile](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile). The following are the Resource Manager template properties:

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

[Virtual Machine Scale Set extensions](https://docs.microsoft.com/cli/azure/vmss/extension?view=azure-cli-latest) publisher Microsoft.Azure.ServiceFabric is used to configure your Nodes Security.
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

To secure your Service Fabric cluster by certificate `Common Name`, use the Resource Manager template property [certificateCommonNames](https://docs.microsoft.com/rest/api/servicefabric/sfrp-model-clusterproperties#certificatecommonnames), as follows:

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

For additional details on how to configure DNS Service to resolve your domain to a Microsoft IP address, review how to configure [Azure DNS to host your domain](https://docs.microsoft.com/azure/dns/dns-delegate-domain-azure-dns).

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

To [set up an encryption certificate and encrypt secrets on Windows clusters](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management-windows):

Generate a self-signed certificate for encrypting your secret:

```powershell
New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
```

Use the instructions in [Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets](#deploy-key-vault-certificates-to-service-fabric-cluster-virtual-machine-scale-sets) to deploy Key Vault Certificates to your Service Fabric Cluster's Virtual Machine Scale Sets.

Encrypt your secret using the following PowerShell command, and then update your Service Fabric application manifest with the encrypted value:

``` powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```

To [set up an encryption certificate and encrypt secrets on Linux clusters](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management-linux):

Generate a self-signed certificate for encrypting your secrets:

```bash
user@linux:~$ openssl req -newkey rsa:2048 -nodes -keyout TestCert.prv -x509 -days 365 -out TestCert.pem
user@linux:~$ cat TestCert.prv >> TestCert.pem
```

Use the instructions in [Deploy Key Vault certificates to Service Fabric cluster virtual machine scale sets](#deploy-key-vault-certificates-to-service-fabric-cluster-virtual-machine-scale-sets) to your Service Fabric Cluster's Virtual Machine Scale Sets.

Encrypt your secret using the following commands, and then update your Service Fabric Application Manifest with the encrypted value:

```bash
user@linux:$ echo "Hello World!" > plaintext.txt
user@linux:$ iconv -f ASCII -t UTF-16LE plaintext.txt -o plaintext_UTF-16.txt
user@linux:$ openssl smime -encrypt -in plaintext_UTF-16.txt -binary -outform der TestCert.pem | base64 > encrypted.txt
```

After encrypting your protected values, [specify encrypted secrets in Service Fabric Application](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management#specify-encrypted-secrets-in-an-application), and [decrypt encrypted secrets from service code](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management#decrypt-encrypted-secrets-from-service-code).

## Include certificate in Service Fabric applications

To give your application access to secrets, include the certificate by adding a **SecretsCertificate** element to the application manifest.

```xml
<ApplicationManifest … >
  ...
  <Certificates>
    <SecretsCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbrint]"/>
  </Certificates>
</ApplicationManifest>
```
## Authenticate Service Fabric applications to Azure Resources using Managed Service Identity (MSI)

To learn about managed identities for Azure resources, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).
Azure Service Fabric clusters are hosted on Virtual Machine Scale Sets, which support [Managed Service Identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-msi#azure-services-that-support-managed-identities-for-azure-resources).
To get a list of services that MSI can be used to authenticate to, see [Azure Services that support Azure Active Directory Authentication](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-msi#azure-services-that-support-azure-ad-authentication).


To enable system assigned managed identity during the creation of a virtual machines scale set or an existing virtual machines scale set, declare the following `"Microsoft.Compute/virtualMachinesScaleSets"` property:

```json
"identity": { 
    "type": "SystemAssigned"
}
```
See [What is managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vmss#system-assigned-managed-identity) for more information.

If you created a  [user-assigned managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm#create-a-user-assigned-managed-identity), declare the following resource in your template to assign it to your virtual machine scale set. Replace `\<USERASSIGNEDIDENTITYNAME\>` with the name of the user-assigned managed identity you created:

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
principalid=$(az resource show --id /subscriptions/<YOUR SUBSCRIPTON>/resourceGroups/<YOUR RG>/providers/Microsoft.Compute/virtualMachineScaleSets/<YOUR SCALE SET> --api-version 2018-06-01 | python -c "import sys, json; print(json.load(sys.stdin)['identity']['principalId'])")

az role assignment create --assignee $principalid --role 'Contributor' --scope "/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/<PROVIDER NAME>/<RESOURCE TYPE>/<RESOURCE NAME>"
```

In your Service Fabric application code, [obtain an access token](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http) for Azure Resource Manager by making a REST all similar to the following:

```bash
access_token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true | python -c "import sys, json; print json.load(sys.stdin)['access_token']")

```

Your Service Fabric app can then use the access token to authenticate to Azure Resources that support Active Directory.
The following example shows how to do this for Cosmos DB resource:

```bash
cosmos_db_password=$(curl 'https://management.azure.com/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/Microsoft.DocumentDB/databaseAccounts/<YOUR ACCOUNT>/listKeys?api-version=2016-03-31' -X POST -d "" -H "Authorization: Bearer $access_token" | python -c "import sys, json; print(json.load(sys.stdin)['primaryMasterKey'])")
```
## Windows security baselines
[We recommend that you implement an industry-standard configuration that is broadly known and well-tested, such as Microsoft security baselines, as opposed to creating a baseline yourself](https://docs.microsoft.com/windows/security/threat-protection/windows-security-baselines); an option for provisioning these on your Virtual Machine Scale Sets is to use Azure Desired State Configuration (DSC) extension handler, to configure the VMs as they come online, so they are running the production software.

## Azure Firewall
[Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It is a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.](https://docs.microsoft.com/azure/firewall/overview); this enables the ability to limit outbound HTTP/S traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature does not require TLS/SSL termination. Its recommended that you leverage [Azure Firewall FQDN tags](https://docs.microsoft.com/azure/firewall/fqdn-tags) for Windows Updates, and to enable network traffic to Microsoft Windows Update endpoints can flow through your firewall. [Deploy Azure Firewall using a template](https://docs.microsoft.com/azure/firewall/deploy-template) provides a sample for Microsoft.Network/azureFirewalls resource template definition. Firewall rules common to Service Fabric Applications is to allow the following for your clusters virtual network:

- *download.microsoft.com
- *servicefabric.azure.com
- *.core.windows.net

These firewall rules complement your allowed outbound Network Security Groups, that would include ServiceFabric and Storage, as allowed destinations from your virtual network.

## TLS 1.2
[TSG](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/TLS%20Configuration.md)

## Windows Defender 

By default, Windows Defender antivirus is installed on Windows Server 2016. For details, see [Windows Defender Antivirus on Windows Server 2016](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016). The user interface is installed by default on some SKUs, but is not required. To reduce any performance impact and resource consumption overhead incurred by Windows Defender, and if your security policies allow you to exclude processes and paths for open-source software, declare the following Virtual Machine Scale Set Extension Resource Manager template properties to exclude your Service Fabric cluster from scans:


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
                "Processes": "Fabric.exe;FabricHost.exe;FabricInstallerService.exe;FabricSetup.exe;FabricDeployer.exe;ImageBuilder.exe;FabricGateway.exe;FabricDCA.exe;FabricFAS.exe;FabricUOS.exe;FabricRM.exe;FileStoreService.exe"
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

## Platform Isolation
By default, Service Fabric applications are granted access to the Service Fabric runtime itself, which manifests itself in different forms: [environment variables](service-fabric-environment-variables-reference.md) pointing to file paths on the host corresponding to application and Fabric files, an inter-process communication endpoint which accepts application-specific requests, and the client certificate which Fabric expects the application to use to authenticate itself. In the eventuality that the service hosts itself untrusted code, it is advisable to disable this access to the SF runtime - unless explicitly needed. Access to the runtime is removed using the following declaration in the Policies section of the application manifest: 

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
