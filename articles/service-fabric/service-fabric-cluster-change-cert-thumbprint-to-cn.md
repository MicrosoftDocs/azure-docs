---
title: Update a cluster to use certificate common name 
description: Learn how to switch a Service Fabric cluster from using certificate thumbprints to using certificate common name.

ms.topic: conceptual
ms.date: 09/06/2019
---
# Change cluster from certificate thumbprint to common name
No two certificates can have the same thumbprint, which can make cluster certificate rollover and management difficult. By upgrading a running Service Fabric cluster from declaring cluster certificates by thumbprint to declaring them by common name, management can be simplified. This simplies management by expanding the set of allowed cluster certificates and by making it such that rotations do not require a cluster upgrade. This article describes how to move a running cluster to common name.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Moving to Certificate Authority (CA)-signed certificates
When a cluster declares certificates by common name, mutual trust of a certificate in the cluster comes from mutual trust in the issuer of the certificate, rather then the cryptographic uniqueness of the certificate's thumbprint. For this reason, cluster certificates declared by common name should not be self-signed, and should come from a trusted CA. Service Fabric offers two different strategies to validate certificates by common name. One uses a pinned list of issuer thumbprints, and the other relies on the CA certificate being installed in the Trusted Root store of nodes. These strategies are discussed more [here.](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) If your cluster is currently using a self-signed certificate declared by thumbprint, you will need to transition to the new CA-signed certificate by thumbprint before moving to common name.

For the purposes of testing, a self-signed certificate can be used by pinning the certificate's common name to its own thumbprint. Please note that this does not give a good proxy for demonstrating that the cluster will work as expected when using a certificate issued by a proper CA. It is recommended to instead use a testing-specific CA-signed certificate, or a certificate issued by a free CA, like _Let's Encrypt_.

### Using a cluster certificate with an appropriate SAN
The Service Fabric runtime does not impose restrictions on the common name of the cluster certificate. There are some nuances in the selection and validation of certificates with wildcards in their common name, which is discussed in [the article on certificate selection and validation](cluster-security-certificates.md). Some browsers may raise security warnings when the Service Fabric Server certificate is self-signed, or if the subject alternative name (SAN) of the certificate does not match the management domain. For example, your browser may warn you that your cluster, which has domain https://mycluster.eastus.cloudapp.azure.com, is presenting a certificate with a SAN of https://mycluster.contoso.com, when accessing SFX. If your objective is to resolve this, and since it is not possible to provision certificates for the default domain (\*.cloudapp.azure.com), it is recommended to provision a custom domain, via [Azure DNS Zone](../dns/dns-delegate-domain-azure-dns.md), issue a certificate for this domain, and to update your cluster's "managementEndpoint" to this custom domain alias.

## Upload the certificate and install it in the scale set
In Azure, your certificate should be uploaded to a key vault and installed on the virtual machine scale set that the cluster is running on by [updating the ARM definition of the virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#how-do-i-securely-ship-a-certificate-to-the-vm). It is important that both current and target cluster certificates are installed on the VMs of every nodetype before starting a Service Fabric upgrade that will introduce the target certificate, either by thumbprint or by common name, to the cluster definition. The journey from certificate issuance to provisioning onto a Service fabric node is discussed in depth [here](cluster-security-certificate-management.md#the-journey-of-a-certificate).

## Bring cluster to an optimal starting state
An upgrade from thumbprint-based certificate declaration to common-name based certificate declaration represents a change in both 

- How nodes in the cluster choose which certificate to present to each other
- How nodes validate those certificates when received 

Review the [presentation and validation rules for both configurations](cluster-security-certificates.md#certificate-configuration-rules) before proceeding. The most important consideration when performing a thumbprint-to-common name conversion is that upgraded and unupgraded nodes will trust each other throughout the duration of the upgrade. The easiest way to achieve mutual trust during the duration of the upgrade is to move onto the goal certificate by thumbprint before starting the transition to common name. If the cluster is already in a recommended starting state, this section can be skipped.

There are multiple recommended starting states before the conversion, but the important invariant is that the cluster is already using the goal-state certificate, as declared by thumbprint, before the upgrade begins. We consider `GoalCert`, `OldCert1`, `OldCert2`:

#### Recommended Starting States
- `Thumbprint: GoalCert, ThumbprintSecondary: None`
- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `GoalCert` has a later `NotAfter` date than `OldCert1`
- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `GoalCert` has a later `NotAfter` date than `OldCert1`

#### Steps to get to above state if cluster is currently in another state

| Starting State | Upgrade 1 | Upgrade 2 |
| :--- | :--- | :--- |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `GoalCert` has a later `NotAfter` date than `OldCert1` | `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: None` and `OldCert1` has a later `NotAfter` date than `GoalCert` | `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1` | `Thumbprint: GoalCert, ThumbprintSecondary: None` |
| `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `OldCert1` has a later `NotAfter` date than `GoalCert` | Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None` | - |
| `Thumbprint: OldCert1, ThumbprintSecondary: OldCert2` | Remove one of `OldCert1` or `OldCert2` to get to state `Thumbprint: OldCertx, ThumbprintSecondary: None` | Continue from the new starting state |

For instructions on how to carry out any of these upgrades, see [this document](service-fabric-cluster-security-update-certs-azure.md).

## Decide between Common-name validation or Common-name validation with Issuer Pinning
The difference is described [here](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) and determines whether to populate the parameter `certificateIssuerThumbprintList`, or leave it empty.

## Update the Cluster's Azure Resource Management (ARM) Template and Deploy
Using ARM templates is our recommended way of managing Service Fabric clusters. Updating a cluster's certificate declaration should be done via an ARM template deployment. There is not an equivalent Azure portal experience at this time. If you do not have an ARM template representing the cluster, it is possible to build one for a living cluster. Writing the template is described [here](service-fabric-cluster-creation-create-template.md) and [here](service-fabric-cluster-creation-via-arm.md). It is possible to get a good starting point for the manifest by navigating to the Portal, to the resource group of the cluster, selecting **Settings**, selecting **Deployments**.  Selecting the most recent deployment and clicking **View template**. This template will require changes before it is fully deployable.

There are two changes needed in your template, one for the Service Fabric Node Extension, which is an extension of the virtual machine resource, and another change in the cluster resource definition. First add the new parameters, your certificate common name, say `certificateCommonName`, and if pinning, the comma-delimited list of direct issuers of the cert, say `certificateIssuerThumbprintList`.

In the **Microsoft.Compute/virtualMachineScaleSets** resource, update the virtual machine extension to use the common name in certificate settings instead of the thumbprint. Note, if your cluster includes multiple nodetypes/scale sets, you will need to update the SF Node Extension definition on each of the scale sets.

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

For more information, see [Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint.](./service-fabric-create-cluster-using-cert-cn.md)

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
