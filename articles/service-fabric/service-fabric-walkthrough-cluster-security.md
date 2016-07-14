
<properties
   pageTitle="Service Fabric cluster security: client authentication with Azure Active Directory | Microsoft Azure"
   description="This article describes how to create a Service Fabric cluster using Azure Active Directory (AAD) for client authentication"
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/22/2016"
   ms.author="vturecek"/>

# Service Fabric security walk-through: Cluster security, AAD, Key Vault, and application secrets in Azure.

This is a step-by-step guide that will walk you through the steps of setting up a secure cluster in Azure and securing secrets in your applications. This guide covers three main topics:

 - Create a secured cluster in Azure through ARM using AAD for user authentication.
 - Manage keys and secrets with Key Vault 
 - Encrypt sensitive configuration values in applications.

This guide uses Azure technologies for cluster security and key and secret management. Application security is configured to be cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere. 

## Log in to Azure
This guide uses [Azure PowerShell](azure-powershell). When starting a new PowerShell session, log in to your Azure account and select your subscription before executing Azure commands.

Login to your azure account:

```powershell
Login-AzureRmAccount
```

Select your subscription:

```powershell
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>
```

## Set up Key Vault

This guide uses Azure Key Vault for cryptographic key management and to securely store secrets.

 - **Keys** are X.509 certificate. When creating a Service Fabric cluster using ARM, a reference to keys in Key Vault is specified in the ARM template so that the Azure resource provider that is creating your cluster can retrieve the certificates and install them on the cluster nodes. Applications and build tools can also use keys stored in Key Vault for o
 - **Secrets** are any string values you want to keep secret, such as passwords and connection strings. These values are kept in Key Vault where they are encrypted and access-controlled. They can be accessed directly from Key Vault at runtime, or at build time and injected into an application configuration file.

This part of the guide will walk you through creating a Key Vault for a Service Fabric cluster in Azure and for Service Fabric applications. For a complete guide on Key Vault, refer to the [Key Vault getting started guide](key-vault-get-started).

### Create a Resource Group

The first step is to create a new resource group specifically for Key Vault. Putting Key Vault into its own resource group is recommended so that you can remove compute and storage resource groups - such as the resource group that has your Service Fabric cluster - without losing your keys and secrets. The resource group that has your Key Vault must be in the same region as the cluster that is using it.

```powershell

	PS C:\Users\vturecek> New-AzureRmResourceGroup -Name mycluster-keyvault -Location 'West US'
	WARNING: The output object type of this cmdlet will be modified in a future release.
	
	ResourceGroupName : mycluster-keyvault
	Location          : westus
	ProvisioningState : Succeeded
	Tags              :
	ResourceId        : /subscriptions/<guid>/resourceGroups/mycluster-keyvault

```

### Create Key Vault 

Create a Key Vault in the new resource group. The Key Vault must be enabled for deployment to allow the Service Fabric resource provider to get certificates from it and install on cluster nodes:

```powershell

	PS C:\Users\vturecek> New-AzureRmKeyVault -VaultName 'myvault' -ResourceGroupName 'mycluster-keyvault' -Location 'West US' -EnabledForDeployment
	
	
	Vault Name                       : myvault
	Resource Group Name              : mycluster-keyvault
	Location                         : West US
	Resource ID                      : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault
	Vault URI                        : https://myvault.vault.azure.net
	Tenant ID                        : <guid>
	SKU                              : Standard
	Enabled For Deployment?          : False
	Enabled For Template Deployment? : False
	Enabled For Disk Encryption?     : False
	Access Policies                  :
	                                   Tenant ID                :    <guid>
	                                   Object ID                :    <guid>
	                                   Application ID           :
	                                   Display Name             :    
	                                   Permissions to Keys      :    get, create, delete, list, update, import, backup, restore
	                                   Permissions to Secrets   :    all
	
	
	Tags                             :
```

If you have an existing Key Vault, you can enable it for deployment using Azure CLI:

```cli
> azure login
> azure account set "your account"
> azure config mode arm 
> azure keyvault list
> azure keyvault set-policy --vault-name "your vault name" --enabled-for-deployment true
```


### Add certificates to Key Vault

Certificates are used to provide authentication and encryption to secure various aspects of a cluster and its applications. For this guide, we will use the following certificates: 

 1. **Cluster server authentication certificate**: This is the certificate that is used for cluster authentication and server authentication and should be a CA-issued certificate in production environments. 
 
    - Cluster authentication is used inside the cluster to authenticate node-to-node traffic. Each node is authenticated using the cluster cert so that the nodes know they are talking to actual cluster nodes. 
    - Server authentication is used for cluster management to authenticate the management endpoints to a management client, so that the management client knows it is talking to the real cluster.
    - An optional set of client certificates can be used to authenticate each user that wants to perform management operations, so that the cluster knows that the clients are who they say they are. In this case, we're using AAD for client authentication, so we don't need any additional client certificates.
    - Cluster auth and server auth can be separate certificates or the same certificate. In this case, we're using the same certificate for both purposes.

 2. **Data encipherment certificate**: This certificate is strictly used for encryption and decryption of configuration values in a service's Settings.xml and is not used for authentication, so it does not necessarily need to be issued by a 3rd-party CA. The certificate key usage include Data Encipherment (10), and should not include Server Authentication or Client Authentication. For example, when creating a self-signed certificate using PowerShell for development, the KeyUsage flag must indicate DataEncipherment:

 ```powershell
New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
```

#### Formatting certificates for Azure resource provider use

Private key files (.pfx) can be added and used directly through Key Vault. However, the Azure resource provider requires keys to be stored in a special JSON format that includes the .pfx as a base-64 encoded string and the private key password. To accommodate these requirements, keys must be placed in a JSON string and then stored as *secrets* in Key Vault.

To make this process easier, a PowerShell module is [available on GitHub](https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers).

Follow these steps to use the module:

  1. Download the entire contents of the repo into a local directory. 
  2. Import the module in your PowerShell window:

  ```powershell
  PS C:\Users\vturecek> Import-Module "C:\users\vturecek\Documents\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
  ```
     
The next two steps will make use of this PowerShell module to add certificates to Key Vault.

#### Add Cluster server authentication certificate to Key Vault

```powershell
PS C:\Users\vturecek> Invoke-AddCertToKeyVault -SubscriptionId <guid> -ResourceGroupName mycluster-keyvault -Location "West US" -VaultName myvault -CertificateName mycert -Password "<password>" -UseExistingCertificate -ExistingPfxFilePath "C:\path\to\key.pfx"
	
	Switching context to SubscriptionId <guid>
	Ensuring ResourceGroup mycluster-keyvault in West US
	WARNING: The output object type of this cmdlet will be modified in a future release.
	Using existing valut myvault in West US
	Reading pfx file from C:\path\to\key.pfx
	Writing secret to myvault in vault myvault
	
	
Name  : CertificateThumbprint
Value : <value>

Name  : SourceVault
Value : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault

Name  : CertificateURL
Value : https://myvault.vault.azure.net:443/secrets/mycert/4d087088df974e869f1c0978cb100e47

```

#### Data encipherment certificate

```powershell
PS C:\Users\vturecek\> Invoke-AddCertToKeyVault -SubscriptionId <guid> -ResourceGroupName mycluster-keyvault -Location "West US" -VaultName myvault -CertificateName mydatae
nciphermentcert -Password "<password>" -UseExistingCertificate -ExistingPfxFilePath "C:\users\vturecek\Documents\mydataenciphermentcert.pfx"

Name  : CertificateThumbprint
Value : <guid>

Name  : SourceVault
Value : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault

Name  : CertificateURL
Value : https://myvault.vault.azure.net:443/secrets/mydataenciphermentcert/2230b060fc3d42258acace873ed00572

```

At this point, you should now have the following set up in Azure:

 - Key Vault resource group
   - Key Vault
    - Cluster server authentication certificate
    - Data encipherment certificate

These are all the Key Vault prerequisites for configuring a Service Fabric cluster ARM template that installs certificates for node authentication, management endpoint security and authentication, and application secret encryption and decryption.

## Create cluster ARM template
In this section, the output of the PowerShell commands used to store keys in Key Vault will be used to define a Service Fabric cluster ARM template. Start with the example template from the [Azure quick start gallery](https://github.com/Azure/azure-quickstart-templates/blob/master/service-fabric-secure-cluster-5-node-1-nodetype-wad/).


### Add certificates

Each certificate that needs to be installed in the cluster must be configured in the osProfile section of the VMSS resource (Microsoft.Compute/virtualMachineScaleSets). This instructs the resource provider to install the certificate on the VMs. 

Certificates are added to a cluster ARM template by referencing the Key Vault that contains the certificate keys. It is recommended that these Key Vault values are placed in an ARM parameters file to keep the ARM template file reusable and free of values specific to a deployment.

#### Add all certificates to the VMSS osProfile

```json
{
  "apiVersion": "2016-03-30",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "osProfile": {
      ...
      "secrets": [
        {
          "sourceVault": {
            "id": "[parameters('sourceVaultValue')]"
          },
          "vaultCertificates": [
            {
              "certificateStore": "[parameters('clusterCertificateStorevalue')]",
              "certificateUrl": "[parameters('clusterCertificateUrlValue')]"
            },
            {
              "certificateStore": "[parameters('enciphermentCertificateStorevalue')",
              "certificateUrl": "[parameters('enciphermentCertificateUrlValue')]"
            },
            ...
          ]
        }
      ]
    }
  }
}
```

The cluster server authentication certificate must also be configured in the Service Fabric cluster resource (Microsoft.ServiceFabric/clusters) and in the Service Fabric extension for VMSS in the VMSS resource. This allows the Service Fabric resource provider to configure it for use for cluster authentication and server authentication for management endpoints.

#### VMSS resource:

```json
{
  "apiVersion": "2016-03-30",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "virtualMachineProfile": {
      "extensionProfile": {
        "extensions": [
          {
            "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
            "properties": {
              ...
              "settings": {
                ...
                "certificate": {
                  "thumbprint": "[parameters('clusterCertificateThumbprint')]",
                  "x509StoreName": "[parameters('clusterCertificateStoreValue')]"
                },
                ...
              }
            }
          }
        ]
      }
    }
  }
}
```

#### Service Fabric resource:

```json
{
  "apiVersion": "2016-03-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  "location": "[parameters('clusterLocation')]",
  "dependsOn": [
    "[concat('Microsoft.Storage/storageAccounts/', variables('supportLogStorageAccountName'))]"
  ],
  "properties": {
    "certificate": {
      "thumbprint": "[parameters('clusterCertificateThumbprint')]",
      "x509StoreName": "[parameters('clusterCertificateStoreValue')]"
    },
    ...
  }
}
```

### Set up AAD for cluster management

Service Fabric management endpoint authentication restricts access to management endpoints to authenticated users. This can be done in two ways:

 - **Certificate authentication:** Install client certificates on the cluster and provide a client certificate to each user that needs access to the cluster. This method of authentication has the benefit of portability as it does not rely on Azure Active Directory, however it requires management of multiple certificates that must be installed in the cluster and on client machines for users that need to access the cluster.
 - **Azure Active Directory:** Authenticate users through Azure Active Directory (AAD). This is much simpler to manage and doesn't require users to install certificates on client machines for access. This is the recommended user authentication solution.

 To get started with AAD for cluster authentication, follow the guide on [Azure Active Directory for client authentication](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-cluster-security-client-auth-with-aad/).

At the end of the guide you should have a JSON snippet with AAD information that can be inserted into an ARM template: 

```json
-----ARM template-----
"azureActiveDirectory": {
  "tenantId":"<guid>",
  "clusterApplication":"<guid>",
  "clientApplication":"<guid>"
},
```

### Insert AAD config

The AAD config can be inserted directly into your ARM template, however it is recommended to extract the values into parameters first into a parameters file to keep the ARM template reusable and free of values specific to a deployment.

```json
{
  "apiVersion": "2016-03-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  ...
  "properties": {
    "certificate": {
      "thumbprint": "[parameters('clusterCertificateThumbprint')]",
      "x509StoreName": "[parameters('clusterCertificateStorevalue')]"
    },
    ...
    "azureActiveDirectory": {
      "tenantId": "[parameters('aadTenantId')]",
      "clusterApplication": "[parameters('aadClusterApplicationId')]",
      "clientApplication": "[parameters('aadClientApplicationId')]"
    },
    ...
  }
}
```

At this point, you should now have the following:

 - Key Vault resource group
    - Key Vault
    - Cluster server authentication certificate
    - Data encipherment certificate
 - Azure Active Directory tenant 
    - AAD Application for web-based management and Service Fabric Explorer
    - AAD Application for native client mamanagent
    - Users with roles assigned 
 - Service Fabric cluster ARM template
    - Certificates configured through Key Vault
    - Azure Active Directory configured 

![ARM dependency map][cluster-security-arm-dependency-map]


## Create cluster

You are now ready to create the cluster using [ARM deployment](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/).

#### Test it:

Use the following PowerShell command to test your ARM template with a parameters file:

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

#### Deploy it:

If the ARM template test passes, use the following PowerShell command to deploy your ARM template with a parameters file:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

## Use secrets in an application

Once the cluster is deployed, all nodes should have a certificate installed that can be used to decrypt application secrets at runtime from service code.

> [AZURE.NOTE] Service Fabric applications may choose to pull secrets from Key Vault at runtime, or use Key Vault to encrypt and decrypt secrets on behalf of users at runtime. This is perfectly valid and uses some of Key Vault's great features. However, to keep applications cloud-provider agnostic and portable, this walkthrough does not use Key Vault at runtime.


### Encrypt application secrets and store in Settings.xml

The Service Fabric SDK has built-in secret encryption and decryption functions. Secrets can be encrypted using an encipherment certificate and stored in a service's Settings.xml configuration. The values can then be decrypted and read programmatically in service code. 

The following PowerShell command is used to encrypt a secret. Use the encipherment certificate that was installed in your cluster to produce ciphertext for secret values:   

```powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```

The resulting base-64 string contains both the secret ciphertext as well as information about the certificate that was used to encrypt it.  The  base-64 encoded string can be inserted into a parameter in your service's Settings.xml configuration file with the `IsEncrypted` attribute set to `true`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MySettings">
    <Parameter Name="MySecret" IsEncrypted="true" Value="I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM=" />
  </Section>
</Settings>
```

### Configure services to decrypt with a data encipherment certficate

Certificates installed on VMSS VMs are only accessible by System and Admin accounts. By default, services run under NETWORK SERVICE on Windows and don't have System or Admin-level privileges. This is a good thing generally, but it also means your services can't access your certificates without some extra setup.

When using a data encryption cert, you need to make sure NETWORK SERVICE or whatever user account the service is running under has access to the private key. Service Fabric will handle granting access for your application automatically if you configure it to do so. This configuration can be done in ApplicationManifest.xml by defining users and security policies for certificates. In the following example, the NETWORK SERVICE account is given read access to a certificate defined by its thumbprint:

```xml
<ApplicationManifest … >
    <Principals>
        <Users>
            <User Name="Service1" AccountType="NetworkService" />
        </Users>
    </Principals>
  <Policies>
    <SecurityAccessPolicies>
      <SecurityAccessPolicy GrantRights=”Read” PrincipalRef="Service1" ResourceRef="MyCert" ResourceType="Certificate"/>
    </SecurityAccessPolicies>
  </Policies>
  <Certificates>
    <SecretsCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbrint]"/>
  </Certificates>
</ApplicationManifest>
```

> [AZURE.NOTE] When copying a cert thumbprint from the certificate store snap-in for MMC, an invisible character is placed at the beginning of the thumbprint string. This invisible character can cause an error when trying to locate a certificate by thumbprint, so be sure to delete this extra character.

### Use application secrets in service code

The configuration API for accessing configuration values from Settings.xml in a configuration package allows for easy decrypting of values that have the `IsEncrypted` attribute set to `true`. Since the encrypted text contains information about the certificate used for encryption, you do not need to manually find the certificate. The certificate simply needs to be installed on the node that the service is running on, which was done earlier when creating the cluster. Simply call the `DecryptValue()` method to retreive the original secret value:

```csharp
ConfigurationPackage configPackage = this.Context.CodePackageActivationContext.GetConfigurationPackageObject("Config");
SecureString mySecretValue = configPackage.Settings.Sections["MySettings"].Parameters["MySecret"].DecryptValue()
```
## Managing application secrets with Key Vault

Secrets can be stored in Key Vault for safe storage and access. For application portability, secrets are carried with services in configuration packages. This next section focuses on using Key Vault for secret management during build and deployment of Service Fabric applications.

### Add application secrets to Key Vault

Add secrets to Key Vault using the following Key Vault PowerShell command:

```powershell
$secureString = ConvertTo-SecureString "<secret>" -AsPlainText -Force
Set-AzureKeyVaultSecret -Name "<secret-name>" -SecretValue $secureString -VaultName mycluster-keyvault
```

### Inject application secrets into application instances 

Previously in this tutorial you copy and pasted an encrypted secret string into your service's Settings.xml configuration file. This is not ideal for several reasons:

 - Values may be different per deployment environments.
 - Encryption requires the encipherment certificate be installed on the machine that is performing the encryption operation. 

Ideally, deployment to different environments should be as automated as possible, and access to secrets and certificates should be as restricted as much as possible. This can be accomplished by performing secret encryption in a build environment and providing the encrypted secrets as parameters when creating application instances.

#### Use overridable parameters in Settings.xml

The Settings.xml configuration file allows overridable parameters that can be provided at application creation time. Use the `MustOverride` attribute instead of providing a value for a parameter:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MySettings">
    <Parameter Name="MySecret" IsEncrypted="true" Value="" MustOverride="true" />
  </Section>
</Settings>
```

To override values in Settings.xml, declare an override parameter for the service in ApplicationManifest.xml:

```xml
<ApplicationManifest ... >
  <Parameters>
    <Parameter Name="MySecret" DefaultValue="" />
  </Parameters>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateful1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides>
      <ConfigOverride Name="Config">
        <Settings>
          <Section Name="MySettings">
            <Parameter Name="MySecret" Value="[MySecret]" IsEncrypted="true" />
          </Section>
        </Settings>
      </ConfigOverride>
    </ConfigOverrides>
  </ServiceManifestImport>
 ```

Now the value can be specified as an *application parameter* when creating an instance of the application. Creating an application instance can be scripted using PowerShell, or written in C#, for easy integration in a build process.

Using PowerShell, the parameter is supplied to the `New-ServiceFabricApplication` command as a [hash table](https://technet.microsoft.com/library/ee692803.aspx):

```powershell
PS C:\Users\vturecek> New-ServiceFabricApplication -ApplicationName fabric:/MyApp -ApplicationTypeName MyAppType -ApplicationTypeVersion 1.0.0 -ApplicationParameter @{"MySecret" = "I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM="}
```

Using C#, application parameters are specified in an `ApplicationDescription` as a `NameValueCollection':

```csharp
FabricClient fabricClient = new FabricClient();

NameValueCollection applicationParameters = new NameValueCollection();
applicationParameters["MySecret"] = "I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM=";

ApplicationDescription applicationDescription = new ApplicationDescription(
    applicationName: new Uri("fabric:/MyApp"),
    applicationTypeName: "MyAppType",
    applicationTypeVersion: "1.0.0",
    applicationParameters: applicationParameters)
);

await fabricClient.ApplicationManager.CreateApplicationAsync(applicationDescription);
```

## Next Steps

At this point, you should have a secured cluster using Azure Active Directory for management authentication, certificates installed on the cluster nodes for application secret decryption, and Key Vault set up for key and secret management. 

Learn more about [running applications with different security permissions](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-application-runas-security/)

<!-- Links -->
[azure-powershell]:https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[aad-graph-api-docs]:https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/api-catalog
[azure-classic-portal]: https://manage.windowsazure.com

<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-walkthrough-security/cluster-security-arm-dependency-map.png