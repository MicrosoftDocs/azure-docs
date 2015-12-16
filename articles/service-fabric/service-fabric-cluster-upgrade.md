<properties
   pageTitle="Upgrading a Service Fabric cluster | Microsoft Azure"
   description="Upgrade the Fabric Code and/or Configuration that runs a Service Fabric cluster including certificate upgrade, adding Application ports, OS patches etc. What can you expect when the upgrades are performed?"
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
   ms.date="11/23/2015"
   ms.author="chackdan"/>

# Upgrading a Service Fabric cluster

A Service Fabric cluster is a resource that you own but which is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Cluster configuration that is managed automatically

Microsoft maintains the fabric code and configuration that runs in a cluster, we perform automatic monitored upgrades to the software on a as needed basis. These upgrades could be code, config or both. In order to make sure that your application suffers no or minimal impact due to these upgrades, we perform the upgrades in three phases.

### Phase 1: Upgrade is performed using all cluster health policies

During this phase the upgrades proceed one upgrade domain at a time and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (it is a combination of Node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies are not met, then the upgrade is rolled back, an email is sent to the owner of the subscription indicating that we had to rollback a cluster upgrade, with remedial actions if any and that we will execute Phase 2 in another n days. n is a variable.
We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons and  after the n days from the date the email was sent, we proceed to Phase 2.

If the cluster health policies are met then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run. (This is to avoid sending you too many emails, receiving an email should be seen as a exception to normal. We expect most of the cluster upgrades to go though without impacting your application availability).

For details on how to set custom health policies for your cluster refer to  [Cluster Upgrade and Health Parameters](service-fabric-cluster-health-parameters.md).

### Phase 2: Upgrade is performed using default health policies only

The health policies are set in such a way that the number of applications that were healthy at the beginning of the upgrade remain the same for the duration of the upgrade process. Like in phase 1, during this phase the upgrades proceed one upgrade domain at a time and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (it is a combination of Node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies in effect are not met, then the upgrade is rolled back, an email is sent to the owner of the subscription indicating that we had to rollback a cluster upgrade, with remedial actions if any and that we will execute Phase 3 in another n days. n is a variable.

We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons. A reminder email is sent a couple of days before n days are up. After the n days from the date the email was sent, we proceed to Phase 3. The emails we send you in Phase 2 must be taken seriously and remedial actions taken.

If the cluster health policies are met then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run.

### Phase 3: Upgrade is performed using aggressive health policies

These health policies are geared towards completion of the upgrade rather than the health of the applications. Very few cluster upgrades will end up in this phase. If your cluster ends up in this phase, there is a good chance that your application will go unhealthy and/or will lose availability.

Similar to the other two phases, Phase 3 upgrades proceed one upgrade domain at a time.

If the cluster health policies in effect are not met, then the upgrade is rolled back,We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons and after that the cluster is pinned, such that it will no longer receive support and/or upgrades.

An email with this information will be sent to the subscription owner with the remedial actions. we do not expect any clusters to get into a state where Phase 3 has failed.

If the cluster health policies are met, then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run. .

## Cluster configuration that you control

Here are the configurations that you can change on a live cluster.

### Certificates

You can update the primary or the secondary certificates easily from the portal or via issuing a PUT command on the servicefabric.cluster resource.

![CertificateUpgrade][CertificateUpgrade]

**Note** Before you identify the certificates you want to use to the cluster resources, you will need to have completed the following steps, else the new certificate will not be used.
1) upload the new certificate to the keyvault - refer to [Service Fabric Security](service-fabric-cluster-security.md) for instructions - start with step #2 in that document.
2) update all the Virtual Machines that make up our cluster, so that the certificate get deployed on them. Refer to [this blog post](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx) on how to.

### Application Ports

You can do this by changing the load balancer resource properties associated with the Node Type. you can use the portal or ARM PowerShell directly.

In order to open a new port on all VMs in a Node type, you need to do the following.

1. **Add a new probe to the appropriate load balancer**

    If you have deployed your cluster using the portal, then the load balancer will named "loadBalancer-0" , "loadBalancer-1" and so on, one for each Node Type. Since the load balancer names are unique only with in a resource group (RG), it is best if you searched for them under a given RG.

    ![AddingProbes][AddingProbes]


2. **Add a new rule to the the load balancer**

    To the same Load balancer, add a new rule using the probe you created in the previous step.

    ![AddingLBRules][AddingLBRules]


### Placement Properties

  For each of the Node Types, you can add custom placement properties that you want to use in your applications. NodeType is a default property you can use without adding it explicitly.

  >[AZURE.NOTE] For details on the use of placement property refer to [the placement constraints documentation](service-fabric-placement-constraint.md).

### Capacity Metrics

For each of the Node Types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load against refer to [the overview of dynamic load reporting](service-fabric-resource-balancer-dynamic-load-reporting.md).

### Applying OS patches to the Virtual Machines that make up the Cluster
This is feature that is coming. Today you are responsible to patch your VMs. you must do this one VM at a time, so that you do not take down more than one VM at at time.

### Upgrading the OS to a new one on the Virtual Machines that make up the cluster
If you must upgrade the OS image that you are using, then you must do this one VM at a time and you are responsible for this upgrade. There is no automation today.


## Next steps

- Learn how to [scale your cluster up and down](service-fabric-cluster-scale-up-down.md)
- Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes.png
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
