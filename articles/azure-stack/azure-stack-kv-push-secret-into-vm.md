<properties
	pageTitle="Deploy a VM with a certificate using Azure Stack Key Vault  | Microsoft Azure"
	description="Learn how deploy a VM and inject a certificate from Azure Stack Key Vault"
	services="azure-stack"
	documentationCenter=""
	authors="rlfmendes"
	manager="natmack"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/26/2016"
	ms.author="ricardom"/>

# Tenant can create VMs and include certificates retrieved from Key Vault

In Azure Stack, VMs are deployed through Azure Resource Manager, and you
can now store certificates in Azure Stack Key Vault. Then Azure Stack
(Microsoft.Compute resource provider to be specific) pushes them into
your VMs when the VMs are deployed. Certificates can be used in many
scenarios, including SSL, encryption, and certificate based authentication.

By using this method, you can keep the certificate safe. It's now not in
the VM image, or in the application's configuration files or some other
unsafe location. By setting appropriate access policy for the key vault,
you can also control who gets access to your certificate. Another
benefit is that you can manage all your certificates in one place in
Azure Stack Key Vault.

Here is a quick overview of the process:

-   You need a certificate in the .pfx format.

-   Create a key vault (using either a template or the following sample script).

-   Make sure you have turned on the EnabledForDeployment switch.

-   Upload the certificate as a secret.

Deploying VMs
-------------

This sample script creates a key vault, and then stores a
certificate stored in the .pfx file in a local directory, to the key
vault as a secret.

    $vaultName = "contosovault"
    $resourceGroup = "contosovaultrg"
    $location = "local"
    $secretName = "servicecert"
    $fileName = "keyvault.pfx"
    $certPassword = "abcd1234"

    # =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    $fileContentBytes = get-content \$fileName -Encoding Byte

    $fileContentEncoded =
    [System.Convert\]::ToBase64String(\$fileContentBytes)
    $jsonObject = @"
    {
    "data": "\$filecontentencoded",
    "dataType" :"pfx",
    "password": "\$certPassword"
    }
    @$jsonObjectBytes = [System.Text.Encoding\]::UTF8.GetBytes(\$jsonObject)
    $jsonEncoded = \[System.Convert\]::ToBase64String(\$jsonObjectBytes)
    Switch-AzureMode -Name AzureResourceManager
    New-AzureResourceGroup -Name \$resourceGroup -Location \$location
    New-AzureKeyVault -VaultName \$vaultName -ResourceGroupName
    $resourceGroup -Location \$location -sku standard -EnabledForDeployment
    $secret = ConvertTo-SecureString -String \$jsonEncoded -AsPlainText -Force
    Set-AzureKeyVaultSecret -VaultName \$vaultName -Name \$secretName -SecretValue \$secret

The first part of the script reads the .pfx file, and then stores it as a
JSON object with the file content base64 encoded. Then the JSON object
is also base64 encoded.

Next, it creates a new resource group and then creates a key vault. Note
the last parameter to the New-AzureKeyVault command,
'-EnabledForDeployment', which grants access to Azure (specifically to the Microsoft.Compute
resource provider) to read secrets from
the key vault for deployments.

The last command simply stores the base64 encoded JSON object in the key vault as a secret.

Here's sample output from the preceding script:

    VERBOSE:  – Created resource group 'contosovaultrg' in
    location
    'eastus'
    ResourceGroupName : contosovaultrg
    Location          : eastus
    ProvisioningState : Succeeded
    Tags              :
    Permissions       :
                        Actions NotActions
                        ======= ==========
                        \*
    ResourceId        :
    /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-dd149b4aeb56/re
    sourceGroups/contosovaultrg
    VaultUri             : https://contosovault.vault.azure.net
    TenantId             : xxxxxxxx-xxxx-xxxx-xxxx-2d7cd011db47
    TenantName           : xxxxxxxx
    Sku                  : standard
    EnabledForDeployment : True
    AccessPolicies       : {xxxxxxxx-xxxx-xxxx-xxxx-2d7cd011db47}
    AccessPoliciesText   :
                           Tenant ID              :
                           xxxxxxxx-xxxx-xxxx-xxxx-2d7cd011db47
                           Object ID              :
                           xxxxxxxx-xxxx-xxxx-xxxx-b092cebf0c80
                           Application ID         :
                           Display Name           : Derick Developer  (derick@contoso.com)
                           Permissions to Keys    : get, create, delete,
                           list, update, import, backup, restore
                           Permissions to Secrets : all
    OriginalVault        : Microsoft.Azure.Management.KeyVault.Vault
    ResourceId           :
    /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-dd149b4aeb56
                     
    /resourceGroups/contosovaultrg/providers/Microsoft.KeyV
                           ault/vaults/contosovault
    VaultName            : contosovault
    ResourceGroupName    : contosovaultrg
    Location             : eastus
    Tags                 : {}
    TagsTable            :
    SecretValue     : System.Security.SecureString
    SecretValueText :
    ew0KImRhdGEiOiAiTUlJSkN3SUJBekNDQ01jR0NTcUdTSWIzRFFFSEFh
               
    Q0NDTGdFZ2dpME1JSUlzRENDQmdnR0NTcUdTSWIzRFFFSEFhQ0NCZmtF
                
    Z2dYMU1JSUY4VENDQmUwR0N5cUdTSWIzRFFFTUNnRUNvSUlFL2pDQ0JQ
    &lt;&lt;&lt; Output truncated… &gt;&gt;&gt;

    Attributes      :
    Microsoft.Azure.Commands.KeyVault.Models.SecretAttributes

    VaultName       : contosovault
    Name            : servicecert
    Version         : e3391a126b65414f93f6f9806743a1f7
    Id              :
    https://contosovault.vault.azure.net:443/secrets/servicecert
                      /e3391a126b65414f93f6f9806743a1f7

Now we are ready to deploy a VM template. Note the URI of the
secret from the output (as highlighted in the preceding output in green).

You'll need a template located here. The parameters of special interest
(besides the usual VM parameters) are the vault name, the vault resource
group, and the secret URI. Of course, you can
also download it from GitHub and modify as needed.

When this VM is deployed, Azure injects the certificate into the VM.
On Windows, certificates in the .pfx file are added with the private key not
exportable. The certificate is added to the LocalMachine certificate
location, with the certificate store that the user provided. On Linux,
the certificate file is placed under the /var/lib/waagent directory,
with the file name &lt;UppercaseThumbprint&gt;.crt for the X509
certificate file, and &lt;UppercaseThumbprint&gt;.prv for the private key.
Both of these files are .pem formatted.

The application usually finds the certificate by using the thumbprint and
doesn't need modification.

Retiring certificates
---------------------

In the preceding section, we showed you how to push a new certificate to your
existing VMs. But your old certificate is still in the VM and cannot be
removed. For added security, you can change the attribute for old secret
to 'Disabled', so that even if an old template tries to create a VM with
this old version of certificate, it will. Here's how you set a specific
secret version to be disabled:

    Set-AzureKeyVaultSecretAttribute -VaultName contosovault -Name servicecert -Version e3391a126b65414f93f6f9806743a1f7 -Enable 0

Conclusion
----------

With this new method, the certificate can be kept separate from the VM
image or the application payload. So we have removed one point of
exposure.

The certificate can also be renewed and uploaded to Key Vault
without having to re-build the VM image or the application deployment
package. The application still needs to be supplied with the new URI for
this new certificate version though.

By separating the certificate from the VM or the application payload, we
have now reduced the number of personnel that will have direct access to
the certificate.

As an added benefit, you now have one convenient place in Key Vault to
manage all your certificates, including the all the versions that were
deployed over time.
