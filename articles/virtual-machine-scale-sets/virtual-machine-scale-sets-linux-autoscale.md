<properties
	pageTitle="Autoscale Linux Virtual Machine Scale Sets | Microsoft Azure"
	description="Set up autoscaling for a Linux Virtual Machine Scale Set using Azure CLI"
	services="virtual-machine-scale-sets"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machine-scale-sets"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/10/2016"
	ms.author="davidmu"/>

# Automatically scale Linux machines in a Virtual Machine Scale Set

Virtual Machine Scale Sets make it easy for you to deploy and manage identical virtual machines as a set. Scale sets provide a highly scalable and customizable compute layer for hyperscale applications, and they support Windows platform images, Linux platform images, custom images, and extensions. To learn more, see [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md).

This tutorial shows you how to create a Virtual Machine Scale Set of Linux virtual machines using the latest version of Ubuntu Linux and automatically scale the machines in the set. You do this by creating an Azure Resource Manager template and deploying it using Azure CLI. For more information about templates, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). To learn more about automatic scaling of scale sets, see [Automatic scaling and Virtual Machine Scale Sets](virtual-machine-scale-sets-autoscale-overview.md).

In this tutorial, you deploy the following resources and extensions:

- Microsoft.Storage/storageAccounts
- Microsoft.Network/virtualNetworks
- Microsoft.Network/publicIPAddresses
- Microsoft.Network/loadBalancers
- Microsoft.Network/networkInterfaces
- Microsoft.Compute/virtualMachines
- Microsoft.Compute/virtualMachineScaleSets
- Microsoft.Insights.VMDiagnosticsSettings
- Microsoft.Insights/autoscaleSettings

For more information about Resource Manager resources, see [Azure Compute, Network, and Storage Providers under the Azure Resource Manager](../virtual-machines/virtual-machines-linux-compare-deployment-models.md).

Before you get started with the steps in this tutorial, [install the Azure CLI](../xplat-cli-install.md).

## Step 1: Create a resource group and a storage account

1. **Sign in to Microsoft Azure** - In your command-line interface (Bash, Terminal, Command prompt), make sure you're in Resource Manager mode by typing `azure config mode arm`, and then [log in with your work or school id](../xplat-cli-connect.md#use-the-log-in-method) by typing `azure login` and following the prompts for an interactive login experience to your Azure account.

	> [AZURE.NOTE] If you have a work or school ID and you know you do not have two-factor authentication enabled, you can use `azure login -u` along with the work or school ID to log in without an interactive session. If you don't have a work or school ID, you can [create a work or school id from your personal Microsoft account](../virtual-machines/resource-group-create-work-id-from-personal.md).

2. **Create a resource group** – All resources must be deployed to a resource group. For this tutorial, name the resource group **vmsstest1**.

        azure group create vmsstestrg1 centralus

3. **Deploy a storage account into the new resource group** – This tutorial uses several storage accounts to facilitate the virtual machine scale set. Create a storage account named **vmsstestsa**. Keep the command interface window open for steps later in this tutorial.

        azure storage account create -g vmsstestrg1 -l centralus --kind Storage --sku-name LRS vmsstestsa

## Step 2: Create the template
An Azure Resource Manager template makes it possible for you to deploy and manage Azure resources together by using a JSON description of the resources and associated deployment parameters.

1. In your favorite editor, create the file C:\VMSSTemplate.json and add the initial JSON structure to support the template.

        {
          "$schema":"http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
          }
          "variables": {
          }
          "resources": [
          ]
        }

2. Parameters are not always required, but they make template management easier. They provide a way to specify values for the template, describe the type of the value, the default value if needed, and possibly the allowed values of the parameter. Add these parameters under the parameters parent element that you added to the template.

        "vmName": {
          "type": "string"
        },
        "vmSSName": {
          "type": "string"
        },
        "instanceCount": {
          "type": "string"
        },
        "adminUsername": {
          "type": "string"
        },
        "adminPassword": {
          "type": "securestring"
        },
        "resourcePrefix": {
          "type": "string"
        }
            
	- A name for the separate virtual machine that is used to access the machines in the scale set.
	- A name for the storage account where the template is stored.
	- The number of instances of virtual machines to initially create in the scale set.
	- A name and password of the administrator account on the virtual machines.
	- A prefix for the resources that are created in the resource group.

3. Variables can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. Add these variables under the variables parent element that you added to the template.

        "dnsName1": "[concat(parameters('resourcePrefix'),'dn1')]",
        "dnsName2": "[concat(parameters('resourcePrefix'),'dn2')]",
        "vmSize": "Standard_A0",
        "imagePublisher": "Canonical",
        "imageOffer": "UbuntuServer",
        "imageVersion": "15.10",
        "addressPrefix": "10.0.0.0/16",
        "subnetName": "Subnet",
        "subnetPrefix": "10.0.0.0/24",
        "publicIP1": "[concat(parameters('resourcePrefix'),'ip1')]",
        "publicIP2": "[concat(parameters('resourcePrefix'),'ip2')]",
        "loadBalancerName": "[concat(parameters('resourcePrefix'),'lb1')]",
        "virtualNetworkName": "[concat(parameters('resourcePrefix'),'vn1')]",
        "nicName1": "[concat(parameters('resourcePrefix'),'nc1')]",
        "nicName2": "[concat(parameters('resourcePrefix'),'nc2')]",
        "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',variables('virtualNetworkName'))]",
        "publicIPAddressID1": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIP1'))]",
        "publicIPAddressID2": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIP2'))]",
        "lbID": "[resourceId('Microsoft.Network/loadBalancers',variables('loadBalancerName'))]",
        "nicId": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName2'))]",
        "frontEndIPConfigID": "[concat(variables('lbID'),'/frontendIPConfigurations/loadBalancerFrontEnd')]",
        "storageAccountType": "Standard_LRS",
        "storageAccountSuffix": [ "a", "g", "m", "s", "y" ],
        "diagnosticsStorageAccountName": "[concat(parameters('resourcePrefix'), 'a')]",
        "accountid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/', resourceGroup().name,'/providers/','Microsoft.Storage/storageAccounts/', variables('diagnosticsStorageAccountName'))]",
        "wadlogs": "<WadCfg><DiagnosticMonitorConfiguration>",
        "wadperfcounter": "<PerformanceCounters scheduledTransferPeriod=\"PT1M\"><PerformanceCounterConfiguration counterSpecifier=\"\\Processor\\PercentProcessorTime\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"CPU percentage guest OS\" locale=\"en-us\"/></PerformanceCounterConfiguration></PerformanceCounters>",
        "wadcfgxstart": "[concat(variables('wadlogs'),variables('wadperfcounter'),'<Metrics resourceId=\"')]",
        "wadmetricsresourceid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name ,'/providers/','Microsoft.Compute/virtualMachineScaleSets/',parameters('vmssName'))]",
        "wadcfgxend": "[concat('\"><MetricAggregation scheduledTransferPeriod=\"PT1H\"/><MetricAggregation scheduledTransferPeriod=\"PT1M\"/></Metrics></DiagnosticMonitorConfiguration></WadCfg>')]"
        
	- DNS names that are used by the network interfaces.
	- The size of the virtual machines used in the scale set. For more information about virtual machine sizes see, [Sizes for virtual machines](../virtual-machines/virtual-machines-size-specs.md).
	- The platform image information for defining the operating system that will run on the virtual machines in the scale set. For more information about selecting images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](../virtual-machines/resource-groups-vm-searching.md).
	- The IP address names and prefixes for the virtual network and subnets.
	- The names and identifiers of the virtual network, load balancer, and network interfaces.
	- Storage account names for the accounts associated with the machines in the scale set.
	- Settings for the Diagnostics extension that is installed on the virtual machines. For more information about the Diagnostics extension, see [Create a Windows Virtual machine with monitoring and diagnostics using Azure Resource Manager Template](../virtual-machines/virtual-machines-extensions-diagnostics-windows-template.md).

4. Add the storage account resource under the resources parent element that you added to the template. This template uses a loop to create the recommended 5 storage accounts where the operating system disks and diagnostic data are stored. This set of accounts can support up to 100 virtual machines in a scale set, which is the current maximum. Each storage account is named with a letter designator that was defined in the variables combined with the suffix that you provide in the parameters for the template.

        {
          "type": "Microsoft.Storage/storageAccounts",
          "name": "[concat(parameters('resourcePrefix'), variables('storageAccountSuffix')[copyIndex()])]",
          "apiVersion": "2015-06-15",
          "copy": {
            "name": "storageLoop",
            "count": 5
          },
          "location": "[resourceGroup().location]",
          "properties": {
            "accountType": "[variables('storageAccountType')]"
          }
        },

5. Add the virtual network resource. For more information, see [Network Resource Provider](../virtual-network/resource-groups-networking.md).

        {
          "apiVersion": "2015-06-15",
          "type": "Microsoft.Network/virtualNetworks",
          "name": "[variables('virtualNetworkName')]",
          "location": "[resourceGroup().location]",
          "properties": {
            "addressSpace": {
              "addressPrefixes": [
                "[variables('addressPrefix')]"
              ]
            },
            "subnets": [
              {
                "name": "[variables('subnetName')]",
                "properties": {
                  "addressPrefix": "[variables('subnetPrefix')]"
                }
              }
            ]
          }
        },

6. Add the public IP address resources that are used by the load balancer and network interface.

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

7. Add the load balancer resource that is used by the scale set. For more information, see [Azure Resource Manager Support for Load Balancer](../load-balancer/load-balancer-arm.md).
        
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
                    "id": "[variables('publicIPAddressID1')]"
                  }
                }
              }
            ],
            "backendAddressPools": [
              {
                "name": "bepool1"
              }
            ],
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
                  "backendPort": 3389
                }
              }
            ]
          }
        },

8. Add the network interface resource that is used by the separate virtual machine. Because machines in a virtual machine scale set are not directly accessible using a public IP address, a separate virtual machine is created in the same virtual network as the scale set and is used to remotely access the machines in the set.

        {
          "apiVersion": "2016-03-30",
          "type": "Microsoft.Network/networkInterfaces",
          "name": "[variables('nicName1')]",
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
                    "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/virtualNetworks/',variables('virtualNetworkName'),'/subnets/',variables('subnetName'))]"
                  }
                }
              }
            ]
          }
        },

9. Add the separate virtual machine in the same network as the scale set.

        {
          "apiVersion": "2016-03-30",
          "type": "Microsoft.Compute/virtualMachines",
          "name": "[parameters('vmName')]",
          "location": "[resourceGroup().location]",
          "dependsOn": [
            "storageLoop",
            "[concat('Microsoft.Network/networkInterfaces/', variables('nicName1'))]"
          ],
          "properties": {
            "hardwareProfile": {
              "vmSize": "[variables('vmSize')]"
            },
            "osProfile": {
              "computername": "[parameters('vmName')]",
              "adminUsername": "[parameters('adminUsername')]",
              "adminPassword": "[parameters('adminPassword')]"
            },
            "storageProfile": {
              "imageReference": {
                "publisher": "[variables('imagePublisher')]",
                "offer": "[variables('imageOffer')]",
                "sku": "[variables('imageVersion')]",
                "version": "latest"
              },
              "osDisk": {
                "name": "osdisk1",
                "vhd": {
                  "uri":  "[concat('https://',parameters('resourcePrefix'),'sa.blob.core.windows.net/vhds/',parameters('resourcePrefix'),'osdisk1.vhd')]"
                },
                "caching": "ReadWrite",
                "createOption": "FromImage"
              }
            },
            "networkProfile": {
              "networkInterfaces": [
                {
                  "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName1'))]"
                }
              ]
            }
          }
        },

10.	Add the virtual machine scale set resource and specify the Diagnostics extension that is installed on all virtual machines in the scale set. Many of the settings for this resource are similar with the virtual machine resource. The main differences are the addition of the capacity element that specifies how many virtual machines should be initialized in the scale set, and upgradePolicy that specifies how updates are made to virtual machines in the scale set. The scale set is not created until all of the storage accounts are created as specified with the dependsOn element.

            {
              "type": "Microsoft.Compute/virtualMachineScaleSets",
              "apiVersion": "2016-03-30",
              "name": "[parameters('vmSSName')]",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "storageLoop",
                "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]",
                "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
              ],
              "sku": {
                "name": "[variables('vmSize')]",
                "tier": "Standard",
                "capacity": "[parameters('instanceCount')]"
              }
              "properties": {
                "upgradePolicy": {
                  "mode": "Manual"
                },
                "virtualMachineProfile": {
                  "storageProfile": {
                    "osDisk": {
                      "vhdContainers": [
                        "[concat('https://', parameters('resourcePrefix'), 'a.blob.core.windows.net/vmss')]",
                        "[concat('https://', parameters('resourcePrefix'), 'g.blob.core.windows.net/vmss')]",
                        "[concat('https://', parameters('resourcePrefix'), 'm.blob.core.windows.net/vmss')]",
                        "[concat('https://', parameters('resourcePrefix'), 's.blob.core.windows.net/vmss')]",
                        "[concat('https://', parameters('resourcePrefix'), 'y.blob.core.windows.net/vmss')]"
                      ],
                      "name": "vmssosdisk",
                      "caching": "ReadOnly",
                      "createOption": "FromImage"
                    },
                    "imageReference": {
                      "publisher": "[variables('imagePublisher')]",
                      "offer": "[variables('imageOffer')]",
                      "sku": "[variables('imageVersion')]",
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
                        "name": "[variables('nicName2')]",
                        "properties": {
                          "primary": "true",
                          "ipConfigurations": [
                            {
                              "name": "ip1",
                              "properties": {
                                "subnet": {
                                  "id": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',resourceGroup().name,'/providers/Microsoft.Network/virtualNetworks/',variables('virtualNetworkName'),'/subnets/',variables('subnetName'))]"
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

11.	Add the autoscaleSettings resource that defines how the scale set adjusts based on processor usage on the machines in the set. 
        
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
    
    For this tutorial, these are the important values:
    
    - **metricName** - This is the same as the performance counter that we defined in the wadperfcounter variable. Using that variable, the Diagnostics extension collects the  **Processor\PercentProcessorTime** counter.
    - **metricResourceUri** - This is the resource identifier of the virtual machine scale set.
    - **timeGrain** – This is the granularity of the metrics that are collected. In this template, it is set to 1 minute.
    - **statistic** – This determines how the metrics are combined to accommodate the automatic scaling action. The possible values are: Average, Min, Max. In this template we are looking for the average total CPU usage among the virtual machines in the scale set.
    - **timeWindow** – This if the range of time in which instance data is collected. It must be between 5 minutes and 12 hours.
    - **timeAggregation** –This determines how the data that is collected should be combined over time. The default value is Average. The possible values are: Average, Minimum, Maximum, Last, Total, Count.
    - **operator** – This is the operator that is used to compare the metric data and the threshold. The possible values are: Equals, NotEquals, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual.
    - **threshold** – This is the value that triggers the scale action. In this template, machines are added to the scale set when the average CPU usage among machines in the set is over 50%.
    - **direction** – This determines the action that is taken when the threshold value is achieved. The possible values are Increase or Decrease. In this template, the number of virtual machines in the scale set is increased if the threshold is over 50% in the defined time window.
    - **type** – This is the type of action that should occur, this must be set to ChangeCount.
    - **value** – This is the number of virtual machines that are added or removed from the scale set. This value must be 1 or greater. The default value is 1. In this template, the number of machines in the scale set increases by 1 when the threshold is met.
    - **cooldown** – This is the amount of time to wait since the last scaling action before the next action occurs. This must be between 1 minute and I week.

12.	Save the template file.    

## Step 3: Upload the template to storage

The template can be uploaded from your command-line interface as long as you know the account name and the primary key of the storage account that you created in step 1.

1. In your command-line interface (Bash, Terminal, Command prompt), run these commands to set the environment variables needed to access the storage account:

		export AZURE_STORAGE_ACCOUNT={account_name}
		export AZURE_STORAGE_ACCESS_KEY={key}

	You can get the key by clicking the key icon when viewing the storage account resource in the Azure portal. When using a Windows command prompt, type **set** instead of export.

2. Create the container to store the template:

		azure storage container create -p Blob templates

3. Upload the template file to the new container.

		azure storage blob upload VMSSTemplate.json templates VMSSTemplate.json

## Step 4: Deploy the template

Now that you created the template, you can start deploying the resources. Use this command to start the process:

	azure group deployment create --template-uri https://vmsstestsa.blob.core.windows.net/templates/VMSSTemplate.json vmsstestrg1 vmsstestdp1

When you press enter, you are prompted to provide values for the variables you assigned. Provide these values:

	vmName: vmsstestvm1
	vmSSName: vmsstest1
	instanceCount: 5
	adminUserName: vmadmin1
	adminPassword: VMpass1
	resourcePrefix: vmsstest

It should take about 15 minutes for all of the resources to successfully be deployed.

>[AZURE.NOTE]You can also make use of the portal’s ability to deploy the resources. To do this, use this link:
https://portal.azure.com/#create/Microsoft.Template/uri/<link to VM Scale Set JSON template>

## Step 5: Monitor resources

You can get some information about virtual machine scale sets using these methods:

 - The Azure portal - You can currently get a limited amount of information using the portal.
 - The [Azure Resource Explorer](https://resources.azure.com/) - This is the best tool to explore the current state of your scale set. Follow this path and you should see the instance view of the scale set that you created:

		subscriptions > {your subscription} > resourceGroups > vmsstestrg1 > providers > Microsoft.Compute > virtualMachineScaleSets > vmsstest1 > virtualMachines

 - Azure CLI - Use this command to get some information:

		azure resource show -n vmsstest1 -r Microsoft.Compute/virtualMachineScaleSets -o 2015-06-15 -g vmsstestrg1

 - Connect to the jumpbox virtual machine just like you would any other machine and then you can remotely access the virtual machines in the scale set to monitor individual processes.

>[AZURE.NOTE]A complete REST API for obtaining information about scale sets can be found in [Virtual Machine Scale Sets](https://msdn.microsoft.com/library/mt589023.aspx).

## Step 6: Remove the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. You can delete the resource group and all of its resources will automatically be deleted.

		azure group delete vmsstestrg1

## Next steps

- Find examples of Azure Insights monitoring features in [Azure Insights Cross-platform CLI quick start samples](../azure-portal/insights-cli-samples.md)
- Learn about notification features in [Use autoscale actions to send email and webhook alert notifications in Azure Insights](../azure-portal/insights-autoscale-to-webhook-email.md) and [Use audit logs to send email and webhook alert notifications in Azure Insights](../azure-portal/insights-auditlog-to-webhook-email.md)
- Check out the [Autoscale a VM Scale Set running a Ubuntu/Apache/PHP app](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale) template that sets up a LAMP stack to exercise the automatic scaling functionality of Virtual Machine Scale Sets.
