---
title: Manage Service Fabric cluster upgrades
description: Manage when and how your Service Fabric cluster runtime is updated
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Manage Service Fabric cluster upgrades

An Azure Service Fabric cluster is a resource you own, but it's partly managed by Microsoft. Here's how to manage when and how Microsoft updates your Azure Service Fabric cluster.

For further background on cluster upgrade concepts and processes, see [Upgrading and updating Azure Service Fabric clusters](service-fabric-cluster-upgrade.md).

## Set upgrade mode

You can set your cluster to receive automatic Service Fabric upgrades as they are released by Microsoft, or you can manually choose from a list of currently supported versions by setting the upgrade mode for your cluster. This can be done either through the *Fabric upgrade mode* control in Azure portal or the `upgradeMode` setting in your cluster deployment template.

### Azure portal

Using Azure portal, you'll choose between automatic or manual upgrades when creating a new Service Fabric cluster.

:::image type="content" source="media/service-fabric-cluster-upgrade/portal-new-cluster-upgrade-mode.png" alt-text="Choose between automatic or manual upgrades when creating a new cluster in Azure portal from the 'Advanced' options":::

You can also toggle between automatic or manual upgrades from the **Fabric upgrades** section of an existing cluster resource.

:::image type="content" source="./media/service-fabric-cluster-upgrade/fabric-upgrade-mode.png" alt-text="Select Automatic or Manual upgrades in the 'Fabric upgrades' section of your cluster resource in Azure portal":::

### Manual upgrades with Azure portal

When you select the manual upgrade option, all that's needed to initiate an upgrade is to select from the available versions  dropdown and then *Save*. From there, the cluster upgrade gets kicked off immediately.

The [cluster health policies](#custom-policies-for-manual-upgrades) (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade. If cluster health policies are not met, the upgrade will be rolled back.

Once you have fixed the issues that resulted in the rollback, you'll need to initiate the upgrade again, by following the same steps as before.

### Resource Manager template

To change your cluster upgrade mode using a Resource Manager template, specify either *Automatic* or *Manual* for the  `upgradeMode` property of the *Microsoft.ServiceFabric/clusters* resource definition. If you choose manual upgrades, also set the `clusterCodeVersion` to a currently [supported fabric version](#check-for-supported-cluster-versions).

:::image type="content" source="./media/service-fabric-cluster-upgrade/ARMUpgradeMode.PNG" alt-text="Screenshot shows a template, which is plaintext indented to reflect structure. The 'clusterCodeVersion' and 'upgradeMode' properties are highlighted.":::

Upon successful deployment of the template, changes to the cluster upgrade mode will be applied. If your cluster is in manual mode, the cluster upgrade will kick off automatically.

The [cluster health policies](#custom-policies-for-manual-upgrades) (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade. If cluster health policies are not met, the upgrade is rolled back.

Once you have fixed the issues that resulted in the rollback, you'll need to initiate the upgrade again, by following the same steps as before.

## Wave deployment for automatic upgrades

With automatic upgrade mode, you have the option to enable your cluster for wave deployment. With wave deployment, you can create a pipeline for upgrading your test, stage, and production clusters in sequence, separated by built-in 'bake time' to validate upcoming Service Fabric versions before your production clusters are updated.

### Enable wave deployment

> [!NOTE]
> Wave deployment requires the `2020-12-01-preview` (or later) API version for your *Microsoft.ServiceFabric/clusters* resource.

To enable wave deployment for automatic upgrade, first determine which wave to assign your cluster:

* **Wave 0** (`Wave0`): Clusters are updated as soon as a new Service Fabric build is released. Intended for test/dev clusters.
* **Wave 1** (`Wave1`): Clusters are updated one week (seven days) after a new build is released. Intended for pre-prod/staging clusters.
* **Wave 2** (`Wave2`): Clusters are updated two weeks (14 days) after a new build is released. Intended for production clusters.

Then, simply add an `upgradeWave` property to your cluster resource template with one of the wave values listed above. Ensure your cluster resource API version is `2020-12-01-preview` or later.

```json
{
    "apiVersion": "2020-12-01-preview",
    "type": "Microsoft.ServiceFabric/clusters",
     ...
        "fabricSettings": [...],
        "managementEndpoint": ...,
        "nodeTypes": [...],
        "provisioningState": ...,
        "reliabilityLevel": ...,
        "upgradeMode": "Automatic",
        "upgradeWave": "Wave1",
       ...
```

Once you deploy the updated template, your cluster will be enrolled in the specified wave for the next upgrade period and after that.

You can [register for email notifications](#register-for-notifications) with links to further help if a cluster upgrade fails.

### Register for notifications

You can register for notifications when a cluster upgrade fails. An email will be sent to your designated email address(es) with further details on the upgrade failure and links to further help.

> [!NOTE]
> Enrollment in wave deployment is not required to receive notifications for upgrade failures.

To enroll in notifications, add a `notifications` section to your cluster resource template, and designate one or more email addresses (*receivers*) to receive notifications:

```json
    "apiVersion": "2020-12-01-preview",
    "type": "Microsoft.ServiceFabric/clusters",
     ...
        "upgradeMode": "Automatic",
        "upgradeWave": "Wave1",
        "notifications": [
        {
            "isEnabled": true,
            "notificationCategory": "WaveProgress",
            "notificationLevel": "Critical",
            "notificationTargets": [
            {
                "notificationChannel": "EmailUser",
                "receivers": [
                    "devops@contoso.com"
                ]
            }]
        }]
```

Once you deploy your updated template, you'll be enrolled for upgrade failure notifications.

## Custom policies for manual upgrades

You can specify custom health policies for manual cluster upgrades. These policies get applied each time you select a new runtime version, which triggers the system to kick off the upgrade of your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the **Fabric upgrades** section of your cluster resource in Azure portal by selecting *Custom* option for **Upgrade policy**.

:::image type="content" source="./media/service-fabric-cluster-upgrade/custom-upgrade-policy.png" alt-text="Select the 'Custom' upgrade policy option in the 'Fabric upgrades' section of your cluster resource in Azure portal in order to set custom health policies during upgrade":::

## Check for supported cluster versions

You can reference [Service Fabric versions](service-fabric-versions.md) for further details on supported versions and operating systems.

You can also use [Azure REST API](/rest/api/azure/) to list all available Service Fabric runtime versions ([clusterVersions](/rest/api/servicefabric/sfrp-api-clusterversions_list)) available for the specified location and your subscription.

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


## Check for supported upgrade path

You can reference the [Service Fabric versions](service-fabric-versions.md) documentation for supported upgrade paths and related versions information. 

Using a supported target version information, you can use following PowerShell steps to validate the supported upgrade path.

1) Log in to Azure
   ```PowerShell
   Login-AzAccount
   ```

2) Select the subscription
   ```PowerShell
   Set-AzContext -SubscriptionId <your-subscription>
   ```

3) Invoke the API
   ```PowerShell
   $params = @{ "TargetVersion" = "<target version>"}
   Invoke-AzResourceAction -ResourceId <cluster resource id> -Parameters $params -Action listUpgradableVersions -Force
   ```

   Example: 
   ```PowerShell
   $params = @{ "TargetVersion" = "8.1.335.9590"}
   Invoke-AzResourceAction -ResourceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ServiceFabric/clusters/myCluster -Parameters $params -Action listUpgradableVersions -Force

   Output
   supportedPath
   -------------
   {8.1.329.9590, 8.1.335.9590}
   ```


## Next steps

* [Manage Service Fabric upgrades](service-fabric-cluster-upgrade-version-azure.md)
* Customize your [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md)
* [Scale your cluster in and out](service-fabric-cluster-scale-in-out.md)
* Learn about [application upgrades](service-fabric-application-upgrade.md)


<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade2.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes2.PNG
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
[HealthPolices]: ./media/service-fabric-cluster-upgrade/Manage_AutomodeWadvSettings.PNG
[ARMUpgradeMode]: ./media/service-fabric-cluster-upgrade/ARMUpgradeMode.PNG
[Create_Manualmode]: ./media/service-fabric-cluster-upgrade/Create_Manualmode.PNG
[Manage_Automaticmode]: ./media/service-fabric-cluster-upgrade/Manage_Automaticmode.PNG
