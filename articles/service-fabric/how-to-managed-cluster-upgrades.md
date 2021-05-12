---
title: Upgrading Azure Service Fabric managed clusters
description: Learn about options for upgrading your Azure Service Fabric managed cluster
ms.topic: how-to
ms.date: 05/10/2021
---
# Manage Service Fabric managed cluster upgrades

An Azure Service Fabric cluster is a resource you own, but it's partly managed by Microsoft. Here's how to manage when and how Microsoft updates your Azure Service Fabric managed cluster.

## Set upgrade mode

Azure Service Fabric managed clusters are set by default to receive automatic Service Fabric upgrades as they are released by Microsoft using a [wave deployment](#wave-deployment-for-automatic-upgrades) strategy. As an alternative, you can setup manual mode upgrades in which you choose from a list of currently supported versions. You can configure these settings either through the *Fabric upgrades* control in Azure portal or the `ClusterUpgradeMode` setting in your cluster deployment template.

## Wave deployment for automatic upgrades

With wave deployment, you can create a pipeline for upgrading your test, stage, and production clusters in sequence, separated by built-in 'bake time' to validate upcoming Service Fabric versions before your production clusters are updated.

>NOTE
>By default clusters will be set to Wave 0.

To select a wave deployment for automatic upgrade, first determine which wave to assign your cluster:

* **Wave 0** (`Wave0`): Clusters are updated as soon as a new Service Fabric build is released.
* **Wave 1** (`Wave1`): Clusters are updated after Wave 0 to allow for bake time. This occurs after a minimum of 7 days after Wave 0
* **Wave 2** (`Wave2`): Clusters are updated last to allow for further bake time. This occurs after a minimum of 14 days after Wave 0

## Set the Wave for your cluster

You can set your cluster to one of the available wave's either through the *Fabric upgrades* control in Azure portal or the `ClusterUpgradeMode` setting in your cluster deployment template.

### Azure portal

Using Azure portal, you'll choose between the available automatic waves when creating a new Service Fabric cluster.

:::image type="content" source="./media/how-to-managed-cluster-upgrades/portal-new-cluster-upgrade-waves-setting.png" alt-text="Choose between different available waves when creating a new cluster in Azure portal from the 'Advanced' options":::

You can also toggle between available automatic waves from the **Fabric upgrades** section of an existing cluster resource.

:::image type="content" source="./media/how-to-managed-cluster-upgrades/manage-upgrade-wave-settings.png" alt-text="Select between different Automatic waves in the 'Fabric upgrades' section of your cluster resource in Azure portal":::

### Resource Manager template

To change your cluster upgrade mode using a Resource Manager template, specify either *Automatic* or *Manual* for the  `ClusterUpgradeMode` property of the *Microsoft.ServiceFabric/clusters* resource definition. If you choose manual upgrades, also set the `clusterCodeVersion` to a currently [supported fabric version](#query-for-supported-cluster-versions).

#### Manual upgrade

```json
{
"apiVersion": "2021-05-01",
"type": "Microsoft.ServiceFabric/managedClusters",
"properties": {
        "ClusterUpgradeMode": "Manual",
        "ClusterCodeVersion": "7.2.457.9590"
        }
}
```

Upon successful deployment of the template, changes to the cluster upgrade mode will be applied. If your cluster is in manual mode, the cluster upgrade will kick off automatically.

The [cluster health policies](https://docs.microsoft.com/azure/service-fabric/service-fabric-health-introduction#health-policies) (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade. If cluster health policies are not met, the upgrade is rolled back.

Once you have fixed the issues that resulted in the rollback, you'll need to initiate the upgrade again, by following the same steps as before.

#### Automatic upgrade with wave deployment

To configure Automatic upgrades and the wave deployment, simply add/validate `ClusterUpgradeMode` is set to `Automatic` and the `upgradeWave` property is defined with one of the wave values listed above in your Resource Manager template.

```json
{
"apiVersion": "2021-05-01",
"type": "Microsoft.ServiceFabric/managedClusters",
"properties": {
        "ClusterUpgradeMode": "Automatic",
        "upgradeWave": "Wave1",
        }  
}
```

Once you deploy the updated template, your cluster will be enrolled in the specified wave for the next upgrade period and after that.

## Custom policies for manual upgrades

You can specify custom health policies for manual cluster upgrades. These policies get applied each time you select a new runtime version, which triggers the system to kick off the upgrade of your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the **Fabric upgrades** section of your cluster resource in Azure portal by selecting *Custom* option for **Upgrade policy**.

:::image type="content" source="./media/service-fabric-cluster-upgrade/custom-upgrade-policy.png" alt-text="Select the 'Custom' upgrade policy option in the 'Fabric upgrades' section of your cluster resource in Azure portal in order to set custom health policies during upgrade":::

## Query for supported cluster versions

You can use [Azure REST API](/rest/api/azure/) to list all available Service Fabric runtime versions ([clusterVersions](/rest/api/servicefabric/sfrp-api-clusterversions_list)) available for the specified location and your subscription.

You can also reference [Service Fabric versions](service-fabric-versions.md) for further details on supported versions and operating systems.

```REST
GET https://<endpoint>/subscriptions/{{subscriptionId}}/providers/Microsoft.ServiceFabric/locations/{{location}}/clusterVersions?api-version=2018-02-01

"value": [
  {
    "id": "subscriptions/########-####-####-####-############/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/5.0.1427.9490",
    "name": "5.0.1427.9490",
    "type": "Microsoft.ServiceFabric/environments/clusterVersions",
    "properties": {
      "codeVersion": "5.0.1427.9490",
      "supportExpiryUtc": "2016-11-26T23:59:59.9999999",
      "environment": "Windows"
    }
  },
  {
    "id": "subscriptions/########-####-####-####-############/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/4.0.1427.9490",
    "name": "5.1.1427.9490",
    "type": " Microsoft.ServiceFabric/environments/clusterVersions",
    "properties": {
      "codeVersion": "5.1.1427.9490",
      "supportExpiryUtc": "9999-12-31T23:59:59.9999999",
      "environment": "Windows"
    }
  },
  {
    "id": "subscriptions/########-####-####-####-############/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/4.4.1427.9490",
    "name": "4.4.1427.9490",
    "type": " Microsoft.ServiceFabric/environments/clusterVersions",
    "properties": {
      "codeVersion": "4.4.1427.9490",
      "supportExpiryUtc": "9999-12-31T23:59:59.9999999",
      "environment": "Linux"
    }
  }
]
}
```

The `supportExpiryUtc` in the output reports when a given release is expiring or has expired. Latest releases will not have a valid date, but rather a value of *9999-12-31T23:59:59.9999999*, which just means that the expiry date is not yet set.

## Next steps

* [Customize your Service Fabric managed cluster configuration](how-to-managed-cluster-configuration.md)
* Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade2.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes2.PNG
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
[Upgrade-Wave-Settings]: ./media/service-fabric-cluster-upgrade/manage-upgrade-wave-settings.png
[ARMUpgradeMode]: ./media/service-fabric-cluster-upgrade/ARMUpgradeMode.PNG
[Create_Manualmode]: ./media/service-fabric-cluster-upgrade/Create_Manualmode.PNG
[Manage_Automaticmode]: ./media/service-fabric-cluster-upgrade/Manage_Automaticmode.PNG