---
title: Certificate management in a Service Fabric cluster 
description: Learn about managing certificates in a Service Fabric cluster secured with X.509 certificates.
ms.topic: conceptual
ms.date: 04/10/2020
ms.custom: sfrev
---
# Certificate management in Service Fabric clusters

This article addresses the management aspects of certificates used to secure communication in Azure Service Fabric clusters, and complements the introduction to [Service Fabric cluster security](service-fabric-cluster-security.md) as well as the explainer on [X.509 certificate-based authentication in Service Fabric](cluster-security-certificates.md). We assume the reader is familiar with fundamental security concepts, and also with the controls that Service Fabric exposes to configure the security of a cluster.  

Aspects covered under this title:

* What exactly is 'certificate management'?
* Roles and entities involved in certificate management
* The journey of a certificate
* Deep dive into an example
* Troubleshooting and Frequently Asked Questions

But first - a disclaimer: this article attempts to pair its theoretical side with hands-on examples, which require, well, specifics of services, technologies, and so on. Since a sizeable part of the audience is Microsoft-internal, we'll refer to services, technologies, and products specific to Microsoft Azure. Feel free to ask in the comments section for clarifications or guidance, where the Microsoft-specific details do not apply in your case.

## Defining certificate management
As we've seen in the [companion article](cluster-security-certificates.md), a certificate is a cryptographic object essentially binding an asymmetric key pair with attributes describing the entity it represents. However, it is also a 'perishable' object, in that its lifetime is finite and is susceptible to compromises - accidental disclosure or a successful exploit can render a certificate useless from a security standpoint. This implies the need to change certificates - either routinely or in response to a security incident. Another aspect of management (and is an entire topic on its own) is the safeguarding of certificate private keys, or of secrets protecting the identities of the entities involved in procuring and provisioning certificates. We refer to the processes and procedures used to obtain certificates and to safely (and securely) transport them to where they are needed as 'certificate management'. Some of the management operations - such as enrollment, policy setting, and authorization controls - are beyond the scope of this article. Still others - such as provisioning, renewal, re-keying, or revocation - are only incidentally related to Service Fabric; nonetheless, we'll address them here to some degree, as understanding these operations can help with properly securing one's cluster. 

The goal is to automate certificate management as much as possible to ensure uninterrupted availability of the cluster and offer security assurances, given that the process is user-touch-free. This goal is attainable currently in Azure Service Fabric clusters; the remainder of the article will first deconstruct certificate management, and later will focus on enabling autorollover.

Specifically, the topics in scope are:
  - assumptions related to the separation of attributions between owner and platform, in the context of managing certificates
  - the long pipeline of certificates from issuance to consumption
  - certificate rotation - why, how and when
  - what could possibly go wrong?

Aspect such as securing/managing domain names, enrolling into certificates, or setting up authorization controls to enforce certificate issuance are out of the scope of this article. Refer to the Registration Authority (RA) of your favorite Public Key Infrastructure (PKI) service. Microsoft-internal consumers: please reach out to Azure Security.

## Roles and entities involved in certificate management
The security approach in a Service Fabric cluster is a case of "cluster owner declares it, Service Fabric runtime enforces it". By that we mean that almost none of the certificates, keys, or other credentials of identities participating in a cluster's functioning come from the service itself; they are all declared by the cluster owner. Furthermore, the cluster owner is also responsible for provisioning the certificates into the cluster, renewing them as needed, and ensuring the security of the certificates at all times. More specifically, the cluster owner must ensure that:
  - certificates declared in the NodeType section of the cluster manifest can be found on each node of that type, according to the [presentation rules](cluster-security-certificates.md#presentation-rules)
  - certificates declared above are installed inclusive of their corresponding private keys
  - certificates declared in the presentation rules should pass the [validation rules](cluster-security-certificates.md#validation-rules) 

Service Fabric, for its part, assumes the responsibilities of:
  - locating/finding certificates matching the declarations in the cluster definition  
  - granting access to the corresponding private keys to Service Fabric-controlled entities on a 'need' basis
  - validating certificates in strict accordance with established security best-practices and the cluster definition
  - raising alerts on impending expiration of certificates, or failures to perform the basic steps of certificate validation
  - validating (to some degree) that the certificate-related aspects of the cluster definition are met by the underlying configuration of the hosts 

It follows that the certificate management burden (as active operations) falls solely on the cluster owner. In the following sections, we'll take a closer look at each of the management operations, with available mechanisms and their impact on the cluster.

## The journey of a certificate
Let us quickly revisit the progression of a certificate from issuance to consumption in the context of a Service Fabric cluster:

  1. A domain owner registers with the RA of a PKI a domain or subject that they'd like to associate with ensuing certificates; the certificates will, in turn, constitute proofs of ownership of said domain or subject
  2. The domain owner also designates in the RA the identities of authorized requesters - entities that are entitled to request the enrollment of certificates with the specified domain or subject; in Microsoft Azure, the default identity provider is Azure Active Directory, and authorized requesters are designated by their corresponding AAD identity (or via security groups)
  3. An authorized requester then enrolls into a certificate via a Secret Management Service; in Microsoft Azure, the SMS of choice is Azure Key Vault (AKV), which securely stores and allows the retrieval of secrets/certificates by authorized entities. AKV also renews/re-keys the certificate as configured in the associated certificate policy. (AKV uses AAD as the identity provider.)
  4. An authorized retriever - which we'll refer to as a 'provisioning agent' - retrieves the certificate, inclusive of its private key, from the vault, and installs it on the machines hosting the cluster
  5. The Service Fabric service (running elevated on each node) grants access to the certificate to allowed Service Fabric entities; these are designated by local groups, and split between ServiceFabricAdministrators and ServiceFabricAllowedUsers
  6. The Service Fabric runtime accesses and uses the certificate to establish federation, or to authenticate to inbound requests from authorized clients
  7. The provisioning agent monitors the vault certificate, and triggers the provisioning flow upon detecting renewal; subsequently, the cluster owner updates the cluster definition, if needed, to indicate the intent to roll over the certificate.
  8. The provisioning agent or the cluster owner is also responsible for cleaning up/deleting unused certificates
  
For our purposes, the first two steps in the sequence above are largely unrelated; the only connection is that the subject common name of the certificate is the DNS name declared in the cluster definition.

These steps are illustrated below; note the differences in provisioning between certificates declared by thumbprint and common name, respectively.

*Fig. 1.* Issuance and provisioning flow of certificates declared by thumbprint.
![Provisioning certificates declared by thumbprint][Image1]

*Fig. 2.* Issuance and provisioning flow of certificates declared by subject common name.
![Provisioning certificates declared by subject common name][Image2]

### Certificate enrollment
This topic is covered in detail in the Key Vault [documentation](../key-vault/create-certificate.md); we're including a synopsis here for continuity and easier reference. Continuing with Azure as the context, and using Azure Key Vault as the secret management service, an authorized certificate requester must have at least certificate management permissions on the vault, granted by the vault owner; the requester would then enroll into a certificate as follows:
    - creates a certificate policy in Azure Key Vault (AKV), which specifies the domain/subject of the certificate, the desired issuer, key type and length, intended key usage and more; see [Certificates in Azure Key Vault](../key-vault/certificate-scenarios.md) for details. 
    - creates a certificate in the same vault with the policy specified above; this, in turn, generates a key pair as vault objects, a certificate signing request signed with the private key, and which is then forwarded to the designated issuer for signing
    - once the issuer (Certificate Authority) replies with the signed certificate, the result is merged into the vault, and the certificate is available for the following operations:
      - under {vaultUri}/certificates/{name}: the certificate including the public key and metadata
      - under {vaultUri}/keys/{name}: the certificate's private key, available for cryptographic operations (wrap/unwrap, sign/verify)
      - under {vaultUri}/secrets/{name}: the certificate inclusive of its private key, available for downloading as an unprotected pfx or pem file  
	Recall that a vault certificate is, in fact, a chronological line of certificate instances, sharing a policy. Certificate versions will be created according to the lifetime and renewal attributes of the policy. It is highly recommended that vault certificates not share subjects or domains/DNS names; it can be disruptive in a cluster to provision certificate instances from different vault certificates, with identical subjects but substantially different other attributes, such as issuer, key usages etc.

At this point, a certificate exists in the vault, ready for consumption. Onward to:

### Certificate provisioning
We mentioned a 'provisioning agent', which is the entity that retrieves the certificate, inclusive of its private key, from the vault and installs it on to each of the hosts of the cluster. (Recall that Service Fabric does not provision certificates.) In our context, the cluster will be hosted on a collection of Azure VMs and/or virtual machine scale sets. In Azure, provisioning a certificate from a vault to a VM/VMSS can be achieved with the following mechanisms - assuming, as above, that the provisioning agent was previously granted 'get' permissions on the vault by the vault owner: 
  - ad-hoc: an operator retrieves the certificate from the vault (as pfx/PKCS #12 or pem) and installs it on each node
  - as a virtual machine scale set 'secret' during deployment: the Compute service retrieves, using its first party identity on behalf of the operator, the certificate from a template-deployment-enabled vault and installs it on each node of the virtual machine scale set ([like so](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#certificates)); note this allows the provisioning of versioned secrets only
  - using the [Key Vault VM extension](../virtual-machines/extensions/key-vault-windows.md); this allows the provisioning of certificates using version-less declarations, with periodic refreshing of observed certificates. In this case, the VM/VMSS is expected to have a [managed identity](../virtual-machines/windows/security-policy.md#managed-identities-for-azure-resources), an identity that has been granted access to the vault(s) containing the observed certificates.

The ad-hoc mechanism is not recommended for multiple reasons, ranging from security to availability, and won't be discussed here further; for details, refer to [certificates in virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#certificates).

The VMSS-/Compute-based provisioning presents security and availability advantages, but it also presents restrictions. It requires - by design - declaring certificates as versioned secrets, which makes it suitable only for clusters secured with certificates declared by thumbprint. In contrast, the Key Vault VM extension-based provisioning will always install the latest version of each observed certificate, which makes it suitable only for clusters secured with certificates declared by subject common name. To emphasize, do not use an autorefresh provisioning mechanism (such as the KVVM extension) for certificates declared by instance (that is, by thumbprint) - the risk of losing availability is considerable.

Other provisioning mechanisms may exist; the above are currently accepted for Azure Service Fabric clusters.

### Certificate consumption and monitoring
As mentioned earlier, the Service Fabric runtime is responsible for locating and using the certificates declared in the cluster definition. The article on [certificate-based authentication](cluster-security-certificates.md) explained in detail how Service Fabric implements the presentation and validation rules, respectively, and won't be revisited here. We are going to look at access and permission granting, as well as monitoring.

Recall that certificates in Service Fabric are used for a multitude of purposes, from mutual authentication in the federation layer to TLS authentication for the management endpoints; this requires various components or system services to have access to the certificate's private key. The Service Fabric runtime regularly scans the certificate store, looking for matches for each of the known presentation rules; for each of the matching certificates, the corresponding private key is located, and its discretionary access control list is updated to include permissions - typically Read and Execute - granted to the respective identity that requires them. (This process is informally referred to as 'ACLing'.) The process runs on a 1-minute cadence, and also covers 'application' certificates, such as those used to encrypt settings or as endpoint certificates. ACLing follows the presentation rules, so it's important to keep in mind that certificates declared by thumbprint and which are autorefreshed without the ensuing cluster configuration update will not be accessible.    

### Certificate rotation
As a side note: IETF [RFC 3647](https://tools.ietf.org/html/rfc3647) formally defines [renewal](https://tools.ietf.org/html/rfc3647#section-4.4.6) as the issuance of a certificate with the same attributes as the certificate being replaced - the issuer, the subject's public key and information is preserved, and [re-keying](https://tools.ietf.org/html/rfc3647#section-4.4.7) as the issuance of a certificate with a new key pair, and no restrictions on whether or not the issuer may change. Given the distinction may be important (consider the case of certificates declared by subject common name with issuer pinning), we'll opt for the neutral term 'rotation' to cover both scenarios. (Do keep in mind that, when informally used, 'renewal' refers, in fact, to re-keying.) 

We've seen earlier that Azure Key Vault supports automatic certificate rotation: the associate certificate policy defines the point in time, whether by days before expiration or percentage of total lifetime, when the certificate is rotated in the vault. The provisioning agent must be invoked after this point in time, and prior to the expiration of the now-previous certificate, to distribute this new certificate to all of the nodes of the cluster. Service Fabric will assist by raising health warnings when the expiration date of a certificate (and which is currently in use in the cluster) occurs sooner than a predetermined interval. An automatic provisioning agent (i.e. the KeyVault VM extension), configured to observe the vault certificate, will periodically poll the vault, detect the rotation, and retrieve and install the new certificate. Provisioning done via VM/VMSS 'secrets' feature will require an authorized operator to update the VM/VMSS with the versioned KeyVault URI corresponding to the new certificate.

In either case, the rotated certificate is now provisioned to all of the nodes, and we have described the mechanism Service Fabric employs to detect rotations; let us examine what happens next - assuming the rotation applied to the cluster certificate declared by subject common name (all applicable as of the time of this writing, and Service Fabric runtime version 7.1.409):
  - for new connections within, as well as into the cluster, the Service Fabric runtime will find and select the matching certificate with the farthest expiration date (the 'NotAfter' property of the certificate, often abbreviated as 'na')
  - existing connections will be kept alive/allowed to naturally expire or otherwise terminate; an internal handler will have been notified that a new match exists

This translates into the following important observations:
  - The renewal certificate may be ignored if its expiration date is sooner than that of the certificate currently in use.
  - The availability of the cluster, or of the hosted applications, takes precedence over the directive to rotate the certificate; the cluster will converge on the new certificate eventually, but without timing guarantees. It follows that:
  - It may not be immediately obvious to an observer that the rotated certificate completely replaced its predecessor; the only way to ensure that is (for cluster certificates) to reboot the host machines. Note it is not sufficient to restart the Service Fabric nodes, as kernel mode components which form lease connections in a cluster will not be affected. Also note that restarting the VM/VMSS may cause temporary loss of availability. (For application certificates, it is sufficient to restart the respective application instances only.)
  - Introducing a re-keyed certificate that does not meet the validation rules can effectively break the cluster. The most common example of this is the case of an unexpected issuer: the cluster certificates are declared by subject common name with issuer pinning, but the rotated certificate was issued by a new/undeclared issuer.     

### Certificate cleanup
At this time, there are no provisions in Azure for explicit removal of certificates. It is often a non-trivial task to determine whether or not a given certificate is being used at a given time. This is more difficult for application certificates than for cluster certificates. Service Fabric itself, not being the provisioning agent, will not delete a certificate declared by the user under any circumstance. For the standard provisioning mechanisms:
  - Certificates declared as VM/VMSS secrets will be provisioned as long as they are referenced in the VM/VMSS definition, and they are retrievable from the vault (deleting a vault secret/certificate will fail subsequent VM/VMSS deployments; similarly, disabling a secret version in the vault will also fail VM/VMSS deployments, which reference that secret version)
  - Previous versions of certificates provisioned via the KeyVault VM extension may or may not be present on a VM/VMSS node. The agent only retrieves and installs the current version, and does not remove any certificates. Reimaging a node (which typically occurs every month) will reset the certificate store to the content of the OS image, and so previous versions will implicitly be removed. Consider, though, that scaling up a virtual machine scale set will result in only the current version of observed certificates being installed; do not assume homogeneity of nodes with regard to installed certificates.   

## Simplifying management - an autorollover example
We've described mechanisms, restrictions, outlined intricate rules and definitions, and made dire predictions of outages. It is, perhaps, time to show how to set up automatic certificate management to avoid all of these concerns. We're doing so in the context of an Azure Service Fabric cluster running on an PaaSv2 virtual machine scale set, using Azure Key Vault for secrets management and leveraging managed identities, as follows:
  - Validation of certificates is changed from thumbprint-pinning to subject + issuer pinning: any certificate with a given subject from a given issuer is equally trusted
	- Certificates are enrolled into and obtained from a trusted store (Key Vault), and refreshed by an agent - in this case, the KeyVault VM extension
	- Provisioning of certificates is changed from deployment-time and version-based (as done by ComputeRP) to post-deployment and using version-less KeyVault URIs
	- Access to KeyVault is granted via user-assigned managed identities; the UA identity is created and assigned to the virtual machine scale set during deployment
	- After deployment, the agent (the KV VM extension) will poll and refresh observed certificates on each node of the virtual machine scale set; certificate rotation is thus fully automated, as SF will automatically pick up the farthest valid certificate

The sequence is fully scriptable/automated and allows a user-touch-free initial deployment of a cluster configured for certificate autorollover. Detailed steps are provided below. We'll use a mix of PowerShell cmdlets and fragments of json templates. The same functionality is achievable with all supported means of interacting with Azure.

[!NOTE] This example assumes a certificate exists already in the vault; enrolling and renewing a KeyVault-managed certificate requires prerequisite manual steps as described earlier in this article. For production environments, use KeyVault-managed certificates - a sample script specific to a Microsoft-internal PKI is included below.
Certificate autorollover only makes sense for CA-issued certificates; using self-signed certificates, including those generated when deploying a Service Fabric cluster in the Azure portal, is nonsensical, but still possible for local/developer-hosted deployments, by declaring the issuer thumbprint to be the same as of the leaf certificate.

### Starting point
For brevity, we will assume the following starting state:
  - The Service Fabric cluster exists, and is secured with a CA-issued certificate declared by thumbprint.
  - The certificate is stored in a vault, and provisioned as a virtual machine scale set secret
  - The same certificate will be used to convert the cluster to common name-based certificate declarations, and so can be validated by subject and issuer; if this is not the case, obtain the CA-issued certificate intended for this purpose, and add it to the cluster definition by thumbprint as explained [here](service-fabric-cluster-security-update-certs-azure.md)

Here is a json excerpt from a template corresponding to such a state - note this omits many required settings, and only illustrates the certificate-related aspects:
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

The above essentially says that certificate with thumbprint ```json [parameters('primaryClusterCertificateTP')] ``` and found at KeyVault URI ```json [parameters('clusterCertificateUrlValue')] ``` is declared as the cluster's sole certificate, by thumbprint. Next we'll set up the additional resources needed to ensure the autorollover of the certificate.

### Setting up prerequisite resources
As mentioned before, a certificate provisioned as a virtual machine scale set secret is retrieved from the vault by the Microsoft.Compute Resource Provider service, using its first-party identity and on behalf of the deployment operator. For autorollover, that will change - we'll  switch to using a managed identity, assigned to the virtual machine scale set, and which is granted permissions to the vault's secrets.

All of the subsequent excerpts should be deployed concomitantly - they are listed individually for play-by-play analysis and explanations.

First define a user assigned identity (default values are included as examples) - refer to the [official documentation](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm#create-a-user-assigned-managed-identity) for up-to-date information:
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

Then grant this identity access to the vault secrets - refer to the [official documentation](https://docs.microsoft.com/rest/api/keyvault/vaults/updateaccesspolicy) for current information:
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

In the next step, we'll:
  - assign the user-assigned identity to the virtual machine scale set
  - declare the virtual machine scale set' dependency on the creation of the managed identity, and on the result of granting it access to the vault
  - declare the KeyVault VM extension, requiring that it retrieves observed certificates on startup ([official documentation](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows))
  - update the definition of the Service Fabric VM extension to depend on the KVVM extension, and to convert the cluster cert to common name
(We're making these changes in a single step since they fall under the scope of the same resource.)

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
Note, although not explicitly listed above, that we removed the vault certificate URL from the 'OsProfile' section of the virtual machine scale set.
The last step is to update the cluster definition to change the certificate declaration from thumbprint to common name - here we are also pinning the issuer thumbprints:

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

At this point, you can run the updates mentioned above in a single deployment; for its part, the Service Fabric Resource Provider service will split the cluster upgrade in several steps, as described in the segment on [converting cluster certificates from thumbprint to common name](cluster-security-certificates.md#converting-a-cluster-from-thumbprint--to-common-name-based-certificate-declarations).

### Analysis and observations
This section is a catch-all for explaining steps detailed above, as well as drawing attention to important aspects.

#### Certificate provisioning, explained
The KVVM extension, as a provisioning agent, runs continuously on a predetermined frequency. On failing to retrieve an observed certificate, it would continue to the next in line, and then hibernate until the next cycle. The SFVM extension, as the cluster bootstrapping agent, will require the declared certificates before the cluster can form. This, in turn, means that the SFVM extension can only run after the successful retrieval of the cluster certificate(s), denoted here by the ```json "provisionAfterExtensions" : [ "KVVMExtension" ]"``` clause, and by the KeyVaultVM extension's ```json "requireInitialSync": true``` setting. This indicates to the KVVM extension that on the first run (after deployment or a reboot) it must cycle through its observed certificates until all are downloaded successfully. Setting this parameter to false, coupled with a failure to retrieve the cluster certificate(s) would result in a failure of the cluster deployment. Conversely, requiring an initial sync with an incorrect/invalid list of observed certificates would result in a failure of the KVVM extension, and so, again, a failure to deploy the cluster.  

#### Certificate linking, explained
You may have noticed the KVVM extension's 'linkOnRenewal' flag, and the fact that it is set to false. We're addressing here in depth the behavior controlled by this flag and its implications on the functioning of a cluster. Note this behavior is specific to Windows.

According to its [definition](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows#extension-schema):
```json
"linkOnRenewal": <Only Windows. This feature enables auto-rotation of SSL certificates, without necessitating a re-deployment or binding.  e.g.: false>,
```

Certificates used to establish a TLS connection are typically [acquired as a handle](https://docs.microsoft.com/windows/win32/api/sspi/nf-sspi-acquirecredentialshandlea) via the S-channel Security Support Provider – that is, the client does not directly access the private key of the certificate itself. S-channel supports redirection (linking) of credentials in the form of a certificate extension ([CERT_RENEWAL_PROP_ID](https://docs.microsoft.com/windows/win32/api/wincrypt/nf-wincrypt-certsetcertificatecontextproperty#cert_renewal_prop_id)): if this property is set, its value represents the thumbprint of the ‘renewal’ certificate, and so S-channel will instead attempt to load the linked certificate. In fact, it will traverse this linked (and hopefully acyclic) list until it ends up with the ‘final’ certificate – one without a renewal mark. This feature, when used judiciously, is a great mitigation against loss of availability caused by expired certificates (for instance). In other cases, it can be the cause of outages that are difficult to diagnose and mitigate. S-channel executes the traversal of certificates on their renewal properties unconditionally - irrespective of subject, issuers, or any other specific attributes that participate in the validation of the resulting certificate by the client. It is possible, indeed, that the resulting certificate has no associated private key, or the key has not been ACLed to its prospective consumer. 
 
If linking is enabled, the KeyVault VM extension, upon retrieving an observed certificate from the vault, will attempt to find matching, existing certificates in order to link them via the renewal extension property. The matching is (exclusively) based on Subject Alternative Name (SAN), and works as exemplified below.
Assume two existing certificates, as follows:
  A: CN = “Alice's accessories”, SAN = {“alice.universalexports.com”}, renewal = ‘’
  B: CN = “Bob's bits”, SAN = {“bob.universalexports.com”, “bob.universalexports.net”}, renewal = ‘’
 
Assume a certificate C is retrieved by the KVVM ext: CN = “Mallory's malware”, SAN = {“alice.universalexports.com”, “bob.universalexports.com”, “mallory.universalexports.com”}
 
A’s SAN list is fully included in C’s, and so A.renewal = C.thumbprint; B’s SAN list has a common intersection with C’s, but is not fully included in it, so B.renewal remains empty.
 
Any attempt to invoke AcquireCredentialsHandle (S-channel) in this state on certificate A will actually end up sending C to the remote party. In the case of Service Fabric, the [Transport subsystem](service-fabric-architecture.md#transport-subsystem) of a cluster uses S-channel for mutual authentication, and so the behavior described above affects the cluster’s fundamental communication directly. Continuing the example above, and assuming A is the cluster certificate, what happens next depends:
  - if C’s private key is not ACLd to the account that Fabric is running as, we’ll see failures to acquire the private key (SEC_E_UNKNOWN_CREDENTIALS or similar)
  - if C’s private key is accessible, then we’ll see authorization failures returned by the other nodes (CertificateNotMatched, unauthorized etc.) 
 
In either case, transport fails and the cluster may go down; the symptoms vary. To make things worse, the linking depends on the order of renewal – which is dictated by the order of the list of observed certificates of the KVVM extension, the renewal schedule in the vault or even transient errors that would alter the order of retrieval.

To mitigate against such incidents, we recommend:
  - do not mix the SANs of different vault certificates; each vault certificate should serve a distinct purpose, and their subject and SAN should reflect that with specificity
  - include the subject common name in the SAN list (as, literally, "CN=<subject common name>")  
  - if unsure, disable linking on renewal for certificates provisioned with the KVVM extension 

#### Why use a user-assigned managed identity? What are the implications of using it?
As it emerged from the json snippets above, a specific sequencing of the operations/updates is required to guarantee the success of the conversion, and to maintain the availability of the cluster. Specifically, the virtual machine scale set resource declares and uses its identity to retrieve secrets in a single (from the user's perspective) update. The Service Fabric VM extension (which bootstraps the cluster) depends on the completion of KeyVault VM extension, which depends on the successful retrieval of observed certificates. The KVVM extension uses the virtual machine scale set's identity to access the vault, which means that the access policy on the vault must have been already updated prior to the deployment of the virtual machine scale set. 

To dispose the creation of a managed identity, or to assign it to another resource, the deployment operator must have the required role (ManagedIdentityOperator) in the subscription or the resource group, in addition to the roles required to manage the other resources referenced in the template. 

From a security standpoint, recall that the virtual machine (scale set) is considered a security boundary with regards to its Azure identity. That means that any application hosted on the VM could, in principle, obtain an access token representing the VM - managed identity access tokens are obtained from the unauthenticated IMDS endpoint. If you consider the VM to be a shared, or multi-tenant environment, then perhaps this method of retrieving cluster certificates is not indicated. It is, however, the only provisioning mechanism suitable for certificate autorollover.

## Troubleshooting and frequently asked questions

*Q*: How to programmatically enroll into a KeyVault-managed certificate?
*A*: Find out the name of the issuer from the KeyVault documentation, then replace it in the script below.  
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

*Q*: What happens when a certificate is issued by an undeclared/unspecified issuer? Where can I obtain the exhaustive list of active issuers of a given PKI?
*A*: If the certificate declaration specifies issuer thumbprints, and the direct issuer of the certificate is not included in the list of pinned issuers, the certificate will be considered invalid - irrespective of whether or not its root is trusted by the client. Therefore it is critical to ensure the list of issuers is current/up to date. The introduction of a new issuer is a rare event, and should be widely publicized prior to it beginning to issue certificates. 

In general, a PKI will publish and maintain a certification practice statement, in accordance with IETF [RFC 7382](https://tools.ietf.org/html/rfc7382). Among other information, it will include all active issuers. Retrieving this list programmatically may differ from a PKI to another.   

For Microsoft-internal PKIs, please consult the internal documentation on the endpoints/SDKs used to retrieve the authorized issuers; it is the cluster owner's responsibility to probe this list periodically, and ensure their cluster definition includes *all* expected issuers.

*Q*: Are multiple PKIs supported? 
*A*: Yes; you may not declare multiple CN entries in the cluster manifest with the same value, but can list issuers from multiple PKIs corresponding to the same CN. It is not a recommended practice, and certificate transparency practices may prevent such certificates from being issued. However, as means to migrate from one PKI to another, this is an acceptable mechanism.

*Q*: What if the current cluster certificate is not CA-issued, or does not have the intended subject? 
*A*: Obtain a certificate with the intended subject, and add it to the cluster's definition as a secondary, by thumbprint. Once the upgrade completed successfully, initiate another cluster configuration upgrade to convert the certificate declaration to common name. 

[Image1]:./media/security-cluster-certificate-mgmt/certificate-journey-thumbprint.png
[Image2]:./media/security-cluster-certificate-mgmt/certificate-journey-common-name.png

