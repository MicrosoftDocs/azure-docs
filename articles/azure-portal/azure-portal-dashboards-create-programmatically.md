---
title: Programmatically create Azure Dashboards
description: Use a dashboard in the Azure portal as a template to programmatically create Azure Dashboards. Includes JSON reference.
ms.topic: how-to
ms.custom:
ms.date: 09/05/2023
---

# Programmatically create Azure dashboards

This article walks you through the process of programmatically creating and publishing Azure dashboards. The sample dashboard shown below is referenced throughout the document, but you can use this process with any dashboard.

:::image type="content" source="media/azure-portal-dashboards-create-programmatically/sample-dashboard.png" alt-text="Screenshot of a sample dashboard in the Azure portal.":::

## Overview

Shared dashboards in the [Azure portal](https://portal.azure.com) are [resources](../azure-resource-manager/management/overview.md), just like virtual machines and storage accounts. You can manage resources programmatically by using the [REST APIs](/rest/api/?view=Azure&preserve-view=true), the [Azure CLI](/cli/azure), and [Azure PowerShell commands](/powershell/azure/get-started-azureps).

Many features build on these APIs to make resource management easier. Each of these APIs and tools offers ways to create, list, retrieve, modify, and delete resources. Since dashboards are resources, you can pick your favorite API or tool to use.

Whichever tools you use, to create a dashboard programmatically, you construct a JSON representation of your dashboard object. This object contains information about the tiles on the dashboard. It includes sizes, positions, resources they're bound to, and any user customizations.

The most practical way to generate this JSON document is to use the Azure portal to create an initial dashboard with the tiles you want. Then export the JSON and create a template from the result that you can modify further and use in scripts, programs, and deployment tools.

## Fetch the JSON representation of a dashboard

We'll start by downloading the JSON representation of an existing dashboard. Open the dashboard that you want to start with. Select **Export** and then select **Download**.

:::image type="content" source="media/azure-portal-dashboards-create-programmatically/download-command.png" alt-text="Screenshot of the command to export the JSON representation of a template in the Azure portal.":::

You can also retrieve information about the dashboard resource programmatically by using [REST APIs](/rest/api/resources/Resources/Get) or other methods.

## Create a template from the JSON

The next step is to create a template from the downloaded JSON. You'll be able to use the template programmatically with the appropriate resource management APIs, command-line tools, or within the portal.

In most cases, you want to preserve the structure and configuration of each tile. Then parameterize the set of Azure resources that the tiles point to. You don't have to fully understand the [dashboard JSON structure](azure-portal-dashboards-structure.md) to create a template.

In your exported JSON dashboard, find all occurrences of Azure resource IDs. Our example dashboard has multiple tiles that all point at a single Azure virtual machine. That's because our dashboard only looks at this single resource. If you search the sample JSON included at the end of the document for "/subscriptions", you'll find several occurrences of this ID.

`/subscriptions/6531c8c8-df32-4254-d717-b6e983273e5d/resourceGroups/contoso/providers/Microsoft.Compute/virtualMachines/myVM1`

To publish this dashboard for any virtual machine in the future, parameterize every occurrence of this string within the JSON.

## Create a dashboard template

Azure offers the ability to orchestrate the deployment of multiple resources. You create a deployment template that expresses the set of resources to deploy and the relationships between them. For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

The JSON format of each deployed template resource is the same as if you were creating them individually by uploading an exported dashboard, except that the template language adds a few concepts like variables, parameters, basic functions, and more. This extended syntax is only supported in the context of a template deployment. For more information, see [Understand the structure and syntax of ARM templates](../azure-resource-manager/templates/syntax.md).

Parameterization should be done using the template's parameter syntax.  You replace all instances of the resource ID we found earlier as shown here.

Example JSON property with hard-coded resource ID:

```json
id: "/subscriptions/6531c8c8-df32-4254-d717-b6e983273e5d/resourceGroups/contoso/providers/Microsoft.Compute/virtualMachines/myVM1"
```

Example JSON property converted to a parameterized version based on template parameters

```json
id: "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
```

Declare required template metadata and the parameters at the top of the JSON template like this:

```json

{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "virtualMachineName": {
            "type": "string"
        },
        "virtualMachineResourceGroup": {
            "type": "string"
        },
        "dashboardName": {
            "type": "string"
        }
    },
    "variables": {},

    ... rest of template omitted ...
```

Once you've configured your template, deploy it using any of the following methods:

- [REST APIs](/rest/api/resources/deployments)
- [PowerShell](../azure-resource-manager/templates/deploy-powershell.md)
- [Azure CLI](/cli/azure/deployment/group#az-deployment-group-create)
- [The Azure portal template deployment page](https://portal.azure.com/#create/Microsoft.Template)

Next you'll see two versions of our example dashboard JSON. The first is the version that we exported from the portal that was already bound to a resource. The second is the template version that can be programmatically bound to any virtual machine and deployed using Azure Resource Manager.

## Example JSON representation exported from dashboard

This example is similar to what you'll see when you export a dashboard similar to the example at the beginning of this article. The hard-coded resource identifiers show that this dashboard is pointing at a specific Azure virtual machine.

```json
{
  "properties": {
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          "0": {
            "position": {
              "x": 0,
              "y": 0,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/MarkdownPart",
              "settings": {
                "content": {
                  "settings": {
                    "content": "## Azure Virtual Machines Overview\r\nNew team members should watch this video to get familiar with Azure Virtual Machines.",
                    "markdownUri": null
                  }
                }
              }
            }
          },
          "1": {
            "position": {
              "x": 3,
              "y": 0,
              "colSpan": 8,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/MarkdownPart",
              "settings": {
                "content": {
                  "settings": {
                    "content": "This is the team dashboard for the test VM we use on our team. Here are some useful links:\r\n\r\n1. [Create a Linux virtual machine](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal)\r\n1. [Create a Windows virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)\r\n1. [Create a virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/quick-create-portal)",
                    "title": "Test VM Dashboard",
                    "subtitle": "Contoso",
                    "markdownUri": null
                  }
                }
              }
            }
          },
          "2": {
            "position": {
              "x": 0,
              "y": 2,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/VideoPart",
              "settings": {
                "content": {
                  "settings": {
                    "src": "https://www.youtube.com/watch?v=rOiSRkxtTeU",
                    "autoplay": false
                  }
                }
              }
            }
          },
          "3": {
            "position": {
              "x": 0,
              "y": 4,
              "colSpan": 11,
              "rowSpan": 3
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Percentage CPU",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "4": {
            "position": {
              "x": 0,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Disk Read Operations/Sec",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Disk Write Operations/Sec",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "5": {
            "position": {
              "x": 3,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Disk Read Bytes",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Disk Write Bytes",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "6": {
            "position": {
              "x": 6,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Network In Total",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Network Out Total",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "7": {
            "position": {
              "x": 9,
              "y": 7,
              "colSpan": 2,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "id",
                  "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                }
              ],
              "type": "Extension/HubsExtension/PartType/ResourcePart",
              "asset": {
                "idInputName": "id",
                "type": "VirtualMachine"
              }
            }
          }
        }
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": 1
            }
          },
          "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
        }
      }
    }
  },
  "name": "Simple VM Dashboard",
  "type": "Microsoft.Portal/dashboards",
  "location": "INSERT LOCATION",
  "tags": {
    "hidden-title": "Simple VM Dashboard"
  },
  "apiVersion": "2015-08-01-preview"
}
```

## Example dashboard template representation

The templatized version of the example dashboard has defined three parameters called `virtualMachineName`, `virtualMachineResourceGroup`, and `dashboardName`.  The parameters let you point this dashboard at a different Azure virtual machine every time you deploy. This dashboard can be programmatically configured and deployed to point to any Azure virtual machine. To test this feature, copy the following template and paste it into the [Azure portal template deployment page](https://portal.azure.com/#create/Microsoft.Template).

This example deploys a dashboard by itself, but the template language lets you deploy multiple resources, and bundle one or more dashboards alongside them.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "virtualMachineName": {
      "type": "string",
      "metadata": {
        "description": "Name of the existing virtual machine to show in the dashboard"
      }
    },
    "virtualMachineResourceGroup": {
      "type": "string",
      "metadata": {
        "description": "Name of the resource group that contains the virtual machine"
      }
    },
    "dashboardName": {
      "type": "string",
      "defaultValue": "[guid(parameters('virtualMachineName'), parameters('virtualMachineResourceGroup'))]",
      "metadata": {
        "Description": "Resource name that Azure portal uses for the dashboard"
      }
    },
    "dashboardDisplayName": {
      "type": "string",
      "defaultValue": "Simple VM Dashboard",
      "metadata": {
        "description": "Name of the dashboard to display in Azure portal"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Portal/dashboards",
      "apiVersion": "2020-09-01-preview",
      "name": "[parameters('dashboardName')]",
      "location": "[parameters('location')]",
      "tags": {
        "hidden-title": "[parameters('dashboardDisplayName')]"
      },
      "properties": {
        "lenses": [
          {
            "order": 0,
            "parts": [
              {
                "position": {
                  "x": 0,
                  "y": 0,
                  "rowSpan": 2,
                  "colSpan": 3
                },
                "metadata": {
                  "inputs": [],
                  "type": "Extension/HubsExtension/PartType/MarkdownPart",
                  "settings": {
                    "content": {
                      "settings": {
                        "content": "## Azure Virtual Machines Overview\r\nNew team members should watch this video to get familiar with Azure Virtual Machines."
                      }
                    }
                  }
                }
              },
              {
                "position": {
                  "x": 3,
                  "y": 0,
                  "rowSpan": 4,
                  "colSpan": 8
                },
                "metadata": {
                  "inputs": [],
                  "type": "Extension/HubsExtension/PartType/MarkdownPart",
                  "settings": {
                    "content": {
                      "settings": {
                        "content": "This is the team dashboard for the test VM we use on our team. Here are some useful links:\r\n\r\n1. [Create a Linux virtual machine](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal)\r\n1. [Create a Windows virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)\r\n1. [Create a virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/quick-create-portal)",
                        "title": "Test VM Dashboard",
                        "subtitle": "Contoso"
                      }
                    }
                  }
                }
              },
              {
                "position": {
                  "x": 0,
                  "y": 2,
                  "rowSpan": 2,
                  "colSpan": 3
                },
                "metadata": {
                  "inputs": [],
                  "type": "Extension/HubsExtension/PartType/VideoPart",
                  "settings": {
                    "content": {
                      "settings": {
                        "src": "https://www.youtube.com/watch?v=rOiSRkxtTeU",
                        "autoplay": false
                      }
                    }
                  }
                }
              },
              {
                "position": {
                  "x": 0,
                  "y": 4,
                  "rowSpan": 3,
                  "colSpan": 11
                },
                "metadata": {
                  "inputs": [
                    {
                      "name": "queryInputs",
                      "value": {
                        "timespan": {
                          "duration": "PT1H"
                        },
                        "id": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]",
                        "chartType": 0,
                        "metrics": [
                          {
                            "name": "Percentage CPU",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          }
                        ]
                      }
                    }
                  ],
                  "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart"
                }
              },
              {
                "position": {
                  "x": 0,
                  "y": 7,
                  "rowSpan": 2,
                  "colSpan": 3
                },
                "metadata": {
                  "inputs": [
                    {
                      "name": "queryInputs",
                      "value": {
                        "timespan": {
                          "duration": "PT1H"
                        },
                        "id": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]",
                        "chartType": 0,
                        "metrics": [
                          {
                            "name": "Disk Read Operations/Sec",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          },
                          {
                            "name": "Disk Write Operations/Sec",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          }
                        ]
                      }
                    }
                  ],
                  "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart"
                }
              },
              {
                "position": {
                  "x": 3,
                  "y": 7,
                  "rowSpan": 2,
                  "colSpan": 3
                },
                "metadata": {
                  "inputs": [
                    {
                      "name": "queryInputs",
                      "value": {
                        "timespan": {
                          "duration": "PT1H"
                        },
                        "id": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]",
                        "chartType": 0,
                        "metrics": [
                          {
                            "name": "Disk Read Bytes",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          },
                          {
                            "name": "Disk Write Bytes",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          }
                        ]
                      }
                    }
                  ],
                  "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart"
                }
              },
              {
                "position": {
                  "x": 6,
                  "y": 7,
                  "rowSpan": 2,
                  "colSpan": 3
                },
                "metadata": {
                  "inputs": [
                    {
                      "name": "queryInputs",
                      "value": {
                        "timespan": {
                          "duration": "PT1H"
                        },
                        "id": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]",
                        "chartType": 0,
                        "metrics": [
                          {
                            "name": "Network In Total",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          },
                          {
                            "name": "Network Out Total",
                            "resourceId": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                          }
                        ]
                      }
                    }
                  ],
                  "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart"
                }
              },
              {
                "position": {
                  "x": 9,
                  "y": 7,
                  "rowSpan": 2,
                  "colSpan": 2
                },
                "metadata": {
                  "inputs": [
                    {
                      "name": "id",
                      "value": "[resourceId(parameters('virtualMachineResourceGroup'), 'Microsoft.Compute/virtualMachines', parameters('virtualMachineName'))]"
                    }
                  ],
                  "type": "Extension/Microsoft_Azure_Compute/PartType/VirtualMachinePart",
                  "asset": {
                    "idInputName": "id",
                    "type": "VirtualMachine"
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

Now that you've seen an example of using a parameterized template to deploy a dashboard, you can try deploying the template by using the [Azure Resource Manager REST APIs](/rest/api/), the [Azure CLI](quickstart-portal-dashboard-azure-cli.md), or [Azure PowerShell](quickstart-portal-dashboard-powershell.md).

## Next steps

- Learn more about the [structure of Azure dashboards](azure-portal-dashboards-structure.md).
- Learn how to [use markdown tiles on Azure dashboards to show custom content](azure-portal-markdown-tile.md).
- Learn how to [manage access for shared dashboards](azure-portal-dashboard-share-access.md).
- Learn how to [manage Azure portal settings and preferences](set-preferences.md).
