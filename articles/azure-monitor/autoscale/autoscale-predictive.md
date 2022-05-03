---
title: Use predictive autoscale to scale out before load demands in virtual machine scale sets (Preview)
description: Details on the new predictive autoscale feature in Azure Monitor.  
ms.topic: conceptual
ms.date: 01/24/2022
ms.subservice: autoscale
ms.custom: references_regions
---
# Use predictive autoscale to scale out before load demands in virtual machine scale sets (Preview)

**Predictive autoscale** uses machine learning to help manage and scale Azure Virtual Machine Scale Sets with cyclical workload patterns. It forecasts the overall CPU load to your virtual machine scale set, based on your historical CPU usage patterns.  By observing and learning from historical usage, it predicts the overall CPU load ensuring scale-out occurs in time to meet the demand.

Predictive autoscale needs a minimum of 7 days of history to provide predictions, though 15 days of historical data provides the most accurate results. It adheres to the scaling boundaries you have set for your virtual machine scale set. When the system predicts that the percentage CPU load of your virtual machine scale set will cross your scale-out boundary, new instances are added according to your specifications. You can also configure how far in advance you would like new instances to be provisioned, up to 1 hour before the predicted workload spike will occur.

**Forecast only** allows you to view your predicted CPU forecast without actually triggering the scaling action based on the prediction. You can then compare the forecast with your actual workload patterns to build confidence in the prediction models before enabling the predictive autoscale feature.

## Public preview support, availability and limitations

>[!NOTE]
> This is a public preview release. We are testing and gathering feedback for future releases. As such, we do not provide production level support for this feature. Support is best effort. Send feature suggestions or feedback on predicative autoscale to predautoscalesupport@microsoft.com.

During public preview, predictive autoscale is only available in the following regions:

- West Central US
- West US2
- UK South
- UK West
- Southeast Asia
- East Asia
- Australia East
- Australia South east
- Canada Central
- Canada East

The following limitations apply during public preview. Predictive autoscale:

- Only works for workloads exhibiting cyclical CPU usage patterns.
- Only can be enabled for Virtual Machine Scale Sets.
- Only supports using the metric *Percentage CPU* with the aggregation type *Average*.
- Only supports scale-out. You can’t use predictive autoscale to scale-in.

You have to enable standard (or reactive) autoscale to manage scale-in.
Enabling predictive autoscale or forecast only with Azure portal

1. Go to the virtual machine scale set screen and select on **Scaling**.

   :::image type="content" source="media/autoscale-predictive/main-scaling-screen-1.png" alt-text="Screenshot showing selecting the scaling screen from the left hand menu in Azure portal":::

2. Under **Custom autoscale** section, there's a new field called **Predictive autoscale**.
  
    :::image type="content" source="media/autoscale-predictive/custom-autoscale-2.png" alt-text="Screenshot sowing selecting custom autoscale and then predictive autoscale option from Azure portal":::

    Using the drop-down selection, you can:
    - Disable predictive autoscale - Disable is the default selection when you first land on the page for predictive autoscale.
    - Enable forecast only mode
    - Enable predictive autoscale

   > [!NOTE] 
   > Before you can enable predictive autoscale or forecast only mode, you must set up the standard reactive autoscale conditions.

3. To enable forecast only, select it from the dropdown. Define a scale up trigger based on *Percentage CPU*. Then select **Save**. The same process applies to enable predictive autoscale. To disable predictive autoscale or forecast only mode, choose **Disable** from the drop-down. 

   :::image type="content" source="media/autoscale-predictive/enable-forecast-only-mode-3.png" alt-text="Screenshot of enable forecast only mode":::

4. If desired, specify a pre-launch time so the instances are full running before they're needed. You can pre-launch instances between 5 and 60 minutes before the needed prediction time.

   :::image type="content" source="media/autoscale-predictive/pre-launch-4.png" alt-text="Screenshot of predictive autoscale pre-launch setup":::
  
5. Once you have enabled predictive autoscale or forecast only and saved it, select *Predictive charts*.
  
   :::image type="content" source="media/autoscale-predictive/predictve-charts-option-5.png" alt-text="Screenshot of selecting predictive charts menu option":::

6. You see three charts:

    :::image type="content" source="media/autoscale-predictive/predictive-charts-6.png" alt-text="Screenshot of three charts for predictive autoscale" lightbox="media/autoscale-predictive/predictive-charts-6.png":::

- The top chart shows an overlaid comparison of actual vs predicted total CPU percentage. The timespan of the graph shown is from the last 24 hours to the next 24 hours.
- The second chart shows the number of instances running at specific times over the last 24 hours.
- The third chart shows the current Average CPU utilization over the last 24 hours.

## Enable using an Azure Resource Manager template

1.	Retrieve the virtual machine scale set resource ID and resource group of your virtual machine scale set.  For example: /subscriptions/e954e48d-abcd-abcd-abcd-3e0353cb45ae/resourceGroups/patest2/providers/Microsoft.Compute/virtualMachineScaleSets/patest2

2. Update *autoscale_only_parameters* file with the virtual machine scale set resource ID and any autoscale setting parameters.

3. Use a PowerShell command to deploy the template containing the autoscale settings. For example,

```cmd
PS G:\works\kusto_onboard\test_arm_template> new-azurermresourcegroupdeployment -name binzAutoScaleDeploy -resourcegroupname cpatest2 -templatefile autoscale_only.json -templateparameterfile autoscale_only_parameters.json
```

:::image type="content" source="media/autoscale-predictive/powershell-template-7.png" alt-text="Screenshot of PowerShell command output from command above when running Azure Resource Manager templates to deploy predictive autoscale":::

**autoscale_only.json**
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
	"parameters": {
		"targetVmssResourceId": {
			"type": "string"
		},
		"location": {
			"type": "string"
		},
		"minimumCapacity": {
			"type": "Int",
			"defaultValue": 2,
			"metadata": {
				"description": "The minimum capacity.  Autoscale engine will ensure the instance count is at least this value."
			}
		},
		"maximumCapacity": {
			"type": "Int",
			"defaultValue": 5,
			"metadata": {
				"description": "The maximum capacity.  Autoscale engine will ensure the instance count is not greater than this value."
			}
		},
		"defaultCapacity": {
			"type": "Int",
			"defaultValue": 3,
			"metadata": {
				"description": "The default capacity.  Autoscale engine will preventively set the instance count to be this value if it can not find any metric data."
			}
		},
		"metricThresholdToScaleOut": {
			"type": "Int",
			"defaultValue": 30,
			"metadata": {
				"description": "The metric upper threshold.  If the metric value is above this threshold then autoscale engine will initiate scale out action."
			}
		},
		"metricTimeWindowForScaleOut": {
			"type": "string",
			"defaultValue": "PT5M",
			"metadata": {
				"description": "The metric look up time window."
			}
		},
		"metricThresholdToScaleIn": {
			"type": "Int",
			"defaultValue": 20,
			"metadata": {
				"description": "The metric lower threshold.  If the metric value is below this threshold then autoscale engine will initiate scale in action."
			}
		},
		"metricTimeWindowForScaleIn": {
			"type": "string",
			"defaultValue": "PT5M",
			"metadata": {
				"description": "The metric look up time window."
			}
		},
		"changeCountScaleOut": {
			"type": "Int",
			"defaultValue": 1,
			"metadata": {
				"description": "The instance count to increase when autoscale engine is initiating scale out action."
			}
		},
		"changeCountScaleIn": {
			"type": "Int",
			"defaultValue": 1,
			"metadata": {
				"description": "The instance count to decrease the instance count when autoscale engine is initiating scale in action."
			}
		},
        "predictiveAutoscaleMode": {
            "type": "String",
            "defaultValue": "ForecastOnly",
            "metadata": {
                "description": "The predictive Autoscale mode."
            }
        }
	},
	"variables": {
	},
	"resources": [{
			"type": "Microsoft.Insights/autoscalesettings",
			"name": "cpuPredictiveAutoscale",
			"apiVersion": "2015-04-01",
			"location": "[parameters('location')]",
			"properties": {
				"profiles": [{
						"name": "DefaultAutoscaleProfile",
						"capacity": {
							"minimum": "[parameters('minimumCapacity')]",
							"maximum": "[parameters('maximumCapacity')]",
							"default": "[parameters('defaultCapacity')]"
						},
						"rules": [{
								"metricTrigger": {
									"metricName": "Percentage CPU",
									"metricNamespace": "",
									"metricResourceUri": "[parameters('targetVmssResourceId')]",
									"timeGrain": "PT1M",
									"statistic": "Average",
									"timeWindow": "[parameters('metricTimeWindowForScaleOut')]",
									"timeAggregation": "Average",
									"operator": "GreaterThan",
									"threshold": "[parameters('metricThresholdToScaleOut')]"
								},
								"scaleAction": {
									"direction": "Increase",
									"type": "ChangeCount",
									"value": "[parameters('changeCountScaleOut')]",
									"cooldown": "PT5M"
								}
							}, {
								"metricTrigger": {
									"metricName": "Percentage CPU",
									"metricNamespace": "",
									"metricResourceUri": "[parameters('targetVmssResourceId')]",
									"timeGrain": "PT1M",
									"statistic": "Average",
									"timeWindow": "[parameters('metricTimeWindowForScaleIn')]",
									"timeAggregation": "Average",
									"operator": "LessThan",
									"threshold": "[parameters('metricThresholdToScaleIn')]"
								},
								"scaleAction": {
									"direction": "Decrease",
									"type": "ChangeCount",
									"value": "[parameters('changeCountScaleOut')]",
									"cooldown": "PT5M"
								}
							}
						]
					}
				],
				"enabled": true,
				"targetResourceUri": "[parameters('targetVmssResourceId')]",
                "predictiveAutoscalePolicy": {
                    "scaleMode": "[parameters('predictiveAutoscaleMode')]"
                }
			}
		}
	],
	"outputs": {
        "targetVmssResourceId" : {
            "type" : "string",
            "value" : "[parameters('targetVmssResourceId')]"
        },
        "settingLocation" : {
            "type" : "string",
            "value" : "[parameters('location')]"
        },
        "predictiveAutoscaleMode" : {
            "type" : "string",
            "value" : "[parameters('predictiveAutoscaleMode')]"
        }
    }
}
```

**autoscale-only-parameters.json**
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
	"parameters": {
		"targetVmssResourceId": {
			"value": "/subscriptions/e954e48d-b252-b252-b252-3e0353cb45ae/resourceGroups/patest2/providers/Microsoft.Compute/virtualMachineScaleSets/patest2"
		},
		"location": {
			"value": "East US"
		},
		"minimumCapacity": {
			"value": 1
		},
		"maximumCapacity": {
			"value": 4
		},
		"defaultCapacity": {
		  "value": 4
		},
		"metricThresholdToScaleOut": {
		  "value": 50
		},
		"metricTimeWindowForScaleOut": {
		  "value": "PT5M"
		},
		"metricThresholdToScaleIn": {
		  "value": 30
		},
		"metricTimeWindowForScaleIn": {
		  "value": "PT5M"
		},
		"changeCountScaleOut": {
		  "value": 1
		},
		"changeCountScaleIn": {
		  "value": 1
		},
		"predictiveAutoscaleMode": {
		  "value": "Enabled"
		}
	}
}
```
 
For more information on Azure Resource Manager templates, see [Resource Manager template overview](../../azure-resource-manager/templates/overview.md)

## Common questions

### What happens over time when you turn on predictive autoscale for a virtual machine scale set?

Prediction autoscale uses the history of a running virtual machine scale set. If your scale set has been running less than 7 days,  you'll receive a message that the model is being trained. See the [no predictive data message](#errors-and-warnings). Predictions improve as time goes by achieving its maximum accuracy 15 days after the virtual machine scale set is created. 

If changes to the workload pattern occur (but remain periodic), the model recognizes the change and begins to adjust the forecast accordingly. The forecast improves as time goes by. Maximum accuracy is reached 15 days after the change in the traffic pattern happens. Remember that your standard autoscale rules still apply. If a new unpredicted increase in traffic occurs, your virtual machine scale set will still scale out to meet the demand.

### What if the model isn't working well for me?

The modeling works best with workloads that exhibit periodicity. We recommended you first evaluate the predictions by enabling "forecast only" which will overlay the scale set’s predicted CPU usage with the actual, observed usage.  Once you compare and evaluate the results, you can then choose to enable scaling based on the predicted metrics if the model predictions are close enough for your scenario.

### Why do I need to enable standard autoscale before enabling predictive autoscale?

Standard autoscaling is a necessary fallback if the predictive model doesn't work well for your scenario. Standard autoscale will cover unexpected load spikes which aren't part of your typical CPU load pattern. It also provides a fallback should there be any error retrieving the predictive data.

## Errors and Warnings 

### Didn't enable standard autoscale
 
You receive the error message as seen below:

   *Predictive autoscale is based on the metric percentage CPU of the current resource.  Choose this metric in the scale up trigger rules*. 

:::image type="content" source="media/autoscale-predictive/error-not-enabled.png" alt-text="Screenshot of error message predictive autoscale is based on the metric percentage CPU of the current resource":::

This message means you attempted to enable predictive autoscale before you enabled standard autoscale and set it up to use the *Percentage CPU* metric with the *Average* aggregation type.

### No predictive data

You won't see data on the predictive charts under certain conditions.  This isn't an error; it's the intended behavior.

When predictive autoscale is disabled, you instead receive a message beginning with "No data to show..." and giving you instructions on what to enable so you can see a predictive chart.
  
   :::image type="content" source="media/autoscale-predictive/error-no-data-to-show.png" alt-text="Screenshot of message No data to show":::

When you first create a virtual machine scale set and enable forecast only mode, you receive a message telling you "Predictive data is being trained.." and a time to return to see the chart.
  
   :::image type="content" source="media/autoscale-predictive/message-being-trained-12.png" alt-text="Screenshot of message Predictive data is being trained":::

## Next steps

Learn more about Autoscale by referring to the following:

- [Overview of autoscale](./autoscale-overview.md)
- [Azure Monitor autoscale common metrics](./autoscale-common-metrics.md)
- [Best practices for Azure Monitor autoscale](./autoscale-best-practices.md)
- [Use autoscale actions to send email and webhook alert notifications](./autoscale-webhook-email.md)
- [Autoscale REST API](/rest/api/monitor/autoscalesettings)