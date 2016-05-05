<properties
   pageTitle="Upgrade a Service Fabric cluster | Microsoft Azure"
   description="Upgrade the Service Fabric code and/or configuration that runs a Service Fabric cluster, including upgrading certificates, adding application ports, doing OS patches, and so on. What can you expect when the upgrades are performed?"
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
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# Upgrade a Service Fabric cluster

An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Cluster configuration that is managed automatically

Microsoft maintains the fabric code and configuration that runs in a cluster. We perform automatic monitored upgrades to the software on an as-needed basis. These upgrades could be code, configuration, or both. To make sure that your application suffers no impact or minimal impact due to these upgrades, we perform the upgrades in the following three phases.

### Phase 1: An upgrade is performed by using all cluster health policies

During this phase, the upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (a combination of node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies are not met, the upgrade is rolled back. Then an email is sent to the owner of the subscription. The email contains the following information:

- Notification that we had to roll back a cluster upgrade.
- Suggested remedial actions, if any.
- The number of days (n) until we will execute Phase 2.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After the n days from the date the email was sent, we proceed to Phase 2.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run. This is to avoid sending you too many emails--receiving an email should be seen as an exception to normal. We expect most of the cluster upgrades to succeed without impacting your application availability.

### Phase 2: An upgrade is performed by using default health policies only

The health policies in this phase are set in such a way that the number of applications that were healthy at the beginning of the upgrade remains the same for the duration of the upgrade process. As in Phase 1, the Phase 2 upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (a combination of node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies in effect are not met, the upgrade is rolled back. Then an email is sent to the owner of the subscription. The email contains the following information:

- Notification that we had to roll back a cluster upgrade.
- Suggested remedial actions, if any.
- The number of days (n) until we will execute Phase 3.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. A reminder email is sent a couple of days before n days are up. After the n days from the date the email was sent, we proceed to Phase 3. The emails we send you in Phase 2 must be taken seriously and remedial actions must be taken.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

### Phase 3: An upgrade is performed by using aggressive health policies

These health policies in this phase are geared towards completion of the upgrade rather than the health of the applications. Very few cluster upgrades will end up in this phase. If your cluster gets to this phase, there is a good chance that your application will become unhealthy and/or lose availability.

Similar to the other two phases, Phase 3 upgrades proceed one upgrade domain at a time.

If the cluster health policies are not met, the upgrade is rolled back. We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After that, the cluster is pinned, so that it will no longer receive support and/or upgrades.

An email with this information will be sent to the subscription owner, along with the remedial actions. We do not expect any clusters to get into a state where Phase 3 has failed.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

## Cluster configurations that you control

Here are the configurations that you can change on a live cluster.

### Certificates

You can update the primary or secondary certificates easily from the Azure portal (as shown below) or by issuing a PUT command on the servicefabric.cluster resource.

![Screenshot that shows certificate thumbprints in the Azure portal.][CertificateUpgrade]

>[AZURE.NOTE] Before you identify a certificate that you want to use for the cluster resources, you must complete the following steps, or the new certificate will not be used:
1. Upload the new certificate to Azure Key Vault. Refer to [Service Fabric security](service-fabric-cluster-security.md) for instructions. Start with step 2 in that document.
2. Update all of the virtual machines (VMs) that make up your cluster so that the certificate gets deployed on them. To do that, refer to the [Azure Key Vault Team Blog](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx).

### Application ports

You can change application ports by changing the Load Balancer resource properties that are associated with the node type. You can use the portal, or you can use Resource Manager PowerShell directly.

To open a new port on all VMs in a node type, do the following:

1. Add a new probe to the appropriate load balancer.

    If you deployed your cluster by using the portal, the load balancers will be named "loadBalancer-0", "loadBalancer-1", and so on, one for each node type. Since the load balancer names are unique only within a resource group, it is best if you search for them under a specific resource group.

    ![Screenshot that shows adding a probe to a load balancer in the portal.][AddingProbes]

2. Add a new rule to the load balancer.

    Add a new rule to the same load balancer by using the probe that you created in the previous step.

    ![Screenshot that shows adding a new rule to a load balancer in the portal.][AddingLBRules]


### Placement properties

For each of the node types, you can add custom placement properties that you want to use in your applications. NodeType is a default property that you can use without adding it explicitly.

>[AZURE.NOTE] For details on the use of placement constraints, node properties, and how to define them, refer to the section "Placement Constraints and Node Properties" in the Service Fabric Cluster Resource Manager Document on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md).

### Capacity metrics

For each of the node types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load, refer to the  Service Fabric Cluster Resource Manager Documents on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md) and [Metrics and Load](service-fabric-cluster-resource-manager-metrics.md).

### OS patches on the VMs that make up the cluster

This capability is planned for the future as an automated feature. But currently, you are responsible to patch your VMs. You must do this one VM at a time, so that you do not take down more than one at a time.

### OS upgrades on the VMs that make up the cluster

If you must upgrade the OS image on the virtual machines of the cluster, you must do it one VM at a time. You are responsible for this upgrade--there is currently no automation for this.

## Next steps

- Learn how to [scale your cluster up and down](service-fabric-cluster-scale-up-down.md)
- Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes.png
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
