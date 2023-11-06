---
title: Manage certificates in a Service Fabric cluster 
description: Learn about managing certificates in a Service Fabric cluster that's secured with X.509 certificates.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---
# Manage certificates in Service Fabric clusters

This article addresses the management aspects of certificates that are used to secure communication in Azure Service Fabric clusters. It complements the introduction to [Service Fabric cluster security](service-fabric-cluster-security.md) and the explainer on [X.509 certificate-based authentication in Service Fabric](cluster-security-certificates.md). 

## Prerequisites
Before you begin, you should be familiar with fundamental security concepts and the controls that Service Fabric exposes to configure the security of a cluster. 

## Disclaimer

This article pairs theoretical aspects of certificate management with hands-on examples that cover the specifics of services, technologies, and so on. Because much of the audience here is Microsoft-internal, the article refers to services, technologies, and products that are specific to Azure. If certain Microsoft-specific details don't apply to you, feel free to ask for clarification or guidance in the comments section at the end.

## Defining certificate management

As you learn in companion article [X.509 Certificate-based authentication in Service Fabric clusters](cluster-security-certificates.md), a certificate is a cryptographic object that essentially binds an asymmetric key pair with attributes that describe the entity it represents. 

However, a certificate is also a *perishable* object, because its lifetime is finite and it's susceptible to compromise. Accidental disclosure or a successful exploit can render a certificate useless from a security standpoint. This characteristic implies the need to change certificates either routinely or in response to a security incident. 

Another aspect of certificate management, and an entirely separate topic, is the safeguarding of certificate private keys or secrets that protect the identities of the entities involved in procuring and provisioning certificates. 

We describe *certificate management* as the processes and procedures that are used to obtain certificates and to transport them safely and securely to where they're needed. 

Some management operations, such as enrollment, policy setting, and authorization controls, are beyond the scope of this article. Other operations, such as provisioning, renewal, re-keying, or revocation, are related only incidentally to Service Fabric. Nonetheless, the article addresses them somewhat, because understanding these operations can help you secure your cluster properly. 

Your immediate goal is likely to be to automate certificate management as much as possible to ensure uninterrupted availability of the cluster. Because the process is user-touch-free, you'll also want to offer security assurances. With Service Fabric clusters, this goal is attainable.

The rest of the article first deconstructs certificate management, and later focuses on enabling autorollover.

Specifically, it covers the following topics:

- Assumptions about the separation of attributions between owner and platform
- The long pipeline from certificate issuance to consumption
- Certificate rotation: Why, how, and when
- What could possibly go wrong?

The article does not cover these topics:

- Securing and managing domain names
- Enrolling into certificates
- Setting up authorization controls to enforce certificate issuance. 

For information about these topics, refer to the registration authority (RA) of your favorite public key infrastructure (PKI) service. If you're a Microsoft-internal reader, you can reach out to Azure Security.

## Roles and entities involved in certificate management

The security approach in a Service Fabric cluster is a case of "cluster owner declares it, Service Fabric runtime enforces it." This means that almost none of the certificates, keys, or other credentials of identities that participate in a cluster's functioning come from the service itself. They're all declared by the cluster owner. The cluster owner is also responsible for provisioning the certificates into the cluster, renewing them as needed, and helping ensure their security at all times. 

More specifically, the cluster owner must ensure that:
  - Certificates that are declared in the NodeType section of the cluster manifest can be found on each node of that type, according to the [presentation rules](cluster-security-certificates.md#presentation-rules).
  - Certificates that are declared as in the preceding bullet point are installed with their corresponding private keys included.
  - Certificates that are declared in the presentation rules should pass the [validation rules](cluster-security-certificates.md#validation-rules). 

Service Fabric, for its part, assumes the following responsibilities:
  - Locating certificates that match the declarations in the cluster definition
  - Granting access to the corresponding private keys to Service Fabric-controlled entities on a *need* basis
  - Validating certificates in strict accordance with established security best-practices and the cluster definition
  - Raising alerts on impending expiration of certificates, or failures to perform the basic steps of certificate validation
  - Validating (to some degree) that the certificate-related aspects of the cluster definition are met by the underlying configuration of the hosts 

It follows that the certificate management burden (as active operations) falls solely on the cluster owner. The next sections offer a closer look at each of the management operations, including available mechanisms and their impact on the cluster.

## The journey of a certificate

Let's quickly outline the progression of a certificate from issuance to consumption in the context of a Service Fabric cluster:

1. A domain owner registers with the RA of a PKI a domain or subject that they want to associate with ensuing certificates. The certificates, in turn, constitute proof of ownership of the domain or subject.

1. The domain owner also designates in the RA the identities of authorized requesters, entities that are entitled to request the enrollment of certificates with the specified domain or subject.

1. An authorized requester then enrolls into a certificate via a secret-management service. In Azure, the secret-management service of choice is Azure Key Vault, which securely stores and allows the retrieval of secrets and certificates by authorized entities. Key Vault also renews and re-keys the certificate as configured in the associated certificate policy. Key Vault uses Microsoft Entra ID as the identity provider.

1. An authorized retriever, or *provisioning agent*, retrieves the certificate from the key vault, including its private key, and installs it on the machines that host the cluster.

1. The Service Fabric service (running elevated on each node) grants access to the certificate to the allowed Service Fabric entities, which are designated by local groups and split between ServiceFabricAdministrators and ServiceFabricAllowedUsers.

1. The Service Fabric runtime accesses and uses the certificate to establish federation, or to authenticate to inbound requests from authorized clients.

1. The provisioning agent monitors the key vault certificate and, when it detects renewal, triggers the provisioning flow. The cluster owner then updates the cluster definition, if needed, to indicate an intent to roll over the certificate.

1. The provisioning agent or the cluster owner is also responsible for cleaning up and deleting unused certificates.
  
For the purposes of this article, the first two steps in the preceding sequence are mostly unrelated. Their only connection is that the subject common name of the certificate is the DNS name that's declared in the cluster definition.

Certificate issuance and provisioning flow are illustrated in the following diagrams:

**For certificates that are declared by thumbprint**

![Diagram of provisioning certificates that are declared by thumbprint.][Image1]

**For certificates that are declared by subject common name**

![Diagram of provisioning certificates that are declared by subject common name.][Image2]

### Certificate enrollment

The topic of certificate enrollment is covered in detail in the [Key Vault documentation](../key-vault/certificates/create-certificate.md). A synopsis is included here for continuity and easier reference. 

Continuing with Azure as the context, and using Key Vault as the secret-management service, an authorized certificate requester must have at least certificate management permissions on the key vault, granted by the key vault owner. The requester then enrolls into a certificate as follows:

- The requester creates a certificate policy in Key Vault, which specifies the domain/subject of the certificate, the desired issuer, key type and length, intended key usage, and more. For more information, see [Certificates in Azure Key Vault](../key-vault/certificates/certificate-scenarios.md). 

- The requester creates a certificate in the same vault with the policy that's specified in the preceding step. This, in turn, generates a key pair as vault objects and a certificate signing request that's signed with the private key, which is then forwarded to the designated issuer for signing.

- After the issuer, or certificate authority (CA), replies with the signed certificate, the result is merged into the key vault, and the certificate data is available as follows:
  - Under `{vaultUri}/certificates/{name}`: The certificate, including the public key and metadata
  - Under `{vaultUri}/keys/{name}`: The certificate's private key, available for cryptographic operations (wrap/unwrap, sign/verify)
  - Under `{vaultUri}/secrets/{name}`: The certificate, including its private key, available for downloading as an unprotected PFX or PEM file.
	
Recall that a certificate in the key vault contains a chronological list of certificate instances that share a policy. Certificate versions will be created according to the lifetime and renewal attributes of this policy. We highly recommend that vault certificates not share subjects or domains or DNS names, because it can be disruptive in a cluster to provision certificate instances from different vault certificates, with identical subjects but substantially different other attributes, such as issuer, key usages, and so on.
At this point, a certificate exists in the key vault, ready for consumption. Now let's explore the rest of the process.

### Certificate provisioning

We mentioned a *provisioning agent*, which is the entity that retrieves the certificate, including its private key, from the key vault and installs it on each of the hosts of the cluster. (Recall that Service Fabric doesn't provision certificates.)

In the context of this article, the cluster will be hosted on a collection of Azure virtual machines (VMs) or virtual machine scale sets. In Azure, you can provision a certificate from a vault to a VM/VMSS by using the following mechanisms. This assumes, as before, that the provisioning agent was previously granted *secret get* permissions on the key vault by the key vault owner.

- Ad-hoc: An operator retrieves the certificate from the key vault (as PFX/PKCS #12 or PEM) and installs it on each node.

   The ad-hoc mechanism isn't recommended, for multiple reasons, ranging from security to availability, and it won't be discussed here further. For more information, see [FAQ for Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.yml).

- As a virtual machine scale set *secret* during deployment: By using its first-party identity on behalf of the operator, the compute service retrieves the certificate from a template-deployment-enabled vault and installs it on each node of the virtual machine scale set, as described in [FAQ for Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.yml).

    >[!NOTE] 
    > This approach allows the provisioning of versioned secrets only.
    
- By using the [Key Vault VM extension](../virtual-machines/extensions/key-vault-windows.md). This lets you provision certificates by using version-less declarations, with periodic refreshing of observed certificates. In this case, the VM/VMSS is expected to have a [managed identity](../virtual-machines/security-policy.md#managed-identities-for-azure-resources), an identity that has been granted access to the key vaults that contain the observed certificates.

VMSS/compute-based provisioning presents security and availability advantages, but it also presents restrictions. It requires, by design, that you declare certificates as versioned secrets. This requirement makes VMSS/compute-based provisioning suitable only for clusters secured with certificates declared by thumbprint.

In contrast, Key Vault VM extension-based provisioning always installs the latest version of each observed certificate. which makes it suitable only for clusters secured with certificates declared by subject common name. To emphasize, do not use an autorefresh provisioning mechanism (such as the Key Vault VM extension) for certificates that are declared by instance (that is, by thumbprint). The risk of losing availability is considerable.

Other provisioning mechanisms exist, but the approaches mentioned here are the currently accepted options for Azure Service Fabric clusters.

### Certificate consumption and monitoring

As mentioned earlier, the Service Fabric runtime is responsible for locating and using the certificates that are declared in the cluster definition. The [X.509 Certificate-based authentication in Service Fabric clusters](cluster-security-certificates.md) article explains in detail how Service Fabric implements the presentation and validation rules, and it won't be revisited here. This article is going to look at access and permission granting, as well as monitoring.

Recall that certificates in Service Fabric are used for a multitude of purposes, from mutual authentication in the federation layer to Transport Layer Security (TLS) authentication for the management endpoints. This requires various components or system services to have access to the certificate's private key. The Service Fabric runtime regularly scans the certificate store, looking for matches for each of the known presentation rules. 

For each matching certificate, the corresponding private key is located, and its discretionary access control list is updated to include permissions (Read and Execute, ordinarily) that are granted to the identity that requires them. 

This process is informally referred to as *ACLing*. The process runs on a one-minute cadence and also covers *application* certificates, such as those used to encrypt settings or as endpoint certificates. ACLing follows the presentation rules, so it's important to keep in mind that certificates declared by thumbprint and which are autorefreshed without the ensuing cluster configuration update will be inaccessible.   

### Certificate rotation

> [!NOTE]
> The Internet Engineering Task Force (IETF) [RFC 3647](https://tools.ietf.org/html/rfc3647) formally defines [*renewal*](https://tools.ietf.org/html/rfc3647#section-4.4.6) as the issuance of a certificate with the same attributes as the certificate that's being replaced. The issuer, the subject's public key, and the information are preserved. [*Re-keying*](https://tools.ietf.org/html/rfc3647#section-4.4.7) is the issuance of a certificate with a new key pair, without restrictions as to whether the issuer can change. Because the distinction might be important (consider the case of certificates that are declared by subject common name with issuer pinning), this article uses the neutral term *rotation* to cover both scenarios. Do keep in mind that, when *renewal* is used informally, it refers to *re-keying*. 

As mentioned earlier, Key Vault supports automatic certificate rotation. That is, the associate certificate policy defines the point in time, whether by days before expiration or percentage of total lifetime, when the certificate is rotated in the key vault. The provisioning agent must be invoked after this point in time, and prior to the expiration of the now-previous certificate, to distribute this new certificate to all nodes of the cluster. 

Service Fabric assists in this process by raising health warnings when the expiration date of a certificate, which is currently in use in the cluster, occurs sooner than a predetermined interval. An automatic provisioning agent, the Key Vault VM extension, which is configured to observe the key vault certificate, periodically polls the key vault, detects the rotation, and retrieves and installs the new certificate. Provisioning that takes place via the VM/VMSS *secrets* feature requires an authorized operator to update the VM/VMSS with the versioned Key Vault URI that corresponds to the new certificate.

The rotated certificate is now provisioned to all nodes. Now, assuming that the rotation applied to the cluster certificate was declared by subject common name, let's examine what happens next: 

  - For new connections within, as well as into, the cluster, the Service Fabric runtime finds and selects the most recently issued matching certificate (the greatest value of the *NotBefore* property). This is a change from earlier versions of the Service Fabric runtime.

  - Existing connections are kept alive or allowed to naturally expire or otherwise terminate, and an internal handler will have been notified that a new match exists.

> [!NOTE] 
> Currently, as of version 7.2 CU4+, Service Fabric selects the certificate with the greatest (most recently issued) *NotBefore* property value. Prior to 7.2 CU4, Service Fabric picked the valid certificate with the greatest (latest expiring) *NotAfter* value.

This translates into the following important observations:

- The availability of the cluster, or of the hosted applications, takes precedence over the directive to rotate the certificate. The cluster will converge on the new certificate eventually, but without timing guarantees. It follows that:

  - It might not be immediately obvious to an observer that the rotated certificate completely replaced its predecessor. The only way to force the immediate replacement of the certificate currently in use is to reboot the host machines. It's not sufficient to restart the Service Fabric nodes, because the kernel mode components that form lease connections in a cluster will be unaffected. Also, restarting the VM/VMSS might cause temporary loss of availability. For application certificates, it's sufficient to restart only the respective application instances.

  - Introducing a re-keyed certificate that doesn't meet the validation rules can effectively break the cluster. The most common example of this is the case of an unexpected issuer, where the cluster certificates are declared by subject common name with issuer pinning, but the rotated certificate was issued by a new or undeclared issuer.    

### Certificate cleanup

At this time, there are no provisions in Azure for explicit removal of certificates. It's often a non-trivial task to determine whether a specific certificate is being used at a specific time. This is more difficult for application certificates than for cluster certificates. Service Fabric itself, not being the provisioning agent, won't delete a certificate that's declared by the user under any circumstance. For the standard provisioning mechanisms:

  - Certificates that are declared as VM/VMSS secrets are provisioned as long as they're referenced in the VM/VMSS definition and are retrievable from the key vault. Deleting a key vault secret or certificate will fail subsequent VM/VMSS deployments. Similarly, disabling a secret version in the key vault will also fail VM/VMSS deployments that reference the secret version.

  - Earlier versions of certificates that are provisioned via the Key Vault VM extension might or might not be present on a VM/VMSS node. The agent retrieves and installs only the current version, and it doesn't remove any certificates. Re-imaging a node, which ordinarily occurs every month, resets the certificate store to the content of the OS image, and so earlier versions will implicitly be removed. Consider, though, that scaling up a virtual machine scale set will result in only the current version of observed certificates being installed. Don't assume the homogeneity of nodes with regard to installed certificates.  

## Simplifying management: An autorollover example

So far, this article has described mechanisms and restrictions, outlined intricate rules and definitions, and made dire predictions of outages. Now it's time to set up automatic certificate management to avoid all these concerns. Let's do so in the context of an Azure Service Fabric cluster running on a platform as a service (PaaS) v2 virtual machine scale set, using Key Vault for secrets management and leveraging managed identities, as follows:

- Validation of certificates is changed from thumbprint-pinning to subject + issuer-pinning. Any certificate with a specific subject from a specific issuer is equally trusted.
- Certificates are enrolled into and obtained from a trusted store (Key Vault), and refreshed by an agent (here, the Key Vault VM extension).
- Provisioning of certificates is changed from deployment-time and version-based (as done by Azure Compute Resource Provider) to post-deployment by using version-less Key Vault URIs.
- Access to the key vault is granted via user-assigned managed identities, which are created and assigned to the virtual machine scale set during deployment.
- After deployment, the agent (the Key Vault VM extension) polls and refreshes observed certificates on each node of the virtual machine scale set. Certificate rotation is thus fully automated, because Service Fabric automatically picks up the latest valid certificate.

The sequence is fully scriptable and automated, and it allows a user-touch-free initial deployment of a cluster that's configured for certificate autorollover. The next sections provide detailed steps, which contain a mix of PowerShell cmdlets and fragments of JSON templates. The same functionality is achievable with all supported means of interacting with Azure.

> [!NOTE]
> This example assumes that a certificate exists already in your key vault. Enrolling and renewing a Key Vault-managed certificate requires prerequisite manual steps, as described earlier in this article. For production environments, use Key Vault-managed certificates. We've included a sample script that's specific to a Microsoft-internal PKI.

> [!NOTE]
> Certificate autorollover makes sense only for CA-issued certificates. Using self-signed certificates, including those generated during deployment of a Service Fabric cluster in the Azure portal, is nonsensical, but still possible for local or developer-hosted deployments if you declare the issuer thumbprint to be the same as that of the leaf certificate.

### Starting point

For brevity, let's assume the following starting state:

- The Service Fabric cluster exists, and is secured with a CA-issued certificate declared by thumbprint.
- The certificate is stored in a key vault and provisioned as a virtual machine scale set secret.
- The same certificate will be used to convert the cluster to common name-based certificate declarations, and so it can be validated by subject and issuer. If this isn't the case, obtain the CA-issued certificate that's intended for this purpose, and add it to the cluster definition by thumbprint. This process is explained in [Add or remove certificates for a Service Fabric cluster in Azure](service-fabric-cluster-security-update-certs-azure.md).

Here's a JSON excerpt from a template that corresponds to such a state. The excerpt omits many required settings and illustrates only the certificate-related aspects.

```json
  "resources": [
    {   ## VMSS definition
      "apiVersion": "[variables('vmssApiVersion')]",
      "type": "Microsoft.Compute/virtualMachineScaleSets",
      "name": "[variables('vmNodeTypeName')]",
      "location": "[variables('computeLocation')]",
      "properties": {
        "virtualMachineProfile": {
          "extensionProfile": {
            "extensions": [
            {
                "name": "[concat('ServiceFabricNodeVmExt','_vmNodeTypeName')]",
                "properties": {
                  "type": "ServiceFabricNode",
                  "autoUpgradeMinorVersion": true,
                  "publisher": "Microsoft.Azure.ServiceFabric",
                  "settings": {
                    "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                    "nodeTypeRef": "[variables('vmNodeTypeName')]",
                    "dataPath": "D:\\SvcFab",
                    "durabilityLevel": "Bronze",
                    "certificate": {
                        "thumbprint": "[parameters('primaryClusterCertificateTP')]",
                        "x509StoreName": "[parameters('certificateStoreValue')]"
                    }
                  },
                  "typeHandlerVersion": "1.1"
                }
            },}},
          "osProfile": {
            "adminPassword": "[parameters('adminPassword')]",
            "adminUsername": "[parameters('adminUsername')]",
            "secrets": [
            {
                "sourceVault": {
                    "id": "[resourceId('Microsoft.KeyVault/vaults', parameters('keyVaultName'))]"
                },
                "vaultCertificates": [
                {
                    "certificateStore": "[parameters('certificateStoreValue')]",
                    "certificateUrl": "[parameters('clusterCertificateUrlValue')]"
                },
            ]}]
        },
    },
    {   ## cluster definition
        "apiVersion": "[variables('sfrpApiVersion')]",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "certificate": {
            "thumbprint": "[parameters('primaryClusterCertificateTP')]",
            "x509StoreName": "[parameters('certificateStoreValue')]"
        },
    }
  ]
```   

The preceding code essentially says that the certificate with thumbprint ```json [parameters('primaryClusterCertificateTP')] ``` and found at Key Vault URI ```json [parameters('clusterCertificateUrlValue')] ``` is declared as the cluster's sole certificate, by thumbprint. 

Next, let's set up the additional resources that are needed to ensure the autorollover of the certificate.

### Set up the prerequisite resources

As mentioned earlier, a certificate that's provisioned as a virtual machine scale set secret is retrieved from the key vault by the Microsoft Compute Resource Provider service. It does so by using its first-party identity on behalf of the deployment operator. That process will change for autorollover. You'll switch to using a managed identity that's assigned to the virtual machine scale set and that has been granted GET permissions on the secrets in that vault.

You should deploy the next excerpts at the same time. They're listed individually only for play-by-play analysis and explanation.

First, define a user-assigned identity (default values are included as examples). For more information, see the [official documentation](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm.md#create-a-user-assigned-managed-identity).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "userAssignedIdentityName": {
      "type": "string",
      "defaultValue": "sftstuaicus",
      "metadata": {
        "description": "User-assigned managed identity name"
      }
    },
  },
  "variables": {
      "vmssApiVersion": "2018-06-01",
      "sfrpApiVersion": "2018-02-01",
      "miApiVersion": "2018-11-30",
      "kvApiVersion": "2018-02-14",
      "userAssignedIdentityResourceId": "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]"
  },    
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "name": "[parameters('userAssignedIdentityName')]",
      "apiVersion": "[variables('miApiVersion')]",
      "location": "[resourceGroup().location]"
    },
  ]}
```

Next, grant this identity access to the key vault secrets. For the most current information, see the [official documentation](/rest/api/keyvault/keyvault/vaults/update-access-policy).
```json
  "resources":
  [{
      "type": "Microsoft.KeyVault/vaults/accessPolicies",
      "name": "[concat(parameters('keyVaultName'), '/add')]",
      "apiVersion": "[variables('kvApiVersion')]",
      "properties": {
        "accessPolicies": [
          {
            "tenantId": "[reference(variables('userAssignedIdentityResourceId'), variables('miApiVersion')).tenantId]",
            "objectId": "[reference(variables('userAssignedIdentityResourceId'), variables('miApiVersion')).principalId]",
            "dependsOn": [
              "[variables('userAssignedIdentityResourceId')]"
            ],
            "permissions": {
              "secrets": [
                "get",
                "list"
              ]}}]}}]
```

In the next step, you'll do the following:

- Assign the user-assigned identity to the virtual machine scale set.
- Declare the virtual machine scale set dependency on the creation of the managed identity, and on the result of granting it access to the key vault.
- Declare the Key Vault VM extension and require it to retrieve observed certificates on startup. For more information, see the [Key Vault VM extension for Windows](../virtual-machines/extensions/key-vault-windows.md) official documentation.
- Update the definition of the Service Fabric VM extension to depend on the Key Vault VM extension, and to convert the cluster certificate declaration from thumbprint to common name.

> [!NOTE]
> These changes are being made as a single step because they fall within the scope of the same resource.

```json
  "parameters": {
    "kvvmextPollingInterval": {
      "type": "string",
      "defaultValue": "3600",
      "metadata": {
        "description": "kv vm extension polling interval in seconds"
      }
    },
    "kvvmextLocalStoreName": {
      "type": "string",
      "defaultValue": "MY",
      "metadata": {
        "description": "kv vm extension local store name"
      }
    },
    "kvvmextLocalStoreLocation": {
      "type": "string",
      "defaultValue": "LocalMachine",
      "metadata": {
        "description": "kv vm extension local store location"
      }
    },
    "kvvmextObservedCertificates": {
      "type": "array",
      "defaultValue": [
                "https://sftestcus.vault.azure.net/secrets/sftstcncluster",
                "https://sftestcus.vault.azure.net/secrets/sftstcnserver"
            ],
      "metadata": {
        "description": "kv vm extension observed certificates versionless uri"
      }
    },
    "certificateCommonName": {
      "type": "string",
      "defaultValue": "cus.cluster.sftstcn.system.servicefabric.azure-int",
      "metadata": {
        "description": "Certificate Common name"
      }
    },
  },
  "resources": [
  {
    "apiVersion": "[variables('vmssApiVersion')]",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    "name": "[variables('vmNodeTypeName')]",
    "location": "[variables('computeLocation')]",
    "dependsOn": [
      "[variables('userAssignedIdentityResourceId')]",
      "[concat('Microsoft.KeyVault/vaults/', concat(parameters('keyVaultName'), '/accessPolicies/add'))]"
    ],
    "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
        "[variables('userAssignedIdentityResourceId')]": {}
      }
    },
    "virtualMachineProfile": {
      "extensionProfile": {
        "extensions": [
        {
          "name": "KVVMExtension",
          "properties": {
            "publisher": "Microsoft.Azure.KeyVault",
            "type": "KeyVaultForWindows",
            "typeHandlerVersion": "1.0",
            "autoUpgradeMinorVersion": true,
            "settings": {
                "secretsManagementSettings": {
                    "pollingIntervalInS": "[parameters('kvvmextPollingInterval')]",
                    "linkOnRenewal": false,
                    "observedCertificates": "[parameters('kvvmextObservedCertificates')]",
                    "requireInitialSync": true
                }
            }
          }
        },
        {
        "name": "[concat('ServiceFabricNodeVmExt','_vmNodeTypeName')]",
        "properties": {
          "type": "ServiceFabricNode",
          "provisionAfterExtensions" : [ "KVVMExtension" ],
          "publisher": "Microsoft.Azure.ServiceFabric",
          "settings": {
            "certificate": {
                "commonNames": [
                    "[parameters('certificateCommonName')]"
                ],
                "x509StoreName": "[parameters('certificateStoreValue')]"
            }
            },
            "typeHandlerVersion": "1.0"
          }
        },
  ] } ## extension profile
  },  ## VM profile
  "osProfile": {
    "adminPassword": "[parameters('adminPassword')]",
    "adminUsername": "[parameters('adminUsername')]",
  } 
  }
  ]
```

Although it's not explicitly listed in the preceding code, note that the key vault certificate URL has been removed from the `OsProfile` section of the virtual machine scale set.

The final step is to update the cluster definition to change the certificate declaration from thumbprint to common name. We're also pinning the issuer thumbprints:

```json
  "parameters": {
    "certificateCommonName": {
      "type": "string",
      "defaultValue": "cus.cluster.sftstcn.system.servicefabric.azure-int",
      "metadata": {
        "description": "Certificate Common name"
      }
    },
    "certificateIssuerThumbprint": {
      "type": "string",
      "defaultValue": "1b45ec255e0668375043ed5fe78a09ff1655844d,d7fe717b5ff3593764f4d90654d86e8362ec26c8,3ac7c3cac8de0dd392c02789c8be97474f456960,96ea05926e2e42cc207e358668be2c316857fb5e",
      "metadata": {
        "description": "Certificate issuer thumbprints separated by comma"
      }
    },
  },
  "resources": [
    {
      "apiVersion": "[variables('sfrpApiVersion')]",
      "type": "Microsoft.ServiceFabric/clusters",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('clusterLocation')]",
      "properties": {
        "certificateCommonNames": {
          "commonNames": [{
              "certificateCommonName": "[parameters('certificateCommonName')]",
              "certificateIssuerThumbprint": "[parameters('certificateIssuerThumbprint')]"
          }],
          "x509StoreName": "[parameters('certificateStoreValue')]"
        },
  ]
```

At this point, you can run the previously mentioned updates in a single deployment. For its part, the Service Fabric Resource Provider service splits the cluster upgrade in several steps, as described in the segment on [converting cluster certificates from thumbprint to common name](cluster-security-certificates.md#converting-a-cluster-from-thumbprint--to-common-name-based-certificate-declarations).

### Analysis and observations

This section is a catch-all for explaining concepts and processes that have been presented throughout this article, as well as drawing attention to certain other important aspects.

#### About certificate provisioning

The Key Vault VM extension, as a provisioning agent, runs continuously on a predetermined frequency. If it fails to retrieve an observed certificate, it continues to the next in line, and then hibernates until the next cycle. The Service Fabric VM extension, as the cluster bootstrapping agent, requires the declared certificates before the cluster can form. This, in turn, means that the Service Fabric VM extension can run only after the successful retrieval of the cluster certificates, denoted here by the ```json "provisionAfterExtensions" : [ "KVVMExtension" ]"``` clause, and by the Key Vault VM extension's ```json "requireInitialSync": true``` setting. 

This indicates to the Key Vault VM extension that, on the first run (after deployment or a reboot), it must cycle through its observed certificates until all are downloaded successfully. Setting this parameter to false, coupled with a failure to retrieve the cluster certificates, would result in a failure of the cluster deployment. Conversely, requiring an initial sync with an incorrect or invalid list of observed certificates would result in a failure of the Key Vault VM extension and, again, a failure to deploy the cluster. 

#### Certificate linking, explained

You might have noticed the Key Vault VM extension `linkOnRenewal` flag, and the fact that it is set to false. This setting addresses the behavior controlled by this flag and its implications on the functioning of a cluster. This behavior is specific to Windows.

According to its [definition](../virtual-machines/extensions/key-vault-windows.md#extension-schema):

```json
"linkOnRenewal": <Only Windows. This feature enables auto-rotation of SSL certificates, without necessitating a re-deployment or binding. e.g.: false>,
```

Certificates used to establish a TLS connection are ordinarily [acquired as a handle](/windows/win32/api/sspi/nf-sspi-acquirecredentialshandlea) via the S-channel Security Support Provider. That is, the client doesn't directly access the private key of the certificate itself. S-channel supports redirection, or linking, of credentials in the form of a certificate extension, [CERT_RENEWAL_PROP_ID](/windows/win32/api/wincrypt/nf-wincrypt-certsetcertificatecontextproperty#cert_renewal_prop_id). 

If this property is set, its value represents the thumbprint of the *renewal* certificate, and so S-channel will instead attempt to load the linked certificate. In fact, the S-channel will traverse this linked and, hopefully, acyclic list until it ends up with the *final* certificate, one without a renewal mark. This feature, when used judiciously, is a great mitigation against a loss of availability that's caused by, for example, expired certificates. 

In other cases, it can be the cause of outages that are difficult to diagnose and mitigate. S-channel executes the traversal of certificates on their renewal properties unconditionally, irrespective of subject, issuers, or any other specific attributes that participate in the validation of the resulting certificate by the client. It's possible that the resulting certificate has no associated private key, or that the key hasn't been ACLed to its prospective consumer. 
 
If linking is enabled, the Key Vault VM extension, when it retrieves an observed certificate from the key vault, will attempt to find matching, existing certificates to link them via the renewal extension property. The matching is based exclusively on the subject alternative name (SAN), and it works, if there are two existing certificates, as shown in the following examples:
  A: Certificate name (CN) = “Alice's accessories”, SAN = {“alice.universalexports.com”}, renewal = ‘’
  B: CN = “Bob's bits”, SAN = {“bob.universalexports.com”, “bob.universalexports.net”}, renewal = ‘’
 
Assume that a certificate C is retrieved by the Key Vault VM extension: CN = “Mallory's malware”, SAN = {“alice.universalexports.com”, “bob.universalexports.com”, “mallory.universalexports.com”}
 
Certificate A’s SAN list is fully included in C’s, and so A.renewal = C.thumbprint. Certificate B’s SAN list has a common intersection with C’s, but is not fully included in it, so B.renewal remains empty.
 
Any attempt to invoke AcquireCredentialsHandle (S-channel) in this state on certificate A actually ends up sending C to the remote party. In the case of Service Fabric, the [Transport subsystem](service-fabric-architecture.md#transport-subsystem) of a cluster uses S-channel for mutual authentication, and so the previously described behavior affects the cluster’s fundamental communication directly. Continuing with the preceding example, and assuming that A is the cluster certificate, what happens next depends on:

- If C’s private key is not ACLed to the account that Service Fabric is running as, you’ll see failures to acquire the private key (SEC_E_UNKNOWN_CREDENTIALS or similar).
- If C’s private key is accessible, you’ll see authorization failures returned by the other nodes (CertificateNotMatched, unauthorized, and so on). 
 
In either case, transport fails and the cluster might go down. The symptoms vary. To make things worse, the linking depends on the order of renewal, which is dictated by the order of the list of observed certificates of the Key Vault VM extension, the renewal schedule in the key vault, or even transient errors that would alter the order of retrieval.

To mitigate against such incidents, we recommend the following:

- Don't mix the subject alternative names of different vault certificates. Each vault certificate should serve a distinct purpose, and its subject and SAN should reflect that with specificity.
- Include the subject common name in the SAN list (as, literally, `CN=<subject common name>`).  
- If you're unsure about how to proceed, disable linking on renewal for certificates that are provisioned with the Key Vault VM extension. 

   > [!NOTE]
   > Disabling linking is a top-level property of the Key Vault VM extension and can't be set for individual observed certificates.

#### Why should I use a user-assigned managed identity? What are the implications of using it?

As it became evident from the preceding JSON snippets, a specific sequencing of the operations and updates is required to both guarantee the success of the conversion and maintain the availability of the cluster. Specifically, the virtual machine scale set resource declares and uses its identity to retrieve secrets in a (from the user's perspective) single update. 

The Service Fabric VM extension, which bootstraps the cluster, depends on the completion of the Key Vault VM extension, which in turn depends on the successful retrieval of observed certificates. 

The Key Vault VM extension uses the virtual machine scale set's identity to access the key vault, which means that the access policy on the key vault must have been already updated prior to the deployment of the virtual machine scale set. 

To dispose the creation of a managed identity, or to assign it to another resource, the deployment operator must have the required role (ManagedIdentityOperator) in the subscription or the resource group, in addition to the roles that are required to manage the other resources referenced in the template. 

From a security standpoint, recall that the virtual machine scale set is considered a security boundary with regard to its Azure identity. That means that any application that's hosted on the VM could, in principle, obtain an access token representing the VM. Managed identity access tokens are obtained from the unauthenticated Instance Metadata Service endpoint. If you consider the VM to be a shared, or multi-tenant environment, this method of retrieving cluster certificates might not be indicated. It is, however, the only provisioning mechanism suitable for certificate autorollover.

## Troubleshooting and frequently asked questions

**Q: How can I programmatically enroll into a Key Vault-managed certificate?**

Find out the name of the issuer from the Key Vault documentation, and then replace it in the following script:

```PowerShell
  $issuerName=<depends on your PKI of choice>
	$clusterVault="sftestcus"
	$clusterCertVaultName="sftstcncluster"
	$clusterCertCN="cus.cluster.sftstcn.system.servicefabric.azure-int"
	Set-AzKeyVaultCertificateIssuer -VaultName $clusterVault -Name $issuerName -IssuerProvider $issuerName
	$distinguishedName="CN=" + $clusterCertCN
	$policy = New-AzKeyVaultCertificatePolicy `
	    -IssuerName $issuerName `
	    -SubjectName $distinguishedName `
	    -SecretContentType 'application/x-pkcs12' `
	    -Ekus "1.3.6.1.5.5.7.3.1", "1.3.6.1.5.5.7.3.2" `
	    -ValidityInMonths 4 `
	    -KeyType 'RSA' `
	    -RenewAtPercentageLifetime 75        
	Add-AzKeyVaultCertificate -VaultName $clusterVault -Name $clusterCertVaultName -CertificatePolicy $policy
	
	# poll the result of the enrollment
	Get-AzKeyVaultCertificateOperation -VaultName $clusterVault -Name $clusterCertVaultName 
```

**Q: What happens when a certificate is issued by an undeclared or unspecified issuer? Where can I obtain an exhaustive list of active issuers of a specific PKI?**

If the certificate declaration specifies issuer thumbprints, and the direct issuer of the certificate isn't included in the list of pinned issuers, the certificate will be considered invalid, whether or not its root is trusted by the client. Therefore, it's critical to ensure that the list of issuers is current. The introduction of a new issuer is a rare event, and it should be widely publicized before it begins to issue certificates. 

In general, a PKI publishes and maintains a certification practice statement, in accordance with IETF [RFC 7382](https://tools.ietf.org/html/rfc7382). Besides other information, the statement includes all active issuers. Retrieving this list programmatically might differ from one PKI to another.  

For Microsoft-internal PKIs, be sure to consult the internal documentation on the endpoints and SDKs that are used to retrieve the authorized issuers. It is the cluster owner's responsibility to review this list periodically to ensure that their cluster definition includes *all* expected issuers.

**Q: Are multiple PKIs supported?** 

Yes. You may not declare multiple CN entries in the cluster manifest with the same value, but you can list issuers from multiple PKIs that correspond to the same CN. It's not a recommended practice, and certificate transparency practices might prevent such certificates from being issued. However, as a means to migrate from one PKI to another, this is an acceptable mechanism.

**Q: What if the current cluster certificate is not CA-issued, or doesn't have the intended subject?** 

Obtain a certificate with the intended subject, and add it to the cluster's definition as a secondary, by thumbprint. After the upgrade finishes successfully, initiate another cluster configuration upgrade to convert the certificate declaration to common name. 

[Image1]:./media/security-cluster-certificate-mgmt/certificate-journey-thumbprint.png
[Image2]:./media/security-cluster-certificate-mgmt/certificate-journey-common-name.png
