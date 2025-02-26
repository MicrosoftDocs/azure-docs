---
title: Validate Cables for Nexus Network Fabric
description: Learn how to perform cable validation for Nexus Network Fabric infrastructure management using diagnostic APIs.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 04/15/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---
# Validate Cables for Nexus Network Fabric

This article explains the  Fabric cable validation, where the primary function of the diagnostic API is to check all fabric devices for potential cabling issues. The Diagnostic API assesses whether the interconnected devices adhere to the Bill of Materials (BOM) and according to the resource Stock Keeping Units (SKUs), classifying them as compliant or noncompliant. Device types include Customer Edge (CE), Top of Rack (TOR), Management (MGMT), and Network Packet Broker (NPB) devices. The results are presented in a JSON format, encompassing details such as validation status, errors, identifier type, and neighbor device ID. These results are stored in a customer-provided Storage account. It's vital to the overall deployment that errors identified in this report are resolved before moving onto the Cluster deployment step.

For BOM details, refer to [Azure Operator Nexus SKUs](./reference-operator-nexus-skus.md)

## Prerequisites

- Ensure the Nexus Network Fabric is successfully provisioned.
- Provide the Network Fabric ID and storage URL with WRITE access via a support ticket.
- The storage account has these prerequisites:
  - The storage account must be in a different Azure region than the Network Fabric Azure region.
  - `Storage Blob Data Contributor` role must be assigned to the `Nexus Network Fabric RP` with access assigned to the storage account.
- Microsoft Support must patch the Nexus Network Fabric with an active storage SAS URL before running cabling validation.

## Creating an Azure Support Request for Patching Nexus Network Fabric:
  - Refer to [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
  - Enter `Nexus Network Fabric` for the issue and click `Go`.
  - Select `Azure Operator Nexus` as the service you're having issue with.
  - Select `Subscription` where the resource is located.
  - Select `General` under the resource field and click `Next`.
  - Select `Network fabric instance provisioning` under the issue prompt and click `Next`.
  - Now select `Create a support request` at the top of the support blade.
  - Click `Next` on the `Problem description` tab.
  - Wait for the `Recommended solution` and then click the link back to 'Return to support request`
  - Click `Next` on the `Problem description` tab again to continue to `Additional details`
  - Fill in the required request details to patch Nexus Network Fabric and then click `Next`
  - Review the information in the `Review + create` tab and then click `Create`.

> [!NOTE]
> The Storage URL (SAS) is short-lived. By default, it is set to expire in eight hours. If the SAS URL expires, then the fabric must be re-patched.

## Generate the storage URL

To create a container in the storage account, refer to [Create a container](../storage/blobs/blob-containers-portal.md#create-a-container)

> [!NOTE]
> Enter the name of the container using only lowercase letters.

To generate a SAS URL for the container to provide write access to the Nexus Fabric, refer to [Generate a shared access signature](../storage/blobs/blob-containers-portal.md#generate-a-shared-access-signature)

> [!NOTE]
> SAS URLs are short lived. By default, it is set to expire in eight hours. If the SAS URL expires, then you must open a Microsoft support ticket to add a new URL.

## Validate Cabling

1. Execute the following Azure CLI command:

    ```azurecli
    az networkfabric fabric validate-configuration –resource-group "<NFResourceGroupName>" --resource-name "<NFResourceName>" --validate-action "Cabling" --no-wait --debug  
    ```

    The following (truncated) output appears. Copy the URL from the `Azure-AsyncOperation` section of the debug output. This portion of the URL is used in the following step to check the status of the operation.

    ```azurecli
    cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<Azure-AsyncOperation-endpoint url>'
    ```

    The following error indicates the Fabric isn't patched with a valid SAS URL:
    ```azurecli
    azure.core.exceptions.HttpResponseError: Operation returned an invalid status 'OK'
    ```

1. You can programmatically check the status of the operation by running the following command:

    ```azurecli
    az rest -m get -u "<Azure-AsyncOperation-endpoint url>" 
    {
      "endTime": "<OPERATION_COMPLETION_TIME>",
      "id": "<OPERATION_ID>",
      "name": "OPERATION_NAME",
      "properties": {
        "url": "CABLING_REPORT_STORAGE_URL"
      },
      "resourceId": "<FABRIC_RID>",
      "startTime": "<OPERATION_START_TIME>",
      "status": "Succeeded"
    }
    ```

    The operation status indicates if the API succeeded or failed.

    > [!NOTE]
    > The operation takes roughly 20~40 minutes to complete based on the number of racks.  

1. Download and read the validated results from the `<CABLING_REPORT_STORAGE_URL>` returned from the completed command.

Example output is shown in the following sections.

### Customer Edge (CE) to Provider Edge (PE) validation output example

```azurecli
networkFabricInfoSkuId": "M8-A400-A100-C16-ab", 
  "racks": [ 
    { 
      "rackId": "AR-SKU-10005", 
      "networkFabricResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.managedNetworkFabric/networkFabrics/NFName", 
      "rackInfo": { 
        "networkConfiguration": { 
          "configurationState": "Succeeded", 
          "networkDevices": [ 
            { 
              "name": "AR-CE1", 
              "deviceSourceResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/NFName-AggrRack", 
              "roleName": "CE1", 
              "deviceSku": "DCS-XXXXXXXXX-36", 
              "deviceSN": "XXXXXXXXXXX", 
              "fixedInterfaceMaps": [ 
                { 
                  "name": "Ethernet1/1", 
                  "description": "AR-CE1:Et1/1 to PE1:EtXX", 
                  "deviceConnectionDescription": "SourceHostName:Ethernet1/1 to DestinationHostName:Ethernet", 
                  "sourceHostname": "SourceHostName", 
                  "sourcePort": "Ethernet1/1", 
                  "destinationHostname": "DestinationHostName", 
                  "destinationPort": "Ethernet", 
                  "identifier": "Ethernet1", 
                  "interfaceType": "Ethernet", 
                  "deviceDestinationResourceId": null, 
                  "speed in Gbps": "400", 
                  "cableSpecification": { 
                    "transceiverType": "400GBASE-FR4", 
                    "transceiverSN": "XKT220900XXX", 
                    "cableSubType": "AOC", 
                    "modelType": "AOC-D-D-400G-10M", 
                    "mediaType": "Straight" 
                  }, 
                  "validationResult": [ 
                    { 
                      "validationType": "CableValidation", 
                      "status": "Compliant", 
                      "validationDetails": { 
                        "deviceConfiguration": "Device Configuration detail", 
                        "error": null, 
                        "reason": null 
                      } 
                    }, 
                    { 
                      "validationType": "CableSpecificationValidation", 
                      "status": "Compliant", 
                      "validationDetails": { 
                        "deviceConfiguration": "Speed: 400 ; MediaType : Straight", 
                        "error": "null", 
                        "reason": null 
                      } 
                    } 
                  ] 
                },
```

### Customer Edge to Top Of Rack (TOR) switch validation

```azurecli
{ 
                      "name": "Ethernet11/1", 
                      "description": "AR-CE2:Et11/1 to CR1-TOR1:Et24", 
                      "deviceConnectionDescription": " SourceHostName:Ethernet11/1 to DestinationHostName:Ethernet24", 
                      "sourceHostname": "SourceHostName", 
                      "sourcePort": "Ethernet11/1", 
                      "destinationHostname": "DestinationHostName ", 
                      "destinationPort": "24", 
                      "identifier": "Ethernet11", 
                      "interfaceType": "Ethernet", 
                      "deviceDestinationResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/ NFName-CompRack", 
                      "speed in Gbps": "400", 
                      "cableSpecification": { 
                        "transceiverType": "400GBASE-AR8", 
                        "transceiverSN": "XYL221911XXX", 
                        "cableSubType": "AOC", 
                        "modelType": "AOC-D-D-400G-10M", 
                        "mediaType": "Straight" 
                      }, 
                      "validationResult": [ 
                        { 
                          "validationType": "CableValidation", 
                          "status": "Compliant", 
                          "validationDetails": { 
                            "deviceConfiguration": "Device Configuration detail", 
                            "error": null, 
                            "reason": null 
                          } 
                        }, 
                        { 
                          "validationType": "CableSpecificationValidation", 
                          "status": "Compliant", 
                          "validationDetails": { 
                            "deviceConfiguration": "Speed: 400 ; MediaType : Straight", 
                            "error": "", 
                            "reason": null 
                          } 
                        } 
                      ]
```

#### Statuses of validation

|Status Type  |Definition  |
|---------|---------|
|Compliant     | Validation status is compliant with the BOM specification for the interface. |
|NonCompliant     | Validation isn't compliant with the BOM specification for the interface.        |
|Unknown     | Validation is unable to retrieve interface connection details or lldp data isn't returned. The `Unknown` status is returned if the destination device is powered off, missing, disconnected, or unsupported for this interface type. |

#### Validation attributes

|Attribute  |Definition  |
|---------|---------|
|`deviceConfiguration`      | Configuration that's available on the device. |
|`error`      |  Error from the device. |
|`reason`      |  This field is populated when the status of the device is unknown.        |
|`validationType`      | This parameter indicates what type of validation. (cable & cable specification validations). |
|`deviceDestinationResourceId`      |  Azure Resource Manager ID of the connected Neighbor (destination device). |
|`roleName`      |  The role of the Network Fabric Device (CE or TOR). |

### Known issues and limitations in cable validation

- Cable Validation of connections between TOR and Compute Servers that are powered off or unprovisioned in the Nexus cluster aren't supported. These interfaces show `Unknown` status in the report.
- Cable Validation of connections between MGMT interfaces and Compute Servers that are powered off or unprovisioned in the Nexus cluster or the Compute Server Controllers aren't supported. These interfaces show `Unknown` status in the report.
- Cable Validation for NPB isn't supported for `loopback` and `nni-direct` interfaces because there's no vendor support currently for `show lldp neighbors`. These interfaces show `Unknown` status in the report.
- The Storage URL must be in a different region from the Network Fabric. For instance, if the Fabric is hosted in East US, the storage URL should be outside of East US.
- Cable validation supports four racks with 16 Computes per rack and eight racks with 16 Computes per rack BOMs.
- When destination device is powered off, cables are missing or disconnected, or if validation isn't supported for the interface type, then the interface shows `Unknown` status. **It is important to evaluate all `Unknown` interfaces that are `Not-Connected` against the BOM to determine if repair action is required.**

### Typical cable validation `NonCompliant` and `Unknown` Issues

|validationType |Status |Error  |Resolution  |
|---------------|-------|-------|------------|
| CableValidation |`NonCompliant`|`Device cable connection is incorrect.` | Verify connections on the source and destination interfaces match the BOM. The `deviceConfiguration` can help identify the destination port date returned on the interface. |
| CableValidation |`Unknown`     |`Unable to fetch data from the device.` | Verify connections on the source and destination interfaces are connected and match the BOM |
| CableValidation |`NonCompliant`|`Device cabling in <INTERFACE> incorrect.` | The interface isn't connected. Verify connections on the source and destination interfaces are connected  match the BOM. |
| CableValidation  |`Unknown`     |`Port <INTERFACE> has no connections as per device response.` | Verify connections on the source and destination interfaces are connected and match the BOM. |
| CableSpecificationValidation  |`Unknown`     |`Unable to fetch Interface Status for <INTERFACE>.` | Verify connections on the source and destination interfaces are connected and match the BOM. |
| CableSpecificationValidation  |`NonCompliant`     |`Device cable connection is incorrect` | Verify interface card and cables match BOM specification in this interface. |

## Converting Cable Validation Report to HTML Format

Refer to [How to Convert Cable Validation report JSON output to HTML](./howto-convert-cable-validation-html.md).
