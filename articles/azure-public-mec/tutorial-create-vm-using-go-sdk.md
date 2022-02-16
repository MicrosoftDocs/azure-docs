# Tutorial: Deploy resources in an Azure public MEC using the Go SDK

This document will focus on using the Golang SDK to deploy resources in an Azure public MEC. The document will provide code snippets in Go to deploy a Virtual Machine and Public IP resource in an Azure public MEC. You can use the same model and template to deploy other resources and services that are supported for Azure public MEC.

## Prerequisites

This document isn’t a tutorial in Go and only focuses on the additional API calls required to deploy resources in an Azure public MEC. You need the following before you get started:

- An Azure account with an active subscription, which allows you to deploy resources in an Azure public MEC. If you don’t have an active whitelisted subscription, please contact [Azure public MEC product team](add-link) to help with it.
- [Install Go](https://golang.org/doc/install)
- [Install the Azure SDK for Go | Microsoft Docs](https://docs.microsoft.com/en-us/azure/developer/go/azure-sdk-install)

>[!NOTE]
> If you haven’t used Go before, please review the [Azure for Go developers | Microsoft Docs](https://docs.microsoft.com/en-us/azure/developer/go/) page which has multiple resources to get you started.  

## Creating a Virtual Machine  

- Add the latest compute SDK to your import list.

```go
import ( 
  "github.com/Azure/azure-sdk-for-go/services/compute/mgmt/2021-03-01/compute" 
) 
```

- Following is the sample of how to use the latest SDK.  The “ExtendedLocation” attribute needs to be added to the Virtual Machine API call.

```go
VmClient := compute.NewVirtualMachinesClient(<subscription_id>) 

    vmResult, err := vmClient.CreateOrUpdate( 
        context.Background(), 
        "<resourceGroupName>", 
        "<vmName>", 
        compute.VirtualMachine{ 
            Location: to.StringPtr("westus"), 
            ExtendedLocation: &compute.ExtendedLocation{ 
                Name: to.StringPtr("<edgezoneid>"), 
                Type: "EdgeZone", 
            }, 
            VirtualMachineProperties: &compute.VirtualMachineProperties{ 
                StorageProfile: &compute.StorageProfile{ 
                    ImageReference: &compute.ImageReference{ 
                        Publisher: to.StringPtr("<PublisherName>"),
                        Offer:     to.StringPtr("<Offer>"), 
                        Sku:       to.StringPtr("<SKU>"), 
                        Version:   to.StringPtr("<version>"), 
                    },
                },
                HardwareProfile: &compute.HardwareProfile{ 
                    VMSize: "Standard_D2s_v3", 
                }, 
                OsProfile: &compute.OSProfile{ 
                    ComputerName:  to.StringPtr("<vmname>"), 
                    AdminUsername: to.StringPtr("<username>"),
                    AdminPassword: to.StringPtr("password"), 
                },
                NetworkProfile: &compute.NetworkProfile{ 
                    NetworkInterfaces: &[]compute.NetworkInterfaceReference{ 
                        { 
                            ID: nic.ID, 
                            NetworkInterfaceReferenceProperties: &compute.NetworkInterfaceReferenceProperties{ 
                                Primary: to.BoolPtr(true), 
                            }, 
                        }, 
                    }, 
                }, 
            }, 
        }, 
    ) 
```

## Creating a Public IP Address

- Add the latest network SDK to your import list

```go
import ( 
  "github.com/Azure/azure-sdk-for-go/services/network/mgmt/2020-07-01/network" 
) 
```

- Azure public MEC only supports the Standard SKU of Public IPs with Static Allocation.

```go
ipClient := network.NewPublicIPAddressesClient("<subsciption_id>") 
    PublicIPResult, err := ipClient.CreateOrUpdate( 
        context.Background(), 
        "resourceGroupName", 
        "publicIpName", 
        network.PublicIPAddress{ 
            Name:     to.StringPtr("publicVMIP"), 
            Location: to.StringPtr("westus"), 
            ExtendedLocation: &network.ExtendedLocation{ 
                Name: to.StringPtr("microsoftlosangeles1"), 
                Type: to.StringPtr("EdgeZone"), 
            }, 
            Sku: &network.PublicIPAddressSku{ 
                  Name:network.PublicIPAddressSkuName( 
                         network.PublicIPAddressSkuNameStandard), 
            }, 
            PublicIPAddressPropertiesFormat:  
                &network.PublicIPAddressPropertiesFormat{ 
                   PublicIPAllocationMethod: network.Static, 
            }, 
        }) 
```

## References

[Azure for Go developers](https://docs.microsoft.com/en-us/azure/developer/go/)

[Azure-Samples/azure-sdk-for-go-samples](https://github.com/azure-samples/azure-sdk-for-go-samples)

## Appendix

Here is a sample go file that helps you deploy a Virtual Network and Public IP address in an Azure Public MEC.  

Note: Populate the *edgezoneid* field with a valid value. You can find more information about Azure public MEC [here](add-link).

```go
package main

import (
 "context"
 "fmt"

 "github.com/Azure/azure-sdk-for-go/sdk/to"
 "github.com/Azure/azure-sdk-for-go/services/compute/mgmt/2021-03-01/compute"
 "github.com/Azure/azure-sdk-for-go/services/network/mgmt/2020-07-01/network"

 "github.com/Azure/go-autorest/autorest/azure/auth"
)

func main() {
 // create a VirtualNetworks client
 vnetClient := network.NewVirtualNetworksClient("<subscriptionId")
 ipClient := network.NewPublicIPAddressesClient("<subscriptionId")
 // create an authorizer from env vars or Azure Managed Service Identity
 authorizer, err := auth.NewAuthorizerFromCLI()
 if err == nil {
  vnetClient.Authorizer = authorizer
  ipClient.Authorizer = authorizer
 } else {
  fmt.Printf("Authorizer error %v", err)
 }
 vnetResult, err := vnetClient.CreateOrUpdate(context.Background(),
  "<resourcegroupName>",
  "<vnetName>",
  network.VirtualNetwork{
   Location: to.StringPtr("<location>"),
   ExtendedLocation: &network.ExtendedLocation{
    Name: to.StringPtr("<edgezoneid>"),
    Type: to.StringPtr("EdgeZone"),
   },
   VirtualNetworkPropertiesFormat: &network.VirtualNetworkPropertiesFormat{
    AddressSpace: &network.AddressSpace{
     AddressPrefixes: &[]string{"10.0.0.0/8"},
    },

    Subnets: &[]network.Subnet{
     {
      Name: to.StringPtr("subnet1"),
      SubnetPropertiesFormat: &network.SubnetPropertiesFormat{
       AddressPrefix: to.StringPtr("10.0.0.0/16"),
      },
     },
     {
      Name: to.StringPtr("subnet2"),
      SubnetPropertiesFormat: &network.SubnetPropertiesFormat{
       AddressPrefix: to.StringPtr("10.1.0.0/16"),
      },
     },
    },
   },
  })

 if err != nil {
  fmt.Printf("VNet creation failed %v", err)
 }
 err = vnetResult.WaitForCompletionRef(context.Background(), vnetClient.Client)
 if err != nil {
  fmt.Printf("cannot get the vm create or update future response: %v", err)
 }

 pip, err := ipClient.CreateOrUpdate(
  context.Background(),
  "<resourcegroupName>",
  "<vnetName>",
  network.PublicIPAddress{
   Name:     to.StringPtr("publicVMIP"),
   Location: to.StringPtr("<location>"),
   ExtendedLocation: &network.ExtendedLocation{
    Name: to.StringPtr("<edgezoneid>"),
    Type: to.StringPtr("EdgeZone"),
   },
   Sku: &network.PublicIPAddressSku{
    Name: network.PublicIPAddressSkuName(network.PublicIPAddressSkuNameStandard),
   },
   PublicIPAddressPropertiesFormat: &network.PublicIPAddressPropertiesFormat{
    PublicIPAllocationMethod: network.Static,
   },
  },
 )

 if err != nil {
  fmt.Printf("Public IP creation failed %v", err)
 }
 err = pip.WaitForCompletionRef(context.Background(), ipClient.Client) 
    if err != nil { 
        fmt.Printf("Cannot create Public IP: %v", err) 
    } 
}
```