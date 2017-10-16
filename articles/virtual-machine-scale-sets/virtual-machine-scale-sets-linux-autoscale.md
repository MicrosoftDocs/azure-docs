---
title: Auto scale virtual machine scale sets with the Azure CLI | Microsoft Docs
description: How to create auto scale rules for virtual machine scale sets with the Azure CLI 2.0
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 83e93d9c-cac0-41d3-8316-6016f5ed0ce4
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: iainfou

---
# Automatically scale machines in a virtual machine scale set with the Azure CLI 2.0
When you create a scale set, you define the number of VM instances you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. You can also complete these steps with [Azure PowerShell](virtual-machine-scale-sets-windows-autoscale.md).


## Prerequisites
To create auto scale rules, you need an existing virtual machine scale set. You can create a scale set with the [Azure portal](), [Azure CLI 2.0](), or [Azure PowerShell]().

To make it easier to create the auto scale rules, define some variables for your scale set. The following example defines variables for the scale set named *myScaleSet* in the resource group named *myResourceGroup* and in the *eastus* region. Your subscription ID is obtained with [az account show](). If you have multiple subscriptions associated with your account, only the first subscription is returned. Adjust the names and subscription ID as follows:

```azurecli
sub=$(az account show --query id -o tsv)
resourcegroup_name = "myResourceGroup"
scaleset_name = "myScaleSet"
location_name = "eastus"
```

## Define an auto scale profile
Auto scale rules are deployed as JSON (JavaScript Object Notation) with the Azure CLI 2.0. The complete JSON that defines and deploys the auto scale rules can be found later in the article. 

The start of the auto scale profile defines the default, minimum, and maximum scale set capacity. The following example sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*:

```json
{
  "name": "Auto scale rules",
  "capacity": {
    "minimum": "2",
    "maximum": "10",
    "default": "2"
  }
}
```


## Create a rule to automatically scale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure auto scale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or memory, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

Let's create a rule that increases the number of VM instances in a scale set when the average CPU load is greater than 60% over a 5 minute period. When the rule triggers, the number of VM instances is increased by 20%. In scale sets with a small number of VM instances, you could set the `type` to *ChangeCount* and increase the `value` by *1* or *2* instances. In scale sets with a large number of VM instances, an increase of 10% or 20% VM instances may be more appropriate.

The following parameters are used for this rule:

| Parameter         | Explanation                                                                                                          | Value          |
|-------------------|----------------------------------------------------------------------------------------------------------------------|----------------|
| *metricName*      | The performance metric to monitor and apply scale set actions on.                                                    | Percentage CPU |
| *operator*        | Operator used to compare the metric data against the threshold.                                                      | Greater Than   |
| *threshold*       | The value that causes the auto scale rule to trigger an action.                                                      | 60%            |
| *timeGrain*       | How often the metrics are collected for analysis.                                                                    | 1 minute       |
| *timeAggregation* | Defines how the collected metrics should be aggregated for analysis.                                                 | Average        |
| *timeWindow*      | The amount of time monitored before the metric and threshold values are compared.                                    | 5 minutes      |
| *direction*       | Defines if the scale set should scale up or down when the rule applies.                                              | Increase       |
| *type*            | Indicates that the number of VM instances should be change by a percentange amount.                                  | Percent Change |
| *value*           | How many VM instances should be scaled up or down when the rule applies.                                             | 20              |
| *cooldown*        | The amount of time to wait before the rule is applied again so that the auto scale actions have time to take effect. | 5 minutes      |

The following example defines the rule to scale out the number of VM instances. The *metricResourceUri* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```json
{
  "metricTrigger": {
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
    "metricResourceLocation": "'$location_name'",
    "timeGrain": "PT1M",
    "statistic": "Average",
    "timeWindow": "PT5M",
    "timeAggregation": "Average",
    "operator": "GreaterThan",
    "threshold": 60
  },
  "scaleAction": {
    "direction": "Increase",
    "type": "PercentChangeCount",
    "value": "20",
    "cooldown": "PT5M"
  }
},
```


## Create a rule to automatically scale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure auto scale rules to decrease the number of VM instances in the scale set. This scale in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

Create another rule that decreases the number of VM instances in a scale set when the average CPU load then drops below 30% over a 5 minute period. The following example defines the rule to scale out the number of VM instances. The *metricResourceUri* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```json
{
  "metricTrigger": {
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
    "metricResourceLocation": "'$location_name'",
    "timeGrain": "PT1M",
    "statistic": "Average",
    "timeWindow": "PT5M",
    "timeAggregation": "Average",
    "operator": "LessThan",
    "threshold": 30
  },
  "scaleAction": {
    "direction": "Decrease",
    "type": "PercentChangeCount",
    "value": "20",
    "cooldown": "PT5M"
  }
}
```


## Apply auto scale rules to a scale set
The final step is to apply the auto scale profile and rules to your scale set. Your scale is then able to automatically scale in or out based on the application demand. Apply the auto scale profile with [az monitor autoscale-settings create]() as follows. The complete JSON uses the profile and rules noted in the previous sections.

```azurecli
az monitor autoscale-settings create \
    --resource-group myResourceGroup \
    --name autoscale \
    --parameters '{"autoscale_setting_resource_name": "autoscale",
      "enabled": true,
      "location": "'$location_name'",
      "notifications": [],
      "profiles": [
        {
          "name": "Auto created scale condition",
          "capacity": {
            "minimum": "2",
            "maximum": "10",
            "default": "2"
          },
          "rules": [
            {
              "metricTrigger": {
                "metricName": "Percentage CPU",
                "metricNamespace": "",
                "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
                "metricResourceLocation": "'$location_name'",
                "timeGrain": "PT1M",
                "statistic": "Average",
                "timeWindow": "PT5M",
                "timeAggregation": "Average",
                "operator": "GreaterThan",
                "threshold": 70
              },
              "scaleAction": {
                "direction": "Increase",
                "type": "PercentChangeCount",
                "value": "20",
                "cooldown": "PT5M"
              }
            },
            {
              "metricTrigger": {
                "metricName": "Percentage CPU",
                "metricNamespace": "",
                "metricResourceUri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'",
                "metricResourceLocation": "'$location_name'",
                "timeGrain": "PT1M",
                "statistic": "Average",
                "timeWindow": "PT5M",
                "timeAggregation": "Average",
                "operator": "LessThan",
                "threshold": 30
              },
              "scaleAction": {
                "direction": "Decrease",
                "type": "PercentChangeCount",
                "value": "20",
                "cooldown": "PT5M"
              }
            }
          ]
        }
      ],
      "tags": {},
      "target_resource_uri": "/subscriptions/'$sub'/resourceGroups/'$resourcegroup_name'/providers/Microsoft.Compute/virtualMachineScaleSets/'$scaleset_name'"
    }'
```


## Monitor number of instances in a scale set
To see the number, and status, of VM instances, you can view a list of instances in your scale set with [az vmss list-instances](). The status indicates if the VM instance is provisioning as the scale set automatically scales out, or is deprovisioning as the scale automatically scales in. The following example views the VM instance status for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurecli
az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```


## Auto scale based on a schedule
The previous examples automatically scaled a scale set in or out based on basic host metrics such as CPU or memory usage. You can also create auto scales based on schedules. These schedule-based rules allow you to automatically scale out the number of VM instances ahead of an anticipated increase in application demand, such as core work hours, and then automatically scale in the number of instances at a time that you anticipate less demand, such as the weekend. To create auto scale rules based on a schedule rather than host metrics, use the Azure portal. Schedule-based rules cannot currently be created with Azure PowerShell.


## Use in-guest metrics of App Insights
In these examples, basic host metrics for CPU or memory usage were used. 


## Next steps
* For information on how to manage your VM instances, see [Manage virtual machine scale sets with Azure PowerShell](virtual-machine-scale-sets-windows-manage.md).
* Learn more about vertical scaling by reviewing [Vertical autoscale with Virtual Machine Scale sets](virtual-machine-scale-sets-vertical-scale-reprovision.md)
* Find examples of Azure Monitor monitoring features in [Azure Monitor PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md)
* Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md)
* Learn how to [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md)









---
title: Autoscale Linux Virtual Machine Scale Sets | Microsoft Docs
description: Set up autoscaling for a Linux Virtual Machine Scale Set using Azure CLI
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 83e93d9c-cac0-41d3-8316-6016f5ed0ce4
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/27/2016
ms.author: adegeo

---
# Automatically scale Linux machines in a virtual machine scale set
Virtual machine scale sets make it easy for you to deploy and manage identical virtual machines as a set. Scale sets provide a highly scalable and customizable compute layer for hyperscale applications, and they support Windows platform images, Linux platform images, custom images, and extensions. To learn more, see [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md).

This tutorial shows you how to create a scale set of Linux virtual machines using the latest version of Ubuntu Linux. The tutorial also shows you how to automatically scale the machines in the set. You create the scale set and set up scaling by creating an Azure Resource Manager template and deploying it using Azure CLI. For more information about templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md). To learn more about automatic scaling of scale sets, see [Automatic scaling and Virtual Machine Scale Sets](virtual-machine-scale-sets-autoscale-overview.md).

In this tutorial, you deploy the following resources and extensions:

* Microsoft.Storage/storageAccounts
* Microsoft.Network/virtualNetworks
* Microsoft.Network/publicIPAddresses
* Microsoft.Network/loadBalancers
* Microsoft.Network/networkInterfaces
* Microsoft.Compute/virtualMachines
* Microsoft.Compute/virtualMachineScaleSets
* Microsoft.Insights.VMDiagnosticsSettings
* Microsoft.Insights/autoscaleSettings

For more information about Resource Manager resources, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).

Before you get started with the steps in this tutorial, [install the Azure CLI](../cli-install-nodejs.md).

## Step 1: Create a resource group and a storage account

1. **Sign in to Microsoft Azure**  
In your command-line interface (Bash, Terminal, Command prompt), switch to Resource Manager mode, and then [log in with your work or school id](../xplat-cli-connect.md#scenario-1-azure-login-with-interactive-login). Follow the prompts for an interactive login experience to your Azure account.

    ```cli   
    azure config mode arm

    azure login
    ```
   
    > [!NOTE]
    > If you have a work or school ID and you do not have two-factor authentication enabled, use `azure login -u` with the ID to log in without an interactive session. If you don't have a work or school ID, you can [create a work or school id from your personal Microsoft account](../active-directory/active-directory-users-create-azure-portal.md).
    
2. **Create a resource group**  
All resources must be deployed to a resource group. For this tutorial, name the resource group **vmsstest1**.
   
    ```cli
    azure group create vmsstestrg1 centralus
    ```

3. **Deploy a storage account into the new resource group**  
This storage account is where the template is stored. Create a storage account named **vmsstestsa**.
   
    ```cli
    azure storage account create -g vmsstestrg1 -l centralus --kind Storage --sku-name LRS vmsstestsa
    ```

## Step 2: Create the template
An Azure Resource Manager template makes it possible for you to deploy and manage Azure resources together by using a JSON description of the resources and associated deployment parameters.

1. In your favorite editor, create the file VMSSTemplate.json and add the initial JSON structure to support the template.

    ```json
    {
      "$schema":"http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
      "contentVersion": "1.0.0.0",
      "parameters": {
      },
      "variables": {
      },
      "resources": [
      ]
    }
    ```

2. Parameters are not always required, but they provide a way to input values when the template is deployed. Add these parameters under the parameters parent element that you added to the template.

    ```json
    "vmName": { "type": "string" },
    "vmSSName": { "type": "string" },
    "instanceCount": { "type": "string" },
    "adminUsername": { "type": "string" },
    "adminPassword": { "type": "securestring" },
    "resourcePrefix": { "type": "string" }
    ```
   
   * A name for the separate virtual machine that is used to access the machines in the scale set.
   * A name for the storage account where the template is stored.
   * The number of instances of virtual machines to initially create in the scale set.
   * A name and password of the administrator account on the virtual machines.
   * A name prefix for the resources that are created to support the scale set.

3. Variables can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. Add these variables under the variables parent element that you added to the template.

    ```json
    "dnsName1": "[concat(parameters('resourcePrefix'),'dn1')]",
    "dnsName2": "[concat(parameters('resourcePrefix'),'dn2')]",
    "publicIP1": "[concat(parameters('resourcePrefix'),'ip1')]",
    "publicIP2": "[concat(parameters('resourcePrefix'),'ip2')]",
    "loadBalancerName": "[concat(parameters('resourcePrefix'),'lb1')]",
    "virtualNetworkName": "[concat(parameters('resourcePrefix'),'vn1')]",
    "nicName": "[concat(parameters('resourcePrefix'),'nc1')]",
    "lbID": "[resourceId('Microsoft.Network/loadBalancers',variables('loadBalancerName'))]",
    "frontEndIPConfigID": "[concat(variables('lbID'),'/frontendIPConfigurations/loadBalancerFrontEnd')]",
    "storageAccountSuffix": [ "a", "g", "m", "s", "y" ],
    "diagnosticsStorageAccountName": "[concat(parameters('resourcePrefix'), 'a')]",
    "accountid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/', resourceGroup().name,'/providers/','Microsoft.Storage/storageAccounts/', variables('diagnosticsStorageAccountName'))]",
    "wadlogs": "<WadCfg><DiagnosticMonitorConfiguration>",
    "wadperfcounter": "<PerformanceCounters scheduledTransferPeriod=\"PT1M\"><PerformanceCounterConfiguration counterSpecifier=\"\\Processor\\PercentProcessorTime\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"CPU percentage guest OS\" locale=\"en-us\"/></PerformanceCounterConfiguration></PerformanceCounters>",
    "wadcfgxstart": "[concat(variables('wadlogs'),variables('wadperfcounter'),'<Metrics resourceId=\"')]",
    "wadmetricsresourceid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name ,'/providers/','Microsoft.Compute/virtualMachineScaleSets/',parameters('vmssName'))]",
    "wadcfgxend": "[concat('\"><MetricAggregation scheduledTransferPeriod=\"PT1H\"/><MetricAggregation scheduledTransferPeriod=\"PT1M\"/></Metrics></DiagnosticMonitorConfiguration></WadCfg>')]"
    ```

   * DNS names that are used by the network interfaces.
   * The IP address names and prefixes for the virtual network and subnets.
   * The names and identifiers of the virtual network, load balancer, and network interfaces.
   * Storage account names for the accounts associated with the machines in the scale set.
   * Settings for the Diagnostics extension that is installed on the virtual machines. For more information about the Diagnostics extension, see [Create a Windows Virtual machine with monitoring and diagnostics using Azure Resource Manager Template](../virtual-machines/windows/extensions-diagnostics-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

4. Add the storage account resource under the resources parent element that you added to the template. This template uses a loop to create the recommended five storage accounts where the operating system disks and diagnostic data are stored. This set of accounts can support up to 100 virtual machines in a scale set, which is the current maximum. Each storage account is named with a letter designator that was defined in the variables combined with the suffix that you provide in the parameters for the template.
   
        {
          "type": "Microsoft.Storage/storageAccounts",
          "name": "[concat(parameters('resourcePrefix'), variables('storageAccountSuffix')[copyIndex()])]",
          "apiVersion": "2015-06-15",
          "copy": {
            "name": "storageLoop",
            "count": 5
          },
          "location": "[resourceGroup().location]",
          "properties": { "accountType": "Standard_LRS" }
        },

5. Add the virtual network resource. For more information, see [Network Resource Provider](../virtual-network/resource-groups-networking.md).

    ```json
    {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Network/virtualNetworks",
      "name": "[variables('virtualNetworkName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": { "addressPrefixes": [ "10.0.0.0/16" ] },
        "subnets": [
          {
            "name": "subnet1",
            "properties": { "addressPrefix": "10.0.0.0/24" }
          }
        ]
      }
    },
    ```

6. Add the public IP address resources that are used by the load balancer and network interface.

    ```json
    {
      "apiVersion": "2016-03-30",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[variables('publicIP1')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
        "dnsSettings": {
          "domainNameLabel": "[variables('dnsName1')]"
        }
      }
    },
    {
      "apiVersion": "2016-03-30",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[variables('publicIP2')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
        "dnsSettings": {
          "domainNameLabel": "[variables('dnsName2')]"
        }
      }
    },
    ```

7. Add the load balancer resource that is used by the scale set. For more information, see [Azure Resource Manager Support for Load Balancer](../load-balancer/load-balancer-arm.md).

    ```json   
    {
      "apiVersion": "2015-06-15",
      "name": "[variables('loadBalancerName')]",
      "type": "Microsoft.Network/loadBalancers",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Network/publicIPAddresses/', variables('publicIP1'))]"
      ],
      "properties": {
        "frontendIPConfigurations": [
          {
            "name": "loadBalancerFrontEnd",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses/', variables('publicIP1'))]"
              }
            }
          }
        ],
        "backendAddressPools": [ { "name": "bepool1" } ],
        "inboundNatPools": [
          {
            "name": "natpool1",
            "properties": {
              "frontendIPConfiguration": {
                "id": "[variables('frontEndIPConfigID')]"
              },
              "protocol": "tcp",
              "frontendPortRangeStart": 50000,
              "frontendPortRangeEnd": 50500,
              "backendPort": 22
            }
          }
        ]
      }
    },
    ```

8. Add the network interface resource that is used by the separate virtual machine. Because machines in a scale set aren't accessible through a public IP address, a separate virtual machine is created in the same virtual network to remotely access the machines.

    ```json
    {
      "apiVersion": "2016-03-30",
      "type": "Microsoft.Network/networkInterfaces",
      "name": "[variables('nicName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Network/publicIPAddresses/', variables('publicIP2'))]",
        "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIP2'))]"
              },
              "subnet": {
                "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/virtualNetworks/',variables('virtualNetworkName'),'/subnets/subnet1')]"
              }
            }
          }
        ]
      }
    },
    ```

9. Add the separate virtual machine in the same network as the scale set.

    ```json
    {
      "apiVersion": "2016-03-30",
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[parameters('vmName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "storageLoop",
        "[concat('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
      ],
      "properties": {
        "hardwareProfile": { "vmSize": "Standard_A1" },
        "osProfile": {
          "computername": "[parameters('vmName')]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "14.04.4-LTS",
            "version": "latest"
          },
          "osDisk": {
            "name": "[concat(parameters('resourcePrefix'), 'os1')]",
            "vhd": {
              "uri":  "[concat('https://',parameters('resourcePrefix'),'a.blob.core.windows.net/vhds/',parameters('resourcePrefix'),'os1.vhd')]"
            },
            "caching": "ReadWrite",
            "createOption": "FromImage"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
            }
          ]
        }
      }
    },
    ```

10. Add the virtual machine scale set resource and specify the diagnostics extension that is installed on all virtual machines in the scale set. Many of the settings for this resource are similar with the virtual machine resource. The main differences are the capacity element that specifies the number of virtual machines in the scale set and upgradePolicy that specifies how updates are made to virtual machines. The scale set is not created until all the storage accounts are created as specified with the dependsOn element.

    ```json
    {
      "type": "Microsoft.Compute/virtualMachineScaleSets",
      "apiVersion": "2016-03-30",
      "name": "[parameters('vmSSName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "storageLoop",
        "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]",
        "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]"
      ],
      "sku": {
        "name": "Standard_A1",
        "tier": "Standard",
        "capacity": "[parameters('instanceCount')]"
      },
      "properties": {
        "upgradePolicy": {
          "mode": "Manual"
        },
        "virtualMachineProfile": {
          "storageProfile": {
            "osDisk": {
              "vhdContainers": [
                "[concat('https://', parameters('resourcePrefix'), variables('storageAccountSuffix')[0],'.blob.core.windows.net/vmss')]",
                "[concat('https://', parameters('resourcePrefix'), variables('storageAccountSuffix')[1],'.blob.core.windows.net/vmss')]",
                "[concat('https://', parameters('resourcePrefix'), variables('storageAccountSuffix')[2],'.blob.core.windows.net/vmss')]",
                "[concat('https://', parameters('resourcePrefix'), variables('storageAccountSuffix')[3],'.blob.core.windows.net/vmss')]",
                "[concat('https://', parameters('resourcePrefix'), variables('storageAccountSuffix')[4],'.blob.core.windows.net/vmss')]"
              ],
              "name": "vmssosdisk",
              "caching": "ReadOnly",
              "createOption": "FromImage"
            },
            "imageReference": {
              "publisher": "Canonical",
              "offer": "UbuntuServer",
              "sku": "14.04.4-LTS",
              "version": "latest"
            }
          },
          "osProfile": {
            "computerNamePrefix": "[parameters('vmSSName')]",
            "adminUsername": "[parameters('adminUsername')]",
            "adminPassword": "[parameters('adminPassword')]"
          },
          "networkProfile": {
            "networkInterfaceConfigurations": [
              {
                "name": "networkconfig1",
                "properties": {
                  "primary": "true",
                  "ipConfigurations": [
                    {
                      "name": "ip1",
                      "properties": {
                        "subnet": {
                          "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/virtualNetworks/',variables('virtualNetworkName'),'/subnets/subnet1')]"
                        },
                        "loadBalancerBackendAddressPools": [
                          {
                            "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/loadBalancers/',variables('loadBalancerName'),'/backendAddressPools/bepool1')]"
                          }
                        ],
                        "loadBalancerInboundNatPools": [
                          {
                            "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/loadBalancers/',variables('loadBalancerName'),'/inboundNatPools/natpool1')]"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          "extensionProfile": {
            "extensions": [
              {
                "name":"LinuxDiagnostic",
                "properties": {
                  "publisher":"Microsoft.OSTCExtensions",
                  "type":"LinuxDiagnostic",
                  "typeHandlerVersion":"2.1",
                  "autoUpgradeMinorVersion":false,
                  "settings": {
                    "xmlCfg":"[base64(concat(variables('wadcfgxstart'),variables('wadmetricsresourceid'),variables('wadcfgxend')))]",
                    "storageAccount":"[variables('diagnosticsStorageAccountName')]"
                  },
                  "protectedSettings": {
                    "storageAccountName":"[variables('diagnosticsStorageAccountName')]",
                    "storageAccountKey":"[listkeys(variables('accountid'), '2015-06-15').key1]",
                    "storageAccountEndPoint":"https://core.windows.net"
                  }
                }
              }
            ]
          }
        }
      }
    },
    ```

11. Add the autoscaleSettings resource that defines how the scale set adjusts based on processor usage on the machines in the set.

    ```json
    {
      "type": "Microsoft.Insights/autoscaleSettings",
      "apiVersion": "2015-04-01",
      "name": "[concat(parameters('resourcePrefix'),'as1')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachineScaleSets/',parameters('vmSSName'))]"
      ],
      "properties": {
        "enabled": true,
        "name": "[concat(parameters('resourcePrefix'),'as1')]",
        "profiles": [
          {
            "name": "Profile1",
            "capacity": {
              "minimum": "1",
              "maximum": "10",
              "default": "1"
            },
            "rules": [
              {
                "metricTrigger": {
                  "metricName": "\\Processor\\PercentProcessorTime",
                  "metricNamespace": "",
                  "metricResourceUri": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Compute/virtualMachineScaleSets/',parameters('vmSSName'))]",
                  "timeGrain": "PT1M",
                  "statistic": "Average",
                  "timeWindow": "PT5M",
                  "timeAggregation": "Average",
                  "operator": "GreaterThan",
                  "threshold": 50.0
                },
                "scaleAction": {
                  "direction": "Increase",
                  "type": "ChangeCount",
                  "value": "1",
                  "cooldown": "PT5M"
                }
              }
            ]
          }
        ],
        "targetResourceUri": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/', resourceGroup().name,'/providers/Microsoft.Compute/virtualMachineScaleSets/',parameters('vmSSName'))]"
      }
    }
    ```
    
    For this tutorial, these values are important:
    
    * **metricName**  
    This value is the same as the performance counter that we defined in the wadperfcounter variable. Using that variable, the Diagnostics extension collects the **Processor\PercentProcessorTime** counter.
    
    * **metricResourceUri**  
    This value is the resource identifier of the virtual machine scale set.
    
    * **timeGrain**  
    This value is the granularity of the metrics that are collected. In this template, it is set to one minute.
    
    * **statistic**  
    This value determines how the metrics are combined to accommodate the automatic scaling action. The possible values are: Average, Min, Max. In this template, the average total CPU usage of the virtual machines is collected.

    * **timeWindow**  
    This value is the range of time in which instance data is collected. It must be between 5 minutes and 12 hours.
    
    * **timeAggregation**  
    his value determines how the data that is collected should be combined over time. The default value is Average. The possible values are: Average, Minimum, Maximum, Last, Total, Count.
    
    * **operator**  
    This value is the operator that is used to compare the metric data and the threshold. The possible values are: Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual.
    
    * **threshold**  
    This value triggers the scale action. In this template, machines are added to the scale set when the average CPU usage among machines in the set is over 50%.
    
    * **direction**  
    This value determines the action that is taken when the threshold value is achieved. The possible values are Increase or Decrease. In this template, the number of virtual machines in the scale set is increased if the threshold is over 50% in the defined time window.

    * **type**  
    This value is the type of action that should occur and must be set to ChangeCount.
    
    * **value**  
    This value is the number of virtual machines that are added or removed from the scale set. This value must be 1 or greater. The default value is 1. In this template, the number of machines in the scale set increases by 1 when the threshold is met.

    * **cooldown**  
    This value is the amount of time to wait since the last scaling action before the next action occurs. This value must be between one minute and one week.

12. Save the template file.    

## Step 3: Upload the template to storage
The template can be uploaded as long as you know the name and primary key of the storage account that you created in step 1.

1. In your command-line interface (Bash, Terminal, Command prompt), run these commands to set the environment variables needed to access the storage account:

    ```cli   
    export AZURE_STORAGE_ACCOUNT={account_name}
    export AZURE_STORAGE_ACCESS_KEY={key}
    ```
    
    You can get the key by clicking the key icon when viewing the storage account resource in the Azure portal. When using a Windows command prompt, type **set** instead of export.

2. Create the container for storing the template.
   
    ```cli
    azure storage container create -p Blob templates
    ```

3. Upload the template file to the new container.
   
    ```cli
    azure storage blob upload VMSSTemplate.json templates VMSSTemplate.json
    ```

## Step 4: Deploy the template
Now that you created the template, you can start deploying the resources. Use this command to start the process:

```cli
azure group deployment create --template-uri https://vmsstestsa.blob.core.windows.net/templates/VMSSTemplate.json vmsstestrg1 vmsstestdp1
```

When you press enter, you are prompted to provide values for the variables you assigned. Provide these values:

```cli
vmName: vmsstestvm1
vmSSName: vmsstest1
instanceCount: 5
adminUserName: vmadmin1
adminPassword: VMpass1
resourcePrefix: vmsstest
```

It should take about 15 minutes for all the resources to successfully be deployed.

> [!NOTE]
> You can also use the portal’s ability to deploy the resources. Use this link:
> https://portal.azure.com/#create/Microsoft.Template/uri/<link to VM Scale Set JSON template>


## Step 5: Monitor resources
You can get some information about virtual machine scale sets using these methods:

* The Azure portal - You can currently get a limited amount of information using the portal.

* The [Azure Resource Explorer](https://resources.azure.com/) - This tool is the best for exploring the current state of your scale set. Follow this path and you should see the instance view of the scale set that you created:
  
    ```cli
    subscriptions > {your subscription} > resourceGroups > vmsstestrg1 > providers > Microsoft.Compute > virtualMachineScaleSets > vmsstest1 > virtualMachines
    ```

* Azure CLI - Use this command to get some information:

    ```cli  
    azure resource show -n vmsstest1 -r Microsoft.Compute/virtualMachineScaleSets -o 2015-06-15 -g vmsstestrg1
    ```

* Connect to the jumpbox virtual machine just like you would any other machine and then you can remotely access the virtual machines in the scale set to monitor individual processes.

> [!NOTE]
> A complete REST API for obtaining information about scale sets can be found in [Virtual Machine Scale Sets](https://msdn.microsoft.com/library/mt589023.aspx).

## Step 6: Remove the resources
Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. You can delete the resource group and all its resources are automatically deleted.

```cli
azure group delete vmsstestrg1
```

## Next steps
* Find examples of Azure Monitor monitoring features in [Azure Monitor Cross-platform CLI quick start samples](../monitoring-and-diagnostics/insights-cli-samples.md)
* Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md)
* Learn how to [Use audit logs to send email and webhook alert notifications in Azure Monitor](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md)
* Check out the [Autoscale demo app on Ubuntu 16.04](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) template that sets up a Python/bottle app to exercise the automatic scaling functionality of Virtual Machine Scale Sets.

