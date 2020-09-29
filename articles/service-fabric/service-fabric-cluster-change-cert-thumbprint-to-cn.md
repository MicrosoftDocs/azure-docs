---
title: Update a cluster to use certificate common name 
description: Learn how to switch a Service Fabric cluster from using certificate thumbprints to using certificate common name.

ms.topic: conceptual
ms.date: 09/06/2019
---
# Change cluster from certificate thumbprint to common name
No two certificates can have the same thumbprint, which makes cluster certificate rollover or management difficult. Multiple certificates, however, can have the same common name or subject.  Switching a deployed cluster from using certificate thumbprints to using certificate common names makes certificate management much simpler. This article describes how to update a running Service Fabric cluster to use the certificate common name instead of the certificate thumbprint.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Moving to Certificate Authority (CA)-signed certificates
For thumbprint-based clusters, trust in a particular certificate comes from the cryptographic uniqueness of its thumbprint, and this allows some cluster owners to use self-signed certificates. For a certificate declared by common name, trust in the certificate cannot come from the common name, which is not necessarily unique, but comes from trust in the issuer of the certificate. For this reason, CA-signed certificates are required for this declaration-style. [Trust in the issuer can be established by the root CA being installed in the trusted root store of the node, or by pinning the direct issuers of the certificate.](cluster-security-certificates.md#common-name-based-certificate-validation-declarations)

A question that may arise is, which common name to use? In Service Fabric, the cluster certificate is also the server certificate, which is presented to clients of the management layer. While the platform itself does not require impose restrictions on the common name, many browsers will raise warnings or block connections where the the SAN of the presented certificate does not match the domain name. Since it is not possible to provision certificates for the default domain (e.g. mycluster.eastus.cloudapp.azure.com), it is recommended to provision a custom domain, via [Azure DNS Zone](../dns/dns-delegate-domain-azure-dns.md), update your cluster's "managementEndpoint" to this custom domain alias, and use a certificate with SAN matching this domain.

> [!NOTE]
> Self-signed certificates, including those generated when deploying a Service Fabric cluster in the Azure portal, are not supported. 

## Upload the certificate and install it in the scale set
In Azure, a Service Fabric cluster is deployed on a virtual machine scale set.  Upload the certificate to a key vault and then install it on the virtual machine scale set that the cluster is running on by [updating the ARM definition of the virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#how-do-i-securely-ship-a-certificate-to-the-vm). It is important that both current and target certs are installed on nodes before the start of the upgrade. The journey from certificate issuance to provisioning onto an SF node is discussed in depth [here](cluster-security-certificate-management.md#the-journey-of-a-certificate).

## Bring cluster to a an optimal starting state
An upgrade from thumbprint-based certificate declaration to common-name based certificate declaration represents a change in both how nodes in the cluster choose which certificate to present to each other, and how they validate those certificates. Review the [presentation and validation rules for both configurations](cluster-security-certificates.md#certificate-configuration-rules) before proceeding. The most important consideration when performing a thumbprint-to-common name conversion is that upgraded and unupgraded nodes will trust each other throughout the duration of the upgrade. The easiest way to achieve this is to move onto the goal certificate (by thumbprint) before starting the upgrade. A misconfigured upgrade can cause a partition in the cluster. For instructions on how to carry out any of the upgrades described below, please see [this document](service-fabric-cluster-security-update-certs-azure.md).

There are multiple optimal starting states before the conversion, but the important similarity is that the cluster is already using the goal-state certificate, as declared by thumbprint, before the upgrade begins. We consider `GoalCert`, `OldCert1`, `OldCert2`:

#### Recommended Starting States
- `Thumbprint: GoalCert, ThumbprintSecondary: None`
- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `GoalCert` has a later `NotAfter` date than `OldCert1`
- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `GoalCert` has a later `NotAfter` date than `OldCert1`

#### Steps to get to above state if cluster is currently in another state
| Starting State | Upgrade 1 | Upgrade 2|
|--- |--- |--- |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `GoalCert` has a later `NotAfter` date than `OldCert1` | `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `OldCert1` has a later `NotAfter` date than `GoalCert` | `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1` | `Thumbprint: GoalCert, ThumbprintSecondary: None` |
| `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: OldCert2` | Remove one of `OldCert1` or `OldCert2` to get to state `Thumbprint: OldCertx, ThumbprintSecondary: None` | Follow the appropriate step above |

## Decide between Common-name validation or Common-name validation with Issuer Pinning
The difference is described [here](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) and determines whether to populate the parameter `certificateIssuerThumbprintList` below, or leave it empty.

## Update the Cluster's Azure Resource Management Template and Deploy
Using ARM templates is our recommended way of managing Service Fabric clusters. Updating a cluster's certificate declaration should be done via an ARM template deployment. There is not an equivalent Azure Portal experience at this time. If you do not have an ARM template representing the cluster, it is possible to build one for a living cluster. Writing the template is described [here](service-fabric-cluster-creation-create-template.md) and [here](../service-fabric-cluster-creation-via-arm.md). It is possible to get a good starting point for the manifest by navigating to the Portal, to the resource group of the cluster, selecting **Settings**, selecting **Deployments**.  Selecting the most recent deployment and clicking **View template**. This template may require changes before it is fully deployable.

There are two changes needed in your template, one for the Service Fabric Node Extension, which is an extension of the virtual machine resource, and another change in the cluster resource definition. First add the new parameters, your certificate common name, say `certificateCommonName`, and if pinning, the comma-delimited list of direct issuers of the cert, say `certificateIssuerThumbprintList`.

In the **Microsoft.Compute/virtualMachineScaleSets** resource, update the virtual machine extension to use the common name in certificate settings instead of the thumbprint. Please note, if your cluster includes multiple nodetypes/scale sets, you will need to update the SF Node Extension definition on each of the scale sets.

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
                                "commonNames": [
                                    "thumbprint": "[parameters('certificateThumbprint')]",
                                ],
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

In the **Microsoft.ServiceFabric/clusters** resource, add a **certificateCommonNames** setting with a **commonNames** property and remove the **certificate** setting (with the thumbprint property):

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

For additional information, see [Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint.](./service-fabric-create-cluster-using-cert-cn.md)

## Deploy the updated template
Redeploy the updated template after making the changes.

```powershell
$groupname = "sfclustertutorialgroup"

New-AzResourceGroupDeployment -ResourceGroupName $groupname -Verbose `
    -TemplateParameterFile "C:\temp\cluster\parameters.json" -TemplateFile "C:\temp\cluster\template.json" 
```

## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate by common name](service-fabric-cluster-rollover-cert-cn.md)
* Learn how to [configure a cluster for touchless autorollover](cluster-security-certificate-management.md)

[image1]: ./media/service-fabric-cluster-change-cert-thumbprint-to-cn/PortalViewTemplates.png
