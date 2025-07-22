---
title: "Azure Operator Nexus - Example of cluster.parameters.jsonc template file"
description: Example of an eight rack Cluster parameter file to use with ARM template in creating a Cluster.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/21/2025
ms.custom: template-how-to, devx-track-arm-template
---

# Example of cluster.parameter.jsonc template file.

```cluster.parameter.jsonc
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "CLUSTER_NAME"
    },
    "resourceGroupName": {
      "value": "CLUSTER_RG"
    },
    "managedResourceGroupName": {
      "value": "CLUSTER_MRG"
    },
    "analyticsWorkspaceId": {
      "value": "CLUSTER_LAW_ID"
    },
    "assignedIdentity": {
      "value": "CLUSTER_UAMI_ID"
    },
    "vaultUri": {
      "value": "CLUSTER_KV_URI"
    },
    "containerUrl": {
      "value": "CLUSTER_STORAGE_ACCOUNT_BLOB_CONTAINER_URL"
    },
    "networkFabricId": {
      "value": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/Microsoft.ManagedNetworkFabric/networkFabrics/NF_NAME"
    },
    "clusterType": {
      "value": "MultiRack"
    },
    "clusterVersion": {
      "value": "CLUSTER_VER"
    },
    "clusterLocation": {
      "value": "CLUSTER_LOC"
    },
    "customLocation": {
      "value": "/subscriptions/SUBSCRIPTION_ID/resourcegroups/CM_MRG/providers/microsoft.extendedlocation/customlocations/CM_NAME-cl"
    },
    "aggregatorOrSingleRack": {
      "value": {
        "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-aggrack",
        "rackLocation": "STORAGE_RACK_LOC",
        "rackSerialNumber": "STORAGE_RACK",
        "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/AGGR_SKU",
        "storageApplianceConfigurationData": [
          {
            "rackSlot": 1,
            "adminCredentials": {
              "username": "${STORAGE_USER}",
              "password": "${STORAGE_PASSWORD}"
            },
            "storageApplianceName": "STORAGE_RACK_HOSTNAME",
            "serialNumber": "STORAGE_RACK_SN"
          }
        ],
        "bareMetalMachineConfigurationData": []
      }
    },
    "computeRacks": {
      "value": [
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack1",
          "rackLocation": "CR1_LOCATION",
          "rackSerialNumber": "CR1_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1M2_IDRAC_MAC",
              "bootMacAddress": "CR1M2_PXE_MAC",
              "machineDetails": "CR1M2_MODEL",
              "machineName": "CR1M2_HOSTNAME",
              "serialNumber": "CR1M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1M1_IDRAC_MAC",
              "bootMacAddress": "CR1M1_PXE_MAC",
              "machineDetails": "CR1M1_MODEL",
              "machineName": "CR1M1_HOSTNAME",
              "serialNumber": "CR1M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C16_IDRAC_MAC",
              "bootMacAddress": "CR1C16_PXE_MAC",
              "machineDetails": "CR1C16_MODEL",
              "machineName": "CR1C16_HOSTNAME",
              "serialNumber": "CR1C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C15_IDRAC_MAC",
              "bootMacAddress": "CR1C15_PXE_MAC",
              "machineDetails": "CR1C15_MODEL",
              "machineName": "CR1C15_HOSTNAME",
              "serialNumber": "CR1C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C14_IDRAC_MAC",
              "bootMacAddress": "CR1C14_PXE_MAC",
              "machineDetails": "CR1C14_MODEL",
              "machineName": "CR1C14_HOSTNAME",
              "serialNumber": "CR1C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C13_IDRAC_MAC",
              "bootMacAddress": "CR1C13_PXE_MAC",
              "machineDetails": "CR1C13_MODEL",
              "machineName": "CR1C13_HOSTNAME",
              "serialNumber": "CR1C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C12_IDRAC_MAC",
              "bootMacAddress": "CR1C12_PXE_MAC",
              "machineDetails": "CR1C12_MODEL",
              "machineName": "CR1C12_HOSTNAME",
              "serialNumber": "CR1C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C11_IDRAC_MAC",
              "bootMacAddress": "CR1C11_PXE_MAC",
              "machineDetails": "CR1C11_MODEL",
              "machineName": "CR1C11_HOSTNAME",
              "serialNumber": "CR1C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C10_IDRAC_MAC",
              "bootMacAddress": "CR1C10_PXE_MAC",
              "machineDetails": "CR1C10_MODEL",
              "machineName": "CR1C10_HOSTNAME",
              "serialNumber": "CR1C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C9_IDRAC_MAC",
              "bootMacAddress": "CR1C9_PXE_MAC",
              "machineDetails": "CR1C9_MODEL",
              "machineName": "CR1C9_HOSTNAME",
              "serialNumber": "CR1C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C8_IDRAC_MAC",
              "bootMacAddress": "CR1C8_PXE_MAC",
              "machineDetails": "CR1C8_MODEL",
              "machineName": "CR1C8_HOSTNAME",
              "serialNumber": "CR1C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C7_IDRAC_MAC",
              "bootMacAddress": "CR1C7_PXE_MAC",
              "machineDetails": "CR1C7_MODEL",
              "machineName": "CR1C7_HOSTNAME",
              "serialNumber": "CR1C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C6_IDRAC_MAC",
              "bootMacAddress": "CR1C6_PXE_MAC",
              "machineDetails": "CR1C6_MODEL",
              "machineName": "CR1C6_HOSTNAME",
              "serialNumber": "CR1C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C5_IDRAC_MAC",
              "bootMacAddress": "CR1C5_PXE_MAC",
              "machineDetails": "CR1C5_MODEL",
              "machineName": "CR1C5_HOSTNAME",
              "serialNumber": "CR1C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C4_IDRAC_MAC",
              "bootMacAddress": "CR1C4_PXE_MAC",
              "machineDetails": "CR1C4_MODEL",
              "machineName": "CR1C4_HOSTNAME",
              "serialNumber": "CR1C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C3_IDRAC_MAC",
              "bootMacAddress": "CR1C3_PXE_MAC",
              "machineDetails": "CR1C3_MODEL",
              "machineName": "CR1C3_HOSTNAME",
              "serialNumber": "CR1C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C2_IDRAC_MAC",
              "bootMacAddress": "CR1C2_PXE_MAC",
              "machineDetails": "CR1C2_MODEL",
              "machineName": "CR1C2_HOSTNAME",
              "serialNumber": "CR1C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR1C1_IDRAC_MAC",
              "bootMacAddress": "CR1C1_PXE_MAC",
              "machineDetails": "CR1C1_MODEL",
              "machineName": "CR1C1_HOSTNAME",
              "serialNumber": "CR1C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack2",
          "rackLocation": "CR2_LOCATION",
          "rackSerialNumber": "CR2_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2M2_IDRAC_MAC",
              "bootMacAddress": "CR2M2_PXE_MAC",
              "machineDetails": "CR2M2_MODEL",
              "machineName": "CR2M2_HOSTNAME",
              "serialNumber": "CR2M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2M1_IDRAC_MAC",
              "bootMacAddress": "CR2M1_PXE_MAC",
              "machineDetails": "CR2M1_MODEL",
              "machineName": "CR2M1_HOSTNAME",
              "serialNumber": "CR2M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C16_IDRAC_MAC",
              "bootMacAddress": "CR2C16_PXE_MAC",
              "machineDetails": "CR2C16_MODEL",
              "machineName": "CR2C16_HOSTNAME",
              "serialNumber": "CR2C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C15_IDRAC_MAC",
              "bootMacAddress": "CR2C15_PXE_MAC",
              "machineDetails": "CR2C15_MODEL",
              "machineName": "CR2C15_HOSTNAME",
              "serialNumber": "CR2C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C14_IDRAC_MAC",
              "bootMacAddress": "CR2C14_PXE_MAC",
              "machineDetails": "CR2C14_MODEL",
              "machineName": "CR2C14_HOSTNAME",
              "serialNumber": "CR2C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C13_IDRAC_MAC",
              "bootMacAddress": "CR2C13_PXE_MAC",
              "machineDetails": "CR2C13_MODEL",
              "machineName": "CR2C13_HOSTNAME",
              "serialNumber": "CR2C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C12_IDRAC_MAC",
              "bootMacAddress": "CR2C12_PXE_MAC",
              "machineDetails": "CR2C12_MODEL",
              "machineName": "CR2C12_HOSTNAME",
              "serialNumber": "CR2C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C11_IDRAC_MAC",
              "bootMacAddress": "CR2C11_PXE_MAC",
              "machineDetails": "CR2C11_MODEL",
              "machineName": "CR2C11_HOSTNAME",
              "serialNumber": "CR2C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C10_IDRAC_MAC",
              "bootMacAddress": "CR2C10_PXE_MAC",
              "machineDetails": "CR2C10_MODEL",
              "machineName": "CR2C10_HOSTNAME",
              "serialNumber": "CR2C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C9_IDRAC_MAC",
              "bootMacAddress": "CR2C9_PXE_MAC",
              "machineDetails": "CR2C9_MODEL",
              "machineName": "CR2C9_HOSTNAME",
              "serialNumber": "CR2C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C8_IDRAC_MAC",
              "bootMacAddress": "CR2C8_PXE_MAC",
              "machineDetails": "CR2C8_MODEL",
              "machineName": "CR2C8_HOSTNAME",
              "serialNumber": "CR2C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C7_IDRAC_MAC",
              "bootMacAddress": "CR2C7_PXE_MAC",
              "machineDetails": "CR2C7_MODEL",
              "machineName": "CR2C7_HOSTNAME",
              "serialNumber": "CR2C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C6_IDRAC_MAC",
              "bootMacAddress": "CR2C6_PXE_MAC",
              "machineDetails": "CR2C6_MODEL",
              "machineName": "CR2C6_HOSTNAME",
              "serialNumber": "CR2C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C5_IDRAC_MAC",
              "bootMacAddress": "CR2C5_PXE_MAC",
              "machineDetails": "CR2C5_MODEL",
              "machineName": "CR2C5_HOSTNAME",
              "serialNumber": "CR2C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C4_IDRAC_MAC",
              "bootMacAddress": "CR2C4_PXE_MAC",
              "machineDetails": "CR2C4_MODEL",
              "machineName": "CR2C4_HOSTNAME",
              "serialNumber": "CR2C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C3_IDRAC_MAC",
              "bootMacAddress": "CR2C3_PXE_MAC",
              "machineDetails": "CR2C3_MODEL",
              "machineName": "CR2C3_HOSTNAME",
              "serialNumber": "CR2C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C2_IDRAC_MAC",
              "bootMacAddress": "CR2C2_PXE_MAC",
              "machineDetails": "CR2C2_MODEL",
              "machineName": "CR2C2_HOSTNAME",
              "serialNumber": "CR2C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR2C1_IDRAC_MAC",
              "bootMacAddress": "CR2C1_PXE_MAC",
              "machineDetails": "CR2C1_MODEL",
              "machineName": "CR2C1_HOSTNAME",
              "serialNumber": "CR2C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack3",
          "rackLocation": "CR3_LOCATION",
          "rackSerialNumber": "CR3_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3M2_IDRAC_MAC",
              "bootMacAddress": "CR3M2_PXE_MAC",
              "machineDetails": "CR3M2_MODEL",
              "machineName": "CR3M2_HOSTNAME",
              "serialNumber": "CR3M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3M1_IDRAC_MAC",
              "bootMacAddress": "CR3M1_PXE_MAC",
              "machineDetails": "CR3M1_MODEL",
              "machineName": "CR3M1_HOSTNAME",
              "serialNumber": "CR3M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C16_IDRAC_MAC",
              "bootMacAddress": "CR3C16_PXE_MAC",
              "machineDetails": "CR3C16_MODEL",
              "machineName": "CR3C16_HOSTNAME",
              "serialNumber": "CR3C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C15_IDRAC_MAC",
              "bootMacAddress": "CR3C15_PXE_MAC",
              "machineDetails": "CR3C15_MODEL",
              "machineName": "CR3C15_HOSTNAME",
              "serialNumber": "CR3C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C14_IDRAC_MAC",
              "bootMacAddress": "CR3C14_PXE_MAC",
              "machineDetails": "CR3C14_MODEL",
              "machineName": "CR3C14_HOSTNAME",
              "serialNumber": "CR3C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C13_IDRAC_MAC",
              "bootMacAddress": "CR3C13_PXE_MAC",
              "machineDetails": "CR3C13_MODEL",
              "machineName": "CR3C13_HOSTNAME",
              "serialNumber": "CR3C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C12_IDRAC_MAC",
              "bootMacAddress": "CR3C12_PXE_MAC",
              "machineDetails": "CR3C12_MODEL",
              "machineName": "CR3C12_HOSTNAME",
              "serialNumber": "CR3C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C11_IDRAC_MAC",
              "bootMacAddress": "CR3C11_PXE_MAC",
              "machineDetails": "CR3C11_MODEL",
              "machineName": "CR3C11_HOSTNAME",
              "serialNumber": "CR3C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C10_IDRAC_MAC",
              "bootMacAddress": "CR3C10_PXE_MAC",
              "machineDetails": "CR3C10_MODEL",
              "machineName": "CR3C10_HOSTNAME",
              "serialNumber": "CR3C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C9_IDRAC_MAC",
              "bootMacAddress": "CR3C9_PXE_MAC",
              "machineDetails": "CR3C9_MODEL",
              "machineName": "CR3C9_HOSTNAME",
              "serialNumber": "CR3C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C8_IDRAC_MAC",
              "bootMacAddress": "CR3C8_PXE_MAC",
              "machineDetails": "CR3C8_MODEL",
              "machineName": "CR3C8_HOSTNAME",
              "serialNumber": "CR3C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C7_IDRAC_MAC",
              "bootMacAddress": "CR3C7_PXE_MAC",
              "machineDetails": "CR3C7_MODEL",
              "machineName": "CR3C7_HOSTNAME",
              "serialNumber": "CR3C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C6_IDRAC_MAC",
              "bootMacAddress": "CR3C6_PXE_MAC",
              "machineDetails": "CR3C6_MODEL",
              "machineName": "CR3C6_HOSTNAME",
              "serialNumber": "CR3C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C5_IDRAC_MAC",
              "bootMacAddress": "CR3C5_PXE_MAC",
              "machineDetails": "CR3C5_MODEL",
              "machineName": "CR3C5_HOSTNAME",
              "serialNumber": "CR3C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C4_IDRAC_MAC",
              "bootMacAddress": "CR3C4_PXE_MAC",
              "machineDetails": "CR3C4_MODEL",
              "machineName": "CR3C4_HOSTNAME",
              "serialNumber": "CR3C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C3_IDRAC_MAC",
              "bootMacAddress": "CR3C3_PXE_MAC",
              "machineDetails": "CR3C3_MODEL",
              "machineName": "CR3C3_HOSTNAME",
              "serialNumber": "CR3C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C2_IDRAC_MAC",
              "bootMacAddress": "CR3C2_PXE_MAC",
              "machineDetails": "CR3C2_MODEL",
              "machineName": "CR3C2_HOSTNAME",
              "serialNumber": "CR3C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR3C1_IDRAC_MAC",
              "bootMacAddress": "CR3C1_PXE_MAC",
              "machineDetails": "CR3C1_MODEL",
              "machineName": "CR3C1_HOSTNAME",
              "serialNumber": "CR3C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack4",
          "rackLocation": "CR4_LOCATION",
          "rackSerialNumber": "CR4_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4M2_IDRAC_MAC",
              "bootMacAddress": "CR4M2_PXE_MAC",
              "machineDetails": "CR4M2_MODEL",
              "machineName": "CR4M2_HOSTNAME",
              "serialNumber": "CR4M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4M1_IDRAC_MAC",
              "bootMacAddress": "CR4M1_PXE_MAC",
              "machineDetails": "CR4M1_MODEL",
              "machineName": "CR4M1_HOSTNAME",
              "serialNumber": "CR4M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C16_IDRAC_MAC",
              "bootMacAddress": "CR4C16_PXE_MAC",
              "machineDetails": "CR4C16_MODEL",
              "machineName": "CR4C16_HOSTNAME",
              "serialNumber": "CR4C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C15_IDRAC_MAC",
              "bootMacAddress": "CR4C15_PXE_MAC",
              "machineDetails": "CR4C15_MODEL",
              "machineName": "CR4C15_HOSTNAME",
              "serialNumber": "CR4C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C14_IDRAC_MAC",
              "bootMacAddress": "CR4C14_PXE_MAC",
              "machineDetails": "CR4C14_MODEL",
              "machineName": "CR4C14_HOSTNAME",
              "serialNumber": "CR4C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C13_IDRAC_MAC",
              "bootMacAddress": "CR4C13_PXE_MAC",
              "machineDetails": "CR4C13_MODEL",
              "machineName": "CR4C13_HOSTNAME",
              "serialNumber": "CR4C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C12_IDRAC_MAC",
              "bootMacAddress": "CR4C12_PXE_MAC",
              "machineDetails": "CR4C12_MODEL",
              "machineName": "CR4C12_HOSTNAME",
              "serialNumber": "CR4C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C11_IDRAC_MAC",
              "bootMacAddress": "CR4C11_PXE_MAC",
              "machineDetails": "CR4C11_MODEL",
              "machineName": "CR4C11_HOSTNAME",
              "serialNumber": "CR4C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C10_IDRAC_MAC",
              "bootMacAddress": "CR4C10_PXE_MAC",
              "machineDetails": "CR4C10_MODEL",
              "machineName": "CR4C10_HOSTNAME",
              "serialNumber": "CR4C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C9_IDRAC_MAC",
              "bootMacAddress": "CR4C9_PXE_MAC",
              "machineDetails": "CR4C9_MODEL",
              "machineName": "CR4C9_HOSTNAME",
              "serialNumber": "CR4C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C8_IDRAC_MAC",
              "bootMacAddress": "CR4C8_PXE_MAC",
              "machineDetails": "CR4C8_MODEL",
              "machineName": "CR4C8_HOSTNAME",
              "serialNumber": "CR4C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C7_IDRAC_MAC",
              "bootMacAddress": "CR4C7_PXE_MAC",
              "machineDetails": "CR4C7_MODEL",
              "machineName": "CR4C7_HOSTNAME",
              "serialNumber": "CR4C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C6_IDRAC_MAC",
              "bootMacAddress": "CR4C6_PXE_MAC",
              "machineDetails": "CR4C6_MODEL",
              "machineName": "CR4C6_HOSTNAME",
              "serialNumber": "CR4C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C5_IDRAC_MAC",
              "bootMacAddress": "CR4C5_PXE_MAC",
              "machineDetails": "CR4C5_MODEL",
              "machineName": "CR4C5_HOSTNAME",
              "serialNumber": "CR4C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C4_IDRAC_MAC",
              "bootMacAddress": "CR4C4_PXE_MAC",
              "machineDetails": "CR4C4_MODEL",
              "machineName": "CR4C4_HOSTNAME",
              "serialNumber": "CR4C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C3_IDRAC_MAC",
              "bootMacAddress": "CR4C3_PXE_MAC",
              "machineDetails": "CR4C3_MODEL",
              "machineName": "CR4C3_HOSTNAME",
              "serialNumber": "CR4C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C2_IDRAC_MAC",
              "bootMacAddress": "CR4C2_PXE_MAC",
              "machineDetails": "CR4C2_MODEL",
              "machineName": "CR4C2_HOSTNAME",
              "serialNumber": "CR4C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR4C1_IDRAC_MAC",
              "bootMacAddress": "CR4C1_PXE_MAC",
              "machineDetails": "CR4C1_MODEL",
              "machineName": "CR4C1_HOSTNAME",
              "serialNumber": "CR4C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack5",
          "rackLocation": "CR5_LOCATION",
          "rackSerialNumber": "CR5_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5M2_IDRAC_MAC",
              "bootMacAddress": "CR5M2_PXE_MAC",
              "machineDetails": "CR5M2_MODEL",
              "machineName": "CR5M2_HOSTNAME",
              "serialNumber": "CR5M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5M1_IDRAC_MAC",
              "bootMacAddress": "CR5M1_PXE_MAC",
              "machineDetails": "CR5M1_MODEL",
              "machineName": "CR5M1_HOSTNAME",
              "serialNumber": "CR5M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C16_IDRAC_MAC",
              "bootMacAddress": "CR5C16_PXE_MAC",
              "machineDetails": "CR5C16_MODEL",
              "machineName": "CR5C16_HOSTNAME",
              "serialNumber": "CR5C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C15_IDRAC_MAC",
              "bootMacAddress": "CR5C15_PXE_MAC",
              "machineDetails": "CR5C15_MODEL",
              "machineName": "CR5C15_HOSTNAME",
              "serialNumber": "CR5C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C14_IDRAC_MAC",
              "bootMacAddress": "CR5C14_PXE_MAC",
              "machineDetails": "CR5C14_MODEL",
              "machineName": "CR5C14_HOSTNAME",
              "serialNumber": "CR5C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C13_IDRAC_MAC",
              "bootMacAddress": "CR5C13_PXE_MAC",
              "machineDetails": "CR5C13_MODEL",
              "machineName": "CR5C13_HOSTNAME",
              "serialNumber": "CR5C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C12_IDRAC_MAC",
              "bootMacAddress": "CR5C12_PXE_MAC",
              "machineDetails": "CR5C12_MODEL",
              "machineName": "CR5C12_HOSTNAME",
              "serialNumber": "CR5C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C11_IDRAC_MAC",
              "bootMacAddress": "CR5C11_PXE_MAC",
              "machineDetails": "CR5C11_MODEL",
              "machineName": "CR5C11_HOSTNAME",
              "serialNumber": "CR5C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C10_IDRAC_MAC",
              "bootMacAddress": "CR5C10_PXE_MAC",
              "machineDetails": "CR5C10_MODEL",
              "machineName": "CR5C10_HOSTNAME",
              "serialNumber": "CR5C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C9_IDRAC_MAC",
              "bootMacAddress": "CR5C9_PXE_MAC",
              "machineDetails": "CR5C9_MODEL",
              "machineName": "CR5C9_HOSTNAME",
              "serialNumber": "CR5C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C8_IDRAC_MAC",
              "bootMacAddress": "CR5C8_PXE_MAC",
              "machineDetails": "CR5C8_MODEL",
              "machineName": "CR5C8_HOSTNAME",
              "serialNumber": "CR5C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C7_IDRAC_MAC",
              "bootMacAddress": "CR5C7_PXE_MAC",
              "machineDetails": "CR5C7_MODEL",
              "machineName": "CR5C7_HOSTNAME",
              "serialNumber": "CR5C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C6_IDRAC_MAC",
              "bootMacAddress": "CR5C6_PXE_MAC",
              "machineDetails": "CR5C6_MODEL",
              "machineName": "CR5C6_HOSTNAME",
              "serialNumber": "CR5C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C5_IDRAC_MAC",
              "bootMacAddress": "CR5C5_PXE_MAC",
              "machineDetails": "CR5C5_MODEL",
              "machineName": "CR5C5_HOSTNAME",
              "serialNumber": "CR5C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C4_IDRAC_MAC",
              "bootMacAddress": "CR5C4_PXE_MAC",
              "machineDetails": "CR5C4_MODEL",
              "machineName": "CR5C4_HOSTNAME",
              "serialNumber": "CR5C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C3_IDRAC_MAC",
              "bootMacAddress": "CR5C3_PXE_MAC",
              "machineDetails": "CR5C3_MODEL",
              "machineName": "CR5C3_HOSTNAME",
              "serialNumber": "CR5C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C2_IDRAC_MAC",
              "bootMacAddress": "CR5C2_PXE_MAC",
              "machineDetails": "CR5C2_MODEL",
              "machineName": "CR5C2_HOSTNAME",
              "serialNumber": "CR5C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR5C1_IDRAC_MAC",
              "bootMacAddress": "CR5C1_PXE_MAC",
              "machineDetails": "CR5C1_MODEL",
              "machineName": "CR5C1_HOSTNAME",
              "serialNumber": "CR5C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack6",
          "rackLocation": "CR6_LOCATION",
          "rackSerialNumber": "CR6_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6M2_IDRAC_MAC",
              "bootMacAddress": "CR6M2_PXE_MAC",
              "machineDetails": "CR6M2_MODEL",
              "machineName": "CR6M2_HOSTNAME",
              "serialNumber": "CR6M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6M1_IDRAC_MAC",
              "bootMacAddress": "CR6M1_PXE_MAC",
              "machineDetails": "CR6M1_MODEL",
              "machineName": "CR6M1_HOSTNAME",
              "serialNumber": "CR6M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C16_IDRAC_MAC",
              "bootMacAddress": "CR6C16_PXE_MAC",
              "machineDetails": "CR6C16_MODEL",
              "machineName": "CR6C16_HOSTNAME",
              "serialNumber": "CR6C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C15_IDRAC_MAC",
              "bootMacAddress": "CR6C15_PXE_MAC",
              "machineDetails": "CR6C15_MODEL",
              "machineName": "CR6C15_HOSTNAME",
              "serialNumber": "CR6C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C14_IDRAC_MAC",
              "bootMacAddress": "CR6C14_PXE_MAC",
              "machineDetails": "CR6C14_MODEL",
              "machineName": "CR6C14_HOSTNAME",
              "serialNumber": "CR6C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C13_IDRAC_MAC",
              "bootMacAddress": "CR6C13_PXE_MAC",
              "machineDetails": "CR6C13_MODEL",
              "machineName": "CR6C13_HOSTNAME",
              "serialNumber": "CR6C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C12_IDRAC_MAC",
              "bootMacAddress": "CR6C12_PXE_MAC",
              "machineDetails": "CR6C12_MODEL",
              "machineName": "CR6C12_HOSTNAME",
              "serialNumber": "CR6C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C11_IDRAC_MAC",
              "bootMacAddress": "CR6C11_PXE_MAC",
              "machineDetails": "CR6C11_MODEL",
              "machineName": "CR6C11_HOSTNAME",
              "serialNumber": "CR6C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C10_IDRAC_MAC",
              "bootMacAddress": "CR6C10_PXE_MAC",
              "machineDetails": "CR6C10_MODEL",
              "machineName": "CR6C10_HOSTNAME",
              "serialNumber": "CR6C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C9_IDRAC_MAC",
              "bootMacAddress": "CR6C9_PXE_MAC",
              "machineDetails": "CR6C9_MODEL",
              "machineName": "CR6C9_HOSTNAME",
              "serialNumber": "CR6C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C8_IDRAC_MAC",
              "bootMacAddress": "CR6C8_PXE_MAC",
              "machineDetails": "CR6C8_MODEL",
              "machineName": "CR6C8_HOSTNAME",
              "serialNumber": "CR6C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C7_IDRAC_MAC",
              "bootMacAddress": "CR6C7_PXE_MAC",
              "machineDetails": "CR6C7_MODEL",
              "machineName": "CR6C7_HOSTNAME",
              "serialNumber": "CR6C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C6_IDRAC_MAC",
              "bootMacAddress": "CR6C6_PXE_MAC",
              "machineDetails": "CR6C6_MODEL",
              "machineName": "CR6C6_HOSTNAME",
              "serialNumber": "CR6C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C5_IDRAC_MAC",
              "bootMacAddress": "CR6C5_PXE_MAC",
              "machineDetails": "CR6C5_MODEL",
              "machineName": "CR6C5_HOSTNAME",
              "serialNumber": "CR6C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C4_IDRAC_MAC",
              "bootMacAddress": "CR6C4_PXE_MAC",
              "machineDetails": "CR6C4_MODEL",
              "machineName": "CR6C4_HOSTNAME",
              "serialNumber": "CR6C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C3_IDRAC_MAC",
              "bootMacAddress": "CR6C3_PXE_MAC",
              "machineDetails": "CR6C3_MODEL",
              "machineName": "CR6C3_HOSTNAME",
              "serialNumber": "CR6C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C2_IDRAC_MAC",
              "bootMacAddress": "CR6C2_PXE_MAC",
              "machineDetails": "CR6C2_MODEL",
              "machineName": "CR6C2_HOSTNAME",
              "serialNumber": "CR6C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR6C1_IDRAC_MAC",
              "bootMacAddress": "CR6C1_PXE_MAC",
              "machineDetails": "CR6C1_MODEL",
              "machineName": "CR6C1_HOSTNAME",
              "serialNumber": "CR6C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack7",
          "rackLocation": "CR7_LOCATION",
          "rackSerialNumber": "CR7_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7M2_IDRAC_MAC",
              "bootMacAddress": "CR7M2_PXE_MAC",
              "machineDetails": "CR7M2_MODEL",
              "machineName": "CR7M2_HOSTNAME",
              "serialNumber": "CR7M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7M1_IDRAC_MAC",
              "bootMacAddress": "CR7M1_PXE_MAC",
              "machineDetails": "CR7M1_MODEL",
              "machineName": "CR7M1_HOSTNAME",
              "serialNumber": "CR7M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C16_IDRAC_MAC",
              "bootMacAddress": "CR7C16_PXE_MAC",
              "machineDetails": "CR7C16_MODEL",
              "machineName": "CR7C16_HOSTNAME",
              "serialNumber": "CR7C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C15_IDRAC_MAC",
              "bootMacAddress": "CR7C15_PXE_MAC",
              "machineDetails": "CR7C15_MODEL",
              "machineName": "CR7C15_HOSTNAME",
              "serialNumber": "CR7C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C14_IDRAC_MAC",
              "bootMacAddress": "CR7C14_PXE_MAC",
              "machineDetails": "CR7C14_MODEL",
              "machineName": "CR7C14_HOSTNAME",
              "serialNumber": "CR7C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C13_IDRAC_MAC",
              "bootMacAddress": "CR7C13_PXE_MAC",
              "machineDetails": "CR7C13_MODEL",
              "machineName": "CR7C13_HOSTNAME",
              "serialNumber": "CR7C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C12_IDRAC_MAC",
              "bootMacAddress": "CR7C12_PXE_MAC",
              "machineDetails": "CR7C12_MODEL",
              "machineName": "CR7C12_HOSTNAME",
              "serialNumber": "CR7C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C11_IDRAC_MAC",
              "bootMacAddress": "CR7C11_PXE_MAC",
              "machineDetails": "CR7C11_MODEL",
              "machineName": "CR7C11_HOSTNAME",
              "serialNumber": "CR7C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C10_IDRAC_MAC",
              "bootMacAddress": "CR7C10_PXE_MAC",
              "machineDetails": "CR7C10_MODEL",
              "machineName": "CR7C10_HOSTNAME",
              "serialNumber": "CR7C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C9_IDRAC_MAC",
              "bootMacAddress": "CR7C9_PXE_MAC",
              "machineDetails": "CR7C9_MODEL",
              "machineName": "CR7C9_HOSTNAME",
              "serialNumber": "CR7C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C8_IDRAC_MAC",
              "bootMacAddress": "CR7C8_PXE_MAC",
              "machineDetails": "CR7C8_MODEL",
              "machineName": "CR7C8_HOSTNAME",
              "serialNumber": "CR7C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C7_IDRAC_MAC",
              "bootMacAddress": "CR7C7_PXE_MAC",
              "machineDetails": "CR7C7_MODEL",
              "machineName": "CR7C7_HOSTNAME",
              "serialNumber": "CR7C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C6_IDRAC_MAC",
              "bootMacAddress": "CR7C6_PXE_MAC",
              "machineDetails": "CR7C6_MODEL",
              "machineName": "CR7C6_HOSTNAME",
              "serialNumber": "CR7C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C5_IDRAC_MAC",
              "bootMacAddress": "CR7C5_PXE_MAC",
              "machineDetails": "CR7C5_MODEL",
              "machineName": "CR7C5_HOSTNAME",
              "serialNumber": "CR7C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C4_IDRAC_MAC",
              "bootMacAddress": "CR7C4_PXE_MAC",
              "machineDetails": "CR7C4_MODEL",
              "machineName": "CR7C4_HOSTNAME",
              "serialNumber": "CR7C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C3_IDRAC_MAC",
              "bootMacAddress": "CR7C3_PXE_MAC",
              "machineDetails": "CR7C3_MODEL",
              "machineName": "CR7C3_HOSTNAME",
              "serialNumber": "CR7C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C2_IDRAC_MAC",
              "bootMacAddress": "CR7C2_PXE_MAC",
              "machineDetails": "CR7C2_MODEL",
              "machineName": "CR7C2_HOSTNAME",
              "serialNumber": "CR7C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR7C1_IDRAC_MAC",
              "bootMacAddress": "CR7C1_PXE_MAC",
              "machineDetails": "CR7C1_MODEL",
              "machineName": "CR7C1_HOSTNAME",
              "serialNumber": "CR7C1_SN"
            }
          ]
        },
        {
          "networkRackId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/NF_RG/providers/microsoft.managednetworkfabric/networkracks/NF_NAME-comprack8",
          "rackLocation": "CR8_LOCATION",
          "rackSerialNumber": "CR8_NAME",
          "rackSkuId": "/subscriptions/SUBSCRIPTION_ID/providers/Microsoft.NetworkCloud/rackSkus/CR_SKU",
          "storageApplianceConfigurationData": [],
          "bareMetalMachineConfigurationData": [
            {
              "rackSlot": 18,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8M2_IDRAC_MAC",
              "bootMacAddress": "CR8M2_PXE_MAC",
              "machineDetails": "CR8M2_MODEL",
              "machineName": "CR8M2_HOSTNAME",
              "serialNumber": "CR8M2_SN"
            },
            {
              "rackSlot": 17,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8M1_IDRAC_MAC",
              "bootMacAddress": "CR8M1_PXE_MAC",
              "machineDetails": "CR8M1_MODEL",
              "machineName": "CR8M1_HOSTNAME",
              "serialNumber": "CR8M1_SN"
            },
            {
              "rackSlot": 16,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C16_IDRAC_MAC",
              "bootMacAddress": "CR8C16_PXE_MAC",
              "machineDetails": "CR8C16_MODEL",
              "machineName": "CR8C16_HOSTNAME",
              "serialNumber": "CR8C16_SN"
            },
            {
              "rackSlot": 15,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C15_IDRAC_MAC",
              "bootMacAddress": "CR8C15_PXE_MAC",
              "machineDetails": "CR8C15_MODEL",
              "machineName": "CR8C15_HOSTNAME",
              "serialNumber": "CR8C15_SN"
            },
            {
              "rackSlot": 14,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C14_IDRAC_MAC",
              "bootMacAddress": "CR8C14_PXE_MAC",
              "machineDetails": "CR8C14_MODEL",
              "machineName": "CR8C14_HOSTNAME",
              "serialNumber": "CR8C14_SN"
            },
            {
              "rackSlot": 13,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C13_IDRAC_MAC",
              "bootMacAddress": "CR8C13_PXE_MAC",
              "machineDetails": "CR8C13_MODEL",
              "machineName": "CR8C13_HOSTNAME",
              "serialNumber": "CR8C13_SN"
            },
            {
              "rackSlot": 12,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C12_IDRAC_MAC",
              "bootMacAddress": "CR8C12_PXE_MAC",
              "machineDetails": "CR8C12_MODEL",
              "machineName": "CR8C12_HOSTNAME",
              "serialNumber": "CR8C12_SN"
            },
            {
              "rackSlot": 11,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C11_IDRAC_MAC",
              "bootMacAddress": "CR8C11_PXE_MAC",
              "machineDetails": "CR8C11_MODEL",
              "machineName": "CR8C11_HOSTNAME",
              "serialNumber": "CR8C11_SN"
            },
            {
              "rackSlot": 10,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C10_IDRAC_MAC",
              "bootMacAddress": "CR8C10_PXE_MAC",
              "machineDetails": "CR8C10_MODEL",
              "machineName": "CR8C10_HOSTNAME",
              "serialNumber": "CR8C10_SN"
            },
            {
              "rackSlot": 9,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C9_IDRAC_MAC",
              "bootMacAddress": "CR8C9_PXE_MAC",
              "machineDetails": "CR8C9_MODEL",
              "machineName": "CR8C9_HOSTNAME",
              "serialNumber": "CR8C9_SN"
            },
            {
              "rackSlot": 8,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C8_IDRAC_MAC",
              "bootMacAddress": "CR8C8_PXE_MAC",
              "machineDetails": "CR8C8_MODEL",
              "machineName": "CR8C8_HOSTNAME",
              "serialNumber": "CR8C8_SN"
            },
            {
              "rackSlot": 7,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C7_IDRAC_MAC",
              "bootMacAddress": "CR8C7_PXE_MAC",
              "machineDetails": "CR8C7_MODEL",
              "machineName": "CR8C7_HOSTNAME",
              "serialNumber": "CR8C7_SN"
            },
            {
              "rackSlot": 6,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C6_IDRAC_MAC",
              "bootMacAddress": "CR8C6_PXE_MAC",
              "machineDetails": "CR8C6_MODEL",
              "machineName": "CR8C6_HOSTNAME",
              "serialNumber": "CR8C6_SN"
            },
            {
              "rackSlot": 5,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C5_IDRAC_MAC",
              "bootMacAddress": "CR8C5_PXE_MAC",
              "machineDetails": "CR8C5_MODEL",
              "machineName": "CR8C5_HOSTNAME",
              "serialNumber": "CR8C5_SN"
            },
            {
              "rackSlot": 4,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C4_IDRAC_MAC",
              "bootMacAddress": "CR8C4_PXE_MAC",
              "machineDetails": "CR8C4_MODEL",
              "machineName": "CR8C4_HOSTNAME",
              "serialNumber": "CR8C4_SN"
            },
            {
              "rackSlot": 3,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C3_IDRAC_MAC",
              "bootMacAddress": "CR8C3_PXE_MAC",
              "machineDetails": "CR8C3_MODEL",
              "machineName": "CR8C3_HOSTNAME",
              "serialNumber": "CR8C3_SN"
            },
            {
              "rackSlot": 2,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C2_IDRAC_MAC",
              "bootMacAddress": "CR8C2_PXE_MAC",
              "machineDetails": "CR8C2_MODEL",
              "machineName": "CR8C2_HOSTNAME",
              "serialNumber": "CR8C2_SN"
            },
            {
              "rackSlot": 1,
              "bmcCredentials": {
                "username": "${BMC_USER}",
                "password": "${BMC_PASSWORD}"
              },
              "bmcMacAddress": "CR8C1_IDRAC_MAC",
              "bootMacAddress": "CR8C1_PXE_MAC",
              "machineDetails": "CR8C1_MODEL",
              "machineName": "CR8C1_HOSTNAME",
              "serialNumber": "CR8C1_SN"
            }
          ]
        }
      ]
    },
    "environment": {
      "value": "CLUSTER_NAME"
    },
    "location": {
      "value": "REGION"
    }
  }
```
