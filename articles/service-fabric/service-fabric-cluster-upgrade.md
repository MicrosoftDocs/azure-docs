<properties
   pageTitle="Upgrade Fabric in a Service Fabric cluster | Microsoft Azure"
   description="Upgrade the Fabric Code and/or Configuration that runs a Service Fabric cluster including certificate upgrade, adding Application ports, OS patches etc. What can you expect when the upgrades are performed? "
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
   ms.date="10/29/2015"
   ms.author="chackdan"/>

# Upgrade the Fabric Code and/or Configuration that runs a Service Fabric cluster. 

Upgrades in a cluster can be categorized into the following

1. Cluster Code and Configuration that is managed automatically by Microsoft
2. Cluster Configuration that you control or can override
3. Applying OS patches to the Virtual Machines that make up the Cluster
4. Upgrading the OS to a new one on the Virtual Machines that make up the cluster
5. Upgrading the applications that you deployed to cluster.


**1. Cluster Code and Configuration that is managed automatically by Microsoft**

Microsoft maintains the fabric code and configuration that runs in a cluster, we perform automatic monitored upgrades to the software on a as needed basis. These upgrades could be code, config or both. In order to make sure that your application suffers no or minimal impact due to these upgrades, we perform the upgrades in three phases.

**Phase 1:** Perform Monitored automatic fabric upgrades using the health policies that are in affect on the cluster. During this phase the upgrades proceed one upgrade domain at a time and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (it is a combination of Node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies are not met, then the upgrade is rolled back, an email is sent to the owner of the subscription indicating that we had to rollback a cluster upgrade, with remedial actions if any and that we will execute Phase 2 in another n days. n is a variable.
We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons and  after the n days from the date the email was sent, we proceed to Phase 2.

If the cluster health policies are met then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run. (This is to avoid sending you too many emails, receiving an email should be seen as a exception to normal. We expect most of the cluster upgrades to go though without impacting your application availability).

For details on how to set custom health policies for your cluster refer to  [Cluster Upgrade and Health Parameters](service-fabric-cluster-health-parameters.md).

**Phase 2:** Perform Monitored automatic fabric upgrades using the default health policies (ie, this phase does not use the custom health policies that you may have set up for the cluster). The health policies are set in such a way that the number of applications that were healthy at the beginning of the upgrade remain the same for the duration of the upgrade process. Like in phase 1, during this phase the upgrades proceed one upgrade domain at a time and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (it is a combination of Node health and the health all of the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies in effect are not met, then the upgrade is rolled back, an email is sent to the owner of the subscription indicating that we had to rollback a cluster upgrade, with remedial actions if any and that we will execute Phase 3 in another n days. n is a variable.
We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons. A reminder email is sent a couple of days before n days are up. After the n days from the date the email was sent, we proceed to Phase 3. The emails we send you in Phase 2 must be taken seriously and remedial actions taken.

If the cluster health policies are met then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run.

**Phase 3:** Perform Monitored automatic fabric upgrades using the aggressive health policies. These health policies are geared towards completion of the upgrade rather than the health of the applications. Only a very few cluster upgrade will end up in Phase 3. If your cluster ends up in this phase, their is a good chance that your application will go unhealthy and/or will loose availability. 

similar to the other two phases, during this phase the upgrades proceed one upgrade domain at a time.

If the cluster health policies in effect are not met, then the upgrade is rolled back,We try to execute the same upgrade a few more times to rule out upgrades that failed due to infra reasons and after that the cluster is pinned, such that it will no longer receive support and/or upgrades.

An email with this information will be sent to the subscription owner with the remedial actions. we do not expect any clusters to get into a state where Phase 3 has failed. 

If the cluster health policies are met, then the upgrade is considered successful and marked complete. This can happen during the initial or any of the reruns of the upgrades in this phase. There is no email confirmation of a successful run. .

**2. Cluster Configuration that you control or can override**

Here are the configurations that you can change on a live cluster.
**2a) Certificates** that you used to secure the cluster. You can update the primary or the secondary certificates easily from the portal or via issuing a PUT command on the servicefabric.cluster resource.

![CertificateUpgrade][CertificateUpgrade]

**2b) Application Ports** that you want to open up or close.
you can do this by changing the load balancer resource properties associated with the Node Type. you can use the portal or ARM PS directly.

In order to open a new port on all VMs in a Node type, you need to do the following.

1) **add a new probe** to the appropriate load balancer. If you have deployed your cluster using the portal, then the load balancer will named "loadBalancer-0" , "loadBalancer-1" and so on, one for each Node Type. Since the load balancer names are unique only with in a resource group (RG), it is best if you searched for them under a given RG. 

![AddingProbes][addingProbes]

2) **add a new rule** to the the load balancer. To the same Load balancer, add a new rule using the probe you created in the previous step.

![AddingLBRules][AddingLBRules]

**2c) Placement Properties** For each of the Node Types, you can add custom placement properties that you want to use in your applications. NodeType is a default property you can use without adding it explicitly.
For details on the use of placement property refer to [service-fabric-placement-constraint](service-fabric-placement-constraint.md) documentation.

**2d) Capacity Metrics** For each of the Node Types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load against refer to [service-fabric-resource-balancer-dynamic-load-reporting](service-fabric-resource-balancer-dynamic-load-reporting.md) documentation.

**3. Applying OS patches to the Virtual Machines that make up the Cluster**
This is feature that is coming. Today you are responsible to patch your VMs. you must do this one VM at a time, so that you do not take down more than one VM at at time.

**4. Upgrading the OS to a new one on the Virtual Machines that make up the cluster**
If you must upgrade the OS image that you are using, then you must do this one VM at a time and you are responsible for this upgrade, their is no automation today. 

**5. Upgrading the applications that you deployed to cluster**
Refer to [Application Upgrade](service-fabric-application-upgrade.md) documentation for details. you are responsible to kick these off.


## Next steps
[service-fabric-cluster-scale-up-down](service-fabric-cluster-scale-up-down.md)]
[Application Upgrade](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes.png
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/AddingLBRules.png

