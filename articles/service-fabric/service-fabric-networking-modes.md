---
title: Configure networking modes for container services 
description: Learn how to set up the different networking modes that are supported by Azure Service Fabric. 
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Service Fabric container networking modes

An Azure Service Fabric cluster for container services uses **nat** networking mode by default. When more than one container service is listening on the same port and nat mode is being used, deployment errors can occur. To support multiple container services listening on the same port, Service Fabric offers **Open** networking mode (versions 5.7 and later). In Open mode, each container service has an internal, dynamically assigned IP address that supports multiple services listening on the same port.  

If you have one container service with a static endpoint in your service manifest, you can create and delete new services by using Open mode without deployment errors. The same docker-compose.yml file can also be used with static port mappings to create multiple services.

When a container service restarts or moves to another node in the cluster, the IP address changes. For this reason, we don't recommend using the dynamically assigned IP address to discover container services. Only the Service Fabric Naming Service or the DNS Service should be used for service discovery. 

>[!WARNING]
>Azure allows a total of 65,356 IPs per virtual network. The sum of the number of nodes and the number of container service instances (that are using Open mode) can't exceed 65,356 IPs within a virtual network. For high-density scenarios, we recommend nat networking mode. In addition, other dependencies such as the load balancer will have other [limitations](../azure-resource-manager/management/azure-subscription-service-limits.md) to consider. Currently up to 50 IPs per node have been tested and proven stable. 
>

## Set up Open networking mode

1. Set up the Azure Resource Manager template. In the **fabricSettings** section of the Cluster resource, enable the DNS Service and the IP Provider: 

    ```json
    "fabricSettings": [
                {
                    "name": "DnsService",
                    "parameters": [
                       {
                            "name": "IsEnabled",
                            "value": "true"
                      }
                    ]
                },
                {
                    "name": "Hosting",
                    "parameters": [
                      { 
                            "name": "IPProviderEnabled",
                            "value": "true"
                      }
                    ]
                },
                {
                    "name": "Setup",
                    "parameters": [
                    {
                            "name": "ContainerNetworkSetup",
                            "value": "true"
                    }
                    ]
                }
            ],
    ```
    
2. Set up the network profile section of the Virtual Machine Scale Set resource. This allows multiple IP addresses to be configured on each node of the cluster. The following example sets up five IP addresses per node for a Windows/Linux Service Fabric cluster. You can have five service instances listening on the port on each node. To have the five IPs be accessible from the Azure Load Balancer, enroll the five IPs in the Azure Load Balancer Backend Address Pool as shown below.  You will also need to add the variables to the top of your template in the variables section.

    Add this section to Variables:

    ```json
    "variables": {
        "nicName": "NIC",
        "vmName": "vm",
        "virtualNetworkName": "VNet",
        "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',variables('virtualNetworkName'))]",
        "vmNodeType0Name": "[toLower(concat('NT1', variables('vmName')))]",
        "subnet0Name": "Subnet-0",
        "subnet0Prefix": "10.0.0.0/24",
        "subnet0Ref": "[concat(variables('vnetID'),'/subnets/',variables('subnet0Name'))]",
        "lbID0": "[resourceId('Microsoft.Network/loadBalancers',concat('LB','-', parameters('clusterName'),'-',variables('vmNodeType0Name')))]",
        "lbIPConfig0": "[concat(variables('lbID0'),'/frontendIPConfigurations/LoadBalancerIPConfig')]",
        "lbPoolID0": "[concat(variables('lbID0'),'/backendAddressPools/LoadBalancerBEAddressPool')]",
        "lbProbeID0": "[concat(variables('lbID0'),'/probes/FabricGatewayProbe')]",
        "lbHttpProbeID0": "[concat(variables('lbID0'),'/probes/FabricHttpGatewayProbe')]",
        "lbNatPoolID0": "[concat(variables('lbID0'),'/inboundNatPools/LoadBalancerBEAddressNatPool')]"
    }
    ```
    
    Add this section to the Virtual Machine Scale Set resource:

    ```json   
    "networkProfile": {
                "networkInterfaceConfigurations": [
                  {
                    "name": "[concat(parameters('nicName'), '-0')]",
                    "properties": {
                      "ipConfigurations": [
                        {
                          "name": "[concat(parameters('nicName'),'-',0)]",
                          "properties": {
                            "primary": "true",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "loadBalancerInboundNatPools": [
                              {
                                "id": "[variables('lbNatPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        },
                        {
                          "name": "[concat(parameters('nicName'),'-', 1)]",
                          "properties": {
                            "primary": "false",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        },
                        {
                          "name": "[concat(parameters('nicName'),'-', 2)]",
                          "properties": {
                            "primary": "false",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        },
                        {
                          "name": "[concat(parameters('nicName'),'-', 3)]",
                          "properties": {
                            "primary": "false",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        },
                        {
                          "name": "[concat(parameters('nicName'),'-', 4)]",
                          "properties": {
                            "primary": "false",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        },
                        {
                          "name": "[concat(parameters('nicName'),'-', 5)]",
                          "properties": {
                            "primary": "false",
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[variables('lbPoolID0')]"
                              }
                            ],
                            "subnet": {
                              "id": "[variables('subnet0Ref')]"
                            }
                          }
                        }
                      ],
                      "primary": true
                    }
                  }
                ]
              }
   ```
 
3. For Windows clusters only, set up an Azure Network Security Group (NSG) rule that opens up port UDP/53 for the virtual network with the following values:

   |Setting |Value |
   | --- | --- |
   |Priority |2000 |
   |Name |Custom_Dns  |
   |Source |VirtualNetwork |
   |Destination | VirtualNetwork |
   |Service | DNS (UDP/53) |
   |Action | Allow  |

4. Specify the networking mode in the application manifest for each service: `<NetworkConfig NetworkType="Open">`. **Open** networking mode results in the service getting a dedicated IP address. If a mode isn't specified, the service defaults to **nat** mode. In the following manifest example, the `NodeContainerServicePackage1` and `NodeContainerServicePackage2` services can each listen on the same port (both services are listening on `Endpoint1`). When Open networking mode is specified, `PortBinding` configurations cannot be specified.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <ApplicationManifest ApplicationTypeName="NodeJsApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
      <Description>Calculator Application</Description>
      <Parameters>
        <Parameter Name="ServiceInstanceCount" DefaultValue="3"></Parameter>
        <Parameter Name="MyCpuShares" DefaultValue="3"></Parameter>
      </Parameters>
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="NodeContainerServicePackage1" ServiceManifestVersion="1.0"/>
        <Policies>
          <ContainerHostPolicies CodePackageRef="NodeContainerService1.Code" Isolation="hyperv">
           <NetworkConfig NetworkType="Open"/>
          </ContainerHostPolicies>
        </Policies>
      </ServiceManifestImport>
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="NodeContainerServicePackage2" ServiceManifestVersion="1.0"/>
        <Policies>
          <ContainerHostPolicies CodePackageRef="NodeContainerService2.Code" Isolation="default">
            <NetworkConfig NetworkType="Open"/>
          </ContainerHostPolicies>
        </Policies>
      </ServiceManifestImport>
    </ApplicationManifest>
    ```

    You can mix and match different networking modes across services within an application for a Windows cluster. Some services can use Open mode while others use nat mode. When a service is configured to use nat mode, the port that the service is listening on must be unique.

    >[!NOTE]
    >On Linux clusters, mixing networking modes for different services is not supported. 
    >

5. When the **Open** mode is selected, the **Endpoint** definition in the service manifest should explicitly point to the code package corresponding to the endpoint, even if the service package has only one code package in it. 
   
   ```xml
   <Resources>
     <Endpoints>
       <Endpoint Name="ServiceEndpoint" Protocol="http" Port="80" CodePackageRef="Code"/>
     </Endpoints>
   </Resources>
   ```
   
6. For Windows, a VM reboot will cause the open network to be recreated. This is to mitigate an underlying issue in the networking stack. The default behavior is to recreate the network. If this behavior needs to be turned off, the following configuration can be used followed by a config upgrade.

```json
"fabricSettings": [
                {
                    "name": "Setup",
                    "parameters": [
                    {
                            "name": "SkipContainerNetworkResetOnReboot",
                            "value": "true"
                    }
                    ]
                }
            ],          
 ``` 
 
## Next steps
* [Understand the Service Fabric application model](service-fabric-application-model.md)
* [Learn more about the Service Fabric service manifest resources](./service-fabric-service-manifest-resources.md)
* [Deploy a Windows container to Service Fabric on Windows Server 2016](service-fabric-get-started-containers.md)
* [Deploy a Docker container to Service Fabric on Linux](service-fabric-get-started-containers-linux.md)
