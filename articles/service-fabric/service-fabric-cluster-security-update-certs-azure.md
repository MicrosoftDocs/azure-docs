<properties
   pageTitle="Secure a Service Fabric cluster | Microsoft Azure"
   description="How to secure a Service Fabric cluster. What are the options?"
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/27/2016"
   ms.author="chackdan"/>

# Update the certificates for a cluster in Azure

Service fabric lets you specify two certificates, a primary and a secondary, when you configure certificate security during cluster creation. By default, the one that you specify at creation time is the primary certificate. After cluster creation, you can add a new certificate as a secondary or remove an existing certificate.
>[AZURE.NOTE] For a secure cluster, you will always need at least one valid (not revoked and not expired) certificate (primary or secondary) deployed or you will not be able to access the cluster.

## Add a secondary certificate
To add another certificate as a secondary, you must upload the certificate to an Azure key vault and then deploy it to the VMs in the cluster.  For additional information, see [Deploy certificates to VMs from a customer-managed key vault](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx).

1. [Upload a X.509 certificate to the key vault](service-fabric-cluster-azure-secure-with-certs.md#step-2--upload-the-x.509-certificate-to-the-key-vault)
2. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the cluster resource that you want add this certificate to.
3. Under **Settings**, click the certificate setting and enter the secondary certificate thumbprint.
4. Click **Save**. A deployment will be started, and on successful completion of that deployment, you will be able to use either the primary or the secondary certificate to perform management operations on the cluster.

![Screen shot of certificate thumbprints in the portal][SecurityConfigurations_02]

## Remove a certificate
Here is the process to remove an old certificate so that the cluster does not use it:

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your cluster's security settings.
2. Remove one of the certificates.
3. Click **Save**, which starts a new deployment. Once that deployment is complete, the certificate that you removed can no longer be used to connect to the cluster.

## Next steps

- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and RunAs](service-fabric-application-runas-security.md)

<!--Image references-->
[SecurityConfigurations_02]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_02.png
