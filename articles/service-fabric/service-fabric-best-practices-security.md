---
title: Azure Service Fabric Security | Microsoft Docs
description: Best practices for Azure Service Fabric security.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: pepogors

---
# Azure Service Fabric Security 
For more information about [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/) please check out [Azure Service Fabric security best practices](https://docs.microsoft.com/azure/security/azure-service-fabric-security-best-practices)

## KeyVault
[Azure KeyVault](https://docs.microsoft.com/azure/key-vault/) is the recommended secrets management service for Azure Service Fabric applications and clusters.
> [!NOTE]
> Azure KeyVault and compute resources must be co-located in the same region.  

## Provision Service Fabric Cluster Custom Domain Certificate
The following is the Portal Blade where you can provide the credentials for a KeyVault integrated CA to provision your custom domain certificate:

![Common Name Cert Creation][Image1]

Portal Blade for Keyvault certificates:
```bash
https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/Microsoft.KeyVault/vaults/<YOUR VAULT>/certificates
```

## Deploy KeyVault Certificates to Service Fabric Cluster's Virtual Machine Scale Sets
Virtual Machine Scale Set [osProfile](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) is how you reliably deploy KeyVault certificates to your Service Fabric Cluster's Virtual Machine Scale Sets, and the following are the Resource Manager template properties that you will declare: 
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

## ACL Certificate to your Service Fabric Cluster
[Virtual Machine Scale Set extensions](https://docs.microsoft.com/cli/azure/vmss/extension?view=azure-cli-latest) publisher   Microsoft.Azure.ServiceFabric is how you ACL certificates to your Service Fabric Cluster, and the following are the Resource Manager template properties that you will declare:
```json
"certificate": {
   "commonNames": [
       "[parameters('certificateCommonName')]"
   ],
   "x509StoreName": "[parameters('certificateStoreValue')]"
}
```

## Declare Custom Domain Service Fabric Cluster Certificate
Service Fabric Cluster [certificateCommonNames](https://docs.microsoft.com/rest/api/servicefabric/sfrp-model-clusterproperties#certificatecommonnames) Resource Manager template property, is how you configure the custom domain common name property of your valid certificate, and the following are the Resource Manager template properties that you will declare:
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
Your Service Fabric cluster will use your valid trusted installed certificate, that you declared by common name, which expires further into the future; when more than one valid certificate is installed on your Virtual Machine Scale Sets certificate store.

Given you cannot provision certificates for Microsoft domains, such as *\<YOUR SUBDOMAIN\>.cloudapp.azure.com or \<YOUR SUBDOMAIN\>.trafficmanager.net, from KeyVault integrated 3rd-party Certificate Authorities; you must provision and configure [Azure DNS to host your domain](https://docs.microsoft.com/azure/dns/dns-delegate-domain-azure-dns). After delegating your domains name servers to your Azure DNS zone name servers, you will need to add the following 2 Records Set to your DNS Zone:'A' record for domain APEX that is NOT an "Alias record set" to all IP Addresses your custom domain will resolve, and a 'C' record for Microsoft Subdomain you provisioned  that is NOT an "Alias record set" (E.G. Use your Traffic Manager or Load Balancer's DNS name).

You should also update your Service Fabric Cluster "managementEndpoint" Resource Manager template property to your custom domain, so that portal can display the correct url to connect to your Service Fabric Explorer User Interface, and the follow is the snippet of the property you will update to your custom domain:
```json
 "managementEndpoint": "[concat('https://<YOUR CUSTOM DOMAIN>:',parameters('nt0fabricHttpGatewayPort'))]",
```

## Encrypting Service Fabric Package Secret Values
Common values that are encrypted in Service Fabric Packages include: Azure Container Registry (ACR) credentials, and environment variables.

To [set up an encryption certificate and encrypt secrets on Windows clusters](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management-windows):

Generate a self-signed certificate for encrypting your secret using the following:
```powershell
New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
```
Use the Reliably Deploy KeyVault Certificates to your Service Fabric Cluster's Virtual Machine Scale Sets instructions in this document to deploy/install your certificate.

Encrypt your secret using the following, and update your Service Fabric Application Manifest with the encrypted value:
``` powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```
To [set up an encryption certificate and encrypt secrets on Linux clusters](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management-linux):

Generate a self-signed certificate for encrypting your secrets using the following:
```bash
user@linux:~$ openssl req -newkey rsa:2048 -nodes -keyout TestCert.prv -x509 -days 365 -out TestCert.pem
user@linux:~$ cat TestCert.prv >> TestCert.pem
```
Use the Reliably Deploy KeyVault Certificates to your Service Fabric Cluster's Virtual Machine Scale Sets instructions in this document to deploy/install your certificate.

Encrypt your secret using the following, and update your Service Fabric Application Manifest with the encrypted value:
```bash
user@linux:$ echo "Hello World!" > plaintext.txt
user@linux:$ iconv -f ASCII -t UTF-16LE plaintext.txt -o plaintext_UTF-16.txt
user@linux:$ openssl smime -encrypt -in plaintext_UTF-16.txt -binary -outform der TestCert.pem | base64 > encrypted.txt
```

After encrypting your will need to [specify encrypted secrets in Service Fabric Application](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management#specify-encrypted-secrets-in-an-application), and [decrypt encrypted secrets from service code](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management#decrypt-encrypted-secrets-from-service-code)

## Authenticate Service Fabric Applications to Azure Resources using Managed Service Identity (MSI)
[Managed identities for Azure resources is a feature of Active Directory](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview#how-does-it-work).

To [enable system-assigned managed identity during the creation of a virtual machines scale set or an existing virtual machines scale set](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vmss#system-assigned-managed-identity), declare the following Microsoft.Compute/virtualMachinesScaleSets" property:

```json
"identity": { 
    "type": "SystemAssigned"
}
```

If you created a  [user-assigned managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm#create-a-user-assigned-managed-identity), declare the following resource in your template to assign it to your virtual machine scale set, and replace \<USERASSIGNEDIDENTITYNAME\> with the name of the user-assigned managed identity you created:
```json
"identity": {
    "type": "userAssigned",
    "userAssignedIdentities": {
        "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('<USERASSIGNEDIDENTITYNAME>'))]": {}
    }
}
```

Before your Service Fabric Application can make use of a managed identity, it need have permissions granted to the Azure Resources it needs to authenticate with, and the follow are the commands to grant access to an Azure Resource:

```bash
principalid=$(az resource show --id /subscriptions/<YOUR SUBSCRIPTON>/resourceGroups/<YOUR RG>/providers/Microsoft.Compute/virtualMachineScaleSets/<YOUR SCALE SET> --api-version 2018-06-01 | python -c "import sys, json; print(json.load(sys.stdin)['identity']['principalId'])")

az role assignment create --assignee $principalid --role 'Contributor' --scope "/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/<PROVIDER NAME>/<RESOURCE TYPE>/<RESOURCE NAME>"
```

In your Service Fabric Application Code obtain an access token for Azure Resource Manager by making a rest call that will be similar to the following:

```bash
access_token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true | python -c "import sys, json; print json.load(sys.stdin)['access_token']")

```

Your Service Fabric Application can then use the access token to authenticate to Azure Resources that support Active Directory, and the following is an example of how to do this for cosmos db resource:
```bash
cosmos_db_password=$(curl 'https://management.azure.com/subscriptions/<YOUR SUBSCRIPTION>/resourceGroups/<YOUR RG>/providers/Microsoft.DocumentDB/databaseAccounts/<YOUR ACCOUNT>/listKeys?api-version=2016-03-31' -X POST -d "" -H "Authorization: Bearer $access_token" | python -c "import sys, json; print(json.load(sys.stdin)['primaryMasterKey'])")
```

## Windows Defender 
"[By default](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016), Windows Defender Antimalware is installed and functional on Windows Server 2016. The user interface is installed by default on some SKUs, but is not required." Given the performance impact and resource consumption overhead, if your security policies allow you to exclude processes and paths for open source software, then you will declare the following Virtual Machine Scale Set Extension Resource Manager template properties:

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
> Please refer to your Antimalware documentation for configuring rules if not using Windows Defender; Windows Defender isn't supported on none windows Operating System distributions.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[Image1]: ./media/service-fabric-best-practices/generate-common-name-cert-portal.png
