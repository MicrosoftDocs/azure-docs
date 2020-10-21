---
title: Update a cluster to use certificate common name 
description: Learn how to convert a Service Fabric cluster certificate from thumbprint-based declarations to common names.

ms.topic: conceptual
ms.date: 09/06/2019
---
# Convert cluster certificates from thumbprint-based declarations to common names
The signature of a certificate (colloquially known as 'thumbprint') is unique, which means a cluster certificate declared by thumbprint refers to a specific instance of a certificate. This, in turn, makes certificate rollover - and management, in general - difficult and explicit: each change requires orchestrating upgrades of the cluster and the underlying computing hosts. Converting a Service Fabric cluster's certificate declarations from  thumbprint-based to declarations based on the certificate's subject Common Name simplifies management considerably - in particular, rolling over a certificate no longer necessitates a cluster upgrade. This article describes how to convert an existing cluster to common name-based declarations without downtime.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Moving to Certificate Authority (CA)-signed certificates
The security of a cluster whose certificate is declared by thumbprint rests on the fact that it is impossible, or computationally unfeasible to forge a  certificate with the same signature as another one. In this case, the provenance of the certificate is less important, and so self-signed certificates are adequate. By contrast, the security of a cluster with certificates declared by common name flows from the Public Key Infrastructure service (PKI) which issued that certificate, and includes aspects such as their certification practices, whether their operational security is audited and many others. For this reason, the choice of a PKI is important, intimate knowledge of the issuers (Certificate Authority, or CA) is required, and self-signed certificates are essentially worthless. A certificate declared by common name (CN) is typically considered valid if its chain can be built successfully, the subject has the expected CN element, and its issuer (immediate or higher in the chain) is trusted by the agent performing the validation. Service Fabric supports declaring certificates by CN with 'implicit' issuer (the chain must end in a trust anchor), or with issuers declared by thumbprint ("issuer pinning"); please see this  [article](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) for more details. To convert a cluster using a self-signed certificate declared by thumbprint to common name, the target, CA-signed certificate must be first introduced into the cluster by thumbprint; only then is the conversion from TP to CN possible.

For testing purposes, a self-signed certificate can be declared by CN, pinning the issuer to its own thumbprint; from a security standpoint, this is nearly equivalent to declaring the same certificate by TP. Note, however, that a successful conversion of this kind does not guarantee a successful conversion from TP to CN with a CA-signed certificate. Therefore it is recommended to test conversion with a proper, CA-signed certificate (free options exist).

## Upload the certificate and install it in the scale set
In Azure, the recommended mechanism for obtaining and provisioning certificates involves the Azure Key Vault service and its tooling. A certificate matching the cluster certificate declaration must be provisioned to every node of the virtual machine scale sets comprising your cluster; please refer to [secrets on virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#how-do-i-securely-ship-a-certificate-to-the-vm) for further details. It is important that both current and target cluster certificates are installed on the VMs of every node type of the cluster before making changes in the cluster's certificate declarations. The journey from certificate issuance to provisioning onto a Service fabric node is discussed in depth [here](cluster-security-certificate-management.md#the-journey-of-a-certificate).

## Bring cluster to an optimal starting state
Converting a certificate declaration from thumbprint-based to common-name based impacts both:

- How each node in the cluster finds and presents its credentials to other nodes
- How each node validates the credentials of its counterpart upon establishing a secure connection  

Review the [presentation and validation rules for both configurations](cluster-security-certificates.md#certificate-configuration-rules) before proceeding. The most important consideration when performing a thumbprint-to-common name conversion is that upgraded and not-yet-upgraded nodes (that is, nodes belonging to different upgrade domains) must be able to perform successful mutual authentication at any time during the upgrade. The recommended way to achieve this is to declare the target/goal certificate by thumbprint in an initial upgrade, and complete the transition to common name in a subsequent one. If the cluster is already in a recommended starting state, this section can be skipped.

There are multiple valid starting states for a conversion; the invariant is that the cluster is already using the target certificate (declared by thumbprint) at the start of the upgrade to common name. We consider `GoalCert`, `OldCert1`, `OldCert2`:

#### Valid Starting States
- `Thumbprint: GoalCert, ThumbprintSecondary: None`
- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `GoalCert` has a later `NotAfter` date than that of `OldCert1`
- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `GoalCert` has a later `NotAfter` date than that of `OldCert1`

If your cluster is not in one of the valid states described above, please refer to the appendix on achieving that state at the end of this article.

## Select the desired common-name-based certificate validation scheme
As described previously, Service Fabric supports declaring certificates by CN with an implicit trust anchor, or with explicitly pinning the issuer thumbprints. Please refer to [this article](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) for details, and ensure you have a good understanding of the differences, and the implications of choosing either mechanism. Syntactically, this difference/choice is determined by the value of the `certificateIssuerThumbprintList` parameter: empty means relying on a trusted root CA (trust anchor), whereas a set of thumbprints restricts the allowed direct issuers of cluster certificates.

   > [!NOTE]
   > The 'certificateIssuerThumbprint' field allows specifying the expected direct issuers of certificates declared by subject common name. Acceptable values are one or more comma-separated SHA1 thumbprints. Note this is a strengthening of the certificate validation - if no issuers are specified/list is empty, the certificate will be accepted for authentication if its chain can be built, and ends up in a root trusted by the validator. If one or more issuer thumbprints are specified, the certificate will be accepted if the thumbprint of its direct issuer, as extracted from the chain, matches any of the values specified in this field - irrespective of whether the root is trusted or not. Note that a PKI may use different certification authorities ('issuers') to sign certificates with a given subject, and so it is important to specify all expected issuer thumbprints for that subject. In other words, the renewal of a certificate is not guaranteed to be signed by the same issuer as the certificate being renewed.
   >
   > Specifying the issuer is considered a best practice; while omitting it will continue to work - for certificates chaining up to a trusted root - this behavior has limitations and may be phased out in the near future. Also note that clusters deployed in Azure, and secured with X509 certificates issued by a private PKI and declared by subject may not be able to be validated by the Azure Service Fabric service (for cluster-to-service communication), if the PKI's Certificate Policy is not discoverable, available and accessible. 

## Update the Cluster's Azure Resource Management (ARM) Template and Deploy
It is recommended to manage Azure Service Fabric clusters with ARM templates; an alternative, also using json artifacts, is the [Azure Resource Explorer (preview)](https://resources.azure.com). An equivalent experience is not available in the Azure Portal at this time. If the original template corresponding to an existing cluster is not available, an equivalent template can be obtained in the Azure Portal by navigating to the resource group containing the cluster, selecting **Export template** from the **Automation** left-hand menu, and then further selecting the desired resources; at a minimum, the VMSS and cluster resources, respectively, should be exported. The generated template can also be downloaded. Note this template may require changes before it is fully deployable, and may not match exactly the original one - it is a reflection of the current state of the cluster resource.

The necessary changes are as follows:
    - updating the definition of the Service Fabric Node Extension (under the virtual machine resource); if the cluster defines multiple node types, you will need to update the definition of each corresponding virtual machine scale set
    - updating the cluster resource definition

Detailed examples are included below.

### Updating the virtual machine scale set resource(s)
From
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
To
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

### Updating the cluster resource
In the **Microsoft.ServiceFabric/clusters** resource, add a **certificateCommonNames** property with a **commonNames** setting, and remove the **certificate** property altogether (all its settings):

From
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
To
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

For more information, see [Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint.](./service-fabric-create-cluster-using-cert-cn.md)

## Deploy the updated template
Redeploy the updated template after making the changes.

```powershell
$groupname = "sfclustertutorialgroup"

New-AzResourceGroupDeployment -ResourceGroupName $groupname -Verbose `
    -TemplateParameterFile "C:\temp\cluster\parameters.json" -TemplateFile "C:\temp\cluster\template.json" 
```

## Appendix: achieve a valid starting state for converting a cluster to CN-based certificate declarations

| Starting State | Upgrade 1 | Upgrade 2 |
| :--- | :--- | :--- |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `GoalCert` has a later `NotAfter` date than `OldCert1` | `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `OldCert1` has a later `NotAfter` date than `GoalCert` | `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1` | `Thumbprint: GoalCert, ThumbprintSecondary: None` |
| `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: OldCert2` | Remove one of `OldCert1` or `OldCert2` to get to state `Thumbprint: OldCertx, ThumbprintSecondary: None` | Continue from the new starting state |

For instructions on how to carry out any of these upgrades, see [this document](service-fabric-cluster-security-update-certs-azure.md).


## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate by common name](service-fabric-cluster-rollover-cert-cn.md)
* Learn how to [configure a cluster for touchless autorollover](cluster-security-certificate-management.md)

[image1]: ./media/service-fabric-cluster-change-cert-thumbprint-to-cn/PortalViewTemplates.png
