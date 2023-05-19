---
title: Update a cluster to use certificate common name 
description: Learn how to convert an Azure Service Fabric cluster certificate from thumbprint-based declarations to common names.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 07/14/2022
---

# Convert cluster certificates from thumbprint-based declarations to common names

The signature of a certificate (commonly known as a thumbprint) is unique. A cluster certificate declared by thumbprint refers to a specific instance of a certificate. This specificity makes certificate rollover, and management in general, difficult and explicit. Each change requires orchestrating upgrades of the cluster and the underlying computing hosts.

Converting an Azure Service Fabric cluster's certificate declarations from thumbprint-based to declarations based on the certificate's subject common name (CN) simplifies management considerably. In particular, rolling over a certificate no longer requires a cluster upgrade. This article describes how to convert an existing cluster to CN-based declarations without downtime.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Move to certificate authority-signed certificates

The security of a cluster whose certificate is declared by thumbprint rests on the fact that it's impossible, or computationally unfeasible, to forge a certificate with the same signature as another one. In this case, the provenance of the certificate is less important, so self-signed certificates are adequate.

By contrast, the security of a cluster whose certificates are declared by CN flows from the implicit trust the cluster owner has in their certificate provider. The provider is the public key infrastructure (PKI) service that issued the certificate. Trust is based, among other factors, on the PKI's certification practices, whether their operational security is audited and approved by yet-other trusted parties, and so on.

The cluster owner must also have detailed knowledge of which certificate authorities (CAs) are issuing their certificates, since this is a fundamental aspect of validating certificates by subject. This also implies that self-signed certificates are wholly unsuitable for this purpose. Literally anyone can generate a certificate with a given subject.

A certificate declared by CN is typically considered valid if:

* Its chain can be built successfully.
* The subject has the expected CN element.
* Its issuer (immediate or higher in the chain) is trusted by the agent performing the validation.

Service Fabric supports declaring certificates by CN in two ways:

* With *implicit* issuers, which means the chain must end in a trust anchor.
* With issuers declared by thumbprint, which is known as issuer pinning.

For more information, see [Common-name-based certificate validation declarations](cluster-security-certificates.md#common-name-based-certificate-validation-declarations).

To convert a cluster by using a self-signed certificate declared by thumbprint to CN, the target, CA-signed certificate must be first introduced into the cluster by thumbprint. Only then is the conversion from thumbprint to CN possible.

For testing purposes, a self-signed certificate *could* be declared by CN, but only if the issuer is pinned to its own thumbprint. From a security standpoint, this action is nearly equivalent to declaring the same certificate by thumbprint. A successful conversion of this kind doesn't guarantee a successful conversion from thumbprint to CN with a CA-signed certificate. We recommend you test conversion with a proper, CA-signed certificate. Free options exist for this testing.

## Upload the certificate and install it in the scale set

In Azure, the recommended mechanism for obtaining and provisioning certificates involves Azure Key Vault and its tooling. A certificate matching the cluster certificate declaration must be provisioned to every node of the virtual machine scale sets that comprise your cluster. For more information, see [Secrets on virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.yml#how-do-i-securely-ship-a-certificate-to-the-vm-).

It's important to install both current and target cluster certificates on the virtual machines of every node type of the cluster before you make changes in the cluster's certificate declarations. The journey from certificate issuance to provisioning onto a Service Fabric node is discussed in depth in [The journey of a certificate](cluster-security-certificate-management.md#the-journey-of-a-certificate).

## Bring the cluster to an optimal starting state

Converting a certificate declaration from thumbprint-based to CN-based impacts:

- How each node in the cluster finds and presents its credentials to other nodes.
- How each node validates the credentials of its counterpart upon establishing a secure connection.

Review the [presentation and validation rules for both configurations](cluster-security-certificates.md#certificate-configuration-rules) before you proceed. The most important consideration when you perform a thumbprint-to-CN conversion is that upgraded and not-yet-upgraded nodes (that is, nodes belonging to different upgrade domains) must be able to perform successful mutual authentication at any time during the upgrade. The recommended way to achieve this behavior is to declare the target or goal certificate by thumbprint in an initial upgrade. Then complete the transition to CN in a subsequent one. If the cluster is already in a recommended starting state, you can skip this section.

There are multiple valid starting states for a conversion. The invariant is that the cluster is already using the target certificate (declared by thumbprint) at the start of the upgrade to CN. We consider `GoalCert`, `OldCert1`, and `OldCert2` in this article.

#### Valid starting states

- `Thumbprint: GoalCert, ThumbprintSecondary: None`
- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `GoalCert` has a later `NotBefore` date than that of `OldCert1`
- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `GoalCert` has a later `NotBefore` date than that of `OldCert1`

> [!NOTE]
> Prior to version 7.2.445 (7.2 CU4), Service Fabric selected the farthest expiring certificate (the certificate with the farthest 'NotAfter' property), so the above starting states prior to 7.2 CU4 require GoalCert to have a later `NotAfter` date than `OldCert1`

If your cluster isn't in one of the valid states previously described, see information on achieving that state in the section at the end of this article.

## Select the desired CN-based certificate validation scheme

As described previously, Service Fabric supports declaring certificates by CN with an implicit trust anchor or with explicitly pinning the issuer thumbprints. For more information, see [Common-name-based certificate validation declarations](cluster-security-certificates.md#common-name-based-certificate-validation-declarations).

Ensure you have a good understanding of the differences and the implications of choosing either mechanism. Syntactically, this difference or choice is determined by the value of the `certificateIssuerThumbprintList` parameter. Empty means relying on a trusted root CA (trust anchor), whereas a set of thumbprints restricts the allowed direct issuers of cluster certificates.

   > [!NOTE]
   > The `certificateIssuerThumbprint` field allows you to specify the expected direct issuers of certificates declared by subject CN. Acceptable values are one or more comma-separated SHA1 thumbprints. This action strengthens the certificate validation.
   >
   > If no issuers are specified or the list is empty, the certificate will be accepted for authentication if its chain can be built. The certificate then ends up in a root trusted by the validator. If one or more issuer thumbprints are specified, the certificate will be accepted if the thumbprint of its direct issuer, as extracted from the chain, matches any of the values specified in this field. The certificate will be accepted whether the root is trusted or not.
   >
   > A PKI might use different certification authorities (also known as *issuers*) to sign certificates with a given subject. For this reason, it's important to specify all expected issuer thumbprints for that subject. In other words, the renewal of a certificate isn't guaranteed to be signed by the same issuer as the certificate being renewed.
   >
   > Specifying the issuer is considered a best practice. Omitting the issuer will continue to work for certificates chaining up to a trusted root, but this behavior has limitations and might be phased out in the near future. Clusters deployed in Azure, secured with X509 certificates issued by a private PKI, and declared by subject might not be able to be validated by Service Fabric (for cluster-to-service communication). Validation requires the PKI's certificate policy to be discoverable, available, and accessible.

## Update the cluster's Azure Resource Manager template and deploy

Manage your Service Fabric clusters with Azure Resource Manager (ARM) templates. An alternative, which also uses JSON artifacts, is the [Azure Resource Explorer (preview)](https://resources.azure.com). An equivalent experience isn't available in the Azure portal at this time.

If the original template corresponding to an existing cluster isn't available, an equivalent template can be obtained in the Azure portal. Go to the resource group that contains the cluster, and select **Export template** from the **Automation** menu on the left. Then select the resources you want. At a minimum, the virtual machine scale set and cluster resources, respectively, should be exported. The generated template can also be downloaded. This template might require changes before it's fully deployable. The template also might not match the original one exactly. It's a reflection of the current state of the cluster resource.

The necessary changes are as follows:

- Updating the definition of the Service Fabric node extension (under the virtual machine resource). If the cluster defines multiple node types, you'll need to update the definition of each corresponding virtual machine scale set.
- Updating the cluster resource definition.

Detailed examples are included here.

### Update the virtual machine scale set resources
From:
```json
"virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
                    "properties": {
                        "type": "ServiceFabricNode",
                        "autoUpgradeMinorVersion": true,
                        "protectedSettings": {
                            ...
                        },
                        "publisher": "Microsoft.Azure.ServiceFabric",
                        "settings": {
                            ...
                            "certificate": {
                                "thumbprint": "[parameters('certificateThumbprint')]",
                                "x509StoreName": "[parameters('certificateStoreValue')]"
                            }
                        },
                        ...
                    }
                },
```
To:
```json
"virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
                    "properties": {
                        "type": "ServiceFabricNode",
                        "autoUpgradeMinorVersion": true,
                        "protectedSettings": {
                            ...
                        },
                        "publisher": "Microsoft.Azure.ServiceFabric",
                        "settings": {
                            ...
                            "certificate": {
                                "commonNames": [
                                    "[parameters('certificateCommonName')]"
                                ],
                                "x509StoreName": "[parameters('certificateStoreValue')]"
                            }
                        },
                        ...
                    }
                },
```

### Update the cluster resource

In the **Microsoft.ServiceFabric/clusters** resource, add a **certificateCommonNames** property with a **commonNames** setting, and remove the **certificate** property altogether (all its settings).

From:
```json
    {
        "apiVersion": "2018-02-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "dependsOn": [
            ...
        ],
        "properties": {
            "addonFeatures": [
                ...
            ],
            "certificate": {
              "thumbprint": "[parameters('certificateThumbprint')]",
              "x509StoreName": "[parameters('certificateStoreValue')]"
            },
        ...
```
To:
```json
    {
        "apiVersion": "2018-02-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "dependsOn": [
            ...
        ],
        "properties": {
            "addonFeatures": [
                ...
            ],
            "certificateCommonNames": {
                "commonNames": [
                    {
                        "certificateCommonName": "[parameters('certificateCommonName')]",
                        "certificateIssuerThumbprint": "[parameters('certificateIssuerThumbprintList')]"
                    }
                ],
                "x509StoreName": "[parameters('certificateStoreValue')]"
            },
        ...
```

For more information, see [Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint](./service-fabric-create-cluster-using-cert-cn.md).

## Deploy the updated template

Redeploy the updated template after you make the changes.

```powershell
$groupname = "sfclustertutorialgroup"

New-AzResourceGroupDeployment -ResourceGroupName $groupname -Verbose `
    -TemplateParameterFile "C:\temp\cluster\parameters.json" -TemplateFile "C:\temp\cluster\template.json" 
```

## Achieve a valid starting state for converting a cluster to CN-based certificate declarations

| Starting state | Upgrade 1 | Upgrade 2 |
| :--- | :--- | :--- |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `GoalCert` has a later `NotBefore` date than `OldCert1` | `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `OldCert1` has a later `NotBefore` date than `GoalCert` | `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1` | `Thumbprint: GoalCert, ThumbprintSecondary: None` |
| `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `OldCert1` has a later `NotBefore` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `OldCert1` has a later `NotBefore` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: OldCert2` | Remove one of `OldCert1` or `OldCert2` to get to state `Thumbprint: OldCertx, ThumbprintSecondary: None` | Continue from the new starting state |

> [!NOTE]
> For a cluster on a version prior to version 7.2.445 (7.2 CU4), replace `NotBefore` with `NotAfter` in the above states.

For instructions on how to carry out any of these upgrades, see [Manage certificates in an Azure Service Fabric cluster](service-fabric-cluster-security-update-certs-azure.md).

## Next steps

* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [roll over a cluster certificate by common name](service-fabric-cluster-rollover-cert-cn.md).
* Learn how to [configure a cluster for touchless autorollover](cluster-security-certificate-management.md).

[image1]: ./media/service-fabric-cluster-change-cert-thumbprint-to-cn/PortalViewTemplates.png
