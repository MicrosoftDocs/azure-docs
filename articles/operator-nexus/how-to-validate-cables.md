---
title: Validate Cables for Nexus Network Fabric
description: Learn how to perform cable validation for Nexus Network Fabric infrastructure management using diagnostic APIs.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 04/04/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---
# Validate Cables for Nexus Network Fabric 

In a rapidly evolving telecommunications environment, the cable validation of the Nexus Network Fabric is crucial for effective infrastructure management. As consumer demand grows, so does the need to expand the infrastructure. When customers begin to establish and oversee multiple Network Fabrics instances, these validations become vital. They enable early detection of issues related to cabling. 

This feature pertains to cable validation, where the primary function of the diagnostic API is to check all fabric devices for potential cabling issues. The Diagnostic API assesses whether the interconnected devices adhere to the Bill of Materials (BOM), classifying them as compliant or non-compliant. The results are presented in a JSON format, encompassing details such as validation status, errors, identifier type, and neighbor device ID. These results are stored in a customer-provided Storage account. 

## Prerequisites

- Provision the Nexus Network Fabric successfully. 
- Provide the storage URL with WRITE access via a support ticket. 

## Validate cabling

1. Open a Microsoft support ticket. The Support engineer makes the necessary update.
1. Execute the following Azure CLI commands:

    ```azurecli
    az networkfabric fabric validate-configuration –resource-group "<NFResourceGroupName>" --resource-name "<NFResourceName>" --validate-action "Cabling"  
    ```
     The following output should appear:
    {}

    ```azurecli
    az networkfabric fabric validate-configuration –resource-group "<NFResourceGroupName>" --resource-name "<NFResourceName>" --validate-action "Cabling" --no-wait --debug  
    ```
     The following (truncated) output should appear:

    url":"https://XXXXXXXXX.blob.core.windows.net/validationresultcontainer/XXXXXX-nf_ValidateAction_XXXX-XX-XX_10-27-12-AM.json?skoid=bd48ad0e-970d-4324-8f73-9f607aeeeaa4&sktid=72f988bf-86f1-41af-91ab-2d7cd011db47&skt=2023-09-29T10%3A27%3A12Z&ske=2023-09-29T11%3A27%3A12Z&sks=b&skv=2021-10-04&sv=2021-10-04&st=2023-09-29T10%3A27%3A12Z&se=2023-09-29T11%3A27%3A12Z&sr=c&sp=r&sig=ihzrbwuOHzQIlcJnJR3MEUXlsawifkqlB9MuwLAJx9A%3D"}} 

3. You can programmatically check the status of the operation by running the following command:
    ```azurecli
    az rest -m get -u "<Azure-operationsstatus-endpoint url>" 
    ```
    The operation status indicates if the API succeeded or failed, and appears similar to the following output: 

    https://management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx 

> [!NOTE]
> The operation takes roughly 20~40 minutes to complete based on the number of racks.  

4. Download and read the validated results from the storage URL.

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


### Customer Edge to Top of the Rack switch validation


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


> [!NOTE]
> Top of the Rack (TOR) switch to compute sample is not currently supported.

#### Statuses of validation

|Status Type  |Definition  |
|---------|---------|
|Compliant     | When the status is compliant with the BOM specification         |
|Non-Compliant     | When the status isn't compliant with the BOM specification         |
|Unknown     | When the status is unknown         |

#### Validation attributes

|Attribute  |Definition  |
|---------|---------|
|`deviceConfiguration`      | Configuration that's available on the device.           |
|`error`      |  Error from the device        |
|`reason`      |  This field is populated when the status of the device is unknown.        |
|`validationType`      | This parameter indicates what type of validation. (cable & cable specification validations)         |
|`deviceDestinationResourceId`      |  Azure Resource Manager ID of the connected Neighbor (destination device)        |
|`roleName`      |  The role of the Network Fabric Device (CE or TOR)        |


## Known issues and limitations in cable validation

- Post Validation Connections between TORs and Compute Servers isn't supported. 
- Cable Validation for NPB isn't supported because there's no support for "show lldp neighbors" from Arista.  
- The Storage URL must be in a different region from the Network Fabric. For instance, if the Fabric is hosted in East US, the storage URL should be outside of East US. 

## Generate the storage URL

Refer to [Create a container](../storage/blobs/blob-containers-portal.md#create-a-container) to create a container.  

> [!NOTE]
> Enter the name of the container using only lowercase letters.

Refer to [Generate a shared access signature](../storage/blobs/blob-containers-portal.md#generate-a-shared-access-signature) to create the SAS URL of the container. Provide Write permission for SAS.

> [!NOTE]
> ESAS URLs are short lived. By default, it is set to expire in eight hours. If the SAS URL expires, then the fabric must be re-patched. 
