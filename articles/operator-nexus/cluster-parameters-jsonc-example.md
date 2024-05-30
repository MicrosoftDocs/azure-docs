---
title: "Azure Operator Nexus - Example of cluster.parameters.jsonc template file"
description: Example of an 8 rack cluster parameter file to use with ARM template in creating a cluster.
author: jeffreymason
ms.author: jeffreymason
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/08/2024
ms.custom: template-how-to
---


# Example of cluster.parameter.jsonc template file.

```cluster.parameter.jsonc

{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "$CLUSTER_NAME"
    },
    "resourceGroupName": {
      "value": "$CLUSTER_RG"
    },
    "managedResourceGroupName": {
      "value": "$MRG_NAME"
    },
    "clusterLawName": {
      "value": "$LAW_NAME"
    },
    "networkFabricId": {
      "value": "$NF_ID"
    },
    "clusterType": {
      "value": "$CLUSTER_TYPE"
    },
    "skipHardwareValidation": {
      "value": "false"
    },
    "clusterVersion": {
      "value": "$CLUSTER_VERSION"
    },
    "clusterLocation": {
      "value": "$CLUSTER_LOCATION"
    },
    "customLocation": {
      "value": "$CL_NAME"
    },
    "secretArchive": {
      "value": "$KV_RESOURCE_ID"
    },
    "sshKeyUrl": {
      "value": "https://"
    },
    "aggregatorOrSingleRack": {
      "value": {
        "networkRackId": "$AGGR_RACK_RESOURCE_ID",
        "rackLocation": "$AGGR_RACK_LOCATION",
        "rackSerialNumber": "$AGGR_RACK_SN",
        "rackSkuId": "$AGGR_RACK_SKU": [
          {
            "rackSlot": 1,
            "adminCredentials": {
              "username": "$COMPX_SVRY_BMC_USER",
              "password": "$COMPX_SVRY_BMC_PASS"
            },
            "storageApplianceName": "$SA_NAME",
            "serialNumber": "$SA_SN"
          }
        ],
        "bareMetalMachineConfigurationData": []
      }
    },
    "computeRacks": {
      "value": [
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        },
        {
          "networkRackId": "$AGGR_RACK_RESOURCE_ID",
          "rackLocation": "$AGGR_RACK_LOCATION",
          "rackSerialNumber": "$AGGR_RACK_SN",
          "rackSkuId": "$AGGR_RACK_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "$COMPX_SVRY_BMC_USER",
                "password": "$COMPX_SVRY_BMC_PASS"
              },
              "bmcMacAddress": "$COMPX_SVRY_BMC_MAC",
              "bootMacAddress": "$COMPX_SVRY_BOOT_MAC",
              "machineDetails": "$COMPX_SVRY_SERVER_DETAILS",
              "machineName": "$COMPX_SVRY_SERVER_NAME",
              "serialNumber": "$COMPX_RACK_SN"
            }
          ]
        }
      ]
    },
    "clusterServicePrincipal": {
      "value": {
        "tenantId": "$TENANT_ID",
        "applicationId": "$SP_APP_ID",
        "principalId": "$SP_ID",
        "password": "$SP_PASS"
      }
    },
    "environment": {
      "value": "$CLUSTER_NAME"
    },
    "location": {
      "value": "$LOCATION"
    }
  }
}
```
